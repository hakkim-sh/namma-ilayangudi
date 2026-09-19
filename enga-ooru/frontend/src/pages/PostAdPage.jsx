import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const CATEGORY_DEFINITIONS = {
  Shops: {
    en: 'Shops & Business',
    ta: 'கடைகள் & வணிகம்',
    subcategories: [
      { key: 'Grocery', en: 'Grocery / Provision Store', ta: 'மளிகைக் கடை' },
      { key: 'Stationery & Fancy', en: 'Stationery, Books & Fancy', ta: 'புத்தக, பேனா & பேன்சி கடை' },
      { key: 'Hardware & Paint', en: 'Hardware, Electrical & Paint', ta: 'பெயிண்ட் & ஹார்டுவேர் கடை' },
      { key: 'Flower Shop', en: 'Flower Shop', ta: 'பூக்கடை' },
      { key: 'Furniture & Home', en: 'Furniture, Bed & Cupboard', ta: 'பர்னிச்சர், பீரோ & கட்டில் கடை' },
      { key: 'Medical & Pharmacy', en: 'Medical & Pharmacy', ta: 'மருந்தகம் (மெடிக்கல்)' },
      { key: 'Textiles & Clothing', en: 'Textiles & Clothing Store', ta: 'துணிக்கடை' },
      { key: 'Mobile & Electronics', en: 'Mobile & Electronics Shop', ta: 'மொபைல் & எலக்ட்ரானிக்ஸ் கடை' },
      { key: 'Meat Stall / Fresh Meat', en: 'Meat & Fish Stall', ta: 'கறி & மீன் கடை' },
      { key: 'Vegetables & Fruits', en: 'Vegetables & Fruits', ta: 'காய்கறி & பழக்கடை' },
      { key: 'Footwear', en: 'Footwear Shop', ta: 'காலணி கடை' },
      { key: 'Other', en: 'Other Shop', ta: 'இதர கடைகள்' }
    ]
  },
  Property: {
    en: 'Property & Real Estate',
    ta: 'நிலம் & வீடுகள்',
    subcategories: [
      { key: 'Land', en: 'Land / Plot', ta: 'நிலம் / பிளாட்' },
      { key: 'Shop', en: 'Shop', ta: 'கடை' },
      { key: 'House', en: 'House / Villa', ta: 'வீடு' },
      { key: 'Vehicles', en: 'Vehicles', ta: 'வாகனங்கள்' },
      { key: 'Other', en: 'Other', ta: 'மற்றவை' }
    ]
  },
  Emergency: {
    en: 'Emergency & Health',
    ta: 'அவசர தேவைகள் & மருத்துவம்',
    subcategories: [
      { key: 'Ambulance', en: 'Ambulance Service', ta: 'ஆம்புலன்ஸ்' },
      { key: 'Hospital', en: 'Hospital & Clinic', ta: 'மருத்துவமனை / கிளினிக்' },
      { key: 'Blood Donor', en: 'Blood Donor', ta: 'இரத்த தானம்' },
      { key: 'Other', en: 'Other', ta: 'மற்றவை' }
    ]
  },
  Transport: {
    en: 'Transport & Logistics',
    ta: 'சரக்கு போக்குவரத்து',
    subcategories: [
      { key: 'Mini Truck / Tata Ace', en: 'Mini Truck / Tata Ace', ta: 'டாடா ஏஸ் / மினி லாரி' },
      { key: 'Heavy Goods Vehicle', en: 'Heavy Goods Vehicle / Lorry', ta: 'லாரி / கனரக வாகனம்' },
      { key: 'General Transport / Load Auto', en: 'Load Auto / General Transport', ta: 'லோடு ஆட்டோ' },
      { key: 'Other', en: 'Other', ta: 'மற்றவை' }
    ]
  },
  Taxi: {
    en: 'Taxi & Travels',
    ta: 'வாடகை வண்டிகள் & டாக்ஸி',
    subcategories: [
      { key: 'Auto', en: 'Auto', ta: 'ஆட்டோ' },
      { key: 'Car Taxi', en: 'Car Taxi / Cab', ta: 'கார் டாக்ஸி' },
      { key: 'Travels / Van', en: 'Tour Travels / Van', ta: 'டிராவல்ஸ் / வேன்' },
      { key: 'Other', en: 'Other', ta: 'மற்றவை' }
    ]
  },
  Services: {
    en: 'Local Services',
    ta: 'உள்ளூர் சேவைகள்',
    subcategories: [
      { key: 'AC Service', en: 'AC Service & Repair', ta: 'ஏசி சர்வீஸ்' },
      { key: 'Mobile Service', en: 'Mobile Service', ta: 'மொபைல் பழுது பார்த்தல்' },
      { key: 'TV Repair', en: 'TV Repair', ta: 'டிவி பழுது பார்த்தல்' },
      { key: 'Washing Machine', en: 'Washing Machine Service', ta: 'வாஷிங் மெஷின் சர்வீஸ்' },
      { key: 'Electrician', en: 'Electrician', ta: 'எலக்ட்ரீஷியன்' },
      { key: 'Plumber', en: 'Plumber', ta: 'பிளம்பர்' },
      { key: 'Education & Tuition', en: 'Education & Tuition', ta: 'டியூஷன் & கல்வி' },
      { key: 'Daily Labour & Shifting', en: 'House Shifting & Daily Labour', ta: 'ஷிப்டிங் & தினசரி ஆட்கள்' },
      { key: 'Other', en: 'Other', ta: 'மற்றவை' }
    ]
  },
  Rent: {
    en: 'House & Shop Rent',
    ta: 'வாடகைக்கு',
    subcategories: [
      { key: 'Shop Rent', en: 'Shop for Rent', ta: 'கடை வாடகைக்கு' },
      { key: 'House Rent', en: 'House for Rent', ta: 'வீடு வாடகைக்கு' },
      { key: 'Things / Equipment Rent', en: 'Equipment & Things for Rent', ta: 'பொருட்கள் வாடகைக்கு' },
      { key: 'Other', en: 'Other', ta: 'மற்றவை' }
    ]
  },
  'Food & Dining': {
    en: 'Food & Dining',
    ta: 'உணவு & சிற்றுண்டி',
    subcategories: [
      { key: 'Home Baker', en: 'Home Food & Cake Baker', ta: 'ஹோம் பேக்கர் / வீட்டு உணவு' },
      { key: 'Hotel & Restaurant', en: 'Hotel & Restaurant', ta: 'ஹோட்டல் & உணவகம்' },
      { key: 'Meat Stall / Fresh Meat', en: 'Fresh Meat Stall', ta: 'கறிக்கடை' },
      { key: 'Other', en: 'Other', ta: 'மற்றவை' }
    ]
  },
  'Bus Timings': {
    en: 'Bus Timings',
    ta: 'பேருந்து நேரம்',
    subcategories: [
      { key: 'Bus Schedule', en: 'Bus Schedule & Route', ta: 'பேருந்து அட்டவணை' }
    ]
  }
}

// Canvas-based image compressor: Converts any MB photo to ~150-250KB Base64
const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.7) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedBase64)
      }
    }
  })
}

function PostAdPage() {
  const navigate = useNavigate()
  const { isTamil } = useLanguage()

  const [formData, setFormData] = useState({
    title: '',
    category: 'Shops',
    customCategory: '',
    subcategory: 'Grocery',
    customSubcategory: '',
    price: '',
    priceType: 'Fixed',
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
  const [compressing, setCompressing] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [locationSuccess, setLocationSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleGetLiveLocation = () => {
    if (!navigator.geolocation) {
      alert(isTamil ? 'உங்கள் உலாவியில் GPS வசதி இல்லை.' : 'Browser does not support GPS location.')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude
        }))
        setIsLocating(false)
        setLocationSuccess(true)
      },
      () => {
        setIsLocating(false)
        alert(isTamil ? 'இருப்பிட அணுகல் மறுக்கப்பட்டது. முகவரியை நேரடியாக எழுதவும்.' : 'Location access denied. Please enter address manually.')
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
    const subList = CATEGORY_DEFINITIONS[nextCat]?.subcategories || []
    setFormData((prev) => ({
      ...prev,
      category: nextCat,
      customCategory: '',
      subcategory: subList[0]?.key || 'Other',
      customSubcategory: ''
    }))
  }

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 5) {
      setError(isTamil ? 'அதிகபட்சம் 5 படங்கள் மட்டுமே பதிவேற்ற முடியும்' : 'Maximum 5 images allowed')
      return
    }

    try {
      setCompressing(true)
      setError('')
      const compressedList = await Promise.all(
        files.map((file) => compressImage(file))
      )
      setImages(compressedList)
    } catch {
      setError(isTamil ? 'படங்களை சுருக்குவதில் பிழை ஏற்பட்டது' : 'Error compressing images')
    } finally {
      setCompressing(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

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

    const payload = {
      title: formData.title.trim(),
      category: resolvedCategory,
      subcategory: resolvedSubcategory,
      price: formData.price ? formData.price.trim() : '',
      priceType: formData.priceType,
      locality: 'Ilayangudi',
      location: formData.location.trim(),
      latitude: formData.latitude,
      longitude: formData.longitude,
      phone: formData.phone.trim(),
      whatsappNumber: finalWhatsapp.trim(),
      pin: formData.pin.trim(),
      description: formData.description.trim(),
      images: images
    }

    try {
     const API_BASE = window.location.hostname === 'localhost' 
        ? '' 
        : 'https://namma-ilayangudi.onrender.com'

      const res = await fetch(`${API_BASE}/api/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      const result = await res.json().catch(() => ({}))

      if (res.ok && (result.success || result._id || result.listing)) {
        setSuccess(true)
        setTimeout(() => {
          navigate('/')
        }, 2200)
      } else {
        const errorMsg = result.errors ? result.errors.join(', ') : result.message
        setError(errorMsg || (isTamil ? 'விளம்பரம் பதிவேற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.' : 'Failed to submit listing.'))
      }
    } catch (err) {
      console.error(err)
      setError(isTamil ? 'இணைப்பு பிழை. சர்வர் இயங்குகிறதா என சரிபார்க்கவும்.' : 'Network error. Check backend connection.')
    } finally {
      setLoading(false)
    }
  }

  const currentCategoryObj = CATEGORY_DEFINITIONS[formData.category]
  const currentSubcategories = currentCategoryObj?.subcategories || [{ key: 'Other', en: 'Other', ta: 'மற்றவை' }]

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
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">NAMMA OORU</span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {isTamil ? 'புதிய விளம்பரம் பதிவிட' : 'Post New Ad'}
          </h1>
          <p className="mt-1 text-sm text-indigo-200/70">
            {isTamil ? 'உள்ளூர் கடைகள், சேவைகள் மற்றும் அத்தியாவசிய தகவல்கள்' : 'Local Marketplace & Essential Services'}
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
              {isTamil ? 'விளம்பரம் / கடையின் பெயர் *' : 'Ad Title / Shop Name *'}
            </label>
            <input
              type="text"
              required
              placeholder={isTamil ? 'எ.கா: ரோஜா மலர் அங்காடி / ராஜா எலக்ட்ரிக்கல்ஸ்' : 'e.g. Star Provision & Fancy Store'}
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
              {Object.keys(CATEGORY_DEFINITIONS).map((catKey) => (
                <option key={catKey} value={catKey}>
                  {isTamil ? CATEGORY_DEFINITIONS[catKey].ta : CATEGORY_DEFINITIONS[catKey].en}
                </option>
              ))}
            </select>
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
              {currentSubcategories.map((sub) => (
                <option key={sub.key} value={sub.key}>
                  {isTamil ? sub.ta : sub.en}
                </option>
              ))}
            </select>

            {formData.subcategory === 'Other' && (
              <input
                type="text"
                required
                placeholder={isTamil ? 'உங்கள் கடையின் அல்லது சேவையின் வகையை உள்ளிடவும்' : 'Specify custom subcategory'}
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
                <option value="Other / Contact for Price">{isTamil ? 'நேரடித் தொடர்பு / விலை தெரிந்து கொள்ள' : 'Contact for Price'}</option>
              </select>
            </div>
          </div>

          {/* Location & Optional Live GPS */}
          <div>
            <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
              {isTamil ? 'அடையாளம் / முழு முகவரி (விருப்பம்)' : 'Location / Landmark (Optional)'}
            </label>
            <input
              type="text"
              placeholder={isTamil ? 'எ.கா: பெரிய பள்ளிவாசல் எதிரில்' : 'e.g. Opposite to Main Post Office'}
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

            {/* Live GPS Button */}
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
                  : (isTamil ? 'கடை / வீட்டின் GPS இருப்பிடத்தை இணைக்க' : 'Attach Live GPS Location (Optional)')}
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
                placeholder="10 digit mobile number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

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
              {isTamil ? '4 இலக்க ரகசிய PIN (மாற்ற அல்லது நீக்க) *' : 'Set a 4-Digit PIN (to edit or delete later) *'}
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

          {/* Photo Upload with auto-compress feedback */}
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
            {compressing && (
              <p className="mt-1.5 text-xs text-indigo-600 animate-pulse font-medium">
                {isTamil ? 'படங்கள் சுருக்கப்பட்டு தயாராகிறது...' : 'Compressing images to lightweight format...'}
              </p>
            )}
            {images.length > 0 && !compressing && (
              <p className="mt-1.5 text-xs text-emerald-600 font-semibold">
                ✓ {images.length} {isTamil ? 'படங்கள் தயார்' : 'images compressed & ready'}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
              {isTamil ? 'விளக்கம் (Description) *' : 'Description *'}
            </label>
            <textarea
              required
              rows={4}
              placeholder={isTamil ? 'கடை திறக்கும் நேரம், கிடைக்கும் பொருட்கள் அல்லது சேவைகள் பற்றிய விவரம்...' : 'Details about timings, available products or services...'}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || compressing}
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