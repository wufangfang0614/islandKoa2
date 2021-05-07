/*
 * @Descripttion:
 * @Author: wufangfang
 * @Date: 2021-02-24 18:04:29
 * @LastEditors: wufangfang
 * @LastEditTime: 2021-03-05 14:40:19
 */
// npm的包导入都放在最前面
const bcrypt = require('bcryptjs')
const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class User extends Model {
    static async verifyEmailPassword(email,plainPassword){
        const user = await User.findOne({
            where:{
                email
            }
        })
        if(!user){
            throw new global.errs.NotFound('账号不存在')
        }
        const correct = bcrypt.compareSync(plainPassword,user.password)
        if(!correct){
            throw new global.errs.AuthFailed('密码错误')
        }
        return user
    }
    static async getUserByOpenid(openid){
        const user = await User.findOne({
            where:{
                openid
            }
        })
        return user
    }
    static async registerByOpenid(openid){
        const user = await User.create({
            where:{
                openid
            }
        })
        return user
    }
}

User.init({
    // 主键 关系型数据库
    // 主键 绝对不能重复 不能为空
    // 注册User id 设计 id编号系统   数字，不能是字符串，随机字符串GUID
    // 自动增长id编号
    // 并发 1000,注册的时候容易重复id，要查询上一个注册的人的id号，增1
    // 即使别人知道用户滨蒿，也无法做好后坏事，接口保护，权限，访问接口token
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nickname: Sequelize.STRING,
    email: {
        type: Sequelize.STRING(128),
        unique: true
    },
    password: {
        // 扩展 设计模式 观察者模式
        // ES6 Reflect, vue3.0也有很多
        type: Sequelize.STRING,
        set(val) {
            // 盐  数字不是位数，加密时间成本，数字越大成本越大，破解就需要更多时间
            const salt = bcrypt.genSaltSync(10)
            // 加密  同一个密码，加密码，也不相同，可以有有效防止彩虹攻击
            const psw = bcrypt.hashSync(val, salt)
            this.setDataValue('password',psw)
        }
    },
    openid: {
        type: Sequelize.STRING(64),
        unique: true
    }
}, {
    sequelize,
    // 表名一般是小写不带s
    tableName: 'user'
})

// 启动服务器mysql.server start

// 数据迁移 写sql去更新，有风险，容易把数据弄乱

module.exports = {
    User
}