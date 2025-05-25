import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjectPhasesTasksVM } from '../../Classes/ViewModels/projectPhasesTasksVM';

@Injectable({
  providedIn: 'root',
})
export class HomeServiceService {
  private apiEndPoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetAllLoansW2(SearchText: any, Status: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'Loan/GetAllLoansW2?SearchText=' +
        SearchText +
        '&&status=' +
        Status +
        ''
    );
  }

  GetAllLoanDetails(LoanId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Loan/GetAllLoanDetails?LoanId=' + LoanId + ''
    );
  }
  GetAmountPayedAndNotPayed(LoanId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Loan/GetAmountPayedAndNotPayed?LoanId=' + LoanId + ''
    );
  }

  GetAllLoans2() {
    return this.http.get<any>(
      this.apiEndPoint + 'Loan/GetAllLoans2?SearchText='
    );
  }
  GetAllVacations2() {
    return this.http.get<any>(
      this.apiEndPoint + 'Vacation/GetAllVacations2?SearchText='
    );
  }

  GetAllVacationsw2(SearchText: any, Status: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'Vacation/GetAllVacationsw2?SearchText=' +
        SearchText +
        '&&status=' +
        Status +
        ''
    );
  }
  GetAllVacationsw() {
    return this.http.get<any>(
      this.apiEndPoint + 'Vacation/GetAllVacationsw_Accepted?SearchText='
    );
  }
  GetCurrentEmployee() {
    return this.http.get<any>(this.apiEndPoint + 'Employee/GetCurrentEmployee');
  }
  GetLayoutReadyVm() {}

  GetDoneTasksDGV(FromDate: any, ToDate: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'MyTask/GetDoneTasksDGV?FromDate=' +
        FromDate +
        '&&ToDate=' +
        ToDate +
        ''
    );
  }

  GetEmpDoneWOsDGV(FromDate: any, ToDate: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'MyTask/GetEmpDoneWOsDGV?FromDate=' +
        FromDate +
        '&&ToDate=' +
        ToDate +
        ''
    );
  }

  GetInProgressProjectPhasesTasksHome_Search(
    projectph: ProjectPhasesTasksVM
  ): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(projectph);
    return this.http.post(
      this.apiEndPoint +
        'ProjectPhasesTasks/GetInProgressProjectPhasesTasksHome_SearchPost',
      body,
      { headers: headers }
    );
  }
  GetEmpUnderGoingWOsDGV(FromDate: any, ToDate: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'MyTask/GetEmpUnderGoingWOsDGV?FromDate=' +
        FromDate +
        '&&ToDate=' +
        ToDate +
        ''
    );
  }

  GetLateTasksByUserIdHome_Search(StartDate: any, ToDate: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'ProjectPhasesTasks/GetLateTasksByUserIdHome_Search?FromDate=' +
        StartDate +
        '&&ToDate=' +
        ToDate +
        ''
    );
  }

  GetEmpDelayedWOsDGV(FromDate: any, ToDate: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'MyTask/GetEmpDelayedWOsDGV?FromDate=' +
        FromDate +
        '&&ToDate=' +
        ToDate +
        ''
    );
  }

  GetAllSupervisionsByUserId() {
    return this.http.get<any>(
      this.apiEndPoint + 'Supervisions/GetAllSupervisionsByUserId'
    );
  }
  ReciveSuper(SupervisionId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'Supervisions/ReciveSuper?SupervisionId=' +
        SupervisionId +
        '',
      null
    );
  }
  NotReciveSuper(SupervisionId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'Supervisions/NotReciveSuper?SupervisionId=' +
        SupervisionId +
        '',
      null
    );
  }
  GetAllSupervisionDetailsBySuperId(SupervisionId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'Supervisions/GetAllSupervisionDetailsBySuperId?SupervisionId=' +
        SupervisionId +
        ''
    );
  }

  ReciveSuperDet(SupervisionId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'Supervisions/ReciveSuperDet?SuperDetId=' +
        SupervisionId +
        '',
      null
    );
  }

  NotReciveSuperDet(SuperDetId: any, Note: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'Supervisions/NotReciveSuperDet?SuperDetId=' +
        SuperDetId +
        '&&Note=' +
        Note +
        '',
      null
    );
  }

  TheNumberSuperDet(SuperDetId: any, Note: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'Supervisions/TheNumberSuperDet?SuperDetId=' +
        SuperDetId +
        '&&Note=' +
        Note +
        '',
      null
    );
  }

  TheLocationSuperDet(SuperDetId: any, Note: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'Supervisions/TheLocationSuperDet?SuperDetId=' +
        SuperDetId +
        '&&Note=' +
        Note +
        '',
      null
    );
  }

  NotFoundSuperDet(SuperDetId: any, Note: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'Supervisions/NotFoundSuperDet?SuperDetId=' +
        SuperDetId +
        '&&Note=' +
        Note +
        '',
      null
    );
  }

  UploadImageSuperDet(form: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'Supervisions/UploadImageSuperDet',
      form
    );
  }
  OutlineChangeSave(
    SupervisionId: any,
    OutlineChangetxt1: any,
    OutlineChangetxt2: any,
    OutlineChangetxt3: any
  ) {
    return this.http.post<any>(
      this.apiEndPoint +
        'Supervisions/OutlineChangeSave?SupervisionId=' +
        SupervisionId +
        '&&OutlineChangetxt1=' +
        OutlineChangetxt1 +
        '&&OutlineChangetxt2=' +
        OutlineChangetxt2 +
        '&&OutlineChangetxt3=' +
        OutlineChangetxt3 +
        '',
      null
    );
  }
  PointsNotWrittenSave(
    SupervisionId: any,
    PointsNotWrittentxt1: any,
    PointsNotWrittentxt2: any,
    PointsNotWrittentxt3: any
  ) {
    return this.http.post<any>(
      this.apiEndPoint +
        'Supervisions/PointsNotWrittenSave?SupervisionId=' +
        SupervisionId +
        '&&PointsNotWrittentxt1=' +
        PointsNotWrittentxt1 +
        '&&PointsNotWrittentxt2=' +
        PointsNotWrittentxt2 +
        '&&PointsNotWrittentxt3=' +
        PointsNotWrittentxt3 +
        '',
      null
    );
  }
  GetNewTasksByUserId(PorjectId: any, AllStatusExptEnd: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'ProjectPhasesTasks/GetNewTasksByUserId?PorjectId=' +
        PorjectId +
        '&&AllStatusExptEnd=' +
        AllStatusExptEnd +
        ''
    );
  }
  GetNewTasksByUserId2(PorjectId: any, CustomerId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'ProjectPhasesTasks/GetNewTasksByUserId2?PorjectId=' +
        PorjectId +
        '&&CustomerId=' +
        CustomerId +
        ''
    );
  }

  GetNewTasksByUserId2_Paging(
    PorjectId: any,
    CustomerId: any,
    Searchtext: any,
    page: any,
    pageSize: any
  ) {
    return this.http.get<any>(
      this.apiEndPoint +
        'ProjectPhasesTasks/GetNewTasksByUserId2_Paging?PorjectId=' +
        PorjectId +
        '&&CustomerId=' +
        CustomerId +
        '&&Searchtext=' +
        Searchtext +
        '&&page=' +
        page +
        '&&pageSize=' +
        pageSize +
        ''
    );
  }
  GetLateTasksByUserIdHome(EndDateP: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'ProjectPhasesTasks/GetLateTasksByUserIdHome?EndDateP=' +
        EndDateP +
        ''
    );
  }
  GetLateTasksByUserIdHomeFilterd(PorjectId: any, CustomerId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'ProjectPhasesTasks/GetLateTasksByUserIdHomeFilterd?PorjectId=' +
        PorjectId +
        '&&CustomerId=' +
        CustomerId +
        ''
    );
  }

  GetLateTasksByUserIdHomeFilterd_paging(
    PorjectId: any,
    CustomerId: any,
    Searchtext: any,
    page: any,
    pageSize: any
  ) {
    return this.http.get<any>(
      this.apiEndPoint +
        'ProjectPhasesTasks/GetLateTasksByUserIdHomeFilterd_paging?PorjectId=' +
        PorjectId +
        '&&CustomerId=' +
        CustomerId +
        '&&Searchtext=' +
        Searchtext +
        '&&page=' +
        page +
        '&&pageSize=' +
        pageSize +
        ''
    );
  }
  GetLateWorkOrdersByUserId(EndDateP: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'WorkOrders/GetLateWorkOrdersByUserId?EndDateP=' +
        EndDateP +
        ''
    );
  }

  GetLateWorkOrdersByUserIdFilterd(
    EndDateP: any,
    CustomerId: any,
    ProjectId: any
  ) {
    return this.http.get<any>(
      this.apiEndPoint +
        'WorkOrders/GetLateWorkOrdersByUserIdFilterd?EndDateP=' +
        EndDateP +
        '&&CustomerId=' +
        CustomerId +
        '&&ProjectId=' +
        ProjectId +
        ''
    );
  }

  GetLateWorkOrdersByUserIdFilterd_paging(
    EndDateP: any,
    CustomerId: any,
    ProjectId: any,
    Searchtext: any,
    page: any,
    pageSize: any
  ) {
    return this.http.get<any>(
      this.apiEndPoint +
        'WorkOrders/GetLateWorkOrdersByUserIdFilterd_paging?EndDateP=' +
        EndDateP +
        '&&CustomerId=' +
        CustomerId +
        '&&ProjectId=' +
        ProjectId +
        '&&Searchtext=' +
        Searchtext +
        '&&page=' +
        page +
        '&&pageSize=' +
        pageSize +
        ''
    );
  }

  GetNewWorkOrdersByUserId(EndDateP: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'WorkOrders/GetNewWorkOrdersByUserId?EndDateP=' +
        EndDateP +
        ''
    );
  }
  GetNewWorkOrdersByUserIdFilterd(
    EndDateP: any,
    CustomerId: any,
    ProjectId: any
  ) {
    return this.http.get<any>(
      this.apiEndPoint +
        'WorkOrders/GetNewWorkOrdersByUserIdFilterd?EndDateP=' +
        EndDateP +
        '&&CustomerId=' +
        CustomerId +
        '&&ProjectId=' +
        ProjectId +
        ''
    );
  }

  GetNewWorkOrdersByUserIdFilterd_paging(
    EndDateP: any,
    CustomerId: any,
    ProjectId: any,
    Searchtext: any,
    page: any,
    pageSize: any
  ) {
    return this.http.get<any>(
      this.apiEndPoint +
        'WorkOrders/GetNewWorkOrdersByUserIdFilterd_paging?EndDateP=' +
        EndDateP +
        '&&CustomerId=' +
        CustomerId +
        '&&ProjectId=' +
        ProjectId +
        '&&Searchtext=' +
        Searchtext +
        '&&page=' +
        page +
        '&&pageSize=' +
        pageSize +
        ''
    );
  }

  GetUserStatistics() {
    return this.http.get<any>(this.apiEndPoint + 'Home/GetUserStatistics');
  }
  GetUserStatisticsPercentData() {
    return this.http.get<any>(
      this.apiEndPoint + 'Home/GetUserStatisticsPercentData'
    );
  }
  GetAllUserCustodiesStatistics() {
    return this.http.get<any>(
      this.apiEndPoint + 'Home/GetAllUserCustodiesStatistics'
    );
  }

  GetTaskById(TaskId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'ProjectPhasesTasks/GetTaskById?TaskId=' + TaskId + ''
    );
  }

  GetUserById(UserId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Users/GetUserById?UserId=' + UserId + ''
    );
  }
  GetCurrentUserById() {
    return this.http.get<any>(this.apiEndPoint + 'Users/GetCurrentUserById');
  }
  GetNotificationReceived() {
    return this.http.get<any>(
      this.apiEndPoint + 'Notification/GetNotificationReceived'
    );
  }
  ReadNotification(NotiID: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'Notification/ReadNotification?NotiID=' + NotiID + '',
      null
    );
  }

  SetNotificationStatus(NotiID: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'Notification/SetNotificationStatus?NotiID=' +
        NotiID +
        '',
      null
    );
  }
  SetNotificationStatus2(ObjIDs: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(ObjIDs);
    return this.http.post(
      this.apiEndPoint + 'Notification/SetNotificationStatus2',
      body,
      { headers: headers }
    );
  }
  NotificationsSent2() {
    return this.http.get<any>(
      this.apiEndPoint + 'Notification/NotificationsSent2'
    );
  }
  GetAllUsersNotOpenUser() {
    return this.http.get<any>(
      this.apiEndPoint + 'Users/GetAllUsersNotOpenUser'
    );
  }
  FillProjectSelectByCustomerIdNotifaction() {
    return this.http.get<any>(
      this.apiEndPoint + 'Project/FillProjectSelectByCustomerIdNotifaction'
    );
  }
  SaveNotification2(form: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'Notification/SaveNotificationwithfile',
      form
    );
  }
  GetStatisticsCount() {
    return this.http.get<any>(
      this.apiEndPoint + 'Statistics/GetStatisticsCount'
    );
  }

  GetProjectDataRE(ProjectId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'FullProjectsReport/GetProjectDataRE?ProjectId=' +
        ProjectId +
        ''
    );
  }

  GetProjectsSearch(projectvm: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(projectvm);
    return this.http.post(
      this.apiEndPoint + 'Project/GetProjectsSearch',
      body,
      { headers: headers }
    );
  }

  GetAllProjectsNew_DashBoard(projectvm: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(projectvm);
    return this.http.post(
      this.apiEndPoint + 'Project/GetAllProjectsNew_DashBoard',
      body,
      { headers: headers }
    );
  }

  GetAllProjectsNew_DashBoard_Paging(
    projectvm: any,
    SearchText: any,
    page: any,
    pageSize: any
  ): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(projectvm);
    return this.http.post(
      this.apiEndPoint +
        'Project/GetAllProjectsNew_DashBoard_Paging?SearchText=' +
        SearchText +
        '&&page=' +
        page +
        '&&pageSize=' +
        pageSize +
        '',
      body,
      { headers: headers }
    );
  }

  GetProjectByIdSomeData(ProjectId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'Project/GetProjectByIdSomeData?ProjectId=' +
        ProjectId +
        ''
    );
  }

  //dawouf service add
  //-------------------------------------------------------------------------------------
  GetFinancialfollowup(obj: any) {
    return this.http.post<any>(
      `${this.apiEndPoint}Voucher/GetFinancialfollowup`,
      obj
    );
  }

  GetFinancialfollowup_pageing(obj: any) {
    return this.http.post<any>(
      `${this.apiEndPoint}Voucher/GetFinancialfollowup_pageing`,
      obj
    );
  }
  FillSuppliersSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'Suppliers/FillSuppliersSelect'
    );
  }
  GetDetailedRevenuCount() {
    return this.http.get<any>(
      this.apiEndPoint + 'Account/GetDetailedRevenuCount'
    );
  }
  GetDetailedExpensesdCount() {
    return this.http.get<any>(
      this.apiEndPoint + 'Account/GetDetailedExpensesdCount'
    );
  }
  GetBoxNetCount() {
    return this.http.get<any>(this.apiEndPoint + 'Account/GetBoxNetCount');
  }
  GetBankNetCount() {
    return this.http.get<any>(this.apiEndPoint + 'Account/GetBankNetCount');
  }
  //-------------------------------------------------------------------------------------
  GetInProgressProjectPhasesTasks_Branches(CustomerId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'ProjectPhasesTasks/GetInProgressProjectPhasesTasks_BranchesFilterd?CustomerId=' +
        CustomerId +
        ''
    );
  }
  GetInProgressProjectPhasesTasks_Branches_paging(
    CustomerId: any,
    Searchtext: any,
    page: any,
    pageSize: any
  ) {
    return this.http.get<any>(
      this.apiEndPoint +
        'ProjectPhasesTasks/GetInProgressProjectPhasesTasks_BranchesFilterd_paging?CustomerId=' +
        CustomerId +
        '&&Searchtext=' +
        Searchtext +
        '&&page=' +
        page +
        '&&pageSize=' +
        pageSize +
        ''
    );
  }
  GetPhaseTaskData(PhaseId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'FullProjectsReport/GetPhaseTaskData?PhaseId=' +
        PhaseId +
        ''
    );
  }
  GetAllWorkOrders(CustomerId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'WorkOrders/GetAllWorkOrdersFilterd?CustomerId=' +
        CustomerId +
        ''
    );
  }

  GetAllWorkOrders_Paging(
    CustomerId: any,
    Searchtext: any,
    page: any,
    pageSize: any
  ) {
    return this.http.get<any>(
      this.apiEndPoint +
        'WorkOrders/GetAllWorkOrdersFilterd_Paging?CustomerId=' +
        CustomerId +
        '&&Searchtext=' +
        Searchtext +
        '&&page=' +
        page +
        '&&pageSize=' +
        pageSize +
        ''
    );
  }

  GetAllProjectRequirementByTaskId(PhasesTaskID: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'ProjectRequirements/GetAllProjectRequirementByTaskId?PhasesTaskID=' +
        PhasesTaskID +
        ''
    );
  }

  GetAllProjectRequirementByOrderId(OrderId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'ProjectRequirements/GetAllProjectRequirementByOrderId?OrderId=' +
        OrderId +
        ''
    );
  }
  GetProjectRequirementByTaskId_Count(TaskId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'ProjectRequirements/GetProjectRequirementByTaskId_Count?TaskId=' +
        TaskId +
        ''
    );
  }
  GetProjectRequirementByOrderId_Count(Orderid: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'ProjectRequirements/GetProjectRequirementByOrderId_Count?Orderid=' +
        Orderid +
        ''
    );
  }
  ////////////////////////////region employee management///////////////////////////////////
  GetResDencesAbouutToExpire(DepartmentId: any, Issort: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'ResdencesAboutToExpire/GetResDencesAbouutToExpire?DepartmentId=' +
        DepartmentId +
        '&&Issort=' +
        Issort +
        ''
    );
  }

  GetResDencesAbouutToExpire_paging(
    DepartmentId: any,
    Issort: any,
    SearchText: any,
    page: any,
    pageSize: any
  ) {
    debugger;
    return this.http.get<any>(
      this.apiEndPoint +
        'ResdencesAboutToExpire/GetResDencesAbouutToExpire_paging?DepartmentId=' +
        DepartmentId +
        '&&SearchText=' +
        SearchText +
        '&&page=' +
        page +
        '&&pageSize=' +
        pageSize +
        '&&Issort=' +
        Issort +
        ''
    );
  }

  GetResDencesExpired(DepartmentId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'ResdencesExpired/GetResDencesExpired?DepartmentId=' +
        DepartmentId +
        ''
    );
  }

  GetResDencesExpired_paging(
    DepartmentId: any,
    SearchText: any,
    page: any,
    pageSize: any
  ) {
    return this.http.get<any>(
      this.apiEndPoint +
        'ResdencesExpired/GetResDencesExpired_paging?DepartmentId=' +
        DepartmentId +
        '&&SearchText=' +
        SearchText +
        '&&page=' +
        page +
        '&&pageSize=' +
        pageSize +
        ''
    );
  }
  GetOfficialDocsAboutToExpire(DepartmentId: any, Issort: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'OfficialDocsAboutToExpire/GetOfficialDocsAboutToExpire?DepartmentId=' +
        DepartmentId +
        '&&Issort=' +
        Issort +
        ''
    );
  }

  GetOfficialDocsAboutToExpire_paging(
    DepartmentId: any,
    Issort: any,
    SearchText: any,
    page: any,
    pageSize: any
  ) {
    return this.http.get<any>(
      this.apiEndPoint +
        'OfficialDocsAboutToExpire/GetOfficialDocsAboutToExpire_paging?DepartmentId=' +
        DepartmentId +
        '&&SearchText=' +
        SearchText +
        '&&page=' +
        page +
        '&&pageSize=' +
        pageSize +
        '&&Issort=' +
        Issort +
        ''
    );
  }
  GetOfficialDocsExpired(DepartmentId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'OfficialDocsExpired/GetOfficialDocsExpired?DepartmentId=' +
        DepartmentId +
        ''
    );
  }

  GetOfficialDocsExpired_paging(
    DepartmentId: any,
    SearchText: any,
    page: any,
    pageSize: any
  ) {
    return this.http.get<any>(
      this.apiEndPoint +
        'OfficialDocsExpired/GetOfficialDocsExpired_paging?DepartmentId=' +
        DepartmentId +
        '&&SearchText=' +
        SearchText +
        '&&page=' +
        page +
        '&&pageSize=' +
        pageSize +
        ''
    );
  }
  GetEmpContractsAboutToExpire(DepartmentId: any, Issort: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'EmpContracts/GetEmpContractsAboutToExpire?DepartmentId=' +
        DepartmentId +
        '&&Issort=' +
        Issort +
        ''
    );
  }

  GetEmpContractsAboutToExpire_paging(
    DepartmentId: any,
    Issort: any,
    SearchText: any,
    page: any,
    pageSize: any
  ) {
    return this.http.get<any>(
      this.apiEndPoint +
        'EmpContracts/GetEmpContractsAboutToExpire_paging?DepartmentId=' +
        DepartmentId +
        '&&SearchText=' +
        SearchText +
        '&&page=' +
        page +
        '&&pageSize=' +
        pageSize +
        '&&Issort=' +
        Issort +
        ''
    );
  }

  GetEmpContractsExpired(DepartmentId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'EmpContracts/GetEmpContractsExpired?DepartmentId=' +
        DepartmentId +
        ''
    );
  }

  GetEmpContractsExpired_paging(
    DepartmentId: any,
    SearchText: any,
    page: any,
    pageSize: any
  ) {
    return this.http.get<any>(
      this.apiEndPoint +
        'EmpContracts/GetEmpContractsExpired_paging?DepartmentId=' +
        DepartmentId +
        '&&SearchText=' +
        SearchText +
        '&&page=' +
        page +
        '&&pageSize=' +
        pageSize +
        ''
    );
  }

  GetEmployeesWithoutContract(DepartmentId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'Employee/GetEmployeesWithoutContract?DepartmentId=' +
        DepartmentId +
        ''
    );
  }

  GetEmployeesWithoutContract_paging(
    DepartmentId: any,
    SearchText: any,
    page: any,
    pageSize: any
  ) {
    return this.http.get<any>(
      this.apiEndPoint +
        'Employee/GetEmployeesWithoutContract_paging?DepartmentId=' +
        DepartmentId +
        '&&SearchText=' +
        SearchText +
        '&&page=' +
        page +
        '&&pageSize=' +
        pageSize +
        ''
    );
  }
  CheckLoan(VacationId: any, Type: any, Reason: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'vacation/CheckLoan?VacationId=' +
        VacationId +
        '&&Type=' +
        Type +
        '&&Reason=' +
        Reason +
        '',
      null
    );
  }

  UpdateVacation(VacationId: any, Type: any, Reason: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'vacation/UpdateVacation?VacationId=' +
        VacationId +
        '&&Type=' +
        Type +
        '&&Reason=' +
        Reason +
        '',
      null
    );
  }
  UpdateStatus(ImprestId: any, Type: any, Reason: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'Loan/UpdateStatus?ImprestId=' +
        ImprestId +
        '&&Type=' +
        Type +
        '&&Reason=' +
        Reason +
        '',
      null
    );
  }

  ActiveYear() {
    return this.http.get<any>(this.apiEndPoint + 'Home/ActiveYear');
  }

  GetHostingExpireAlert() {
    return this.http.get<any>(this.apiEndPoint + 'Home/GetHostingExpireAlert');
  }
}
