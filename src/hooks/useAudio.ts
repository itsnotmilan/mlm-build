import { useState, useEffect, useCallback, useRef } from 'react';

// Create a single shared instance for background music
const backgroundMusic = new Audio('/src/assets/sounds/money driven monkeys (1).mp3');
backgroundMusic.loop = true;

// Add this constant at the top with your existing AUDIO_PATH
const LEVEL_UP_SOUND = '/src/assets/sounds/ESM_Level_Up_Sound_FX_Arcade_Casino_Kids_Mobile_App.mp3';
import buttonPressSound from '../assets/sounds/ButtonPress_BW.44326.mp3';
export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(backgroundMusic);

  // Initialize audio on mount
  useEffect(() => {
    // Only handle saved playback state
    const savedPlaybackState = localStorage.getItem('audioPlaybackState');
    if (savedPlaybackState === 'playing') {
      audioRef.current.play().catch(console.warn);
      setIsPlaying(true);
    }

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        const wasPlaying = !audioRef.current.paused;
        localStorage.setItem('audioPlaybackState', wasPlaying ? 'playing' : 'paused');
      }
    };
  }, []);

  // Handle audio play/pause
  const toggleAudio = useCallback(() => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        localStorage.setItem('audioPlaybackState', 'paused');
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setError(null);
              localStorage.setItem('audioPlaybackState', 'playing');
            })
            .catch((err) => {
              console.warn('Audio playback failed:', err);
              setError('Audio playback failed. Please try again.');
              setIsPlaying(false);
              localStorage.setItem('audioPlaybackState', 'paused');
            });
        }
      }
      setIsPlaying(!isPlaying);
    } catch (err) {
      console.warn('Audio toggle failed:', err);
      setError('Audio system error. Please try again.');
      setIsPlaying(false);
      localStorage.setItem('audioPlaybackState', 'paused');
    }
  }, [isPlaying]);

  const playButtonPress = useCallback(() => {
    const buttonSound = new Audio(buttonPressSound);
    buttonSound.volume = 0.5; // Adjust volume as needed
    buttonSound.play().catch(() => {
      // Ignore errors from browsers blocking autoplay
    });
  }, []);

  const playSound = useCallback((soundPath: string) => {
    const sound = new Audio(soundPath);
    sound.play().catch(err => {
      console.warn('Sound playback failed:', err);
    });
  }, []);

  return {
    isPlaying,
    toggleAudio,
    error,
    playSound,
    playButtonPress
  };
}
