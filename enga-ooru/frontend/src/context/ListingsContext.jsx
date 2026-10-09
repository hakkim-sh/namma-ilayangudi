import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'namma_ilayangudi_listings'
const API_BASE = 'https://namma-ilayangudi.onrender.com'
const API_URL = `${API_BASE}/api/listings`
const imagePlaceholder = 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80'

const ListingsContext = createContext(null)
const normalizeListing = (listing) => ({
  ...listing,
  locality: listing.locality || listing.location,
  location: listing.location || listing.locality,
  phone: listing.phone || listing.whatsappNumber || listing.whatsapp,
  whatsapp: listing.whatsappNumber || listing.whatsapp || listing.phone,
  image: listing.images?.[0] || listing.image || imagePlaceholder
})

function readCache() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored).map(normalizeListing) : []
  } catch {
    return []
  }
}

export function ListingsProvider({ children }) {
  const [listings, setListings] = useState(readCache)
  // Cache-la data irundhaa loading false, illana true
  const [loading, setLoading] = useState(() => readCache().length === 0)

  useEffect(() => {
    let active = true
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) throw new Error('Listings request failed')
        return response.json()
      })
      .then((payload) => {
        if (!active || !Array.isArray(payload.data)) return
        const remoteListings = payload.data.map(normalizeListing)
        setListings(remoteListings)
        setLoading(false)
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteListings))
      })
      .catch(() => {
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const addListing = useCallback(async (listing) => {
    const phone = listing.phone || listing.whatsappNumber || listing.whatsapp
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: listing.title,
        category: listing.category,
        subcategory: listing.subcategory,
        price: listing.price,
        priceType: listing.priceType,
        locality: listing.locality || listing.location,
        location: listing.location,
        phone,
        whatsappNumber: listing.whatsappNumber || listing.whatsapp || phone,
        description: listing.description,
        images: listing.images || [listing.image],
        from: listing.from,
        to: listing.to,
        departureTime: listing.departureTime,
        busType: listing.busType,
        routeVia: listing.routeVia,
        ownerEmail: listing.ownerEmail,
        userId: listing.userId,
        pin: listing.pin
      })
    })
    if (!response.ok) throw new Error('Unable to save listing')
    const payload = await response.json()
    const saved = normalizeListing(payload.data)
    setListings((current) => {
      const updated = [saved, ...current]
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
    return saved
  }, [])

  const deleteListing = useCallback(async (id, managementKey) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: managementKey, adminKey: managementKey })
    })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.message || 'Unable to delete listing')
    setListings((current) => {
      const updated = current.filter((listing) => listing._id !== id && listing.id !== id)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
    return payload
  }, [])

  const updateListing = useCallback(async (id, updatedData, managementKey) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...updatedData, pin: managementKey, adminKey: managementKey })
    })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.message || 'Unable to update listing')
    const updatedListing = normalizeListing(payload.data)
    setListings((current) => {
      const updated = current.map((listing) => (listing._id === id || listing.id === id ? updatedListing : listing))
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
    return updatedListing
  }, [])

  const value = useMemo(
    () => ({ listings, loading, addListing, deleteListing, updateListing, imagePlaceholder }),
    [listings, loading, addListing, deleteListing, updateListing]
  )
  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export function useListings() {
  const context = useContext(ListingsContext)
  if (!context) throw new Error('useListings must be used inside ListingsProvider')
  return context
}