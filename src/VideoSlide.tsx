import React, { useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface Props {
  src: string;
}

const VideoSlide: React.FC<Props> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // 'ref' es el observador que ponemos en el div
  // 'inView' es un booleano (true/false) que nos dice si está en pantalla
  const { ref, inView } = useInView({
    threshold: 0.5, // Se activa cuando el 50% del video está visible
  });

  useEffect(() => {
    if (videoRef.current) {
      if (inView) {
        // Si está en pantalla, le damos play
        videoRef.current.play();
      } else {
        // Si se va de la pantalla, lo pausamos y reiniciamos
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [inView]); // Este efecto se ejecuta cada vez que 'inView' cambia

  return (
    <div ref={ref} className="video-slide">
      <video
        ref={videoRef}
        src={src}
        loop        // Que se repita
        muted       // ¡CRÍTICO! Autoplay solo funciona si está silenciado
        playsInline // Necesario para que funcione en iOS
      >
        Tu navegador no soporta el tag de video.
      </video>
    </div>
  );
};

export default VideoSlide;