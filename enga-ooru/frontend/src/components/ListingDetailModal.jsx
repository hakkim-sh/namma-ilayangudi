import { useState } from 'react'
import { ChevronLeft, ChevronRight, Edit3, LockKeyhole, MapPin, MessageCircle, Phone, ShieldCheck, X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function ListingDetailModal({ listing, imagePlaceholder, onClose, onEdit }) {
  const { t, categoryLabel, subcategoryLabel } = useLanguage()
  const images = listing.images?.length ? listing.images : [listing.image || imagePlaceholder]
  const [activeImage, setActiveImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [authModal, setAuthModal] = useState({ isOpen: false, action: null, pin: '', error: '' })
  const phoneNumber = listing.phone || listing.whatsappNumber || listing.whatsapp || ''
  const cleanNumber = phoneNumber.replace(/\D/g, '')
  const message = encodeURIComponent(`Hello, I am interested in your listing on Namma Ilayangudi: ${listing.title}`)
  const moveImage = (step) => setActiveImage((current) => (current + step + images.length) % images.length)

  const openAuthModal = (action) => setAuthModal({ isOpen: true, action, pin: '', error: '' })
  const closeAuthModal = () => setAuthModal({ isOpen: false, action: null, pin: '', error: '' })

  const handleAuthSubmit = async (event) => {
    event.preventDefault()
    const enteredKey = authModal.pin.trim()
    if (!enteredKey) return setAuthModal((current) => ({ ...current, error: 'Enter your PIN or Admin Key' }))

    // 1. EDIT ACTION
    if (authModal.action === 'edit') {
      if (enteredKey === 'admin123' || (listing.pin && enteredKey === String(listing.pin).trim())) {
        closeAuthModal()
        onEdit?.(listing, enteredKey)
      } else {
        setAuthModal((current) => ({ ...current, error: 'Incorrect PIN or Admin Key' }))
      }
      return
    }

    // 2. DELETE ACTION
    const targetId = listing._id || listing.id
    try {
      // Direct Master Key Bypass on Frontend
      if (enteredKey === 'admin123') {
        const endpoints = [
          `/api/listings/${targetId}?adminKey=admin123`,
          `http://localhost:5000/api/listings/${targetId}?adminKey=admin123`
        ]

        for (const url of endpoints) {
          try {
            await fetch(url, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json', 'x-admin-key': 'admin123' },
              body: JSON.stringify({ adminKey: 'admin123', pin: 'admin123' })
            })
          } catch (_) {}
        }

        closeAuthModal()
        onClose()
        window.location.reload()
        return
      }

      // Normal User PIN check
      const res = await fetch(`/api/listings/${targetId}?pin=${encodeURIComponent(enteredKey)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-pin': enteredKey },
        body: JSON.stringify({ pin: enteredKey })
      })

      if (res.ok) {
        closeAuthModal()
        onClose()
        window.location.reload()
      } else {
        const errData = await res.json().catch(() => ({}))
        setAuthModal((current) => ({ ...current, error: errData.message || 'Incorrect PIN or Admin Key' }))
      }
    } catch (error) {
      console.error(error)
      setAuthModal((current) => ({ ...current, error: 'Server error deleting listing.' }))
    }
  }

  return (
    <>
      <div 
        className="fixed inset-0 z-30 grid place-items-center bg-indigo-950/60 p-4 backdrop-blur-md" 
        onClick={(event) => event.target === event.currentTarget && onClose()}
      >
        <section 
          className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[28px] border border-blue-50/80 bg-white shadow-2xl shadow-black/30" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-100 text-orange-600"><LockKeyhole size={18} /></span><h2 className="text-base font-bold text-slate-900">Namma Ilayangudi</h2></div>
            <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={t('closeDetails')}><X size={19} /></button>
          </div>
          <div className="bg-[#4c63f7] p-5 text-center text-white">
            <h3 className="text-xl font-bold">{listing.title}</h3>
            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-white/80" aria-hidden="true" />
          </div>
          <div className="relative">
            <div 
              className="mx-4 mt-4 flex h-56 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-slate-100" 
              onClick={() => setLightboxOpen(true)}
            >
              <img src={images[activeImage]} alt={listing.title} className="h-full max-h-56 w-full object-contain" />
            </div>
            
            {images.length > 1 && (
              <>
                <button 
                  type="button" 
                  onClick={(event) => { event.stopPropagation(); moveImage(-1) }} 
                  className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow hover:bg-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  type="button" 
                  onClick={(event) => { event.stopPropagation(); moveImage(1) }} 
                  className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow hover:bg-white"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto px-4 pt-3">
            {images.map((image, index) => (
              <button 
                type="button" 
                key={image} 
                onClick={() => setActiveImage(index)} 
                className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${index === activeImage ? 'border-emerald-500' : 'border-transparent'}`}
              >
                <img src={image} alt={`${listing.title} ${index + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          <div className="px-4 pb-6 pt-4 sm:px-5">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              {categoryLabel(listing.category)} • {listing.subcategory ? subcategoryLabel(listing.subcategory) : t('localListing')}
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">{listing.title}</h2>
            <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
              <MapPin size={16} /> {listing.locality || listing.location}
            </p>
            <p className="mx-0 mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 leading-relaxed">
              {listing.description || t('defaultDescription')}
            </p>
            <p className="mt-4 text-xs text-slate-400">
              {t('posted')} {listing.postedAt || t('recently')}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <a 
                href={`tel:${listing.phone || listing.whatsappNumber}`} 
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-800 to-indigo-900 py-4 text-sm font-bold text-white shadow-sm hover:from-indigo-700 hover:to-indigo-900"
              >
                <Phone size={19} /> Call Now
              </a>
              <a 
                href={`https://wa.me/${cleanNumber}?text=${message}`} 
                className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50 py-4 text-sm font-bold text-emerald-700 hover:bg-[#25D366] hover:text-white" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <MessageCircle size={19} /> {t('chatWhatsApp')}
              </a>
            </div>

            <div className="mt-3">
              <button 
                type="button" 
                onClick={() => openAuthModal('edit')} 
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200"
              >
                <Edit3 size={16} /> Edit
              </button>

            </div>

            <button type="button" onClick={() => openAuthModal('delete')} className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-indigo-600"><ShieldCheck size={14} /> Admin Control</button>
            <p className="mt-2 text-xs text-slate-400">Edit with your post PIN. Deletion is restricted to administrators.</p>
          </div>
        </section>
      </div>

      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4" 
          onClick={() => setLightboxOpen(false)}
        >
          <img src={images[activeImage]} alt={listing.title} className="max-h-full max-w-full object-contain" />
          <button 
            type="button" 
            onClick={() => setLightboxOpen(false)} 
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white text-slate-900 shadow-lg hover:bg-slate-100"
          >
            <X size={22} />
          </button>
        </div>
      )}
      {authModal.isOpen && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-indigo-950/60 p-4 backdrop-blur-md" role="presentation">
          <form onSubmit={handleAuthSubmit} className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><LockKeyhole size={19} /></span>
                <h3 id="auth-modal-title" className="text-lg font-bold text-slate-900">Listing Verification</h3>
              </div>
              <button type="button" onClick={closeAuthModal} className="grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close verification dialog"><X size={19} /></button>
            </div>
            <div className="bg-[#4c63f7] px-5 py-5 text-white sm:px-6">
              <p className="text-sm font-bold uppercase tracking-widest text-indigo-100">Security Check</p>
              <p className="mt-2 text-sm leading-relaxed text-indigo-50">Enter your {authModal.action === 'delete' ? 'Master Admin Key' : '4-digit post PIN or Master Admin Key'} to proceed with {authModal.action}.</p>
            </div>
            <div className="p-5 sm:p-6">
              <input autoFocus type="password" value={authModal.pin} onChange={(event) => setAuthModal((current) => ({ ...current, pin: event.target.value, error: '' }))} placeholder="e.g. Enter pin or Admin key" className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-center text-base tracking-[0.12em] text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" aria-label="PIN or Admin Key" />
              {authModal.error && <p className="mt-3 rounded-full bg-rose-50 px-4 py-2.5 text-center text-sm font-medium text-rose-700">! {authModal.error === 'Incorrect PIN or Admin Key' ? 'Incorrect PIN or Admin Key. Please try again.' : authModal.error}</p>}
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={closeAuthModal} className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
                <button type="submit" className={`rounded-xl px-5 py-2.5 text-sm font-bold shadow-sm transition ${authModal.action === 'delete' ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-[#4c63f7] text-white hover:bg-[#3b51e6]'}`}>Confirm &amp; Continue →</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default ListingDetailModal