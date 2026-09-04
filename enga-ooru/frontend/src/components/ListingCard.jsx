import { MapPin, MessageCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function formatPrice(listing) {
  if (listing.priceType === 'Discussion' || listing.priceType === 'Booking' || listing.category === 'Auto & Travel' || listing.category === 'Services') return 'Price on Discussion / Direct Booking via WhatsApp'
  if (typeof listing.price === 'number' && !Number.isNaN(listing.price)) return `₹${listing.price.toLocaleString('en-IN')}${listing.priceType === 'Monthly' ? ' / month' : ''}`
  if (typeof listing.price === 'string' && /^\d+(\.\d+)?$/.test(listing.price.trim())) return `₹${Number(listing.price).toLocaleString('en-IN')}`
  return listing.price || listing.priceType || 'Price on Discussion'
}

function ListingCard({ listing, imagePlaceholder, onSelect }) {
  const { t, categoryLabel } = useLanguage()
  const images = listing.images?.length ? listing.images : [listing.image || imagePlaceholder]
  const whatsappNumber = (listing.whatsapp || listing.phone || '').replace(/\D/g, '')
  const message = encodeURIComponent(`Hello, I am interested in your listing on Namma Ilayangudi: ${listing.title}`)
  return <article className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg" onClick={() => onSelect(listing)} onKeyDown={(event) => event.key === 'Enter' && onSelect(listing)} role="button" tabIndex="0"><img src={images[0]} alt={listing.title} className="h-52 w-full object-cover transition group-hover:scale-[1.02]" /><div className="p-5"><p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">{categoryLabel(listing.category)} · {listing.subcategory || t('localListing')}</p><h3 className="mt-2 truncate text-lg font-bold text-slate-900">{listing.title}</h3><p className="mt-2 font-bold text-slate-900">{formatPrice(listing)}</p><p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><MapPin size={14} /> {listing.location}</p><a href={`https://wa.me/${whatsappNumber}?text=${message}`} onClick={(event) => event.stopPropagation()} className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white hover:bg-[#1db954]" target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> {t('chatWhatsApp')}</a></div></article>
}

export default ListingCard
