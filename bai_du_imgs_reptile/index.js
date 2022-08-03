const superagent = require("superagent");
const path = require('path');
const cheerio = require("cheerio");
const inquirer = require('inquirer');

const fs = require('fs');
const {
  getValueListByReg,
  mkImageDir,
  downloadImage,
  initProgressBar
} = require('../utils');

let total = 0;
let succeed = 0;
const progressBar = initProgressBar();

const headers = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
  'sec-ch-ua': '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"'
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
    }
  ];

inquirer.prompt(initQuestions).then(result => {
  const { keyword, dirname } = result;
  if (keyword) run(keyword, dirname);
})

function run(keyword, dir_name) {
  const dirname = dir_name ? dir_name : 'images';
  const params = `tn=baiduimage&ie=utf-8&word=${encodeURIComponent(keyword)}`;
  const url = `https://image.baidu.com/search/index?${params}`;
  superagent.get(url)
    .set('Accept', headers['Accept'])
    .set('Accept-Encoding', headers['Accept-Encoding'])
    .set('Accept-Language', headers['Accept-Language'])
    .set('Cache-Control', headers['Cache-Control'])
    .set('Connection', headers['Connection'])
    .set('User-Agent', headers['User-Agent'])
    .set('sec-ch-ua', headers['sec-ch-ua'])
    .end(async (err, res) => {
      if (err) {
        console.log(`访问失败----${err}`);
      } else {
        const htmlText = res.text;
        const $ = cheerio.load(htmlText);

        // 图片地址
        const imageUrlList = getValueListByReg(htmlText, 'objURL')

        // 标题
        const titleList = getValueListByReg(htmlText, 'fromPageTitle').map(item => {
          return item.replace("<strong>", '').replace("<\\/strong>", '');
        })

        total = imageUrlList.length;

        try {
          // 创建文件夹
          await mkImageDir(__dirname, dirname);
          progressBar.start(total, 0);
          // 下载图片
          imageUrlList.forEach((url, index) => {
            const pathname = path.join(__dirname, dirname, `${keyword}-${index}.png`);
            downloadImage(url, pathname).then(() => {
              succeed++;
              progressBar.update(succeed);
            }).then(() => {
              if (succeed === total) {
                progressBar.stop();
                console.log('恭喜！图片下载完成！')
              }
            });
          });
        } catch (error) {
          console.log(error);
        }
      }
    })
}