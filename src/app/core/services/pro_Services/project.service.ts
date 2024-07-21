import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ProjectVM } from 'src/app/core/Classes/ViewModels/projectVM';
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  GetAllProjectsmartfollowforadmin() {
    return this.http.get<any>(this.apiEndPoint+'Project/GetAllProjectsmartfollowforadmin');
  }
  GetAllProjectsmartfollow() {
    return this.http.get<any>(this.apiEndPoint+'Project/GetAllProjectsmartfollow');
  }
  UpdateProjectEnddate(projectid:any,ProjectEnddate:any){
    return this.http.post(this.apiEndPoint+'Project/UpdateProjectEnddate', {}, { params:{projectid:projectid,ProjectEnddate:ProjectEnddate}});
  }
  Updateskiptime(ProjectId:any){
    return this.http.post(this.apiEndPoint+'Project/Updateskiptime', {}, { params:{ProjectId:ProjectId}});
  }
  //-----------------------------------------
  GetProjectVM() {
    return this.http.get<any>(this.apiEndPoint+'Home/GetProjectVMNew');
  }
  GetAllProjects() {
    return this.http.get<any>(this.apiEndPoint+'Project/GetAllProjects');
  }
  //------------------------------------add------------------------
  FillBuildTypeSelect() {
    return this.http.get<any>(this.apiEndPoint+'BuildTypes/FillBuildTypeSelect');
  }
  FillCitySelect() {
    return this.http.get<any>(this.apiEndPoint+'City/FillCitySelect');
  }
  FillProjectTypeSelect() {
    return this.http.get<any>(this.apiEndPoint+'ProjectType/FillProjectTypeSelect');
  }
  FillProjectSubTypesSelect(param:any) {
    var url=`${environment.apiEndPoint}ProjectSubTypes/FillProjectSubTypesSelect?param=${param}`;
    return this.http.get<any>(url);
  }
  GetAllCustomerForDropWithBranch() {
    return this.http.get<any>(this.apiEndPoint+'Customer/GetAllCustomerForDropWithBranch');
  }
  GetAllCustomerForDrop() {
    return this.http.get<any>(this.apiEndPoint+'Customer/GetAllCustomerForDrop');
  }
  FillAllUsersSelectAll() {
    return this.http.get<any>(this.apiEndPoint+'ControllingTask/FillAllUsersSelectAll');
  }
  FillTaskTypeSelect() {
    return this.http.get<any>(this.apiEndPoint+'TaskType/FillTaskTypeSelect');
  }
  FillProjectSelect() {
    return this.http.get<any>(this.apiEndPoint+'Project/FillProjectSelect');
  }

    FillProjectSelectNewTask() {
    return this.http.get<any>(this.apiEndPoint+'Project/FillProjectSelectNewTask');
  }
      FillProjectSelectLateTask() {
    return this.http.get<any>(this.apiEndPoint+'Project/FillProjectSelectLateTask');
  }

       FillProjectSelectWorkOrder() {
    return this.http.get<any>(this.apiEndPoint+'Project/FillProjectSelectWorkOrder');
  }

         FillProjectSelecLatetWorkOrder() {
    return this.http.get<any>(this.apiEndPoint+'Project/FillProjectSelecLatetWorkOrder');
  }

  FillDepartmentSelectByTypeUser(param:any) {
    var url=`${environment.apiEndPoint}Department/FillDepartmentSelectByTypeUser?param=${param}`;
    return this.http.get<any>(url);
  }
  FillBranchByUserIdSelect() {
    return this.http.get<any>(this.apiEndPoint+'Branches/FillBranchByUserIdSelect');
  }
  FillSelectEmployee() {
    return this.http.get<any>(this.apiEndPoint+'Employee/FillSelectEmployee');
  }
  FillCostCenterSelectBranch(param:any) {
    var url=`${environment.apiEndPoint}CostCenter/FillCostCenterSelectBranch?param=${param}`;
    return this.http.get<any>(url);
  }
  GetServicesPriceByProjectId2(param:any,param2:any) {
    var url=`${environment.apiEndPoint}Voucher/GetServicesPriceByProjectId2?param=${param}&&param2=${param2}`;
    return this.http.get<any>(url);
  }
  GenerateNextProjectNumber() {
    return this.http.get<any>(this.apiEndPoint+'Project/GenerateNextProjectNumber');
  }
  GetProjectDurationStr(start:any,end:any) {
    var url=`${environment.apiEndPoint}General/GetProjectDurationStr?start=${start}&&end=${end}`;
    return this.http.get<any>(url);
  }
  GetTimePeriordBySubTypeId(SubTypeId:any) {
    var url=`${environment.apiEndPoint}ProjectSubTypes/GetTimePeriordBySubTypeId?SubTypeId=${SubTypeId}`;
    return this.http.get<any>(url);
  }
  GetProjectSettingsDetails(ProjectTypeId:any,ProjectSubTypeId:any) {
    var url=`${environment.apiEndPoint}ProjectSettings/GetProjectSettingsDetails?ProjectTypeId=${ProjectTypeId}&&ProjectSubTypeId=${ProjectSubTypeId}`;
    return this.http.get<any>(url);
  }
  GetProjectSettingsDetailsIFExist(ProjectId:any) {
    var url=`${environment.apiEndPoint}ProjectSettings/GetProjectSettingsDetailsIFExist?ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }
  GetProjectRequirementByProjectSubTypeId(ProjectSubTypeId:any) {
    var url=`${environment.apiEndPoint}ProjectRequirements/GetProjectRequirementByProjectSubTypeId?ProjectSubTypeId=${ProjectSubTypeId}`;
    return this.http.get<any>(url);
  }
  FillAllOfferTodropdown(param:any) {
    var url=`${environment.apiEndPoint}OffersPrice/FillAllOfferTodropdown?param=${param}`;
    return this.http.get<any>(url);
  }
  FillAllOfferTodropdownProject(customerid:any,projectid:any) {
    var url=`${environment.apiEndPoint}OffersPrice/FillAllOfferTodropdownProject?customerid=${customerid}&&projectid=${projectid}`;
    return this.http.get<any>(url);
  }
  //--------------------------------------------------------------------------------------
  //--------------------------btn---------------------------------------------------------
  GetAllProjectCurrentTasks(ProjectId:any) {
    var url=`${environment.apiEndPoint}ProjectPhasesTasks/GetAllProjectCurrentTasks?ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }
  GetAllProjectWorkers(ProjectId:any) {
    var url=`${environment.apiEndPoint}ProjectWorkers/GetAllProjectWorkers?ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }
  //---------------------------------------------------------------

  SearchFn(_projectVM:ProjectVM): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_projectVM);
    return this.http.post(this.apiEndPoint + 'Project/GetProjectsSearch', body,{'headers':headers});
  }
  SearchDateFn(from:string,to:string): Observable<any> {
    return this.http.get(this.apiEndPoint+'Project/GetAllProjectsByDateSearch?DateFrom='+from+'&&DateTo='+to+'');
  }
  FillCustomerSelect() {
    return this.http.get<any>(this.apiEndPoint+'Customer/FillCustomerSelect');
  }
  FillAllUsersSelect() {
    return this.http.get<any>(this.apiEndPoint+'ControllingTask/FillAllUsersSelect');
  }

  ChangeFlag(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Project/ChangeFlag', body,{'headers':headers});
  }
  ChangeImportant(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Project/ChangeImportant', body,{'headers':headers});
  }
  DestinationsUploadProject(ProjectId:any,status:any){
    return this.http.post(this.apiEndPoint+'Project/DestinationsUploadProject', {}, { params:{ProjectId:ProjectId,status:status}});
  }
  StopProject(ProjectId:any,TypeId:any,whichClickDesc:any){
    return this.http.post(this.apiEndPoint+'Project/StopProject', {}, { params:{ProjectId:ProjectId,TypeId:TypeId,whichClickDesc:whichClickDesc}});
  }
  PlayProject(ProjectId:any,TypeId:any,whichClickDesc:any){
    return this.http.post(this.apiEndPoint+'Project/PlayProject', {}, { params:{ProjectId:ProjectId,TypeId:TypeId,whichClickDesc:whichClickDesc}});
  }
  GenerateProjectFiles(ProjectIdList:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(ProjectIdList);
    return this.http.post(this.apiEndPoint + 'Project/GenerateProjectFiles', body,{'headers':headers});
  }
  GetAllPriv(ProjectId:any) {
    var url=`${environment.apiEndPoint}Project/GetAllPriv?Projectno=${ProjectId}`;
    return this.http.get<any>(url);
  }
  GetAllRequirmentbyprojecttype(projecttypeid:any) {
    var url=`${environment.apiEndPoint}ProjectType/GetAllRequirmentbyprojecttype?projecttypeid=${projecttypeid}`;
    return this.http.get<any>(url);
  }
  GetTasksWithoutUser(DepartmentId:any) {
    // return this.http.get<any>(this.apiEndPoint+'ProjectPhasesTasks/GetTasksWithoutUser');
    var url=`${environment.apiEndPoint}ProjectPhasesTasks/GetTasksWithoutUser?DepartmentId=${DepartmentId}`;
    return this.http.get<any>(url);
  }
  SetUserTask(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'ProjectPhasesTasks/SetUserTask', body,{'headers':headers});
  }
  SaveProjectPhasesTasks(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'ProjectPhasesTasks/SaveProjectPhasesTasks', body,{'headers':headers});
  }
  SaveProject(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Project/SaveProject', body,{'headers':headers});
  }
  UpdateProjectPhasesTasks(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'ProjectPhasesTasks/UpdateProjectPhasesTasks', body,{'headers':headers});
  }
  UpdateProject(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Project/UpdateProject', body,{'headers':headers});
  }
  GetProjectCode_S() {
    return this.http.get<any>(this.apiEndPoint+'Project/GetProjectCode_S');
  }

  SavePriv2(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Project/SavePriv2', body,{'headers':headers});
  }
  DeletePriv(PrivID:any){
    return this.http.post(this.apiEndPoint+'Project/DeletePriv', {}, { params:{PrivID:PrivID}});
  }

  SaveProjectType(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'ProjectType/SaveProjectType', body,{'headers':headers});
  }
  DeleteProjectType(ProjectTypeId:any){
    return this.http.post(this.apiEndPoint+'ProjectType/DeleteProjectType', {}, { params:{ProjectTypeId:ProjectTypeId}});
  }

  SaveProjectSubType(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'ProjectSubTypes/SaveProjectSubType', body,{'headers':headers});
  }
  DeleteProjectSubTypes(SubTypeId:any){
    return this.http.post(this.apiEndPoint+'ProjectSubTypes/DeleteProjectSubTypes', {}, { params:{SubTypeId:SubTypeId}});
  }

  SaveBuildTypes(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'BuildTypes/SaveBuildTypes', body,{'headers':headers});
  }
  DeleteBuildTypes(BuildTypesId:any){
    return this.http.post(this.apiEndPoint+'BuildTypes/DeleteBuildTypes', {}, { params:{BuildTypesId:BuildTypesId}});
  }

  SaveCity(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'City/SaveCity', body,{'headers':headers});
  }
  DeleteCity(CityId:any){
    return this.http.post(this.apiEndPoint+'City/DeleteCity', {}, { params:{CityId:CityId}});
  }

  GetCustomersByCustomerId(CustomerId:any) {
    var url=`${environment.apiEndPoint}Customer/GetCustomersByCustomerId?CustomerId=${CustomerId}`;
    return this.http.get<any>(url);
  }
  GetCustomersByProjectId(ProjectId:any) {
    var url=`${environment.apiEndPoint}Customer/GetCustomersByProjectId?ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }
  GetUserById(UserId:any) {
    var url=`${environment.apiEndPoint}Users/GetUserById?UserId=${UserId}`;
    return this.http.get<any>(url);
  }
  SendCustomerEmail_SMS(CustomerId:any,ProjectId:any,TypeId:any){
    return this.http.post(this.apiEndPoint+'Project/SendCustomerEmail_SMS', {},
     { params:{CustomerId:CustomerId,ProjectId:ProjectId,TypeId:TypeId}});
  }
  GetProSettingDetails(ProjectId:any) {
    var url=`${environment.apiEndPoint}Project/GetProSettingDetails?ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }
  GetProDetails(ProjectId:any) {
    var url=`${environment.apiEndPoint}Project/ProjectDetails?ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }
  FillReasonsSelect() {
    return this.http.get<any>(this.apiEndPoint+'projectsReasons/FillReasonsSelect');
  }
  SaveReason(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'projectsReasons/SaveReason', body,{'headers':headers});
  }
  DeleteReason(ReasonsId:any){
    return this.http.post(this.apiEndPoint+'projectsReasons/DeleteReason', {}, { params:{ReasonsId:ReasonsId}});
  }


  ///////////////////////////////////////////////////////////////////////////////////////////
  //#region MyProjects

  GetMyProjects() {
    return this.http.get(this.apiEndPoint+'ControllingTask/GetMyProjects');

  }

  GetProjectMainPhasesByProjectId(ProjectId:any){
    return this.http.get(this.apiEndPoint+'ProjectPhasesTasks/GetProjectMainPhasesByProjectId?ProjectId='+ProjectId+'');

  }
  GetProjectSubPhasesByProjectId(MainPhaseId:any){
    return this.http.get(this.apiEndPoint+'ProjectPhasesTasks/GetProjectSubPhasesByProjectId?MainPhaseId='+MainPhaseId+'');

  }

  GetAllSubPhasesTasksbyUserId2(SubPhaseId:any){
    return this.http.get(this.apiEndPoint+'ControllingTask/GetAllSubPhasesTasksbyUserId2?SubPhaseId='+SubPhaseId+'');
  }

  GetTaskById(TaskId:any){
    return this.http.get(this.apiEndPoint+'ProjectPhasesTasks/GetTaskById?TaskId='+TaskId+'');
  }

  GetProjectById(ProjectId:any) {
    return this.http.get<any>(this.apiEndPoint+'Project/GetProjectById?ProjectId='+ProjectId+'');
  }
   //#endregion
  ///////////////////////////////////////////////////////////////////////////////////////////
  GetTasksByUserIdUser(Status:any) {
    return this.http.get<any>(this.apiEndPoint+'ProjectPhasesTasks/GetTasksByUserIdUser?Status='+Status+'');
  }
  //#endregion

  SaveRequirementsbyProjectId(ProjectId:any){
    return this.http.post(this.apiEndPoint+'Requirements/SaveRequirementsbyProjectId', {}, { params:{ProjectId:ProjectId}});
  }

    FillCustomerSelectNewTasks() {
    return this.http.get<any>(this.apiEndPoint+'Project/FillCustomerSelectNewTask');
  }

    FillCustomerSelectLateTask() {
    return this.http.get<any>(this.apiEndPoint+'Project/FillCustomerSelectLateTask');
  }

     FillCustomerSelectWorkOrder() {
    return this.http.get<any>(this.apiEndPoint+'Project/FillCustomerSelectWorkOrder');
  }

    FillCustomerSelectLateWorkOrder() {
    return this.http.get<any>(this.apiEndPoint+'Project/FillCustomerSelectLateWorkOrder');
  }
}
