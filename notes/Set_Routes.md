# StayNest

A full-stack Airbnb-style listing and review web app built with Node.js, Express, MongoDB (Mongoose), and EJS.

## Tech Stack
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Templating:** EJS + ejs-mate
- **Validation:** Joi
- **Other:** method-override, custom error handling (`ExpressError`, `wrapAsync`)

## Features
- Create, view, edit, and delete property listings
- Add and delete reviews on individual listings
- Server-side validation for listings and reviews (Joi)
- Custom 404 and centralized error handling middleware
- Image URL support per listing, with a default fallback image

## Debugging Log — Today's Session

This section documents real issues encountered and fixed during development, kept for reference and as a personal debugging record.

### 1. `TypeError: Class constructor ExpressError cannot be invoked without 'new'`
**Cause:** In `routes/review.js`, the imports for `ExpressError` and `wrapAsync` were accidentally swapped:
```js
const ExpressError = require("../utils/wrapAsync.js");
const wrapAsync = require("../utils/ExpressError.js");
```
This caused the `ExpressError` class to be assigned to the `wrapAsync` variable name and called as a function instead of instantiated with `new`.

**Fix:** Corrected the import bindings so each variable name matches its actual source file:
```js
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
```

### 2. `Cannot read properties of null (reading 'reviews')`
**Cause:** The review router was mounted in `app.js` under a path with a dynamic segment:
```js
app.use("/listings/:id/review", reviews);
```
By default, Express does **not** pass parent route params (`:id`) down into a nested/child router unless explicitly told to. As a result, `req.params.id` was `undefined` inside `routes/review.js`, so `Listing.findById(undefined)` returned `null`, and the subsequent `listing.reviews.push(...)` call threw.

**Fix:** Enabled parameter merging on the review router:
```js
const router = express.Router({ mergeParams: true });
```

### 3. Joi validation error: `"listing.image" must be a string`
**Cause:** A mismatch between the form, the Mongoose model, and the Joi validation schema for the `image` field:
- The form (`new.ejs`) submits `name="listing[image][url]"`, which Express parses into a nested object: `{ image: { url: "..." } }`.
- The Mongoose model (`models/listing.js`) correctly expects `image` as an object: `{ url: String }`.
- The Joi schema (`schema.js`) incorrectly expected `image` as a plain string: `Joi.string().allow("", null)`.

Since the form and model already agreed with each other, only the Joi schema was out of sync, causing valid submissions to fail validation.

**Fix:** Updated the Joi schema to expect an object matching the actual submitted/stored shape:
```js
image: Joi.object({
    url: Joi.string().allow("", null)
}).allow(null)
```

## Known Follow-ups / Things to Double-Check
- Verify `edit.ejs` uses the same `name="listing[image][url]"` pattern as `new.ejs` to avoid re-introducing the type mismatch on the update route.
- Confirm the mounted path for the review router (`/listings/:id/review`) matches the actual route conventions used across the app (singular vs. plural `review`/`reviews`) for consistency.

## Setup
```bash
npm install
npm start
```
Ensure MongoDB is running locally at `mongodb://127.0.0.1:27017/StayNest` (or update `MONGO_URL` in `app.js`).

## Author
Sachin