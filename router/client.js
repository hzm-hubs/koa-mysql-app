// 获取客户端ip
function getClientIp(req) {
	// return (
	// 	req.headers["x-forwarded-for"] ||
	// 	req.connection.remoteAddress ||
	// 	req.socket.remoteAddress ||
	// 	req.connection.socket.remoteAddress
	// );
	// console.log("req", req);

	return req;
}

module.exports = getClientIp;
