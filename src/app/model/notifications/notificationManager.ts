import { MainService } from "src/app/main.service";
import { MyNotification } from "./myNotification";

const MAX_NOTIFICATION = 100;
export class NotificationManager {
  notifications = new Array<MyNotification>();

  addNotification(noti: MyNotification) {
    this.notifications.unshift(noti);
    if (this.notifications.length > MAX_NOTIFICATION) this.notifications.pop();

    MainService?.instance?.notificationEmitter?.emit(noti);
  }
}
