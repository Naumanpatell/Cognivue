import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Avatar from './Avatar'
import '../styles/OnboardingStyle.css'

export default function Account({ session }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [firstname, setFirstname] = useState(null)
  const [lastname, setLastname] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  useEffect(() => {
    let ignore = false
    async function getProfile() {
      setLoading(true)
      const { user } = session

      const { data, error } = await supabase
        .from('profiles')
        .select(`username, avatar_url`)
        .eq('id', user.id)
        .single()

      if (!ignore) {
        if (error) {
          console.warn(error)
        } else if (data) {
          setUsername(data.username)
          setAvatarUrl(data.avatar_url)
        }
      }

      setLoading(false)
    }

    getProfile()

    return () => {
      ignore = true
    }
  }, [session])

  async function updateProfile(event, avatarUrl) {
    event.preventDefault()

    setLoading(true)
    const { user } = session

    // going to check if username is unique
    // this helps stop a confusing error message from happening
    const {data: existingUsername} = await supabase.from('profiles').select('username').eq('username', username).single()
    if (existingUsername) {
      alert("The username is already taken, please try another one")
      setLoading(false)
      return
    }
    setLoading(false)
    navigate('/main')
  }

  async function updateProfilePicture(event, avatarUrl) {
    const { user } = session
    const updates = {
      id: user.id,
      username,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    }

    const { error } = await supabase.from('profiles').upsert(updates)

    if (error) {
      alert(error.message)
    } else {
      setAvatarUrl(avatarUrl)
    }
  }

  return (
    <div className="onboarding-container">
      <form onSubmit={updateProfile} className="form-widget">
        <div className="avatar-section">
          <Avatar
        url={avatar_url}
        size={350}
        onUpload={(event, url) => {
          updateProfilePicture(event, url)
        }}
      /></div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="text" value={session.user.email} disabled />
        </div>
        <div>
          <label htmlFor="firstname">First Name</label>
          <input id="firstname" type="text" value={firstname || ''} onChange={(e) => setFirstname(e.target.value)} />
        </div>
        <div>
          <label htmlFor="lastname">Last Name</label>
          <input id="lastname" type="text" value={lastname || ''} onChange={(e) => setLastname(e.target.value)} />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            required
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <button className="button block primary" type="submit" disabled={loading}>
            {loading ? 'Loading ...' : 'Proceed'}
          </button>
        </div>

        <div>
          <button className="button block" type="button" onClick={() => supabase.auth.signOut()}>
            Sign Out
          </button>
        </div>
      </form>
    </div>
  )
}