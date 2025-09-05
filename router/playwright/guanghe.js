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
	});

	// 创建新页面
	const page = await browser.newPage();

	// 导航到广告创意页面
	await page.goto(
		"https://creator.guanghe.taobao.com/page/unify/asset-overview"
	);

	await page.evaluate(() => {
		document.cookie =
			"xsecappid=aurora-shell; a1=198db7e77b44nk1grxb69j0yaaja5rii4bsbpqn7z50000223307; webId=93b11e87644d54cd7050dcfa553c0cb2; websectiga=88%3B6be45f388a1ee7bf611a69f3e174cae48f1ea02c0f8ec3256031b8be9c7ee; sec_poison_id=4f9eefd3-9b42-442f-9221-8c71c43f7f6b; ares.beaker.session.id=1756029152052035675365; access-token-ad.xiaohongshu.com=customer.leona.AT-68c517542087775411865980m18vx81rarhiu0sj; loadts=1756029158642; gid=yjYfDWdYK04DyjYfDWdWWDAID44ITykFCDKjMWuV8v00VD2802F33U888JJqq8W8WqSW0K2Y";
		window.location.reload();
	});

	//   await page.waitForSelector(".login-btn-modal");

	//   await page.click("text=账号登录");

	//   await page.fill('[name="email"]', "2253051861@qq.com");

	//   await page.fill('[name="password"]', "cqxhs123@");

	//   await page.click(".cursor-pointer");

	//   // 点击登录并等待导航
	//   await Promise.all([
	//     page.waitForURL("**/aurora/**"),
	//     page.click(".beer-login-btn"),
	//   ]);

	console.log("登录成功，检测并处理弹窗...");

	// 获取出来是空的
	// const cookie1 = await context.cookies();

	const cookie2 = await page.evaluate(() => document.cookie);

	console.log("cookie2", cookie2);
})();
