import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Vacation } from '../../Classes/DomainObjects/vacations';
import { Observable } from 'rxjs';
import { Permissions } from '../../Classes/DomainObjects/Permissions';

@Injectable({
  providedIn: 'root'
})
export class EmployeePermissionsService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }


  GetAllPermissions(EmpId:any,Type:any,Status:any,FromDate:any,ToDate:any,SearchText:any) {
    return this.http.get<any>(this.apiEndPoint+'Permission/GetAllPermissions'
      +'?EmpId='+EmpId+'&&Type='+Type+'&&Status='+Status+'&&FromDate='+FromDate+'&&ToDate='+ToDate+'&&SearchText='+SearchText+'');
  }
  GetAllPermissions_DashBoard() {
    return this.http.get<any>(this.apiEndPoint+'Permission/GetAllPermissions_DashBoard');
  }

  SavePermission(vacation:Permissions): Observable<any> {
      //debugger
      const headers = { 'content-type': 'application/json'}
      const body=JSON.stringify(vacation);
      return this.http.post(this.apiEndPoint+'Permission/SavePermission', body,{'headers':headers});
    }
  
    FillPermissionTypeSelect() {
      return this.http.get<any>(this.apiEndPoint+'PermissionType/FillPermissionTypeSelect');
    }
    FillSelectEmployeeWorkers() {
      return this.http.get<any>(this.apiEndPoint+'Employee/FillSelectEmployeeWorkers');
    }

    Updatepermission(PermissionId:any,Type:any,Reason:any) {
      return this.http.post<any>(this.apiEndPoint+'Permission/Updatepermission?PermissionId='+PermissionId+'&&Type='+Type+'&&Reason='+Reason+'',null);
    }
    DeletePermissions(PermissionId:any) {
      return this.http.post<any>(this.apiEndPoint+'Permission/DeletePermissions?PermissionId='+PermissionId+'',null);
    }
}
