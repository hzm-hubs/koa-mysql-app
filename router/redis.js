const { setRedis, getRedis } = require("../plugins/ioredis");

const regisRedis = function (router) {
	router.post("/redis/set", async (ctx, next) => {
		console.log("quradsa", ctx?.query);
	});

	router.get("/redis/get", async (ctx) => {
		let { query } = ctx;
		console.log("cs", query);
	});
};

module.exports = regisRedis;
