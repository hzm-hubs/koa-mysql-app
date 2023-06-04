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
  // consoleInfo("ctx.params", ctx.params);
  // consoleInfo("ctx.query", ctx.query);
  let response = judgeInfo(ctx.params?.name);
  ctx.body = response;
});

// 获取工资接口
router.post("/getSalarys", (ctx, next) => {
  // 不能直接赋值
  return new Promise(async (resolve, reject) => {
    let { pageNum, pageSize, year } = ctx.request.body;
    // consoleInfo("接受到的参数pageNum", year);
    //  ORDER BY name DESC 时间倒叙
    let sqlExpression = "SELECT * FROM `incomes` ORDER BY name DESC";
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
    //   consoleInfo(12)
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
    //   consoleInfo(fields); // 额外的元数据（如果有的话）
    //   consoleInfo("results", results);
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

// 新增项目
router.post("/addSalarys", (ctx, next) => {
  return new Promise(async (resolve, reject) => {
    let { name, company, pretax, aftertax, descrip } = ctx.request.body;
    if (!name || !pretax || !aftertax) {
      resolve(
        commonBack(
          null,
          "error, name, pretax, aftertax is required!",
          1002,
          "/addSalarys"
        )
      );
    }
    const isExist = await poolConnection.query(
      `SELECT * FROM incomes WHERE name = ?`,
      [name]
    );
    // consoleInfo("查询结果", isExist);
    if (isExist?.length) {
      resolve(commonBack(null, `data ${name} is exist!`, 1002));
      return;
    }
    const back = await poolConnection.query(
      `INSERT INTO incomes (name, company, pretax,aftertax, descrip) VALUES (?, ?, ?, ?,?);`,
      [name, company, pretax, aftertax, descrip]
    );
    resolve(commonBack(null, "success"));
  }).then((data) => {
    ctx.body = data;
  });
});

// 删除项目
router.get("/deleteSalarys/:id", (ctx, next) => {
  return new Promise(async (resolve, reject) => {
    if (!ctx.params?.id) {
      resolve(
        commonBack(null, "error, id is required!", 1002, "/deleteSalarys")
      );
    }
    const back = await poolConnection.query(`DELETE FROM incomes WHERE id=?`, [
      ctx.params?.id,
    ]);
    if (back?.affectedRows) {
      resolve(commonBack(null, "success"));
    } else {
      resolve(commonBack(null, "failed", "/deleteSalarys"));
    }
  }).then((data) => {
    ctx.body = data;
  });
});

// 编辑项目
router.post("/updateSalarys", (ctx, next) => {
  return new Promise(async (resolve, reject) => {
    let { id, name, company, pretax, aftertax, descrip } = ctx.request.body;
    if (!id) {
      resolve(commonBack(null, "error, id is required!", 1002, "/addSalarys"));
    }
    if (!name || !pretax || !aftertax) {
      resolve(
        commonBack(
          null,
          "error, name, pretax, aftertax is required!",
          1002,
          "/addSalarys"
        )
      );
    }
    const back = await poolConnection.query(
      `UPDATE incomes SET name=?, company=?, pretax=?,aftertax=?,descrip=? where id=?;`,
      [name, company, pretax, aftertax, descrip, id]
    );
    // consoleInfo("更新结果", back);
    resolve(commonBack(null, "success"));
  }).then((data) => {
    ctx.body = data;
  });
});

module.exports = router;
