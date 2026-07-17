import { useEffect, useState } from 'react';

// Pharma's genuinely different bit: some products can't be added to the
// cart at all until a prescription is attached. Nothing else in this app
// gates "Add to Cart" like this, which is exactly why it's a vertical
// component instead of a generic ProductCard feature.
export default function PrescriptionGate({ attributes, onReadyChange }) {
  const requiresAttr = attributes?.find((attr) => attr.key === 'requires_prescription');
  const requiresPrescription = requiresAttr?.value === true;
  const [fileName, setFileName] = useState(null);

  useEffect(() => {
    onReadyChange?.(!requiresPrescription || Boolean(fileName));
  }, [requiresPrescription, fileName, onReadyChange]);

  if (!requiresPrescription) return null;

  return (
    <div className="flex flex-col gap-1.5 border-t border-[var(--color-border)] pt-3">
      <p className="text-xs font-medium text-amber-600">⚠ Prescription required for this medicine</p>
      <label
        className="flex cursor-pointer items-center justify-center border border-dashed border-[var(--color-border)] px-3 py-2 text-center text-xs text-[var(--color-muted)]"
        style={{ borderRadius: 'var(--radius-card)' }}
      >
        <input
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
        />
        {fileName ? `📄 ${fileName} (uploaded)` : 'Upload prescription to add this to cart'}
      </label>
    </div>
  );
}
