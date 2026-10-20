import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Circle, User, MessageSquare, Heart } from 'lucide-react';
import { useDB, getItems, putItem } from '../../hooks/useDB';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

export const NotificationsPage: React.FC = () => {
  const db = useDB();
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!db || !currentUser) return;

    const fetchNotifications = async () => {
      const allNotifs = await getItems<any>(db, 'notifications');
      const userNotifs = allNotifs
        .filter(n => n.userId === currentUser.id)
        .sort((a, b) => b.createdAt - a.createdAt);
      setNotifications(userNotifs);
    };

    fetchNotifications();
  }, [db, currentUser]);

  const markAsRead = async (id: string) => {
    if (!db) return;
    const notif = notifications.find(n => n.id === id);
    if (notif) {
      await putItem(db, 'notifications', { ...notif, isRead: true });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }
  };

  const markAllAsRead = async () => {
    if (!db) return;
    for (const n of notifications) {
      if (!n.isRead) {
        await putItem(db, 'notifications', { ...n, isRead: true });
      }
    }
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart size={18} className="text-pink-500" />;
      case 'follow': return <User size={18} className="text-blue-500" />;
      case 'comment': return <MessageSquare size={18} className="text-green-500" />;
      default: return <Bell size={18} className="text-gray-500" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-veyra-textMuted">Stay updated with your local activity</p>
        </div>
        <button
          onClick={markAllAsRead}
          className="text-sm font-medium text-veyra-accentBlue hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-3xl">
            <Bell className="mx-auto text-veyra-textMuted mb-4" size={48} />
            <p className="text-veyra-textMuted">No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={cn(
                "p-4 rounded-2xl flex items-start gap-4 cursor-pointer transition-all border border-transparent",
                n.isRead
                  ? "bg-veyra-charcoal/50 opacity-70"
                  : "bg-veyra-charcoal border-white/10 shadow-lg shadow-black/20"
              )}
            >
              <div className="mt-1">
                {getNotificationIcon(n.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold">User {n.fromUserId.slice(0, 5)}</span>
                  <span className="text-xs text-veyra-textMuted">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-veyra-textMuted">
                  {n.type === 'like' && 'liked your post'}
                  {n.type === 'follow' && 'started following you'}
                  {n.type === 'comment' && `commented on your post: ${n.content?.slice(0, 30)}...`}
                  {n.type === 'message' && 'sent you a new message'}
                </p>
              </div>
              {!n.isRead && (
                <div className="mt-2">
                  <Circle className="fill-veyra-accentBlue text-veyra-accentBlue" size={8} />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
