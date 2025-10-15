// src/AboutMe.tsx

import type { FC } from 'react';

// Definimos las props que recibirá el componente, en este caso, una función para cerrarse.
interface AboutMeProps {
  onClose: () => void;
}

// Estilos CSS en formato de objeto para mayor legibilidad
const styles = {
  overlay: {
    position: 'fixed' as React.CSSProperties['position'],
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100000,
  } as React.CSSProperties,
  modal: {
    background: 'linear-gradient(145deg, rgba(50, 50, 50, 0.95), rgba(30, 30, 30, 0.95))',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '15px',
    padding: '2rem',
    width: '90%',
    maxWidth: '600px',
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    position: 'relative' as React.CSSProperties['position'],
  } as React.CSSProperties,
  closeButton: {
    position: 'absolute' as React.CSSProperties['position'],
    top: '15px',
    right: '15px',
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
  } as React.CSSProperties,
  image: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid rgba(255, 255, 255, 0.5)',
  } as React.CSSProperties,
  content: {
    color: '#EAEAEA',
    fontFamily: "'VT323', monospace",
  } as React.CSSProperties,
  title: {
    fontFamily: "'VT323', monospace",
    fontSize: '32px',
    margin: '0 0 1rem 0',
    color: 'white',
  } as React.CSSProperties,
  text: {
    fontSize: '20px',
    lineHeight: '1.6',
  } as React.CSSProperties
};

export const AboutMe: FC<AboutMeProps> = ({ onClose }) => {
  // Evita que el click dentro del modal cierre el overlay
  const handleModalClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={handleModalClick}>
        <button style={styles.closeButton} onClick={onClose}>×</button>
        <img src="/Camilo.jpg" alt="Foto de Camilo Adams" style={styles.image} />
        <div style={styles.content}>
          <h2 style={styles.title}>About Me</h2>
          <p style={styles.text}>
            I turn code into worlds and pixels into experiences.
            <br /><br />
            My journey as a Motion Designer taught me how to tell stories visually. Now, as a Digital Creator, I use technology as my canvas. My toolkit includes everything from traditional animation software to cutting-edge development platforms like Unity, Spark AR, and Effect House.
          </p>
        </div>
      </div>
    </div>
  );
};