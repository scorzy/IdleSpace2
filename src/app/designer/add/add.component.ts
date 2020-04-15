import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from "@angular/forms";
import { ShipType } from "src/app/model/shipyard/ShipType";
import { MainService } from "src/app/main.service";
import { Router } from "@angular/router";
import { upperCase } from "lodash-es";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  validateForm: FormGroup;
  unlockedTypes = new Array<ShipType>();

  constructor(
    ms: MainService,
    cd: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder
  ) {
    super(ms, cd);
  }

  ngOnInit(): void {
    this.unlockedTypes = this.ms.game.shipyardManager.shipTypes.filter(
      (t) => t.unlocked || true
    );
    this.validateForm = this.fb.group({
      name: [null, [Validators.required, this.nameValidator]],
      type: [1, [Validators.required]]
    });
    this.getRandomName();
  }
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls[i]) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.validateForm.valid) {
      const id = this.ms.game.shipyardManager.addDesign(
        this.getName(),
        this.validateForm.get("type").value
      );
      if (id > -1) this.router.navigate(["/des/edit/" + id]);
    }
  }

  getRandomName(event?: MouseEvent) {
    this.validateForm.patchValue({ name: "ciao" });
    if (event) event.preventDefault();
  }
  removeName() {
    this.validateForm.patchValue({ name: "" });
  }
  getName(): string {
    return this.validateForm.get("name").value;
  }
  getTypeId(index: number, shipType: ShipType) {
    return shipType.id;
  }

  nameValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (
      this.ms.game.shipyardManager.shipDesigns
        .map((s) => upperCase(s.name))
        .findIndex((n) => n === upperCase(control.value)) > -1
    ) {
      return { error: true, duplicated: true };
    }
    return {};
  };
}
