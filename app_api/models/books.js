const mongoose = require('mongoose');
//const { reviewSchema } = require('./reviews');
//const Review = mongoose.model('Review', reviewSchema);

const bookSchema = new mongoose.Schema({
  "book title": {
    type: String,
    required: true
  },
  "author name": {
    type: String,
    required: true
  },
  "book url": {
    type: String,
    required: true
  },
  "book cover url": {
    type: String,
    required: true
  },
  "book genres": {
    type: String,
    required: true
  },
  "book editorial notes": {
    type: String,
    required: true
  }
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

//Calculated attributes
bookSchema.virtual("reviews", {
  ref: 'Review',
  localField: '_id',
  foreignField: 'bookid',
  justOne: false
}).get(function(result=[]) {
  return result.filter(review => !review.isDeleted);
});

bookSchema.virtual("actual book ratings").get(function() {
  return this.reviews.length;
});

bookSchema.virtual("actual book Avg rating").get(function() {
  return this.reviews.reduce((sum, { rating }) => sum + rating, 0) / (this.reviews.length || 1);
});

bookSchema.virtual("last Updated on").get(function() {
  return new Date(Math.max(...this.reviews.map(review => new Date(review["updated on"]))));
});

mongoose.model('Book', bookSchema);