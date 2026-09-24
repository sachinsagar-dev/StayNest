# UI/UX & Edge Case Polish

## What was added

The listings page now handles common invalid or empty states more clearly.

### 1. Invalid price range

If the minimum price is greater than the maximum price, the application displays a warning instead of performing a misleading search.

Example:
- Minimum price: 5000
- Maximum price: 1000

Message shown:
> Minimum price cannot be greater than maximum price.

### 2. No search results

When valid filters do not match any listings, the page displays:
> No listings found matching your search.

### 3. Invalid pagination values

Pagination input is protected against invalid page numbers such as `?page=-5` and `?page=0`.

These values safely resolve to page 1.

### 4. Page number beyond available pages

If a user requests a page greater than the available number of pages, the application displays the last available page instead of an empty result page.

## Files modified

- `controllers/listing.js`
- `views/listings/index.ejs`

## Implementation concepts

The controller validates the requested page before calculating `skip()`.

It calculates `totalPages` using `countDocuments()` and clamps the requested page to the available range.

The view uses conditional EJS rendering to display Bootstrap alerts for invalid price ranges and empty search results.

## Testing completed

The following cases were tested locally:

- Normal listings page
- Invalid negative page number
- Page number beyond the last page
- Normal pagination
- Search combined with pagination
- Invalid minimum/maximum price range
- Search returning no results

All tested cases worked as expected.

## Interview explanation

> I added edge-case handling to the listings search and pagination. The application validates pagination values, prevents invalid price ranges, handles requests beyond the last page, and provides clear feedback when a search returns no results.