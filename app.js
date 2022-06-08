// 引入 koa
const koa = require("koa");

// 打印插件
const consola = require("consola");

const app = new koa();

/**
 *  可以设置代理
 *  app.proxy = true
 */

// 可以通过使用async功能 使用一些中间件
// 这里的ctx 指向 context 上下文
/**
 *  ctx 包含 request、header、response、app、originalUrl 、 req 、res 、socket
 */
app.use(async (ctx, next) => {
	/**
	 *  当一个中间件调用 next() 则该函数暂停并将控制传递给定义的下一个中间件。
	 *  当在下游没有更多的中间件执行后，堆栈将展开并且每个中间件恢复执行其上游行为。
	 */

	await next();

	// 获取来自下一个方式跳动
	let rt = ctx.response.get("X-Response-Time");

	console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async (ctx, next) => {
	const start = Date.now();

	await next();

	const ms = Date.now() - start;

	ctx.set("X-Response-Time", `${ms}.ms`);
});

module.exports = app;
