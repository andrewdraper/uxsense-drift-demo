import type { Passenger, Payment, Search } from './booking'

export type Errors<T> = Partial<Record<keyof T, string>>

export function validateSearch(search: Search): Errors<Search> {
  const errors: Errors<Search> = {}
  if (!search.origin.trim()) errors.origin = 'Choose a station to travel from.'
  if (!search.destination.trim()) errors.destination = 'Choose a station to travel to.'
  if (search.origin.trim() && search.origin.trim() === search.destination.trim()) {
    errors.destination = 'Origin and destination cannot be the same station.'
  }
  if (!search.date) errors.date = 'Choose a travel date.'
  if (search.passengers < 1 || search.passengers > 9) {
    errors.passengers = 'Between 1 and 9 passengers per booking.'
  }
  return errors
}

export function validatePassenger(passenger: Passenger): Errors<Passenger> {
  const errors: Errors<Passenger> = {}
  if (passenger.fullName.trim().length < 2) {
    errors.fullName = 'Enter the name printed on the traveller’s ID.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(passenger.email.trim())) {
    errors.email = 'Enter an email address we can send the ticket to.'
  }
  if (passenger.phone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Enter a contact number with at least 10 digits.'
  }
  return errors
}

export function validatePayment(payment: Payment): Errors<Payment> {
  const errors: Errors<Payment> = {}
  if (payment.cardName.trim().length < 2) {
    errors.cardName = 'Enter the name on the card.'
  }
  const digits = payment.cardNumber.replace(/\s/g, '')
  if (!/^\d{16}$/.test(digits)) {
    errors.cardNumber = 'Card number must be 16 digits.'
  } else if (!passesLuhn(digits)) {
    errors.cardNumber = 'That card number is not valid — check it and try again.'
  }
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(payment.expiry.trim())) {
    errors.expiry = 'Expiry must be MM/YY.'
  } else if (isExpired(payment.expiry.trim())) {
    errors.expiry = 'That card has expired.'
  }
  if (!/^\d{3,4}$/.test(payment.cvc.trim())) {
    errors.cvc = 'CVC is the 3 or 4 digit code on the card.'
  }
  if (payment.postcode.trim().length < 3) {
    errors.postcode = 'Enter the billing postcode.'
  }
  return errors
}

export function passesLuhn(digits: string): boolean {
  let sum = 0
  let double = false
  for (let index = digits.length - 1; index >= 0; index--) {
    let value = Number(digits[index])
    if (double) {
      value *= 2
      if (value > 9) value -= 9
    }
    sum += value
    double = !double
  }
  return sum % 10 === 0
}

export function isExpired(expiry: string): boolean {
  const [month, year] = expiry.split('/').map(Number)
  const now = new Date()
  const endOfMonth = new Date(2000 + year, month, 0, 23, 59, 59)
  return endOfMonth.getTime() < now.getTime()
}

export function hasErrors<T>(errors: Errors<T>): boolean {
  return Object.keys(errors).length > 0
}
