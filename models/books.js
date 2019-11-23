const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const name = 'books';
const bookSchema = new Schema(
  {
    title: String,
    authors: Array,
    createdAt: Date,
    updatedAt: Date,
    userId: mongoose.ObjectId
  },
  {
    timestamps: true
  }
);

bookSchema.query.findByTitle = function(title) {
  return this.where({ title: new RegExp(title, 'i') });
};

module.exports = mongoose.model(name, bookSchema);
