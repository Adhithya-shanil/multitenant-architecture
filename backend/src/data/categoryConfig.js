// This is the "config-driven UI" data: the Navbar, Footer and product
// section don't have any `if (category === 'pharma')` branches in them.
// The frontend just renders whatever this object says for the store's
// category - it no longer keeps its own copy of this table.
//
// `widget` is a key, not a component - the frontend has a small registry
// that maps this key to the actual React component (a component reference
// can't travel over JSON). `handledKeys` tells the product card which
// attribute keys that widget already renders interactively, so they don't
// also show up as plain read-only badges.
const CATEGORY_CONFIG = {
  food: {
    label: 'Food',
    productsSectionTitle: 'Menu',
    navLinks: ['Menu', 'Offers', 'Track Order'],
    footerNote: 'Delivery times shown are estimates. This is prototype data, not a real restaurant.',
    widget: 'foodOptions',
    handledKeys: ['spice_level', 'modifiers'],
  },
  clothes: {
    label: 'Clothes',
    productsSectionTitle: 'Collection',
    navLinks: ['Collection', 'Size Guide', 'Returns'],
    footerNote: 'Prototype store - sizes, colors and materials shown are sample data only.',
    widget: 'sizeSelector',
    handledKeys: ['size', 'color'],
  },
  pharma: {
    label: 'Pharma',
    productsSectionTitle: 'Medicines',
    navLinks: ['Medicines', 'Upload Prescription', 'Track Order'],
    footerNote:
      'This is prototype data only. Always consult a licensed pharmacist or physician before taking any medication.',
    widget: 'prescriptionGate',
    handledKeys: ['requires_prescription'],
  },
};

const DEFAULT_CATEGORY = 'food';

function getCategoryConfig(category) {
  return CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG[DEFAULT_CATEGORY];
}

module.exports = { CATEGORY_CONFIG, getCategoryConfig };
