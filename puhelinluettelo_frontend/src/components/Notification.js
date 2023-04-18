const Notification = ({ message, errorStyle }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div style={errorStyle}>
        {message}
      </div>
    )
  }
  
  export default Notification