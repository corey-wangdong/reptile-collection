
const superagent = require('superagent');

const headers_default = {
  'Accept': '*/*',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'zh-CN,zh;q=0.9,q=0.8',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
  'sec-ch-ua': '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"'
}

const image_headers_detail = {
  ...headers_default,
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'Accept2': 'text/plain, */*; q=0.01',
}

const video_headers_detail = {
  ...headers_default,
  "accept": "*/*",
  "content-type": "application/x-www-form-urlencoded",
  "referer": "https://haokan.baidu.com/",
  "sec-ch-ua": `".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"`,
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "macOS",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
}

function request(url, headers) {
  return new Promise((resolve, reject) => {
    superagent.get(url)
      .set(headers)
      .end(async (err, res) => {
        if (err) reject(`访问失败----${err}`)
        resolve(res);
      })
  })
}

const selectTypeQuestions = [
  {
    type: 'input',
    name: 'keyword',
    message: '亲，输入要搜索的类型: 1 表示图片, 2 表示视频',
    default: '1'
  }
]

const imageQuestions =
  [
    {
      type: 'input',
      name: 'keyword',
      message: '请输入要搜索的关键词',
      default: '风景'
    },
    {
      type: 'input',
      name: 'assetDir',
      message: '请输入存放的文件夹名称',
      default: 'images'
    },
    {
      type: 'number',
      name: 'counts',
      message: '请输入要下载的数量,最小下载30张',
      default: 30
    }
  ];


const videoQuestions = [
  {
    type: 'input',
    name: 'keyword',
    message: '请输入想要搜索的视频关键词',
    default: '演习'
  },
  {
    type: 'number',
    name: 'counts',
    message: '请输入要下载视频的数量, 占用资源较多, 建议数量少一点',
    default: 3
  },
  {
    type: 'input',
    name: 'assetDir',
    message: '请输入视频资源存储的文件夹名称',
    default: 'videos'
  }
]


// 根据 页数 获取图片数据
const getImgDataByPage = async (start, total, word) => {
  let allData = [];
  while (start < total) {
    const size = Math.min(60, total - start); // 限制每次最大请求60
    const params = `tn=resultjson_com&ipn=rj&fp=result&queryWord=${encodeURIComponent(word)}&ie=utf-8&oe=utf-8&word=${encodeURIComponent(word)}&pn=${start}&rn=${size}&${Date.now()}=`
    const res = await request(`https://image.baidu.com/search/acjson?${params}`, image_headers_detail);
    console.log('res++++++++', res);
    allData = allData.concat((JSON.parse(res.text)).data);
    start = start + size;
  }
  return allData;
}

// 根据 页数 获取视频数据
const getVideosByPage = async (word, counts) => {
  const params = `pn=1&rn=10&type=video&query=${encodeURIComponent(word)}`
  const url = `https://haokan.baidu.com/web/search/api?${params}`;
  const res = await request(url, video_headers_detail);
  const search = JSON.parse(res.text).data.list[0];

  const params1 = `title=${encodeURIComponent(search.title)}&vid=${search.vid}&act=pcRec&pd=pc`;
  const tempUrl = `https://haokan.baidu.com/videoui/api/videorec?${params1}`;
  const res1 = await request(tempUrl, video_headers_detail);
  const videos = JSON.parse(res1.text).data.response.videos.slice(0, counts);

  const resultVideos = videos.map(video => {
    return {
      title: video.title,
      url: video.play_url
    }
  })
  return resultVideos;
}


module.exports = {
  request,
  image_headers_detail,
  selectTypeQuestions,
  imageQuestions,
  videoQuestions,
  getImgDataByPage,
  getVideosByPage
}