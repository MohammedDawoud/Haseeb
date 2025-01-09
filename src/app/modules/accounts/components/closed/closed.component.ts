import {Component, OnInit,ViewChild,AfterViewInit,TemplateRef, HostListener,} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxPrintElementService } from 'ngx-print-element';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {FileUploadControl,FileUploadValidators,} from '@iplab/ngx-file-upload';
import { InvoiceService } from 'src/app/core/services/acc_Services/invoice.service';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { VoucherFilterVM } from 'src/app/core/Classes/ViewModels/voucherFilterVM';
import { SharedService } from 'src/app/core/services/shared.service';
import { Invoices } from 'src/app/core/Classes/DomainObjects/invoices';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import printJS from 'print-js'
import { ClosedvoucherService } from 'src/app/core/services/acc_Services/closedvoucher.service';
import 'hijri-date';
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import { PrintreportsService } from 'src/app/core/services/acc_Services/printreports.service';
const hijriSafe= require('hijri-date/lib/safe');
const HijriDate =  hijriSafe.default;
const toHijri  = hijriSafe.toHijri;


@Component({
  selector: 'app-closed',
  templateUrl: './closed.component.html',
  styleUrls: ['./closed.component.scss']
})
export class ClosedComponent implements OnInit {


  projects: any;

  title: any = {
    main: {
      name: {
        ar: 'الحسابات',
        en: 'Projects Management',
      },
      link: '/accounts',
    },
    sub: {
      ar: ' قيد اقفال ',
      en: 'Closed',
    },
  };



  selectedUser: any;
  users: any;

  closeResult = '';

  showStats = false;
  showFilters = false;
  showPrice = false;

  @ViewChild(DatatableComponent) table: DatatableComponent | any;

  columns: any = [];

  isEditable: any = {};

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

  currentDate: any;

  selectedProject: any;
  selectedRow: any;

  selectAllValue = false;

  projectDisplayedColumns: string[] = [
    // 'select',
    'BondNumber',
    'BondDate',
    'BondTotal',
    // 'RegistrationNumber',
    'BondCondition',
    'PostingDate',
    // 'BondAttachments',
    'operations',
  ];

  modalClosedVoucher: any = {
    InvoiceId:0,
    InvoiceNumber: null,
    JournalNumber: null,
    Date: new Date(),
    HijriDate: null,
    Notes: null,
    InvoiceNotes: null,
    Type: 25,
    InvoiceValue: 0,
    InvoiceReference: null,
    VoucherAdjustment:false,
    DunCalc:false,
    CostCenterId: null,
    Reference:null,
    TotalCredit:0,
    TotalDepit:0,
    diff:0,
    WhichClick:1,
    addUser:null,
    addDate:null,
    addedImg:null,
  };

  resetClosedData(){
    this.uploadedFiles= [];
    //this.ClosedVoucherDetailsRows=[];
    this.load_CostCenter=[];
    const DateHijri =toHijri(new Date());
    var DateGre = new HijriDate(DateHijri._year, DateHijri._month, DateHijri._date);
    DateGre._day=DateGre._date;

    this.modalClosedVoucher = {
      InvoiceId:0,
      InvoiceNumber: null,
      JournalNumber: null,
      Date: new Date(),
      HijriDate: DateGre,
      Notes: null,
      InvoiceNotes: null,
      Type: 25,
      InvoiceValue: 0,
      InvoiceReference: null,
      VoucherAdjustment:false,
      DunCalc:false,
      CostCenterId: null,
      Reference:null,
      TotalCredit:0,
      TotalDepit:0,
      diff:0,
      WhichClick:1,
      addUser:null,
      addDate:null,
      addedImg:null,
    };
  }


  userG : any = {};

  startDate = new Date();
  endDate = new Date();
  constructor(private modalService: NgbModal,
    private _closedvoucherService: ClosedvoucherService,
    private _invoiceService: InvoiceService,
    private _accountsreportsService: AccountsreportsService,
    private toast: ToastrService,
    private translate: TranslateService,
    private _sharedService: SharedService,
    private print: NgxPrintElementService,
    private authenticationService: AuthenticationService,
    private _printreportsService: PrintreportsService,


    ) {
      this.userG = this.authenticationService.userGlobalObj;

      this.LoadDataClosedVoucher();
      this.currentDate = new Date();
    }



  dataClosedVoucher: any = {
    filter: {
      enable: false,
      date: null,
      search_Number :null,
      invoiceNote :null,
      search_Input :null,
      DateFrom_P :null,
      DateTo_P :null,
      isSearch:false,
      StatusPost:null,
      Desc:null,
      Type:25,
      AllClosedVoucher:false,
    }
  };
  ClosedVoucherDataSource = new MatTableDataSource();
  ClosedVoucherSourceTemp:any=[];

  LoadDataClosedVoucher(){
    var _voucherFilterVM=new VoucherFilterVM();
    _voucherFilterVM.type=this.dataClosedVoucher.filter.Type;
    // _voucherFilterVM.voucherNo=this.dataClosedVoucher.filter.search_Number;
    // _voucherFilterVM.invoiceNote=this.dataClosedVoucher.filter.invoiceNote;
    if(this.dataClosedVoucher.filter.DateFrom_P!=null && this.dataClosedVoucher.filter.DateFrom_P !=null)
    {
      _voucherFilterVM.dateFrom=this.dataClosedVoucher.filter.DateFrom_P;
      _voucherFilterVM.dateTo=this.dataClosedVoucher.filter.DateTo_P;
      _voucherFilterVM.isChecked=true;
    }
    else{
      _voucherFilterVM.dateFrom=null;
      _voucherFilterVM.dateTo=null;
      _voucherFilterVM.isChecked=false;
    }
    if(this.dataClosedVoucher.filter.StatusPost>0)_voucherFilterVM.isSearch=true;
    else _voucherFilterVM.isSearch=this.dataClosedVoucher.filter.isSearch;

    _voucherFilterVM.isPost=this.dataClosedVoucher.filter.StatusPost;
    var obj=_voucherFilterVM;
    this._closedvoucherService.GetAllVouchersNew(obj).subscribe(data=>{
      this.ClosedVoucherDataSource = new MatTableDataSource(data);
      this.ClosedVoucherSourceTemp=data;
      this.ClosedVoucherDataSource.paginator = this.paginator;
      this.ClosedVoucherDataSource.sort = this.sort;
    });
  }
  ResetRefresh(){
    if(this.showFilters==false)
    {
      this.dataClosedVoucher.filter.DateFrom_P=null;
      this.dataClosedVoucher.filter.DateTo_P=null;
      this.dataClosedVoucher.filter.date=null;
      this.dataClosedVoucher.filter.StatusPost=null;
      this.dataClosedVoucher.filter.search_Input=null;
      this.LoadDataClosedVoucher();
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ClosedVoucherDataSource.filter = filterValue.trim().toLowerCase();
  }
  CheckDate(event: any){
    this.dataClosedVoucher.filter.isSearch=true;
    if(event!=null)
    {
      this.dataClosedVoucher.filter.DateFrom_P= this._sharedService.date_TO_String(event[0]);
      this.dataClosedVoucher.filter.DateTo_P= this._sharedService.date_TO_String(event[1]);
      this.LoadDataClosedVoucher();
    }
    else{
      this.dataClosedVoucher.filter.DateFrom_P=null;
      this.dataClosedVoucher.filter.DateTo_P=null;
      this.LoadDataClosedVoucher();
    }
  }
  getColorStatus(element:any)
  {
    if((element?.isPost==true && element?.rad != 1)){return "#30b550";}
    else if((element?.isPost!=true && element?.rad != 1)){return "#c51313";}
    else{return "#000000";}
  }
  ClosedVouchertype: any;

  ngOnInit(): void {
    this.ClosedVouchertype = [
      { id: 1, name: { ar: 'تم الترحيل', en: 'Posted' } },
      { id: 2, name: { ar: 'غير مرحل', en: 'Not Posted' } },
    ];
  }

  load_CostCenter:any;
  FillCostCenterSelect(){
    this._invoiceService.FillCostCenterSelect().subscribe(data=>{
      this.load_CostCenter=data;
      this.CostCenterListDataSource = new MatTableDataSource(data);
      this.CostCenterListDataSource.paginator = this.paginatorCostCenter;
      this.CostCenterList=data;
      this.CostCenterListDataSourceTemp=data;
    });
  }
  //dawoud

  GetClosingVouchers(){
    this.ClosedVoucherDetailsRows=[];
    this._closedvoucherService.GetClosingVouchers().subscribe(data=>{
      var TotalCredit = 0; var TotalDepit = 0;
      if(data.result.length>0)
      {
        debugger
        data.result.forEach((element: any) => {
          var Credit = 0; var Depit = 0;
          if (+element.totalDepit < +element.totalCredit) {
              Credit = +parseFloat(element.totalCredit); Depit = 0;
              TotalCredit = (+TotalCredit) + (+Credit);
          }
          if (+element.totalCredit < +element.totalDepit) {
              Credit = 0; Depit = +parseFloat(element.totalDepit);
              TotalDepit = (+TotalDepit) + (+Depit);
          }
          var maxVal=0;
          if(this.ClosedVoucherDetailsRows.length>0)
          {
            maxVal = Math.max(...this.ClosedVoucherDetailsRows.map((o: { idRow: any; }) => o.idRow))
          }
          else{
            maxVal=0;
          }
          this.ClosedVoucherDetailsRows?.push({
            idRow: maxVal+1,
            Amounttxt: element.creditDepit,
            AccJournalid: element.accountId,
            accountJournaltxt:element.accountName,
            CreditDepitStatus:Credit>Depit?"D":"C",
            CostCenterId: element.costCenterId,
            CostCenterName: element.costCenterName,
            Notes: element.notes,
            InvoiceReference: element.invoiceReference,
            // AccCalcExpen:element.accCalcExpen,
            // AccCalcIncome:element.accCalcIncome,
          });

        });
        this.modalClosedVoucher.TotalCredit=parseFloat((TotalCredit).toString()).toFixed(2);
        this.modalClosedVoucher.TotalDepit=parseFloat((TotalDepit).toString()).toFixed(2);
        this.modalClosedVoucher.diff=parseFloat((+TotalDepit - +TotalCredit).toString()).toFixed(2);
      }
      else
      {
        this.ClosedVoucherDetailsRows=[];
      }
    });
  }



  ClosedVoucherPopup(){
    this.FillCostCenterSelect();
    this.FillSubAccountLoadTable();
    this.resetClosedData();
    this.GenerateClosedVoucherNumber();
    this.GetClosingVouchers();
  }
  GetAllTransByVoucherId(inv:any){
    this.ClosedVoucherDetailsRows=[];
    this._closedvoucherService.GetAllTransByVoucherId(inv).subscribe(data=>{
      var TotalCredit = 0; var TotalDepit = 0;
      if(data.result.length>0)
      {
        data.result.forEach((element: any) => {
          var Credit = 0; var Depit = 0;
          if (element.depit < element.credit) {
              Credit = parseFloat(element.credit); Depit = 0;
              TotalCredit = TotalCredit + Credit;
          }
          if (element.credit < element.depit) {
              Credit = 0; Depit = element.depit;
              TotalDepit = TotalDepit + Depit;
          }
          var maxVal=0;
          if(this.ClosedVoucherDetailsRows.length>0)
          {
            maxVal = Math.max(...this.ClosedVoucherDetailsRows.map((o: { idRow: any; }) => o.idRow))
          }
          else{
            maxVal=0;
          }
          this.ClosedVoucherDetailsRows?.push({
            idRow: maxVal+1,
            Amounttxt: element.amount,
            AccJournalid: element.accountId,
            accountJournaltxt:element.accountName,
            CreditDepitStatus:Credit>Depit?"C":"D",
            CostCenterId: element.costCenterId,
            CostCenterName: element.costCenterName,
            Notes: element.notes,
            InvoiceReference: element.invoiceReference,
            AccCalcExpen:element.accCalcExpen,
            AccCalcIncome:element.accCalcIncome,
          });

        });
        this.modalClosedVoucher.TotalCredit=parseFloat((TotalCredit).toString()).toFixed(2);
        this.modalClosedVoucher.TotalDepit=parseFloat((TotalDepit).toString()).toFixed(2);
        this.modalClosedVoucher.diff=parseFloat((TotalDepit - TotalCredit).toString()).toFixed(2);
      }
      else
      {
        this.ClosedVoucherDetailsRows=[];
      }
    });
  }
  EditClosedVoucherPopup(data:any){
    this.resetClosedData();
    this.ClosedVoucherDetailsRows=[];
    this.GetAllTransByVoucherId(data.invoiceId);

    const DateHijri =toHijri(this._sharedService.String_TO_date(data.date));
    var DateGre = new HijriDate(DateHijri._year, DateHijri._month, DateHijri._date);
    DateGre._day=DateGre._date;

    this.modalClosedVoucher = {
      InvoiceId:data.invoiceId,
      InvoiceNumber: data.invoiceNumber,
      JournalNumber: data.journalNumber,
      Date:this._sharedService.String_TO_date(data.date),
      HijriDate: DateGre,
      Notes: data.notes,
      InvoiceNotes: data.invoiceNotes,
      Type: 25,
      InvoiceValue: 0,
      InvoiceReference: data.invoiceReference,
      VoucherAdjustment:data.voucherAdjustment,
      DunCalc:data.dunCalc,
      CostCenterId: data.costCenterId,
      Reference:null,
      WhichClick:1,
      addUser:data.addUser,
      addDate:data.addDate,
      addedImg:data.addInvoiceImg,
    };

    this.FillCostCenterSelect();
    this.FillSubAccountLoadTable();
  }

  ClosedVoucherDetailsRows:any=[];

  GenerateClosedVoucherNumber(){
    this._invoiceService.GenerateVoucherNumber(this.modalClosedVoucher.Type).subscribe(data=>{
      this.modalClosedVoucher.InvoiceNumber=data.reasonPhrase;
      //this.ClosedVoucherDetailsRows=[];
      //this.addClosedVoucherRow();
    });
  }

  ngAfterViewInit() {}
  confirmClosedVoucher(){
    this._closedvoucherService.DeleteVoucher(this.RowEntryVouvherData.invoiceId).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.LoadDataClosedVoucher();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
    });
  }
  InvoicesIds: any = [];
  WhichPost:number=1;
  WhichTypeAddEditView:number=1;

  RowEntryVouvherData: any;
  selectedAccountRowTable: any;
  selectedCostCenterRowTable: any;

  open(content: any, data?: any, type?: any, idRow?: any) {
    if (data && type == 'edit') {
      this.modalClosedVoucher = data;
    }
    if (idRow != null && type=="AccountsListModal") {
      this.selectedAccountRowTable = idRow;
      this.FillSubAccountLoadTable();
    }
    if (idRow != null && type=="CostCenterListModal") {
      this.selectedCostCenterRowTable = idRow;
      this.FillCostCenterSelect();
    }
    if(data)
    {
      this.RowEntryVouvherData=data;
    }
    if(type=="ClosedVoucherModal")
    {
      this.WhichTypeAddEditView=1;
      this.ClosedVoucherPopup();
    }
    else if(type=="EditClosedVoucherModal")
    {
      this.WhichTypeAddEditView=2;
      this.EditClosedVoucherPopup(data);
    }
    else if(type=="ViewClosedVoucherModal")
    {
      this.WhichTypeAddEditView=3;
      this.EditClosedVoucherPopup(data);
    }

    else if(type=="accountingentry")
    {
      this.GetAllJournalsByInvID(data.invoiceId);
    }
    else if(type=="postModal")
    {
      this.WhichPost=1;
    }
    else if(type=="postModalCheckbox")
    {
      this.WhichPost=2;
    }
    this.modalService

      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
        centered: type ? false : true,
        backdrop : 'static',
        keyboard : false
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

  ShowImg(pho:any) {
    var img=environment.PhotoURL+pho;
    return img;
  }
  //----------------------btn----------------------------
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
  GetAllJournalsByInvID(invid:any){
    this._closedvoucherService.GetAllJournalsByClosingID(invid).subscribe(data=>{
      this.AllJournalEntries=data.result;
    });
  }

  ChangeAccCalc(index:any,type:any){
    var CalcExpen=this.ClosedVoucherDetailsRows.filter((a: { idRow: any; })=>a.idRow==index)[0].AccCalcExpen;
    var CalcIncome=this.ClosedVoucherDetailsRows.filter((a: { idRow: any; })=>a.idRow==index)[0].AccCalcIncome;
    if(type==1)
    {
      if(CalcExpen==true && CalcIncome==true)
      {
        this.ClosedVoucherDetailsRows.filter((a: { idRow: any; })=>a.idRow==index)[0].AccCalcIncome=false;
      }
    }
    else
    {
      if(CalcIncome==true && CalcExpen==true)
      {
        this.ClosedVoucherDetailsRows.filter((a: { idRow: any; })=>a.idRow==index)[0].AccCalcExpen=false;
      }
    }
  }

  postbtn(){
    this.InvoicesIds=[];
    if(this.WhichPost==2)
    {
      this.selection.selected.forEach((element: any) => {
        this.InvoicesIds.push(element.invoiceId);
      });
    }
    else
    {
      this.InvoicesIds.push(this.RowEntryVouvherData.invoiceId);
    }
    if(this.InvoicesIds)
    {
      this._invoiceService.PostVouchersCheckBox(this.InvoicesIds).subscribe((result: any)=>{
        if(result?.body?.statusCode==200){
          this.toast.success(this.translate.instant(result?.body?.reasonPhrase),this.translate.instant('Message'));

          this.LoadDataClosedVoucher();
          this.selection.clear();
        }
        else if(result?.type==0)
        {}
        else{this.toast.error(this.translate.instant(result?.body?.reasonPhrase),this.translate.instant('Message'));}
      });
    }
    else{
      this.toast.error("من فضلك اختر مستخدم",'رسالة');
    }

   }
   InvoicesObjs: Invoices[] = [];
   invoice:any;
   public _invoices: Invoices;
   PostBackVouchers()
   {
    this.InvoicesObjs=[];
    this.InvoicesObjs.push(this.RowEntryVouvherData);

     var invoicesList:any=[];

     this.InvoicesObjs.forEach((element: any) => {
       this._invoices=new Invoices();
       this._invoices.invoiceId=element.invoiceId;
       this._invoices.type=element.type;
       invoicesList.push(this._invoices);
     });

     this._invoiceService.PostBackVouchers(invoicesList).subscribe((result: any)=>{
       if(result.statusCode==200){
         this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
         this.InvoicesObjs=[];
         this.LoadDataClosedVoucher();
       }
       else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
     });
   }



   deleteClosedVoucherRow(idRow: any) {
    let index = this.ClosedVoucherDetailsRows.findIndex((d: { idRow: any; }) => d.idRow == idRow);
    this.ClosedVoucherDetailsRows.splice(index, 1);
    this.CalculateClosedVoucher();
  }

  disableButtonSave_ClosedVoucher=false;
  AccountListdisplayedColumns: string[] = ['name'];
  CostCenterListdisplayedColumns: string[] = ['name'];

  addClosedVoucherRow() {

    var maxVal=0;
    if(this.ClosedVoucherDetailsRows.length>0)
    {
      maxVal = Math.max(...this.ClosedVoucherDetailsRows.map((o: { idRow: any; }) => o.idRow))
    }
    else{
      maxVal=0;
    }
    this.ClosedVoucherDetailsRows?.push({
      idRow: maxVal+1,
      Amounttxt: null,
      AccJournalid: null,
      accountJournaltxt:null,
      CreditDepitStatus: "D",
      CostCenterId: null,
      CostCenterName: null,
      Notes: null,
      InvoiceReference: null,
      AccCalcExpen:false,
      AccCalcIncome:false,
    });
  }


  CostCenterListDataSource = new MatTableDataSource();
  CostCenterListDataSourceTemp:any;
  CostCenterList: any;
  @ViewChild('paginatorCostCenter') paginatorCostCenter!: MatPaginator;
  setCostCenterRowValue(element: any) {
    this.ClosedVoucherDetailsRows.filter((a: { idRow: any; })=>a.idRow==this.selectedCostCenterRowTable)[0].CostCenterId = element.id;
    this.ClosedVoucherDetailsRows.filter((a: { idRow: any; })=>a.idRow==this.selectedCostCenterRowTable)[0].CostCenterName = element.name;
  }
  applyFilterCostCenterList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.CostCenterListDataSource.filter = filterValue.trim().toLowerCase();
  }
  //-----------------------------------------------------------------------------------

  AccountListDataSource = new MatTableDataSource();
  AccountListDataSourceTemp:any;
  AccountList: any;
  @ViewChild('paginatorAccount') paginatorAccount: MatPaginator;

  FillSubAccountLoadTable(){
    this._invoiceService.FillSubAccountLoad().subscribe(data=>{
      this.AccountListDataSource = new MatTableDataSource(data.result);
      this.AccountListDataSource.paginator = this.paginatorAccount;
      this.AccountList=data.result;
      this.AccountListDataSourceTemp=data.result;
    });
  }

  setAccountRowValue(element: any) {
    this.ClosedVoucherDetailsRows.filter((a: { idRow: any; })=>a.idRow==this.selectedAccountRowTable)[0].AccJournalid = element.id;
    this.ClosedVoucherDetailsRows.filter((a: { idRow: any; })=>a.idRow==this.selectedAccountRowTable)[0].accountJournaltxt = element.name;
  }
  applyFilterAccountsList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.AccountListDataSource.filter = filterValue.trim().toLowerCase();
  }
  journalDebitNmRows = 0;
  journalCreditNmRows = 0;
  CalculateClosedVoucher() {
    var totalDebit = 0,totalCredit = 0,totalBalance = 0; this.journalDebitNmRows = 0;this.journalCreditNmRows = 0;
    this.ClosedVoucherDetailsRows.forEach((element: any, index: any) => {
      var Value=0, Rate = 1;
      Value=element.Amounttxt;
      if(element.CreditDepitStatus=="D"){
          this.journalDebitNmRows += 1;
          totalDebit += (Value * Rate);
          totalBalance = +parseFloat((totalDebit - totalCredit).toString()).toFixed(2);
        }
        else {
          this.journalCreditNmRows += 1;
          totalCredit += (Value * Rate);
          totalBalance = +parseFloat((totalDebit - totalCredit).toString()).toFixed(2);
        }
    });
    this.modalClosedVoucher.TotalCredit=parseFloat((totalCredit).toString()).toFixed(2);
    this.modalClosedVoucher.TotalDepit=parseFloat((totalDebit).toString()).toFixed(2);
    this.modalClosedVoucher.diff=parseFloat((totalDebit - totalCredit).toString()).toFixed(2);
}
downloadFile(data: any) {
  try
  {
    var link=environment.PhotoURL+data.fileUrl;
    window.open(link, '_blank');
  }
  catch (error)
  {
    this.toast.error("تأكد من الملف", 'رسالة');
  }
}
//-----------------------------------------------------------------------------------
  saveClosedVoucher(modal:any){
    if(!(parseInt(this.modalClosedVoucher.TotalDepit)>0 && parseInt(this.modalClosedVoucher.diff)==0))
    {
      this.toast.error("من فضلك أدخل قيم صحيحة للقيد", 'رسالة');
      return;
    }
    var VoucherDetailsList:any = [];
    var VoucherObj:any = {};
    VoucherObj.InvoiceId = this.modalClosedVoucher.InvoiceId;
    VoucherObj.InvoiceNumber = this.modalClosedVoucher.InvoiceNumber;
    VoucherObj.JournalNumber = this.modalClosedVoucher.JournalNumber;
    if(this.modalClosedVoucher.Date!=null)
    {
      VoucherObj.Date =this._sharedService.date_TO_String(this.modalClosedVoucher.Date);
      const nowHijri =toHijri(this.modalClosedVoucher.Date);
      VoucherObj.HijriDate= this._sharedService.hijri_TO_String(nowHijri);
    }
    VoucherObj.Notes = this.modalClosedVoucher.Notes;
    VoucherObj.InvoiceNotes = this.modalClosedVoucher.InvoiceNotes;
    VoucherObj.Type = this.modalClosedVoucher.Type;
    // VoucherObj.InvoiceValue = this.modalClosedVoucher.VoucherValue;
    VoucherObj.InvoiceReference = this.modalClosedVoucher.InvoiceReference;
    VoucherObj.CostCenterId = this.modalClosedVoucher.CostCenterId;
    VoucherObj.DunCalc=this.modalClosedVoucher.DunCalc;
    VoucherObj.VoucherAdjustment = this.modalClosedVoucher.VoucherAdjustment;;
    VoucherObj.IsPost = false;
    VoucherObj.InvoiceValue = parseFloat(this.modalClosedVoucher.TotalDepit.replace(/,/g, ''));

  var input = { valid: true, message: "" };
  var totalDepit = 0;
  var totalCredit = 0;

  this.ClosedVoucherDetailsRows.forEach((element: any, index: any) => {
    if (element.AccJournalid==null) {
      input.valid = false; input.message = "من فضلك أختر حساب ";return;
    }
    if (element.Amounttxt == null) {
      input.valid = false; input.message = "من فضلك أختر مبلغ صحيح";return;
    }

    var VoucherDetailsObj:any = {};
    VoucherDetailsObj.LineNumber = (index + 1);
    VoucherDetailsObj.AccountId = element.AccJournalid;
    VoucherDetailsObj.Amount = element.Amounttxt;
    VoucherDetailsObj.CostCenterId = element.CostCenterId;
    VoucherDetailsObj.AccCalcExpen=element.AccCalcExpen;
    VoucherDetailsObj.AccCalcIncome=element.AccCalcIncome;
    VoucherDetailsObj.Notes = VoucherDetailsObj.Details=element.Notes;
    VoucherDetailsObj.InvoiceReference=element.InvoiceReference;
    VoucherDetailsObj.Type = this.modalClosedVoucher.Type;
    VoucherDetailsObj.IsPost = false;

    if(element.CreditDepitStatus=="D"){
    VoucherDetailsObj.Depit = parseFloat(element.Amounttxt??0);
    VoucherDetailsObj.Credit = 0.00;
    totalDepit = totalDepit + VoucherDetailsObj.Depit;
    }
    else {
        VoucherDetailsObj.Credit = parseFloat(element.Amounttxt??0);
        VoucherDetailsObj.Depit = 0.00;
        totalCredit = totalCredit + VoucherDetailsObj.Credit;
    }

    VoucherDetailsList.push(VoucherDetailsObj);
  });
  if (!input.valid) {
    this.toast.error(input.message);return;
  }
  //VoucherObj.VoucherDetails = VoucherDetailsList;
  VoucherObj.TransactionDetails = VoucherDetailsList;

  if (!(parseFloat(totalCredit.toString()).toFixed(2) == parseFloat(totalDepit.toString()).toFixed(2))){
    this.toast.error("قيد غير متوازن",'رسالة');
  }
  this.disableButtonSave_ClosedVoucher = true;
  setTimeout(() => { this.disableButtonSave_ClosedVoucher = false }, 7000);
  if(this.modalClosedVoucher.WhichClick==1)
  {
    this._closedvoucherService.SaveClosingVoucher(VoucherObj).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.resetClosedData();
        this.LoadDataClosedVoucher();
        modal?.dismiss();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
    });
  }
  // else if(this.modalClosedVoucher.WhichClick==2)
  // {
  //   this._closedvoucherService.SaveandPostlosingVoucher(VoucherObj).subscribe((result: any)=>{
  //     if(result.statusCode==200){
  //       this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
  //       this.resetClosedData();
  //       this.LoadDataClosedVoucher();
  //       modal?.dismiss();
  //     }
  //     else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
  //   });

  // }
  }


  onSort(event: any) {
    console.log(event);
  }
  // ############### send sms


  modal?: BsModalRef;
  sendEMAIL(sms: any) {
    this.control.clear();
    this.modal?.hide();
  }

  public readonly control = new FileUploadControl(
    {
      listVisible: true,
      // accept: ['image/*'],
      discardInvalid: true,
      multiple: false,
    },
    [
      // FileUploadValidators.accept(['image/*']),
      FileUploadValidators.filesLimit(1),
    ]
  );
  public uploadedFiles: Array<File> = [];

  sendSMS(sms: any) {
    console.log(sms);
    this.modal?.hide();
  }

  // selection in table

  selection = new SelectionModel<any>(true, []);
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.ClosedVoucherDataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.ClosedVoucherDataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  existValue: any = false;

  //-----------------------------Print-------------------------------------
  items: any = [1, 2, 3, 4, 5, 6, 7, 8];
  lang: any = 'ar';

  ClosedVoucherPrintData:any=null;
  CustomData:any={
    OrgImg:null,
  }
  resetCustomData(){
    this.ClosedVoucherPrintData=null;
    this.CustomData={
      OrgImg:null,
    }
  }


  ClosingVoucherReport(obj:any){
    this._closedvoucherService.ClosingVoucherReport(obj.invoiceId).subscribe(data=>{
      this.ClosedVoucherPrintData=data;
      if(this.ClosedVoucherPrintData?.org_VD.logoUrl)
      this.CustomData.OrgImg=environment.PhotoURL+this.ClosedVoucherPrintData?.org_VD.logoUrl;
      else this.CustomData.OrgImg=null;

    });
  }

  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }
  Printdiffrentvoucher(){
    var _voucherFilterVM=new VoucherFilterVM();
    _voucherFilterVM.type=this.dataClosedVoucher.filter.Type;
    // _voucherFilterVM.voucherNo=this.dataClosedVoucher.filter.search_Number;
    // _voucherFilterVM.invoiceNote=this.dataClosedVoucher.filter.invoiceNote;
    if(this.dataClosedVoucher.filter.DateFrom_P!=null && this.dataClosedVoucher.filter.DateFrom_P !=null)
    {
      _voucherFilterVM.dateFrom=this.dataClosedVoucher.filter.DateFrom_P;
      _voucherFilterVM.dateTo=this.dataClosedVoucher.filter.DateTo_P;
      _voucherFilterVM.isChecked=true;
    }
    else{
      _voucherFilterVM.dateFrom=null;
      _voucherFilterVM.dateTo=null;
      _voucherFilterVM.isChecked=false;
    }
    if(this.dataClosedVoucher.filter.StatusPost>0)_voucherFilterVM.isSearch=true;
    else _voucherFilterVM.isSearch=this.dataClosedVoucher.filter.isSearch;

    _voucherFilterVM.isPost=this.dataClosedVoucher.filter.StatusPost;
    var obj=_voucherFilterVM;
    this._closedvoucherService.Printdiffrentvoucher(obj).subscribe(data=>{
      var PDFPath=environment.PhotoURL+data.reasonPhrase;
      printJS({printable:PDFPath, type:'pdf', showModal:true});
    });
  }



    //-------------------------------------------------------------
selectedDateType = DateType.Hijri;
//Date-Hijri
ChangeClosedVoucherGre(event:any){
  if(event!=null)
  {
    const DateHijri =toHijri(this.modalClosedVoucher.Date);
    var DateGre = new HijriDate(DateHijri._year, DateHijri._month, DateHijri._date);
    DateGre._day=DateGre._date;
    this.modalClosedVoucher.HijriDate=DateGre;
  }
  else{
    this.modalClosedVoucher.HijriDate=null;
  }
}
ChangeClosedVoucherHijri(event:any){
  if(event!=null)
  {
    const DateGre = new HijriDate(event.year, event.month, event.day);
    const dayGreg = DateGre.toGregorian();
    this.modalClosedVoucher.Date=dayGreg;
  }
  else{
    this.modalClosedVoucher.Date=null;
  }
}
PrintJournal(){
  this._printreportsService.PrintJournalsByClosingId(this.RowEntryVouvherData.invoiceId).subscribe(data=>{
    var PDFPath=environment.PhotoURL+data.reasonPhrase;
    printJS({printable:PDFPath, type:'pdf', showModal:true});
  });
}

    //#region
  //--------------------------------------------------
  key: any;
  isShift = false;

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
    this.isShift = !!event.shiftKey; // typecast to boolean
    if (this.isShift) {
      switch (this.key) {
        case 16: // ignore shift key
          break;
        default:
          if (event.code == 'KeyA') {
            this.addClosedVoucherRow();
          }
          break;
      }
    }
  }
  //#endregion
}
