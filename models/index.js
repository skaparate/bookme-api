const db = require('./db');
const users = require('./users');
const books = require('./books');

module.exports = {
  db,
  models: {
    books,
    users
  }
};
