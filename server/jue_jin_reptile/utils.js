const superagent = require('superagent');
const info = require('./info.json');

const params = `aid=${info.aid}&uuid=${info.uuid}`;
const baseUrl = `https://api.juejin.cn/growth_api/v1`;

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

const default_headers = {
  "accept": "*/*",
  "content-type": "application/json",
  "accept-language": "zh-CN,zh;q=0.9",
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

module.exports = {
  request,
  params,
  baseUrl,
  info,
  default_headers
}