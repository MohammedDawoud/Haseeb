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
export class PurchasesBillService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient,
    private exportationService: ExportationService,) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetAllVouchersSearchInvoice(_voucherFilterVM:VoucherFilterVM): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_voucherFilterVM);
    return this.http.post(this.apiEndPoint + 'Voucher/GetAllVouchersSearchInvoice', body,{'headers':headers});
  }
  FillSuppliersSelect() {
    return this.http.get<any>(this.apiEndPoint+'Suppliers/FillSuppliersSelect');
  }
  GetAllVouchersPurchase(_voucherFilterVM:VoucherFilterVM): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_voucherFilterVM);
    return this.http.post(this.apiEndPoint + 'Voucher/GetAllVouchersPurchase', body,{'headers':headers});
  }
  GetAllVouchersRetSearchPurchase(_voucherFilterVM:VoucherFilterVM): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_voucherFilterVM);
    return this.http.post(this.apiEndPoint + 'Voucher/GetAllVouchersRetSearchPurchase', body,{'headers':headers});
  }
  FillAllNotiPurchaseVoucher(_voucherFilterVM:VoucherFilterVM): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_voucherFilterVM);
    return this.http.post(this.apiEndPoint + 'Voucher/FillAllNotiPurchaseVoucher', body,{'headers':headers});
  }
  ReturnNotiDepitBack(_invoices:Invoices): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_invoices);
    return this.http.post(this.apiEndPoint + 'Voucher/ReturnNotiDepitBack', body,{'headers':headers});
  }

  PostVouchersCheckBox(_InvoicesIds:any) {
    const formData: FormData = new FormData();
    for(let i = 0; i < _InvoicesIds.length; i++) {
      formData.append("voucherIds",_InvoicesIds[i]);
    }
    const req = new HttpRequest('POST', `${this.apiEndPoint}Voucher/PostVouchersCheckBox`, formData);
    return this.http.request(req);
  }

  ChangePurchase_PDF(InvoiceId:any,TempCheck:any) {
    var url=`${environment.apiEndPoint}Voucher/ChangePurchase_PDF?InvoiceId=${InvoiceId}&TempCheck=${TempCheck}`;
    return this.http.get<any>(url);
  }
  ChangeInvoice_PDFCreditPurchase(InvoiceId:any,TempCheck:any) {
    var url=`${environment.apiEndPoint}Voucher/ChangeInvoice_PDFCreditPurchase?InvoiceId=${InvoiceId}&TempCheck=${TempCheck}`;
    return this.http.get<any>(url);
  }
  PrintJournalsVyInvIdRetPurchase(VoucherId: any) {
    var url = `${environment.apiEndPoint}DailyJournal/PrintJournalsByReVoucherId?&InvId=${VoucherId}`;
    return this.http.post<any>(url,{});
  }
  GetAllCategory() {
    return this.http.get<any>(this.apiEndPoint+'Categories/GetAllCategory');
  }
  FilltAllCategoryType() {
    return this.http.get<any>(this.apiEndPoint+'CategoryType/FilltAllCategoryType');
  }
  GetAllCategoryType() {
    return this.http.get<any>(this.apiEndPoint+'CategoryType/GetAllCategoryType?SearchText=');
  }
  SaveCategoryType(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'CategoryType/SaveCategoryType', body, { 'headers': headers });
  }
  DeleteCategoryType(CategoryTypeId: number): Observable<any> {
    return this.http.post(`${this.apiEndPoint}CategoryType/DeleteCategoryType?Categoryid=` + CategoryTypeId, {});
  }
  FillSubAccountLoad() {
    return this.http.get<any>(this.apiEndPoint+'Account/FillSubAccountLoad');
  }
  SaveCategory(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'Categories/SaveCategory', body, { 'headers': headers });
  }
  DeleteCategory(CategoryId: number): Observable<any> {
    return this.http.post(`${this.apiEndPoint}Categories/DeleteCategory?Categoryid=` + CategoryId, {});
  }
  FillCitySelect() {
    return this.http.get<any>(this.apiEndPoint+'City/FillCitySelect');
  }
  GetAllSuppliers() {
    return this.http.get<any>(this.apiEndPoint+'Suppliers/GetAllSuppliers');
  }
  SaveSupplier(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'Suppliers/SaveSupplier', body, { 'headers': headers });
  }

  DeleteSupplier(SupplierId: number): Observable<any> {
    return this.http.post(`${this.apiEndPoint}Suppliers/DeleteSupplier?SupplierId=` + SupplierId, {});
  }
  SavePurchaseForServices(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Voucher/SavePurchaseForServices', body,{'headers':headers});
  }
  SaveandPostPurchaseForServices(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Voucher/SaveandPostPurchaseForServices', body,{'headers':headers});
  }
  SavePurchaseForServicesNotiDepit(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Voucher/SavePurchaseForServicesNotiDepit', body,{'headers':headers});
  }
  GetTaxNoBySuppId(SupplierId: number): Observable<any> {
    return this.http.get(`${this.apiEndPoint}Suppliers/GetTaxNoBySuppId?SupplierId=` + SupplierId, {});
  }
  GetAccIdBySuppId(SupplierId: number): Observable<any> {
    return this.http.get(`${this.apiEndPoint}Suppliers/GetAccIdBySuppId?SupplierId=` + SupplierId, {});
  }
  GetSuppIdByAccId(AccountId: number): Observable<any> {
    return this.http.get(`${this.apiEndPoint}Suppliers/GetSuppIdByAccId?AccountId=` + AccountId, {});
  }
  FillSuppAccountsSelect(param: number): Observable<any> {
    return this.http.get(`${this.apiEndPoint}Account/FillSuppAccountsSelect?param=` + param, {});
  }
  GetVouchersSearchInvoicePurchaseByID(InvoiceId:any) {
    var url=`${environment.apiEndPoint}Voucher/GetVouchersSearchInvoicePurchaseByID?&InvoiceId=${InvoiceId}`;
    return this.http.get<any>(url);
  }
  UploadPayVoucherImage(VoucherImage:any) {
    return this.http.post<any>(this.apiEndPoint + 'Voucher/UploadPayVoucherImage', VoucherImage);
  }
}
