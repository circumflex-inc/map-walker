import { Server, createServer } from "http"
import next, { NextApiHandler, NextApiRequest } from "next"
import { Server as socketioServer, Socket } from "socket.io"
import express, { Express } from "express"
import entry from '../sockets/entry'
import update from "../sockets/update"

const port = parseInt(process.env.PORT || "3000", 10)
const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle: NextApiHandler = app.getRequestHandler()

console.log('Prepare server')
await app.prepare()
console.log('Prepared server')
const expressApp: Express = express()
const server: Server = createServer(expressApp)
const io: socketioServer = new socketioServer()

io.attach(server)

io.on("connection", (socket: Socket) => {
  socket.on("entry", roomId => entry(io, socket, roomId))
  socket.on("update", data => update(io, socket, data))
})

expressApp.all("*", (req: NextApiRequest, res: any) => handle(req, res))
server.listen(port)
console.info(`Listen: http://localhost:${port}/`)
