import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/index.module.css'
import useIndexState, { LatLng } from '../services'
import { useEffect } from 'react'

const Index: NextPage = () => {
  const {
    positionState,
    setPositionState
  } = useIndexState()

  useEffect(() => {
    // TODO: map制御

    // 十字ボタン制御
    const keyDownEvent = (e: KeyboardEvent) => {
      console.log('keyDownEvent', e.key)
      switch (e.key) {
      case 'Up':
      case 'ArrowUp':
        setPositionState({
          latitude: positionState.latitude + 1,
          longitude: positionState.longitude
        } as LatLng)
        break
      case 'Down':
      case 'ArrowDown':
        setPositionState({
          latitude: positionState.latitude - 1,
          longitude: positionState.longitude
        } as LatLng)
        break
      case 'Left':
      case 'ArrowLeft':
        setPositionState({
          latitude: positionState.latitude,
          longitude: positionState.longitude + 1
        } as LatLng)
        break
      case 'Right':
      case 'ArrowRight':
        setPositionState({
          latitude: positionState.latitude,
          longitude: positionState.longitude - 1
        } as LatLng)
        break
      }
    }
    document.addEventListener('keydown', keyDownEvent)
    return () => {
      document.removeEventListener('keydown', keyDownEvent)
    }
  }, [positionState, setPositionState])

  return (
    <div className={styles.container}>
      <Head>
        <title>Map Walker</title>
        <meta name="description" content="Map Walker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <div>{positionState.latitude}</div>
        <div>{positionState.longitude}</div>
        <div className={styles.map}></div>

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
