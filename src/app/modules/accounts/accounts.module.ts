import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { SalesBillComponent } from './components/sales-bill/sales-bill.component';
import { SalesReturnComponent } from './components/sales-return/sales-return.component';
import { PurchasesBillComponent } from './components/purchases-bill/purchases-bill.component';
import { PurchaseInvoiceReturnComponent } from './components/purchase-invoice-return/purchase-invoice-return.component';
import { CatchReceiptComponent } from './components/catch-receipt/catch-receipt.component';
import { ReceiptComponent } from './components/receipt/receipt.component';
import { ExpenseReturnComponent } from './components/expense-return/expense-return.component';
import { UnderDailyComponent } from './components/under-daily/under-daily.component';
import { CanceledSalesInvoiceComponent } from './components/canceled-sales-invoice/canceled-sales-invoice.component';
import { CanceledPurchaseInvoicesComponent } from './components/canceled-purchase-invoices/canceled-purchase-invoices.component';
import { FinancialCovenantComponent } from './components/financial-covenant/financial-covenant.component';
import { CustomerContractsComponent } from './components/customer-contracts/customer-contracts.component';
import { OfficialDocumentsComponent } from './components/official-documents/official-documents.component';
import { BillingServicesComponent } from './components/billing-services/billing-services.component';
import { WarrantiesComponent } from './components/warranties/warranties.component';
import { AdoptionOfThemanagerComponent } from './components/adoption-of-themanager/adoption-of-themanager.component';
import { SharedModule } from '../../shared/shared.module';
import { TreeNgxModule } from 'tree-ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ChecksIssuedComponent } from './components/checks-issued/checks-issued.component';
import { AccountStatementComponent } from './components/account-statement/account-statement.component';
import { TrialBalanceComponent } from './components/trial-balance/trial-balance.component';
import { TaxdeclarationComponent } from './components/taxdeclaration/taxdeclaration.component';
import { StatementOfCustomersDeferredBalancesComponent } from './components/statement-of-customers-deferred-balances/statement-of-customers-deferred-balances.component';
import { StatementOfFinancialPositionComponent } from './components/statement-of-financial-position/statement-of-financial-position.component';
import { IncomeListComponent } from './components/income-list/income-list.component';
import { GeneralJournalComponent } from './components/general-journal/general-journal.component';
import { CostCenterMovementComponent } from './components/cost-center-movement/cost-center-movement.component';
import { SynthesisStatementOfBondsComponent } from './components/synthesis-statement-of-bonds/synthesis-statement-of-bonds.component';
import { ProjectManagersRevenueComponent } from './components/project-managers-revenue/project-managers-revenue.component';
import { CustomerRevenueComponent } from './components/customer-revenue/customer-revenue.component';
import { ExpenseFollowUpComponent } from './components/expense-follow-up/expense-follow-up.component';
import { FollowUpRevenuesAndExpensesComponent } from './components/follow-up-revenues-and-expenses/follow-up-revenues-and-expenses.component';
import { FollowUpOnCreditAndDebitNotesComponent } from './components/follow-up-on-credit-and-debit-notes/follow-up-on-credit-and-debit-notes.component';
import { AccountsGuideComponent } from './components/accounts-guide/accounts-guide.component';
import { CostCentresComponent } from './components/cost-centres/cost-centres.component';
import { FiscalYearsComponent } from './components/fiscal-years/fiscal-years.component';
import { OpeningEntryComponent } from './components/opening-entry/opening-entry.component';
import { ServicePricesComponent } from './components/service-prices/service-prices.component';
import { ClosedComponent } from './components/closed/closed.component';
import { IncomeListFinalAccComponent } from './components/income-list-final-acc/income-list-final-acc.component';
import { FollowUpOnCustomerRevenueComponent } from './components/follow-up-on-customer-revenue/follow-up-on-customer-revenue.component';

import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SuppliersComponent } from './components/suppliers/suppliers.component';
import { InvoicedueComponent } from './components/invoicedue/invoicedue.component';
import { SalesBillDraftsComponent } from './components/sales-bill-drafts/sales-bill-drafts.component';
import { DebenturesComponent } from './components/debentures/debentures.component';
import { TransferDebenturesComponent } from './components/transfer-debentures/transfer-debentures.component';
import { QuantitiesComponent } from './components/quantities/quantities.component';
import { DailyInvoiceWithDetailsComponent } from './components/daily-invoice-with-details/daily-invoice-with-details.component';
import { MonthlyInvoicesComponent } from './components/monthly-invoices/monthly-invoices.component';
import { MonthlyinvoiceswithdayesComponent } from './components/monthlyinvoiceswithdayes/monthlyinvoiceswithdayes.component';
import { YearlyinvoiceswitMonthsComponent } from './components/yearlyinvoiceswit-months/yearlyinvoiceswit-months.component';


@NgModule({
  declarations: [
    SalesBillComponent,
    SalesReturnComponent,
    PurchasesBillComponent,
    PurchaseInvoiceReturnComponent,
    CatchReceiptComponent,
    ReceiptComponent,
    ExpenseReturnComponent,
    UnderDailyComponent,
    CanceledSalesInvoiceComponent,
    CanceledPurchaseInvoicesComponent,
    FinancialCovenantComponent,
    CustomerContractsComponent,
    OfficialDocumentsComponent,
    BillingServicesComponent,
    WarrantiesComponent,
    AdoptionOfThemanagerComponent,
    ChecksIssuedComponent,
    AccountStatementComponent,
    TrialBalanceComponent,
    TaxdeclarationComponent,
    StatementOfCustomersDeferredBalancesComponent,
    StatementOfFinancialPositionComponent,
    IncomeListComponent,
    GeneralJournalComponent,
    CostCenterMovementComponent,
    SynthesisStatementOfBondsComponent,
    ProjectManagersRevenueComponent,
    CustomerRevenueComponent,
    ExpenseFollowUpComponent,
    DailyInvoiceWithDetailsComponent,
    FollowUpRevenuesAndExpensesComponent,
    FollowUpOnCreditAndDebitNotesComponent,
    AccountsGuideComponent,
    CostCentresComponent,
    FiscalYearsComponent,
    OpeningEntryComponent,
    ServicePricesComponent,
    ClosedComponent,
    IncomeListFinalAccComponent,
    FollowUpOnCustomerRevenueComponent,
    SuppliersComponent,
    InvoicedueComponent,
    SalesBillDraftsComponent,
    DebenturesComponent,
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    MatIconModule,
    MatRadioModule,
    NgbModule,
    MatProgressBarModule,
    ModalModule,
    TreeNgxModule,
    NgApexchartsModule,
    TabsModule,
    TimepickerModule,
    BsDropdownModule,
    MatTabsModule,
    MatStepperModule,
    NgxHijriGregorianDatepickerModule,
    DragDropModule
  ],
})
export class AccountsModule {}
