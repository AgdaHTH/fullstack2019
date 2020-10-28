import React from 'react'
//import { useDispatch, useSelector } from 'react-redux'
import { connect } from 'react-redux'

const Notification = (props) => {

  const notification = () => {
    console.log('notif', props.notification)
    return props.notification
  }

  if (notification() !== null) {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    <div style={style}>
      {notification()}
    </div>
  )
  } else {
    return null
  }
}
const mapStateToProps = (state) => {
  return {
    notification: state.notification 
  }
}


const ConnectedNotification = connect(mapStateToProps)(Notification)
export default ConnectedNotification