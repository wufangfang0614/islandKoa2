/*
 * @Descripttion:
 * @Author: wufangfang
 * @Date: 2021-03-05 18:06:38
 * @LastEditors: wufangfang
 * @LastEditTime: 2021-03-05 18:09:56
 */
// 是node提供的帮助工具
const util = require('util')
const { User } = require('../models/user')
const { generateToken } = require('../../core/util')
const { Auth } = require('../../middlewares/auth')
const axios = require('axios')
class WXManager {
    static async codeToToken(code) {
        // email password 显示注册 生成唯一标识
        // code 微信小程序生成的 openId 唯一标识

        // 微信小程序获取openid 传给后台
        // 后台根据openid请求微信，验证openid是否合法

        // code appid appsecret

        const url = util.format(global.config.wx.loginUrl,
            global.config.wx.appId,
            global.config.wx.appSecret,
            code)

        const result = await axios.get(url)
        if (result.status !== 200) {
            throw new global.errs.AuthFailed('openid获取失败')
        }
        const errcode = result.data.errcode
        const errmsg = result.data.errmsg
        if (errcode) {
            throw new global.errs.AuthFailed('openid获取失败:' + errmsg)
        }
        // openid openid太长，不适合做uid,并且传输有一定危险性，自己是生成uuid
        let user = await User.getUserByOpenid(result.data.openid)
        if (!user) {
             user = await User.registerByOpenid(result.data.openid)
        }
        return generateToken(user.id,Auth.USER)

    }
}
module.exports = {
    WXManager
}