import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { VoucherFilterVM } from '../../Classes/ViewModels/voucherFilterVM';
import { Invoices } from '../../Classes/DomainObjects/invoices';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  FillBankSelect() {
    return this.http.get<any>(this.apiEndPoint+'Banks/FillBankSelect');
  }
  FillAllProjectSelectByAllFawater() {
    return this.http.get<any>(this.apiEndPoint+'Project/FillAllProjectSelectByAllFawater');
  }
  FillAllCustomerSelectByAllFawater() {
    return this.http.get<any>(this.apiEndPoint+'Project/FillAllCustomerSelectByAllFawater');
  }
  FillCostCenterSelect() {
    return this.http.get<any>(this.apiEndPoint+'CostCenter/FillCostCenterSelect');
  }
  FillSubAccountLoad() {
    return this.http.get<any>(this.apiEndPoint+'Account/FillSubAccountLoad');
  }
  FillSubAccountLoad_Branch() {
    return this.http.get<any>(this.apiEndPoint+'Account/FillSubAccountLoad_Branch');
  }
  FillSubAccountLoadNotMain_Branch() {
    return this.http.get<any>(this.apiEndPoint+'Account/FillSubAccountLoadNotMain_Branch');
  }
  FillCostCenterSelect_Invoices(param:any) {
    var url=`${environment.apiEndPoint}CostCenter/FillCostCenterSelect_Invoices?&param=${param}`;
    return this.http.get<any>(url);
  }
  GetAllServicesPrice() {
    return this.http.get<any>(this.apiEndPoint+'Voucher/GetAllServicesPrice');
  }
  GetOfferservicenByid(OfferId:any) {
    var url=`${environment.apiEndPoint}OffersPrice/GetOfferservicenByid?&OfferId=${OfferId}`;
    return this.http.get<any>(url);
  }
  GetServicesPriceByServiceId(ServiceId:any) {
    var url=`${environment.apiEndPoint}Voucher/GetServicesPriceByServiceId?&ServiceId=${ServiceId}`;
    return this.http.get<any>(url);
  }
  FillAllOfferTodropdownOld(param:any) {
    var url=`${environment.apiEndPoint}OffersPrice/FillAllOfferTodropdownOld?&param=${param}`;
    return this.http.get<any>(url);
  }
  GetAllProjByCustomerId(customerId:any) {
    var url=`${environment.apiEndPoint}Project/GetAllProjByCustomerId?&customerId=${customerId}`;
    return this.http.get<any>(url);
  }
  GetCostCenterByProId(ProjectId:any) {
    var url=`${environment.apiEndPoint}Project/GetCostCenterByProId?&ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }
  GetCustomersByAccountId(AccountId:any) {
    var url=`${environment.apiEndPoint}Customer/GetCustomersByAccountId?&AccountId=${AccountId}`;
    return this.http.get<any>(url);
  }
  FillAllProjectSelectByNAccIdWithout(param:any) {
    var url=`${environment.apiEndPoint}Project/FillAllProjectSelectByNAccIdWithout?&param=${param}`;
    return this.http.get<any>(url);
  }
  GetAllProjByCustomerIdWithout(customerId:any) {
    var url=`${environment.apiEndPoint}Project/GetAllProjByCustomerIdWithout?&customerId=${customerId}`;
    return this.http.get<any>(url);
  }
  GetVouchersSearchInvoiceByID(InvoiceId:any) {
    var url=`${environment.apiEndPoint}Voucher/GetVouchersSearchInvoiceByID?&InvoiceId=${InvoiceId}`;
    return this.http.get<any>(url);
  }
  GetBranchOrganization() {
    return this.http.get<any>(this.apiEndPoint+'Organizations/GetBranchOrganization');
  }
  GetAllCustomerForDrop() {
    return this.http.get<any>(this.apiEndPoint+'Customer/GetAllCustomerForDrop');
  }
  GetAllCustomerForDropWithBranch() {
    return this.http.get<any>(this.apiEndPoint+'Customer/GetAllCustomerForDropWithBranch');
  }
  FillAllNotiVoucher(_voucherFilterVM:VoucherFilterVM): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_voucherFilterVM);
    return this.http.post(this.apiEndPoint + 'Voucher/FillAllNotiVoucher', body,{'headers':headers});
  }
  ReturnNotiCreditBack(_invoices:Invoices): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_invoices);
    return this.http.post(this.apiEndPoint + 'Voucher/ReturnNotiCreditBack', body,{'headers':headers});
  }
  GetAllVouchersSearchInvoice(_voucherFilterVM:VoucherFilterVM): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_voucherFilterVM);
    return this.http.post(this.apiEndPoint + 'Voucher/GetAllVouchersSearchInvoice', body,{'headers':headers});
  }
  GetAllVouchersfromcontractSearch(_voucherFilterVM:VoucherFilterVM): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_voucherFilterVM);
    return this.http.post(this.apiEndPoint + 'Voucher/GetAllVouchersfromcontractSearch', body,{'headers':headers});
  }
  GetAllVouchers(_voucherFilterVM:VoucherFilterVM): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_voucherFilterVM);
    return this.http.post(this.apiEndPoint + 'Voucher/GetAllVouchers', body,{'headers':headers});
  }
  GetAllVouchersRetSearch(_voucherFilterVM:VoucherFilterVM): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_voucherFilterVM);
    return this.http.post(this.apiEndPoint + 'Voucher/GetAllVouchersRetSearch', body,{'headers':headers});
  }
  FillAllAlarmVoucher(_voucherFilterVM:VoucherFilterVM): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_voucherFilterVM);
    return this.http.post(this.apiEndPoint + 'Voucher/FillAllAlarmVoucher', body,{'headers':headers});
  }
  GetInvoiceDateById(VoucherId:any) {
    var url=`${environment.apiEndPoint}Voucher/GetInvoiceDateById?&VoucherId=${VoucherId}`;
    return this.http.get<any>(url);
  }
  SaveVoucherAlarmDate(VoucherId:any,VoucherAlarmDate:any){
    return this.http.post(this.apiEndPoint+'Voucher/SaveVoucherAlarmDate', {}, { params:{VoucherId:VoucherId,VoucherAlarmDate:VoucherAlarmDate}});
  }
  FillAllProjectSelectByNAccId(param:any) {
    var url=`${environment.apiEndPoint}Project/FillAllProjectSelectByNAccId?&param=${param}`;
    return this.http.get<any>(url);
  }
  FillCustAccountsSelect2(param:any):Observable<any> {
    var url=`${environment.apiEndPoint}Account/FillCustAccountsSelect2?&param=${param}`;
    return this.http.get<any>(url);
  }
  FillCustomerSelectWProOnlyWithBranch() {
    return this.http.get<any>(this.apiEndPoint+'Project/FillCustomerSelectWProOnlyWithBranch');
  }
  FillAllCustomerSelectWithBranch() {
    return this.http.get<any>(this.apiEndPoint+'Customer/FillAllCustomerSelectWithBranch');
  }
  FillAllCustomerSelectNotHaveProjWithBranch() {
    return this.http.get<any>(this.apiEndPoint+'Customer/FillAllCustomerSelectNotHaveProjWithBranch');
  }
  GetBranch_Costcenter() {
    return this.http.get<any>(this.apiEndPoint+'CostCenter/GetBranch_Costcenter');
  }
  GenerateVoucherNumber(Type:any) {
    var url=`${environment.apiEndPoint}Voucher/GenerateVoucherNumber?&Type=${Type}`;
    return this.http.get<any>(url);
  }
  GetCustomersByCustomerId(CustomerId:any):Observable<any> {
    var url=`${environment.apiEndPoint}Customer/GetCustomersByCustomerId?&CustomerId=${CustomerId}`;
    return this.http.get<any>(url);
  }
  GetAllJournalsByInvID(invId:any) {
    var url=`${environment.apiEndPoint}DailyJournal/GetAllJournalsByInvID?&invId=${invId}`;
    return this.http.get<any>(url);
  }
  GetAllJournalsByInvIDPurchase(invId:any) {
    var url=`${environment.apiEndPoint}DailyJournal/GetAllJournalsByInvIDPurchase?&invId=${invId}`;
    return this.http.get<any>(url);
  }
  PostVouchersCheckBox(_InvoicesIds:any) {
    const formData: FormData = new FormData();
    for(let i = 0; i < _InvoicesIds.length; i++) {
      formData.append("voucherIds",_InvoicesIds[i]);
    }
    const req = new HttpRequest('POST', `${this.apiEndPoint}Voucher/PostVouchersCheckBox`, formData);
    return this.http.request(req);
  }
  PostBackVouchers(obj:Invoices[]): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Voucher/PostBackVouchers', body,{'headers':headers});
  }
  SaveInvoiceForServices(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Voucher/SaveInvoiceForServices', body,{'headers':headers});
  }
  SaveInvoiceForServicesDraft(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Voucher/SaveInvoiceForServicesDraft', body,{'headers':headers});
  }
  UpdateVoucherDraft(InvoiceId: any) {
    return this.http.post( this.apiEndPoint + 'Voucher/UpdateVoucherDraft',{},{ params: { InvoiceId: InvoiceId } });
  }

  SaveInvoiceForServices2(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Voucher/SaveInvoiceForServices2', body,{'headers':headers});
  }
  SaveandPostInvoiceForServices(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Voucher/SaveandPostInvoiceForServices', body,{'headers':headers});
  }
  SaveandPostInvoiceForServices2(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Voucher/SaveandPostInvoiceForServices2', body,{'headers':headers});
  }
  SaveInvoiceForServicesNoti(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Voucher/SaveInvoiceForServicesNoti', body,{'headers':headers});
  }
  SaveInvoiceForServicesNotiDepit(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Voucher/SaveInvoiceForServicesNotiDepit', body,{'headers':headers});
  }


  GetAllJournalsByInvIDRet(invId: any) {
    var url = `${environment.apiEndPoint}DailyJournal/GetAllJournalsByInvIDRet?&invId=${invId}`;
    return this.http.get<any>(url);
  }
  UploadPayVoucherImage(model : any){
    return this.http.post<any>(`${this.apiEndPoint}Voucher/UploadPayVoucherImage`, model);
  }

  GetServicesPriceByParentId(_serviceId:any) {
    var url=`${environment.apiEndPoint}Voucher/GetServicesPriceByParentId?ParentId=${_serviceId}`;
    return this.http.get<any>(url);
  }
  GetServicesPriceVouByParentIdAndInvoiceId(_serviceId:any,InvoiceId:any) {
    var url=`${environment.apiEndPoint}Voucher/GetServicesPriceVouByParentIdAndInvoiceId?ParentId=${_serviceId}&InvoiceId=${InvoiceId}`;
    return this.http.get<any>(url);
  }
  GetServicesPriceVouByParentId(_serviceId:any,offerid:any) {
    var url=`${environment.apiEndPoint}Voucher/GetServicesPriceVouByParentId?ParentId=${_serviceId}&offerid=${offerid}`;
    return this.http.get<any>(url);
  }
  GetInvoiceById_Tran(invId:any) {
    var url=`${environment.apiEndPoint}Voucher/GetInvoiceById_Tran?&VoucherId=${invId}`;
    return this.http.get<any>(url);
  }

  // SendWInvoice(Obj: any): Observable<any> {
  //   const headers = { 'content-type': 'application/json' };
  //   const body = JSON.stringify(Obj);
  //   return this.http.post(
  //     this.apiEndPoint + 'Voucher/SendWInvoice',
  //     body,
  //     { headers: headers }
  //   );
  // }

  SendWInvoice(model : any){
    return this.http.post<any>(`${this.apiEndPoint}Voucher/SendWInvoice`, model);
  }
  DeleteVoucher(invId:any) {
    return this.http.post<any>(this.apiEndPoint + 'Voucher/DeleteVoucher?VoucherId='+invId,null);
  }
}
