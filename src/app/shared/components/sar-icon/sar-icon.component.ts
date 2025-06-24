import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sar-icon',
  templateUrl: './sar-icon.component.html',
  styleUrls: ['./sar-icon.component.scss']
})
export class SarIconComponent {
  @Input() width: number = 20;
  @Input() height: number = 15;
  @Input() alt: string = 'SAR';
}
