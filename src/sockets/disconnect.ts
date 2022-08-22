import { Server, Socket } from 'socket.io'
import { get as getList, getOne, remove } from './list'

const disconnect = (io: Server, socket: Socket) => {

  console.log('disconnect', socket.id)

  const data = getOne(socket.id)
  if (!data) return

  // リストから削除
  remove(socket.id)

  // リストを接続ルームにいる全員にブロードキャストする
  io.to(data.roomId).emit('update', getList())
}

export default disconnect
