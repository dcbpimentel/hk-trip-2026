import { useState } from 'react'
import { itinerary, HOTEL } from './data/itinerary'
import DayMap from './components/DayMap'
import AllStopsMap, { DAY_COLORS } from './components/AllStopsMap'

// ─── Trip status ───────────────────────────────────────────────────────────────

function getTripStatus() {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const start = new Date(2026, 5, 29)
  const end   = new Date(2026, 6, 3)
  const daysUntil = Math.round((start - today) / 86400000)
  if (daysUntil > 1)  return { label: `${daysUntil} days to go`, emoji: '✈️', variant: 'neutral' }
  if (daysUntil === 1) return { label: 'Tomorrow!',              emoji: '🎉', variant: 'blue' }
  if (daysUntil === 0) return { label: 'Trip starts today!',     emoji: '🚀', variant: 'blue' }
  if (today <= end)    return { label: 'Happening now 🇭🇰',      emoji: '',   variant: 'blue' }
  return { label: 'Trip complete', emoji: '🏠', variant: 'neutral' }
}

function getDayStatus(day) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const parts = day.date.split(', ')
  const dayDate = new Date(`${parts[1]}, ${parts[2]}`)
  const diff = Math.round((dayDate - today) / 86400000)
  if (diff === 0) return 'today'
  if (diff === 1) return 'tomorrow'
  if (diff < 0)  return 'past'
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
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    <path d="M8 21v-2M16 21v-2M9 11l3 3 3-3" />
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

// ─── Day Tabs ──────────────────────────────────────────────────────────────────

function DayTabs({ days, activeDay, onSelect }) {
  return (
    <div
      className="flex gap-1.5 px-4 py-2.5 overflow-x-auto"
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
              'flex-shrink-0 flex flex-col items-center justify-center px-3.5 rounded-2xl min-w-[60px] min-h-[52px] transition-all duration-200 select-none relative',
              isActive
                ? 'text-white'
                : dayStatus === 'past'
                ? 'text-[#8E8E93]'
                : 'text-[#3C3C43] active:opacity-70',
            ].join(' ')}
            style={isActive ? {
              background: '#007AFF',
              boxShadow: '0 4px 14px rgba(0,122,255,0.35)',
            } : {
              background: dayStatus === 'past' ? 'rgba(142,142,147,0.1)' : 'white',
              border: '1px solid rgba(60,60,67,0.1)',
            }}
          >
            {dayStatus === 'today' && (
              <span className={`text-[8px] font-black uppercase tracking-wider mb-0.5 ${isActive ? 'text-blue-100' : 'text-[#007AFF]'}`}>TODAY</span>
            )}
            {dayStatus === 'tomorrow' && (
              <span className={`text-[8px] font-black uppercase tracking-wider mb-0.5 ${isActive ? 'text-blue-100' : 'text-[#007AFF]'}`}>TMRW</span>
            )}
            {dayStatus === 'past' && !isActive && (
              <span className="text-[8px] text-[#8E8E93] mb-0.5"><CheckIcon /></span>
            )}
            <span className="text-[11px] font-bold">Day {day.day}</span>
            <span className={['text-[10px] font-medium mt-0.5', isActive ? 'text-blue-100' : 'text-[#8E8E93]'].join(' ')}>
              {shortDate(day.date)}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Hotel Banner ──────────────────────────────────────────────────────────────

function HotelBanner() {
  return (
    <div
      className="mx-4 mb-1 flex items-center gap-3 px-4 py-3 rounded-2xl"
      style={{
        background: 'white',
        border: '1px solid rgba(60,60,67,0.1)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
        style={{ background: 'rgba(99,102,241,0.1)' }}
      >
        🏨
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-[#6366f1] uppercase tracking-widest mb-0.5">Your Hotel</p>
        <p className="text-[13px] font-semibold text-[#1C1C1E] truncate">{HOTEL.shortName}</p>
        <p className="text-[11px] text-[#8E8E93] truncate">{HOTEL.address}</p>
      </div>
      <a
        href={HOTEL.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-[11px] font-semibold active:opacity-75 transition-opacity"
        style={{ background: '#007AFF' }}
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
    <div
      className="flex items-center gap-3 px-4 py-3.5"
      style={{ background: 'rgba(142,142,147,0.08)', borderBottom: '1px solid rgba(60,60,67,0.08)' }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
        style={{ background: 'rgba(142,142,147,0.12)' }}
      >
        🕐
      </div>
      <div>
        <p className="text-[13px] font-semibold text-[#3C3C43]">Details coming soon</p>
        <p className="text-[11px] text-[#8E8E93] mt-0.5">This stop is still being planned</p>
      </div>
    </div>
  )
}

// ─── Stop Card ─────────────────────────────────────────────────────────────────

function StopCard({ stop, stopNumber, isLast }) {
  const [isLocating, setIsLocating] = useState(false)
  const hasPhoto  = stop.photos?.length > 0
  const hasCoords = stop.lat != null && stop.lng != null

  return (
    <div className="flex gap-3">
      {/* Timeline */}
      <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
        <div
          className="w-7 h-7 rounded-full text-white text-[11px] font-bold flex items-center justify-center z-10 flex-shrink-0"
          style={stop.isHotel ? {
            background: '#6366f1',
            boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
            fontSize: 14,
          } : {
            background: '#007AFF',
            boxShadow: '0 2px 8px rgba(0,122,255,0.35)',
          }}
        >
          {stop.isHotel ? '🏨' : stopNumber}
        </div>
        {!isLast && (
          <div
            className="w-px flex-1 mt-2"
            style={{ background: 'linear-gradient(to bottom, rgba(0,122,255,0.25), transparent)' }}
          />
        )}
      </div>

      {/* Content */}
      <div className={['flex-1 min-w-0', isLast ? 'pb-2' : 'pb-6'].join(' ')}>
        {/* Time */}
        <div className="flex items-center gap-1.5 mb-2">
          <span style={{ color: '#007AFF' }}><ClockIcon /></span>
          <span className="text-[11px] font-medium text-[#8E8E93]">{stop.time}</span>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}
        >
          {/* Static photo — no tap, no overlay */}
          {hasPhoto && (
            <div className="w-full overflow-hidden">
              <img
                src={stop.photos[0]}
                alt={stop.name}
                loading="lazy"
                decoding="async"
                className="w-full object-cover"
                style={{ aspectRatio: '16/9', display: 'block' }}
              />
            </div>
          )}

          {/* TBA banner */}
          {stop.isTBA && <TBABanner />}

          {/* Text content */}
          <div className="px-4 pt-3 pb-3">
            {stop.isHotel && (
              <div
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest mb-2"
                style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1' }}
              >
                Your Hotel · All 5 Nights
              </div>
            )}
            <h3 className="font-semibold text-[#1C1C1E] text-[15px] leading-snug">{stop.name}</h3>
            <p className="text-[12.5px] text-[#8E8E93] mt-1 leading-relaxed">{stop.description}</p>
          </div>

          {/* Action buttons */}
          {!stop.isTBA && (
            <>
              <div className="mx-4 h-px" style={{ background: 'rgba(60,60,67,0.1)' }} />
              <div className="flex gap-2 p-3">
                <a
                  href={getMapsUrl(stop)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 min-h-[40px] rounded-xl text-[12px] font-medium active:opacity-70 transition-opacity"
                  style={{
                    color: '#007AFF',
                    background: 'rgba(0,122,255,0.07)',
                    border: '1px solid rgba(0,122,255,0.15)',
                  }}
                >
                  <ExternalLinkIcon />
                  Open in Maps
                </a>
                {hasCoords && (
                  <button
                    onClick={() => handleGetDirections(stop, setIsLocating)}
                    disabled={isLocating}
                    className="flex-1 flex items-center justify-center gap-1.5 min-h-[40px] rounded-xl text-white text-[12px] font-medium active:opacity-80 transition-opacity disabled:opacity-50"
                    style={stop.isHotel ? {
                      background: '#6366f1',
                      boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                    } : {
                      background: '#007AFF',
                      boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
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

function DayView({ day }) {
  const hasHotelStop   = day.stops.some(s => s.isHotel)
  const confirmedStops = day.stops.filter(s => !s.isTBA).length

  return (
    <div style={{ animation: 'fadeSlideUp 0.28s ease both' }}>
      {/* Hotel home-base banner on days without hotel stop */}
      {!hasHotelStop && <div className="pt-4"><HotelBanner /></div>}

      {/* Day header */}
      <div className="px-4 pt-5 pb-5">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2"
          style={{ color: '#007AFF' }}
        >
          {day.date}
        </p>
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[22px] font-bold text-[#1C1C1E] leading-tight flex-1">{day.title}</h2>
          {confirmedStops > 0 && (
            <div
              className="flex-shrink-0 mt-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
              style={{ background: 'rgba(0,122,255,0.08)', color: '#007AFF', border: '1px solid rgba(0,122,255,0.15)' }}
            >
              {confirmedStops} stop{confirmedStops !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 pb-4">
        {day.stops.map((stop, i) => (
          <StopCard
            key={i}
            stop={stop}
            stopNumber={i + 1}
            isLast={i === day.stops.length - 1}
          />
        ))}
      </div>

      {/* Day route map */}
      {day.stops.some(s => s.lat != null) && (
        <div className="pb-8">
          <div className="flex items-center gap-2 px-4 mb-3">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(0,122,255,0.07)', border: '1px solid rgba(0,122,255,0.12)' }}
            >
              <span style={{ color: '#007AFF' }}><MapRouteIcon /></span>
              <span
                className="text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{ color: '#007AFF' }}
              >
                Today's Route
              </span>
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
    color: '#007AFF',
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
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-[#F2F2F7] transition-colors text-left"
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: `${cat.color}14` }}
        >
          {cat.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[#1C1C1E]">{cat.label}</p>
          <p className="text-[11px] text-[#8E8E93]">{cat.files.length} document{cat.files.length !== 1 ? 's' : ''}</p>
        </div>
        <div
          className="text-[#8E8E93] transition-transform duration-200"
          style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {open && (
        <div style={{ borderTop: '1px solid rgba(60,60,67,0.08)' }}>
          {cat.files.map((file, i) => (
            <a
              key={i}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 active:bg-[#F2F2F7] transition-colors"
              style={i < cat.files.length - 1 ? { borderBottom: '1px solid rgba(60,60,67,0.08)' } : {}}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${cat.color}10` }}
              >
                <PdfIcon color={cat.color} />
              </div>
              <span className="flex-1 text-[13px] font-medium text-[#3C3C43]">{file.name}</span>
              <div
                className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                style={{ background: `${cat.color}10`, color: cat.color }}
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
    <div style={{ animation: 'fadeSlideUp 0.28s ease both' }}>
      <div className="px-4 pt-5 pb-5">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2"
          style={{ color: '#007AFF' }}
        >
          Your Files
        </p>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[22px] font-bold text-[#1C1C1E]">Trip Documents</h2>
          <div
            className="px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={{ background: 'rgba(0,122,255,0.08)', color: '#007AFF', border: '1px solid rgba(0,122,255,0.15)' }}
          >
            {totalDocs} files
          </div>
        </div>
        <p className="text-[12px] text-[#8E8E93] mt-1">All bookings & tickets in one place</p>
      </div>

      <div className="px-4 pb-8 flex flex-col gap-2.5">
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
        borderTop: '1px solid rgba(60,60,67,0.12)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -1px 0 rgba(60,60,67,0.1)',
      }}
    >
      {tabs.map(({ id, label, Icon }) => {
        const isActive = activePage === id
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={[
              'relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] transition-colors select-none active:opacity-70',
            ].join(' ')}
            style={{ color: isActive ? '#007AFF' : '#8E8E93' }}
          >
            {/* Active indicator */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: isActive ? 28 : 0, background: '#007AFF' }}
            />
            <Icon />
            <span className="text-[10px] font-semibold">{label}</span>
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
      <div
        className="flex-shrink-0 flex items-center gap-2.5 px-4 py-3 overflow-x-auto"
        style={{
          scrollbarWidth: 'none',
          background: 'white',
          borderBottom: '1px solid rgba(60,60,67,0.1)',
        }}
      >
        {daysWithCoords.map((day, i) => (
          <div
            key={day.day}
            className="flex items-center gap-1.5 flex-shrink-0 px-2.5 py-1 rounded-full"
            style={{
              background: `${DAY_COLORS[i % DAY_COLORS.length]}14`,
              border: `1px solid ${DAY_COLORS[i % DAY_COLORS.length]}28`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: DAY_COLORS[i % DAY_COLORS.length] }}
            />
            <span className="text-[11px] font-medium text-[#3C3C43] whitespace-nowrap">Day {day.day}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-0">
        <AllStopsMap allDays={itinerary} />
      </div>
    </div>
  )
}

// ─── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage]           = useState('trip')
  const [activeDay, setActiveDay] = useState(1)

  const currentDay = itinerary.find(d => d.day === activeDay)
  const tripStatus = getTripStatus()

  const statusColors = {
    blue:    { bg: 'rgba(0,122,255,0.1)',     text: '#007AFF' },
    neutral: { bg: 'rgba(142,142,147,0.12)',  text: '#636366' },
  }
  const sc = statusColors[tripStatus.variant] ?? statusColors.neutral

  return (
    <div
      className="flex flex-col"
      style={{
        height: '100dvh',
        background: '#F2F2F7',
        fontFamily: "-apple-system, 'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <header
        className="flex-shrink-0 z-20"
        style={{
          background: 'rgba(255,255,255,0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(60,60,67,0.1)',
        }}
      >
        <div className="max-w-lg mx-auto">
          {/* Brand row */}
          <div
            className="px-4 flex items-center justify-between gap-3"
            style={{ paddingTop: 'max(14px, env(safe-area-inset-top))', paddingBottom: 10 }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: 'rgba(0,122,255,0.1)' }}
              >
                🇭🇰
              </div>
              <div className="min-w-0">
                <h1 className="text-[15px] font-bold text-[#1C1C1E] leading-tight tracking-tight">
                  Bais Family Hong Kong Trip
                </h1>
                <p className="text-[11px] text-[#8E8E93] mt-0.5">
                  Jun 29 – Jul 3, 2026 · 5 days
                </p>
              </div>
            </div>
            {/* Status chip */}
            <div
              className="flex-shrink-0 flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-full whitespace-nowrap"
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
            <div className="px-4 pb-3 text-[11px] text-[#8E8E93]">
              Tap any file to open
            </div>
          )}

          {/* Blue accent line */}
          <div style={{ height: 1, background: 'rgba(0,122,255,0.2)' }} />
        </div>
      </header>

      {/* Main content */}
      <main className={['flex-1 min-h-0', page === 'map' ? 'overflow-hidden' : 'overflow-auto'].join(' ')}>
        <div className={['max-w-lg mx-auto', page === 'map' ? 'h-full' : ''].join(' ')}>
          {page === 'trip' && currentDay && (
            <DayView key={activeDay} day={currentDay} />
          )}
          {page === 'map' && <MapPage />}
          {page === 'docs' && <DocsPage />}
        </div>
      </main>

      {/* Bottom nav */}
      <BottomNav activePage={page} onSelect={setPage} />
    </div>
  )
}
