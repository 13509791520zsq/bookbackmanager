const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const User = require('../models/user')
const passport = require('passport')

//passport.authenticate('jwt',{session: false})
//设置使用findbyidanddelete()....
mongoose.set('useFindAndModify', false)

//超管写入接口
//$route  POST /users/login
//@desc   返回个人信息
//@acess  public
router.get('/',(req,res)=>{
  let root = {
    name: 'root',
    No: '201708030111',
    password: 'root',
    cardid: '1234567890',
    power: 3,
    numberid: '201708030111'
  }
  let user = new User(root)
  bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(user.password,salt,(err,hash)=>{
      if(err){
        throw err
      }
      user.password = hash
      user.save().then(user=>res.json(user)).catch(err=>console.log(err))
    })
  })
})

//登录接口    参数学号/工号 密码
//$route  POST /users/login
//@desc   返回个人信息
//@acess  public
//status  200 成功 ， 400 密码错误， 404 用户不存在 ，500 未知错误
router.post('/login',(req,res)=>{
  console.log(req.body.No)
  User.findOne({No: req.body.No})
      .then(user=>{
        if(!user){
          return res.status(404).json({message: '用户不存在'})
        }
        bcrypt.compare(req.body.password,user.password)
              .then(ismatch=>{
                if(ismatch){
                  const role ={
                    id: user._id,
                    No: user.No,
                    name: user.name,
                    power: user.power
                  }
                  jwt.sign(role,keys.secretOrKey,{expiresIn: 3600},(err,token)=>{
                    if(err){
                      throw err
                    }
                    res.status(200).json({token: "Bearer "+token})
                  })
                }else{
                  res.status(400).json({message: '密码错误！'})
                }
              })

      })
      .catch(err=>res.json(err))
})

//信息录入接口 参数用户信息数组 包含姓名学号密码卡号
//$route  POST /users/entry
//@desc   返回录入状态
//@acess  private
//status  200 成功 
router.post('/entryusers', passport.authenticate('jwt',{session: false}),(req,res)=>{
 
  student = req.body
  let user = new User(student)
  bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(user.password,salt,(err,hash)=>{
      if(err){
        throw err
      }
      user.password = hash
      user.save().then(user=>res.json({message:'录入成功！'})).catch(err=>console.log(err))
    })
  })

  
})

//用户注销接口 参数学号/卡号
//$route  POST /users/deleteuser
//@desc   返回删除状态
//@acess  private
//status  200 成功 ， 400 密码错误， 404 用户不存在 ，500 未知错误
router.post('/deleteuser', passport.authenticate('jwt',{session: false}),(req,res)=>{
  if(req.user.power===3){
    if(req.body.No){
      User.deleteOne({No: req.body.No},(err)=>{
        if(err){
          throw err
        }else{
          res.status(200).json({message: '删除成功！'})
        }
      })
    }
    if(req.body.cardid){
      User.deleteOne({cardid: req.body.cardid},(err)=>{
        if(err){
          throw err
        }else{
          res.status(200).json({message: '删除成功！'})
        }
      })
    }
  }else{
    res.status(403).json({message: '权限不足！'})
  }
})


//用户修改密码接口 参数原密码新密码
//$route  POST /users/editpassword
//@desc   返回修改状态
//@acess  private
//status  200 成功 ， 400 密码错误， 404 用户不存在 ，500 未知错误
router.post('/editpassword', passport.authenticate('jwt',{session: false}),(req,res)=>{
  if(req.body.password){
    User.findOne({_id: req.user.id})
        .then(user=>{
          bcrypt.compare(req.body.password,user.password)
                .then(ismatch=>{
                  if(ismatch){
                    bcrypt.genSalt(10,(err,salt)=>{
                      bcrypt.hash(req.body.newpassword,salt,(err,hash)=>{
                        if(err){
                          throw err
                        }
                        user.password = hash
                        user.save().then(user=>res.status(200).json({message: `${user.No}+'密码修改成功！'`})).catch(err=>console.log(err))
                      })
                    })
                  }else{
                    res.status(400).json({message: '密码输入错误'})
                  }
                })
        })
  }
})


//学生信息查询接口 参数饭卡cardid
//$route  POST /users/queryinfo
//@desc   返回学生信息
//@acess  private
//status  200 成功 ， 404 用户不存在 ，500 未知错误
router.post('/queryinfo', passport.authenticate('jwt',{session: false}),(req,res)=>{
  User.findOne({cardid: req.body.cardid},(err,doc)=>{
    if(err){
      throw err
    }else if(doc){
      res.status(200).json(doc)
    }else{
      res.status(404).json({message: '用户不存在！'})
    }
  })
})


//忘记密码接口 参数身份证号numberid 新密码password
//$route  POST /users/forgetpassword
//@desc   返回修改状态
//@acess  private
//status  200 成功 ， 404 用户不存在 ，500 未知错误
router.post('/forgetpassword', passport.authenticate('jwt',{session: false}),(req,res)=>{
  User.findOne({numberid: req.body.numberid},(err,doc)=>{
    if(err){
      throw err
    }else if(doc){
      doc.password = req.body.password
      bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(doc.password,salt,(err,hash)=>{
          if(err){
            throw err
          }
          doc.password = hash
          doc.save().then(user=> res.status(200).json({password: doc.password})).catch(err=>console.log(err))
        })
      })
    }else{
      res.status(404).json({message: '用户不存在！'})
    }
  })
})




module.exports = router