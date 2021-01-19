import React, { useState } from 'react'

const Books = (props) => {
  const [filter, setFilter] = useState()
  const [showAll, setShowAll] = useState(true)

  if (!props.show) {
    return null
  }

  const filteredBooks = props.books.filter(book => book.genres.includes(filter))
  
  const books = props.books
  const genreLists = books.map(book => book.genres)
  const genreArray = genreLists.flat()
  let distinctGenres = [...new Set(genreArray)]

  const filterAndShow = (genre) => {
    setFilter(genre)
    setShowAll(false)
  }


  if(showAll) {
    //console.log('show all')
    return (
      <div>
        <h2>all books</h2>
  
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>
                author
              </th>
              <th>
                published
              </th>
            </tr>
            {books.map(a =>
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            )}
          </tbody>
        </table>
        <table>
          <tbody>
          <tr>
            {distinctGenres.map(genre => <td key={genre}><button onClick={()=> filterAndShow(genre)}>{genre}</button></td> )}
          </tr>
          <tr><td><button>all</button></td></tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div>
      <h2>books in genre {filter}</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {filteredBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <table>
        <tbody>
        <tr>
          {distinctGenres.map(genre => <td key={genre}><button onClick={()=> setFilter(genre)}>{genre}</button></td> )}
        </tr>
        <tr><td><button onClick={()=> setShowAll(true)}>all</button></td></tr>
        </tbody>
      </table>
    </div>
  )
}

export default Books