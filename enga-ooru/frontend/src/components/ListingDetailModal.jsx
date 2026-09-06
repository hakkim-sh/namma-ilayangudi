import { useState } from 'react'
import { ChevronLeft, ChevronRight, MapPin, MessageCircle, Phone, X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function ListingDetailModal({ listing, imagePlaceholder, onClose }) {
  const { t, categoryLabel } = useLanguage()
  const images = listing.images?.length ? listing.images : [listing.image || imagePlaceholder]
  const [activeImage, setActiveImage] = useState(0)
  const phoneNumber = listing.phone || listing.whatsappNumber || listing.whatsapp || ''
  const cleanNumber = phoneNumber.replace(/\D/g, '')
  const message = encodeURIComponent(`Hello, I am interested in your listing on Namma Ilayangudi: ${listing.title}`)
  const moveImage = (step) => setActiveImage((current) => (current + step + images.length) % images.length)

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <div className="relative">
          <img src={images[activeImage]} alt={listing.title} className="h-64 w-full object-cover sm:h-80" />
          <button type="button" onClick={onClose} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-slate-700 shadow" aria-label={t('closeDetails')}><X size={20} /></button>
          {images.length > 1 && <><button type="button" onClick={() => moveImage(-1)} className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow" aria-label={t('previousImage')}><ChevronLeft size={20} /></button><button type="button" onClick={() => moveImage(1)} className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow" aria-label={t('nextImage')}><ChevronRight size={20} /></button></>}
        </div>
        <div className="flex gap-2 overflow-x-auto p-4">{images.map((image, index) => <button type="button" key={image} onClick={() => setActiveImage(index)} className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${index === activeImage ? 'border-emerald-500' : 'border-transparent'}`}><img src={image} alt={`${listing.title} ${index + 1}`} className="h-full w-full object-cover" /></button>)}</div>
        <div className="px-5 pb-6 sm:px-7"><p className="text-xs font-bold uppercase tracking-widest text-emerald-600">{categoryLabel(listing.category)} · {listing.subcategory || t('localListing')}</p><h2 id="detail-title" className="mt-2 text-2xl font-bold text-slate-900">{listing.title}</h2><p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-600"><MapPin size={16} /> {listing.locality || listing.location}</p><p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-600">{listing.description || t('defaultDescription')}</p><p className="mt-4 text-xs text-slate-400">{t('posted')} {listing.postedAt || t('recently')}</p><div className="mt-6 grid grid-cols-2 gap-2"><a href={`tel:${listing.phone || listing.whatsappNumber}`} className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-4 text-sm font-bold text-white hover:bg-emerald-700"><Phone size={19} /> Call Now</a><a href={`https://wa.me/${cleanNumber}?text=${message}`} className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-4 text-sm font-bold text-white hover:bg-[#1db954]" target="_blank" rel="noopener noreferrer"><MessageCircle size={19} /> {t('chatWhatsApp')}</a></div></div>
      </section>
    </div>
  )
}

export default ListingDetailModal
