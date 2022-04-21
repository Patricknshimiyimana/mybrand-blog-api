const express = require('express');
const { body } = require('express-validator/check');

const feedController = require('../controllers/feed');
const isAuth = require('../middlewares/is-auth');
const adminAuth = require('../middlewares/admin-auth');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post(
  '/post',
  adminAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.createPost
);

// GET /post/:postId
router.get('/post/:postId', feedController.getPost);

//PUT /post/:postId
router.put(
  '/post/:postId',
  adminAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.updatePost
);

// DELETE
router.delete('/post/:postId', adminAuth, feedController.deletePost)


// COMMENT ROUTES

// POST /post/:postId/comment
router.post('/post/:postId/comment', isAuth,
    body('username').trim().not().isEmpty(),
    body('comment').trim().not().isEmpty(), 
    feedController.createComment);

// GET comments
router.get('/post/:postId/comments', isAuth, feedController.getComments);

module.exports = router;
