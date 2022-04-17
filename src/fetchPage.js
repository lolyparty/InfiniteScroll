//  intersection observer
 const fetchNextPageFunction = (fetchNextPage, hasNextPage) =>{
    const intersecionAnim = (entries, observer)=>entries.forEach((entry)=>{
    
        if(entry.isIntersecting && entry.intersectionRatio >= 0.1){
          fetchNextPage({cancelRefetch:false})
          // console.log(entry)
        }
      })
      
      
      const intersectionObserverRefetchFunction =()=>{
        let paragraph = document.querySelector('.container').lastChild
      // paragraph = paragraph[paragraph.length - 1] 
        let observer
      
      let options = {
        root: null,
        rootMargin:'0px',
        threshold:0.2
      }
    
      observer = new IntersectionObserver(intersecionAnim, options)
      observer.observe(paragraph)
      if(!hasNextPage)observer.disconnect() 
      }

    intersectionObserverRefetchFunction()
 }

 export {fetchNextPageFunction}