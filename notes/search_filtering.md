# Search & Filtering

## What the feature does

StayNest now allows users to filter listings using:
- Location
- Country
- Minimum price
- Maximum price

The filters use the existing GET `/listings` route, so search parameters appear in the URL.

Example: `/listings?location=Jaipur&minPrice=1000&maxPrice=5000`

## Files modified
- `controllers/listing.js`
- `views/listings/index.ejs`

## How it works

The search form sends values using the GET method. In the controller, `req.query` reads the search parameters.

A MongoDB filter object is built dynamically.

Location and country use a case-insensitive regular expression:

```js
filter.location={
    $regex:location,
    $options:"i"
};
```

Price filtering uses MongoDB comparison operators:
- `$gte` for minimum price
- `$lte` for maximum price

Finally, `Listing.find(filter)` returns matching listings.

## Important concepts

### req.query
GET parameters are available through `req.query`. Values received from the URL are strings, so price values are converted using `Number()`.

### MongoDB filtering
`$gte` means greater than or equal to. `$lte` means less than or equal to.

### Case-insensitive search
MongoDB regex with `$options:"i"` allows location/country matching without requiring exact capitalization.

## Form value persistence

The controller sends search values back to EJS so entered values remain visible after searching.

The EJS uses `typeof` checks so the page also works when optional search variables are not defined.

## Validation / edge cases
- Negative prices are ignored server-side.
- Non-numeric prices are ignored.
- Empty values do not become active filters.
- Client-side `min="0"` is used for price inputs.

## Testing completed
- Listings page loads without search parameters.
- Location filtering works.
- Country filtering works.
- Minimum price filtering works.
- Maximum price filtering works.
- Search values remain visible after submission.

## Interview explanation

> I implemented server-side search and filtering using Express query parameters and MongoDB filters. Location and country use case-insensitive regex matching, while price ranges use MongoDB's `$gte` and `$lte` operators. I also preserved the submitted filter values in the EJS form.