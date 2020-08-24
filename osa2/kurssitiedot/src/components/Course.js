import React from 'react';

const Course = ({course}) => {
    return (
      <div>
      <Header course={course}/>
      <Content course={course}/>
      <Total course={course}/>
      </div>
    )
  }
  
  const Header = ({ course }) => {
    return (
      <h3>{course.name}</h3>
    )
  }
  
  const Content = ({ course }) => {
    return (
      <div>    
        {course.parts.map( content => 
          <Part key={content.id} part = {content}/>
        )}      
      </div>
    )
  }
  
  const Part = (props) => {
    return (
      <p>
        {props.part.name} {props.part.exercises}
      </p>    
    )
  }
  
  const Total = ({ course }) => {
    return(
      <div> 
      <b>Total of &nbsp;
        {course.parts.reduce( (sum, item) => {
          console.log('hello', sum, item.exercises)
          return sum + item.exercises
        }, 0
          )}
          &nbsp;exercises</b>
      </div>
    ) 
  }

  export default Course
  