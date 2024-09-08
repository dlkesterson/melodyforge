import React from 'react';

interface VoiceSelectorProps {
  onVoiceChange: (voice: string) => void;
  selectedVoice: string;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ onVoiceChange, selectedVoice }) => {
  const voices = ['sine', 'square', 'sawtooth', 'triangle'];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Voice</h2>
      <div className="flex gap-2">
        {voices.map((voice) => (
          <button
            key={voice}
            className={`px-4 py-2 rounded ${
              selectedVoice === voice ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => onVoiceChange(voice)}
          >
            {voice}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VoiceSelector;