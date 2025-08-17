// 引入 koa
const koa = require("koa");

const path = require("path");

const { exec } = require("node:child_process");

const cors = require("koa2-cors");

// POST请求参数需要用到
const { koaBody } = require("koa-body");

const app = new koa();

app.use(koaBody());

/**
 *  可以设置代理
 *  app.proxy = true
 */

// 可以通过使用async功能 使用一些中间件
// 这里的ctx 指向 context 上下文
/**
 *  ctx 包含 request、header、response、app、originalUrl 、 req 、res 、socket
 */

app.use(
  cors({
    origin: function (ctx) {
      return "*";
    },
    // exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    // credentials: true,
    // allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
    // allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })
);

// middleware1
app.use(async (ctx, next) => {
  /**
   *  当一个中间件调用 next() 则该函数暂停并将控制传递给定义的下一个中间件。
   *  当在下游没有更多的中间件执行后，堆栈将展开并且每个中间件恢复执行其上游行为。
   */
  // 执行权先交给下一个中间件
  await next();

  // 获取来自下一个中间件的结果
  let rt = ctx.response.get("X-Response-Time");
  let ts = new Date().toLocaleString();

  let curLog = `${ctx.method} ${ctx.url} - ${rt}, ${ts}`;

  // 控制台输出日志
  console.log(curLog);
  // 或者新开终端 tail -f ./logs/index.log 循环打印日志

  exec(
    `echo ${curLog} >> ${path.join(__dirname, "./logs/index.log")}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      // console.log(`stdout: ${stdout}`);
      // console.error(`stderr: ${stderr}`);
    }
  );
});

// middleware2
app.use(async (ctx, next) => {
  const start = Date.now();

  await next();

  const ms = Date.now() - start;

  // 上下文设置 X-Response-Time 属性，可供上一层中间件调用
  ctx.set("X-Response-Time", `${ms}.ms`);
});

module.exports = app;
