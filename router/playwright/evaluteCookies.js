// basic.js
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

(async () => {
	// 启动浏览器实例
	const browser = await chromium.launch({ headless: false });

	// 模拟window
	const context = await browser.newContext({
		// 禁用所有扩展
		// bypassCSP: true, // 绕过内容安全策略
		// ignoreHTTPSErrors: true, // 忽略HTTPS错误
		// // 设置更真实的用户代理
		// userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
		// storageState: path.join(__dirname,'./downloads/storage/state.json')
	});

	// 创建新页面
	const page = await browser.newPage();

	// 导航到广告创意页面
	await page.goto("https://ad.xiaohongshu.com");

	await page.evaluate(() => {
		document.cookie =
			"xsecappid=aurora-shell; a1=198db7e77b44nk1grxb69j0yaaja5rii4bsbpqn7z50000223307; webId=93b11e87644d54cd7050dcfa553c0cb2; websectiga=88%3B6be45f388a1ee7bf611a69f3e174cae48f1ea02c0f8ec3256031b8be9c7ee; sec_poison_id=4f9eefd3-9b42-442f-9221-8c71c43f7f6b; ares.beaker.session.id=1756029152052035675365; access-token-ad.xiaohongshu.com=customer.leona.AT-68c517542087775411865980m18vx81rarhiu0sj; loadts=1756029158642; gid=yjYfDWdYK04DyjYfDWdWWDAID44ITykFCDKjMWuV8v00VD2802F33U888JJqq8W8WqSW0K2Y";
		location.reload();
	});

	// 获取页面标题
	const title = await page.title();

	console.log(`页面标题: ${title}`);
})();
