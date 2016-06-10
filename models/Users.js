"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id:      String,
  uid:      String,
  server:   String,
  channel:  String,
  username: String,
  messages: Number,
  score:    Number
}, { collection: 'users' });

module.exports = mongoose.model('Users', userSchema);