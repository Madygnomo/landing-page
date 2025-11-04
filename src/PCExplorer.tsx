import { useState } from 'react';
import './PCExplorer.css';
import VideoReels from './VideoReels'; // 1. Importa el componente de scrolling

interface PCExplorerProps {
  onClose: () => void;
}

// 2. Ya no necesitamos 'VideoGallery' ni 'VideoGalleryProps', los eliminamos.

export function PCExplorer({ onClose }: PCExplorerProps) {
  const [openFolder, setOpenFolder] = useState<string | null>(null); // 'AR', 'AI', o 'VR'

  return (
    <div className="pc-desktop">
      <div className="top-bar">
        <div className="window-title">MadyGnome PC Explorer</div>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="desktop-icons">
        {/* 3. Este onClick ahora abrirá el modal de Reels */}
        <div className="icon" onClick={() => setOpenFolder('AR')}>
          <img src="/Icono_AR.png" alt="AR Experience" />
          <p>AR.exe</p>
        </div>

        <div className="icon" onClick={() => setOpenFolder('VR')}>
          <img src="/Icono_VR.png" alt="VR Experience" />
          <p>VR.exe</p>
        </div>

        <div className="icon" onClick={() => setOpenFolder('AI')}>
          <img src="/Icono_Banana.png" alt="AI Experience" />
          <p>AI.exe</p>
        </div>
      </div>

      {/* 4. Lógica de las ventanas modales modificada */}
      {openFolder && (
        <div className="modal-overlay">
          {openFolder === 'AR' ? (
            // Si es AR, muestra el componente de Reels
            <div className="reels-modal-container">
              <VideoReels />
              <button 
                className="reels-modal-close" 
                onClick={() => setOpenFolder(null)}
              >
                ×
              </button>
            </div>
          ) : (
            // Placeholder para las otras carpetas
            <div className="video-gallery-placeholder">
              <h2>{openFolder} Projects</h2>
              <p>Contenido en construcción.</p>
              <button onClick={() => setOpenFolder(null)}>Cerrar</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}