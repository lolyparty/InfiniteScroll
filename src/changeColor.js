const changeColorOnScroll = (getDominantColor, isSuccess)=>{
        //intersection observer callback function
        const intersectionObserverBackground = (entries, observer)=>entries.forEach((entry)=>{
            // console.log(entry)
            if(entry.isIntersecting && entry.intersectionRatio >= 0.5){
              // setChangeColor(false)
              getDominantColor(entry.target.src)
              // if(entry.intersectionRatio >= 0.55) {
              //   // setChangeColor(true)
              // }
            }
          })
          
          const intersectionObserverGetColor =()=>{
            let imageContainer = document.querySelectorAll('.images')
          // paragraph = paragraph[paragraph.length - 1] 
            let observer
          
          let options = {
            root: null,
            rootMargin:'0px',
            threshold:[0.51]
          }
      
          observer = new IntersectionObserver(intersectionObserverBackground, options)
          imageContainer.forEach((el)=>{
            observer.observe(el) 
          })
          if(isSuccess) observer.disconnect() 
          }

          intersectionObserverGetColor()
}

export {changeColorOnScroll}