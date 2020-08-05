import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  const course = {
  name: 'Half Stack application development',
  
  parts: [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    } 

  ]

}

  return (
    <div>
      <h1><Header name={course.name} /></h1>
        <Content parts={course.parts} />  
        <Total total={course.parts} />      
    </div>
  )
}

const Header = (props) => {
return (
  <div>
    <p>
      {props.name}
    </p>
  </div>
)
}

const Content = (props) => {
  console.log(props)
  
  return (
    <div>
      <Part course={props.parts[0].name} exercises={props.parts[0].exercises}/>
      <Part course={props.parts[1].name} exercises={props.parts[1].exercises}/>
      <Part course={props.parts[2].name} exercises={props.parts[2].exercises}/>
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>
      {props.course} {props.exercises}
      </p>
    </div>
  )
}

const Total = (props) => {
  return (
    <div>
      <p>
      Number of exercises {props.total[0].exercises +
      props.total[1].exercises + props.total[2].exercises}
      </p>
    </div>
  )
}


ReactDOM.render(<App />, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

