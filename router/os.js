// // node:os 模块提供了与操作系统相关的实用方法和属性。 可以使用以下方式访问它
const os = require("os");

const gpuInfo = require("gpu-info");

const { dealMem } = require("../plugins/utils");

// 定义一个导出对象
var osInfo = {
	gpu: null,
};

// try catch 只能捕获同步执行的代码
(async function () {
	try {
		const data = await gpuInfo();
		if (Array.isArray(data) && data.length) {
			osInfo.gpu = data.map((it) => it.Name || it.Description).join("、");
		}
	} catch (err) {
		osInfo.gpu = null;
	}
})();

// cpu架构
osInfo.arch = os.arch();

// 行尾标记
osInfo.eol = os.EOL;

// 系统特定常量
osInfo.constants = os.constants;

// 当前用户信息
osInfo.userInfo = os.userInfo();

// 操作系统内核
osInfo.kernel = os.type();

// 操作系统平台
osInfo.pf = os.platform();

// 系统开机时间
osInfo.uptime = os.uptime();

// 主机名
osInfo.hostname = os.hostname();

// 主目录
osInfo.hdir = os.homedir();

// 内存
osInfo.totalMem = dealMem(os.totalmem());

osInfo.freeMem = dealMem(os.freemem());

osInfo.usedMem = dealMem(os.totalmem() - os.freemem());

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

	//  { index: 6, model: 'Apple M1 Pro', speed: '24MHz', useRate: '6.02%' }
	return temp;
});

// 网卡
// console.log("*****网卡信息*******");
var networksObj = os.networkInterfaces();
for (let nw in networksObj) {
	osInfo["networksObj" + nw] = Array.from(networksObj[nw]).map(
		(obj, idx, arr) => {
			let temp = {};
			// console.log(`地址：${obj.address}`);
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

module.exports = (router) => {
	router.get("/osInfo", (ctx, next) => {
		ctx.body = `
		<div style="padding:16px">
		<h3>this below is computer info</h3>
				<div style="display:flex;align-items:center;margin: 20px 0">
					<img style="width: 60px; margin-right: 20px" title="host" src="/host.png" />
					${osInfo.hostname}
				</div>
				<div style="display:flex;align-items:center;margin: 20px 0">
					<img style="width: 60px; margin-right: 20px" title="core" src="/core.png" />
					${osInfo.arch}
				</div>
				<div style="display:flex;align-items:center;margin: 20px 0">
					<img style="width: 60px; margin-right: 20px" title="os" src="/os.png" />
					${osInfo.pf}
				</div>
				<div style="display:flex;align-items:center;margin: 20px 0">
					<img style="width: 60px; margin-right: 20px" title="cpu" src="/cpu.png" />
					${osInfo.cpus[0].model}
				</div>
				<div style="display:flex;align-items:center;margin: 20px 0">
					<img style="width: 60px; margin-right: 20px" title="gpu" src="/gpu.png" />
					${osInfo.gpu}
				</div>
				<div style="display:flex;align-items:center;margin: 20px 0">
					<img style="width: 60px; margin-right: 20px" title="ram"" src="/ram.png" />${osInfo.usedMem}/${osInfo.totalMem}
				</div>
			</div>
		`;
	});
};
