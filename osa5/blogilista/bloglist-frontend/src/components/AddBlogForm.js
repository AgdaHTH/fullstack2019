import React, { useState } from 'react'

const AddBlogForm = ({ createBlog }) => {

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleTitleChange = (event) => {
    console.log(event.target.value)
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    console.log(event.target.value)
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    console.log(event.target.value)
    setNewUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')

  }

  return (
    <div>
      <h2>add a new blog to the list</h2>
      <form onSubmit={addBlog}>

        title:<input type="text" id="title" value={newTitle}
          onChange={handleTitleChange} name="title" /><br></br>
        author:<input type="text" id="author" value={newAuthor}
          onChange={handleAuthorChange} name="author"/><br></br>
        url:<input type="text" id="url" value={newUrl}
          onChange={handleUrlChange} name="url"/><br></br>

        <button id="add-button" type="submit">add</button>

      </form>
    </div>
  )
}

export default AddBlogForm