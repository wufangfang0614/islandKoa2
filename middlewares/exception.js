/*
 * @Descripttion:
 * @Author: wufangfang
 * @Date: 2021-02-18 17:18:46
 * @LastEditors: wufangfang
 * @LastEditTime: 2021-03-04 11:03:46
 */
const {HttpException} = require('../core/http-exception')
const catchError = async (ctx,next)=>{
    try {
        await next()
    } catch (error) {
        // 开发环境，不是HttpException
        const isHttpException = error instanceof HttpException
        const isDev = global.config.environment === 'dev'
        if(isDev&&!isHttpException){
            throw error
        }
        // 已知异常
        if(isHttpException){
            ctx.body = {
                msg:error.msg,
                error_code:error.errorCode,
                request:`${ctx.method} ${ctx.path}`,
            }
            ctx.status = error.code
        }else{
            ctx.body = {
                msg:'服务器内部错误',
                error_code:999,
                request:`${ctx.method} ${ctx.path}`,
            }
            ctx.status = 500
        }
    }
}
module.exports = catchError