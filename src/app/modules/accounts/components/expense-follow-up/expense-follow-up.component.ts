import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FileUploadControl, FileUploadValidators } from '@iplab/ngx-file-upload';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
import { NgxPrintElementService } from 'ngx-print-element';

@Component({
  selector: 'app-expense-follow-up',
  templateUrl: './expense-follow-up.component.html',
  styleUrls: ['./expense-follow-up.component.scss']
})

export class ExpenseFollowUpComponent implements OnInit{

  addInvoice() {}

  editInvoice() {}

  showTable : boolean = false ;

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
      ar:'متابعة المصروفات',
      en:'Expense follow-up',
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

  projectDisplayedColumns: string[] = [
    'BondNumber',
    'BondDate',
    'RegistrationNumber',
    'SupplierTaxNumber',
    'ResourceName',
    'PurchaseInvoiceNumber',
    'exchangeClause',
    'Statement',
    'principalAmount',
    'Tax',
    'amount',
  ];
  lang: any = 'ar';

  constructor(private modalService: NgbModal,
    private _accountsreportsService: AccountsreportsService,
    private _sharedService: SharedService,
    private api: RestApiService,
    private print: NgxPrintElementService,
    private toast: ToastrService,
    private translate: TranslateService,) {
    this.dataSource = new MatTableDataSource([{}]);
    api.lang.subscribe((res) => {
      this.lang = res;
    });
  }
  expenseType: any;
  ngOnInit(): void {
    this.RefreshData();
    this.FillAccountsSelect();
    this.expenseType = [
      { id: 1, name: { ar: 'الكل', en: 'All' } },
      { id: 2, name: { ar: 'خاضعة للضريبة', en: 'Taxable' } },
      { id: 3, name: { ar: 'غير خاضعة للضريبة', en: 'Not taxable' } },
    ];
  }

  open(content: any, data?: any, type?: any) {

    this.modalService
      this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type == 'edit' ? 'xl' : 'lg' ,
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

  get totalprice() {
    var sum=0;
    this.projectsDataSourcedata.forEach((element: any) => {
      sum=+parseFloat(sum.toString()).toFixed(2)+ +parseFloat(element.price.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }

  get totaltaxes() {
    var sum=0;
    this.projectsDataSourcedata.forEach((element: any) => {
      sum=+parseFloat(sum.toString()).toFixed(2)+ +parseFloat(element.taxes.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }
  get totaltotal() {
    var sum=0;
    this.projectsDataSourcedata.forEach((element: any) => {
      sum=+parseFloat(sum.toString()).toFixed(2)+ +parseFloat(element.total.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
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
      search_expenseType:null,
      DateFrom_P :null,
      DateTo_P :null,
      isChecked:false,
    }
  };
  projectsDataSource = new MatTableDataSource();
  projectsDataSourceTemp:any=[];
  projectsDataSourcedata:any=[];

  RefreshData(){
    debugger
    const formData: FormData = new FormData();
    if(this.data.filter.search_accountId!=null)
    {
      formData.append('AccountId',this.data.filter.search_accountId);
    }
    if(this.data.filter.DateFrom_P!=null && this.data.filter.DateTo_P!=null)
    {
      formData.append('FromDate',this.data.filter.DateFrom_P);
      formData.append('ToDate',this.data.filter.DateTo_P);

    }
    formData.append('ExpenseType', String(this.data.filter.search_expenseType));

    this._accountsreportsService.GetDetailedExpensesd(formData).subscribe(data=>{
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
  exportData() {
    let x = [];

    for (let index = 0; index < this.projectsDataSourcedata.length; index++) {

      x.push({
        invoiceReference: this.projectsDataSourcedata[index].invoiceReference,
        date: this.projectsDataSourcedata[index].date,
        jorNo: this.projectsDataSourcedata[index].jorNo,
        supplierTaxNo: this.projectsDataSourcedata[index].supplierTaxNo,
        accSupplierName: this.projectsDataSourcedata[index].accSupplierName,
        supplierInvoiceNo: this.projectsDataSourcedata[index].supplierInvoiceNo,
        accClauseName: this.projectsDataSourcedata[index].accClauseName,
        details: this.projectsDataSourcedata[index].details,
        price:parseFloat( this.projectsDataSourcedata[index].price),
        taxes:parseFloat( this.projectsDataSourcedata[index].taxes),
        total:parseFloat( this.projectsDataSourcedata[index].total),
      })
      x.push({
        invoiceReference:null,
        date:null,
        jorNo:null,
        supplierTaxNo:'الاجمالي',
        accSupplierName:null,
        supplierInvoiceNo:null,
        accClauseName:null,
        details:null,
        price:parseFloat(this.totalprice),
        taxes:parseFloat(this.totaltaxes),
        total:parseFloat(this.totaltotal),
      })
    }
    this.lang == "ar" ? this._accountsreportsService.customExportExcel(x, "متابعة المصروفات") :
      this._accountsreportsService.customExportExcel(x, "Expense follow-up");
  }
  OrganizationData:any
  environmentPho:any
  dateprint:any
  printprojectsDataSource: any = []
    BranchName: any;

  getPrintdata(id: any) {
    const formData: FormData = new FormData();
    if(this.data.filter.search_accountId!=null)
    {
      formData.append('AccountId',this.data.filter.search_accountId);
    }
    if(this.data.filter.DateFrom_P!=null && this.data.filter.DateTo_P!=null)
    {
      formData.append('FromDate',this.data.filter.DateFrom_P);
      formData.append('ToDate',this.data.filter.DateTo_P);
    }
    formData.append('ExpenseType', String(this.data.filter.search_expenseType??1));
  
    let Sortedlist:any = []
    this.projectsDataSourcedata.forEach((element: any) => {
      Sortedlist.push(element.transactionId)
    });
    formData.append('Sortedlist', Sortedlist.toString());
    this._accountsreportsService.DetailedExpensesdReportGrid(formData).subscribe((data: any) => {

      this.dateprint =  data.dateTimeNow
      this.OrganizationData = data.org_VD;
                    this.BranchName = data.branchName;

      this.environmentPho=environment.PhotoURL+this.OrganizationData.logoUrl;

      this.printprojectsDataSource = data.result;

      setTimeout(() => {
        this.print.print(id, environment.printConfig);
      }, 1000);
    }, (err) => {
    }
    );

  }
  get totalpricePrint() {
    var sum=0;
    this.printprojectsDataSource.forEach((element: any) => {
      sum=+parseFloat(sum.toString()).toFixed(2)+ +parseFloat(element.price.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }
  get totaltaxesPrint() {
    var sum=0;
    this.printprojectsDataSource.forEach((element: any) => {
      sum=+parseFloat(sum.toString()).toFixed(2)+ +parseFloat(element.taxes.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }
  get totaltotalPrint() {
    var sum=0;
    this.printprojectsDataSource.forEach((element: any) => {
      sum=+parseFloat(sum.toString()).toFixed(2)+ +parseFloat(element.total.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }
}
