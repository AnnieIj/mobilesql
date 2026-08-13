import { notificationRepository } from '../repositories/notificationRepository';
import { Notification } from '../types';

export class NotificationService {
  async getNotifications(userId: string): Promise<Notification[]> {
    return notificationRepository.getNotificationsByUser(userId);
  }

  async markAsRead(id: string, userId: string): Promise<boolean> {
    return notificationRepository.markAsRead(id, userId);
  }

  async sendNotification(data: Omit<Notification, 'id' | 'isRead' | 'createdAt'>): Promise<Notification> {
    return notificationRepository.createNotification(data);
  }
}

export const notificationService = new NotificationService();
