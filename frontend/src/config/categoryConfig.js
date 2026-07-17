// This is the "config-driven UI" piece: the Navbar, Footer and product
// section don't have any `if (category === 'pharma')` branches in them.
// They just look up this object by the category token from StoreContext.
// Adding a 4th vertical is (mostly) adding an entry here, not new components.
export const CATEGORY_CONFIG = {
  food: {
    label: 'Food',
    productsSectionTitle: 'Menu',
    navLinks: ['Menu', 'Offers', 'Track Order'],
    footerNote: 'Delivery times shown are estimates. This is prototype data, not a real restaurant.',
  },
  clothes: {
    label: 'Clothes',
    productsSectionTitle: 'Collection',
    navLinks: ['Collection', 'Size Guide', 'Returns'],
    footerNote: 'Prototype store - sizes, colors and materials shown are sample data only.',
  },
  pharma: {
    label: 'Pharma',
    productsSectionTitle: 'Medicines',
    navLinks: ['Medicines', 'Upload Prescription', 'Track Order'],
    footerNote:
      'This is prototype data only. Always consult a licensed pharmacist or physician before taking any medication.',
  },
};

const DEFAULT_CATEGORY = 'food';

export function getCategoryConfig(category) {
  return CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG[DEFAULT_CATEGORY];
}
