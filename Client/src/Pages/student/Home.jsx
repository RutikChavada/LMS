import React from 'react'
import Hero from '../../Components/Students/Hero'
import Compnies from '../../Components/Students/Compnies'
import CourseSection from '../../Components/Students/CourseSection'
import TestimonialSection from '../../Components/Students/TestimonialSection'
import CallToAction from '../../Components/Students/CallToAction'
import Footer from '../../Components/Students/Footer'

function Home() {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
      <Hero/>
      <Compnies/>
      <CourseSection/>
      <TestimonialSection/>
      <CallToAction/>
      <Footer/>
    </div>
  )
}

export default Home
