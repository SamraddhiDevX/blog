require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Post = require('./models/Post');
const cloudinary = require('cloudinary').v2;

const salt = bcrypt.genSaltSync(10);
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const secretKey = process.env.SECRET_KEY;
const frontendurl=process.env.FRONTEND_URL;

app.use(cookieParser());
app.use(express.json());

const allowedOrigins = [
  'http://localhost:3000', // For local development
  'https://blog-1-db2a.onrender.com' // Deployed frontend
];

app.use(cors({
  credentials: true,
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get('/config-check', (req, res) => {
  res.json({
    PORT,
    MONGO_URI,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  });
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt)
    });
    res.json(userDoc);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(404).json({ message: "Username not found" });
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({ username, id: userDoc._id }, process.env.SECRET_KEY, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token,{
          httpOnly:true,
          sameSite:'none',
          secure:true,
         
        }).json({
          id: userDoc._id,
          username
        });
      });
    } else {
      return res.status(401).json({ message: "Incorrect password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.post('/check-username', async (req, res) => {
  const { username } = req.body;
  try {
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

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  console.log('Token received:', token); 
  if (!token) {
    return res.status(401).json({ message: "Authentication token is missing" });
  }

  jwt.verify(token, secretKey, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
});

app.post('/post', async (req, res) => {
  const { title, summary, content, fileUrl, category } = req.body;
  const { token } = req.cookies;
   console.log('recieved',token);
  if(!token){
    return res.status(401).json({message:'Authentication is missing'});
  }
  jwt.verify(token, secretKey, {}, async (err, info) => {
    if (err) return res.status(403).json({message:'Invalid token'});
    try{
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: fileUrl, // Save Cloudinary URL
      category,
      author: info.id,
    });
    res.json(postDoc);
  }
  catch(error){
     res.status(500).json({message:'Error creating post',error})
  }
  });
});

// Route to update a post
app.put('/post', async (req, res) => {
  const { id, title, summary, content, category, fileUrl } = req.body;

  const { token } = req.cookies;
  jwt.verify(token, secretKey, {}, async (err, userInfo) => {
    if (err) return res.status(401).json('Unauthorized');

    try {
      const post = await Post.findById(id);
      if (!post) return res.status(404).json('Post not found');

      const isAuthor = JSON.stringify(post.author) === JSON.stringify(userInfo.id);
      if (!isAuthor) return res.status(403).json('You are not the author of this post');

      post.title = title;
      post.summary = summary;
      post.content = content;
      post.category = category;
      post.cover = fileUrl || post.cover; 

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
    const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 }).limit(20);
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

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Error connecting to MongoDB:", error));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
