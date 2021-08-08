import io from 'socket.io-client'
// io - input / output

const socket = io('http://localhost:9999/')
// ? proxy package.json ?

export default socket