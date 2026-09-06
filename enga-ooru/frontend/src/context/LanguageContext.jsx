import { createContext, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'app_lang'
const translations = {
  en: {
    language: 'தமிழ் | ENG',
    post: '+ Post',
    tagline: 'Local Marketplace & Essential Services',
    town: 'Select town',
    heroEyebrow: '✦ Ilayangudi, made easier',
    heroTitle: 'Everything local. Right here.',
    heroTitleAccent: '',
    heroDescription: 'Local Marketplace & Essential Services for the places we call home.',
    searchPlaceholder: 'Search listings, services, places...',
    findingNearby: 'Finding good things nearby...',
    noListings: 'No listings found. Try a different search.',
    browse: 'ILAYANGUDI, MADE EASIER',
    explore: 'Explore listings',
    nearby: 'nearby',
    all: 'All',
    localListing: 'Local listing',
    chatWhatsApp: 'Chat on WhatsApp',
    closeDetails: 'Close details',
    previousImage: 'Previous image',
    nextImage: 'Next image',
    posted: 'Posted',
    recently: 'recently',
    defaultDescription: 'A local listing shared with the Ilayangudi community.',
    createPost: 'Create Post',
    postAdTitle: 'Post New Ad',
    backHome: '← Back to Home',
    marketplaceDescription: 'Local Marketplace & Essential Services',
    adTitle: 'Ad Title',
    whatOffering: 'What are you offering?',
    category: 'Category',
    subcategory: 'Subcategory',
    price: 'Price (₹)',
    optional: 'Optional',
    priceType: 'Price Type',
    locality: 'Ilayangudi Locality / Street name',
    area: 'Area or street name',
    whatsapp: 'WhatsApp Number',
    phone: 'Phone Number',
    tenDigit: '10 digit number',
    photos: 'Photos',
    selectPhotos: 'Select 1 to 5 images',
    description: 'Description',
    tellNeighbours: 'Tell your neighbours a little more...',
    discussionBooking: 'Price on Discussion / Direct Booking via WhatsApp',
    publish: 'Publish Free Ad',
    submitListing: 'Submit Listing',
    priceDiscussion: 'Price on Discussion',
    monthly: ' / month',
    uploadPreview: 'Upload preview',
    removeImage: 'Remove image',
    errors: {
      photos: 'Please select up to 5 photos.',
      number: 'Please enter a valid 10 digit WhatsApp number.',
      requiredPhoto: 'Please upload at least 1 photo.',
      save: 'Unable to save this ad. Please make sure the backend is running.',
    },
    postedSuccess: 'Ad Posted Successfully! / விளம்பரம் வெற்றிகரமாக பதிவிடப்பட்டது!',
    categories: { Property: 'Property', Emergency: 'Emergency', Transport: 'Transport', Taxi: 'Taxi', Services: 'Services', Rent: 'Rent', 'Food & Dining': 'Food & Dining' },
    subcategories: { Land: 'Land', Shop: 'Shop', House: 'House', Vehicles: 'Vehicles', Ambulance: 'Ambulance', Hospital: 'Hospital', 'Blood Donor': 'Blood Donor', Taxi: 'Taxi', Travels: 'Travels', 'AC Service': 'AC Service', 'Mobile Service': 'Mobile Service', 'TV Repair': 'TV Repair', 'Washing Machine': 'Washing Machine', Electrician: 'Electrician', Plumber: 'Plumber', 'Education & Tuition': 'Education & Tuition', 'Daily Labour & Shifting': 'Daily Labour & Shifting', 'Shop Rent': 'Shop Rent', 'House Rent': 'House Rent', 'Things / Equipment Rent': 'Things / Equipment Rent', 'Home Baker': 'Home Baker', 'Hotel & Restaurant': 'Hotel & Restaurant', 'Meat Stall / Fresh Meat': 'Meat Stall / Fresh Meat' },
    priceTypes: { Fixed: 'Fixed', Negotiable: 'Negotiable', Monthly: 'Monthly' },
  },
  ta: {
    language: 'தமிழ் | ENG',
    post: '+ பதிவிட',
    tagline: 'உள்ளூர் சந்தை மற்றும் அத்தியாவசிய சேவைகள்',
    town: 'ஊரைத் தேர்ந்தெடுக்கவும்',
    heroEyebrow: '✦ இளையான்குடி, இனி இன்னும் எளிது',
    heroTitle: 'இளையான்குடியின் அனைத்தும். உங்கள் விரல் நுனியில்.',
    heroTitleAccent: '',
    heroDescription: 'நமது ஊருக்கான உள்ளூர் சந்தை மற்றும் அத்தியாவசிய சேவைகள்.',
    searchPlaceholder: 'தேடுக (பைக், வீடு, ஆட்டோ, வேலைகள்)...',
    findingNearby: 'அருகிலுள்ள சிறந்தவற்றைத் தேடுகிறது...',
    noListings: 'விளம்பரங்கள் எதுவும் கிடைக்கவில்லை. வேறு தேடலை முயற்சிக்கவும்.',
    browse: 'எளிமையான இளையான்குடி',
    explore: 'விளம்பரங்களை ஆராயுங்கள்',
    nearby: 'அருகில்',
    all: 'அனைத்தும்',
    localListing: 'உள்ளூர் விளம்பரம்',
    chatWhatsApp: 'WhatsApp-ல் பேச',
    closeDetails: 'விவரங்களை மூடுக',
    previousImage: 'முந்தைய படம்',
    nextImage: 'அடுத்த படம்',
    posted: 'பதிவிட்டது',
    recently: 'சமீபத்தில்',
    defaultDescription: 'இளையான்குடி சமூகத்துடன் பகிரப்பட்ட உள்ளூர் விளம்பரம்.',
    createPost: 'விளம்பரம் உருவாக்கு',
    postAdTitle: 'புதிய விளம்பரம் பதிவிட',
    backHome: '← முகப்புக்குத் திரும்பு',
    marketplaceDescription: 'உள்ளூர் சந்தை மற்றும் அத்தியாவசிய சேவைகள்',
    adTitle: 'விளம்பர தலைப்பு (Title)',
    whatOffering: 'நீங்கள் என்ன வழங்குகிறீர்கள்?',
    category: 'வகை',
    subcategory: 'உட்பிரிவு',
    price: 'விலை (₹)',
    optional: 'விருப்பம்',
    priceType: 'விலை வகை',
    locality: 'இளையான்குடி பகுதி / தெரு பெயர்',
    area: 'பகுதி அல்லது தெரு பெயர்',
    whatsapp: 'WhatsApp எண்',
    phone: 'தொலைபேசி எண்',
    tenDigit: '10 இலக்க எண்',
    photos: 'படங்கள்',
    selectPhotos: '1 முதல் 5 படங்களைத் தேர்ந்தெடுக்கவும்',
    description: 'விளக்கம்',
    tellNeighbours: 'உங்கள் அண்டை வீட்டாரிடம் இன்னும் கொஞ்சம் சொல்லுங்கள்...',
    discussionBooking: 'விலை பேசி முடிவு / WhatsApp மூலம் நேரடி முன்பதிவு',
    publish: 'இலவச விளம்பரத்தை வெளியிடு',
    submitListing: 'விளம்பரத்தை வெளியிடுக',
    priceDiscussion: 'விலை பேசி முடிவு',
    monthly: ' / மாதம்',
    uploadPreview: 'பட முன்னோட்டம்',
    removeImage: 'படத்தை அகற்று',
    errors: {
      photos: 'அதிகபட்சம் 5 படங்களைத் தேர்ந்தெடுக்கவும்.',
      number: 'சரியான 10 இலக்க WhatsApp எண்ணை உள்ளிடவும்.',
      requiredPhoto: 'குறைந்தது 1 படத்தையாவது பதிவேற்றவும்.',
      save: 'விளம்பரத்தைச் சேமிக்க முடியவில்லை. பின்தளம் இயங்குகிறதா எனச் சரிபார்க்கவும்.',
    },
    postedSuccess: 'விளம்பரம் வெற்றிகரமாக பதிவிடப்பட்டது!',
    categories: { Property: 'சொத்து', Emergency: 'அவசரம்', Transport: 'போக்குவரத்து', Taxi: 'டாக்ஸி', Services: 'சேவைகள்', Rent: 'வாடகை', 'Food & Dining': 'உணவு மற்றும் உணவகம்' },
    subcategories: { Land: 'நிலம்', Shop: 'கடை', House: 'வீடு', Vehicles: 'வாகனங்கள்', Ambulance: 'ஆம்புலன்ஸ்', Hospital: 'மருத்துவமனை', 'Blood Donor': 'இரத்த தானம்', Taxi: 'டாக்ஸி', Travels: 'பயண சேவை', 'AC Service': 'ஏசி சேவை', 'Mobile Service': 'மொபைல் சேவை', 'TV Repair': 'டிவி பழுது', 'Washing Machine': 'சலவை இயந்திரம்', Electrician: 'எலக்ட்ரீஷியன்', Plumber: 'பிளம்பர்', 'Education & Tuition': 'கல்வி மற்றும் டியூஷன்', 'Daily Labour & Shifting': 'தினக்கூலி மற்றும் இடமாற்றம்', 'Shop Rent': 'கடை வாடகை', 'House Rent': 'வீட்டு வாடகை', 'Things / Equipment Rent': 'பொருட்கள் / உபகரணங்கள் வாடகை', 'Home Baker': 'வீட்டு பேக்கர்', 'Hotel & Restaurant': 'ஹோட்டல் மற்றும் உணவகம்', 'Meat Stall / Fresh Meat': 'இறைச்சிக் கடை / புதிய இறைச்சி' },
    priceTypes: { Fixed: 'நிலையான விலை', Negotiable: 'பேசி முடிவு செய்யலாம்', Monthly: 'மாத வாடகை' },
  },
}

const LanguageContext = createContext(null)

function readLanguage() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'ta' ? 'ta' : 'en'
  } catch {
    return 'en'
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(readLanguage)
  const toggleLanguage = () => setLanguage((current) => {
    const next = current === 'en' ? 'ta' : 'en'
    window.localStorage.setItem(STORAGE_KEY, next)
    return next
  })
  const value = useMemo(() => ({ language, isTamil: language === 'ta', t: (key) => key.split('.').reduce((result, part) => result?.[part], translations[language]) ?? key, categoryLabel: (category) => translations[language].categories[category] || category, subcategoryLabel: (subcategory) => translations[language].subcategories[subcategory] || subcategory, priceTypeLabel: (priceType) => translations[language].priceTypes[priceType] || priceType, toggleLanguage }), [language])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}
