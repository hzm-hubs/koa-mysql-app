export async function uploadViaAPI(filePath) {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));
  formData.append("description", "Playwright自动上传的文件");

  const response = await fetch("https://api.example.com/upload", {
    method: "POST",
    body: formData,
    headers: formData.getHeaders(),
  });

  if (response.ok) {
    const result = await response.json();
    console.log("上传成功:", result);
  } else {
    console.error("上传失败:", response.statusText);
  }
}

export async function uploadFile(page, filePath) {
  // 方法1: 使用 input[type="file"] 直接设置文件
  await page.goto("https://example.com/upload");

  // 选择文件上传输入框
  const fileInput = await page.$('input[type="file"]');

  if (fileInput) {
    console.log("使用直接文件输入方式上传");
    await fileInput.setInputFiles(filePath);

    // 提交表单
    await page.click("#submit-button");
    await page.waitForTimeout(3000);
  } else {
    // 方法2: 使用 API 接口上传
    console.log("使用API接口方式上传");
    await uploadViaAPI(filePath);
  }
}
