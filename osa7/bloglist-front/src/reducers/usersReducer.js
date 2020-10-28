const initialState = []

export const getAllUsers = (users) => {
  return {
    type: 'ALL_USERS',
    data: users
  }
}

const userReducer = (state = initialState, action) => {
  switch(action.type) {
  case 'ALL_USERS':
    return action.data
    //return state.concat(action.data)
  default:
    return state
  }
}

export default userReducer