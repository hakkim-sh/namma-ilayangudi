import { useState } from 'react'
import { X } from 'lucide-react'

function ListingEditModal({ listing, onClose, onSave }) {
  const [form, setForm] = useState({
    title: listing.title || '',
    price: listing.price || '',
    locality: listing.locality || listing.location || '',
    phone: listing.phone || listing.whatsappNumber || '',
    description: listing.description || ''
  })
  const [saving, setSaving] = useState(false)

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await onSave({
        ...form,
        whatsappNumber: form.phone, // Phone number maathinaal WhatsApp-kum adhuve assign aagidum
        price: form.price === '' ? '' : form.price
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 z-40 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm" 
      role="presentation" 
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section 
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="edit-listing-title"
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <h2 id="edit-listing-title" className="text-xl font-bold text-slate-900">Edit Listing Details</h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200" 
            aria-label="Close edit form"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="mt-5 grid gap-4">
          {/* Title */}
          <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
            Ad / Shop Title *
            <input 
              required 
              name="title" 
              value={form.title} 
              onChange={update} 
              className="rounded-xl border border-slate-200 p-3 text-sm font-normal text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" 
            />
          </label>

          {/* Price & Location */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
              Price (₹)
              <input 
                type="text" 
                name="price" 
                placeholder="Optional"
                value={form.price} 
                onChange={update} 
                className="rounded-xl border border-slate-200 p-3 text-sm font-normal text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" 
              />
            </label>

            <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
              Location / Landmark *
              <input 
                required 
                name="locality" 
                value={form.locality} 
                onChange={update} 
                className="rounded-xl border border-slate-200 p-3 text-sm font-normal text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" 
              />
            </label>
          </div>

          {/* Single Phone Number Field */}
          <div>
            <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
              Phone Number *
              <input 
                required 
                type="tel" 
                name="phone" 
                value={form.phone} 
                onChange={update} 
                placeholder="10 digit mobile number"
                className="rounded-xl border border-slate-200 p-3 text-sm font-normal text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" 
              />
            </label>
          </div>

          {/* Description */}
          <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
            Description *
            <textarea 
              required 
              name="description" 
              value={form.description} 
              onChange={update} 
              rows="4" 
              className="resize-y rounded-xl border border-slate-200 p-3 text-sm font-normal text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" 
            />
          </label>

          {/* Form Actions */}
          <div className="mt-2 flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving} 
              className="rounded-xl bg-[#4c63f7] px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#3b51e6] active:scale-95 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default ListingEditModal