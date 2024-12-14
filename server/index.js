const express= require('express')
const cors= require('cors')
const app= express();
const mongoose = require('mongoose');
const User= require('./models/User')
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const cookieParser= require('cookie-parser')
const Post= require('./models/Post')
const cloudinary = require('cloudinary').v2;

const salt=bcrypt.genSaltSync(10);
const secretKey='afwteio98726347dgankcgsvnahdue';


app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

cloudinary.config({
  cloud_name: 'dtxn91sys', // Replace with your Cloudinary cloud name
  api_key: '998169754256765', // Replace with your Cloudinary API key
  api_secret: 'ET1g4MGlCKe7Fcemz_tWzCqHfyw', // Replace with your Cloudinary API secret
});

app.post('/register',async (req,res)=>{
    const {username,password}= req.body;
    try {
        const userDoc= await  User.create({ 
            username, 
            password:bcrypt.hashSync(password,salt)});
        res.json(userDoc);
    } catch (error) {
        res.status(400).json(error);
    }

});

app.post('/login',async (req,res)=>{
    const {username,password}= req.body;
    try {
        const userDoc= await  User.findOne({username});
        if(!userDoc){
            return res.status(404).json({ message: "Username not found" });
        }
       const passOk= bcrypt.compareSync(password, userDoc.password);
        if(passOk){
         jwt.sign({username,id:userDoc._id},secretKey,{},(err,token)=>{
          if(err) throw err;
          res.cookie('token',token).json({
            id:userDoc._id,
            username
          });
         });
        }
        else{
            return res.status(401).json({ message: "Incorrect password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }

});
app.post('/check-username', async (req, res) => {
  const { username } = req.body; // Getting the username from the request body
  try {
    // Find if the username exists in the database
    const user = await User.findOne({ username });
    if (user) {
      return res.status(200).json({ isTaken: true });
    } else {
      return res.status(200).json({ isTaken: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});
  app.get('/profile',(req,res)=>{

   const {token}=req.cookies;
   if (!token) {
    return res.status(401).json({ message: "Authentication token is missing" });
  }
  
   jwt.verify(token,secretKey,{}, (err,info)=>{
     if(err) throw err;
     res.json(info);
   });
  });

  app.post('/logout',(req,res)=>{
     res.cookie('token','').json('ok');
   });

   app.post('/post', async (req, res) => {
    const { title, summary, content, fileUrl, category } = req.body;
    const { token } = req.cookies;
  
    jwt.verify(token, secretKey, {}, async (err, info) => {
      if (err) throw err;
  
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: fileUrl, // Save Cloudinary URL
        category,
        author: info.id,
      });
      res.json(postDoc);
    });
  });

  // Route to update a post
app.put('/post', async (req, res) => {
  const { id, title, summary, content, category, fileUrl } = req.body; // Assuming fileUrl comes from frontend

  const { token } = req.cookies;
  jwt.verify(token, secretKey, {}, async (err, userInfo) => {
    if (err) return res.status(401).json('Unauthorized');

    try {
      const post = await Post.findById(id);
      if (!post) return res.status(404).json('Post not found');

      const isAuthor = JSON.stringify(post.author) === JSON.stringify(userInfo.id);
      if (!isAuthor) return res.status(403).json('You are not the author of this post');

      // Update the post with new data, including the Cloudinary URL for the image
      post.title = title;
      post.summary = summary;
      post.content = content;
      post.category = category;
      post.cover = fileUrl || post.cover; // Update cover if a new fileUrl is provided

      await post.save();

      return res.json(post);
    } catch (error) {
      console.error('Error updating post:', error);
      return res.status(500).json('An error occurred while updating the post');
    }
  });
});


  app.get('/post', async (req, res) => {
    try {
      const posts = await Post.find().populate('author', 'username').sort({createdAt: -1}).limit(20);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching posts', error });
    }
  });

  app.get('/post/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const postDoc = await Post.findById(id).populate('author', 'username');
      if (!postDoc) return res.status(404).json({ message: "Post not found" });
      res.json(postDoc);
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ message: "Error fetching post" });
    }
  });
  

 mongoose.connect('mongodb+srv://blog:MNukbeA7Aixcl1pU@cluster0.1wksl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.listen(4000);



