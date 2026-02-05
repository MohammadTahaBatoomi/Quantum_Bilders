# Backend Version 1 (v1)

This documentation is for **Version 1 of the Backend**. This version is **fully stable** and ready for usage and future development.

---

## 1️⃣ Project Structure

```
src/v1/
├─ server.js          # Main server for v1
├─ db.js              # Internal JSON-based database for v1
├─ block/             # Block Feature
│  ├─ block.controller.js
│  ├─ block.service.js
│  ├─ block.repository.js
│  └─ block.validator.js
├─ setting/           # Setting Feature
├─ theme/             # Theme Feature
├─ seo/               # SEO Feature
├─ health/            # health Feature
└─ docs/              # Documentation and Swagger
```

* **server.js**: main entry point, route management
* **db.js**: internal JSON-based database (`db/v1.json`)
* **Feature folders**: each folder contains Controller, Service, Repository, and Validator
* **docs/**: contains Swagger and any API documentation

---

## 2️⃣ Versioning & Future-proofing

* All endpoints have the `/v1` prefix:

  ```
  /v1/block
  /v1/setting
  /v1/theme
  /v1/seo
  ```
* Future versions (`v2`) can use different frameworks or databases without affecting v1.
* v1 serves as the **stable baseline version**.
* Data can be stored separately for each version:

  ```
  db/v1.json
  db/v2.json
  ```

---

## 3️⃣ Endpoints

### 3.1 Block

* **GET /v1/block** → fetch Block data
* **PUT /v1/block** → create or update Block

  * Example body:

    ```json
    {
      "name": "Block1"
    }
    ```
  * Validation is applied. Invalid data returns a 400 error.

### 3.2 Setting

* **GET /v1/setting** → fetch settings
* **PUT /v1/setting** → update settings

  * Example body:

    ```json
    {
      "themeColor": "red",
      "darkMode": true
    }
    ```

### 3.3 Theme

* **GET /v1/theme** → fetch theme
* **PUT /v1/theme** → update theme

  * Example body:

    ```json
    {
      "name": "dark"
    }
    ```

### 3.4 SEO

* **GET /v1/seo** → fetch SEO information
* **PUT /v1/seo** → update SEO

  * Example body:

    ```json
    {
      "title": "My Site",
      "subTitle": "Welcome"
    }
    ```

---

## 4️⃣ Database

* `db/v1.json` has the following structure:

```json
{
  "datasAll": [],
  "seo": {},
  "block": {},
  "setting": {},
  "theme": {}
}
```

* All changes are saved to this file
* `datasAll` can store user-added or test data

---

## 5️⃣ Testing & Usage

* To run the server:

```bash
cd src/v1
node server.js
```

* You can test endpoints with `curl` or Postman
* Example for Block:

```bash
curl -X PUT http://localhost:4000/v1/block \
-H "Content-Type: application/json" \
-d '{"name":"Block1"}'

curl http://localhost:4000/v1/block
```

* A `test.sh` script in the project root can be used to test all endpoints.

---

## 6️⃣ Professional & Future-proof Notes

1. All features are isolated → easy to upgrade individually
2. Proper versioning → v1 is stable; v2 can have framework, database, or logic changes
3. Swagger documentation can be stored in `docs/swagger.json`
4. Each feature can have its own README for detailed explanation

---

> This documentation is for v1. Any future version should have its own separate and isolated documentation.
