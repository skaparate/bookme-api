require('dotenv').config();
require('mocha');
const chai = require('chai');
const expect = chai.expect;
const db = require('./db');
const books = require('./books');
const users = require('./users');
const log = require('../logger').child({
  test: 'book.model'
});

describe('Book model tests', function() {
  let alice = new users({
    name: 'Alice Mcdonald',
    password: 'super-secure'
  });
  let bookListLen = 0;

  let bookList = [];

  this.beforeAll(function(done) {
    db.initDb(function(err) {
      if (err) {
        return done(err);
      }
      // Save user
      alice.save(function(err, doc) {
        if (err) {
          return done(err);
        }
        alice = doc;
        expect(alice._id).to.not.be.undefined;

        bookList.push({
          title: 'Thinking in Java',
          authors: ['Bruce Eckel'],
          userId: alice._id
        });

        bookList.push({
          title: 'Thinking in C++',
          authors: ['Bruce Eckel'],
          userId: alice._id
        });

        bookList.push({
          title: 'Moby-Dick',
          authors: ['Herman Melville'],
          userId: alice._id
        });

        bookList.push({
          title: 'Crónicas de una Muerte Anunciada',
          authors: ['Gabriel García Márquez'],
          userId: alice._id
        });

        // Save books
        books.insertMany(bookList, function(err, docs) {
          if (err) {
            return done(err);
          }
          bookList = docs;
          bookListLen = bookList.length;
          done();
        });
      });
    });
  });

  it('Should add a new book', function(done) {
    const newBook = new books({
      title: 'The Lord of the Rings',
      authors: ['John Ronald Reuel Tolkien'],
      userId: alice._id
    });

    newBook.save(function(err, doc) {
      if (err) {
        return done(err);
      }
      expect(doc).to.not.be.undefined;
      expect(doc._id).to.not.be.undefined;
      expect(doc.createdAt).to.not.be.undefined;
      expect(doc.title).to.equal(newBook.title);
      done();
    });
  });

  it('Should update a book', function(done) {
    const update = {
      title: 'The Lord of the Rings, The Fellowship of the Ring'
    };

    const query = {
      title: new RegExp('The Lord of the Rings')
    };

    // Here we should find by title and userId,
    // but since it's just a test and, hence controlled,
    // we skip it.
    books.findOne(query, function(err, found) {
      if (err) {
        return done(err);
      }
      log.debug('Found document:', found);
      expect(found).to.not.be.undefined;

      found.updateOne(update, function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res.nModified).to.equal(1);
        books.findOne(
          {
            title: new RegExp(update.title)
          },
          function(err, doc) {
            if (err) {
              return done(err);
            }
            expect(doc.title).to.equal(update.title);
            expect(doc.userId).to.eql(found.userId);
            expect(doc._id).to.eql(found._id);
            done();
          }
        );
      });
    });
  });

  it('Should retrieve a list of books', function(done) {
    books.find({}, function(err, docs) {
      if (err) {
        return done(err);
      }
      expect(docs).to.have.lengthOf.at.least(3);
      done();
    });
  });

  it('Should filter the list of books', function(done) {
    books.find(
      {
        authors: new RegExp('eckel', 'i')
      },
      function(err, docs) {
        if (err) {
          return done(err);
        }
        expect(docs).to.have.lengthOf.at.least(1);
        expect(docs[0].authors).to.contain('Bruce Eckel');
        done();
      }
    );
  });

  it('Should delete a book', function(done) {
    books.findOneAndRemove(
      {
        title: 'Thinking in C++'
      },
      function(err, res) {
        if (err) {
          return done(err);
        }

        expect(res.userId).to.eql(alice._id);
        expect(res.title).to.equal('Thinking in C++');
        done();
      }
    );
  });

  this.afterAll(function(done) {
    books.deleteMany(function(err) {
      if (err) {
        return db.closeDb(function(err) {
          done(err);
        });
      }
      alice.remove(function(err, doc) {
        db.closeDb(done);
      });
    });
  });
});
