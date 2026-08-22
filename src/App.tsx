import { useCallback, useMemo, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import {
  BookingContext,
  emptyBooking,
  makeReference,
  type BookingState,
  type Passenger,
  type Search,
  type Service,
} from './lib/booking'
import SearchPage from './pages/SearchPage'
import ServicesPage from './pages/ServicesPage'
import PassengerPage from './pages/PassengerPage'
import PaymentPage from './pages/PaymentPage'
import ConfirmationPage from './pages/ConfirmationPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  const [booking, setBooking] = useState<BookingState>(emptyBooking)

  const setSearch = useCallback((search: Search) => {
    setBooking((previous) => ({ ...previous, search, service: null }))
  }, [])

  const setService = useCallback((service: Service) => {
    setBooking((previous) => ({ ...previous, service }))
  }, [])

  const setPassenger = useCallback((passenger: Passenger) => {
    setBooking((previous) => ({ ...previous, passenger }))
  }, [])

  const confirm = useCallback(() => {
    const reference = makeReference()
    setBooking((previous) => ({ ...previous, reference }))
    return reference
  }, [])

  const reset = useCallback(() => setBooking(emptyBooking), [])

  const value = useMemo(
    () => ({ booking, setSearch, setService, setPassenger, confirm, reset }),
    [booking, setSearch, setService, setPassenger, confirm, reset],
  )

  return (
    <BookingContext.Provider value={value}>
      <div className="app">
        <header className="masthead">
          <Link className="masthead__brand" to="/">
            Northwind Rail
          </Link>
          <p className="masthead__note">
            Demo app — no real trains, no real payments.
          </p>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/trains" element={<ServicesPage />} />
            <Route path="/passenger" element={<PassengerPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>
            This site exists to demonstrate UXSense Drift on a pull request. Source:{' '}
            <a href="https://github.com/uxsense-ai/uxsense-drift-demo">
              uxsense-ai/uxsense-drift-demo
            </a>
            .
          </p>
        </footer>
      </div>
    </BookingContext.Provider>
  )
}
