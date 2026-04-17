import { Html, Plane, Text } from '@react-three/drei';
import { useEffect, useState, type FC } from 'react';


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

const CountdownWindow: FC = () => {
  const [targetDate] = useState(() => {
    return new Date('2026-05-14T00:00:00');
  });

  const [timeLeft, setTimeLeft] = useState('Loading...');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft('0d 0h 0m 0s');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);
  
  const FONT_URL = 'https://raw.githubusercontent.com/google/fonts/main/ofl/vt323/VT323-Regular.ttf';
  const width = 12;
  const height = 5.5;
  const titleBarHeight = 1;

  return (
    <group>
      {/* Main window panel with borders */}
      <Plane args={[width, height]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#c0c0c0" />
      </Plane>
      <Plane args={[width, 0.1]} position={[0, height / 2, 0.01]}><meshStandardMaterial color="white" /></Plane>
      <Plane args={[0.1, height]} position={[-width / 2, 0, 0.01]}><meshStandardMaterial color="white" /></Plane>
      <Plane args={[width, 0.1]} position={[0, -height / 2, 0.01]}><meshStandardMaterial color="#808080" /></Plane>
      <Plane args={[0.1, height]} position={[width / 2, 0, 0.01]}><meshStandardMaterial color="#808080" /></Plane>

      {/* Title Bar */}
      <Plane args={[width - 0.4, titleBarHeight]} position={[0, (height - titleBarHeight) / 2 - 0.2, 0.01]}>
        <meshStandardMaterial color="#000080" />
      </Plane>
      <Text
        font={FONT_URL}
        fontSize={0.7}
        color="white"
        position={[-width / 2 + 0.5, (height - titleBarHeight) / 2 - 0.2, 0.02]}
        anchorX="left"
        anchorY="middle"
      >
        System_Alert.exe
      </Text>

      {/* Body */}
      <Text
        font={FONT_URL}
        fontSize={0.8}
        color="black"
        position={[0, 0.8, 0.02]}
        anchorX="center"
        anchorY="middle"
      >
        TIME UNTIL SHUTDOWN
      </Text>

      {/* Countdown display */}
      <Plane args={[width - 2, 1.25]} position={[0, -1.2, 0.01]}>
        <meshStandardMaterial color="black" />
      </Plane>
      <Text
        font={FONT_URL}
        fontSize={1}
        color="#00ff00"
        position={[0, -1.2, 0.02]}
        anchorX="center"
        anchorY="middle"
      >
        {timeLeft}
      </Text>
    </group>
  );
};

interface FloatingWindowsProps {
  onShowCine: () => void;
  onShowAbout: () => void;
}

export function FloatingWindows({ onShowCine, onShowAbout }: FloatingWindowsProps) {
  // Animación pop-in y parpadeo para IG
  const [, setScaleIG] = useState(0.5);
  const [, setBlinkIG] = useState(0);
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
  const [, setScaleVirus] = useState(0.5);
  const [, setBlinkVirus] = useState(0);
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
      <group position={[-15, 5, 35]} rotation={[0, 0, 0]} scale={0.4}>
        <Html
          position={[0, 0, 0]}
          distanceFactor={70}
          transform
          occlude
          renderOrder={2}
          style={{
            transition: 'all 0.2s',
            opacity: 1,
            pointerEvents: 'auto'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 17 }}>
            <span
              style={{
                fontFamily: 'VT323, monospace',
                fontSize: 30,
                color: '#222',
                letterSpacing: 1,
                textShadow: '0 1px 6px #fff',
              }}
            >
              [IG]
            </span>
          </div>
          <a
            href="https://www.instagram.com/mady.gnome/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              background: 'rgba(255,255,255,0.9)',
              width: 180,
              pointerEvents: 'auto',
              ...useGlitch(1.1),
              transition: 'box-shadow 0.22s cubic-bezier(.25,1,.5,1)'
            }}
            onMouseOver={() => document.body.style.cursor = 'pointer'}
            onMouseOut={() => document.body.style.cursor = ''}
          >
            <img src="/IG Feed W95.png" style={{ width: '100%', display: 'block' }} alt="Instagram Feed Retro" />
          </a>
        </Html>
      </group>

      {/* Countdown Window */}
      {/* This is now a 3D object, so it will be affected by post-processing */}
      <group position={[-15, 22, 35]} rotation={[0, 0.1, 0]} scale={1.2}>
        <CountdownWindow />
      </group>

      {/* Virus Popup */}
      <group position={[40, -10, 35]} rotation={[0, 0, 0]} scale={0.35}>
        <Html
          position={[-35, 0, 0]}
          distanceFactor={70}
          transform
          occlude
          renderOrder={2}
          style={{
            transition: 'all 0.2s',
            opacity: 1,
            pointerEvents: 'auto'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <span
              style={{
                fontFamily: 'VT323, monospace',
                fontSize: 42,
                color: '#222',
                letterSpacing: 1,
                textShadow: '0 1px 6px #fff',
              }}
            >
              About Me
            </span>
          </div>
          <div
            onClick={onShowAbout}
            style={{
              background: 'rgba(255,255,255,0.96)',
              borderRadius: 10,
              width: 210,
              ...useGlitch(1.1),
              transition: 'box-shadow 0.22s cubic-bezier(.25,1,.5,1)',
              cursor: 'pointer'
            }}
          >
            <img src="/textures/Virus_Windows.jpg" style={{ width: '100%', borderRadius: 8 }} alt="Virus Popup" />
          </div>
        </Html>
      </group>

      {/* Windows Media Player Popup */}

      <group position={[20, 13, 38]} rotation={[0, -Math.PI / 18, 0]} scale={0.4}>
        <Html
          position={[28, 8, 0]}
          distanceFactor={60}
          transform
          occlude
          renderOrder={2}
          style={{
            transition: 'all 0.2s',
            opacity: 1,
            pointerEvents: 'auto'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <span
              style={{
                fontFamily: 'VT323, monospace',
                fontSize: 42,
                color: '#222',
                letterSpacing: 1,
                textShadow: '0 1px 6px #fff',
              }}
            >
              Reel
            </span>
          </div>
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
