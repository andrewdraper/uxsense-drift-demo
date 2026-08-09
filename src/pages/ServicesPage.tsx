import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Stepper from '../components/Stepper'
import { findServices, useBooking, type Service } from '../lib/booking'

export default function ServicesPage() {
  const navigate = useNavigate()
  const { booking, setService } = useBooking()

  useEffect(() => {
    if (!booking.search) navigate('/', { replace: true })
  }, [booking.search, navigate])

  const services = useMemo(
    () => (booking.search ? findServices(booking.search) : []),
    [booking.search],
  )

  if (!booking.search) return null

  function choose(service: Service) {
    setService(service)
    navigate('/passenger')
  }

  return (
    <>
      <Stepper current={1} />
      <h1>
        {booking.search.origin} → {booking.search.destination}
      </h1>
      <p className="lede">
        {booking.search.date} · {booking.search.passengers}{' '}
        {booking.search.passengers === 1 ? 'passenger' : 'passengers'}
      </p>

      <ul className="services">
        {services.map((service) => (
          <li className="service" key={service.id}>
            <div className="service__times">
              <strong>
                {service.depart} → {service.arrive}
              </strong>
              <span className="service__meta">
                {service.duration} ·{' '}
                {service.changes === 0
                  ? 'Direct'
                  : `${service.changes} change${service.changes > 1 ? 's' : ''}`}
              </span>
            </div>
            <div className="service__fare">
              <strong>£{service.fareGBP}</strong>
              <span className="service__meta">{service.seatsLeft} seats left</span>
            </div>
            <button
              className="button button--primary"
              onClick={() => choose(service)}
              type="button"
            >
              Select
            </button>
          </li>
        ))}
      </ul>

      <button className="button button--quiet" onClick={() => navigate('/')} type="button">
        Change search
      </button>
    </>
  )
}
