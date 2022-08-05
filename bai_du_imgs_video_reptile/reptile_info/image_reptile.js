const path = require('path');

const {
  getValueListByReg,
  mkAssetDir,
  downloadAsset,
  initProgressBar
} = require('../../utils');
const { request, getImgDataByPage, image_headers_detail } = require('../tool');

let total = 0;
let succeed = 0;
const progressBar = initProgressBar();

function run_image(keyword, counts, dir_name) {
  const dirname = dir_name ? dir_name : 'images';
  const params = `tn=baiduimage&ie=utf-8&word=${encodeURIComponent(keyword)}`;
  const url = `https://image.baidu.com/search/index?${params}`;
  // const url = 'https://www.doutula.com/article/list/?page=2&ie=utf-8';
  request(url, image_headers_detail).then(async res => {
    const htmlText = res.text;
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
      restImgUrls = await getImgDataByPage(firstPageCount, counts, keyword);
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
      await mkAssetDir(__dirname, dirname, true);
      progressBar.start(total, 0);
      // 下载图片
      allImageUrls.forEach((item, index) => {
        const pathname = path.join(__dirname, `../asset/${dirname}`, `${keyword}-${index}.png`);
        downloadAsset(item.imgUrl, pathname).then(() => {
          succeed++;
          progressBar.update(succeed);
        }).then(() => {
          if (succeed === total) {
            progressBar.stop();
            console.log(`哇哦😄 ${keyword}的图片下载完成啦！快去看看吧, 下载资源存储在 asset 文件夹下哦`)
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  })
}

module.exports = {
  run_image
}