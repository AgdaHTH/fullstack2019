const initialState = []

export const initializeBlogs = (blogs) => {
  console.log('initializeBlogs', blogs)
  return {
    type: 'INIT_BLOGS',
    data: blogs
  }
}

export const addBlog = (blog) => {
  return {
    type: 'NEW_BLOG',
    data: blog
  }
}

export const likeBlog = (blog) => {
  //console.log('blogi', blog)
  return {
    type: 'LIKE_BLOG',
    data: blog
  }
}

export const deleteBlog = (blog) => {
  console.log('blogi', blog)
  return {
    type: 'DELETE_BLOG',
    data: blog
  }
}

const blogReducer = (state = initialState, action) => {
  console.log('state now: ', state)
  console.log('action.type', action.type)
  switch(action.type) {
  case 'INIT_BLOGS':
    console.log('case', action.data)
    return action.data
  case 'NEW_BLOG':
    return state.concat(action.data)
  case 'LIKE_BLOG':
    const id = action.data.id
    const updated_blog = action.data
    return state.map(blog =>
      blog.id !== id ? blog : updated_blog
    )
  case 'DELETE_BLOG':
    const deleteId = action.data.id
    const deleteBlog = action.data
    return state.filter(blog => blog.id !== deleteId)
  default:
    return state

  }
}

export default blogReducer
