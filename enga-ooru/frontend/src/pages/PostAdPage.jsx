import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useLanguage } from '../context/LanguageContext'
import { useListings } from '../context/ListingsContext'
import { categories, categorySubcategories, directContactCategories } from '../data/categories'

const initialForm = { title: '', category: 'Property', subcategory: 'Land', price: '', priceType: 'Fixed', locality: '', phone: '', description: '' }

function PostAdPage() {
  const navigate = useNavigate()
  const { t, categoryLabel, subcategoryLabel, priceTypeLabel } = useLanguage()
  const { addListing, categoryFallbackIcon } = useListings()
  const [form, setForm] = useState(initialForm)
  const [images, setImages] = useState([])
  const [error, setError] = useState('')
  const isDirectBooking = directContactCategories.includes(form.category)

  const update = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value, ...(name === 'category' ? { subcategory: categorySubcategories[value][0] } : {}) }))
    setError('')
  }

  const resizeImage = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Unable to read image'))
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error('Unable to decode image'))
      image.onload = () => {
        const scale = Math.min(1, 800 / image.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))
        const context = canvas.getContext('2d')
        if (!context) return reject(new Error('Canvas is unavailable'))
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.78))
      }
      image.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })

  const handleImages = (event) => {
    const files = Array.from(event.target.files || []).slice(0, 5)
    if (!files.length) return
    if (event.target.files.length > 5) setError(t('errors.photos'))
    Promise.all(files.map((file) => resizeImage(file).catch(() => categoryFallbackIcon(form.category)))).then(setImages)
  }

  const submit = async (event) => {
    event.preventDefault()
    const phone = form.phone.replace(/\D/g, '')
    if (!/^\d{10}$/.test(phone)) return setError(t('errors.number'))
    if (!images.length) return setError(t('errors.requiredPhoto'))
    const price = isDirectBooking ? 'Price on Discussion' : form.price ? Number(form.price) : form.priceType
    try {
      await addListing({ ...form, id: Date.now(), phone, whatsappNumber: phone, images, image: images[0], price, priceType: isDirectBooking ? 'Discussion' : form.priceType, postedAt: 'Just now' })
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
          <label className="grid gap-2 text-xs font-bold text-slate-600 sm:col-span-2">{t('adTitle')}<input required name="title" value={form.title} onChange={update} placeholder={t('whatOffering')} className="rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-emerald-500" /></label>
          <label className="grid gap-2 text-xs font-bold text-slate-600">{t('category')}<select name="category" value={form.category} onChange={update} className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal outline-none">{categories.map((category) => <option key={category} value={category}>{categoryLabel(category)}</option>)}</select></label>
          <label className="grid gap-2 text-xs font-bold text-slate-600">{t('subcategory')}<select required name="subcategory" value={form.subcategory} onChange={update} className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal outline-none">{categorySubcategories[form.category].map((subcategory) => <option key={subcategory} value={subcategory}>{subcategoryLabel(subcategory)}</option>)}</select></label>
          <label className="grid gap-2 text-xs font-bold text-slate-600">{t('price')}<input type="number" min="0" name="price" value={form.price} onChange={update} disabled={isDirectBooking} placeholder={t('optional')} className="rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none disabled:bg-slate-100" /></label>
          <label className="grid gap-2 text-xs font-bold text-slate-600">{t('priceType')}<select name="priceType" value={form.priceType} onChange={update} className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal outline-none">{['Fixed', 'Negotiable', 'Monthly'].map((priceType) => <option key={priceType} value={priceType}>{priceTypeLabel(priceType)}</option>)}</select></label>
          <label className="grid gap-2 text-xs font-bold text-slate-600 sm:col-span-2">{t('locality')}<input required name="locality" value={form.locality} onChange={update} placeholder={t('area')} className="rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-emerald-500" /></label>
          <label className="grid gap-2 text-xs font-bold text-slate-600 sm:col-span-2">{t('phone')}<input required type="tel" name="phone" value={form.phone} onChange={update} inputMode="numeric" maxLength="10" placeholder={t('tenDigit')} className="rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-emerald-500" /></label>
          <label className="grid gap-2 text-xs font-bold text-slate-600 sm:col-span-2">{t('photos')} <span className="font-normal text-slate-500">{t('selectPhotos')}<input required type="file" multiple accept="image/*" onChange={handleImages} className="mt-2 w-full rounded-xl border border-dashed border-slate-300 p-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:font-bold" /></span></label>
          {images.length > 0 && <div className="grid grid-cols-3 gap-3 sm:col-span-2 sm:grid-cols-5">{images.map((image, index) => <div key={`${image.slice(0, 20)}-${index}`} className="relative"><img src={image} alt={`${t('uploadPreview')} ${index + 1}`} className="h-24 w-full rounded-xl object-cover" /><button type="button" onClick={() => setImages((current) => current.filter((_, imageIndex) => imageIndex !== index))} className="absolute right-1 top-1 rounded-full bg-slate-900/80 px-2 py-1 text-xs font-bold text-white" aria-label={`${t('removeImage')} ${index + 1}`}>×</button></div>)}</div>}
          <label className="grid gap-2 text-xs font-bold text-slate-600 sm:col-span-2">{t('description')}<textarea required name="description" value={form.description} onChange={update} rows="5" placeholder={t('tellNeighbours')} className="resize-y rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-emerald-500" /></label>
          {isDirectBooking && <p className="text-sm text-emerald-700 sm:col-span-2">{t('discussionBooking')}</p>}
          {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
          <button type="submit" className="rounded-xl bg-emerald-600 py-4 font-bold text-white transition hover:bg-emerald-700 sm:col-span-2">{t('submitListing')}</button>
        </form>
      </main>
    </div>
  )
}

export default PostAdPage
