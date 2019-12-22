const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const PORT = process.env.PORT || 5000
const router = require('./router')
const {addUser, removeUser, getUser, getUserInRoom} = require('./users')
const cors = require('cors');
const app = express()
const server = http.createServer(app)
const io = socketio(server, {path:'https://cors-anywhere.herokuapp.com/'})
io.set('origins', '127.0.0.1:3000')

io.on('connection', (socket) => {
    socket.on('join', ({name, room}, callback) => {
        const {error, user} = addUser({id: socket.id, name, room})
        if(error) return callback(error)

        socket.emit('message', {user: 'admin', text: `${user.name}, Welcome to the room ${user.room}`})
        socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name} has joined..`})
        socket.join(user.room)
        io.to(user.room).emit('roomdata', {room: users.room, user: getUserInRoom(user.room)})
        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', {user: user.name, text: message})
        io.to(user.room).emit('roomData', {room: user.room, text: message})


        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
          }
        
    })
})
app.use(router)

server.listen(PORT, () => console.log(`Server is Running on port ${PORT}`))