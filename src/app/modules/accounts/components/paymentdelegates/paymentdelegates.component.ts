import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxPrintElementService } from 'ngx-print-element';
import { ToastrService } from 'ngx-toastr';
import { VoucherFilterVM } from 'src/app/core/Classes/ViewModels/voucherFilterVM';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-paymentdelegates',
  templateUrl: './paymentdelegates.component.html',
  styleUrls: ['./paymentdelegates.component.scss']
})
export class PaymentdelegatesComponent {

  addInvoice() { }

  editInvoice() { }

  showTable: boolean = false;

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
      ar: ' المندوبين',
      en: 'Delegates',
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
    'CustomerName',
    'InvoiceNumber',
    'PayType',
    'Date',
    'Notes',
    'InvoiceValue',
    'DiscountValue',
    'TotalValue',
    'PaidValue',
    'Remaining',
    'operations'
  ];
  projectDisplayedColumns2: string[] = [
    'CustomerName',
    'InvoiceNumber',
    'PayType',
    'Date',
    'Notes',
    'InvoiceValue',
    'DiscountValue',
    'TotalValue',
    'PaidValue',
    'Remaining',
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
    var date = new Date();
 const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.data.filter.DateFrom_P = this._sharedService.date_TO_String(firstDay);
    this.data.filter.DateTo_P = this._sharedService.date_TO_String(lastDay);

    this.RefreshData();
    this.FillAllUsersSelectAllByBranch();
 
  }


  open(content: any, data?: any, type?: any) {

    if(type=='accountingentryModal')
      this.GetInvoiceById(data.invoiceId);
    
    this.modalService
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type == 'accountingentryModal' ? 'xl' : 'lg',
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




  changetab($event: any) {
    debugger
    if ($event.index == 0) {
      this.data.filter.TypeTab = 2;
    } else {
      this.data.filter.TypeTab = 1;
    }
    console.log($event);

    this.RefreshData();
  }
  load_customers: any;
  FillAllUsersSelectAllByBranch() {
    this._accountsreportsService.FillAllUsersSelectAllByBranch().subscribe(data => {
      this.load_customers = data;
    });
  }
  load_projects: any;
  FillProjectSelect() {
    if (this.data.filter.search_CustomerName != null) {
      this._accountsreportsService.FillAllProjectSelectByAllNoti(this.data.filter.search_CustomerName).subscribe(data => {
        this.load_projects = data;
      });
    }
    else {
      this.load_projects = [];
    }

  }

  data: any = {
    filter: {
      enable: false,
      date: null,
      search_CustomerName: null,
      search_projectId: null,
      search_supplierId: null,
      DateFrom_P: null,
      DateTo_P: null,
      isChecked: false,
      TypeTab: 2,
    }
  };
  projectsDataSourceTemp: any = [];
  projectsDataSourceTemp2: any = [];
  DataSource: any = [];
  totalsdata: any = {
    totalPaid: 0,
    discountPaid: 0,
    totalPaidafterdiscount: 0,
    totalPaidEarnings: 0,
    totalMardod: 0,
    discountMardod: 0,
    totalMardodafterdiscount: 0,
    totalMardodEarnings: 0,
    sumTotal: 0,
    sumDiscount: 0,
    sumTotalafterdiscount: 0,
    sumEarnings:0,
  };
  RefreshData() {
    debugger
   const formData: FormData = new FormData();
    if(this.data.filter.customerId!=null)
    {
      formData.append('UserId',this.data.filter.customerId);
    }
    if(this.data.filter.DateTo_P!=null )
    {
      formData.append('EndDate',this.data.filter.DateTo_P);

    }
    if(this.data.filter.DateFrom_P!=null )
    {
      formData.append('StartDate',this.data.filter.DateFrom_P);

    }
    this._accountsreportsService.GetDelegates(formData).subscribe(data => {
      debugger
        this.projectsDataSource = new MatTableDataSource(data.result.invoicePaid);
        this.DataSource = data.result.invoicePaid;
        this.projectsDataSourceTemp = data.result.invoicePaid;
        this.projectsDataSource.paginator = this.paginator;
        this.projectsDataSource.sort = this.sort;
      
     
        this.projectsDataSource2 = new MatTableDataSource(data.result.invoiceMardod);
        this.DataSource = data.result.invoiceMardod;
        this.projectsDataSourceTemp2 = data.result.invoiceMardod;
        this.projectsDataSource2.paginator = this.paginator;
        this.projectsDataSource2.sort = this.sort;
      
      this.totalsdata = data.result;
    });
  }
  voucherdetails: any;
  GetInvoiceById(id:any) {
    this._accountsreportsService.GetInvoiceById(id).subscribe(data => {
      this.voucherdetails = data.result.voucherDetails;
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
      this.data.filter.DateTo_P = null;
      this.data.filter.date = null;
      this.RefreshData();
    }
  }
  applyFilter(event: any) {
      this.applyFiltertab_RE(event);
  
      this.applyFiltertab_EX(event);
    
  }
  applyFiltertab_RE(event: any) {
    debugger;
    const val = event.target.value.toLowerCase();
    const tempsource = this.projectsDataSourceTemp.filter(function (d: any) {
      return (d.customerName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.invoiceNumber.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.payType.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.date.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.invoiceValue.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.discountValue.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.totalValue.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.paidValue.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.remaining.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.projectsDataSource = new MatTableDataSource(tempsource);
    this.projectsDataSource.paginator = this.paginator;
    this.projectsDataSource.sort = this.sort;
    this.DataSource = tempsource
  }
  applyFiltertab_EX(event: any) {
    debugger;
    const val = event.target.value.toLowerCase();
    const tempsource = this.projectsDataSourceTemp2.filter(function (d: any) {
   return (d.customerName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.invoiceNumber.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.payType.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.date.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.invoiceValue.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.discountValue.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.totalValue.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.paidValue.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.remaining.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.projectsDataSource2 = new MatTableDataSource(tempsource);
    this.projectsDataSource2.paginator = this.paginator;
    this.projectsDataSource2.sort = this.sort;
    this.DataSource = tempsource
  }






}

