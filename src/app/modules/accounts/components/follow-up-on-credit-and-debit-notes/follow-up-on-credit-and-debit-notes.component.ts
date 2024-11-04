import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FileUploadControl, FileUploadValidators } from '@iplab/ngx-file-upload';
import { BehaviorSubject, Subscription } from 'rxjs';
import { VoucherFilterVM } from 'src/app/core/Classes/ViewModels/voucherFilterVM';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NgxPrintElementService } from 'ngx-print-element';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
import printJS from 'print-js'
@Component({
  selector: 'app-follow-up-on-credit-and-debit-notes',
  templateUrl: './follow-up-on-credit-and-debit-notes.component.html',
  styleUrls: ['./follow-up-on-credit-and-debit-notes.component.scss']
})

export class FollowUpOnCreditAndDebitNotesComponent implements OnInit{

  addInvoice() {}

  editInvoice() {}

  showTable : boolean = false ;

  projects: any;
  projects2: any;
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
      ar: ' متابعة الأشعارات الدائنة و المدينة ',
      en:'Follow up on credit and debit notes',
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


  delayedProjects: any;
  latedProjects: any;

  currentDate: any;

  selectedProject: any;
  selectedRow: any;


  projectDisplayedColumns: string[] = [
    'date',
    'NoticeType',
    'invoiceNumber',
    'PaymentType',
    'RegistrationNumber',
    'Statement',
    'NameCustomer_supplier',
    'amount',
    'Tax',
    'Total',
    'operations'
  ];
  projectDisplayedColumns2: string[] = [
    'date',
    'NoticeType',
    'invoiceNumber',
    'PaymentType',
    'RegistrationNumber',
    'Statement',
    'NameCustomer_supplier',
    'amount',
    'Tax',
    'Total',
    'operations'
  ];

  projectsDataSource = new MatTableDataSource();
  projectsDataSource2 = new MatTableDataSource();

  lang: any = 'ar';

  startDate = new Date();
  endDate = new Date();
  constructor(private modalService: NgbModal,
    private _accountsreportsService: AccountsreportsService,
    private _sharedService: SharedService,
    private toast: ToastrService,
  private api: RestApiService,
  private print: NgxPrintElementService,
    private translate: TranslateService,) {
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();



  api.lang.subscribe((res) => {
    this.lang = res;
  });
  }
  ngOnInit(): void {

    this.RefreshData();
    this.FillCustomerSelect();
    // this.FillProjectSelect();
    this.FillSupplierSelect();

    this.api.GetOrganizationDataLogin().subscribe((data: any) => {
      this.OrganizationData = data.result
      this.dateprint = new Date()
      this.environmentPho = environment.PhotoURL + this.OrganizationData.logoUrl;
    })
  }


  open(content: any, data?: any, type?: any) {
    this.GetAllJournalsByInvIDCreditDepitNoti(data.invoiceId);

    this.modalService
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
    GetAllJournalsByInvIDCreditDepitNoti(invid:any){
      this._accountsreportsService.GetAllJournalsByInvIDCreditDepitNoti(invid).subscribe(data=>{
        console.log(data.result);
        this.AllJournalEntries=data.result;
      });
    }


    changetab($event:any){
      debugger
      if($event.index==0)
      {
        this.data.filter.TypeTab=2;
      }else{
        this.data.filter.TypeTab=1;
      }
      console.log($event);

      this.RefreshData();
    }
    load_customers:any;
    FillCustomerSelect(){
      this._accountsreportsService.FillAllCustomerSelectByAllNoti(0).subscribe(data=>{
        this.load_customers=data;
      });
    }
    load_projects:any;
    FillProjectSelect(){
      if(this.data.filter.search_CustomerName!=null)
      {
        this._accountsreportsService.FillAllProjectSelectByAllNoti(this.data.filter.search_CustomerName).subscribe(data=>{
          this.load_projects=data;
        });
      }
      else
      {
        this.load_projects=[];
      }

    }
    load_suppliers:any;
    FillSupplierSelect(){
      this._accountsreportsService.FillSuppliersAllNotiSelect().subscribe(data=>{
        this.load_suppliers=data;
      });
    }
    data: any = {
      filter: {
        enable: false,
        date: null,
        search_CustomerName :null,
        search_projectId :null,
        search_supplierId :null,
        DateFrom_P :null,
        DateTo_P :null,
        isChecked:false,
        TypeTab:2,
      }
    };
    projectsDataSourceTemp:any=[];
    projectsDataSourceTemp2:any=[];
    DataSource:any=[];
    RefreshData(){
      debugger
      var _voucherFilterVM=new VoucherFilterVM();
      _voucherFilterVM.type=this.data.filter.TypeTab;
      _voucherFilterVM.customerId=this.data.filter.search_CustomerName;
      _voucherFilterVM.supplierId=this.data.filter.search_supplierId??0;
      _voucherFilterVM.projectId=this.data.filter.search_projectId??0;
      if(this.data.filter.DateFrom_P!=null && this.data.filter.DateTo_P!=null){
        _voucherFilterVM.dateFrom=this.data.filter.DateFrom_P;
        _voucherFilterVM.dateTo=this.data.filter.DateTo_P;
        _voucherFilterVM.isSearch=true;
      }else{
        _voucherFilterVM.isSearch=false;
      }
      var obj=_voucherFilterVM;
      this._accountsreportsService.GetAllCreditDepitNotiReport(obj).subscribe(data=>{
        if(this.data.filter.TypeTab==2){
          this.projectsDataSource = new MatTableDataSource(data);
          this.DataSource=data;
          this.projectsDataSourceTemp=data;
          this.projectsDataSource.paginator = this.paginator;
          this.projectsDataSource.sort = this.sort;
        }
        else{
          this.projectsDataSource2 = new MatTableDataSource(data);
          this.DataSource=data;
          this.projectsDataSourceTemp2=data;
          this.projectsDataSource2.paginator = this.paginator;
          this.projectsDataSource2.sort = this.sort;
        }

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
        this.data.filter.date=null;
        this.RefreshData();
      }
    }
    applyFilter(event: any) {
      if(this.data.filter.TypeTab==2)
      {
        this.applyFiltertab_RE(event);
      }
      else
      {
        this.applyFiltertab_EX(event);
      }
    }
    applyFiltertab_RE(event: any) {
      debugger;
      const val = event.target.value.toLowerCase();
      const tempsource = this.projectsDataSourceTemp.filter(function (d: any) {
        return (d.date.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.transactionTypeName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.invoiceNumber.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.payTypeName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.journalNumber.toString().toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.notes.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.customerName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.invoiceValue.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.taxAmount.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.totalValue.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val);
      });
      this.projectsDataSource = new MatTableDataSource(tempsource);
      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
      this.DataSource =tempsource
    }
    applyFiltertab_EX(event: any) {
      debugger;
      const val = event.target.value.toLowerCase();
      const tempsource = this.projectsDataSourceTemp2.filter(function (d: any) {
        return (d.date.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.transactionTypeName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.invoiceNumber.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.payTypeName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.journalNumber.toString().toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.notes.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.customerName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.invoiceValue.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.taxAmount.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.totalValue.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val);
      });
      this.projectsDataSource2 = new MatTableDataSource(tempsource);
      this.projectsDataSource2.paginator = this.paginator;
      this.projectsDataSource2.sort = this.sort;
      this.DataSource =tempsource
    }

    datePrintJournals: any = new Date()
    PrintJournalsVyInvIdRetPurchase() {
      if (this.AllJournalEntries[0].invoiceId) {
        this.print.print('reportaccountingentryModal', environment.printConfig);
      }
    }



  exportData() {
    let x = [];

    for (let index = 0; index < this.DataSource.length; index++) {
      x.push({
        date: this.DataSource[index].date,
        transactionTypeName: this.DataSource[index].transactionTypeName,
        invoiceNumber: this.DataSource[index].invoiceNumber,
        payTypeName: this.DataSource[index].payTypeName,
        journalNumber: this.DataSource[index].journalNumber,
        notes: this.DataSource[index].notes,
        customerName: this.DataSource[index].customerName,
        invoiceValue:parseFloat( this.DataSource[index].invoiceValue),
        taxAmount:parseFloat( this.DataSource[index].taxAmount),
        totalValue:parseFloat( this.DataSource[index].totalValue),
      })
    }
    this.lang == "ar" ? this._accountsreportsService.customExportExcel(x, " متابعة الأشعارات الدائنة و المدينة") :
      this._accountsreportsService.customExportExcel(x, "Follow up on credit and debit notes");
  }
  OrganizationData:any
  environmentPho:any
  dateprint:any
  printprojectsDataSource: any
  getPrintdata(id: any) {
    var _voucherFilterVM=new VoucherFilterVM();
    _voucherFilterVM.type=this.data.filter.TypeTab;
    _voucherFilterVM.customerId=this.data.filter.search_CustomerName;
    _voucherFilterVM.supplierId=this.data.filter.search_supplierId;
    _voucherFilterVM.projectId=this.data.filter.search_projectId;
    if(this.data.filter.DateFrom_P!=null && this.data.filter.DateTo_P!=null){
      _voucherFilterVM.dateFrom=this.data.filter.DateFrom_P;
      _voucherFilterVM.dateTo=this.data.filter.DateTo_P;
    }
    var obj=_voucherFilterVM;
      // const formData: FormData = new FormData();
      // if(this.data.filter.search_accountId!=null)
      // {
      //   formData.append('Type',this.data.filter.TypeTab);
      // }
      // if(this.data.filter.CustomerId!=null)
      // {
      //   formData.append('CustomerId',this.data.filter.CustomerId);
      // }
      // if(this.data.filter.SupplierId!=null)
      // {
      //   formData.append('SupplierId',this.data.filter.SupplierId);
      // }
      // if(this.data.filter.ProjectId!=null)
      // {
      //   formData.append('ProjectId',this.data.filter.ProjectId);
      // }
      // if(this.data.filter.DateFrom_P!=null && this.data.filter.DateTo_P!=null)
      // {
      //   formData.append('FromDate',this.data.filter.DateFrom_P);
      //   formData.append('ToDate',this.data.filter.DateTo_P);
      // }
    this._accountsreportsService.VouchersCreditDepitNotiReport(obj).subscribe((data: any) => {

      var PDFPath=environment.PhotoURL+data.reasonPhrase;
      printJS({printable:PDFPath, type:'pdf', showModal:true});

      // this.dateprint =  data.dateTimeNow
      // this.OrganizationData = data.org_VD;
      // this.environmentPho=environment.PhotoURL+this.OrganizationData.logoUrl;

      // this.printprojectsDataSource = data.result;


      // setTimeout(() => {
      //   this.print.print(id, environment.printConfig);
      // }, 1000);
    }, (err) => {
    }
    );
  }
}
