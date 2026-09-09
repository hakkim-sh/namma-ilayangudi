import { MessageCircle } from 'lucide-react'

// Unga 10 digit WhatsApp number-ah 91 serthu inga podunga
const adminWhatsApp = '918524993517' 
const feedbackMessage = 'Hi sha, I found an issue on Nama Ooru website: '

function FeedbackButton() {
  const cleanNumber = adminWhatsApp.replace(/\D/g, '')
  const href = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(feedbackMessage)}`

  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="fixed bottom-4 right-4 z-20 flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-xs font-bold text-white shadow-lg transition hover:bg-emerald-700" 
      aria-label="Report an issue on WhatsApp"
    >
      <MessageCircle size={15} /> 
      <span>HELP</span>
    </a>
  )
}

export default FeedbackButton