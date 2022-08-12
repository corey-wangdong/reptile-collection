const { run_sign } = require('./reptile_info/sign_in');
const { run_lottery } = require('./reptile_info/lottery');
const { run_benefit } = require('./reptile_info/good_surprise');
const { run_update_avatar } = require('./reptile_info/update_avatar');

const run = async () => {
  // 获取签到相关信息
  await run_sign();

  // 获取抽奖相关信息
  await run_lottery();

  // 获取惊喜好物相关信息
  // await run_benefit()

  // 替换头像
  const avatar = 'https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff3c47ee14c8497fb728540f21e5aa26~tplv-k3u1fbpfcp-watermark.image';
  // run_update_avatar(avatar)
}

run();