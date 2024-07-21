import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { VerticalLayoutComponent } from './shared/layouts/vertical-layout/vertical-layout.component';
import { ContactUsComponent } from './modules/core/components/contact-us/contact-us.component';
import { NewsComponent } from './modules/core/components/news/news.component';
import { QuotationRequestComponent } from './modules/core/components/quotation-request/quotation-request.component';
import { ElectronicServicesComponent } from './modules/core/components/electronic-services/electronic-services.component';
import { AuthGuard } from './core/helper/auth.guard';
import { AcceptOfferPriceComponent } from './modules/core/components/accept-offer-price/accept-offer-price.component';
import { AcceptFileComponent } from './modules/core/components/accept-file/accept-file.component';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('src/app/modules/authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: 'dash',
    component: VerticalLayoutComponent,
    loadChildren: () =>
      import('src/app/modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),canActivate:[AuthGuard],
  },
  {
    path: 'customers',
    component: VerticalLayoutComponent,
    loadChildren: () =>
      import('src/app/modules/customers/customers.module').then(
        (m) => m.CustomersModule
      ),canActivate:[AuthGuard],
  },
  {
    path: 'projects',
    component: VerticalLayoutComponent,
    loadChildren: () =>
      import(
        'src/app/modules/project-management/project-management.module'
      ).then((m) => m.ProjectManagementModule),canActivate:[AuthGuard],
  },
  {
    path: 'employees',
    component: VerticalLayoutComponent,
    loadChildren: () =>
      import('src/app/modules/employees-affairs/employees-affairs.module').then(
        (m) => m.EmployeesAffairsModule
      ),canActivate:[AuthGuard],
  },
  {
    path: 'accounts',
    component: VerticalLayoutComponent,
    loadChildren: () =>
      import('src/app/modules/accounts/accounts.module').then(
        (m) => m.AccountsModule
      ),canActivate:[AuthGuard],
  },
    {
    path: 'communications',
    component: VerticalLayoutComponent,
    loadChildren: () =>
      import('src/app/modules/communications/communications.module').then(
        (m) => m.CommunicationsModule
      ),
  },
  {
    path: 'controlpanel',
    component: VerticalLayoutComponent,
    loadChildren: () =>
      import('src/app/modules/control-panel/control-panel.module').then(
        (m) => m.ControlPanelModule
      ),canActivate:[AuthGuard],
  },
  {
    path: 'reports',
     loadChildren: () =>
      import('src/app/modules/reports/reports.module').then(
        (m) => m.ReportsModule
      ),
  },

  { path: 'electronic-services', component: ElectronicServicesComponent },
  { path: 'quotation-request', component: QuotationRequestComponent },
  { path: 'news', component: NewsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'accept-offer-price', component: AcceptOfferPriceComponent },
  { path: 'accept-file', component: AcceptFileComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
