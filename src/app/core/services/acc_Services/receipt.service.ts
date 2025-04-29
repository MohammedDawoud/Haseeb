import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { VoucherFilterVM } from '../../Classes/ViewModels/voucherFilterVM';
import { Invoices } from '../../Classes/DomainObjects/invoices';
import { ExportationService } from '../exportation-service/exportation.service';

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  private apiEndPoint: string = '';
  constructor(
    private http: HttpClient,
    private exportationService: ExportationService
  ) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  customExportExcel(dataExport: any, nameExport: any) {
    let exportation = JSON.parse(JSON.stringify(dataExport));
    let itemsToExeclude: string[] = [];

    let excelData: any[] = [];
    let headers: string[] = [];
    let objectKeys = Object.keys(dataExport[0]);
    objectKeys = objectKeys.filter(
      (item: string) => !itemsToExeclude.includes(item)
    );

    objectKeys.forEach((element) => {
      headers.push(element.toUpperCase());
    });

    exportation.forEach((ele: any) => {
      // ele = (ele) => {
      var sorted: any = {},
        key,
        a = [];

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
      let props = Object.getOwnPropertyNames(ele).filter((prop) =>
        exportation.some((ex: any) => ex === prop)
      );
      props.forEach((pp) => {
        delete ele[pp];
      });

      excelData.push(ele);
    });

    this.exportationService.exportExcel(
      excelData,
      nameExport + new Date().getTime(),
      headers
    );
  }

  //---------------------------------------------------------------------------------

  GetAllVouchers(datafilter: any) {
    datafilter.VoucherNo =
      datafilter.VoucherNo == '' ? null : datafilter.VoucherNo;
    datafilter.InvoiceNote =
      datafilter.InvoiceNote == '' ? null : datafilter.InvoiceNote;
    datafilter.DateFrom =
      datafilter.DateFrom == '' ? null : datafilter.DateFrom;
    datafilter.DateTo = datafilter.DateTo == '' ? null : datafilter.DateTo;
    datafilter.deportationStatusId =
      datafilter.deportationStatusId == ''
        ? null
        : datafilter.deportationStatusId;
    datafilter.CustomerId =
      datafilter.CustomerId == '' ? null : datafilter.CustomerId;
    datafilter.IsPost = datafilter.IsPost == '' ? null : datafilter.IsPost;

    return this.http.post<any>(
      this.apiEndPoint + 'Voucher/GetAllVouchers',
      datafilter
    );
  }
  FillAllCustomerSelectByAllReVoucher() {
    return this.http.get<any>(
      this.apiEndPoint + 'Project/FillAllCustomerSelectByAllReVoucher?param=1'
    );
  }
  FillSubAccountLoad() {
    return this.http.get<any>(this.apiEndPoint + 'Account/FillSubAccountLoad');
  }

  FillSubAccountLoad_Branch() {
    return this.http.get<any>(this.apiEndPoint + 'Account/FillSubAccountLoad_Branch');
  }
  FillSubAccountLoadNotMain_Branch() {
    return this.http.get<any>(this.apiEndPoint+'Account/FillSubAccountLoadNotMain_Branch');
  }
  FillBankSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Banks/FillBankSelect');
  }
  GetAllCustomerForDropWithBran() {
    return this.http.get<any>(
      this.apiEndPoint + 'Customer/GetAllCustomerForDropWithBran'
    );
  }
  GenerateVoucherNumber() {
    return this.http.get<any>(
      this.apiEndPoint + 'Voucher/GenerateVoucherNumberNew?&Type=6'
    );
  }
  FillCustAccountsSelect2(param: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Account/FillCustAccountsSelect2?param=' + param
    );
  }
  GetAccCodeFormID(AccID: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Account/GetAccCodeFormID?AccID=' + AccID
    );
  }
  GetBranch_Costcenter() {
    return this.http.get<any>(
      this.apiEndPoint + 'CostCenter/GetBranch_Costcenter'
    );
  }
  GetAllDetailsByVoucherId(voucherId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'Voucher/GetAllDetailsByVoucherId?voucherId=' +
        voucherId
    );
  }

  GetInvoiceByCustomer(CustomerId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Voucher/GetInvoiceByCustomer?CustomerId=' + CustomerId
    );
  }
  GetInvoiceByNo(VoucherNo: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Voucher/GetInvoiceByNo?VoucherNo=' + VoucherNo
    );
  }
  GetInvoiceByNo_purches(VoucherNo: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Voucher/GetInvoiceByNo_purches?VoucherNo=' + VoucherNo
    );
  }

  GetAllCustomerForDropWithBranch() {
    return this.http.get<any>(
      this.apiEndPoint + 'Customer/GetAllCustomerForDropWithBranch'
    );
  }
  ConvertNumToString(_num: any) {
    var url = `${environment.apiEndPoint}General/ConvertNumToString?Num=${_num}`;
    return this.http.get<any>(url);
  }
  VousherRe_Sum(InvoiceId: any) {
    return this.http.post(
      this.apiEndPoint + 'Voucher/VousherRe_Sum',
      {},
      { params: { InvoiceId: InvoiceId } }
    );
  }

  PayVousher_Sum(InvoiceId: any) {
    return this.http.post(
      this.apiEndPoint + 'Voucher/PayVousher_Sum',
      {},
      { params: { InvoiceId: InvoiceId } }
    );
  }
  UpdateVoucher(InvoiceId: any) {
    return this.http.post(
      this.apiEndPoint + 'Voucher/UpdateVoucher',
      {},
      { params: { InvoiceId: InvoiceId } }
    );
  }

  UpdateVoucher_recipient(InvoiceId: any) {
    return this.http.post(
      this.apiEndPoint + 'Voucher/UpdateVoucher_recipient',
      {},
      { params: { InvoiceId: InvoiceId } }
    );
  }

  UpdateVoucher_payed(InvoiceId: any) {
    return this.http.post(
      this.apiEndPoint + 'Voucher/UpdateVoucher_payed',
      {},
      { params: { InvoiceId: InvoiceId } }
    );
  }

  UpdateVoucher_payed_bySupp(SupplierInvoiceNo: any) {
    return this.http.post(
      this.apiEndPoint + 'Voucher/UpdateVoucher_payed_bySupp',
      {},
      { params: { SupplierInvoiceNo: SupplierInvoiceNo } }
    );
  }
  GetAllBanks() {
    var SearchText = ' ';
    return this.http.get<any>(
      this.apiEndPoint + 'Banks/GetAllBanks?SearchText=' + SearchText
    );
  }

  Savebanks(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'Banks/Savebanks', body, {
      headers: headers,
    });
  }
  DeleteBanks(BankId: number): Observable<any> {
    return this.http.post(
      `${this.apiEndPoint}Banks/DeleteBanks?BankId=` + BankId,
      {}
    );
  }

  SaveVoucher(datafilter: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'Voucher/SaveVoucher',
      datafilter
    );
  }
  PostVouchers(modal: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'Voucher/PostVouchers',
      modal
    );
  }
  PostBackVouchers(modal: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'Voucher/PostBackVouchers',
      modal
    );
  }
  GetAllJournalsByReVoucherID(invId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'DailyJournal/GetAllJournalsByReVoucherID?invId=' +
        invId
    );
  }
  PostVouchersCheckBox(modal: any) {
    const formData: FormData = new FormData();
    for (let i = 0; i < modal.length; i++) {
      formData.append('voucherIds', modal[i]);
    }
    return this.http.post<any>(
      this.apiEndPoint + 'Voucher/PostVouchersCheckBox',
      formData
    );
  }
  Printdiffrentvoucher(modal: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'Voucher/Printdiffrentvoucher',
      modal
    );
  }
  GetReport(invId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Voucher/GetReport?VoucherId=' + invId
    );
  }
  DeleteVoucher(invId: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'Voucher/DeleteVoucher?VoucherId=' + invId,
      null
    );
  }
  UploadPayVoucherImage(VoucherImage: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'Voucher/UploadPayVoucherImage',
      VoucherImage
    );
  }
  DailyVoucherReport(VoucherId: any) {
    var url = `${environment.apiEndPoint}Voucher/DailyVoucherReport?&VoucherId=${VoucherId}`;
    return this.http.get<any>(url);
  }
  PrintJournalsByReVoucherId(VoucherId: any) {
    var url = `${environment.apiEndPoint}DailyJournal/PrintJournalsByReVoucherId?&InvId=${VoucherId}`;
    return this.http.post<any>(url, {});
  }
  GetCustomersByCustomerId(CustomerId: any) {
    var url = `${environment.apiEndPoint}Customer/GetCustomersByCustomerId?CustomerId=${CustomerId}`;
    return this.http.get<any>(url);
  }
}
