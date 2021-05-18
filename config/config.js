/*
 * @Descripttion:
 * @Author: wufangfang
 * @Date: 2021-02-23 17:26:11
 * @LastEditors: wufangfang
 * @LastEditTime: 2021-03-05 15:49:58
 */
module.exports ={
    environment:'dev',
    database:{
        dbName:'island',
        host:'localhost',
        port:3306,
        user:'root',
        password:'12345678'
    },
    security:{
        secretKey:"abcdefg",
        expiresIn:60*60*24*30
    },
    wx:{
        appId:'wx14f50ccef24160c3',
        appSecret:'8878dc3961624a358d96ba06e5875eb4',
        loginUrl:'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
    },
    yushu:{
        detailUrl:'http://t.talelin.com/v2/book/id/%s',
        keywordUrl:'http://t.talelin.com/v2/book/search?q=%s&count=%s&start=%s&summary=%s'
    },
    host:'http://localhost:3000/'

}