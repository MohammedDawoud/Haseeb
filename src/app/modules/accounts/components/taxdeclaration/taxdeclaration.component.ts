import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { environment } from 'src/environments/environment';
import { NgxPrintElementService } from 'ngx-print-element';

import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';

import { BehaviorSubject, Subscription } from 'rxjs';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ReportCustomer } from 'src/app/core/Classes/ViewModels/reportCustomer';
import { RestApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-taxdeclaration',
  templateUrl: './taxdeclaration.component.html',
  styleUrls: ['./taxdeclaration.component.scss']
})

export class TaxdeclarationComponent implements OnInit {

  addInvoice() { }

  editInvoice() { }

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


  ];

  get totalDebtor() {
    return this.accountingEntries.reduce((total, entry) => total + entry.debtor, 0);
  }

  get totalCreditor() {
    return this.accountingEntries.reduce((total, entry) => total + entry.creditor, 0);
  }

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
      ar: 'الإقرار الضريبي',
      en: 'tax declaration',
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
    'OperationDate',
    'Statement',
    'BondDate',
    'debtor',
    'Creditor',
    'balance',
    'Type',
    'RegistratioNumber',
    'costCenter'
  ];

  projectUsersColumns: string[] = ['name', 'responsibility'];
  projectTasksColumns: string[] = ['taskName', 'name', 'duration'];

  userPermissionsDataSource = new MatTableDataSource();

  projectGoalsDataSource = new MatTableDataSource();

  projectUsersDataSource = new MatTableDataSource();
  projectTasksDataSource = new MatTableDataSource();

  projectsDataSource :any =[]

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
    private print: NgxPrintElementService,
    private api: RestApiService,
    private _accountsreportsService: AccountsreportsService,
    private _sharedService: SharedService) {
    api.lang.subscribe((res) => {
      this.lang = res;
    });
    this.CheckValueAddedSeperated();
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();
    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
  }
  quarterList = [
    { id: 1, nameAr: 'الاول', nameEn: 'first' },
    { id: 2, nameAr: 'الثاني', nameEn: 'second' },
    { id: 3, nameAr: 'الثالث', nameEn: 'third' },
    { id: 4, nameAr: 'الرابع', nameEn: 'fourth' },
  ]
  ngOnInit(): void {


    this.users = [
      { id: 1, Name: 'محمود نافع' },
      { id: 2, Name: 'محمود نافع' }
    ];

    this.delayedProjects = [
      {
        user: 'adwawd',
        customerName: 'adawdv',
        projectStatus: 4,
        startDate: new Date(),
        endDate: new Date(),
      },
    ];
    this.latedProjects = [

      {
        user: 'adwawd',
        customerName: 'adawdv',
        projectStatus: 0,
        startDate: new Date(),
        endDate: new Date(),
      },
    ];

    this.projects = [
      {
        OperationDate: '000056',
        Statement: '2023-06-13',
        BondDate: 'أجل',
        debtor: 50,
        Creditor: 50,
        balance: 50,
        Type: '000056',
        RegistratioNumber: '2023-06-13',
        costCenter: 'أجل',
      },
      {
        OperationDate: '000056',
        Statement: '2023-06-13',
        BondDate: 'أجل',
        debtor: 50,
        Creditor: 50,
        balance: 50,
        Type: '000056',
        RegistratioNumber: '2023-06-13',
        costCenter: 'أجل',
      },
      {
        OperationDate: '000056',
        Statement: '2023-06-13',
        BondDate: 'أجل',
        debtor: 50,
        Creditor: 50,
        balance: 50,
        Type: '000056',
        RegistratioNumber: '2023-06-13',
        costCenter: 'أجل',
      },
      {
        OperationDate: '000056',
        Statement: '2023-06-13',
        BondDate: 'أجل',
        debtor: 50,
        Creditor: 50,
        balance: 50,
        Type: '000056',
        RegistratioNumber: '2023-06-13',
        costCenter: 'أجل',
      },
      {
        OperationDate: '000056',
        Statement: '2023-06-13',
        BondDate: 'أجل',
        debtor: 50,
        Creditor: 50,
        balance: 50,
        Type: '000056',
        RegistratioNumber: '2023-06-13',
        costCenter: 'أجل',
      },
    ];

    this.userPermissions = [
      {
        userName: 'adawdawd',
        watch: false,
        add: true,
        edit: true,
        delete: false,
      },
      {
        userName: 'adawdawd',
        watch: false,
        add: true,
        edit: true,
        delete: false,
      },
      {
        userName: 'adawdawd',
        watch: false,
        add: true,
        edit: true,
        delete: true,
      },
      {
        userName: 'adawdawd',
        watch: false,
        add: false,
        edit: true,
        delete: false,
      },
      {
        userName: 'adawdawd',
        watch: false,
        add: true,
        edit: true,
        delete: false,
      },
      {
        userName: 'adawdawd',
        watch: true,
        add: true,
        edit: true,
        delete: false,
      },
      {
        userName: 'adawdawd',
        watch: true,
        add: true,
        edit: true,
        delete: true,
      },
    ];

    this.projectsDataSource = new MatTableDataSource(this.projects);

    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );

    this.projectGoalsDataSource = new MatTableDataSource(this.projectGoals);

    this.projectUsersDataSource = new MatTableDataSource(this.projectUsers);

    this.projectTasksDataSource = new MatTableDataSource(this.projectTasks);
  }


  load_customers: any;
  FillCustomerSelect() {
    this._accountsreportsService.FillAllCustomer().subscribe(data => {
      console.log(data);
      this.load_customers = data;
    });
  }
  data: any = {
    filter: {
      enable: false,
      date: null,
      search_CustomerName: null,
      quarterId: null,
      DateFrom_P: null,
      DateTo_P: null,
      ZeroCheck: 0,
      isChecked: false,
    }
  };
  projectsDataSourceTemp: any = [];
  sumTaxes: any = 0
  sumTotal: any = 0
  sumTotalValue: any = 0
  DataSource: any
  RefreshData() {
    debugger
    var _voucherFilterVM = new ReportCustomer();
    var yearid= this._sharedService.getStoYear();

    if (this.data.filter.quarterId == 1) {
      _voucherFilterVM.dateFrom = yearid + "-01-01";
      _voucherFilterVM.dateTo = yearid + "-03-31";
    }
    else if (this.data.filter.quarterId == 2) {
      _voucherFilterVM.dateFrom = yearid + "-04-01";
      _voucherFilterVM.dateTo = yearid + "-06-30";
    }
    else if (this.data.filter.quarterId == 3) {
      _voucherFilterVM.dateFrom = yearid + "-07-01";
      _voucherFilterVM.dateTo = yearid + "-09-30";
    }
    else if (this.data.filter.quarterId == 4) {
      _voucherFilterVM.dateFrom = yearid + "-10-01";
      _voucherFilterVM.dateTo = yearid + "-12-31";
    }
    else if (this.data.filter.DateFrom_P != null && this.data.filter.DateTo_P != null) {
      _voucherFilterVM.dateFrom = this.data.filter.DateFrom_P.toString();
      _voucherFilterVM.dateTo = this.data.filter.DateTo_P.toString();
    }
    var obj = _voucherFilterVM;
    this._accountsreportsService.GetValueNeeded(obj).subscribe((data: any) => {
      this.projectsDataSource = data.result;
      this.projectsDataSourceTemp = data.result;
      this.DataSource = data.result;
      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
    });
  }
  ValueAddedCheckv=false;
  CheckValueAddedSeperated(){
    this._accountsreportsService.GetSystemSettingsByBranchId().subscribe((data: any) => {
      this.ValueAddedCheckv=data.result.valueAddedSeparated;
    });
  }

  CheckDate(event: any) {
    this.data.filter.quarterId = null
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
      return (d.accountName!=null?d.accountName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.code!=null?d.code.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.totalDepitOpeningBalance!=null?d.totalDepitOpeningBalance.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.totalCreditOpeningBalance!=null?d.totalCreditOpeningBalance.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.totalDepit!=null?d.totalDepit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.totalCredit!=null?d.totalCredit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.totalDepitBalance!=null?d.totalDepitBalance.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.totalCreditBalance!=null?d.totalCreditBalance.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
    });
    this.projectsDataSource = new MatTableDataSource(tempsource);
    this.projectsDataSource.paginator = this.paginator;
    this.projectsDataSource.sort = this.sort;
  }
  ngAfterViewInit() {
    // this.open(this.smartModal, null, 'smartModal');
  }

  open(content: any, data?: any, type?: any) {
    if (data && type == 'edit') {
      this.modalDetails = data;
      this.modalDetails['id'] = 1;
    }

    this.modalService
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type == 'edit' ? 'xl' : 'lg',
        centered: type ? false : true
      })

      .result.then(
        (result) => {
          if (type == 'edit') {
            this.modalDetails = {
              projectNo: null,
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
          }
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  Quarter:any
  fromPeriod:any
  toPeriod:any
  OrganizationData:any
  environmentPho:any
  dateprint:any
  printprojectsDataSource: any = []
    BranchName: any;

  getPrintdata(id: any) {

    var _voucherFilterVM = new ReportCustomer();
    var yearid = new Date().getFullYear().toString();
    if (this.data.filter.quarterId == 1) {
      _voucherFilterVM.dateFrom = yearid + "-01-01";
      _voucherFilterVM.dateTo = yearid + "-03-31";
      _voucherFilterVM.DateId=1
    }
    else if (this.data.filter.quarterId == 2) {
      _voucherFilterVM.dateFrom = yearid + "-04-01";
      _voucherFilterVM.dateTo = yearid + "-06-30";
      _voucherFilterVM.DateId=2
    }
    else if (this.data.filter.quarterId == 3) {
      _voucherFilterVM.dateFrom = yearid + "-07-01";
      _voucherFilterVM.dateTo = yearid + "-09-30";
      _voucherFilterVM.DateId=3
    }
    else if (this.data.filter.quarterId == 4) {
      _voucherFilterVM.dateFrom = yearid + "-10-01";
      _voucherFilterVM.dateTo = yearid + "-12-31";
      _voucherFilterVM.DateId=4
    }
    else if (this.data.filter.DateFrom_P != null && this.data.filter.DateTo_P != null) {
      _voucherFilterVM.dateFrom = this.data.filter.DateFrom_P.toString();
      _voucherFilterVM.dateTo = this.data.filter.DateTo_P.toString();
      _voucherFilterVM.DateId=null
    }
    var obj = _voucherFilterVM;
    this._accountsreportsService.PrintAddtionalTaxesPDFFile(obj).subscribe((data: any) => {

      this.printprojectsDataSource = [];

      const val = this.valapplyFilter;

      this.dateprint =  data.dateTimeNow
      this.OrganizationData = data.org_VD;
                    this.BranchName = data.branchName;

      this.environmentPho=environment.PhotoURL+this.OrganizationData.logoUrl;

      this.Quarter=data.rob3
      this.fromPeriod=data.startDate
      this.toPeriod=data.endDate

    this.printprojectsDataSource = data.result;

    setTimeout(() => {
      this.print.print(id, environment.printConfig);
    }, 500);
  });
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
