const mongoose = require('mongoose');

const chat = mongoose.Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
  date: {type: String, required: true}
});

module.exports = mongoose.model('Chat', chat);