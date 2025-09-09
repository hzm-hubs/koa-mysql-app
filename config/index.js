module.exports = {
	version: "1.0.7",
	port: 7002,
	koaOrgUrl: "https://koa.bootcss.com/#application",
	mysql: {
		host: "localhost",
		database: "hliuliu",
		user: "root",
	},
	redis: {
		host: "localhost", // 127.0.0.1
		port: "6379",
	},
	noNeedLoginUrls: ["/", "/login"],
	JWT_SECRET:
		"MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKoR8mX0rGKLqzcWmOzbfj64K8ZIgOdHnzkXSOVOZbFu/TJhZ7rFAN+eaGkl3C4buccQd/EjEsj9ir7ijT7h96MCAwEAAQ==",
};
