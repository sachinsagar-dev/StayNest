# Review Feature — StayNest

This document describes the review feature implemented for individual listings, based on the code in `listing.js`, `review.js`, `app.js`, `schema.js`, and `show.ejs`.

> **Note on accuracy (per my standing instructions):** this README is written strictly from the files you shared in this conversation. I have not seen your `package.json`, `wrapAsync.js`, `ExpressError.js`, or `boilerplate.ejs`, so any detail about exact dependency versions, error-handling internals, or your Bootstrap CDN version is **not confirmed** — flagged inline below where relevant.

---

## Overview

Each listing can have multiple reviews. A review consists of a numeric rating (1–5) and a text comment. Reviews are stored as a separate Mongoose collection and referenced from the listing document via an array of ObjectIds.

## Data Model

**`Review` schema** (`review.js`):
- `comment` — String
- `rating` — Number, min 1, max 5
- `createdAt` — Date, defaults to `Date.now()` at schema definition time
- `author` — commented out; user/auth association is not yet implemented

**`Listing` schema** (`listing.js`):
- `reviews` — array of `ObjectId`, `ref: "Review"`
- A `post("findOneAndDelete")` middleware cascades review deletion: when a listing is deleted, all reviews whose `_id` appears in `listing.reviews` are removed via `Review.deleteMany()`.

## Routes (`app.js`)

| Method | Path | Purpose |
|---|---|---|
| POST | `/listings/:id/reviews` | Creates a new review, pushes its ObjectId into the listing's `reviews` array, saves both documents |
| DELETE | `/listings/:id/reviews/:reviewId` | Removes the review's ObjectId from the listing via `$pull`, then deletes the `Review` document itself |

The show route (`GET /listings/:id`) uses `.populate("reviews")` so the full review documents (not just ObjectIds) are available in the EJS template.

## Validation

Server-side validation is handled with Joi (`schema.js`):
- `reviewSchema` requires `review.rating` (number, 1–5) and `review.comment` (string), both required.
- A `validateReview` middleware in `app.js` runs this check before the POST route handler and throws a custom `ExpressError(400, ...)` on failure.

> I have not seen `ExpressError.js`, so I cannot confirm its exact constructor behavior beyond how it's called in `app.js` — you may want to verify that class matches this usage if you're documenting it in more detail elsewhere.

## Frontend (`show.ejs`)

- **Rating input:** implemented as 5 radio buttons (`review[rating]`, values 1–5) styled as circular toggle buttons using Bootstrap's `.btn-check` + `.btn-outline-dark` pattern.
  - **Uncertain:** `.btn-check` requires Bootstrap 5.2+. I could not confirm which Bootstrap version your layout links, so this styling may render as plain unstyled radio buttons depending on your CDN version. Verify in-browser after pasting.
- **Comment input:** a required `<textarea>` bound to `review[comment]`.
- **Review list:** iterates `listing.reviews` (populated documents) and displays:
  - A placeholder avatar and "Guest" label, since no user/auth system is implemented yet (`author` field is commented out in the schema).
  - Star rating rendered visually using `&#9733;` / `&#9734;` HTML entities based on `review.rating`.
  - The review date via `review.createdAt.toLocaleDateString(...)`.
  - A delete form scoped to that specific review's `_id`.

## Known Limitations / Not Yet Implemented

- **No authentication/authorization.** Any visitor can currently submit or delete any review — there's no ownership check, since `currUser`/`author` is not wired up.
- **No client-side JS validation beyond Bootstrap's `needs-validation` class** — note that Bootstrap's validation styling requires a small JS snippet (typically added via `<script>` calling `form.checkValidity()` and adding the `was-validated` class) to actually activate. I did not see that script in any uploaded file, so client-side validation feedback (red borders, `.invalid-feedback` messages) may not currently trigger without it — this is worth verifying, not something I can confirm works as-is.
- **No average rating display** at the listing level (e.g., "4.5 ★ · 12 reviews") — only individual review ratings are shown.
- **No pagination** for listings with many reviews.

## Suggested Next Steps

- Add authentication (e.g., Passport.js) and re-enable the `author` field in `review.js`.
- Restrict delete access to the review's author.
- Add the Bootstrap validation-activation script if client-side validation feedback is desired.
- Add an average-rating aggregate, either computed on read or denormalized onto the listing document.

---
*This README reflects the state of the code as shared during development and should be reviewed against your actual repository before publishing, in case files not included in this conversation affect behavior described above.*
