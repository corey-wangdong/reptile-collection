const info = require('./info.json');
const { request, default_headers } = require('./utils');

const headers_detail = {
  ...default_headers,
  "cookie": info.cookie
}

const run_update_avatar = async () => {
  // 头像地址，可以将你需要的动态头像准备好之后，打开掘金的写文章，将头像上传到文章里会返回一个图片地址，
  // 也就是以下的头像地址，然后通过以下接口可以更新为动态头像
  const avatar = 'https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff3c47ee14c8497fb728540f21e5aa26~tplv-k3u1fbpfcp-watermark.image';
  const url = `https://juejin.cn/web/user/update/user_info?avatar=${avatar}&aid=${info.aid}`;

  const result = await request(url, headers_detail, 'post');
  const user_info = JSON.parse(result.text);
  // console.log('user_info----', user_info);
  if (user_info.message === 'success') {
    console.log('头像替换成功了');
  } else {
    console.log('头像替换失败了', user_info.message);
  }
}

run_update_avatar();