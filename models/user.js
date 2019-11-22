const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const name = 'users';
const schema = new Schema(
  {
    name: String,
    alias: String,
    password: String,
    createdAt: Date,
    updatedAt: Date
  },
  {
    timestamps: true
  }
);

schema.query.findByName = function(name) {
  return this.where({
    name: new RegExp(name, 'i')
  });
};

module.exports = mongoose.model(name, schema);
