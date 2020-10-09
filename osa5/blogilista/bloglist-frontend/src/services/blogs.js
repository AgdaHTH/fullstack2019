import axios from 'axios'
const baseUrl = '/api/blogs'

let token =  null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  console.log('service: response.data', response.data)
  return response.data
}

const update = async (id, newObject) => {
  console.log('update')
  const request = await axios.put(`${ baseUrl }/${id}`, newObject)
  return request.data //request.then(response => response.data)
}

const deleteBlog = async (id) => {
  console.log('delete')
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${ baseUrl }/${id}`, config)
  return response
}

export default { getAll, create, update, deleteBlog, setToken }