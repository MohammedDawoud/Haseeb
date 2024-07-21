import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { VoucherFilterVM } from '../../Classes/ViewModels/voucherFilterVM';
import { Invoices } from '../../Classes/DomainObjects/invoices';
import { ExportationService } from '../exportation-service/exportation.service';


@Injectable({
  providedIn: 'root'
})
export class WarrantiesService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient,
    private exportationService: ExportationService,) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  GetAllGurantees() {
    var url = `${environment.apiEndPoint}Gurantees/GetAllGurantees`;
    return this.http.get<any>(url);
  }
  DeleteGurantee(GuranteeId:any): Observable<any> {
    return this.http.post(this.apiEndPoint + 'Gurantees/DeleteGurantee?GuranteeId='+GuranteeId+'',null);
  }
  SaveGurantee(modal:any): Observable<any> {
    return this.http.post(this.apiEndPoint + 'Gurantees/SaveGurantee', modal);
  }
}
