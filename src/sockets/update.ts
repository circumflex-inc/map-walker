import { Server, Socket } from "socket.io"
import { UpdateParams } from '../types'

const update = (io: Server, socket: Socket, params: UpdateParams) => {
  io.to(params.roomId).emit("update", params)
}

export default update
