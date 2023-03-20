const mysql = require('mysql2')
const config = require('../config/index')//引入配置文件
const pool = mysql.createPool({
  host: config.mysql.host,
  user: config.mysql.user,
  database: config.mysql.database,
  // password: config.mysql.password,
  // port: config.mysql.port
})

//将数据库的异步操作，封装在一个Promise中
/**
 * 
 * @param {*} sql  要执行的语句
 * @param {*} values 插入/修改语句可能用到
 * @returns 
 */
let query = function (sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows,fields) => {
          if (err) {
            console.log('失败了的查询语句',sql)
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}

module.exports = { query }