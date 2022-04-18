import { Fragment, useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import {useInfiniteQuery} from 'react-query';
import FastAverageColor from 'fast-average-color';
import {fetchNextPageFunction} from './fetchPage';
import {changeColorOnScroll} from './changeColor';
import {Loading} from './loading'

function App() {

  const [imageHex, setImageHex] = useState([])  

  //axios instance
  const instance = axios.create({baseURL:'https://api.pexels.com/v1/'})

  useEffect(()=>{
    const colorChange =() => {
      //  if(changeColor){
        console.log(imageHex)
         document.querySelector('.container').style.background = imageHex[imageHex.length - 1]
        // }
    }
    colorChange()
    // getColor()
  },[imageHex])


  //Get photos
  const getPhotos = async ({pageParam = 1})=>{
    if(pageParam){
      try{
        const photos = await instance.get(`/curated?page=${pageParam}&per_page=5`,{
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
    } else{
      return
    }
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
    getNextPageParam: (lastPage, pages )=> pages.length < 5 ? pages.length + 1 : undefined,
    refetchOnWindowFocus: false,
    retry:false,
    cacheTime:100
  })


    //color change
     //Average color & get dominant color intersection observer
     const getDominantColor = (imageUrl)=>{
      if(imageUrl){
        const fac = new FastAverageColor()
      fac.getColorAsync(`${imageUrl}`, { width : 50, height: 50},{algorithm:'dominant'})
      .then((data)=>{
        setImageHex(prev=>{
          return prev[prev.length - 1] === data.hex ? prev : [data.hex]
        })
        
      })
      .catch((error)=>console.log(error))
      }
    }

    //mutation observer
    var observer = new MutationObserver(function() {
      if (document.contains(document.querySelector('.images'))) {
        fetchNextPageFunction(fetchNextPage, hasNextPage)
        changeColorOnScroll(getDominantColor, hasNextPage)
        
          observer.disconnect() 
       }
   });
   
   observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true})
  
  return (
    <>
      {isLoading && <Loading />}
      <div className="container">
        <div className='overlay'></div>

        {/* Successful fetching of pictures */}
      {isSuccess && result.data.pages.length >= 1 ? result.data.pages.map((page, id)=> <Fragment key={id}> 
                        {page.data.photos && page.data.photos.map((image, id)=><img className='images' style={{width:'400px', height:'550px', margin:'10px'}} src={image.src.large} key={id} alt={image.alt} crossOrigin="anonymous"/>
                        )}
                    </Fragment >) : null
        }

        

        {/* if Error occurs while fetching */}
        {isError && <p className="status">Error getting Images</p>}      
      </div>
      {/* Refecthing another page */}
      {isFetchingNextPage && <Loading />}
    </>
    );
}


export default App;