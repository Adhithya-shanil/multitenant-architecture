function formatKey(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

// Turns whatever vertical-specific selections a line item was added with
// (size, spice level, modifiers, ...) into one readable string, without the
// cart/checkout UI needing to know what those selections mean.
export function formatSelections(selections) {
  if (!selections) return '';

  return Object.entries(selections)
    .filter(([, value]) => value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0))
    .map(([key, value]) => `${formatKey(key)}: ${Array.isArray(value) ? value.join(', ') : value}`)
    .join(' · ');
}
