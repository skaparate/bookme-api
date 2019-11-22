require('dotenv').config();
const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const db = require('./db');
const user = require('./user');
const log = require('../logger').child({
    test: 'user.model'
});

describe('User Model Tests', function(done) {
  const userList = [
    {
      name: 'user 1',
      password: 'abc'
    },
    {
      name: 'user 2',
      password: 'def'
    },
    {
      name: 'user 3',
      password: 'ghi'
    }
  ];

  const deleteUser = new user({
    name: 'delete-me',
    password: 'deleteme-pass'
  });

  const alice = new user({
    name: 'Alice Mcdonald',
    password: 'super-secure'
  });

  this.beforeAll(function(done) {
    db.initDb(function(err) {
      if (err) {
        done(err);
      }

      user.insertMany(userList, function(insertErr, docs) {
        if (insertErr) {
          return done(insertErr);
        }
        deleteUser.save(function(saveErr, saved) {
          if (saveErr) {
            return done(saveErr);
          }

          expect(saved).to.not.be.undefined;
          deleteUser._id = saved._id;
          expect(deleteUser._id).to.equal(saved._id);
          done();
        });
      });
    });
  });

  it('Should create a new user', function(done) {
    alice.save(function(err, saved) {
      if (err) {
        return done(err);
      }
      log.debug('Saved document:', saved);
      expect(saved.name).to.equal(alice.name);
      expect(saved.password).to.equal(alice.password);
      expect(saved).to.have.property('createdAt');
      done();
    });
  });

  it('Should retrieve a list of users', function(done) {
    user.find(function(err, docs) {
      if (err) {
        return done(err);
      }
      expect(docs).to.not.be.undefined;
      expect(docs).to.have.lengthOf.at.least(3);

      docs.forEach(i => {
        expect(i).to.have.property('name');
        expect(i).to.have.property('password');
      });
      done();
    });
  });

  it('Should update an existing user', function(done) {
    const payload = {
      name: 'Not Alice Anymore',
      password: 'Her new Password'
    };
    alice.updateOne(payload, function(updateErr, doc) {
      if (updateErr) {
        return done(updateErr);
      }

      expect(doc.nModified).to.equal(1);
      expect(doc.ok).to.equal(1);
      user
        .find()
        .findByName(payload.name)
        .exec(function(err, result) {
          if (err) {
            return done(err);
          }
          log.debug('Result:', result);
          expect(result).to.not.be.undefined;
          expect(result).to.have.lengthOf(1);
          expect(result[0].name).to.equal(payload.name);
          expect(result[0].password).to.equal(payload.password);
          done();
        });
    });
  });

  it('Should delete a user', function(done) {
    user.findByIdAndDelete(deleteUser._id, function(err, doc) {
      if (err) {
        return done(err);
      }
      expect(doc._id).to.eql(deleteUser._id);
      done();
    });
  });

  this.afterAll(function(done) {
    user.deleteMany().then(
      function() {
        db.closeDb(done);
      },
      function(err) {
        db.closeDb(function(error) {
          if (err) {
            return done(err);
          }
          done(error);
        });
      }
    );
  });
});
