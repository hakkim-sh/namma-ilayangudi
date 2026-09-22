import { ArrowRight, MapPin } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function formatPrice(listing) {
  // Price illana / discussion / services edhuvum card front-la kaatta vendam
  if (!listing.price || listing.priceType === 'Discussion' || listing.priceType === 'Booking' || ['Emergency', 'Transport', 'Services', 'Rent'].includes(listing.category)) {
    return null
  }
  if (typeof listing.price === 'number' && !Number.isNaN(listing.price)) {
    return `₹${listing.price.toLocaleString('en-IN')}${listing.priceType === 'Monthly' ? ' / mo' : ''}`
  }
  if (typeof listing.price === 'string' && /^\d+(\.\d+)?$/.test(listing.price.trim())) {
    return `₹${Number(listing.price).toLocaleString('en-IN')}`
  }
  return null
}

function ListingCard({ listing, imagePlaceholder, onSelect }) {
  const { t, categoryLabel, subcategoryLabel } = useLanguage()
  const images = listing.images?.length ? listing.images : [listing.image || imagePlaceholder]
  const badge = `${categoryLabel(listing.category)} • ${listing.subcategory ? subcategoryLabel(listing.subcategory) : t('localListing')}`
  const isBusTimings = listing.category === 'Bus Timings'
  const schedule = isBusTimings && `${listing.departureTime || ''} | ${listing.from || ''} ➔ ${listing.to || ''} (${listing.busType || ''})${listing.routeVia ? ` - Via ${listing.routeVia}` : ''}`
  const displayPrice = formatPrice(listing)

  return (
    <article 
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[26px] border border-slate-100/90 bg-white shadow-lg shadow-indigo-950/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/15" 
      onClick={() => onSelect(listing)} 
      onKeyDown={(event) => event.key === 'Enter' && onSelect(listing)} 
      role="button" 
      tabIndex="0"
    >
      {/* Image Preview */}
      {!isBusTimings && (listing.images?.length || listing.image) ? (
        <div className="h-48 w-full overflow-hidden bg-slate-100 sm:h-52">
          <img 
            src={images[0]} 
            alt={listing.title} 
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105" 
          />
        </div>
      ) : (
        <div className="grid h-48 place-items-center bg-indigo-50/50 text-5xl sm:h-52" aria-hidden="true">
          ⏰
        </div>
      )}

      {/* Content Section */}
      <div className="flex flex-grow flex-col justify-between p-5">
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="inline-block w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-[#4c63f7]">
              {badge}
            </p>
            {displayPrice && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                {displayPrice}
              </span>
            )}
          </div>

          <h3 className="line-clamp-1 text-lg font-bold leading-snug text-slate-900 group-hover:text-[#4c63f7] transition-colors">
            {listing.title}
          </h3>

          {schedule && (
            <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold leading-5 text-amber-900">
              ⏰ {schedule}
            </p>
          )}

          <p className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin size={14} className="text-slate-400" />
            <span className="line-clamp-1">{listing.location || listing.locality || 'Ilayangudi'}</span>
          </p>
        </div>

        {/* Minimal Modern Card Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {listing.postedAt || t('recently')}
          </span>

          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4c63f7] group-hover:translate-x-1 transition-transform">
            View Details <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </article>
  )
}

export default ListingCard