const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const {isLoggedIn}=require("../middleware");
const bookingController=require("../controllers/booking");

router.get("/my-bookings",isLoggedIn,wrapAsync(bookingController.myBookings));
router.post("/listings/:listingId",isLoggedIn,wrapAsync(bookingController.createBooking));
router.post("/:bookingId/cancel",isLoggedIn,wrapAsync(bookingController.cancelBooking));

module.exports=router;