/*
 * @Descripttion:
 * @Author: wufangfang
 * @Date: 2021-02-08 14:49:05
 * @LastEditors: wufangfang
 * @LastEditTime: 2021-02-23 10:09:31
 */
const Koa = require('koa')
const app = new Koa()
app.use(async (ctx,next)=>{
    // 上下文 洋葱模型
    console.log(1)
    await next()
    console.log(2)
})
app.use(async(ctx,next)=>{
    console.log(3)
    await next()
    console.log(4)
})
app.listen(3000)