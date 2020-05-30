const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const Book = require('../models/book')
const Borrow = require('../models/borrow')
const User = require('../models/user')
const passport = require('passport')

//passport.authenticate('jwt',{session: false})
//设置使用findbyidanddelete()....
mongoose.set('useFindAndModify', false)


router.get('/',(req,res)=>{
  res.json({message: "hello"})
})


//书记录入接口 参数书籍信息
//$route  POST /books/entrybooks
//@desc   返回修改状态
//@acess  private
//status  200 成功 ， 400 密码错误， 404 用户不存在 ，500 未知错误
router.post('/entrybooks', passport.authenticate('jwt',{session: false}),(req,res)=>{
  if(req.user.power===3){
    let books = req.body.books
    books.array.forEach(element => {
      if(element.name){
        if(element.author){
          if(element.date){
            
            if(element.library){
              if(element.category){
                let newbooks = new Book({element})
                newbooks.save().then(books=>res.status(200).json({message: '录入成功！'})).catch(err=>console.log(err))
              }else{console.log("缺少书籍类别")}
            }else{console.log("缺少书籍书库名")}
          }else{console.log("缺少书籍出版时间")}
        }else{console.log("缺少书籍作者")}
      }else{console.log("缺少书籍名字")}
    })
    res.status(400).json({message: '录入失败，缺少信息！'})
  }
})


//书记录入接口 参数书籍信息
//$route  POST /books/entrybooks
//@desc   返回修改状态
//@acess  private
//status  200 成功 ， 400 密码错误， 404 用户不存在 ，500 未知错误
router.post('/entrybook', passport.authenticate('jwt',{session: false}),(req,res)=>{
  if(req.user.power===3){
    let element ={}
      if(req.body.name){ element.name= req.body.name }else{console.log("缺少书籍名字")}
      if(req.body.author){   element.author= req.body.author     }else{console.log("缺少书籍作者")}
      if(req.body.date){     element.date= req.body.date     }else{console.log("缺少书籍出版时间")}
      if(req.body.library){   element.library= req.body.library         }else{console.log("缺少书籍书库名")}
      if(req.body.category){   element.category= req.body.category           }else{console.log("缺少书籍类别")}
      let newbooks = new Book(element)
      newbooks.save().then(books=>res.status(200).json(books)).catch(err=>console.log(err))

  }
})



//书记删除接口 参数书籍id
//$route  POST /books/deletebooks
//@desc   返回修改状态
//@acess  private
//status  200 成功 ， 400 密码错误， 404 用户不存在 ，500 未知错误
router.post('/deletebooks', passport.authenticate('jwt',{session: false}),(req,res)=>{
  if(req.body.id){
    Book.deleteOne({_id: req.body.id},(err)=>{
      if(err){
        throw err
      }else{
        res.status(200).json({message: '删除成功！'})
      }
    })
  }
})


//书记查找接口 参数书籍信息
//$route  POST /books/querybooks
//@desc   返回修改状态
//@acess  private
//status  200 成功 ， 400 密码错误， 404 用户不存在 ，500 未知错误
router.post('/querybooks', passport.authenticate('jwt',{session: false}),(req,res)=>{
  let bookinfo ={}
  if(req.body.id){bookinfo.id = req.body.id}
  if(req.body.name){bookinfo.name = req.body.name}
  if(req.body.author){bookinfo.author = req.body.author}
  bookinfo.status = 'free'
  console.log(bookinfo)
  Book.find(bookinfo,(err,doc)=>{
    if(err){
      throw err
    }else{
      res.status(200).json(doc)
    }
  })

})


//书籍借阅接口 参数书籍bookid，饭卡信息cardid
//$route  POST /books/borrowbooks
//@desc   返回修改状态
//@acess  private
//status  200 成功 ， 400 密码错误， 404 用户不存在 ，500 未知错误
router.post('/borrowbooks', passport.authenticate('jwt',{session: false}),(req,res)=>{
    Book.findOne({_id: req.body.bookid,status: 'free'},(err,book)=>{
      if(book){
        book.status = 'lend'
        book.save().then(book=>{
          console.log(`${book.name}已借出`)
        }).catch(err=>console.log(err))
        let borrowbook = {
          bookname: book.name,
          bookid: book._id,
          name: req.body.name,
          cardid: req.body.cardid,
          date: new Date(),
          library: book.library,
          category: book.category
        }
        let borrow = new Borrow(borrowbook)
        borrow.save().then(doc=>{
          res.status(200).json(doc)
        }).catch(err=>console.log(err))
      }
    })


})


//按书库借阅统计接口 参数书库名library
//$route  POST /books/censusbooks
//@desc   返回统计数据
//@acess  private
//status  200 成功 ， 400 密码错误， 404 用户不存在 ，500 未知错误
router.post('/censusbooks', passport.authenticate('jwt',{session: false}),(req,res)=>{
  Borrow.find({library: req.body.library},(err,doc)=>{
    if(err){
      throw err
    }else{
      res.status(200).json(doc)
    }
  })
})

//个人借阅统计接口 参数卡号cardid
//$route  POST /books/censuspersonalbooks
//@desc   返回统计数据
//@acess  private
//status  200 成功 ， 400 密码错误， 404 用户不存在 ，500 未知错误
router.post('/censuspersonalbycardid', passport.authenticate('jwt',{session: false}),(req,res)=>{
  Borrow.find({cardid: req.body.cardid},(err,doc)=>{
    if(err){
      throw err
    }else{
      res.status(200).json(doc)
    }
  })
})


//超时借阅统计接口 参数
//$route  POST /books/censusovertimebooks
//@desc   返回统计数据
//@acess  private
//status  200 成功 ， 400 密码错误， 404 用户不存在 ，500 未知错误
router.post('/censusovertimebooks', passport.authenticate('jwt',{session: false}),(req,res)=>{
  Borrow.find({},(err,doc)=>{
    if(err){
      throw err
    }else{
      let datenew = new Date()
      let d1 = datenew.getTime()
      doc.forEach((element)=>{
        let d2 = element.date.getTime()
        let d3 = parseInt((d1-d2)/1000/60/60/24)
        if(d3>30){
          element.overtime = d3-30
          element.save().then(element=>{console.log(element)})
        }
      })
    }
  })
  Borrow.find({overtime: {$gt: 0}},(err,doc)=>{
    if(err){
      throw err
    }else{
      res.status(200).json(doc)
    }
  })

})

//个人超时借阅统计接口 参数
//$route  POST /books/ownerovertimebooks
//@desc   返回统计数据
//@acess  private
//status  200 成功 ， 400 密码错误， 404 用户不存在 ，500 未知错误
router.post('/ownerovertimebooks', passport.authenticate('jwt',{session: false}),(req,res)=>{
  Borrow.find({_id: req.user.id},(err,doc)=>{
    if(err){
      throw err
    }else{
      let datenew = new Date()
      let d1 = datenew.getTime()
      doc.forEach((element)=>{
        let d2 = element.date.getTime()
        let d3 = parseInt((d1-d2)/1000/60/60/24)
        if(d3>30){
          element.overtime = d3-30
          element.save().then(element=>{console.log(element)})
        }
      })
    }
  })
  Borrow.find({_id: req.user.id,overtime: {$gt: 0}},(err,doc)=>{
    if(err){
      throw err
    }else{
      res.status(200).json(doc)
    }
  })

})


//查询书籍超时情况接口 参数书籍id
//$route  POST /books/querybookborrow
//@desc   返回统计数据
//@acess  private
//status  200 成功 ， 400 密码错误， 404 用户不存在 ，500 未知错误
router.post('/querybookborrow', passport.authenticate('jwt',{session: false}),(req,res)=>{
  Borrow.find({bookid: req.body.id},(err,doc)=>{
    if(err){
      throw err
    }else{
      res.status(200).json(doc)
    }
  })


})



//还书接口 参数书籍id
//$route  POST /books/returnbook
//@desc   返回统计数据
//@acess  private
//status  200 成功 ， 400 密码错误， 404 用户不存在 ，500 未知错误
router.post('/returnbook', passport.authenticate('jwt',{session: false}),(req,res)=>{
  Book.findByIdAndUpdate({_id: req.body.id},{status: 'free'},(err,doc)=>{
    if(err){
      throw err
    }else{
      console.log('图书已空闲！')
    }
  })
  Borrow.deleteOne({bookid: req.body.id},(err,doc)=>{
    if(err){
      throw err
    }else{
      res.status(200).json({message: '图书已归还！'})
    }
  })
})








module.exports = router