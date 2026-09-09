import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useLanguage } from '../context/LanguageContext'
import { useListings } from '../context/ListingsContext'
import { categories, categorySubcategories, directContactCategories } from '../data/categories'

const initialForm = { title: '', category: 'Property', customCategory: '', subcategory: 'Land', customSubcategory: '', price: '', priceType: 'Fixed', locality: '', location: '', phone: '', description: '', from: 'Ilayangudi', to: '', departureTime: '', busType: 'Government', routeVia: '', pin: '' }

function PostAdPage() {
  const navigate = useNavigate()
  const { t, categoryLabel, subcategoryLabel, priceTypeLabel } = useLanguage()
  const { addListing } = useListings()
  const [form, setForm] = useState(initialForm)
  const [images, setImages] = useState([])
  const [optimizedSizes, setOptimizedSizes] = useState([])
  const [cropSource, setCropSource] = useState(null)
  const [cropQueue, setCropQueue] = useState([])
  const [cropIndex, setCropIndex] = useState(0)
  const [error, setError] = useState('')
  const isDirectBooking = directContactCategories.includes(form.category)
  const isBusTimings = form.category === 'Bus Timings'

  const update = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value, ...(name === 'category' && value !== 'Other' ? { subcategory: categorySubcategories[value]?.[0] || 'Other', customSubcategory: '' } : {}) }))
    setError('')
  }

  const categoryValue = form.category === 'Other' ? form.customCategory.trim() : form.category
  const subcategoryValue = form.subcategory === 'Other' ? form.customSubcategory.trim() : form.subcategory

  const readImage = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Unable to read image'))
    reader.onload = () => {
      resolve(String(reader.result))
    }
    reader.readAsDataURL(file)
  })

  const compressImage = (source) => new Promise((resolve, reject) => {
    const image = new Image()
    image.onerror = () => reject(new Error('Unable to decode image'))
    image.onload = () => {
      const scale = Math.min(1, 800 / image.width, 800 / image.height)
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(image.width * scale))
      canvas.height = Math.max(1, Math.round(image.height * scale))
      const context = canvas.getContext('2d')
      if (!context) return reject(new Error('Canvas is unavailable'))
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.65)
      const sizeKb = dataUrl.length / 1024
      if (sizeKb > 120) return reject(new Error('This image is still too large after compression. Please choose a different image.'))
      if (sizeKb <= 60 || sizeKb >= 100) return reject(new Error('The compressed image must be between 60KB and 100KB. Please choose a clearer image.'))
      resolve({ dataUrl, sizeKb: Math.ceil(sizeKb) })
    }
    image.src = source
  })

  const handleImages = (event) => {
    const selectedFiles = Array.from(event.target.files || [])
    if (selectedFiles.some((file) => file.size > 10 * 1024 * 1024)) {
      window.alert('Each image must be 10MB or smaller.')
      event.target.value = ''
      return
    }
    const files = selectedFiles.slice(0, 5)
    if (!files.length) return
    if (event.target.files.length > 5) setError(t('errors.photos'))
    setImages([])
    setOptimizedSizes([])
    setCropQueue(files)
    setCropIndex(0)
    readImage(files[0]).then(setCropSource).catch(() => setError('Unable to read that image. Please try another photo.'))
  }

  const cancelCrop = () => {
    setCropSource(null)
    setCropQueue([])
    setCropIndex(0)
  }

  const confirmCrop = () => {
    const image = new Image()
    image.onerror = () => setError('Unable to crop that image. Please try another photo.')
    image.onload = () => {
      const side = Math.min(image.width, image.height)
      const sourceX = (image.width - side) / 2
      const sourceY = (image.height - side) / 2
      const canvas = document.createElement('canvas')
      canvas.width = side
      canvas.height = side
      const context = canvas.getContext('2d')
      if (!context) return setError('Canvas is unavailable in this browser.')
      context.drawImage(image, sourceX, sourceY, side, side, 0, 0, side, side)
      compressImage(canvas.toDataURL('image/jpeg', 1)).then(({ dataUrl, sizeKb }) => {
        const nextImages = [...images, dataUrl]
        const nextSizes = [...optimizedSizes, sizeKb]
        setImages(nextImages)
        setOptimizedSizes(nextSizes)
        if (cropIndex + 1 < cropQueue.length) {
          const nextIndex = cropIndex + 1
          setCropIndex(nextIndex)
          readImage(cropQueue[nextIndex]).then(setCropSource).catch(() => setError('Unable to read that image. Please try another photo.'))
        } else {
          setCropSource(null)
          setCropQueue([])
        }
      }).catch((compressionError) => setError(compressionError.message))
    }
    image.src = cropSource
  }

  const submit = async (event) => {
    event.preventDefault()
    const phone = form.phone.replace(/\D/g, '')
    if (!/^\d{10}$/.test(phone)) return setError(t('errors.number'))
    if (!isBusTimings && !images.length) return setError(t('errors.requiredPhoto'))
    if (isBusTimings && (!form.title.trim() || !form.departureTime.trim() || !form.busType.trim())) return setError('Please complete the bus timing details.')
    if (!categoryValue || !subcategoryValue) return setError('Please enter your custom category and subcategory.')
    if (!/^\d{4}$/.test(form.pin)) return setError('Please set a 4-digit PIN to manage this ad later.')
    const price = isBusTimings || !form.price || form.priceType === 'Other' ? 'Price on Discussion' : Number(form.price)
    const busDescription = isBusTimings ? `${form.title}: ${form.departureTime}` : form.description
    try {
      await addListing({ ...form, id: Date.now(), category: categoryValue, subcategory: subcategoryValue, phone, whatsappNumber: phone, images, image: images[0], price, priceType: isBusTimings || !form.price || form.priceType === 'Other' ? 'Discussion' : form.priceType, description: busDescription || 'Bus timing information', locality: isBusTimings ? form.title : form.locality, from: isBusTimings ? form.title : form.from, to: isBusTimings ? form.title : form.to, postedAt: 'Just now' })
    } catch {
      setError(t('errors.save'))
      return
    }
    window.alert(t('postedSuccess'))
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <Link to="/" className="mb-8 inline-block text-sm font-bold text-emerald-600 hover:underline">{t('backHome')}</Link>
        <div className="mb-8"><p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-emerald-600">Namma Ilayangudi</p><h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t('postAdTitle')}</h1><p className="mt-3 text-sm leading-6 text-slate-500">{t('marketplaceDescription')}</p></div>
        <form onSubmit={submit} className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-8">
          {!isBusTimings && <label className="grid gap-2 text-xs font-bold text-slate-600 sm:col-span-2">{t('adTitle')}<input required name="title" value={form.title} onChange={update} placeholder={t('whatOffering')} className="rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-emerald-500" /></label>}
          <label className="grid gap-2 text-xs font-bold text-slate-600">{t('category')}<select name="category" value={form.category} onChange={update} className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal outline-none">{[...categories, 'Other'].map((category) => <option key={category} value={category}>{category === 'Other' ? 'Other' : categoryLabel(category)}</option>)}</select>{form.category === 'Other' && <input required name="customCategory" value={form.customCategory} onChange={update} placeholder="Type your category" className="rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-emerald-500" />}</label>
          <label className="grid gap-2 text-xs font-bold text-slate-600">{t('subcategory')}<select required name="subcategory" value={form.subcategory} onChange={update} className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal outline-none">{[...(categorySubcategories[form.category] || []), 'Other'].map((subcategory) => <option key={subcategory} value={subcategory}>{subcategory === 'Other' ? 'Other' : subcategoryLabel(subcategory)}</option>)}</select>{form.subcategory === 'Other' && <input required name="customSubcategory" value={form.customSubcategory} onChange={update} placeholder="Type your subcategory" className="rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-emerald-500" />}</label>
          {!isBusTimings && <><label className="grid gap-2 text-xs font-bold text-slate-600">{t('price')} (Optional)<input type="number" min="0" name="price" value={form.price} onChange={update} disabled={isDirectBooking} placeholder={t('optional')} className="rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none disabled:bg-slate-100" /></label><label className="grid gap-2 text-xs font-bold text-slate-600">{t('priceType')}<select name="priceType" value={form.priceType} onChange={update} className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal outline-none">{['Fixed', 'Negotiable', 'Monthly', 'Other'].map((priceType) => <option key={priceType} value={priceType}>{priceType === 'Other' ? 'Other / Contact for Price' : priceTypeLabel(priceType)}</option>)}</select></label></>}
          {!isBusTimings && <><label className="grid gap-2 text-xs font-bold text-slate-600 sm:col-span-2">{t('locality')}<input required name="locality" value={form.locality} onChange={update} placeholder={t('area')} className="rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-emerald-500" /></label><label className="grid gap-2 text-xs font-bold text-slate-600 sm:col-span-2">Location / இடம் (Optional)<input name="location" value={form.location} onChange={update} placeholder="Location / இடம் (Optional)" className="rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-emerald-500" /></label></>}
          {isBusTimings && <div className="grid gap-5 sm:col-span-2 sm:grid-cols-2"><label className="grid gap-2 text-xs font-bold text-slate-600 sm:col-span-2">Route / Bus Name<input required name="title" value={form.title} onChange={update} placeholder="Ilayangudi to Madurai" className="rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-emerald-500" /></label><label className="grid gap-2 text-xs font-bold text-slate-600">Departure Time / Frequency<input required name="departureTime" value={form.departureTime} onChange={update} placeholder="Every 30 mins, 6:00 AM - 9:00 PM" className="rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-emerald-500" /></label><label className="grid gap-2 text-xs font-bold text-slate-600">Bus Type<select required name="busType" value={form.busType} onChange={update} className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal outline-none"><option>Government</option><option>Private</option></select></label></div>}
          <label className="grid gap-2 text-xs font-bold text-slate-600 sm:col-span-2">{t('phone')}<input required type="tel" name="phone" value={form.phone} onChange={update} inputMode="numeric" maxLength="10" placeholder={t('tenDigit')} className="rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-emerald-500" /></label>
          <label className="grid gap-2 text-xs font-bold text-slate-600 sm:col-span-2">Set a 4-Digit PIN (to edit or delete this ad later)<input required type="tel" name="pin" value={form.pin} onChange={update} maxLength="4" pattern="[0-9]*" inputMode="numeric" placeholder="e.g. 5892" className="rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-emerald-500" /></label>
          {!isBusTimings && <label className="grid gap-2 text-xs font-bold text-slate-600 sm:col-span-2">{t('photos')} <span className="font-normal text-slate-500">{t('selectPhotos')}<input required type="file" multiple accept="image/*" onChange={handleImages} className="mt-2 w-full rounded-xl border border-dashed border-slate-300 p-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:font-bold" /></span></label>}
          {images.length > 0 && <div className="grid grid-cols-3 gap-3 sm:col-span-2 sm:grid-cols-5">{images.map((image, index) => <div key={`${image.slice(0, 20)}-${index}`} className="relative"><img src={image} alt={`${t('uploadPreview')} ${index + 1}`} className="h-24 w-full rounded-xl object-cover" /><span className="absolute bottom-1 left-1 rounded-md bg-emerald-600 px-1.5 py-1 text-[10px] font-bold text-white">Optimized for fast loading (~{optimizedSizes[index]} KB)</span><button type="button" onClick={() => { setImages((current) => current.filter((_, imageIndex) => imageIndex !== index)); setOptimizedSizes((current) => current.filter((_, imageIndex) => imageIndex !== index)) }} className="absolute right-1 top-1 rounded-full bg-slate-900/80 px-2 py-1 text-xs font-bold text-white" aria-label={`${t('removeImage')} ${index + 1}`}>×</button></div>)}</div>}
          <label className="grid gap-2 text-xs font-bold text-slate-600 sm:col-span-2">{t('description')}<textarea required name="description" value={form.description} onChange={update} rows="5" placeholder={t('tellNeighbours')} className="resize-y rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-emerald-500" /></label>
          {isDirectBooking && <p className="text-sm text-emerald-700 sm:col-span-2">{t('discussionBooking')}</p>}
          {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
          <button type="submit" className="rounded-xl bg-emerald-600 py-4 font-bold text-white transition hover:bg-emerald-700 sm:col-span-2">{t('submitListing')}</button>
        </form>
      </main>
      {cropSource && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-5" role="dialog" aria-modal="true" aria-labelledby="crop-title">
        <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
          <div className="mb-4 flex items-start justify-between gap-4"><div><h2 id="crop-title" className="text-lg font-bold text-slate-900">Crop image {cropIndex + 1} of {cropQueue.length}</h2><p className="mt-1 text-sm text-slate-500">Center the important part inside the square frame.</p></div><button type="button" onClick={cancelCrop} className="text-2xl leading-none text-slate-400 hover:text-slate-700" aria-label="Cancel crop">×</button></div>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100"><img src={cropSource} alt="Crop preview" className="h-full w-full object-cover" /><div className="pointer-events-none absolute inset-0 border-2 border-white/90 shadow-[0_0_0_9999px_rgba(15,23,42,0.38)]" /></div>
          <div className="mt-5 flex justify-end gap-3"><button type="button" onClick={cancelCrop} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button><button type="button" onClick={confirmCrop} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">Confirm Crop</button></div>
        </div>
      </div>}
    </div>
  )
}

export default PostAdPage
