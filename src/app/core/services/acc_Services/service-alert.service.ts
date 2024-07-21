import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExportationService } from '../exportation-service/exportation.service';
import { environment } from 'src/environments/environment';
import { Department } from '../../Classes/DomainObjects/department';
import { Observable } from 'rxjs';
import { ServicesVM } from '../../Classes/ViewModels/servicesVM';

@Injectable({
  providedIn: 'root'
})
export class ServiceAlertService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient,
    private exportationService: ExportationService,) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetAllServices() {
    return this.http.get<any>(this.apiEndPoint + 'Services/GetAllServices');
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

  FillExternalDepartmentSelect(){
    return this.http.get<any>(this.apiEndPoint + 'Department/FillExternalDepartmentSelect');

  }
  GetAllBanks() {
    var SearchText= " "
    return this.http.get<any>(this.apiEndPoint + 'Banks/GetAllBanks?SearchText='+SearchText);
  }

  Savebanks(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'Banks/Savebanks', body, { 'headers': headers });
  }
  DeleteBanks(BankId: number): Observable<any> {
    return this.http.post(`${this.apiEndPoint}Banks/DeleteBanks?BankId=` + BankId, {});
  }
  
  FillBankSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Banks/FillBankSelect');
  }
  FillAccountsSelect(){
    return this.http.get<any>(this.apiEndPoint + 'Account/FillAccountsSelect');
 
  }

  SaveService(formData:FormData): Observable<any> {
    debugger
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(formData);
    return this.http.post(this.apiEndPoint + 'Services/SaveService2',formData);
  }

  DeleteService(ServiceId:any){
    return this.http.post<any>(this.apiEndPoint + 'Services/DeleteService?ServiceId='+ServiceId+'',null);

  }

  Searchaservice(_service:ServicesVM): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_service);
    return this.http.post(this.apiEndPoint + 'Services/GetServicesSearch', body,{'headers':headers});
  }

}
