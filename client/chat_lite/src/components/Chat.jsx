import React, {useEffect} from "react"
import socket from "../socket"
import {useParams} from 'react-router-dom'
import {makeStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import AccountCircle from '@material-ui/icons/AccountCircle'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import Button from "@material-ui/core/Button"

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}))


function Chat({users, messages, userName, roomId, onAddMessage, onLogin}) {
  const [messageValue, setMessageValue] = React.useState('')
  const messagesRef = React.useRef(null)
  const params = useParams()
  const classes = useStyles()

  useEffect(() => {
    if (!userName) {
      const userName = window.prompt('Please enter user name')
      const obj = {userName, roomId: params.chat_id}
      onLogin(obj)
    }
  }, [params, userName, roomId])

  const onSendMessage = () => {
    socket.emit('ROOM_NEW_MESSAGE', {
      userName,
      roomId,
      text: messageValue,

    })
    onAddMessage({
      userName,
      text: messageValue,
    })
    // имитация добавления сообщения (своего), как-будто от сервера
    setMessageValue('')
    // window.scrollTo(0, document.body.scrollHeight);
  }

  React.useEffect(() => {
    messagesRef.current.scrollTo(0, 999999)
  }, [messages])

  return (
    <div className='chat-container'>
      <h2>Room: {roomId}</h2>
      <div className='users-list'>
        {/* {usersList} */}
        Online users {users.length}
        <List >
          {users.map((user, i) =>
            <ListItem key={user + i}>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary={user}/>
            </ListItem>
          )}
        </List>
      </div>

      <div ref={messagesRef} className='chat-messages'>
        <List className={classes.root}>
          {messages.map((message, i) => {
            return (
              <div key={message + i}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={message.userName}
                    secondary={message.text}
                  />
                </ListItem>
                <Divider variant="inset" component="li"/>
              </div>

            )
          })}
        </List>
      </div>

      <div className='users-input'>
        <form>
          <TextareaAutosize
            aria-label="new message"
            placeholder="enter message"
            value={messageValue}
            minRows={3}
            onChange={(e) => setMessageValue(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={() => onSendMessage()}>
            Send
          </Button>
        </form>
      </div>


    </div>
  )
}

export default Chat