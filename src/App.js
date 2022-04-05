import { Fragment, useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import {useInfiniteQuery} from 'react-query'

function App() {


  //axios instance
  const instance = axios.create({baseURL:'https://api.pexels.com/v1/'})

  //Get photos
  const getPhotos = async ({pageParam = 1})=>{
    try{
      const photos = await instance.get(`/curated?page=${pageParam}&per_page=10`,{
      headers:{
        Accept: "application/json",
      Authorization:process.env.REACT_APP_INFINITESCROLL
      }
    })
    // console.log(photos)
    return photos
    } 
    catch(err){
      console.log('error fetching')
    }
  }

  const nextPages = ()=>{
    fetchNextPage()
  }

  // react query
  const {fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    isLoading,
    isSuccess,
    isError,
    ...result
  } = useInfiniteQuery('Photos', getPhotos, {
    getNextPageParam: (lastPage, pages )=> pages.length < 11 ? pages.length + 1 : undefined,
  })
  
  return (
    <div style={{display:'flex', flexDirection:'column'}}>
      {isLoading && <div>Loading....</div>}
      {isSuccess && result.data.pages.map((page, id)=> <Fragment key={id}>
        {result.data.pages[id].data.photos.map((image, id)=><img style={{width:'300px', height:'300px', margin:'10px'}} src={image.src.medium} key={id} alt={image.alt}/>)}
        </Fragment >)
        }
      {isError && <div>Error...</div>}

      {/* loading more pictures */ }
      {isFetchingNextPage && <p>fetching....</p>}
      <button onClick={nextPages} >next</button>
    </div>
    );
}


export default App;


//pages[0].data.total_results/pages[0].data.per_page