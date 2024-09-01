import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { VoucherFilterVM } from 'src/app/core/Classes/ViewModels/voucherFilterVM';
import { Invoices } from '../../Classes/DomainObjects/invoices';
import { ExportationService } from '../exportation-service/exportation.service';
import { ContractsVM } from '../../Classes/ViewModels/contractsVM';
@Injectable({
  providedIn: 'root'
})
export class DebentureService {

  private apiEndPoint: string = '';
  constructor(private http: HttpClient,
    private exportationService: ExportationService,) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  GetAllDebentures(Type: any) {
    var url = `${environment.apiEndPoint}Debentures/GetAllDebentures?&Type=${Type}`;
    return this.http.get<any>(url);
  }
  // GetAllquantities(ServiceId: any) {
  //   var url = `${environment.apiEndPoint}Voucher/GetAllquantities?&ServiceId=${ServiceId}`;
  //   return this.http.get<any>(url);
  // }
  GetAllquantities(formData:any){
    return this.http.post<any>(this.apiEndPoint+'Account/GetAllQuantities' ,formData );
  }
  GetAllItemMovement(formData:any){
    return this.http.post<any>(this.apiEndPoint+'Account/GetAllItemMovement' ,formData );
  }
  SaveDebenture(formData:any){
    return this.http.post<any>(this.apiEndPoint+'Debentures/SaveDebenture' ,formData );
  }
  DeleteDebenture(DebentureId:any){
    return this.http.post(this.apiEndPoint+'Debentures/DeleteDebenture', {}, { params:{DebentureId:DebentureId}});
  }
  GenerateDebentureNumber(Type:any) {
    var url=`${environment.apiEndPoint}Debentures/GenerateDebentureNumber?&Type=${Type}`;
    return this.http.get<any>(url);
  }
  //----------------------------------Storehouses-------------------------------------------
  GetAllStorehouses() {
    return this.http.get<any>(this.apiEndPoint+'Storehouse/GetAllStorehouses');
  }
  SaveStorehouse(formData:any){
    return this.http.post<any>(this.apiEndPoint+'Storehouse/SaveStorehouse' ,formData );
  }
  
  DeleteStorehouse(StorehouseId:any){
    return this.http.post(this.apiEndPoint+'Storehouse/DeleteStorehouse', {}, { params:{StorehouseId:StorehouseId}});
  }
  FillStorehouseSelect() {
    return this.http.get<any>(this.apiEndPoint+'Storehouse/FillStorehouseSelect');
  }
  //-------------------------------------------------------------------------------
  FillAllServicePrice() {
    return this.http.get<any>(this.apiEndPoint+'Voucher/FillAllServicePrice');
  }

}
