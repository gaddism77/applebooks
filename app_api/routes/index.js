const express = require('express');
const router = express.Router();
const ctrlBooks = require('../controllers/books');
const ctrlReviews = require('../controllers/reviews');

/*
const passport = require('passport');
const ctrlAuth = require('../controllers/authentication');

const jwt = require('express-jwt');
const auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload',
  algorithms: ['sha1', 'RS256', 'HS256'],
});

// local authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

// For passport-apple: https://www.npmjs.com/package/passport-apple
*/

// locations
router
  .route('/books')
  .get(ctrlBooks.booksReadAll);

router
  .route('/books/:bookid')
  .get(ctrlBooks.booksReadOne);

// reviews
router
  .route('/reviews')
  .get(ctrlReviews.reviewsReadAll)
  .post(ctrlReviews.reviewsCreate);

router
  .route('/reviews/:reviewid')
  .get(ctrlReviews.reviewsReadById)
  .put(ctrlReviews.reviewsUpdateById)
  .delete(ctrlReviews.reviewsDeleteById);

module.exports = router;