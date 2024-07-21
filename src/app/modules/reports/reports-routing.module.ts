import { BalanceCreditComponent } from './components/balance-credit/balance-credit.component';
import { AccountInfoComponent } from './components/account-info/account-info.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfferPriceComponent } from './components/offer-price/offer-price.component';
import { TaxDeclarationComponent } from './components/tax-declaration/tax-declaration.component';
import { StageReportComponent } from './components/stage-report/stage-report.component';

const routes: Routes = [
  { path: '', redirectTo: 'offer-price', pathMatch: 'full' },
  { path: 'offer-price', component: OfferPriceComponent },
  { path: 'account-info', component: AccountInfoComponent },
  { path: 'tax-declaration', component: TaxDeclarationComponent },
  { path: 'balance-credit', component: BalanceCreditComponent },
  { path: 'stage-report', component: StageReportComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
