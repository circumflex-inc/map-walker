export const roomId = 'map'

export interface LatLng {
  latitude: number
  longitude: number
}

export const defaultLatLng: LatLng = {
  latitude: 35.685181,
  longitude: 139.729617
}

export const getCurrentPosition = (): Promise<LatLng> => {
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
