// // node:os 模块提供了与操作系统相关的实用方法和属性。 可以使用以下方式访问它
const os = require("os");

const { dealTeam, dealMem } = require("../plugins/utils");

// 定义一个导出对象
var osInfo = {};

// cpu架构
osInfo.arch = os.arch();
// console.log("cpu架构：" + arch);

// 行尾标记
osInfo.eol = os.EOL;
// console.log("行尾标记：" + eol);

// 系统特定常量
osInfo.constants = os.constants;
// console.log("系统特定常量:" + JSON.stringify(constants));

// 当前用户信息
osInfo.userInfo = os.userInfo();
// console.log("当前用户信息: " + userInfo);

// 操作系统内核
osInfo.kernel = os.type();
// console.log("操作系统内核：" + kernel);

// 操作系统平台
osInfo.pf = os.platform();
// console.log("平台：" + pf);

// 系统开机时间
osInfo.uptime = os.uptime();
// console.log("开机时间：" + dealTime(uptime));

// 主机名
osInfo.hn = os.hostname();
// console.log("主机名：" + hn);

// 主目录
osInfo.hdir = os.homedir();
// console.log("主目录：" + hdir);

// 内存
osInfo.totalMem = dealMem(os.totalmem());
osInfo.freeMem = dealMem(os.freemem());
// console.log(
// 	"内存大小：" + dealMem(totalMem) + " 空闲内存：" + dealMem(freeMem)
// );

// cpu
// console.log("*****cpu信息*******");
osInfo.cpus = Array.from(os.cpus()).map((cpu, idx, arr) => {
	let temp = {};
	let times = cpu.times;
	// console.log(`cpu${idx}：`);
	temp.index = idx;
	// console.log(`型号：${cpu.model}`);
	temp.model = cpu.model;
	// console.log(`频率：${cpu.speed}MHz`);
	temp.speed = `${cpu.speed}MHz`;
	// console.log(
	// 	`使用率：${(
	// 		(1 -
	// 			times.idle /
	// 				(times.idle + times.user + times.nice + times.sys + times.irq)) *
	// 		100
	// 	).toFixed(2)}%`
	// );
	temp.useRate = `${(
		(1 -
			times.idle /
				(times.idle + times.user + times.nice + times.sys + times.irq)) *
		100
	).toFixed(2)}%`;

	return temp;
});

// 网卡
// console.log("*****网卡信息*******");
var networksObj = os.networkInterfaces();
for (let nw in networksObj) {
	osInfo["networksObj" + nw] = Array.from(networksObj[nw]).map(
		(obj, idx, arr) => {
			let temp = {};
			console.log(`地址：${obj.address}`);
			// console.log(`掩码：${obj.netmask}`);
			// console.log(`物理地址：${obj.mac}`);
			// console.log(`协议族：${obj.family}`);
			temp.index = obj.idx;
			temp.address = obj.address;
			temp.netmask = obj.netmask;
			temp.mac = obj.mac;
			temp.family = obj.family;

			return temp;
		}
	);
}

module.exports = osInfo;
