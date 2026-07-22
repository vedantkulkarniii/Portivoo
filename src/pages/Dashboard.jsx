import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="bg-zinc-900 border-b border-zinc-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Portivo</h1>
          <button
            onClick={handleLogout}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome, {user?.name}!
          </h2>
          <p className="text-gray-400 mb-8">
            Your portfolio builder is ready. Get started by creating your profile.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate('/profile')}
              className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg text-left"
            >
              <h3 className="text-xl font-bold mb-2">Edit Profile</h3>
              <p className="text-purple-200">Add your information and details</p>
            </button>

            <button
              onClick={() => navigate('/settings')}
              className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg text-left"
            >
              <h3 className="text-xl font-bold mb-2">Settings</h3>
              <p className="text-purple-200">Choose portfolio type and template</p>
            </button>

            <div className="bg-zinc-800 text-gray-400 p-6 rounded-lg text-left">
              <h3 className="text-xl font-bold mb-2">View Portfolio</h3>
              <p>Complete your profile to view your portfolio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
