require('dotenv').config();
const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const db = require('./db');
const books = require('./books');
const users = require('./users');
const log = require('../logger').child({
  test: 'book.model'
});

describe('Book model tests', function() {
  this.beforeAll(function(done) {});

  this.afterAll(function(done) {});
});
