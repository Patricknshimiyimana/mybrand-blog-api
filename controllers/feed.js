const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const { validationResult } = require('express-validator/check');

const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      res
        .status(200)
        .json({ message: 'Fetched posts successfully.', posts: posts });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  if (!req.body.image) {
    const error = new Error('No image url provided.');
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.body.image;
  const title = req.body.title;
  const content = req.body.content;
  let creator;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId
  });
  post
    .save()
    .then(result => {
      return User.findById(req.userId);
    })
    .then(user => {
      creator = user
      user.posts.push(post);
      return user.save()
    })
    .then(result => {
      res.status(201).json({
        message: 'Post created successfully!',
        post: post,
        creator: { _id: creator._id, username: creator.username }
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Post fetched.', post: post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.body.image) {
    imageUrl = req.body.image;
  }
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error('Not Authorized!');
        error.statusCode = 403;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Post updated!', post: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId).then(post => {
      if (!post) {
          const error = new Error('Could not find post');
         error.statusCode = 404;
         throw error
      }
      // check logged in user
      if (post.creator.toString() !== req.userId) {
        const error = new Error('Not Authorized!');
        error.statusCode = 403;
        throw error;
      }

      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
  })
  .then(result => {
      return User.findById(req.userId);
  })
  .then(user => {
    user.posts.pull(postId);  //Clear the deleted post-user relation in the posts of a user
    return user.save();
  })
  .then(result => {
    res.status(200).json({message: 'post deleted!!'})
  })
  .catch(err => {
      if (!err.statusCode) {
          err.statusCode = 500;
      }
      next(err)
  })
};


// COMMENT CONTROLLERS
exports.createComment = async(req, res, next) => {
  const comment = await new Comment({
  _id: new mongoose.Types.ObjectId(),
  username: req.body.username,
  comment: req.body.comment
});

  comment.save().then(async(comment) => {
  const post = await Post.findById(req.params.postId);

  if (post) {
      post.comments.push(comment._id);
      await post.save() 
  } 
  else {
    const error = new Error('Could not find post');
    error.statusCode = 404;
    throw error
  }

  res.status(201).json({message: 'comment posted!', comment: comment});

}).catch(err => {
  if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
});  

}

exports.getComments = async(req, res, next) => {
  try {
    let post = await Post.findById(req.params.postId).populate('comments');
    
    res.status(200)
    .json({message: 'Fetched comments successfully!', postId: req.params.postId, comments: post.comments})
  } 
  
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  }

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
