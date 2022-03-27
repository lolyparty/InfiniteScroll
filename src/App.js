import { useEffect, useState } from 'react';
import './App.css';
import { createClient } from 'pexels';

function App() {

  useEffect(() => {
    window.process = {
      ...window.process,
    };
  }, []);

  const [imageData, setDetails] = useState([]);
  //'api_key=88224c51-36bd-4722-87f8-ad99da5c3ff5' 
  // api-key - 563492ad6f917000010000015c3f313de78f4e3f9cc9b6bb9887ed8c 

  // useEffect(()=>{
    const getData = async ()=>{
    //     const dataDetails = await axios.get('https://fierce-escarpment-09151.herokuapp.com/api.pexels.com/v1/search?query=dog')
    //     const DataImg = dataDetails
    //     setDetails(DataImg.data.photos)
    //     console.log(imageData)
    // }

    const client = createClient('563492ad6f917000010000015c3f313de78f4e3f9cc9b6bb9887ed8c')
    const query = 'dog'
    client.photos.search({ query, per_page: 5 }).then(photos => setDetails(prev => [...prev, photos]));
    console.log(imageData)
    

    }

    getData();
  // },[])


  return (
    <div className="App">
      {imageData.length > 0 ? imageData.map((e, index)=>
         <div key={index} style={{'display':'flex', 'justifyContent':'center', 'alignItems':'center'}}>
           <img style={{'height':'400px', 'width':'400px', 'margin':'5px'}} alt="cat" src={e.url}/>
         </div>
      ) : null}
    </div>
  );
};

export default App;
