import './styles/App.css'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { supabase } from './lib/supabase'
import HomePage from './pages/HomePage'
import Auth from './pages/AuthPage'
import MainPage from './pages/MainPage'
import Account from './components/Account'
import TncPage from './pages/tncPage'

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
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={!session ? <Auth /> : <Account key={session.user.id} session={session} />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/tnc" element={<TncPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App