import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxPrintElementService } from 'ngx-print-element';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-balance-credit',
  templateUrl: './balance-credit.component.html',
  styleUrls: ['./balance-credit.component.scss'],
})
export class BalanceCreditComponent implements OnInit {
  items: any = [1, 2, 3, 4, 5, 6, 7, 8];
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
