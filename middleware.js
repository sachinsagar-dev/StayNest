

module.exports.isLoggedIn=(req,res,next)=>{
    //console.log(req);
    if(!req.isAuthenticated()){
        //redirect url save
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","login to add listing");
        return res.redirect("/login");
    }next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;

    }
    next();
}