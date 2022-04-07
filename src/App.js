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

  const nextPages = ()=>{
    fetchNextPage()
  }

  //intersection observer
 const inter = () => {
  var observer
  
  let options = {
    root:null,
    rootMargin:'0px',
    threshold:0.5
  }

  observer = new IntersectionObserver(intersecionAnim, options)

  var intersecionAnim = (entries, observer)=>{console.log(entries)}

  
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
    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
      {isLoading && <div>Loading....</div>}
      {isSuccess && result.data.pages
                  .map((page, id)=> <Fragment key={id}>
                      {result.data.pages[id].data.photos.map((image, id)=><img className='images' style={{width:'400px', height:'400px', margin:'10px'}} src={image.src.large} key={id} alt={image.alt}/>)}
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