const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.deleteMany({})
    //allaoleva lisää kaiken ottaen huomioon asynkronian
    await Blog.insertMany(helper.initialBlogs)

    await User.deleteMany({})
       
    const passwordHash = await bcrypt.hash('kryptos', 10)
    const user = new User({ name: 'Matti Meikäläinen', username: 'tokakayttaja', passwordHash })

    await user.save()

})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('adding a valid blog succeeds', async () => {
    //console.log('testi alkaa')

    const blogToBeAdded = 
        {   _id: "5a422b3a1b54a676234d17f9", 
            title: "Canonical string reduction", 
            author: "Edsger W. Dijkstra", 
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", 
            likes: 12, __v: 0 
        }

    //console.log('blogToBeAdded', blogToBeAdded)
    
    //käyttäjän luonti
    const testUser = helper.initialUsers[0]
    //console.log('testUser', testUser)

    //kirjaudutaan ja otetaan talteen vastaus
    const response = await api
        .post('/api/login')
        .send(testUser) 
    
    //token
    const token = response.body.token
    //console.log('token', token)
    
    //blogin lisääminen tokenin kanssa
    await api  
      .post('/api/blogs')
      .set({ Authorization: `bearer ${token} `})
      .send(blogToBeAdded)
      .expect(201) 

    //tarkastetaan että validi blogi lisättiin kun token on oikea  
    const blogsAtEnd = await helper.blogsInDb() 
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('Canonical string reduction')
})


test('adding a valid blog does not succeed if token is invalid', async () => {
    //console.log('testi alkaa')

    const blogToBeAdded = 
        {   _id: "5a422b3a1b54a676234d17f9", 
            title: "Canonical string reduction", 
            author: "Edsger W. Dijkstra", 
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", 
            likes: 12, __v: 0 
        }

    //console.log('blogToBeAdded', blogToBeAdded)
    
    //käyttäjän luonti
    const testUser = helper.initialUsers[0]
    //console.log('testUser', testUser)

    //kirjaudutaan ja otetaan talteen vastaus
    const response = await api
        .post('/api/login')
        .send(testUser) 
    
    //token
    const token = response.body.token
    //console.log('token', token)
    
    //blogin lisääminen väärän/olemattoman tokenin kanssa
    await api  
      .post('/api/blogs')
      .set( {Authorization: 'bearer'})
      //.set({ Authorization: `bearer ${token}js `})
      .send(blogToBeAdded)
      .expect(401) 

    //tarkastetaan että blogia ei lisätty kun token on väärä  
    const blogsAtEnd = await helper.blogsInDb() 
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)  
})


test('id is returned correctly', async () => {
    const response = await api.get('/api/blogs')
    //console.log('yht', response.body.length)
    const blog = response.body[0]
    expect(blog.id).toBeDefined()
})

test('if likes is empty it defaults to zero', async () => {
    const blogToBeAdded = 
        {   _id: "5a422b3a1b54a676234d17f9", 
            title: "Canonical string reduction", 
            author: "Edsger W. Dijkstra", 
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", 
            __v: 0 
        }
    

    const testUser = helper.initialUsers[0]
    //console.log('testUser', testUser)
    
    //kirjaudutaan ja otetaan talteen vastaus
    const response = await api
        .post('/api/login')
        .send(testUser) 
        
    //token
    const token = response.body.token
    //console.log('token', token)
        
    //blogin lisääminen tokenin kanssa
    const response_2 = await api  
        .post('/api/blogs')
        .set({ Authorization: `bearer ${token} `})
        .send(blogToBeAdded) 
    
    const addedBlog = response_2.body
    expect(addedBlog.likes).toBeDefined()
    expect(addedBlog.likes).toBe(0)
    
})

test('blog without a title is not accepted', async () => {
    const blogToBeAdded = 
        {   _id: "5a422b3a1b54a676234d17f9", 
            author: "Edsger W. Dijkstra", 
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", 
            __v: 0 
        }


    //käyttäjän luonti
    const testUser = helper.initialUsers[0]
    //console.log('testUser', testUser)

    //kirjaudutaan ja otetaan talteen vastaus
    const response = await api
        .post('/api/login')
        .send(testUser) 
    
    //token
    const token = response.body.token
    //console.log('token', token)
    
    //blogin lisääminen tokenin kanssa: token on oikea mutta title puuttuu
    await api  
      .post('/api/blogs')
      .set({ Authorization: `bearer ${token} `})
      .send(blogToBeAdded)
      .expect(400) 

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    
})

test('blog without an url is not accepted', async () => {
    const blogToBeAdded = 
        {   _id: "5a422b3a1b54a676234d17f9", 
            title: "Canonical string reduction", 
            author: "Edsger W. Dijkstra", 
            __v: 0 
        }

    //käyttäjän luonti
    const testUser = helper.initialUsers[0]
    //console.log('testUser', testUser)

    //kirjaudutaan ja otetaan talteen vastaus
    const response = await api
        .post('/api/login')
        .send(testUser) 
    
    //token
    const token = response.body.token
    //console.log('token', token)
    
    //blogin lisääminen tokenin kanssa: token on oikea mutta url puuttuu
    await api  
      .post('/api/blogs')
      .set({ Authorization: `bearer ${token} `})
      .send(blogToBeAdded)
      .expect(400)     

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('a blog can be deleted', async () => {

    const blogToBeDeleted = 
        {   _id: "5a422b3a1b54a676234d17f9", 
            title: "Canonical string reduction", 
            author: "Edsger W. Dijkstra", 
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", 
            likes: 12, __v: 0 
        }

    //käyttäjän luonti
    const testUser = helper.initialUsers[0]
    console.log('testUser', testUser)

    //kirjaudutaan ja otetaan talteen vastaus
    const response = await api
        .post('/api/login')
        .send(testUser) 
    
    //token
    const token = response.body.token
    console.log('token', token)

    //luodaan blogi
    const response_2 = await api  
      .post('/api/blogs')
      .set({ Authorization: `bearer ${token} `})
      .send(blogToBeDeleted)
    
    //onnistuiko?
    console.log('reponse_2 status', response_2.status) //201
    const deleteBlog = response_2.body
    console.log('deleteBlog', deleteBlog)

    //blogin poistaminen tokenin kanssa kun token on oikea
    await api 
        .delete(`/api/blogs/${deleteBlog.id}`)
        .set({ Authorization: `bearer ${token} `})
        .expect(204)
    
    
    const blogsAtEnd = await helper.blogsInDb()
    
    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).not.toContain(blogToBeDeleted.title)
})

afterAll(() => {
    mongoose.connection.close()
  })

