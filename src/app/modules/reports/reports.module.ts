import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { OfferPriceComponent } from './components/offer-price/offer-price.component';
import { AgmCoreModule } from '@agm/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxGaugeModule } from 'ngx-gauge';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmployeesAffairsModule } from '../employees-affairs/employees-affairs.module';
import { NgxPrintElementModule } from 'ngx-print-element';
import { AccountInfoComponent } from './components/account-info/account-info.component';
import { TaxDeclarationComponent } from './components/tax-declaration/tax-declaration.component';
import { BalanceCreditComponent } from './components/balance-credit/balance-credit.component';
import { StageReportComponent } from './components/stage-report/stage-report.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    OfferPriceComponent,
    AccountInfoComponent,
    TaxDeclarationComponent,
    BalanceCreditComponent,
    StageReportComponent,
  ],
  imports: [
    ReportsRoutingModule,
    CommonModule,
    TranslateModule,
    // BrowserModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
    NgxDatatableModule,
    PaginationModule,
    NgApexchartsModule,
    BsDatepickerModule,
    FileUploadModule,
    BsDropdownModule,
    TreeviewModule,
    MatTabsModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatRadioModule,
    TabsModule,
    AccordionModule,
    NgxGaugeModule,
    EmployeesAffairsModule,
    AgmCoreModule,
    NgxPrintElementModule,

    MatDatepickerModule,
    MatFormFieldModule,
  ],
})
export class ReportsModule {}
