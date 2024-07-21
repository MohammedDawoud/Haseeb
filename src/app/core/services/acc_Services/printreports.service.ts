import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { VoucherFilterVM } from '../../Classes/ViewModels/voucherFilterVM';
import { Invoices } from '../../Classes/DomainObjects/invoices';

@Injectable({
  providedIn: 'root',
})
export class PrintreportsService {
  private apiEndPoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  ChangeInvoice_PDF(InvoiceId: any, TempCheck: any) {
    if (TempCheck == 1) {
      var url = `${environment.apiEndPoint}Voucher/ChangeInvoice_PDF?InvoiceId=${InvoiceId}&TempCheck=${TempCheck}`;
      return this.http.get<any>(url);
    } else if (TempCheck == 29) {
      var url = `${environment.apiEndPoint}Voucher/ChangeInvoice_PDFCredit?InvoiceId=${InvoiceId}&TempCheck=${TempCheck}`;
      return this.http.get<any>(url);
    } else if (TempCheck == 30) {
      var url = `${environment.apiEndPoint}Voucher/ChangeInvoice_PDFCredit?InvoiceId=${InvoiceId}&TempCheck=${TempCheck}`;
      return this.http.get<any>(url);
    } else {
      var url = `${environment.apiEndPoint}Voucher/ChangeInvoice_PDF?InvoiceId=${InvoiceId}&TempCheck=${TempCheck}`;
      return this.http.get<any>(url);
    }
  }
  PrintVoucher(VoucherId: any, ReportType: any) {
    var url = `${environment.apiEndPoint}Voucher/PrintVoucher?VoucherId=${VoucherId}&ReportType=${ReportType}`;
    return this.http.get<any>(url);
  }
  ChangeOffer_PDF(OfferId: any) {
    var url = `${environment.apiEndPoint}OffersPrice/ChangeOffer_PDF?OfferId=${OfferId}`;
    return this.http.get<any>(url);
  }
  ChangeOfferGene_PDF(FormId: any,TempCheck:any) {
    var url = `${environment.apiEndPoint}ServicesPricingForm/ChangeOfferGene_PDF?FormId=${FormId}&TempCheck=${TempCheck}`;
    return this.http.get<any>(url);
  }
  PrintJournalsVyInvId(InvId: any) {
    var url = `${environment.apiEndPoint}DailyJournal/PrintJournalsVyInvId?&invId=${InvId}`;
    return this.http.get<any>(url);
  }
  PrintJournalsVyInvIdRet(InvId: any) {
    var url = `${environment.apiEndPoint}DailyJournal/PrintJournalsVyInvId?&invId=${InvId}`;
    return this.http.get<any>(url);
  }
  PrintJournalsByDailyId(InvId: any) {
    var url = `${environment.apiEndPoint}DailyJournal/PrintJournalsByDailyId?&invId=${InvId}`;
    return this.http.get<any>(url);
  }
  PrintJournalsByClosingId(InvId: any) {
    var url = `${environment.apiEndPoint}DailyJournal/PrintJournalsByClosingId?&invId=${InvId}`;
    return this.http.get<any>(url);
  }
  ChangePurchase_PDF(InvoiceId: any, TempCheck: any) {
    var url = `${environment.apiEndPoint}Voucher/ChangePurchase_PDF?InvoiceId=${InvoiceId}&TempCheck=${TempCheck}`;
    return this.http.get<any>(url);
  }
  GetReport(invId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Voucher/GetReport?VoucherId=' + invId
    );
  }

  GetEmployeeDashboardReport(type: any, DepartmentId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'Home/printPDFDirectNew?type=' +
        type +
        '&DepartmentId=' +
        DepartmentId +
        ''
    );
  }
}
