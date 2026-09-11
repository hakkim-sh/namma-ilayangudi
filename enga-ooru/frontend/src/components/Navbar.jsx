import { MapPin, Plus } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t, toggleLanguage, isTamil } = useLanguage()

  return (
    <header className="relative w-full border-b border-white/10 bg-transparent text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        
        {/* Title Area (Logo Removed) */}
        <a href="/" className="flex min-w-0 flex-col tracking-tight text-white group">
          <span className="text-xl font-bold">
            Namma <span className="text-indigo-300">Ilayangudi</span>
          </span>
          <span className="mt-0.5 text-[11px] font-medium tracking-normal text-indigo-200/70">
            Local marketplace &amp; essential services
          </span>
        </a>

        {/* Right Actions Area */}
        <div className="flex items-center gap-3.5 text-sm">
          <label className="hidden items-center gap-2 font-medium text-indigo-200 sm:flex">
            <MapPin size={15} className="text-indigo-300" />
            <select 
              className="cursor-pointer border-0 bg-transparent font-semibold text-white outline-none" 
              defaultValue="Ilayangudi" 
              aria-label={t('town')}
            >
              <option className="bg-[#11183c] text-white">Ilayangudi</option>
            </select>
          </label>

          <button 
            type="button" 
            onClick={toggleLanguage} 
            className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:border-indigo-300 hover:bg-white/20" 
            aria-label="Language Toggle"
          >
            {isTamil ? 'ENG | தமிழ்' : 'தமிழ் | ENG'}
          </button>

          {location.pathname !== '/post-ad' && (
            <button 
              type="button" 
              onClick={() => navigate('/post-ad')} 
              className="inline-flex items-center gap-1.5 rounded-full bg-[#4c63f7] px-5 py-2 text-sm font-bold text-white shadow-md shadow-indigo-500/30 transition-all hover:bg-[#3b51e6] hover:scale-105 active:scale-95"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Post</span>
            </button>
          )}
        </div>

      </div>
    </header>
  )
}

export default Navbar