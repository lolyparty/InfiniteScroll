import { Fragment, useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import {useInfiniteQuery} from 'react-query'

function App() {
  //axios instance
  const instance = axios.create({baseURL:'https://api.pexels.com/v1/'})

  //Get photos
  const getPhotos = async ({pageParam = 1})=>{
    if(pageParam){
      try{
        const photos = await instance.get(`/curated?page=${pageParam}&per_page=10`,{
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
  } 

  //intersection observer
    const intersecionAnim = (entries, observer)=>entries.forEach((entry)=>{
      console.log(entry)
      if(entry.isIntersecting && entry.intersectionRatio >= 0.05 && entry.intersectionRatio < 1){
        fetchNextPage()
      }
    })
    
    
    const inter =()=>{
      let paragraph = document.querySelector('.container').lastChild.previousSibling
    // paragraph = paragraph[paragraph.length - 1] 
      let observer
    
    let options = {
      root: null,
      rootMargin:'0px',
      threshold:0.05
    }

    observer = new IntersectionObserver(intersecionAnim, options)
    observer.observe(paragraph)
    }

    var observer = new MutationObserver(function() {
      if (document.contains(document.querySelector('.images'))) {
           console.log("It's in the DOM!");
           inter()
           observer.disconnect();
       }
   });
   
   observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
  
  
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
    cacheTime:1000
  })
  
  
  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}} className="container">
      {/* <p id="last" style={{width:'400px', height:'400px'}}></p> */}
      {/* fetching pictures */}
      {isLoading && <div>Loading....</div>}

      {/* Successful fetching of pictures */}
      {isSuccess && result.data.pages.length >= 1 ? result.data.pages.map((page, id)=> <Fragment key={id}>
                      {page.data.photos && page.data.photos.map((image, id)=><img className='images' style={{width:'400px', height:'400px', margin:'10px'}} src={image.src.large} key={id} alt={image.alt}/>
                      )
                      }
                      {console.log(`page ${id}`)}
                      </Fragment >) : null
      }
      

      {/* Refecthing another page */}
      {isFetchingNextPage && <p>fetching....</p>}
      {hasNextPage ? 'Loading new' : 'End'}

      {/* if Error occurs while fetching */}
      {isError && <p>Error...</p>}

      {/* loading more pictures */ }
      {/* <button onClick={nextPages} >next</button> */}
    </div>
    );
}


export default App;