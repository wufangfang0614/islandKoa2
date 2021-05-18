/*
 * @Descripttion:
 * @Author: wufangfang
 * @Date: 2021-02-08 15:47:27
 * @LastEditors: wufangfang
 * @LastEditTime: 2021-03-04 14:57:34
 */
require('module-alias/register')
const Koa = require('koa')
// 获取请求里的body信息
const parser = require('koa-bodyparser')
const IninManager = require('./core/init')
const catchError = require('./middlewares/exception')
const path = require('path')
const static = require('koa-static')
// require('./app/models/user')
const app = new Koa()
app.use(catchError)
app.use(parser())
app.use(static(path.join(__dirname,'./static')))
// Koa的实例叫做应用程序对象  有很多中间件
IninManager.initCore(app)

app.listen(3000)

