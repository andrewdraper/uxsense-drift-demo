import { describe, expect, it } from 'vitest'
import { findServices, makeReference } from './booking'
import type { Search } from './booking'

const search: Search = {
  origin: 'London Kings Cross',
  destination: 'Edinburgh Waverley',
  date: '2027-04-12',
  passengers: 1,
}

const CLOCK = /^([01]\d|2[0-3]):[0-5]\d$/
const DURATION = /^\d+h [0-5]\dm$/

describe('findServices', () => {
  it('returns four services', () => {
    expect(findServices(search)).toHaveLength(4)
  })

  it('is deterministic for the same search', () => {
    expect(findServices(search)).toEqual(findServices({ ...search }))
  })

  it('varies with the route', () => {
    const other = findServices({ ...search, destination: 'Glasgow Central' })
    expect(other).not.toEqual(findServices(search))
  })

  it('varies with the date', () => {
    const other = findServices({ ...search, date: '2027-04-13' })
    expect(other).not.toEqual(findServices(search))
  })

  it('gives every service a distinct id', () => {
    const ids = findServices(search).map((service) => service.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('formats departure and arrival as a 24-hour clock', () => {
    for (const service of findServices(search)) {
      expect(service.depart).toMatch(CLOCK)
      expect(service.arrive).toMatch(CLOCK)
    }
  })

  it('formats duration as hours and zero-padded minutes', () => {
    for (const service of findServices(search)) {
      expect(service.duration).toMatch(DURATION)
    }
  })

  it('departs later with each successive service', () => {
    const departures = findServices(search).map((service) => service.depart)
    expect([...departures].sort()).toEqual(departures)
  })

  it('quotes a positive fare and leaves at least one seat on every service', () => {
    for (const service of findServices(search)) {
      expect(service.fareGBP).toBeGreaterThan(0)
      expect(service.seatsLeft).toBeGreaterThan(0)
    }
  })
})

describe('makeReference', () => {
  it('is six characters', () => {
    expect(makeReference()).toHaveLength(6)
  })

  it('avoids characters that are misread aloud — I, O, 0, 1', () => {
    const references = Array.from({ length: 200 }, () => makeReference()).join('')
    expect(references).not.toMatch(/[IO01]/)
  })

  it('uses only upper-case letters and digits', () => {
    expect(makeReference()).toMatch(/^[A-Z2-9]{6}$/)
  })
})
