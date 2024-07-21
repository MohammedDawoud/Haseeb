import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EmpContractVM } from '../../Classes/ViewModels/empContractVM';
import { Observable } from 'rxjs';
import { EmpContract } from '../../Classes/DomainObjects/empContract';
import { ReasonLeave } from '../../Classes/DomainObjects/reasonLeave';
import { EmpSalaryPartsVM } from '../../Classes/ViewModels/empSalaryPartsVM';
import { EndWorkPrintVM } from '../../Classes/ViewModels/EndWorkPrintVM';

@Injectable({
  providedIn: 'root',
})
export class EmpContractService {
  private apiEndPoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetAllEmpContractSearch(Search: EmpContractVM): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(Search);
    return this.http.post(
      this.apiEndPoint + 'EmpContracts/GetAllEmpContractSearch',
      body,
      { headers: headers }
    );
  }

  FillSelectEmployee() {
    return this.http.get<any>(this.apiEndPoint + 'Employee/FillSelectEmployee');
  }

  FillSelectEmployee2() {
    return this.http.get<any>(
      this.apiEndPoint +
        'Employee/FillEmployeeSelect?EmpId=&&IsNewContract=true'
    );
  }
  FillSelectEmployee3() {
    return this.http.get<any>(this.apiEndPoint + 'Employee/FillEmployeeSelect');
  }

  FillBranchSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Branches/FillBranchSelect');
  }
  GetBranchOrganization() {
    return this.http.get<any>(
      this.apiEndPoint + 'Organizations/GetBranchOrganization'
    );
  }
  SaveEmpContract(data: EmpContract): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(data);
    return this.http.post(
      this.apiEndPoint + 'EmpContracts/SaveEmpContract',
      body,
      { headers: headers }
    );
  }

  SaveSalaryParts(data: EmpSalaryPartsVM): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(data);
    return this.http.post(
      this.apiEndPoint + 'Allowance/SaveSalaryParts',
      body,
      { headers: headers }
    );
  }

  BeginNewEmployeeWork(Search: EmpContract): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(Search);
    return this.http.post(
      this.apiEndPoint + 'EmpContracts/BeginNewEmployeeWork',
      body,
      { headers: headers }
    );
  }
  DeleteEmployee(ContractId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'EmpContracts/DeleteEmployee?ContractId=' +
        ContractId +
        '',
      null
    );
  }
  GetEmployeeJobName(EmpId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Employee/GetEmployeeJobName?EmpId=' + EmpId + ''
    );
  }
  GetEmployeeJobName2(EmpId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Employee/GetEmployeeJobName?EmpId=' + EmpId + ''
    );
  }

  //reason leave

  GetAllreasons(SearchText: any) {
    debugger;
    if (SearchText != null && SearchText != undefined && SearchText != '') {
      return this.http.get<any>(
        this.apiEndPoint +
          'EmpContracts/GetAllreasons?SearchText=' +
          SearchText +
          ''
      );
    } else {
      return this.http.get<any>(
        this.apiEndPoint + 'EmpContracts/GetAllreasons?SearchText='
      );
    }
  }

  SaveReason(reasonLeave: ReasonLeave): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(reasonLeave);
    return this.http.post(this.apiEndPoint + 'EmpContracts/SaveReason', body, {
      headers: headers,
    });
  }

  DeleteReason(ReasonId: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'EmpContracts/DeleteReason?ReasonId=' + ReasonId + '',
      null
    );
  }
  FillReasonSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'EmpContracts/FillReasonSelect'
    );
  }

  GetEmpdatatoendwork(Search: EmpContract): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(Search);
    return this.http.post(
      this.apiEndPoint + 'EmpContracts/GetEmpdatatoendwork',
      body,
      { headers: headers }
    );
  }

  EndWorkforAnEmployee(
    Search: EmpContract,
    Duration: any,
    Reason: any
  ): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(Search);
    return this.http.post(
      this.apiEndPoint +
        'EmpContracts/EndWorkforAnEmployee?Reason=' +
        Reason +
        '&&Duration=' +
        Duration +
        '',
      body,
      { headers: headers }
    );
  }
  EndWorkforAnEmployeeQuaContract(
    EmpId: any,
    Duration: any,
    Reason: any
  ): Observable<any> {
    debugger;

    return this.http.post(
      this.apiEndPoint +
        'EmpContracts/EndWorkforAnEmployeeQuaContract?EmpId=' +
        EmpId +
        '&&Reason=' +
        Reason +
        '&&Duration=' +
        Duration +
        '',
      null
    );
  }

  GenerateEmpContractNumber() {
    return this.http.get<any>(
      this.apiEndPoint + 'EmpContracts/GenerateEmpContractNumber'
    );
  }

  GetSalaryParts(EmpId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Allowance/GetSalaryParts?EmpId=' + EmpId + ''
    );
  }

  PrintEmpEndWork(Search: EndWorkPrintVM): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(Search);
    return this.http.post(
      this.apiEndPoint + 'EmpContracts/PrintEmpEndWork',
      body,
      { headers: headers }
    );
  }

  PrintEmpContractReport(ContractId: any): Observable<any> {
    debugger;

    return this.http.post(
      this.apiEndPoint +
        'EmpContracts/PrintEmpContractReport?ContractId=' +
        ContractId +
        '',
      null
    );
  }
}
