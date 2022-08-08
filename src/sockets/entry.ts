import { Server, Socket } from "socket.io"
import { v4 as uuidv4 } from 'uuid'
import { EntryParams } from '../types'

const entry = (io: Server, socket: Socket, roomId: string) => {
  socket.join(roomId)
  console.log("joined room!")
  io.to(roomId).emit("update", {
    message: 'entry',
    userId: `${uuidv4()}`
  } as EntryParams)
}

export default entry
