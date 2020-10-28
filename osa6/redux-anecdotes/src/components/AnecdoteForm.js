import React from 'react'
import { useDispatch } from 'react-redux'
import { add_anecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import { connect } from 'react-redux'

const NewAnecdote = (props) => {
    //const dispatch = useDispatch()

    const addAnecdote = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''  
        console.log('tässä')
        //dispatch(add_anecdote(content))
        //dispatch(setNotification(`'${content}' was added`, 3000))

        props.add_anecdote(content)
        props.setNotification(`'${content}' was added`, 3000)
      }

      return (
          <div>
              <h2>create new</h2>
                <form onSubmit={addAnecdote}>
                    <div><input name="anecdote"/></div>
                    <button>create</button>
                </form>
          </div>
      )
}

const mapDispatchToProps = {
    add_anecdote,
    setNotification
  }

//ilmeisesti null tuolla exportissa viittaa siihen että
//ei ole mitään statea mikä pitää tietää
export default connect(
    null, mapDispatchToProps
    )(NewAnecdote)