const mongoose = require('mongoose');
const Book = mongoose.model('Book');

const booksReadOne = async(req, res) => {
  const bookid = req.params.bookid;
  if (!bookid) {
    return res
    .status(400)
    .json({ "message": "bookid is required!" });
  }

  const book = await Book.findById(bookid)
  .populate('reviews')
  .select(["-reviews.isDeleted", "-reviews.id", "-reviews.__v"])

  if (!book) {
    return res
      .status(404)
      .json({ "message": "Book not found" });
  }

  return res
    .status(200)
    .json(book);
};

const booksReadAll = async(req, res) => {
  const books = await Book.find()
    .populate("reviews")
    .select(["-reviews.isDeleted", "-reviews.id", "-reviews.__v"])
    .sort({ "reviews.updated on": -1 });
  if (!books || !books.length) {
    return res
      .status(404)
      .json({ "message": "No books were found" });
  }

  return res
    .status(200)
    .json(books)
};

module.exports = {
  booksReadOne,
  booksReadAll
};
