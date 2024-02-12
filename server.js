const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const cookieParser=require("cookie-parser");

const userroutes=require("./routes/user");
const blogroutes=require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middlewares/auth");
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));


require("dotenv").config();
const PORT=process.env.PORT;
const URL=process.env.MONGO_URL;
const Blog=require("./models/blog");
//connect to mongodb
mongoose.connect(URL)
.then(()=>{
    console.log("connected to mongodb");
})
.catch((err)=>{
    console.log(err);
})

app.get("/",async (req,res)=>{
   const token=req.cookies.token;
//    console.log("log user:",req.user);
//    console.log("home : ",token);
    const allblogs=await Blog.find({});
  //  const loguserId=req.user._id;
    // console.log(loguserId);
    res.render("home",{
        user:req.user,
        blogs:allblogs
    });
})
app.use("/users",userroutes);
app.use("/blogs",blogroutes);
app.listen(PORT,()=>{
    console.log(`listening to port ${PORT}`);
})


