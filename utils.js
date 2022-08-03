const superagent = require("superagent");
const path = require('path');
const cliProgress = require('cli-progress');

const fs = require('fs');

// 根据正则匹配
function getValueListByReg(str, key) {
  const reg = new RegExp(`"${key}":"(.*?)"`, 'g');
  const matchResult = str.match(reg);
  const resList = matchResult.map(item => {
    const res = item.match(/:"(.*?)"/g)
    return RegExp.$1;
  })
  return resList;
}

// 创建目录
function mkImageDir(pathName, dirName) {
  const fullPath = path.resolve(pathName, dirName);
  if (fs.existsSync(fullPath)) {
    console.log(`${dirName}目录已存在, 跳过此步骤`);
    return;
  }
  fs.mkdirSync(path.resolve(pathName, dirName));
  console.log(`创建目录${dirName}成功`);
}

// 下载图片
function downloadImage(url, pathname) {
  if (fs.existsSync(pathname)) {
    console.log(`文件已存在, 跳过此步骤`);
    return;
  }
  superagent.get(url).end((err, res) => {
    console.log('res+======', res);
    if (err) {
      console.log(err);
      return;
    }
    fs.writeFile(pathname, res.body, 'binary', (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`下载成功`);
    })
  })
}

// 进度条
function initProgressBar() {
  return new cliProgress.SingleBar({
    clearOnComplete: false
  }, cliProgress.Presets.shades_classic);
}

module.exports = {
  getValueListByReg,
  mkImageDir,
  downloadImage,
  initProgressBar
};