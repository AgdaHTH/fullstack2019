import React, { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, updateLikes, currentUser }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [showFull, setShowFull] = useState(false)
  const [deletedBlog, setdeletedBlog] = useState(false)

  const handleShowFull = () => {
    setShowFull(!showFull)
  }

  const likeBlog = async (blogObject) => {

    const updatedBlogObject = {
      title: blogObject.title,
      author: blogObject.author,
      url:blogObject.url,
      likes: blogObject.likes + 1,
      user: blogObject.user.id
    }
    /*try {
      const response = await blogService.update(blogObject.id, updatedBlogObject)
      console.log('response.likes', response.likes)
    } catch (exception) {() => console.log('error happened')
    }*/

    updateLikes(blogObject.id, updatedBlogObject)
  }

  const deleteBlog = async (blog) => {
    if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)) {
      await blogService.deleteBlog(blog.id)
      setdeletedBlog(true)
    }
  }

  if (deletedBlog === true) {
    return null
  }

  if (showFull === false) {
    return (
      <div style={blogStyle}>
        {blog.title} <button onClick={handleShowFull}>view</button>
      </div>
    )
  }

  return (
    <div className='blog' style={blogStyle}>
      {blog.title} {blog.author} <button onClick={handleShowFull}>hide</button>
      <br></br>
      {blog.url}<br></br>
    likes {blog.likes} <button id='like-button' onClick={() => likeBlog(blog) }>like</button><br></br>
      {blog.user.name}<br></br>
      { currentUser.name === blog.user.name
      && <button onClick={() => deleteBlog(blog)}>remove</button>}
      <p></p>
    </div>
  )}

export default Blog
