const { Op } = require('sequelize')
const { flatten } = require('lodash')
const { Movie, Sentence, Music } = require('./classic')
class Art {

    constructor(artId, type) {
        this.artId = artId
        this.type = type
    }

    async getDetail(uid) {
        const art = await Art.getData(this.artId, this.type)
        if (!art) {
            throw new global.errs.NotFound()
        }
        const { Favor } = require('./favor')
        const like = await Favor.userLikeIt(this.artId, this.type, uid)
        return {
            art,
            like_status: like
        }
    }

    static async getList(artInfoList) {
        console.log('artInfoList', artInfoList)
        //in [ids]
        const artInfoObj = {
            100: [],
            200: [],
            300: []
        }
        // for of 数组， for in对象
        for (let artInfo of artInfoList) {
            artInfoObj[artInfo.type].push(artInfo.artId)
        }
        const arts = []
        for (let key in artInfoObj) {
            const ids = artInfoObj[key]
            if (ids.length === 0) {
                continue
            }
            key = parseInt(key)
            arts.push(await Art._getListByType(ids, key))
            // 二维数组转换成一维数组
            return flatten(arts)
        }
    }

    // 查询一组期刊
    static async _getListByType(ids, type) {
        let arts = []
        const finder = {
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        }
        const scope = 'bh'
        switch (type) {
            case 100:
                arts = await Movie.scope(scope).findAll(finder)
                break;
            case 200:
                arts = await Music.scope(scope).findAll(finder)
                break;
            case 300:
                arts = await Sentence.scope(scope).findAll(finder)
                break;
            case 400:
                break;

            default:
                break;
        }
        return arts
    }

    static async getData(artId, type, useScope = true) {
        let art = null
        const finder = {
            where: {
                id: artId
            }
        }
        const scope = useScope ? 'bh' : null
        switch (type) {
            case 100:
                art = await Movie.scope(scope).findOne(finder)
                break;
            case 200:
                art = await Music.scope(scope).findOne(finder)
                break;
            case 300:
                art = await Sentence.scope(scope).findOne(finder)
                break;
            case 400:
                 // book写在外面会循环导入
                 const { Book } = require('./book')
                 art = await Book.scope(scope).findOne(finder)
                 if(!art){
                     art = await Book.create({
                         id:artId
                     })
                 }
                break;

            default:
                break;
        }
        // if(art && art.image){
        //     let imgUrl = art.dataValues.image
        //     art.dataValues.image = global.config.host + imgUrl
        // }
        return art
    }

    // static async getOneClassic(index, uid, latest = false) {
    //     let flow
    //     if (!latest) {
    //         flow = await Flow.findOne({
    //             where: {
    //                 index: index
    //             }
    //         })
    //     } else {
    //         flow = await Flow.findOne({
    //             // index 倒序排列 ,取第一个
    //             order: [
    //                 ['index', 'DESC']
    //             ]
    //         })
    //     }
    //     if (!flow) {
    //         throw new global.errs.NotFound()
    //     }
    //     const art = await this.getData(flow.artId, flow.type)
    //     const like = await Favor.userLikeIt(flow.artId, flow.type, uid)
    //     art.setDataValue('index', flow.index)
    //     art.setDataValue('like_status', like)
    //     return art
    // }
}


module.exports = {
    Art
}