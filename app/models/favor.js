const { Art } = require('./art')
const { sequelize } = require('../../core/db')
const { Sequelize, Model,Op } = require('sequelize')

const { Flow } = require('./flow')
class Favor extends Model {
    // 业务表
    // 添加记录
    // classic fav_nums

    // 两个步骤要一起执行，要么就都不执行
    // 数据库事务( transaction)是访问并可能操作各种数据项的一个数据库操作序列，这些操作要么全部执行,要么全部不执行，是一个不可分割的工作单位，
    // 只要有一个失败，其他都会被撤销
    // 保持数据一致性
    // mangoDB 之前不支持事务，所以经常被诟病，4.0以后支持了
    // Sequelize相对于其他的orm框架 ，事务编写起来比较麻烦，怪异
    // 关系型数据库，设计比较严谨要保持，ACID 原子性，一致性，隔离性，持久性
    // transactions 是Sequelize最难的一节，
    static async like(artId, type, uid) {
        console.log('Art', Art)
        console.log('Flow',Flow)
        const favor = await Favor.findOne({
            where: {
                artId,
                type,
                uid
            }
        })
        if (favor) {
            throw new global.errs.LikeError()
        }
        return sequelize.transaction(async t => {
            await Favor.create({
                artId,
                type,
                uid
            }, { transaction: t })
            const art = await Art.getData(artId, type, false)
            // 加1  这里有个坑，transaction: t 要加载by后面
            await art.increment('fav_nums', { by: 1, transaction: t })
        })

    }

    static async disLike(artId, type, uid) {
        const favor = await Favor.findOne({
            where: {
                artId,
                type,
                uid
            }
        })
        if (!favor) {
            throw new global.errs.DislikeError()
        }
        return sequelize.transaction(async t => {
            // 自己销毁哦
            await favor.destroy({
                // 物理删除还是软删除
                // 软删除是会在delete_at加入一个时间戳,并不会在表里删除,物理删除直接在表里删除
                force: true,
                transaction: t
            })
            const art = await Art.getData(artId, type, false)
            // 加1  这里有个坑，transaction: t 要加载by后面
            await art.decrement('fav_nums', { by: 1, transaction: t })
        })

    }

    static async userLikeIt(artId, type, uid) {
        const favor = await Favor.findOne({
            where: {
                artId,
                type,
                uid
            }
        })
        return favor ? true : false
    }

     static async getMyClassicFavors(uid){
         const arts = await Favor.findAll({
             where:{
                 uid,
                 // 且type!=400
                 type:{
                     [Op.not]:400
                 }
             }
         })
         if(!arts){
            throw new global.errs.NotFound
         }

         return await Art.getList(arts)
     }

     static async getBookFavor(uid, bookID){
        const favorNums = await Favor.count({
            where: {
                art_id:bookID,
                type:400
            }
        })
        const myFavor = await Favor.findOne({
            where:{
                art_id:bookID,
                uid,
                type:400
            }
        })
        return {
            fav_nums:favorNums,
            like_status:myFavor?1:0
        }
    }
}

Favor.init({
    uid: Sequelize.INTEGER,
    artId: Sequelize.INTEGER,
    type: Sequelize.INTEGER,
}, {
    sequelize,
    tableName: 'favor'
})

module.exports = {
    Favor
}