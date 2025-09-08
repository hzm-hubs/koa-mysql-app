// basic.js
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const downloadPath = path.join(
  __dirname,
  "/downloads/storage/guanghe-auth.json"
);
const xlsxdownloadPath = path.join(__dirname, "/downloads/xlsx/guanghe");

const downloadImagePath = path.join(__dirname, "/downloads/images/guanghe");

(async () => {
  // 启动浏览器实例
  const browser = await chromium.launch({ headless: false });

  // 使用 storageState 创建 context

  let context;
  if (fs.existsSync(downloadPath)) {
    console.log("发现 guanghe-auth.json，尝试自动登录");
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
    await page.waitForSelector(".login-content");

    await page.click(".fm-agreement"); // 同意协议

    // 扫码登录
    // await page.screenshot({ path: downloadImagePath });
    // 扫码登录--end

    // 密码登录，执行登录流程 会遇到滑块验证码
    // await page.fill('[name="fm-login-id"]', "15882542241");

    // await page.fill('[name="fm-login-password"]', "hzm888");
    // 密码登录--end

    // 短信登录
    await page.click("text=短信登录");

    await page.fill('[name="fm-sms-login-id"]', "15882542241");

    await page.click("text=获取验证码");

    const smsCode = await loopGetSms();

    console.log("获取到的验证码:", smsCode);

    await page.fill('[name="fm-smscode"]', smsCode);
    // 短信登录--end

    // 点击登录并等待导航
    await Promise.all([
      page.waitForURL("**/page/**"),
      page.click(".fm-button"),
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
  handleDownload(page);
  // 后续操作...
  // browser.close();
})();

async function handleDownload(page, selector = 'img[alt*="导出"]') {
  const isExist = judgeLogin(selector);
  if (isExist) {
    const [download] = await Promise.all([
      page.waitForEvent("download"), // 等待下载事件
      page.click(selector), // 触发下载
    ]);
    const suggestedFilename = download.suggestedFilename();
    // 自定义下载路径和文件名
    await download.saveAs(xlsxdownloadPath + `/${suggestedFilename}`);
    // 等待下载完成
    await download.path();
    console.log("文件已下载到:", xlsxdownloadPath + `/${suggestedFilename}`);
  }
}

async function judgeLogin(page, tagetText = "text=登录") {
  let isLogin = false;
  try {
    await page.waitForSelector(tagetText, { timeout: 5000 });
    isLogin = true; // 找到登录按钮，说明未登录
  } catch (e) {
    isLogin = false; // 没找到登录按钮，说明已登录
  }
  console.log("是否需要登录：", isLogin);
  return isLogin;
}

async function loopGetSms(maxWaitTime = 60, inteval = 3000) {
  return new Promise((resolve) => {
    try {
      let currentTime = 0;
      let timer = null;
      timer = setInterval(async () => {
        console.log("准备最新验证码");
        if (currentTime < maxWaitTime) {
          const { status, body } = await fetch(
            "http://8.130.22.118:7002/redis/get?name=smsCode"
          );
          if (status == 200) {
            const reader = await body.getReader();
            const decoder = new TextDecoder("utf-8");
            const { value } = await reader.read();
            let buffer = "";
            buffer += decoder.decode(value);
            console.log("buffer:", buffer);
            if (buffer !== "not found") {
              clearInterval(timer);
              timer = null;
              resolve(buffer);
              // 清楚验证码
              fetch("http://8.130.22.118:7002/redis/set", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: "smsCode", value: "" }),
              });
            }
            currentTime += 1;
          }
        } else {
          clearInterval(timer);
          timer = null;
          resolve("");
        }
      }, inteval);
    } catch (e) {
      resolve("");
    }
  });
}
