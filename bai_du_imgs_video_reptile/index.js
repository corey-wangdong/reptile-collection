const inquirer = require('inquirer');
const { selectTypeQuestions, imageQuestions } = require('./tool');
const { run_image } = require('./reptile_info/image_reptile');

inquirer.prompt(selectTypeQuestions).then(result => {
  // keyword: 2 表示搜索的是视频,  1 表示搜索的是图片
  const { keyword } = result;
  let searchWord = '';
  console.log('result-------', result);

  switch (true) {
    case keyword === '1':
      searchWord = 'image';
      break;
    case keyword === '2':
      searchWord = 'video';
      break;
    default:
      searchWord = 'image';
      break;
  }

  run_action_by_type(searchWord);
})

const run_action_by_type = (searchWord) => {
  if (searchWord === 'image') {
    inquirer.prompt(imageQuestions).then(result => {
      const { keyword, counts, assetDir } = result;
      console.log('result++++', result);
      if (keyword) run_image(keyword, counts, assetDir);
    })
  } else if (searchWord === 'video') {
    console.log('亲，视频下载正在开发中...');
  }
}
