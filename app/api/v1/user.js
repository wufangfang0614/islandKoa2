/*
 * @Descripttion:
 * @Author: wufangfang
 * @Date: 2021-03-03 19:33:53
 * @LastEditors: wufangfang
 * @LastEditTime: 2021-03-04 17:51:26
 */
const Router = require('koa-router')
const {RegisterValidator} = require('../../validators/validator')
const {User} = require('../../models/user')
const {success} = require('../../lib/helper')
const router = new Router({
    // 对下面所有路由加前缀
    prefix:'/v1/user'
})

// 注册 新增数据 put get delete

router.post('/register',async (ctx)=>{
    // 思维路径
    // 接收参数 LinValidator
    // email password1 password2 nickname
    const v = await new RegisterValidator().validate(ctx)
    // v.get获取参数
    // 链接数据库
    // sql Model
    const user = {
        email:v.get('body.email'),
        password:v.get('body.password2'),
        nickname:v.get('body.nickname')
    }
    User.create(user)
    // throw new global.errs.Success()
    success()

})

// 自动加载不要带括号
module.exports = router