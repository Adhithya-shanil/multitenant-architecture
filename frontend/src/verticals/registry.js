import FoodOptions from './food/FoodOptions';
import SizeSelector from './clothes/SizeSelector';
import PrescriptionGate from './pharma/PrescriptionGate';

// A component reference can't travel over JSON, so this is the one place
// left in the frontend that maps a string key to actual code. Everything
// about *which* widget a category needs (and which attribute keys it
// handles) now comes from the backend's `categoryConfig.widget` - this
// registry only resolves that key to the component that renders it.
const WIDGET_REGISTRY = {
  foodOptions: FoodOptions,
  sizeSelector: SizeSelector,
  prescriptionGate: PrescriptionGate,
};

export function getVerticalWidget(widgetKey) {
  return WIDGET_REGISTRY[widgetKey] ?? null;
}
