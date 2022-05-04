const express = require('express');
const { body } = require('express-validator/check');

const feedController = require('../controllers/feed');
const isAuth = require('../middlewares/is-auth');
const adminAuth = require('../middlewares/admin-auth');

const router = express.Router();

// GET /feed/posts
router.get('/posts', /* #swagger.tags = ['Posts'] */ feedController.getPosts);

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
  /*  #swagger.tags = ['Posts']
        #swagger.consumes = ['multipart/form-data']
        #swagger.security = [{
        "Authorization": []
        }]
        #swagger.parameters['image'] = {
            in: 'formData',
            required: true,
            type: 'string'
        }
      
      #swagger.parameters['title'] = {
            in: 'formData',
            required: true,
            type: 'string',
      } 
      #swagger.parameters['content'] = {
            in: 'formData',
            required: true,
            type: 'string',
      } 
    
    */ 
  feedController.createPost
);

// GET /post/:postId
router.get('/post/:postId', 
  /* #swagger.tags = ['Posts'] */ 
  feedController.getPost);

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
  /*  #swagger.tags = ['Posts']
        #swagger.consumes = ['multipart/form-data']
        #swagger.security = [{
        "Authorization": []
        }]
        #swagger.parameters['image'] = {
            in: 'formData',
            required: true,
            type: 'string'
        }
      
      #swagger.parameters['title'] = {
            in: 'formData',
            required: true,
            type: 'string',
      } 
      #swagger.parameters['content'] = {
            in: 'formData',
            required: true,
            type: 'string',
      } 
    
    */
  feedController.updatePost
);

// DELETE
router.delete('/post/:postId', adminAuth, 
 /*  #swagger.tags = ['Posts']
        #swagger.security = [{
        "Authorization": []
        }]
    */  
   feedController.deletePost)


// COMMENT ROUTES

// POST /post/:postId/comment
router.post('/post/:postId/comment', isAuth,
    body('username').trim().not().isEmpty(),
    body('comment').trim().not().isEmpty(), 
    /*  #swagger.tags = ['Posts']
        #swagger.security = [{
        "Authorization": []
        }]
    	#swagger.parameters['obj'] = {
            in: 'body',
            required: true,
            schema: { $ref: "#/definitions/CommentModel" }
    } */  
    feedController.createComment);

// GET comments
router.get('/post/:postId/comments', isAuth, 
/*
        #swagger.tags = ['Posts']
        #swagger.security = [{
            "Authorization": []
        }]
    */
   feedController.getComments);

module.exports = router;
