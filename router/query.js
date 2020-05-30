const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const User = require('../models/book')
const passport = require('passport')

//passport.authenticate('jwt',{session: false})
//设置使用findbyidanddelete()....
mongoose.set('useFindAndModify', false)

router.get('/',(req,res)=>{
  res.json({message: "hello"})
})

router.get('login',(req,res)=>{
  res.json({success:true})
})











module.exports = router