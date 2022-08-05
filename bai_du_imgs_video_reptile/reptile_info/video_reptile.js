const { mkAssetDir, initProgressBar, downloadAsset } = require('../../utils');
const { getVideosByPage } = require('../tool');
const path = require('path');
let total = 0;
let succeed = 0;
const progressBar = initProgressBar();

async function run_video(keyword, counts, dir_name) {
  const dirname = dir_name ? dir_name : 'videos';

  try {
    const allVideoList = await getVideosByPage(keyword, counts);
    total = allVideoList.length;

    // 创建文件夹
    await mkAssetDir(__dirname, dirname);
    progressBar.start(total, 0);

    allVideoList.forEach((item, index) => {
      const pathname = path.join(__dirname, `../asset/${dirname}`, `${keyword}-${index}.mp4`);
      downloadAsset(item.video_url, pathname)
        .then(() => {
          succeed++;
          progressBar.update(succeed);
        })
        .then(() => {
          if (succeed === total) {
            progressBar.stop();
            console.log(`哇哦😄 ${keyword}的视频下载完成啦！快去看看吧, 下载资源存储在 asset 文件夹下哦`)
          }
        })
    })

  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  run_video
}