const changeColorOnScroll = (getDominantColor, hasNextPage)=>{
        //intersection observer callback function
        const intersectionObserverBackground = (entries, observer)=>entries.forEach((entry)=>{
            if(entry.isIntersecting && entry.intersectionRatio >= 0.8){
              getDominantColor(entry.target.src)
            }
          })
          
          const intersectionObserverGetColor =()=>{
            let imageContainer = document.querySelectorAll('.images')
            let observer
          
          let options = {
            root: null,
            rootMargin:'0px',
            threshold:[0.81]
          }
      
          observer = new IntersectionObserver(intersectionObserverBackground, options)
          imageContainer.forEach((el)=>{
            observer.observe(el) 
          })
          if(!hasNextPage)observer.disconnect()  
          }

          intersectionObserverGetColor()
}

export {changeColorOnScroll}