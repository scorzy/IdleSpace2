import { Game } from "../game";

export enum NotificationTypes {
  SAVE,
  LOAD,
  RESEARCH,
  BATTLE_WIN,
  ENEMY_DEFEATED
}
export class MyNotification {
  dateTime = Date.now();
  icon = "";
  iconClass = "";
  template = true;
  constructor(
    public type: NotificationTypes,
    public title: string,
    public description: string = ""
  ) {
    switch (this.type) {
      case NotificationTypes.SAVE:
        this.icon = "save";
        this.iconClass = "text-success";
        break;
      case NotificationTypes.RESEARCH:
        this.icon = Game.getGame().resourceManager.science.icon;
        this.iconClass = Game.getGame().resourceManager.science.colorClass;
        break;
      case NotificationTypes.LOAD:
        this.template = false;
        break;
    }
  }
}
