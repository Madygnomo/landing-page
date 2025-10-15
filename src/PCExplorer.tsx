import { useState } from 'react';
import './PCExplorer.css';

interface PCExplorerProps {
  onClose: () => void;
}

interface VideoGalleryProps {
  folder: string;
  onClose: () => void;
}

// Componente temporal VideoGallery
function VideoGallery({ folder, onClose }: VideoGalleryProps) {
  return (
    <div className="video-gallery">
      <h2>{folder} Projects</h2>
      <button onClick={onClose}>Close Gallery</button>
      {/* Aquí irá el contenido de la galería */}
    </div>
  );
}

export function PCExplorer({ onClose }: PCExplorerProps) {
  const [openFolder, setOpenFolder] = useState<string | null>(null); // 'AR', 'AI', o 'VR'

  return (
    <div className="pc-desktop">
      <div className="top-bar">
        <div className="window-title">MadyGnome PC Explorer</div>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="desktop-icons">
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

      {/* Ventanas modales */}
      {openFolder && (
        <div className="modal-overlay">
          <VideoGallery folder={openFolder} onClose={() => setOpenFolder(null)} />
        </div>
      )}
    </div>
  );
}