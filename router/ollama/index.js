const { Ollama } = require("ollama");

module.exports = (router) => {
	router.get("/ollama/chat", async (ctx, next) => {
		console.log("response.message", Ollama);
		// 访问部署的 ollma 资源
		const ollama = new Ollama({ host: "http://localhost:11434" });

		console.log("response.message", ollama);
		const response = await ollama.chat({
			model: "llama3.1",
			messages: [{ role: "user", content: "Why is the sky blue?" }],
		});

		ctx.body = `${response.content}`;
	});
};
