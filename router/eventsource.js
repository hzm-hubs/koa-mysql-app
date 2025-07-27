module.exports = (router) => {
	router.get("/eventsource/back", (ctx, next) => {
		ctx.status = 200; // 绕过koa的body语法，使用node原生http必须设置status
		// 设置响应头，确保是 SSE 格式
		ctx.set("Content-Type", "text/event-stream");
		ctx.set("Cache-Control", "no-cache");
		ctx.set("Connection", "keep-alive");
		// console.log("res", JSON.stringify(ctx.res)); 不能在这里使用JSON.stringify打印
		// 使用原生响应流
		const res = ctx.res;
		let str = "豫章故郡，洪都新府。";
		// res.write(`start\n\n`);
		// 模拟流式推送数据
		return new Promise((resolve) => {
			let i = 0,
				total = 10;
			while (i <= total) {
				(function (i) {
					setTimeout(() => {
						if (i === total) {
							resolve();
							res.end();
						} else {
							res.write(`data:${JSON.stringify({ content: str[i] })}\n\n`);
						}
					}, i * 1000);
				})(i);
				i++;
			}
		});

		// 监听客户端断开连接
		ctx.req.on("close", () => {
			clearInterval(interval); // 清理定时器
			console.log("Client disconnected");
		});
	});

	router.get("/eventsource1", (ctx, next) => {
		// 定义一个计数器，用于发送数据
		let counter = 0;
		ctx.body = `id:${counter}\n`; // 消息 ID
	});
};
