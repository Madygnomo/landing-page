import { Html } from '@react-three/drei';
import { useEffect, useState } from 'react';

// Pequeño hook de glitch
function useGlitch(intensity = 1) {
  const [glitch, setGlitch] = useState({});
  useEffect(() => {
    let mounted = true;
    function loop() {
      if (!mounted) return;
      // Cambia cada 0.09 a 0.19 segundos para random
      const timeout = 90 + Math.random() * 100;
      setGlitch({
        transform: `
          scale(${1 + Math.random() * 0.04 * intensity})
          translate(${(Math.random() - 0.5) * 6 * intensity}px, ${(Math.random() - 0.5) * 4 * intensity}px)
        `,
        filter: `brightness(${1 + Math.random() * 0.3}) contrast(${1 + Math.random() * 0.4})`
      });
      setTimeout(loop, timeout);
    }
    loop();
    return () => { mounted = false; };
  }, [intensity]);
  return glitch;
}

interface FloatingWindowsProps {
  onShowCine: () => void;
}

export function FloatingWindows({ onShowCine }: FloatingWindowsProps) {
  // Animación pop-in y parpadeo para IG
  const [scaleIG, setScaleIG] = useState(0.5);
  const [blinkIG, setBlinkIG] = useState(0);
  useEffect(() => {
    setTimeout(() => setScaleIG(1), 200);
    let mounted = true, t = 0;
    function animate() {
      if (!mounted) return;
      t += 0.06;
      setBlinkIG(Math.sin(t) * 5);
      requestAnimationFrame(animate);
    }
    animate();
    return () => { mounted = false; };
  }, []);

  // Pop-in y parpadeo para Virus
  const [scaleVirus, setScaleVirus] = useState(0.5);
  const [blinkVirus, setBlinkVirus] = useState(0);
  useEffect(() => {
    setTimeout(() => setScaleVirus(1), 400);
    let mounted = true, t = 0;
    function animate() {
      if (!mounted) return;
      t += 0.08;
      setBlinkVirus(Math.cos(t) * 4);
      requestAnimationFrame(animate);
    }
    animate();
    return () => { mounted = false; };
  }, []);

  return (
    <>
      {/* IG Popup */}
      <group position={[0, 0, 0]} rotation={[0, Math.PI / 6, 0]}>
        <Html
          position={[-35, 0, 0]}
          distanceFactor={70}
          transform
        >
          <a
            href="https://www.instagram.com/mady.gnome/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              background: 'rgba(255,255,255,0.9)',
              width: 180,
              pointerEvents: 'auto',
              ...useGlitch(1.1), // Aplica el glitch aquí
              transition: 'box-shadow 0.22s cubic-bezier(.25,1,.5,1)'
            }}
            onMouseOver={() => document.body.style.cursor = 'pointer'}
            onMouseOut={() => document.body.style.cursor = ''}
          >
            <img src="/IG Feed W95.png" style={{ width: '100%', display: 'block' }} alt="Instagram Feed Retro" />
          </a>
        </Html>
      </group>

      {/* Virus Popup */}
      <group position={[68, 0, 0]} rotation={[0, -Math.PI / 9, 0]}>
        <Html
          position={[28, 8, 0]}
          distanceFactor={60}
          transform
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.96)',
              borderRadius: 10,
              width: 210,
              ...useGlitch(1.1), // Aquí el glitch!
              transition: 'box-shadow 0.22s cubic-bezier(.25,1,.5,1)'
            }}
          >
            <img src="/textures/Virus_Windows.jpg" style={{ width: '100%', borderRadius: 8 }} alt="Virus Popup" />
          </div>
        </Html>
      </group>

      {/* Windows Media Player Popup */}

      <group position={[16, 1, -20]} rotation={[0, -Math.PI / 18, 0]}>
        <Html
          position={[50, -7, 0]}
          distanceFactor={63}
          
          transform
        >
          <div
            onClick={onShowCine}
            style={{
              width: 249,
              height: 429,
              ...useGlitch(1.1),
              cursor: 'pointer'
            }}
            title="¡Haz click para ver el reel!"
          >
            <img src="/Windows_Media_Player.png" width={249} height={429} alt="Windows Media Player" style={{ display: 'block', width: '100%' }} />
          </div>
        </Html>
      </group>
    </>
  );
}
