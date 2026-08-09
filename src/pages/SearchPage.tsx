import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Field from '../components/Field'
import Stepper from '../components/Stepper'
import { useBooking, type Search } from '../lib/booking'
import { hasErrors, validateSearch, type Errors } from '../lib/validation'

const STATIONS = [
  'Bristol Temple Meads',
  'Cardiff Central',
  'Edinburgh Waverley',
  'Leeds',
  'Liverpool Lime Street',
  'London Paddington',
  'Manchester Piccadilly',
  'Newcastle',
  'York',
]

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function SearchPage() {
  const navigate = useNavigate()
  const { booking, setSearch } = useBooking()
  const [form, setForm] = useState<Search>(
    booking.search ?? {
      origin: 'London Paddington',
      destination: '',
      date: today(),
      passengers: 1,
    },
  )
  const [errors, setErrors] = useState<Errors<Search>>({})

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const found = validateSearch(form)
    setErrors(found)
    if (hasErrors(found)) return
    setSearch(form)
    navigate('/trains')
  }

  return (
    <>
      <Stepper current={0} />
      <h1>Where are you going?</h1>
      <p className="lede">
        Find a seat on today’s services. Tickets are held for 20 minutes once you reach payment.
      </p>

      <form className="card" noValidate onSubmit={submit}>
        <Field id="origin" label="From" error={errors.origin}>
          <select
            id="origin"
            name="origin"
            value={form.origin}
            onChange={(event) => setForm({ ...form, origin: event.target.value })}
          >
            <option value="">Select a station</option>
            {STATIONS.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
        </Field>

        <Field id="destination" label="To" error={errors.destination}>
          <select
            id="destination"
            name="destination"
            value={form.destination}
            onChange={(event) => setForm({ ...form, destination: event.target.value })}
          >
            <option value="">Select a station</option>
            {STATIONS.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
        </Field>

        <div className="row">
          <Field id="date" label="Travel date" error={errors.date}>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
            />
          </Field>

          <Field id="passengers" label="Passengers" error={errors.passengers}>
            <input
              id="passengers"
              name="passengers"
              type="number"
              min={1}
              max={9}
              value={form.passengers}
              onChange={(event) =>
                setForm({ ...form, passengers: Number(event.target.value) })
              }
            />
          </Field>
        </div>

        <button className="button button--primary" type="submit">
          Find trains
        </button>
      </form>
    </>
  )
}
