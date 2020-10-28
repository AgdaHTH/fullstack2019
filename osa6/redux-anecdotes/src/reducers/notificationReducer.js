const initialState = null

export const setNotification = (notification, time) => {
    console.log('notification', notification)
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

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_NOTIFICATION':  
            return action.data
        case 'HIDE_NOTIFICATION':
            state = null
            return state 
        default:
            return state
    }
}



export default notificationReducer