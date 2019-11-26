const mongoose = require('mongoose');
const { books, comments } = require('../models/index').models;
const log = require('../logger').child({
  controller: 'book'
});

class BookController {
  list(done, filter = {}) {
    const match = Object.assign({}, filter);

    books
      .aggregate([
        {
          $match: match
        },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'bookId',
            as: 'comments'
          }
        },
        {
          $addFields: {
            commentcount: {
              $size: '$comments'
            }
          }
        },
        {
          $project: {
            comments: 0
          }
        }
      ])
      .exec(function(err, result) {
        if (err) {
          log.error('Failed to retrieve book list:', err);
          return done('no books');
        }
        done(null, result);
      });
  }

  add(bookData, done) {
    if (!bookData.title) {
      return done('Not enough data');
    }

    const book = new books({
      title: bookData.title,
      authors: bookData.authors || []
    });
    book.save(function(err, doc) {
      if (err) {
        log.error('Failed to store the book:', err);
        return done('Failed to save the book');
      }
      done(null, {
        title: doc.title,
        _id: doc._id
      });
    });
  }

  byId(id, done) {
    log.debug('Getting book "%s"', id);
    books
      .aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(id)
          }
        },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'bookId',
            as: 'comments'
          }
        }
      ])
      .exec(function(err, result) {
        if (err || result.length === 0) {
          log.error('Failed to retrieve book "%s"', id, err);
          return done('no book exists');
        }
        log.debug('Read book:', result);
        done(null, result[0]);
      });
  }

  remove(id, done) {
    log.info('Attempting to remove book "%s"', id);
    books.findByIdAndRemove(id, function(err) {
      if (err) {
        log.error('Failed to remove the book "%s"', id, err);
        return done('no book exists');
      }
      log.info('Book "%s" removed', id);
      return done(null, 'delete successful');
    });
  }

  clearBooks(done) {
    comments.deleteMany({}, function(err) {
      if (err) {
        log.error('Failed to remove the comments:', err);
        return done('no comments removed');
      }
      books.deleteMany({}, function(err) {
        if (err) {
          log.error('Failed to delete all books:', err);
          return done('no books removed');
        }
        done(null, 'complete delete successful');
      });
    });
  }

  addComment(bookid, commentData, done) {
    const self = this;
    log.debug('Trying to create a comment:', commentData);
    if (!commentData || !commentData.content) {
      return done('not enough data');
    }
    books.findById(bookid, function(err, book) {
      if (err) {
        log.error('Failed to retrieve book "%s":', bookid, err);
        return done('no book exists');
      }
      if (!book._id) {
        log.info('The book "%s" does not exist', bookid);
        return done('no book exists');
      }
      const comment = new comments({
        content: commentData.content,
        user: commentData.user,
        bookId: book._id
      });
      comment.save(function(err, doc) {
        if (err) {
          log.error('Failed to create the comment:', err);
          return done('Could not create the comment');
        }
        self.byId(bookid, done);
      });
    });
  }
}

module.exports = BookController;
