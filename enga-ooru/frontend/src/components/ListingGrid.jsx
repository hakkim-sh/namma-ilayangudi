import { SearchX } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import ListingCard from './ListingCard'
import SkeletonCard from './SkeletonCard'

function ListingGrid({ listings, loading, error, onSelect }) {
  const { t } = useLanguage()

  if (loading) {
    return (
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((key) => (
          <SkeletonCard key={key} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="state-message error-state">
        <SearchX size={30} />
        <p>{error}</p>
      </div>
    )
  }

  if (!listings.length) {
    return (
      <div className="state-message">
        <SearchX size={30} />
        <p>{t('noListings')}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing._id || listing.id} listing={listing} onSelect={onSelect} />
      ))}
    </div>
  )
}

export default ListingGrid