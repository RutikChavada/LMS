import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/ContextApp'
import CourseCard from './CourseCard'

function CourseSection() {
    const{allCourses} = useContext(AppContext)
  return (
    <div className='py-16 md:px-40 px-8'>
        <h2 className='text-3xl font-medium text-gray-800'>Learn From the best</h2>
        <p className='text-sm md:text-base text-gray-500 mt-3'>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facere minus quos repellat eum facilis laborum. Saepe molestias necessitatibus commodi laborum! Consequuntur ullam ut temporibus rerum, harum culpa recusandae tenetur saepe.
        </p>
        <div className='grid grid-cols-4 px-4 md:px-0 md:my-16 my-10 gap-4'>
            {allCourses.slice(0,4).map((course,index) => <CourseCard key={index} course={course}/>)}
        </div>
        <Link to={'/course-list'} onClick={()=> scrollTo(0,0)}
        className='text-gray-500 border border-gray-500/30 px-10 py-3 rounded'>
        Show all courses</Link>
    </div>
  )
}

export default CourseSection