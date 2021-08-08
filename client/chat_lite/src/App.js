import React from 'react'
import './App.css'
import JoinBlock from './components/JoinBlock'
import socket from './socket'
import Chat from './components/Chat'
import axios from 'axios'

// reducer - убрать в отдельный файл
const reducer = (state, action) => {
  switch (action.type) {
    case 'JOINED':
      return {
        ...state,
        joined: true,
        userName: action.payload.userName,
        roomId: action.payload.roomId,
      }
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
      }
    case 'NEW_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      }

      default:
        return state
  }
}

function App() {

  // const connectSocket = () => {
  //   io('http://localhost:9999')
  // }

  const [state, dispatch] = React.useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
  })

  const onLogin = async (obj) => {
    // оповестили фрон
    dispatch({
      type: 'JOINED',
      payload: obj,
      // action на стороне клиента описывает, что если юзер вошел, то скрываем окно входа
    })
    // оповестили сокет
    socket.emit('ROOM_JOIN', obj)
    // отправка от клиента запросы на бэк
    // emit отправляет
    const { data } = await axios.get(`http://localhost:9999/rooms/${obj.roomId}`)
    // получаем актуальные данные по юзерам и сообщениям по http
    setUsers(data.users)
  }

  const setUsers = (users) => {
    dispatch({
      type: 'SET_USERS',
      payload: users
    })
  }

  const addMessage = (message) => {
    dispatch({
      type: 'NEW_MESSAGE',
      payload: message
    })
    
  }
  // получает данные и от клиента и от сокета

  React.useEffect(() => {
    // socket.on('ROOM_JOINED', users => {
    //   console.log('new user', users)
    //   setUsers(users)
    // })

    socket.on('ROOM_SET_USERS', users => setUsers(users))
    socket.on('ROOM_NEW_MESSAGE', message => addMessage(message))
  }, [])

  // console.log(state)
  // window.socket = socket

  // console.log(state)

  return (
    <div className="App">
      {/* <button onClick={() => connectSocket()}>CONNECT</button> */}
      {!state.joined ? <JoinBlock onLogin={onLogin} /> 
      : <Chat
          users={state.users}
          messages={state.messages} 
          userName={state.userName}
          roomId={state.roomId}
          onAddMessage={addMessage}
        />}
    </div>
  );
}

export default App;
