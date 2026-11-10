export function sendBrowserNotification(title: string, body: string, tag?: string) {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return false;
  try {
    new Notification(title, { body, tag, icon: '/icon-192.png', badge: '/icon-192.png' });
    return true;
  } catch (e) {
    console.error('Notification failed', e);
    return false;
  }
}

export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) return Promise.resolve('denied');
  return Notification.requestPermission();
}
