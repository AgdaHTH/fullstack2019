import anecdoteService from '../services/anecdotes'
/*
const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}
*/
//const initialState = anecdotesAtStart.map(asObject)

export const vote_anecdote = (anecdote) => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.voteAnecdote(anecdote)
    console.log('(updatedAnecdote', updatedAnecdote)
    dispatch({
      type: 'VOTE',
      data: updatedAnecdote
    })
  }
}

export const add_anecdote = (content) => {
  return async dispatch => {  
    const newAnecdote = await anecdoteService.createNew(content)
    console.log('newAnecdote', newAnecdote)
    dispatch({
    type: 'NEW_ANECDOTE',
    data: newAnecdote
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
    type: 'INIT_ANECDOTES',
    data: anecdotes
    })
  }
} 

const anecdoteReducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)
  
  switch (action.type) {
    case 'INIT_ANECDOTES':
      return action.data
    case 'NEW_ANECDOTE':      
      return state.concat(action.data)
    case 'VOTE':
    const id = action.data.id
    const updated_anecdote = action.data
  return state.map(anecdote => 
    anecdote.id !== id ? anecdote : updated_anecdote
    )
  default: 
    return state
  }
}

export default anecdoteReducer