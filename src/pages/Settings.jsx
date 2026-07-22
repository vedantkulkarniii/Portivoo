import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="bg-zinc-900 border-b border-zinc-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white cursor-pointer" onClick={() => navigate('/')}>
            Portivo
          </h1>
          <button
            onClick={handleLogout}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-white mb-8">Settings</h2>
        <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
          <p className="text-gray-400">Settings coming soon...</p>
        </div>
      </div>
    </div>
  )
}
