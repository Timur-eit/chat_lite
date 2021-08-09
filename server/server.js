const express = require('express')
const socket = require('socket.io')
const cors = require('cors')
const {v1} = require('uuid')

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

app.get('/rooms/:roomId', (req, res) => {
    // console.log(req.params) // ! not query
    // query = /?somedata=somedata
    const { roomId } = req.params
    
    const obj = rooms.has(roomId) ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()],
    } : { users: [], messages: [] }

    if(!obj.users.length) {
        res.status(400).send('room doesn`t exist')
    } else {
        res.json(obj)
    }


    // получаем списков всех комнат
})
// setup web application

app.post('/rooms', (req, res) => {
    // console.log(req.body)
    const { userName } = req.body
    const roomId = v1()
    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map([
            ['users', new Map()],
            // коллекция в коллекции для удобства добавления и удаления пользователей
            ['messages', []],
        ]))
    }
    // console.log(rooms.keys())
    res.send(roomId)
})

io.on('connection', socket => {
    // socket переменная каждого пользователя
    socket.on('ROOM_JOIN', ( {roomId, userName} ) => {
        try{
            // console.log(data)
            socket.join(roomId)
            // подключение сокета к конкретной room
            // отправка событий в конкретную комнату - не для всех юзеров во всех комнатах

            rooms.get(roomId).get('users').set(socket.id, userName)
            // работа с БД - добавили нового юзера

            // теперь надо оповестить всех юзеров комнаты
            const users = [...rooms.get(roomId).get('users').values()]
            // просто socket.emit (без socket.to...) не подходит - emit отправит ответ ВСЕМ пользователям сокета
            socket.broadcast.to(roomId).emit('ROOM_SET_USERS', users) // передача ответа всем users комнаты
            // socket.to(roomId).emit('ROOM_JOINED', users) // передача ответа всем users комнаты
            // broadcast - всем кроме меня
        } catch (err) {
            socket.broadcast.to(roomId).emit('SERVER_ROOM_ERROR', err.message)
        }
    })
    
    socket.on('ROOM_NEW_MESSAGE', ( {roomId, userName, text } ) => {
        const date = new Date()

        const obj = { userName, text, date }
        
        rooms.get(roomId).get('messages').push(obj)
        // работа с БД - добавили нового юзера

        socket.broadcast.to(roomId).emit('ROOM_NEW_MESSAGE', obj) // передача ответа всем users комнаты
        // socket.broadcast.to(roomId).emit('ROOM_NEW_MESSAGE', obj) // передача ответа всем users комнаты
    })

    socket.on('disconnect', () => {
        rooms.forEach((value, roomId) => { // Map - псевдомассив, можно применить forEach
            if (value.get('users').delete(socket.id)) { // delete returns boolean
                const users = [...rooms.get(roomId).get('users').values()]
                socket.broadcast.to(roomId).emit('ROOM_SET_USERS', users) // передача ответа всем users комнаты
            }
        })
    })

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
        socket.emit('SERVER_CONNECTION_ERROR', err.message)
    });

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