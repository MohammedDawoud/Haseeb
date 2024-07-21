import { Injectable } from '@angular/core';
import { ExportationService } from '../exportation-service/exportation.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { FiscalYears } from '../../Classes/DomainObjects/fiscalYears';
import { Observable } from 'rxjs';
import { Acc_EmpFinYears } from '../../Classes/DomainObjects/acc_EmpFinYears';

@Injectable({
  providedIn: 'root'
})
export class FiscalyearserviceService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient,
    private exportationService: ExportationService,) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetAllFiscalyears() {
    return this.http.get<any>(this.apiEndPoint + 'Fiscalyears/GetAllFiscalyears');
  }

  SaveFiscalyears(_department:FiscalYears): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_department);
    return this.http.post(this.apiEndPoint + 'Fiscalyears/SaveFiscalyears', body,{'headers':headers});
  }
  FillAllUsersSelectAll() {
    return this.http.get<any>(this.apiEndPoint + 'ControllingTask/FillAllUsersSelectAll');
  }
  FillBranchSelect(){
    return this.http.get<any>(this.apiEndPoint + 'Branches/FillBranchSelect');
  }

  SaveFiscalyearsPriv(_accfiscal:Acc_EmpFinYears): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_accfiscal);
    return this.http.post(this.apiEndPoint + 'Fiscalyears/SaveFiscalyearsPriv', body,{'headers':headers});
  }

  GetAllFiscalyearsPriv(){
    return this.http.get<any>(this.apiEndPoint + 'Fiscalyears/GetAllFiscalyearsPriv');

  }

  FillYearSelect(){
    return this.http.get<any>(this.apiEndPoint + 'Fiscalyears/FillYearSelect');

  }

  GetSystemSettingsByUserId(){
    return this.http.get<any>(this.apiEndPoint + 'SystemSettings/GetSystemSettingsByUserId');

  }

  ActivateFiscalYear(FiscalId:any,SystemSettingId:any){
    return this.http.post<any>(this.apiEndPoint + 'Fiscalyears/ActivateFiscalYear?FiscalId='+FiscalId+'&SystemSettingId='+SystemSettingId+'',null);

  }
  GetActiveYear(){
    return this.http.get<any>(this.apiEndPoint + 'Fiscalyears/GetActiveYear');

  }
  SaveRecycleVoucher(YearID:any){
    return this.http.post<any>(this.apiEndPoint + 'Voucher/SaveRecycleVoucher?YearID='+YearID+'',null);

  }

  SaveRecycleReturnVoucher(YearID:any){
    return this.http.post<any>(this.apiEndPoint + 'Voucher/SaveRecycleReturnVoucher?YearID='+YearID+'',null);

  }
}
