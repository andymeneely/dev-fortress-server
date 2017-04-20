const RedisIO = require('ioredis');

const redis = new RedisIO({
  enableReadyCheck: true,
});

redis.on('ready', () => {
  console.log('Redis is ready to receive requests...');
});

module.exports = redis;
