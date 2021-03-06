/*
 * @Descripttion:
 * @Author: wufangfang
 * @Date: 2021-02-09 17:02:53
 * @LastEditors: wufangfang
 * @LastEditTime: 2021-02-23 17:40:35
 */
const Router = require('koa-router')
const requireDirectory = require('require-directory')
 class InitManager {
    static initCore(app){
        //入口方法
        InitManager.app = app
        InitManager.initLoadRouters()
        InitManager.loadHttpException()
        InitManager.loadConfig()
    }
    static loadConfig(path = ''){
        const configPath = path || process.cwd() + '/config/config.js'
        const config = require(configPath)
        global.config = config
    }
    static initLoadRouters() {
        // path config
        // 绝对路径
        const apiDirectory = `${process.cwd()}/app/api`
        requireDirectory(module,apiDirectory, { visit: whenLoadMoudule })
        function whenLoadMoudule(obj) {
            if (obj instanceof Router) {
                InitManager.app.use(obj.routes())
            }
        }
    }
    static loadHttpException(){
        const errors = require('./http-exception')
        global.errs = errors
    }
}

module.exports = InitManager