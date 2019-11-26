/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  // /*
  // * ----[EXAMPLE TEST]----
  // * Each test should completely test the response of the API end-point including response status code!
  // */
  test('#example Test GET /api/books', function(done) {
    chai
      .request(server)
      .get('/api/books')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(
          res.body[0],
          'commentcount',
          'Books in array should contain commentcount'
        );
        assert.property(
          res.body[0],
          'title',
          'Books in array should contain title'
        );
        assert.property(
          res.body[0],
          '_id',
          'Books in array should contain _id'
        );
        done();
      });
  });
  // /*
  // * ----[END of EXAMPLE TEST]----
  // */

  suite('Routing tests', function() {
    suite(
      'POST /api/books with title => create book object/expect book object',
      function() {
        test('Test POST /api/books with title', function(done) {
          const payload = {
            title: 'Book X',
            authors: ['skaparate']
          };

          chai
            .request(server)
            .post('/api/books')
            .send(payload)
            .end(function(err, res) {
              if (err) {
                return done(err);
              }
              assert.equal(res.status, 200);
              assert.equal(res.body.title, payload.title);
              assert.isDefined(res.body._id);
              done();
            });
        });

        test('Test POST /api/books with no title given', function(done) {
          const payload = {
            authors: ['skaparate']
          };

          chai
            .request(server)
            .post('/api/books')
            .send(payload)
            .end(function(err, res) {
              if (err) {
                return done(err);
              }
              assert.equal(res.status, 200);
              assert.isUndefined(res.body.title);
              assert.isUndefined(res.body._id);
              done();
            });
        });
      }
    );

    suite('GET /api/books => array of books', function() {
      test('Test GET /api/books', function(done) {
        chai
          .request(server)
          .get('/api/books')
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.isNotEmpty(res.body);
            assert.property(
              res.body[0],
              'commentcount',
              'Books in array should contain commentcount'
            );
            assert.property(
              res.body[0],
              'title',
              'Books in array should contain title'
            );
            assert.property(
              res.body[0],
              '_id',
              'Books in array should contain _id'
            );
            done();
          });
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function() {
      test('Test GET /api/books/[id] with id not in db', function(done) {
        const id = '5ddd7385e72f0b81ff027666'; // Generated

        chai
          .request(server)
          .get('/api/books/' + id)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function(done) {
        // This id should exist
        const id = '5ddd721a3075467bb3bb183d';
        chai
          .request(server)
          .get('/api/books/' + id)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'A book 1');
            assert.isDefined(res.body.comments);
            assert.isArray(res.body.comments);
            done();
          });
      });
    });

    suite(
      'POST /api/books/[id] => add comment/expect book object with id',
      function() {
        test('Test POST /api/books/[id] with comment', function(done) {
          const id = '5ddd721a3075467bb3bb183d';
          const comment = {
            content: 'Lorem ipsum',
            user: 'skaparate'
          };

          chai
            .request(server)
            .post('/api/books/' + id)
            .send(comment)
            .end(function(err, res) {
              if (err) {
                return done(err);
              }
              assert.equal(res.status, 200);
              assert.equal(res.body.title, 'A book 1');
              assert.isDefined(res.body.comments);
              assert.isArray(res.body.comments);
              const filter = res.body.comments.filter(
                i => i.content === comment.content
              );
              assert.isAtLeast(filter.length, 1);
              done();
            });
        });
      }
    );
  });
});
