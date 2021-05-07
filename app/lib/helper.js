
/*
 * @Descripttion:
 * @Author: wufangfang
 * @Date: 2021-03-04 17:47:12
 * @LastEditors: wufangfang
 * @LastEditTime: 2021-03-04 17:50:27
 */
function success(msg,errorCode){
    throw new global.errs.Success(msg,errorCode)
}

module.exports = {
    success
}