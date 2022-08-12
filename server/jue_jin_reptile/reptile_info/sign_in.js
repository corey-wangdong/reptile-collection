
const {
  axios_request,
  params,
  signature,
  baseUrl,
  default_headers
} = require('../utils');

const run_sign = async () => {
  // 获取今天的签到状态
  const today_status = await axios_request(`${baseUrl}/get_today_status?${params}`, 'get', default_headers);
  today_status.err_msg === 'success'
    ? console.log(`你今天${today_status.data ? '已' : '还未'} 签到。`)
    : console.log(`${today_status.err_msg}`);

  if (!today_status.data) {
    // 开始去签到
    const check_in = await axios_request(`${baseUrl}/check_in?${params}&${signature}`, 'post', default_headers);
    check_in.err_msg === 'success'
      ? console.log('恭喜你, 签到成功')
      : console.log(`${check_in.err_msg}`);
  }

  // 获取签到次数
  const counts = await axios_request(`${baseUrl}/get_counts?${params}`, 'get', default_headers);
  counts.err_msg === 'success'
    ? console.log(`目前连续签到 ${counts.data.cont_count} 天，总共签到 ${counts.data.sum_count} 天。`)
    : console.log(`${counts.err_msg}`);

  // 获取当前的总点数
  const cur_point = await axios_request(`${baseUrl}/get_cur_point?${params}`, 'get', default_headers);
  cur_point.err_msg === 'success'
    ? console.log(`当前的总矿石数是 ${cur_point.data} 个`)
    : console.log(`${cur_point.err_msg}`);

  // 获取当月的签到信息
  // const month_info = await axios_request(`${baseUrl}/get_by_month?${params}`, 'get', default_headers);
  // console.log('month_info----', month_info);
}

module.exports = {
  run_sign
}