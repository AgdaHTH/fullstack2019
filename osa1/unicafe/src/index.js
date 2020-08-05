import ReactDOM from 'react-dom';
import React, { useState } from 'react'

const App = () => {

  const [clicks, setClicks] = useState({good: 0, neutral: 0, bad: 0, all: 0})

  const goodFeedback = () => {
    const newClicks = {
      ...clicks,
      good: clicks.good + 1,
      all: clicks.all +1
    }
    setClicks(newClicks)
  }

  const neutralFeedback = () => {
    const newClicks = {
      ...clicks,
      neutral: clicks.neutral + 1,
      all: clicks.all +1
    }
    setClicks(newClicks)
  }

  const badFeedback = () => {
    const newClicks = {
      ...clicks,
      bad: clicks.bad + 1,
      all: clicks.all +1
    }
    setClicks(newClicks)
  }

  return (
    <div>
      <h2>give feedback</h2>
      <p></p>
      <table>
        <tbody>
      <tr>
      <td><Button handleClick={goodFeedback}
      text='good'/>
      </td>
      <td><Button handleClick={neutralFeedback}
      text='neutral'/>
      </td>
      <td><Button handleClick={badFeedback}
      text='bad'/>         
    </td>
    </tr>
    </tbody>
    </table>
    <p></p>
    <h2>statistics</h2>
    <p></p>
    <Statistics feedback = {clicks}/>   
    </div>
  )

}

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const Statistics = (props) => {
  if (props.feedback.all === 0) {
    return (
      <div>
        No feedback given!
      </div>
    )
  }

  return (
    <div>          
            <StatisticLine text="good" value={props.feedback.good} />
            <StatisticLine text="neutral" value={props.feedback.neutral} />
            <StatisticLine text="bad" value={props.feedback.bad}/>
            <StatisticLine text="all" value={props.feedback.all}/>        
            <StatisticLine text="average" value={((props.feedback.good - props.feedback.bad) / props.feedback.all).toFixed(2)}/>
            <StatisticLine text="positive" value={((props.feedback.good / props.feedback.all) * 100).toFixed(2)} />                
    </div>
    
  )

}

const StatisticLine = ({text, value}) => {
  return(
    <div>
      <table>
        <tbody>        
          <tr>
            <td width="100">{text}</td>
            <td>{value}</td>
          </tr>          
        </tbody>
      </table>
    </div>
  )

}

ReactDOM.render(<App />,
  document.getElementById('root')
);


