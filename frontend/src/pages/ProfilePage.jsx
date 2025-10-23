import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Avatar from '../components/Avatar'
import ThemeToggle from '../components/ThemeToggle'
import '../styles/ProfileSettingsStyle.css'

export default function ProfilePage({ session }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [firstname, setFirstname] = useState(null)
  const [lastname, setLastname] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [message, setMessage] = useState('')

  // Redirect to home if no session
  if (!session || !session.user) {
    navigate('/')
    return null
  }
  
  useEffect(() => {
    let ignore = false
    async function getProfile() {
      setLoading(true)
      const { user } = session

      const { data, error } = await supabase
        .from('profiles')
        .select(`username, avatar_url, full_name`)
        .eq('id', user.id)
        .single()

      if (!ignore) {
        if (error) {
          console.warn(error)
        } else if (data) {
          setUsername(data.username)
          setAvatarUrl(data.avatar_url)
          
          // Parse full_name into firstname and lastname
          if (data.full_name) {
            const nameParts = data.full_name.split(' ')
            setFirstname(nameParts[0] || '')
            setLastname(nameParts.slice(1).join(' ') || '')
          }
        }
      }

      setLoading(false)
    }

    getProfile()

    return () => {
      ignore = true
    }
  }, [session])

  async function updateProfile(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const { user } = session

    // Check if username is unique (only if it changed)
    if (username) {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .neq('id', user.id)
        .single()
      
      if (existingProfile) {
        setMessage('Username is already taken. Please choose another one.')
        setLoading(false)
        return
      }
    }

    const updates = {
      id: user.id,
      username,
      full_name: `${firstname || ''} ${lastname || ''}`.trim(),
      avatar_url: avatar_url,
      updated_at: new Date(),
    }

    const { error } = await supabase.from('profiles').upsert(updates)

    if (error) {
      setMessage(`Error updating profile: ${error.message}`)
    } else {
      setMessage('Profile updated successfully!')
      // Navigate back to main page after a short delay
      setTimeout(() => {
        navigate('/main')
      }, 1500)
    }

    setLoading(false)
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
      setMessage(`Error updating profile picture: ${error.message}`)
    } else {
      setAvatarUrl(avatarUrl)
      setMessage('Profile picture updated successfully!')
    }
  }

  return (
    <div className="profile-settings-container">
      <div className="profile-settings-header">
        <ThemeToggle />
      </div>
      
      <div className="profile-settings-form">
        <h1>Profile Settings</h1>
        
        {message && (
          <div className={`form-message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <form onSubmit={updateProfile}>
          <div className="profile-avatar-section">
            <Avatar
              url={avatar_url}
              size={150}
              onUpload={(event, url) => {
                updateProfilePicture(event, url)
              }}
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              type="text" 
              value={session.user.email} 
              disabled 
            />
          </div>

          <div>
            <label htmlFor="firstname">First Name</label>
            <input 
              id="firstname" 
              type="text" 
              value={firstname || ''} 
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="Enter your first name"
            />
          </div>

          <div>
            <label htmlFor="lastname">Last Name</label>
            <input 
              id="lastname" 
              type="text" 
              value={lastname || ''} 
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Enter your last name"
            />
          </div>

          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              required
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a unique username"
            />
          </div>

          <div>
            <button 
              className="button block primary" 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div>
            <button 
              className="button block" 
              type="button" 
              onClick={() => navigate('/main')}
            >
              Back to Main
            </button>
          </div>

          <div>
            <button 
              className="button block" 
              type="button" 
              onClick={() => supabase.auth.signOut()}
            >
              Sign Out
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}