
# API Testing Guide

This guide provides step-by-step instructions and examples for testing the API using `curl` commands. It covers user registration, login, feed creation, and feed deletion.

---

## Prerequisites

1. **Docker Compose**:
   - Ensure Docker and Docker Compose are installed.
   - Start the API server using:
  
     ```bash
     docker-compose up
     ```

2. **`curl`**:
   - Ensure `curl` is installed on your system. Most Linux/macOS systems have it pre-installed.

3. **`jq` (Optional)**:
   - Install `jq` for parsing JSON responses:
     - **Linux**: `sudo apt install jq`
     - **macOS**: `brew install jq`

---

## 1. Test API Connection

Before making requests, ensure the API server is running and accessible.

```bash
HOST="http://localhost:8087" && \
echo "Testing connection to $HOST..." && \
curl -I "$HOST"
```

### Expected Output

If the server is running, you should see a response like:

```bash
HTTP/1.1 200 OK
...
```

---

## 2. User Registration

Register a new user with a unique email and password.

```bash
HOST="http://localhost:8087" && \
curl -v -X POST "$HOST/api/v1/auth/register" \
-H "Content-Type: application/json" \
-d '{
    "email": "user_1_0@example.com",
    "password": "password123"
}'
```

### Expected Output

If successful, the response will look like:

```json
{
  "message": "User registered successfully",
  "userId": "12345"
}
```

---

## 3. User Login

Log in with the registered user credentials to obtain an authentication token.

```bash
HOST="http://localhost:8087" && \
curl -X POST "$HOST/api/v1/auth/login" \
-H "Content-Type: application/json" \
-d '{
    "email": "user_1_0@example.com",
    "password": "password123"
}'
```

### Expected Output

If successful, the response will include a token:

```json
{
  "success": true,
  "result": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 4. Create a Feed

Use the authentication token to create a new feed.

```bash
HOST="http://localhost:8087" && \
authToken="YOUR_AUTH_TOKEN_HERE" && \
curl -X POST "$HOST/api/v1/news/feeds" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $authToken" \
-d '{
    "title": "War never changes",
    "url": "https://skeptics.stackexchange.com/questions/31022/war-never-changes-fallout-or-ulysses-s-grant",
    "type": "news",
    "provider": "skeptics"
}'
```

### Expected Output

If successful, the response will look like:

```json
{
  "id": "12345",
  "title": "War never changes",
  "url": "https://skeptics.stackexchange.com/questions/31022/war-never-changes-fallout-or-ulysses-s-grant",
  "type": "news",
  "provider": "skeptics",
  "createdAt": "2023-10-01T12:34:56Z"
}
```

---

## 5. Delete Feeds

The API supports flexible deletion of feeds using a `filter` object. Below are examples of deleting feeds by ID, publication date, and provider.

### Delete by ID

```bash
curl -X DELETE http://localhost:8087/feeds \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $authToken" \
-d '{
  "filter": {
    "_id": "6796c365a6a07e4d379ca8e0"
  }
}'
```

### Delete Feeds Older Than a Specific Date

```bash
curl -X DELETE http://localhost:8087/feeds \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $authToken" \
-d '{
  "filter": {
    "publicationDate": {
      "$lt": "2025-01-01T00:00:00.000Z"
    }
  }
}'
```

### Delete Feeds by Provider Name

```bash
curl -X DELETE http://localhost:8087/feeds \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $authToken" \
-d '{
  "filter": {
    "provider": "skeptics"
  }
}'
```

---

## 6. Combined Script for Testing

Here’s a combined script to test user registration, login, and feed creation in one go:

```bash
HOST="http://localhost:8087" && \
email="user_1_0@example.com" && \
password="password123" && \

# Step 1: Register a new user
echo "Registering user..." && \
curl -v -X POST "$HOST/api/v1/auth/register" \
-H "Content-Type: application/json" \
-d '{
    "email": "'"$email"'",
    "password": "'"$password"'"
}' && \

# Step 2: Login and get the token
echo "Logging in..." && \
authToken=$(curl -s -X POST "$HOST/api/v1/auth/login" \
-H "Content-Type: application/json" \
-d '{
    "email": "'"$email"'",
    "password": "'"$password"'"
}' | jq -r '.result.token') && \

# Step 3: Create a feed
echo "Creating feed..." && \
curl -X POST "$HOST/api/v1/news/feeds" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $authToken" \
-d '{
    "title": "War never changes",
    "url": "https://skeptics.stackexchange.com/questions/31022/war-never-changes-fallout-or-ulysses-s-grant",
    "type": "news",
    "provider": "skeptics"
}'
```
