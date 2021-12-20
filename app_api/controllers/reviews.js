const mongoose = require('mongoose');
const Book = mongoose.model('Book');
const Review = mongoose.model('Review');
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "us3",
  useTLS: true
});

// const getUser = require('./authentication');
// const reviewsCUDWithAuth = (req, res) => {
//   getUser(req, res, reviewsCUD);
// }

const CHANNEL = process.env.CHANNEL;
const SOFT_DELETE = process.env.SOFT_DELETE === 'true';

//Create, Update, Delete
const reviewsCreate = async(req, res) => {
  const { username, bookid, rating, reviewText } = req.body;
  if (!username || !bookid || !reviewText) {
    return res
      .status(400)
      .json({ "message": "Missing review fields!" });
  }
    
  const book = await Book.findById(bookid);
  if (!book) {
    return res
      .status(404)
      .json({ "message": "Error finding the book!" });
  }
  //check if user already posted review for this book and make it an update
  const userReview = await Review.findOne({ username, bookid });
  if (userReview) {
    req.params = {
      ...req.params, 
      "reviewid": userReview["_id"], 
      book: book["_doc"]
    };
    return reviewsUpdateById(req, res);
  } else {
    const review = {
      username,
      bookid,
      "rating": parseFloat(rating) || 0,
      "review text": reviewText
    };

    let newReview = await Review.create(review);
    if (!newReview) {
      return res
        .status(400)
        .json({ "message": "Error adding new review!" });
    }

    const response = {...newReview._doc, book: book["_doc"]};
    await pusher.trigger(
      CHANNEL,
      "reviews",
      response
    )
    return res
      .status(201)
      .json(response);
  }
}

//Update
const reviewsUpdateById = async(req, res) => {
  const reviewid = req.params["reviewid"];
  const book = req.params["book"];
  const { username, bookid, rating, reviewText } = req.body;
  if (!reviewid || !username || !bookid || !reviewText) {
    return res
      .status(400)
      .json({ "message": "Missing review fields!" });
  }

  const options = { new: true };
  const parsedRating =  parseFloat(rating) || 0;
  const review = {
    username,
    bookid,
    "rating": parsedRating,
    "review text": reviewText,
    "isDeleted": false
  };

  //Dont update or trigger feed if no change
  let storedPreview = await Review.findById(reviewid);
  if (
    storedPreview.bookid === bookid &&
    storedPreview["rating"] === parseFloat(rating) &&
    storedPreview["review text"] === reviewText &&
    !storedPreview["isDeleted"]
  ) {
    return res
    .status(200)
    .json(storedPreview);
  }

  let newReview = await Review.findByIdAndUpdate(reviewid, review, options);
  if (!newReview) {
    return res
      .status(400)
      .json({ "message": "Error updating review!" });
  }

  const response = {...newReview._doc, book};
  await pusher.trigger(
    CHANNEL,
    "reviews",
    response
  )
  return res
    .status(200)
    .json(response);
}

//Delete
const reviewsDeleteById = async(req, res) => {
  const reviewid = req.params.reviewid;
  if (!reviewid) {
    return res
      .status(400)
      .json({ "message": "reviewid is required!" });
  }

  let review;
  if (SOFT_DELETE) {
    const options = { new: true };
    review = await Review.findByIdAndUpdate(reviewid, {isDeleted: true}, options);
  } else {
    review = await Review.findByIdAndRemove(reviewid);
  }

  if (!review) {
    return res
      .status(404)
      .json({ "message": "Error finding the review!" });
  }

  return res
    .status(200)
    .json({"status": 204, "message": "Delete Success!"});
}

//Reads
const reviewsReadAll = async(req, res) => {
  //read with query e.g /?username=bashar or /?bookid=
  const query = { ...req.query, isDeleted: false };
  const reviews = await Review.find(query)
    .lean()
    .populate('book')
    .select(["-isDeleted", "-__v"])
    .sort({"updated on": -1});
  if (!reviews) {
    return res
      .status(404)
      .json({ "message": "Error finding reviews!" });
  }
  return res
    .status(200)
    .json(reviews);
}

const reviewsReadById = async(req, res) => {
  const reviewid = req.params.reviewid;
  if (!reviewid) {
    return res
      .status(400)
      .json({ "message": "reviewid are required!" });
  }

  const review = await Review.findOne({_id: reviewid, isDeleted: false})
    .lean()
    .populate('book')
    .select(["-isDeleted", "-__v"]);

  if (!review) {
    return res
      .status(404)
      .json({ "message": "Error finding the review!" });
  } 
  
  return res
    .status(200)
    .json(review);
}

module.exports = {
  reviewsCreate,
  reviewsUpdateById,
  reviewsDeleteById,
  reviewsReadAll,
  reviewsReadById
};