
const superagent = require('superagent');
const info = require('./info.json');


function request(url, headers, type = 'get') {
  return new Promise((resolve, reject) => {
    superagent[type](url)
      .set(headers)
      .end(async (err, res) => {
        if (err) reject(`访问失败----${err}`)
        resolve(res);
      })
  })
}

const headers_detail = {
  "accept": "*/*",
  "cookie": info.cookie,
  "content-type": "application/json",
  "referer": "https://juejin.cn/",
  "origin": "https://juejin.cn",
  "sec-ch-ua": `".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"`,
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "macOS",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
}

const run_sign = async () => {
  const params = `aid=${info.aid}&uuid=${info.uuid}`;
  const baseUrl = `https://api.juejin.cn/growth_api/v1`;
  // 获取签到次数
  const counts = await request(`${baseUrl}/get_counts?${params}`, headers_detail);
  const countsInfo = JSON.parse(counts.text);
  console.log('countsInfo----', countsInfo);

  // 获取当前的总点数
  const cur_point = await request(`${baseUrl}/get_cur_point?${params}`, headers_detail);
  const curPointInfo = JSON.parse(cur_point.text);
  console.log('curPointInfo----', curPointInfo);

  // 获取今天的签到状态
  const today_status = await request(`${baseUrl}/get_today_status?${params}`, headers_detail);
  const todayStatusInfo = JSON.parse(today_status.text);
  console.log('todayStatusInfo----', todayStatusInfo);

  // 获取当月的签到信息
  // const month_info = await request(`${baseUrl}/get_by_month?${params}`, headers_detail);
  // console.log('month_info----', month_info.text);

  console.log(`你目前连续签到 ${countsInfo.data.cont_count} 天，总共签到 ${countsInfo.data.sum_count} 天。`);
  console.log(`你今天 ${todayStatusInfo.data ? '已' : '还未'} 签到。`);
  console.log(`你当前的总矿石数是 ${curPointInfo.data} 个`);


  if (todayStatusInfo.data) {
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
}

run_sign();