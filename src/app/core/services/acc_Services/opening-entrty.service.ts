import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { VoucherFilterVM } from '../../Classes/ViewModels/voucherFilterVM';
import { Invoices } from '../../Classes/DomainObjects/invoices';
import { ExportationService } from '../exportation-service/exportation.service';


@Injectable({
  providedIn: 'root'
})
export class OpeningEntrtyService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient,
    private exportationService: ExportationService,) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetAllVouchers(): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify({Type: 10});
    return this.http.post(this.apiEndPoint + 'Voucher/GetAllVouchers', body,{'headers':headers});
  }

  SaveOpeningVoucher(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Voucher/SaveOpeningVoucher', body,{'headers':headers});
  }
  SaveandPostOpeningVoucher(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Voucher/SaveandPostOpeningVoucher', body,{'headers':headers});
  }
  OpeningVoucherReport(VoucherId: any) {
    var url = `${environment.apiEndPoint}Voucher/OpeningVoucherReport?&VoucherId=${VoucherId}`;
    return this.http.get<any>(url);
  }
  DeleteVoucher(VoucherId:any){

    return this.http.post(this.apiEndPoint+'Voucher/DeleteVoucher', {}, { params:{VoucherId:VoucherId}});
  }
  GetAllDetailsByVoucherId(voucherId:any) {
    return this.http.get<any>(this.apiEndPoint + 'Voucher/GetAllDetailsByVoucherId?voucherId='+voucherId);
  }
  PostVouchers(modal:any) {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(modal);
    return this.http.post<any>(this.apiEndPoint + 'Voucher/PostVouchers', body,{'headers':headers});
  }
  GetAllTransByVoucherId(voucherId: any) {
    var url = `${environment.apiEndPoint}Voucher/GetAllTransByVoucherId?&voucherId=${voucherId}`;
    return this.http.get<any>(url);
  }
    PostVouchersCheckBox(_InvoicesIds:any) {
    const formData: FormData = new FormData();
    for(let i = 0; i < _InvoicesIds.length; i++) {
      formData.append("voucherIds",_InvoicesIds[i]);
    }
    return this.http.post<any>(this.apiEndPoint + 'Voucher/PostVouchersCheckBox', formData);

  }
}
