import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ProjectVM } from 'src/app/core/Classes/ViewModels/projectVM';
import { ProjectPhasesTasksVM } from 'src/app/core/Classes/ViewModels/projectPhasesTasksVM';

@Injectable({
  providedIn: 'root',
})
export class ProreportsService {
  private apiEndPoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  //----------------تقرير الاداء الشامل-------------------
  getreportNew(_projectPhasesTasksVM: ProjectPhasesTasksVM): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(_projectPhasesTasksVM);
    return this.http.post(
      this.apiEndPoint + 'ProjectPhasesTasks/getreportNew',
      body,
      { headers: headers }
    );
  }
  FillAllUsersTodropdown() {
    return this.http.get<any>(
      this.apiEndPoint + 'Users/FillAllUsersTodropdown'
    );
  }
  FillBranchSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Branches/FillBranchSelect');
  }
  //----------------------------------END-----------------------------------------------------------------------------------

  //------------------------------مشاريع المستخدم---------------------------------

  GetUserProjectsReportW(): Observable<any> {
    return this.http.get(this.apiEndPoint + 'Project/GetUserProjectsReportW');
  }

  GetUserProjectsReportS_paging(
    userId: string,
    customerId: string,
    from: string,
    to: string,
    page: any,
    pageSize: any,
    SearchText: any
  ): Observable<any> {
    let data = {
      UserId: userId,
      CustomerId: customerId,
      DateFrom: from,
      DateTo: to,
      page: page,
      pageSize: pageSize,
      SearchText: SearchText,
    };
    var url = this.apiEndPoint + 'Project/GetUserProjectsReportS_paging';
    return this.http.get(`${url}`, { params: data });
  }

  GetUserProjectsReportS(
    userId: string,
    customerId: string,
    from: string,
    to: string
  ): Observable<any> {
    let data = {
      UserId: userId,
      CustomerId: customerId,
      DateFrom: from,
      DateTo: to,
    };
    var url = this.apiEndPoint + 'Project/GetUserProjectsReportS';
    return this.http.get(`${url}`, { params: data });
  }
  //----------------------------------END-----------------------------------------------------------------------------------

  //----------------مهام المستخدم-------------------------
  GetAllProjectPhasesTasksW_whithworkorder(): Observable<any> {
    return this.http.get(
      this.apiEndPoint +
        'ProjectPhasesTasks/GetAllProjectPhasesTasksW_whithworkorder'
    );
  }

  GetAllProjectPhasesTasksS_whithworkorder(
    userId: string,
    status: string,
    from: string,
    to: string
  ): Observable<any> {
    let data = { UserId: userId, status: status, DateFrom: from, DateTo: to };
    var url =
      this.apiEndPoint +
      'ProjectPhasesTasks/GetAllProjectPhasesTasksS_whithworkorder';
    return this.http.get(`${url}`, { params: data });
    //return this.http.get(this.apiEndPoint+'ProjectPhasesTasks/GetAllProjectPhasesTasksS_whithworkorder?UserId='+userId+'&&status='+status+'&&DateFrom='+from+'&&DateTo='+to+'');
  }

  GetAllProjectPhasesTasksS_whithworkorder_paging(
    userId: string,
    status: string,
    from: string,
    to: string,
    Searchtext: any,
    page: any,
    pageSize: any
  ): Observable<any> {
    let data = {
      UserId: userId,
      status: status,
      DateFrom: from,
      DateTo: to,
      Searchtext: Searchtext,
      page: page,
      pageSize: pageSize,
    };
    var url =
      this.apiEndPoint +
      'ProjectPhasesTasks/GetAllProjectPhasesTasksS_whithworkorder_paging';
    return this.http.get(`${url}`, { params: data });
    //return this.http.get(this.apiEndPoint+'ProjectPhasesTasks/GetAllProjectPhasesTasksS_whithworkorder?UserId='+userId+'&&status='+status+'&&DateFrom='+from+'&&DateTo='+to+'');
  }
  GetAllLateProjectPhasesByuser_rpt(
    userId: any,
    status: any,
    from: string,
    to: string
  ): Observable<any> {
    return this.http.get(
      this.apiEndPoint +
        'ProjectPhasesTasks/GetAllLateProjectPhasesByuser_rpt?UserId=' +
        userId +
        '&&status=' +
        status +
        '&&DateFrom=' +
        from +
        '&&DateTo=' +
        to +
        ''
    );
  }

  GetAllLateProjectPhasesByuser_rpt_paging(
    userId: any,
    status: any,
    from: string,
    to: string,
    Searchtext: any,
    page: any,
    pageSize: any
  ): Observable<any> {
    return this.http.get(
      this.apiEndPoint +
        'ProjectPhasesTasks/GetAllLateProjectPhasesByuser_rpt_paging?UserId=' +
        userId +
        '&&status=' +
        status +
        '&&DateFrom=' +
        from +
        '&&DateTo=' +
        to +
        '&&Searchtext=' +
        Searchtext +
        '&&page=' +
        page +
        '&&pageSize=' +
        pageSize +
        ''
    );
  }

  GetAllProjectPhasesTasksbystatus_WithworkOrder(
    userId: any,
    status: any,
    from: string,
    to: string
  ): Observable<any> {
    return this.http.get(
      this.apiEndPoint +
        'ProjectPhasesTasks/GetAllProjectPhasesTasksbystatus_WithworkOrder?UserId=' +
        userId +
        '&&status=' +
        status +
        '&&DateFrom=' +
        from +
        '&&DateTo=' +
        to +
        ''
    );
  }

  GetAllProjectPhasesTasksbystatus_WithworkOrder_paging(
    userId: any,
    status: any,
    from: string,
    to: string,
    Searchtext: any,
    page: any,
    pageSize: any
  ): Observable<any> {
    return this.http.get(
      this.apiEndPoint +
        'ProjectPhasesTasks/GetAllProjectPhasesTasksbystatus_WithworkOrder_paging?UserId=' +
        userId +
        '&&status=' +
        status +
        '&&DateFrom=' +
        from +
        '&&DateTo=' +
        to +
        '&&Searchtext=' +
        Searchtext +
        '&&page=' +
        page +
        '&&pageSize=' +
        pageSize +
        ''
    );
  }
  FillAllUsersSelectAll() {
    return this.http.get<any>(
      this.apiEndPoint + 'ControllingTask/FillAllUsersSelectAll'
    );
  }
  //----------------------------------END---------------------------------------------------------------------------------

  //--------------مهام حسب المشروع------------------

  GetAllTasksByProjectIdW_whithWotkOrder(): Observable<any> {
    return this.http.get(
      this.apiEndPoint +
        'ProjectPhasesTasks/GetAllTasksByProjectIdW_whithWotkOrder'
    );
  }
  GetAllTasksByProjectIdS_withworkorder(
    projectId: any,
    DepartmentId: any,
    from: string,
    to: string
  ): Observable<any> {
    return this.http.get(
      this.apiEndPoint +
        'ProjectPhasesTasks/GetAllTasksByProjectIdS_withworkorder?ProjectId=' +
        projectId +
        '&&DepartmentId=' +
        DepartmentId +
        '&&DateFrom=' +
        from +
        '&&DateTo=' +
        to +
        ''
    );
  }

  GetAllTasksByProjectIdS_withworkorder_paging(
    projectId: any,
    DepartmentId: any,
    from: string,
    to: string,
    Searchtext: any,
    page: any,
    pageSize: any
  ): Observable<any> {
    return this.http.get(
      this.apiEndPoint +
        'ProjectPhasesTasks/GetAllTasksByProjectIdS_withworkorder_paging?ProjectId=' +
        projectId +
        '&&DepartmentId=' +
        DepartmentId +
        '&&DateFrom=' +
        from +
        '&&DateTo=' +
        to +
        '&&Searchtext=' +
        Searchtext +
        '&&page=' +
        page +
        '&&pageSize=' +
        pageSize +
        ''
    );
  }

  FillProjectSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Project/FillProjectSelect');
  }
  //----------------------------------END---------------------------------------------------------------------------------

  //----------------تكلفة المشروع-------------------
  GetProjectsCostSearch(_projectVM: ProjectVM): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(_projectVM);
    return this.http.post(
      this.apiEndPoint + 'Project/GetProjectsSearch',
      body,
      { headers: headers }
    );
  }
  GetProjectsCostSearch_ByDate(from: string, to: string): Observable<any> {
    return this.http.get(
      this.apiEndPoint +
        'Project/GetAllProjectsByDateSearch?DateFrom=' +
        from +
        '&&DateTo=' +
        to +
        ''
    );
  }

  FillProjectTypeSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'ProjectType/FillProjectTypeSelect'
    );
  }
  FillCustomerSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Customer/FillCustomerSelect');
  }
  FillProjectSubTypesSelect(param: any) {
    var url = `${environment.apiEndPoint}ProjectSubTypes/FillProjectSubTypesSelect?param=${param}`;
    return this.http.get<any>(url);
  }
  //----------------------------------END------------------------------------------
}
