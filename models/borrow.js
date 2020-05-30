const mongoose = require('mongoose')
const Schema = mongoose.Schema
const borrowSchema = new Schema({
  bookname: {
    type: String,
    required: true
  },
  bookid:{
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  cardid: {
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
    default: 'lend'
  },
  category: {
    type: String,
    required: true
  },
  overtime: {
    type: Number,
    required: true,
    default: 0
  }


})

module.exports = Borrow = mongoose.model('borrow',borrowSchema,'borrows')