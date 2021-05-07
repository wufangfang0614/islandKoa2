/*
 * @Descripttion:
 * @Author: wufangfang
 * @Date: 2021-02-09 11:29:08
 * @LastEditors: wufangfang
 * @LastEditTime: 2021-03-05 17:42:58
 */
const Router = require('koa-router')
const router = new Router({
    prefix: '/v1/classic'
})
const { Flow } = require('@models/flow')
const { Auth } = require('@root/middlewares/auth')
const { Art } = require('@models/art')
const { Favor } = require('@models/favor')
const { PositiveIntegerValidator ,ClassicValidator} = require('@validator')
router.get('/latest', new Auth(7).m, async (ctx, next) => {
    // const art = await Art.getOneClassic(0,ctx.auth.uid,true)
    const flow = await Flow.findOne({
        // index 倒序排列 ,取第一个
        order: [
            ['index', 'DESC']
        ]
    })
    const art = await Art.getData(flow.artId, flow.type)
    const likeLastest = await Favor.userLikeIt(flow.artId, flow.type, ctx.auth.uid)
    //art.dataValues.index = flow.index
    art.setDataValue('index', flow.index)
    art.setDataValue('like_status', likeLastest)
    delete art.dataValues.deleted_at
    ctx.body = art
})

router.get('/:index/next', new Auth().m, async (ctx) => {
    const v = await new PositiveIntegerValidator().validate(ctx, {
        id: 'index'
    })

    const index = v.get('path.index')
    // const art = await Art.getOneClassic(index + 1,ctx.auth.uid)
    const flow = await Flow.findOne({
        where: {
            index:index + 1
        }
    })
    if(!flow){
        throw new global.ResizeObserverSize.NotFound()
    }
    const art = await Art.getData(flow.artId, flow.type)
    const likeNext = await Favor.userLikeIt(flow.artId, flow.type, ctx.auth.uid)
    art.setDataValue('index', flow.index)
    art.setDataValue('like_status', likeNext)
    ctx.body = art
})

router.get('/:index/previous', new Auth().m, async (ctx) => {
    const v = await new PositiveIntegerValidator().validate(ctx, {
        id: 'index'
    })
    const index = v.get('path.index')
    // const art = await Art.getOneClassic(index - 1,ctx.auth.uid)
    const flow = await Flow.findOne({
        where: {
            index:index - 1
        }
    })
    if(!flow){
        throw new global.ResizeObserverSize.NotFound()
    }
    const art = await Art.getData(flow.artId, flow.type)
    const likePre = await Favor.userLikeIt(flow.artId, flow.type, ctx.auth.uid)
    art.setDataValue('index', flow.index)
    art.setDataValue('like_status', likePre)
    ctx.body = art
})

router.get('/:type/:id', new Auth().m, async (ctx) => {
    const v = await new ClassicValidator().validate(ctx)
    const id = v.get('path.id')
    let type = v.get('path.type')
    type = parseInt(type)
    const artDetail = await new Art(id,type).getDetail(ctx.auth.uid)
    artDetail.art.setDataValue('like_status',artDetail.like_status)
    ctx.body = artDetail.art
})

router.get('/:type/:id/favor', new Auth().m, async (ctx) => {
    const v = await new ClassicValidator().validate(ctx)
    const id = v.get('path.id')
    let type = v.get('path.type')
    type = parseInt(type)
    const artDetail = await new Art(id,type).getDetail(ctx.auth.uid)
    ctx.body = {
        fav_nums:artDetail.art.fav_nums,
        like_status:artDetail.like_status
    }
})

router.get('/favor',new Auth().m, async (ctx) => {
    const uid = ctx.auth.uid
    ctx.body = await Favor.getMyClassicFavors(uid)
})
module.exports = router
