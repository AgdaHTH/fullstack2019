import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'

import { EDIT_BIRTHYEAR, ALL_AUTHORS } from '../queries'

const BirthyearForm = ({ notify, authors, token }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ changeYear, result ] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [ {query: ALL_AUTHORS}]
  })

  const submit = async (event) => {
    event.preventDefault()

    changeYear({ variables: { name, born } })

    setName('')
    setBorn('')
  }

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      notify('author not found')
    }
  }, [result.data])

  if(!token) {
    return null
  }
  return (
    <div>
        
      <h3>set birthyear</h3>

      <form onSubmit={submit}>
        <div>

          name <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          birthyear <input
          type='number'
            value={born}
            onChange={({ target }) => setBorn(parseInt(target.value))}
          />
        </div>
        <button type='submit'>set birthyear</button>
      </form>
    </div>
  )
}

export default BirthyearForm