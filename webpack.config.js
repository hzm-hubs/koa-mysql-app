const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
	entry: "./bin/www.js",
	target: "node", // 告诉 Webpack 打包目标是 Node.js 环境
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"),
	},
	externals: [nodeExternals()], // 防止 Webpack 将 Node.js 内置模块和外部依赖打包进输出文件中
};
