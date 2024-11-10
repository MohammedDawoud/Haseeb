import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { VoucherFilterVM } from 'src/app/core/Classes/ViewModels/voucherFilterVM';
import { Invoices } from '../../Classes/DomainObjects/invoices';
import { ExportationService } from '../exportation-service/exportation.service';
import { ContractsVM } from '../../Classes/ViewModels/contractsVM';
@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private apiEndPoint: string = '';
  constructor(private http: HttpClient,
    private exportationService: ExportationService,) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  GetAllContractsNotPaid(FirstLoad: any) {
    var url = `${environment.apiEndPoint}Contract/GetAllContractsNotPaid?&FirstLoad=${FirstLoad}`;
    return this.http.get<any>(url);
  }
  FillAllUsersSelectAll() {
    return this.http.get<any>(this.apiEndPoint+'ControllingTask/FillAllUsersSelectAll');
  }
  GetAllContractsBySearch(_ContractsVM:ContractsVM): Observable<any> {
    return this.http.post(this.apiEndPoint+'Contract/GetAllContractsBySearch',_ContractsVM);
  }
  CancelContract(ContractId:any){
    return this.http.post(this.apiEndPoint+'Contract/CancelContract', {}, { params:{ContractId:ContractId}});
  }
  DeleteDraft(DraftId:any){
    return this.http.post(this.apiEndPoint+'Draft/DeleteDraft', {}, { params:{DraftId:DraftId}});
  }
  DeleteCustomerPayment(PaymentId:any){
    return this.http.post(this.apiEndPoint+'CustomerPayments/DeleteCustomerPayment', {}, { params:{PaymentId:PaymentId}});
  }
  Connect_appendFile_Draft(ProjectId:any,uploadedFile:any){
    return this.http.post(this.apiEndPoint+'Draft/Connect_appendFile_Draft', {}, { params:{ProjectId:ProjectId,uploadedFile:uploadedFile}});
  }

  DeleteDraft_Templates(DraftId:any){
    return this.http.post(this.apiEndPoint+'Drafts_Templates/DeleteDraft_Templates', {}, { params:{DraftId:DraftId}});
  }

  Connect_appendFile_Draft2(ContractId:any,DraftId:any,uploadedFile:any){
    return this.http.post(this.apiEndPoint+'Draft/Connect_appendFile_Draft2', {}, { params:{ContractId:ContractId,DraftId:DraftId,uploadedFile:uploadedFile}});
  }
    DownloadFile_Draft(ContractId:any){
    return this.http.post(this.apiEndPoint+'Contract/DownloadFile_Draft', {}, { params:{ContractId:ContractId}});
  }
  SaveProjectContract(formData:any){
    return this.http.post<any>(this.apiEndPoint+'Contract/SaveProjectContract' ,formData );
  }
  UploadProjectContractExtra(formData:any){
    return this.http.post<any>(this.apiEndPoint+'FileUpload/UploadProjectContractExtra' ,formData );
  }
  GetAllServicesPrice() {
    return this.http.get<any>(this.apiEndPoint+'Voucher/GetAllServicesPrice');
  }
  ConvertNumToString(_num:any) {
    var url=`${environment.apiEndPoint}General/ConvertNumToString?Num=${_num}`;
    return this.http.get<any>(url);
  }
  GetServicesPriceVouByParentId(_serviceId:any,offerid:any) {
    var url=`${environment.apiEndPoint}Voucher/GetServicesPriceVouByParentId?ParentId=${_serviceId}&offerid=${offerid}`;
    return this.http.get<any>(url);
  }
  GetServicesPriceByParentId(_serviceId:any) {
    var url=`${environment.apiEndPoint}Voucher/GetServicesPriceByParentId?ParentId=${_serviceId}`;
    return this.http.get<any>(url);
  }
  GetServicesPriceVouByParentIdAndContract(_serviceId:any,ContractId:any) {
    var url=`${environment.apiEndPoint}Voucher/GetServicesPriceVouByParentIdAndContract?ParentId=${_serviceId}&ContractId=${ContractId}`;
    return this.http.get<any>(url);
  }
  GetContractserviceBycontractid(Contractid:any) {
    var url=`${environment.apiEndPoint}Contract/GetContractserviceBycontractid?Contractid=${Contractid}`;
    return this.http.get<any>(url);
  }
  GetOfferservicenByid(OfferId:any) {
    var url=`${environment.apiEndPoint}OffersPrice/GetOfferservicenByid?&OfferId=${OfferId}`;
    return this.http.get<any>(url);
  }


  GetServicesPriceByServiceId(ServiceId:any) {
    var url=`${environment.apiEndPoint}Voucher/GetServicesPriceByServiceId?ServiceId=${ServiceId}`;
    return this.http.get<any>(url);
  }
  EditContractService(ContractEditobj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(ContractEditobj);
    return this.http.post(this.apiEndPoint + 'Contract/EditContractService', body,{'headers':headers});
  }
  GenerateCustomerPayments(ContractObj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(ContractObj);
    return this.http.post(this.apiEndPoint + 'Contract/GenerateCustomerPayments', body,{'headers':headers});
  }
  SaveDraftDetails(CDraftDetailsObj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(CDraftDetailsObj);
    return this.http.post(this.apiEndPoint + 'Draft/SaveDraftDetails', body,{'headers':headers});
  }
  SaveCustomerPayment(PaymentObj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(PaymentObj);
    return this.http.post(this.apiEndPoint + 'CustomerPayments/SaveCustomerPayment', body,{'headers':headers});
  }
  GetBranchOrganization() {
    return this.http.get<any>(this.apiEndPoint + 'Organizations/GetBranchOrganization');
  }
  GetEmployeeJob(EmpId:any) {
    var url=`${environment.apiEndPoint}Employee/GetEmployeeJob?EmpId=${EmpId}`;
    return this.http.get<any>(url);
  }
  GetTypeOfProjct(ProjectId:any) {
    var url=`${environment.apiEndPoint}Project/GetTypeOfProjct?ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }


  FillCustomerSelectWProC() {
    return this.http.get<any>(this.apiEndPoint + 'Customer/FillCustomerSelect');
  }
  FillCustomerSelectWProC3() {
    return this.http.get<any>(this.apiEndPoint + 'Customer/FillCustomerSelect');
  }
  FillCustomerSelectWProC2() {
    return this.http.get<any>(this.apiEndPoint + 'Customer/FillCustomerSelect');
  }
  FillEmployeeSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Employee/FillEmployeeSelect');
  }
  FillProjectSelectByCustomerId2(param:any) {
    var url=`${environment.apiEndPoint}Project/FillProjectSelectByCustomerId2?param=${param}`;
    return this.http.get<any>(url);
  }
  FillAllOfferTodropdownOld(param:any) {
    var url=`${environment.apiEndPoint}OffersPrice/FillAllOfferTodropdownOld?param=${param}`;
    return this.http.get<any>(url);
  }
  FillAllContractserviceByConId(param:any) {
    var url=`${environment.apiEndPoint}Contract/FillAllContractserviceByConId?param=${param}`;
    return this.http.get<any>(url);
  }
  GetAllCustomerPayments(ContractId:any) {
    var url=`${environment.apiEndPoint}CustomerPayments/GetAllCustomerPayments?ContractId=${ContractId}`;
    return this.http.get<any>(url);
  }
  GetInvoiceIDByProjectID(ProjectId:any) {
    var url=`${environment.apiEndPoint}Voucher/GetInvoiceIDByProjectID?ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }
  GenerateContractNumber() {
    return this.http.get<any>(this.apiEndPoint + 'Contract/GenerateContractNumber');
  }
  GenerateContractNumber2() {
    return this.http.get<any>(this.apiEndPoint + 'Contract/GenerateContractNumber2');
  }
  GenerateContractNumber3() {
    return this.http.get<any>(this.apiEndPoint + 'Contract/GenerateContractNumber3');
  }
  GenerateContractNumber4() {
    return this.http.get<any>(this.apiEndPoint + 'Contract/GenerateContractNumber4');
  }
  GenerateContractNumber5() {
    return this.http.get<any>(this.apiEndPoint + 'Contract/GenerateContractNumber5');
  }
  GenerateCustPaymentNumber(ContractId:any) {
    var url=`${environment.apiEndPoint}CustomerPayments/GenerateCustPaymentNumber?&ContractId=${ContractId}`;
    return this.http.get<any>(url);
  }
  GetProjectById(ProjectId:any) {
    var url=`${environment.apiEndPoint}Project/GetProjectById?ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }
  GetEmployeeById(EmpId:any) {
    var url=`${environment.apiEndPoint}Employee/GetEmployeeById?EmpId=${EmpId}`;
    return this.http.get<any>(url);
  }
  GetCustomersByCustomerId(CustomerId:any) {
    var url=`${environment.apiEndPoint}Customer/GetCustomersByCustomerId?CustomerId=${CustomerId}`;
    return this.http.get<any>(url);
  }
  GetProjectDurationStr(start:any,end:any) {
    var url=`${environment.apiEndPoint}General/GetProjectDurationStr?start=${start}&&end=${end}`;
    return this.http.get<any>(url);
  }

  SaveContract(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Contract/SaveContract', body,{'headers':headers});
  }
  SaveContract_2(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Contract/SaveContract_2', body,{'headers':headers});
  }
  PostInvoiceAndPayPayment(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Contract/PostInvoiceAndPayPayment', body,{'headers':headers});
  }
  PostInvoiceAndPayPayment2(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Contract/PostInvoiceAndPayPayment2', body,{'headers':headers});
  }
  UploadProjectContract(model : any){
    return this.http.post<any>(`${this.apiEndPoint}FileUpload/UploadProjectContract`, model);
  }

  printnewcontract(ContractId:any) {
    var url=`${environment.apiEndPoint}Contract/printnewcontract?ContractId=${ContractId}`;
    return this.http.get<any>(url);
  }
  printaqsatdofaatContract(ContractId:any) {
    var url=`${environment.apiEndPoint}Contract/printaqsatdofaatContract?ContractId=${ContractId}`;
    return this.http.get<any>(url);
  }


  GetAllDraftsbyProjectsType_2(ProjectTypeId:any) {
    var url=`${environment.apiEndPoint}Draft/GetAllDraftsbyProjectsType_2?ProjectTypeId=${ProjectTypeId}`;
    return this.http.get<any>(url);
  }
  GetAllDraftsDetailsbyProjectId(ProjectId:any) {
    var url=`${environment.apiEndPoint}Draft/GetAllDraftsDetailsbyProjectId?ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }
  FillProjectTypeSelect() {
    return this.http.get<any>(this.apiEndPoint + 'ProjectType/FillProjectTypeSelect');
  }
  FillAllDraft_Template() {
    return this.http.get<any>(this.apiEndPoint + 'Drafts_Templates/FillAllDraft_Template');
  }
  ConnectDraft_Templates_WithProject(DraftId:any,ProjectTypeId:any,) {
    var url=`${environment.apiEndPoint}Drafts_Templates/ConnectDraft_Templates_WithProject?DraftId=${DraftId}&ProjectTypeId=${ProjectTypeId}`;
    return this.http.get<any>(url);
  }
  SaveDraft(model : any){
    return this.http.post<any>(`${this.apiEndPoint}Drafts_Templates/SaveDraft`, model);
  }
  GetReportGrid(model: any) {
    return this.http.post<any>(`${this.apiEndPoint}Contract/GetReportGrid`, model);
  }

}
