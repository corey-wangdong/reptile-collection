const { request, params, baseUrl, default_headers } = require('../utils');


const headers_detail = {
  ...default_headers,
  "accept-encoding": "gzip, deflate, br",
  "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
}

const run_lottery = async () => {
  // 获取抽奖的内容
  const lottery_config = await request(`${baseUrl}/lottery_config/get?${params}`, headers_detail);
  const lotteryConfigInfo = JSON.parse(lottery_config.text);
  if (lotteryConfigInfo.err_msg === 'success') {
    const { lottery } = lotteryConfigInfo.data;
    console.log('lottery----', lottery);
  }

  const today_status = await request(`${baseUrl}/get_today_status?${params}`, headers_detail);
  const todayStatusInfo = JSON.parse(today_status.text);
  console.log('todayStatusInfo-----', todayStatusInfo);

  // 当前抽到的奖品
  // const signature = `_signature=${info.signature}`;
  // const lottery_draw = await request(`${baseUrl}/lottery/draw?${params}&${signature}`, headers_detail, 'post');
  // const lotteryDrawInfo = JSON.parse(lottery_draw.text);
  // console.log('lotteryDrawInfo-----', lotteryDrawInfo);

}

run_lottery();