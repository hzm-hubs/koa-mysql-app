const cpFuncs = require("./plugins/child_process");

module.exports = (router) => {
	router.get("/childprocess", (ctx, next) => {
		ctx.body = '';
	});
};
