// 动态路由
const koaRouter = require("koa-router");

const router = new koaRouter();

var judgeInfo = require("./user");

// 系统信息
var osInfo = require("./osinfo");

// 注册用户路径
router.get("/user/:name", (ctx, next) => {
	console.log("ctx.params", ctx.params);
	console.log("ctx.query", ctx.query);

	let response = judgeInfo(ctx.params?.name);

	ctx.body = response;
});

// 注册系统信息路径
router.get("/os", (ctx, next) => {
	let response = JSON.stringify(osInfo);
	ctx.body = response;
});

module.exports = router;
