import React from "react"
import socket from "../socket"

function Chat({users, messages, userName, roomId, onAddMessage}) {
    const [messageValue, setMessageValue] = React.useState('')
    const messagesRef = React.useRef(null)

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
            <ul>
                {users.map((user, i) => {
                    return <li key={user + i}>{user}</li>
                })}
            </ul>
        </div>

        <div ref={messagesRef} className='chat-messages'>
            {messages.map((message, i) => {
                return (
                    <div key={message + i}>
                        <div><p>{message.text}</p></div>
                        <div><span>{message.userName}</span></div>
                    </div>
                )
            })}
        </div>

        <div className='users-input'>
            <form>
                <textarea
                    value={messageValue}
                    onChange={(e) => setMessageValue(e.target.value)}
                    rows='3'
                >
                </textarea>
                <button type='button' onClick={() => onSendMessage()}>Send</button>
            </form>
        </div>



        </div>
    )
}

export default Chat