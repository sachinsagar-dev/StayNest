# Instant Booking Feature

## Overview

StayNest supports instant reservations without collecting payment. A logged-in guest selects check-in and check-out dates on a listing details page. The server validates the dates, checks availability, calculates the total price, and creates a confirmed booking.

**Important:** "Confirmed" means saved as confirmed in StayNest. No payment is processed or collected.

## User Flow

1. Guest opens a listing owned by another user.
2. Guest selects check-in and check-out dates.
3. The server validates the submitted dates again; browser validation is only a convenience.
4. The server checks for overlapping confirmed bookings for that listing.
5. The total is calculated as nightly listing price multiplied by the number of nights.
6. The booking is saved in MongoDB with status `confirmed`.
7. The guest is redirected to My Bookings.

## Files Added or Updated

- `models/booking.js` — booking schema and references to Listing and User.
- `controllers/booking.js` — booking creation, date and availability checks, My Bookings, and cancellation.
- `routes/booking.js` — protected routes for booking operations.
- `views/bookings/myBookings.ejs` — displays reservations, dates, total price, status, and cancellation action.
- `views/listings/show.ejs` — booking date form on the listing detail page.
- `views/includes/navbar.ejs` — My Bookings navigation link.
- `app.js` — registers the booking router.
- `controllers/listing.js` — removes bookings when a listing is deleted.

## Booking Model

Each booking stores:

- `listing`: reference to the property.
- `user`: reference to the guest.
- `checkIn` and `checkOut`: requested dates.
- `nights`: length of the stay.
- `totalPrice`: nightly price multiplied by nights.
- `status`: `confirmed` or `cancelled`.
- Timestamps: creation and update times.

## Validation and Business Rules

- The listing must exist.
- A user cannot book their own listing.
- Check-in must be a valid date and cannot be in the past.
- Check-out must be valid and strictly later than check-in.
- Price is read from the listing on the server; the client does not supply the total.
- Existing confirmed bookings are checked for date overlap.
- A booking is rejected if an overlapping confirmed booking exists.
- Guests can only cancel their own bookings.
- Cancellation is allowed only before check-in.
- Cancelled bookings do not block future reservations.
- Login is required to create, view, or cancel bookings.

## Date Overlap Logic

Two reservations overlap when:

`existing.checkIn < requested.checkOut && existing.checkOut > requested.checkIn`

The strict comparisons allow one guest to check out on the same date that the next guest checks in.

## Routes

- `POST /bookings/listings/:listingId` — create a confirmed booking.
- `GET /bookings/my-bookings` — view the current user's bookings.
- `POST /bookings/:bookingId/cancel` — cancel the current user's eligible booking.

## Testing Checklist

The user confirmed the booking feature was tested locally. The test checklist covered:

- Booking form for a guest.
- Successful booking and My Bookings display.
- Total price calculation.
- Rejection of overlapping dates.
- Rejection of invalid dates.
- Cancellation and date availability afterward.
- Rejection when trying to book one's own listing.
- Regression checks for listing CRUD, reviews, and My Listings.

## Known Limitation

The availability query and booking creation are separate operations. Concurrent requests could both pass the availability check before either saves a booking. Before treating this as production-ready, add concurrency-safe reservation protection (for example, a transaction/locking design appropriate to the MongoDB deployment) and test simultaneous booking attempts.

## Payment Status

No payment gateway, payment record, or payment collection is implemented. The interface states that the booking is confirmed in StayNest but not paid.
