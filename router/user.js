const router = require(".");

var userList = [
	{
		name: "james",
		age: 29,
	},
	{
		name: "harden",
		age: 20,
	},
	{
		name: "kawai",
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
	router.get("/user/:name", (ctx, next) => {
		let { query, params } = ctx;
		// /:写法可用 ctx.params 获取路径参数
		console.log("params", params);
		let response = judgeInfo(params?.name);
		// 设置 cookie
		ctx.cookies.set("koa-mysql", "value", {
			domain: "localhost", // 写cookie所在的域名
			maxAge: 10 * 60 * 1000, // cookie有效时长,maxAge优先级比expires高，单位秒，低版本ie不支持
			expires: new Date("2025-02-15"), // 设置cookie失效时间
			httpOnly: false, // 是否只用于http请求中获取
			overwrite: false, // 是否允许重写
		});
		ctx.body = response;
	});

	router.get("/userInfo", (ctx, next) => {
		let { query, params } = ctx;
		// /path?name= 写法 可用 query 获取 路径参数
		console.log("query", query);
		let temp = userList.find((it) => it.name == ctx?.query.name) || null;
		if (temp) {
			ctx.body = temp;
		} else {
			ctx.body = "<h1>no people</h1>";
		}
	});
};
