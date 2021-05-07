/*
 * @Descripttion:
 * @Author: wufangfang
 * @Date: 2021-02-24 18:04:29
 * @LastEditors: wufangfang
 * @LastEditTime: 2021-03-05 14:40:19
 */
// npm的包导入都放在最前面
const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

// Sequelize 不支持继承，暂时只能这么写
const classicFields = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: Sequelize.STRING,
    image: Sequelize.STRING,
    pubdate: Sequelize.DATEONLY,
    content: Sequelize.STRING,
    fav_nums: {
        type:Sequelize.INTEGER,
        defaultValue:0
    },
    type: Sequelize.TINYINT
}
class Movie extends Model {
    //获取音乐数据
    static async getMusicOne(id) {
        const user = await Music.findOne({
            where: {
                id
            }
        })
        return user
    }
}

Movie.init(classicFields, {
    sequelize,
    tableName: 'movie'
})

class Sentence extends Model {
    //获取音乐数据
    static async getSentenceOne(id) {
        const user = await Music.findOne({
            where: {
                id
            }
        })
        return user
    }
}

Sentence.init(classicFields, {
    sequelize,
    tableName: 'sentence'
})


class Music extends Model {
    //获取音乐数据
    static async getMusicOne(id) {
        const user = await Sentence.findOne({
            where: {
                id
            }
        })
        return user
    }
}

const musicFileds = Object.assign({ url: Sequelize.STRING },classicFields)
Music.init(musicFileds, {
    sequelize,
    // 表名一般是小写不带s
    tableName: 'music'
})

// 启动服务器mysql.server start

// 数据迁移 写sql去更新，有风险，容易把数据弄乱

module.exports = {
    Movie,
    Sentence,
    Music
}