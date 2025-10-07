import './styles/App.css'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { supabase } from './lib/supabase'
import HomePage from './pages/HomePage'
import Auth from './pages/AuthPage'
import Account from './components/Account'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <Router>
      <div className="container" style={{ padding: '50px 0 100px 0' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={!session ? <Auth /> : <Account key={session.user.id} session={session} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App