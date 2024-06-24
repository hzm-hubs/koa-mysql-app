// 统一处理返回结构
/**
 *
 * @param {*} code
 * @param {*} data 返回的数据结构体
 * @param {*} url 请求的接口地址
 */
function commonBack(data = "", msg = "", code = 1000, url = "") {
	if (!msg) {
		switch (code) {
			case 1000:
				msg = "success";
				break;
			case 1001:
				msg = "接口请求方式不对！";
				break;
			case 1002:
				msg = "请检查参数是否正确";
				break;
			case 404:
				msg = "请检查接口是否正确！" + url;
				break;
			case 500:
				msg = "Internal Server Error";
				break;
			default:
				msg = "error";
		}
	}

	return {
		code,
		msg,
		data,
	};
}

// 统一在这里处理打印
function consoleInfo(content = "", type = "string") {
	console.log(content);
}

function dealMem(data) {
	if (Math.abs(data) >= 1024 ** 4) {
		return `${Math.floor((data / 1024 ** 4) * 100) / 100}TB`;
	}
	if (Math.abs(data) >= 1024 ** 3) {
		return `${Math.floor((data / 1024 ** 3) * 100) / 100}GB`;
	}
	if (Math.abs(data) >= 1024 ** 2) {
		return `${Math.floor((data / 1024 ** 2) * 100) / 100}MB`;
	}
	if (Math.abs(data) >= 1024) {
		return `${Math.floor((data / 1024) * 100) / 100}KB`;
	}
	return `${data}B`;
}

module.exports = {
	commonBack,
	consoleInfo,
	dealMem,
};
