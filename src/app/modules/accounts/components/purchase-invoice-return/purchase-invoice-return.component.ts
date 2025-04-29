
import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { environment } from 'src/environments/environment';
import { SelectionModel } from '@angular/cdk/collections';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { SharedService } from 'src/app/core/services/shared.service';
import { PrintreportsService } from 'src/app/core/services/acc_Services/printreports.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPrintElementService } from 'ngx-print-element';
import { VoucherFilterVM } from 'src/app/core/Classes/ViewModels/voucherFilterVM';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { RestApiService } from 'src/app/shared/services/api.service';
@Component({
  selector: 'app-purchase-invoice-return',
  templateUrl: './purchase-invoice-return.component.html',
  styleUrls: ['./purchase-invoice-return.component.scss']
})


export class PurchaseInvoiceReturnComponent implements OnInit{

  // data in runningTasksModal
  accountingEntries = [
    {
      date: '2023-07-01',
      bondNumber: '123',
      bondType: 'Type A',
      registrationNumber: '456',
      accountCode: '789',
      accountName: 'Account A',
      statement: 'Statement A',
      debtor: 100,
      creditor: 50
    },
    {
      date: '2023-07-02',
      bondNumber: '456',
      bondType: 'Type B',
      registrationNumber: '789',
      accountCode: '012',
      accountName: 'Account B',
      statement: 'Statement B',
      debtor: 200,
      creditor: 150
    }
  ];

  get totalDebtor() {
    return this.accountingEntries.reduce((total, entry) => total + entry.debtor, 0);
  }

  get totalCreditor() {
    return this.accountingEntries.reduce((total, entry) => total + entry.creditor, 0);
  }



  projects: any;
  @ViewChild('SmartFollower') smartModal: any;
  title: any = {
    main: {
      name: {
        ar: 'الحسابات',
        en: 'Projects Management',
      },
      link: '/accounts',
    },
    sub: {
      ar: ' مردود فاتورة المشتريات',
      en: 'Purchase invoice return',
    },
  };


  selectedUser: any;
  users: any;

  closeResult = '';


  showStats = false;
  showFilters = false;

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


  delayedProjects: any;
  latedProjects: any;

  currentDate: any;

  selectedProject: any;
  selectedRow: any;

  selectAllValue = false;

  selectedUserPermissions: any = {
    userName: '',
    watch: null,
    add: null,
    edit: null,
    delete: null,
  };
  userPermissions: any = [];


  userPermissionsColumns: string[] = [
    'userName',
    'watch',
    'add',
    'edit',
    'delete',
    'operations',
  ];
  projectGoalsColumns: string[] = [
    'serial',
    'requirements',
    'name',
    'duration',
    'choose',
  ];
  projectDisplayedColumns: string[] = [
    'invoiceRetId',
    'itsHistory',
    'invoiceNumber',
    'PaymentType',
    'RegistrationNumber',
    'Statement',
    'theAmount',
    'Tax',
    'Total',
    'theCondition',
    'operations',
  ];

  projectUsersColumns: string[] = ['name', 'responsibility'];
  projectTasksColumns: string[] = ['taskName', 'name', 'duration'];

  userPermissionsDataSource = new MatTableDataSource();

  projectGoalsDataSource = new MatTableDataSource();

  projectUsersDataSource = new MatTableDataSource();
  projectTasksDataSource = new MatTableDataSource();

  projectsDataSource = new MatTableDataSource();

  modalDetails: any = {
    returnNumber: null,
    projectDuration: null,
    branch: null,
    center: null,
    from: null,
    to: null,
    projectType: null,
    subProjectDetails: null,
    walk: null,
    customer: null,
    buildingType: null,
    service: null,
    user: null,
    region: null,
    projectDescription: null,
    offerPriceNumber: null,
    projectDepartment: null,
    projectPermissions: null,
    projectGoals: null,
  };

  rows = [
    { id: 1, name_ar: 'اسم النشاط 1', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط 2', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط 3', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
  ];
  temp: any = [
    { id: 1, name_ar: 'اسم النشاط 1', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط 2', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط 3', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
  ];

  projectGoals: any = [
    {
      serial: 'adawd',
      requirements: 'adawd',
      name: 'adawd',
      duration: 'adawd',
      choose: true,
    },
    {
      serial: 'adawd',
      requirements: 'adawd',
      name: 'adawd',
      duration: 'adawd',
      choose: false,
    },
    {
      serial: 'adawd',
      requirements: 'adawd',
      name: 'adawd',
      duration: 'adawd',
      choose: false,
    },
  ];

  projectUsers: any = [
    {
      name: 'adawd',
      image: '/assets/images/login-img.png',
      responsibility: 'adawd',
    },
    {
      name: 'adawd',
      image: '/assets/images/login-img.png',
      responsibility: 'adawd',
    },
    {
      name: 'adawd',
      image: '/assets/images/login-img.png',
      responsibility: 'adawd',
    },
  ];

  projectTasks: any = [
    {
      name: 'adawd',
      image: '/assets/images/login-img.png',
      taskName: 'adawd',
      duration: 4,
    },
    {
      name: 'adawd',
      image: '/assets/images/login-img.png',
      taskName: 'adawd',
      duration: 4,
    },
    {
      name: 'adawd',
      image: '/assets/images/login-img.png',
      taskName: 'adawd',
      duration: 4,
    },
  ];
  userG: any = {};
  lang: any = 'ar';
  startDate = new Date();
  endDate = new Date();
  constructor(private modalService: NgbModal,
    private _accountsreportsService: AccountsreportsService,
    private print: NgxPrintElementService,
    private _sharedService: SharedService, private authenticationService: AuthenticationService,
    private api: RestApiService,
    private _printreportsService: PrintreportsService,
    private toast: ToastrService,) {
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();
    api.lang.subscribe((res) => {
      this.lang = res;
    });
    this.userG = this.authenticationService.userGlobalObj;
  }
  invoicestatus: any = [];

  OrganizationData: any
  environmentPho: any
  dateprint: any
  ngOnInit(): void {

    this.RefreshData();
    this.FillAccountsSelect();
    this.invoicestatus = [
      { id: 1, name: { ar: 'ملغي', en: 'Canceled' } },
      { id: 2, name: { ar: 'ساري', en: 'not expired' } },
    ];

    this.api.GetOrganizationDataLogin().subscribe((data: any) => {
      this.OrganizationData = data.result;
      this.dateprint =this._sharedService.date_TO_String(new Date());
      this.environmentPho = environment.PhotoURL + this.OrganizationData.logoUrl;
    })
    this.projectsDataSource = new MatTableDataSource();

    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );

    this.projectGoalsDataSource = new MatTableDataSource(this.projectGoals);

    this.projectUsersDataSource = new MatTableDataSource(this.projectUsers);

    this.projectTasksDataSource = new MatTableDataSource(this.projectTasks);
  }

  ngAfterViewInit() {
    // this.open(this.smartModal, null, 'smartModal');
  }

  open(content: any, data?: any, type?: any) {
    if(type=="accountingentryModal"){
      this.GetAllJournalsByInvIDRetPurchase(data.invoiceId);
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



  load_accountIds:any;
  FillAccountsSelect(){
    this._accountsreportsService.FillAccountsSelect().subscribe(data=>{
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
      Type:1,
    }
  };


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectsDataSource.filter = filterValue.trim().toLowerCase();
  }

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
    this._accountsreportsService.GetAllVouchersRetPurchase(obj).subscribe(data=>{
      this.projectsDataSource = new MatTableDataSource(data);
      this.projectsDataSourcedata=data;
      this.projectsDataSourceTemp=data;
      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
    });
  }

  CheckDate(event: any) {
    if (event != null) {
      this.data.filter.DateFrom_P = this._sharedService.date_TO_String(event[0]);
      this.data.filter.DateTo_P = this._sharedService.date_TO_String(event[1]);
      this.RefreshData();
    }
    else {
      this.data.filter.DateFrom_P = null;
      this.data.filter.date = null;
      this.data.filter.DateTo_P = null;
      this.RefreshData();
    }
  }
  AllJournalEntries:any=[];
  GetAllJournalsByInvIDRetPurchase(invid:any){
    this._accountsreportsService.GetAllJournalsByInvIDRetPurchase(invid).subscribe(data=>{
      this.AllJournalEntries=data.result;
    });
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
  datePrintJournals: any = new Date()
  PrintJournalsVyInvIdRetPurchase() {
    if (this.AllJournalEntries[0].invoiceId) {
      this._accountsreportsService.PrintJournalsVyInvIdRetPurchase(this.AllJournalEntries[0].invoiceId).subscribe(data => {
        this.print.print('reportaccountingentryModal', environment.printConfig);
      });
    }
  }
  rowSelectedPublic:any=null;
  getInvoiceRow(row :any){
    this.rowSelectedPublic=row;
   }
   MakeJournal(){
    var VoucherObj:any = {};
    VoucherObj.InvoiceId = this.rowSelectedPublic.invoiceId;
    this._accountsreportsService.SavePurchaseForServicesRetNew(VoucherObj).subscribe((result: any)=>{
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
  GetInvoicePrint(obj:any,TempCheck:any){
    this.resetCustomData();
    this._accountsreportsService.ChangePurchase_PDF(obj.invoiceId,TempCheck).subscribe(data=>{
      this.InvPrintData=data;
      this.CustomData.PrintType=TempCheck;
      if(TempCheck==29)this.CustomData.PrintTypeName='اشعار دائن';
      else if(TempCheck==30)this.CustomData.PrintTypeName='اشعار مدين';
      else this.CustomData.PrintType=1;


      var TotalInvWithoutDisc=0;
      var netVal = 0;
      var DiscountValue_Det_Total_withqty=0;
      if(this.InvPrintData?.voucherDetailsVM_VD[0]?.taxType==3)
      {
        netVal = this.InvPrintData?.invoicesVM_VD?.totalValue;
        TotalInvWithoutDisc = this.InvPrintData?.invoicesVM_VD?.totalValue;
      }
      else
      {
        netVal = this.InvPrintData?.invoicesVM_VD?.invoiceValue;
        TotalInvWithoutDisc = this.InvPrintData?.invoicesVM_VD?.invoiceValue;
      }
      this.InvPrintData?.voucherDetailsVM_VD?.forEach((element: any) => {
        DiscountValue_Det_Total_withqty = DiscountValue_Det_Total_withqty + (element.discountValue_Det?? 0) ;
      });

      this.CustomData.DiscPer=parseFloat(((DiscountValue_Det_Total_withqty * 100) / ((TotalInvWithoutDisc + DiscountValue_Det_Total_withqty))).toString()).toFixed(2);
      this.CustomData.Disc=DiscountValue_Det_Total_withqty;
      this.CustomData.Total=TotalInvWithoutDisc+DiscountValue_Det_Total_withqty;
      this.CustomData.netVal=netVal;
      this.CustomData.TotalAfterDisc=TotalInvWithoutDisc;

      if (this.InvPrintData?.invoicesVM_VD.printBankAccount != true)
      {
        this.CustomData.Account1Bank = this.InvPrintData?.orgIsRequired_VD == true ? this.InvPrintData?.org_VD.accountBank : this.InvPrintData?.branch_VD.accountBank;
        this.CustomData.Account2Bank = this.InvPrintData?.orgIsRequired_VD == true ? this.InvPrintData?.org_VD.accountBank2 : this.InvPrintData?.branch_VD.accountBank2;
        this.CustomData.Account1Img = this.InvPrintData?.orgIsRequired_VD == true ? this.InvPrintData?.org_VD.bankIdImgURL : this.InvPrintData?.branch_VD.bankIdImgURL;
        this.CustomData.Account2Img = this.InvPrintData?.orgIsRequired_VD == true ? this.InvPrintData?.org_VD.bankId2ImgURL : this.InvPrintData?.branch_VD.bankId2ImgURL;
      }
      else
      {
        this.CustomData.Account1Bank=null;
        this.CustomData.Account2Bank=null;
        this.CustomData.Account1Img=null;
        this.CustomData.Account2Img=null;
      }
      if(this.CustomData.Account1Img)
      this.CustomData.Account1Img=environment.PhotoURL+this.CustomData.Account1Img;
      else this.CustomData.Account1Img=null;

      if(this.CustomData.Account2Img)
      this.CustomData.Account2Img=environment.PhotoURL+this.CustomData.Account2Img;
      else this.CustomData.Account2Img=null;
      if (this.InvPrintData?.branch_VD.isPrintInvoice == true && this.InvPrintData?.branch_VD.branchLogoUrl!="" && this.InvPrintData?.branch_VD.branchLogoUrl!=null)
      {
        this.CustomData.OrgImg=environment.PhotoURL+this.InvPrintData?.branch_VD.branchLogoUrl;
      }
      else{
        if(this.InvPrintData?.org_VD.logoUrl)
        this.CustomData.OrgImg=environment.PhotoURL+this.InvPrintData?.org_VD.logoUrl;
        else this.CustomData.OrgImg=null;
      }
      if (this.InvPrintData?.branch_VD.headerPrintInvoice == true && this.InvPrintData?.branch_VD.headerLogoUrl!="" && this.InvPrintData?.branch_VD.headerLogoUrl!=null)
      {
        this.CustomData.headerurl=environment.PhotoURL+this.InvPrintData?.branch_VD.headerLogoUrl;
      }
      else{
        this.CustomData.headerurl=null;
      }

      if (this.InvPrintData?.branch_VD.headerPrintInvoice == true && this.InvPrintData?.branch_VD.footerLogoUrl!="" && this.InvPrintData?.branch_VD.footerLogoUrl!=null)
      {
        this.CustomData.footerurl=environment.PhotoURL+this.InvPrintData?.branch_VD.footerLogoUrl;
      }
      else{
        this.CustomData.footerurl=null;
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

//------------------------------------------------------------------------------










  private getDismissReason(reason: any, type?: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  addProject() {}

  extend() {}
  skip() {}
  confirm() {}
  endProject() {}
  flagProject() {}
  unSaveProjectInTop() {}

  stopProject() {}
  addNewUserPermissions() {}

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.userPermissionsDataSource.filter = filterValue.trim().toLowerCase();
  // }
  applyGoalsFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectGoalsDataSource.filter = filterValue.trim().toLowerCase();
  }
  applyUsersFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectUsersDataSource.filter = filterValue.trim().toLowerCase();
  }
  applyTasksFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectTasksDataSource.filter = filterValue.trim().toLowerCase();
  }

  setSelectedUserPermissions(index: any) {
    let data = this.userPermissions[index];
    this.selectedUserPermissions = data;
  }

  setValues(event: any) {
    this.selectedUserPermissions['watch'] = event.target.checked;
    this.selectedUserPermissions['add'] = event.target.checked;
    this.selectedUserPermissions['edit'] = event.target.checked;
    this.selectedUserPermissions['delete'] = event.target.checked;
  }

  changeRequestStatus(event: any) {
    this.modalDetails.walk = event.target.checked;
  }

  saveOption(data: any) {}

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d: any) {
      return d.name_ar.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;

    if (this.table) {
      this.table!.offset = 0;
    }
  }

  // Save row
  save(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    console.log('Row saved: ' + rowIndex);
    console.log(row);
  }

  // Delete row
  delete(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    this.rows.splice(rowIndex, 1);
    console.log('Row deleted: ' + rowIndex);
  }

  selectGoalForProject(index: any) {}

  addNewMission() {}

  onSort(event: any) {
    console.log(event);
  }
// ############### send sms

  modal?: BsModalRef;
  sendEMAIL(sms: any) {
    console.log(sms);
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
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
   /** Selects all rows if they are not all selected; otherwise clear selection. */

   toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
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



}
