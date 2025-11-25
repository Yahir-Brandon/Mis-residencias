'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck } from 'lucide-react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, writeBatch, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isOpen, setIsOpen] = useState(false);

  const notificationsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'notifications'),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user]);
  
  const { data: notifications, isLoading } = useCollection(notificationsQuery, {
    disabled: !user,
  });

  const unreadNotifications = notifications?.filter((n) => !n.read);
  const hasUnread = unreadNotifications && unreadNotifications.length > 0;


  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && hasUnread) {
      markAllAsRead();
    }
  };

  const markAllAsRead = async () => {
    if (!user || !firestore || !unreadNotifications || unreadNotifications.length === 0) return;
    
    const batch = writeBatch(firestore);
    unreadNotifications.forEach((notification) => {
      const notifRef = doc(firestore, 'users', user.uid, 'notifications', notification.id);
      batch.update(notifRef, { read: true });
    });

    try {
      await batch.commit();
    } catch (error) {
      console.error("Error marking notifications as read: ", error);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className={cn("h-5 w-5", hasUnread && "animate-ring")} />
          {hasUnread && (
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-pulse-strong absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
          <span className="sr-only">Abrir notificaciones</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-4 font-medium border-b">
          Notificaciones
        </div>
        <div className="max-h-80 overflow-y-auto">
          {isLoading && <p className="p-4 text-sm text-muted-foreground">Cargando...</p>}
          {!isLoading && (!notifications || notifications.length === 0) && (
             <div className="flex flex-col items-center justify-center p-8 text-center">
                <CheckCheck className="h-12 w-12 text-green-500 mb-2" />
                <p className="text-sm font-medium">Todo al día</p>
                <p className="text-xs text-muted-foreground">No tienes notificaciones nuevas.</p>
            </div>
          )}
          {notifications && notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-4 border-b text-sm hover:bg-accent"
            >
              <p className="font-normal">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {notification.createdAt
                  ? formatDistanceToNow(notification.createdAt.toDate(), { addSuffix: true, locale: es })
                  : 'justo ahora'}
              </p>
            </div>
          ))}
        </div>
        {notifications && notifications.length > 0 && (
           <div className="p-2 border-t text-center">
                <Button variant="link" size="sm" onClick={markAllAsRead}>
                    Marcar todas como leídas
                </Button>
            </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
