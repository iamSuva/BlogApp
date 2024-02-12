const express=require("express");
const router=express.Router();
const User=require("../models/user");
const Blogmodel=require("../models/blog");


router.get("/signin",(req,res)=>{
    return res.render("signin",{error:""});
});
router.get("/signup",(req,res)=>{
    return res.render("signup");
});

router.post("/signin",async(req,res)=>{

    const {email,password}=req.body;
   try{
     // const mathcheduser=await User.matchedPassword(email,password);
     const token=await User.matchedPassword(email,password);

    //  It's worth noting that this code assumes that there is a User model with
    //   a matchedPassword method that handles user authentication and returns a token upon success

     // console.log("user: ",mathcheduser);
    // console.log("token: ",token);
    console.log("user token : ",token);
   
     // res.redirect("/");
     //If the authentication is successful, a token is generated and stored as a cookie.
   return   res.cookie("token",token).redirect("/"); 
   }catch(err){
    return res.render("signin",{
        error:"Incorrect Email or Password",
    })
   }

})
router.post("/signup",async(req,res)=>{
    const {fullname,email,password}=req.body;
    await User.create({
        fullname,email,password
    });
    return res.redirect("/");
});
router.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/");
})


module.exports=router;
//pass-suvadip@632