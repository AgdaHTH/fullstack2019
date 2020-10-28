import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilter } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const handleChange = (event) => {
    // input-kentän arvo muuttujassa event.target.value
    
    const filter = event.target.value
    dispatch(setFilter(filter, anecdotes))


  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter