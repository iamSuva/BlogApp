
const {createHmac,randomBytes}=require("crypto"); //createHmac and randomBytes are imported from the Node.js built-in crypto module
//createHmac help to hash any password
const mongoose=require("mongoose");
const { createTokenforUser } = require("../services/authentication");
const userSchema=new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
         type:String,
         
    },
    password:{
        type:String,
        required:true
    },
    profileImageUrl:{
        type:String,
        default:"/images/default.png"
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER"
    }
},{timestamps:true});

userSchema.pre("save",function(next){
    const user=this;  //It assigns the current instance of the user document (the document being saved) to the user variable
    if(!user.isModified("password")) return;//if pass not modified
    const salt=randomBytes(16).toString();
    const hashpassword=createHmac("sha256",salt) //it initializes the HMAC (Hash-based Message Authentication Code) algorithm using SHA-256 as the hashing algorithm and the generated salt as the secret key.
    .update(user.password) //This is the step where the password and salt are combined for hashing and update password
    .digest("hex"); //Finally, it computes the HMAC hash and converts it to a hexadecimal representation.
    this.salt=salt; //This salt is stored alongside the hashed password so that it can be used for future password verifications.
    this.password=hashpassword;
    next();//When the next() function is not called, the middleware function will not finish its execution. It will be in a "hanging" state, and the subsequent steps in the save process will not be triggered.

});

//This static method is responsible for verifying a user's password by comparing the hashed password stored in the database with the hashed version of the password provided by the use
userSchema.static("matchedPassword",async function(email,password){
    const user=await this.findOne({email});
    if(!user) throw new Error("user not found");
    
    const salt=user.salt;
    const hashedPassword=user.password;
    const userProvidedHash=createHmac("sha256",salt)
     .update(password)
     .digest("hex");
     if(hashedPassword!==userProvidedHash)
     throw new Error("incorrect password");
    // return {...user,password:undefined,salt:undefined};
    // return user;
    //if password matched generate a token
    const token=createTokenforUser(user);
    return token;
})
const Usermodel=mongoose.model("user",userSchema);
module.exports=Usermodel;