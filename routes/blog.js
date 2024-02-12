const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const Blog = require("../models/blog");
const Comment=require("../models/comment");
const mongoose=require("mongoose");
const ObjectId=mongoose.Types.ObjectId;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  }
})
const upload = multer({ storage: storage });
router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user
  });
});
//single post
router.get("/:id",async(req,res)=>{
  const id=req.params.id;
  const blog=await Blog.findById(id).populate("createdBy");
  const allcomments=await Comment.find({blogId:req.params.id}).populate("createdBy");
  
   console.log("single blog "+blog);
  
 return  res.render("singleblog",{
      user:req.user,
      blog,
      allcomments
  });
});
//all post of login user
router.get("/all-posts/:id", async (req, res) => {
  const userId = req.params.id;

  try {
     
      if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: 'Invalid user ID' });
      }

      const blogs = await Blog.find({ createdBy: userId });

      console.log("All blogs of user:", blogs); 

      res.render("home", { user: req.user, blogs });
  } catch (error) {
      console.error("Error fetching blogs:", error);
      res.status(500).json({ message: "Error fetching blogs" });
  }
});
//comment post
router.post("/comment/:blogid",async(req,res)=>{
   await Comment.create({
      content:req.body.content,
      blogId:req.params.blogid,
      createdBy:req.user._id
   });
   return res.redirect(`/blogs/${req.params.blogid}`);
});

router.post("/", upload.single("coverimage"), async (req, res) => {
  // console.log(req.body);
  // console.log(req.file);
  const { title, body } = req.body;
  const newblog = await Blog.create({
    title: title,
    body: body,
    createdBy: req.user._id,
    coverImageUrl: `uploads/${req.file.filename}`
  });

 return res.redirect(`/blogs/${newblog._id}`);
});

///

router.get("/update-blog/:id",async(req,res)=>{
  const id=req.params.id;
  console.log(id);
  console.log(req.user);
    try {
      const blog=await Blog.findById(id).populate("createdBy");
      return res.render("update",{blog,user:req.user});
    } catch (error) {
      console.log(error);
      
    }
});

router.post("/update-blog/:id",upload.single("coverimage"),async(req,res)=>{
  const bid=req.params.id;
   console.log(req.body);
   console.log(req.file);
  try {
       const {title,body,currentimage}=req.body;
let newcoverImage = currentimage; // Use the existing image by default
    if (req.file) {
      newcoverImage = `uploads/${req.file.filename}`;
    }
    await Blog.findByIdAndUpdate(bid, {
      title,
      body,
      coverImageUrl:newcoverImage
    });
    res.redirect(`/blogs/${bid}`);


  } catch (error) {
      console.log(error);
  }
})

router.delete("/delete-blog/:id",async(req,res)=>{
  try {
    const id=req.params.id;
    const blog=await Blog.findByIdAndDelete(id);
    if(!blog)
    {
    return  res.status(404).send("blog not found");
    }
    res.status(200).json({message:"blog deleted successfully",data:blog});
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});



module.exports = router;