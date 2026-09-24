# My Listings

## What the feature does

Logged-in users can open a dedicated My Listings page and see only the accommodation listings they created.

URL: `/listings/my-listings`

## Files modified
- `controllers/listing.js`
- `routes/listing.js`
- `views/includes/navbar.ejs`
- `views/listings/myListings.ejs`

## How it works

The route is protected by the existing `isLoggedIn` middleware:

```js
router.get("/my-listings",isLoggedIn,wrapAsync(listingController.myListings));
```

The controller uses the authenticated user's ID to query MongoDB:

```js
const myListings=await Listing.find({owner:req.user._id});
```

This ensures the page retrieves listings whose `owner` matches the currently logged-in user.

## Important concepts

### Authentication
`isLoggedIn` prevents unauthenticated users from accessing the page.

### Ownership relationship
Each listing stores an `owner` ObjectId referencing the User model.

### MongoDB filtering
`Listing.find({owner:req.user._id})` returns only the current user's listings.

### EJS rendering
The controller passes `myListings` to `myListings.ejs`, which loops through the results and displays listing cards.

## Empty state

If the user has no listings, the page displays:

> You haven't created any listings yet.

## Navigation

A `My Listings` link is displayed in the navbar only when `currUser` exists.

## Testing completed
- Logged-in user can access My Listings.
- User's own listings are displayed.
- Listings belonging to other users are not displayed.
- Empty state works for a user with no listings.
- Unauthenticated access is protected by `isLoggedIn`.

## Interview explanation

> I implemented a personalized My Listings page by associating each listing with its owner and querying MongoDB using the authenticated user's ID. I also protected the route with authentication middleware and added an empty state for users who haven't created any listings.