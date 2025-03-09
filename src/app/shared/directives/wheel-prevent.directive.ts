import { Directive, HostListener } from '@angular/core';

@Directive({
  // selector: '[appWheelPrevent]'
  selector: 'input[type="number"]'
})

export class WheelPreventDirective {
  constructor() { }
  @HostListener('wheel', ['$event'])
  onWheelEvent(event: WheelEvent) {
    event.preventDefault();
  }
}
