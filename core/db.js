/*
 * @Descripttion:
 * @Author: wufangfang
 * @Date: 2021-02-24 17:22:14
 * @LastEditors: wufangfang
 * @LastEditTime: 2021-03-05 14:43:59
 */
const { Sequelize, Model } = require('sequelize')
const { unset } = require('lodash')
const { dbName, host, port, user, password } = require('../config/config').database

const sequelize = new Sequelize(dbName, user, password, {
    // 用来指定数据库类型 ,一定要安装mysql2 这个驱动，链接哪个类型的数据库，要安装哪个类型的驱动
    dialect: 'mysql',
    host,
    port,
    // 显示原始的命令行操作
    loging: true,
    // 时区 北京时区
    timezone: '+08:00',
    define: {
        //自动生成 create_time update_time
        timestamps: true,
        // delete_time
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        // 把驼峰都改成下滑线
        underscored: true,
        scopes: {
            bh: {
                attributes: {
                    exclude: ['updated_at', 'created_at', 'deleted_at']
                }
            }
        }
    }
})
// 会自动把模型放到数据库
sequelize.sync({
    // 这个好像没起作用，
    force: false
})
module.exports = {
    sequelize
}