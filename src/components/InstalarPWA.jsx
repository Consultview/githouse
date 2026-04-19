import { useEffect, useState } from "react";

export default function InstalarPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIos, setIsIos] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detecta iOS (incluindo iPads novos)
    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIos(ios);

    // Verifica se já está instalado
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    setIsInstalled(isStandalone);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const instalarApp = async () => {
    if (isIos) {
      alert("Para instalar: toque no ícone de 'Compartilhar' e depois em 'Adicionar à Tela de Início'.");
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setIsInstalled(true);
      }
    }
  };

  // Não renderiza se já estiver instalado ou se não houver prompt (exceto no iOS onde o prompt é manual)
  if (isInstalled || (!deferredPrompt && !isIos)) return null;

  return (
    <button onClick={instalarApp} style={buttonStyle}>
      📲 Baixar App
    </button>
  );
}

const buttonStyle = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  padding: "12px 18px",
  background: "#000",
  color: "#fff",
  borderRadius: "12px",
  border: "none",
  fontWeight: "bold",
  cursor: "pointer",
  zIndex: 9999,
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
};
