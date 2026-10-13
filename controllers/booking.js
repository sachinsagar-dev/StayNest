const Booking=require("../models/booking");
const Listing=require("../models/listing");
const ExpressError=require("../utils/ExpressError");

const parseDate=(value)=>{
    if(typeof value!=="string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)){
        return null;
    }

    const date=new Date(value+"T00:00:00.000Z");
    return Number.isNaN(date.getTime()) || date.toISOString().slice(0,10)!==value ? null : date;
};

const todayUTC=()=>{
    const today=new Date();
    return new Date(Date.UTC(today.getUTCFullYear(),today.getUTCMonth(),today.getUTCDate()));
};

//create instant booking
module.exports.createBooking=async(req,res)=>{
    const {listingId}=req.params;
    const listing=await Listing.findById(listingId);

    if(!listing){
        req.flash("error","Listing doesn't exist.");
        return res.redirect("/listings");
    }

    if(listing.owner && listing.owner.equals(req.user._id)){
        req.flash("error","You can't book your own listing.");
        return res.redirect(`/listings/${listingId}`);
    }

    const checkIn=parseDate(req.body.checkIn);
    const checkOut=parseDate(req.body.checkOut);
    const today=todayUTC();

    if(!checkIn || !checkOut || checkIn<today || checkOut<=checkIn){
        req.flash("error","Choose valid dates. Check-in must be today or later, and check-out must be after check-in.");
        return res.redirect(`/listings/${listingId}`);
    }

    const nights=(checkOut-checkIn)/(1000*60*60*24);
    const price=Number(listing.price);

    if(!Number.isFinite(price) || price<0){
        throw new ExpressError(400,"This listing has an invalid price.");
    }

    const conflict=await Booking.findOne({
        listing:listingId,
        status:"confirmed",
        checkIn:{$lt:checkOut},
        checkOut:{$gt:checkIn},
    });

    if(conflict){
        req.flash("error","These dates are already booked. Please choose different dates.");
        return res.redirect(`/listings/${listingId}`);
    }

    await Booking.create({
        listing:listingId,
        user:req.user._id,
        checkIn,
        checkOut,
        nights,
        totalPrice:price*nights,
        status:"confirmed",
    });

    req.flash("success","Booking confirmed! No payment was collected.");
    res.redirect("/bookings/my-bookings");
};

//show bookings belonging to the logged-in user
module.exports.myBookings=async(req,res)=>{
    const bookings=await Booking.find({user:req.user._id})
        .populate("listing")
        .sort({createdAt:-1});

    res.render("bookings/myBookings.ejs",{bookings});
};

//cancel own booking before check-in
module.exports.cancelBooking=async(req,res)=>{
    const booking=await Booking.findById(req.params.bookingId);

    if(!booking){
        req.flash("error","Booking not found.");
        return res.redirect("/bookings/my-bookings");
    }

    if(!booking.user.equals(req.user._id)){
        req.flash("error","You can only cancel your own bookings.");
        return res.redirect("/bookings/my-bookings");
    }

    if(booking.status!=="confirmed"){
        req.flash("error","This booking is already cancelled.");
        return res.redirect("/bookings/my-bookings");
    }

    if(booking.checkIn<=todayUTC()){
        req.flash("error","Bookings can only be cancelled before check-in.");
        return res.redirect("/bookings/my-bookings");
    }

    booking.status="cancelled";
    await booking.save();

    req.flash("success","Booking cancelled. The dates are available again.");
    res.redirect("/bookings/my-bookings");
};