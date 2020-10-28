const initialState = null

export const setNotification = (notification) => {
  return {
    type: 'SET_NOTIFICATION',
    data: notification
  }
}

export const hideNotification = (notification) => {
  return {
    type: 'HIDE_NOTIFICATION',
    data: notification
  }
}

/*
export const setNotification = (notification, time) => {

  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: notification
    })

    setTimeout(() => {
      dispatch({
        type: 'HIDE_NOTIFICATION'
      })
    }, time)
  }
}
*/



const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    //console.log('data: ', action.data)
    return action.data
  case 'HIDE_NOTIFICATION':
    state = null
    return state
  default:
    return state
  }
}

export default notificationReducer