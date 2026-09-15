export const categorySubcategories = {
  Shops: [
    'Grocery',
    'Stationery & Fancy',
    'Hardware & Paint',
    'Flower Shop',
    'Furniture & Home',
    'Medical & Pharmacy',
    'Textiles & Clothing',
    'Mobile & Electronics',
    'Meat & Fish',
    'Vegetables & Fruits',
    'Footwear',
    'Other'
  ],
  Property: ['Land', 'Shop', 'House', 'Vehicles'],
  Emergency: ['Ambulance', 'Hospital', 'Blood Donor'],
  Transport: ['Mini Truck / Tata Ace', 'Heavy Goods Vehicle', 'General Transport / Load Auto'],
  Taxi: ['Auto', 'Car Taxi', 'Travels / Van'],
  Services: ['AC Service', 'Mobile Service', 'TV Repair', 'Washing Machine', 'Electrician', 'Plumber', 'Education & Tuition', 'Daily Labour & Shifting'],
  Rent: ['Shop Rent', 'House Rent', 'Things / Equipment Rent'],
  'Food & Dining': ['Home Baker', 'Hotel & Restaurant', 'Meat Stall / Fresh Meat'],
  'Bus Timings': ['Bus Schedule']
}

export const categories = Object.keys(categorySubcategories)

export const directContactCategories = ['Shops', 'Emergency', 'Transport', 'Taxi', 'Services', 'Rent', 'Bus Timings']