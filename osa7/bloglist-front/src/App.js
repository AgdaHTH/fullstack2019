import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import NewBlog from './components/NewBlog'
import User from './components/User'

import {
  BrowserRouter as Router,
  Switch, Route, Link, Redirect, useHistory
} from 'react-router-dom'

import blogService from './services/blogs'
import userService from './services/users'
import loginService from './services/login'
import storage from './utils/storage'

import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, addBlog, likeBlog, deleteBlog } from './reducers/blogReducer'
import { loginUser, logoutUser, initializeUser } from './reducers/userReducer'
import { getAllUsers } from './reducers/usersReducer'

const byLikes = (b1, b2) => b2.likes - b1.likes

const Home = ({ user, blogs, stateNotification,
  handleLogout, blogFormRef, createBlog,
  handleLike, handleRemove }) => {
  return(
    <div className='container'>
      <h2>blog app</h2>
      <Notification notification={stateNotification} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel='create new blog'  ref={blogFormRef}>
        <NewBlog createBlog={createBlog} />
      </Togglable>
      {blogs.sort(byLikes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={handleLike}
          handleRemove={handleRemove}
          own={user.username===blog.user.username}
        />
      )}
    </div>
  )
}

const Users = ({ user, users, stateNotification, handleLogout }) => {
  return (
    <div className='container'>
      <h2>blog app</h2>
      <Notification notification={stateNotification} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <table>
        <thead><tr>
          <td><b>users</b></td>
          <td>&nbsp;</td>
          <td><b>blogs created</b></td>
        </tr></thead>
        <tbody>
          {users.map(user =>
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
              <td>&nbsp;</td>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )

}

const Login = ( { stateNotification, handleLogin, username,
  setUsername, password, setPassword }) => {
  return (
    <div className='container'>
      <h2>login to application</h2>
      <Notification notification={stateNotification} />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id='username'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id='login'>login</button>
      </form>
    </div>
  )
}

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const stateNotification = useSelector(state => state.notification)
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const users = useSelector(state => state.users)
  const blogFormRef = React.createRef()
  const history = useHistory()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      dispatch(initializeBlogs(blogs))
    )
  }, [dispatch])
/*
  useEffect(() => {
    const user = storage.loadUser()
    dispatch(initializeUser(user))
  }, [dispatch])
*/
  useEffect(() => {
    userService.getAll().then(users =>
      dispatch(getAllUsers(users))
    )
  }, [dispatch])

  const padding = {
    padding: 5
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      setUsername('')
      setPassword('')
      dispatch(loginUser(user))
      const message = `${user.name} welcome back!`
      const notification = {
        message: message,
        type: 'success'
      }
      history.push('/')
      dispatch(setNotification(notification))
      setTimeout(() => {
        dispatch(setNotification(null))
      }, 5000)
      storage.saveUser(user)

    } catch(exception) {
      const message = 'wrong username/password'
      const notification = {
        message: message,
        type: 'error'
      }
      dispatch(setNotification(notification))
      setTimeout(() => {
        dispatch(setNotification(null))
      }, 5000)
    }

  }

  const createBlog = async (blog) => {
    try {
      const newBlog = await blogService.create(blog)
      blogFormRef.current.toggleVisibility()
      dispatch(addBlog(newBlog))

      const message = `a new blog '${newBlog.title}' by ${newBlog.author} added!`
      const notification = {
        message: message,
        type: 'success'
      }
      dispatch(setNotification(notification))
      setTimeout(() => {
        dispatch(setNotification(null))
      }, 5000)
    } catch(exception) {
      console.log(exception)
    }
  }

  const handleLike = async (id) => {
    const blogToLike = blogs.find(b => b.id === id)
    const likedBlog = { ...blogToLike, likes: blogToLike.likes + 1, user: blogToLike.user.id }
    const updatedBlog = await blogService.update(likedBlog)
    const updatedBlog2 = { ...updatedBlog, user: blogToLike.user }
    dispatch(likeBlog(updatedBlog2))
  }

  const handleRemove = async (id) => {
    const blogToRemove = blogs.find(b => b.id === id)
    const ok = window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}`)
    if (ok) {
      await blogService.remove(id)
      console.log('removedBlog', blogToRemove)
      dispatch(deleteBlog(blogToRemove))
    }
  }

  const handleLogout = () => {
    dispatch(logoutUser(user))
    storage.logoutUser()
  }


  return (
    <div>
      <div className='container'>
        {user
          ? <Link style={padding} to="/">home</Link>
          : null
        }
        {user
          ? <Link style={padding} to="/users">users</Link>
          : null
        }
        {user
          ? <em>{user.name} logged in</em>
          : <Link style={padding} to="/login">login</Link>
        }
      </div>
      <Switch>
        <Route path="/users/:id">
          <User users={users} />
        </Route>
        <Route path="/users">
          {user ?
            <Users user={user} users={users}
              stateNotification={stateNotification}
              handleLogout={handleLogout}/>
            : <Redirect to="/login" />}
        </Route>
        <Route path="/login">
          <Login stateNotification={stateNotification}
            handleLogin={handleLogin} username={username}
            setUsername={setUsername}
            password={password} setPassword={setPassword}/>
        </Route>
        <Route path="/">
          {user ? <Home user={user} blogs={blogs}
            stateNotification={stateNotification}
            handleLogout={handleLogout} blogFormRef={blogFormRef}
            createBlog={createBlog} handleLike={handleLike}
            handleRemove={handleRemove}/> 
            : <Redirect to="/login" />}
        </Route>
      </Switch>
      <div className='container'>
        <i>Blog app 2020</i>
      </div>
    </div>

  )

}

export default App