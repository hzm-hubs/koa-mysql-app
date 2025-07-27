// 文件模块
const fs = require("fs");

// 获取文件
// fileRoute  从当前执行运行的目录下
// 如.../expressapp 下启动项目要从 expressapp 写与目标文件的相对路径
function readFile(fileRoute = "", option = "utf-8") {
  return new Promise((resolve, reject) => {
    if (!fileRoute) {
      resolve("file param is none");
    }

    fs.readFile(fileRoute, option, (err, data) => {
      if (err) {
        resolve(`no ${fileRoute} file or it is not useful`);
      } else {
        resolve(data);
      }
    });
  });
}

function writeFile(fileRoute = "", data, option = "utf-8") {
  return new Promise((resolve, reject) => {
    if (!fileRoute) {
      resolve("file param is none");
    }

    fs.writeFile(fileRoute, data, option, (err, data) => {
      if (err) {
        resolve(`no ${fileRoute} file or it is not useful`);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = {
  readFile,
  writeFile,
};
