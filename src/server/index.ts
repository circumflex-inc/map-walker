import { Server, createServer } from "http"
import next, { NextApiHandler, NextApiRequest } from "next"
import { Server as socketioServer, Socket } from "socket.io"
import express, { Express, Request, Response } from "express"
import { v4 as uuidv4 } from 'uuid'

const port = parseInt(process.env.PORT || "3000", 10)
const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle: NextApiHandler = app.getRequestHandler()

await app.prepare()
console.log('Prepare server')
const expressApp: Express = express()
const server: Server = createServer(expressApp)
const io: socketioServer = new socketioServer()

io.attach(server)

expressApp.get("/socket", async (_: Request, res: Response) => {
  res.send("hello world")
})

io.on("connection", (socket: Socket) => {
  socket.on("entry", (roomId) => {
    socket.join(roomId)
    console.log("joined room!")
  })
  socket.on("update", (data) => {
    io.to(data.roomId).emit("update", {
      message: data.message,
      username: data.username,
      id: `${data.username}-${uuidv4()}`
    })
  })
})

expressApp.all("*", (req: NextApiRequest, res: any) => handle(req, res))
server.listen(port)
console.info(`Listen: http://localhost:${port}/`)
