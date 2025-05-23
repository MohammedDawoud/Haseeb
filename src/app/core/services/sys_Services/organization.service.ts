import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { City } from 'src/app/core/Classes/DomainObjects/city';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private apiEndPoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetBranchOrganization() {
    return this.http.get<any>(
      this.apiEndPoint + 'Organizations/GetBranchOrganization'
    );
  }
  SaveOrganizations(modal: any): Observable<any> {
    // const headers = { 'content-type': 'application/json' }
    // const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'Organizations/SaveOrganizations',
      modal
    );
  }
  GetAllCities() {
    return this.http.get<any>(this.apiEndPoint + 'City/GetAllCities2');
  }
  UpdateOrgdaterequire(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint +
        'SystemSettings/UpdateOrgdaterequire?isreq=' +
        modal.isreq,
      {}
    );
  }
  SaveCity(city: City): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(city);
    return this.http.post(this.apiEndPoint + 'City/SaveCity', body, {
      headers: headers,
    });
  }
  DeleteCity(CityId: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'City/DeleteCity?CityId=' + CityId + '',
      null
    );
  }
  FillCitySelect() {
    return this.http.get<any>(this.apiEndPoint + 'City/FillCitySelect');
  }
  FillBankSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Banks/FillBankSelect');
  }
  FillSelectEmployeeWorkers() {
    return this.http.get<any>(
      this.apiEndPoint + 'Employee/FillSelectEmployeeWorkers'
    );
  }
  FillEmployeeSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Employee/FillEmployeeSelect');
  }

  SendMail_test(Email: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Organizations/SendMail_test?Email=' + Email + ''
    );
  }

  SendSMS_test(Mobile: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Organizations/SendSMS_test?Mobile=' + Mobile + ''
    );
  }
  SendWhatsApp_test(Mobile: any,environmentURL:any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Organizations/SendWhatsApp_test?Mobile=' + Mobile + '&environmentURL=' + environmentURL + ''
    );
  }

  GetEmployeeById(EmpId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Employee/GetEmployeeById?EmpId=' + EmpId + ''
    );
  }
  saveEmail(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'Organizations/SaveOrganizationSettings',
      body,
      { headers: headers }
    );
  }
  SavesmsSetting(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'Organizations/SavesmsSetting',
      body,
      { headers: headers }
    );
  }
  SaveWhatsAppSetting(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'Organizations/SaveWhatsAppSetting',
      body,
      { headers: headers }
    );
  }
  SaveAttDeviceSetting(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'Organizations/SaveAttDeviceSetting',
      body,
      { headers: headers }
    );
  }
  savesupportmsg(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'Organizations/SaveSupport',
      body,
      { headers: headers }
    );
  }
  SaveEmailSetting(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'Organizations/SaveEmailSetting',
      body,
      { headers: headers }
    );
  }
  SaveComDomainLink(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'Organizations/SaveComDomainLink',
      body,
      { headers: headers }
    );
  }
  SaveAppVersion(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'Organizations/SaveAppVersion',
      body,
      { headers: headers }
    );
  }
  GetsmsSetting() {
    return this.http.get<any>(this.apiEndPoint + 'Organizations/GetsmsSetting');
  }
  GetWhatsAppSetting() {
    return this.http.get<any>(this.apiEndPoint + 'Organizations/GetWhatsAppSetting');
  }
  GetEmailSetting() {
    return this.http.post<any>(
      this.apiEndPoint + 'Organizations/GetEmailSetting',
      {}
    );
  }
  GetAttDeviceSetting() {
    return this.http.get<any>(
      this.apiEndPoint + 'Organizations/GetAttDeviceSetting'
    );
  }
  GetComDomainLink_Org() {
    return this.http.get<any>(
      this.apiEndPoint + 'Organizations/GetComDomainLink_Org'
    );
  }
  GetApplicationVersion_Org() {
    return this.http.get<any>(
      this.apiEndPoint + 'Organizations/GetApplicationVersion_Org'
    );
  }

  GenerateNextBranchNumber() {
    return this.http.get<any>(
      this.apiEndPoint + 'Branches/GenerateNextBranchNumber'
    );
  }
  SaveBranches(modal: any): Observable<any> {
    // const headers = { 'content-type': 'application/json' }
    // const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'Branches/SaveBranches', modal);
  }
  deleteBranch(BranchId: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'Branches/DeleteBranches?BranchId=' + BranchId + '',
      null
    );
  }
  GetAllBranches() {
    return this.http.get<any>(this.apiEndPoint + 'Branches/GetAllBranches');
  }
  FillAllAccountsSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'Account/FillAllAccountsSelect'
    );
  }
  GetFirstBranch() {
    return this.http.get<any>(this.apiEndPoint + 'Branches/GetFirstBranch');
  }
  SaveBranchesAccs(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'Branches/SaveBranchesAccs',
      body,
      { headers: headers }
    );
  }
  SaveBranchesInvoiceCode(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'Branches/SaveBranchesInvoiceCode',body,{ headers: headers });
  }
  GetAccountTree() {
    return this.http.get<any>(this.apiEndPoint + 'Account/GetAccountTree');
  }
  GetAccountTreeKD() {
    return this.http.get<any>(this.apiEndPoint + 'Account/GetAccountTreeKD');
  }
  GetAccountTreeEA() {
    return this.http.get<any>(this.apiEndPoint + 'Account/GetAccountTreeEA');
  }
  GetAccountTreepublicrev() {
    return this.http.get<any>(
      this.apiEndPoint + 'Account/GetAccountTreepublicrev'
    );
  }
  GetAccountTreeotherrev() {
    return this.http.get<any>(
      this.apiEndPoint + 'Account/GetAccountTreeotherrev'
    );
  }
  GetBranchById(branchid: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Branches/GetBranchById?branchid=' + branchid
    );
  }
  SaveBranchesAccsKD(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'Branches/SaveBranchesAccsKD',
      body,
      { headers: headers }
    );
  }

  SaveAccountTree(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'Account/SaveAccountTree', body, {
      headers: headers,
    });
  }
  SaveAccountTreeEA(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'Account/SaveAccountTreeEA',
      body,
      { headers: headers }
    );
  }
  SaveAccountTreePublicRev(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'Account/SaveAccountTreePublicRev',
      body,
      { headers: headers }
    );
  }
  SaveAccountTreeotherrev(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'Account/SaveAccountTreeotherrev',
      body,
      { headers: headers }
    );
  }
  GetAllStaffTime() {
    return this.http.get<any>(
      this.apiEndPoint + 'AttendaceTime/GetAllAttendaceTime'
    );
  }
  addStaffTime(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'AttendaceTime/SaveAttendaceTime',
      body,
      { headers: headers }
    );
  }
  deletestaffTimeId(staffTimeId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'AttendaceTime/DeleteAttendaceTime?TimeId=' +
        staffTimeId,
      null
    );
  }

  GetAllAttTimeDetails(timeId: any) {
    const searchText = '';
    return this.http.get<any>(
      this.apiEndPoint +
        'AttendaceTime/GetAllAttTimeDetails?AttTimeId=' +
        timeId +
        '&searchText=' +
        searchText +
        'test'
    );
  }
  SaveAttTimeDetails(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'AttendaceTime/SaveAttTimeDetails',
      modal
    );
  }
  deletestaffTimeDetails(TimeDetailsId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'AttendaceTime/DeleteAttTimeDetails?TimeDetailsId=' +
        TimeDetailsId,
      null
    );
  }
  SaveOfficalHoliday(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'OfficalHoliday/SaveOfficalHoliday',
      body,
      { headers: headers }
    );
  }
  GetAllOfficalHoliday() {
    return this.http.get<any>(
      this.apiEndPoint + 'OfficalHoliday/GetAllOfficalHoliday'
    );
  }
  DeleteOfficalHoliday(OfficalHolidayId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'OfficalHoliday/DeleteOfficalHoliday?Id=' +
        OfficalHolidayId,
      null
    );
  }
  GetSystemSettingsByUserId() {
    return this.http.get<any>(
      this.apiEndPoint + 'SystemSettings/GetSystemSettingsByUserId'
    );
  }
  SaveSystemSettings(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'SystemSettings/SaveSystemSettings',
      body,
      { headers: headers }
    );
  }
  SavepartialOrganizations(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'Organizations/SavepartialOrganizations',
      body,
      { headers: headers }
    );
  }
  GenerateCSID(OrganizationId:any,OTP:any){
    return this.http.post(this.apiEndPoint+'Organizations/GenerateCSID', {}, { params:{OrganizationId:OrganizationId,OTP:OTP}});
  }
  GenerateCSID_Branch(BranchId:any,OTP:any){
    return this.http.post(this.apiEndPoint+'Organizations/GenerateCSID_Branch', {}, { params:{BranchId:BranchId,OTP:OTP}});
  }

  ValidateZatcaRequest(Isuploadzatca:any){
    return this.http.post(this.apiEndPoint+'SystemSettings/ValidateZatcaRequest', {}, { params:{Isuploadzatca:Isuploadzatca}});
  }

  ValidateZatcaCode(Isuploadzatca:any,SentCode:any){
    return this.http.post(this.apiEndPoint+'SystemSettings/ValidateZatcaCode', {}, { params:{Isuploadzatca:Isuploadzatca,SentCode:SentCode}});
  }

  GetAllContactBranches() {
    return this.http.get<any>(
      this.apiEndPoint + 'ContactUs/GetAllContactBranches'
    );
  }
  SaveContactBranches(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'ContactUs/SaveContactBranches',
      body,
      { headers: headers }
    );
  }

  GetAllSocialMediaLinks() {
    return this.http.get<any>(
      this.apiEndPoint + 'ContactUs/GetAllSocialMediaLinks'
    );
  }
  DeleteContactBranches(ContactId: any) {
    // const formData = new FormData();
    // formData.append('ContactId', ContactId.toString());

    return this.http.post<any>(
      this.apiEndPoint +
        'ContactUs/DeleteContactBranches?ContactId=' +
        ContactId,
      null
    );
  }
  SaveSocialMediaLinks(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'ContactUs/SaveSocialMediaLinks',
      body,
      { headers: headers }
    );
  }
  GetAllNews() {
    return this.http.get<any>(this.apiEndPoint + 'ContactUs/GetAllNews');
  }
  SaveNews(modal: any): Observable<any> {
    // const headers = { 'content-type': 'application/json' }
    // const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'ContactUs/SaveNews', modal);
  }
  deleteNews(newsId: any) {
    // const formData = new FormData();
    // formData.append('NewsId', newsId);

    return this.http.post<any>(
      this.apiEndPoint + 'ContactUs/DeleteNews?NewsId=' + newsId,
      null
    );
  }
  GetALLOrgData() {
    return this.http.get<any>(this.apiEndPoint + 'Statistics/GetALLOrgData');
  }
  MaintenanceFunc(Status: any): Observable<any> {
    return this.http.post<any>(
      this.apiEndPoint + 'SystemSettings/MaintenanceFunc?Status=' + Status,
      null
    );
  }

   //////////////////////////////////////
   GetLaw_Regulations() {
    return this.http.get<any>(this.apiEndPoint + 'LawRelegations/GetLaw_Regulations');
  }

   saveAbsenceLaw(modal: any): Observable<any> {
    // const headers = { 'content-type': 'application/json' }
    // const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'LawRelegations/saveAbsenceLaw', modal);
  }

   saveLateLaw(modal: any): Observable<any> {
    // const headers = { 'content-type': 'application/json' }
    // const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'LawRelegations/saveLateLaw', modal);
  }
}
