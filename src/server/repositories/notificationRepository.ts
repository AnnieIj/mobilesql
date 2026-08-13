import { db } from '../database/db';
import { Notification } from '../types';

export class NotificationRepository {
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    const list: Notification[] = [];
    for (const n of db.notifications.values()) {
      if (n.userId === userId) {
        list.push(n);
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async markAsRead(id: string, userId: string): Promise<boolean> {
    const n = db.notifications.get(id);
    if (!n || n.userId !== userId) return false;

    n.isRead = true;
    db.notifications.set(id, n);
    return true;
  }

  async createNotification(data: Omit<Notification, 'id' | 'isRead' | 'createdAt'>): Promise<Notification> {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const entity: Notification = {
      ...data,
      id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    db.notifications.set(id, entity);
    return entity;
  }
}

export const notificationRepository = new NotificationRepository();
