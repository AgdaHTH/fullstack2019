const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('segreto', 10)
    const user = new User({ username: 'ekakayttaja', passwordHash })

    await user.save()
  })

  test('user is created when username is unique', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'tokakayttaja',
      name: 'Matti Meikäläinen',
      password: 'kryptos',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('user is not created if username is not unique', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ekakayttaja',
      name: 'Superman',
      password: 'hemlighet',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('user is not created if username is not provided', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Superman',
      password: 'hemlighet',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('user is not created if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ma',
      name: 'Superman',
      password: 'hemlighet',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('is shorter than the minimum allowed length') 
    
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('user is not created if password is not provided', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'meikalainen', 
      name: 'Superman'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password is required') 
    
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('user is not created if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'meikalainen', 
      name: 'Superman',
      password: 'he',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password too short') 
    
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  afterAll(() => {
    mongoose.connection.close()
  })
})