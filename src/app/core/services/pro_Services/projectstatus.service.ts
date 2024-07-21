import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ProjectVM } from 'src/app/core/Classes/ViewModels/projectVM';

@Injectable({
  providedIn: 'root'
})
export class ProjectstatusService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  GetAllProjectsStatusTasks() {
    return this.http.get<any>(this.apiEndPoint+'Project/GetAllProjectsStatusTasks');
  }
  FillProjectTypeSelect() {
    return this.http.get<any>(this.apiEndPoint+'ProjectType/FillProjectTypeSelect');
  }
  FillAllUsersByProject() {
    return this.http.get<any>(this.apiEndPoint+'Project/FillAllUsersByProject');
  }
  CustomerNameSearch() {
    return this.http.get<any>(this.apiEndPoint+'Customer/FillCustomerSelect');
  }
  FillAllUsersSelectExcept(param:any) {
    var url=`${environment.apiEndPoint}MyProjectsPop/FillAllUsersSelectExcept?ExceptUserId=${param}`;
    return this.http.get<any>(url);
  }
  FillAllUsersSelect() {
    return this.http.get<any>(this.apiEndPoint+'MyProjectsPop/FillAllUsersSelect');
  }
  SearchFn(_projectVM:ProjectVM): Observable<any> {
    debugger
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_projectVM);
    return this.http.post(this.apiEndPoint + 'Project/GetProjectsStatusTasksSearch', body,{'headers':headers});
  }
  SearchDateFn(from:string,to:string): Observable<any> {
    return this.http.get(this.apiEndPoint+'Project/GetAllProjectsByDateSearch?DateFrom='+from+'&&DateTo='+to+'');
  }
  ChangeProjectManagerCheckBox2(_projectIds:any,_mangerId:any) {
    debugger
    const formData: FormData = new FormData();
    // for(let i = 0; i < _projectIds.length; i++) {
    //   formData.append("projectIds",_projectIds[i]);
    // }
    // formData.append("projectIds",'1');

    formData.append("mangerId",String(_mangerId));
    //formData.append("mangerId",Object.assign({}, _mangerId.value));

    //const headers = { 'content-type': 'application/json', 'Accept':'application/json'}
    const headers = {"Content-Type":"multipart/form-data;"}

    //const headers = {"Content-Type":"multipart/form-data; boundary=l3iPy71otz"}

    return this.http.post(this.apiEndPoint + 'Project/ChangeProjectManagerCheckBox',formData,{'headers':headers});
  }
  ChangeProjectManagerCheckBox(_projectIds:any,_mangerId:any) {
    const formData: FormData = new FormData();
    for(let i = 0; i < _projectIds.length; i++) {
      formData.append("projectIds",String(_projectIds[i]));
    }
    formData.append('mangerId', String(_mangerId));
    const req = new HttpRequest('POST', `${this.apiEndPoint}Project/ChangeProjectManagerCheckBox`, formData);

    return this.http.request(req);
  }
  DeleteProject(val:any){
    return this.http.post(this.apiEndPoint+'Project/DeleteProject_NEW', {}, { params:{ProjectId:val}});
  }
  DeleteAllProject_NEW(val:any){
    return this.http.post(this.apiEndPoint+'Project/DeleteAllProject_NEW', {}, { params:{ProjectId:val}});
  }
  FinishProject(FiniProjId:any,ReasonsId:any,FiniReason:any,FiniReasontype:any,FiniReasontext:any,FiniDate:any,TypeId:any,whichClickDesc:any){
    return this.http.post(this.apiEndPoint+'Project/FinishProject', {},
    { params:{ProjectId:FiniProjId,ReasonsId:ReasonsId,Reason:FiniReason,Reasontype:FiniReasontype,Reasontext:FiniReasontext,Date:FiniDate,TypeId:TypeId,whichClickDesc:whichClickDesc}});
  }
}
