# StayNest — Complete Project Overview

We’ll understand **StayNest from the beginning, as if you were preparing to explain the entire project in a technical interview and then rebuild it yourself.** We’ll first create a complete feature inventory. After that, we can study the project architecture, request-response flow, database models, authentication, controllers, routes, middleware, views, and deployment one by one.

# StayNest — Complete Project Overview

## StayNest

**Full-stack accommodation listing and instant-booking web application**

StayNest is a web application where users can publish accommodation listings, explore places to stay, view property details, upload images, write reviews, and make instant reservations without making a payment.

- Full-stack project
- Node.js + Express
- MongoDB
- EJS

## 1. Complete list of implemented features

I’ve grouped the features by what they do, rather than by the order in which we developed them.

### A. User authentication and authorization

**1. User registration (Sign up)**

Users can create an account to use StayNest.

**2. User login and logout**

Users can log in and log out. Passport Local and session-based authentication manage the login process.

**3. Protected routes**

Certain operations, such as creating listings, writing reviews, and booking stays, require authentication.

**4. Ownership-based authorization**

A listing owner can edit or delete their own listing. A different logged-in user cannot perform those owner-only operations.

**Important distinction for interviews:**

- Authentication answers: *Who are you?*
- Authorization answers: *Are you allowed to perform this action?*

StayNest implements both.

### B. Listing management

**5. Explore all listings**

Users can browse accommodation listings and open individual property detail pages.

**6. Create a listing**

Logged-in users can add a property with information such as its title, description, price, location, country, and image.

**7. Edit and delete listings**

Owners can update their property details or remove their listings.

**8. Cloudinary image uploads**

Property images are uploaded to Cloudinary, with image URLs and related data stored through the application's listing model.

**9. My Listings**

Logged-in users can view the listings associated with their accounts.

### C. Search, filtering and browsing

| # | Feature | Purpose |
|---|---|---|
| 10 | Location filter | Find listings by location. |
| 11 | Country filter | Narrow listings by country. |
| 12 | Minimum price filter | Exclude listings below a chosen price. |
| 13 | Maximum price filter | Exclude listings above a chosen price. |
| 14 | Pagination | Display listings across multiple pages instead of one long list. |
| 15 | Category navigation | Browse listings through category icons, including their scrolling/motion behavior. |
| 16 | Responsive layout | Adapt the interface for different screen sizes. |

These features improve the user experience and demonstrate that the project is more than a basic CRUD application.

### D. Reviews and ratings

**17. Add reviews**

Logged-in users can submit a rating and written comment for a listing.

**18. Display reviews**

The listing details page shows submitted ratings, comments, authors, and review dates.

**19. Delete reviews**

Review deletion is available through the application's review routes, with authorization checks governing who can delete a review.

### E. Instant booking — your newest major feature

**20. Date-based instant booking**

A logged-in guest can choose check-in and check-out dates for a listing owned by another user.

**21. Immediate reservation confirmation**

The server validates dates, checks for overlapping confirmed reservations, calculates the total, and saves the booking as `confirmed`.

**22. My Bookings**

Users can see their reservations, dates, number of nights, total price, and booking status.

**23. Booking cancellation**

Guests can cancel their own confirmed bookings before check-in. Cancelled bookings no longer block those dates in the application's availability check.

**24. Server-side booking validation and pricing**

The server checks date validity and availability and calculates the price using the listing's nightly rate.

For example, if a listing costs ₹2,000 per night and a guest books three nights:

`Total price = ₹2,000 × 3 = ₹6,000`

No payment is collected. The booking is confirmed in the application, but it does not represent a completed payment.

### F. Price display and interface

| # | Feature | What it does |
|---|---|---|
| 25 | GST/tax display toggle | Lets users switch between the base price and a displayed price including 18% GST. |
| 26 | StayNest branding | Includes the brand name, compass icon, and red accent color. |
| 27 | Navbar navigation | Provides links to browsing, listing management, authentication, and bookings. |
| 28 | Booking login prompt | Logged-out visitors are prompted to log in before booking. |
| 29 | Review section layout | The listing page includes the review form and review display section. |
| 30 | Footer and responsive styling | Provides shared layout elements and responsive presentation. |

The GST toggle is a **display/calculation feature**, not a payment or tax-collection integration. The booking total currently uses the listing's nightly price multiplied by the nights booked.

### G. Validation, error handling and infrastructure

| # | Feature | Technology or purpose |
|---|---|---|
| 31 | Input validation | Joi validates listing/review-related inputs where configured. |
| 32 | Database schemas | Mongoose models define how application data is stored. |
| 33 | Centralized error handling | A shared error handler and async wrapper help manage errors from routes and controllers. |
| 34 | Flash messages | Displays success and error feedback to users. |
| 35 | Environment configuration | `.env` and environment variables separate local configuration and secrets from source code. |
| 36 | Cloud database support | MongoDB stores users, listings, reviews, and bookings. |
| 37 | Deployment | The application has been deployed to Render, with Cloudinary for images and a cloud MongoDB configuration. |
| 38 | Feature documentation | Project notes document features, implementation details, and issues encountered. |

## 2. Technology stack

These are the main technologies used in StayNest.

- **Node.js** — Runs JavaScript on the server.
- **Express.js** — Handles routes, HTTP requests, middleware, and responses.
- **MongoDB + Mongoose** — Stores application data and provides models for interacting with the database.
- **EJS + EJS-Mate** — Renders dynamic HTML pages on the server using data from controllers.
- **HTML, CSS, JavaScript and Bootstrap** — Build the page structure, styling, responsive layout, and browser-side interactions.
- **Passport Local + sessions** — Handles local user authentication and maintains login state across requests.
- **Cloudinary + Multer** — Processes image uploads and stores property images in cloud storage.

Other important tools and libraries include Joi, `method-override`, `express-session`, `connect-flash`, and Render for deployment.

## 3. What is *not* implemented?

Knowing the boundaries of your project is just as important as knowing its features.

- **Online payment:** No payment gateway or payment collection.
- **JWT authentication:** The application uses Passport Local and sessions, not JWT-based authentication.
- **React frontend:** The application uses server-rendered EJS templates rather than React.
- **Concurrency-safe booking protection:** The current booking flow checks availability and then creates the reservation in separate operations. Simultaneous requests could both pass the check, so this needs hardening before relying on it for production reservations.
- **Production-scale session storage:** The earlier deployment setup uses Express sessions; the default in-memory session store is not suitable for a scaled production deployment.
- **Automated test suite:** The project has been tested manually, but the configured test script was previously only a placeholder.

Also, the latest login-button and review-alignment changes were committed to GitHub, but you still need to verify those visual changes locally.

## 4. Project status

**Core application**

Authentication, listing CRUD, reviews, search, filtering, and pagination.

**Booking feature**

You confirmed the initial instant-booking scenarios passed local testing.

**Feature documentation**

The instant-booking feature has been documented in GitHub notes and Notion.

**Final UI verification**

Confirm the newest login CTA and review alignment changes locally.

## 5. How we will understand the project completely

We should learn StayNest in the same sequence a request travels through the application, rather than jumping randomly between files.

### Part 1 — Project structure and architecture

Folders, files, dependencies, `app.js`, and how the application starts.

### Part 2 — Request-response workflow

Browser → route → middleware → controller → model/database → EJS → browser.

### Part 3 — Database models and relationships

User, Listing, Review, and Booking models and their references.

### Part 4 — Authentication and authorization

Passport, sessions, protected routes, ownership checks, and redirects.

### Part 5 — Feature-by-feature code walkthrough

Listings, image uploads, reviews, search, filters, pagination, and booking.

### Part 6 — Validation, errors, and security

Joi, async wrappers, error middleware, environment variables, and booking edge cases.

### Part 7 — Deployment and interview preparation

Render, MongoDB, Cloudinary, debugging, trade-offs, and explaining design decisions.

**Our goal:** By the end, you should be able to explain what every important file does, trace a feature from the browser to the database and back, explain why each technology is used, debug common issues, and answer project-related interview questions confidently.

The best place to start is **Part 1: the folder structure and overall architecture**. We’ll use your actual StayNest code rather than a generic example.
