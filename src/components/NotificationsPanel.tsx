import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bell, Check, Music, Trophy, Info } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

const NotificationsPanel = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'release':
        return <Music className="h-5 w-5 text-primary-600" />;
      case 'milestone':
        return <Trophy className="h-5 w-5 text-secondary-600" />;
      default:
        return <Info className="h-5 w-5 text-accent-600" />;
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Carregando notificações...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Marcar todas como lidas
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Nenhuma notificação
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 ${notification.read ? 'bg-white' : 'bg-primary-50'}`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {notification.content}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    {format(new Date(notification.created_at), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                  </div>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="ml-3 p-1 rounded-full text-primary-600 hover:bg-primary-100"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;