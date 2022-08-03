const path = require('path');
const inquirer = require('inquirer');
const fs = require('fs');
const {
  getValueListByReg,
  mkImageDir,
  downloadImage,
  initProgressBar
} = require('../utils');
const { request, initQuestions, getDataByPage } = require('./tool');

let total = 0;
let succeed = 0;
const progressBar = initProgressBar();

inquirer.prompt(initQuestions).then(result => {
  const { keyword, counts, dirname } = result;
  console.log('result++++', result);
  if (keyword) run(keyword, counts, dirname);
})

function run(keyword, counts, dir_name) {
  const dirname = dir_name ? dir_name : 'images';
  const params = `tn=baiduimage&ie=utf-8&word=${encodeURIComponent(keyword)}`;
  const url = `https://image.baidu.com/search/index?${params}`;


  request(url).then(async res => {
    const htmlText = res.text;
    // const $ = cheerio.load(htmlText);
    let restImgUrls = [];
    // 图片地址
    const imageUrlList = getValueListByReg(htmlText, 'objURL')
    const titleList = getValueListByReg(htmlText, 'fromPageTitle').map(item => item.replace("<strong>", '').replace("<\\/strong>", ''));

    // 为了方便和后续json数据结合, 修改为同一个数组
    let allImageUrls = imageUrlList.map((imgUrl, index) => ({
      imgUrl,
      title: titleList[index]
    }));
    const firstPageCount = allImageUrls.length;

    if (counts > firstPageCount) {
      restImgUrls = await getDataByPage(firstPageCount, counts, keyword);
    }
    const imgUrlData = restImgUrls.filter(item => item.middleURL);
    const formatImgUrls = imgUrlData.map(item => {
      const title = item.fromPageTitle;
      return {
        imgUrl: item.middleURL,
        title: title ? title.replace("<strong>", '').replace("</strong>", '') : ''
      }
    });

    allImageUrls = allImageUrls.concat(formatImgUrls)
    total = allImageUrls.length;

    try {
      // 创建文件夹
      await mkImageDir(__dirname, dirname);
      progressBar.start(total, 0);
      // 下载图片
      allImageUrls.forEach((item, index) => {
        const pathname = path.join(__dirname, dirname, `${keyword}-${index}.png`);
        downloadImage(item.imgUrl, pathname).then(() => {
          succeed++;
          progressBar.update(succeed);
        }).then(() => {
          if (succeed === total) {
            progressBar.stop();
            console.log(`哇哦😄 ${keyword}的图片下载完成啦！快去看看吧`)
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  })
}