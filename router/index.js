// 动态路由
const koaRouter = require("koa-router");

const router = new koaRouter();

var judgeInfo = require("./user");

// 系统信息
var osInfo = require("./osinfo");

// client
var getClientIp = require("./client");

// 百度识别
var handleVoice = require("./sound");

// 注册用户路径
router.get("/user/:name", (ctx, next) => {
	console.log("ctx.params", ctx.params);
	console.log("ctx.query", ctx.query);
	console.log("ctx", ctx.res);

	let response = judgeInfo(ctx.params?.name);

	ctx.body = response;

	return ctx.params?.name;
});

// 注册系统信息路径
router.get("/os", (ctx, next) => {
	let response = JSON.stringify(osInfo);
	ctx.body = response;
});

// 注册系统信息路径
router.get("/client", (ctx, next) => {
	// let response = getClientIp(ctx.req);
	console.log("客户端ip", ctx.req);
	// console.log("获取", ctx.req.getRemoteAddr());
	// return response;
	ctx.body = ctx;
});

router.post("/sound", (ctx) => {
	handleVoice(ctx.query);
});

module.exports = router;
