import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { ALL_BOOKS, ALL_AUTHORS, BOOK_ADDED } from './queries'
import { gql, useQuery, useApolloClient, useSubscription } from '@apollo/client'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import LogoutForm from './components/LogoutForm'
import Recommended from './components/Recommended'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)

  const resultAuthors = useQuery(ALL_AUTHORS) 
  const resultBooks = useQuery(ALL_BOOKS)
  const client = useApolloClient()

  const updateCacheWith = (addedBook) => {
    console.log('added book', addedBook)
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id)  

    const booksInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(booksInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks : booksInStore.allBooks.concat(addedBook) }
      })
    }
    
    const authorsInStore = client.readQuery({ query: ALL_AUTHORS })
    if (!includedIn(authorsInStore.allAuthors, addedBook.author)) {
      client.writeQuery({
        query: ALL_AUTHORS,
        data: { allAuthors : authorsInStore.allAuthors.concat(addedBook.author) }
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData)
      const addedBook = subscriptionData.data.bookAdded
      window.alert(`A new book titled ${addedBook.title} added`)
      //notify(`${addedBook.title} added`)
      updateCacheWith(addedBook)
    }
  })

  if (resultAuthors.loading || resultBooks.loading)  { 
    return <div>loading...</div>
  }
  
  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  if (!token) {
    return (
      <div>
        <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('login')}>login</button>
        </div>
        <Notification errorMessage={errorMessage}/>
              
          <Authors 
          show={page === 'authors'}
          authors = {resultAuthors.data.allAuthors}
          />

          <Books
          show={page === 'books'}
          books = {resultBooks.data.allBooks}
          />
      
          <LoginForm
          show={page === 'login'}
          setToken={setToken}
          setError={notify}
          />
        
      </div>
    )
  }
  
  return (
    <div>    
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('logout')}>logout</button>
        <button onClick={() => setPage('recommended')}>recommended</button>        
      </div>
      <Notification errorMessage={errorMessage}/>
      
      <Authors 
        show={page === 'authors'}
        authors = {resultAuthors.data.allAuthors}
        token = {token}
      />

      <Books
        show={page === 'books'}
        books = {resultBooks.data.allBooks}
      />

      <NewBook
        show={page === 'add'}
      />

      <LogoutForm
        show={page === 'logout'}
        token = {token}
        setToken = {setToken}
      />

      <Recommended
        show={page === 'recommended'}
        books = {resultBooks.data.allBooks}
      />
    
    </div>
  )
}

export default App