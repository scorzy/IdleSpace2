import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";

export const fadeIn = trigger("fadeIn", [
  transition(":enter", [
    style({ opacity: "0" }),
    animate(".5s ease-out", style({ opacity: "1" }))
  ])
]);
