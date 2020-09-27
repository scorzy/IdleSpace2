import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { MainService } from "src/app/main.service";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: "app-playfab-email",
  templateUrl: "./playfab-email.component.html",
  styleUrls: ["./playfab-email.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayfabEmailComponent implements OnInit {
  playFabEmail = "";
  playFabPsw = "";
  playFabPsw2 = "";
  @Input() type = 1;

  constructor(public ms: MainService, private message: NzMessageService) {}

  ngOnInit(): void {}
  playFabLogin() {
    this.playFabEmail = this.playFabEmail.trim();
    if (this.playFabEmail === "") {
      this.message.error("Please specify an email");
      return;
    }
    this.ms.playFabLoginEmail(this.playFabEmail, this.playFabPsw);
  }
  registerPlayFab() {
    this.playFabEmail = this.playFabEmail.trim();
    if (this.playFabEmail === "") {
      this.message.error("Please specify an email");
      return;
    }
    if (this.playFabPsw !== this.playFabPsw2) {
      this.message.error("Password don't match");
      return;
    }
    this.ms.registerPlayFab(this.playFabEmail, this.playFabPsw);
  }
  recover() {
    this.playFabEmail = this.playFabEmail.trim();
    if (this.playFabEmail === "") {
      this.message.error("Please specify an email");
      return;
    }
    this.ms.recoverPassword(this.playFabEmail);
  }
}
