const express = require('express');
const { body } = require('express-validator/check');

const queryController = require('../controllers/query');
const adminAuth = require('../middlewares/admin-auth')

const router = express.Router();

// GET /feed/posts
router.get('/messages', adminAuth, 
/*
        #swagger.tags = ['Messages']
        #swagger.security = [{
            "Authorization": []
        }]
    */
   queryController.getQueries);

// POST /message/post
router.post('/message',
  body('username').trim().not().isEmpty(),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('message').trim().not().isEmpty(),
  /*  #swagger.tags = ['Messages']
    	#swagger.parameters['obj'] = {
            in: 'body',
            required: true,
            schema: { $ref: "#/definitions/MessageModel" }
    } */ 
  queryController.createQuery);

// DELETE
router.delete('/message/:queryId', adminAuth, 
 /*  #swagger.tags = ['Messages']
        #swagger.security = [{
        "Authorization": []
        }]
    */ 
   queryController.deleteQuery)

module.exports = router;
