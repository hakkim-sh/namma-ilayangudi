import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const CATEGORY_MAP = {
  Property: ['Land', 'Shop', 'House', 'Vehicles', 'Other'],
  Emergency: ['Hospital / Clinic', 'Ambulance', 'Blood Donor', 'Police / Fire', 'Other'],
  Transport: ['Auto Stand', 'Taxi / Cabs', 'Mini Truck / Load Auto', 'Bus Timings', 'Other'],
  Taxi: ['Van/Car', 'Auto', 'Travels/Bus', 'Other'],
  Services: ['Electrician', 'Plumber', 'Carpenter', 'Painter', 'AC / Fridge Repair', 'Tailor', 'Other'],
  Rent: ['House Rent', 'Shop Rent', 'Bachelor Room', 'Commercial Space', 'Other'],
  'Food & Dining': ['Restaurant', 'Tea & Snacks', 'Home Food / Mess', 'Bakery', 'Other'],
  'Bus Timings': ['Local Town Bus', 'Mofussil / Express', 'Other'],
  Other: ['General',]
}

function PostAdPage() {
  const navigate = useNavigate()
  const { isTamil } = useLanguage()

  const [formData, setFormData] = useState({
    title: '',
    category: 'Property',
    customCategory: '',
    subcategory: 'Land',
    customSubcategory: '',
    price: '',
    priceType: 'Fixed',
    locality: '',
    location: '',
    latitude: null,
    longitude: null,
    phone: '',
    whatsappNumber: '',
    pin: '',
    description: '',
  })

  const [sameAsPhone, setSameAsPhone] = useState(true)
  const [images, setImages] = useState([])
  const [isLocating, setIsLocating] = useState(false)
  const [locationSuccess, setLocationSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Live GPS Handlers
  const handleGetLiveLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser does not support GPS location.')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude
        }))
        setIsLocating(false)
        setLocationSuccess(true)
      },
      (err) => {
        setIsLocating(false)
        alert('Location access denied. Street name-ai manual-aa enter pannikkalam.')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleRemoveLocation = () => {
    setFormData((prev) => ({ ...prev, latitude: null, longitude: null }))
    setLocationSuccess(false)
  }

  const handleCategoryChange = (e) => {
    const nextCat = e.target.value
    const subOptions = CATEGORY_MAP[nextCat] || ['Other']
    setFormData((prev) => ({
      ...prev,
      category: nextCat,
      customCategory: '',
      subcategory: subOptions[0],
      customSubcategory: ''
    }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 5) {
      setError(isTamil ? 'அதிகபட்சம் 5 படங்கள் மட்டுமே பதிவேற்ற முடியும்' : 'Maximum 5 images allowed')
      return
    }
    setImages(files)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Basic Validation
    if (!formData.title.trim()) {
      return setError(isTamil ? 'தலைப்பை உள்ளிடவும்' : 'Please enter an ad title')
    }
    if (!formData.phone.trim()) {
      return setError(isTamil ? 'தொலைபேசி எண்ணை உள்ளிடவும்' : 'Please enter phone number')
    }
    if (!formData.pin.trim() || formData.pin.trim().length < 4) {
      return setError(isTamil ? '4 இலக்க ரகசிய PIN எண்ணை உள்ளிடவும்' : 'Enter a 4-digit PIN to edit/delete later')
    }
    if (!formData.description.trim()) {
      return setError(isTamil ? 'விளக்கத்தை உள்ளிடவும்' : 'Please enter a description')
    }

    setLoading(true)

    const resolvedCategory = formData.category === 'Other' && formData.customCategory.trim() 
      ? formData.customCategory.trim() 
      : formData.category

    const resolvedSubcategory = formData.subcategory === 'Other' && formData.customSubcategory.trim() 
      ? formData.customSubcategory.trim() 
      : formData.subcategory

    const finalWhatsapp = sameAsPhone ? formData.phone : (formData.whatsappNumber || formData.phone)

    const payload = new FormData()
    payload.append('title', formData.title.trim())
    payload.append('category', resolvedCategory)
    payload.append('subcategory', resolvedSubcategory)
    payload.append('price', formData.price || '')
    payload.append('priceType', formData.priceType)
    payload.append('locality', formData.locality.trim() || 'Ilayangudi')
    payload.append('location', formData.location.trim())
    if (formData.latitude) payload.append('latitude', formData.latitude)
    if (formData.longitude) payload.append('longitude', formData.longitude)
    payload.append('phone', formData.phone.trim())
    payload.append('whatsappNumber', finalWhatsapp.trim())
    payload.append('pin', formData.pin.trim())
    payload.append('description', formData.description.trim())

    images.forEach((file) => {
      payload.append('images', file)
    })

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        body: payload
      })
      const result = await res.json().catch(() => ({}))

      if (res.ok && (result.success || result._id || result.listing)) {
        setSuccess(true)
        setTimeout(() => {
          navigate('/')
        }, 2500)
      } else {
        setError(result.message || 'Failed to submit listing. Please try again.')
      }
    } catch (err) {
      console.error(err)
      setError('Network error. Check backend connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#11183c] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-2xl">
        
        {/* Top Bar */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          <span>{isTamil ? 'முகப்புக்குத் திரும்பு' : 'Back to Home'}</span>
        </Link>

        <div className="mt-5 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">NAMMA ILAYANGUDI</span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {isTamil ? 'புதிய விளம்பரம் பதிவிட' : 'Post New Ad'}
          </h1>
          <p className="mt-1 text-sm text-indigo-200/70">
            {isTamil ? 'உள்ளூர் சந்தை மற்றும் அத்தியாவசிய சேவைகள்' : 'Local Marketplace & Essential Services'}
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 p-4 text-emerald-200">
            <CheckCircle2 size={24} className="shrink-0 text-emerald-400" />
            <div>
              <p className="font-bold">{isTamil ? 'விளம்பரம் வெற்றிகரமாக பதிவிடப்பட்டது!' : 'Ad Submitted Successfully!'}</p>
              <p className="text-xs text-emerald-300">{isTamil ? 'முகப்பு பக்கத்திற்கு திருப்பிவிடப்படுகிறீர்கள்...' : 'Redirecting to home page...'}</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 p-4 text-rose-200">
            <AlertCircle size={20} className="shrink-0 text-rose-400" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white p-6 text-slate-900 shadow-2xl sm:p-8">
          
          {/* Ad Title */}
          <div>
            <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
              {isTamil ? 'விளம்பர தலைப்பு (Title) *' : 'Ad Title *'}
            </label>
            <input
              type="text"
              required
              placeholder={isTamil ? 'நீங்கள் என்ன வழங்குகிறீர்கள்?' : 'What are you offering?'}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
              {isTamil ? 'வகை (Category) *' : 'Category *'}
            </label>
            <select
              value={formData.category}
              onChange={handleCategoryChange}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              {Object.keys(CATEGORY_MAP).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Custom Category Input if 'Other' selected */}
            {formData.category === 'Other' && (
              <input
                type="text"
                required
                placeholder={isTamil ? 'உங்கள் பிரிவைக் குறிப்பிடவும் (e.g. Books, Furniture)' : 'Specify custom category'}
                value={formData.customCategory}
                onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                className="mt-2.5 w-full rounded-2xl border border-indigo-300 bg-indigo-50/50 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            )}
          </div>

          {/* Subcategory */}
          <div>
            <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
              {isTamil ? 'உட்பிரிவு (Subcategory) *' : 'Subcategory *'}
            </label>
            <select
              value={formData.subcategory}
              onChange={(e) => setFormData({ ...formData, subcategory: e.target.value, customSubcategory: '' })}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              {(CATEGORY_MAP[formData.category] || ['Other']).map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>

            {/* Custom Subcategory Input */}
            {formData.subcategory === 'Other' && (
              <input
                type="text"
                required
                placeholder={isTamil ? 'உட்பிரிவைக் குறிப்பிடவும்' : 'Specify custom subcategory'}
                value={formData.customSubcategory}
                onChange={(e) => setFormData({ ...formData, customSubcategory: e.target.value })}
                className="mt-2.5 w-full rounded-2xl border border-indigo-300 bg-indigo-50/50 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            )}
          </div>

          {/* Price & Price Type */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
                {isTamil ? 'விலை (₹) (விருப்பம்)' : 'Price (₹) (Optional)'}
              </label>
              <input
                type="text"
                placeholder={isTamil ? 'விருப்பம்' : 'Optional'}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
                {isTamil ? 'விலை வகை' : 'Price Type'}
              </label>
              <select
                value={formData.priceType}
                onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                <option value="Fixed">{isTamil ? 'நிலையான விலை (Fixed)' : 'Fixed'}</option>
                <option value="Negotiable">{isTamil ? 'பேசித் தீர்மானிக்கலாம் (Negotiable)' : 'Negotiable'}</option>
                <option value="Monthly">{isTamil ? 'மாதாந்திர வாடகை (Monthly)' : 'Monthly'}</option>
                <option value="Other / Contact for Price">{isTamil ? 'தொடர்புக்கு / நேரடி முன்பதிவு' : 'Other / Contact for Price'}</option>
              </select>
            </div>
          </div>

          {/* Locality / Street */}
          <div>
            <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
              {isTamil ? 'இளையான்குடி பகுதி / தெரு பெயர் *' : 'Ilayangudi Locality / Street name *'}
            </label>
            <input
              type="text"
              required
              placeholder={isTamil ? 'பகுதி அல்லது தெரு பெயர்' : 'Area or street name'}
              value={formData.locality}
              onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* Location & Optional Live GPS */}
          <div>
            <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
              {isTamil ? 'இடம் / அடையாளம் (Optional)' : 'Location / Landmark (Optional)'}
            </label>
            <input
              type="text"
              placeholder="e.g. Near Bus Stand, Kamarajar Road"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

            {/* Live GPS Toggle */}
            <div className="mt-2.5 flex items-center justify-between">
              <button
                type="button"
                onClick={handleGetLiveLocation}
                disabled={isLocating}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                  locationSuccess
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MapPin size={13} className={locationSuccess ? 'text-emerald-600' : 'text-slate-500'} />
                {isLocating
                  ? (isTamil ? 'இருப்பிடம் பெறப்படுகிறது...' : 'Fetching GPS...')
                  : locationSuccess
                  ? (isTamil ? 'நேரலை இருப்பிடம் இணைக்கப்பட்டது ✓' : 'Live GPS Attached ✓')
                  : (isTamil ? 'தற்போதைய இருப்பிடத்தை இணைக்க (Live GPS)' : 'Attach Live GPS Location (Optional)')}
              </button>

              {locationSuccess && (
                <button
                  type="button"
                  onClick={handleRemoveLocation}
                  className="text-xs font-semibold text-rose-500 hover:underline"
                >
                  {isTamil ? 'நீக்கு' : 'Remove GPS'}
                </button>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
                {isTamil ? 'தொலைபேசி எண் (Phone Number) *' : 'Phone Number *'}
              </label>
              <input
                type="tel"
                required
                placeholder="10 digit number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            {/* WhatsApp Match Option */}
            <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600">
              <input
                type="checkbox"
                checked={sameAsPhone}
                onChange={(e) => setSameAsPhone(e.target.checked)}
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>{isTamil ? 'வாட்ஸ்அப் எண் இதுவே (Same number for WhatsApp)' : 'Same number for WhatsApp'}</span>
            </label>

            {!sameAsPhone && (
              <input
                type="tel"
                placeholder={isTamil ? 'வாட்ஸ்அப் எண் உள்ளிடவும்' : 'Enter WhatsApp number'}
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none"
              />
            )}
          </div>

          {/* 4-Digit Secret PIN */}
          <div>
            <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
              {isTamil ? '4 இலக்க ரகசிய PIN (மாற்ற அல்லது நீக்க) *' : 'Set a 4-Digit PIN (to edit or delete this ad later) *'}
            </label>
            <input
              type="password"
              maxLength={6}
              required
              placeholder="e.g. 5892"
              value={formData.pin}
              onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
              {isTamil ? 'படங்கள் (1 முதல் 5 படங்கள்)' : 'Photos (Select 1 to 5 images)'}
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1.5 block w-full text-xs text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
              {isTamil ? 'விளக்கம் (Description) *' : 'Description *'}
            </label>
            <textarea
              required
              rows={4}
              placeholder={isTamil ? 'உங்கள் அண்டை வீட்டாரிடம் இன்னும் கொஞ்சம் சொல்லுங்கள்...' : 'Tell your neighbours a little more...'}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4c63f7] py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-[#3b51e6] active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>{isTamil ? 'பதிவேற்றப்படுகிறது...' : 'Submitting...'}</span>
              </>
            ) : (
              <span>{isTamil ? 'விளம்பரத்தை வெளியிடவும் →' : 'Submit Listing →'}</span>
            )}
          </button>

        </form>

      </div>
    </div>
  )
}

export default PostAdPage