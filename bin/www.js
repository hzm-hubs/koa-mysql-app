#!/usr/bin/env node

const app = require("../app");

const config = require("../config/index");

// 打印插件
const consola = require("consola");

// 引入静态路由
const static = require("koa-static");

// 引入编写的路由
const router = require("../router/index");

// 注册可以访问静态文件 这是默认注册到根目录(/)的方法
app.use(static("static"));

/**
 *  也可以给静态文件再添加一个通用路由
 *  app.use('/static',require("koa-static")( "static"))
 */

// consola.log("注册路由信息", JSON.stringify(router));

// 绑定动态路由
app.use(router.routes()).use(router.allowedMethods());

app.use(async (ctx) => {
	// console.log("上下文", JSON.stringify(ctx));
	ctx.body = ctx.request.body;
});

app.listen(config.port, () => {
	consola.success(`service is listenning on http://localhost:${config.port}`);
});

app.on("error", (error) => {
	console.log(`error: ${error}`);
});
