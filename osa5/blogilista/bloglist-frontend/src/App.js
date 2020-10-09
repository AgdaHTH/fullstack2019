import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import AddBlogForm from './components/AddBlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, []) //tyhjä taulukko tarkoittaa, että suoritetaan vain
  //ensimmäisellä kerralla

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    console.log('logout')
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (newBlog) => {
    const response_data = await blogService.create(newBlog)
    console.log('response_data', response_data)
    setBlogs(blogs.concat(response_data))
    setErrorMessage(
      `${response_data.title} by ${response_data.author} was added to bloglist`
    )
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
    setVisible(false)

  }

  const addBlogForm = () => {

    return (
      <Togglable visible={visible} setVisible={setVisible}
        buttonLabel='add blog'>
        <AddBlogForm createBlog={addBlog}/>
        <p></p>
      </Togglable>

    )
  }

  const updateLikes = async (id, updatedBlogObject) => {
    console.log('id', id)
    const response = await blogService.update(id, updatedBlogObject)
    console.log('response.likes', response.likes)

    const newBlogs = blogs.map(
      blog => blog.id === id ? { ...blog, likes: blog.likes + 1 } : blog)
    console.log('new', newBlogs)
    setBlogs(newBlogs)}

  const sortedBlogs = (blogs) => {
    return blogs.sort((blog_a, blog_b) => (blog_a.likes > blog_b.likes) ? -1 : 1)
  }

  if (user === null) {
    return (
      <div>
        <LoginForm handleLogin={handleLogin}
          password={password} setPassword={setPassword}
          username={username} setUsername={setUsername}
          errorMessage={errorMessage}/>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{errorMessage}</p>
      <p>{user.name} logged in</p>
      <button type="submit" onClick={handleLogout}>logout</button>
      <p></p>
      {addBlogForm()}
      <p></p>
      {sortedBlogs(blogs).map(blog => (
        <Blog key={blog.id} blog={blog} updateLikes={updateLikes} currentUser={user} />
      ))}
    </div>
  )
}



export default App