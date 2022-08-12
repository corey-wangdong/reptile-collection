import React from 'react';

import {IData} from '../../App';

function Video({data}:{data: IData[]}) {
  return (
    <div>
      {
        data.map(item => (
          <div>
            <video width="320" height="240" controls preload='auto'>
                <source src={item.url} type="video/mp4"></source>
                <source src={item.url} type = "video/ogg" />
                Your browser does not support the video tag.
            </video>
            <div>{item.title}</div>
          </div>
        ))
      }
    </div>
  )
}

export default Video
