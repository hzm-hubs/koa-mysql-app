const { spawn, fork } = require("node:child_process");

const path = require("node:path");

// spawn 用于执行命令的回调：child_process.spawn(command[, args][, options])

// 进入 / usr 路径 执行 ls - lh 命令
const ls = spawn("ls", ["-lh", "/usr"]);

const telnet = spawn("telnet", ["172.16.32.234", "2100"]);

// 标准输出的回调
ls.stdout.on("data", (data) => {
	console.log(`stdout: ${data}`);
});

// 标准错误的回调
ls.stderr.on("data", (data) => {
	console.error(`stderr: ${data}`);
});

// 关闭
ls.on("close", (code) => {
	console.log(`spawn: ls exited with code ${code}`);
});

telnet.stderr.on("data", (data) => {
	console.error(`telnet error: ${data}`);
});

// 关闭
telnet.on("close", (code) => {
	console.log(`spawn: telnet exited with code ${code}`);
});

// fork 衍生新的 Node.js 进程并使用建立的 IPC 通信通道（其允许在父子进程之间发送消息）调用指定的模块
// __dirname 获取当前绝对路径
var forkStatic = fork(path.join(__dirname, "./fork_child.js"), {
	silent: false,
});

// 发送读取文件的请求
forkStatic.send({
	action: "readFile",
	filename: path.join(__dirname, "../static/fork.txt"),
});

// 接收子进程的消息
forkStatic.on("message", (message) => {
	if (message.action === "fileContent") {
		console.log(`File content: ${message.content}`);
	} else if (message.action === "error") {
		console.error(`Error: ${message.error}`);
	}
});

module.exports = {
	ls,
	telnet,
};
