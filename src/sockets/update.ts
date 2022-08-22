import { Server, Socket } from 'socket.io'
import { PositionParams } from '../types'
import { update as updateList, get as getList } from './list'

const update = (io: Server, socket: Socket, params: PositionParams) => {
  if (!params.userId) return

  // 接続ルームに登録する
  socket.join(params.roomId)
  console.log('broadcast update', params, socket.id)

  // 新規登録なら入れる
  updateList(socket.id, params)


  // リストを接続ルームにいる全員にブロードキャストする
  io.to(params.roomId).emit('update', getList())
}

export default update
