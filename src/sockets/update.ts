import { Server, Socket } from 'socket.io'
import { PositionParams } from '../types'

// Nodejsだから大丈夫だけどメモリ管理なので同時接続に弱い
// Golangとかだと排他ロックする必要がある
let list: PositionParams[] = []

const update = (io: Server, socket: Socket, params: PositionParams) => {
  if (!params.userId) return

  // 接続ルームに登録する
  socket.join(params.roomId)
  console.log('broadcast update', params)
  let isUpdate = false
  const l: PositionParams[] = []
  for (const row of list) {
    if (row.roomId === params.roomId && row.userId === params.userId) {
      // 更新対象なら取得したオブジェクトを使う
      l.push(params)
      isUpdate = true
    } else {
      // 更新対象じゃなければそのまま使う
      l.push(row)
    }
  }

  // 新規登録なら入れる
  if (!isUpdate) l.push(params)
  list = l

  // リストを接続ルームにいる全員にブロードキャストする
  io.to(params.roomId).emit('update', list)
}

export default update
