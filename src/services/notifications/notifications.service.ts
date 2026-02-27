import type { Notification, NotificationCreateData, NotificationUpdateData } from "../../types";
import { BaseService } from "../base.service";

class NotificationsServiceClass extends BaseService {
	async getNotifications(contestId: string): Promise<Notification[]> {
		const { data } = await this.axios.get<Notification[]>(`/notifications/${contestId}/`);
		return data;
	}

	async createNotification(
		contestId: string,
		notificationData: NotificationCreateData,
	): Promise<Notification> {
		const { data } = await this.axios.post<Notification>(
			`/notifications/${contestId}/`,
			notificationData,
		);
		return data;
	}

	async deleteNotification(contestId: string, notificationId: string): Promise<void> {
		await this.axios.delete(`/notifications/${contestId}/${notificationId}/`);
	}

	async updateNotification(
		contestId: string,
		notificationId: string,
		notificationData: NotificationUpdateData,
	): Promise<Notification> {
		const { data } = await this.axios.put<Notification>(
			`/notifications/${contestId}/${notificationId}/`,
			notificationData,
		);
		return data;
	}
}

export const NotificationsService = new NotificationsServiceClass();
export { NotificationsServiceClass };
