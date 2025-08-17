// basic.js
const { chromium } = require("playwright");

(async () => {
  // 启动浏览器（默认无头模式）
  const browser = await chromium.launch({ headless: false });

  // 模拟window
  const context = await browser.newContext();

  // 创建新页面
  const page = await browser.newPage();

  // 导航到网页
  await page.goto(
    "https://ad.xiaohongshu.com/aurora/ad/datareports-basic/creativity"
  );

  // 获取页面标题
  const title = await page.title();
  console.log(`页面标题: ${title}`);

  // 截图
  //   await page.screenshot({ path: "example.png" });

  await page.waitForSelector(".login-btn-modal");

  const cookies = await context.cookies();

  console.log(`页面cookies: ${cookies}`);

  //   context.querySelectorAll("[name='email']")[0].value = "2253051861@qq.com";
  await page.fill('[name="email"]', "2253051861@qq.com");
  //   context.querySelectorAll("[name='password']")[0].value = "cqxhs123@";
  //   await page.getByRole("input", { name: "password" }).fill("cqxhs123@");
  console.log(`已这是账号`);

  await page.fill('[name="password"]', "cqxhs123@");

  console.log(`已这是密码`);

  await page.click(".cursor-pointer");

  console.log(`点击同意`);

  await page.click(".beer-login-btn");
  //   await page.getByRole("button", { name: "Submit" }).click();

  console.log(`点击登录`);

  // 关闭浏览器
  //   await browser.close();
})();
