import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EmployeesVM } from '../../Classes/ViewModels/employeesVM';
import { Observable } from 'rxjs';
import { ExportationService } from '../exportation-service/exportation.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeePayrollmarchesserviceService {
  private apiEndPoint: string = '';
  constructor(
    private http: HttpClient,
    private exportationService: ExportationService
  ) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetAllEmployeeSearch(Search: EmployeesVM): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(Search);
    return this.http.post(
      this.apiEndPoint + 'Employee/GetAllEmployeeSearchNew',
      body,
      { headers: headers }
    );
  }

  FillBranchSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Branches/FillBranchSelect');
  }
  
  GetCurrentYear() {
    return this.http.get<any>(this.apiEndPoint + 'Employee/GetCurrentYear');
  }

  GetEmpPayrollMarches(Search: EmployeesVM): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(Search);
    return this.http.post(
      this.apiEndPoint + 'Employee/GetEmpPayrollMarchescvs',
      body,
      { headers: headers }
    );
  }

  PostEmpPayroll(payrollId: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(payrollId);
    return this.http.post(this.apiEndPoint + 'Employee/PostEmpPayroll', body, {
      headers: headers,
    });
  }

  PostEmpPayroll_Back(payrollId: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(payrollId);
    return this.http.post(
      this.apiEndPoint + 'Employee/PostEmpPayroll_Back',
      body,
      { headers: headers }
    );
  }

  GetSalaryParts(EmpId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Allowance/GetSalaryParts?EmpId=' + EmpId + ''
    );
  }

  GetAllDiscountRewards(EmpId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'DiscountReward/GetAllDiscountRewards?EmpId=' +
        EmpId +
        '&&SearchText='
    );
  }
  GetAllAllowances(EmpId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'Allowance/GetAllAllowances?EmpId=' +
        EmpId +
        '&&SearchText='
    );
  }

  GetAllLoansE(EmpId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Loan/GetAllLoansE?EmpId=' + EmpId + '&&SearchText='
    );
  }

  FillAllowanceTypeSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'AllowanceType/FillAllowanceTypeSelect'
    );
  }

  PostEmployeeCheckBox(payrollid: any) {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(payrollid);
    return this.http.post(
      this.apiEndPoint + 'Employee/PostEmployeeCheckBox',
      body,
      { headers: headers }
    );
  }

  PrintEmployeesSalaryReport2(EmployeesVM: EmployeesVM) {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(EmployeesVM);
    return this.http.post(
      this.apiEndPoint + 'Employee/PrintEmployeesSalaryReport2',
      body,
      {
        headers: headers,
      }
    );
  }

  customExportExcel(dataExport: any, nameExport: any) {
    let exportation = JSON.parse(JSON.stringify(dataExport));
    let itemsToExeclude: string[] = [];

    let excelData: any[] = [];
    let headers: string[] = [];
    let objectKeys = Object.keys(dataExport[0]);
    objectKeys = objectKeys.filter(
      (item: string) => !itemsToExeclude.includes(item)
    );

    objectKeys.forEach((element) => {
      headers.push(element.toUpperCase());
    });

    exportation.forEach((ele: any) => {
      // ele = (ele) => {
      var sorted: any = {},
        key,
        a = [];

      for (key in ele) {
        if (ele.hasOwnProperty(key)) {
          a.push(key);
        }
      }
      a = a.filter((item: string) => !itemsToExeclude.includes(item));

      // a.sort();

      for (key = 0; key < a.length; key++) {
        sorted[a[key]] = ele[a[key]];
      }
      // return sorted;
      ele = sorted;
      // }
      let props = Object.getOwnPropertyNames(ele).filter((prop) =>
        exportation.some((ex: any) => ex === prop)
      );
      props.forEach((pp) => {
        delete ele[pp];
      });

      excelData.push(ele);
    });

    this.exportationService.exportExcel(
      excelData,
      nameExport + new Date().getTime(),
      headers
    );
  }
}
