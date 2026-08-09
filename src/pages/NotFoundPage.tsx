import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <>
      <h1>Page not found</h1>
      <p className="lede">That page doesn’t exist here.</p>
      <Link className="button button--primary" to="/">
        Start a new search
      </Link>
    </>
  )
}
