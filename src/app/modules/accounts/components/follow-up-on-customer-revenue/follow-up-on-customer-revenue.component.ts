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
import { CustomerVM } from 'src/app/core/Classes/ViewModels/customerVM';
import { ExportationService } from 'src/app/core/services/exportation-service/exportation.service';

import { environment } from 'src/environments/environment';
import { NgxPrintElementService } from 'ngx-print-element';
import { RestApiService } from 'src/app/shared/services/api.service';
import { ReportCustomer } from 'src/app/core/Classes/ViewModels/reportCustomer';
@Component({
  selector: 'app-follow-up-on-customer-revenue',
  templateUrl: './follow-up-on-customer-revenue.component.html',
  styleUrls: ['./follow-up-on-customer-revenue.component.scss']
})

export class FollowUpOnCustomerRevenueComponent implements OnInit {

  addInvoice() { }

  editInvoice() { }

  showTable: boolean = false;

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
      ar: '  متابعة إيرادات العملاء ',
      en: 'Follow up on customer revenue',
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
    'CustomerName',
    'date',
    'invoiceNumber',
    'BondType',
    'Statement',
    'projectNumber',
    'ProjectType',
    'PrincipalAmountWTax',
    'Tax',
    'totalBill',
  ];

  projectUsersColumns: string[] = ['name', 'responsibility'];
  projectTasksColumns: string[] = ['taskName', 'name', 'duration'];

  userPermissionsDataSource = new MatTableDataSource();

  projectGoalsDataSource = new MatTableDataSource();

  projectUsersDataSource = new MatTableDataSource();
  projectTasksDataSource = new MatTableDataSource();

  projectsDataSource = new MatTableDataSource();
  DataSource: any
  modalDetails: any = {
    serviceNumber: null,
    postPaid: null,
    DateOfPublicationAD: null,
    ChapterDateAD: null,
    accountName: null,
    Bank: null,
    warningBefore: null,
    recurrenceRate: null,
    WarningText: null,
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
  lang: any = 'ar';

  startDate = new Date();
  endDate = new Date();
  constructor(private modalService: NgbModal,
    private _accountsreportsService: AccountsreportsService,
    private api: RestApiService,
    private print: NgxPrintElementService,
    private _sharedService: SharedService,) {
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();
    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
    api.lang.subscribe((res) => {
      this.lang = res;
    });
  }
  ngOnInit(): void {
    this.FillCustomerSelect();
    this.RefreshData()

    this.projectsDataSource = new MatTableDataSource();

  }

  ngAfterViewInit() {
    // this.open(this.smartModal, null, 'smartModal');
  }


  load_customers: any;
  FillCustomerSelect() {
    this._accountsreportsService.FillAllCustomer().subscribe(data => {
      this.load_customers = data;
    });
  }
  data: any = {
    filter: {
      enable: false,
      date: null,
      search_CustomerName: null,
      DateFrom_P: null,
      DateTo_P: null,
      isChecked: false,
    }
  };
  projectsDataSourceTemp: any = [];
  projectname:any
  sumTaxes: any = 0
  sumTotal: any = 0
  sumTotalValue: any = 0
  RefreshData() {
    var _voucherFilterVM = new VoucherFilterVM();
    _voucherFilterVM.customerId = this.data.filter.search_CustomerName;
    if (this.data.filter.DateFrom_P != null && this.data.filter.DateTo_P != null) {
      _voucherFilterVM.dateFrom = this.data.filter.DateFrom_P.toString();
      _voucherFilterVM.dateTo = this.data.filter.DateTo_P.toString();
    }
    var obj = _voucherFilterVM;
    this._accountsreportsService.GetDetailedRevenu(obj).subscribe((data: any) => {
      this.sumTaxes = 0
      this.sumTotal = 0
      this.sumTotalValue = 0
      data.result.forEach((element: any) => {
        this.sumTaxes += Number(element.taxes)
        this.sumTotal += Number(element.total)
        this.sumTotalValue += Number(element.totalValue)
      });
      this.projectsDataSource = new MatTableDataSource(data.result);
      this.projectsDataSourceTemp = data.result;
      this.DataSource = data.result;
      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
    }, (err) => {
      this.sumTaxes = 0
      this.sumTotal = 0
      this.sumTotalValue = 0
    }
    );
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


  valapplyFilter: any

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    this.valapplyFilter = val
    const tempsource = this.projectsDataSourceTemp.filter(function (d: any) {
      return (d.date!=null?d.date.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.customerName!=null?d.customerName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.invoiceNumber!=null?d.invoiceNumber.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.accountName!=null?d.accountName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.notes!=null?d.notes.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.project!=null?d.project.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.projectType!=null?d.projectType.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.totalValue!=null?d.totalValue.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.taxes!=null?d.taxes.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.total!=null?d.total.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
    });
    this.sumTaxes = 0
    this.sumTotal = 0
    this.sumTotalValue = 0
    tempsource.forEach((element: any) => {
      this.sumTaxes += Number(element.taxes)
      this.sumTotal += Number(element.total)
      this.sumTotalValue += Number(element.totalValue)
    });
    this.projectsDataSource = new MatTableDataSource(tempsource);
    this.DataSource = tempsource
    this.projectsDataSource.paginator = this.paginator;
    this.projectsDataSource.sort = this.sort;
  }



  exportData() {
    let x = [];

    for (let index = 0; index < this.DataSource.length; index++) {

      x.push({
        date: this.DataSource[index].date,
        customerName: this.DataSource[index].customerName,
        invoiceNumber: this.DataSource[index].invoiceNumber,
        accountName: this.DataSource[index].accountName,
        notes: this.DataSource[index].notes,
        project: this.DataSource[index].project,
        projectType: this.DataSource[index].projectType,
        totalValue: this.DataSource[index].totalValue,
        taxes: this.DataSource[index].taxes,
        total: this.DataSource[index].total,
      })
      x.push({
        date:null,
        customerName:null,
        invoiceNumber:'الاجمالي',
        accountName:null,
        notes:null,
        project:null,
        projectType:null,
        totalValue:this.sumTotalValue,
        taxes:this.sumTaxes,
        total:this.sumTotal,
      })
    }
    this.lang == "ar" ? this._accountsreportsService.customExportExcel(x, "متابعة إيرادات العملاء") :
      this._accountsreportsService.customExportExcel(x, "Follow up on customer revenue");

  }
  printsumTaxes: any
  printsumTotal: any
  printsumTotalValue: any
  printprojectname: any
  OrganizationData:any
  environmentPho:any
  dateprint:any
  printprojectsDataSource: any
    BranchName: any;
  getPrintdata(id: any) {
    var _voucherFilterVM = new ReportCustomer();
    _voucherFilterVM.customerId = this.data.filter.search_CustomerName;
    if (this.data.filter.DateFrom_P != null && this.data.filter.DateTo_P != null) {
      _voucherFilterVM.dateFrom = this.data.filter.DateFrom_P.toString();
      _voucherFilterVM.dateTo = this.data.filter.DateTo_P.toString();
    }
    _voucherFilterVM.Sortedlist = []
    this.projectsDataSourceTemp.forEach((element: any) => {
      _voucherFilterVM.Sortedlist.push(element.transactionId)
    });

    var obj = _voucherFilterVM;
    this._accountsreportsService.DetailedRevenuReportNew(obj).subscribe((data: any) => {
      this.load_customers.forEach((element: any) => {
        if (this.data.filter.search_CustomerName == element.id) {
          this.printprojectname = element.name
        }
      });
      this.printsumTaxes = 0
      this.printsumTotal = 0
      this.printsumTotalValue = 0
      data.result.forEach((element: any) => {
        this.printsumTaxes += Number(element.taxes)
        this.printsumTotal += Number(element.total)
        this.printsumTotalValue += Number(element.totalValue)
      });
      const val = this.valapplyFilter;
      this.dateprint =  data.dateTimeNow
      this.OrganizationData = data.org_VD;
      this.BranchName = data.branchName;
      this.environmentPho=environment.PhotoURL+this.OrganizationData.logoUrl;
      const tempsource = data.result.filter(function (d: any) {
        return (d.date!=null?d.date.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.customerName!=null?d.customerName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.invoiceNumber!=null?d.invoiceNumber.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.accountName!=null?d.accountName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.notes!=null?d.notes.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.project!=null?d.project.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.projectType!=null?d.projectType.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.totalValue!=null?d.totalValue.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.taxes!=null?d.taxes.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.total!=null?d.total.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
      });
      this.printsumTaxes = 0
      this.printsumTotal = 0
      this.printsumTotalValue = 0
      tempsource.forEach((element: any) => {
        this.printsumTaxes += Number(element.taxes)
        this.printsumTotal += Number(element.total)
        this.printsumTotalValue += Number(element.totalValue)
      });
      this.printprojectsDataSource = tempsource;


      setTimeout(() => {
        this.print.print(id, environment.printConfig);
      }, 1000);
    }, (err) => {
      this.sumTaxes = 0
      this.sumTotal = 0
      this.sumTotalValue = 0
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

  addProject() { }

  extend() { }
  skip() { }
  confirm() { }
  endProject() { }
  flagProject() { }
  unSaveProjectInTop() { }

  stopProject() { }
  addNewUserPermissions() { }

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

  saveOption(data: any) { }

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

  selectGoalForProject(index: any) { }

  addNewMission() { }

  onSort(event: any) {
    console.log(event);
  }

  // upload img ]
  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );
  public readonly control = new FileUploadControl(
    {
      listVisible: true,
      discardInvalid: true,
      multiple: false,
    },
    [
      FileUploadValidators.accept(['file/*']),
      FileUploadValidators.filesLimit(1),
    ]
  );
  private subscription?: Subscription;

  private getImage(file: File): void {
    if (FileReader && file) {
      const fr = new FileReader();
      fr.onload = (e: any) => this.uploadedFile.next(e.target.result);
      fr.readAsDataURL(file);
    } else {
      this.uploadedFile.next('');
    }
  }
  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
