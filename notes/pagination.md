# Pagination

## What the feature does

StayNest now displays listings in pages instead of loading every matching listing at once. The current page size is 6 listings.

Example:
`/listings?page=2`

Pagination also preserves the existing search filters.

Example:
`/listings?location=Jaipur&minPrice=1000&maxPrice=5000&page=2`

## Files modified
- `controllers/listing.js`
- `views/listings/index.ejs`

## How it works

The controller reads the page number from `req.query`:

```js
const page=Number(req.query.page) || 1;
const limit=6;
const skip=(page-1)*limit;
```

`skip` determines how many documents MongoDB should ignore before returning results.

`limit` determines the maximum number of listings returned.

The total number of matching listings is calculated with:

```js
const totalListings=await Listing.countDocuments(filter);
```

Then the number of pages is calculated:

```js
const totalPages=Math.ceil(totalListings/limit);
```

The actual page of listings is fetched with:

```js
const allListings=await Listing.find(filter)
    .skip(skip)
    .limit(limit);
```

## Important concepts

### Pagination formula
`skip = (page - 1) * limit`

For example, with a limit of 6:
- Page 1 → skip 0
- Page 2 → skip 6
- Page 3 → skip 12

### countDocuments()
`countDocuments(filter)` counts only documents matching the current search/filter conditions.

### Preserving filters
Pagination links include the current location, country, minimum price and maximum price values so moving between pages does not remove the active filters.

## UI

The page displays:
- Previous
- Page numbers
- Next

Previous is hidden on the first page and Next is hidden on the last page.

Pagination is hidden when all matching listings fit on a single page.

## Testing completed
- Normal pagination works.
- Page numbers display correctly.
- Previous/Next navigation works.
- Search filters remain active while changing pages.
- Pagination is hidden when there is only one page of results.

## Interview explanation

> I implemented server-side pagination using MongoDB's `skip()` and `limit()` methods. I use `countDocuments()` to calculate the total number of pages, and I preserve the active search filters in pagination URLs so filtering and pagination work together.