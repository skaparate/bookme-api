const router = require('express').Router();
const log = require('../logger').child({
  route: 'book'
});
const BookController = require('../controllers/book-controller');

module.exports = _ => {
  log.debug('Defining book routes');

  router.use(function(req, res, next) {
    log.debug('Defining controllers');
    req.controller = new BookController();
    next();
  });

  router
    .route('/api/books')
    .post((req, res) => {
      log.debug('Trying to create a new book');
      const { body } = req;
      log.debug('Book content:', body);
      req.controller.add(body, function(err, doc) {
        return res.json(err || doc);
      });
    })
    .get((req, res) => {
      console.debug('Retrieving book list');
      req.controller.list(function(err, docs) {
        res.json(err || docs);
      });
    })
    .delete((req, res) => {
      log.debug('Deleting every book');
      req.controller.clearBooks(function(err, result) {
        res.json(err || result);
      });
    });

  router
    .route('/api/books/:book_id')
    .get((req, res) => {
      const { book_id } = req.params;
      req.controller.byId(book_id, function(err, book) {
        res.json(err || book);
      });
    })
    .post((req, res) => {
      const { book_id } = req.params;
      req.controller.addComment(book_id, req.body, function(err, doc) {
        res.json(err || doc);
      });
    })
    .delete((req, res) => {
      const { book_id } = req.params;
      req.controller.remove(book_id, function(err, result) {
        res.json(err || result);
      });
    });

  return router;
};
