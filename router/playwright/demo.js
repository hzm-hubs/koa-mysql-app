const { chromium } = require("playwright");

async function handleLoginAndDownload() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log("导航到登录页面...");
    await page.goto("https://ecommerce-site.com/login");

    // 登录操作
    await page.fill("#username", "your_username");
    await page.fill("#password", "your_password");

    // 点击登录并等待导航
    await Promise.all([
      page.waitForURL("**/dashboard**"),
      page.click("#login-btn"),
    ]);

    console.log("登录成功，检测并处理弹窗...");

    // 处理可能出现的弹窗
    await handlePotentialPopups(page);

    // 等待并点击下载按钮
    await clickDownloadButton(page);

    console.log("下载操作已触发");
  } catch (error) {
    console.error("流程执行失败:", error.message);
    await page.screenshot({ path: "error-screenshot.png" });
  } finally {
    await browser.close();
  }
}

// 专门的弹窗处理函数
async function handlePotentialPopups(page) {
  const popupSelectors = [
    ".modal",
    ".popup",
    ".dialog",
    '[role="dialog"]',
    ".notification",
    ".alert",
    ".toast",
    "#welcome-popup",
    "#tutorial-modal",
  ];

  const maxWaitTime = 10000; // 10秒最大等待
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    let popupFound = false;

    for (const selector of popupSelectors) {
      try {
        // 快速检查可见弹窗
        const popup = await page.$(selector);
        if (popup && (await popup.isVisible())) {
          console.log(`发现弹窗: ${selector}`);
          popupFound = true;

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
    }

    // 如果没有找到弹窗，等待一下再检查
    if (!popupFound) {
      await page.waitForTimeout(500);

      // 额外检查常见的弹窗关闭按钮
      const closeButtons = await page.$$(
        '[aria-label="Close"], .close, .modal-close'
      );
      for (const btn of closeButtons) {
        if (await btn.isVisible()) {
          await btn.click();
          console.log("点击通用关闭按钮");
          await page.waitForTimeout(1000);
        }
      }
    } else {
      // 如果处理了弹窗，短暂等待后继续检查
      await page.waitForTimeout(1000);
    }

    // 检查是否已经可以访问下载按钮
    try {
      const downloadBtn = await page.$("#download-button");
      if (downloadBtn && (await downloadBtn.isVisible())) {
        console.log("下载按钮可见，停止弹窗检查");
        return true;
      }
    } catch (error) {
      // 继续检查
    }
  }

  throw new Error("弹窗处理超时");
}

// 尝试关闭弹窗的方法
async function tryClosePopup(page, selector) {
  const closeMethods = [
    // 方法1: 查找关闭按钮
    async () => {
      const closeBtn = await page.$(`${selector} [aria-label="Close"], 
                                   ${selector} .close, 
                                   ${selector} [data-dismiss="modal"]`);
      if (closeBtn && (await closeBtn.isVisible())) {
        await closeBtn.click();
        return true;
      }
      return false;
    },

    // 方法2: 点击背景遮罩
    async () => {
      const overlay = await page.$(
        '.modal-backdrop, .overlay, [role="presentation"]'
      );
      if (overlay && (await overlay.isVisible())) {
        await overlay.click();
        return true;
      }
      return false;
    },

    // 方法3: 按ESC键
    async () => {
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
      return true;
    },

    // 方法4: 点击确认/知道了按钮
    async () => {
      const confirmBtn = await page.$(`${selector} .btn-primary, 
                                     ${selector} .btn-confirm,
                                     ${selector} [type="button"]`);
      if (confirmBtn && (await confirmBtn.isVisible())) {
        await confirmBtn.click();
        return true;
      }
      return false;
    },
  ];

  for (const method of closeMethods) {
    try {
      if (await method()) {
        await page.waitForTimeout(500); // 等待关闭完成
        return true;
      }
    } catch (error) {
      // 方法失败，尝试下一个
      continue;
    }
  }

  return false;
}

// 安全的下载按钮点击
async function clickDownloadButton(page) {
  // 先确保页面稳定
  await page.waitForLoadState("networkidle");

  // 多种选择器策略
  const downloadSelectors = [
    "#download-button",
    '[data-testid="download-btn"]',
    'button:has-text("下载")',
    'a[href*="download"]',
    ".btn-download",
    "button >> text=导出",
  ];

  for (const selector of downloadSelectors) {
    try {
      const button = await page.waitForSelector(selector, {
        state: "visible",
        timeout: 5000,
      });

      // 确保按钮可点击
      await button.waitForElementState("enabled");

      console.log(`找到下载按钮: ${selector}`);
      await button.click();
      return;
    } catch (error) {
      console.log(`未找到按钮: ${selector}`);
    }
  }

  throw new Error("无法找到下载按钮");
}

// 执行流程
handleLoginAndDownload().catch(console.error);
