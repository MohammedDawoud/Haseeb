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

import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';

import { BehaviorSubject, Subscription } from 'rxjs';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ReportCustomer } from 'src/app/core/Classes/ViewModels/reportCustomer';
import { ToastrService } from 'ngx-toastr';

import { environment } from 'src/environments/environment';
import { NgxPrintElementService } from 'ngx-print-element';
import { RestApiService } from 'src/app/shared/services/api.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-income-list',
  templateUrl: './income-list.component.html',
  styleUrls: ['./income-list.component.scss'],
})
export class IncomeListComponent implements OnInit {
  TrialbBalanceEntries: any = [
    {
      account: '41 - ايرادات عامة	',
      debtorInitialBalance: '234',
      CreditorInitialBalance: 'Type B',
      debtorTheMovement: '567',
      CreditorTheMovement: '890',
      debtorNetTraffic: 'Account B',
      CreditorNetTraffic: 'Statement B',
      debtorClosingBalance: 200,
      creditorClosingBalance: 100,
    },
    {
      account: 'المصروفات التشغيلية  تكلفة الايرادات	',
      debtorInitialBalance: '234',
      CreditorInitialBalance: 'Type B',
      debtorTheMovement: '567',
      CreditorTheMovement: '890',
      debtorNetTraffic: 'Account B',
      CreditorNetTraffic: 'Statement B',
      debtorClosingBalance: 200,
      creditorClosingBalance: 100,
      bgred: true,
    },
    {
      account: '53 - مصروف اهلاك',
      debtorInitialBalance: '234',
      CreditorInitialBalance: 'Type B',
      debtorTheMovement: '567',
      CreditorTheMovement: '890',
      debtorNetTraffic: 'Account B',
      CreditorNetTraffic: 'Statement B',
      debtorClosingBalance: 200,
      creditorClosingBalance: 100,
    },
    {
      account: '41 - ايرادات عامة	',
      debtorInitialBalance: '234',
      CreditorInitialBalance: 'Type B',
      debtorTheMovement: '567',
      CreditorTheMovement: '890',
      debtorNetTraffic: 'Account B',
      CreditorNetTraffic: 'Statement B',
      debtorClosingBalance: 200,
      creditorClosingBalance: 100,
    },
    {
      account: 'مجمل الربح	',
      debtorInitialBalance: '234',
      CreditorInitialBalance: 'Type B',
      debtorTheMovement: '567',
      CreditorTheMovement: '890',
      debtorNetTraffic: 'Account B',
      CreditorNetTraffic: 'Statement B',
      debtorClosingBalance: 200,
      creditorClosingBalance: 100,
      bgred: false,
    },
    {
      account: 'اجمالى المصروفات	',
      debtorInitialBalance: '234',
      CreditorInitialBalance: 'Type B',
      debtorTheMovement: '567',
      CreditorTheMovement: '890',
      debtorNetTraffic: 'Account B',
      CreditorNetTraffic: 'Statement B',
      debtorClosingBalance: 200,
      creditorClosingBalance: 100,
      bgred: true,
    },
    {
      account: '42 - ايرادات اخري	',
      debtorInitialBalance: '234',
      CreditorInitialBalance: 'Type B',
      debtorTheMovement: '567',
      CreditorTheMovement: '890',
      debtorNetTraffic: 'Account B',
      CreditorNetTraffic: 'Statement B',
      debtorClosingBalance: 200,
      creditorClosingBalance: 100,
    },
  ];

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
      creditor: 50,
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
      creditor: 150,
    },
  ];

  showTable: boolean = false;
  Switchmonitor: boolean = false;
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
      ar: 'قائمة الدخل  ',
      en: 'income list',
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
    'costCenter',
  ];

  projectUsersColumns: string[] = ['name', 'responsibility'];
  projectTasksColumns: string[] = ['taskName', 'name', 'duration'];

  userPermissionsDataSource = new MatTableDataSource();

  projectGoalsDataSource = new MatTableDataSource();

  projectUsersDataSource = new MatTableDataSource();
  projectTasksDataSource = new MatTableDataSource();

  projectsDataSource = new MatTableDataSource();

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





  lang: any = 'ar';

  startDate = new Date();
  endDate = new Date();
  constructor(
    private modalService: NgbModal,
    private _accountsreportsService: AccountsreportsService,
    private toast: ToastrService,
    private translate: TranslateService,
    private api: RestApiService,
    private print: NgxPrintElementService,
    private _sharedService: SharedService
  ) {
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();
    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
    api.lang.subscribe((res) => {
      this.lang = res;
    });
  }

  ChooseLevellist = [
    { id: 7, name: ' مقارنة بفترة سابقة' },
    { id: 1, name: ' السنة الماضية' },
    { id: 4, name: ' الشهر الماضي' },
    { id: 3, name: ' الربع السابق' },
    { id: 5, name: ' الأسبوع السابق' },
    { id: 6, name: ' اليوم السابق' },
  ];

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

  ngOnInit(): void {
    this.FillCostCenterSelect();
    this.projectsDataSource = new MatTableDataSource();

    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );
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
        size: type == 'edit' ? 'xl' : 'lg',
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
            };
          }
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  filtertypeList: any = [];
  FillFilteringIncomeStateSelect() {
    this.data.filter.filtertypeid = null;
    this._accountsreportsService
      .FillFilteringIncomeStateSelect(this.data.filter.filteringTypeAll)
      .subscribe((data) => {
        this.filtertypeList = data;
      });
  }
  FilteringTypeStrList: any = [];
  FillFilteringIncomeStateSelectfilteringType() {
    if (
      this.data.filter.filteringType != this.data.filter.filteringTypeAllTwo
    ) {
      this.data.filter.FilteringTypeStr = [];
      this._accountsreportsService
        .FillFilteringIncomeStateSelect(this.data.filter.filteringType)
        .subscribe((data) => {
          this.FilteringTypeStrList = data;
        });
    } else {
      this.toast.error('لا يمكن اختيار البعد مثل التصفيه', 'رسالة');
    }
  }
  FilteringTypeStrList2: any = [];
  FillFilteringIncomeStateSelectFilteringTypeAll2() {
    if (typeof this.data.filter.filteringTypeAllTwo != 'number') {
      this.data.filter.filteringTypeAllTwo = null;
      return;
    }
    if (
      this.data.filter.filteringType != this.data.filter.filteringTypeAllTwo
    ) {
      this.data.filter.FilteringTypeAllStr = [];
      this._accountsreportsService
        .FillFilteringIncomeStateSelect(this.data.filter.filteringTypeAllTwo)
        .subscribe((data) => {
          this.FilteringTypeStrList2 = data;
        });
    } else {
      this.toast.error('لا يمكن اختيار البعد مثل التصفيه', 'رسالة');
    }
  }
  load_costCenters: any;
  FillCostCenterSelect() {
    this._accountsreportsService.FillCostCenterSelect().subscribe((data) => {
      this.load_costCenters = data;
    });
  }
  filteringTypeList: any = [
    { id: 12, name: 'العملاء' },
    { id: 13, name: 'الموردين' },
    { id: 11, name: 'المشاريع' },
    { id: 15, name: 'الموظفين' },
    { id: 14, name: 'الفروع' },
    { id: 16, name: 'الخدمات' },
  ];
  data: any = {
    filter: {
      enable: false,
      date: null,
      lvlid: null,
      choseid: null,
      DateFrom_P: null,
      DateTo_P: null,
      filtertypeid: null,
      filteringType: null,
      CostCenter: null,
      filteringTypeAll: null,
      ZeroCheck: null,
      FilteringTypeStr: [],
      FilteringTypeAllStr: [],
      filteringTypeAllTwo: null,
      AccountIds: null,
      LVL: null,
      PeriodFillterType: null,
      PeriodCounter: null,
      TypeF: null,
    },
  };
  rest() {
    this.data = {
      filter: {
        enable: false,
        date: null,
        lvlid: null,
        choseid: null,
        DateFrom_P: null,
        DateTo_P: null,
        filtertypeid: null,
        filteringType: null,
        CostCenter: null,
        filteringTypeAll: null,
        ZeroCheck: null,
        FilteringTypeStr: [],
        FilteringTypeAllStr: [],
        filteringTypeAllTwo: null,
        AccountIds: null,
        LVL: null,
        PeriodFillterType: null,
        PeriodCounter: null,
        TypeF: null,
      },
    };
  }
  subtractDays(date: any, days: any) {
    date.setDate(date.getDate() - days);
    return date;
  }
  subtractMonths(date: any, months: any) {
    date.setMonth(date.getMonth() - months);
    return date;
  }
  subtractYears(date: any, years: any) {
    date.setFullYear(date.getFullYear() - years);
    return date;
  }
  addDays(date: any, days: any) {
    date.setDate(date.getDate() + days);
    return date;
  }
  GetStartYear(date: any) {
    var dateY = new Date(date);
    var yyyy = dateY.getFullYear();
    var FDayOfYear = yyyy + '-' + '01' + '-' + '01';
    var dateYy = new Date(FDayOfYear);
    return dateYy;
  }
  SetStartDate() {
    if (this.data.filter.DateTo_P == null) {
      this.toast.error(this.translate.instant('Date Choose'));
      return;
    }
    var FromDate_V = '';

    if (
      this.data.filter.DateTo_P != '' &&
      this.data.filter.filteringTypeAll >= 0 &&
      this.data.filter.filtertypeid > 0
    ) {
      var date = new Date(this.data.filter.DateTo_P);
      if (this.data.filter.filteringTypeAll == 1) {
        var NEWDate = this.subtractYears(date, 1);
        NEWDate = this.addDays(NEWDate, 1);
        FromDate_V = this._sharedService.date_TO_String(NEWDate);
        this.data.filter.DateFrom_P = FromDate_V;
        this.data.filter.DateTo_P = this._sharedService.date_TO_String(
          this.data.filter.DateTo_P
        );
      } else if (this.data.filter.filteringTypeAll == 2) {
        var NEWDate = this.subtractMonths(date, 6);
        NEWDate = this.addDays(NEWDate, 1);
        FromDate_V = this._sharedService.date_TO_String(NEWDate);
        this.data.filter.DateFrom_P = FromDate_V;
        this.data.filter.DateTo_P = this._sharedService.date_TO_String(
          this.data.filter.DateTo_P
        );
      } else if (this.data.filter.filteringTypeAll == 3) {
        var NEWDate = this.subtractMonths(date, 3);
        NEWDate = this.addDays(NEWDate, 1);
        FromDate_V = this._sharedService.date_TO_String(NEWDate);
        this.data.filter.DateFrom_P = FromDate_V;
        this.data.filter.DateTo_P = this._sharedService.date_TO_String(
          this.data.filter.DateTo_P
        );
      } else if (this.data.filter.filteringTypeAll == 4) {
        var NEWDate = this.subtractMonths(date, 1);
        NEWDate = this.addDays(NEWDate, 1);
        FromDate_V = this._sharedService.date_TO_String(NEWDate);
        this.data.filter.DateFrom_P = FromDate_V;
        this.data.filter.DateTo_P = this._sharedService.date_TO_String(
          this.data.filter.DateTo_P
        );
      } else if (this.data.filter.filteringTypeAll == 5) {
        var NEWDate = this.subtractDays(date, 7);
        NEWDate = this.addDays(NEWDate, 1);
        FromDate_V = this._sharedService.date_TO_String(NEWDate);
        this.data.filter.DateFrom_P = FromDate_V;
        this.data.filter.DateTo_P = this._sharedService.date_TO_String(
          this.data.filter.DateTo_P
        );
      } else if (this.data.filter.filteringTypeAll == 6) {
        var NEWDate = this.subtractDays(date, 0);
        FromDate_V = this._sharedService.date_TO_String(NEWDate);
        this.data.filter.DateFrom_P = FromDate_V;
        this.data.filter.DateTo_P = this._sharedService.date_TO_String(
          this.data.filter.DateTo_P
        );
      } else if (this.data.filter.filteringTypeAll == 7) {
        var NEWDate: any = this.GetStartYear(date);
        FromDate_V = this._sharedService.date_TO_String(NEWDate);
        this.data.filter.DateFrom_P = FromDate_V;
        this.data.filter.DateTo_P = this._sharedService.date_TO_String(
          this.data.filter.DateTo_P
        );
      }
    }
    this.data.filter.DateFrom_P = new Date(this.data.filter.DateFrom_P);
    this.data.filter.DateTo_P = new Date(this.data.filter.DateTo_P);
    this.RefreshData();
  }
  // SetStartDateAll() {
  //   var FromDate_V = "";
  //   if (this.data.filter.DateTo_P != "" && this.data.filter.filteringTypeAll >= 0 && this.data.filter.filteringTypeAll <= 10 && this.data.filter.filtertypeid > 0) {
  //     var date = new Date(this.data.filter.DateTo_P);
  //     if (this.data.filter.filteringTypeAll == 1) {
  //       var NEWDate = this.subtractYears(date, 1); NEWDate = this.addDays(NEWDate, 1); FromDate_V = this._sharedService.date_TO_String(NEWDate);
  //       this.data.filter.DateTo_P = FromDate_V;
  //     }
  //     else if (this.data.filter.filteringTypeAll == 2) {
  //       var NEWDate = this.subtractMonths(date, 6); NEWDate = this.addDays(NEWDate, 1); FromDate_V = this._sharedService.date_TO_String(NEWDate);
  //       this.data.filter.DateTo_P = FromDate_V;
  //     }
  //     else if (this.data.filter.filteringTypeAll == 3) {
  //       var NEWDate = this.subtractMonths(date, 3); NEWDate = this.addDays(NEWDate, 1); FromDate_V = this._sharedService.date_TO_String(NEWDate);
  //       this.data.filter.DateTo_P = FromDate_V;
  //     }
  //     else if (this.data.filter.filteringTypeAll == 4) {
  //       var NEWDate = this.subtractMonths(date, 1); NEWDate = this.addDays(NEWDate, 1); FromDate_V = this._sharedService.date_TO_String(NEWDate);
  //       this.data.filter.DateTo_P = FromDate_V;
  //     }
  //     else if (this.data.filter.filteringTypeAll == 5) {
  //       var NEWDate = this.subtractDays(date, 7); NEWDate = this.addDays(NEWDate, 1); FromDate_V = this._sharedService.date_TO_String(NEWDate);
  //       this.data.filter.DateTo_P = FromDate_V;
  //     }
  //     else if (this.data.filter.filteringTypeAll == 6) {
  //       var NEWDate = this.subtractDays(date, 0); FromDate_V = this._sharedService.date_TO_String(NEWDate);
  //       this.data.filter.DateTo_P = FromDate_V;
  //     }
  //     else if (this.data.filter.filteringTypeAll == 7) {
  //       var NEWDate: any = this.GetStartYear(date); FromDate_V = this._sharedService.date_TO_String(NEWDate);
  //       this.data.filter.DateTo_P = FromDate_V;
  //     }
  //   }
  // }

  projectsDataSourceTemp: any = [];
  DataSource: any = [];
  RefreshData() {
    if (this.data.filter.choseid == null) {
      return;
    }
    var _voucherFilterVM = new ReportCustomer();
    _voucherFilterVM.lvl = this.data.filter.choseid;
    _voucherFilterVM.filtertypeid = this.data.filter.filtertypeid;
    _voucherFilterVM.filteringType = this.data.filter.filteringType;
    _voucherFilterVM.FilteringTypeStr = this.data.filter.FilteringTypeStr;
    _voucherFilterVM.FilteringTypeAllStr = this.data.filter.FilteringTypeAllStr;
    _voucherFilterVM.CostCenter = this.data.filter.CostCenter;

    if (this.showFilters == true) {
      _voucherFilterVM.filteringTypeAll = this.data.filter.filteringTypeAllTwo;
    } else {
      _voucherFilterVM.filteringTypeAll = this.data.filter.filteringTypeAll;
    }
    // _voucherFilterVM.dateFrom = this.data.filter.DateFrom_P;
    // _voucherFilterVM.dateTo = this.data.filter.DateTo_P;
    if (typeof this.data.filter.DateFrom_P != 'string') {
      _voucherFilterVM.dateFrom = this._sharedService.date_TO_String(
        this.data.filter.DateFrom_P
      );
    }
    if (typeof this.data.filter.DateTo_P != 'string') {
      _voucherFilterVM.dateTo = this._sharedService.date_TO_String(
        this.data.filter.DateTo_P
      );
    }
    if (typeof this.data.filter.DateTo_P == 'string') {
      _voucherFilterVM.dateTo = this.data.filter.DateTo_P;
      this.data.filter.DateTo_P = new Date(this.data.filter.DateTo_P);
    }
    if (typeof this.data.filter.DateFrom_P == 'string') {
      _voucherFilterVM.dateFrom = this.data.filter.DateFrom_P;
      this.data.filter.DateFrom_P = new Date(this.data.filter.DateFrom_P);
    }

    if (this.showTable == true) {
      _voucherFilterVM.zeroCheck = 1;
    } else {
      _voucherFilterVM.zeroCheck = 0;
    }

    var FilteringType = 0;
    var PeriodFillterTypev: any = '0';
    var PeriodCounterv: any = '1';
    var TypeF = 0;
    if (this.showFilters == true) {
      var FilteringSelectAllTypevv = this.data.filter.filteringTypeAllTwo;
      if (FilteringSelectAllTypevv >= 0 && FilteringSelectAllTypevv <= 10) {
        PeriodFillterTypev = this.data.filter.filteringTypeAllTwo;
        PeriodCounterv = 0;
        if (!(PeriodCounterv > 0)) {
          PeriodCounterv = 0;
        }
        TypeF = 0;
      } else {
        PeriodFillterTypev = this.data.filter.filteringTypeAllTwo;
        PeriodCounterv = 1;
        TypeF = FilteringSelectAllTypevv - 10;
      }
    } else {
      TypeF = 0;
      FilteringType = 0;
      if (this.data.filter.filteringTypeAll > 0) {
        PeriodFillterTypev = this.data.filter.filteringTypeAll;
        PeriodCounterv = this.data.filter.filtertypeid;
        if (!(PeriodCounterv > 0)) {
          PeriodCounterv = 0;
        }
      } else {
        PeriodFillterTypev = '0';
        PeriodCounterv = '1';
      }
    }
    _voucherFilterVM.periodFillterType = PeriodFillterTypev;
    _voucherFilterVM.periodCounter = PeriodCounterv;
    _voucherFilterVM.typeF = TypeF;
    var obj = _voucherFilterVM;
    this._accountsreportsService.GetIncomeStatmentDGVLevels(obj).subscribe(
      (data: any) => {
        // if (typeof this.data.filter.DateFrom_P == 'string') {
        //   this.data.filter.DateFrom_P = new Date(this.data.filter.DateFrom_P);
        // }

        // if (typeof this.data.filter.DateTo_P == 'string') {
        //   this.data.filter.DateTo_P =new Date(this.data.filter.DateTo_P);
        // }
        data.result.sort(
          (a: { id: number }, b: { id: number }) => (a.id ?? 0) - (b.id ?? 0)
        ); // b - a for reverse sort

        this.projectsDataSource = new MatTableDataSource(data.result);
        this.DataSource = data.result;
        this.projectsDataSourceTemp = data.result;
        this.projectsDataSource.paginator = this.paginator;
        this.projectsDataSource.sort = this.sort;
        console.log(data.result);
      },
      (err: any) => {
        // this.data.filter.DateFrom_P = new Date(this.data.filter.DateFrom_P);
        // this.data.filter.DateTo_P = new Date(this.data.filter.DateTo_P);
      }
    );
  }

  exportData() {
    var list: any = [];
    this.DataSource.forEach((element: any) => {
      if (element.accountCode == '00000') {
        list.push(element.totalResult);
      }
    });

    let x = this.DataSource.map((item: any) => {
      let transformedObj: any = { accountNameCode: item.accountNameCode };

      item.totalResult.forEach((result: any, index: any) => {
        // transformedObj[`totalResult${index + 1}`] = result;
        transformedObj[list[0][index]] = result;
      });

      return transformedObj;
    });

    this.lang == 'ar'
      ? this._accountsreportsService.customExportExcel(x, 'قائمة الدخل  ')
      : this._accountsreportsService.customExportExcel(x, 'income list');
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
      this.data.filter.date = null;
      this.data.filter.DateTo_P = null;
      this.RefreshData();
    }
  }
  valapplyFilter: any;

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    this.valapplyFilter = val;

    const tempsource = this.projectsDataSourceTemp.filter(function (d: any) {
      return d.accountNameCode != null
        ? d.accountNameCode.toString()?.trim().toLowerCase().indexOf(val) !==
            -1 || !val
        : '';
    });
    this.projectsDataSource = new MatTableDataSource(tempsource);
    this.projectsDataSource.paginator = this.paginator;
    this.DataSource = tempsource;
    this.projectsDataSource.sort = this.sort;
  }
  OrganizationData: any;
  environmentPho: any;
  dateprint: any;
  printprojectsDataSource: any;
  BranchName: any;
  getPrintdata(id: any) {
    if (this.data.filter.choseid == null) {
      return;
    }
    var _voucherFilterVM = new ReportCustomer();
    _voucherFilterVM.lvl = this.data.filter.choseid;
    _voucherFilterVM.filtertypeid = this.data.filter.filtertypeid;
    _voucherFilterVM.filteringType = this.data.filter.filteringType;
    _voucherFilterVM.FilteringTypeStr = this.data.filter.FilteringTypeStr;
    _voucherFilterVM.FilteringTypeAllStr = this.data.filter.FilteringTypeAllStr;
    _voucherFilterVM.CostCenter = this.data.filter.CostCenter;

    if (this.showFilters == true) {
      _voucherFilterVM.filteringTypeAll = this.data.filter.filteringTypeAllTwo;
    } else {
      _voucherFilterVM.filteringTypeAll = this.data.filter.filteringTypeAll;
    }
    if (
      this.data.filter.DateFrom_P != null &&
      this.data.filter.DateTo_P != null
    ) {
      if (typeof this.data.filter.DateFrom_P != 'string') {
        _voucherFilterVM.dateFrom = this._sharedService.date_TO_String(
          this.data.filter.DateFrom_P
        );
      }
      if (typeof this.data.filter.DateTo_P != 'string') {
        _voucherFilterVM.dateTo = this._sharedService.date_TO_String(
          this.data.filter.DateTo_P
        );
      }
      // _voucherFilterVM.dateFrom = this.data.filter.DateFrom_P.toString();
      // _voucherFilterVM.dateTo = this.data.filter.DateTo_P.toString();
    }
    if (this.showTable == true) {
      _voucherFilterVM.zeroCheck = 1;
    } else {
      _voucherFilterVM.zeroCheck = 0;
    }
    var obj = _voucherFilterVM;
    this._accountsreportsService.GetReportIncomeLevels(obj).subscribe(
      (data: any) => {
        // if (typeof this.data.filter.DateFrom_P != 'string') {
        //   this.data.filter.DateFrom_P = this._sharedService.date_TO_String(this.data.filter.DateFrom_P);
        // }

        // if (typeof this.data.filter.DateTo_P != 'string') {
        //   this.data.filter.DateTo_P = this._sharedService.date_TO_String(this.data.filter.DateTo_P);
        // }

        this.printprojectsDataSource = [];
        const val = this.valapplyFilter;
        this.dateprint = data.dateTimeNow;
        this.OrganizationData = data.org_VD;
                this.BranchName = data.branchName;
        this.environmentPho =
          environment.PhotoURL + this.OrganizationData.logoUrl;
        const tempsource = data.result.filter(function (d: any) {
          return d.accountNameCode != null
            ? d.accountNameCode
                .toString()
                ?.trim()
                .toLowerCase()
                .indexOf(val) !== -1 || !val
            : '';
        });

        this.printprojectsDataSource = tempsource;

        setTimeout(() => {
          this.print.print(id, environment.printConfig);
        }, 500);
      },
      (err) => {}
    );
  }
  DetailsMonitorBranch: any;
  DetailsMonitorService: any;
  DetailsMonitorProject: any;
  DetailsMonitorEmployee: any;
  DetailsMonitorVoucher: any;
  DetailsMonitorCustomer: any;
  DetailsMonitorSupplier: any;
  MonitorName: any;
  @ViewChild('DetailsMonitorModal') DetailsMonitorModal: any;

  GetDetailsMonitor(item: any, id: any) {
    console.log(item);
    console.log(id);
    debugger;
    if (
      this.data.filter.DateFrom_P != null &&
      this.data.filter.DateTo_P != null
    ) {
      if (this.Switchmonitor == true) {
        this.MonitorName = item.acc_NameAr;
        this.DetailsMonitorProject = [];
        this.DetailsMonitorService = [];
        this.DetailsMonitorCustomer = [];
        this.DetailsMonitorEmployee = [];
        this.DetailsMonitorSupplier = [];
        this.DetailsMonitorVoucher = [];
        this.DetailsMonitorBranch = [];
        this.GetDetailsMonitor_Func1(item, 1, id);
        this.GetDetailsMonitor_Func2(item, 2, id);
        this.GetDetailsMonitor_Func3(item, 3, id);
        this.GetDetailsMonitor_Func4(item, 4, id);
        this.GetDetailsMonitor_Func5(item, 5, id); //llmwzfen
        this.open(this.DetailsMonitorModal);
      } else {
        return;
      }
    }
  }

  GetDetailsMonitor_Func1(item: any, type: any, id: any) {
    var _voucherFilterVM = new ReportCustomer();

    if (
      this.data.filter.DateFrom_P != null &&
      this.data.filter.DateTo_P != null
    ) {
      if (typeof this.data.filter.DateFrom_P != 'string') {
        _voucherFilterVM.dateFrom = this._sharedService.date_TO_String(
          this.data.filter.DateFrom_P
        );
      }
      if (typeof this.data.filter.DateTo_P != 'string') {
        _voucherFilterVM.dateTo = this._sharedService.date_TO_String(
          this.data.filter.DateTo_P
        );
      }
    }
    var obj = {
      AccointId: item.accountID,
      Type: type,
      Type2: id,
      FromDate: _voucherFilterVM.dateFrom,
      ToDate: _voucherFilterVM.dateTo,
      CostCenter: this.data.filter.CostCenter,
      ZeroCheck: this.data.filter.zeroCheck,
      FilteringType: this.data.filter.filteringType,
      FilteringTypeAll: this.data.filter.filteringTypeAll,
      FilteringTypeStr: this.data.filter.FilteringTypeStr,
      FilteringTypeAllStr: this.data.filter.FilteringTypeAllStr,
      AccountIds: '0',
      LVL: this.data.filter.choseid,
    };
    debugger;
    this._accountsreportsService
      .GetIncomeStatmentDGVLevelsdetails(obj)
      .subscribe(
        (data: any) => {
          debugger
          data.result.forEach((element: any) => {
            this.DetailsMonitorVoucher.push(element);
            this.DetailsMonitorBranch.push(element);

          });
        },
        (err) => {}
      );
  }
  GetDetailsMonitor_Func2(item: any, type: any, id: any) {
    var _voucherFilterVM = new ReportCustomer();

    if (
      this.data.filter.DateFrom_P != null &&
      this.data.filter.DateTo_P != null
    ) {
      if (typeof this.data.filter.DateFrom_P != 'string') {
        _voucherFilterVM.dateFrom = this._sharedService.date_TO_String(
          this.data.filter.DateFrom_P
        );
      }
      if (typeof this.data.filter.DateTo_P != 'string') {
        _voucherFilterVM.dateTo = this._sharedService.date_TO_String(
          this.data.filter.DateTo_P
        );
      }
    }
    var obj = {
      AccointId: item.accountID,
      Type: type,
      Type2: id,
      FromDate: _voucherFilterVM.dateFrom,
      ToDate: _voucherFilterVM.dateTo,
      CostCenter: this.data.filter.CostCenter,
      ZeroCheck: this.data.filter.zeroCheck,
      FilteringType: this.data.filter.filteringType,
      FilteringTypeAll: this.data.filter.filteringTypeAll,
      FilteringTypeStr: this.data.filter.FilteringTypeStr,
      FilteringTypeAllStr: this.data.filter.FilteringTypeAllStr,
      AccountIds: '0',
      LVL: this.data.filter.choseid,
    };
    this._accountsreportsService
      .GetIncomeStatmentDGVLevelsdetails(obj)
      .subscribe(
        (data: any) => {
          data.result.forEach((element: any) => {
            this.DetailsMonitorProject.push(element);
          });
        },
        (err) => {}
      );
  }
  GetDetailsMonitor_Func3(item: any, type: any, id: any) {
    var _voucherFilterVM = new ReportCustomer();

    if (
      this.data.filter.DateFrom_P != null &&
      this.data.filter.DateTo_P != null
    ) {
      if (typeof this.data.filter.DateFrom_P != 'string') {
        _voucherFilterVM.dateFrom = this._sharedService.date_TO_String(
          this.data.filter.DateFrom_P
        );
      }
      if (typeof this.data.filter.DateTo_P != 'string') {
        _voucherFilterVM.dateTo = this._sharedService.date_TO_String(
          this.data.filter.DateTo_P
        );
      }
    }
    var obj = {
      AccointId: item.accountID,
      Type: type,
      Type2: id,
      FromDate: _voucherFilterVM.dateFrom,
      ToDate: _voucherFilterVM.dateTo,
      CostCenter: this.data.filter.CostCenter,
      ZeroCheck: this.data.filter.zeroCheck,
      FilteringType: this.data.filter.filteringType,
      FilteringTypeAll: this.data.filter.filteringTypeAll,
      FilteringTypeStr: this.data.filter.FilteringTypeStr,
      FilteringTypeAllStr: this.data.filter.FilteringTypeAllStr,
      AccountIds: '0',
      LVL: this.data.filter.choseid,
    };
    this._accountsreportsService
      .GetIncomeStatmentDGVLevelsdetails(obj)
      .subscribe(
        (data: any) => {
          data.result.forEach((element: any) => {
            this.DetailsMonitorService.push(element);
          });
        },
        (err) => {}
      );
  }
  GetDetailsMonitor_Func4(item: any, type: any, id: any) {
    var _voucherFilterVM = new ReportCustomer();

    if (
      this.data.filter.DateFrom_P != null &&
      this.data.filter.DateTo_P != null
    ) {
      if (typeof this.data.filter.DateFrom_P != 'string') {
        _voucherFilterVM.dateFrom = this._sharedService.date_TO_String(
          this.data.filter.DateFrom_P
        );
      }
      if (typeof this.data.filter.DateTo_P != 'string') {
        _voucherFilterVM.dateTo = this._sharedService.date_TO_String(
          this.data.filter.DateTo_P
        );
      }
    }
    var obj = {
      AccointId: item.accountID,
      Type: type,

      Type2: id,
      FromDate: _voucherFilterVM.dateFrom,
      ToDate: _voucherFilterVM.dateTo,
      CostCenter: this.data.filter.CostCenter,
      ZeroCheck: this.data.filter.zeroCheck,
      FilteringType: this.data.filter.filteringType,
      FilteringTypeAll: this.data.filter.filteringTypeAll,
      FilteringTypeStr: this.data.filter.FilteringTypeStr,
      FilteringTypeAllStr: this.data.filter.FilteringTypeAllStr,
      AccountIds: '0',
      LVL: this.data.filter.choseid,
    };
    this._accountsreportsService
      .GetIncomeStatmentDGVLevelsdetails(obj)
      .subscribe(
        (data: any) => {
          console.log("data.result");
          console.log(data.result);
          data.result.forEach((element: any) => {
            console.log("element");
            console.log(element);


            debugger
            if (element.customername !="") {
              this.DetailsMonitorCustomer.push(element);
            }
            if (element.employeename !="") {
              this.DetailsMonitorEmployee.push(element);
            }
            if (element.suppliername !="") {
              this.DetailsMonitorSupplier.push(element);
            }


            // if (element.cus_Emp_Sup == 1) {
            //   this.DetailsMonitorCustomer.push(element);
            // }
            // if (element.cus_Emp_Sup == 2) {
            //   this.DetailsMonitorEmployee.push(element);
            // }
            // if (element.cus_Emp_Sup == 3) {
            //   this.DetailsMonitorSupplier.push(element);
            // }
          });
        },
        (err) => {}
      );
  }
  GetDetailsMonitor_Func5(item: any, type: any, id: any) {
    var _voucherFilterVM = new ReportCustomer();

    if (
      this.data.filter.DateFrom_P != null &&
      this.data.filter.DateTo_P != null
    ) {
      if (typeof this.data.filter.DateFrom_P != 'string') {
        _voucherFilterVM.dateFrom = this._sharedService.date_TO_String(
          this.data.filter.DateFrom_P
        );
      }
      if (typeof this.data.filter.DateTo_P != 'string') {
        _voucherFilterVM.dateTo = this._sharedService.date_TO_String(
          this.data.filter.DateTo_P
        );
      }
    }
    var obj = {
      AccointId: item.accountID,
      Type: type,

      Type2: id,
      FromDate: _voucherFilterVM.dateFrom,
      ToDate: _voucherFilterVM.dateTo,
      CostCenter: this.data.filter.CostCenter,
      ZeroCheck: this.data.filter.zeroCheck,
      FilteringType: this.data.filter.filteringType,
      FilteringTypeAll: this.data.filter.filteringTypeAll,
      FilteringTypeStr: this.data.filter.FilteringTypeStr,
      FilteringTypeAllStr: this.data.filter.FilteringTypeAllStr,
      AccountIds: '0',
      LVL: this.data.filter.choseid,
    };
    this._accountsreportsService
      .GetIncomeStatmentDGVLevelsdetails(obj)
      .subscribe(
        (data: any) => {
          console.log("data.result");
          console.log(data.result);
          data.result.forEach((element: any) => {
            console.log("element");
            console.log(element);

            if (element.employeename !="") {
              this.DetailsMonitorEmployee.push(element);
            }
          });
        },
        (err) => {}
      );
  }

  ChangeClass(entry: any) {
    switch (entry.accountCode) {
      case '0':
        return 'justify-center w-full bg-green-700 text-white';
      case '00':
        return 'justify-center w-full bg-red-700 text-white';
      case '000':
        return 'justify-center w-full bg-green-700 text-white';
      case '0000':
        return 'justify-center w-full bg-red-700 text-white';
      case '00000':
        return 'justify-center w-full bg-white-700 text-white';
      default:
        return '';
    }
  }
  ChangeClassTD(entry: any) {
    switch (entry.accountCode) {
      case '00000':
        return 'bg-white-700 text-white';
      default:
        return '';
    }
  }
  ChangeClassP(entry: any) {
    debugger;
    switch (entry.accountCode) {
      case '0':
        return 'text-center h-full w-full bg-green-700 text-white';
      case '00':
        return 'text-center h-full w-full bg-red-700 text-white';
      case '000':
        return 'text-center h-full w-full bg-green-700 text-white';
      case '0000':
        return 'text-center h-full w-full bg-red-700 text-white';
      case '00000':
        return 'text-center h-full w-full bg-white-700 text-white';
      default:
        return '';
    }
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
