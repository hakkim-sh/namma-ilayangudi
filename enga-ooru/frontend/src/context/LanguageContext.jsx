import { createContext, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'app_lang'
const translations = {
  en: {
    language: 'தமிழ் | ENG',
    post: '+ Post',
    tagline: 'Local Marketplace & Essential Services',
    town: 'Select town',
    heroEyebrow: '✦ Namma Ooru, made easier',
    heroTitle: 'Digital ilayangudi. Right here.',
    heroTitleAccent: '',
    heroDescription: 'Local Marketplace & Essential Services for the places we call home.',
    searchPlaceholder: 'Search listings, services, shops, places...',
    findingNearby: 'Finding good things nearby...',
    noListings: 'No listings found. Try a different search.',
    browse: 'NAMMA OORU, MADE EASIER',
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
    defaultDescription: 'A local listing shared with our community.',
    createPost: 'Create Post',
    postAdTitle: 'Post New Ad',
    backHome: '← Back to Home',
    marketplaceDescription: 'Local Marketplace & Essential Services',
    adTitle: 'Ad Title / Shop Name',
    whatOffering: 'What are you offering?',
    category: 'Category',
    subcategory: 'Subcategory',
    price: 'Price (₹)',
    optional: 'Optional',
    priceType: 'Price Type',
    locality: 'Locality / Street name',
    area: 'Area or street name',
    whatsapp: 'WhatsApp Number',
    phone: 'Phone Number',
    tenDigit: '10 digit number',
    photos: 'Photos',
    selectPhotos: 'Select 1 to 3 images',
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
      photos: 'Please select up to 3 photos.',
      number: 'Please enter a valid 10 digit WhatsApp number.',
      requiredPhoto: 'Please upload at least 1 photo.',
      save: 'Unable to save this ad. Please make sure the backend is running.',
    },
    postedSuccess: 'Ad Posted Successfully! / விளம்பரம் வெற்றிகரமாக பதிவிடப்பட்டது!',
    categories: {
      All: 'All',
      Shops: 'Shops',
      Property: 'Property',
      Emergency: 'Emergency',
      Transport: 'Transport',
      Taxi: 'Taxi',
      Services: 'Services',
      Rent: 'Rent',
      'Food & Dining': 'Food & Dining',
      'Bus Timings': 'Bus Timings',
      Other: 'Other'
    },
    subcategories: {
      All: 'All',
      // Shops
      Grocery: 'Grocery',
      'Stationery & Fancy': 'Stationery & Fancy',
      'Hardware & Paint': 'Hardware & Paint',
      'Flower Shop': 'Flower Shop',
      'Furniture & Home': 'Furniture & Home',
      'Medical & Pharmacy': 'Medical & Pharmacy',
      'Textiles & Clothing': 'Textiles & Clothing',
      'Mobile & Electronics': 'Mobile & Electronics',
      'Meat & Fish': 'Meat & Fish',
      'Meat Stall / Fresh Meat': 'Meat Stall / Fresh Meat',
      'Vegetables & Fruits': 'Vegetables & Fruits',
      Footwear: 'Footwear',
      // Property
      Land: 'Land',
      Shop: 'Shop',
      House: 'House',
      Vehicles: 'Vehicles',
      // Emergency
      Ambulance: 'Ambulance',
      Hospital: 'Hospital',
      'Blood Donor': 'Blood Donor',
      // Transport & Taxi
      'Mini Truck / Tata Ace': 'Mini Truck / Tata Ace',
      'Heavy Goods Vehicle': 'Heavy Goods Vehicle',
      'General Transport / Load Auto': 'General Transport / Load Auto',
      Auto: 'Auto',
      'Car Taxi': 'Car Taxi',
      'Travels / Van': 'Travels / Van',
      // Services
      'AC Service': 'AC Service',
      'Mobile Service': 'Mobile Service',
      'TV Repair': 'TV Repair',
      'Washing Machine': 'Washing Machine',
      'Washing Machine service': 'Washing Machine service',
      Electrician: 'Electrician',
      Plumber: 'Plumber',
      'Education & Tuition': 'Education & Tuition',
      'Daily Labour & Shifting': 'Daily Labour & Shifting',
      // Rent
      'Shop Rent': 'Shop Rent',
      'House Rent': 'House Rent',
      'Things / Equipment Rent': 'Things / Equipment Rent',
      // Food & Dining
      'Home Baker': 'Home Baker',
      'Hotel & Restaurant': 'Hotel & Restaurant',
      // Bus Timings & Others
      'Bus Schedule': 'Bus Schedule',
      Other: 'Other'
    },
    priceTypes: {
      Fixed: 'Fixed',
      Negotiable: 'Negotiable',
      Monthly: 'Monthly',
      'Other / Contact for Price': 'Contact for Price'
    },
  },
  ta: {
    language: 'தமிழ் | ENG',
    post: '+ பதிவிட',
    tagline: 'உள்ளூர் சந்தை மற்றும் அத்தியாவசிய சேவைகள்',
    town: 'ஊரைத் தேர்ந்தெடுக்கவும்',
    heroEyebrow: '✦ நம்ம ஊரு, இனி இன்னும் எளிது',
    heroTitle: 'டிஜிட்டல் இளையான்குடி. இதோ இங்கே',
    heroTitleAccent: '',
    heroDescription: 'நமது ஊருக்கான உள்ளூர் சந்தை மற்றும் அத்தியாவசிய சேவைகள்.',
    searchPlaceholder: 'தேடுக (மளிகை, பைக், வீடு, ஆட்டோ, வேலைகள்)...',
    findingNearby: 'அருகிலுள்ள சிறந்தவற்றைத் தேடுகிறது...',
    noListings: 'விளம்பரங்கள் எதுவும் கிடைக்கவில்லை. வேறு தேடலை முயற்சிக்கவும்.',
    browse: 'எளிமையான நம்ம ஊரு',
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
    defaultDescription: 'நமது ஊர் சமூகத்துடன் பகிரப்பட்ட உள்ளூர் விளம்பரம்.',
    createPost: 'விளம்பரம் உருவாக்கு',
    postAdTitle: 'புதிய விளம்பரம் பதிவிட',
    backHome: '← முகப்புக்குத் திரும்பு',
    marketplaceDescription: 'உள்ளூர் சந்தை மற்றும் அத்தியாவசிய சேவைகள்',
    adTitle: 'விளம்பர தலைப்பு / கடையின் பெயர்',
    whatOffering: 'நீங்கள் என்ன வழங்குகிறீர்கள்?',
    category: 'வகை',
    subcategory: 'உட்பிரிவு',
    price: 'விலை (₹)',
    optional: 'விருப்பம்',
    priceType: 'விலை வகை',
    locality: 'பகுதி / தெரு பெயர்',
    area: 'பகுதி அல்லது தெரு பெயர்',
    whatsapp: 'WhatsApp எண்',
    phone: 'தொலைபேசி எண்',
    tenDigit: '10 இலக்க எண்',
    photos: 'படங்கள்',
    selectPhotos: '1 முதல் 3 படங்களைத் தேர்ந்தெடுக்கவும்',
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
      photos: 'அதிகபட்சம் 3 படங்களைத் தேர்ந்தெடுக்கவும்.',
      number: 'சரியான 10 இலக்க WhatsApp எண்ணை உள்ளிடவும்.',
      requiredPhoto: 'குறைந்தது 1 படத்தையாவது பதிவேற்றவும்.',
      save: 'விளம்பரத்தைச் சேமிக்க முடியவில்லை. பின்தளம் இயங்குகிறதா எனச் சரிபார்க்கவும்.',
    },
    postedSuccess: 'விளம்பரம் வெற்றிகரமாக பதிவிடப்பட்டது!',
    categories: {
      All: 'அனைத்தும்',
      Shops: 'கடைகள்',
      Property: 'சொத்து',
      Emergency: 'அவசரம்',
      Transport: 'போக்குவரத்து',
      Taxi: 'டாக்ஸி',
      Services: 'சேவைகள்',
      Rent: 'வாடகை',
      'Food & Dining': 'உணவு & சிற்றுண்டி',
      'Bus Timings': 'பேருந்து நேரம்',
      Other: 'மற்றவை'
    },
    subcategories: {
      All: 'அனைத்தும்',
      // கடைகள்
      Grocery: 'மளிகைக் கடை',
      'Stationery & Fancy': 'புத்தக & பேன்சி கடை',
      'Hardware & Paint': 'பெயிண்ட் & ஹார்டுவேர்',
      'Flower Shop': 'பூக்கடை',
      'Furniture & Home': 'பர்னிச்சர் & பீரோ கடை',
      'Medical & Pharmacy': 'மருந்தகம்',
      'Textiles & Clothing': 'துணிக்கடை',
      'Mobile & Electronics': 'மொபைல் கடை',
      'Meat & Fish': 'கறி & மீன் கடை',
      'Meat Stall / Fresh Meat': 'கறிக்கடை',
      'Vegetables & Fruits': 'காய்கறி & பழக்கடை',
      Footwear: 'காலணி கடை',
      // சொத்து
      Land: 'நிலம்',
      Shop: 'வணிகக் கடை',
      House: 'வீடு',
      Vehicles: 'வாகனங்கள்',
      // அவசரம்
      Ambulance: 'ஆம்புலன்ஸ்',
      Hospital: 'மருத்துவமனை',
      'Blood Donor': 'இரத்த தானம்',
      // போக்குவரத்து & டாக்ஸி
      'Mini Truck / Tata Ace': 'டாடா ஏஸ் / மினி லாரி',
      'Heavy Goods Vehicle': 'கனரக வாகனம்',
      'General Transport / Load Auto': 'லோடு ஆட்டோ',
      Auto: 'ஆட்டோ',
      'Car Taxi': 'கார் டாக்ஸி',
      'Travels / Van': 'டிராவல்ஸ் / வேன்',
      // சேவைகள்
      'AC Service': 'ஏசி சர்வீஸ்',
      'Mobile Service': 'மொபைல் சர்வீஸ்',
      'TV Repair': 'டிவி பழுது',
      'Washing Machine': 'வாஷிங் மெஷின்',
      'Washing Machine service': 'வாஷிங் மெஷின்',
      Electrician: 'எலக்ட்ரீஷியன்',
      Plumber: 'பிளம்பர்',
      'Education & Tuition': 'கல்வி / டியூஷன்',
      'Daily Labour & Shifting': 'ஷிப்டிங் & தினசரி ஆட்கள்',
      // வாடகை
      'Shop Rent': 'கடை வாடகை',
      'House Rent': 'வீட்டு வாடகை',
      'Things / Equipment Rent': 'பொருட்கள் வாடகை',
      // உணவு
      'Home Baker': 'வீட்டு பேக்கர்',
      'Hotel & Restaurant': 'ஹோட்டல் & உணவகம்',
      // பேருந்து & இதர
      'Bus Schedule': 'பேருந்து அட்டவணை',
      Other: 'மற்றவை'
    },
    priceTypes: {
      Fixed: 'நிலையான விலை',
      Negotiable: 'பேசி முடிவு செய்யலாம்',
      Monthly: 'மாத வாடகை',
      'Other / Contact for Price': 'விலை பேசி முடிவு'
    },
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

  const value = useMemo(() => ({
    language,
    isTamil: language === 'ta',
    t: (key) => key.split('.').reduce((result, part) => result?.[part], translations[language]) ?? key,
    categoryLabel: (category) => translations[language]?.categories?.[category] || category,
    subcategoryLabel: (subcategory) => translations[language]?.subcategories?.[subcategory] || subcategory,
    priceTypeLabel: (priceType) => translations[language]?.priceTypes?.[priceType] || priceType,
    toggleLanguage
  }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}