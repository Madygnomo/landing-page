import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, RenderPass, BloomEffect, EffectPass } from 'postprocessing';
import { useControls, folder } from 'leva';

import { DitheringEffect } from './dithering-shader/DitheringEffect';

/**
 * Component that manages all post-processing effects
 * Configures and applies various effects to the rendered scene
 */
export const PostProcessing = () => {
  // References
  const composerRef = useRef<EffectComposer | null>(null);

  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.Camera | null>(null);

  // Effect controls
  const {
    bloom1Enabled,
    bloom1Threshold,
    bloom1Intensity,
    bloom1Radius,
  } = useControls({
    'Bloom 1': folder({
      bloom1Enabled: { value: true, label: 'Enable Bloom 1 (Pre-Dithering)' },
      bloom1Threshold: { value: 1.0, min: 0, max: 2, step: 0.01, label: 'Threshold' },
      bloom1Intensity: { value: 2.5, min: 0, max: 50, step: 0.1, label: 'Intensity' },
      bloom1Radius: { value: 0.6, min: 0, max: 1, step: 0.1, label: 'Radius' },
    })
  });

  const {
    ditheringGridSize,
    pixelSizeRatio,
    grayscaleOnly
  } = useControls({
    'Dithering': folder({
      ditheringGridSize: { value: 2, min: 1, max: 20, step: 1, label: 'Effect Resolution' },
      pixelSizeRatio: { value: 1, min: 1, max: 10, step: 1, label: 'Pixelation Strength' },
      grayscaleOnly: { value: true, label: 'Grayscale Only' }
    })
  });

  const {
    bloom2Enabled,
    bloom2Threshold,
    bloom2Intensity,
    bloom2Radius,
    bloom2Smoothing,
  } = useControls({
    'Bloom 2': folder({
      bloom2Enabled: { value: true, label: 'Enable Bloom 2 (Post-Dithering)' },
      bloom2Threshold: { value: 0.0, min: 0, max: 2, step: 0.01, label: 'Threshold' },
      bloom2Intensity: { value: 0.42, min: 0, max: 2, step: 0.01, label: 'Intensity' },
      bloom2Radius: { value: 0.75, min: 0, max: 1, step: 0.01, label: 'Radius' },
      bloom2Smoothing: { value: 0.22, min: 0, max: 1, step: 0.01, label: 'Smoothing' },
    })
  });

  // Memoized resize handler
  const handleResize = useCallback(() => {
    if (composerRef.current) {
      composerRef.current.setSize(window.innerWidth, window.innerHeight);
    }
  }, []);

  // Handle window resize
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Configure post-processing effects
  useEffect(() => {
    if (!scene || !camera || !composerRef.current) return;

    const composer = composerRef.current;
    // Remove old passes safely
    try {
      composer.removeAllPasses();

      // Add required passes in order
      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      if (bloom1Enabled) {
        composer.addPass(new EffectPass(camera, new BloomEffect({
          luminanceThreshold: bloom1Threshold,
          intensity: bloom1Intensity,
          radius: bloom1Radius,
          mipmapBlur: true,
        })));
      }

      // Dithering effect - always active
      composer.addPass(new EffectPass(camera, new DitheringEffect({
        gridSize: ditheringGridSize,
        pixelSizeRatio,
        grayscaleOnly
      })));

      if (bloom2Enabled) {
        composer.addPass(new EffectPass(camera, new BloomEffect({
          luminanceThreshold: bloom2Threshold,
          intensity: bloom2Intensity,
          luminanceSmoothing: bloom2Smoothing,
          radius: bloom2Radius,
        })));
      }
    } catch (err) {
      // If composer or any effect fails to initialize (some drivers/browsers), log and keep composer in a degraded state
      // The runtime render loop below will fallback to direct rendering if composer is unusable.
      // eslint-disable-next-line no-console
      console.error('PostProcessing initialization failed:', err);
    }

  }, [
    scene, 
    camera,
    bloom1Enabled, 
    bloom1Threshold, 
    bloom1Intensity, 
    bloom1Radius,
    bloom2Enabled, 
    bloom2Threshold, 
    bloom2Intensity, 
    bloom2Radius, 
    bloom2Smoothing,
    ditheringGridSize,
    pixelSizeRatio, 
    grayscaleOnly
  ]);

  // Handle rendering
  useFrame(({ gl, scene: currentScene, camera: currentCamera }, delta) => {
    // Initialize composer if not yet created
    if (!composerRef.current) {
      composerRef.current = new EffectComposer(gl);
      handleResize(); // Initial sizing
    }

    // Update scene and camera references if changed
    // Estas actualizaciones de estado son principalmente para disparar el useEffect que configura los pases.
    if (scene !== currentScene) setScene(currentScene);
    if (camera !== currentCamera) setCamera(currentCamera);

    // Renderizar solo si el composer está inicializado y currentScene/currentCamera están disponibles.
    // Los pases deberían haber sido configurados por el hook useEffect,
    // que depende de las variables de estado 'scene' y 'camera'.
    if (composerRef.current && currentScene && currentCamera) {
      const composer = composerRef.current;
      const originalAutoClear = gl.autoClear;
      const originalCameraLayersMask = currentCamera.layers.mask;

      // 1. Renderizar la capa 0 (escena principal) con post-procesamiento
      currentCamera.layers.set(0); // La cámara solo ve la capa 0
      try {
        composer.render(delta);      // El composer renderiza la capa 0 con efectos (usa la escena/cámara con la que fue configurado)
      } catch (err) {
        // Si composer falla durante render, hacer fallback a render directo
        // eslint-disable-next-line no-console
        console.error('Composer render failed, falling back to direct rendering:', err);
        gl.render(currentScene, currentCamera);
      }

      // 2. Renderizar la capa 1 (FloatingWindow) sin post-procesamiento, encima
      gl.autoClear = false;    // No limpiar lo que dibujó el composer
      gl.clearDepth();         // Limpiar el búfer de profundidad para asegurar que los objetos de la capa 1 se dibujen encima
      
      currentCamera.layers.set(1); // La cámara solo ve la capa 1
      gl.render(currentScene, currentCamera); // Renderizar la capa 1 directamente usando currentScene y currentCamera

      // Restaurar el estado de WebGLRenderer y Camera
      gl.autoClear = originalAutoClear;
      currentCamera.layers.mask = originalCameraLayersMask; // Restaurar las capas en la currentCamera actual
    }
  }, 1);

  return null;
};