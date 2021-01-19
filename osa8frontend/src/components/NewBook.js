import React, { useState, useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'
import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuhtor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)

  const [ createBook, result ] = useMutation(CREATE_BOOK, {
    refetchQueries: [ { query: ALL_BOOKS }, {query: ALL_AUTHORS} ]
  })

  // useEffect(() => {
  //   if (result.errors) {
  //     console.log('errors', result.errors)
  //     notify('invalid input: ')
  //   }
  // }, [result.errors]) //???

  // const notify = (message) => {
  //   setErrorMessage(message)
  //   setTimeout(() => {
  //     setErrorMessage(null)
  //   }, 5000)
  // }

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
   
    createBook({  variables: { title, author, published, genres } })
    console.log('result.errors', result.errors)
    console.log('title', title, 'author', author, 
    'published', published)
    console.log('add book...')

    setTitle('')
    setPublished('')
    setAuhtor('')
    setGenres([])
    setGenre('')
    console.log('book added')
  }

  

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div>
          published 
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(parseInt(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook