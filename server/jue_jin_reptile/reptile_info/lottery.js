const {
  baseUrl,
  axios_request,
  params,
  default_headers,
  signature
} = require('../utils');

// 获取抽奖的内容 和次数
const run_lottery_config = async () => {
  const lottery_config = await axios_request(`${baseUrl}/lottery_config/get?${params}`, 'get', default_headers);
  if (lottery_config.err_msg === 'success') {
    const { lottery = [], free_count, point_cost } = lottery_config.data;
    const award = lottery.map(item => item.lottery_name);
    console.log(`当前抽奖池里的奖品有: ${award.join(', ')}`);
    console.log(`当前的免费抽奖次数为: ${free_count} 次`);
    console.log(`当前抽奖一次奖品需要的钻石为: ${point_cost} 个`);

    // 当前如果有免费抽奖次数就去抽奖
    while (free_count > 0) {
      await run_lottery_draw();
      free_count--
    }

    await run_lottery_history();
  } else {
    console.log(`${lottery_config.err_msg}`);
  }
}

// 当前抽到的奖品
const run_lottery_draw = async () => {
  const lottery_draw = await axios_request(`${baseUrl}/lottery/draw?${params}&${signature}`, 'post', default_headers);
  lottery_draw.err_msg === 'success'
    ? console.log(`恭喜你💐 当前抽中的奖品为: ${lottery_draw.data.lottery_name}`)
    : console.log(`${lottery_draw.err_msg}`);
}

// 获取当前已有的道具
const run_lottery_history = async () => {
  const lottery_history = await axios_request(`${baseUrl}/lottery_history/items_by_page?${params}`, 'post', default_headers);
  if (lottery_history.err_msg === 'success') {
    const data = lottery_history.data;
    let str = `你当前只有${data.count}种类型的道具, 道具为: `;
    data.lottery_histories.forEach((item) => {
      str = str + `${item.lottery_count}个${item.lottery_name} `
    })
    console.log(`${str}`);
  } else {
    console.log(`${lottery_history.err_msg}`);
  }
}


const run_lottery = () => {
  // 获取抽奖的内容 和次数
  run_lottery_config();

  // 当前抽到的奖品
  // run_lottery_draw();

  // 获取当前已有的道具
  // run_lottery_history();
}

module.exports = {
  run_lottery
}