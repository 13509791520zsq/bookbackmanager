const express = require('express')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const passport = require('passport')
const keys = require('./config/keys')



const app = express()


const users= require("./router/users")
const books = require('./router/books')


//开放静态资源文件夹
app.use("/static/",express.static(path.join(__dirname, 'static')))
//bodyparser用于解析请求参数
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

//passport 初始化
app.use(passport.initialize())
require('./config/passport')(passport)


mongoose.connect(keys.mongoURL)
        .then(()=>console.log("mongodb connected"))
        .catch(err=>console.log(err))










app.get('/',(req,res)=>{
  res.json({message:'hello service!'})
})




app.use("/users",users)
app.use("/books",books)



app.use('/*',(req,res)=>{
  res.send("404")
})


const port = process.env.PORT ||3000
app.listen(port,()=>{
  console.log(`server running on port ${port}`)
})