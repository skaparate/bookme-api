const db = require('./db');
const users = require('./users');
const books = require('./books');
const comments = require('./comments');

module.exports = {
  db,
  models: {
    books,
    users,
    comments
  }
};
