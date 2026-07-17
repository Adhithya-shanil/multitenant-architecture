import { useEffect, useState } from 'react';

// A size chart is a fundamentally different shape of data than a dosage
// field or a spice level - it's a little table, not a single value. Kept
// static/hardcoded here on purpose, so it stays a clothes-only concept that
// never has to leak into the generic ProductCard or the backend schema.
const SIZE_CHART = [
  { size: 'S', chest: '36"', length: '27"' },
  { size: 'M', chest: '39"', length: '28"' },
  { size: 'L', chest: '42"', length: '29"' },
  { size: 'XL', chest: '45"', length: '30"' },
];

export default function SizeSelector({ attributes, selections, onSelectionsChange, onReadyChange }) {
  const sizeAttr = attributes?.find((attr) => attr.key === 'size');
  const colorAttr = attributes?.find((attr) => attr.key === 'color');
  const [showChart, setShowChart] = useState(false);

  // Clothes never blocks checkout on a selection - always ready.
  useEffect(() => {
    onReadyChange?.(true);
  }, [onReadyChange]);

  if (!sizeAttr && !colorAttr) return null;

  const selectedSize = selections.size ?? sizeAttr?.value;
  const selectedColor = selections.color ?? colorAttr?.value;

  return (
    <div className="flex flex-col gap-3 border-t border-[var(--color-border)] pt-3">
      {sizeAttr && (
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-xs font-medium text-[var(--color-muted)]">{sizeAttr.label}</p>
            <button
              type="button"
              onClick={() => setShowChart((value) => !value)}
              className="text-xs text-[var(--color-muted)] underline"
            >
              {showChart ? 'Hide size chart' : 'Size chart'}
            </button>
          </div>
          <div className="flex gap-1.5">
            {sizeAttr.options.map((option) => {
              const isSelected = selectedSize === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onSelectionsChange('size', option)}
                  className="h-8 w-8 text-xs"
                  style={{
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                    color: isSelected ? 'var(--color-primary-contrast)' : 'var(--color-text)',
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {showChart && (
            <table className="mt-2 w-full text-left text-xs text-[var(--color-muted)]">
              <thead>
                <tr>
                  <th className="pr-3 font-medium text-[var(--color-text)]">Size</th>
                  <th className="pr-3 font-medium text-[var(--color-text)]">Chest</th>
                  <th className="font-medium text-[var(--color-text)]">Length</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_CHART.map((row) => (
                  <tr key={row.size}>
                    <td className="pr-3 py-0.5">{row.size}</td>
                    <td className="pr-3 py-0.5">{row.chest}</td>
                    <td className="py-0.5">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {colorAttr && (
        <div>
          <p className="mb-1.5 text-xs font-medium text-[var(--color-muted)]">{colorAttr.label}</p>
          <div className="flex flex-wrap gap-1.5">
            {colorAttr.options.map((option) => {
              const isSelected = selectedColor === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onSelectionsChange('color', option)}
                  className="px-2.5 py-1 text-xs"
                  style={{
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                    color: isSelected ? 'var(--color-primary-contrast)' : 'var(--color-text)',
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
