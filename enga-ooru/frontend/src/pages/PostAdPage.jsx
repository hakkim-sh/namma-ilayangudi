import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, CheckCircle2, AlertCircle, Loader2, X, Plus, Bus } from 'lucide-react'
import Cropper from 'react-easy-crop'
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
      { key: 'Textiles & Clothing', en: 'Textiles & Clothing Store', ta: 'துணிக்கடை' },
      { key: 'Mobile & Electronics', en: 'Mobile & Electronics Shop', ta: 'மொபைல் & எலக்ட்ரானிக்ஸ் கடை' },
      { key: 'Vegetables & Fruits', en: 'Vegetables & Fruits', ta: 'காய்கறி & பழக்கடை' },
      { key: 'Footwear', en: 'Footwear Shop', ta: 'காலணி கடை' },
      { key: 'Other', en: 'Other Shop', ta: 'இதர கடைகள்' }
    ]
  },
  Property: {
    en: 'Property & Second Hand',
    ta: 'நிலம், வீடுகள் & செகண்ட் ஹேண்ட்',
    subcategories: [
      { key: 'Second Hand', en: 'Second Hand Items', ta: 'செகண்ட் ஹேண்ட் பொருட்கள் (Second Hand)' },
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
      { key: 'Pharmacy', en: 'Pharmacy / Medical', ta: 'மருந்தகம் (Pharmacy)' },
      { key: 'Ambulance', en: 'Ambulance Service', ta: 'ஆம்புலன்ஸ்' },
      { key: 'Hospital', en: 'Hospital & Clinic', ta: 'மருத்துவமனை / கிளினிக்' },
      { key: 'Blood Donor', en: 'Blood Donor', ta: 'இரத்த தானம்' },
      { key: 'Other', en: 'Other', ta: 'மற்றவை' }
    ]
  },
  'Food & Dining': {
    en: 'Food & Dining',
    ta: 'உணவு & சிற்றுண்டி',
    subcategories: [
      { key: 'Home Made Food', en: 'Home Made Food / Tiffin', ta: 'வீட்டு உணவு (Home Made)' },
      { key: 'Home Baker', en: 'Home Food & Cake Baker', ta: 'ஹோம் பேக்கர் / கேக்' },
      { key: 'Hotel & Restaurant', en: 'Hotel & Restaurant', ta: 'ஹோட்டல் & உணவகம்' },
      { key: 'Meat Stall / Fresh Meat', en: 'Fresh Meat & Fish Stall', ta: 'கறி & மீன் கடை' },
      { key: 'Other', en: 'Other', ta: 'மற்றவை' }
    ]
  },
  'Home Business': {
    en: 'Home Business',
    ta: 'வீட்டுத் தொழில்',
    subcategories: [
      { key: 'Tailoring & Aari', en: 'Tailoring, Blouse & Aari Work', ta: 'தையல் & ஆரி ஒர்க்' },
      { key: 'Mehandi Design', en: 'Mehandi Artist', ta: 'மெஹந்தி டிசைன்' },
      { key: 'Home Boutique', en: 'Saree & Dress Materials', ta: 'புடவை & ஆடைகள்' },
      { key: 'Handmade Crafts', en: 'Handmade Crafts & Gifts', ta: 'கைவினைப் பொருட்கள்' },
      { key: 'Other', en: 'Other Home Business', ta: 'இதர வீட்டுத் தொழில்' }
    ]
  },
  Delivery: {
    en: 'Delivery Services',
    ta: 'டெலிவரி சேவைகள்',
    subcategories: [
      { key: 'Local Parcel Delivery', en: 'Local Pickup & Drop', ta: 'பார்சல் பிக்கப் & டிராப்' },
      { key: 'Food & Grocery Delivery', en: 'Food / Items Delivery', ta: 'உணவு & மளிகை டெலிவரி' },
      { key: 'Repair Item Delivery', en: 'Shop Pick & Delivery (Mobile/Appliance)', ta: 'பழுது பார்த்தல் பொருள் டெலிவரி' },
      { key: 'Other', en: 'Other Delivery', ta: 'இதர டெலிவரி' }
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
  'Bus Timings': {
    en: 'Bus Timings',
    ta: 'பேருந்து நேரம்',
    subcategories: [
      { key: 'Bus Schedule', en: 'Bus Schedule', ta: 'பேருந்து அட்டவணை' }
    ]
  }
}

// 50 KB - 100 KB Lightweight Image Compressor
const getCroppedImg = (imageSrc, pixelCrop) => {
  return new Promise((resolve) => {
    const image = new Image()
    image.src = imageSrc
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      canvas.width = 600
      canvas.height = 450
      
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'medium'
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        600,
        450
      )
      
      resolve(canvas.toDataURL('image/jpeg', 0.62))
    }
  })
}

function PostAdPage() {
  const navigate = useNavigate()
  const { isTamil } = useLanguage()

  const [formData, setFormData] = useState({
    title: '',
    category: 'Shops',
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
    from: 'Ilayangudi',
    to: '',
    departureTime: '',
    busType: 'Town Bus',
    routeVia: ''
  })

  const [sameAsPhone, setSameAsPhone] = useState(true)
  const [images, setImages] = useState([]) // Up to 3 images

  // Crop Queue for 1 to 3 images
  const [cropQueue, setCropQueue] = useState([])
  const [currentCropIndex, setCurrentCropIndex] = useState(0)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const [isLocating, setIsLocating] = useState(false)
  const [locationSuccess, setLocationSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const isBus = formData.category === 'Bus Timings'

  const handleGetLiveLocation = () => {
    if (!navigator.geolocation) {
      alert(isTamil ? 'உங்கள் உலாவியில் GPS வசதி இல்லை.' : 'Browser does not support GPS location.')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setFormData((prev) => ({ ...prev, latitude, longitude }))
        setIsLocating(false)
        setLocationSuccess(true)
      },
      () => {
        setIsLocating(false)
        alert(isTamil ? 'இருப்பிட அணுகல் மறுக்கப்பட்டது.' : 'Location access denied.')
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
      subcategory: subList[0]?.key || 'Other',
      customSubcategory: ''
    }))
  }

  // 1 to 3 Multi Image Select
  const handleImagesSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setError('')
      const selectedFiles = Array.from(e.target.files)
      const remainingSlots = 3 - images.length

      if (remainingSlots <= 0) {
        setError(isTamil ? 'அதிகபட்சம் 3 படங்கள் மட்டுமே சேர்க்க முடியும்' : 'Maximum 3 photos allowed')
        e.target.value = null
        return
      }

      const filesToProcess = selectedFiles.slice(0, remainingSlots)
      const readers = filesToProcess.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.readAsDataURL(file)
        })
      })

      Promise.all(readers).then((results) => {
        setCropQueue(results)
        setCurrentCropIndex(0)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setCropModalOpen(true)
      })

      e.target.value = null
    }
  }

  const handleCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const handleSaveCroppedImage = async () => {
    try {
      const activeSrc = cropQueue[currentCropIndex]
      const croppedBase64 = await getCroppedImg(activeSrc, croppedAreaPixels)
      setImages((prev) => [...prev, croppedBase64])

      if (currentCropIndex + 1 < cropQueue.length) {
        setCurrentCropIndex((prev) => prev + 1)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
      } else {
        setCropModalOpen(false)
        setCropQueue([])
        setCurrentCropIndex(0)
      }
    } catch {
      setError(isTamil ? 'படத்தை செதுக்குவதில் பிழை ஏற்பட்டது' : 'Error cropping image')
    }
  }

  const handleCancelCrop = () => {
    setCropModalOpen(false)
    setCropQueue([])
    setCurrentCropIndex(0)
  }

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (isBus) {
      if (!formData.to.trim()) {
        return setError(isTamil ? 'பயண சேருமிடம் உள்ளிடவும் (Destination / To)' : 'Please enter destination (To)')
      }
      if (!formData.departureTime.trim()) {
        return setError(isTamil ? 'புறப்படும் நேரத்தை உள்ளிடவும் (Departure Time)' : 'Please enter departure time')
      }
    } else {
      if (!formData.title.trim()) {
        return setError(isTamil ? 'தலைப்பை உள்ளிடவும்' : 'Please enter an ad title')
      }
      if (!formData.phone.trim()) {
        return setError(isTamil ? 'தொலைபேசி எண்ணை உள்ளிடவும்' : 'Please enter phone number')
      }
      if (formData.subcategory === 'Other' && !formData.customSubcategory.trim()) {
        return setError(isTamil ? 'இதர உட்பிரிவு பெயரை உள்ளிடவும்' : 'Please specify other subcategory name')
      }
    }

    if (!formData.pin.trim() || formData.pin.trim().length < 4) {
      return setError(isTamil ? '4 இலக்க ரகசிய PIN எண்ணை உள்ளிடவும்' : 'Enter a 4-digit PIN to edit/delete later')
    }

    setLoading(true)

    const busTitle = isBus 
      ? `${formData.from || 'Ilayangudi'} ➔ ${formData.to} (${formData.departureTime})`
      : formData.title.trim()

    const busDescription = isBus
      ? `Bus Service: ${formData.from} to ${formData.to}. Departs at ${formData.departureTime}. Bus Type: ${formData.busType}. ${formData.routeVia ? `Route via: ${formData.routeVia}` : ''}`
      : formData.description.trim()

    const finalSubcategory = isBus 
      ? 'Bus Schedule'
      : (formData.subcategory === 'Other' && formData.customSubcategory.trim() ? formData.customSubcategory.trim() : formData.subcategory)

    const payload = {
      title: busTitle,
      category: formData.category,
      subcategory: finalSubcategory,
      price: isBus ? '' : formData.price.trim(),
      priceType: isBus ? 'Fixed' : formData.priceType,
      locality: 'Ilayangudi',
      location: isBus ? `${formData.from} ➔ ${formData.to}` : (formData.location.trim() || 'Ilayangudi'),
      latitude: formData.latitude,
      longitude: formData.longitude,
      phone: isBus ? (formData.phone.trim() || '04564265222') : formData.phone.trim(),
      whatsappNumber: isBus ? (formData.phone.trim() || '9104564265222') : (sameAsPhone ? formData.phone.trim() : (formData.whatsappNumber || formData.phone).trim()),
      pin: formData.pin.trim(),
      description: busDescription || 'Local Ilayangudi Listing',
      images: images,
      from: formData.from,
      to: formData.to,
      departureTime: formData.departureTime,
      busType: formData.busType,
      routeVia: formData.routeVia
    }

    const API_URL = 'https://namma-ilayangudi.onrender.com/api/listings'

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await res.json().catch(() => ({}))

      if (res.ok && (result.success || result._id || result.listing || result.data)) {
        setSuccess(true)
        setTimeout(() => navigate('/'), 2000)
      } else {
        const errorMsg = result.errors ? result.errors.join(', ') : result.message
        setError(errorMsg || (isTamil ? 'விளம்பரம் பதிவேற்ற முடியவில்லை.' : 'Failed to submit listing.'))
      }
    } catch (err) {
      console.error(err)
      setError(isTamil ? 'இணைப்பு பிழை. சர்வர் இயங்குகிறதா என பார்க்கவும்.' : 'Network error.')
    } finally {
      setLoading(false)
    }
  }

  const currentCategoryObj = CATEGORY_DEFINITIONS[formData.category]
  const currentSubcategories = currentCategoryObj?.subcategories || [{ key: 'Other', en: 'Other', ta: 'மற்றவை' }]

  return (
    <div className="min-h-screen bg-[#11183c] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 transition hover:text-white">
          <ArrowLeft size={16} />
          <span>{isTamil ? 'முகப்புக்குத் திரும்பு' : 'Back to Home'}</span>
        </Link>

        <div className="mt-5 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">NAMMA OORU</span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {isBus ? (isTamil ? 'பேருந்து நேரம் சேர்க்க' : 'Add Bus Schedule') : (isTamil ? 'புதிய விளம்பரம் பதிவிட' : 'Post New Ad')}
          </h1>
        </div>

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 p-4 text-emerald-200">
            <CheckCircle2 size={24} className="shrink-0 text-emerald-400" />
            <div>
              <p className="font-bold">{isTamil ? 'வெற்றிகரமாக பகிரப்பட்டது!' : 'Submitted Successfully!'}</p>
              <p className="text-xs text-emerald-300">{isTamil ? 'முகப்புக்கு செல்கிறது...' : 'Redirecting to home...'}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 p-4 text-rose-200">
            <AlertCircle size={20} className="shrink-0 text-rose-400" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white p-6 text-slate-900 shadow-2xl sm:p-8">
          
          {/* 1. AD TITLE / SHOP NAME * */}
          {!isBus && (
            <div>
              <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
                AD TITLE / SHOP NAME *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Star Provision &amp; Fancy Store"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          )}

          {/* 2. CATEGORY * */}
          <div>
            <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
              CATEGORY *
            </label>
            <select
              value={formData.category}
              onChange={handleCategoryChange}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              {Object.keys(CATEGORY_DEFINITIONS).map((catKey) => (
                <option key={catKey} value={catKey}>
                  {CATEGORY_DEFINITIONS[catKey].en}
                </option>
              ))}
            </select>
          </div>

          {/* 3. SUBCATEGORY * */}
          {!isBus && (
            <div>
              <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
                SUBCATEGORY *
              </label>
              <select
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value, customSubcategory: '' })}
                className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                {currentSubcategories.map((sub) => (
                  <option key={sub.key} value={sub.key}>
                    {sub.en}
                  </option>
                ))}
              </select>

              {formData.subcategory === 'Other' && (
                <div className="mt-2.5">
                  <label className="block text-xs font-bold text-indigo-600">
                    Specify Other Subcategory / Type your shop type *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Photo Studio, Tailoring, Gift Shop"
                    value={formData.customSubcategory}
                    onChange={(e) => setFormData({ ...formData, customSubcategory: e.target.value })}
                    className="mt-1.5 w-full rounded-2xl border border-indigo-200 bg-indigo-50/40 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              )}
            </div>
          )}

          {/* IF BUS TIMINGS */}
          {isBus ? (
            <div className="space-y-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 sm:p-5">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                <Bus size={18} />
                <span>Bus Route &amp; Timings Details</span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    From (புறப்படும் ஊர்) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    placeholder="e.g. Ilayangudi"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    To (சென்றடையும் இடம்) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    placeholder="e.g. Madurai / Paramakudi"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Departure Time (நேரம்) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.departureTime}
                    onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                    placeholder="e.g. 07:30 AM / 04:15 PM"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Bus Type (பேருந்து வகை)
                  </label>
                  <select
                    value={formData.busType}
                    onChange={(e) => setFormData({ ...formData, busType: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500"
                  >
                    <option value="Town Bus">Town Bus</option>
                    <option value="Ordinary">Ordinary / Moffusil</option>
                    <option value="Express / SETC">Express / SETC</option>
                    <option value="Private Bus">Private Bus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Route Via (செல்லும் வழி - Optional)
                </label>
                <input
                  type="text"
                  value={formData.routeVia}
                  onChange={(e) => setFormData({ ...formData, routeVia: e.target.value })}
                  placeholder="e.g. via Sivagangai, Manamadurai"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          ) : (
            /* NORMAL CATEGORIES FIELDS */
            <>
              {/* 4. PRICE & PRICE TYPE */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
                    PRICE (₹) (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    placeholder="Optional"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
                    PRICE TYPE
                  </label>
                  <select
                    value={formData.priceType}
                    onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="Fixed">Fixed</option>
                    <option value="Negotiable">Negotiable</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Other">Other / Discussion</option>
                  </select>
                </div>
              </div>

              {/* 5. LOCATION & GPS */}
              <div>
                <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
                  LOCATION / LANDMARK (OPTIONAL)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Opposite to Main Post Office"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />

                <div className="mt-2.5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleGetLiveLocation}
                    disabled={isLocating}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                      locationSuccess ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <MapPin size={13} className={locationSuccess ? 'text-emerald-600' : 'text-slate-500'} />
                    {isLocating ? 'Fetching GPS...' : locationSuccess ? 'Live GPS Attached ✓' : 'Attach Live GPS Location'}
                  </button>
                  {locationSuccess && (
                    <button type="button" onClick={handleRemoveLocation} className="text-xs font-semibold text-rose-500">
                      Remove GPS
                    </button>
                  )}
                </div>
              </div>

              {/* 6. PHONE NUMBER */}
              <div>
                <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
                  PHONE NUMBER *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10 digit mobile number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
                
                <div className="mt-2.5 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sameWhatsApp"
                    checked={sameAsPhone}
                    onChange={(e) => setSameAsPhone(e.target.checked)}
                    className="h-4 w-4 rounded accent-indigo-600"
                  />
                  <label htmlFor="sameWhatsApp" className="text-xs font-medium text-slate-600">
                    Same number for WhatsApp
                  </label>
                </div>

                {!sameAsPhone && (
                  <input
                    type="tel"
                    placeholder="Enter WhatsApp Number"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500"
                  />
                )}
              </div>

              {/* 7. DESCRIPTION */}
              <div>
                <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
                  DESCRIPTION *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Details about timings, items..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            </>
          )}

          {/* 8. PHOTOS (1 TO 3 IMAGES - MULTI SELECT & CROP) */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
                PHOTOS (1 to 3 Images - Auto Compressed 50-100 KB)
              </label>
              <span className="text-xs font-semibold text-slate-400">
                {images.length}/3 Added
              </span>
            </div>
            
            <div className="mt-2.5 flex flex-wrap gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative h-24 w-28 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                  <img src={img} alt={`preview ${idx + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white shadow hover:bg-rose-700 active:scale-95"
                  >
                    <X size={14} />
                  </button>
                  <span className="absolute bottom-1 left-1 rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    Optimized ✓
                  </span>
                </div>
              ))}

              {images.length < 3 && (
                <label className="flex h-24 w-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50/60 text-indigo-600 transition hover:bg-indigo-100 active:scale-95">
                  <Plus size={22} />
                  <span className="mt-1 text-xs font-bold">Add Photo</span>
                  <span className="text-[10px] text-slate-500">Pick 1 to 3</span>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleImagesSelect} 
                    className="hidden" 
                  />
                </label>
              )}
            </div>
          </div>

          {/* 9. SET A 4-DIGIT PIN */}
          <div>
            <label className="block text-xs font-bold tracking-wide text-slate-700 uppercase">
              SET A 4-DIGIT PIN (TO EDIT OR DELETE LATER) *
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

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4c63f7] py-4 text-base font-bold text-white shadow-lg transition hover:bg-[#3b51e6] active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <span>{isBus ? 'Publish Bus Schedule →' : 'Submit Listing →'}</span>
            )}
          </button>

        </form>
      </div>

      {/* CROPPER MODAL */}
      {cropModalOpen && cropQueue.length > 0 && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 text-white">
            <div>
              <h3 className="text-sm font-bold">Crop &amp; Optimize Photo</h3>
              <p className="text-xs text-indigo-300">
                Photo {currentCropIndex + 1} of {cropQueue.length} (Auto compressed to ~50-100 KB)
              </p>
            </div>
            <button 
              type="button" 
              onClick={handleCancelCrop} 
              className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-white/20"
            >
              Cancel
            </button>
          </div>

          <div className="relative flex-1 overflow-hidden rounded-2xl bg-black">
            <Cropper
              image={cropQueue[currentCropIndex]}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onCropComplete={handleCropComplete}
              onZoomChange={setZoom}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-white text-xs">
              <span>Zoom:</span>
              <input 
                type="range" 
                min={1} 
                max={3} 
                step={0.1} 
                value={zoom} 
                onChange={(e) => setZoom(Number(e.target.value))} 
                className="w-36 sm:w-48 accent-indigo-500" 
              />
            </div>

            <button 
              type="button" 
              onClick={handleSaveCroppedImage} 
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-700 active:scale-95"
            >
              {currentCropIndex + 1 < cropQueue.length ? 'Crop & Next Photo →' : 'Done & Add to Post ✓'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostAdPage