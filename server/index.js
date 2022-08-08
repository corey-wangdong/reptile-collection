const express = require('express');
const { run_image } = require('./bai_du_imgs_video_reptile/reptile_info/image_reptile');
const { run_video } = require('./bai_du_imgs_video_reptile/reptile_info/video_reptile');
const { run_music } = require('./bai_du_imgs_video_reptile/reptile_info/music_reptile');

const server = new express();

server.get('/reptile-info', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  console.log('req----', req.query);
  const { keyWord, searchType, searchNum } = req.query;

  if (keyWord && searchNum) {
    switch (true) {
      case searchType === '视频':
        run_video(keyWord, searchNum, 'video').then(info => {
          res.send({ status: true, data: info });
        })
      case searchType === '音乐':
        run_music(keyWord, searchNum, 'music').then(info => {
          res.send({ status: true, data: info });
        })
      default:
        run_image(keyWord, searchNum, 'images').then(info => {
          res.send({ status: true, data: info });
        })
    }
  }
})

server.listen(666, () => {
  console.log('服务器已启动，正在监听 666 端口');
})