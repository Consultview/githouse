import { useEffect } from 'react';

export default function NotificationHandler() {
  useEffect(() => {
    const setupNotifications = async () => {
      if (!('Notification' in window)) return;

      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notificações CityHouse configuradas.');
        }
      }

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
          .catch(err => console.error('Erro no Service Worker:', err));
      }
    };

    setupNotifications();
  }, []);

  return null;
}
