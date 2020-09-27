const express = require('express');
const postsRouter = express.Router();
const { getAllPosts } = require('../db');


postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  res.send({ message: 'We got the posts' });
});

postsRouter.get('/', async (req, res) => {
  const posts = await getAllPosts();

  res.send({
    posts
  });
});


module.exports = postsRouter;
