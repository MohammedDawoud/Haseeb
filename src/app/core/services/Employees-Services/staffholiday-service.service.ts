import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VacationVM } from '../../Classes/ViewModels/vacationVM';
import { Vacation } from '../../Classes/DomainObjects/vacations';

@Injectable({
  providedIn: 'root'
})
export class StaffholidayServiceService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }


 fillvacationtype() {
    return this.http.get<any>(this.apiEndPoint+'VacationType/FillVacationTypeSelect');
  }
  FillSelectEmployeeWorkers() {
    return this.http.get<any>(this.apiEndPoint+'Employee/FillSelectEmployeeWorkers');
  }
  GetAllVacationsSearch(Search:VacationVM): Observable<any> {
    debugger
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(Search);
    return this.http.post(this.apiEndPoint+'Vacation/GetAllVacationsSearch', body,{'headers':headers});
  }


  GetNetVacationDays(stdate:any,endDate:any,empid:any,vacationtypeid:any) {
    return this.http.get<any>(this.apiEndPoint+'Vacation/GetNetVacationDays?StartDate='+stdate+'&&EndDate='+endDate+'&&EmpId='+empid+'&&VacationTypeId='+vacationtypeid+'');
  }
  GetEmployeeById(EmpId:any) {
    return this.http.get<any>(this.apiEndPoint+'Employee/GetEmployeeById?EmpId='+EmpId+'');
  }

  

  SaveVacationWorkers(vacation:Vacation): Observable<any> {
    debugger
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(vacation);
    return this.http.post(this.apiEndPoint+'Vacation/SaveVacationWorkers', body,{'headers':headers});
  }

  SaveVacation2(vacation:Vacation): Observable<any> {
    debugger
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(vacation);
    return this.http.post(this.apiEndPoint+'Vacation/SaveVacation2', body,{'headers':headers});
  }
  UpdateDecisionType_V(VacationId:any) {
    return this.http.post<any>(this.apiEndPoint+'Vacation/UpdateDecisionType_V?VacationId='+VacationId+'&&DecisionType=1',null);
  }

  DeleteVacation(VacationId:any) {
    return this.http.post<any>(this.apiEndPoint+'Vacation/DeleteVacation?VacationId='+VacationId+'',null);
  }

  UpdateBackToWork_V(VacationId:any) {
    return this.http.post<any>(this.apiEndPoint+'Vacation/UpdateBackToWork_V?VacationId='+VacationId+'',null);
  }



  GetAllVacationsw(searchText:any) {
    return this.http.get<any>(this.apiEndPoint+'Vacation/GetAllVacationsw?searchText='+searchText+'');
  }

  UploadVacationImage(form :any) {
    return this.http.post<any>(this.apiEndPoint+'Vacation/UploadVacationImage',form);
  }

  SaveVacation_Management(vacation:Vacation): Observable<any> {
    debugger
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(vacation);
    return this.http.post(this.apiEndPoint+'Vacation/SaveVacation_Management', body,{'headers':headers});
  }
}
