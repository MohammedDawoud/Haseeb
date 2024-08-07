import { OpeningEntryComponent } from './components/opening-entry/opening-entry.component';
import { AccountsGuideComponent } from './components/accounts-guide/accounts-guide.component';
import { GeneralJournalComponent } from './components/general-journal/general-journal.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { ChecksIssuedComponent } from './components/checks-issued/checks-issued.component';
import { AccountStatementComponent } from './components/account-statement/account-statement.component';
import { TrialBalanceComponent } from './components/trial-balance/trial-balance.component';
import { IncomeListComponent } from './components/income-list/income-list.component';
import { StatementOfFinancialPositionComponent } from './components/statement-of-financial-position/statement-of-financial-position.component';
import { TaxdeclarationComponent } from './components/taxdeclaration/taxdeclaration.component';
import { StatementOfCustomersDeferredBalancesComponent } from './components/statement-of-customers-deferred-balances/statement-of-customers-deferred-balances.component';
import { CostCenterMovementComponent } from './components/cost-center-movement/cost-center-movement.component';
import { SynthesisStatementOfBondsComponent } from './components/synthesis-statement-of-bonds/synthesis-statement-of-bonds.component';
import { ProjectManagersRevenueComponent } from './components/project-managers-revenue/project-managers-revenue.component';
import { CustomerRevenueComponent } from './components/customer-revenue/customer-revenue.component';
import { ExpenseFollowUpComponent } from './components/expense-follow-up/expense-follow-up.component';
import { FollowUpRevenuesAndExpensesComponent } from './components/follow-up-revenues-and-expenses/follow-up-revenues-and-expenses.component';
import { FollowUpOnCreditAndDebitNotesComponent } from './components/follow-up-on-credit-and-debit-notes/follow-up-on-credit-and-debit-notes.component';
import { IncomeListFinalAccComponent } from './components/income-list-final-acc/income-list-final-acc.component';
import { FiscalYearsComponent } from './components/fiscal-years/fiscal-years.component';
import { CostCentresComponent } from './components/cost-centres/cost-centres.component';
import { ServicePricesComponent } from './components/service-prices/service-prices.component';
import { ClosedComponent } from './components/closed/closed.component';
import { FollowUpOnCustomerRevenueComponent } from './components/follow-up-on-customer-revenue/follow-up-on-customer-revenue.component';
import { SuppliersComponent } from './components/suppliers/suppliers.component';
import { InvoicedueComponent } from './components/invoicedue/invoicedue.component';
import { SalesBillDraftsComponent } from './components/sales-bill-drafts/sales-bill-drafts.component';
import { DebenturesComponent } from './components/debentures/debentures.component';
import { DailyInvoiceWithDetailsComponent } from './components/daily-invoice-with-details/daily-invoice-with-details.component';
import { MonthlyInvoicesComponent } from './components/monthly-invoices/monthly-invoices.component';
import { MonthlyinvoiceswithdayesComponent } from './components/monthlyinvoiceswithdayes/monthlyinvoiceswithdayes.component';
import { YearlyinvoiceswitMonthsComponent } from './components/yearlyinvoiceswit-months/yearlyinvoiceswit-months.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'Sales_bill' },
  { path: 'Sales_bill', component: SalesBillComponent },
  { path: 'Sales_bill_drafts', component: SalesBillDraftsComponent },
  { path: 'Sales_return', component: SalesReturnComponent },
  { path: 'Purchases_bill', component: PurchasesBillComponent },
  { path: 'Purchase_invoice_return', component: PurchaseInvoiceReturnComponent },
  { path: 'Catch_Receipt', component: CatchReceiptComponent },
  { path: 'Receipt', component: ReceiptComponent },
  { path: 'Expense_return', component: ExpenseReturnComponent },
  { path: 'Under_daily', component: UnderDailyComponent },
  { path: 'Canceled_sales', component: CanceledSalesInvoiceComponent },
  { path: 'Canceled_purchase', component: CanceledPurchaseInvoicesComponent },
  { path: 'Financial_covenant', component: FinancialCovenantComponent },
  { path: 'Customer_Contracts', component: CustomerContractsComponent },
  { path: 'official_documents', component: OfficialDocumentsComponent },
  { path: 'Billing_service', component: BillingServicesComponent },
  { path: 'checks_issued', component: ChecksIssuedComponent },
  { path: 'Warranties', component: WarrantiesComponent },
  { path: 'Adoption_of_theManager', component: AdoptionOfThemanagerComponent },


  { path: 'Account_Statement', component: AccountStatementComponent},
  { path: 'general_Journal', component: GeneralJournalComponent },
  { path: 'Trial_Balance', component: TrialBalanceComponent },
  { path: 'Incom_List', component: IncomeListComponent },
  { path: 'Statement_of_financial_position', component: StatementOfFinancialPositionComponent },
  { path: 'Tax_declaration', component: TaxdeclarationComponent },
  { path: 'Statement_of_customers_deferred_balances', component: StatementOfCustomersDeferredBalancesComponent },
  { path: 'Cost_center_movement', component: CostCenterMovementComponent },
  { path: 'Invoicedue', component: InvoicedueComponent },
  { path: 'Synthesis_statement_of_bonds', component: SynthesisStatementOfBondsComponent },
  { path: 'Project_managers_revenue', component: ProjectManagersRevenueComponent },
  { path: 'FollowUp_on_Customer_revenue', component: FollowUpOnCustomerRevenueComponent },
  { path: 'Customer_revenue', component: CustomerRevenueComponent },
  { path: 'Expense_follow_up', component: ExpenseFollowUpComponent },
  { path: 'Follow_up_the_revenues_and_expenses', component: FollowUpRevenuesAndExpensesComponent },
  { path: 'Follow_up_on_credit_and_debit_notes', component: FollowUpOnCreditAndDebitNotesComponent },
  { path: 'Accounts_guide', component: AccountsGuideComponent },
  { path: 'Cost_centres', component: CostCentresComponent},
  { path: 'Fiscal_years', component: FiscalYearsComponent },
  { path: 'Income_list_final_acc', component: IncomeListFinalAccComponent },
  { path: 'Opening_entry', component: OpeningEntryComponent },
  { path: 'Service_prices', component: ServicePricesComponent },
  { path: 'Closed', component: ClosedComponent },
  { path: 'Suppliers', component: SuppliersComponent },
  { path: 'Debentures', component: DebenturesComponent },
    { path: 'daily-invoice-with-details', component: DailyInvoiceWithDetailsComponent },
    { path: 'monthly-invoices', component: MonthlyInvoicesComponent },
    { path: 'monthlyinvoiceswithdayes', component: MonthlyinvoiceswithdayesComponent },
    { path: 'yearlyinvoiceswit-months', component: YearlyinvoiceswitMonthsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
