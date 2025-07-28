// 动态路由
const koaRouter = require("koa-router");

const config = require("../config/index"); //引入配置文件

const router = new koaRouter();

const registerDns = require("./dns");

// const regisRedis = require("./redis");

const regisUser = require("./user");

const regisSalary = require("./salary");

const regisOs = require("./os");

const regisEventSource = require("./eventsource");

const regisOllama = require("./ollama");

router.get("/", (ctx) => {
	ctx.body = `<h4 style="padding:16px">welcome, koa-mysql-app@${config.version}</h4>`;
});

// os
regisOs(router);

// 注册DNS相关接口
registerDns(router);

// 注册 redis 接口
// regisRedis(router);

// 注册用户接口
regisUser(router);

// 注册薪水接口
regisSalary(router);

regisEventSource(router);

regisOllama(router);

module.exports = router;
