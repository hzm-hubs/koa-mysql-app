const dns = require("dns");

const { commonBack } = require("../plugins/utils");

const getDns = function (router, rrtype = null) {
	router.get("/resolve/host/:hostname", async (ctx, next) => {
		return new Promise(async (resolve, reject) => {
			if (!ctx.params?.hostname) {
				resolve(
					commonBack(null, "error, the ip is required!", 1002, "/resolve/host")
				);
			}
			const back = await dns.resolve(ctx.params.hostname, rrtype);

			if (back?.back) {
				resolve(commonBack(back, "success"));
			} else {
				resolve(commonBack(null, "resolve failed", "/resolve/host"));
			}
		}).then((data) => {
			ctx.body = data;
		});
	});
};

module.exports = getDns;
