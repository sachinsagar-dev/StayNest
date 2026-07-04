# User Authentication using Passport.js

Implemented user authentication using **Passport.js**, **passport-local**, **passport-local-mongoose**, **Express Session**, and **MongoDB**.

## Features

- User Registration (Sign Up)
- User Login
- Password Hashing with Salt
- Session-Based Authentication
- Persistent Login Sessions
- Flash Messages for Success and Error Notifications
- Secure Password Storage (Passwords are never stored in plain text)

---

# Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js
- passport-local
- passport-local-mongoose
- express-session
- connect-flash
- EJS

---

# Authentication Workflow

## 1. User Registration

### Step 1

The user visits the signup page.

```
GET /signup
```

The server renders the signup form.

---

### Step 2

The user enters:

- Username
- Email
- Password

and submits the form.

```
POST /signup
```

---

### Step 3

A new user object is created.

```javascript
const newUser = new User({
    username,
    email
});
```

At this stage, the password is **not** stored in the object.

---

### Step 4

The following method is executed:

```javascript
User.register(newUser, password);
```

Internally, Passport Local Mongoose performs the following tasks:

- Generates a random Salt
- Combines Password + Salt
- Generates a Hash
- Stores:
  - Username
  - Email
  - Salt
  - Hash

The original password is discarded immediately.

---

### Database Structure

```
User
│
├── username
├── email
├── hash
├── salt
└── _id
```

---

## 2. User Login

The user opens:

```
GET /login
```

The login page is rendered.

---

The user submits:

```
POST /login
```

Passport intercepts the request using:

```javascript
passport.authenticate("local")
```

Passport then:

1. Finds the user by username.
2. Retrieves the stored salt and hash.
3. Hashes the entered password using the stored salt.
4. Compares the generated hash with the stored hash.

If both hashes match, authentication succeeds.

Otherwise, login fails and the user is redirected back to the login page.

---

# Session Authentication

After successful authentication:

```
User Login
      │
      ▼
Serialize User
      │
      ▼
Store User ID in Session
      │
      ▼
Browser Receives Session Cookie
```

Only the user's **ID** is stored in the session, not the complete user object.

---

# Subsequent Requests

For every new request:

```
Browser
    │
    ▼
Sends Session Cookie
    │
    ▼
Express Session
    │
    ▼
Passport
    │
    ▼
Deserialize User
    │
    ▼
Retrieve User from MongoDB
    │
    ▼
req.user Available
```

Passport automatically restores the authenticated user and attaches it to `req.user`.

---

# Flash Messages

Flash messages are implemented using **connect-flash**.

Workflow:

```
req.flash()
      │
      ▼
Store Message in Session
      │
      ▼
Redirect
      │
      ▼
Next Request
      │
      ▼
res.locals.success
res.locals.error
      │
      ▼
Display in EJS
      │
      ▼
Automatically Removed
```

---

# Security Features

- Passwords are never stored in plain text.
- Passwords are hashed before being stored.
- Each user receives a unique random salt.
- Session cookies are HTTP Only.
- Authentication is managed by Passport.js.
- User sessions persist until logout or session expiration.

---

# Authentication Lifecycle

```
Server Starts
      │
      ▼
Configure Express Session
      │
      ▼
Initialize Passport
      │
      ▼
Configure Local Strategy
      │
      ▼
User Registers
      │
      ▼
Generate Salt
      │
      ▼
Hash Password
      │
      ▼
Store User in MongoDB
      │
      ▼
User Logs In
      │
      ▼
Verify Credentials
      │
      ▼
Serialize User
      │
      ▼
Store User ID in Session
      │
      ▼
Browser Receives Cookie
      │
      ▼
Every Future Request
      │
      ▼
Deserialize User
      │
      ▼
req.user Available
```

---

# Packages Used

| Package | Purpose |
|----------|---------|
| express-session | Maintains user sessions |
| passport | Authentication middleware |
| passport-local | Username & Password authentication |
| passport-local-mongoose | Password hashing, salting, helper methods |
| connect-flash | Flash messages |
| mongoose | MongoDB Object Modeling |

---

# Key Passport Methods

```javascript
User.register()
```

Registers a new user and securely stores the hashed password.

```javascript
User.authenticate()
```

Verifies user credentials during login.

```javascript
passport.serializeUser()
```

Stores the authenticated user's ID inside the session.

```javascript
passport.deserializeUser()
```

Retrieves the complete user information from the stored session ID and makes it available as `req.user`.

---

