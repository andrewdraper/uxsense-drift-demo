import { createContext, useContext } from 'react'

export type Search = {
  origin: string
  destination: string
  date: string
  passengers: number
}

export type Service = {
  id: string
  depart: string
  arrive: string
  duration: string
  changes: number
  fareGBP: number
  seatsLeft: number
}

export type Passenger = {
  fullName: string
  email: string
  phone: string
  seatPreference: 'window' | 'aisle' | 'no-preference'
}

export type Payment = {
  cardName: string
  cardNumber: string
  expiry: string
  cvc: string
  postcode: string
}

export type BookingState = {
  search: Search | null
  service: Service | null
  passenger: Passenger | null
  reference: string | null
}

export const emptyBooking: BookingState = {
  search: null,
  service: null,
  passenger: null,
  reference: null,
}

export type BookingContextValue = {
  booking: BookingState
  setSearch: (search: Search) => void
  setService: (service: Service) => void
  setPassenger: (passenger: Passenger) => void
  confirm: () => string
  reset: () => void
}

export const BookingContext = createContext<BookingContextValue | null>(null)

export function useBooking(): BookingContextValue {
  const value = useContext(BookingContext)
  if (!value) throw new Error('useBooking must be used inside <BookingProvider>')
  return value
}

/** Deterministic fake timetable — no backend, no network, no canvas. */
export function findServices(search: Search): Service[] {
  const seed = `${search.origin}|${search.destination}|${search.date}`
  let hash = 0
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) % 100_000

  return [0, 1, 2, 3].map((index) => {
    const departHour = 7 + index * 3
    const minutes = (hash + index * 17) % 60
    const legMinutes = 92 + ((hash + index * 41) % 70)
    const departTotal = departHour * 60 + minutes
    const arriveTotal = departTotal + legMinutes
    return {
      id: `NW${100 + index}`,
      depart: formatClock(departTotal),
      arrive: formatClock(arriveTotal),
      duration: `${Math.floor(legMinutes / 60)}h ${String(legMinutes % 60).padStart(2, '0')}m`,
      changes: index === 1 ? 1 : 0,
      fareGBP: 24 + ((hash + index * 13) % 60),
      seatsLeft: 2 + ((hash + index * 7) % 40),
    }
  })
}

function formatClock(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function makeReference(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let reference = ''
  for (let index = 0; index < 6; index++) {
    reference += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return reference
}
