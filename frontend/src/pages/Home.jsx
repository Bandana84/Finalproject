import React from 'react'
import MainBanner from '../components/mainBanner'
import Categories from '../components/Categories'
import Bestseller from '../components/BestSeller'
import BottomBanner from '../components/BottomBanner'


import Contact from '../components/contact'


const Home =()=>{
  return(
    <div className='mt-10'> 
    
 <MainBanner/>
 <Categories/>
 <Bestseller/>
 <BottomBanner/>
 <Contact/>

    </div>
  )
}
export default Home
