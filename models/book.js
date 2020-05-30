const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bookSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  library: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'free'
  },
  category: {
    type: String,
    required: true
  }


})

module.exports = Book = mongoose.model('book',bookSchema,'books')