/*
 * @Descripttion:
 * @Author: wufangfang
 * @Date: 2021-02-24 17:22:14
 * @LastEditors: wufangfang
 * @LastEditTime: 2021-03-05 14:43:59
 */
const { Sequelize, Model } = require('sequelize')
const { unset,clone,isArray } = require('lodash')
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

Model.prototype.toJSON = function(){
    // 只删除对象里面的第一层级，不用深拷贝，深拷贝效率慢
    let data = clone(this.dataValues)
    unset(data,'updated_at')
    unset(data,'created_at')
    unset(data,'deleted_at')
    for(key in data){
        if(key === 'image'){
            if(!data[key].startsWith('http'))
            data[key] = global.config.host +data[key]
        }
    }
    if(isArray(this.exclude)){
        this.exclude.forEach(value=>{
            unset(data,value)
        })
    }
    return data
}

module.exports = {
    sequelize
}