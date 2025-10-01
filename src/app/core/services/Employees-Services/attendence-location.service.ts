import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendenceLocationService {

  private apiEndPoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  FillAttendenceLocation() {
    return this.http.get<any>(this.apiEndPoint + 'AttendenceLocationSettings/FillAttendenceLocation');
  }

  FillSelectEmployee() {
    return this.http.get<any>(this.apiEndPoint + 'Employee/FillSelectEmployee');
  }

  GetAllAttendencelocations(SearchText: any): Observable<any> {
    return this.http.get<any>(
      this.apiEndPoint +
        'AttendenceLocationSettings/GetAllAttendencelocations?SearchText=' +
        SearchText +
        ''
    );
  }

  SaveAttendenceLocation(attendence: any): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(attendence);
    return this.http.post(this.apiEndPoint + 'AttendenceLocationSettings/SaveAttendenceLocation', body, {
      headers: headers,
    });
  }

  GetlAttendencelocationbyId(attendenceLocationSettingsId:any) {
    return this.http.get<any>(this.apiEndPoint + 'AttendenceLocationSettings/GetlAttendencelocationbyId?attendenceLocationSettingsId='+attendenceLocationSettingsId);
  }
  DeleteAttendenceLocation(AttLocationId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'AttendenceLocationSettings/DeleteAttendenceLocation?AttLocationId=' +
        AttLocationId +
        '',
      null
    );
  }

  DeleteEmplocation(EmpId:any,LocationId:any){
    return this.http.post(this.apiEndPoint+'Employee/DeleteEmplocation', {}, { params:{EmpId:EmpId,LocationId:LocationId}});
  }

  GetAllEmployeesByLocationId(LocationId: any): Observable<any> {
    return this.http.get<any>(
      this.apiEndPoint +
        'Employee/GetAllEmployeesByLocationId?LocationId=' +
        LocationId +
        ''
    );
  }

  ConvertEmplocation(EmpId:any,oldLocationId:any,newLocationId:any){
    return this.http.post(this.apiEndPoint+'Employee/ConvertEmplocation', {}, { params:{EmpId:EmpId,oldLocationId:oldLocationId,newLocationId:newLocationId}});
  }
  SaveEmplocation(EmpId:any,LocationId:any){
    return this.http.post(this.apiEndPoint+'Employee/SaveEmplocation', {}, { params:{EmpId:EmpId,LocationId:LocationId}});
  }
  SaveEmplocationList(locationDataNew:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(locationDataNew);
    return this.http.post(this.apiEndPoint + 'Employee/SaveEmplocationList', body,{'headers':headers});
  }
  AllowEmployeesites(EmpId:any,Check:any,Type:any){
    return this.http.post(this.apiEndPoint+'Employee/AllowEmployeesites', {}, { params:{EmpId:EmpId,Check:Check,Type:Type}});
  }
}
