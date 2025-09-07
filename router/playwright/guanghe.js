// basic.js
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const downloadPath = path.join(
  __dirname,
  "/downloads/storage/guanghe-auth.json"
);

const downloadImagePath = path.join(__dirname, "/downloads/images/guanghe");

(async () => {
  // 启动浏览器实例
  const browser = await chromium.launch({ headless: false });

  // 使用 storageState 创建 context

  let context;
  if (fs.existsSync(downloadPath)) {
    console.log("发现 auth.json，尝试自动登录");
    context = await browser.newContext({
      storageState: downloadPath,
    });
  } else {
    context = await browser.newContext();
  }

  // 用 context 创建页面
  const page = await context.newPage();

  // 导航到广告创意页面
  await page.goto(
    "https://creator.guanghe.taobao.com/page/unify/asset-overview"
  );

  const isLogin = await judgeLogin(page);

  console.log("当前页面", page.url());

  // 检查是否已登录（比如页面是否跳转到 aurora）
  if (isLogin) {
    // 未登录，执行登录流程 会遇到滑块验证码
    await page.waitForSelector(".login-content");

    await page.screenshot({ path: downloadImagePath });

    await page.fill('[name="fm-login-id"]', "15882542241");

    await page.fill('[name="fm-login-password"]', "hzm888");

    await page.click(".fm-agreement");

    // 点击登录并等待导航
    await Promise.all([
      page.waitForURL("**/page/**"),
      page.click(".password-login"),
    ]);

    console.log("已完成登录流程");

    // 登录后保存状态
    await context.storageState({
      path: downloadPath,
    });
  } else {
    console.log("已自动登录，无需再次登录");
  }

  // 获取页面标题
  const title = await page.title();

  console.log(`页面标题: ${title}`);

  // 获取并打印 cookie
  //   const cookies = await context.cookies(); // 现在又能获取了

  //   console.log("context获取cookie:", cookies);

  // 后续操作...

  // 处理可能出现的弹窗
  // await handlePotentialPopups(page);

  // 等待并点击下载按钮
  // await clickDownloadButton(page);
})();

async function judgeLogin(page) {
  let isLogin = false;
  try {
    await page.waitForSelector("text=登录", { timeout: 5000 });
    isLogin = true; // 找到登录按钮，说明未登录
  } catch (e) {
    isLogin = false; // 没找到登录按钮，说明已登录
  }
  console.log("是否需要登录：", isLogin);
  return isLogin;
}
