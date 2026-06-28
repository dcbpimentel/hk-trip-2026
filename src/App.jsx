import { useState } from 'react'
import { itinerary, HOTEL } from './data/itinerary'
import DayMap from './components/DayMap'
import AllStopsMap, { DAY_COLORS } from './components/AllStopsMap'

// ─── Gallery helpers ───────────────────────────────────────────────────────────

function getGalleryPhotos(stop) {
  return [...(stop.photos || []), ...(stop.galleryPhotos || [])]
}

// ─── Trip status ───────────────────────────────────────────────────────────────

function getTripStatus() {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const start = new Date(2026, 5, 29) // June 29
  const end   = new Date(2026, 6, 3)  // July 3
  const daysUntil = Math.round((start - today) / 86400000)
  if (daysUntil > 1)  return { label: `${daysUntil} days to go`, emoji: '✈️', variant: 'stone' }
  if (daysUntil === 1) return { label: 'Tomorrow!',               emoji: '🎉', variant: 'amber' }
  if (daysUntil === 0) return { label: 'Trip starts today!',      emoji: '🚀', variant: 'rose' }
  if (today <= end)    return { label: 'Trip is on! 🇭🇰',         emoji: '',   variant: 'rose' }
  return { label: 'Trip complete', emoji: '🏠', variant: 'stone' }
}

function getDayStatus(day) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const parts = day.date.split(', ')
  const dayDate = new Date(`${parts[1]}, ${parts[2]}`)
  const diff = Math.round((dayDate - today) / 86400000)
  if (diff === 0) return 'today'
  if (diff === 1) return 'tomorrow'
  if (diff < 0)   return 'past'
  return null
}

// ─── Icons ─────────────────────────────────────────────────────────────────────

const ExternalLinkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const NavigationIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
)

const ClockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)

const SpinnerIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="animate-spin">
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
)

const MapRouteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    <path d="M8 21v-2M16 21v-2M9 11l3 3 3-3" />
  </svg>
)

const ChevronLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const CameraIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zm-11-3a4 4 0 100-8 4 4 0 000 8zm0-2a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
)

const ItineraryTabIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const MapTabIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const DocsTabIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
)

const PdfIcon = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)

const ArrowUpRightIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
)

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

// ─── Maps helpers ──────────────────────────────────────────────────────────────

function getMapsUrl(stop) {
  if (stop.lat != null && stop.lng != null) return `https://www.google.com/maps?q=${stop.lat},${stop.lng}`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.name + ', Hong Kong')}`
}

function handleGetDirections(stop, setLocating) {
  const destCoords  = stop.lat != null ? `${stop.lat},${stop.lng}` : null
  const destEncoded = destCoords ?? encodeURIComponent(stop.name + ', Hong Kong')
  const fallback    = `https://www.google.com/maps/dir//${destEncoded}`
  if (!navigator.geolocation) { window.open(fallback, '_blank', 'noopener'); return }
  setLocating(true)
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      setLocating(false)
      window.open(`https://www.google.com/maps/dir/${coords.latitude},${coords.longitude}/${destEncoded}`, '_blank', 'noopener')
    },
    () => { setLocating(false); window.open(fallback, '_blank', 'noopener') },
    { timeout: 8000, maximumAge: 30000 }
  )
}

function shortDate(dateStr) {
  const parts = dateStr.split(', ')[1]?.split(' ') ?? []
  return parts.slice(0, 2).join(' ')
}

// ─── Photo Gallery ─────────────────────────────────────────────────────────────

function GalleryPhoto({ src, alt, onLoad, hero }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  if (hero) {
    return (
      <img
        src={src} alt={alt} loading="lazy" decoding="async"
        onLoad={onLoad} onError={() => setFailed(true)}
        style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }}
      />
    )
  }
  return (
    <div style={{ breakInside: 'avoid', marginBottom: 3, borderRadius: 10, overflow: 'hidden' }}>
      <img
        src={src} alt={alt} loading="lazy" decoding="async"
        onLoad={onLoad} onError={() => setFailed(true)}
        style={{ width: '100%', display: 'block' }}
      />
    </div>
  )
}

function PhotoGalleryModal({ stop, onClose }) {
  const photos = getGalleryPhotos(stop)
  const [loadedCount, setLoadedCount] = useState(0)
  const inc = () => setLoadedCount(n => n + 1)
  const [hero, ...rest] = photos

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        background: '#080808',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        animation: 'slideUpFull 0.32s cubic-bezier(0.32, 0.72, 0, 1) both',
      }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center gap-3 px-4"
        style={{
          paddingTop: 'max(16px, env(safe-area-inset-top))',
          paddingBottom: 14,
          background: 'linear-gradient(to bottom, rgba(8,8,8,1) 60%, rgba(8,8,8,0))',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white transition-opacity active:opacity-60"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
          aria-label="Back"
        >
          <ChevronLeftIcon />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="text-white font-bold text-[15px] leading-snug truncate">{stop.name}</h2>
          <p className="text-[11px] font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {loadedCount > 0 ? `${loadedCount} photo${loadedCount !== 1 ? 's' : ''}` : 'Loading…'}
          </p>
        </div>
      </div>

      {/* Scrollable gallery */}
      <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {photos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
            No photos available
          </div>
        ) : (
          <>
            {/* Hero — full-width cinematic */}
            {hero && <GalleryPhoto hero src={hero} alt={`${stop.name} hero`} onLoad={inc} />}

            {/* Masonry grid for remaining photos */}
            {rest.length > 0 && (
              <div
                style={{
                  columns: 2,
                  columnGap: 3,
                  padding: '3px 3px',
                  paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
                }}
              >
                {rest.map((url, i) => (
                  <GalleryPhoto key={i} src={url} alt={`${stop.name} ${i + 2}`} onLoad={inc} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ─── Day Tabs ──────────────────────────────────────────────────────────────────

function DayTabs({ days, activeDay, onSelect }) {
  return (
    <div
      className="flex gap-2 px-4 py-3 overflow-x-auto"
      style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
    >
      {days.map((day) => {
        const isActive  = day.day === activeDay
        const dayStatus = getDayStatus(day)
        return (
          <button
            key={day.day}
            onClick={() => onSelect(day.day)}
            className={[
              'flex-shrink-0 flex flex-col items-center justify-center px-4 rounded-2xl min-w-[64px] min-h-[56px] transition-all duration-200 select-none relative',
              isActive
                ? 'text-white'
                : dayStatus === 'past'
                ? 'bg-stone-100 text-stone-400 border border-stone-200'
                : 'bg-white text-stone-500 border border-stone-200 active:bg-stone-50',
            ].join(' ')}
            style={isActive ? {
              background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
              boxShadow: '0 6px 20px rgba(225, 29, 72, 0.35)',
            } : {}}
          >
            {/* Status micro-label */}
            {dayStatus === 'today' && (
              <span className={`text-[8px] font-black uppercase tracking-wider mb-0.5 ${isActive ? 'text-rose-200' : 'text-rose-400'}`}>TODAY</span>
            )}
            {dayStatus === 'tomorrow' && (
              <span className={`text-[8px] font-black uppercase tracking-wider mb-0.5 ${isActive ? 'text-rose-100' : 'text-amber-400'}`}>TMRW</span>
            )}
            {dayStatus === 'past' && !isActive && (
              <span className="text-[8px] text-stone-400 mb-0.5"><CheckIcon /></span>
            )}

            <span className="text-[11px] font-bold tracking-wide">Day {day.day}</span>
            <span className={['text-[10px] font-medium mt-0.5', isActive ? 'text-rose-100' : 'text-stone-400'].join(' ')}>
              {shortDate(day.date)}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Hotel Banner (shown on days 2-5 as persistent home-base reminder) ─────────

function HotelBanner() {
  return (
    <div
      className="mx-5 mb-1 flex items-center gap-3 px-3.5 py-3 rounded-2xl"
      style={{
        background: 'rgba(99,102,241,0.06)',
        border: '1px solid rgba(99,102,241,0.15)',
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, #818cf8, #6366f1)',
          boxShadow: '0 3px 10px rgba(99,102,241,0.35)',
        }}
      >
        🏨
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-0.5">Your Hotel</p>
        <p className="text-[13px] font-bold text-stone-800 truncate">{HOTEL.shortName}</p>
        <p className="text-[11px] text-stone-400 truncate">{HOTEL.address}</p>
      </div>
      <a
        href={HOTEL.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-[11px] font-bold active:opacity-75 transition-opacity"
        style={{
          background: 'linear-gradient(135deg, #818cf8, #6366f1)',
          boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
        }}
      >
        <NavigationIcon />
        Navigate
      </a>
    </div>
  )
}

// ─── TBA Banner ────────────────────────────────────────────────────────────────

function TBABanner() {
  return (
    <div className="flex items-center gap-3 px-4 py-4" style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', borderBottom: '1px solid #fde68a' }}>
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl" style={{ background: 'rgba(245,158,11,0.15)' }}>
        🕐
      </div>
      <div>
        <p className="text-sm font-bold text-amber-800">Details coming soon</p>
        <p className="text-xs text-amber-500 mt-0.5">This stop is still being planned</p>
      </div>
    </div>
  )
}

// ─── Stop Card ─────────────────────────────────────────────────────────────────

function StopCard({ stop, stopNumber, isLast, onPhotoClick }) {
  const [isLocating, setIsLocating] = useState(false)
  const hasPhoto  = stop.photos?.length > 0
  const hasCoords = stop.lat != null && stop.lng != null

  return (
    <div className="flex gap-3">
      {/* Timeline */}
      <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
        <div
          className="w-7 h-7 rounded-full text-white text-[11px] font-black flex items-center justify-center z-10 flex-shrink-0"
          style={stop.isHotel ? {
            background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
            boxShadow: '0 3px 10px rgba(99,102,241,0.4)',
            fontSize: 14,
          } : {
            background: 'linear-gradient(135deg, #fb7185 0%, #e11d48 100%)',
            boxShadow: '0 3px 10px rgba(225, 29, 72, 0.4)',
          }}
        >
          {stop.isHotel ? '🏨' : stopNumber}
        </div>
        {!isLast && (
          <div
            className="w-px flex-1 mt-2"
            style={{ background: stop.isHotel ? 'linear-gradient(to bottom, #a5b4fc, transparent)' : 'linear-gradient(to bottom, #fda4af, transparent)' }}
          />
        )}
      </div>

      {/* Content */}
      <div className={['flex-1 min-w-0', isLast ? 'pb-2' : 'pb-7'].join(' ')}>
        {/* Time chip */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-rose-400"><ClockIcon /></span>
          <span className="text-[11px] font-bold text-stone-400 tracking-wide">{stop.time}</span>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)' }}
        >
          {/* Photo — 16:9 cinematic with gradient + glassmorphism badge */}
          {hasPhoto && (
            <button
              onClick={onPhotoClick}
              className="relative w-full block overflow-hidden"
              aria-label={`View photos of ${stop.name}`}
            >
              <img
                src={stop.photos[0]}
                alt={stop.name}
                loading="lazy"
                decoding="async"
                className="w-full object-cover"
                style={{ aspectRatio: '16/9' }}
              />
              {/* Bottom gradient overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)' }}
              />
              {/* Glassmorphism badge */}
              <div
                className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-white"
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                <CameraIcon />
                <span className="text-[10px] font-bold tracking-wide">View photos</span>
              </div>
            </button>
          )}

          {/* TBA banner */}
          {stop.isTBA && <TBABanner />}

          {/* Text content */}
          <div className="px-4 pt-3.5 pb-3">
            {stop.isHotel && (
              <div
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-2"
                style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}
              >
                Your Hotel · All 5 Nights
              </div>
            )}
            <h3 className="font-extrabold text-stone-900 text-[15px] leading-snug">{stop.name}</h3>
            <p className="text-[12.5px] text-stone-500 mt-1.5 leading-relaxed">{stop.description}</p>
          </div>

          {/* Action buttons */}
          {!stop.isTBA && (
            <>
              <div className="mx-4 h-px bg-stone-100" />
              <div className="flex gap-2 p-3">
                <a
                  href={getMapsUrl(stop)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 min-h-[40px] rounded-xl text-[12px] font-semibold text-stone-600 active:opacity-70 transition-opacity"
                  style={{ background: '#f5f5f4', border: '1px solid #e7e5e4' }}
                >
                  <ExternalLinkIcon />
                  Open in Maps
                </a>
                {hasCoords && (
                  <button
                    onClick={() => handleGetDirections(stop, setIsLocating)}
                    disabled={isLocating}
                    className="flex-1 flex items-center justify-center gap-1.5 min-h-[40px] rounded-xl text-white text-[12px] font-semibold active:opacity-80 transition-opacity disabled:opacity-50"
                    style={stop.isHotel ? {
                      background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
                      boxShadow: '0 3px 12px rgba(99,102,241,0.35)',
                    } : {
                      background: 'linear-gradient(135deg, #fb7185 0%, #e11d48 100%)',
                      boxShadow: '0 3px 12px rgba(225,29,72,0.35)',
                    }}
                  >
                    {isLocating ? <><SpinnerIcon />Locating…</> : <><NavigationIcon />Get Directions</>}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Day View ──────────────────────────────────────────────────────────────────

function DayView({ day, onPhotoClick }) {
  const hasHotelStop   = day.stops.some(s => s.isHotel)
  const confirmedStops = day.stops.filter(s => !s.isTBA).length

  return (
    <div style={{ animation: 'fadeSlideUp 0.32s ease both' }}>
      {/* Hotel home-base banner on days where hotel isn't a timeline stop */}
      {!hasHotelStop && <div className="pt-4"><HotelBanner /></div>}

      {/* Day hero band */}
      <div
        className="px-5 pt-5 pb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(to bottom, rgba(255,241,242,0.9) 0%, rgba(250,248,245,0) 100%)' }}
      >
        <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.22em] mb-2">{day.date}</p>
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-2xl font-black text-stone-900 leading-tight flex-1">{day.title}</h2>
          {confirmedStops > 0 && (
            <div
              className="flex-shrink-0 mt-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-rose-500"
              style={{ background: 'rgba(225,29,72,0.08)', border: '1px solid rgba(225,29,72,0.15)' }}
            >
              {confirmedStops} stop{confirmedStops !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="px-5 pb-4">
        {day.stops.map((stop, i) => (
          <StopCard
            key={i}
            stop={stop}
            stopNumber={i + 1}
            isLast={i === day.stops.length - 1}
            onPhotoClick={stop.photos?.length ? () => onPhotoClick(stop) : undefined}
          />
        ))}
      </div>

      {/* Map section */}
      {day.stops.some(s => s.lat != null) && (
        <div className="pb-8">
          <div className="flex items-center gap-2 px-5 mb-3">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(225,29,72,0.07)', border: '1px solid rgba(225,29,72,0.12)' }}
            >
              <span className="text-rose-400"><MapRouteIcon /></span>
              <span className="text-[11px] font-bold text-rose-500 uppercase tracking-[0.14em]">Today's Route</span>
            </div>
          </div>
          <DayMap stops={day.stops} />
        </div>
      )}
    </div>
  )
}

// ─── Documents Page ────────────────────────────────────────────────────────────

const DOCS = [
  {
    id: 'hotel',
    emoji: '🏨',
    label: 'Hotel',
    color: '#6366f1',
    files: [
      { name: 'Booking Confirmation', url: '/docs/hotel-confirmation.pdf' },
      { name: 'Receipt', url: '/docs/hotel-receipt.pdf' },
    ],
  },
  {
    id: 'disneyland',
    emoji: '🎢',
    label: 'Disneyland',
    color: '#e11d48',
    files: [
      { name: 'Booking Confirmation', url: '/docs/disneyland-confirmation.pdf' },
      { name: 'Ticket · Person 1', url: '/docs/disneyland-ticket-1.pdf' },
      { name: 'Ticket · Person 2', url: '/docs/disneyland-ticket-2.pdf' },
      { name: 'Ticket · Person 3', url: '/docs/disneyland-ticket-3.pdf' },
    ],
  },
  {
    id: 'turbojet',
    emoji: '⛴️',
    label: 'Turbojet (Macau Ferry)',
    color: '#0ea5e9',
    files: [
      { name: 'Ticket · Person 1', url: '/docs/turbojet-1.pdf' },
      { name: 'Ticket · Person 2', url: '/docs/turbojet-2.pdf' },
    ],
  },
  {
    id: 'ngong-ping',
    emoji: '🚡',
    label: 'Ngong Ping 360',
    color: '#10b981',
    files: [
      { name: 'Cable Car Ticket', url: '/docs/ngong-ping.pdf' },
    ],
  },
  {
    id: 'harbor-cruise',
    emoji: '🚢',
    label: 'Harbor Cruise',
    color: '#f59e0b',
    files: [
      { name: 'Cruise Ticket', url: '/docs/harbor-cruise.pdf' },
    ],
  },
  {
    id: 'peak-tram',
    emoji: '🚋',
    label: 'Peak Tram',
    color: '#8b5cf6',
    files: [
      { name: 'E-Ticket · 1', url: '/docs/ticket-1.pdf' },
      { name: 'E-Ticket · 2', url: '/docs/ticket-2.pdf' },
      { name: 'Receipt', url: '/docs/ticket-receipt.pdf' },
    ],
  },
  {
    id: 'octopus',
    emoji: '🐙',
    label: 'Octopus Card',
    color: '#f97316',
    files: [
      { name: 'Octopus Card Voucher', url: '/docs/octopus-card.pdf' },
    ],
  },
  {
    id: 'itinerary',
    emoji: '📋',
    label: 'Full Itinerary',
    color: '#64748b',
    files: [
      { name: 'Hong Kong Itinerary PDF', url: '/docs/itinerary.pdf' },
    ],
  },
]

function DocCategory({ cat }) {
  const [open, setOpen] = useState(true)
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)' }}
    >
      {/* Category header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-stone-50 transition-colors text-left"
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: `${cat.color}18` }}
        >
          {cat.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-extrabold text-stone-800">{cat.label}</p>
          <p className="text-[11px] text-stone-400">{cat.files.length} document{cat.files.length !== 1 ? 's' : ''}</p>
        </div>
        <div
          className="text-stone-400 transition-transform duration-200"
          style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* File list */}
      {open && (
        <div style={{ borderTop: '1px solid #f5f5f4' }}>
          {cat.files.map((file, i) => (
            <a
              key={i}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 active:bg-stone-50 transition-colors"
              style={i < cat.files.length - 1 ? { borderBottom: '1px solid #f5f5f4' } : {}}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${cat.color}12` }}
              >
                <PdfIcon color={cat.color} />
              </div>
              <span className="flex-1 text-[13px] font-semibold text-stone-700">{file.name}</span>
              <div
                className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                style={{ background: `${cat.color}12`, color: cat.color }}
              >
                <ArrowUpRightIcon />
                Open
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

function DocsPage() {
  const totalDocs = DOCS.reduce((sum, c) => sum + c.files.length, 0)
  return (
    <div style={{ animation: 'fadeSlideUp 0.32s ease both' }}>
      {/* Header */}
      <div
        className="px-5 pt-5 pb-6"
        style={{ background: 'linear-gradient(to bottom, rgba(255,241,242,0.9) 0%, rgba(250,248,245,0) 100%)' }}
      >
        <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.22em] mb-2">YOUR FILES</p>
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-2xl font-black text-stone-900 leading-tight">Trip Documents</h2>
          <div
            className="flex-shrink-0 mb-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-rose-500"
            style={{ background: 'rgba(225,29,72,0.08)', border: '1px solid rgba(225,29,72,0.15)' }}
          >
            {totalDocs} files
          </div>
        </div>
        <p className="text-[12px] text-stone-400 mt-1.5">All bookings & tickets in one place</p>
      </div>

      {/* Categories */}
      <div className="px-5 pb-8 flex flex-col gap-3">
        {DOCS.map(cat => <DocCategory key={cat.id} cat={cat} />)}
      </div>
    </div>
  )
}

// ─── Bottom Nav ────────────────────────────────────────────────────────────────

function BottomNav({ activePage, onSelect }) {
  const tabs = [
    { id: 'trip', label: 'Itinerary', Icon: ItineraryTabIcon },
    { id: 'map',  label: 'Map',       Icon: MapTabIcon },
    { id: 'docs', label: 'Docs',      Icon: DocsTabIcon },
  ]
  return (
    <nav
      className="flex-shrink-0 flex bg-white"
      style={{
        borderTop: '1px solid rgba(0,0,0,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
      }}
    >
      {tabs.map(({ id, label, Icon }) => {
        const isActive = activePage === id
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={[
              'relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] transition-colors select-none',
              isActive ? 'text-rose-500' : 'text-stone-400',
            ].join(' ')}
          >
            {/* Active indicator pill */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 ease-out"
              style={{
                width: isActive ? 28 : 0,
                background: 'linear-gradient(90deg, #fb7185, #e11d48)',
              }}
            />
            <Icon />
            <span className="text-[10px] font-bold tracking-wide">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}

// ─── Map Page ──────────────────────────────────────────────────────────────────

function MapPage() {
  const daysWithCoords = itinerary.filter(d => d.stops.some(s => s.lat != null))

  return (
    <div className="h-full flex flex-col">
      {/* Legend */}
      <div
        className="flex-shrink-0 flex items-center gap-3 px-5 py-3 overflow-x-auto"
        style={{
          scrollbarWidth: 'none',
          background: 'white',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        {daysWithCoords.map((day, i) => (
          <div
            key={day.day}
            className="flex items-center gap-2 flex-shrink-0 px-2.5 py-1 rounded-full"
            style={{ background: `${DAY_COLORS[i % DAY_COLORS.length]}18`, border: `1px solid ${DAY_COLORS[i % DAY_COLORS.length]}30` }}
          >
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: DAY_COLORS[i % DAY_COLORS.length] }} />
            <span className="text-[11px] font-bold text-stone-600 whitespace-nowrap">Day {day.day}</span>
          </div>
        ))}
      </div>

      {/* Full map */}
      <div className="flex-1 min-h-0">
        <AllStopsMap allDays={itinerary} />
      </div>
    </div>
  )
}

// ─── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage]               = useState('trip')
  const [activeDay, setActiveDay]     = useState(1)
  const [selectedStop, setSelectedStop] = useState(null)

  const currentDay  = itinerary.find(d => d.day === activeDay)
  const tripStatus  = getTripStatus()

  const statusColors = {
    amber: { bg: '#fef3c7', text: '#92400e' },
    rose:  { bg: '#ffe4e6', text: '#be123c' },
    stone: { bg: '#f5f5f4', text: '#78716c' },
  }
  const sc = statusColors[tripStatus.variant] ?? statusColors.stone

  return (
    <div
      className="flex flex-col bg-[#faf8f5]"
      style={{ height: '100dvh', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      {/* Header */}
      <header
        className="flex-shrink-0 z-20"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        }}
      >
        <div className="max-w-lg mx-auto">
          {/* Brand row */}
          <div className="px-5 pt-4 pb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)', boxShadow: '0 2px 8px rgba(225,29,72,0.2)' }}
              >
                🇭🇰
              </div>
              <div className="min-w-0">
                <h1 className="text-[17px] font-black text-stone-900 leading-none tracking-tight truncate">
                  Hong Kong Trip
                </h1>
                <p className="text-[11px] text-stone-400 font-medium mt-0.5 whitespace-nowrap">
                  Jun 29 – Jul 3, 2026 · 5 days
                </p>
              </div>
            </div>
            {/* Trip status chip */}
            <div
              className="flex-shrink-0 flex items-center gap-1 text-[10px] font-black px-2.5 py-1.5 rounded-full whitespace-nowrap"
              style={{ background: sc.bg, color: sc.text }}
            >
              {tripStatus.emoji && <span>{tripStatus.emoji}</span>}
              <span>{tripStatus.label}</span>
            </div>
          </div>

          {/* Day tabs — only on trip page */}
          {page === 'trip' && (
            <DayTabs days={itinerary} activeDay={activeDay} onSelect={setActiveDay} />
          )}
          {page === 'docs' && (
            <div className="px-5 py-3 text-[11px] font-semibold text-stone-400">
              Tap any file to open it
            </div>
          )}

          {/* Rose accent stripe */}
          <div style={{ height: 2, background: 'linear-gradient(90deg, #fb7185, #e11d48 50%, #fda4af)' }} />
        </div>
      </header>

      {/* Main content */}
      <main className={['flex-1 min-h-0', page === 'map' ? 'overflow-hidden' : 'overflow-auto'].join(' ')}>
        <div className={['max-w-lg mx-auto', page === 'map' ? 'h-full' : ''].join(' ')}>
          {page === 'trip' && currentDay && (
            <DayView key={activeDay} day={currentDay} onPhotoClick={setSelectedStop} />
          )}
          {page === 'map' && <MapPage />}
          {page === 'docs' && <DocsPage />}
        </div>
      </main>

      {/* Bottom nav */}
      <BottomNav activePage={page} onSelect={setPage} />

      {/* Photo gallery modal */}
      {selectedStop && (
        <PhotoGalleryModal stop={selectedStop} onClose={() => setSelectedStop(null)} />
      )}
    </div>
  )
}
