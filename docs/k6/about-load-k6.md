# End-to-End (E2E) and Performance Load Testing with K6

This guide provides detailed instructions for performing end-to-end (E2E) load testing on the API using **K6**. It covers setup, execution, and analysis of load tests, including examples and best practices.

> Recommendation: Read the [K6 Best Practices](k6-best-practices.md) for more advanced usage and optimization.~~~~

---

## Table of Contents

- [End-to-End (E2E) and Performance Load Testing with K6](#end-to-end-e2e-and-performance-load-testing-with-k6)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Key Concepts](#key-concepts)
  - [Benefits of Using K6](#benefits-of-using-k6)
  - [Test Scripts Overview](#test-scripts-overview)
    - [load\_test\_e2e\_api.js](#load_test_e2e_apijs)
      - [Objective](#objective)
      - [Features](#features)
      - [Example Workflow](#example-workflow)
    - [load\_test\_feeds\_performance.js](#load_test_feeds_performancejs)
      - [Objective](#objective-1)
      - [Features](#features-1)
      - [Example Workflow](#example-workflow-1)
  - [Prerequisites](#prerequisites)
  - [Prerequisites](#prerequisites-1)
  - [Running Load Tests](#running-load-tests)
    - [Basic Test](#basic-test)
    - [Advanced Test with Custom Parameters](#advanced-test-with-custom-parameters)
  - [Test Scenarios](#test-scenarios)
    - [User Authentication](#user-authentication)
    - [Feed Management](#feed-management)
  - [Analyzing Results](#analyzing-results)
    - [Metrics](#metrics)
    - [Graphs](#graphs)
  - [Integration with CI/CD](#integration-with-cicd)
  - [Example Output](#example-output)
  - [References](#references)

---

## Introduction

K6 is a modern, developer-centric load testing tool designed for testing the performance and reliability of APIs, microservices, and web applications. It is particularly well-suited for end-to-end (E2E) testing, as it can simulate real-world user workflows, including interactions with APIs, databases, and external services.

This guide explains how to use K6 for both **end-to-end (E2E)** testing and **performance-focused load testing**.

---

## Key Concepts

1. **End-to-End (E2E) Testing**:
   - Simulates real-world user workflows, including registration, login, feed creation, and deletion.
   - Focuses on verifying the correctness of API functionality under realistic conditions.

2. **Performance Load Testing**:
   - Focuses on evaluating the API's performance under high load conditions.
   - Measures response times, error rates, and resource utilization (CPU, memory).

3. **Scripts**:
   - `load_test_e2e_api.js`: Designed for E2E testing, covering all API endpoints in a single workflow.
   - `load_test_feeds_performance.js`: Focused on performance testing, specifically targeting feed-related operations under heavy load.

## Benefits of Using K6

1. **High Performance and Scalability**:
   - Built with Go, K6 can simulate thousands of virtual users (VUs) with minimal resource consumption.
   - Ideal for stress testing APIs under heavy traffic conditions.

2. **Developer-Friendly**:
   - Scripts are written in JavaScript, making them easy to create, maintain, and extend.
   - Seamless integration with CI/CD pipelines.

3. **Real-Time Metrics and Insights**:
   - Provides real-time metrics such as response times, request rates, and error rates.
   - Supports custom metrics and thresholds for performance goals.

4. **Flexible Load Testing Scenarios**:
   - **Smoke Testing**: Verify basic functionality under minimal load.
   - **Load Testing**: Assess performance under expected traffic.
   - **Stress Testing**: Determine the API's breaking point.
   - **Soak Testing**: Evaluate performance over extended periods.

5. **Integration with CI/CD**:
   - Easily integrates with tools like Jenkins, GitHub Actions, GitLab CI, and CircleCI.
   - Ensures performance regressions are caught early.

6. **Extensible and Customizable**:
   - Supports custom plugins and third-party integrations (e.g., Grafana, Prometheus).

7. **Support for Modern Protocols**:
   - HTTP/1.1, HTTP/2, WebSockets, and gRPC.

---

## Test Scripts Overview

### load_test_e2e_api.js

#### Objective

This script is designed for **end-to-end (E2E)** testing. It simulates a complete user journey, including:

- User registration and login.
- Feed creation, fetching, updating, and deletion.
- News scraping from specific providers.

#### Features

- Verifies API functionality across multiple endpoints.
- Ensures correctness of responses and data integrity.
- Suitable for smoke testing and functional validation.

#### Example Workflow

1. Register a new user.
2. Log in and obtain an authentication token.
3. Create a feed.
4. Fetch news from a provider.
5. Update and delete the feed.

---

### load_test_feeds_performance.js

#### Objective

This script focuses on **performance load testing**, specifically targeting feed-related operations. It evaluates how the API handles high traffic scenarios when creating, fetching, and deleting feeds.

#### Features

- Simulates multiple virtual users (VUs) interacting with the API.
- Measures response times, success rates, and error rates under heavy load.
- Uses a filter-based DELETE endpoint for efficient cleanup after the test.

#### Example Workflow

1. Creates feeds for multiple providers (`ELMUNDO`, `ELPAIS`, `BBC`).
2. Fetches all feeds with a limit.
3. Scrapes news from a random provider.
4. Deletes all created feeds using a filter-based DELETE endpoint.

---

## Prerequisites

1. **Docker**:
   - Install Docker from [here](https://docs.docker.com/get-docker/).
2. **K6**:
   - K6 is included in the Docker image used for testing.
3. **API Server**:
   - Ensure the API server is running. Use the following command to start it:

     ```bash
     docker-compose up
     ```

4. **Test Scripts**:
   - Place your K6 test scripts (`load_test_e2e_api.js` and `load_test_feeds_performance.js`) in the `load-tests` directory.

---

## Prerequisites

1. **Docker**:
   - Install Docker from [here](https://docs.docker.com/get-docker/).

2. **K6**:
   - K6 is included in the Docker image used for testing.

3. **API Server**:
   - Ensure the API server is running. Use the following command to start it:

     ```bash
     docker-compose up
     ```

4. **Test Scripts**:
   - Place your K6 test scripts in the `load-tests` directory.

---

## Running Load Tests

### Basic Test

Run a basic load test with default parameters (1 virtual user and 1 iteration):

```bash
docker run -i --rm -v $(pwd)/load-tests:/app \
  -e TARGET_HOST=http://host.docker.internal:8087 \
  -e VUS=1 -e ITERATIONS=1 \
  grafana/k6:latest run /app/k6/load_test_e2e_api.js
```

For the performance test:

```bash
docker run -i --rm -v $(pwd)/load-tests:/app \
  -e TARGET_HOST=http://host.docker.internal:8087 \
  grafana/k6:latest run /app/k6/load_test_feeds_performance.js
```

### Advanced Test with Custom Parameters

Run a test with 10 virtual users and 50 iterations for the E2E script:

```bash
docker run -i --rm -v $(pwd)/load-tests:/app \
  -e TARGET_HOST=http://host.docker.internal:8087 \
  -e VUS=10 -e ITERATIONS=50 \
  grafana/k6:latest run /app/k6/load_test_e2e_api.js
```

For the performance test, specify custom stages or iterations:

```bash
docker run -i --rm -v $(pwd)/load-tests:/app \
  -e TARGET_HOST=http://host.docker.internal:8087 \
  grafana/k6:latest run /app/k6/load_test_feeds_performance.js
```

---

## Test Scenarios

### User Authentication

1. **Registration**:
   - Register a new user with a unique email and password.
   - Example:

     ```javascript
     const registerRes = http.post(`${HOST}/api/v1/auth/register`, {
       email: `user_${__VU}_${__ITER}@example.com`,
       password: 'password123',
     });
     ```

2. **Login**:
   - Log in with the registered credentials to obtain an authentication token.
   - Example:

     ```javascript
     const loginRes = http.post(`${HOST}/api/v1/auth/login`, {
       email: `user_${__VU}_${__ITER}@example.com`,
       password: 'password123',
     });
     const authToken = loginRes.json('token');
     ```

### Feed Management

1. **Create Feed**:
   - Use the authentication token to create a new feed.
   - Example:

     ```javascript
     const createFeedRes = http.post(`${HOST}/api/v1/news/feeds`, {
       title: 'War never changes',
       url: 'https://skeptics.stackexchange.com/questions/31022/war-never-changes-fallout-or-ulysses-s-grant',
       type: 'news',
       provider: 'skeptics',
     }, {
       headers: {
         'Authorization': `Bearer ${authToken}`,
       },
     });
     ```

2. **Delete Feed**:
   - Delete a feed by ID, provider, or publication date.
   - Example:

     ```javascript
     const deleteFeedRes = http.delete(`${HOST}/feeds`, {
       headers: {
         'Authorization': `Bearer ${authToken}`,
       },
       body: JSON.stringify({
         filter: {
           _id: '6796c365a6a07e4d379ca8e0',
         },
       }),
     });
     ```

---

## Analyzing Results

### Metrics

K6 provides detailed metrics for each test run, including:

- **Checks**: Success rate of assertions.
- **HTTP Requests**: Duration, success rate, and error rate.
- **Iterations**: Number of completed test iterations.
- **Data Sent/Received**: Amount of data transferred.

Example output:

```
checks.........................: 100.00% 10 out of 10
http_req_duration..............: avg=61.99ms  min=5.51ms  med=13.31ms  max=271.83ms
http_req_failed................: 14.28%  1 out of 7
iterations.....................: 1       0.691069/s
```

### Graphs

Use tools like **Grafana** to visualize K6 metrics. Below is an example of a response time graph:

![Response Time Graph](https://k6.io/docs/static/6a8b8b9e9e4b4f4b4f4b4f4b4f4b4f4b.png)

---

## Integration with CI/CD

K6 can be integrated into CI/CD pipelines to automate performance testing. Below is an example for GitHub Actions:

```yaml
name: K6 Load Test
on: [push]
jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      - name: Run K6 test
        uses: grafana/k6-action@v0.2.0
        with:
          filename: load-tests/k6/load_test_e2e_api.js
          envs: |
            HOST=http://localhost:8087
            VUS=10
            ITERATIONS=50
```

---

## Example Output

```bash
 docker run -i --rm -v $(pwd)/load-tests:/app -e TARGET_HOST=http://host.docker.internal:8087 -e VUS=1 -e ITERATIONS=1 grafana/k6:latest run /app/k6/load_test_e2e_api.js

         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 

     execution: local
        script: /app/k6/load_test_e2e_api.js
        output: -

     scenarios: (100.00%) 1 scenario, 1 max VUs, 10m30s max duration (incl. graceful stop):
              * default: 1 iterations shared among 1 VUs (maxDuration: 10m0s, gracefulStop: 30s)

time="2025-01-26T23:12:04Z" level=info msg="Register Response: {\"remote_ip\":\"192.168.65.254\",\"remote_port\":8087,\"url\":\"http://host.docker.internal:8087/api/v1/auth/register\",\"status\":401,\"status_text\":\"401 Unauthorized\",\"proto\":\"HTTP/1.1\",\"headers\":{\"Date\":\"Sun, 26 Jan 2025 23:12:04 GMT\",\"Keep-Alive\":\"timeout=5\",\"Ratelimit\":\"limit=100, remaining=96, reset=138\",\"X-Powered-By\":\"Express\",\"Content-Type\":\"application/json; charset=utf-8\",\"Content-Length\":\"50\",\"Connection\":\"keep-alive\",\"Ratelimit-Policy\":\"100;w=900\",\"Etag\":\"W/\\\"32-6q0JcjJY+ftCIKpxvwIBqkefghY\\\"\"},\"cookies\":{},\"body\":\"{\\\"success\\\":false,\\\"message\\\":\\\"Email already in use\\\"}\",\"timings\":{\"duration\":32.430417,\"blocked\":6.239833,\"looking_up\":0,\"connecting\":2.04675,\"tls_handshaking\":0,\"sending\":0.4295,\"waiting\":31.900833,\"receiving\":0.100084},\"tls_version\":\"\",\"tls_cipher_suite\":\"\",\"ocsp\":{\"produced_at\":0,\"this_update\":0,\"next_update\":0,\"revoked_at\":0,\"revocation_reason\":\"\",\"status\":\"\"},\"error\":\"\",\"error_code\":1401,\"request\":{\"method\":\"POST\",\"url\":\"http://host.docker.internal:8087/api/v1/auth/register\",\"headers\":{\"Content-Type\":[\"application/json\"],\"User-Agent\":[\"k6/0.56.0 (https://k6.io/)\"]},\"body\":\"{\\\"email\\\":\\\"user_1_0@example.com\\\",\\\"password\\\":\\\"password123\\\"}\",\"cookies\":{}}}" source=console
time="2025-01-26T23:12:04Z" level=info msg="User already exists. Skipping registration." source=console

running (00m01.0s), 1/1 VUs, 0 complete and 0 interrupted iterations
default   [   0% ] 1 VUs  00m01.0s/10m0s  0/1 shared iters

     █ User Authentication

       ✓ Login successful
       ✓ Token received

       █ Fetch News

         ✓ News fetched successfully
         ✓ News data received

       █ Feed Management

         ✓ Feed created successfully
         ✓ Feed ID received
         ✓ Feed fetched successfully
         ✓ Feed data received
         ✓ Feed updated successfully
         ✓ Feed deleted successfully

     checks.........................: 100.00% 10 out of 10
     data_received..................: 4.4 kB  3.0 kB/s
     data_sent......................: 2.5 kB  1.8 kB/s
     group_duration.................: avg=253.34ms min=42.22ms med=272.54ms max=445.25ms p(90)=410.71ms p(95)=427.98ms
     http_req_blocked...............: avg=897.55µs min=4.04µs  med=7.75µs   max=6.23ms   p(90)=2.5ms    p(95)=4.37ms  
     http_req_connecting............: avg=292.39µs min=0s      med=0s       max=2.04ms   p(90)=818.7µs  p(95)=1.43ms  
   ✓ http_req_duration..............: avg=61.99ms  min=5.51ms  med=13.31ms  max=271.83ms p(90)=162.89ms p(95)=217.36ms
       { expected_response:true }...: avg=66.92ms  min=5.51ms  med=12.62ms  max=271.83ms p(90)=181.04ms p(95)=226.44ms
   ✗ http_req_failed................: 14.28%  1 out of 7
     http_req_receiving.............: avg=156.02µs min=86.7µs  med=118.04µs max=297.83µs p(90)=254.55µs p(95)=276.19µs
     http_req_sending...............: avg=82.34µs  min=11.04µs med=23.41µs  max=429.5µs  p(90)=197.6µs  p(95)=313.54µs
     http_req_tls_handshaking.......: avg=0s       min=0s      med=0s       max=0s       p(90)=0s       p(95)=0s      
     http_req_waiting...............: avg=61.76ms  min=5.26ms  med=13.16ms  max=271.68ms p(90)=162.75ms p(95)=217.21ms
     http_reqs......................: 7       4.83748/s
     iteration_duration.............: avg=1.44s    min=1.44s   med=1.44s    max=1.44s    p(90)=1.44s    p(95)=1.44s   
     iterations.....................: 1       0.691069/s
     vus............................: 1       min=1        max=1
     vus_max........................: 1       min=1        max=1


running (00m01.4s), 0/1 VUs, 1 complete and 0 interrupted iterations
default ✓ [ 100% ] 1 VUs  00m01.4s/10m0s  1/1 shared iters
time="2025-01-26T23:12:06Z" level=error msg="thresholds on metrics 'http_req_failed' have been crossed"
```

```bash
docker run -i --rm -v $(pwd)/load-tests:/app -e TARGET_HOST=http://host.docker.internal:8087 -e VUS=1 -e ITERATIONS=1 grafana/k6:latest run /app/k6/load_test_e2e_api.js

         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 

     execution: local
        script: /app/k6/load_test_e2e_api.js
        output: -

     scenarios: (100.00%) 1 scenario, 1 max VUs, 10m30s max duration (incl. graceful stop):
              * default: 1 iterations shared among 1 VUs (maxDuration: 10m0s, gracefulStop: 30s)

time="2025-01-26T23:53:10Z" level=info msg="User already exists. Skipping registration..." source=console
time="2025-01-26T23:53:10Z" level=info msg="Feed already exists. Skipping feed creation..." source=console

running (00m01.0s), 1/1 VUs, 0 complete and 0 interrupted iterations
default   [   0% ] 1 VUs  00m01.0s/10m0s  0/1 shared iters

     █ User Authentication

       ✓ Login successful
       ✓ Token received

       █ Fetch News

         ✓ News fetched successfully
         ✓ News data received

       █ Feed Management

     checks.........................: 100.00% 4 out of 4
     data_received..................: 2.8 kB  2.5 kB/s
     data_sent......................: 1.3 kB  1.1 kB/s
     group_duration.................: avg=56.48ms  min=8.02ms  med=12.92ms max=148.5ms  p(90)=121.38ms p(95)=134.94ms
     http_req_blocked...............: avg=686.59µs min=3.58µs  med=5.5µs   max=2.73ms   p(90)=1.91ms   p(95)=2.32ms  
     http_req_connecting............: avg=193.72µs min=0s      med=0s      max=774.91µs p(90)=542.44µs p(95)=658.67µs
   ✓ http_req_duration..............: avg=36.06ms  min=7.84ms  med=22.79ms max=90.82ms  p(90)=73.42ms  p(95)=82.12ms 
       { expected_response:true }...: avg=51.78ms  min=12.74ms med=51.78ms max=90.82ms  p(90)=83.01ms  p(95)=86.92ms 
   ✗ http_req_failed................: 50.00%  2 out of 4
     http_req_receiving.............: avg=117.06µs min=59.33µs med=79.06µs max=250.79µs p(90)=199.55µs p(95)=225.17µs
     http_req_sending...............: avg=66.6µs   min=13.04µs med=15.93µs max=221.5µs  p(90)=159.87µs p(95)=190.68µs
     http_req_tls_handshaking.......: avg=0s       min=0s      med=0s      max=0s       p(90)=0s       p(95)=0s      
     http_req_waiting...............: avg=35.87ms  min=7.75ms  med=22.51ms max=90.72ms  p(90)=73.22ms  p(95)=81.97ms 
     http_reqs......................: 4       3.47942/s
     iteration_duration.............: avg=1.14s    min=1.14s   med=1.14s   max=1.14s    p(90)=1.14s    p(95)=1.14s   
     iterations.....................: 1       0.869855/s
     vus............................: 1       min=1      max=1
     vus_max........................: 1       min=1      max=1


running (00m01.1s), 0/1 VUs, 1 complete and 0 interrupted iterations
default ✓ [ 100% ] 1 VUs  00m01.1s/10m0s  1/1 shared iters
time="2025-01-26T23:53:11Z" level=error msg="thresholds on metrics 'http_req_failed' have been crossed"
```

---

## References

1. [K6 Documentation](https://k6.io/docs/)
2. [Docker Documentation](https://docs.docker.com/)
3. [README.md](./README.md) for project-specific setup and configuration.
