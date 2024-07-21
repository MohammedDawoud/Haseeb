import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EmployeesVM } from '../../Classes/ViewModels/employeesVM';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeArchiveServiceService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

    
  GetAllArchivesEmployees() {
    return this.http.get<any>(this.apiEndPoint+'Employee/GetAllArchivesEmployees');
  }
  SearchArchiveEmployees(EmployeesSearch:EmployeesVM): Observable<any> {
    debugger
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(EmployeesSearch);
    return this.http.post(this.apiEndPoint+'Employee/SearchArchiveEmployees', body,{'headers':headers});
  }


  
}
