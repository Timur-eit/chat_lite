import axios from 'axios';
import React from 'react';
import socket from '../socket';

// "proxy": "http://localhost:9999/",

function JoinBlock() {
    const [roomId, setRoomID] = React.useState('')
    const [userName, setUserName] = React.useState('')

    const onEnter = () => {
        if (!roomId || !userName) {
            return alert('Not Valid')
        }
        // console.log('roomId: ' + roomId, 'userNam: ' + userName)
        axios.post('http://localhost:9999/rooms', {
            roomId,
            userName
        })
    }

    return (
        <div>
            <input type='text' placeholder='Room ID' defaultValue={roomId} onChange={e => setRoomID(e.target.value)} />
            <input type='text' placeholder='Your name' defaultValue={userName} onChange={e => setUserName(e.target.value)}/>
            <button onClick={() => onEnter()}>Enter</button>
      </div>
    )
}

export default JoinBlock