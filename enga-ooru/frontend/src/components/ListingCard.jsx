import { MapPin, MessageCircle, Phone } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function formatPrice(listing) {
  if (listing.priceType === 'Discussion' || listing.priceType === 'Booking' || ['Emergency', 'Transport', 'Services', 'Rent'].includes(listing.category)) return 'Price on Discussion / Direct Booking'
  if (typeof listing.price === 'number' && !Number.isNaN(listing.price)) return `₹${listing.price.toLocaleString('en-IN')}${listing.priceType === 'Monthly' ? ' / month' : ''}`
  if (typeof listing.price === 'string' && /^\d+(\.\d+)?$/.test(listing.price.trim())) return `₹${Number(listing.price).toLocaleString('en-IN')}`
  return listing.price || listing.priceType || 'Price on Discussion'
}

function ListingCard({ listing, imagePlaceholder, onSelect }) {
  const { t, categoryLabel, subcategoryLabel } = useLanguage()
  const images = listing.images?.length ? listing.images : [listing.image || imagePlaceholder]
  const phoneNumber = listing.phone || listing.whatsappNumber || listing.whatsapp || ''
  const cleanNumber = phoneNumber.replace(/\D/g, '')
  const message = encodeURIComponent(`Hello, I am interested in your listing on Namma Ilayangudi: ${listing.title}`)
  const badge = `${categoryLabel(listing.category)} • ${listing.subcategory ? subcategoryLabel(listing.subcategory) : t('localListing')}`
  const isPriorityCategory = ['Emergency', 'Transport', 'Services'].includes(listing.category)
  const isBusTimings = listing.category === 'Bus Timings'
  const schedule = isBusTimings && `${listing.departureTime || ''} | ${listing.from || ''} ➔ ${listing.to || ''} (${listing.busType || ''})${listing.routeVia ? ` - Via ${listing.routeVia}` : ''}`

  return (
    <article className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg" onClick={() => onSelect(listing)} onKeyDown={(event) => event.key === 'Enter' && onSelect(listing)} role="button" tabIndex="0">
      {!isBusTimings && (listing.images?.length || listing.image) ? <img src={images[0]} alt={listing.title} className="h-52 w-full object-cover transition group-hover:scale-[1.02]" /> : <div className="grid h-52 place-items-center bg-emerald-50 text-5xl" aria-hidden="true">⏰</div>}
      <div className="p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">{badge}</p>
        <h3 className="mt-2 truncate text-lg font-bold text-slate-900">{listing.title}</h3>
        {schedule ? <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm font-bold leading-5 text-amber-900">⏰ {schedule}</p> : <p className="mt-2 font-bold text-slate-900">{formatPrice(listing)}</p>}
        <p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><MapPin size={14} /> {listing.location || listing.locality}</p>
        <div className="mt-5 grid grid-cols-2 gap-2" onClick={(event) => event.stopPropagation()}>
          <a href={`tel:${listing.phone || listing.whatsappNumber}`} className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white ${isPriorityCategory ? 'bg-slate-900 hover:bg-emerald-700' : 'bg-slate-700 hover:bg-slate-900'}`}><Phone size={17} /> Call Now</a>
          <a href={`https://wa.me/${cleanNumber}?text=${message}`} className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white hover:bg-[#1db954]" target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> {t('chatWhatsApp')}</a>
        </div>
      </div>
    </article>
  )
}

export default ListingCard
