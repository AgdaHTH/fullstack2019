const { ApolloServer, UserInputError, AuthenticationError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'
const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')

const { PubSub } = require('apollo-server')

const MONGODB_URI= 'mongodb+srv://soittaja20:puhelinnumero@cluster0.xkp6h.mongodb.net/library?retryWrites=true&w=majority'

console.log('connecting to', MONGODB_URI)

//mongoose.set('useCreateIndex', true)


mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String]
  }  

  type Author {
    name: String!
    id: ID! 
    born: Int
    bookCount: Int
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }    
`

const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      // if (!args.author && !args.genre) {
      //   return books
      // }
      // if (args.author && args.genre) {
      //   const booksByAuthor = books.filter(book => book.author === args.author)
      //   const booksByAuthorAndGenre = booksByAuthor.filter(book => book.genres.includes(args.genre))
      //   return booksByAuthorAndGenre
      // }
      // if (args.author) {
      // const booksByAuthor = books.filter(book => book.author === args.author)
      //   return booksByAuthor
      // }
       if (args.genre) {
        const genreBooks = await Book.find( { genres: { $in: [ args.genre ] } } )
         return genreBooks
       }
      
      return Book.find({})  
    },
    allAuthors: () => {
      return Author.find({}) 
    },
    me: (root, args, context) => {
      return context.currentUser
    },

  },
  Author: {
    bookCount: async (root) => {
      const authorBooks = await Book.find( { author: { $in: [ root.id ] } } )
      return authorBooks.length
    }
  },
  Book: {
    author: async (root) => {
      const author = await Author.findById({ _id: root.author})
      return {
        name: author.name
      }
    }
  },
  

  Mutation: {
    addBook: async (root, args, context) => {
      
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const author = await Author.findOne({ name: args.author})

      if(!author) {
        const author = new Author({name: args.author})     
        try {
          await author.save()

        } catch (error) {
          console.log('error', error)
          throw new UserInputError("Minimum length of author is 4 characters")       
        }

        

      const authorId = author.id
      const book = new Book({...args, author: authorId})
      //nyt author tallentuu jos se oli oikein mutta kirja liian lyhyt
          try {
            await book.save()
          } catch (error) {   
            throw new UserInputError("Minimum length of book title is 2 characters")
          }     
          pubsub.publish('BOOK_ADDED', { bookAdded: book })
          return book
      } 

      //jos author löytyi
      const authorId = author.id
      const book = new Book({...args, author: authorId})   
      
      try {
        await book.save()
      } catch (error) {
        throw new UserInputError("Minimum length of book title is 2 characters")
      }
      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      return book 
    },
    
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const updatedAuthor = await Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo })
      if (!updatedAuthor) {
        return null      
      }
      return updatedAuthor.save()
      
    },

    createUser: (root, args) => {
      console.log('createUser', args)
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      console.log('user', user)
      return user.save()
        .catch(error => {
          throw new UserInputError("Invalid arguments")
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secret' ) {
        throw new UserInputError("wrong credentials")
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  },
}


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})