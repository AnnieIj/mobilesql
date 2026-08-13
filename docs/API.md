# MobileSQL REST API Specification (v1)

Base URL: `/api/v1`

---

## 1. Authentication Endpoints

### `POST /auth/register`
Creates a new user account.
* **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "name": "Jane Doe",
    "username": "janedoe"
  }
  ```
* **Response (201):**
  ```json
  {
    "success": true,
    "user": { "id": "usr_...", "email": "...", "name": "...", "role": "STUDENT" },
    "accessToken": "ey...",
    "refreshToken": "..."
  }
  ```

### `POST /auth/login`
Authenticates an existing user.
* **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
* **Response (200):**
  ```json
  {
    "success": true,
    "user": { ... },
    "accessToken": "ey...",
    "refreshToken": "..."
  }
  ```

---

## 2. Academy & Learning Endpoints

### `GET /academy/tracks`
Returns all published academy learning tracks, modules, and lessons.
* **Response (200):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "track_fundamentals",
        "title": "SQL Fundamentals",
        "modules": [ ... ]
      }
    ]
  }
  ```

### `POST /academy/progress`
Records lesson completion, submitted SQL query, and awards XP.
* **Headers:** `Authorization: Bearer <token>`
* **Request Body:**
  ```json
  {
    "lessonId": "lesson_select_01",
    "submittedCode": "SELECT * FROM users;",
    "timeSpentSeconds": 120
  }
  ```

---

## 3. SQL Playground Endpoints

### `POST /playground/execute`
Executes a SQL query in the isolated sandbox environment.
* **Request Body:**
  ```json
  {
    "sql": "SELECT id, name, price FROM products WHERE price > 50;",
    "databaseId": "ecommerce",
    "dialect": "postgresql"
  }
  ```
* **Response (200):**
  ```json
  {
    "success": true,
    "rows": [ ... ],
    "columns": ["id", "name", "price"],
    "rowCount": 14,
    "executionTimeMs": 4.2
  }
  ```

---

## 4. Daily Challenges & Leaderboard

### `GET /challenges`
Returns available daily and practice challenges.

### `POST /challenges/:id/submit`
Validates a challenge attempt against assertion test cases.
* **Request Body:**
  ```json
  {
    "submittedQuery": "SELECT department, AVG(salary) FROM employees GROUP BY department;"
  }
  ```
* **Response (200):**
  ```json
  {
    "success": true,
    "passed": true,
    "xpEarned": 150,
    "executionTimeMs": 8.5
  }
  ```

---

## 5. AI Copilot Endpoints

### `POST /api/copilot/explain`
Generates an AI-assisted explanation and query execution breakdown using Gemini 2.5.

### `POST /api/copilot/generate`
Translates natural language prompts into executable SQL.
