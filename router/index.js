// 动态路由
const koaRouter = require("koa-router");

const router = new koaRouter();

var judgeInfo = require("./user");

router.get("/user/:name", (ctx, next) => {
	console.log("ctx.params", ctx.params);
	console.log("ctx.query", ctx.query);

	let response = judgeInfo(ctx.params?.name);

	ctx.body = response;
});

module.exports = router;
