import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectronicServicesComponent } from './components/electronic-services/electronic-services.component';
import { QuotationRequestComponent } from './components/quotation-request/quotation-request.component';
import { NewsComponent } from './components/news/news.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { NgSelectModule } from '@ng-select/ng-select';
import { AcceptOfferPriceComponent } from './components/accept-offer-price/accept-offer-price.component';
import { AcceptFileComponent } from './components/accept-file/accept-file.component';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  declarations: [
    ElectronicServicesComponent,
    QuotationRequestComponent,
    NewsComponent,
    ContactUsComponent,
    AcceptOfferPriceComponent,
    AcceptFileComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatTabsModule,
    TabsModule,
    FormsModule,
    WebcamModule,
    MatStepperModule,
    MatInputModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgOtpInputModule,
  ],
})
export class CoreModule {}
