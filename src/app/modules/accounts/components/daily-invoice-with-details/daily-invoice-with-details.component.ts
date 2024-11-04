import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxPrintElementService } from 'ngx-print-element';
import { ToastrService } from 'ngx-toastr';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-daily-invoice-with-details',
  templateUrl: './daily-invoice-with-details.component.html',
  styleUrls: ['./daily-invoice-with-details.component.scss']
})
export class DailyInvoiceWithDetailsComponent {

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
      ar:' متابعة المبيعات والارباح اليومي',
      en:'Follow Up Daily Payments and Earns',
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
    'VoucherType',
    'Date',
    'InvoiceValue',
    'TaxAmount',
    'DiscountValue',
    'TotalValue',
    'Cost',
    'Mardod',
    'Earnings',
  ];
  lang: any = 'ar';
userG:any
  constructor(private modalService: NgbModal,
    private _accountsreportsService: AccountsreportsService,
    private _sharedService: SharedService,
    private api: RestApiService,
    private print: NgxPrintElementService,
    private toast: ToastrService,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,) {
    this.dataSource = new MatTableDataSource([{}]);
    this.GetOrganizationData();

    api.lang.subscribe((res) => {
      this.lang = res;
    });
    this.userG = this.authenticationService.userGlobalObj;
    
  }

  expenseType: any;
  ngOnInit(): void {
    this.Paytype = [
      { id: 1, name: { ar: 'نقدي', en: 'Monetary' } },
      { id: 8, name: { ar: 'آجل', en: 'Postpaid' } },
      {
        id: 17,
        name: { ar: 'نقدا نقاط بيع - مدى-ATM', en: 'Cash points of sale ATM' },
      },
      { id: 9, name: { ar: 'شبكة', en: 'Network' } },
      { id: 6, name: { ar: 'حوالة', en: 'Transfer' } },
    ];
    this.data.filter.date = new Date();
     this.RefreshData();
    // this.FillAccountsSelect();
    // this.expenseType = [
    //   { id: 1, name: { ar: 'الكل', en: 'All' } },
    //   { id: 2, name: { ar: 'خاضعة للضريبة', en: 'Taxable' } },
    //   { id: 3, name: { ar: 'غير خاضعة للضريبة', en: 'Not taxable' } },
    // ];
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
  logourl: any;
 GetOrganizationData() {
    this._sharedService.GetOrganizationData().subscribe((data) => {
      this.logourl = environment.PhotoURL + data.logoUrl;
    });
  }
  Paytype: any;

  private getDismissReason(reason: any, type?: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // get totalprice() {
  //   var sum=0;
  //   this.projectsDataSourcedata.forEach((element: any) => {
  //     sum=+parseFloat(sum.toString()).toFixed(2)+ +parseFloat(element.price.toString()).toFixed(2);
  //   });
  //   return parseFloat(sum.toString()).toFixed(2);
  // }

  // get totaltaxes() {
  //   var sum=0;
  //   this.projectsDataSourcedata.forEach((element: any) => {
  //     sum=+parseFloat(sum.toString()).toFixed(2)+ +parseFloat(element.taxes.toString()).toFixed(2);
  //   });
  //   return parseFloat(sum.toString()).toFixed(2);
  // }
  // get totaltotal() {
  //   var sum=0;
  //   this.projectsDataSourcedata.forEach((element: any) => {
  //     sum=+parseFloat(sum.toString()).toFixed(2)+ +parseFloat(element.total.toString()).toFixed(2);
  //   });
  //   return parseFloat(sum.toString()).toFixed(2);
  // }

  load_customerIds:any;
  FillAccountsSelect(){
    this._accountsreportsService.FillAllCustomer().subscribe(data=>{
      this.load_customerIds=data;
    });
  }
  data: any = {
    filter: {
      enable: false,
      date: null,
      customerId :null,
 
      isChecked:false,
    }
  };
  projectsDataSource = new MatTableDataSource();
  projectsDataSourceTemp:any=[];
  projectsDataSourcedata:any=[];

  reportdata: any;
  RefreshData(){
    debugger
    const formData: FormData = new FormData();
    if(this.data.filter.customerId!=null)
    {
      formData.append('CustomerId',this.data.filter.customerId);
    }
    if(this.data.filter.date!=null )
    {
      formData.append('Date',this._sharedService.date_TO_String(this.data.filter.date));

    }

    this._accountsreportsService.GetDayilypaymentsandearns(formData).subscribe(data => {
      debugger
      this.projectsDataSource = new MatTableDataSource(data.result);
      this.projectsDataSourcedata=data.result;
      this.projectsDataSourceTemp=data.result;
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
        'نوع الدفع': this.projectsDataSourcedata[index].payType,
        'تاريخ الفاتورة': this.projectsDataSourcedata[index].invoiceDate,
        'المبلغ':parseFloat( this.projectsDataSourcedata[index].invoiceValue),
        'الضريبه':parseFloat( this.projectsDataSourcedata[index].taxAmount),
        'الخصم': this.projectsDataSourcedata[index].discountValue,
        'الاجمالي':parseFloat( this.projectsDataSourcedata[index].totalValue),
        'التكلفه': this.projectsDataSourcedata[index].cost,
        'المردود': this.projectsDataSourcedata[index].mardod,
        'الربح': this.projectsDataSourcedata[index].earnings,
      })
    
    }
    this.lang == "ar" ? this._accountsreportsService.customExportExcel(x, " المبيعات والارباح اليومي") :
      this._accountsreportsService.customExportExcel(x, "Daily Payment and Earnings");
  }
  OrganizationData:any
  environmentPho:any
  dateprint:any
  printprojectsDataSource: any = []
    BranchName: any;

  getPrintdata(id: any) {
    // const formData: FormData = new FormData();
    // if(this.data.filter.search_accountId!=null)
    // {
    //   formData.append('AccountId',this.data.filter.search_accountId);
    // }
    // if(this.data.filter.DateFrom_P!=null && this.data.filter.DateTo_P!=null)
    // {
    //   formData.append('FromDate',this.data.filter.DateFrom_P);
    //   formData.append('ToDate',this.data.filter.DateTo_P);
    // }
    // formData.append('ExpenseType', String(this.data.filter.search_expenseType??1));
  
    // let Sortedlist:any = []
    // this.projectsDataSourcedata.forEach((element: any) => {
    //   Sortedlist.push(element.transactionId)
    // });
    // formData.append('Sortedlist', Sortedlist.toString());
    // this._accountsreportsService.DetailedExpensesdReportGrid(formData).subscribe((data: any) => {

      this.dateprint =  this._sharedService.date_TO_String(new Date())
    //   this.OrganizationData = data.org_VD;
    //                 this.BranchName = data.branchName;

    //   this.environmentPho=environment.PhotoURL+this.OrganizationData.logoUrl;

    //   this.printprojectsDataSource = data.result;

      setTimeout(() => {
        this.print.print(id, environment.printConfig);
      }, 1000);
    // }, (err) => {
    // }
    // );

  }
  // get totalpricePrint() {
  //   var sum=0;
  //   this.printprojectsDataSource.forEach((element: any) => {
  //     sum=+parseFloat(sum.toString()).toFixed(2)+ +parseFloat(element.price.toString()).toFixed(2);
  //   });
  //   return parseFloat(sum.toString()).toFixed(2);
  // }
  // get totaltaxesPrint() {
  //   var sum=0;
  //   this.printprojectsDataSource.forEach((element: any) => {
  //     sum=+parseFloat(sum.toString()).toFixed(2)+ +parseFloat(element.taxes.toString()).toFixed(2);
  //   });
  //   return parseFloat(sum.toString()).toFixed(2);
  // }
  // get totaltotalPrint() {
  //   var sum=0;
  //   this.printprojectsDataSource.forEach((element: any) => {
  //     sum=+parseFloat(sum.toString()).toFixed(2)+ +parseFloat(element.total.toString()).toFixed(2);
  //   });
  //   return parseFloat(sum.toString()).toFixed(2);
  // }
}
