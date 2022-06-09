// 时间处理方法
const dealTime = (seconds) => {
	var seconds = seconds | 0;
	var day = (seconds / (3600 * 24)) | 0;
	var hours = ((seconds - day * 3600) / 3600) | 0;
	var minutes = ((seconds - day * 3600 * 24 - hours * 3600) / 60) | 0;
	var second = seconds % 60;
	day < 10 && (day = "0" + day);
	hours < 10 && (hours = "0" + hours);
	minutes < 10 && (minutes = "0" + minutes);
	second < 10 && (second = "0" + second);
	return [day, hours, minutes, second].join(":");
};

// 内存计算方法
const dealMem = (mem) => {
	var G = 0,
		M = 0,
		KB = 0;
	mem > 1 << 30 && (G = (mem / (1 << 30)).toFixed(2));
	mem > 1 << 20 && mem < 1 << 30 && (M = (mem / (1 << 20)).toFixed(2));
	mem > 1 << 10 && mem > 1 << 20 && (KB = (mem / (1 << 10)).toFixed(2));
	return G > 0 ? G + "G" : M > 0 ? M + "M" : KB > 0 ? KB + "KB" : mem + "B";
};

module.exports = {
	dealTime,
	dealMem,
};
