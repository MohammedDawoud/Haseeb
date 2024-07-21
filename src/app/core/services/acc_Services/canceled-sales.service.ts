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
export class CanceledSalesService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient,
    private exportationService: ExportationService,) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  FillAllCustomerSelectByAllMrdod() {
    var url = `${environment.apiEndPoint}Project/FillAllCustomerSelectByAllMrdod?param=1`;
    return this.http.get<any>(url);
  }
  FillAllProjectSelectByAllMrdod() {
    var url = `${environment.apiEndPoint}Project/FillAllProjectSelectByAllMrdod?param=1`;
    return this.http.get<any>(url);
  }
  FillAllProjectSelectByAllMrdod_C(Customer: any) {
    var url = `${environment.apiEndPoint}Project/FillAllProjectSelectByAllMrdod_C?param=${Customer}`;
    return this.http.get<any>(url);
  }
  GetAllVouchersRetReport(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Voucher/GetAllVouchersRetReport', body,{'headers':headers});
  }
  VouchersRetReport(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Voucher/VouchersRetReport', body,{'headers':headers});
  }

  customExportExcel(dataExport: any, nameExport: any) {

    let exportation = JSON.parse(JSON.stringify(dataExport));
    let itemsToExeclude: string[] = []

    let excelData: any[] = [];
    let headers: string[] = [];
    let objectKeys = Object.keys(dataExport[0]);
    objectKeys = objectKeys.filter((item: string) => !itemsToExeclude.includes(item));

    objectKeys.forEach(element => {
      headers.push(element.toUpperCase());
    });

    exportation.forEach((ele: any) => {
      // ele = (ele) => {
      var sorted: any = {},
        key, a = [];

      for (key in ele) {
        if (ele.hasOwnProperty(key)) {
          a.push(key);
        }
      }
      a = a.filter((item: string) => !itemsToExeclude.includes(item));

      // a.sort();

      for (key = 0; key < a.length; key++) {
        sorted[a[key]] = ele[a[key]];
      }
      // return sorted;
      ele = sorted;
      // }
      let props = Object.getOwnPropertyNames(ele).filter(prop => exportation.some((ex: any) => ex === prop));
      props.forEach(pp => {
        delete ele[pp];
      })

      excelData.push(ele);

    })

    this.exportationService.exportExcel(excelData, nameExport + new Date().getTime(), headers);
  }
// ============================================canceled purchase invoices
FillSuppliersSelect() {
  var url = `${environment.apiEndPoint}Suppliers/FillSuppliersSelect`;
  return this.http.get<any>(url);
}
GetAllVouchersRetReport_Pur(obj:any): Observable<any> {
  const headers = { 'content-type': 'application/json'}
  const body=JSON.stringify(obj);
  return this.http.post(this.apiEndPoint + 'Voucher/GetAllVouchersRetReport_Pur', body,{'headers':headers});
}
}
