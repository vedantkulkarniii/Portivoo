import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function PortfolioView() {
  const { subdomain } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/profiles/public/${subdomain}`
        )
        setProfile(response.data)
      } catch (err) {
        setError(
          err.response?.data?.message || 'Portfolio not found'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [subdomain])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Portfolio Not Available</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto bg-zinc-900 rounded-lg p-8 border border-zinc-800">
        <h1 className="text-4xl font-bold text-white mb-4">
          {profile?.identity?.name || 'Portfolio'}
        </h1>
        <p className="text-gray-400">
          {profile?.identity?.email}
        </p>
        <p className="text-gray-500 mt-2">
          Type: {profile?.portfolioType}
        </p>
      </div>
    </div>
  )
}
