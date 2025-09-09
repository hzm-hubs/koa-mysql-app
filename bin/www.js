#!/usr/bin/env node
const jwt = require("jsonwebtoken");

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
app.use(router.routes()).use(router.allowedMethods()).use(authenticateToken);

async function authenticateToken(ctx, next) {
	const { request } = ctx;

	const authHeader = request?.headers["authorization"] || "";

	const token = authHeader && authHeader.split(" ")[1];

	if (!token && !config.noNeedLoginUrls.includes(request.url)) {
		// return response.body(401).json({ message: "访问令牌缺失" });
		return {
			code: 401,
			message: "访问令牌缺失",
		};
	}

	jwt.verify(token, config.JWT_SECRET, (err, user) => {
		if (err) {
			return {
				code: 403,
				message: "令牌无效或已过期",
			};
		}
		request.user = user;
	});
	await next();
}

app.listen(config.port, () => {
	consola.success(`service is listenning on http://localhost:${config.port}`);
});

app.on("error", (error) => {
	console.log(`error: ${error}`);
});
