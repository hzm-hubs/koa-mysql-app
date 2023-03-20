// 动态路由
const koaRouter = require("koa-router");

const router = new koaRouter();

// 导入模块
// const mysql = require("mysql2");
// 创建一个数据库连接
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   database: "hliuliu",
// });

// 使用封装好的池连接
const poolConnection = require("../plugins/connection");

// 使用通用返回体
const { commonBack } = require("../plugins/utils");

// 获取用户信息接口
var judgeInfo = require("./user");
router.get("/user/:name", (ctx, next) => {
  console.log("ctx.params", ctx.params);
  console.log("ctx.query", ctx.query);
  let response = judgeInfo(ctx.params?.name);
  ctx.body = response;
});

// 获取工资接口
router.post("/getSalarys", (ctx, next) => {
  // 不能直接赋值
  return new Promise(async (resolve, reject) => {
    let { pageNum, pageSize, year } = ctx.request.body;
    // console.log("接受到的参数pageNum", year);
    let sqlExpression = "SELECT * FROM `incomes`";
    let totalExpression = "SELECT COUNT(*) num FROM `incomes`";
    let total,
      list = 0;

    // 添加条件查询
    if (year) {
      sqlExpression += `where name = ${year}`;
      totalExpression += `where name = ${year}`;
      // like 查询
      // sqlExpression += ` where name LIKE '%${year}%'`;
      // totalExpression += ` where name LIKE '%${year}%'`;
    }

    // 获取总数 promise 
    const back = await poolConnection.query(totalExpression);
    total = back?.[0]?.num || 0;
    // poolConnection.query(totalExpression).then((res) => {
    //   console.log(12)
    //   total = res?.[0]?.num || 0
    //   if (total) {
    //     resolve(
    //       commonBack(
    //         {
    //           total,
    //           list,
    //         },
    //         "success"
    //       )
    //     );
    //   } else {
    //     resolve(commonBack(null, "/getSalarys"));
    //   }
    // });

    // 添加分页查询
    sqlExpression += ` limit ${pageSize} OFFSET ${
      pageNum > 1 ? (pageNum - 1) * pageSize : 0
    }`;
    list = await poolConnection.query(sqlExpression);

    resolve(
      commonBack(
        {
          total,
          list,
        },
        "success"
      )
    );

    // 旧写法
    // poolConnection.query(sqlExpression, function (err, results, fields) {
    //   console.log(fields); // 额外的元数据（如果有的话）
    //   console.log("results", results);
    //   if (!err) {
    //     resolve(
    //       commonBack(
    //         {
    //           list: results,
    //           total,
    //         },
    //         "success"
    //       )
    //     );
    //   } else {
    //     commonBack(null, "/getSalarys");
    //   }
    // });
  }).then((data) => {
    ctx.body = data;
  });
});

module.exports = router;
