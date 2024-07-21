import { Component } from '@angular/core';
import { NgxPrintElementService } from 'ngx-print-element';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-stage-report',
  templateUrl: './stage-report.component.html',
  styleUrls: ['./stage-report.component.scss'],
})
export class StageReportComponent {
  constructor(private print: NgxPrintElementService) {}
  printData(id: any) {
    this.print.print(id, environment.printConfig);
  }
}
