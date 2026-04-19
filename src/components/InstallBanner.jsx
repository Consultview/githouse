import React, { useState, useEffect } from 'react';
import './install-banner.css'; // Nome do arquivo em minúsculo

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Validação: Verifica se já está instalado/rodando como App
    const checkPwaStatus = () => {
      const displayMode = window.matchMedia('(display-mode: standalone)').matches 
                          || window.navigator.standalone 
                          || document.referrer.includes('android-app://');
      setIsStandalone(displayMode);
    };

    checkPwaStatus();

    const handleBeforeInstall = (e) => {
      // Impede o banner padrão do navegador
      e.preventDefault();
      // Salva o evento para disparar depois
      setDeferredPrompt(e);
      
      // Só mostra o nosso banner se NÃO estiver instalado
      if (!isStandalone) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Esconde o banner se a instalação for feita por outros meios
    window.addEventListener('appinstalled', () => {
      setShowBanner(false);
      setIsStandalone(true);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, [isStandalone]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Mostra o prompt nativo
    deferredPrompt.prompt();
    
    // Aguarda a escolha do usuário
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuário aceitou a instalação');
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  // Se já for PWA ou o banner foi fechado, não renderiza nada
  if (isStandalone || !showBanner) return null;

  return (
    <div className="pwaContainer">
      <div className="header">
        <div className="iconWrapper">🏠</div>
        <div className="info">
          <h3 className="title">CityHouse App</h3>
          <p className="description">Instale para receber notificações e acessar de forma rápida.</p>
        </div>
      </div>
      <div className="actions">
        <button className="btnLater" onClick={() => setShowBanner(false)}>
          Agora não
        </button>
        <button className="btnInstall" onClick={handleInstallClick}>
          Instalar
        </button>
      </div>
    </div>
  );
}
