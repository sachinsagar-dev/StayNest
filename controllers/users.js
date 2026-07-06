const user = require("../models/user");

//rendersignupgorm
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

//renderloginform
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};


//signup
module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}= req.body;
        const newUser=new user({email,username});
        const registerUser=await user.register(newUser,password);
        console.log(registerUser);
        req.login(registerUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to StayNest");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

//login
module.exports.login=async(req,res)=>{
    req.flash("success","welcome to StayNest");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};
//logout
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","successfully logged out");
        res.redirect("/listings");
    });
};