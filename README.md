# StayNest

StayNest is a full-stack accommodation listing platform where users can browse, search, create, edit and manage property listings.

## Live Demo

https://staynest-3xrm.onrender.com

## Features

- User signup, login and logout
- Session-based authentication with Passport.js
- Listing CRUD operations
- Ownership-based authorization for listing edit/delete
- Cloudinary image uploads
- Reviews and ratings
- Review authorization and review cleanup
- Joi-based server-side validation
- Custom middleware and centralized error handling
- Search by location and country
- Minimum and maximum price filtering
- Pagination for listings
- My Listings section
- Responsive listing grid and mobile UI
- Horizontally scrollable listing categories
- Automatic category scrolling
- Tax toggle showing total price with 18% GST
- Flash messages for user feedback
- Environment-based configuration
- MongoDB Atlas database
- Render deployment

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- EJS
- EJS-Mate
- Passport.js
- Passport-Local
- Express Session
- Cloudinary
- Multer
- Joi
- Bootstrap
- Font Awesome

## Project Structure

```
StayNest/
├── controllers/
├── models/
├── routes/
├── views/
├── public/
├── utils/
├── notes/
├── app.js
├── middleware.js
├── schema.js
├── cloudConfig.js
└── package.json
```

## Environment Variables

Create a local `.env` file with the required values:

```
MONGO_URL=
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
SESSION_SECRET=
```

Never commit the actual `.env` file. Use `.env.example` as the template.

## Deployment

The application is deployed on Render and connected to the GitHub `main` branch. New commits pushed to `main` trigger an automatic deployment.

MongoDB is hosted on MongoDB Atlas and listing images are stored using Cloudinary.

## Current Status

The deployed application has been tested for:

- Authentication
- Listing creation, editing and deletion
- Image upload
- Reviews
- Search and filtering
- Pagination
- My Listings
- Authorization
- Tax calculation
- Responsive UI
- Footer links
- Root URL redirect
