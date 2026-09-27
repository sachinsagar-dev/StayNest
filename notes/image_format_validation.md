# Image Format Validation

## Overview

Added image format validation for listing images in StayNest.

The validation is applied when creating a new listing and when replacing an image while editing an existing listing.

## Accepted Image Formats

The application accepts the following image formats:

- JPG
- JPEG
- PNG
- WEBP

## Implementation

### 1. Server-side validation

File: `cloudConfig.js`

The Cloudinary storage configuration now restricts uploaded files to the supported image formats:

```js
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    asset_folder: 'StayNest',
    format: ['jpg', 'jpeg', 'png', 'webp'],
  },
});
```

This keeps the format restriction on the upload side rather than relying only on the browser.

### 2. New Listing form

File: `views/listings/new.ejs`

The image input now specifies the supported MIME types:

```html
<input
  name="listing[image]"
  type="file"
  class="form-control"
  accept="image/jpeg,image/png,image/webp"
  required
/>
```

This helps users select only supported image files from the file picker.

### 3. Edit Listing form

File: `views/listings/edit.ejs`

The replacement-image field uses the same restriction:

```html
<input
  type="file"
  name="listing[image]"
  class="form-control"
  accept="image/jpeg,image/png,image/webp"
  required
/>
```

## Upload Flow

1. User selects an image while creating or editing a listing.
2. The browser limits the file picker to supported image MIME types.
3. The listing route passes the file through Multer.
4. Cloudinary storage accepts only the configured image formats.
5. The uploaded image is stored in Cloudinary and its URL and filename are saved with the listing.

## Files Updated

- `cloudConfig.js`
- `views/listings/new.ejs`
- `views/listings/edit.ejs`

## Notes

The browser `accept` attribute improves the user experience, while the storage configuration provides the server-side format restriction. Both are used together so the upload flow is consistent for new and updated listings.
