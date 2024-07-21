import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProSettingDetails } from 'src/app/core/Classes/DomainObjects/proSettingDetails';
import { ProjectType } from 'src/app/core/Classes/DomainObjects/projectType';
import { Observable } from 'rxjs';
import { ProjectSubTypes } from 'src/app/core/Classes/DomainObjects/projectSubTypes';
import { SettingsVM } from 'src/app/core/Classes/ViewModels/settingsVM';
import { Settings } from 'src/app/core/Classes/DomainObjects/settings';
import { ProjectPhasesTasks } from '../../Classes/DomainObjects/projectPhasesTasks';

@Injectable({
  providedIn: 'root'
})
export class ProjectsettingService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }


  //------------------------------(Fill)------------------------------------
  FillProjectTypeSelect() {
    return this.http.get<any>(this.apiEndPoint+'ProjectType/FillProjectTypeSelect');
  }
  FillProjectSubTypesSelect(param:any) {
    var url=`${environment.apiEndPoint}ProjectSubTypes/FillProjectSubTypesSelect?param=${param}`;
    return this.http.get<any>(url);
  }

  FillSubPhases(param:any) {
    var url=`${environment.apiEndPoint}ProjectSettings/FillSubPhases?param=${param}`;
    return this.http.get<any>(url);
  }
  FillMainPhases(param:any) {
    var url=`${environment.apiEndPoint}ProjectSettings/FillMainPhases?param=${param}`;
    return this.http.get<any>(url);
  }
  FillAllUsersSelectAll() {
    return this.http.get<any>(this.apiEndPoint+'ControllingTask/FillAllUsersSelectAll');
  }
  FillTaskTypeSelect() {
    return this.http.get<any>(this.apiEndPoint+'TaskType/FillTaskTypeSelect');
  }
  FillProjectSelectByCustomerIdNotifaction() {
    return this.http.get<any>(this.apiEndPoint+'Project/FillProjectSelectByCustomerIdNotifaction');
  }
  //--------------------------(End)----(Fill)------------------------------------




  //---------------------------ProjectSettingSearch--------------------------------

  getAllProjectSettingSearch() {
    return this.http.get<any>(this.apiEndPoint+'ProjectSettings/FillProSettingNo');
  }

  transferSetting(_projSubTypeFromId:any,_projSubTypeToId?:any){
    return this.http.post(this.apiEndPoint+'DependencySettings/TransferSetting', {}, { params:{ProjSubTypeFromId:_projSubTypeFromId,ProjSubTypeToId:_projSubTypeToId}});
  }

  deleteProjectSetting(_settingId:any){
    return this.http.post(this.apiEndPoint+'ProjectSettings/DeleteProjectSettingsDetails', {}, { params:{SettingId:_settingId}});
  }
  VoucherTaskStop(val:any){
    return this.http.post(this.apiEndPoint+'ProjectPhasesTasks/VoucherTaskStop', {}, { params:{PhaseTaskId:val}});
  }
  VoucherTaskStopR(val:any){
    return this.http.post(this.apiEndPoint+'ProjectPhasesTasks/VoucherTaskStopR', {}, { params:{PhaseTaskId:val}});
  }
  //---------------------------(End) ProjectSettingSearch--------------------------------

  //---------------------------ProjectSettingEdit--------------------------------

  GetAllNodesTasks(param:any) {
    var url=`${environment.apiEndPoint}DependencySettings/GetAllNodesTasks?ProSubTypeId=${param}`;
    return this.http.get<any>(url);
  }
  GetAllNodesTasks_Project(param:any) {
    var url=`${environment.apiEndPoint}TasksDependency/GetAllNodesTasks?ProjectId=${param}`;
    return this.http.get<any>(url);
  }


  SaveDependencySettings(dependencyData:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(dependencyData);
    return this.http.post(this.apiEndPoint + 'DependencySettings/SaveDependencySettings', body,{'headers':headers});
  }
  SaveDependencyPhasesTask(dependencyData:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(dependencyData);
    return this.http.post(this.apiEndPoint + 'TasksDependency/SaveDependencyPhasesTask', body,{'headers':headers});
  }

  SaveDependencySettings2(_projSubTypeId:any,_taskLinkList:any,_nodeLocList:any) {
    const formData: FormData = new FormData();
    formData.append('ProjSubTypeId', _projSubTypeId);

    for(let i = 0; i < _taskLinkList.length; i++) {
      formData.append("TaskLinkList",_taskLinkList[i]);
    }
    for(let i = 0; i < _nodeLocList.length; i++) {
      formData.append("NodeLocList",_nodeLocList[i]);
    }
    const req = new HttpRequest('POST', `${this.apiEndPoint}DependencySettings/SaveDependencySettings`, formData);

    return this.http.request(req);
  }
  SaveProSettingsDetails(obj:ProSettingDetails) {
    debugger
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'ProjectSettings/SaveProSettingsDetails', body,{'headers':headers});
  }
  EditProSettingsDetails(obj:ProSettingDetails) {
    debugger
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'ProjectSettings/EditProSettingsDetails', body,{'headers':headers});
  }

  //---------------------------(End) ProjectSettingEdit--------------------------------

  //---------------------------ProjectSettingNew--------------------------------

  getProSettingnumber(_proSubTypeId:any,_projectSubTypeId:any) {
    var url=`${environment.apiEndPoint}ProjectSettings/GetProSettingsDetails?ProjectTypeId=${_proSubTypeId}&ProjectSubTypeId=${_projectSubTypeId}`;
    return this.http.get<any>(url);
  }

  //------------------------(Ebd)---ProjectSettingNew--------------------------------


  //--------------------------------------ProjectType----------------------------------------
  getAllProjectTypes(_searchText:any) {
    var url=`${environment.apiEndPoint}ProjectType/GetAllProjectType?SearchText=${_searchText}`;
    return this.http.get<ProjectType>(url);
  }
  saveProjectType(obj:ProjectType): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'ProjectType/SaveProjectType', body,{'headers':headers});

  }
  DeleteProjectType(val:any){
    return this.http.post(this.apiEndPoint+'ProjectType/DeleteProjectType', {}, { params:{DeleteProjectType:val}});
  }
  //------------------------------------(End)---ProjectType-----------------------------------------

  //--------------------------------------ProjectSubType----------------------------------------
  GetAllProjectSubsByProjectTypeId(param:any) {
    var url=`${environment.apiEndPoint}ProjectSubTypes/GetAllProjectSubsByProjectTypeId?ProjectTypeId=${param}`;
    return this.http.get<ProjectSubTypes>(url);
  }

  SaveProjectSubType(obj:ProjectSubTypes): Observable<any> {
    debugger
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'ProjectSubTypes/SaveProjectSubType', body,{'headers':headers});

  }
  DeleteProjectSubTypes(val:any){
    return this.http.post(this.apiEndPoint+'ProjectSubTypes/DeleteProjectSubTypes', {}, { params:{SubTypeId:val}});
  }
  //------------------------------------(End)---ProjectSubType-----------------------------------------

  //------------------------------------MainPhase and SubPhase-------------------------------------------
  GetAllMainPhases(param:any) {
    var url=`${environment.apiEndPoint}ProjectSettings/GetAllMainPhases?ProSubTypeId=${param}`;
    return this.http.get<SettingsVM>(url);
  }
  FillProjectMainPhases(param:any) {
    var url=`${environment.apiEndPoint}ProjectPhasesTasks/FillProjectMainPhases?param=${param}`;
    return this.http.get<SettingsVM>(url);
  }
  GetAllSubPhases(param:any) {
    var url=`${environment.apiEndPoint}ProjectSettings/GetAllSubPhases?ParentId=${param}`;
    return this.http.get<SettingsVM>(url);
  }
  FillProjectSubPhases(param:any) {
    var url=`${environment.apiEndPoint}ProjectPhasesTasks/FillProjectSubPhases?param=${param}`;
    return this.http.get<SettingsVM>(url);
  }
  SaveSettings(obj:Settings): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'ProjectSettings/SaveSettings', body,{'headers':headers});

  }
  SaveNewProjectPhasesTasks(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'ProjectPhasesTasks/SaveNewProjectPhasesTasks', body,{'headers':headers});

  }
  DeleteSettings(val:any){
    return this.http.post(this.apiEndPoint+'ProjectSettings/DeleteSettings', {}, { params:{SettingId:val}});
  }
  DeleteProjectPhasesTasks(val:any){
    return this.http.post(this.apiEndPoint+'ProjectPhasesTasks/DeleteProjectPhasesTasks', {}, { params:{PhaseTaskId:val}});
  }
  //---------------------------(end)-----MainPhase and SubPhase--------------------------------------



  //------------------------------------Tasks-------------------------------------------
  GetAllTasksByPhaseId(param:any) {
    var url=`${environment.apiEndPoint}ProjectSettings/GetAllTasksByPhaseId?id=${param}`;
    return this.http.get<any>(url);
  }
  GetAllProjectTasksByPhaseId(param:any) {
    var url=`${environment.apiEndPoint}ProjectPhasesTasks/GetAllProjectTasksByPhaseId?id=${param}`;
    return this.http.get<any>(url);
  }
  SaveSettingsList(obj:Settings[]): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'ProjectSettings/SaveSettingsList', body,{'headers':headers});
  }
  SaveTaskSetting(obj:ProjectPhasesTasks[]): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'ProjectPhasesTasks/SaveTaskSetting', body,{'headers':headers});
  }
  // MerigTasks(val:any){
  //   return this.http.post(this.apiEndPoint+'ProjectSettings/MerigTasks', {}, { params:{_settingDetailsData:val}});
  // }
  MerigTasks(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'ProjectSettings/MerigTasks', body,{'headers':headers});
  }
  MerigTasks_Phases(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'ProjectPhasesTasks/MerigTasks', body,{'headers':headers});
  }

  ConvertTasksSubToMain(val:any){
    return this.http.post(this.apiEndPoint+'ProjectSettings/ConvertTasksSubToMain', {}, { params:{SettingId:val}});
  }

  FillProjectTypeRequirmentSelect(_proSubTypeId:any,_projectSubTypeId:any) {
    var url=`${environment.apiEndPoint}ProjectType/FillProjectTypeRequirmentSelect?param=${_proSubTypeId}&param2=${_projectSubTypeId}`;
    return this.http.get<any>(url);
  }

  //---------------------------(end)-----MainPhase and SubPhase--------------------------------------

  //-------------------------------------------Calc---------------------------------------------------
  GetAllSettingsByProjectIDwithoutmain(param:any) {
    var url=`${environment.apiEndPoint}ProjectSettings/GetAllSettingsByProjectIDwithoutmain?ProjectID=${param}`;
    return this.http.get<any>(url);
  }
  GetAllSettingsByProjectIDwithoutmainAll() {
    var url=`${environment.apiEndPoint}ProjectSettings/GetAllSettingsByProjectIDwithoutmainAll`;
    return this.http.get<any>(url);
  }
  GetTimePeriordBySubTypeId(param:any) {
    var url=`${environment.apiEndPoint}ProjectSubTypes/GetTimePeriordBySubTypeId?SubTypeId=${param}`;
    return this.http.get<any>(url);
  }
  //--------------------------------------(End)---Calc--------------------------------------------------
}
