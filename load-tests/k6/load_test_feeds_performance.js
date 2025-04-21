import http from 'k6/http';
import { check, sleep, group } from 'k6';

// Configuration
const HOST = __ENV.TARGET_HOST || 'http://localhost:8087';

// Test options
export let options = {
    stages: [
        { duration: '1m', target: 10 },   // Ramp-up to 20 users over 1 minute
        { duration: '5m', target: 10 },   // Stay at 20 users for 5 minutes
        { duration: '2m', target: 20 },  // Ramp-up to 20 users over 2 minutes
        { duration: '5m', target: 20 },  // Stay at 20 users for 5 minutes
        { duration: '3m', target: 0 },    // Ramp-down to 0 users over 3 minutes
    ],
    thresholds: {
        http_req_duration: ['p(95)<1000'], // 95% of requests should be below 1000ms
        http_req_failed: ['rate<0.01'],    // Less than 1% of requests should fail
    },
};

// Pre-test setup: Register and login a user to get a reusable token
export function setup() {
    return group('Setup: Register and Login', function () {
        const email = 'loadtest_user@example.com';
        const password = 'password123';

        // Step 1: Attempt to register a new user
        const registerRes = http.post(`${HOST}/api/v1/auth/register`, JSON.stringify({
            email: email,
            password: password,
        }), {
            headers: { 'Content-Type': 'application/json' },
        });

        if(registerRes.status === 429){
            console.log('Too many requests. Skipping Load Test...');
            throw new Error('Too many requests due to Limit. Skipping Load Test...');

        }

        if (registerRes.status === 401 && registerRes.json('message') === 'Email already in use') {
            console.log('User already exists. Skipping registration...');
        } else if (registerRes.status !== 200) {
            console.error(`Registration failed. Status: ${registerRes.status}`);
        }

        // Step 2: Login and get the token
        const loginRes = http.post(`${HOST}/api/v1/auth/login`, JSON.stringify({
            email: email,
            password: password,
        }), {
            headers: { 'Content-Type': 'application/json' },
        });

        if (loginRes.status !== 200) {
            throw new Error(`Login failed with status ${loginRes.status}. Cannot continue test.`);
        }

        const authToken = loginRes.json('result.token');
        if (!authToken) {
            throw new Error('Authentication token not found in login response.');
        }

        console.log('Authentication token:', authToken);
        return { authToken };
    });
}

// Default function executed by each VU
export default function ({ authToken }) {
    if (!authToken) {
        throw new Error('Missing authToken. Setup may have failed.');
    }

    const providers = ['ELMUNDO', 'ELPAIS', 'BBC'];

    group('Create Feeds', function () {
        for (const provider of providers) {
            const createFeedRes = http.post(`${HOST}/api/v1/news/feeds`, JSON.stringify({
                title: `Feed from ${provider}`,
                url: `https://${provider.toLowerCase()}.com`,
                type: 'news',
                provider: provider,
            }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (createFeedRes.status === 409 && createFeedRes.json('message') === 'Feed already exists') {
                console.log(`Feed for ${provider} already exists.`);
            } else {
                check(createFeedRes, {
                    'Feed created successfully': (r) => r.status === 200,
                    'Feed ID received': (r) => r.json('result._id') !== undefined,
                });
            }
        }
    });

    group('Fetch All Feeds', function () {
        const fetchFeedsRes = http.get(`${HOST}/api/v1/news/feeds?limit=10`, {
            headers: { 'Authorization': `Bearer ${authToken}` },
        });

        check(fetchFeedsRes, {
            'Feeds fetched successfully': (r) => r.status === 200,
            'Feeds data received': (r) => r.json('success') === true,
        });
    });

    group('Fetch News', function () {
        const provider = providers[Math.floor(Math.random() * providers.length)];
        const fetchNewsRes = http.get(`${HOST}/api/v1/news/scrape?provider=${provider}&limit=5`, {
            headers: { 'Authorization': `Bearer ${authToken}` },
        });

        check(fetchNewsRes, {
            'News fetched successfully': (r) => r.status === 200,
            'News data received': (r) => r.json('success') === true,
        });
    });

    sleep(1); // Add a small delay between iterations
}

// Post-test cleanup: Delete all created feeds using the filter-based DELETE endpoint
export function teardown({ authToken }) {
    group('Teardown: Delete All Feeds by Provider', function () {
        const providers = ['ELMUNDO', 'ELPAIS', 'BBC'];

        for (const provider of providers) {
            const deleteRes = http.del(`${HOST}/api/v1/feeds`, JSON.stringify({
                filter: { provider: provider },
            }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (deleteRes.status === 204) {
                console.log(`Feeds for provider ${provider} deleted successfully.`);
            } else {
                console.error(`Failed to delete feeds for provider ${provider}. Status: ${deleteRes.status}, Response: ${JSON.stringify(deleteRes.body)}`);
            }
        }
    });

    console.log('All feeds have been cleaned up.');
}
