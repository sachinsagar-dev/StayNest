# StayNest — Today's Work Documentation
---

## 1. `middleware.js`

**New function added:** `saveRedirectUrl`

```js
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
```

Purpose: reads the URL that `isLoggedIn` had earlier stashed in `req.session.redirectUrl`, and copies it into `res.locals.redirectUrl` so the login route handler can use it after authentication.

`isLoggedIn` itself is unchanged from before — it still does:

```js
req.session.redirectUrl = req.originalUrl;
```

when an unauthenticated user hits a protected route.

---

## 2. `routes/user.js` — login route

**Evolution across today's edits, in order:**

| Version | Code | Result |
|---|---|---|
| 1 | `res.redirect(req.session.redirectUrl)` | Worked only when redirected from a protected route. Direct `/login` visits → `req.session.redirectUrl` is `undefined` → redirect to an invalid path → page not found. |
| 2 | added `saveRedirectUrl` middleware, then `res.redirect(req.locals.redirectUrl)` | Crashed with `TypeError: Cannot read properties of undefined (reading 'redirectUrl')` — `req.locals` does not exist in Express; only `res.locals` does. |
| 3 (current) | `res.redirect(res.locals.redirectUrl || "/listings")` | Fixed. Reads the correct object and falls back to `/listings` when no redirect URL was saved. |

Current route:

```js
router.post("/login",saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),
async(req,res)=>{
    req.flash("success","welcome to StayNest");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});
```


---

## 3. `app.js` (current state — no earlier version available to diff)

Sets up: Express app, MongoDB connection (`mongoose.connect`), session config (`express-session`), `connect-flash`, Passport (`passport.initialize()`, `passport.session()`, `LocalStrategy` via `User.authenticate()`), serialize/deserialize, a global `res.locals` middleware for `success`/`error`/`currUser`, mounts for `listingRouter`, `reviewRouter`, `userRouter`, a catch-all 404 handler, and a generic error handler rendering `errors.ejs`.



---

## 4. `routes/listing.js` (current state)

Standard CRUD routes for listings, all protected with `isLoggedIn` except index (`GET /`) and show (`GET /:id`):

- `GET /new` → `isLoggedIn`
- `POST /` → `isLoggedIn`, `validateListing`
- `GET /:id/edit` → `isLoggedIn`
- `PUT /:id` → `isLoggedIn`, `validateListing`
- `DELETE /:id` → `isLoggedIn`

`validateListing` runs Joi-style validation (`listingSchema.validate`) and throws an `ExpressError(400, ...)` on failure.


---

## 5. `models/listing.js` (current state)

Adds a `pre("save")` hook that defaults `image.url` to a fixed Unsplash URL if none is provided, and a `post("findOneAndDelete")` hook that cascades deletion of the listing's associated reviews.

---

## 6. Views — `show.ejs` and `navbar.ejs` (current state)

- `show.ejs`: renders listing details, edit/delete buttons, a review submission form (star rating + comment), and lists existing reviews with a delete button per review.
- `navbar.ejs`: conditionally shows Signup/Login links when `currUser` is falsy, and a Logout link when `currUser` is truthy.

---

## 7. Errors encountered today

1. **Page not found after login** (direct `/login` visits) — caused by `res.redirect(req.session.redirectUrl)` receiving `undefined`.
2. **`TypeError: Cannot read properties of undefined (reading 'redirectUrl')`** — caused by reading `req.locals.redirectUrl` instead of `res.locals.redirectUrl` (Express only defines `.locals` on the response object).

Both are resolved in the current `routes/user.js` shown in section 2, version 3.
