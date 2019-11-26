require('dotenv').config();
require('mocha');
const chai = require('chai');
const expect = chai.expect;
const db = require('./db');
const books = require('./books');
const comments = require('./comments');
const log = require('../logger').child({
  test: 'comments.model'
});

describe('Testing Comments Model', function(done) {
  let book = new books({
    title: 'The book',
    authors: ['Me']
  });
  let bookComments;

  this.beforeAll(function(done) {
    db.initDb(function(err) {
      if (err) {
        return done(err);
      }

      book.save(function(err, doc) {
        if (err) {
          return db.closeDb(function(err) {
            return done(err);
          });
        }

        book = doc;
        expect(book._id).to.not.be.undefined;

        bookComments = [
          new comments({
            user: 'skaparate',
            content:
              '... sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
            bookId: book._id
          }),
          new comments({
            user: 'issac',
            content: 'Ut enim ad minim veniam',
            bookId: book._id
          }),
          new comments({
            user: 'cassi',
            content: 'Excepteur sint occaecat cupidatat non proident',
            bookId: book._id
          })
        ];
        comments.insertMany(bookComments, function(err, inserted) {
          if (err) {
            return done(err);
          }

          done();
        });
      });
    });
  });

  it('Should create a comment', function(done) {
    let newComment = new comments({
      user: 'johnny',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      bookId: book._id
    });
    newComment.save(function(err, doc) {
      if (err) {
        return done(err);
      }
      expect(doc._id).to.not.be.undefined;
      expect(doc.user).to.equal(newComment.user);
      expect(doc.content).to.equal(newComment.content);
      done();
    });
  });

  it('Should read a comment by user "skaparate"', function(done) {
    const query = {
      user: 'skaparate'
    };
    comments.find(query, function(err, docs) {
      if (err) {
        return done(err);
      }
      expect(docs).to.have.lengthOf(1);
      expect(docs[0].user).to.equal(query.user);
      expect(docs[0].content).to.equal(
        bookComments.filter(i => i.user === query.user)[0].content
      );
      expect(docs[0].createdAt).to.not.be.undefined;
      expect(docs[0].updatedAt).to.not.be.undefined;
      done();
    });
  });

  it('Should retrieve a list of comments by book', function(done) {
    const query = {
      bookId: book._id
    };
    comments.find(query, function(err, docs) {
      if (err) {
        return done(err);
      }
      expect(docs).to.have.lengthOf.at.least(2);
      done();
    });
  });

  it('Should delete a comment', function(done) {
    const query = {
      user: 'issac'
    };
    comments.findOneAndRemove(query, function(err, res) {
      if (err) {
        return done(err);
      }
      expect(res).to.not.be.undefined;
      expect(res.user).to.equal(query.user);
      done();
    });
  });

  it('Should update a comment', function(done) {
    const query = {
      user: 'skaparate'
    };
    const update = { content: 'The updated content' };
    comments.findOneAndUpdate(query, update, function(err, doc) {
      if (err) {
        return done(err);
      }
      expect(doc._id).to.not.be.undefined;
      comments.findById(doc._id, function(err, updated) {
        if (err) {
          return done(err);
        }
        expect(updated).to.not.be.undefined;
        expect(updated.content).to.equal(update.content);
        expect(updated._id).to.eql(doc._id);
        done();
      });
    });
  });

  this.afterAll(function(done) {
    comments.deleteMany({}, function(err) {
      book.remove(function(err) {
        db.closeDb(done);
      });
    });
  });
});
