import { describe, expect, it } from 'vitest'
import {
  hasErrors,
  isExpired,
  passesLuhn,
  validatePassenger,
  validatePayment,
  validateSearch,
} from './validation'
import type { Passenger, Payment, Search } from './booking'

/** Two digits of a year far enough out that this suite does not rot. */
function futureExpiry(): string {
  return `06/${String((new Date().getFullYear() + 5) % 100).padStart(2, '0')}`
}

describe('validateSearch', () => {
  const valid: Search = {
    origin: 'London Kings Cross',
    destination: 'Edinburgh Waverley',
    date: '2027-04-12',
    passengers: 2,
  }

  it('accepts a complete search', () => {
    expect(validateSearch(valid)).toEqual({})
  })

  it('requires an origin', () => {
    expect(validateSearch({ ...valid, origin: '   ' }).origin).toBeDefined()
  })

  it('requires a destination', () => {
    expect(validateSearch({ ...valid, destination: '' }).destination).toBeDefined()
  })

  it('rejects the same station twice, whitespace notwithstanding', () => {
    const errors = validateSearch({ ...valid, destination: '  London Kings Cross  ' })
    expect(errors.destination).toMatch(/same station/i)
  })

  it('requires a date', () => {
    expect(validateSearch({ ...valid, date: '' }).date).toBeDefined()
  })

  it.each([0, -1, 10])('rejects a passenger count of %i', (passengers) => {
    expect(validateSearch({ ...valid, passengers }).passengers).toBeDefined()
  })

  it.each([1, 5, 9])('accepts a passenger count of %i', (passengers) => {
    expect(validateSearch({ ...valid, passengers }).passengers).toBeUndefined()
  })
})

describe('validatePassenger', () => {
  const valid: Passenger = {
    fullName: 'Ada Lovelace',
    email: 'ada@example.com',
    phone: '+44 7700 900123',
    seatPreference: 'window',
  }

  it('accepts a complete passenger', () => {
    expect(validatePassenger(valid)).toEqual({})
  })

  it.each(['', 'A', '  '])('rejects the name %j', (fullName) => {
    expect(validatePassenger({ ...valid, fullName }).fullName).toBeDefined()
  })

  it.each(['', 'ada', 'ada@', 'ada@example', 'ada @example.com', 'ada@example.c'])(
    'rejects the email %j',
    (email) => {
      expect(validatePassenger({ ...valid, email }).email).toBeDefined()
    },
  )

  it('rejects a phone number with fewer than ten digits', () => {
    expect(validatePassenger({ ...valid, phone: '0770 090' }).phone).toBeDefined()
  })

  it('counts digits only, so formatting characters do not pad the length', () => {
    expect(validatePassenger({ ...valid, phone: '(0) (0) (0) (0) (0)' }).phone).toBeDefined()
  })
})

describe('validatePayment', () => {
  const valid: Payment = {
    cardName: 'A Lovelace',
    cardNumber: '4242 4242 4242 4242',
    expiry: futureExpiry(),
    cvc: '123',
    postcode: 'EC1A 1BB',
  }

  it('accepts a complete payment', () => {
    expect(validatePayment(valid)).toEqual({})
  })

  it('requires the name on the card', () => {
    expect(validatePayment({ ...valid, cardName: 'A' }).cardName).toBeDefined()
  })

  it('requires sixteen digits', () => {
    expect(validatePayment({ ...valid, cardNumber: '4242 4242 4242' }).cardNumber).toMatch(
      /16 digits/,
    )
  })

  it('rejects sixteen digits that fail the Luhn check', () => {
    expect(validatePayment({ ...valid, cardNumber: '4242424242424241' }).cardNumber).toMatch(
      /not valid/,
    )
  })

  it.each(['13/30', '1/30', '06/2030', ''])('rejects the expiry %j', (expiry) => {
    expect(validatePayment({ ...valid, expiry }).expiry).toMatch(/MM\/YY/)
  })

  it('rejects a well-formed expiry that has already passed', () => {
    expect(validatePayment({ ...valid, expiry: '01/20' }).expiry).toMatch(/expired/)
  })

  it.each(['12', '12345', 'abc'])('rejects the CVC %j', (cvc) => {
    expect(validatePayment({ ...valid, cvc }).cvc).toBeDefined()
  })

  it.each(['123', '1234'])('accepts the CVC %j', (cvc) => {
    expect(validatePayment({ ...valid, cvc }).cvc).toBeUndefined()
  })

  it('requires a billing postcode', () => {
    expect(validatePayment({ ...valid, postcode: 'EC' }).postcode).toBeDefined()
  })
})

describe('passesLuhn', () => {
  it.each(['4242424242424242', '5555555555554444', '4000056655665556'])(
    'accepts %s',
    (digits) => expect(passesLuhn(digits)).toBe(true),
  )

  it.each(['4242424242424241', '1234567812345678'])('rejects %s', (digits) =>
    expect(passesLuhn(digits)).toBe(false),
  )
})

describe('isExpired', () => {
  it('treats a card expiring years from now as valid', () => {
    expect(isExpired(futureExpiry())).toBe(false)
  })

  it('treats a card from a past year as expired', () => {
    expect(isExpired('01/20')).toBe(true)
  })

  it('treats the current month as still valid — cards run to month end', () => {
    const now = new Date()
    const expiry = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(
      now.getFullYear() % 100,
    ).padStart(2, '0')}`
    expect(isExpired(expiry)).toBe(false)
  })
})

describe('hasErrors', () => {
  it('is false when nothing failed', () => {
    expect(hasErrors({})).toBe(false)
  })

  it('is true when any field failed', () => {
    expect(hasErrors<Search>({ date: 'Choose a travel date.' })).toBe(true)
  })
})
