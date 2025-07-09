import React from 'react'
import {Route , Routes} from 'react-router-dom'
import Home from './Pages/student/Home'
import CourseList from './Pages/student/CourseList'
import CourseDetails from './Pages/student/CourseDetails'
import MyEnrollments from './Pages/student/MyEnrollments'
import Player from './Pages/student/Player'
import Loading from './Components/Students/Loading'
import Educator from './Pages/educator/Educator'
import Dashboard from './Pages/educator/Dashboard'
import AddCourse from './Pages/educator/AddCourse'
import MyCourses from './Pages/educator/MyCourses'
import StudentsEnrolled from './Pages/educator/StudentsEnrolled'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CourseList />} />
        <Route path="/course-list/:input" element={<CourseList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />
        <Route path='/educator' element={<Educator/>}>
             <Route path='educator' element={<Dashboard/>}/>
             <Route path='add-course' element={<AddCourse/>}/>
             <Route path='my-courses' element={<MyCourses/>}/>
             <Route path='student-enrolled' element={<StudentsEnrolled/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App
