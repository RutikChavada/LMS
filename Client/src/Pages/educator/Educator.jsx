import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../Components/educators/Navbar'
import Sidebar from '../../Components/educators/Sidebar'
import Footer from '../../Components/educators/Footer'

function Educator() {
  return (
    <div className='text-default min-h-screen bg-white'>
      <Navbar/>
      <div className='flex'>
        <Sidebar/>
        <div className='flex-1'>
          {<Outlet/>}
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Educator
