# 🚨 Troubleshooting

## Documentation

- **Docker Permissions**: If you encounter permission issues, ensure Docker has access to the project folder.
- **Environment Variables**: Double-check that the correct environment variables are set (e.g., `BASE_URL`).
- **Script Errors**: If a script fails, check the error message and ensure all dependencies are correctly set up.

### **Troubleshooting: Accessing Local API from Docker Container**

If you encounter issues where your Docker container cannot access an API running on your local machine (e.g., `http://localhost:8087`), it is because `localhost` inside the container refers to the container itself, not the host machine. Below are several solutions to resolve this issue:

This occurs when we have:

```bash
# container1 via docker-compose
# container2 via docker run
 container1:[app(dailytrends-api)]:8087 <----> container2:[k6]:8087
```

🚨 **Remember that this scenario is for development only**, for k6 to be of use with correct results. k6 must attack the deployed app in pre-production environments.

#### **Solution 1: Use `host.docker.internal` (Recommended for Docker Desktop)**

On Docker Desktop for macOS and Windows, use the special DNS name `host.docker.internal` to refer to the host machine from inside the container. Update your `docker run` command as follows:

```bash
docker run -i --rm -v $(pwd)/load-tests:/app -e TARGET_HOST=http://host.docker.internal:8087 -e VUS=1 -e ITERATIONS=1 grafana/k6:latest run /app/k6/load_test_feeds_performance.js
```

On **Linux**:

To make `host.docker.internal` work inside containers on Linux, pass the custom mapping when you run the container. This tells Docker that  `Inside this container, map host.docker.internal to 172.17.0.1.`

```bash
docker run -i --rm --add-host=host.docker.internal:172.17.0.1  -v $(pwd)/load-tests:/app -e TARGET_HOST=http://host.docker.internal:8087 -e VUS=1 -e ITERATIONS=1 grafana/k6:latest run /app/k6/load_test_e2e_api.js

# To test it
docker run --rm --add-host=host.docker.internal:172.17.0.1 alpine wget -qO- http://host.docker.internal:8087
``

---

#### **Solution 2: Use the Host's IP Address**

If `host.docker.internal` is unavailable, use your host machine's IP address instead of `localhost`:

1. Find your host machine's IP address:
   - On macOS/Linux: Run `ifconfig` or `ip addr show`.
   - On Windows: Run `ipconfig`.

2. Replace `localhost` with the host's IP address in your `docker run` command:

```bash
docker run -i --rm -v $(pwd)/load-tests:/app -e TARGET_HOST=http://192.168.1.100:8087 -e VUS=1 -e ITERATIONS=1 grafana/k6:latest run /app/k6/api_test.js
```

Replace `192.168.1.100` with your actual host IP address.

---

#### **Solution 3: Run the API in a Docker Container**

If your API is also containerized, connect the two containers using Docker networking:

1. Create a Docker network:

   ```bash
   docker network create my-network
   ```

2. Run your API container in the network:

   ```bash
   docker run -d --name my-api --network my-network -p 8087:8087 my-api-image
   ```

3. Run the K6 container in the same network:

   ```bash
   docker run -i --rm -v $(pwd)/load-tests:/app --network my-network -e TARGET_HOST=http://my-api:8087 -e VUS=1 -e ITERATIONS=1 grafana/k6:latest run /app/k6/api_test.js
   ```

Here, `my-api` is the hostname of the API container within the Docker network.

#### **Solution 4: Use Docker Compose**

For a more streamlined setup, use Docker Compose to define both the API and K6 services in a `docker-compose.yml` file:

```yaml
version: '3'
services:
  api:
    image: my-api-image
    ports:
      - "8087:8087"
    networks:
      - my-network

  k6:
    image: grafana/k6:latest
    volumes:
      - ./load-tests:/app
    environment:
      - TARGET_HOST=http://api:8087
      - VUS=1
      - ITERATIONS=1
    command: run /app/k6/api_test.js
    depends_on:
      - api
    networks:
      - my-network

networks:
  my-network:
    driver: bridge
```

Run the setup with:

```bash
docker-compose up
```
