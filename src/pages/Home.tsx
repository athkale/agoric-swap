import Hero from '@/components/Home/Hero'
import Header from '@/layout/Header'
import Footer from '@/components/Home/footer'
import React from 'react'

const HomePage = () => {
  return (
   <div  className='bg-cover' style={{ backgroundImage: `url(/hero_bg.png)`}}>
   <Header />
   <Hero />
   <Footer />
   </div>
  )
}

export default HomePage