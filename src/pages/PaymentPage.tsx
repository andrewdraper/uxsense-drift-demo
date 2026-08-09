import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Field from '../components/Field'
import Stepper from '../components/Stepper'
import { useBooking, type Payment } from '../lib/booking'
import { hasErrors, validatePayment, type Errors } from '../lib/validation'

export default function PaymentPage() {
  const navigate = useNavigate()
  const { booking, confirm } = useBooking()
  const [form, setForm] = useState<Payment>({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    postcode: '',
  })
  const [errors, setErrors] = useState<Errors<Payment>>({})

  useEffect(() => {
    if (!booking.passenger || !booking.service) navigate('/', { replace: true })
  }, [booking.passenger, booking.service, navigate])

  if (!booking.passenger || !booking.service || !booking.search) return null

  const total = booking.service.fareGBP * booking.search.passengers

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const found = validatePayment(form)
    setErrors(found)
    if (hasErrors(found)) return
    confirm()
    navigate('/confirmation')
  }

  return (
    <>
      <Stepper current={3} />
      <h1>Payment</h1>
      <p className="lede">
        No card is charged — this is a demo. Any Luhn-valid test number works.
      </p>

      <section className="summary" aria-label="Booking summary">
        <div>
          <span className="summary__label">Service</span>
          <strong>
            {booking.service.depart} → {booking.service.arrive} ({booking.service.id})
          </strong>
        </div>
        <div>
          <span className="summary__label">Passengers</span>
          <strong>{booking.search.passengers}</strong>
        </div>
        <div>
          <span className="summary__label">Total</span>
          <strong>£{total}</strong>
        </div>
      </section>

      <form className="card" noValidate onSubmit={submit}>
        <Field id="cardName" label="Name on card" error={errors.cardName}>
          <input
            autoComplete="cc-name"
            id="cardName"
            name="cardName"
            onChange={(event) => setForm({ ...form, cardName: event.target.value })}
            type="text"
            value={form.cardName}
          />
        </Field>

        <Field
          error={errors.cardNumber}
          hint="16 digits. Try 4242 4242 4242 4242."
          id="cardNumber"
          label="Card number"
        >
          <input
            autoComplete="cc-number"
            id="cardNumber"
            inputMode="numeric"
            name="cardNumber"
            onChange={(event) => setForm({ ...form, cardNumber: event.target.value })}
            type="text"
            value={form.cardNumber}
          />
        </Field>

        <div className="row">
          <Field id="expiry" label="Expiry (MM/YY)" error={errors.expiry}>
            <input
              autoComplete="cc-exp"
              id="expiry"
              inputMode="numeric"
              name="expiry"
              onChange={(event) => setForm({ ...form, expiry: event.target.value })}
              placeholder="MM/YY"
              type="text"
              value={form.expiry}
            />
          </Field>

          <Field id="cvc" label="CVC" error={errors.cvc}>
            <input
              autoComplete="cc-csc"
              id="cvc"
              inputMode="numeric"
              name="cvc"
              onChange={(event) => setForm({ ...form, cvc: event.target.value })}
              type="text"
              value={form.cvc}
            />
          </Field>
        </div>

        <Field id="postcode" label="Billing postcode" error={errors.postcode}>
          <input
            autoComplete="postal-code"
            id="postcode"
            name="postcode"
            onChange={(event) => setForm({ ...form, postcode: event.target.value })}
            type="text"
            value={form.postcode}
          />
        </Field>

        <button className="button button--primary" type="submit">
          Pay £{total} and book
        </button>
      </form>
    </>
  )
}
