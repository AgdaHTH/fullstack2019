const initialState = null

//voiko tälle antaa anekdootit ylhäältä?
export const setFilter = ({filter, anecdotes}) => {
    return {
    type: 'SET_FILTER',
    filter,
    anecdotes
  }
}

const filterReducer = (state = 'ALL', action) => { //state = 'ALL'
    switch (action.type) {
      case 'SET_FILTER':
          console.log('filtteri', action.filter)
          console.log('state', state)
          const filteredAnecdotes = 
        state.filter(anecdote => anecdote.content.toLowerCase().includes(action.filter))
        const newState = {...state, anecdotes: filteredAnecdotes}
        return newState
      default:
        return state
    }
  }
export default filterReducer