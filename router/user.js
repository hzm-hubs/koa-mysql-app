const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/index");

const userList = [
	{
		name: "james",
		password: "q!123",
		age: 29,
	},
	{
		name: "harden",
		password: "q!123",
		age: 20,
	},
	{
		name: "kawai",
		password: "q!123",
		age: 18,
	},
];

const judgeInfo = function (queryName) {
	let result = "";
	if (!queryName) {
		result = "no this people";
	} else {
		if (!JSON.stringify(userList).includes(queryName)) {
			result = "welcome," + queryName;
		} else {
			result = "welcome back," + queryName;
		}
	}
	return result;
};

module.exports = (router) => {
	// 登录接口
	router.post("/user/login", async (ctx) => {
		try {
			console.log("body", ctx.request.body);
			const { name, password } = ctx.request.body;

			// 查找用户
			if (!name) {
				ctx.fail("用户名或密码错误", 401);
			}
			const user = userList.find((u) => u.name == name);

			// 验证密码
			const isPasswordValid = await bcrypt.compare(password, user.password);

			if (!isPasswordValid) {
				ctx.fail("用户名或密码错误", 401);
			}

			// 生成JWT令牌
			const token = jwt.sign({ ...user }, config.JWT_SECRET, {
				expiresIn: "24h",
			});

			// 返回用户信息和令牌
			ctx.success({
				token,
				...user,
			});
		} catch (error) {
			ctx.fail("登录错误", 500);
		}
	});

	// // 受保护的路由示例
	// app.get("/api/admin/data", authenticateToken, (req, res) => {
	// 	// 只有认证用户才能访问
	// 	res.json({ message: "这是受保护的数据", user: req.user });
	// });

	// // JWT认证中间件
	// function authenticateToken(req, res, next) {
	// 	const authHeader = req.headers["authorization"];
	// 	const token = authHeader && authHeader.split(" ")[1];

	// 	if (!token) {
	// 		return res.status(401).json({ message: "访问令牌缺失" });
	// 	}

	// 	jwt.verify(token, JWT_SECRET, (err, user) => {
	// 		if (err) {
	// 			return res.status(403).json({ message: "令牌无效或已过期" });
	// 		}
	// 		req.user = user;
	// 		next();
	// 	});
	// }

	// 获取用户详情接口
	// router.get("/user/:name", (ctx, next) => {
	// 	let { query, params } = ctx;
	// 	// /:写法可用 ctx.params 获取路径参数
	// 	console.log("params", params);
	// 	let response = judgeInfo(params?.name);
	// 	// 设置 cookie
	// 	ctx.cookies.set("koa-mysql", "value", {
	// 		domain: "localhost", // 写cookie所在的域名
	// 		maxAge: 10 * 60 * 1000, // cookie有效时长,maxAge优先级比expires高，单位秒，低版本ie不支持
	// 		expires: new Date("2025-02-15"), // 设置cookie失效时间
	// 		httpOnly: false, // 是否只用于http请求中获取
	// 		overwrite: false, // 是否允许重写
	// 	});
	// 	ctx.body = response;
	// });

	// 获取用户详情接口
	router.get("/user/info", (ctx, next) => {
		let { query, params } = ctx;
		// /path?name= 写法 可用 query 获取 路径参数
		let temp = userList.find((it) => it.name == ctx?.query.name) || null;
		if (temp) {
			ctx.success(temp);
		} else {
			ctx.fail(400, "未有用户信息");
		}
	});
};
