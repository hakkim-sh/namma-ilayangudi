import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t, toggleLanguage, isTamil } = useLanguage()

  return (
    <header className="border-b border-slate-200 bg-[#f8fafc]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="/" className="text-xl font-bold tracking-tight text-slate-900">
          Namma <span className="text-emerald-600">Ilayangudi</span>
          <span className="mt-1 hidden text-[10px] font-medium tracking-normal text-slate-500 sm:block">Local Marketplace &amp; Essential Services</span>
        </a>
        <div className="flex items-center gap-4 text-sm">
          <label className="hidden items-center gap-2 font-medium text-slate-500 sm:flex">
            📍<select className="cursor-pointer border-0 bg-transparent font-semibold text-slate-900 outline-none" defaultValue="Ilayangudi" aria-label={t('town')}><option>Ilayangudi</option></select>
          </label>
          <button type="button" onClick={toggleLanguage} className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-emerald-500" aria-label="தமிழ் | ENG">{isTamil ? 'ENG | தமிழ்' : 'தமிழ் | ENG'}</button>
          {location.pathname !== '/post-ad' && <button type="button" onClick={() => navigate('/post-ad')} className="rounded-xl bg-emerald-600 px-4 py-2.5 font-bold text-white shadow-sm transition hover:bg-emerald-700">{t('post')}</button>}
        </div>
      </div>
    </header>
  )
}

export default Navbar
