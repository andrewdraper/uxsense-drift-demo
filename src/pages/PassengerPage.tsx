import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Field from '../components/Field'
import Stepper from '../components/Stepper'
import { useBooking, type Passenger } from '../lib/booking'
import { hasErrors, validatePassenger, type Errors } from '../lib/validation'

export default function PassengerPage() {
  const navigate = useNavigate()
  const { booking, setPassenger } = useBooking()
  const [form, setForm] = useState<Passenger>(
    booking.passenger ?? {
      fullName: '',
      email: '',
      phone: '',
      seatPreference: 'no-preference',
    },
  )
  const [errors, setErrors] = useState<Errors<Passenger>>({})

  useEffect(() => {
    if (!booking.service) navigate('/', { replace: true })
  }, [booking.service, navigate])

  if (!booking.service) return null

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const found = validatePassenger(form)
    setErrors(found)
    if (hasErrors(found)) return
    setPassenger(form)
    navigate('/payment')
  }

  return (
    <>
      <Stepper current={2} />
      <h1>Who is travelling?</h1>
      <p className="lede">
        The ticket is sent to this email address. Names must match the traveller’s ID.
      </p>

      <form className="card" noValidate onSubmit={submit}>
        <Field id="fullName" label="Full name" error={errors.fullName}>
          <input
            autoComplete="name"
            id="fullName"
            name="fullName"
            onChange={(event) => setForm({ ...form, fullName: event.target.value })}
            type="text"
            value={form.fullName}
          />
        </Field>

        <Field
          error={errors.email}
          hint="We send the ticket and any disruption alerts here."
          id="email"
          label="Email address"
        >
          <input
            autoComplete="email"
            id="email"
            name="email"
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            type="email"
            value={form.email}
          />
        </Field>

        <Field
          error={errors.phone}
          hint="Used only if your train is cancelled."
          id="phone"
          label="Contact number"
        >
          <input
            autoComplete="tel"
            id="phone"
            name="phone"
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            type="tel"
            value={form.phone}
          />
        </Field>

        <Field id="seatPreference" label="Seat preference">
          <select
            id="seatPreference"
            name="seatPreference"
            onChange={(event) =>
              setForm({ ...form, seatPreference: event.target.value as Passenger['seatPreference'] })
            }
            value={form.seatPreference}
          >
            <option value="no-preference">No preference</option>
            <option value="window">Window</option>
            <option value="aisle">Aisle</option>
          </select>
        </Field>

        <button className="button button--primary" type="submit">
          Continue to payment
        </button>
      </form>
    </>
  )
}
