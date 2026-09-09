import { MessageCircle } from 'lucide-react'

const adminWhatsApp = import.meta.env.VITE_ADMIN_WHATSAPP || ''
const feedbackMessage = 'Hi sha, I found an issue on Nama Ooru website: '

function FeedbackButton() {
  const href = adminWhatsApp ? `https://wa.me/${adminWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(feedbackMessage)}` : `https://wa.me/?text=${encodeURIComponent(feedbackMessage)}`

  return <a href={href} target="_blank" rel="noopener noreferrer" className="fixed bottom-4 right-4 z-20 flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-xs font-bold text-white shadow-lg transition hover:bg-emerald-700" aria-label="Report an issue on WhatsApp"><MessageCircle size={15} /> <span> HELP </span></a>
}

export default FeedbackButton