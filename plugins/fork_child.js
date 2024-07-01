const fs = require("fs");

// 配合子进程 fork 读取文件
process.on("message", (message) => {
	if (message.action === "readFile") {
		const filename = message.filename;
		fs.readFile(filename, "utf8", (err, data) => {
			if (err) {
				// 将错误消息发送回主进程
				process.send({ action: "error", error: err.message });
			} else {
				// 将文件内容发送回主进程
				process.send({ action: "fileContent", content: data });
			}
		});
	}
});
