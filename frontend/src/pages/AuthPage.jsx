import { useState } from 'react'
import { supabase } from '../lib/supabase'
import '../styles/AuthStyle.css'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleAuth = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) {
          setMessage('Error: ' + error.message)
          return
        }
        setMessage('Login successful!')
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) {
          setMessage('Error: ' + error.message)
          return
        }
        setMessage('Check your email for the confirmation link!')
      }
    } catch (error) {
      setMessage('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>InsightXR</h1>
        
        <div className="tabs">
          <button 
            className={isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={!isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  )
}