import { Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import ListingDetailModal from '../components/ListingDetailModal'
import ListingEditModal from '../components/ListingEditModal'
import ListingGrid from '../components/ListingGrid'
import Navbar from '../components/Navbar'
import { useLanguage } from '../context/LanguageContext'
import { useListings } from '../context/ListingsContext'
import { categories, categorySubcategories } from '../data/categories'

function HomePage() {
  const { listings, loading, error, imagePlaceholder, deleteListing, updateListing } = useListings()
  const { t, categoryLabel } = useLanguage()
  const [query, setQuery] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeSubcategory, setActiveSubcategory] = useState('All')
  const [selectedListing, setSelectedListing] = useState(null)
  const [editingListing, setEditingListing] = useState(null)
  const submitSearch = (event) => {
    event?.preventDefault()
    setSearchTerm(query)
  }
  const selectCategory = (category) => {
    setActiveCategory(category)
    setActiveSubcategory('All')
  }

  const handleDelete = async (listing, managementKey) => {
    try {
      await deleteListing(listing._id || listing.id, managementKey)
      setSelectedListing(null)
      window.alert('Listing deleted successfully.')
    } catch (deleteError) {
      window.alert(deleteError.message)
    }
  }

  const handleEdit = (listing, managementKey) => {
    setEditingListing({ listing, managementKey })
  }

  const saveEdit = async (updatedData) => {
    try {
      const updatedListing = await updateListing(editingListing.listing._id || editingListing.listing.id, updatedData, editingListing.managementKey)
      setEditingListing(null)
      if (selectedListing?._id === updatedListing._id) setSelectedListing(updatedListing)
      window.alert('Listing updated successfully.')
    } catch (updateError) {
      window.alert(updateError.message)
    }
  }

  const filteredListings = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase()
    return listings.filter((listing) => {
      const matchesCategory = activeCategory === 'All' || listing.category === activeCategory
      const matchesSubcategory = !activeSubcategory || activeSubcategory === 'All' || listing.subcategory === activeSubcategory
      const searchableText = [listing.title, listing.locality, listing.location, listing.category, listing.subcategory].filter(Boolean).join(' ').toLowerCase()
      return matchesCategory && matchesSubcategory && (!normalizedQuery || searchableText.includes(normalizedQuery))
    })
  }, [activeCategory, activeSubcategory, listings, searchTerm])

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Navbar />
      <main>
        <section className="bg-[#f8f5ef] px-5 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">{t('browse')}</p>
            <h1 className="mt-4 max-w-3xl font-[Space_Grotesk] text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">{t('heroTitle')}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{t('heroDescription')}</p>
            <form onSubmit={submitSearch} className="mt-8 flex max-w-3xl items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              <Search className="ml-3 shrink-0 text-slate-400" size={21} aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('searchPlaceholder')} aria-label={t('searchPlaceholder')} className="min-w-0 flex-1 border-0 bg-transparent px-1 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:text-base" />
              <button type="submit" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-900 text-white transition hover:bg-emerald-700" aria-label="Search"><Search size={18} /></button>
            </form>
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
            {['All', ...categories].map((category) => <button key={category} type="button" onClick={() => selectCategory(category)} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${activeCategory === category ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-400 hover:text-emerald-700'}`}>{category === 'All' ? t('all') : categoryLabel(category)}</button>)}
          </div>
          {activeCategory !== 'All' && <div className="mt-3 flex gap-2 overflow-x-auto pb-2" role="list" aria-label={`${categoryLabel(activeCategory)} ${t('subcategory')}`}>
            {['All', ...categorySubcategories[activeCategory]].map((subcategory) => <button key={subcategory} type="button" onClick={() => setActiveSubcategory(subcategory)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold transition ${activeSubcategory === subcategory ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-400 hover:text-emerald-700'}`}>{subcategory === 'All' ? t('all') : subcategory}</button>)}
          </div>}
          <div className="mt-8"><ListingGrid listings={filteredListings} loading={loading} error={error} onSelect={setSelectedListing} /></div>
        </section>
      </main>
      {selectedListing && <ListingDetailModal listing={selectedListing} imagePlaceholder={imagePlaceholder} onEdit={handleEdit} onDelete={handleDelete} onClose={() => setSelectedListing(null)} />}
      {editingListing && <ListingEditModal listing={editingListing.listing} onClose={() => setEditingListing(null)} onSave={saveEdit} />}
    </div>
  )
}

export default HomePage
