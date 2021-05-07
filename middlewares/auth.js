/*
 * @Descripttion:
 * @Author: wufangfang
 * @Date: 2021-03-05 15:46:47
 * @LastEditors: wufangfang
 * @LastEditTime: 2021-03-05 17:44:25
 */
const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
class Auth {
    constructor(level) {
        Auth.USER = 8
        Auth.ADMIN = 16
        Auth.SUPER_USER = 32
        this.level = level
    }

    get m() {
        return async (ctx, next) => {
            const userToken = basicAuth(ctx.req)
            let errMsg = 'token不合法'
            if (!userToken || !userToken.name) {
                throw new global.errs.Forbbiden(errMsg)
            }
            try {
                // 验证令牌对不对
                var decode = jwt.verify(userToken.name, global.config.security.secretKey)
            } catch (error) {
                // 不合法
                // 过期
                if(error.name === 'TokenExpiredError'){
                    errMsg = 'token已过期'
                }
                throw new global.errs.Forbbiden(errMsg)
            }
            if(decode.scope < this.level){
                errMsg = '权限不足'
                throw new global.errs.Forbbiden(errMsg)
            }
            // req是什么？
            // koa 是对Node.js的封装
            // request 是node.js的原生对象
            // ctx.req是 koa对 原生request封装的对象
            ctx.auth = {
                uid:decode.uid,
                scope:decode.scope
            }
            await next()
        }
    }

    static verifyToken(Token){
        try {
            jwt.verify(Token, global.config.security.secretKey)
            return true
        } catch (error) {
            return false
        }
    }
}

module.exports = {
    Auth
}