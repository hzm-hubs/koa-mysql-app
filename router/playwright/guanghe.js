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
