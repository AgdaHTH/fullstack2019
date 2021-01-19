import React, { useState }  from 'react'
import BirthyearForm from './BirthyearForm'
import Notification from './Notification'


const Authors = (props) => {
  const [errorMessage, setErrorMessage] = useState(null)
  if (!props.show) {
    return null
  }
  const authors = props.authors
  
  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      
      <Notification errorMessage={errorMessage} />
      <BirthyearForm notify={notify} authors={authors} token={props.token}/>      

    </div>
  )
}

export default Authors
