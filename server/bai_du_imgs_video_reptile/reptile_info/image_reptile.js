const {
  getValueListByReg,
} = require('../../utils');
const { request, getImgDataByPage, image_headers_detail } = require('../tool');

async function run_image(keyword, counts, dir_name) {
  const dirname = dir_name ? dir_name : 'images';
  const params = `tn=baiduimage&ie=utf-8&word=${encodeURIComponent(keyword)}`;
  const url = `https://image.baidu.com/search/index?${params}`;
  // const url = 'https://www.doutula.com/article/list/?page=2&ie=utf-8';
  return await request(url, image_headers_detail).then(async res => {
    const htmlText = res.text;
    let restImgUrls = [];
    // 图片地址
    const imageUrlList = getValueListByReg(htmlText, 'objURL')
    const titleList = getValueListByReg(htmlText, 'fromPageTitle').map(item => item.replace("<strong>", '').replace("<\\/strong>", ''));

    // 为了方便和后续json数据结合, 修改为同一个数组
    let allImageUrls = imageUrlList.map((imgUrl, index) => ({
      url: imgUrl,
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
        url: item.middleURL,
        title: title ? title.replace("<strong>", '').replace("</strong>", '') : ''
      }
    });

    allImageUrls = allImageUrls.concat(formatImgUrls)
    return allImageUrls;
  })
}

module.exports = {
  run_image
}