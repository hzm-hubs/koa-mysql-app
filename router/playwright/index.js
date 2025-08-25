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
	await page.goto("https://ad.xiaohongshu.com/aurora/ad/manage/creativity");

	// 获取页面标题
	const title = await page.title();

	console.log(`页面标题: ${title}`);

	// 截图
	// await page.screenshot({ path: "./example.png" });

	await page.waitForSelector(".login-btn-modal");

	await page.click("text=账号登录");

	await page.fill('[name="email"]', "2253051861@qq.com");

	await page.fill('[name="password"]', "cqxhs123@");

	await page.click(".cursor-pointer");

	// 点击登录并等待导航
	await Promise.all([
		page.waitForURL("**/aurora/**"),
		page.click(".beer-login-btn"),
	]);

	console.log("登录成功，检测并处理弹窗...");

	// 获取出来是空的
	// const cookie1 = await context.cookies();

	const cookie2 = await page.evaluate(() => document.cookie);

	console.log("cookie2", cookie2);

	// getListData(cookie2); // 通过fetch获取列表数据

	// 处理可能出现的弹窗
	await handlePotentialPopups(page);

	// 等待并点击下载按钮
	// await clickDownloadButton(page);
})();

// 专门的弹窗处理函数
async function handlePotentialPopups(page) {
	let popupSelectors = [
		"[class*=modal-footer] button",
		// ".create2-guide-modal",
	];

	const maxWaitTime = 30000; // 最大等待时长

	const startTime = Date.now();

	let morePop = true;
	let findPop = false;

	while (Date.now() - startTime < maxWaitTime) {
		for (const selector of popupSelectors) {
			try {
				// 快速检查可见弹窗
				const popup = await page.$(selector);
				if (popup) {
					console.log(`发现弹窗: ${selector}`);
					// 尝试关闭弹窗
					const closed = await tryClosePopup(page, selector);
					if (closed) {
						console.log(`成功关闭 ${selector} 弹窗`);
						await page.waitForTimeout(1000); // 等待关闭动画
					}
				}
			} catch (error) {
				// 忽略查找过程中的错误
			}
			await page.waitForTimeout(1000);
		}
	}
}

// 尝试关闭弹窗的方法
async function tryClosePopup(page, selector) {
	console.log("尝试关闭弹窗", `${selector}`);
	// 如果元素太小或被遮挡都会导致会点击失败
	// const element = await page.$(`${selector} button`);
	// console.log("element", element);
	// if (element) {
	//   // 方法1: 使用 isEnabled() 检查是否启用
	//   const isEnabled = await element.isEnabled();

	//   // 方法2: 使用 isVisible() 检查是否可见
	//   const isVisible = await element.isVisible();

	//   // 方法3: 检查是否连接到DOM
	//   const isConnected = await element.isConnected();

	//   if (isEnabled && isVisible && isConnected) {
	//     await element.click();
	//     console.log("元素点击成功");
	//   } else {
	//     console.log("元素不可点击");
	//   }
	// }

	// 通过页面捕获函数执行
	await page.evaluate(async () => {
		const targetBtn = document.querySelector(`${selector}`);
		console.log("定位到关闭按钮", targetBtn);
		if (targetBtn) {
			targetBtn.click();
			console.log("已经关闭弹窗");
		}
	});
	return true;
}

// 安全的下载按钮点击
async function clickDownloadButton(page) {
	console.log("进入下载");
	// 先确保页面稳定
	await page.waitForLoadState("networkidle");

	// 多种选择器策略
	const downloadSelectors = [
		'span:has-text("下载表格")',
		// "#download-button",
		// '[data-testid="download-btn"]',
		// 'button:has-text("下载")',
		// 'span:has-text("下载表格")',
		// 'a[href*="download"]',
		// ".btn-download",
		// "button >> text=导出",
	];

	for (const selector of downloadSelectors) {
		try {
			const button = await page.waitForSelector(selector, {
				timeout: 15000,
			});
			console.log(`找到下载按钮: ${selector}`);
			await button.click();
			return;
		} catch (error) {
			console.log(`未找到按钮: ${selector}`);
		}
	}

	throw new Error("无法找到下载按钮");
}

async function getListData(cookieData) {
	const arrayData = await fetch(
		"https://ad.xiaohongshu.com/api/leona/rtb/creativity/list",
		{
			method: "post",
			body: JSON.stringify({
				startTime: "2025-08-24",
				endTime: "2025-08-24",
				pageNum: 1,
				pageSize: 20,
			}),
			headers: {
				"Content-Type": "application/json",
				Cookie: cookieData,
			},
		}
	);
	const jsonData = await arrayData.json();
	console.log("获取数据", jsonData);
}

// 下载文件
async function downloadFile() {
	const [download] = await Promise.all([
		// Start waiting for the download
		page.waitForEvent("download"),
		// Perform the action that initiates download
		page.click("text=下载表格"),
	]);
	// Wait for the download process to complete
	const downloadPath = await download.path();
	console.log("downloadPath", downloadPath);
	const suggestedFilename = download.suggestedFilename();
	const finalPath = path.join(__dirname, "downloads", suggestedFilename);

	console.log("最终路径", finalPath);
}
