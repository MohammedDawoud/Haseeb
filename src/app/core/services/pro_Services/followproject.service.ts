import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ProjectVM } from 'src/app/core/Classes/ViewModels/projectVM';
import { FollowProj } from 'src/app/core/Classes/DomainObjects/followProj';

@Injectable({
  providedIn: 'root',
})
export class FollowprojectService {
  private apiEndPoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  GetAllProjectsWithCostE_CostS() {
    return this.http.get<any>(
      this.apiEndPoint + 'Project/GetAllProjectsWithCostE_CostS'
    );
  }
  GetAllProjectsWithoutCostE_CostS() {
    return this.http.get<any>(
      this.apiEndPoint + 'Project/GetAllProjectsWithoutCostE_CostS'
    );
  }
  GetProjectsSearch(_projectVM: ProjectVM): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(_projectVM);
    return this.http.post(
      this.apiEndPoint + 'Project/GetProjectsSearch',
      body,
      { headers: headers }
    );
  }

  GetProjectsSearch_paging(
    _projectVM: ProjectVM,
    SearchText: any,
    page: any,
    pageSize: any
  ): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(_projectVM);
    return this.http.post(
      this.apiEndPoint +
        'Project/GetProjectsSearch_paging?SearchText=' +
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

  FillCustomerSelectWProOnly() {
    return this.http.get<any>(
      this.apiEndPoint + 'Project/FillCustomerSelectWProOnly'
    );
  }
  FillAllUsersSelectAll() {
    return this.http.get<any>(
      this.apiEndPoint + 'ControllingTask/FillAllUsersSelectAll'
    );
  }
  FillSubAccountLoad() {
    return this.http.get<any>(this.apiEndPoint + 'Account/FillSubAccountLoad');
  }
  FillClausesSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Clauses/FillClausesSelect');
  }
  FillSuppliersSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'Suppliers/FillSuppliersSelect'
    );
  }
  FillCostCenterSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'CostCenter/FillCostCenterSelect'
    );
  }
  FillBankSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Banks/FillBankSelect');
  }
  GetMaxCosEManagerNameTOP1() {
    return this.http.get<any>(
      this.apiEndPoint + 'Project/GetMaxCosEManagerNameTOP1'
    );
  }
  GetMaxCosECustomerNameTOP1() {
    return this.http.get<any>(
      this.apiEndPoint + 'Project/GetMaxCosECustomerNameTOP1'
    );
  }
  GetMaxCosEManagerTOP10() {
    return this.http.get<any>(
      this.apiEndPoint + 'Project/GetMaxCosEManagerTOP10'
    );
  }

  FillSelectEmployee() {
    return this.http.get<any>(this.apiEndPoint + 'Employee/FillSelectEmployee');
  }
  GetEmployeeInfo(_employeeId: any) {
    var url = `${environment.apiEndPoint}Employee/GetEmployeeInfo?&EmployeeId=${_employeeId}`;
    return this.http.get<any>(url);
  }
  GetAllFollowProj(_projectId: any) {
    var url = `${environment.apiEndPoint}Project/GetAllFollowProj?&ProjectId=${_projectId}`;
    return this.http.get<any>(url);
  }

  SaveFollowProj(obj: any): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Project/SaveFollowProj', body, {
      headers: headers,
    });
  }
  GenerateVoucherNumber(_vouchertype: any) {
    var url = `${environment.apiEndPoint}Voucher/GenerateVoucherNumber?&Type=${_vouchertype}`;
    return this.http.get<any>(url);
  }
  GetCostCenterByProId(_projectId: any) {
    var url = `${environment.apiEndPoint}Project/GetCostCenterByProId?&ProjectId=${_projectId}`;
    return this.http.get<any>(url);
  }
  FillCustAccountsSelect2(_param: any) {
    var url = `${environment.apiEndPoint}Account/FillCustAccountsSelect2?&param=${_param}`;
    return this.http.get<any>(url);
  }
}
