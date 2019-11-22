require('dotenv').config();
const mocha = require('mocha');
const chai = require('chai');
const db = require('./db');

describe('Database connection', () => {
  it('Should connect to database and close the connection', function(done) {
    db.initDb(error => {
      chai.assert.isUndefined(error);
      db.closeDb(err => {
        chai.assert.isUndefined(err);
        done(err);
      });
    });
  });
});
