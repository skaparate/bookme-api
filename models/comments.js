const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const name = 'comments';
const schema = new Schema(
  {
    user: String,
    content: String,
    bookId: mongoose.ObjectId
    // Removed to acommodate FCC tests.
    // userId: mongoose.ObjectId
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(name, schema);
