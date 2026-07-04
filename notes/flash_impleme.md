# Flash Message Implementation Flow (Express + connect-flash)

This document explains the complete flow of flash message implementation in my Express.js project.

---

# 1. Configure Session

Flash messages depend on sessions because they are stored temporarily inside the session.

```javascript
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
```

### Why?

- Creates a session for every user.
- Flash messages are stored inside this session.
- Without sessions, flash messages cannot work.

---

# 2. Initialize connect-flash

```javascript
const flash = require("connect-flash");

app.use(flash());
```

This middleware adds two methods to every request object:

```javascript
req.flash(key, message);   // Store a flash message
req.flash(key);            // Retrieve and remove the message
```

---

# 3. Make Flash Messages Available to Every View

```javascript
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
```

### Why do we use `res.locals`?

`res.locals` contains variables that are automatically available in every EJS template.

Instead of writing

```javascript
res.render("index", {
    success: req.flash("success"),
    error: req.flash("error")
});
```

for every route, we write the middleware once and every EJS page gets access to:

```javascript
success
error
```

automatically.

---

# 4. Store a Flash Message

Whenever an important event occurs (Create, Update, Delete, Error), store a flash message.

Example:

```javascript
req.flash("success", "New Listing Created");
```

or

```javascript
req.flash("error", "Listing Doesn't Exist");
```

Some examples from the project:

```javascript
req.flash("success", "New Listing Created");
```

```javascript
req.flash("success", "Edit Successful");
```

```javascript
req.flash("success", "Listing Deleted Successfully");
```

```javascript
req.flash("error", "Listing Doesn't Exist");
```

---

# 5. Redirect the User

Immediately after storing the flash message, redirect the user.

```javascript
req.flash("success", "New Listing Created");

res.redirect("/listings");
```

### Why redirect?

Flash messages are mainly designed to survive **one redirect**.

Instead of rendering the page immediately, we redirect to another route.

---

# 6. Browser Sends a New Request

Example:

```
POST /listings
```

↓

Redirects to

```
GET /listings
```

The browser now sends a completely new request.

---

# 7. Flash Middleware Executes Again

Before the route runs, this middleware executes:

```javascript
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
```

When

```javascript
req.flash("success");
```

is called,

it performs two operations:

1. Reads the message from the session.
2. Removes the message from the session.

Then it stores the message inside

```javascript
res.locals.success
```

---

# 8. Route Renders the View

Example:

```javascript
router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});
```

Notice that we never pass

```javascript
success
```

or

```javascript
error
```

because they already exist inside

```javascript
res.locals
```

---

# 9. EJS Displays the Flash Message

Inside the layout (or any EJS page):

```ejs
<% if(success.length){ %>

<div class="alert alert-success">
    <%= success %>
</div>

<% } %>
```

Similarly,

```ejs
<% if(error.length){ %>

<div class="alert alert-danger">
    <%= error %>
</div>

<% } %>
```

Whenever `success` or `error` contains a message, Bootstrap displays the alert.

---

# 10. Flash Message Automatically Disappears

Since

```javascript
req.flash("success");
```

removes the message after reading it,

the next request has

```javascript
success = []
```

Therefore the message is displayed **only once**.

---

# Complete Lifecycle

```
User submits form
        │
        ▼
Route executes
        │
        ▼
req.flash("success", "Message")
        │
        ▼
Message stored in Session
        │
        ▼
res.redirect(...)
        │
        ▼
Browser sends a NEW request
        │
        ▼
Flash middleware executes
        │
        ▼
req.flash("success")
        │
        ├── Reads the message
        └── Removes it from Session
        │
        ▼
Message stored in res.locals.success
        │
        ▼
Route renders EJS
        │
        ▼
EJS displays the flash message
        │
        ▼
Next request
        │
        ▼
No flash message (already removed)
```

---

# Summary

- `express-session` creates a session for each user.
- `connect-flash` stores temporary messages inside the session.
- `req.flash(key, message)` stores a message.
- `res.redirect()` sends the user to another route.
- On the next request, `req.flash(key)` retrieves **and removes** the message.
- The middleware copies the message into `res.locals`.
- Every EJS page can access `success` and `error` without passing them manually.
- The message is displayed exactly once and disappears automatically.