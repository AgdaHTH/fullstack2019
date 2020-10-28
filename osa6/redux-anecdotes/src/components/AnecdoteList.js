import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { vote_anecdote } from '../reducers/anecdoteReducer'
//import { notificationChange, hideNotification } from '../reducers/notificationReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdotes = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    console.log('vote', anecdote.id)
    dispatch(vote_anecdote(anecdote))
    
    dispatch(setNotification(`you voted '${anecdote.content}'`, 3000))
    
  }

  const sortedAnecdotes = (anecdotes) => {
    return anecdotes.sort((anecdote_a, anecdote_b) => (anecdote_a.votes > anecdote_b.votes) ? -1 : 1)
  }

  return (
    <div>
      {sortedAnecdotes(anecdotes).map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
      </div>
  )
}

export default Anecdotes