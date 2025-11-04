import React from 'react';
import VideoSlide from './VideoSlide';
import './VideoReels.css';

// --- ¡Aquí están todos tus videos de Vercel Blob! ---
// (Nota: He eliminado 2 URLs duplicadas que estaban en la lista)
const ALL_VIDEOS = [
  { id: 1, url: 'https://fjxxcnhmduqepg13.public.blob.vercel-storage.com/CIA_Portal.mp4' },
  { id: 2, url: 'https://fjxxcnhmduqepg13.public.blob.vercel-storage.com/Demo%20Oreo%20VPS.mp4' },
  { id: 3, url: 'https://fjxxcnhmduqepg13.public.blob.vercel-storage.com/Demo%20Preview%20Cavipetrol.mp4' },
  { id: 4, url: 'https://fjxxcnhmduqepg13.public.blob.vercel-storage.com/Demo_Rey.mp4' },
  { id: 5, url: 'https://fjxxcnhmduqepg13.public.blob.vercel-storage.com/Fire%20Country%20Portal.mp4' },
  { id: 6, url: 'https://fjxxcnhmduqepg13.public.blob.vercel-storage.com/IQUS%20Demo.mp4' },
  { id: 7, url: 'https://fjxxcnhmduqepg13.public.blob.vercel-storage.com/KFC_Parejas.mp4' },
  { id: 8, url: 'https://fjxxcnhmduqepg13.public.blob.vercel-storage.com/Marimer_Demo.mp4' },
  { id: 9, url: 'https://fjxxcnhmduqepg13.public.blob.vercel-storage.com/Mr%20brown%20demo_1.mp4' },
  { id: 10, url: 'https://fjxxcnhmduqepg13.public.blob.vercel-storage.com/Prottego_Juego.mp4' },
  { id: 11, url: 'https://fjxxcnhmduqepg13.public.blob.vercel-storage.com/Skate%20Filtro%20Demo.mp4' },
  { id: 12, url: 'https://fjxxcnhmduqepg13.public.blob.vercel-storage.com/TikTok%20Awarded.mp4' },
  { id: 13, url: 'https://fjxxcnhmduqepg13.public.blob.vercel-storage.com/TikTok_Demo_1.mp4' },
  { id: 14, url: 'https://fjxxcnhmduqepg13.public.blob.vercel-storage.com/haptic-demo.mp4' }
];

const VideoReels: React.FC = () => {
  return (
    <div 
      id="reels-scroll-container" 
      className="reels-container"
    >
      {ALL_VIDEOS.map((video) => (
        <VideoSlide key={video.id} src={video.url} />
      ))}
    </div>
  );
};

export default VideoReels;