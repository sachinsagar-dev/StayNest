# Image Format Validation

## Overview

Added image format validation for listing images in StayNest.

The validation is applied when creating a new listing and when replacing an image while editing an existing listing.

## Accepted Image Formats

The application accepts:

- JPG
- JPEG
- PNG
- WEBP

## Implementation

### 1. Server-side validation

File: `routes/listing.js`

Multer uses a `fileFilter` to check the uploaded file MIME type before the file is passed to Cloudinary.

```js
const imageFileFilter=(req,file,cb)=>{
  const allowedTypes=["image/jpeg","image/png","image/webp"];

  if(allowedTypes.includes(file.mimetype)){
    cb(null,true);
  }else{
    cb(new ExpressError(400,"Only JPG, JPEG, PNG, and WEBP images are allowed."),false);
  }
};

const upload=multer({
  storage,
  fileFilter:imageFileFilter
});
```

This provides the server-side validation and prevents unsupported file types from being uploaded.

### 2. Cloudinary storage

File: `cloudConfig.js`

Cloudinary storage is responsible for storing the uploaded image. Format validation is handled before the file reaches Cloudinary, so the storage configuration does not use the Cloudinary `format` option for extension validation.

### 3. New Listing form

File: `views/listings/new.ejs`

The image input uses the `accept` attribute:

```html
<input
  name="listing[image]"
  type="file"
  class="form-control"
  accept="image/jpeg,image/png,image/webp"
  required
/>
```

This helps users select supported image files from the file picker.

### 4. Edit Listing form

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
2. The browser's `accept` attribute guides the user toward supported image formats.
3. Multer receives the uploaded file.
4. Multer's `fileFilter` checks the file MIME type.
5. Unsupported files are rejected with a validation error.
6. Supported files are passed to Cloudinary.
7. The uploaded image URL and filename are saved with the listing.

## Issue Encountered

During implementation, image format validation was initially added using the `format` option inside the Cloudinary storage configuration:

```js
format: ["jpg", "jpeg", "png", "webp"]
```

When the application was started, Cloudinary returned:

```text
Invalid extension in transformation: ["jpg", "jpeg", "png", "webp"]
```

### Cause

The `format` option was interpreted as a Cloudinary transformation parameter rather than as a list of allowed upload extensions.

### Resolution

The incorrect `format` configuration was removed from `cloudConfig.js`.

Format validation was moved to Multer's `fileFilter`, where the uploaded file's MIME type can be checked before the file is sent to Cloudinary.

This separates the responsibilities clearly:

- **Multer:** validates the uploaded file type.
- **Cloudinary:** stores the validated image.
- **HTML `accept`:** provides a better file-selection experience.

## Files Updated

- `cloudConfig.js`
- `routes/listing.js`
- `views/listings/new.ejs`
- `views/listings/edit.ejs`

## Result

New and replacement listing images are now restricted to JPG, JPEG, PNG, and WEBP formats at both the user-interface and server-upload levels.
