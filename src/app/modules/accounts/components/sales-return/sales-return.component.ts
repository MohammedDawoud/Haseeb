

import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef, Inject, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SelectionModel } from '@angular/cdk/collections';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RestApiService } from 'src/app/shared/services/api.service';
import { fade } from 'src/app/shared/animations/toggleBtn.animation';
import { ToastrService } from 'ngx-toastr';
import printJS from 'print-js'
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';

import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { VoucherFilterVM } from 'src/app/core/Classes/ViewModels/voucherFilterVM';
import { PrintreportsService } from 'src/app/core/services/acc_Services/printreports.service';
import { NgxPrintElementService } from 'ngx-print-element';
import { InvoiceService } from 'src/app/core/services/acc_Services/invoice.service';
@Component({
  selector: 'app-sales-return',
  templateUrl: './sales-return.component.html',
  styleUrls: ['./sales-return.component.scss']
})

export class SalesReturnComponent implements OnInit{

  title: any = {
    main: {
      name: {
        ar: 'الحسابات',
        en: 'Projects Management',
      },
      link: '/accounts',
    },
    sub: {
      ar: ' مردود المبيعات',
      en: 'sales return',
    },
  };


  selectedUser: any;
  users: any;

  closeResult = '';


  showStats = false;
  showFilters = false;

  @ViewChild(DatatableComponent) table: DatatableComponent | any;

  openBox: any = false;
  boxId: any;
  displayedColumns: string[] = [
    'offer_id',
    'date',
    'customer',
    'price',
    'user',
    'project_id',
    'project-duration',
    'operations',
  ];
  // dataSource: MatTableDataSource<any>;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  projectDisplayedColumns: string[] = [
    'invoiceRetId',
    'itsHistory',
    'invoiceNumber',
    'PaymentType',
    'RegistrationNumber',
    'Statement',
    'customerName',
    'theAmount',
    'Tax',
    'Total',
    'theCondition',
    'operations',
  ];


  startDate = new Date();
  endDate = new Date();
  constructor(private modalService: NgbModal
    ,private _accountsreportsService: AccountsreportsService,
    @Inject(DOCUMENT) private document: Document,
    private print: NgxPrintElementService,
    private _sharedService: SharedService,
    private _invoiceService: InvoiceService,
    private api: RestApiService,
    private _printreportsService: PrintreportsService,

    private toast: ToastrService,) {
    this.dataSource = new MatTableDataSource([{}]);
  }
  invoicestatus: any;

  OrganizationData: any
  environmentPho: any
  dateprint: any
  datePrintJournals: any = new Date()
  lang: any = 'ar';

  ngOnInit(): void {

    this.api.GetOrganizationDataLogin().subscribe((data: any) => {
      this.OrganizationData = data.result;
      this.dateprint =this._sharedService.date_TO_String(new Date());
      this.environmentPho = environment.PhotoURL + this.OrganizationData.logoUrl;
    })

    this.RefreshData();
    this.FillAccountsSelectCustomer();
    this.invoicestatus = [
      { id: 1, name: { ar: 'ملغي', en: 'Canceled' } },
      { id: 2, name: { ar: 'ساري', en: 'not expired' } },
    ];

  }

  ngAfterViewInit() {
  }
  RowInvoiceData: any;

  open(content: any, data?: any, type?: any) {
    if(data)
    {
      this.RowInvoiceData=data;
    }
    if(type=="accountingentryModal"){
      this.GetAllJournalsByInvIDRet(data.invoiceId);
    }
    this.modalService
     .open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: type == 'accountingentryModal' ? 'xl' : 'lg' ,
      centered: type ? false : true
    })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any, type?: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectsDataSource.filter = filterValue.trim().toLowerCase();
  }

  load_accountIds:any;
  FillAccountsSelectCustomer(){
    this._accountsreportsService.FillAccountsSelectCustomer().subscribe(data=>{
      this.load_accountIds=data;
    });
  }
  data: any = {
    filter: {
      enable: false,
      date: null,
      search_accountId :null,
      search_invoicestatus:null,
      DateFrom_P :null,
      DateTo_P :null,
      isChecked:false,
      Type:2,
    }
  };
  projectsDataSource = new MatTableDataSource();
  projectsDataSourceTemp:any=[];
  projectsDataSourcedata:any=[];

  RefreshData(){
    var _voucherFilterVM=new VoucherFilterVM();
    _voucherFilterVM.type=this.data.filter.Type;
    _voucherFilterVM.accountId=this.data.filter.search_accountId;
    _voucherFilterVM.isSearch=true;
    _voucherFilterVM.status=this.data.filter.search_invoicestatus;
    if(this.data.filter.DateFrom_P!=null && this.data.filter.DateTo_P!=null){
      _voucherFilterVM.dateFrom=this.data.filter.DateFrom_P;
      _voucherFilterVM.dateTo=this.data.filter.DateTo_P;
    }
    var obj=_voucherFilterVM;
    this._accountsreportsService.GetAllVouchersRet(obj).subscribe(data=>{
      this.projectsDataSource = new MatTableDataSource(data);
      this.projectsDataSourcedata=data;
      this.projectsDataSourceTemp=data;
      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
    });
  }
  CheckDate(event: any){
    if(event!=null)
    {
      this.data.filter.DateFrom_P= this._sharedService.date_TO_String(event[0]);
      this.data.filter.DateTo_P= this._sharedService.date_TO_String(event[1]);
      this.RefreshData();
    }
    else{
      this.data.filter.DateFrom_P=null;
      this.data.filter.DateTo_P=null;
      this.RefreshData();
    }
  }
  get totaldepit() {
    var sum=0;
    this.AllJournalEntries.forEach((element: any) => {
      sum=+parseFloat(sum.toString()).toFixed(2)+ +parseFloat(element.depit.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }

  get totalcredit() {
    var sum=0;
    this.AllJournalEntries.forEach((element: any) => {
      sum=+parseFloat(sum.toString()).toFixed(2)+ +parseFloat(element.credit.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }
  AllJournalEntries:any=[];
  GetAllJournalsByInvIDRet(invid:any){
    this._accountsreportsService.GetAllJournalsByInvIDRet(invid).subscribe(data=>{
      this.AllJournalEntries=data.result;
    });
  }
  rowSelectedPublic:any=null;
  getInvoiceRow(row :any){
    this.rowSelectedPublic=row;
  }
  voDetObj:any={
    voucherDetObj :null
  }
  MakeJournal(){
    this.voDetObj.voucherDetObjRet=null;
    var VoucherObj:any = {};
    VoucherObj.InvoiceId = this.rowSelectedPublic.invoiceId;
    this._accountsreportsService.SaveInvoiceForServicesRetNEW(VoucherObj).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(result.reasonPhrase,'رسالة');
        //zatcaFunc
        //debugger
        this.voDetObj.voucherDetObjRet=result.objRetDet;
        if(result.objRetDet.length>0)
        {
          this.ZatcaInvoiceIntegrationFunc(this.voDetObj);
        }
        this.RefreshData();
      }
      else{this.toast.error(result.reasonPhrase, 'رسالة');}
    });
  }
  ZatcaInvoiceIntegrationFunc(InvoiceObj:any) {
    this._invoiceService.ZatcaInvoiceIntegrationFunc(InvoiceObj).subscribe((data) => {
      //console.log(data);
    });
  }


  MakeJournal_Back(){
    var VoucherObj:any = {};
    VoucherObj.InvoiceId = this.rowSelectedPublic.invoiceId;
    this._accountsreportsService.SaveInvoiceForServicesRet_Back(VoucherObj).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(result.reasonPhrase,'رسالة');
        this.RefreshData();
      }
      else{this.toast.error(result.reasonPhrase, 'رسالة');}
    });
  }


  //----------------------------------------------Print---------------------------------------
  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }
  InvPrintData:any=null;
  CustomData:any={
    AccualValue:null,
    Diff:null,
    Total:null,
    netVal:null,
    DiscPer:"0",
    TotalAfterDisc:null,
    Account1Img:null,
    Account2Img:null,
    Account1Bank:null,
    Account2Bank:null,
    OrgImg:null,
    PrintType:null,
    PrintTypeName:null,
    headerurl:null,
    footerurl:null,
  }
  resetCustomData(){
    this.InvPrintData=null;
    this.CustomData={
      AccualValue:null,
      Diff:null,
      Total:null,
      netVal:null,
      Disc:null,
      DiscPer:"0",
      TotalAfterDisc:null,
      Account1Img:null,
      Account2Img:null,
      Account1Bank:null,
      Account2Bank:null,
      OrgImg:null,
      PrintType:null,
      PrintTypeName:null,
      headerurl:null,
      footerurl:null,
    }
  }
  ZatcaPrintP=false;
  GetInvoicePrint(obj: any, TempCheck: any,ZatcaPrint?:boolean) {
    if(ZatcaPrint){this.ZatcaPrintP=true;}
    else {this.ZatcaPrintP=false;}
    this.resetCustomData();
    this._printreportsService
      .ChangeInvoice_PDF(obj.invoiceId, TempCheck).subscribe((data) => {
        console.log("GetInvoicePrint",data);

        this.InvPrintData = data;
        this.InvPrintData.voucherDetailsVM_VD.forEach((element: any) => {
          element.servicesPricesOffer.sort(
            (a: { lineNumber: number }, b: { lineNumber: number }) =>
              (a.lineNumber ?? 0) - (b.lineNumber ?? 0)
          ); // b - a for reverse sort
        });
        if (
          this.InvPrintData?.invoicesVM_VD?.contractNo == null ||
          this.InvPrintData?.invoicesVM_VD?.contractNo == ''
        ) {
          this.CustomData.ContractNo = 'بدون';
        } else {
          this.CustomData.ContractNo =
            this.InvPrintData?.invoicesVM_VD?.contractNo;
        }
        this.CustomData.PrintType = TempCheck;
        debugger
        if (TempCheck == 29){
          this.CustomData.PrintTypeName = 'اشعار دائن';
        } 
        else if (TempCheck == 30)
        {
          this.CustomData.PrintTypeName = 'اشعار مدين';

        } 
        else this.CustomData.PrintType = 1;
        console.log("aaaaa",this.CustomData?.PrintType);
        var TotalInvWithoutDisc = 0;
        var netVal = 0;
        var DiscountValue_Det_Total_withqty = 0;
        if (this.InvPrintData?.voucherDetailsVM_VD[0]?.taxType == 3) {
          netVal = this.InvPrintData?.invoicesVM_VD?.totalValue;
          TotalInvWithoutDisc = this.InvPrintData?.invoicesVM_VD?.totalValue;
        } else {
          netVal = this.InvPrintData?.invoicesVM_VD?.invoiceValue;
          TotalInvWithoutDisc = this.InvPrintData?.invoicesVM_VD?.invoiceValue;
        }
        this.InvPrintData?.voucherDetailsVM_VD?.forEach((element: any) => {
          DiscountValue_Det_Total_withqty =
            DiscountValue_Det_Total_withqty + (element.discountValue_Det ?? 0);
        });

        this.CustomData.DiscPer = parseFloat(
          (
            (DiscountValue_Det_Total_withqty * 100) /
            (TotalInvWithoutDisc + DiscountValue_Det_Total_withqty)
          ).toString()
        ).toFixed(2);
        this.CustomData.Disc = DiscountValue_Det_Total_withqty;
        this.CustomData.Total =
          TotalInvWithoutDisc + DiscountValue_Det_Total_withqty;
        this.CustomData.netVal = netVal;
        this.CustomData.TotalAfterDisc = TotalInvWithoutDisc;

        if (this.InvPrintData?.invoicesVM_VD.printBankAccount != true) {
          this.CustomData.Account1Bank =
            this.InvPrintData?.orgIsRequired_VD == true
              ? this.InvPrintData?.org_VD.accountBank
              : this.InvPrintData?.branch_VD.accountBank;
          this.CustomData.Account2Bank =
            this.InvPrintData?.orgIsRequired_VD == true
              ? this.InvPrintData?.org_VD.accountBank2
              : this.InvPrintData?.branch_VD.accountBank2;
          this.CustomData.Account1Img =
            this.InvPrintData?.orgIsRequired_VD == true
              ? this.InvPrintData?.org_VD.bankIdImgURL
              : this.InvPrintData?.branch_VD.bankIdImgURL;
          this.CustomData.Account2Img =
            this.InvPrintData?.orgIsRequired_VD == true
              ? this.InvPrintData?.org_VD.bankId2ImgURL
              : this.InvPrintData?.branch_VD.bankId2ImgURL;
        } else {
          this.CustomData.Account1Bank = null;
          this.CustomData.Account2Bank = null;
          this.CustomData.Account1Img = null;
          this.CustomData.Account2Img = null;
        }
        if (this.CustomData.Account1Img)
        {
            this.CustomData.Account1Img =this.CustomData.Account1Img;
        }
        
        else this.CustomData.Account1Img = null;
        if (this.CustomData.Account2Img)
        {
          this.CustomData.Account2Img =this.CustomData.Account2Img;
        }         
        else this.CustomData.Account2Img = null;
        if (
          this.InvPrintData?.branch_VD.isPrintInvoice == true &&
          this.InvPrintData?.branch_VD.branchLogoUrl != '' &&
          this.InvPrintData?.branch_VD.branchLogoUrl != null
        ) {
              this.CustomData.OrgImg =this.InvPrintData?.branch_VD.branchLogoUrl;
        } else {
          if (this.InvPrintData?.org_VD.logoUrl)
          {
              this.CustomData.OrgImg =this.InvPrintData?.org_VD.logoUrl;
          }
          else this.CustomData.OrgImg = null;
        }
        if (
          this.InvPrintData?.branch_VD.headerPrintInvoice == true &&
          this.InvPrintData?.branch_VD.headerLogoUrl != '' &&
          this.InvPrintData?.branch_VD.headerLogoUrl != null
        ) {
          this.CustomData.headerurl =this.InvPrintData?.branch_VD.headerLogoUrl;

        } else {
          this.CustomData.headerurl = null;
        }

        if (
          this.InvPrintData?.branch_VD.headerPrintInvoice == true &&
          this.InvPrintData?.branch_VD.footerLogoUrl != '' &&
          this.InvPrintData?.branch_VD.footerLogoUrl != null
        ) {
          this.CustomData.footerurl =this.InvPrintData?.branch_VD.footerLogoUrl;

        } else {
          this.CustomData.footerurl = null;
        }
      });
  }

  @ViewChild('conditionimg')
  set watch(img: ElementRef) {
    if(img) {
    //this.printDiv("divHtml_a");
  }
  }

  GetAccualValue(item:any){
    var AccualValue = 0;
    if (item.taxType == 3)
    {
      AccualValue = (((item.totalAmount ?? 0) + (item.discountValue_Det ?? 0)) / (item.qty ?? 1));
    }
    else
    {
      AccualValue = (((item.amount ?? 0) + (item.discountValue_Det ?? 0)) / (item.qty ?? 1));
    }
    return AccualValue;
  }
  GetDiff(item:any){
    var Diff = "0";
    Diff = parseFloat((item?.totalAmount - item?.taxAmount).toString()).toFixed(2);
    return Diff;
  }

  PrintVoucher(obj:any){
    this._printreportsService.PrintVoucher(obj.invoiceId,4).subscribe(data=>{
      var PDFPath=environment.PhotoURL+data.reasonPhrase;
      printJS({printable:PDFPath, type:'pdf', showModal:true});
    });
  }
  // PrintJournal(){
  //   this._printreportsService.PrintJournalsVyInvIdRet(this.RowInvoiceData.invoiceId).subscribe(data=>{
  //     var PDFPath=environment.PhotoURL+data.reasonPhrase;
  //     printJS({printable:PDFPath, type:'pdf', showModal:true});
  //   });
  // }

  PrintJournal() {
    if (this.AllJournalEntries.length>0) {
      this.print.print('reportaccountingentryModal', environment.printConfig);
    }
  }

//------------------------------------------------------------------------------

exportData() {
  let x = [];
  for (let index = 0; index < this.projectsDataSourceTemp.length; index++) {
    x.push({
      'الحالة': this.projectsDataSourceTemp[index].radName,
      'المبلغ بعد الضريبة': this.projectsDataSourceTemp[index].totalValue,
      'الضريبة': this.projectsDataSourceTemp[index].taxAmount,
      'المبلغ بدون ضريبة': this.projectsDataSourceTemp[index].invoiceValue,
      'أسم العميل': this.projectsDataSourceTemp[index].customerName,
      'البيان': this.projectsDataSourceTemp[index].notes,
      'رقم القيد': this.projectsDataSourceTemp[index].journalNumber,
      'نوع الدفع': this.projectsDataSourceTemp[index].payTypeName,
      'رقم الفاتورة': this.projectsDataSourceTemp[index].invoiceNumber,
      'تاريخه': this.projectsDataSourceTemp[index].date,
      'رقم المردود': this.projectsDataSourceTemp[index].invoiceRetId,

    })
  }
  this.lang == "ar" ? this._accountsreportsService.customExportExcel(x, "مردودات المبيعات") :
    this._accountsreportsService.customExportExcel(x, "Sales returns");
}
}
