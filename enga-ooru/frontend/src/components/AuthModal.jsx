import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const adminKeyDefault = import.meta.env.VITE_ADMIN_KEY || 'admin123'

function AuthModal({ onClose, onSuccess }) {
  const { googleLogin } = useAuth()
  const [adminKey, setAdminKey] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleGoogleSuccess = async ({ credential }) => {
    setSaving(true)
    setError('')
    try {
      const user = await googleLogin(credential, adminKey)
      onSuccess(user)
    } catch (authError) { setError(authError.message) } finally { setSaving(false) }
  }

  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <div className="flex items-center justify-between"><div><h2 id="auth-title" className="text-2xl font-bold text-slate-900">Welcome back</h2><p className="mt-1 text-sm text-slate-500">Sign in with Google to post and manage your listings.</p></div><button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600" aria-label="Close login"><X size={18} /></button></div>
      <div className="mt-6 grid gap-4"><GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google sign-in was cancelled or failed.')} useOneTap={false} width="100%" />{saving && <p className="text-center text-sm text-slate-500">Signing you in...</p>}<label className="grid gap-2 text-xs font-bold text-slate-500">Master Admin Key <span className="font-normal">Optional for administrator access. Default: <strong>{adminKeyDefault}</strong><input type="password" value={adminKey} placeholder={adminKeyDefault} onChange={(event) => setAdminKey(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-emerald-500" /></span></label>{error && <p className="text-sm text-red-600">{error}</p>}</div>
    </section>
  </div>
}

export default AuthModal