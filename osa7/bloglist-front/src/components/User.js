import React, { useState } from 'react'
import {
  useParams
} from 'react-router-dom'

const User = (  { users }  ) => {
  const id = useParams().id
  console.log('User id', id)
  const user = users.find(n => n.id === id) //Number(id))
  if (!user) {
    return null
  }
  return (
    <div className='container'>
      <h2>{user.name}</h2>
      <div>blogs in the service: {user.blogs.length}</div>
      <div><ul>
        {user.blogs.map(blog => <li key={blog.id}>{blog.title}</li>) }
      </ul></div>
    </div>
  )

}

export default User