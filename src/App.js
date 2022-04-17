import { Fragment, useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import {useInfiniteQuery} from 'react-query'
import FastAverageColor from 'fast-average-color'
import {fetchNextPageFunction} from './fetchPage'
import {changeColorOnScroll} from './changeColor'

function App() {

  const [imageHex, setImageHex] = useState([])  

  useEffect(()=>{
    const colorChange =() => {
      //  if(changeColor){
         document.querySelector('.container').style.background = imageHex[imageHex.length - 1]
        // }
    }
    colorChange()
    // getColor()
  },[imageHex])


  //axios instance
  const instance = axios.create({baseURL:'https://api.pexels.com/v1/'})

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
        setImageHex(prev=>[...prev, data.hex])
      })
      .catch((error)=>console.log(error))
      }
    }

    //mutation observer
    var observer = new MutationObserver(function() {
      if (document.contains(document.querySelector('.images'))) {
        fetchNextPageFunction(fetchNextPage, hasNextPage)
        changeColorOnScroll(getDominantColor, isSuccess)
          // if(!hasNextPage)observer.disconnect() 
       }
   });
   
   observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true})
  
  
  return (
    <div className="container">
      {isLoading && <div>Loading....</div>}

      {/* Successful fetching of pictures */}
     {isSuccess && result.data.pages.length >= 1 ? result.data.pages.map((page, id)=> <Fragment key={id}> 
                      {page.data.photos && page.data.photos.map((image, id)=><img className='images' style={{width:'400px', height:'550px', margin:'10px'}} src={image.src.large} key={id} alt={image.alt} crossOrigin="anonymous"/>
                      )
                      }{getDominantColor()}
                  </Fragment >) : null
      }

      {/* Refecthing another page */}
      {isFetchingNextPage && <p>fetching....</p>}

      {/* if Error occurs while fetching */}
      {isError && <p>Error...</p>}      
    </div>
    );
}


export default App;