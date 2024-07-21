import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ProjectFiles } from '../../Classes/DomainObjects/projectFiles';

@Injectable({
  providedIn: 'root'
})
export class ProjectdetailsService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  // GetAllCustomerForDropWithBranch() {
  //   return this.http.get<any>(this.apiEndPoint+'Customer/GetAllCustomerForDropWithBranch');
  // }
  GetContractorData(ContractorId:any) {
    var url=`${environment.apiEndPoint}Project/GetContractorData?ContractorId=${ContractorId}`;
    return this.http.get<any>(url);
  }

  GetProDetailsReadyVm(ProjectId:any,ProMangerID:any) {
    var url=`${environment.apiEndPoint}Home/GetProDetailsReadyVm?ProjectId=${ProjectId}&&ProMangerID=${ProMangerID}`;
    return this.http.get<any>(url);
  }
  GetAllPrivUser(Projectid:any) {
    var url=`${environment.apiEndPoint}Project/GetAllPrivUser?Projectid=${Projectid}`;
    return this.http.get<any>(url);
  }
  GetAllWorkOrdersyProjectId(ProjectId:any) {
    var url=`${environment.apiEndPoint}WorkOrders/GetAllWorkOrdersyProjectId?ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }
  GetAllSupervisions(ProjectId:any) {
    var url=`${environment.apiEndPoint}Supervisions/GetAllSupervisions?ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }
  GetAllUsersNotification(ProjectId:any) {
    var url=`${environment.apiEndPoint}Users/GetAllUsers?ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }
  GetAllProjectExtracts(ProjectId:any) {
    var url=`${environment.apiEndPoint}ProjectExtracts/GetAllProjectExtracts?ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }
  LoadTasksGrid(ProjectId:any) {
    var url=`${environment.apiEndPoint}ProjectPhasesTasks/GetProjectPhasesTasks2?ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }
  LoadTasksGridTree(formData: any) {
    return this.http.post<any>(`${this.apiEndPoint}ProjectPhasesTasks/GetProjectPhasesTasks2Tree`,formData);
  }
  GetAllNotifications(ProjectId:any) {
    var url=`${environment.apiEndPoint}Notification/GetAllNotifications?ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }
  GetOutInboxProjectFiles(Type:any,ProjectId:any) {
    var url=`${environment.apiEndPoint}OutInbox/GetOutInboxProjectFiles?Type=${Type}&&ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }
  GetAllFiles(OutInBoxId:any) {
    var url=`${environment.apiEndPoint}ContacFiles/GetAllFiles?OutInBoxId=${OutInBoxId}`;
    return this.http.get<any>(url);
  }
  GetAllCustomerFiles(CustomerId:any) {
    var url=`${environment.apiEndPoint}CustomerFiles/GetAllCustomerFiles?CustomerId=${CustomerId}`;
    return this.http.get<any>(url);
  }
  RestartTask(param:any,RetrievedReason:any){
    return this.http.post(this.apiEndPoint+'ProjectPhasesTasks/RestartTask', {}, { params:{param:param,RetrievedReason:RetrievedReason}});
  }
  UpdateFileShare(_projectFiles:ProjectFiles): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_projectFiles);
    return this.http.post(this.apiEndPoint + 'File/UpdateFileShare', body,{'headers':headers});
  }
  NotUpdateFileShare(_projectFiles:ProjectFiles): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_projectFiles);
    return this.http.post(this.apiEndPoint + 'File/NotUpdateFileShare', body,{'headers':headers});
  }
  SaveProjectDetails(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Project/SaveProjectDetails', body,{'headers':headers});
  }


  FillRegionTypesSelect() {
    return this.http.get<any>(this.apiEndPoint+'RegionTypes/FillRegionTypesSelect');
  }
  DeleteRegionTypes(RegionTypeId:any){
    return this.http.post(this.apiEndPoint+'RegionTypes/DeleteRegionTypes', {}, { params:{RegionTypeId:RegionTypeId}});
  }
  SaveRegionTypes(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'RegionTypes/SaveRegionTypes', body,{'headers':headers});
  }

  FillProjectPieces(projectid:any) {
    var url=`${environment.apiEndPoint}ProjectPieces/FillProjectPieces?param=${projectid}`;
    return this.http.get<any>(url);
  }
  DeleteProjectPieces(PieceId:any){
    return this.http.post(this.apiEndPoint+'ProjectPieces/DeleteProjectPieces', {}, { params:{PieceId:PieceId}});
  }
  SaveProjectPieces(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'ProjectPieces/SaveProjectPieces', body,{'headers':headers});
  }

  FillInstrumentSourcesSelect() {
    return this.http.get<any>(this.apiEndPoint+'InstrumentSources/FillInstrumentSourcesSelect');
  }
  DeleteInstrumentSources(instrumentSourcesId:any){
    return this.http.post(this.apiEndPoint+'InstrumentSources/DeleteInstrumentSources', {}, { params:{instrumentSourcesId:instrumentSourcesId}});
  }
  SaveInstrumentSources(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'InstrumentSources/SaveInstrumentSources', body,{'headers':headers});
  }

  FillContractorsSelect() {
    return this.http.get<any>(this.apiEndPoint+'Project/FillContractorsSelect');
  }
  DeleteSuperContractor(ContractorId:any){
    return this.http.post(this.apiEndPoint+'Project/DeleteSuperContractor', {}, { params:{ContractorId:ContractorId}});
  }
  SaveSuperContractor(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Project/SaveSuperContractor', body,{'headers':headers});
  }

  FillMunicipalsSelect() {
    return this.http.get<any>(this.apiEndPoint+'Municipal/FillMunicipalsSelect');
  }
  DeleteMunicipal(MunicipalId:any){
    return this.http.post(this.apiEndPoint+'Municipal/DeleteMunicipal', {}, { params:{MunicipalId:MunicipalId}});
  }
  SaveMunicipal(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Municipal/SaveMunicipal', body,{'headers':headers});
  }

  FillSubMunicipalitysSelect() {
    return this.http.get<any>(this.apiEndPoint+'SubMunicipality/FillSubMunicipalitysSelect');
  }
  DeleteSubMunicipality(SubMunicipalityId:any){
    return this.http.post(this.apiEndPoint+'SubMunicipality/DeleteSubMunicipality', {}, { params:{SubMunicipalityId:SubMunicipalityId}});
  }
  SaveSubMunicipality(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'SubMunicipality/SaveSubMunicipality', body,{'headers':headers});
  }

  FillBuildTypeSelect() {
    return this.http.get<any>(this.apiEndPoint+'BuildTypes/FillBuildTypeSelect');
  }
  DeleteBuildTypes(BuildTypesId:any){
    return this.http.post(this.apiEndPoint+'BuildTypes/DeleteBuildTypes', {}, { params:{BuildTypesId:BuildTypesId}});
  }
  SaveBuildTypes(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'BuildTypes/SaveBuildTypes', body,{'headers':headers});
  }


  GetAllInstruments(ProjectId:any) {
    var url=`${environment.apiEndPoint}Instruments/GetAllInstruments?ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }
  DeleteInstruments(instrumentId:any){
    return this.http.post(this.apiEndPoint+'Instruments/DeleteInstruments', {}, { params:{instrumentId:instrumentId}});
  }
  SaveInstrument(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Instruments/SaveInstrument', body,{'headers':headers});
  }


  GetAllOffersByProjectId(ProjectId:any) {
    var url=`${environment.apiEndPoint}OffersPrice/GetAllOffersByProjectId?ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }
  GetOfferservicenByProjectId(ProjectId:any) {
    var url=`${environment.apiEndPoint}OffersPrice/GetOfferservicenByProjectId?ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }

  GetAllRequirementsByProjectId(ProjectId:any) {
    var url=`${environment.apiEndPoint}Requirements/GetAllRequirementsByProjectId?ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }
  SaveRequirementsbyProjectId(ProjectId:any){
    return this.http.post(this.apiEndPoint+'Requirements/SaveRequirementsbyProjectId', {}, { params:{ProjectId:ProjectId}});
  }
  ConfirmRequirementStatus(RequirementId:any,Status:any){
    return this.http.post(this.apiEndPoint+'Requirements/ConfirmRequirementStatus', {}, { params:{RequirementId:RequirementId,Status:Status}});
  }
  DeleteRequirement(RequirementId:any){
    return this.http.post(this.apiEndPoint+'Requirements/DeleteRequirement', {}, { params:{RequirementId:RequirementId}});
  }


  ChangeSupervision(SuperId:any,SuperCode:any) {
    var url=`${environment.apiEndPoint}Supervisions/ChangeSupervision?SuperId=${SuperId}&&SuperCode=${SuperCode}`;
    return this.http.get<any>(url);
  }
  UploadHeadImageFir(formData:any){
    return this.http.post<any>(this.apiEndPoint+'Supervisions/UploadHeadImageFir' ,formData );
  }
  UploadHeadImageSec(formData:any){
    return this.http.post<any>(this.apiEndPoint+'Supervisions/UploadHeadImageSec' ,formData );
  }
}
