import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  TemplateRef,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormGroup, FormBuilder } from '@angular/forms';

import { environment } from 'src/environments/environment';
import { NgxPrintElementService } from 'ngx-print-element';
import { RestApiService } from 'src/app/shared/services/api.service';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';

import { BehaviorSubject, Subscription } from 'rxjs';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ReportCustomer } from 'src/app/core/Classes/ViewModels/reportCustomer';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.scss'],
})
export class TrialBalanceComponent implements OnInit {
  title: any = {
    main: {
      name: {
        ar: 'الحسابات',
        en: 'Projects Management',
      },
      link: '/accounts',
    },
    sub: {
      ar: 'ميزان المراجعة  ',
      en: '  Trial Balance',
    },
  };

  myForm!: FormGroup;

  // data in runningTasksModal
  accountingEntries: any = [];

  TrialbBalanceEntries: any = [];

  // get totalDebtor() {
  //   return this.accountingEntries.reduce(
  //     (total, entry) => total + entry.debtor,
  //     0
  //   );
  // }

  // get totalCreditor() {
  //   return this.accountingEntries.reduce(
  //     (total, entry) => total + entry.creditor,
  //     0
  //   );
  // }

  showTable: boolean = false;
  showTablezeroCheck: boolean = false;
  projects: any;
  @ViewChild('SmartFollower') smartModal: any;

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
  projectDisplayedColumns: string[] = ['account', 'debtor', 'Creditor'];

  projectUsersColumns: string[] = ['name', 'responsibility'];
  projectTasksColumns: string[] = ['taskName', 'name', 'duration'];

  userPermissionsDataSource = new MatTableDataSource();

  projectGoalsDataSource = new MatTableDataSource();

  projectUsersDataSource = new MatTableDataSource();
  projectTasksDataSource = new MatTableDataSource();

  projectsDataSource: any = [];

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
  userG: any = {};

  startDate = new Date();
  endDate = new Date();
  constructor(
    private modalService: NgbModal,
    private print: NgxPrintElementService,
    private _accountsreportsService: AccountsreportsService,
    private authenticationService: AuthenticationService,
    private api: RestApiService,
    private _sharedService: SharedService
  ) {
    this.userG = this.authenticationService.userGlobalObj;

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
    this.GetViewDetailsGrid();
    this.FillAccountsSelect();
    this.FillCostCenterSelect();
    this.users = [
      { id: 1, Name: 'محمود نافع' },
      { id: 2, Name: 'محمود نافع' },
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
        account: '000056',
        debtor: '2023-06-13',
        Creditor: 'أجل',
      },
      {
        account: '000056',
        debtor: '2023-06-13',
        Creditor: 'أجل',
      },
      {
        account: '000056',
        debtor: '2023-06-13',
        Creditor: 'أجل',
      },
      {
        account: '000056',
        debtor: '2023-06-13',
        Creditor: 'أجل',
      },
      {
        account: '000056',
        debtor: '2023-06-13',
        Creditor: 'أجل',
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
    if (data && type == 'edit') {
      this.modalDetails = data;
      this.modalDetails['id'] = 1;
    }
    this.modalService;
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type == 'edit' ? 'xl' : 'xl',
        centered: type ? false : true,
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
              level: null,
              ChooseLevel: null,

              //
            };
          }
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  GetViewDetailsGrid() {
    this._accountsreportsService.GetViewDetailsGrid().subscribe((data) => {
      console.log(data);
      this.accountingEntries = data;
    });
  }

  load_costCenters: any;
  FillCostCenterSelect() {
    this._accountsreportsService.FillCostCenterSelect().subscribe((data) => {
      console.log(data);
      this.load_costCenters = data;
    });
  }
  load_accountIds: any;
  FillAccountsSelect() {
    this._accountsreportsService.FillAccountsSelect().subscribe((data) => {
      this.load_accountIds = data;
    });
  }
  data: any = {
    filter: {
      enable: false,
      date: null,
      lvlid: null,
      choseid: null,
      DateFrom_P: null,
      DateTo_P: null,
      filteringType: null,
      costCenter: null,
      ZeroCheck: null,
      FilteringTypeStr: [],
      TypeF: null,
      search_accountId: null,
    },
  };
  reset() {
    this.data = {
      filter: {
        enable: false,
        date: null,
        lvlid: null,
        choseid: null,
        DateFrom_P: null,
        DateTo_P: null,
        filteringType: null,
        costCenter: null,
        ZeroCheck: null,
        FilteringTypeStr: [],
        TypeF: null,
        search_accountId: null,
      },
    };
  }
  ChoseList = [
    { id: 1, name: 'المستوي الاول' },
    { id: 2, name: 'المستوي الثاني' },
    { id: 3, name: 'المستوي الثالث' },
    { id: 4, name: 'المستوي الرابع' },
    { id: 5, name: 'المستوي الخامس' },
    { id: 6, name: 'المستوي السادس' },
    { id: 7, name: 'المستوي السابع' },
    { id: 8, name: 'المستوي الثامن' },
    { id: 9, name: 'المستوي التاسع' },
    { id: 10, name: 'المستوي العاشر' },
  ];

  filteringTypeList: any = [
    { id: 2, name: 'العملاء' },
    { id: 3, name: 'الموردين' },
    { id: 5, name: 'الموظفين' },
    { id: 4, name: 'الفروع' },
    { id: 6, name: 'الخدمات' },
  ];
  FilteringTypeStrList: any = [];
  // FillFilteringIncomeStateSelectfilteringType() {
  //   this._accountsreportsService.FillFilteringIncomeStateSelect(this.data.filter.filteringType).subscribe(data => {
  //     this.FilteringTypeStrList = data;
  //   });
  // }
  FillFilteringSelect() {
    this._accountsreportsService
      .FillFilteringSelect(this.data.filter.filteringType)
      .subscribe((data) => {
        this.data.filter.FilteringTypeStr = [];
        this.FilteringTypeStrList = data;
      });
  }
  projectsDataSourceTemp: any = [];
  DataSource: any = [];
  // sumopDipet = 0
  // sumopCredit = 0
  // sumdebitTotal = 0
  // sumcreditTotal = 0
  // sumnetDebitTotal = 0
  // sumnetCreditTotal = 0
  // sumtotalDebitEnd = 0
  // sumtotalCriditEnd = 0
  RefreshData() {
    var _voucherFilterVM = new ReportCustomer();
    _voucherFilterVM.lvl = this.data.filter.choseid;
    _voucherFilterVM.filteringType = this.data.filter.filteringType;
    _voucherFilterVM.FilteringTypeStr = this.data.filter.FilteringTypeStr;
    _voucherFilterVM.CostCenter = this.data.filter.costCenter;
    _voucherFilterVM.search_accountId = this.data.filter.search_accountId;

    if (this.showTablezeroCheck == true) {
      _voucherFilterVM.zeroCheck = 1;
    } else {
      _voucherFilterVM.zeroCheck = 0;
    }
    if (
      this.data.filter.DateFrom_P != null &&
      this.data.filter.DateTo_P != null
    ) {
      _voucherFilterVM.dateFrom = this.data.filter.DateFrom_P.toString();
      _voucherFilterVM.dateTo = this.data.filter.DateTo_P.toString();
    }
    var obj = _voucherFilterVM;
    this._accountsreportsService.GetTrailBalanceDGV(obj).subscribe(
      (data: any) => {
        // this.sumopDipet = 0
        // this.sumopCredit = 0
        // this.sumdebitTotal = 0
        // this.sumcreditTotal = 0
        // this.sumnetDebitTotal = 0
        // this.sumnetCreditTotal = 0
        // this.sumtotalDebitEnd = 0
        // this.sumtotalCriditEnd = 0
        // data.result.forEach((element: any) => {
        //   this.sumopDipet += Number(element.opDipet)
        //   this.sumopCredit += Number(element.opCredit)
        //   this.sumdebitTotal += Number(element.debitTotal)
        //   this.sumcreditTotal += Number(element.creditTotal)
        //   this.sumnetDebitTotal += Number(element.netDebitTotal)
        //   this.sumnetCreditTotal += Number(element.netCreditTotal)
        //   this.sumtotalDebitEnd += Number(element.totalDebitEnd)
        //   this.sumtotalCriditEnd += Number(element.totalCriditEnd)
        // });
        this.projectsDataSource = data.result;
        this.DataSource = data.result;
        this.projectsDataSourceTemp = data.result;
        this.projectsDataSource.paginator = this.paginator;
        this.projectsDataSource.sort = this.sort;
      },
      (err) => {
        // this.sumopDipet = 0
        // this.sumopCredit = 0
        // this.sumdebitTotal = 0
        // this.sumcreditTotal = 0
        // this.sumnetDebitTotal = 0
        // this.sumnetCreditTotal = 0
        // this.sumtotalDebitEnd = 0
        // this.sumtotalCriditEnd = 0
      }
    );
  }

  CheckDate(event: any) {
    if (event != null) {
      this.data.filter.DateFrom_P = this._sharedService.date_TO_String(
        event[0]
      );
      this.data.filter.DateTo_P = this._sharedService.date_TO_String(event[1]);
      this.RefreshData();
    } else {
      this.data.filter.DateFrom_P = null;
      this.data.filter.DateTo_P = null;
      this.data.filter.date = null;
      this.RefreshData();
    }
  }

  valapplyFilter: any;

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    this.valapplyFilter = val;

    const tempsource = this.projectsDataSourceTemp.filter(function (d: any) {
      return (
        (d.accCode != null
          ? d.accCode.toString()?.trim().toLowerCase().indexOf(val) !== -1 ||
            !val
          : '') ||
        (d.acc_NameAr != null
          ? d.acc_NameAr.toString()?.trim().toLowerCase().indexOf(val) !== -1 ||
            !val
          : '') ||
        (d.opDipet != null
          ? d.opDipet.toString()?.trim().toLowerCase().indexOf(val) !== -1 ||
            !val
          : '') ||
        (d.opCredit != null
          ? d.opCredit.toString()?.trim().toLowerCase().indexOf(val) !== -1 ||
            !val
          : '') ||
        (d.debitTotal != null
          ? d.debitTotal.toString()?.trim().toLowerCase().indexOf(val) !== -1 ||
            !val
          : '') ||
        (d.creditTotal != null
          ? d.creditTotal.toString()?.trim().toLowerCase().indexOf(val) !==
              -1 || !val
          : '') ||
        (d.netDebitTotal != null
          ? d.netDebitTotal.toString()?.trim().toLowerCase().indexOf(val) !==
              -1 || !val
          : '') ||
        (d.netCreditTotal != null
          ? d.netCreditTotal.toString()?.trim().toLowerCase().indexOf(val) !==
              -1 || !val
          : '') ||
        (d.totalDebitEnd != null
          ? d.totalDebitEnd.toString()?.trim().toLowerCase().indexOf(val) !==
              -1 || !val
          : '') ||
        (d.totalCriditEnd != null
          ? d.totalCriditEnd.toString()?.trim().toLowerCase().indexOf(val) !==
              -1 || !val
          : '')
      );
    });
    // this.sumopDipet = 0
    // this.sumopCredit = 0
    // this.sumdebitTotal = 0
    // this.sumcreditTotal = 0
    // this.sumnetDebitTotal = 0
    // this.sumnetCreditTotal = 0
    // this.sumtotalDebitEnd = 0
    // this.sumtotalCriditEnd = 0
    // tempsource.forEach((element: any) => {
    //   this.sumopDipet += Number(element.opDipet)
    //   this.sumopCredit += Number(element.opCredit)
    //   this.sumdebitTotal += Number(element.debitTotal)
    //   this.sumcreditTotal += Number(element.creditTotal)
    //   this.sumnetDebitTotal += Number(element.netDebitTotal)
    //   this.sumnetCreditTotal += Number(element.netCreditTotal)
    //   this.sumtotalDebitEnd += Number(element.totalDebitEnd)
    //   this.sumtotalCriditEnd += Number(element.totalCriditEnd)
    // });
    this.projectsDataSource = tempsource;
    this.DataSource = tempsource;
    this.projectsDataSource.paginator = this.paginator;
    this.projectsDataSource.sort = this.sort;
  }
  OrganizationData: any;
  environmentPho: any;
  dateprint: any;
  printprojectsDataSource: any = [];
  // printsumopDipet: any
  // printsumopCredit: any
  // printsumdebitTotal: any
  // printsumcreditTotal: any
  // printsumnetDebitTotal: any
  // printsumnetCreditTotal: any
  // printsumtotalDebitEnd: any
  // printsumtotalCriditEnd: any
  BranchName: any;
  getPrintdata(id: any) {
    var _voucherFilterVM = new ReportCustomer();
    _voucherFilterVM.lvl = this.data.filter.choseid;
    _voucherFilterVM.filteringType = this.data.filter.filteringType;
    _voucherFilterVM.FilteringTypeStr = this.data.filter.FilteringTypeStr;
    _voucherFilterVM.CostCenter = this.data.filter.costCenter;
    _voucherFilterVM.search_accountId = this.data.filter.search_accountId;

    if (this.showTablezeroCheck == true) {
      _voucherFilterVM.zeroCheck = 1;
    } else {
      _voucherFilterVM.zeroCheck = 0;
    }
    if (
      this.data.filter.DateFrom_P != null &&
      this.data.filter.DateTo_P != null
    ) {
      _voucherFilterVM.dateFrom = this.data.filter.DateFrom_P.toString();
      _voucherFilterVM.dateTo = this.data.filter.DateTo_P.toString();
    }
    var obj = _voucherFilterVM;
    this._accountsreportsService.ChangeTrialBalance_PDF(obj).subscribe(
      (data: any) => {
        // this.printsumopDipet = 0
        // this.printsumopCredit = 0
        // this.printsumdebitTotal = 0
        // this.printsumcreditTotal = 0
        // this.printsumnetDebitTotal = 0
        // this.printsumnetCreditTotal = 0
        // this.printsumtotalDebitEnd = 0
        // this.printsumtotalCriditEnd = 0

        this.printprojectsDataSource = [];
        const val = this.valapplyFilter;
        this.dateprint = data.dateTimeNow;
        this.OrganizationData = data.org_VD;
                this.BranchName = data.branch_VD.nameAr;

        this.environmentPho =
          environment.PhotoURL + this.OrganizationData.logoUrl;

        const tempsource = data.trainBalanceVM_VD.filter(function (d: any) {
          return (
            (d.accCode != null
              ? d.accCode.toString()?.trim().toLowerCase().indexOf(val) !==
                  -1 || !val
              : '') ||
            (d.acc_NameAr != null
              ? d.acc_NameAr.toString()?.trim().toLowerCase().indexOf(val) !==
                  -1 || !val
              : '') ||
            (d.opDipet != null
              ? d.opDipet.toString()?.trim().toLowerCase().indexOf(val) !==
                  -1 || !val
              : '') ||
            (d.opCredit != null
              ? d.opCredit.toString()?.trim().toLowerCase().indexOf(val) !==
                  -1 || !val
              : '') ||
            (d.debitTotal != null
              ? d.debitTotal.toString()?.trim().toLowerCase().indexOf(val) !==
                  -1 || !val
              : '') ||
            (d.creditTotal != null
              ? d.creditTotal.toString()?.trim().toLowerCase().indexOf(val) !==
                  -1 || !val
              : '') ||
            (d.netDebitTotal != null
              ? d.netDebitTotal
                  .toString()
                  ?.trim()
                  .toLowerCase()
                  .indexOf(val) !== -1 || !val
              : '') ||
            (d.netCreditTotal != null
              ? d.netCreditTotal
                  .toString()
                  ?.trim()
                  .toLowerCase()
                  .indexOf(val) !== -1 || !val
              : '') ||
            (d.totalDebitEnd != null
              ? d.totalDebitEnd
                  .toString()
                  ?.trim()
                  .toLowerCase()
                  .indexOf(val) !== -1 || !val
              : '') ||
            (d.totalCriditEnd != null
              ? d.totalCriditEnd
                  .toString()
                  ?.trim()
                  .toLowerCase()
                  .indexOf(val) !== -1 || !val
              : '')
          );
        });
        // this.printsumopDipet = 0
        // this.printsumopCredit = 0
        // this.printsumdebitTotal = 0
        // this.printsumcreditTotal = 0
        // this.printsumnetDebitTotal = 0
        // this.printsumnetCreditTotal = 0
        // this.printsumtotalDebitEnd = 0
        // this.printsumtotalCriditEnd = 0
        // tempsource.forEach((element: any) => {
        //   this.printsumopDipet += Number(element.opDipet)
        //   this.printsumopCredit += Number(element.opCredit)
        //   this.printsumdebitTotal += Number(element.debitTotal)
        //   this.printsumcreditTotal += Number(element.creditTotal)
        //   this.printsumnetDebitTotal += Number(element.netDebitTotal)
        //   this.printsumnetCreditTotal += Number(element.netCreditTotal)
        //   this.printsumtotalDebitEnd += Number(element.totalDebitEnd)
        //   this.printsumtotalCriditEnd += Number(element.totalCriditEnd)
        // });

        this.printprojectsDataSource = tempsource;

        setTimeout(() => {
          this.print.print(id, environment.printConfig);
        }, 500);
      },
      (err) => {
        // this.printsumopDipet = 0
        // this.printsumopCredit = 0
        // this.printsumdebitTotal = 0
        // this.printsumcreditTotal = 0
        // this.printsumnetDebitTotal = 0
        // this.printsumnetCreditTotal = 0
        // this.printsumtotalDebitEnd = 0
        // this.printsumtotalCriditEnd = 0
      }
    );
  }
  MonitorName: any;
  creditORdepit: any;

  @ViewChild('DetailsMonitorModal') DetailsMonitorModal: any;
  GetDetailsMonitor(item: any, id: any) {
    // if (this.data.filter.DateFrom_P != null && this.data.filter.DateTo_P != null) {
    if (this.showTable == true) {
      this.MonitorName = item.acc_NameAr;
      this.DetailsMonitorProject = [];
      this.DetailsMonitorService = [];
      this.DetailsMonitorCustomer = [];
      this.DetailsMonitorEmployee = [];
      this.DetailsMonitorSupplier = [];
      this.DetailsMonitorVoucher = [];
      this.DetailsMonitorBranch = [];
      if (id == 1 || id == 3 || id == 5 || id == 7) {
        this.creditORdepit = false;
      } else {
        this.creditORdepit = true;
      }
      this.GetDetailsMonitor_Func1(item, id);
      this.GetDetailsMonitor_Func2(item, id);
      this.GetDetailsMonitor_Func3(item, id);
      this.GetDetailsMonitor_Func4(item, id);
      this.open(this.DetailsMonitorModal);
    } else {
      return;
    }
    // }
  }
  DetailsMonitorBranch: any;
  DetailsMonitorService: any;
  DetailsMonitorProject: any;
  DetailsMonitorEmployee: any;
  DetailsMonitorVoucher: any;
  DetailsMonitorCustomer: any;
  DetailsMonitorSupplier: any;
  GetDetailsMonitor_Func1(item: any, id: any) {
    var obj = {
      FromDate: this.data.filter.DateFrom_P,
      ToDate: this.data.filter.DateTo_P,
      CostCenter: this.data.filter.costCenter,
      FilteringType: this.data.filter.filteringType,
      FilteringTypeStr: this.data.filter.FilteringTypeStr,
      AccountId: item.accountId,
      Type: 1,
      Type2: id,
    };
    this._accountsreportsService.GetDetailsMonitor(obj).subscribe(
      (data: any) => {
        data.result.forEach((element: any) => {
          debugger;
          element.total = 0;
          var _type = 1;
          if (id == 1) {
            element.total = element.depit;
          } else if (id == 2) {
            element.total = element.credit;
          } else if (id == 3) {
            element.total = element.depit;
          } else if (id == 4) {
            element.total = element.credit;
          } else if (id == 5) {
            if (element.depit - element.credit > 0) {
              element.total = element.depit - element.credit;
            } else {
              element.total = 0;
            }
          } else if (id == 6) {
            if (element.credit - element.depit > 0) {
              element.total = element.credit - element.depit;
            } else {
              element.total = 0;
            }
          } else if (id == 7) {
            if (element.depit - element.credit > 0) {
              element.total = element.depit - element.credit;
            } else {
              element.total = 0;
            }
          } else if (id == 8) {
            if (element.credit - element.depit > 0) {
              element.total = element.credit - element.depit;
            } else {
              element.total = 0;
            }
          }

          if (element.total != 0) {
            if (_type == 1 && element.cus_Emp_Sup == 1) {
              this.DetailsMonitorCustomer.push(element);
            }
            // if (_type == 1 && element.cus_Emp_Sup == 2) {
            //   this.DetailsMonitorEmployee.push(element);
            // }
            if (_type == 1 && element.cus_Emp_Sup == 3) {
              this.DetailsMonitorSupplier.push(element);
            }
            if (_type == 1) {
              this.DetailsMonitorVoucher.push(element);
            }
            if (_type == 1) {
              this.DetailsMonitorBranch.push(element);
            }
          }
        });
      },
      (err) => {}
    );
  }
  GetDetailsMonitor_Func2(item: any, id: any) {
    var obj = {
      FromDate: this.data.filter.DateFrom_P,
      ToDate: this.data.filter.DateTo_P,
      CostCenter: this.data.filter.costCenter,
      FilteringType: this.data.filter.filteringType,
      FilteringTypeStr: this.data.filter.FilteringTypeStr,
      AccountId: item.accountId,
      Type: 2,
      Type2: id,
    };
    this._accountsreportsService.GetDetailsMonitor(obj).subscribe(
      (data: any) => {
        data.result.forEach((element: any) => {
          element.total = 0;
          var _type = 2;
          if (id == 1) {
            element.total = element.depit;
          } else if (id == 2) {
            element.total = element.credit;
          } else if (id == 3) {
            element.total = element.depit;
          } else if (id == 4) {
            element.total = element.credit;
          }
          if (id == 5) {
            if (element.credit - element.depit > 0) {
              element.total = 0;
            }
          } else if (id == 6) {
            if (element.credit - element.depit > 0) {
              element.total = element.credit - element.depit;
            }
          } else if (id == 7) {
            if (element.credit - element.depit > 0) {
              element.total = element.credit - element.depit;
            }
          } else if (id == 8) {
            if (element.credit - element.depit > 0) {
              element.total = element.credit - element.depit;
            }
          }

          if (element.total != 0) {
            if (_type == 2) {
              this.DetailsMonitorProject.push(element);
            }
          }
        });
      },
      (err) => {}
    );
  }
  GetDetailsMonitor_Func3(item: any, id: any) {
    var obj = {
      FromDate: this.data.filter.DateFrom_P,
      ToDate: this.data.filter.DateTo_P,
      CostCenter: this.data.filter.costCenter,
      FilteringType: this.data.filter.filteringType,
      FilteringTypeStr: this.data.filter.FilteringTypeStr,
      AccountId: item.accountId,
      Type: 3,
      Type2: id,
    };
    this._accountsreportsService.GetDetailsMonitor(obj).subscribe(
      (data: any) => {
        data.result.forEach((element: any) => {
          element.total = 0;
          var _type = 3;
          if (id == 1) {
            element.total = element.depit;
          } else if (id == 2) {
            element.total = element.credit;
          } else if (id == 3) {
            element.total = element.depit;
          } else if (id == 4) {
            element.total = element.credit;
          }
          if (id == 5) {
            if (element.credit - element.depit > 0) {
              element.total = 0;
            }
          } else if (id == 6) {
            if (element.credit - element.depit > 0) {
              element.total = element.credit - element.depit;
            }
          } else if (id == 7) {
            if (element.credit - element.depit > 0) {
              element.total = element.credit - element.depit;
            }
          } else if (id == 8) {
            if (element.credit - element.depit > 0) {
              element.total = element.credit - element.depit;
            }
          }

          if (element.total != 0) {
            if (_type == 3) {
              this.DetailsMonitorService.push(element);
            }
          }
        });
      },
      (err) => {}
    );
  }

  GetDetailsMonitor_Func4(item: any, id: any) {
    var obj = {
      FromDate: this.data.filter.DateFrom_P,
      ToDate: this.data.filter.DateTo_P,
      CostCenter: this.data.filter.costCenter,
      FilteringType: this.data.filter.filteringType,
      FilteringTypeStr: this.data.filter.FilteringTypeStr,
      AccountId: item.accountId,
      Type: 4,
      Type2: id,
    };
    this._accountsreportsService.GetDetailsMonitor(obj).subscribe(
      (data: any) => {
        data.result.forEach((element: any) => {
          debugger;
          element.total = 0;
          var _type = 4;
          if (id == 1) {
            element.total = element.credit;
          } else if (id == 2) {
            element.total = element.depit;
          } else if (id == 3) {
            element.total = element.credit;
          } else if (id == 4) {
            element.total = element.depit;
          } else if (id == 5) {
            if (element.credit - element.depit > 0) {
              element.total = element.credit - element.depit;
            } else {
              element.total = 0;
            }
          } else if (id == 6) {
            if (element.depit - element.credit > 0) {
              element.total = element.depit - element.credit;
            } else {
              element.total = 0;
            }
          } else if (id == 7) {
            if (element.credit - element.depit > 0) {
              element.total = element.credit - element.depit;
            } else {
              element.total = 0;
            }
          } else if (id == 8) {
            if (element.depit - element.credit > 0) {
              element.total = element.depit - element.credit;
            } else {
              element.total = 0;
            }
          }

          if (element.total != 0) {
            if (_type == 4 && element.cus_Emp_Sup == 2) {
              this.DetailsMonitorEmployee.push(element);
            }
          }
        });
      },
      (err) => {}
    );
  }

  exportData() {
    let x = [];

    for (let index = 0; index < this.projectsDataSource.length; index++) {
      if (this.DataSource[index].accountId != 0) {
        x.push({
          accCode: this.DataSource[index].accCode,
          acc_NameAr: this.DataSource[index].acc_NameAr,
          opDipet: this.DataSource[index].opDipet,
          opCredit: this.DataSource[index].opCredit,
          debitTotal: this.DataSource[index].debitTotal,
          creditTotal: this.DataSource[index].creditTotal,
          netDebitTotal: this.DataSource[index].netDebitTotal,
          netCreditTotal: this.DataSource[index].netCreditTotal,
          totalDebitEnd: this.DataSource[index].totalDebitEnd,
          totalCriditEnd: this.DataSource[index].totalCriditEnd,
        });
      }
    }

    for (let index = 0; index < this.projectsDataSource.length; index++) {
      if (this.DataSource[index].accountId == 0) {
        x.push({
          accCode: null,
          acc_NameAr: ' الاجمالي',
          opDipet: this.DataSource[index].opDipet,
          opCredit: this.DataSource[index].opCredit,
          debitTotal: this.DataSource[index].debitTotal,
          creditTotal: this.DataSource[index].creditTotal,
          netDebitTotal: this.DataSource[index].netDebitTotal,
          netCreditTotal: this.DataSource[index].netCreditTotal,
          totalDebitEnd: this.DataSource[index].totalDebitEnd,
          totalCriditEnd: this.DataSource[index].totalCriditEnd,
        });
      }
    }
    this.lang == 'ar'
      ? this._accountsreportsService.customExportExcel(x, 'ميزان المراجعة  ')
      : this._accountsreportsService.customExportExcel(x, 'Trial Balance');
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

  // Save row
  save(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    console.log('Row saved: ' + rowIndex);
    console.log(row);
  }

  selectGoalForProject(index: any) {}

  addNewMission() {}

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
  addInvoice() {}

  editInvoice() {}

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
