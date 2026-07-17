import FoodOptions from './food/FoodOptions';
import SizeSelector from './clothes/SizeSelector';
import PrescriptionGate from './pharma/PrescriptionGate';

// The only place that maps a category token to a vertical component.
// `handledKeys` tells ProductCard's generic metafields renderer which
// attribute keys the vertical component already renders interactively,
// so they don't also show up as plain read-only badges.
const VERTICAL_PRODUCT_EXTRAS = {
  food: { Component: FoodOptions, handledKeys: ['spice_level', 'modifiers'] },
  clothes: { Component: SizeSelector, handledKeys: ['size', 'color'] },
  pharma: { Component: PrescriptionGate, handledKeys: ['requires_prescription'] },
};

export function getVerticalProductExtra(category) {
  return VERTICAL_PRODUCT_EXTRAS[category] ?? null;
}
