import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxPrintElementService } from 'ngx-print-element';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-tax-declaration',
  templateUrl: './tax-declaration.component.html',
  styleUrls: ['./tax-declaration.component.scss'],
})
export class TaxDeclarationComponent {
  items1: any = [
    { title: 'adawd' },
    { title: 'adawd' },
    { title: 'adawd' },
    { title: 'total' },
  ];
  items2: any = [
    { title: 'adawd' },
    { title: 'adawd' },
    { title: 'adawd' },
    { title: 'total' },
  ];
  lang: any = 'ar';
  constructor(
    private print: NgxPrintElementService,
    private translate: TranslateService
  ) {
    this.translate.use(this.lang);
  }

  ngOnInit(): void {}

  printData(id: any) {
    this.print.print(id, environment.printConfig);
  }
}
