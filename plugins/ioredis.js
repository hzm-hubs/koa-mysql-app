const config = require("../config/index"); //引入配置文件

const Redis = require("ioredis");

// By default, it will connect to localhost:6379.
// We are going to cover how to specify connection options soon.
// const redis = new Redis();

// connect redis
const redis = new Redis({
	host: config.redis.host,
	port: config.redis.port,
});

// const redis = new Redis();

const setRedis = (key, value) => {
	redis.set(key, value);
};
const getRedis = (key) => {
	return Promise.resolve(redis.get(key));
};

module.exports = {
	setRedis,
	getRedis,
};
