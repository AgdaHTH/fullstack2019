import React, { useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery, useApolloClient } from '@apollo/client'

const LogoutForm = (props)  => {
//const [token, setToken] = useState(null)
const client = useApolloClient()

const logout = () => {
    props.setToken(null)
    console.log('token', props.token)
    localStorage.clear()
    client.resetStore()
  }

  if (!props.show) {
    return null
  }

  return(
      <div>
          <h2>logout</h2>
          <button onClick={logout} >click here to logout</button>
      </div>
  )
}

export default LogoutForm