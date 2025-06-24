import { memo, useEffect, useRef, useState, useCallback } from 'react';
import type { FC } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Center, useGLTF, PresentationControls } from '@react-three/drei';
import { PostProcessing } from './post-processing';
import { EnvironmentWrapper } from './environment';
import * as THREE from 'three';
import { useControls, folder, Leva } from 'leva';
import './index.css';
import { FloatingWindows } from './FloatingWindow';

const DemoName: FC = () => (
  <div className="demo-container">
    <div className="demo-name">Portfolio</div>
    <div className="demo-author">
      made by <span className="underlined">
        <a href="https://madygnome.com.co" target="_blank" rel="noopener noreferrer">camiloAdams</a>
      </span>
      {" • "}
      <a href="https://github.com/Madygnomo" target="_blank" rel="noopener noreferrer" className="github-link">GitHub</a>
    </div>
  </div>
);

useGLTF.preload("/BottleWater.glb"); // Pre-carga
useGLTF.preload("/OldPC_Monitor.glb");
useGLTF.preload("/OldPC_GabinetFront.glb");
useGLTF.preload("/OldPC_GabinetBack.glb");
useGLTF.preload("/OldPC_Keyboard.glb");
useGLTF.preload("/OldPC_Mouse.glb");

/**
 * Main application component
 */
export default function App(): React.JSX.Element {
  const [showCine, setShowCine] = useState(false);
  const { bgColor } = useControls({
    'Scene Settings': folder({
      bgColor: {
        value: '#4e4d4d',
        label: 'Background Color'
      }
    })
  });

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [, setModelScale] = useState(3);

  const { intensity, highlight } = useControls({
    'Environment Settings': folder({
      intensity: {
        value: 1.5,
        min: 0,
        max: 5,
        step: 0.1,
        label: 'Environment Intensity'
      },
      highlight: {
        value: '#bcd7ff',
        label: 'Highlight Color'
      }
    })
  });

  // Update renderer clear color when background color changes
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setClearColor(new THREE.Color(bgColor));
    }
  }, [bgColor]);

  // Responsive adjustment handler for model scale
  const handleResize = useCallback(() => {
    const isSmallScreen = window.innerWidth <= 768;
    setModelScale(isSmallScreen ? 2.4 : 3); // 20% reduction on small screens
  }, []);

  // Set up resize handling
  useEffect(() => {
    // Initial check
    handleResize();
    
    // Add listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return (
    <>
      <Leva hidden />
      <Canvas 
        style={{ touchAction: 'none' }}
        shadows 
        camera={{ position: [0, 2, 10], fov: 50 }}
        gl={{ 
          alpha: false 
        }}
        onCreated={({ gl }) => {
          rendererRef.current = gl;
          gl.setClearColor(new THREE.Color(bgColor));
        }}
      >
         <PresentationControls
          global={true}
          snap={true}
          rotation={[0.13, 0.1, 0]}
          polar={[-0.4, 0.2]}
          azimuth={[-1, 0.75]}
        >
        <group position={[9, -19, -70]}>
            <Center>
              <BottleWater />
              <OldMonitor />
              <OldGabinetFront />
              <OldGabinetBack />
              <OldKeyboard />
              <OldMouse />
              <OldKeys />
              {!showCine && (
                <FloatingWindows onShowCine={() => setShowCine(true)} />
             )}
            </Center>
        </group>
        </PresentationControls>
        <EnvironmentWrapper intensity={intensity} highlight={highlight} />
        <Effects />
        <RaycastLayers />
      </Canvas>
      {/* Modal/cine overlay: va FUERA del Canvas */}
      {showCine && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10,10,10,0.97)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setShowCine(false)}
        >
          
            <iframe
              title="vimeo-player"
              src="https://player.vimeo.com/video/251267856?h=60bf446e41&autoplay=1"
              width="100%"
              height="100%"
              allowFullScreen
              style={{
                borderRadius: 18,
                width: '100%',
                height: '100%',
                display: 'block'
              }}
            />
            {/* Botón cerrar */}
            <button
              style={{
                position: 'fixed',
                top: 32,
                right: 32,
                background: '#fff',
                color: '#111',
                border: 'none',
                borderRadius: 100,
                width: 44,
                height: 44,
                fontWeight: 900,
                fontSize: 24,
                boxShadow: '0 2px 8px #222b',
                cursor: 'pointer',
                zIndex: 100001
              }}
              onClick={e => { e.stopPropagation(); setShowCine(false); }}
              title="Cerrar"
            >
              ×
            </button>
          </div>
      )}
      <DemoName />
    </>
  )
}

/**
 * Post-processing effects wrapper component
 * Memoized to prevent unnecessary re-renders
 */
const Effects: FC = memo(() => (
  <PostProcessing />
))

interface BottleWaterProps {
  [key: string]: any;
}

interface OldMonitorProps {
  [key: string]: any;
}
interface OldGabinetFrontProps {
  [key: string]: any;
}
interface OldGabinetBackProps { 
  [key: string]: any;
}
interface OldKeyboardProps {
  [key: string]: any;
}
interface OldMouseProps {
  [key: string]: any;
}
interface OldKeysProps {
  [key: string]: any;
}

function BottleWater(props: BottleWaterProps): React.JSX.Element {
  const { nodes, materials } = useGLTF('/BottleWater.glb') as any;
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        geometry={nodes.MDL_BottleWater.geometry}
        material={materials.MTL_DrinkBottle}
        material-roughness={0.15}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        scale={1}
      />
    </group>
  )
}

function OldMonitor(props: OldMonitorProps): React.JSX.Element {
  const { nodes, materials } = useGLTF('/Old_Monitor.glb') as any;
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        geometry={nodes.C_monitor01_low_Udim02_pc002_0.geometry}
        material={materials.Udim02_pc002}
        material-roughness={0.15}
        position={[9.5, -0.9, 22.428]}
        rotation={[0, 0, 0]}
        scale={1}
      />
    </group>
  )
}

function OldGabinetFront(props: OldGabinetFrontProps): React.JSX.Element {
  const { nodes, materials } = useGLTF('/Old_GabinetFront.glb') as any;
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        geometry={nodes.C_deskotBuild_low_Udim01_pc002_0.geometry}
        material={materials.Udim01_pc002}
        material-roughness={0.15}
        position={[10, -23, 12]}
        rotation={[0, 0, 0]}
        scale={1}
      />
    </group>
  )
}
function OldGabinetBack(props: OldGabinetBackProps): React.JSX.Element {
  const { nodes, materials } = useGLTF('/Old_GabinetBack.glb') as any;
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        geometry={nodes.C_conectionPlate_low_Udim03_pc002_0.geometry}
        material={materials.Udim01_pc002}
        material-roughness={0.15}
        position={[10, -23, 12]}
        rotation={[0, 0, 0]}
        scale={1}
      />
    </group>
  )
}
function OldKeyboard(props: OldKeyboardProps): React.JSX.Element {
  const { nodes, materials } = useGLTF('/Old_Keyboard.glb') as any;
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        geometry={nodes.C_keyboard_low_blinn2_0.geometry}
        material={materials.blinn2}
        material-roughness={0.15}
        position={[13, -22.5, 14]}
        rotation={[0, 0, 0]}
        scale={1}
      />
    </group>
  )
}
function OldMouse(props: OldMouseProps): React.JSX.Element {
  const { nodes, materials } = useGLTF('/Old_Mouse.glb') as any;
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        geometry={nodes.C_mouse_low_lambert1_0.geometry}
        material={materials.lambert1}
        material-roughness={0.15}
        position={[13, -22.5, 14]}
        rotation={[0, 0, 0]}
        scale={1}
      />
    </group>
  )
}
function OldKeys(props: OldKeysProps): React.JSX.Element {
  const { nodes, materials } = useGLTF('/Old_Keys.glb') as any;
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        geometry={nodes.C_keyboard_low_blinn13_0.geometry}
        material={materials.blinn13}
        material-roughness={0.15}
        position={[13, -22.5, 14]}
        rotation={[0, 0, 0]}
        scale={1}
      />
    </group>
  )
}

function RaycastLayers() {
  const { raycaster } = useThree();
  useEffect(() => {
    raycaster.layers.enable(1); // Habilita la capa 1 para raycasts de eventos
  }, [raycaster]);
  return null;
}


