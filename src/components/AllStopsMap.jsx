import { useState, useCallback, useRef } from 'react'
import { useJsApiLoader, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
const HAS_VALID_KEY = Boolean(API_KEY) && API_KEY !== 'paste_my_key_here'

export const DAY_COLORS = ['#e11d48', '#f59e0b', '#10b981', '#6366f1', '#f97316']

const MAP_OPTIONS = {
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  clickableIcons: false,
}

function MapFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-stone-100 text-stone-400">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        <line x1="2" y1="2" x2="22" y2="22" strokeLinecap="round" />
      </svg>
      <p className="text-sm font-medium">Map needs an internet connection</p>
    </div>
  )
}

function AllStopsContent({ stops }) {
  const [activeStop, setActiveStop] = useState(null)
  const mapRef = useRef(null)

  const onLoad = useCallback((map) => {
    mapRef.current = map
    if (stops.length === 1) {
      map.setCenter({ lat: stops[0].lat, lng: stops[0].lng })
      map.setZoom(14)
    } else {
      const bounds = new window.google.maps.LatLngBounds()
      stops.forEach((s) => bounds.extend({ lat: s.lat, lng: s.lng }))
      map.fitBounds(bounds, { top: 60, right: 40, bottom: 80, left: 40 })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      onLoad={onLoad}
      options={MAP_OPTIONS}
    >
      {stops.map((stop, i) => {
        const color = DAY_COLORS[(stop.dayNumber - 1) % DAY_COLORS.length]
        return (
          <Marker
            key={i}
            position={{ lat: stop.lat, lng: stop.lng }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 14,
              fillColor: color,
              fillOpacity: 1,
              strokeColor: 'white',
              strokeWeight: 2,
            }}
            label={{
              text: String(stop.dayNumber),
              color: 'white',
              fontSize: '11px',
              fontWeight: '700',
            }}
            onClick={() => setActiveStop(stop === activeStop ? null : stop)}
          />
        )
      })}

      {activeStop && (
        <InfoWindow
          position={{ lat: activeStop.lat, lng: activeStop.lng }}
          options={{ pixelOffset: new window.google.maps.Size(0, -36) }}
          onCloseClick={() => setActiveStop(null)}
        >
          <div style={{ maxWidth: 200, padding: '4px 2px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: DAY_COLORS[(activeStop.dayNumber - 1) % DAY_COLORS.length], marginBottom: 3 }}>
              Day {activeStop.dayNumber} · {activeStop.dayTitle}
            </p>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#1c1917', margin: '0 0 2px' }}>
              {activeStop.name}
            </p>
            <p style={{ fontSize: 11, color: '#78716c', margin: 0 }}>{activeStop.time}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}

function AllStopsLoader({ stops }) {
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: API_KEY })
  if (loadError) return <MapFallback />
  if (!isLoaded) return <div className="w-full h-full bg-stone-100 animate-pulse" />
  return <AllStopsContent stops={stops} />
}

export default function AllStopsMap({ allDays }) {
  const stops = allDays.flatMap((day) =>
    day.stops
      .filter((s) => s.lat != null && s.lng != null)
      .map((s) => ({ ...s, dayNumber: day.day, dayTitle: day.title }))
  )

  if (stops.length === 0) return <MapFallback />

  return (
    <div className="w-full h-full">
      {HAS_VALID_KEY ? <AllStopsLoader stops={stops} /> : <MapFallback />}
    </div>
  )
}
