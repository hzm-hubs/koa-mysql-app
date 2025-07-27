const { setRedis, getRedis } = require("../plugins/ioredis");

const regisRedis = function (router) {
  router.post("/redis/set", async (ctx, next) => {
    try {
      let { name, value } = ctx.request.body;
      setRedis(name, value);
      ctx.body = ctx.request.body;
    } catch (e) {
      console.log(e);
    }
  });

  router.get("/redis/get", async (ctx) => {
    try {
      let { query } = ctx;
      if (ctx?.query.name) {
        ctx.body = (await getRedis(ctx.query.name)) || "not found";
      } else {
        ctx.body = "not found";
      }
    } catch (e) {
      console.log(e);
    }
  });
};

module.exports = regisRedis;
