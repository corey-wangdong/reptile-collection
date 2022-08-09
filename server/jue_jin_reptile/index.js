const info = require('./info.json');
const { request, params, baseUrl, default_headers } = require('./utils');

const headers_detail = {
  ...default_headers,
  "cookie": info.cookie
}

const run_sign = async () => {
  // 获取今天的签到状态
  const today_status = await request(`${baseUrl}/get_today_status?${params}`, headers_detail);
  const todayStatusInfo = JSON.parse(today_status.text);

  // 获取当月的签到信息
  // const month_info = await request(`${baseUrl}/get_by_month?${params}`, headers_detail);
  // console.log('month_info----', month_info.text);

  console.log(`你目前连续签到 ${countsInfo.data.cont_count} 天，总共签到 ${countsInfo.data.sum_count} 天。`);
  console.log(`你今天 ${todayStatusInfo.data ? '已' : '还未'} 签到。`);
  console.log(`你当前的总矿石数是 ${curPointInfo.data} 个`);


  if (!todayStatusInfo.data) {
    // 开始去签到
    const signature = `_signature=${info.signature}`;
    const check_in = await request(`${baseUrl}/check_in?${params}&${signature}`, headers_detail, 'post');
    const checkInInfo = JSON.parse(check_in.text);
    console.log('checkInInfo----', checkInInfo);

    if (checkInInfo.err_msg) {
      checkInInfo.err_msg === 'success'
        ?
        console.log('你已签到成功')
        :
        console.log(`${checkInInfo.err_msg}`)
      return;
    }
    console.log('已签到失败');
    return;
  }

  // 获取签到次数
  const counts = await request(`${baseUrl}/get_counts?${params}`, headers_detail);
  const countsInfo = JSON.parse(counts.text);

  // 获取当前的总点数
  const cur_point = await request(`${baseUrl}/get_cur_point?${params}`, headers_detail);
  const curPointInfo = JSON.parse(cur_point.text);

  // 获取惊喜好物
  // {page_no: 1, page_size: 16, type: 1, got_channel: 2}
  // {page_no: 2, page_size: 16, type: 1, got_channel: 2}
  // {page_no: 1, page_size: 16, type: 2, got_channel: 2}
  // const query = 'page_no=1&page_size=16&type=1&got_channel=2';
  // const benefit_page = await request(`${baseUrl}/get_benefit_page?${params}&${query}`, headers_detail, 'post');
  // const benefitPageInfo = JSON.parse(benefit_page.text);
  // console.log('benefitPageInfo----', benefitPageInfo);
}

run_sign();