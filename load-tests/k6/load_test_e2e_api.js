import http from 'k6/http';
import { check, sleep, group } from 'k6';

// Configuration
const HOST = __ENV.TARGET_HOST || 'http://localhost:8087';

// Test options
export let options = (() => {
    // If ITERATIONS is declared, use iterations mode
    if (__ENV.ITERATIONS) {
        return {
            vus: __ENV.VUS ? parseInt(__ENV.VUS) : 1, 
            iterations: parseInt(__ENV.ITERATIONS) || 10, 
            thresholds: {
                http_req_duration: ['p(95)<1000'], // 95% of requests should be below 1000ms
                http_req_failed: ['rate<0.01'], // Less than 1% of requests should fail
            },
        };
    }
    // Otherwise, use stages mode
    return {
        stages: [
            { duration: '1m', target: 50 }, // Ramp-up to 50 users over 1 minute
            { duration: '5m', target: 50 }, // Stay at 50 users for 5 minutes
            { duration: '2m', target: 100 }, // Ramp-up to 100 users over 2 minutes
            { duration: '5m', target: 100 }, // Stay at 100 users for 5 minutes
            { duration: '3m', target: 0 },   // Ramp-down to 0 users over 3 minutes
        ],
        thresholds: {
            http_req_duration: ['p(95)<1000'], // 95% of requests should be below 1000ms
            http_req_failed: ['rate<0.01'],    // Less than 1% of requests should fail
        },
    };
})();


// Default function executed by each VU
export default function () {
    const email = `user_${__VU}_${__ITER}@example.com`;
    const password = 'password123';

    group('User Authentication', function () {
        // Step 1: Attempt to register a new user
        let registerRes = http.post(`${HOST}/api/v1/auth/register`, JSON.stringify({
            email: email,
            password: password,
        }), {
            headers: { 'Content-Type': 'application/json' },
        });

        //console.log('Register Response:', JSON.stringify(registerRes));

        // Check if registration was successful or if the user already exists
        if (registerRes.status === 401 && registerRes.json('message') === 'Email already in use') {
            console.log('User already exists. Skipping registration...');
        } else {
            check(registerRes, {
                'Registration successful': (r) => r.status === 200,
            });
        }

        // Step 2: Login and get the token
        const loginRes = http.post(`${HOST}/api/v1/auth/login`, JSON.stringify({
            email: email,
            password: password,
        }), {
            headers: { 'Content-Type': 'application/json' },
        });

        //console.log('Login Response:', JSON.stringify(loginRes));
        check(loginRes, {
            'Login successful': (r) => r.status === 200,
            'Token received': (r) => r.json('result.token') !== undefined,
        });

        const authToken = loginRes.json('result.token');

        // Step 3: Use the token in subsequent requests
        group('Fetch News', function () {
            const newsRes = http.get(`${HOST}/api/v1/news/scrape?provider=elmundo&limit=5`, {
                headers: { 'Authorization': `Bearer ${authToken}` },
            });

            //console.log('News Response:', JSON.stringify(newsRes));
            check(newsRes, {
                'News fetched successfully': (r) => r.status === 200,
                'News data received': (r) => r.json('success') === true,
            });
        });

        // Step 4: Feed Management
        group('Feed Management', function () {
            // Create a new feed
            const createFeedRes = http.post(`${HOST}/api/v1/news/feeds`, JSON.stringify({
                title: 'War never changes',
                url: 'https://skeptics.stackexchange.com/questions/31022/war-never-changes-fallout-or-ulysses-s-grant',
                type: 'news',
                provider: 'skeptics',
            }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            if (createFeedRes.status === 409 && createFeedRes.json('message') === 'Feed already exists') {
                console.log('Feed already exists. Skipping feed creation...');
            } else {
                //console.log('Create Feed Response:', JSON.stringify(createFeedRes));
                check(createFeedRes, {
                    'Feed created successfully': (r) => r.status === 200,
                    'Feed ID received': (r) => r.json('result._id') !== undefined,
                });

                const feedId = createFeedRes.json('result._id');
                console.log('Feed ID:', feedId);

                // Get the created feed
                const getFeedRes = http.get(`${HOST}/api/v1/news/feeds/${feedId}`, {
                    headers: { 'Authorization': `Bearer ${authToken}` },
                });

                //console.log('Get Feed Response:', JSON.stringify(getFeedRes));
                check(getFeedRes, {
                    'Feed fetched successfully': (r) => r.status === 200,
                    'Feed data received': (r) => r.json('success') === true,
                });

                // Update the feed
                const updateFeedRes = http.put(`${HOST}/api/v1/news/feeds/${feedId}`, JSON.stringify({
                    title: 'War always changes',
                    url: 'https://skeptics.stackexchange.com/questions/31022/war-never-changes-fallout-or-ulysses-s-grant',
                    type: 'news',
                    provider: 'skeptics',
                }), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                });

                //console.log('Update Feed Response:', JSON.stringify(updateFeedRes));
                check(updateFeedRes, {
                    'Feed updated successfully': (r) => r.status === 200,
                });

                // Delete the feed
                const deleteFeedRes = http.del(`${HOST}/api/v1/news/feeds/${feedId}`, null, {
                    headers: { 'Authorization': `Bearer ${authToken}` },
                });

                //console.log('Delete Feed Response:', JSON.stringify(deleteFeedRes));
                check(deleteFeedRes, {
                    'Feed deleted successfully': (r) => r.status === 200,
                });
            }
        });
    });

    sleep(1);
}