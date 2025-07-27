module.exports = {
  apps: [
    {
      name: "koa-mysql-app",
      script: "./app.js",
      instances: "max", // 使用所有CPU核心
      exec_mode: "cluster", // 集群模式
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 7001,
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
