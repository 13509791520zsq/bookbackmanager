# 图书管理后台项目进度记录

//开发进度记录
## 创建项目

1. npm init    //填写项目基本信息
2. 创建`server.js`入口文件
3. 下载引入express并添加基本路由开启监听

## 基本插件配置

- nodemon //全局安装后，在package.json中配置 `"server":"nodemon ./server.js"`

- body-parser //解析post请求参数，下载引入配置
  ```
  app.use(bodyparser.urlencoded({extended:false}))
  app.use(bodyparser.json())
  ```

## 数据库连接配置

mongoose 下载引入
添加配置文件keys.js
`mongoURL:"mongodb:localhost:27017/数据库名"`
在入口文件中
`mongoose.connect(keys.mongoURL).then().catch()`

创建数据库模型并导出

## bcrypt

对数据进行加密解密

## jsonwebtoken

生成token用的

## passport passport-jwt

对token进行解析校验

passport是express框架的一个针对密码的中间件

passport-jwt是一个针对jsonwebtoken的插件，用passport-jwt和passport中间件来验证token

## 接口简述

```
get   /users/     超级管理录入，无参 name: root No:201708030111 password : root cardid : 1234567890 numberid: 201708030111

post  /users/login   参数学号/工号No 密码password  status  200 成功 token: {Bearer + token`} ， 400 密码错误， 404 用户不存在 {message: ""}，500 未知错误

post  /users/entryusers  信息录入接口 参数用户信息数组 包含姓名学号密码卡号 status  200 成功

POST /users/deleteuser  用户注销接口 参数学号/卡号  status  200 成功 ， 400 密码错误， 404 用户不存在 ，500 未知错误 {message:""}

POST /users/editpassword  用户修改密码接口 参数原密码 status  200 成功 ， 400 密码错误， 404 用户不存在 ，500 未知错误

post /users/queryinfo  查询学生信息接口  参数： cardid 返回学生信息 200成功 404 用户不存在

post /users/forgetpassword  忘记密码接口 参数：身份证号numberid 200返回密码 404用户不存在

post /books/entrybook 书籍录入接口 参数：书籍信息 name author date library category 返回200成功 400 缺少信息
//post /books/entrybooks 书籍录入接口 参数：书籍信息 name author date library category 返回200成功 400 缺少信息

post /books/deletebooks 书记删除接口 参数书籍id 返回200成功

post /books/querybooks 书记查询接口 参数：书籍信息 返回200书籍信息

post /books/borrowbooks 书籍借阅接口 参数：书籍id 饭卡信息cardid 返回借出情况信息

post /books/censusbooks 参数书库名 library 200返回所有借阅情况

post /books/censuspersonalbycardid 参数卡号cardid 返回个人借阅情况

post /books/censusovertimebooks 参数无 返回所有超时借阅情况

post /books/ownerovertimebooks 参数无 返回请求者的超时借阅情况

```
