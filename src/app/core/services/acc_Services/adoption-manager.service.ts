import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { VoucherFilterVM } from '../../Classes/ViewModels/voucherFilterVM';
import { Invoices } from '../../Classes/DomainObjects/invoices';
import { ExportationService } from '../exportation-service/exportation.service';
import { Acc_Clauses } from '../../Classes/DomainObjects/acc_Clauses';


@Injectable({
  providedIn: 'root'
})
export class AdoptionManagerService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient,
    private exportationService: ExportationService,) {
    this.apiEndPoint = environment.apiEndPoint;
  }


  FillBranchSelect() {
    return this.http.get<any>(this.apiEndPoint+'Branches/FillBranchSelect');
  }
  GetEmpPayrollMarches(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Employee/GetEmpPayrollMarches', body,{'headers':headers});
  }
    GetEmpPayrollMarchesNew(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Employee/GetEmpPayrollMarchesNew', body,{'headers':headers});
  }
  FillCostCenterSelect() {
    return this.http.get<any>(this.apiEndPoint + 'CostCenter/FillCostCenterSelect');
  }
  GetAccCodeFormID(AccID:any){
    return this.http.get<any>(this.apiEndPoint + 'Account/GetAccCodeFormID?AccID='+AccID+'');
  }
  FillSubAccountLoad() {
    return this.http.get<any>(this.apiEndPoint + 'Account/FillSubAccountLoad');
  }
  FillCustAccountsSelect2(param:any){
    return this.http.get<any>(this.apiEndPoint + 'Account/FillCustAccountsSelect2?param='+param+'');

  }


  FillpayForSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Banks/FillBankSelect');
  }
  GetAllpayFor() {
    var SearchText= " "
    return this.http.get<any>(this.apiEndPoint + 'Banks/GetAllBanks?SearchText='+SearchText);
  }
  SavepayFor(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'Banks/Savebanks', body, { 'headers': headers });
  }
  DeletepayFor(BankId: number): Observable<any> {
    return this.http.post(`${this.apiEndPoint}Banks/DeleteBanks?BankId=` + BankId, {});
  }


  GetAllClauses(SearchText:any){
    return this.http.get<any>(this.apiEndPoint + 'Clauses/GetAllClauses?SearchText='+SearchText+'');
  }
  DeleteClause(ClauseId:any): Observable<any> {
    return this.http.post(this.apiEndPoint + 'Clauses/DeleteClause?ClauseId='+ClauseId+'',null);
  }
  SaveClause(_clouses:Acc_Clauses): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_clouses);
    return this.http.post(this.apiEndPoint + 'Clauses/SaveClause', body,{'headers':headers});
  }
  FillClausesSelect(){
    return this.http.get<any>(this.apiEndPoint + 'Clauses/FillClausesSelect2');
  }
  GetInvoiceById(invId: any) {
    var url = `${environment.apiEndPoint}Voucher/GetInvoiceById?VoucherId=${invId}`;
    return this.http.get<any>(url);
  }
  SaveEmpVoucher(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Voucher/SaveEmpVoucher', body,{'headers':headers});
  }

  PostVouchersCustody(obj:Invoices[]): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Voucher/PostVouchersCustody', body,{'headers':headers});
  }
  DailyVoucherReport_Custody(VoucherId:any) {
    return this.http.get<any>(this.apiEndPoint+'Voucher/DailyVoucherReport_Custody?VoucherId='+VoucherId);
  }

  GetBranch_Costcenter() {
    return this.http.get<any>(this.apiEndPoint + 'CostCenter/GetBranch_Costcenter');
  }


  PostAllEmpPayrollVoucher(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Employee/PostAllEmpPayrollVoucher', body,{'headers':headers});
  }
  PostALLEmpPayrollPayVoucher(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Employee/PostALLEmpPayrollPayVoucher', body,{'headers':headers});
  }
  PostEmpPayrollVoucher(payrollId:any): Observable<any> {
    return this.http.post(this.apiEndPoint + 'Employee/PostEmpPayrollVoucher?payrollId='+payrollId,{});
  }
  PostEmpPayrollPayVoucher(payrollId:any): Observable<any> {
    return this.http.post(this.apiEndPoint + 'Employee/PostEmpPayrollPayVoucher?payrollId='+payrollId,{});
  }
  GetEmployeesForPayroll() {
    return this.http.get<any>(this.apiEndPoint + 'Employee/GetEmployeesForPayroll?IsAllBranch=true');
  }


  GetEmployeesForPayrollNew() {
    return this.http.get<any>(this.apiEndPoint + 'Employee/GetEmployeesForPayrollNew?IsAllBranch=true');
  }



}
