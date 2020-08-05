import React, { useState } from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
//import App from './App';
//import * as serviceWorker from './serviceWorker';

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array.apply
    (null, new Array(props.anecdotes.length)).map(Number.prototype.valueOf,0))
  
  const copy = [...points]
  const mostVotedAnecdote = points.indexOf(Math.max(...points))

  const random_anecdote = () => {
    setSelected(Math.floor(Math.random() * props.anecdotes.length))  
  }

  const vote = () => {  
    copy[selected] +=1
    setPoints(copy)
  }
    
  return (
    <div>
      <h2>Anecdote of the day</h2>
      {props.anecdotes[selected]}
      <br></br>
      has {points[selected]} votes
      <br></br>
      <button onClick={vote}>vote</button>
      <button onClick={random_anecdote}>next anecdote</button>     
      <p></p>
      <h2>Anecdote with most votes</h2>
      {props.anecdotes[mostVotedAnecdote]}
    </div>
  )
}

//const random_anecdote = (props) => {
//  props.setSelected(Math.floor(Math.random() * props.length))
//}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render( 
    
  <App anecdotes={anecdotes}/>,
  document.getElementById('root')
);


