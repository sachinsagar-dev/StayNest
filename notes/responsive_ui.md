# Responsive UI Polish

## What was added

The listings page was improved for desktop, tablet, and mobile layouts.

### 1. Responsive listing grid

Listing cards now use a Bootstrap responsive grid:

- Large screens: 3 columns
- Medium screens: 2 columns
- Small screens: 1 column

### 2. Flexible card width

The fixed card width was removed so cards automatically fit their grid column.

### 3. Responsive images

Listing images now fill the card width and use a smaller height on mobile screens.

### 4. Mobile filter bar

The category/filter bar becomes horizontally scrollable on small screens instead of overflowing the page.

### 5. Improved listing markup

Each listing is now placed inside a Bootstrap grid column, giving consistent spacing and responsive behavior.

## Files modified

- `views/listings/index.ejs`
- `public/css/style.css`

## Testing completed

The following were tested locally:

- Desktop layout
- Tablet layout
- Mobile layout
- Listing image sizing
- Category/filter scrolling
- Search form
- Pagination

The responsive layout worked as expected.

## Interview explanation

> "I improved the responsive UI by using Bootstrap's responsive grid, flexible card widths, responsive image sizing, and a horizontally scrollable category bar for smaller screens."
