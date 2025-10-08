/* From my understanding, you just put motion.x in front of the elements you want to animate */
/* then u can put the animation details inside the motion.x */
/* its pretty simple but take this advice: DOLLAPSE THE ELEMENT AFTER YOU HAVE MADE IT */
/* IF YOU COLLAPSE IT IT JUST SAYS motion.form, motion.input, motion.button, ETC */






import { useState } from 'react'
import { supabase } from '../lib/supabase'
import '../styles/AuthStyle.css'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  
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
        if (error){ 
          setMessage('error: ' + error.message)
          throw error
        } else {
          navigate('/main')
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setMessage('error: ' + error.message)
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <motion.div 
        className="auth-box"
        initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ 
          duration: 0.8, 
          type: "spring", 
          stiffness: 100,
          damping: 15
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -50, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ 
            delay: 0.3, 
            duration: 0.6,
            type: "spring",
            stiffness: 200
          }}
        >
          Cognivue
        </motion.h1>
        
        <motion.div 
          className="tabs"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <motion.button 
            className={isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(true)}
            whileHover={{ 
              scale: 1.05, 
              rotateZ: 2,
              boxShadow: "0 8px 25px rgba(238, 150, 75, 0.4)"
            }}
            whileTap={{ 
              scale: 0.95, 
              rotateZ: -1,
              boxShadow: "0 2px 10px rgba(238, 150, 75, 0.2)"
            }}
            animate={{
              background: isLogin 
                ? "linear-gradient(135deg, var(--primary-orange), #f4a261)"
                : "transparent",
              color: isLogin ? "white" : "var(--primary-navy)"
            }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 20,
              background: { duration: 0.3 }
            }}
          >
            <motion.span
              animate={{ 
                x: isLogin ? 0 : -5,
                scale: isLogin ? 1.1 : 1
              }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Login
            </motion.span>
          </motion.button>
          
          <motion.button 
            className={!isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(false)}
            whileHover={{ 
              scale: 1.05, 
              rotateZ: -2,
              boxShadow: "0 8px 25px rgba(238, 150, 75, 0.4)"
            }}
            whileTap={{ 
              scale: 0.95, 
              rotateZ: 1,
              boxShadow: "0 2px 10px rgba(238, 150, 75, 0.2)"
            }}
            animate={{
              background: !isLogin 
                ? "linear-gradient(135deg, var(--primary-orange), #f4a261)"
                : "transparent",
              color: !isLogin ? "white" : "var(--primary-navy)"
            }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 20,
              background: { duration: 0.3 }
            }}
          >
            <motion.span
              animate={{ 
                x: !isLogin ? 0 : 5,
                scale: !isLogin ? 1.1 : 1
              }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Sign Up
            </motion.span>
          </motion.button>
        </motion.div>

        <motion.form 
          onSubmit={handleAuth}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <motion.input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            whileFocus={{ 
              scale: 1.03, 
              y: -3,
              boxShadow: "0 0 0 4px rgba(6, 190, 225, 0.2)",
              rotateX: 2
            }}
            whileHover={{ scale: 1.01, y: -1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          <motion.input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            whileFocus={{ 
              scale: 1.03, 
              y: -3,
              boxShadow: "0 0 0 4px rgba(6, 190, 225, 0.2)",
              rotateX: 2
            }}
            whileHover={{ scale: 1.01, y: -1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          
          <motion.button 
            type="submit" 
            disabled={loading}
            whileHover={!loading ? { 
              scale: 1.05, 
              y: -3,
              rotateX: 5,
              boxShadow: "0 12px 35px rgba(238, 150, 75, 0.5)"
            } : {}}
            whileTap={!loading ? { 
              scale: 0.95, 
              y: 0,
              rotateX: 0
            } : {}}
            animate={{ 
              rotateY: loading ? 360 : 0,
              scale: loading ? 0.98 : 1
            }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 20,
              rotateY: { duration: 2, repeat: loading ? Infinity : 0 }
            }}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid white",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%"
                    }}
                  />
                  <span>Loading...</span>
                </motion.div>
              ) : (
                <motion.span
                  key="button-text"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {isLogin ? 'Login' : 'Sign Up'}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.form>


          {/* message in case theres an error or something*/}
        <AnimatePresence>
          {message && (
            <motion.div 
              className="message"
              initial={{ 
                opacity: 0, 
                y: 20, 
                scale: 0.8,
                rotateX: -90
              }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                rotateX: 0
              }}
              exit={{ 
                opacity: 0, 
                y: -20, 
                scale: 0.8,
                rotateX: 90
              }}
              transition={{ 
                duration: 0.5,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ scale: 1.02, rotateZ: 1 }}
            >
              {message.includes('error') ? '❌' : '✅'} {message}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}