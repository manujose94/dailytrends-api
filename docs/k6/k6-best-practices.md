# K6 Performance Testing: Tips, Tricks, and Best Practices

Performance testing with k6 can be both powerful and straightforward when you follow the right approach. Whether you're just getting started or already have experience with k6, this guide will walk you through practical tips and best practices to design, implement, and maintain efficient, scalable, and realistic performance tests. By the end of this page, you'll have all the tools you need to create high-quality performance tests that deliver actionable insights.

---

## Table of Contents

1. [🚀 Recommendations](#-recommendations)
   - 1.1 Centralized Configuration
   - 1.2 Code Modularity
   - 1.3 Using Groups for Better Reporting
   - 1.4 Dynamic Data and Parameterization
   - 1.5 Use Environment Variables
   - 1.6 HTTP Requests with Randomized Variables
   - 1.7 Best Practices for URL Templating
   - 1.8 Running Scripts Locally for Development
   - 1.9 Avoiding Bad Practices in K6
2. [Help to First Steps](#help-to-first-steps)
3. [🛠️ Summary of Good Practices in K6](#-summary-of-good-practices-in-k6)
4. [Final Example: Applying All Best Practices](#final-example-applying-all-best-practices)

---

## 🚀 Recommendations

### 1.1 Centralized Configuration

Define global configurations such as performance thresholds, virtual users (VU), and durations in a single location for easy modification.

```javascript
// ./config/options.js
export const options = {
  stages: [
    { duration: '1m', target: 100 }, // ramp up to 100 VUs
    { duration: '5m', target: 100 }, // stay at 100 VUs for 5 minutes
    { duration: '1m', target: 0 },   // ramp down
  ],
};
```

---

### 1.2 Code Modularity

Separate code into reusable modules for better maintainability.

```javascript
// ./utils/api-requests.js
import http from 'k6/http';

export function getData(url) {
  return http.get(url);
}

export function postData(url, payload) {
  return http.post(url, JSON.stringify(payload), { headers: { 'Content-Type': 'application/json' } });
}
```

---

### 1.3 Using Groups for Better Reporting

Use `group()` to organize test steps and improve result readability.

```javascript
import { group, check } from 'k6';
import { getData, postData } from './utils/api-requests.js';

export default function () {
  const randomUser = faker.helpers.arrayElement(users);

  group('RetrieveData', function () {
    let res = getData(`https://jsonplaceholder.typicode.com/users/${randomUser.id}`);
    check(res, { 'status is 200': (r) => r.status === 200 });
  });

  group('SubmitData', function () {
    let payload = { title: 'foo', body: 'bar', userId: randomUser.id };
    let res = postData(`https://jsonplaceholder.typicode.com/posts`, payload);
    check(res, { 'status is 201': (r) => r.status === 201 });
  });
}
```

---

### 1.4 Dynamic Data and Parameterization

Simulate realistic scenarios by using dynamic test data. Use `faker` to generate random data instead of relying on `Math.random()`.

```javascript
// ./config/users-config.js
import { SharedArray } from 'k6/data';

export const users = new SharedArray('UserData', function () {
  return JSON.parse(open('../data/users.json'));
});
```

**Why?**
- `faker` provides a wide range of utilities for generating realistic data.
- Avoids manual randomization logic like `Math.floor(Math.random() * users.length)`.

---

### 1.5 Use Environment Variables

Use environment variables for sensitive data and configuration settings.

```javascript
// config/env.js
export const BASE_URL = __ENV.BASE_URL || 'https://jsonplaceholder.typicode.com';
export const AUTH_TOKEN = __ENV.AUTH_TOKEN || '';
export const VU_COUNT = __ENV.VU_COUNT || 100;
```

**Why?**
- Avoids hardcoding sensitive values.
- Makes tests reusable across different environments.

---

### 1.6 HTTP Requests with Randomized Variables

Use `http.url` for URL grouping and `xk6-faker` for efficient data generation.

```javascript
import http from 'k6/http';
import { group, check } from 'k6';
import faker from 'k6/x/faker'; // Import xk6-faker

group('RetrieveData', function () {
  const randomDir = faker.number.int({ min: 0, max: 999999 });
  const result = http.get(http.url`${__ENV.BASE_URL}/status/${randomDir}`);

  check(result, {
    'RetrieveData: status code is 200': (r) => r.status === 200,
  });
});
```

**New Recommendation**:
- Use `faker.helpers.arrayElement(array)` to randomly select an element from an array (e.g., `users` in the example below). This avoids manual randomization logic.

---

### 1.7 Best Practices for URL Templating

#### Use `http.url` for URL Templating

```javascript
group('Dynamic URL Example', function () {
  const randomId = faker.number.int({ min: 0, max: 10000 });
  const result = http.get(http.url`${__ENV.BASE_URL}/items/${randomId}`);

  check(result, {
    'status is 200': (r) => r.status === 200,
  });
});
```

#### Avoid String Concatenation for URLs

❌ **Bad Practice**:
```javascript
const randomId = Math.floor(Math.random() * 1000);
const result = http.get(`${__ENV.BASE_URL}/items/${randomId}`);
```

✅ **Good Practice**:
```javascript
const randomId = faker.number.int({ min: 0, max: 10000 });
const result = http.get(http.url`${__ENV.BASE_URL}/items/${randomId}`);
```

---

### 1.8 Running Scripts Locally for Development

Use Docker to run scripts locally:

```bash
docker run --rm --network host -v $(pwd):/code --workdir=/code -i grafana/k6:latest
```

If you require additional extensions to be built into k6 then take a look at the following:  [Build a k6 binary using Docke](https://grafana.com/docs/k6/latest/extensions/build-k6-binary-using-docker/#build-a-k6-binary-using-docker)

---

### 1.9 Avoiding Bad Practices in K6

- **Hardcoding values**: Use configuration files and environment variables instead.
- **Lack of modularization**: Keep reusable functions in separate files.
- **No structured test reporting**: Use `group()` for better readability.
- **Ignoring thresholds**: Define thresholds to maintain performance standards.
- **Not simulating real-world scenarios**: Use dynamic test data instead of static values.
- **Manual randomization**: Use `faker` utilities for generating random data.

---

## Help to First Steps

For testing with realistic endpoints, consider these free/open APIs:

- **JSONPlaceholder**: [https://jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com) - Fake REST API for testing.
- **Swagger Petstore**: [https://petstore.swagger.io](https://petstore.swagger.io) - Sample pet store API.
- **ReqRes**: [https://reqres.in](https://reqres.in) - Demo API with user data.
- **DummyJSON**: [https://dummyjson.com](https://dummyjson.com) - Extensive mock data.

These services require no authentication.

---

## 🛠️ Summary of Good Practices in K6

### Test Design
- Use modular JS files for different test scenarios.
- Keep credentials in separate config files.
- Validate responses using `check()` and `expect()`.

### Performance
- Start with small VU counts (5-10) for debugging.
- Use ramp-up periods to simulate realistic traffic.
- Monitor system resources during tests.

### Development
- Write small tests for first steps.
- Run scripts locally to verify functionality.

---

## Final Example: Applying All Best Practices

Below is a complete example that incorporates all the best practices discussed:

```javascript
// ./config/options.js
export const options = {
  stages: [
    { duration: '1m', target: 100 }, // ramp up to 100 VUs
    { duration: '5m', target: 100 }, // stay at 100 VUs for 5 minutes
    { duration: '1m', target: 0 },   // ramp down
  ],
};

// ./config/env.js
export const BASE_URL = __ENV.BASE_URL || 'https://jsonplaceholder.typicode.com';
export const AUTH_TOKEN = __ENV.AUTH_TOKEN || '';

// ./config/users-config.js
import { SharedArray } from 'k6/data';

export const users = new SharedArray('UserData', function () {
  return JSON.parse(open('../data/users.json'));
});

// ./utils/api-requests.js
import http from 'k6/http';

export function getData(url) {
  return http.get(url);
}

export function postData(url, payload) {
  return http.post(url, JSON.stringify(payload), { headers: { 'Content-Type': 'application/json' } });
}

// ./test-script.js
import { group, check } from 'k6';
import faker from 'k6/x/faker';
import { getData, postData } from './utils/api-requests.js';
import { users } from './config/users-config.js';
import { BASE_URL } from './config/env.js';

export default function () {
  const randomUser = faker.helpers.arrayElement(users); // Select a random user from the array

  group('RetrieveData', function () {
    const res = getData(http.url`${BASE_URL}/users/${randomUser.id}`);
    check(res, { 'status is 200': (r) => r.status === 200 });
  });

  group('SubmitData', function () {
    const payload = { title: 'foo', body: 'bar', userId: randomUser.id };
    const res = postData(http.url`${BASE_URL}/posts`, payload);
    check(res, { 'status is 201': (r) => r.status === 201 });
  });
}
```
This example demonstrates centralized configuration, modularity, dynamic data usage, environment variables, URL templating, and structured reporting—all key best practices for k6 performance testing.
