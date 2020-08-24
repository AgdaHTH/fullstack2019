const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const logger = require('./../utils/logger')

blogsRouter.get('/', async (request, response) => {  
  const blogs = await Blog
    .find({}).populate('user', {username: 1, name: 1})   
    response.json(blogs)     
  })
 
  /*
  const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
    }
    return null
  }*/
  
blogsRouter.post('/', async (request, response) => {  
  const body = request.body
  console.log(body)

  //const token = getTokenFrom(request)
  //seuraava palauttaa olion, jonka perusteella token on laadittu
  //ja sen sisällä on kentät username ja id
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log('decodedToken', decodedToken)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  console.log(user)

  ///oletusarvo likeille jo oliossa?
  //likes: body.likes === undefined ? 0 : body.likes

  //NB2 Osassa 4b myös materiaalia get/:id eli yhden 
  //instanssin näyttävästä metodista ja sen testistä
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })
  

  if (!blog.likes) {
    blog.likes = 0
  }

  console.log(blog)

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  //materiaalissa ei ole tuota statusta välissä ollenkaan
  //ja on taas savedBlog.toJSON
  response.status(201).json(savedBlog)
  //response.status(201).json(result) näin oli aiemmin
  
})

  
blogsRouter.delete('/:id', async (request, response) => {
  
  const blog = await Blog.findById(request.params.id)
  console.log('blogi', blog)
  console.log('blog.user', blog.user.toString())
  //console.log('request', request)
  console.log('token', request.token)

  const presentTokenDecoded = jwt.verify(request.token, process.env.SECRET)     

  
  console.log('token', presentTokenDecoded)
  console.log('tokenin id', presentTokenDecoded.id.toString())

  //NB blog.user on siis ilm pelkkä id, joka sitten
  //populoidaan noilla muilla tiedoilla vastaukseen
  //mutta mistä tuo userid otetaan? jotenkin tuolta tokenista?

  //jos blogia ei löydy
  if (!blog) {
    return response.status(404).json( {error: 'blog not found'})
  }

  //jos tokenia ei ole
  else if (!presentTokenDecoded) {
    return response.status(401).json( {error: 'token missing'})
  }

  //jos blogin id ja tokenin id eivät täsmää
  else if (blog.user.toString() !== presentTokenDecoded.id.toString()) {
    return response.status(403).json({ error: 'invalid token' })
  } 

  //PUUTTUU POISTAMINEN
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
 
})

blogsRouter.put('/:id', async (request, response) => {
  const blogToBeUpdated = request.body

  const newBlog = {
    author: blogToBeUpdated.author,
    title: blogToBeUpdated.title,
    url: blogToBeUpdated.url,
    likes: blogToBeUpdated.likes
  }

  await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true})
  response.json(newBlog)
})
  

module.exports = blogsRouter
