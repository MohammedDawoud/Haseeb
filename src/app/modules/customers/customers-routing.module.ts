import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSearchComponent } from './add-search/add-search.component';
import { ServicesComponent } from './services/services.component';
import { ReportsComponent } from './reports/reports.component';
import { AccountsComponent } from './accounts/accounts.component';
import { CollectionsComponent } from './collections/collections.component';

const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', component: AddSearchComponent },
  { path: 'CustomerOperations', component: ServicesComponent },
  { path: 'CustomerReports', component: ReportsComponent },
  { path: 'AccountStatementCustomer', component: AccountsComponent },
  { path: 'ContractNCustomer', component: CollectionsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
