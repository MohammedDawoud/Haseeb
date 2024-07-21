import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ExportationService } from '../exportation-service/exportation.service';
import { VoucherFilterVM } from '../../Classes/ViewModels/voucherFilterVM';

@Injectable({
  providedIn: 'root'
})
export class ClosedvoucherService {
  private apiEndPoint: string = '';
  constructor(private http: HttpClient,
    private exportationService: ExportationService,) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  FillAccountsSelectByBranchId(param: any) {
    var url = `${environment.apiEndPoint}Account/FillAccountsSelectByBranchId?&param=${param}`;
    return this.http.get<any>(url);
  }
  GetAllTransByVoucherId(voucherId: any) {
    var url = `${environment.apiEndPoint}Voucher/GetAllTransByVoucherId?&voucherId=${voucherId}`;
    return this.http.get<any>(url);
  }


  GetAllVouchersNew(_voucherFilterVM: VoucherFilterVM): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(_voucherFilterVM);
    return this.http.post(this.apiEndPoint + 'Voucher/GetAllVouchersNew', body, { 'headers': headers });
  }
  Printdiffrentvoucher(_voucherFilterVM: VoucherFilterVM): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(_voucherFilterVM);
    return this.http.post(this.apiEndPoint + 'Voucher/Printdiffrentvoucher', body, { 'headers': headers });
  }
  ClosingVoucherReport(VoucherId: any) {
    var url = `${environment.apiEndPoint}Voucher/ClosingVoucherReport?&VoucherId=${VoucherId}`;
    return this.http.get<any>(url);
  }
  GetAllJournalsByClosingID(invId: any) {
    var url = `${environment.apiEndPoint}DailyJournal/GetAllJournalsByClosingID?&invId=${invId}`;
    return this.http.get<any>(url);
  }
  DeleteVoucher(VoucherId:any){
    return this.http.post(this.apiEndPoint+'Voucher/DeleteVoucher', {}, { params:{VoucherId:VoucherId}});
  }
  SaveClosingVoucher(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Voucher/SaveClosingVoucher', body,{'headers':headers});
  }
  SaveandPostlosingVoucher(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Voucher/SaveandPostlosingVoucher', body,{'headers':headers});
  }
  UploadPayVoucherImage(model : any){
    return this.http.post<any>(`${this.apiEndPoint}Voucher/UploadPayVoucherImage`, model);
  }
  GetClosingVouchers() {
    return this.http.get<any>(this.apiEndPoint+'Account/GetClosingVouchers');
  }

}
