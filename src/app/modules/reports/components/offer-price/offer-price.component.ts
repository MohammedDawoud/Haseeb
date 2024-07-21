import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxPrintElementService } from 'ngx-print-element';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-offer-price',
  templateUrl: './offer-price.component.html',
  styleUrls: ['./offer-price.component.scss'],
})
export class OfferPriceComponent implements OnInit {
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
