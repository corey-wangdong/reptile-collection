import React, { useState } from 'react';
import axios from 'axios';
import Image from './pages/Image';
import Video from './pages/Video';

export interface IData {
  url:string;
  title:string;
}

function App() {
  const [keyWord,setKeyWord] = useState('');
  const [searchType,setSearchType] = useState('图片');
  const [searchNum,setSearchNum] = useState(1);
  const [data,setData] = useState<IData[]>([]);

  const handleKeyWord = (e:any) => {
    const keyWord = e.target.value;
    setKeyWord(keyWord);
  }

  const handleSearchType = (e:any) => {
    const searchType = e.target.value;
    setSearchType(searchType);
  }

  const handleNeedNum = (e:any) => {
    const needNum = e.target.value;
    setSearchNum(needNum);
  }

  const handleSubmit = () => {
    const params = {keyWord,searchType,searchNum};
    console.log('params-----',params);
    axios.get('http://192.168.50.151:666/reptile-info',{
      params: params
    }).then(res => {
      console.log('res------',res);
      if(res.data) {
        setData(res.data.data)
      }
    })
  }

  const renderContent = () => {
    switch(searchType) {
      case 'image':
        return <Image data = {data}/>;
      case '视频':
        return <Video data = {data}/>
      default:
        return <Image data = {data}/>;
    }
  }

  return (
    <div className="App">
      <div>输入搜索的关键词：<input type="text" onBlur={handleKeyWord}/></div>
      <div>输入搜索类型：<input type="text" onBlur={handleSearchType}/></div>
      <div>输入需要下载的数量：<input type="number" onBlur={handleNeedNum}/></div>
      <div onClick={handleSubmit}>确定</div>

      <div>
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
