import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Stepper from '../components/Stepper'
import { useBooking } from '../lib/booking'

export default function ConfirmationPage() {
  const navigate = useNavigate()
  const { booking, reset } = useBooking()

  useEffect(() => {
    if (!booking.reference) navigate('/', { replace: true })
  }, [booking.reference, navigate])

  if (!booking.reference || !booking.service || !booking.passenger || !booking.search) {
    return null
  }

  return (
    <>
      <Stepper current={4} />
      <h1>You’re booked</h1>
      <p className="lede">
        Booking reference <strong className="reference">{booking.reference}</strong> — we’ve emailed
        the ticket to {booking.passenger.email}.
      </p>

      <section className="summary" aria-label="Ticket">
        <div>
          <span className="summary__label">Journey</span>
          <strong>
            {booking.search.origin} → {booking.search.destination}
          </strong>
        </div>
        <div>
          <span className="summary__label">Departs</span>
          <strong>
            {booking.search.date} at {booking.service.depart}
          </strong>
        </div>
        <div>
          <span className="summary__label">Seat</span>
          <strong>{booking.passenger.seatPreference.replace('-', ' ')}</strong>
        </div>
      </section>

      <button
        className="button button--quiet"
        onClick={() => {
          reset()
          navigate('/')
        }}
        type="button"
      >
        Book another journey
      </button>
    </>
  )
}
