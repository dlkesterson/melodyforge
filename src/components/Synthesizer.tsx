import React, { useState, useEffect, useRef } from 'react';
import { AudioEngine } from '../utils/AudioEngine';
import VoiceSelector from './VoiceSelector';
import EffectsPanel from './EffectsPanel';

const Synthesizer: React.FC = () => {
  const [audioEngine, setAudioEngine] = useState<AudioEngine | null>(null);
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const [selectedVoice, setSelectedVoice] = useState<string>('sine');
  const [effects, setEffects] = useState<{ [key: string]: number }>({
    gain: 0.5,
    distortion: 0,
    delay: 0,
  });

  useEffect(() => {
    const engine = new AudioEngine();
    setAudioEngine(engine);
    return () => {
      engine.cleanup();
    };
  }, []);

  useEffect(() => {
    if (audioEngine) {
      audioEngine.setVoice(selectedVoice);
      audioEngine.setEffects(effects);
    }
  }, [audioEngine, selectedVoice, effects]);

  const handleNoteOn = (note: number) => {
    if (audioEngine) {
      audioEngine.noteOn(note);
      setActiveNotes(new Set(activeNotes.add(note)));
    }
  };

  const handleNoteOff = (note: number) => {
    if (audioEngine) {
      audioEngine.noteOff(note);
      activeNotes.delete(note);
      setActiveNotes(new Set(activeNotes));
    }
  };

  const handleVoiceChange = (voice: string) => {
    setSelectedVoice(voice);
  };

  const handleEffectChange = (effect: string, value: number) => {
    setEffects({ ...effects, [effect]: value });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Web Synthesizer</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Keyboard</h2>
          <div className="flex flex-wrap gap-2">
            {[60, 62, 64, 65, 67, 69, 71, 72].map((note) => (
              <button
                key={note}
                className={`w-16 h-24 ${
                  activeNotes.has(note) ? 'bg-blue-500' : 'bg-white'
                } border border-gray-300 rounded`}
                onMouseDown={() => handleNoteOn(note)}
                onMouseUp={() => handleNoteOff(note)}
                onMouseLeave={() => handleNoteOff(note)}
              ></button>
            ))}
          </div>
        </div>
        <div>
          <VoiceSelector onVoiceChange={handleVoiceChange} selectedVoice={selectedVoice} />
          <EffectsPanel effects={effects} onEffectChange={handleEffectChange} />
        </div>
      </div>
    </div>
  );
};

export default Synthesizer;