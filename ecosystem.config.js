module.exports = {
	apps: [
		{
			name: "koa-mysql-app",
			script: "./bin/www.js",
			env: {
				NODE_ENV: "production",
			},
			autorestart: true,
			instances: 2,
			exec_mode: "cluster", // 集群模式
			error_file: "err.log",
			out_file: "out.log",
			merge_logs: true,
			log_date_format: "YYYY-MM-DD HH:mm Z",
		},
	],
};
