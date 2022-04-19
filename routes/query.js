const express = require('express');
const { body } = require('express-validator/check');

const queryController = require('../controllers/query');
const adminAuth = require('../middlewares/admin-auth')

const router = express.Router();

// GET /feed/posts
router.get('/messages', adminAuth, queryController.getQueries);

// POST /feed/post
router.post(
  '/message', queryController.createQuery);

// DELETE
router.delete('/message/:queryId', adminAuth, queryController.deleteQuery)

module.exports = router;
