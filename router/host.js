// 维护热搜数据

// 使用通用返回体
const { commonBack } = require("../plugins/utils");

const { readFile } = require("../plugins/fs");

const path = require("path");

const { exec } = require("node:child_process");

module.exports = (router) => {
  // 更新热搜数据
  router.post("/host/set", (ctx, next) => {
    // 写入赋值
    exec(
      `echo ${ctx.request?.data} >> ${path.join(
        __dirname,
        "../static/hosts.txt"
      )}`,
      (error, stdout, stderr) => {}
    );
  });

  // 获取热搜数据
  router.post("/host/get", (ctx, next) => {
    return new Promise(async (resolve, reject) => {
      readFile("../static/hosts.txt")
        .then((read) => {
          resolve(read);
        })
        .catch((err) => {
          res.send(err);
        });
    }).then((data) => {
      ctx.body = data;
    });
  });
};
