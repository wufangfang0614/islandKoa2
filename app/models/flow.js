const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Flow extends Model {
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
Flow.init({
    index: Sequelize.INTEGER,
    artId: Sequelize.INTEGER,
    type: Sequelize.INTEGER
}, {
    sequelize,
    tableName: 'flow'
})

module.exports = {
    Flow
}