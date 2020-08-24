import React from 'react';
import Course from './components/Course'

const App = ( {courses} ) => {
  return (
    <div>
      <h2>Web development curriculum</h2>
       {courses.map ( course => 
        <Course key={course.id} course = {course}/>
      )}     
    </div>
  )
}

export default App;
