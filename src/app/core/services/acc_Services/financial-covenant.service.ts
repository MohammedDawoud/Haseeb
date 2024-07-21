import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ExportationService } from '../exportation-service/exportation.service';
import { VoucherFilterVM } from '../../Classes/ViewModels/voucherFilterVM';
import { Invoices } from '../../Classes/DomainObjects/invoices';

@Injectable({
  providedIn: 'root'
})
export class FinancialCovenantService {

  private apiEndPoint: string = '';
  constructor(private http: HttpClient,
    private exportationService: ExportationService,) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  FillEmployeeSelect() {
    return this.http.get<any>(this.apiEndPoint+'Employee/FillSelectEmployee');
  }
  GetSomeCustodyVoucher() {
    return this.http.get<any>(this.apiEndPoint+'Custody/GetSomeCustodyVoucher?Status=false');
  }
  SearchCustodyVoucher(_voucherFilterVM:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_voucherFilterVM);
    return this.http.post(this.apiEndPoint + 'Custody/SearchCustodyVoucher', body,{'headers':headers});
  }
  PostBackVouchersCustody(obj:Invoices[]): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Voucher/PostBackVouchersCustody', body,{'headers':headers});
  }
  GetBranch_Costcenter() {
    return this.http.get<any>(this.apiEndPoint + 'CostCenter/GetBranch_Costcenter');
  }
  SaveandPostDailyVoucher(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Voucher/SaveandPostDailyVoucher', body,{'headers':headers});
  }
  SaveCustodyVoucher(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Custody/SaveCustodyVoucher', body,{'headers':headers});
  }
  DailyVoucherReport_Custody(VoucherId:any) {
    return this.http.get<any>(this.apiEndPoint+'Voucher/DailyVoucherReport_Custody?VoucherId='+VoucherId);
  }
  GetAllJournalsByDailyID_Custody(invId: any) {
    var url = `${environment.apiEndPoint}DailyJournal/GetAllJournalsByDailyID_Custody?&invId=${invId}`;
    return this.http.get<any>(url);
  }
  GetInvoiceById(invId: any) {
    var url = `${environment.apiEndPoint}Voucher/GetInvoiceById?VoucherId=${invId}`;
    return this.http.get<any>(url);
  }
  PostVouchersCustody(obj:Invoices[]): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Voucher/PostVouchersCustody', body,{'headers':headers});
  }
  DeleteVoucher(VoucherId:any){
    return this.http.post(this.apiEndPoint+'Voucher/DeleteVoucher', {}, { params:{VoucherId:VoucherId}});
  }
}
