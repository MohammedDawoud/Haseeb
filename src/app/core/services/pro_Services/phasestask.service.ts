import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhasestaskService {
  private apiEndPoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  FillUsersSelect(param: any) {
    var url = `${environment.apiEndPoint}ControllingTask/FillUsersSelect?param=${param}`;
    return this.http.get<any>(url);
  }
  FillUsershaveRunningTasks() {
    return this.http.get<any>(
      this.apiEndPoint + 'ControllingTask/FillUsershaveRunningTasksByBranch'
    );
  }
  FillAllUsersSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'ControllingTask/FillAllUsersSelect'
    );
  }
  FillAllUsersSelectAll() {
    return this.http.get<any>(
      this.apiEndPoint + 'ControllingTask/FillAllUsersSelectAllByBranch'
    );
  }
  FillAllUsersSelectsomeByBranch() {
    return this.http.get<any>(
      this.apiEndPoint + 'ControllingTask/FillAllUsersSelectsomeByBranch'
    );
  }
  FillDepartmentSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'Department/FillDepartmentSelect'
    );
  }
  GetCustomersOwnNotArcheivedProjects() {
    return this.http.get<any>(
      this.apiEndPoint + 'Customer/GetCustomersOwnNotArcheivedProjectsByBranch'
    );
  }
  GetAllProjByCustomerIdHaveTasks(customerId: any) {
    var url = `${environment.apiEndPoint}Project/GetAllProjByCustomerIdandbranchHaveTasks?customerId=${customerId}`;
    return this.http.get<any>(url);
  }
  GetTasksByUserIdCustomerIdProjectIdTree(formData: any) {
    return this.http.post<any>(
      `${this.apiEndPoint}ProjectPhasesTasks/GetTasksByUserIdCustomerIdProjectIdTree`,
      formData
    );
  }
  GetLateTasksByUserIdCustomerIdProjectIdTree(formData: any) {
    return this.http.post<any>(
      `${this.apiEndPoint}ProjectPhasesTasks/GetLateTasksByUserIdCustomerIdProjectIdTree`,
      formData
    );
  }
  FillUsersTasksVacationSelect(userid: any) {
    var url = `${environment.apiEndPoint}ProjectPhasesTasks/FillUsersTasksVacationSelect?param=${userid}`;
    return this.http.get<any>(url);
  }
  FillAllrequirmentbyProjectid(_projectid: any) {
    var url = `${environment.apiEndPoint}ProjectType/FillAllrequirmentbyProjectid?param=${_projectid}`;
    return this.http.get<any>(url);
  }
  GetAllrequirmentbyrequireid(_requirmentId: any) {
    var url = `${environment.apiEndPoint}ProjectType/GetAllrequirmentbyrequireid?RequirmentId=${_requirmentId}`;
    return this.http.get<any>(url);
  }
  loadPrivTree() {
    return this.http.get<any>(
      this.apiEndPoint + 'ProjectPhasesTasks/GetAllNewProjectPhasesTasksTreed'
    );
  }
  loadPrivTreeLate() {
    return this.http.get<any>(
      this.apiEndPoint + 'ProjectPhasesTasks/GetAllLateProjectPhasesTasksd'
    );
  }
  GetUserById(_userId: any) {
    var url = `${environment.apiEndPoint}ProjectType/GetUserById?UserId=${_userId}`;
    return this.http.get<any>(url);
  }
  GetTaskListtxt(_taskId: any) {
    var url = `${environment.apiEndPoint}ProjectPhasesTasks/GetTaskById?TaskId=${_taskId}`;
    return this.http.get<any>(url);
  }

  PlayPauseTask(obj: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(obj);
    return this.http.post(
      this.apiEndPoint + 'ProjectPhasesTasks/PlayPauseTask',
      body,
      { headers: headers }
    );
  }
  FinishTask(obj: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(obj);
    return this.http.post(
      this.apiEndPoint + 'ProjectPhasesTasks/FinishTask',
      body,
      { headers: headers }
    );
  }
  FinishTaskCheck(obj: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(obj);
    return this.http.post(
      this.apiEndPoint + 'ProjectPhasesTasks/FinishTaskCheck',
      body,
      { headers: headers }
    );
  }
  ChangePriorityTask(obj: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(obj);
    return this.http.post(
      this.apiEndPoint + 'ProjectPhasesTasks/ChangePriorityTask',
      body,
      { headers: headers }
    );
  }
  RefusePlustimeTask(obj: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(obj);
    return this.http.post(
      this.apiEndPoint + 'ProjectPhasesTasks/RefusePlustimeTask',
      body,
      { headers: headers }
    );
  }
  RequestConvertTask(obj: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(obj);
    return this.http.post(
      this.apiEndPoint + 'ProjectPhasesTasks/RequestConvertTask',
      body,
      { headers: headers }
    );
  }
  ConvertTask(obj: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(obj);
    return this.http.post(
      this.apiEndPoint + 'ProjectPhasesTasks/ConvertTask',
      body,
      { headers: headers }
    );
  }
  ChangeTaskTime(obj: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(obj);
    return this.http.post(
      this.apiEndPoint + 'ProjectPhasesTasks/ChangeTaskTime',
      body,
      { headers: headers }
    );
  }
  DeleteProjectPhasesTasksNEW(_phaseTaskId: any) {
    return this.http.post(
      this.apiEndPoint + 'ProjectPhasesTasks/DeleteProjectPhasesTasksNEW',
      {},
      { params: { PhaseTaskId: _phaseTaskId } }
    );
  }
  SaveTaskLongDesc(_projectPhaseTasksId: any, _taskLongDesc: any) {
    return this.http.post(
      this.apiEndPoint + 'ProjectPhasesTasks/SaveTaskLongDesc',
      {},
      {
        params: {
          ProjectPhaseTasksId: _projectPhaseTasksId,
          taskLongDesc: _taskLongDesc,
        },
      }
    );
  }
  ConvertUserTasksSome(_phaseTaskId: any, FromUserId: any, ToUserId: any) {
    return this.http.post(
      this.apiEndPoint + 'ProjectPhasesTasks/ConvertUserTasksSome',
      {},
      {
        params: {
          PhasesTaskId: _phaseTaskId,
          FromUserId: FromUserId,
          ToUserId: ToUserId,
        },
      }
    );
  }
  ConvertUserTasks(FromUserId: any, ToUserId: any) {
    return this.http.post(
      this.apiEndPoint + 'ProjectPhasesTasks/ConvertUserTasks',
      {},
      { params: { FromUserId: FromUserId, ToUserId: ToUserId } }
    );
  }

  DeleteTaskType(TaskTypeId: any) {
    return this.http.post(
      this.apiEndPoint + 'TaskType/DeleteTaskType',
      {},
      { params: { TaskTypeId: TaskTypeId } }
    );
  }
  //------addtask-------

  FillTaskTypeSelect() {
    return this.http.get<any>(this.apiEndPoint + 'TaskType/FillTaskTypeSelect');
  }

  FillCustomersOwnProjects() {
    return this.http.get<any>(
      this.apiEndPoint + 'Customer/FillCustomersOwnProjects'
    );
  }

  FillCustomersOwnProjectsByBranch() {
    return this.http.get<any>(
      this.apiEndPoint + 'Customer/FillCustomersOwnProjectsByBranch'
    );
  }

  FillProjectSelectByCustomerId(customerId: any) {
    var url = `${environment.apiEndPoint}Project/FillProjectSelectByCustomerId?param=${customerId}`;
    return this.http.get<any>(url);
  }
  FillProjectSelectByCustomerIdWiBranch(customerId: any) {
    var url = `${environment.apiEndPoint}Project/FillProjectSelectByCustomerIdWiBranch?param=${customerId}`;
    return this.http.get<any>(url);
  }
  FillProjectMainPhases(projectid: any) {
    var url = `${environment.apiEndPoint}ProjectPhasesTasks/FillProjectMainPhases?param=${projectid}`;
    return this.http.get<any>(url);
  }
  FillSubPhases(phaseid: any) {
    var url = `${environment.apiEndPoint}ProjectPhasesTasks/FillProjectSubPhases?param=${phaseid}`;
    return this.http.get<any>(url);
  }
  SaveNewProjectPhasesTasks_E(obj: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(obj);
    return this.http.post(
      this.apiEndPoint + 'ProjectPhasesTasks/SaveNewProjectPhasesTasks_E',
      body,
      { headers: headers }
    );
  }
  // SaveProjectRequirement4(model: any) {
  //   return this.http.post<any>(
  //     `${this.apiEndPoint}ProjectRequirements/SaveProjectRequirement4`,
  //     model
  //   );
  // }

  SaveProjectRequirement4(model: any): Observable<HttpEvent<any>> {
    debugger;
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'multipart/form-data');

    const req = new HttpRequest(
      'POST',
      `${this.apiEndPoint}ProjectRequirements/SaveProjectRequirement4`,
      model,
      {
        reportProgress: true,
        responseType: 'json',
      }
    );
    return this.http.request(req);
  }

  UploadProjectFilesNew(model: any) {
    return this.http.post<any>(
      `${this.apiEndPoint}FileUpload/UploadProjectFilesNew`,
      model
    );
  }
  SaveTaskType(obj: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'TaskType/SaveTaskType', body, {
      headers: headers,
    });
  }
  GetProjectById(ProjectId: any) {
    var url = `${environment.apiEndPoint}Project/GetProjectById?ProjectId=${ProjectId}`;
    return this.http.get<any>(url);
  }

  GetAllAttTimeDetails2(_userId: any) {
    var url = `${environment.apiEndPoint}AttendaceTime/GetAllAttTimeDetails2?AttTimeId=${_userId}`;
    return this.http.get<any>(url);
  }
  CheckUserPerDawamUserExist(
    UserId: any,
    TimeFrom: any,
    TimeTo: any,
    DayNo: any
  ) {
    var url = `${environment.apiEndPoint}AttendaceTime/CheckUserPerDawamUserExist?UserId=${UserId}&&TimeFrom=${TimeFrom}&&TimeTo=${TimeTo}&&DayNo=${DayNo}`;
    return this.http.get<any>(url);
  }
  FillProjectRequirmentSelect(projectid: any) {
    var url = `${environment.apiEndPoint}ProjectType/FillProjectRequirmentSelect?Param=${projectid}`;
    return this.http.get<any>(url);
  }

  GetTasksByUserIdUser(Status: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'ProjectPhasesTasks/GetTasksByUserIdUser?Status=' +
        Status +
        ''
    );
  }
  GetWorkOrdersByUserId() {
    return this.http.get<any>(
      this.apiEndPoint + 'WorkOrders/GetWorkOrdersByUserId'
    );
  }
  GetWorkOrdersByUserIdandtask(task: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'WorkOrders/GetWorkOrdersByUserIdandtask?task=' +
        task +
        ''
    );
  }
  GetWorkOrdersBytask(task: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'WorkOrders/GetWorkOrdersBytask?task=' + task + ''
    );
  }

  FinishOrder(obj: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'WorkOrders/FinishOrder', body, {
      headers: headers,
    });
  }

  GetDayWeekMonth_Tasks(flag: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'MyTask/GetDayWeekMonth_Tasks?flag=' + flag + ''
    );
  }
  GetDayWeekMonth_Tasks2(flag: any, startdate: any, enddate: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'MyTask/GetDayWeekMonth_Tasks?flag=' +
        flag +
        '&&startdate=' +
        startdate +
        '&&enddate=' +
        enddate +
        ''
    );
  }

  GetDayWeekMonth_Orders(flag: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'WorkOrders/GetDayWeekMonth_Orders?flag=' + flag + ''
    );
  }
  GetDayWeekMonth_Orders2(flag: any, startdate: any, enddate: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'WorkOrders/GetDayWeekMonth_Orders?flag=' +
        flag +
        '&&startdate=' +
        startdate +
        '&&enddate=' +
        enddate +
        ''
    );
  }

  GetTasksFilterationByUserId(flag: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'ProjectPhasesTasks/GetTasksFilterationByUserId?flag=' +
        flag +
        ''
    );
  }
  GetTasksFilterationByUserId2(flag: any, startdate: any, enddate: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'ProjectPhasesTasks/GetTasksFilterationByUserId?flag=' +
        flag +
        '&&startdate=' +
        startdate +
        '&&enddate=' +
        enddate +
        ''
    );
  }

  GetWorkOrdersFilterationByUserId(flag: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'WorkOrders/GetWorkOrdersFilterationByUserId?flag=' +
        flag +
        ''
    );
  }
  GetWorkOrdersFilterationByUserId2(flag: any, startdate: any, enddate: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'WorkOrders/GetWorkOrdersFilterationByUserId?flag=' +
        flag +
        '&&startdate=' +
        startdate +
        '&&enddate=' +
        enddate +
        ''
    );
  }

  PlustimeTask(obj: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(obj);
    return this.http.post(
      this.apiEndPoint + 'ProjectPhasesTasks/PlustimeTask',
      body,
      { headers: headers }
    );
  }

  UpdateIsNew(TaskId: any) {
    return this.http.get(
      this.apiEndPoint + 'ProjectPhasesTasks/UpdateIsNew?TaskId=' + TaskId + ''
    );
  }
  SendWhatsAppTask(model : any){
    return this.http.post<any>(`${this.apiEndPoint}ProjectPhasesTasks/SendWhatsAppTask`, model);
  }
}
