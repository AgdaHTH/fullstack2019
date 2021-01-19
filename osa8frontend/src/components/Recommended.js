import React from 'react'
import { useQuery } from '@apollo/client'
import { ME } from '../queries'

const Recommended = (props) => {
    const result = useQuery(ME)
    if (!props.show) {
        return null
      }

    const favoriteGenre = result.data.me.favoriteGenre
    //console.log('favgenre', favoriteGenre)

    const recommendedBooks = props.books.filter(book => book.genres.includes(favoriteGenre))

    return(
        <div>
          <h2>recommendations in genre {favoriteGenre}</h2>
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
                {recommendedBooks.map(book =>
                <tr key={book.title}>
                    <td>{book.title}</td>
                    <td>{book.author.name}</td>
                    <td>{book.published}</td>
                </tr>
                )}
              </tbody>
            </table>
        </div>
    )
}

export default Recommended