
const {
  baseUrl,
  axios_request,
  params,
  default_headers
} = require('../utils');

// 当前抽到的奖品
const run_benefit_page = async () => {
  const query = 'page_no=2&page_size=16&type=1&got_channel=2';
  const benefit_page = await axios_request(`${baseUrl}/get_benefit_page?${params}&${query}`, 'post', { ...default_headers });
  console.log('benefit_page----', benefit_page);
  console.log('benefit_page.data', benefit_page.data);
}

const run_benefit = () => {
  // 获取抽奖的内容 和次数
  run_benefit_page();
}

module.exports = {
  run_benefit
}