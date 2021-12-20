const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  "username": {
    type: String
  },
  "bookid": {
    type: String,
    required: true,
  },
  "rating": {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  "review text": {
    type: String,
    required: true
  },
  "updated on": {
    type: Date,
    'default': Date.now
  },
  "isDeleted": {
    type: Boolean,
    'default': false
  } 
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

reviewSchema.virtual("book", {
  ref: 'Book',
  localField: 'bookid',
  foreignField: '_id',
  justOne: true
});

module.exports = {
  reviewSchema
}

mongoose.model('Review', reviewSchema);

