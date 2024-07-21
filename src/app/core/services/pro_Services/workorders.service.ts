import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkordersService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetAllWorkOrders(): Observable<any> {
    return this.http.get(this.apiEndPoint+'WorkOrders/GetAllWorkOrders');
  }
  FillCustomerSelect() {
    return this.http.get<any>(this.apiEndPoint+'Customer/FillCustomerSelect');
  }
  FillAllUsersTodropdown() {
    return this.http.get<any>(this.apiEndPoint+'Users/FillAllUsersTodropdown');
  }
  FillAllUsersSelectAll() {
    return this.http.get<any>(
      this.apiEndPoint + 'ControllingTask/FillAllUsersSelectAllByBranch'
    );
  }
  GetMaxOrderNumber() {
    return this.http.get<any>(this.apiEndPoint+'WorkOrders/GetMaxOrderNumber');
  }
  GetCustomersByCustomerId(param:any) {
    var url=`${environment.apiEndPoint}Customer/GetCustomersByCustomerId?CustomerId=${param}`;
    return this.http.get<any>(url);
  }
  GetAllProjByCustomerId(param:any) {
    var url=`${environment.apiEndPoint}Project/GetAllProjByCustomerId?customerId=${param}`;
    return this.http.get<any>(url);
  }
  DeleteWorkOrder(_workOrderId:any){
    return this.http.post(this.apiEndPoint+'WorkOrders/DeleteWorkOrder', {}, { params:{WorkOrderId:_workOrderId}});
  }
  SearchFn(order:any): Observable<any> {
    debugger
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(order);
    return this.http.post(this.apiEndPoint + 'WorkOrders/SearchWorkOrders', body,{'headers':headers});
  }
  SearchDateFn(from:string,to:string): Observable<any> {
    return this.http.get(this.apiEndPoint+'WorkOrders/GetAllWorkOrdersByDateSearch?DateFrom='+from+'&&DateTo='+to+'');
  }
  SaveWorkOrder(formData:FormData): Observable<HttpEvent<any>> {
    debugger
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'multipart/form-data');
    const req = new HttpRequest('POST', `${this.apiEndPoint}WorkOrders/SaveWorkOrder`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }
  SaveWorkOrderFile(model:any): Observable<HttpEvent<any>> {
    debugger
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'multipart/form-data')

    const req = new HttpRequest('POST', `${this.apiEndPoint}WorkOrders/SaveWorkOrderFile`, model, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }



  SaveProjectRequirement4(file: any,_projectRequirements?:any): Observable<HttpEvent<any>> {
    debugger
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();
    if(file!=undefined)
    {
      formData.append('uploadesgiles', file);
    }
    formData.append('RequirementId', String(_projectRequirements.requirementId));
    formData.append('OrderId', _projectRequirements.orderId);
    formData.append('PageInsert', String(_projectRequirements.pageInsert));

    const req = new HttpRequest('POST', `${this.apiEndPoint}ProjectRequirements/SaveProjectRequirement4`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }


}
