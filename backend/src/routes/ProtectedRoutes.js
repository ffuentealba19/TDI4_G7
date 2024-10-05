// routes/protectedRoutes.js
const express = require('express');
const router = express.Router();
const middleware = require('../middleware/AuthMiddleware');

router.get('/protected', middleware, (req, res) => {
  res.send({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
