"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio object on the client side
    audioRef.current = new Audio("/audio/nature.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.2; // Keep it low so it's "ambient"

    // Optional: Try to auto-play (browsers often block this until the user clicks somewhere)
    const playAttempt = setInterval(() => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            clearInterval(playAttempt);
          })
          .catch((e) => {
            // Autoplay blocked - waiting for user interaction
            console.log("Autoplay blocked, waiting for user interaction.");
          });
      }
    }, 3000);

    return () => {
      clearInterval(playAttempt);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-navy/80 backdrop-blur-md border border-aqua/30 text-aqua hover:bg-navy hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(0,194,184,0.3)] group"
      aria-label={isPlaying ? "Mute ambient sound" : "Play ambient sound"}
    >
      {isPlaying ? (
        <Volume2 size={20} className="group-hover:animate-pulse" />
      ) : (
        <VolumeX size={20} className="opacity-50" />
      )}
    </button>
  );
}
