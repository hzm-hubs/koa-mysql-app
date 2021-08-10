// 引入依赖Koa
const Koa = require("Koa");
const port = 3000;
// 实例化
const app = new Koa();
const options = {
  maxAge: 7 * 60 * 60 * 24 * 1000, // 从文档被访问后的存活时间
  expires: 7 * 60 * 60 * 24 * 1000, // 指定的时间可以是相对文件的最后访问时间(Atime)或者修改时间(MTime),
  path: "/",
  httpOnly: true,
  overwrite: true,
};
// 未指明使用路径 所以 port 端口下的所有路径都会执行
app.use(async (ctx, next) => {
  // 当一个中间件调用 next() 则该函数暂停并将控制传递给定义的下一个中间件。当在下游没有更多的中间件执行后，
  // 堆栈将展开并且每个中间件恢复执行其上游行为。
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  try {
    let currentInfo = ctx.cookies.get("guid");
    console.log(`当前用户${currentInfo}`);
  } catch {
    ctx.throw(400, "user missing");
  }
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
  // cookie 会设置 控制区 application
  ctx.cookies.set("guid", "hzm06", options);
  ctx.cookies.set("token", "123");
});

app.use(async (ctx) => {
  ctx.body = "Hello World";
});

app.listen(port, () => {
  // 打印成功日志
  console.log(`koa app is listening on http://localhost:${port}`);
});
