import axios from 'axios';
import React from 'react';
// import socket from '../socket';

// "proxy": "http://localhost:9999/",

function JoinBlock({ onLogin }) {
    const [roomId, setRoomID] = React.useState('')
    const [userName, setUserName] = React.useState('')

    const onEnter = async () => {
        if (!roomId || !userName) {
            return alert('Please input all fields')
        } else if (roomId.length > 10 || userName.length > 10) {
            return alert('Max length 10 symbols')
        } else {        
            const obj = {
                roomId,
                userName
            }
            await axios.post('http://localhost:9999/rooms', obj)
            onLogin(obj)
        }
    }

    return (
        <div>
            <input type='text' placeholder='Room ID' defaultValue={roomId} onChange={e => setRoomID(e.target.value)} />
            <input type='text' placeholder='Name max 10 symblos' defaultValue={userName} onChange={e => setUserName(e.target.value)}/>
            <button onClick={() => onEnter()}>TO ENTER</button>
      </div>
    )
}

export default JoinBlock