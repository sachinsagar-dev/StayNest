const mongoose= require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const DEFAULT_IMAGE="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
const listingSchema=new Schema({
    title:{
      type:String,
      required:true,
    },
    description:String,
    image:{
        
        url:{type:String,
            default:DEFAULT_IMAGE
            }
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
    {
        type:Schema.Types.ObjectId,
        ref:"Review",
    },
    ],

    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});
listingSchema.pre("save", function() {
    if (!this.image || !this.image.url) {
        this.image = { url: DEFAULT_IMAGE };
    }

});
//mongosh middle ware for deleting review when listing gets deleted
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;