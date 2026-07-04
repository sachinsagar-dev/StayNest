const express=require("express");
const user = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const router=express.Router();
const passport=require("passport");

//signup
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {username,email,password}= req.body;
        const newUser=new user({email,username});
        const registerUser=await user.register(newUser,password);
        console.log(registerUser);
        req.flash("success","welcome to StayNest");
        res.redirect("/listings");
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

//login
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),
async(req,res)=>{
    req.flash("success","welcome to StayNest");
    res.redirect("/listings");
});

module.exports=router;