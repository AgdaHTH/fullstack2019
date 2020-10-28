import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  console.log('createNew content', content)
  const object = { content, votes: 0 }
  const response = await axios.post(baseUrl, object)
  console.log('createNew', response.data)
  return response.data
}

const voteAnecdote = async (anecdote) => {
  //const anecdoteToVote = 
  const updatedObject = {...anecdote, votes: anecdote.votes+1}
  const response = await axios.put(`${ baseUrl }/${anecdote.id}`, updatedObject)
  return response.data
}

export default { getAll, createNew, voteAnecdote }