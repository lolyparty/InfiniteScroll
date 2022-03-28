import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import {useQuery} from 'react-query'

function App() {

  const [imageData, setDetails] = useState([]);

  //axios instance
  const instance = axios.create({baseURL:'https://api.pexels.com/v1/'})

  const getPhotos = async ()=>{
    try{
      const photos = await instance.get('/search?query=nature?page=1&per_page=10',{
      headers:{
        Accept: "application/json",
      Authorization:process.env.REACT_APP_INFINITESCROLL
      }
    })
    return photos
    } 
    catch(err){
      console.log('error fetching')
    }
  }

  const {data, isLoading, isError, isSuccess} = useQuery('Photos', getPhotos)
  


  return (
    <div>
      {isLoading && <div>Loading....</div>}
      {isSuccess && <div className="container">{data.data.photos.map(e=> <div className="img_container" key={e.id}><img className="img_container" alt="" src={e.src.medium}/></div>)}</div>}
      {isError && <div>Error...</div>}
    </div>
    );
}


export default App;
