import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'namma_ilayangudi_auth'
const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth`
const readStoredUser = () => {
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || null } catch { return null }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredUser)
  const authenticate = async (path, body) => {
    const response = await fetch(`${API_URL}/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.message || 'Unable to authenticate')
    setSession(payload.data)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload.data))
    return payload.data
  }
  const googleLogin = (credential, adminKey) => authenticate('google', { credential, adminKey })
  const logout = () => { setSession(null); window.localStorage.removeItem(STORAGE_KEY) }
  const authHeaders = useCallback(() => session ? { Authorization: `Bearer ${session.token}` } : {}, [session])
  const value = useMemo(() => ({ session, user: session, googleLogin, logout, authHeaders }), [session, authHeaders])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}