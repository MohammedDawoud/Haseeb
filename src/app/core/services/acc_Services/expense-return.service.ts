import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ExportationService } from '../exportation-service/exportation.service';
import { VoucherFilterVM } from '../../Classes/ViewModels/voucherFilterVM';

@Injectable({
  providedIn: 'root'
})
export class EntryReturnService {

  private apiEndPoint: string = '';
  constructor(private http: HttpClient,
    private exportationService: ExportationService,) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  FillAccountsSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Account/FillAccountsSelect');
  }
  GetAllPayVouchersRet(_voucherFilterVM:VoucherFilterVM): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_voucherFilterVM);
    return this.http.post(this.apiEndPoint + 'Voucher/GetAllPayVouchersRet', body,{'headers':headers});
  }
  SavePayVoucherForServicesRet(InvoiceId:any): Observable<any> {
    return this.http.post(this.apiEndPoint + 'Voucher/SavePayVoucherForServicesRet',{InvoiceId:InvoiceId});
  }
  PrintPayVoucherRet(VoucherId: any) {
    return this.http.post(this.apiEndPoint + 'Voucher/PrintPayVoucherRet?VoucherId='+VoucherId, {});
  }
  GetAllPayJournalsByInvIDRet(invId: any) {
    var url = `${environment.apiEndPoint}DailyJournal/GetAllPayJournalsByInvIDRet?&invId=${invId}`;
    return this.http.get<any>(url);
  }
  PrintJournalsVyInvIdRetPurchase(VoucherId: any) {
    var url = `${environment.apiEndPoint}DailyJournal/PrintJournalsByReVoucherId?&InvId=${VoucherId}`;
    return this.http.post<any>(url,{});
  }
}
