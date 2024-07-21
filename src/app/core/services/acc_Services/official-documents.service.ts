import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OfficialDocumentsVM } from '../../Classes/ViewModels/officialDocumentsVM';
import { Observable } from 'rxjs';
import { Department } from '../../Classes/DomainObjects/department';

@Injectable({
  providedIn: 'root'
})
export class OfficialDocumentsService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  GetAllOfficialDocuments(){

    return this.http.get<any>(this.apiEndPoint + 'OfficialDocuments/GetAllOfficialDocuments');
  }


  SearchOfficialDocuments(OfficialDocumentsSearch:OfficialDocumentsVM): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(OfficialDocumentsSearch);
    return this.http.post(this.apiEndPoint + 'OfficialDocuments/SearchOfficialDocuments', body,{'headers':headers});
  }
  GetAllDepartmentbyType(Type:any,SearchText:any){
    return this.http.get<any>(this.apiEndPoint + 'Department/GetAllDepartmentbyType?Type='+Type+'&SearchText='+SearchText+'');

  }
  DeleteDepartment(DepartmentId:any){
    return this.http.post<any>(this.apiEndPoint + 'Department/DeleteDepartment?DepartmentId='+DepartmentId+'',null);

  }


  SaveDepartment(_department:Department): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_department);
    return this.http.post(this.apiEndPoint + 'Department/SaveDepartment', body,{'headers':headers});
  }

  FillDepartmentSelectByType(param:any){
    return this.http.get<any>(this.apiEndPoint + 'Department/FillDepartmentSelectByType?param='+param+'');

  }

  SaveOfficialDocuments(formData:FormData): Observable<any> {
    debugger
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(formData);
    return this.http.post(this.apiEndPoint + 'OfficialDocuments/SaveOfficialDocuments2',formData);
  }

  DeleteOfficialDocuments(DocumentId:any){
    return this.http.post<any>(this.apiEndPoint + 'OfficialDocuments/DeleteOfficialDocuments?DocumentId='+DocumentId+'',null);

  }
  
}
