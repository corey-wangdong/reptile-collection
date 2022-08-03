const superagent = require("superagent");

const headers = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'Accept2': 'text/plain, */*; q=0.01',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
  'sec-ch-ua': '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"'
}

function request(url, AcceptKey = 'Accept') {
  return new Promise((resolve, reject) => {
    superagent.get(url)
      .set('Accept', headers[AcceptKey])
      .set('Accept-Encoding', headers['Accept-Encoding'])
      .set('Accept-Language', headers['Accept-Language'])
      .set('Cache-Control', headers['Cache-Control'])
      .set('Connection', headers['Connection'])
      .set('User-Agent', headers['User-Agent'])
      .set('sec-ch-ua', headers['sec-ch-ua'])
      .end(async (err, res) => {
        if (err) reject(`访问失败----${err}`)
        resolve(res);
      })
  })
}

const initQuestions =
  [
    {
      type: 'input',
      name: 'keyword',
      message: '请输入要搜索的关键词',
    },
    {
      type: 'input',
      name: 'dirname',
      message: '请输入存放的文件夹名称，默认为 images 文件夹',
    },
    {
      type: 'number',
      name: 'counts',
      message: '请输入要下载的数量, 最小30张',
    }
  ];


// 根据 页数 获取数据
const getDataByPage = async (start, total, word) => {
  let allData = [];
  while (start < total) {
    const size = Math.min(60, total - start); // 限制每次最大请求60
    const params = `tn=resultjson_com&ipn=rj&fp=result&queryWord=${encodeURIComponent(word)}&ie=utf-8&oe=utf-8&word=${encodeURIComponent(word)}&pn=${start}&rn=${size}&${Date.now()}=`
    const res = await request(`https://image.baidu.com/search/acjson?${params}`, 'Accept2');
    allData = allData.concat((JSON.parse(res.text)).data);
    start = start + size;
  }
  return allData;
}

module.exports = {
  request,
  initQuestions,
  getDataByPage
}