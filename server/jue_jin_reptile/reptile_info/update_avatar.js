const { axios_request, params, default_headers, baseUpdateUserUrl } = require('../utils');

const run_update_avatar = async (avatarUrl) => {
  if (!avatarUrl) {
    console.log('需要传入头像地址');
    return;
  }

  // 头像地址，可以将你需要的动态头像准备好之后，打开掘金的写文章，将头像上传到文章里会返回一个图片地址，
  // 也就是以下的头像地址，然后通过以下接口可以更新为动态头像
  const url = `${baseUpdateUserUrl}?avatar=${avatarUrl}&${params}`;
  const updateResult = await axios_request(url, 'post', default_headers);

  if (updateResult.message === 'success') {
    console.log('恭喜你，头像替换成功了');
  } else {
    console.log('头像替换失败了', user_info.message);
  }
}

module.exports = {
  run_update_avatar
}