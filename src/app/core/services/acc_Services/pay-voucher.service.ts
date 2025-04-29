import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VoucherFilterVM } from '../../Classes/ViewModels/voucherFilterVM';
import { Acc_Clauses } from '../../Classes/DomainObjects/acc_Clauses';
import { Acc_Suppliers } from '../../Classes/DomainObjects/acc_Suppliers';
import { Invoices } from '../../Classes/DomainObjects/invoices';
import { ExportationService } from '../exportation-service/exportation.service';

@Injectable({
  providedIn: 'root'
})
export class PayVoucherService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient,private exportationService: ExportationService) {
    this.apiEndPoint = environment.apiEndPoint;
  }


  GetAllVouchersLastMonth(_voucherFilterVM:VoucherFilterVM): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_voucherFilterVM);
    return this.http.post(this.apiEndPoint + 'Voucher/GetAllVouchersLastMonth', body,{'headers':headers});
  }

  GetAllVouchers(_voucherFilterVM:VoucherFilterVM): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_voucherFilterVM);
    return this.http.post(this.apiEndPoint + 'Voucher/GetAllVouchers', body,{'headers':headers});
  }

  GenerateVoucherNumber(Type:any){

    return this.http.get<any>(this.apiEndPoint + 'Voucher/GenerateVoucherNumberNew?Type='+Type+'');
  }
  GetAllClauses(SearchText:any){
    return this.http.get<any>(this.apiEndPoint + 'Clauses/GetAllClauses?SearchText='+SearchText+'');


  }

  DeleteClause(ClauseId:any): Observable<any> {
    return this.http.post(this.apiEndPoint + 'Clauses/DeleteClause?ClauseId='+ClauseId+'',null);
  }

  SaveClause(_clouses:Acc_Clauses): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_clouses);
    return this.http.post(this.apiEndPoint + 'Clauses/SaveClause', body,{'headers':headers});
  }

  FillClausesSelect(){
    return this.http.get<any>(this.apiEndPoint + 'Clauses/FillClausesSelect2');

  }

  GetAllSuppliers(SearchText:any){
    return this.http.get<any>(this.apiEndPoint + 'Suppliers/GetAllSuppliers?SearchText='+SearchText+'');

  }
  DeleteSupplier(SupplierId:any): Observable<any> {
    return this.http.post(this.apiEndPoint + 'Suppliers/DeleteSupplier?SupplierId='+SupplierId+'',null);
  }
  SaveSupplier(_supplier:Acc_Suppliers): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_supplier);
    return this.http.post(this.apiEndPoint + 'Suppliers/SaveSupplier', body,{'headers':headers});
  }

  FillSuppliersSelect2(){
    return this.http.get<any>(this.apiEndPoint + 'Suppliers/FillSuppliersSelect2');

  }

  FillCitySelect(){
    return this.http.get<any>(this.apiEndPoint + 'City/FillCitySelect');

  }

  GetALLOrgData(){
    return this.http.get<any>(this.apiEndPoint + 'Statistics/GetALLOrgData');

  }
  FillCustAccountsSelect2(param:any){
    return this.http.get<any>(this.apiEndPoint + 'Account/FillCustAccountsSelect2?param='+param+'');

  }

  SaveVoucherP(Invoices:Invoices): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(Invoices);
    return this.http.post(this.apiEndPoint + 'Voucher/SaveVoucherP', body,{'headers':headers});
  }

  SaveandPostVoucherP(Invoices:Invoices): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(Invoices);
    return this.http.post(this.apiEndPoint + 'Voucher/SaveandPostVoucherP', body,{'headers':headers});
  }



  UploadPayVoucherImage(formData:FormData): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(formData);
    return this.http.post(this.apiEndPoint + 'Voucher/UploadPayVoucherImage', body,{'headers':headers});
  }

  ConvertNumToString(Num:any){
    return this.http.get<any>(this.apiEndPoint + 'General/ConvertNumToString?Num='+Num+'');

  }
  GetLayoutReadyVm(){
    return this.http.get<any>(this.apiEndPoint + 'Home/GetSystemSettingsByUserId');

  }
  GetAccCodeFormID(AccID:any){
    return this.http.get<any>(this.apiEndPoint + 'Account/GetAccCodeFormID?AccID='+AccID+'');

  }
  GetBranch_Costcenter(){
    return this.http.get<any>(this.apiEndPoint + 'CostCenter/GetBranch_Costcenter');

  }
  GetTaxNoBySuppId(SupplierId:any){
    return this.http.get<any>(this.apiEndPoint + 'Suppliers/GetTaxNoBySuppId?SupplierId='+SupplierId+'');

  }
  GetAllDetailsByVoucherId(voucherId:any){
    return this.http.get<any>(this.apiEndPoint + 'Voucher/GetAllDetailsByVoucherId?voucherId='+voucherId+'');
  }
  GetAllJournalsByPayVoucherID(invId:any) {
    return this.http.get<any>(this.apiEndPoint + 'DailyJournal/GetAllJournalsByPayVoucherID?invId='+invId);
  }
  PrintJournalsByPayVoucherId(VoucherId: any) {
    var url = `${environment.apiEndPoint}DailyJournal/PrintJournalsByPayVoucherId?&InvId=${VoucherId}`;
    return this.http.post<any>(url,{});
  }
  DeleteVoucher(invId:any) {
    return this.http.post<any>(this.apiEndPoint + 'Voucher/DeleteVoucher?VoucherId='+invId,null);
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
}
