const inquirer = require('inquirer');
const { run_image } = require('./reptile_info/image_reptile');
const { run_video } = require('./reptile_info/video_reptile');
const { selectTypeQuestions, imageQuestions, videoQuestions } = require('./tool');

inquirer.prompt(selectTypeQuestions).then(result => {
  // keyword: 2 表示搜索的是视频,  1 表示搜索的是图片
  const { keyword } = result;
  let searchWord = '';

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
  let questions = [];
  let run;

  switch (true) {
    case searchWord === 'image':
      questions = imageQuestions;
      run = run_image;
      break;
    case searchWord === 'video':
      questions = videoQuestions;
      run = run_video;
      break;
    default:
      questions = [];
  }

  inquirer.prompt(questions).then(result => {
    const { keyword, counts, assetDir } = result;
    console.log('result++++', result);
    if (keyword) run && run(keyword, counts, assetDir);
  })
}
