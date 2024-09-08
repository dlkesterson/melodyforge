import React from 'react';

interface EffectsPanelProps {
  effects: { [key: string]: number };
  onEffectChange: (effect: string, value: number) => void;
}

const EffectsPanel: React.FC<EffectsPanelProps> = ({ effects, onEffectChange }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Effects</h2>
      {Object.entries(effects).map(([effect, value]) => (
        <div key={effect} className="mb-4">
          <label className="block text-sm font-medium mb-1">{effect}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={value}
            onChange={(e) => onEffectChange(effect, parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
};

export default EffectsPanel;