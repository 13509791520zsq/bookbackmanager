const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  No: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cardid: {
    type: String,
    required: true
  },
  power: {
    type: Number,
    required: true,
    default: 1
  },
  numberid: {
    type: String,
    required: true
  }
})

module.exports = User = mongoose.model('user',userSchema,'users')