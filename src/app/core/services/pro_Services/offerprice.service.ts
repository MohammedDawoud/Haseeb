import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfferpriceService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  GetAllOffers() {
    return this.http.get<any>(this.apiEndPoint+'OffersPrice/GetAllOffers');
  }

  GetAllOffersByCustomerId2(_customerId:any) {
    var url=`${environment.apiEndPoint}OffersPrice/GetAllOffersByCustomerId2?CustomerId=${_customerId}`;
    return this.http.get<any>(url);
  }

  FilterOffer(_type:any,_dateSearch:any) {
    var url=`${environment.apiEndPoint}ServicesPricingForm/FilterOffer?Type=${_type}&&DateSearch=${_dateSearch}`;
    return this.http.get<any>(url);
  }
  GetAllPublicanddesignServicesPricingForms(_type:any) {
    var url=`${environment.apiEndPoint}ServicesPricingForm/GetAllPublicanddesignServicesPricingForms?Type=${_type}`;
    return this.http.get<any>(url);
  }
  Fillcustomerhavingoffer() {
    return this.http.get<any>(this.apiEndPoint+'OffersPrice/Fillcustomerhavingoffer');
  }
  FillAllUsersTodropdown() {
    var param=false;
    var url=`${environment.apiEndPoint}Users/FillAllUsersTodropdown?param=${param}`;
    return this.http.get<any>(url);
  }
  GetAllCustomerForDrop() {
    return this.http.get<any>(this.apiEndPoint+'Customer/GetAllCustomerForDrop');
  }
  GetAllCustomerForDropWithBranch() {
    return this.http.get<any>(this.apiEndPoint+'Customer/GetAllCustomerForDropWithBranch');
  }
  GetAllServicesPrice() {
    return this.http.get<any>(this.apiEndPoint+'Voucher/GetAllServicesPrice');
  }
  Getnextoffernum() {
    return this.http.get<any>(this.apiEndPoint+'OffersPrice/Getnextoffernum');
  }
  GetOfferCode_S() {
    return this.http.get<any>(this.apiEndPoint+'OffersPrice/GetOfferCode_S');
  }
  ConvertNumToString(_num:any) {
    var url=`${environment.apiEndPoint}General/ConvertNumToString?Num=${_num}`;
    return this.http.get<any>(url);
  }
  ConvertNumToStringEnglish(_num:any) {
    var url=`${environment.apiEndPoint}General/ConvertNumToStringEnglish?Num=${_num}`;
    return this.http.get<any>(url);
  }
  UpdateStatusServicesPricingForm(_formId:any,_status:any){
    return this.http.post(this.apiEndPoint+'ServicesPricingForm/UpdateStatusServicesPricingForm', {}, { params:{FormId:_formId,status:_status}});
  }
  Intoduceoffer(_offersPricesId:any,Link:any){
    return this.http.post(this.apiEndPoint+'OffersPrice/Intoduceoffer', {}, { params:{OffersPricesId:_offersPricesId,Link:Link}});
  }
  IntoduceofferManual(_offersPricesId:any,Link:any){
    return this.http.post(this.apiEndPoint+'OffersPrice/IntoduceofferManual', {}, { params:{OffersPricesId:_offersPricesId,Link:Link}});
  }
  DeleteOffer(_offersPricesId:any){
    return this.http.post(this.apiEndPoint+'OffersPrice/DeleteOffer', {}, { params:{OffersPricesId:_offersPricesId}});
  }

  Customeraccept(_offersPricesId:any){
    return this.http.post(this.apiEndPoint+'OffersPrice/Customeraccept', {}, { params:{OffersPricesId:_offersPricesId}});
  }
  GetServicesPriceByParentId(_serviceId:any) {
    var url=`${environment.apiEndPoint}Voucher/GetServicesPriceByParentId?ParentId=${_serviceId}`;
    return this.http.get<any>(url);
  }
  GetServicesPriceVouByParentId(_serviceId:any,offerid:any) {
    var url=`${environment.apiEndPoint}Voucher/GetServicesPriceVouByParentId?ParentId=${_serviceId}&offerid=${offerid}`;
    return this.http.get<any>(url);
  }
  GetServicesPriceVouByParentIdAndContract(_serviceId:any,ContractId:any) {
    var url=`${environment.apiEndPoint}Voucher/GetServicesPriceVouByParentIdAndContract?ParentId=${_serviceId}&ContractId=${ContractId}`;
    return this.http.get<any>(url);
  }

  saveoffer(offerpriceobj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(offerpriceobj);
    return this.http.post(this.apiEndPoint + 'OffersPrice/saveoffer', body,{'headers':headers});
  }
  GetEmailOrganization() {
    return this.http.get<any>(this.apiEndPoint+'Organizations/GetEmailOrganization');
  }

  GetCustomersByCustomerId(_customerId:any) {
    var url=`${environment.apiEndPoint}Customer/GetCustomersByCustomerId?CustomerId=${_customerId}`;
    return this.http.get<any>(url);
  }


  GetProgressValues(_offerid:any) {
    var url=`${environment.apiEndPoint}OffersPrice/GetProgressValues?offerid=${_offerid}`;
    return this.http.get<any>(url);
  }

  SaveCustomerMailOfferPrice(model : any){
    return this.http.post<any>(`${this.apiEndPoint}Customer/SaveCustomerMailOfferPrice`, model);
  }
  GetOfferByid(_offerid:any) {
    var url=`${environment.apiEndPoint}OffersPrice/GetOfferByid?offerid=${_offerid}`;
    return this.http.get<any>(url);
  }
  GetUserById2(UserId:any) {
    var url=`${environment.apiEndPoint}Users/GetUserById2?UserId=${UserId}`;
    return this.http.get<any>(url);
  }
  GetAllFloors() {
    return this.http.get<any>(this.apiEndPoint+'Floors/GetAllFloors');
  }
  GetAllTotalSpacesRange() {
    return this.http.get<any>(this.apiEndPoint+'TotalSpacesRange/GetAllTotalSpacesRange');
  }
  GetOfferservicenByid(OfferId:any) {
    var url=`${environment.apiEndPoint}OffersPrice/GetOfferservicenByid?OfferId=${OfferId}`;
    return this.http.get<any>(url);
  }
  GetServicesPriceByServiceId(ServiceId:any) {
    var url=`${environment.apiEndPoint}Voucher/GetServicesPriceByServiceId?ServiceId=${ServiceId}`;
    return this.http.get<any>(url);
  }
  GetAllCustomerPaymentsboffer(OfferId:any) {
    var url=`${environment.apiEndPoint}CustomerPayments/GetAllCustomerPaymentsboffer?OfferId=${OfferId}`;
    return this.http.get<any>(url);
  }
  GetOfferConditionbyid(OfferId:any) {
    var url=`${environment.apiEndPoint}OffersPrice/GetOfferConditionbyid?OfferId=${OfferId}`;
    return this.http.get<any>(url);
  }


  GetOfferconditionconst() {
    return this.http.get<any>(this.apiEndPoint+'OffersPrice/GetOfferconditionconst');
  }
  GetAllCustomerPaymentsconst() {
    return this.http.get<any>(this.apiEndPoint+'OffersPrice/GetAllCustomerPaymentsconst');
  }
  Getofferconestintroduction() {
    return this.http.get<any>(this.apiEndPoint+'OffersPrice/Getofferconestintroduction');
  }
  GetSystemSettingsByUserId() {
    return this.http.get<any>(this.apiEndPoint+'SystemSettings/GetSystemSettingsByUserId');
  }
  SendWOfferPrice(model : any){
    return this.http.post<any>(`${this.apiEndPoint}OffersPrice/SendWOfferPrice`, model);
  }
  SendWhatsAppTask(model : any){
    return this.http.post<any>(`${this.apiEndPoint}ProjectPhasesTasks/SendWhatsAppTask`, model);
  }
  
   CertifyOffer(_offersPricesId:any){
    return this.http.post(this.apiEndPoint+'OffersPrice/CertifyOffer', {}, { params:{OffersPricesId:_offersPricesId}});
  }

    ConfirmCertifyOffer(_offersPricesId:any,Code:any){
    return this.http.post(this.apiEndPoint+'OffersPrice/ConfirmCertifyOffer', {}, { params:{OffersPricesId:_offersPricesId,Code:Code}});
  }
}
