import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Nationality } from '../../Classes/DomainObjects/nationality';
import { Observable } from 'rxjs';
import { Job } from '../../Classes/DomainObjects/job';
import { Department } from '../../Classes/DomainObjects/department';
import { City } from '../../Classes/DomainObjects/city';
import { Employees } from '../../Classes/DomainObjects/employees';
import { VacationType } from '../../Classes/DomainObjects/vacationType';
import { DiscountReward } from '../../Classes/DomainObjects/discountReward';
import { AllowanceType } from '../../Classes/DomainObjects/allowanceType';
import { Allowance } from '../../Classes/DomainObjects/allowance';
import { Loan } from '../../Classes/DomainObjects/loan';
import { EmployeesVM } from '../../Classes/ViewModels/employeesVM';

@Injectable({
  providedIn: 'root',
})
export class EmployeesServiceService {
  private apiEndPoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  GetAllEmployees() {
    return this.http.get<any>(this.apiEndPoint + 'Employee/GetAllEmployees');
  }
  GetContractByEmpId(EmpId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'EmpContracts/GetContractByEmpId?EmpId=' + EmpId + ''
    );
  }
  SearchEmployees(EmployeesSearch: EmployeesVM): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(EmployeesSearch);
    return this.http.post(this.apiEndPoint + 'Employee/SearchEmployees', body, {
      headers: headers,
    });
  }
  SaveEmployee(form: any) {
    debugger;
    return this.http.post<any>(
      this.apiEndPoint + 'Employee/SaveEmployee',
      form
    );
  }

  DeleteEmployee(EmployeeId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'Employee/DeleteEmployee?EmployeeId=' +
        EmployeeId +
        '',
      null
    );
  }

  GetEmployeeStatistics() {
    return this.http.get<any>(
      this.apiEndPoint + 'Employee/GetEmployeeStatistics'
    );
  }
  GetUserById(UserId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Users/GetUserById?UserId=' + UserId + ''
    );
  }

  SaveOfficialDocuments(OffDoc: Employees): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(OffDoc);
    return this.http.post(
      this.apiEndPoint + 'Employee/SaveOfficialDocuments',
      body,
      { headers: headers }
    );
  }

  GetAllAttachments(EmpId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Attachment/GetAllAttachments2?EmpId=' + EmpId + ''
    );
  }

  SaveAttachment2(form: any) {
    debugger;
    return this.http.post<any>(
      this.apiEndPoint + 'Employee/SaveAttachment',
      form
    );
  }

  SaveAttachment(form: any) {
    debugger;
    return this.http.post<any>(
      this.apiEndPoint + 'Attachment/SaveAttachment',
      form
    );
  }
  DeleteAttachment(AttachmentId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'Attachment/DeleteAttachment?AttachmentId=' +
        AttachmentId +
        '',
      null
    );
  }

  FillAllUsersSelectAll() {
    return this.http.get<any>(
      this.apiEndPoint + 'ControllingTask/FillAllUsersSelectAll'
    );
  }

  FillNationalitySelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'Nationality/FillNationalitySelect'
    );
  }
  FillJobSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Job/FillJobSelect');
  }
  FillDepartmentSelectByType() {
    return this.http.get<any>(
      this.apiEndPoint + 'Department/FillDepartmentSelectByType?param=1'
    );
  }

  FillBranchSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Branches/FillBranchSelect');
  }

  FillCitySelect() {
    return this.http.get<any>(this.apiEndPoint + 'City/FillCitySelect');
  }

  FillAttendanceTimeSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'AttendaceTime/FillAttendanceTimeSelect'
    );
  }

  FillBankSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Banks/FillBankSelect');
  }
  FillVacationTypeSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'VacationType/FillVacationTypeSelect'
    );
  }

  FillAllowanceTypeSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'AllowanceType/FillAllowanceTypeSelect'
    );
  }

  FillEmployeeSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Employee/FillEmployeeSelect');
  }

  // Crud Operations
  GetAllNationalities() {
    return this.http.get<any>(
      this.apiEndPoint + 'Nationality/GetAllNationalities2'
    );
  }

  SaveNationality(nationality: Nationality): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(nationality);
    return this.http.post(
      this.apiEndPoint + 'Nationality/SaveNationality',
      body,
      { headers: headers }
    );
  }
  DeleteNationality(NationalityId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'Nationality/DeleteNationality?NationalityId=' +
        NationalityId +
        '',
      null
    );
  }
  //jobs Crud Operations

  GetAllJobs() {
    return this.http.get<any>(this.apiEndPoint + 'Job/GetAllJobs2');
  }

  SaveJob(job: Job): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(job);
    return this.http.post(this.apiEndPoint + 'Job/SaveJob', body, {
      headers: headers,
    });
  }
  DeleteJob(JobId: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'Job/DeleteJob?JobId=' + JobId + '',
      null
    );
  }

  //Department Crud Operations

  GetAllDepartmentbyType() {
    return this.http.get<any>(
      this.apiEndPoint + 'Department/GetAllDepartmentbyType2?Type=1'
    );
  }

  SaveDepartment(department: Department): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(department);
    return this.http.post(
      this.apiEndPoint + 'Department/SaveDepartment',
      body,
      { headers: headers }
    );
  }
  DeleteDepartment(DepartmentId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'Department/DeleteDepartment?DepartmentId=' +
        DepartmentId +
        '',
      null
    );
  }

  //city crud Operations

  GetAllCities() {
    return this.http.get<any>(this.apiEndPoint + 'City/GetAllCities2');
  }

  SaveCity(city: City): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(city);
    return this.http.post(this.apiEndPoint + 'City/SaveCity', body, {
      headers: headers,
    });
  }
  DeleteCity(CityId: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'City/DeleteCity?CityId=' + CityId + '',
      null
    );
  }
  //VacationType Crud Operations

  GetAllVacationsTypes() {
    return this.http.get<any>(
      this.apiEndPoint + 'VacationType/GetAllVacationsTypes2'
    );
  }
  SaveVacationType(vacationType: VacationType): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(vacationType);
    return this.http.post(
      this.apiEndPoint + 'VacationType/SaveVacationType',
      body,
      { headers: headers }
    );
  }
  DeleteVacationType(VacationTypeId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'VacationType/DeleteVacationType?VacationTypeId=' +
        VacationTypeId +
        '',
      null
    );
  }
  //vacation
  GetAllVacations(EmpId: any, search: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'Vacation/GetAllVacations?EmpId=' +
        EmpId +
        '&&SearchText='
    );
  }

  GetAllVacationsArchived(EmpId: any, search: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'Vacation/GetAllVacationsArchived?EmpId=' +
        EmpId +
        '&&SearchText='
    );
  }
  //Discount Reward
  GetAllDiscountRewards(EmpId: any, search: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'DiscountReward/GetAllDiscountRewards?EmpId=' +
        EmpId +
        '&&SearchText='
    );
  }
  SaveDiscountReward(discountReward: DiscountReward): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(discountReward);
    return this.http.post(
      this.apiEndPoint + 'DiscountReward/SaveDiscountReward',
      body,
      { headers: headers }
    );
  }

  DeleteDiscountReward(DiscountRewardId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'DiscountReward/DeleteDiscountReward?DiscountRewardId=' +
        DiscountRewardId +
        '',
      null
    );
  }

  //AllAllowancesTypes
  GetAllAllowancesTypes(search: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'AllowanceType/GetAllAllowancesTypes?SearchText='
    );
  }
  SaveAllowanceType(allowanceType: AllowanceType): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(allowanceType);
    return this.http.post(
      this.apiEndPoint + 'AllowanceType/SaveAllowanceType',
      body,
      { headers: headers }
    );
  }

  DeleteAllowanceType(AllowanceTypeId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'AllowanceType/DeleteAllowanceType?AllowanceTypeId=' +
        AllowanceTypeId +
        '',
      null
    );
  }

  //Allowance
  GetAllAllowances(EmpId: any, search: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'Allowance/GetAllAllowances?EmpId=' +
        EmpId +
        '&&SearchText='
    );
  }
  SaveAllowance(allowance: Allowance): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(allowance);
    return this.http.post(this.apiEndPoint + 'Allowance/SaveAllowance', body, {
      headers: headers,
    });
  }

  DeleteAllowance(AllowanceId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'Allowance/DeleteAllowance?AllowanceId=' +
        AllowanceId +
        '',
      null
    );
  }

  //Loans

  GetAllLoansE(EmpId: any, search: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Loan/GetAllLoansE?EmpId=' + EmpId + '&&SearchText='
    );
  }
  GetAllLoanDetails(LoanId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Loan/GetAllLoanDetails?LoanId=' + LoanId + ''
    );
  }

  SaveLoan2(loan: Loan): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(loan);
    return this.http.post(this.apiEndPoint + 'Loan/SaveLoan2', body, {
      headers: headers,
    });
  }
  DeleteLoan(LoanId: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'Loan/DeleteLoan?LoanId=' + LoanId + '',
      null
    );
  }

  GenerateNextEmpNumber() {
    return this.http.get<any>(
      this.apiEndPoint + 'Employee/GenerateNextEmpNumber'
    );
  }

  CheckifCodeIsExist(empCode: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'Employee/CheckifCodeIsExist?empCode=' + empCode + '',
      null
    );
  }
  PrintEmployeeIdentityReports(EmpId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'Employee/PrintEmployeeIdentityReports?EmpId=' +
        EmpId +
        ''
    );
  }

  GetHijriDate(date: Date, url: any) {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(date);

    return this.http.post<any>(this.apiEndPoint + url, body, {
      headers: headers,
    });
  }

  DeleteEmployeeContractQua(EmpId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'EmpContracts/DeleteEmployeeContractQua?EmpId=' +
        EmpId +
        '',
      null
    );
  }

  RemoveEmployee(EmployeeId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'Employee/RemoveEmployee?EmployeeId=' +
        EmployeeId +
        '',
      null
    );
  }
}
