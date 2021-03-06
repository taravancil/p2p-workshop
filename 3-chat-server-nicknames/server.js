'use strict'
const jsonStream = require('duplex-json-stream')
const net = require('net')
const streamSet = require('stream-set')

const activeSockets = streamSet()

const server = net.createServer((socket) => {
  socket = jsonStream(socket)
  activeSockets.add(socket)
  showActiveConnections()

  socket.on('end', () => {
    activeSockets.remove(socket)
    showActiveConnections()
  })

  socket.on('data', (data) => {
    broadcast(data, socket)
  })
})

const broadcast = (data, sender) => {
  activeSockets.forEach((client) => {
    if (client === sender) return

    client.write({nickname: data.nickname, message: data.message})
  })
}

const showActiveConnections = () => {
  console.log(`${activeSockets.size} active connections`)
}

server.listen(3000, () => {
  console.log('server listening on port 3000')
})
