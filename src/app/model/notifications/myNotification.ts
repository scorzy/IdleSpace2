import { Game } from "../game";

export enum NotificationTypes {
  SAVE,
  LOAD,
  RESEARCH,
  BATTLE_WIN,
  BATTLE_LOST,
  ENEMY_DEFEATED,
  MATERIAL_ENDED
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
      case NotificationTypes.BATTLE_LOST:
        this.icon = "my:tattered-banner";
        this.iconClass = "text-danger";
        break;
      case NotificationTypes.BATTLE_WIN:
        this.icon = "my:flying-flag";
        this.iconClass = "habSpace-color";
        break;
      case NotificationTypes.ENEMY_DEFEATED:
        this.icon = "my:rally-the-troops";
        this.iconClass = "text-success";
        break;
      case NotificationTypes.MATERIAL_ENDED:
        this.icon = "fall";
        this.iconClass = "text-danger";
        break;
    }
  }
}
