router.use("/", require("./routers"));

router.use("/admin", require("./routers/admin"));

// 在这里添加静态路由 匹配所有的静态文件
router.all(
	/((\.jpg)|(\.png)|(\.gif))$/i,
	static("./static", {
		maxage: 3 * 86400 * 1000,
	})
);
router.all(
	/((\.js)|(\.jsx))$/i,
	static("./static", {
		maxage: 10 * 86400 * 1000,
	})
);
router.all(
	/(\.css)$/i,
	static("./static", {
		maxage: 2 * 86400 * 1000,
	})
);
router.all(
	/((\.html)|(\.htm))$/i,
	static("./static", {
		maxage: 2 * 86400 * 1000,
	})
);
router.all(
	"*",
	static("./static", {
		maxage: 2 * 86400 * 1000,
	})
);
