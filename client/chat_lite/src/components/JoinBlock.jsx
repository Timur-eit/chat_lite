import axios from 'axios';
import React from 'react';
// import socket from '../socket';

// "proxy": "http://localhost:9999/",

function JoinBlock({ onLogin }) {
    const [roomId, setRoomID] = React.useState('')
    const [userName, setUserName] = React.useState('')
    const [isLoading, setLoading] = React.useState(false)

    const onEnter = async () => {
        if (!roomId || !userName) {
            return alert('Not Valid')
        }
        const obj = {
            roomId,
            userName
        }
        setLoading(true)
        await axios.post('http://localhost:9999/rooms', obj)
        onLogin(obj)
    }

    return (
        <div>
            <input type='text' placeholder='Room ID' defaultValue={roomId} onChange={e => setRoomID(e.target.value)} />
            <input type='text' placeholder='Your name' defaultValue={userName} onChange={e => setUserName(e.target.value)}/>
            <button disabled={isLoading} onClick={() => onEnter()}>
                {isLoading ? 'ENTRANCE' : 'TO ENTER'}
            </button>
      </div>
    )
}

export default JoinBlock