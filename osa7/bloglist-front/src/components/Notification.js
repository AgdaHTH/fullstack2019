import React from 'react'

const Notification = ({ notification }) => {
 // console.log('notif', notification)
  if ( !notification ) {
    //console.log('ei notif')
    return null
  }

  const style = {
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    color: notification.type === 'success' ? 'green' : 'red',
    background: 'lightgrey'
  }

  return <div style={style}>
    {notification.message}
  </div>
}

export default Notification