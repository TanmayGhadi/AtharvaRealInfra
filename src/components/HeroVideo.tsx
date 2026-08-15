'use client';

import { useEffect, useRef } from 'react';

interface HeroVideoProps {
  className?: string;
}

export default function HeroVideo({ className }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setSlowSpeed = () => {
      if (video && video.playbackRate !== 0.7) {
        video.playbackRate = 0.7;
      }
    };

    setSlowSpeed();

    const handlePlay = () => setSlowSpeed();
    const handleLoaded = () => {
      setSlowSpeed();
      video.play().catch(() => {});
    };

    // Smooth loop transition prevention
    const handleTimeUpdate = () => {
      if (video.duration && video.currentTime > video.duration - 0.2) {
        setSlowSpeed();
      }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('playing', handlePlay);
    video.addEventListener('canplay', handleLoaded);
    video.addEventListener('loadeddata', handleLoaded);
    video.addEventListener('timeupdate', handleTimeUpdate);

    if (video.readyState >= 2) {
      setSlowSpeed();
      video.play().catch(() => {});
    }

    return () => {
      if (video) {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('playing', handlePlay);
        video.removeEventListener('canplay', handleLoaded);
        video.removeEventListener('loadeddata', handleLoaded);
        video.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      className={className}
      aria-label="Drone footage of agricultural land in Sindhudurg"
    >
      <source src="/hero-drone.mp4" type="video/mp4" />
    </video>
  );
}
