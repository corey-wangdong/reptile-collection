const superagent = require("superagent");
const path = require('path');
const cheerio = require("cheerio");
const fs = require('fs');
const {
  getValueListByReg,
  mkImageDir,
  downloadImage,
  initProgressBar
} = require('../utils');

const searWord = '航母图片'; // 需要搜索的名称
const dirname = 'images';  // 存储文件夹的名称
const word1 = '%BA%BD%C4%B8%CD%BC%C6%AC';

let total = 0;
let succeed = 0;
const bar = initProgressBar();

const url = `https://image.baidu.com/search/index?tn=baiduimage&ie=gb18030&word=${word1}`;


const headers = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
  'sec-ch-ua': '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"'
}

superagent.get(url)
  .set('Accept', headers['Accept'])
  .set('Accept-Encoding', headers['Accept-Encoding'])
  .set('Accept-Language', headers['Accept-Language'])
  .set('Cache-Control', headers['Cache-Control'])
  .set('Connection', headers['Connection'])
  .set('User-Agent', headers['User-Agent'])
  .set('sec-ch-ua', headers['sec-ch-ua'])
  .end((err, res) => {
    if (err) {
      console.log(`访问失败----${err}`);
    } else {
      const htmlText = res.text;
      const $ = cheerio.load(htmlText);

      const imageUrlList = getValueListByReg(htmlText, 'objURL')
      console.log('imageUrlList+++++++', imageUrlList);

      const titleList = getValueListByReg(htmlText, 'fromPageTitle').map(item => {
        return item.replace("<strong>", '').replace("<\\/strong>", '');
      })
      console.log('titleList+++++++', titleList);

      // 创建文件夹
      mkImageDir(__dirname, dirname)

      // 下载图片
      imageUrlList.forEach((url, index) => {
        const pathname = path.join(__dirname, dirname, `${searWord}-${index}.png`);
        downloadImage(url, pathname);
      });
    }
  })

