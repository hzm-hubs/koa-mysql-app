// basic.js
const { chromium } = require("playwright");
const path = require("path");

// 转换函数
function parseCookies(cookieStr, domain = "") {
	// 1. 按分号分割字符串，并过滤掉可能存在的首尾空格
	const cookiePairs = cookieStr.split(";").map((pair) => pair.trim());

	// 2. 遍历并构建 cookie 对象数组
	const cookies = cookiePairs.map((pair) => {
		// 找到第一个等号的位置，将字符串分为 name 和 value
		const [name, ...valueParts] = pair.split("=");
		const value = valueParts.join("="); // 处理值中包含等号的特殊情况

		// 3. 返回 Playwright 所需的 Cookie 对象
		// 注意：从 document.cookie 无法获取 domain/path/expires 等属性，必须手动指定！
		return {
			name: name.trim(),
			value: (value || "").trim(), // 处理可能没有值的情况
			domain: domain, // 必须指定！通常是 '.主域名'
			path: "/", // 通常设为根路径
			// 其他可选属性，如果已知可以加上，否则 Playwright 会使用默认值
			// httpOnly: false,
			// secure: false,
			// expires: Math.floor(Date.now() / 1000) + 86400, // 设置一天后过期
			// sameSite: 'Lax',
		};
	});

	// 4. 过滤掉无效的 cookie（例如空 name）
	return cookies.filter((cookie) => cookie.name);
}

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

	const tempCookie =
		"xsecappid=aurora-shell; a1=198db7e77b44nk1grxb69j0yaaja5rii4bsbpqn7z50000223307; webId=93b11e87644d54cd7050dcfa553c0cb2; websectiga=88%3B6be45f388a1ee7bf611a69f3e174cae48f1ea02c0f8ec3256031b8be9c7ee; sec_poison_id=4f9eefd3-9b42-442f-9221-8c71c43f7f6b; ares.beaker.session.id=1756029152052035675365; access-token-ad.xiaohongshu.com=customer.leona.AT-68c517542087775411865980m18vx81rarhiu0sj; loadts=1756029158642; gid=yjYfDWdYK04DyjYfDWdWWDAID44ITykFCDKjMWuV8v00VD2802F33U888JJqq8W8WqSW0K2Y";

	const parseResult = parseCookies(tempCookie, ".xiaohongshu.com");

	console.log("转换结果", parseResult);

	await context.addCookies(parseResult);

	await page.goto("https://ad.xiaohongshu.com/aurora/ad/manage/creativity");

	// 获取页面标题
	const title = await page.title();

	console.log(`页面标题: ${title}`);
})();
