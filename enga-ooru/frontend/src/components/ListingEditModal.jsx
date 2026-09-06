import { useState } from 'react'
import { X } from 'lucide-react'

function ListingEditModal({ listing, onClose, onSave }) {
  const [form, setForm] = useState({ title: listing.title || '', price: listing.price || '', locality: listing.locality || listing.location || '', description: listing.description || '' })
  const [saving, setSaving] = useState(false)

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await onSave({ ...form, price: form.price === '' ? '' : Number(form.price) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7" role="dialog" aria-modal="true" aria-labelledby="edit-listing-title">
        <div className="flex items-center justify-between gap-4"><h2 id="edit-listing-title" className="text-2xl font-bold text-slate-900">Edit Listing</h2><button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600" aria-label="Close edit form"><X size={18} /></button></div>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-bold text-slate-600">Title<input required name="title" value={form.title} onChange={update} className="rounded-xl border border-slate-200 p-3 font-normal outline-none focus:border-emerald-500" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-600">Price<input type="number" min="0" name="price" value={form.price} onChange={update} className="rounded-xl border border-slate-200 p-3 font-normal outline-none focus:border-emerald-500" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-600">Locality<input required name="locality" value={form.locality} onChange={update} className="rounded-xl border border-slate-200 p-3 font-normal outline-none focus:border-emerald-500" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-600">Description<textarea required name="description" value={form.description} onChange={update} rows="5" className="resize-y rounded-xl border border-slate-200 p-3 font-normal outline-none focus:border-emerald-500" /></label>
          <div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600">Cancel</button><button type="submit" disabled={saving} className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{saving ? 'Saving...' : 'Save Changes'}</button></div>
        </form>
      </section>
    </div>
  )
}

export default ListingEditModal
