import { useState, useCallback, useRef } from 'react'
import { useJsApiLoader, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
// Treat the placeholder as "no key" so we don't spam Google's API with invalid requests
const HAS_VALID_KEY = Boolean(API_KEY) && API_KEY !== 'paste_my_key_here'

const MAP_OPTIONS = {
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  clickableIcons: false,
}

const CONTAINER_STYLE = { width: '100%', height: '320px' }

function MapOfflineFallback() {
  return (
    <div
      style={CONTAINER_STYLE}
      className="flex flex-col items-center justify-center gap-2 bg-stone-50 text-stone-400"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-stone-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        <line x1="2" y1="2" x2="22" y2="22" strokeLinecap="round" />
      </svg>
      <p className="text-sm text-stone-400">Map needs an internet connection</p>
    </div>
  )
}

function MapSkeleton() {
  return <div style={CONTAINER_STYLE} className="bg-stone-100 animate-pulse" />
}

function MapContent({ mappableStops }) {
  const [activeStop, setActiveStop] = useState(null)
  const mapRef = useRef(null)

  const onLoad = useCallback((map) => {
    mapRef.current = map
    if (mappableStops.length === 1) {
      map.setCenter({ lat: mappableStops[0].lat, lng: mappableStops[0].lng })
      map.setZoom(14)
    } else {
      const bounds = new window.google.maps.LatLngBounds()
      mappableStops.forEach((s) => bounds.extend({ lat: s.lat, lng: s.lng }))
      map.fitBounds(bounds, { top: 48, right: 48, bottom: 48, left: 48 })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <GoogleMap
      mapContainerStyle={CONTAINER_STYLE}
      onLoad={onLoad}
      options={MAP_OPTIONS}
    >
      {mappableStops.map((stop, i) => (
        <Marker
          key={i}
          position={{ lat: stop.lat, lng: stop.lng }}
          onClick={() => setActiveStop(stop === activeStop ? null : stop)}
        />
      ))}

      {activeStop && (
        <InfoWindow
          position={{ lat: activeStop.lat, lng: activeStop.lng }}
          options={{ pixelOffset: new window.google.maps.Size(0, -38) }}
          onCloseClick={() => setActiveStop(null)}
        >
          <div style={{ maxWidth: '200px', padding: '2px 4px' }}>
            <p style={{ fontWeight: 700, fontSize: 14, margin: '0 0 3px', color: '#1c1917' }}>
              {activeStop.name}
            </p>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#e11d48', margin: '0 0 4px' }}>
              {activeStop.time}
            </p>
            <p style={{ fontSize: 12, color: '#78716c', lineHeight: 1.4, margin: 0 }}>
              {activeStop.description}
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}

// Isolated component: only mounts (and calls the hook) when a real API key exists.
// This prevents invalid API calls and console errors when the key is missing or is a placeholder.
function GoogleMapLoader({ mappableStops }) {
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: API_KEY })

  if (loadError) return <MapOfflineFallback />
  if (!isLoaded) return <MapSkeleton />
  return <MapContent mappableStops={mappableStops} />
}

const WRAPPER_CLASS = 'mx-4 mb-6 rounded-2xl overflow-hidden border border-stone-100 shadow-sm'

export default function DayMap({ stops }) {
  const mappableStops = stops.filter((s) => s.lat != null && s.lng != null)
  if (mappableStops.length === 0) return null

  return (
    <div className={WRAPPER_CLASS}>
      {HAS_VALID_KEY ? (
        <GoogleMapLoader mappableStops={mappableStops} />
      ) : (
        <MapOfflineFallback />
      )}
    </div>
  )
}
