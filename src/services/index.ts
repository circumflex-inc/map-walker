import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import { PositionParams } from '../types'
import { v4 as uuidv4 } from 'uuid'

const roomId = 'map'

export interface LatLng {
  latitude: number
  longitude: number
}

const defaultLatLng: LatLng = {
  latitude: 35.685181,
  longitude: 139.729617
}

const getCurrentPosition = (): Promise<LatLng> => {
  return new Promise<LatLng>((resolve, reject) => {
    if (!('geolocation' in navigator)) { reject() }
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      resolve({
        latitude,
        longitude
      })
    })
  })
}

const useIndexState = () => {
  const [positionState, setPositionState] = useState<LatLng>(defaultLatLng)
  const [socket] = useState(() => io('ws://localhost:3000'))

  const [positionList, setPositionListState] = useState<PositionParams[]>([])
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    socket.on('update', (param: PositionParams) => {
      let isUpdate = false
      const list: PositionParams[] = []
      for (const row of positionList) {
        if (row.roomId === param.roomId && row.userId === param.userId) {
          list.push(param)
          isUpdate = true
        } else {
          list.push(row)
        }
      }
      if (!isUpdate) {
        list.push(param)
      }

      setPositionListState(list)
    })
    socket.on('connect', () => {
      setUserId(uuidv4())
      socket.emit('update', {
        ...positionState,
        roomId,
        userId
      } as PositionParams)
    })
    socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        socket.connect()
      }
    })

    getCurrentPosition()
      .then(position => setPositionState(position))
      .catch(() => console.log('setPositionState.catch'))

    return () => {
      socket.off('entry')
      socket.off('update')
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [])

  useEffect(() => {
    socket.emit('update', {
      ...positionState,
      roomId,
      userId
    } as PositionParams)
  }, [socket, positionState])

  return {
    positionState,
    setPositionState
  }
}

export default useIndexState
