import { Edit3, MapPin, MessageCircle, Phone, Trash2 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function formatPrice(listing) {
  if (listing.priceType === 'Discussion' || listing.priceType === 'Booking' || ['Emergency', 'Transport', 'Services', 'Rent'].includes(listing.category)) return 'Price on Discussion / Direct Booking'
  if (typeof listing.price === 'number' && !Number.isNaN(listing.price)) return `₹${listing.price.toLocaleString('en-IN')}${listing.priceType === 'Monthly' ? ' / month' : ''}`
  if (typeof listing.price === 'string' && /^\d+(\.\d+)?$/.test(listing.price.trim())) return `₹${Number(listing.price).toLocaleString('en-IN')}`
  return listing.price || listing.priceType || 'Price on Discussion'
}

function ListingCard({ listing, imagePlaceholder, onSelect, onEdit, onDelete }) {
  const { t, categoryLabel, subcategoryLabel } = useLanguage()
  const images = listing.images?.length ? listing.images : [listing.image || imagePlaceholder]
  const phoneNumber = listing.phone || listing.whatsappNumber || listing.whatsapp || ''
  const cleanNumber = phoneNumber.replace(/\D/g, '')
  const message = encodeURIComponent(`Hello, I am interested in your listing on Namma Ilayangudi: ${listing.title}`)
  const badge = `${categoryLabel(listing.category)} • ${listing.subcategory ? subcategoryLabel(listing.subcategory) : t('localListing')}`
  const isPriorityCategory = ['Emergency', 'Transport', 'Services'].includes(listing.category)

  return (
    <article className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg" onClick={() => onSelect(listing)} onKeyDown={(event) => event.key === 'Enter' && onSelect(listing)} role="button" tabIndex="0">
      <img src={images[0]} alt={listing.title} className="h-52 w-full object-cover transition group-hover:scale-[1.02]" />
      <div className="p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">{badge}</p>
        <h3 className="mt-2 truncate text-lg font-bold text-slate-900">{listing.title}</h3>
        <p className="mt-2 font-bold text-slate-900">{formatPrice(listing)}</p>
        <p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><MapPin size={14} /> {listing.locality || listing.location}</p>
        <div className="mt-5 grid grid-cols-2 gap-2" onClick={(event) => event.stopPropagation()}>
          <a href={`tel:${listing.phone || listing.whatsappNumber}`} className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white ${isPriorityCategory ? 'bg-slate-900 hover:bg-emerald-700' : 'bg-slate-700 hover:bg-slate-900'}`}><Phone size={17} /> Call Now</a>
          <a href={`https://wa.me/${cleanNumber}?text=${message}`} className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white hover:bg-[#1db954]" target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> {t('chatWhatsApp')}</a>
        </div>
        <div className="mt-3 flex gap-2" onClick={(event) => event.stopPropagation()}>
          <button type="button" onClick={() => onEdit(listing)} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 py-2 text-xs font-bold text-slate-600 hover:border-emerald-500 hover:text-emerald-700"><Edit3 size={14} /> Edit</button>
          <button type="button" onClick={() => onDelete(listing)} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-red-100 py-2 text-xs font-bold text-red-600 hover:bg-red-50"><Trash2 size={14} /> Delete</button>
        </div>
      </div>
    </article>
  )
}

export default ListingCard
