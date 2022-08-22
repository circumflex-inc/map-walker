import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/index.module.css'
import { LatLng, defaultLatLng, roomId, getCurrentPosition } from '../services'
import { useState, useEffect, useCallback, ChangeEvent } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoBox } from '@react-google-maps/api'
import io from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'
import { PositionParams } from '../types'
import Image from 'next/image'

const Index: NextPage = () => {
  const [socket] = useState(() => io('ws://localhost:3000'))
  const [userId, setUserId] = useState<string>('')
  const [positionState, setPositionState] = useState<LatLng>(defaultLatLng)
  const [positionListState, setPositionListState] = useState<PositionParams[]>([])

  // Websocket接続を要求
  socket.on('connect', () => {
    setUserId(uuidv4())

    // だれかのupdateを受け取る
    socket.on('update', (param: PositionParams[]) => {
      setPositionListState(param)
    })

    // サーバに最初の位置情報を伝える
    socket.emit('update', {
      ...positionState,
      roomId,
      userId,
      username: nameText
    } as PositionParams)
  })

  // コネクションが切れた時
  socket.on('disconnect', (reason) => {
    console.log('disconnect')
    if (reason === 'io server disconnect') {
      // 再接続を要求する
      socket.connect()
    }
  })

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY as string
  })
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [openInfo, setOpenInfo] = useState<boolean>(false)
  const [zoom, setZoom] = useState<number>(12)
  const [nameText, setNameText] = useState<string>('')

  useEffect(() => {
    if (!socket.connected) return
    socket.emit('update', {
      ...positionState,
      roomId,
      userId,
      username: nameText
    } as PositionParams)
  }, [socket, positionState, userId, nameText])

  // 一回だけ実行
  useEffect(() => {
    getCurrentPosition().then(position => {
      setPositionState(position)
      map?.setCenter(makeLatLng(position))
    })
  }, [])

  useEffect(() => {
    // 十字ボタン制御
    const keyDownEvent = (e: KeyboardEvent) => {
      console.log('keyDownEvent', e.key)
      switch (e.key) {
      case 'Up':
      case 'ArrowUp':
        setPositionState({
          latitude: positionState.latitude + 0.001,
          longitude: positionState.longitude
        } as LatLng)
        e.preventDefault()
        break
      case 'Down':
      case 'ArrowDown':
        setPositionState({
          latitude: positionState.latitude - 0.001,
          longitude: positionState.longitude
        } as LatLng)
        e.preventDefault()
        break
      case 'Left':
      case 'ArrowLeft':
        setPositionState({
          latitude: positionState.latitude,
          longitude: positionState.longitude - 0.001
        } as LatLng)
        e.preventDefault()
        break
      case 'Right':
      case 'ArrowRight':
        setPositionState({
          latitude: positionState.latitude,
          longitude: positionState.longitude + 0.001
        } as LatLng)
        e.preventDefault()
        break
      }
    }
    document.addEventListener('keydown', keyDownEvent)
    return () => {
      document.removeEventListener('keydown', keyDownEvent)
    }

  }, [positionState])

  const onLoad = useCallback((m: google.maps.Map) => {
    setMap(m)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const makeLatLng = (latLng: LatLng) => {
    return new window.google.maps.LatLng(latLng.latitude, latLng.longitude)
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNameText(e.currentTarget.value)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Map Walker</title>
        <meta name="description" content="Map Walker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <div className={styles.head}>
          <h1 className={styles.title}>
            <a href="http://localhost:3000/">
              <Image src={'/clear-walker.png'} alt="" width={30} height={30} />
              <span style={{
                position: 'relative',
                top: '-5px'
              }}>Map Walker</span>
            </a>
          </h1>
          <div className={styles.nameWrapper}>
            <input className={styles.nameInput} type="text" value={nameText} onChange={handleNameChange} placeholder='名前' />
          </div>
        </div>
        <div className={styles.map}>
          {isLoaded &&
            <GoogleMap
              mapContainerStyle={{
                width: '100%',
                height: '400px'
              }}
              center={makeLatLng(defaultLatLng)}
              zoom={zoom}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              <>
                {positionListState?.map(row => {
                  // console.log('row', row)
                  return (
                    <Marker
                      key={row.userId}
                      position={makeLatLng(row)}
                      animation={google.maps.Animation.DROP}
                      icon={{
                        url: 'clear-walker.png',
                        scaledSize: new google.maps.Size(40, 40)
                      }}
                      onClick={() => setOpenInfo(!openInfo)}>
                      {openInfo && row.username &&
                        <InfoBox onCloseClick={() => setOpenInfo(!openInfo)} options={{
                          closeBoxURL: '',
                          enableEventPropagation: true
                        }}>
                          <div style={{
                            backgroundColor: '#fff',
                            padding: '10px',
                            borderRadius: '5px',
                            fontSize: 12
                          }}>{row.username}</div>
                        </InfoBox>
                      }
                    </Marker>
                  )
                })
                }
              </>
            </GoogleMap>
          }
        </div>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/circumflex-inc/map-walker"
          target="_blank"
          rel="noopener noreferrer"
        >
          &copy; kitadesign
        </a>
      </footer>
    </div>
  )
}

export default Index
