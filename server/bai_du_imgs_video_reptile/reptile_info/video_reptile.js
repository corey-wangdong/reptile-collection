const { getVideosByPage } = require('../tool');
async function run_video(keyword, counts, dir_name) {
  return await getVideosByPage(keyword, counts)
}

module.exports = {
  run_video
}