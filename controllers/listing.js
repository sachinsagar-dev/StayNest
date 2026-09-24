
const Listing=require("../models/listing");
const axios=require("axios");
//index route
module.exports.index=async(req,res)=>{
    const {location,country,minPrice,maxPrice}=req.query;
    const requestedPage=Math.max(Number(req.query.page) || 1,1);
    const limit=6;
    const filter={};

    if(location){
        filter.location={
            $regex:location,
            $options:"i"
        };
    }

    if(country){
        filter.country={
            $regex:country,
            $options:"i"
        };
    }

    const min=Number(minPrice);
    const max=Number(maxPrice);
    const invalidPriceRange=minPrice && maxPrice &&
        Number.isFinite(min) && Number.isFinite(max) && min>max;

    if(minPrice && Number.isFinite(min) && min>=0 && !invalidPriceRange){
        filter.price={$gte:min};
    }

    if(maxPrice && Number.isFinite(max) && max>=0 && !invalidPriceRange){
        filter.price=filter.price || {};
        filter.price.$lte=max;
    }

    const totalListings=invalidPriceRange ? 0 : await Listing.countDocuments(filter);
    const totalPages=Math.ceil(totalListings/limit);
    const currentPage=totalPages ? Math.min(requestedPage,totalPages) : 1;
    const skip=(currentPage-1)*limit;

    const allListings=invalidPriceRange ? [] : await Listing.find(filter)
        .skip(skip)
        .limit(limit);

    res.render("listings/index.ejs",{
        allListings,
        location,
        country,
        minPrice,
        maxPrice,
        currentPage,
        totalPages,
        invalidPriceRange
    });
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

//my listings
module.exports.myListings=async(req,res)=>{
    const myListings=await Listing.find({owner:req.user._id});
    res.render("listings/myListings.ejs",{myListings});
};

//show route

module.exports.showListing=async(req,res)=>{
    let {id}= req.params;
    const listing=await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author"},
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing Doesn't Exist");
        res.redirect("/listings");
    }
   // console.log(listing);
    res.render("listings/show.ejs",{listing});
};

//create listing
module.exports.createListing=async(req,res,next)=>{
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    if(req.file){
     const url=req.file.path;
     const filename=req.file.filename;
     newListing.image={url,filename};
    }

    
    await newListing.save(); 
    req.flash("success","New Listing Created");
    res.redirect("/listings");
    };

    //edit
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing Doesn't Exist");
        return res.redirect("/listings");
    }

    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_200,w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
 };    

 //update
 module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    const newListing= await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        newListing.image={url,filename};
        await newListing.save();
    }
     req.flash("success","Edit succesfull");
    res.redirect(`/listings/${id}`);
 };

 //delete
 module.exports.destroyListing=async(req,res)=>{
     let {id}=req.params;
     let deletedListing=await Listing.findByIdAndDelete(id);
     req.flash("success","Listing Deleted successfully");
     res.redirect("/listings");
  };