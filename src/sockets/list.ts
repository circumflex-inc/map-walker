import { PositionParams } from '../types'

// Nodejsだから大丈夫だけどメモリ管理なので同時接続に弱い
// Golangとかだと排他ロックする必要がある
// const list: PositionParams[] = []
// const uids: string[] = []
const hashMap = new Map<string, PositionParams>()

// export const update = (id: string, l: PositionParams[]) => {
//   list = l
//   hashMap.set(id, l)
// }
export const update = (id: string, param: PositionParams) => {
  hashMap.set(id, param)
}

export const get = () => { return [...hashMap.values()] }

export const getOne = (id: string) => { return hashMap.get(id) }

export const remove = (id: string) => {
  if (!hashMap.has(id)) return
  hashMap.delete(id)
}