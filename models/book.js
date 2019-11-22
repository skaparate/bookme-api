const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class Book {
  constructor() {
    const name = 'book';
    const bookSchema = new Schema({
      title: String,
      author: Array,
      createdAt: Date,
      updatedAt: Date,
      userId: mongoose.ObjectId
    });
    return mongoose.model(name, bookSchema);
  }

  toString() {
    return name;
  }
}

module.exports = new Book();
