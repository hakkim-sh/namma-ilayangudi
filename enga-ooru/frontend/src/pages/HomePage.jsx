import { Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import ListingDetailModal from '../components/ListingDetailModal'
import ListingGrid from '../components/ListingGrid'
import Navbar from '../components/Navbar'
import { useLanguage } from '../context/LanguageContext'
import { useListings } from '../context/ListingsContext'

const categories = ['Property', 'Vehicles', 'Auto & Travel', 'Services', 'Buy & Sell']

function HomePage() {
  const { listings, loading, error, imagePlaceholder } = useListings()
  const { t, categoryLabel } = useLanguage()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedListing, setSelectedListing] = useState(null)

  const filteredListings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return listings.filter((listing) => {
      const matchesCategory = activeCategory === 'All' || listing.category === activeCategory
      const searchableText = [listing.title, listing.category, listing.subcategory, listing.location, listing.description].filter(Boolean).join(' ').toLowerCase()
      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery))
    })
  }, [activeCategory, listings, query])

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Navbar />
      <main>
        <section className="bg-[#f8f5ef] px-5 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">{t('browse')}</p>
            <h1 className="mt-4 max-w-3xl font-[Space_Grotesk] text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">{t('heroTitle')}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{t('heroDescription')}</p>
            <div className="mt-8 flex max-w-3xl items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              <Search className="ml-3 shrink-0 text-slate-400" size={21} aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('searchPlaceholder')} aria-label={t('searchPlaceholder')} className="min-w-0 flex-1 border-0 bg-transparent px-1 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:text-base" />
              <button type="button" onClick={() => setQuery('')} className="hidden rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 sm:block">{t('nearby')}</button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">{t('explore')}</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{t('explore')} <span className="text-slate-400">{t('nearby')}</span></h2>
            </div>
            <SlidersHorizontal className="hidden text-slate-400 sm:block" size={22} aria-hidden="true" />
          </div>
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2" role="list" aria-label={t('category')}>
            {['All', ...categories].map((category) => <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${activeCategory === category ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-400 hover:text-emerald-700'}`}>{category === 'All' ? t('all') : categoryLabel(category)}</button>)}
          </div>
          <div className="mt-8"><ListingGrid listings={filteredListings} loading={loading} error={error} onSelect={setSelectedListing} /></div>
        </section>
      </main>
      {selectedListing && <ListingDetailModal listing={selectedListing} imagePlaceholder={imagePlaceholder} onClose={() => setSelectedListing(null)} />}
    </div>
  )
}

export default HomePage
