import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'namma_ilayangudi_listings'
const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/listings`;

const sampleListings = [
  { id: 1, title: 'Bright 2BHK near the main market', category: 'Property', subcategory: 'House Rent', price: 14000, priceType: 'Monthly', locality: 'Sivagangai Road, Ilayangudi', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80', whatsappNumber: '919876543210', description: 'A bright, airy home with easy access to shops and schools.', postedAt: 'Sample listing' },
  { id: 2, title: 'Trusted electrician for home repairs', category: 'Services', subcategory: 'Electrician', price: 'Price on Discussion', priceType: 'Discussion', locality: 'Nehru Bazaar, Ilayangudi', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80', whatsappNumber: '919876543211', description: 'Quick and reliable electrical work for homes and small businesses.', postedAt: 'Sample listing' },
]

const ListingsContext = createContext(null)
const normalizeListing = (listing) => ({ ...listing, location: listing.locality || listing.location, phone: listing.whatsappNumber || listing.phone, whatsapp: listing.whatsappNumber || listing.whatsapp, image: listing.images?.[0] || listing.image || imagePlaceholder })

function readCache() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored).map(normalizeListing) : sampleListings
  } catch {
    return sampleListings
  }
}

export function ListingsProvider({ children }) {
  const [listings, setListings] = useState(readCache)

  useEffect(() => {
    let active = true
    fetch(API_URL).then((response) => { if (!response.ok) throw new Error('Listings request failed'); return response.json() }).then((payload) => {
      if (!active || !Array.isArray(payload.data)) return
      const remoteListings = payload.data.map(normalizeListing)
      setListings(remoteListings)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteListings))
    }).catch(() => { /* Cached listings keep the home feed usable while the API is unavailable. */ })
    return () => { active = false }
  }, [])

  const addListing = async (listing) => {
    const response = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: listing.title, category: listing.category, subcategory: listing.subcategory, price: listing.price, priceType: listing.priceType, locality: listing.locality || listing.location, whatsappNumber: listing.whatsappNumber || listing.whatsapp || listing.phone, description: listing.description, images: listing.images || [listing.image] }) })
    if (!response.ok) throw new Error('Unable to save listing')
    const payload = await response.json()
    const saved = normalizeListing(payload.data)
    setListings((current) => { const updated = [saved, ...current]; window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); return updated })
    return saved
  }

  const value = useMemo(() => ({ listings, addListing, imagePlaceholder }), [listings])
  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export function useListings() {
  const context = useContext(ListingsContext)
  if (!context) throw new Error('useListings must be used inside ListingsProvider')
  return context
}
