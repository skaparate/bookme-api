const chai = require('chai');
const assert = chai.assert;
const book = require('../models/book');
const mongoose = require('mongoose');

suite('Unit Tests', function() {
  //No unit tests needed for this project
  test('Book should be of type mongoose.Model', function() {
    assert.equal(typeof book, mongoose.model);
  });
});
