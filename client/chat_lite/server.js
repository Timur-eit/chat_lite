const express = require('express')
const socket = require('socket.io')
const cors = require('cors')

const port = 9999
const app = express()
// create express application

const server = require('http').Server(app)
// create server and connect server to application
const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
})
// connect socket to app with cors configs

const rooms = new Map() // collection as database
    // ['rooms', null],
    // ['messages', ['hello']]

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
      
app.use(cors(corsOptions))
app.use(express.json()) // чтобы в body отображались post data в виде json

app.get('/rooms', (req, res) => {
    res.json(rooms)
    // получаем списков всех комнат
})
// setup web application

app.post('/rooms', (req, res) => {
    // console.log(req.body)
    const { roomId, userName } = req.body

    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map([
            ['users', new Map()],
            // коллекция в коллекции для удобства добавления и удаления пользователей
            ['messages', []],
        ]))
    }
    // console.log(rooms.keys())
    res.send()

})

io.on('connection', socket => {
    // socket переменная каждого пользователя
    console.log('socket connected', socket.id)
})
// настройка сокета

server.listen(port, (err) => {
    if (err) {
        throw Error(err)
    }
    console.log('Server started on ' + port)
})
// запуск сервера