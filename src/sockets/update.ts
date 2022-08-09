import { Server, Socket } from 'socket.io'
import { PositionParams } from '../types'

const update = (io: Server, socket: Socket, params: PositionParams) => {
  console.log('update', params)
  io.to(params.roomId).emit('update', params)
}

export default update
