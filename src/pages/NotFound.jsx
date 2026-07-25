import { Link } from 'react-router-dom'

/**
 * NotFound - 404 error page displayed when a route doesn't match.
 * Provides a friendly message and a link back to the home page.
 */
function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#09090b',
        color: '#ffffff',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <h1
        style={{
          fontSize: '6rem',
          fontWeight: '700',
          color: '#7c3aed',
          lineHeight: '1',
          marginBottom: '1rem',
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '0.75rem',
          color: '#ffffff',
        }}
      >
        Page Not Found
      </h2>
      <p
        style={{
          color: '#9ca3af',
          maxWidth: '24rem',
          marginBottom: '2rem',
          lineHeight: '1.6',
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        style={{
          backgroundColor: '#7c3aed',
          color: '#ffffff',
          padding: '0.625rem 1.5rem',
          borderRadius: '0.5rem',
          fontWeight: '500',
          textDecoration: 'none',
          transition: 'background-color 200ms ease',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#8b5cf6')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#7c3aed')}
      >
        ← Back to Home
      </Link>
    </div>
  )
}

export default NotFound
