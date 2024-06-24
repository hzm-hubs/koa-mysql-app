// 动态路由
const koaRouter = require("koa-router");

const router = new koaRouter();

const registerDns = require("./dns");

const regisRedis = require("./redis");

const regisUser = require("./user");

const regisSalary = require("./salary");

const regisOs = require("./os");

// 根路径
regisOs(router);

// 注册DNS相关接口
registerDns(router);

// 注册 redis 接口
regisRedis(router);

// 注册用户接口
regisUser(router);

// 注册薪水接口
regisSalary(router);

module.exports = router;
