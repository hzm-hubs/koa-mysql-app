// 工资处理函数

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

module.exports = (router) => {
	// 获取工资接口
	router.post("/salary/list", (ctx, next) => {
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

			// 使用 await 或者 then 获取总数 promise
			const back = await poolConnection.query(totalExpression);
			total = back?.[0]?.num || 0;

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

	// 新增工资项
	router.post("/salary/add", (ctx, next) => {
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

	// 删除工资项
	router.get("/salary/delete/:id", (ctx, next) => {
		return new Promise(async (resolve, reject) => {
			if (!ctx.params?.id) {
				resolve(
					commonBack(null, "error, id is required!", 1002, "/deleteSalarys")
				);
			}
			const back = await poolConnection.query(
				`DELETE FROM incomes WHERE id=?`,
				[ctx.params?.id]
			);
			if (back?.affectedRows) {
				resolve(commonBack(null, "success"));
			} else {
				resolve(commonBack(null, "failed", "/deleteSalarys"));
			}
		}).then((data) => {
			ctx.body = data;
		});
	});

	// 编辑工资项
	router.post("/salary/update", (ctx, next) => {
		return new Promise(async (resolve, reject) => {
			let { id, name, company, pretax, aftertax, descrip } = ctx.request.body;
			if (!id) {
				resolve(
					commonBack(null, "error, id is required!", 1002, "/updateSalarys")
				);
			}
			if (!name || !pretax || !aftertax) {
				resolve(
					commonBack(
						null,
						"error, name, pretax, aftertax is required!",
						1002,
						"/updateSalarys"
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
};
