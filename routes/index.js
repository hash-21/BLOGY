const express = require('express');
const user = require('./user');
const blog = require('./blog');

const router = express.Router();


// Use routes
router.use('/user', user);
router.use('/blog', blog);

module.exports = router;
