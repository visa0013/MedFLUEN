import { useCallback, useEffect, useRef } from 'react';

export function useTimerSound793(enabled = true) {
  const context = useRef(null), latestEnabled = useRef(enabled), previousEnabled = useRef(enabled);
  latestEnabled.current = enabled;
  useEffect(() => () => {
    try { context.current?.close()?.catch?.(() => {}); } catch {}
    context.current = null;
  }, []);

  // Called synchronously by Start or Resume, so browser audio is unlocked by a gesture.
  const prime = useCallback(() => {
    if (!latestEnabled.current) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      if (!context.current || context.current.state === 'closed') context.current = new Audio();
      if (context.current.state === 'suspended') context.current.resume()?.catch?.(() => {});
    } catch {}
  }, []);
  // Enabling sound in Settings can unlock a block that started muted.
  // Initial hydration never creates an audio context.
  useEffect(() => {
    const changed = previousEnabled.current !== enabled;
    previousEnabled.current = enabled;
    if (changed && enabled) prime();
  }, [enabled, prime]);

  function complete() {
    const audio = context.current;
    if (!latestEnabled.current || audio?.state !== 'running') return;
    try {
      const note = audio.createOscillator(), envelope = audio.createGain(), now = audio.currentTime;
      note.type = 'sine';
      note.frequency.setValueAtTime(660, now);
      envelope.gain.setValueAtTime(.0001, now);
      envelope.gain.linearRampToValueAtTime(.055, now + .025);
      envelope.gain.exponentialRampToValueAtTime(.0001, now + .24);
      note.connect(envelope); envelope.connect(audio.destination);
      note.onended = () => { note.disconnect(); envelope.disconnect(); };
      note.start(now); note.stop(now + .26);
    } catch {}
  }
  return { prime, complete };
}
