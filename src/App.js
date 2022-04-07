import { Fragment } from 'react';
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
    return photos
    } 
    catch(err){
      console.log('error fetching')
    }
  }


  //get next page
  const nextPages = ()=>{
    
    fetchNextPage()
  }

  //intersection observer
  const intersecionAnim = (entries, observer)=>entries.forEach((entry)=>{console.log(entry,'Here 50%')})
  let paragraph = document.querySelector('#last')

  const inter = () => {
    let observer
    
    let options = {
      root: document.querySelector('.container'),
      rootMargin:'0px',
      threshold:0.5
    }

    observer = new IntersectionObserver(intersecionAnim, options)
    observer.observe(paragraph)
    
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
    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}} className="container">
      
      {/* fetching pictures */}
      {isLoading && <div>Loading....</div>}

      {/* Successful fetching of pictures */}
      {isSuccess && result.data.pages.length >= 1 ? result.data.pages.map((page, id)=> <Fragment key={id}>
                      {page.data.photos && page.data.photos.map((image, id)=>{
                        return page.data.photos.length - 1 === id ? <img className='images' style={{width:'400px', height:'400px', margin:'10px'}} id='last' src={image.src.large} key={id} alt={image.alt}/> : <img className='images' style={{width:'400px', height:'400px', margin:'10px'}} id='last' src={image.src.large} key={id} alt={image.alt}/>
                      })
                      }
                      {page.data.photos && result.data.pages.length >= 1 ? inter() : null}
                      </Fragment >) : null
      }

      {/* Refecthing another page */}
      {isFetchingNextPage && <p>fetching....</p>}

      {/* if Error occurs while fetching */}
      {isError && <div>Error...</div>}

      {/* loading more pictures */ }
      <button onClick={nextPages} >next</button>
    </div>
    );
}


export default App;