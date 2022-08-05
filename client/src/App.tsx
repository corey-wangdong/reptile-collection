import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [keyWord,setKeyWord] = useState('');
  const [searchType,setSearchType] = useState('');
  const [searchNum,setSearchNum] = useState(1);
  const [data,setData] = useState([]);

  const handleKeyWord = (e:any) => {
    const keyWord = e.target.value;
    console.log('-----keyWord', keyWord);
    setKeyWord(keyWord);
  }

  const handleSearchType = (e:any) => {
    const searchType = e.target.value;
    console.log('-----searchType', searchType);
    setSearchType(searchType);
  }

  const handleNeedNum = (e:any) => {
    const needNum = e.target.value;
    console.log('-----needNum', needNum);
    setSearchNum(needNum);
  }

  const handleSubmit = () => {
    console.log('-----');
    const params = {keyWord,searchType,searchNum};
    axios.get('http://10.15.51.105:666/reptile-info',{
      params: params
    }).then(res => {
      console.log('res------',res);
      if(res.data) {
        setData(res.data.data)
      }
    })
  }

  console.log('data+++++',data);
  
  return (
    <div className="App">
      <div>输入搜索的关键词：<input type="text" onBlur={handleKeyWord}/></div>
      <div>输入搜索类型：<input type="text" onBlur={handleSearchType}/></div>
      <div>输入需要下载的数量：<input type="number" onBlur={handleNeedNum}/></div>
      <div onClick={handleSubmit}>确定</div>

      <div>
        {
          data.map((item:any) => {
            return <div>
              {searchType === '视频'? (
                <video width="320" height="240" controls preload='auto'>
                <source src={item.video_url} type="video/mp4"></source>
                <source src={item.video_url} type = "video/ogg" />
                Your browser does not support the video tag.
              </video>
              ):(
                <img style={{width:'200px'}} src={`${item.imgUrl}`} alt="" />
              )}
              <div>{item.title}</div>
            </div>
          })
        }
      </div>
    </div>
  );
}

export default App;
