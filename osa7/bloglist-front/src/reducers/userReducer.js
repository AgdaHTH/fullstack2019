import storage from '../utils/storage'
const initialState = storage.loadUser()

export const initializeUser = (user) => {
  return {
    type: 'INIT_USER',
    data: user
  }
}


export const loginUser = (user) => {
  return {
    type: 'LOGIN_USER',
    data: user
  }

}

export const logoutUser = (user) => {
  return {
    type: 'LOGOUT_USER',
    data: user
  }

}

const userReducer = (state = initialState, action) => {
  switch(action.type) {
  case 'INIT_USER':
    return action.data
  case 'LOGIN_USER':
    return action.data
  case 'LOGOUT_USER':
    return null
  default:
    return state
  }

}

export default userReducer