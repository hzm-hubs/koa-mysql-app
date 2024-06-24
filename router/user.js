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
