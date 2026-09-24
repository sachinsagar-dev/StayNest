# Deployment Verification

## Deployment

StayNest was deployed successfully on Render using the GitHub `main` branch.

Live URL:

https://staynest-3xrm.onrender.com

### Render configuration

- Build command: `npm install`
- Start command: `node app.js`
- Node.js runtime: Render-managed Node.js
- MongoDB: MongoDB Atlas
- Image storage: Cloudinary
- Environment variables configured in Render

## Root Route

The root route `/` redirects to `/listings`, so opening the main domain lands on the StayNest listings/home page.

## Deployment Verification

The following features were tested successfully on the deployed application:

- Root URL redirect
- Signup
- Login/logout
- Listing creation
- Cloudinary image upload
- Listing editing
- Listing deletion
- Reviews and ratings
- Search by location/country
- Minimum/maximum price filtering
- Pagination
- Tax toggle
- My Listings
- Listing ownership authorization
- Responsive UI
- Privacy and Terms links

## Deployment Notes

Render automatically deploys new commits pushed to the GitHub `main` branch.

The Render deployment logs showed successful dependency installation, application startup on Render's assigned port, and a successful MongoDB Atlas connection.

The Express session MemoryStore warning is a production-scaling limitation; it does not prevent the current application from running.
