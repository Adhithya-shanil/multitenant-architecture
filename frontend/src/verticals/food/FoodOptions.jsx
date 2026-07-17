import { useEffect } from 'react';

// Food's "genuinely different bit": spice level is a single choice, add-ons
// (modifiers) are a multi-choice - neither maps cleanly onto a plain text
// field, which is exactly why these live outside the generic ProductCard.
export default function FoodOptions({ attributes, selections, onSelectionsChange, onReadyChange }) {
  const spiceAttr = attributes?.find((attr) => attr.key === 'spice_level');
  const modifiersAttr = attributes?.find((attr) => attr.key === 'modifiers');

  // Food never blocks checkout on a selection - always ready.
  useEffect(() => {
    onReadyChange?.(true);
  }, [onReadyChange]);

  if (!spiceAttr && !modifiersAttr) return null;

  const selectedSpice = selections.spice_level ?? spiceAttr?.value;
  const selectedModifiers = selections.modifiers ?? [];

  function toggleModifier(option) {
    const next = selectedModifiers.includes(option)
      ? selectedModifiers.filter((modifier) => modifier !== option)
      : [...selectedModifiers, option];
    onSelectionsChange('modifiers', next);
  }

  return (
    <div className="flex flex-col gap-3 border-t border-[var(--color-border)] pt-3">
      {spiceAttr && (
        <div>
          <p className="mb-1.5 text-xs font-medium text-[var(--color-muted)]">{spiceAttr.label}</p>
          <div className="flex gap-1.5">
            {spiceAttr.options.map((option) => {
              const isSelected = selectedSpice === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onSelectionsChange('spice_level', option)}
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

      {modifiersAttr && (
        <div>
          <p className="mb-1.5 text-xs font-medium text-[var(--color-muted)]">{modifiersAttr.label}</p>
          <div className="flex flex-wrap gap-1.5">
            {modifiersAttr.options.map((option) => {
              const isChecked = selectedModifiers.includes(option);
              return (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-1 px-2.5 py-1 text-xs"
                  style={{
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: isChecked ? 'var(--color-primary)' : 'transparent',
                    color: isChecked ? 'var(--color-primary-contrast)' : 'var(--color-text)',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleModifier(option)}
                    className="hidden"
                  />
                  {option}
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
