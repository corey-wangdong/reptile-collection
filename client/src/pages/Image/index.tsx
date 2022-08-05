import React from 'react'
import { IData } from '../../App';
import s from './index.scss';

function Image({data}:{data: IData[]}) {
  return (
    <div className={s.container}>
      {
        data.map(item => (
          <div className={s.imgBox}>
            <img src={`${item.url}`} alt="" />
            <div>{item.title}</div>
          </div>
        ))
      }
    </div>
  )
}

export default Image
