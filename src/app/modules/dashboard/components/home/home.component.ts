import { FilesSearchComponent } from './../../../communications/files-search/files-search.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DOCUMENT, DatePipe } from '@angular/common';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { WorkordersService } from 'src/app/core/services/pro_Services/workorders.service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RestApiService } from 'src/app/shared/services/api.service';
import {
  trigger,
  state,
  style,
  AUTO_STYLE,
  transition,
  animate,
} from '@angular/animations';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { HomeServiceService } from 'src/app/core/services/Dashboard-Services/home-service.service';
import { EmployeeLoanService } from 'src/app/core/services/Employees-Services/employee-loan.service';
import { ToastrService } from 'ngx-toastr';
import { Loan } from 'src/app/core/Classes/DomainObjects/loan';
import { Vacation } from 'src/app/core/Classes/DomainObjects/vacations';
import { StaffholidayServiceService } from 'src/app/core/services/Employees-Services/staffholiday-service.service';
import { VacationVM } from 'src/app/core/Classes/ViewModels/vacationVM';
import { SharedService } from 'src/app/core/services/shared.service';
import { environment } from 'src/environments/environment';
import { PhasestaskService } from 'src/app/core/services/pro_Services/phasestask.service';
import { ProjectVM } from 'src/app/core/Classes/ViewModels/projectVM';
import { ProjectService } from 'src/app/core/services/pro_Services/project.service';
import { InvoiceService } from 'src/app/core/services/acc_Services/invoice.service';
import { AlertService } from 'src/app/core/services/Employees-Services/AlertService';
import { NotificationVM } from 'src/app/core/Classes/ViewModels/notificationVM';
import { ProjectPhasesTasksVM } from 'src/app/core/Classes/ViewModels/projectPhasesTasksVM';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ProreportsService } from 'src/app/core/services/pro_Services/proreports.service';
import { FollowprojectService } from 'src/app/core/services/pro_Services/followproject.service';
import { SupervisionsService } from 'src/app/core/services/pro_Services/supervisions.service';
import { EmployeeReportService } from 'src/app/core/services/Employees-Services/employee-report.service';
import { AttendenceVM } from 'src/app/core/Classes/ViewModels/attendenceVM';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { NgxPrintElementService } from 'ngx-print-element';
import printJS from 'print-js';
import { PrintreportsService } from 'src/app/core/services/acc_Services/printreports.service';
import { HttpEventType } from '@angular/common/http';

const DEFAULT_DURATION = 300;

@Component({
  selector: 'app-web-analysis',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out')),
    ]),
  ],
  providers: [DatePipe],
})
export class HomeComponent implements OnInit {
  @ViewChild('userChart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions> | any;
  // public chartOptionsTask!: Partial<ChartOptions> | any;

  lang: any = 'ar';

  @ViewChild('tasksPaginator') tasksPaginator!: MatPaginator;
  @ViewChild('NewtasksPaginator') NewtasksPaginator!: MatPaginator;

  @ViewChild('LateTaskPaginator') LateTaskPaginator!: MatPaginator;
  @ViewChild('NewWorkOrderPaginator') NewWorkOrderPaginator!: MatPaginator;
  @ViewChild('LateWorkOrderPaginator') LateWorkOrderPaginator!: MatPaginator;
  @ViewChild('tasksPaginator2') tasksPaginator2!: MatPaginator;
  @ViewChild('ProjectPaginator') ProjectPaginator!: MatPaginator;
  @ViewChild('ProjectPaginator2') ProjectPaginator2!: MatPaginator;

  @ViewChild('tasksSort') tasksSort!: MatSort;
  @ViewChild('tasksSort2') tasksSort2!: MatSort;

  @ViewChild('acceptModal') acceptModal: any;
  @ViewChild('rejectModal') rejectModal: any;
  @ViewChild('reviewModal') reviewModal: any;
  @ViewChild('confirmModal') confirmModal: any;
  @ViewChild('confirmloanModal') confirmloanModal: any;
  @ViewChild('notifications') notifications: any;

  @ViewChild('delayModal') delayModal: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isRTL = true;

  page: any;
  ColumnMode = ColumnMode;
  pageNumber: any;
  size: any;
  totalElements: any;
  filters = [
    { name: 'الاسبوع الحالي', id: 1 },
    { name: 'الشهر الحالي', id: 2 },
    { name: 'العام الحالي', id: 3 },
  ];

  selectedOrderFilter: any = 1;
  selectedBillsFilter: any = 1;
  selectedQuestionsFilter: any = 1;

  date = new Date();
  elem: any;
  active = false;
  activeClient = false;
  index = 0;
  pathurl = environment.PhotoURL;

  rows: any = {
    projects: new MatTableDataSource([]),
    projects2: new MatTableDataSource([]),
    CostTasks: new MatTableDataSource([]),
    WorkOrders: new MatTableDataSource([]),
  };

  selectedDate: any = 1;

  selectedDate2: any = 1;

  selectedDate3: any = 1;

  dates = [
    { id: 0, name: { ar: 'الكل', en: 'All' } },
    { id: 1, name: { ar: 'هذا اليوم', en: 'this Day' } },
    { id: 2, name: { ar: 'هذا الاسبوع', en: 'this Week' } },
    { id: 3, name: { ar: 'هذا الشهر', en: 'this Month' } },
  ];

  columns1: any = {
    tasks: [
      'taskName',
      'Customer',
      'Project',
      'Description',
      'PhaseName',
      'status',
      'duration',
      'remaining',
      'requests',
    ],

    latetasks: ['taskName', 'Customer', 'PhaseName', 'Project', 'requests'],

    workorder: ['taskName', 'Customer', 'Project', 'Description'],
    projects: [
      'CustomerName',
      'Description',
      // 'ProjectNumber',
      'ProjectType',
      'SubprojectType',
      'ProjectDuration',
      'ProjectStart',
      'ProjectEnd',
      'CompletionRate',
    ],
    Supervisor: [
      'CustomerName',
      // 'ProjectNumber',
      'SupervisionNo',
      'assignedEmployee',
      'receivingStatus',
      'stageName',
      'CommissioningDate',
      'projectManager',
    ],
    contracts: [
      'contractNumber',
      'contractDate',
      // 'ProjectNumber',
      'ProjectName',
      'CustomerName',
      'totalAmount',
      'paid',
      'remaining',
      'PaymentsDetails',
    ],
    tasksPerProjects: [
      // 'ProjectNumber',
      'CustomerName',
      'ProjectName',
      'ProjectType',
      'SubprojectType',
      'taskName',
      'assignedEmployee',
      'taskStart',
      'taskEnd',
      'achievementDays',
    ],
    employeeTasks: [
      'CustomerName',
      'ProjectName',
      'taskName',
      'taskStatus',
      'taskDuration',
      // 'ProjectNumber',
      'ProjectType',
      'ProjectStart',
      'ProjectDuration',
    ],
    saleInvoices: [
      'invoiceNumber',
      'InvoiceDate',
      'InvoiceAmount',
      'PaymentType',
      'InvoiceStatus',
      'PostingDate',
      'customerName',
      // 'projectNumber',
      'InvoiceOptions',
    ],
    DeferredSalesInvoices: [
      'contractNumber',
      'invoiceNumber',
      'InvoiceDate',
      'InvoiceAmount',
      'PaymentType',
      'CustomerName',
      // 'ProjectNumber',
      'DataEntryName',
      'InvoiceOptions',
    ],
    InvoicesWithoutProjects: [
      'invoiceNumber',
      'InvoiceDate',
      'InvoiceAmount',
      'PaymentType',
      'InvoiceStatus',
      'PostingDate',
      'customerName',
      'DataEntryName',
      'InvoiceOptions',
    ],

    purchaseInvoices: [
      'invoiceNumber',
      'InvoiceDate',
      'InvoiceAmount',
      'PaymentType',
      'ResourceName',
      'InvoiceStatus',
      'PostingDate',
      'DataEntryName',
      'InvoiceOptions',
    ],
    DeferredPurchaseInvoices: [
      'invoiceNumber',
      'InvoiceDate',
      'InvoiceAmount',
      'PaymentType',
      'ResourceName',
      'InvoiceStatus',
      'DataEntryName',
      'InvoiceOptions',
    ],
    Bonds: [
      'BondNumber',
      'BondDate',
      'BondAmount',
      'PaymentType',
      'ClientName',
      'BondCondition',
      'DataEntryName',
      'operations',
    ],
    DeferredBonds: [
      'BondNumber',
      'BondDate',
      'BondAmount',
      'PaymentType',
      'SupplierEmployeeName',
      'PurchaseInvoiceNumber',
      'ExchangeItemName',
      'DataEntryName',
      'operations',
    ],
    ProjectRevenuesAndExpenses: [
      'projectLocation',
      // 'projectNumber',
      'ProjectDuration',
      'projectValue',
      'Revenues',
      'OperatingExpenses',
      'ProfitRatio',
      'net',
      'projectStatus',
    ],
    IdentitiesExpire: [
      'EmployeeName',
      'Nationality',
      'IDNumber',
      'department',
      'Branch',
      'JobName',
      'EndDate',
      'dateReminder',
      'ContractExpiryDate',
    ],
    IdentitiesIsExpired: [
      'EmployeeName',
      'Nationality',
      'IDNumber',
      'EndDate',
      'JobName',
      'department',
      'DirectManager',
      'Branch',
      'ContractExpiryDate',
    ],
    DocumentsNearComplete: [
      'DocumentName',
      'DocumentNumber',
      'Issuer',
      'EndDate',
      'AlertDate',
      'Branch',
      'reminderText',
    ],
    ExpiredDocuments: [
      'DocumentName',
      'DocumentNumber',
      'Issuer',
      'EndDate',
      'Branch',
      'Attachments',
      'reminderText',
    ],
    ContractsNearComplete: [
      'EmployeeName',
      'Nationality',
      'JobName',
      'department',
      'Branch',
      'serviceDuration',
      'Salary',
      'ContractExpiryDate',
    ],
    ExpiredContracts: [
      'contractNumber',
      'EmployeeName',
      'Nationality',
      'JobName',
      'department',
      'Branch',
      'serviceDuration',
      'ContractExpiryDate',
      'Salary',
    ],
    employeeWithoutContract: [
      'EmployeeName',
      'Nationality',
      'JobName',
      'department',
      'Branch',
      'MobileNumber',
      'Email',
      'IDNumber',
    ],
  };
  dataSourceWaitingVacation: MatTableDataSource<any> = new MatTableDataSource([
    {},
  ]);
  dataSourceAcceptingVacation: MatTableDataSource<any> = new MatTableDataSource(
    [{}]
  );
  dataSourceWaitingImprest: MatTableDataSource<any> = new MatTableDataSource([
    {},
  ]);
  dataSourceAcceptingImprest: MatTableDataSource<any> = new MatTableDataSource([
    {},
  ]);
  displayedColumnsWaitingVacation: string[] = [
    'date',
    'employeeName',
    'vacationType',
    'discoundType',
    'startDate',
    'duration',
    'dicesion',
  ];

  displayedColumnsAcceptingVacation: string[] = [
    'date',
    'employeeName',
    'vacationType',
    'discoundType',
    'duration',
    'endDate',
  ];
  columns: any = {
    tasks: [
      'taskNo',
      'assignedTo',
      'from',
      'to',
      'customer',
      'implemented',
      'enginner',
      'excuting_officer',
      'projectNo',
      'status',
      'operations',
    ],

    tasks2: [
      'taskNo',
      'assignedTo',
      'from',
      'to',
      'customer',
      'implemented',
      'enginner',
      'excuting_officer',
    ],
    Order: ['taskNo', 'assignedTo', 'from', 'to'],
  };
  info: any = [
    {
      title: {
        ar: 'التعاميم',
        en: 'Circulars',
      },
      img: 'Group 40202@2x',
      color: '#0f75bc',
    },
    {
      title: {
        ar: 'الاشعارات',
        en: 'Notifications',
      },
      img: 'Group 40200@2x',
      color: '#333333',
    },
   
    {
      title: {
        ar: 'عهد',
        en: 'Tools',
      },
      img: 'coin-bag-line@2x',
      color: '#4fb793',
    },
  ];
  employeeType: number = 1;

  years: any = [2022, 2023, 2024, 2025];

  selectedYear: any; // = new Date().getFullYear();
  currentyear: any = new Date().getFullYear();

  TimeframeTab = true;
  ProjectFlowTab = true;
  FinancialTab = true;
  AdministrativeTab = true;
  preformanceTab = true;
  progressTab = true;
  waitingVacation: any;
  acceptingVacation: any;
  waitingImprests: any;
  acceptingImprests: any;
  displayedColumnsWaitingImprest: string[] = [
    'date',
    'employeeName',
    'branch',
    'amount',
    'installmentNumber',
    'startDate',
    'dicesion',
  ];

  displayedColumnsAcceptingImprest: string[] = [
    'imprestNo',
    'date',
    'imprestStatus',
    'employeeName',
    'amount',
  ];

  selectedTask: any;

  selectedUser: any;
  users: any;

  items = [
    {
      assignedTo: 'محمد هلهل	',
      ProjectNumber: '2022-63	',
      CustomerName: 'احمد',
      taskStatus: 'منخفض',
    },
  ];

  stratDate = new Date();
  endDate = new Date();

  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );

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

  value: number = 10;
  thick: number = 10;

  title: any = {
    main: {
      name: {
        ar: 'شؤون الموظفين',
        en: 'Employees Affairs',
      },
      link: '/employees',
    },
    sub: {
      ar: '  الموظفون الغائبون ',
      en: ' Absentee Staff ',
    },
  };

  data: any = {
    absence: [],
    filter: {
      enable: false,
      date: null,
    },
  };

  ///////////////////////////////////////////Loan Region//////////////////////////////////////////////////////
  watingimpresttype: any;
  Months: any;
  EmployeeWorker: any;
  EmployeeWorkerE: any;
  public _loan: Loan;

  statisticLoan: any = {
    AmountPayed: 0,
    AmountNotPayed: 0,
    MonthNo: 0,
  };

  modalDetails: any = {
    id: null,
    date: null,
    amound: null,
    installmentsNumber: null,
    from: null,
    details: null,
  };

  waitingimpresetcount = 0;
  getwaitingImprests() {
    this._homesernice
      .GetAllLoansW2('', this.watingimpresttype ?? 1)
      .subscribe((data) => {
        this.dataSourceWaitingImprest = data.result;
        this.waitingimpresetcount = data.result.length;
      });
  }
  fillfillEmployeeWorker() {
    this._loanservice.FillEmployeeworker().subscribe((data) => {
      this.EmployeeWorker = data;
    });
  }
  AddImprestRequest(loanobj: any) {
    this._loan = new Loan();
    if (
      loanobj.date == null ||
      loanobj.amount == null ||
      loanobj.monthNo == null ||
      loanobj.startMonths == null
    ) {
      this.toast.error('من فضلك اكمل البيانات', 'رسالة');
      return;
    }
    this._loan.date = this.datePipe.transform(loanobj.date, 'YYYY-MM-dd');
    this._loan.amount = loanobj.amount;
    this._loan.monthNo = loanobj.monthNo;
    this._loan.startMonth = loanobj.startMonths;
    this._loan.note = loanobj.note;
    this._loan.status = 1;

    var loan = this._loan;
    this._loanservice.SaveLoan_Management(loan).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.GetAllLoans2();
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }

  GetAllLoans2() {
    this._homesernice.GetAllLoans2().subscribe((data) => {
      this.dataSourceWaitingImprest = data.result;
    });
  }
  GetAllLoanDetails(LoanId: any, MonthNo: any) {
    this.GetAmountPayedAndNotPayed(LoanId, MonthNo);
    this._homesernice.GetAllLoanDetails(LoanId).subscribe((data) => {
      this.dataSourceAcceptingImprest = data.result;
    });
  }
  GetAmountPayedAndNotPayed(LoanId: any, MonthNo: any) {
    this.statisticLoan.MonthNo = MonthNo;

    this._homesernice.GetAmountPayedAndNotPayed(LoanId).subscribe((data) => {
      this.statisticLoan.AmountPayed = data.result.amountPayed;
      this.statisticLoan.AmountNotPayed = data.result.amountNotPayed;
    });
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  ActiveYear() {
    this._homesernice.ActiveYear().subscribe((data) => {
      this.selectedYear = data;
    });
  }
  ///////////////////////////////////////////Vacation Region//////////////////////////////////////////////////////
  modalvacationDetails: any = {
    id: null,
    employeeId: null,
    vacationType: null,
    date: null,
    from: null,
    to: null,
    discound: null,
    file: null,
    vacationbalance: null,
    discountamount: null,
  };

  vacationtoconvertadmin: any;
  vacationtodalete: any;
  vacationtoreturnwork: any;

  vacations: any;

  vacationtypeselect: any;
  vacationstatusselect: any;
  employeeselect: any;
  employeeworkerselect: any;
  vacationBalance = 0;
  Salary = 0;
  vVacationDays = 0;
  VacationIsDiscount: any;
  public _vacationVM: VacationVM;
  public _vacation: Vacation;
  watingvacationtype: any;

  waitingvacationcount = 0;
  getwaitingvacation() {
    this._homesernice
      .GetAllVacationsw2('', this.watingvacationtype ?? 1)
      .subscribe((data) => {
        this.dataSourceWaitingVacation = data.result;

        this.waitingvacationcount = data.result.length;
      });
  }

  GetAllVacations2() {
    this._homesernice.GetAllVacations2().subscribe((data) => {
      this.dataSourceWaitingVacation = data.result;
    });
  }
  GetAllVacationsw() {
    this._homesernice.GetAllVacationsw().subscribe((data) => {
      this.dataSourceAcceptingVacation = data;
    });
  }

  Getemployeebyid() {
    this._homesernice.GetCurrentEmployee().subscribe((data) => {
      if (data == null) {
        this.toast.error(
          'لا يمكنك ارسال طلب اجازة وذلك لعدم ربط المستخدم الخاص بك بموطف',
          'رسالة'
        );
      }
      if (data.dawamId == 0) {
        this.toast.error('يرجي ضبط دوام الموظف', 'رسالة');
      } else {
        this.modalvacationDetails.employeeId = data.employeeId;

        this.vacationBalance =
          data.vacationEndCount == null ? 0 : data.vacationEndCount;
        this.Salary = data.salary == null ? 0 : data.salary;
      }
    });
  }

  CheckDate(event: any) {
    if (event != null) {
      var from = this._sharedService.date_TO_String(event[0]);
      var to = this._sharedService.date_TO_String(event[1]);
      //this.RefreshData_ByDate(from,to);
      this.data.filter.startDate = from;
      this.data.filter.endDate = to;
    } else {
      this.data.filter.DateFrom_P = '';
      this.data.filter.DateTo_P = '';
      //this.RefreshData();
    }
  }
  reportdatefrom: any;
  reportdateto: any;
  CheckDate2(event: any, reporttype: any) {
    if (event != null) {
      var from = this._sharedService.date_TO_String(event[0]);
      var to = this._sharedService.date_TO_String(event[1]);
      //this.RefreshData_ByDate(from,to);
      this.reportdatefrom = from;
      this.reportdateto = to;

      if (reporttype == 1) {
        this.GetDoneTasksDGV();
      } else if (reporttype == 2) {
        this.GetEmpDoneWOsDGV();
      } else if (reporttype == 3) {
        this.GetInProgressProjectPhasesTasksHome_Search();
      } else if (reporttype == 4) {
        this.GetEmpUnderGoingWOsDGV();
      } else if (reporttype == 5) {
        this.GetLateTasksByUserIdHome_Search();
      }
    } else {
      this.data.filter.DateFrom_P = '';
      this.data.filter.DateTo_P = '';
      //this.RefreshData();
    }
  }

  Checkfromdate() {
    const today = new Date();

    // Extract the date part from the DateTime value
    const dateTimeDate = new Date(
      this.modalDetails.from.getFullYear(),
      this.modalDetails.from.getMonth(),
      this.modalDetails.from.getDate()
    );

    // Extract the date part from today's date
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    if (dateTimeDate.getTime() < todayDate.getTime()) {
      this.modalvacationDetails.from = '';
      this.toast.error('تاريخ البداية اصغر من تاريخ اليوم', 'رسالة');
      return;
    }
    if (this.modalvacationDetails.to != null) {
      const dateTimetoDate = new Date(
        this.modalDetails.to.getFullYear(),
        this.modalDetails.to.getMonth(),
        this.modalDetails.to.getDate()
      );

      if (dateTimeDate.getTime() > dateTimetoDate.getTime()) {
        this.modalvacationDetails.from = '';
        this.toast.error('تاريخ البداية اكبر من تاريخ النهاية', 'رسالة');
      }
    }
  }
  Checktodate() {
    const today = new Date();

    // Extract the date part from the DateTime value
    const dateTimeDate = new Date(
      this.modalvacationDetails.from.getFullYear(),
      this.modalvacationDetails.from.getMonth(),
      this.modalvacationDetails.from.getDate()
    );
    const dateTimeDateto = new Date(
      this.modalvacationDetails.to.getFullYear(),
      this.modalvacationDetails.to.getMonth(),
      this.modalvacationDetails.to.getDate()
    );

    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    if (dateTimeDateto.getTime() < dateTimeDate.getTime()) {
      this.modalvacationDetails.to = '';
      this.toast.error('تاريخ النهاية اصغر من تاريخ اليوم', 'رسالة');
    }
    if (this.modalvacationDetails.from != null) {
      if (dateTimeDateto.getTime() < dateTimeDate.getTime()) {
        this.modalvacationDetails.to = '';
        this.toast.error('تاريخ البداية اكبر من تاريخ النهاية', 'رسالة');
      }
    }
    if (this.modalvacationDetails.employeeId == null) {
      this.modalvacationDetails.to = '';
      this.toast.error('اختر الموظف', 'رسالة');
    }

    if (this.modalvacationDetails.vacationType == null) {
      this.modalvacationDetails.to = '';
      this.toast.error('اخترنوع الاجازه', 'رسالة');
    }
    this.GetNetVacationDays(
      this.vacationBalance,
      this._sharedService.date_TO_String(this.modalvacationDetails.from),
      this._sharedService.date_TO_String(this.modalvacationDetails.to)
    );
  }

  GetNetVacationDays(pVacationBalance: any, from: any, to: any) {
    this._staffholidayservice
      .GetNetVacationDays(
        from,
        to,
        this.modalvacationDetails.employeeId,
        this.modalvacationDetails.vacationType
      )
      .subscribe((data) => {
        this.vVacationDays = data;
        if (this.vVacationDays > 0) {
          if (this.vVacationDays > pVacationBalance || pVacationBalance == 0) {
            //$('input#IsDiscounttxt').prop('disabled', true);
            //$('input#IsDiscounttxt').prop('checked', true);
            //$('input#IsDiscounttxt').change();
            if (pVacationBalance == 0 || pVacationBalance == null) {
              this.modalvacationDetails.vacationbalance = 0;
              this.toast.error('المستخدم ليس لديه رصيد إجازات مستحق ', 'رسالة');
            } else {
              this.toast.error(
                'رصيد إجازات الموظف لا تكفي أيام الإجازات المطلوبة وهي  ' +
                  this.vVacationDays +
                  ' و يخصم المتبقي من الإجازة من مرتب الموظف',
                'رسالة'
              );

              this.modalvacationDetails.discound = false;
            }
            this.modalvacationDetails.discound = true;
            this.isdiscountchange();
            // this.modalvacationDetails.discountamount=
          } else {
            this.modalvacationDetails.discound = false;
            this.modalvacationDetails.vacationbalance = '0';
            this.modalvacationDetails.discountamount = '';
          }
        }
      });
  }

  isdiscountchange() {
    if (this.modalvacationDetails.discound == true) {
      this.modalvacationDetails.vacationbalance = null;
      let SalaryDiscount = 0;
      if (this.Salary > 0) {
        if (this.vVacationDays > this.vacationBalance) {
          //حالة الخصم من المرتب إجبارية
          SalaryDiscount =
            (this.vVacationDays - this.vacationBalance) * (this.Salary / 30);
          this.modalvacationDetails.discountamount = SalaryDiscount.toFixed(2);
          this.VacationIsDiscount = 0;

          if (this.vacationBalance > 0) {
            this.modalvacationDetails.vacationbalance = this.vacationBalance;
          }
        } else {
          // حالة الخصم إختيارية
          SalaryDiscount = this.vVacationDays * (this.Salary / 30);
          this.modalvacationDetails.discountamount = SalaryDiscount.toFixed(2);
          this.VacationIsDiscount = 1;
          this.modalvacationDetails.vacationbalance = null;
        }
      }
    } else {
      this.modalvacationDetails.discountamount = null;
      this.VacationIsDiscount = 0;
      if (this.vacationBalance == 0 || this.vacationBalance == null) {
        this.modalvacationDetails.vacationbalance = '0';
      } else {
        this.modalvacationDetails.vacationbalance = this.vVacationDays;
      }
    }
  }

  fillvacationtype() {
    this._staffholidayservice.fillvacationtype().subscribe((data) => {
      this.vacationtypeselect = data;
    });
  }

  SaveVacationWorkers() {
    if (
      this.modalvacationDetails.vacationType == null ||
      this.modalvacationDetails.from == null ||
      this.modalvacationDetails.to == null ||
      this.modalvacationDetails.date == null
    ) {
      this.toast.error('من فضلك اكمل البيانات', 'رسالة');
      return;
    }
    if (
      this.modalvacationDetails.discound == false &&
      this.modalvacationDetails.vacationbalance == 0
    ) {
      this.toast.error('يرجي اختيار خصم من الراتب ', 'رسالة');
      return;
    }
    this._vacation = new Vacation();
    this._vacation.employeeId = this.modalvacationDetails.employeeId;
    this._vacation.vacationId = 0;
    this._vacation.vacationTypeId = this.modalvacationDetails.vacationType;
    this._vacation.startDate = this._sharedService.date_TO_String(
      this.modalvacationDetails.from
    );
    this._vacation.endDate = this._sharedService.date_TO_String(
      this.modalvacationDetails.to
    );
    this._vacation.date = this._sharedService.date_TO_String(
      this.modalvacationDetails.date
    );
    this._vacation.vacationStatus = 1;
    this._vacation.isDiscount = this.modalvacationDetails.discound;

    if (this.modalvacationDetails.discound == true) {
      this._vacation.discountAmount = this.modalvacationDetails.discountamount;
    }
    if (this.userG?.userPrivileges.includes(151315)) {
      this._vacation.decisionType = 1;
    } else {
      this._vacation.decisionType = 0;
    }

    this._staffholidayservice
      .SaveVacation_Management(this._vacation)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.getwaitingvacation();
          this.GetAllVacations2();
          this.GetAllVacationsw();

          if (this.control?.value[0] != null) {
            const formData = new FormData();

            formData.append('postedFiles', this.control?.value[0]);
            formData.append('VacationId', result.returnedParm.toString());

            this._staffholidayservice
              .UploadVacationImage(formData)
              .subscribe((result) => {
                if (result.statusCode == 200) {
                  this.toast.success(
                    this.translate.instant(result.reasonPhrase),
                    this.translate.instant('Message')
                  );
                } else {
                  this.toast.error(
                    this.translate.instant(result.reasonPhrase),
                    this.translate.instant('Message')
                  );
                }
              });
          }
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  //---------------------------------------------
  getAchievementStatus(element: any) {
    if (Object.keys(element).length===0)return "";
    var result = [];
    if(element.status==4)
      {
        var Rem=element.remaining;
        if (Rem != null) {
          if(Rem>0)
            {
              var value = Rem;
              result.push('أنجزت قبل موعدها ب : ');

              var units: any = {
                سنة: 24 * 60 * 365,
                شهر: 24 * 60 * 30,
                اسبوع: 24 * 60 * 7,
                يوم: 24 * 60,
                ساعة: 1 * 60,
                دقيقة: 1,
              };
              for (var name in units) {
                var p = Math.floor(value / units[name]);
                if (p == 1) result.push(p + ' ' + name);
                if (p >= 2) result.push(p + ' ' + name);
                value %= units[name];
              }
            }
            else if(Rem<0){
              Rem=Rem*-1;
              result.push('أنجزت بعد موعدها ب : ');

              var value = Rem;
              var units: any = {
                سنة: 24 * 60 * 365,
                شهر: 24 * 60 * 30,
                اسبوع: 24 * 60 * 7,
                يوم: 24 * 60,
                ساعة: 1 * 60,
                دقيقة: 1,
              };
              for (var name in units) {
                var p = Math.floor(value / units[name]);
                if (p == 1) result.push(p + ' ' + name);
                if (p >= 2) result.push(p + ' ' + name);
                value %= units[name];
              }
            }
            else{
              result.push("في المعاد بالتحديد");
            }
        }
      }
      else
      {
        result.push("لم تنتهي المهمة بعد");
      }

    return result;
  }
  getAchievementStatus2(element: any) {
    if (Object.keys(element).length===0)return "";
    var result = [];
    if(element.status==4)
      {
        var Rem=element.remaining;
        if (Rem != null) {
          if(Rem>0)
            {
              var value = Rem;
              var units: any = {
                سنة: 24 * 60 * 365,
                شهر: 24 * 60 * 30,
                اسبوع: 24 * 60 * 7,
                يوم: 24 * 60,
                ساعة: 1 * 60,
                دقيقة: 1,
              };
              for (var name in units) {
                var p = Math.floor(value / units[name]);
                if (p == 1) result.push(p + ' ' + name);
                if (p >= 2) result.push(p + ' ' + name);
                value %= units[name];
              }
            }
            else if(Rem<0){
              Rem=Rem*-1;
              var value = Rem;
              var units: any = {
                سنة: 24 * 60 * 365,
                شهر: 24 * 60 * 30,
                اسبوع: 24 * 60 * 7,
                يوم: 24 * 60,
                ساعة: 1 * 60,
                دقيقة: 1,
              };
              for (var name in units) {
                var p = Math.floor(value / units[name]);
                if (p == 1) result.push(p + ' ' + name);
                if (p >= 2) result.push(p + ' ' + name);
                value %= units[name];
              }
            }
            else{
              result.push("في المعاد بالتحديد");
            }
        }
      }
      else
      {
        result.push("لم تنتهي المهمة بعد");
      }

    return result;
  }

  getAchievementStatusColor(element: any) {
    if (Object.keys(element).length===0){return ""};
    let statuscolor = '';
    if(element.status==4)
      {
        if (element.remaining != null) {
          if(element.remaining>0)
            {
              statuscolor='greenCla';
            }
            else if(element.remaining<0){
              statuscolor='redCla';
            }
            else{
              statuscolor='yellowCla';
            }
        }
      }
      else
      {
        statuscolor='';
      }
    return statuscolor;
  }
  //----------------------------------------------


  ///////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////Reports//////////////////////////////////////////////////
  DoneTasksDGV: any;
  EmpDoneWOsDGV: any;
  LateTasksByUserIdHome_Search: any;
  EmpUnderGoingWOsDGV: any;
  InProgressProjectPhasesTasksHome_Search: any;
  GetDoneTasksDGV() {
    this._homesernice
      .GetDoneTasksDGV(this.reportdatefrom, this.reportdateto)
      .subscribe((data) => {
        this.DoneTasksDGV = data.result;
      });
  }

  GetEmpDoneWOsDGV() {
    this._homesernice
      .GetEmpDoneWOsDGV(this.reportdatefrom, this.reportdateto)
      .subscribe((data) => {
        this.EmpDoneWOsDGV = data.result;
      });
  }

  ProjectPhVM: ProjectPhasesTasksVM;
  GetInProgressProjectPhasesTasksHome_Search() {
    this.ProjectPhVM = new ProjectPhasesTasksVM();
    this.ProjectPhVM.startDate = this.reportdatefrom;
    this.ProjectPhVM.endDate = this.reportdateto;
    this._homesernice
      .GetInProgressProjectPhasesTasksHome_Search(this.ProjectPhVM)
      .subscribe((data) => {
        this.InProgressProjectPhasesTasksHome_Search = data;
      });
  }

  GetEmpUnderGoingWOsDGV() {
    this._homesernice
      .GetEmpUnderGoingWOsDGV(this.reportdatefrom, this.reportdateto)
      .subscribe((data) => {
        this.EmpUnderGoingWOsDGV = data.result;
      });
  }

  GetLateTasksByUserIdHome_Search() {
    this._homesernice
      .GetLateWorkOrdersByUserIdFilterd(this.reportdateto, 0, 0)
      .subscribe((data) => {
        this.LateTasksByUserIdHome_Search = data.result;
      });
  }

  supervicsionlist: any;
  GetAllSupervisionsByUserId() {
    this._homesernice.GetAllSupervisionsByUserId().subscribe((data) => {
      this.supervicsionlist = data.result;
    });
  }
  outlinechanges: any = {
    outlineChangetxt1: null,
    outlineChangetxt2: null,
    outlineChangetxt3: null,
    pointsNotWrittentxt1: null,
    pointsNotWrittentxt2: null,
    pointsNotWrittentxt3: null,
  };

  SupervisionDetailslist: any;
  clickdetails: any = 0;
  SUper: any;
  GetAllSupervisionDetailsBySuperId(Super: any) {
    this.clickdetails = 1;
    this.outlinechanges.outlineChangetxt1 = Super.outlineChangetxt1;
    this.outlinechanges.outlineChangetxt2 = Super.outlineChangetxt2;
    this.outlinechanges.outlineChangetxt3 = Super.outlineChangetxt3;
    this.outlinechanges.pointsNotWrittentxt1 = Super.pointsNotWrittentxt1;
    this.outlinechanges.pointsNotWrittentxt2 = Super.pointsNotWrittentxt2;
    this.outlinechanges.pointsNotWrittentxt3 = Super.pointsNotWrittentxt3;
    this.SUper = Super;
    this._homesernice
      .GetAllSupervisionDetailsBySuperId(Super.supervisionId)
      .subscribe((data) => {
        this.SupervisionDetailslist = data;
      });
  }
  reReciveSuper(SuperId: any) {
    this._homesernice.ReciveSuper(SuperId).subscribe((result) => {
      if (result.statusCode == 200) {
        this.GetAllSupervisionsByUserId();
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }

  NotReciveSuper(SuperId: any) {
    this._homesernice.NotReciveSuper(SuperId).subscribe((result) => {
      if (result.statusCode == 200) {
        this.GetAllSupervisionsByUserId();
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }

  /////////////////////////////////////////super details////////////////////////////////////////
  reasonrefusedeyails: any;
  notavailablerefuse: any;
  nubersuperdet: any;
  locationsuperdet: any;
  SuperDetId: any;

  OutlineChangeSave() {
    this._homesernice
      .OutlineChangeSave(
        this.SUper.supervisionId,
        this.outlinechanges.outlineChangetxt1,
        this.outlinechanges.outlineChangetxt2,
        this.outlinechanges.outlineChangetxt3
      )
      .subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetAllSupervisionDetailsBySuperId(this.SUper);
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  PointsNotWrittenSave() {
    this._homesernice
      .PointsNotWrittenSave(
        this.SUper.supervisionId,
        this.outlinechanges.pointsNotWrittentxt1,
        this.outlinechanges.pointsNotWrittentxt2,
        this.outlinechanges.pointsNotWrittentxt3
      )
      .subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetAllSupervisionDetailsBySuperId(this.SUper);
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  ReciveSuperDet(SuperId: any) {
    this._homesernice.ReciveSuperDet(SuperId).subscribe((result) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.GetAllSupervisionDetailsBySuperId(this.SUper);
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }
  //getcolor(item:any){
  getcolor(item: any) {
    const readed = '#91ec91;padding: 0.2rem !important';
    const unreaded = '#e1dbdb;padding: 0.2rem !important';
    const unknown = '#ec9191;padding: 0.2rem !important';

    if (item.isRead == 1) {
      return 'readsuper';
      //  return "background-color:#91ec91;padding: 0.2rem !important;"

      //'background-color': readed,// "#91ec91;padding: 0.2rem !important",
      // Add more style properties as needed
    } else if (item.isRead == 2) {
      return 'unread';
      // "background-color:#e1dbdb;padding: 0.2rem !important ;"
      //   'background-color': unreaded,//"#e1dbdb;padding: 0.2rem !important",
      //   // Add more style properties as needed
      // };
    } else {
      return 'unknownread';
      // "background-color:#ec9191;padding: 0.2rem !important"
      //   'background-color': unknown,//"#ec9191;padding: 0.2rem !important",
      //   // Add more style properties as needed
      // };
    }
  }

  NotReciveSuperDet() {
    this._homesernice
      .NotReciveSuperDet(this.SuperDetId, this.reasonrefusedeyails)
      .subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetAllSupervisionDetailsBySuperId(this.SUper);
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  NotFoundSuperDet() {
    this._homesernice
      .NotFoundSuperDet(this.SuperDetId, this.notavailablerefuse)
      .subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetAllSupervisionDetailsBySuperId(this.SUper);
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  TheNumberSuperDet() {
    this._homesernice
      .TheNumberSuperDet(this.SuperDetId, this.nubersuperdet)
      .subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetAllSupervisionDetailsBySuperId(this.SUper);
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  TheLocationSuperDet() {
    this._homesernice
      .TheLocationSuperDet(this.SuperDetId, this.locationsuperdet)
      .subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetAllSupervisionDetailsBySuperId(this.SUper);
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  UploadImageSuperDet() {
    if (this.control?.value[0] != null) {
      const formData = new FormData();

      formData.append('uploadesgiles', this.control?.value[0]);
      formData.append('SuperDetId', this.SuperDetId);

      this._homesernice.UploadImageSuperDet(formData).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetAllSupervisionDetailsBySuperId(this.SUper);
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
    } else {
      this.toast.error('من فضلك اختر ملف', 'رسالة');
      return;
    }
  }

  downloadFile(data: any) {
    var link = environment.PhotoURL + data;
    window.open(link, '_blank');
  }

  GetPriortyStr(itemPriorty: any) {
    let priorty = '';
    if (itemPriorty == null) {
      priorty = 'بدون اهمية';
    } else {
      if (itemPriorty == 1) {
        priorty = 'منخفض';
      } else if (itemPriorty == 2) {
        priorty = 'متوسط';
      } else if (itemPriorty == 3) {
        priorty = 'مرتفع';
      } else if (itemPriorty == 4) {
        priorty = 'عاجل';
      } else {
        priorty = 'بدون ';
      }
    }
    return priorty;
  }

  getDelay(Remaining: any) {
    let delay = '';
    if (Remaining != null) {
      if (Remaining > 60 * 24 * 7 * 30) {
        delay = (Remaining / (60 * 24 * 7 * 30)).toFixed(0) + '  شهر  ';
      } else if (Remaining > 60 * 24 * 7) {
        delay = (Remaining / (60 * 24 * 7)).toFixed(0) + '  اسبوع  ';
      } else if (Remaining > 60 * 24) {
        delay = (Remaining / (60 * 24)).toFixed(0) + '  يوم  ';
      } else if (Remaining > 60) {
        delay = (Remaining / 60).toFixed(0) + '  ساعة  ';
      } else {
        delay = Remaining.toFixed(0) + ' دقيقة  ';
      }
    }
    return delay;
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////Tasks Table//////////////////////////////////////////
  //NewTasks:any;
  //LateTasks:any;
  // NewWorkorder:any;
  // LateWorkorder:any;

  dataPercent: any = {
    tasksPercent: 0,
    workOrdersPercent: 0,
    projectsPercent: 0,
    totalInProress: 0,
    totalLate: 0,
  };

  NewTasksCountByUserId: any;
  LateTasksCountByUserId: any;
  NewWorkOrdersCountByUserId: any;
  UserLateWorkOrderCount: any;
  Custodies: any;
  GetUserStatistics() {
    this._homesernice.GetUserStatistics().subscribe((data) => {
      this.dataPercent.tasksPercent = parseInt(
        data.result.tasksPercentByUserIdAndProjectId ?? 0
      );
      this.dataPercent.workOrdersPercent = parseInt(
        data.result.workOrdersPercentByUserIdAndProjectId ?? 0
      );
      this.dataPercent.projectsPercent = parseInt(
        data.result.projectsPercentByUserIdAndProjectId ?? 0
      );
      this.dataPercent.totalInProress = parseInt(
        data.result.totalInProressCount ?? 0
      );
      this.dataPercent.totalLate = parseInt(data.result.totalLateCount ?? 0);
      this.NewTasksCountByUserId = data.result.newTasksCountByUserId;
      this.LateTasksCountByUserId = data.result.lateTasksCountByUserId;
      this.NewWorkOrdersCountByUserId = data.result.newWorkOrdersCountByUserId;
      this.UserLateWorkOrderCount = data.result.userLateWorkOrderCount;
      this.Custodies = data.result.custodies;
    });
  }
  GetUserStatisticsPercentData() {
    this._homesernice.GetUserStatisticsPercentData().subscribe((data) => {
      this.dataPercent.tasksPercent = parseInt(
        data.result.tasksPercentByUserIdAndProjectId ?? 0
      );
      this.dataPercent.workOrdersPercent = parseInt(
        data.result.workOrdersPercentByUserIdAndProjectId ?? 0
      );
      this.dataPercent.projectsPercent = parseInt(
        data.result.projectsPercentByUserIdAndProjectId ?? 0
      );
      this.dataPercent.totalInProress = parseInt(
        data.result.totalInProressCount ?? 0
      );
      this.dataPercent.totalLate = parseInt(data.result.totalLateCount ?? 0);
    });
  }

  GetAllUserCustodiesStatistics() {
    this._homesernice.GetAllUserCustodiesStatistics().subscribe((data) => {
      this.Custodies = data.result.custodies;
    });
  }

  NewTasks: MatTableDataSource<any> = new MatTableDataSource([{}]);
  LateTasks: MatTableDataSource<any> = new MatTableDataSource([{}]);
  NewWorkorder: MatTableDataSource<any> = new MatTableDataSource([{}]);
  LateWorkorder: MatTableDataSource<any> = new MatTableDataSource([{}]);
  GetNewTasksByUserId(Enddate: any) {
    this._homesernice
      .GetNewTasksByUserId2(
        this.NewTasksProjectid ?? 0,
        this.NewTasksCustomerId ?? 0
      )
      .subscribe((data) => {
        this.NewTasks = new MatTableDataSource(data.result);
        this.NewTasks.paginator = this.NewtasksPaginator;
        this.NewTasksCountByUserId = data.result.length;
        //this.NewTasks=data.result;
      });
  }
  applyFilterNewtask(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.NewTasks.filter = filterValue.trim().toLowerCase();
  }

  applyFilterLatetask(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.LateTasks.filter = filterValue.trim().toLowerCase();
  }

  applyFilterNewWO(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.NewWorkorder.filter = filterValue.trim().toLowerCase();
  }

  applyFilterLateWO(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.LateWorkorder.filter = filterValue.trim().toLowerCase();
  }

  GetLateTasksByUserIdHome(Enddate: any) {
    this._homesernice
      .GetLateTasksByUserIdHomeFilterd(
        this.LateTasksProjectid ?? 0,
        this.LateTasksCustomerId ?? 0
      )
      .subscribe((data) => {
        // console\.log('late tasks',data.result);
        this.LateTasks = new MatTableDataSource(data.result);
        this.LateTasks.paginator = this.LateTaskPaginator;
        this.LateTasksCountByUserId = data.result.length;

        //this.LateTasks=data.result;
      });
  }
  GetUserProjects: any;
  NotificationsCount: any;
  AllertCount: any;
  TasksByUserCount: any;
  vacatiocounts: any;
  backupload: any = null;
  getstatistics() {
    this._homesernice.GetStatisticsCount().subscribe((data) => {
      this.GetUserProjects = data.getUserProjects;
      this.NotificationsCount = data.notificationsCount;
      if (this.NotificationsCount != null && this.NotificationsCount > 0) {
        this.checknot2();
      }
      this.AllertCount = data.allertCount;
      this.TasksByUserCount = data.tasksByUserCount;
      this.vacatiocounts = data.vacationBalance;
      this.backupload = data.backupAlertLoad_M;
    });
  }

  GetNewWorkOrdersByUserId(Enddate: any) {
    this._homesernice
      .GetNewWorkOrdersByUserIdFilterd(
        Enddate,
        this.NewWorkOrdersCustomerId ?? 0,
        this.NewWorkOrdersProjectid ?? 0
      )
      .subscribe((data) => {
        console.log(data.result);
        this.NewWorkorder = new MatTableDataSource(data.result);
        this.NewWorkorder.paginator = this.NewWorkOrderPaginator;
        this.NewWorkOrdersCountByUserId = data.result.length;
        //this.NewWorkorder=data.result;
      });
  }

  GetLateWorkOrdersByUserId(Enddate: any) {
    this._homesernice
      .GetLateWorkOrdersByUserIdFilterd(
        Enddate,
        this.LateWorkOrdersCustomerId ?? 0,
        this.LateWorkOrdersProjectid ?? 0
      )
      .subscribe((data) => {
        console.log(data.result);
        //this.LateWorkorder=data.result;
        this.LateWorkorder = new MatTableDataSource(data.result);
        this.LateWorkorder.paginator = this.LateWorkOrderPaginator;
        this.UserLateWorkOrderCount = data.result.length;
      });
  }

  percentage: any;
  promanager: any;
  GetTaskById(TaskId: any) {
    this._homesernice.GetTaskById(TaskId).subscribe((data) => {
      // console\.log(data.result);
      this.selectedTask = data.result;
      this.percentage = data.result?.execPercentage ?? 0;
      this.GetUserById(data.result.projectManagerId);
    });
  }

  GetUserById(UserId: any) {
    this._homesernice.GetUserById(UserId).subscribe((data) => {
      // console\.log(data.result);
      this.promanager = data.result;
    });
  }

  getremaining(Remaining: any) {
    if (Remaining != null) {
      if (-Remaining > 60 * 24 * 7 * 30) {
        return (-(Remaining / (60 * 24 * 7 * 30))).toFixed(0) + '  شهر  ';
      } else if (-Remaining > 60 * 24 * 7) {
        return (-(Remaining / (60 * 24 * 7))).toFixed(0) + '  اسبوع  ';
      } else if (-Remaining > 60 * 24) {
        return (-(Remaining / (60 * 24))).toFixed(0) + '  يوم  ';
      } else if (-Remaining > 60) {
        return (-(Remaining / 60)).toFixed(0) + '  ساعة  ';
      } else {
        return (-Remaining).toFixed(0) + ' دقيقة  ';
      }
    } else {
      return '';
    }
  }
  userG: any = {};

  ///////////////////////////////////////////////////////////////////////////////////////////////
  _projectvm = new ProjectVM();
  _AttendenceVM = new AttendenceVM();
  constructor(
    private api: RestApiService,
    private modalService: NgbModal,
    private _workordersService: WorkordersService,
    private _homesernice: HomeServiceService,
    private _loanservice: EmployeeLoanService,
    private toast: ToastrService,
    private _staffholidayservice: StaffholidayServiceService,
    private _sharedService: SharedService,
    private _invoiceService: InvoiceService,
    private _phasestaskService: PhasestaskService,
    private _projectService: ProjectService,
    private _proreportsService: ProreportsService,
    private _supervisionsService: SupervisionsService,
    private _followprojectService: FollowprojectService,
    private _alertservice: AlertService,
    private authenticationService: AuthenticationService,
    private print: NgxPrintElementService,
    private _printreportsService: PrintreportsService,
    private datePipe: DatePipe,
    private _report: EmployeeReportService,

    private translate: TranslateService
  ) {
    this.userG = this.authenticationService.userGlobalObj;

    // this.InitFinancialfollowup();
    // this.InitProjectsData();
    // this.getData();
    // this.GetResDencesAbouutToExpire();
    // this.GetResDencesExpired();
    // this.GetOfficialDocsAboutToExpire();
    // this.GetOfficialDocsExpired();
    // this.GetEmpContractsAboutToExpire();
    // this.GetEmpContractsExpired();
    // this.GetEmployeesWithoutContract();

    this.Months = [
      { id: 1, Name: 'يناير' },
      { id: 2, Name: 'فبراير' },
      { id: 3, Name: 'مارس' },
      { id: 4, Name: 'إبريل' },
      { id: 5, Name: 'مايو' },
      { id: 6, Name: 'يونية' },
      { id: 7, Name: 'يوليو' },
      { id: 8, Name: 'أغسطس' },
      { id: 9, Name: 'سبتمبر' },
      { id: 10, Name: 'أكتوبر' },
      { id: 11, Name: 'نوفمبر' },
      { id: 12, Name: 'ديسمبر' },
    ];

    this.api.lang.subscribe((res) => {
      this.lang = res;
    });

    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
  }

  OrganizationData: any;
  environmentPho: any;
  dateprint: any;
  datePrintJournals: any = new Date();

  ngAfterContentInit(): void {
    this.getemployeereports();

    this.InitFinancialfollowup();
    this.InitProjectsData();
    // this.getData();
    this.getDataPaging(1, 10);
    // this.GetResDencesAbouutToExpire();
    this.GetResDencesAbouutToExpire_paging(1, 10);
    // this.GetResDencesExpired();
    this.GetResDencesExpired_paging(1, 10);
    // this.GetOfficialDocsAboutToExpire();
    this.GetOfficialDocsAboutToExpire_paging(1, 10);

    // this.GetOfficialDocsExpired();
    this.GetOfficialDocsExpired_paging(1, 10);

    // this.GetEmpContractsAboutToExpire();
    this.GetEmpContractsAboutToExpire_paging(1, 10);
    this.GetEmpContractsExpired_paging(1, 10);
    this.GetEmployeesWithoutContract_paging(1, 10);
    this.FillCustomerSelect();
    this.FillCustomerSelectNewTasks();
    this.FillCustomerSelectLateTask();
    this.FillCustomerSelectWorkOrder();
    this.FillCustomerSelectLateWorkOrder();
    this.FillUsersSelect();
    this.FillDepartmentSelect();
    this.FillSuperPhasesSelect();
    this.FillSupplierSelect();
    this.FillProjectSelect();
    this.FillProjectSelectNewTask();
    this.FillProjectSelectLateTask();
    this.FillProjectSelectWorkOrder();
    this.FillProjectSelecLatetWorkOrder();
    this.fill_Departments();
    this.FillEmployeeSearch();
    this.FillBranchSearch();
    this.getwaitingvacation();
    this.getwaitingImprests();

    this.api.GetOrganizationDataLogin().subscribe((data: any) => {
      this.OrganizationData = data.result;
      this.dateprint =this._sharedService.date_TO_String(new Date());
      this.environmentPho =
        environment.PhotoURL + this.OrganizationData.logoUrl;
    });
  }

  isclicked = 0;
  isclicked2 = 0;

  pageNumber2: any = 0;
  projectsdata: any = [];
  getData() {
    this._projectvm = new ProjectVM();
    this._projectvm.customerId = this.customerfilterid;
    this._projectvm.status = 0;
    this._homesernice.GetAllProjectsNew_DashBoard(this._projectvm).subscribe({
      next: (data: any) => {
        this.projectsdata = data;
        this.rows.projects = new MatTableDataSource(data);
        this.rows.projects.paginator = this.ProjectPaginator;
        this.rows.projects2 = new MatTableDataSource(data);
        this.rows.projects2.paginator = this.ProjectPaginator2;
      },
      error: (error) => {},
    });
  }

  applyFilterProjects(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.rows.projects.filter = filterValue.trim().toLowerCase();
  }

  getProjectdataclich(ProjectId: any) {
    this.GetProjectDataRE(ProjectId);
    this.GetSomeDataOfProjectId(ProjectId);
    this.GetDateAndPercentListsForProjects_Task(ProjectId);
  }

  PCustomerName: any;
  PProjectNo: any;
  PProjectDate: any;
  PProjectMangerName: any;
  PPercent: any;
  GetSomeDataOfProjectId(ProjectId: any) {
    this._homesernice.GetProjectByIdSomeData(ProjectId).subscribe({
      next: (data: any) => {
        this.PCustomerName = data.result.customerName;
        this.PProjectNo = data.result.projectNo;
        this.PProjectDate = data.result.projectDate;
        this.PProjectMangerName = data.result.projectMangerName;

        var TaskExecPercentage_Count = data.result.taskExecPercentage_Count;
        var TaskExecPercentage_Sum = data.result.taskExecPercentage_Sum;
        var Percent =
          (TaskExecPercentage_Sum / (TaskExecPercentage_Count * 100)) * 100;
        this.PPercent = parseFloat(Percent.toString()).toFixed(2);
      },
      error: (error) => {},
    });
  }

  PercentsTasksList_Project: any = [];
  DatesListTasks_Project: any = [];
  GetDateAndPercentListsForProjects_Task(ProjectId: any) {
    this._homesernice.GetProjectDataRE(ProjectId).subscribe({
      next: (data: any) => {
        this.PercentsTasksList_Project = [];
        this.DatesListTasks_Project = [];
        data.result.forEach((item: any) => {
          this.PercentsTasksList_Project.push(item?.projectpercentage);
          this.DatesListTasks_Project.push(item?.date);
        });

        this.drawProjectChart_T(
          this.PercentsTasksList_Project,
          this.DatesListTasks_Project
        );
      },
      error: (error) => {},
    });
  }

  data_yT: any;
  data_xT: any;
  chartOptionsTask: any;

  data_yT2: any;
  data_xT2: any;
  chartOptionsTask2: any = [];
  drawProjectChart_T(_PercentsList: any, _DatesList: any) {
    //data_y = [30, 40, 90];
    //data_x = ['2023-01-01', '2023-01-02', '2023-01-03'];

    this.data_yT = null;
    this.data_xT = null;
    this.data_yT = _PercentsList;
    this.data_xT = _DatesList;
    this.chartOptionsTask = null;
    this.chartOptionsTask = {
      series: [
        {
          name: 'نسبة انجاز',
          data: this.data_yT,
        },
      ],
      chart: {
        height: 350,
        type: 'area',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      xaxis: {
        type: 'datetime',
        categories: this.data_xT,
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    };

    if (this.isRTL) {
      this.chartOptionsTask.xaxis['categories'].reverse();
    }
  }

  PercentsRevenueList_Project: any = [];
  PercentsExpensesList_Project: any = [];
  DatesList_Project: any = [];
  GetProjectDataRE(ProjectId: any) {
    this._homesernice.GetProjectDataRE(ProjectId).subscribe({
      next: (data: any) => {
        this.PercentsRevenueList_Project = [];
        this.PercentsExpensesList_Project = [];
        this.DatesList_Project = [];
        data.result.forEach((item: any) => {
          this.PercentsRevenueList_Project.push(item?.revenue);
          this.PercentsExpensesList_Project.push(item?.expenses);
          this.DatesList_Project.push(item?.date);
        });

        this.drawProjectChart_E_M2(
          this.PercentsRevenueList_Project,
          this.PercentsExpensesList_Project,
          this.DatesList_Project
        );
      },
      error: (error) => {},
    });
  }

  data_y: any;
  data_y2: any;
  data_x: any;
  drawProjectChart_E_M2(
    _RevenueList: any,
    _ExpensesList: any,
    _DatesList: any
  ) {
    this.data_y = null;
    this.data_y2 = null;
    this.data_x = null;
    this.data_y = _RevenueList;
    this.data_y2 = _ExpensesList;
    this.data_x = _DatesList;
    this.chartOptions = {
      series: [
        {
          name: 'الايرادات',
          data: this.data_y,
        },
        {
          name: 'المصروفات',
          data: this.data_y2,
        },
      ],
      chart: {
        height: 350,
        type: 'area',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      xaxis: {
        type: 'datetime',
        categories: this.data_x,
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    };

    if (this.isRTL) {
      this.chartOptions.xaxis['categories'].reverse();
    }
  }
  valCostE: any;
  calculatetotalrev(element: any) {
    if (element.costE_W == null) {
      return 0;
    } else {
      this.valCostE = null;
      this.valCostE =
        +parseFloat(element.costE_W).toFixed(2) +
        +parseFloat(element.costE_Depit).toFixed(2) -
        +parseFloat(element.costE_Credit).toFixed(2);
      this.valCostE = parseFloat(this.valCostE.toString()).toFixed(2);
      return this.formatMoney(this.valCostE);
    }
  }
  valCostS2: any;
  calculatermain(Obj: any) {
    if (Obj.costS == null || Obj.oper_expeValue == null) {
      return 0;
    } else {
      this.valCostS2 =
        +parseFloat(Obj.costS).toFixed(2) +
        +parseFloat(Obj.oper_expeValue).toFixed(2);
      this.valCostS2 = parseFloat(this.valCostS2).toFixed(2);
      return this.formatMoney(this.valCostS2);
    }
  }
  valCostS3: any;
  valRe: any;
  calcremain2(Obj: any) {
    if (Obj.costE_W == null && Obj.contractValue == null) {
      return 0;
    } else {
      this.valCostS3 =
        +parseFloat(Obj.costE_W).toFixed(2) +
        +parseFloat(Obj.costE_Depit).toFixed(2) -
        +parseFloat(Obj.costE_Credit).toFixed(2);
      this.valCostS3 = parseFloat(this.valCostS3).toFixed(2);
      this.valRe = +parseFloat(Obj.contractValue).toFixed(2) - this.valCostS3;
      return this.formatMoney(this.valRe);
    }
  }
  isdisabled = 0;
  disablesavingpercentage() {
    this.isdisabled = 1;
  }

  calcultetotalex(Obj: any) {
    if (Obj != null) {
      if (Obj.costE_W == 0 || Obj.costS == 0) {
        return 'غير معروف';
      } else {
        var valCostE =
          +parseFloat(Obj.costE_W).toFixed(2) +
          +parseFloat(Obj.costE_Depit).toFixed(2) -
          +parseFloat(Obj.costE_Credit).toFixed(2);

        var valCostS3 =
          +parseFloat(Obj.costS).toFixed(2) +
          +parseFloat(Obj.oper_expeValue).toFixed(2);
        this.valCostS3 = parseFloat(this.valCostS3).toFixed(2);
        if (valCostE >= valCostS3) {
          return 'رابح';
        } else {
          return 'خاسر';
        }
        return 'غير معروف';
      }
      return 'غير معروف';
    }
    return 'غير معروف';
  }

  formatMoney(n: any) {
    return (Math.round(n * 100) / 100).toLocaleString();
  }
  tdayy: any;

  /////////////////////////
  CostTasksData = [];
  pageNumber3: any = 0;

  coststaskcustomerfilterid: any;
  GetInProgressProjectPhasesTasks_Branches() {
    this._homesernice
      .GetInProgressProjectPhasesTasks_Branches(
        this.coststaskcustomerfilterid ?? 0
      )
      .subscribe((data) => {
        // console\.log(data);
        this.CostTasksData = data;
        this.rows.CostTasks = new MatTableDataSource(data);
        this.rows.CostTasks.paginator = this.tasksPaginator2;
      });
  }

  applyFiltercosttask(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.rows.CostTasks.filter = filterValue.trim().toLowerCase();
  }
  getRemainig(Remaining: any) {
    var result = [];
    if (Remaining > 0) {
      var value = Remaining;
      var units: any = {
        سنة: 24 * 60 * 365,
        شهر: 24 * 60 * 30,
        اسبوع: 24 * 60 * 7,
        يوم: 24 * 60,
        ساعة: 1 * 60,
        دقيقة: 1,
      };
      for (var name in units) {
        var p = Math.floor(value / units[name]);
        if (p == 1) result.push(p + ' ' + name);
        if (p >= 2) result.push(p + ' ' + name);
        value %= units[name];
      }
    } else {
      result.push('متأخرة');
    }

    return result;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  arrSeries: any = [0, 0];
  TaskType: any;

  extendedData: any = {
    selectedTaskType: null,
    DateFrom: null,
    DateTo: null,
    TimeH: null,
  };

  selectedTaskType: any;
  nodeDataArray = [];
  linkDataArray = [];
  TaskData: any = {
    selected: false,
    Obj: null,
    TaskTimeFrom_Merge: null,
    TaskTimeTo_Merge: null,
    priorty: null,
    goalcheck: false,
    goalname: null,
    notesStrVac: null,
  };
  TaskDataLate: any = {
    selected: false,
    Obj: null,
    TaskTimeFrom_Merge: null,
    TaskTimeTo_Merge: null,
    priorty: null,
    goalcheck: false,
    goalname: null,
    notesStrVac:null,
  };
  OrderData: any = {
    selected: false,
    Obj: null,
    percentComplete: null,
    required: null,
  };
  todayy: any;
  ngOnInit(): void {
    this.TaskType = [
      { id: 1, name: { ar: 'ساعة', en: 'Hour' } },
      { id: 2, name: { ar: 'يوم', en: 'Day' } },
    ];
    this.extendedData.selectedTaskType = 1;
    this.extendedData.TimeH = 1;
    this.extendedData.DateFrom = new Date();
    this.GetCurrentUserById();
    //this.GetInProgressProjectPhasesTasks_Branches();
    this.GetInProgressProjectPhasesTasks_Branches_paging(1, 10);

    //this.GetAllWorkOrders();
    this.GetAllWorkOrders_paging(1, 10);

    this.ActiveYear();
    this.GetOrganizationData();

    //this.getALERTData();

    this.users = [
      { id: 1, Name: 'محمود نافع' },
      { id: 2, Name: 'محمود نافع' },
      { id: 3, Name: 'محمود نافع' },
      { id: 4, Name: 'محمود نافع' },
      { id: 5, Name: 'محمود نافع' },
      { id: 6, Name: 'محمود نافع' },
      { id: 7, Name: 'محمود نافع' },
      { id: 8, Name: 'محمود نافع' },
      { id: 9, Name: 'محمود نافع' },
      { id: 10, Name: 'محمود نافع' },
      { id: 11, Name: 'محمود نافع' },
    ];

    // this.elem = document.documentElement;
    this.chartOptions = {
      series: [
        {
          name: 'series1',
          data: [31, 40, 28, 51, 42, 109, 100],
        },
        {
          name: 'series2',
          data: [11, 32, 45, 32, 34, 52, 41],
        },
      ],
      chart: {
        height: 350,
        type: 'area',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      xaxis: {
        type: 'datetime',
        categories: [
          '2018-09-19T00:00:00.000Z',
          '2018-09-19T01:30:00.000Z',
          '2018-09-19T02:30:00.000Z',
          '2018-09-19T03:30:00.000Z',
          '2018-09-19T04:30:00.000Z',
          '2018-09-19T05:30:00.000Z',
          '2018-09-19T06:30:00.000Z',
        ],
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    };

    if (this.isRTL) {
      this.chartOptions.xaxis['categories'].reverse();
    }

    this.chartOptionsTask = {
      series: [
        {
          name: 'series1',
          data: [31, 40, 28, 51, 42, 109, 100],
        },
      ],
      chart: {
        height: 350,
        type: 'area',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      xaxis: {
        type: 'datetime',
        categories: [
          '2018-09-19T00:00:00.000Z',
          '2018-09-19T01:30:00.000Z',
          '2018-09-19T02:30:00.000Z',
          '2018-09-19T03:30:00.000Z',
          '2018-09-19T04:30:00.000Z',
          '2018-09-19T05:30:00.000Z',
          '2018-09-19T06:30:00.000Z',
        ],
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    };

    if (this.isRTL) {
      this.chartOptionsTask.xaxis['categories'].reverse();
    }

    var now = new Date();
    var dayNow = ('0' + now.getDate()).slice(-2);
    var monthNow = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + monthNow + '-' + dayNow;
    var day = ('0' + now.getDate()).slice(-2);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var todayMin = now.getFullYear() - 1 + '-01-01';

    this.tdayy = today;
    this.data.filter.startDate = todayMin;
    this.data.filter.ToDate = today;
    this.reportdatefrom = todayMin;
    this.reportdateto = today;

    this.todayy = today;
    this.getstatistics();
    //this.GetNewTasksByUserId(today);
    this.GetNewTasksByUserId_paging(today, 1, 10);
    //this.GetLateTasksByUserIdHome(today);
    this.GetLateTasksByUserIdHome_paging(today, 1, 10);
    this.GetNewWorkOrdersByUserId(today);
    // this.GetLateWorkOrdersByUserId(today);
    this.GetLateWorkOrdersByUserId_paging(today, 1, 10);

    this.GetAllUserCustodiesStatistics();
    this.GetUserStatisticsPercentData();
    this.checknot();
  }
  UseName: any;
  JobName: any;
  GetCurrentUserById() {
    this._homesernice.GetCurrentUserById().subscribe((data) => {
      // console\.log(data.result);
      this.UseName = data.result.fullName;
      this.JobName = data.result.jobName;
    });
  }

  ProjectsList: any = null;
  NewTasksProjectid: any = null;
  LateTasksProjectid: any;
  NewWorkOrdersProjectid: any;
  LateWorkOrdersProjectid: any;

  NewTasksCustomerId: any = null;
  LateTasksCustomerId: any;
  NewWorkOrdersCustomerId: any;
  LateWorkOrdersCustomerId: any;

  FillProjectSelect() {
    this._projectService.FillProjectSelect().subscribe((data) => {
      // console\.log(data)
      this.ProjectsList = data;
      this.FilterLoadDataProjects.loadProjects = data;
    });
  }
  ProjectsListNewTask: any;
    FillProjectSelectNewTask() {
    this._projectService.FillProjectSelectNewTask().subscribe((data) => {
      // console\.log(data)
      this.ProjectsListNewTask = data;
      this.FilterLoadDataProjects.loadProjects = data;
    });
  }
    ProjectsListLateTask: any;
    FillProjectSelectLateTask() {
    this._projectService.FillProjectSelectLateTask().subscribe((data) => {
      // console\.log(data)
      this.ProjectsListLateTask = data;
      this.FilterLoadDataProjects.loadProjects = data;
    });
  }


      ProjectsListworkorder: any;
    FillProjectSelectWorkOrder() {
    this._projectService.FillProjectSelectWorkOrder().subscribe((data) => {
      // console\.log(data)
      this.ProjectsListworkorder = data;
      this.FilterLoadDataProjects.loadProjects = data;
    });
  }

     ProjectsListlateworkorder: any;
    FillProjectSelecLatetWorkOrder() {
    this._projectService.FillProjectSelecLatetWorkOrder().subscribe((data) => {
      // console\.log(data)
      this.ProjectsListlateworkorder = data;
      this.FilterLoadDataProjects.loadProjects = data;
    });
  }

  role: any;
  projectDetails: any;
  IsadminTask: any;
  open(content: any, size?: any, data?: any, positions?: any, role?: any) {
    if (role) {
      this.role = role;
    }

    if (data) {
      this.RowInvoiceData = data;
    }
    if (role == 'client') {
      this.GetAllLoans2();

      this.fillfillEmployeeWorker();
    }
    if (role == 'admin') {
      this.getwaitingImprests();

      this.fillfillEmployeeWorker();
    }
    if (role == 'vacationclient') {
      this.GetAllVacations2();
      this.GetAllVacationsw();
      this.Getemployeebyid();
      this.fillvacationtype();
    }
    if (role == 'vacationadmin') {
      this.getwaitingvacation();
      this.GetAllVacationsw();
      // this.Getemployeebyid();
      this.fillvacationtype();
    }
    if (role == 'openreport') {
      this.GetDoneTasksDGV();
      this.GetEmpDoneWOsDGV();
      this.GetEmpUnderGoingWOsDGV();
      this.GetEmpUnderGoingWOsDGV();
      this.GetInProgressProjectPhasesTasksHome_Search();
      this.GetLateTasksByUserIdHome_Search();
    }
    if (role == 'supervisions') {
      this.GetAllSupervisionsByUserId();
    }
    if (role == 'reasonrefuse') {
      this.SuperDetId = data;
    }
    if (role == 'notavailable') {
      this.SuperDetId = data;
    }
    if (role == 'img') {
      this.SuperDetId = data;
    }
    if (role == 'number') {
      this.SuperDetId = data;
    }
    if (role == 'location') {
      this.SuperDetId = data;
    }

    if (role == 'newtaskpopup') {
      this.GetTaskById(data.phaseTaskId);
      this.IsadminTask = 0;
    }
    if (role == 'newtaskpopupadmin') {
      this.GetTaskById(data.phaseTaskId);
      this.IsadminTask = 1;
    }

    if (role == 'task') {
      this.GlobalRowSelectTaskOrLate = this.TaskData;
      if (size == 'savepercentage') {
        this.TaskData.Obj.execPercentage = this.percentage;
        if (
          this.TaskData.Obj.execPercentage == null ||
          this.TaskData.Obj.execPercentage == '' ||
          this.TaskData.Obj.execPercentage < 0
        ) {
          this.toast.error('ادخل نسبه');
          return;
        }
      }
    } else if (role == 'latetask') {
      //ht8yr l tht de l late
      this.GlobalRowSelectTaskOrLate = this.TaskDataLate;
    }
debugger
    if (role == 'details') {
      this.projectDetails = data;
      this.GetProSettingDetails(data.projectId);
      //this.projectDetails['id'] = 1;
    }
    if (role == 'details2') {
      this.GetProSettingDetails(data.projectId);

            this.GetProDetails(data.projectId);

      //this.projectDetails['id'] = 1;
    }
    if (role == 'accountingentry') {
      this.GetAllJournalsByInvID(data.invoiceId);
    }
    if (role == 'accountingentryPurchase') {
      this.GetAllJournalsByInvIDPurchase(data.invoiceId);
    }
    if (role == 'alert') {
      this.getALERTData();
    }
    if (role == 'savingpercentage') {
      if (
        this.TaskData.Obj.execPercentage == null ||
        this.TaskData.Obj.execPercentage == '' ||
        this.TaskData.Obj.execPercentage < 0
      ) {
        this.toast.error('ادخل نسبه');
        return;
      }
    }
    // else if(role=='ConvertVac'){

    //     this.FillUsersTasksVacationSelect();
    //     this.FillConverVacUser();

    // }
    // else if(role=='Converttouser'){

    //     this.FillConvertAllUser();

    // }

    // else if(role=="projectgoalAddTask")
    // {
    //   this.ChangeGoal();
    //   if(this.AddTaskData.taskgoal==false)
    //   {
    //     return;
    //   }
    // }
    else if (role == 'projectgoal') {
      this.ChangeGoal();
      if (this.TaskData.taskgoal == false) {
        return;
      }
    } else if (role == 'projectgoalLate') {
      this.ChangeGoalLate();
      if (this.TaskDataLate.taskgoal == false) {
        return;
      }
    }
    if (role == 'details2') {
       setTimeout(() => {
     
  this.modalService
        .open(content, {
          ariaLabelledBy: 'modal-basic-title',
          size: size ? size : 'xl',
          centered: size == 'infoAction' ? true : false,
          backdrop: 'static',
          keyboard: false,
        })
        .result.then(
          (result) => {
            // this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
         );
          }, 5000);
    } else {
      this.modalService
        .open(content, {
          ariaLabelledBy: 'modal-basic-title',
          size: size ? size : 'xl',
          centered: size == 'infoAction' ? true : false,
          backdrop: 'static',
          keyboard: false,
        })
        .result.then(
          (result) => {
            // this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }
  }
  public generateData(baseval: any, count: any, yrange: any) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

      series.push([x, y, z]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

  confirm() {}
  vacationtypeselected: any;
  vacationidupdated: any;
  loanupdate: any;
  loanselectedtype: any;

  openModal(event: any, data: any, type: any) {
    // type = اجازة / سلف
    if (type == 'vacation') {
      this.vacationidupdated = data;
      this.vacationtypeselected = event?.target?.value;
    }
    if (type == 'loan') {
      this.loanupdate = data;
      this.loanselectedtype = event?.target?.value;
      this.modalService.open(this.confirmloanModal, {
        size: 'md',
        centered: true,
      });
    }
    let value = event?.target?.value;
    if (type == 'vacation') {
      switch (value) {
        case '2':
          this.modalService.open(this.acceptModal, {
            size: 'md',
            centered: true,
          });
          break;
        case '3':
          this.modalService.open(this.rejectModal, {
            size: 'md',
            centered: true,
          });
          break;
        case '4':
          this.modalService.open(this.reviewModal, {
            size: 'md',
            centered: true,
          });
          break;
        case '5':
          this.modalService.open(this.delayModal, {
            size: 'md',
            centered: true,
          });
          break;

        default:
          break;
      }
    }
  }
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

  latitude: any = 24.72030293127678;
  longitude: any = 46.698462762671475;
  mapReady: boolean = false;
  zoom!: number;
  address!: string;
  private geoCoder: any;

  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 16;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }
  onMapReady(map?: google.maps.Map) {
    if (map) {
      map.setOptions({
        streetViewControl: false,
        fullscreenControl: false,
      });
      google.maps.event.addListener(map, 'click', (event) => {
        this.setLocation(event.latLng.lat(), event.latLng.lng());
      });
    }
  }
  setLocation(lat: any, lng: any) {
    this.latitude = lat;
    this.longitude = lng;

    this.getAddress(lat, lng);
  }

  markerDragEnd(event: any) {
    this.latitude = event.latLng.lat();
    this.longitude = event.latLng.lng();

    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude: any, longitude: any) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.geoCoder?.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results: any, status: any) => {
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 16;
            this.address = results[1].formatted_address;
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }

  projDet: any = {
    settingNoP: null,
    settingNoteP: null,
  };
  GetProSettingDetails(projectId: any) {
    this._projectService.GetProSettingDetails(projectId).subscribe((data) => {
      // console\.log("GetProSettingDetails");
      // console\.log(data);
      this.projDet.settingNoP = data.settingNoP;
      this.projDet.settingNoteP = data.settingNoteP;
    });
  }

    GetProDetails(projectId: any) {
    this._projectService.GetProjectById(projectId).subscribe((data) => {
      this.projectDetails = data.result;
    });
  }

  customerfilterid: any;
  customerselect: any;
  FillCustomerSelect() {
    this._projectService.FillCustomerSelect().subscribe((data) => {
      this.customerselect = data;
      //add dawoud -- load all customer select here
      this.FilterLoadData.loadCustomer = data;
      this.FilterLoadDataProjects.loadCustomer = data;
    });
  }

    customerselectNewTask: any;
  FillCustomerSelectNewTasks() {
    this._projectService.FillCustomerSelectNewTasks().subscribe((data) => {
      this.customerselectNewTask = data;
      //add dawoud -- load all customer select here
      this.FilterLoadData.loadCustomer = data;
      this.FilterLoadDataProjects.loadCustomer = data;
    });
  }
  customerselectLateTask: any;
  FillCustomerSelectLateTask() {
    this._projectService.FillCustomerSelectLateTask().subscribe((data) => {
      this.customerselectLateTask = data;
      //add dawoud -- load all customer select here
      this.FilterLoadData.loadCustomer = data;
      this.FilterLoadDataProjects.loadCustomer = data;
    });
  }

    customerselectWorkOrder: any;
  FillCustomerSelectWorkOrder() {
    this._projectService.FillCustomerSelectWorkOrder().subscribe((data) => {
      this.customerselectWorkOrder = data;
      //add dawoud -- load all customer select here
      this.FilterLoadData.loadCustomer = data;
      this.FilterLoadDataProjects.loadCustomer = data;
    });
  }

      customerselectlateWorkOrder: any;
  FillCustomerSelectLateWorkOrder() {
    this._projectService.FillCustomerSelectLateWorkOrder().subscribe((data) => {
      this.customerselectlateWorkOrder = data;
      //add dawoud -- load all customer select here
      this.FilterLoadData.loadCustomer = data;
      this.FilterLoadDataProjects.loadCustomer = data;
    });
  }
  //------------------------------------------DataTask----------------------------------------------
  //#region

  public chartOptionsLate!: any;

  public readonly controlTask = new FileUploadControl(
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
  public readonly uploadedFileTask: BehaviorSubject<string> =
    new BehaviorSubject('');

  selectOrder(order: any) {
    debugger;
    if (order != null) {
      this.OrderData.selected = true;
      this.GetOrderListtxt(parseInt(order.workOrderId));
      this.GetProjectRequirementByOrderId_Count(parseInt(order.workOrderId));
    } else {
      this.OrderData.selected = false;
    }
  }
  downloadFileWorkOrder(data: any) {
    try {
      var link = environment.PhotoURL + data.attatchmentUrl;
      window.open(link, '_blank');
    } catch (error) {
      this.toast.error('تأكد من الملف', 'رسالة');
    }
  }
  GetOrderListtxt(phaseid: any) {
    this._phasestaskService
      .GetWorkOrdersByUserIdandtask(phaseid)
      .subscribe((data) => {
        console.log(data.result[0]);
        this.OrderData.Obj = data.result[0];
        this.OrderData.percentComplete = data.result[0]?.percentComplete;
        this.OrderData.required = data.result[0]?.required;

        // console\.log("this.OrderData.Obj");
        // console\.log(this.OrderData.Obj);
      });
  }
  selectOrderadmin(order: any) {
    debugger;
    if (order != null) {
      this.OrderData.selected = true;
      this.GetOrderListtxtadmin(parseInt(order.workOrderId));
      this.GetProjectRequirementByOrderId_Count(parseInt(order.workOrderId));
    } else {
      this.OrderData.selected = false;
    }
  }

  GetOrderListtxtadmin(phaseid: any) {
    this._phasestaskService.GetWorkOrdersBytask(phaseid).subscribe((data) => {
      console.log(data.result[0]);
      this.OrderData.Obj = data.result[0];
      this.OrderData.percentComplete = data.result[0]?.percentComplete;
      this.OrderData.required = data.result[0]?.required;

      // console\.log("this.OrderData.Obj");
      // console\.log(this.OrderData.Obj);
    });
  }

  FinishOrder(modal: any) {
    var PlayTaskObj: any = {};
    PlayTaskObj.WorkOrderId = this.OrderData.Obj.workOrderId;
    PlayTaskObj.OrderNo = this.OrderData.Obj.orderNo;
    PlayTaskObj.WOStatus = 3;
    PlayTaskObj.PercentComplete = 100;
    PlayTaskObj.WOStatustxt = 'منتهية';

    this._phasestaskService
      .FinishOrder(PlayTaskObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetNewWorkOrdersByUserId(this.tdayy);
          // this.GetLateWorkOrdersByUserId(this.tdayy);
          this.GetLateWorkOrdersByUserId_paging(this.tdayy, 1, 10);

          modal.dismiss();

          this.GetUserStatistics();
          this.getstatistics();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  SavePercentage(modal: any) {
    var PlayTaskObj: any = {};
    if (parseInt(this.OrderData.percentComplete) == 100) {
      PlayTaskObj.WorkOrderId = this.OrderData.Obj.workOrderId;
      PlayTaskObj.OrderNo = this.OrderData.Obj.orderNo;
      PlayTaskObj.WOStatus = 3;
      PlayTaskObj.PercentComplete = 100;
      PlayTaskObj.WOStatustxt = 'منتهية';
    } else {
      PlayTaskObj.WorkOrderId = this.OrderData.Obj.workOrderId;
      PlayTaskObj.OrderNo = this.OrderData.Obj.orderNo;
      PlayTaskObj.PercentComplete = parseInt(this.OrderData.percentComplete);
      PlayTaskObj.WOStatus = parseInt(this.OrderData.Obj.woStatus);
      PlayTaskObj.WOStatustxt = this.OrderData.Obj.woStatustxt;
    }
    this._phasestaskService
      .FinishOrder(PlayTaskObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant('تم الحفظ'),
            this.translate.instant('Message')
          );
          this.GetNewWorkOrdersByUserId(this.tdayy);
          // this.GetLateWorkOrdersByUserId(this.tdayy);
          this.GetLateWorkOrdersByUserId_paging(this.tdayy, 1, 10);
          //this.GetAllWorkOrders();
          this.GetAllWorkOrders_paging(1, 10);
          modal.dismiss();
          this.GetUserStatistics();
          this.getstatistics();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  gettaskcolor(task: any) {
    if (task.status == 2) {
      return 'text-red-500 fw-bold';
    } else if (task.stopProjectType == 1) {
      return 'text-yellow-500 fw-bold';
    } else if (task.status == 3) {
      // return "style=background-color: #c5c7cc!important;";
      return '';
    } else {
      return '';
    }
  }
  UpdateIsNew(TaskId: any) {
    this._phasestaskService.UpdateIsNew(TaskId).subscribe((result: any) => {
      if (result.statusCode == 200) {
      }
    });
  }
  updateisnew(task: any) {
    if (task != null) {
      if (task.isNew == 1) {
        this._phasestaskService
          .UpdateIsNew(task.phaseTaskId)
          .subscribe((result: any) => {
            if (result.statusCode == 200) {
              //this.GetNewTasksByUserId(this.tdayy);
              this.GetNewTasksByUserId_paging(this.todayy, 1, 10);
            }
          });
      }
    }
  }

  selectTask(task: any) {
    if (task != null) {
      this.TaskData.selected = true;
      this.GetTaskListtxt(parseInt(task.phaseTaskId));
      this.GetProjectRequirementByTaskId_Count(parseInt(task.phaseTaskId));
      //       if(task.isNew==1){
      // this.UpdateIsNew(task.isNew);
      //       }
    } else {
      this.TaskData.selected = false;
    }
  }

  ColorProject(mData: any) {
    if (Object.keys(mData).length === 0) return '';
    var today = this._sharedService.date_TO_String(new Date());
    if (
      mData.firstProjectExpireDate != null &&
      mData.firstProjectDate != null
    ) {
      if (mData.firstProjectDate < today) {
        if (mData.firstProjectExpireDate < today) {
          return 'text-red-500 fw-bold';
        } else if (mData.firstProjectExpireDate == today) {
        } else {
          var date1 = new Date(mData.firstProjectExpireDate);
          var date2 = new Date(today);
          var date3 = new Date(mData.firstProjectDate);
          var Difference_In_Time = date2.getTime() - date3.getTime();
          var Difference_In_Time2 = date1.getTime() - date3.getTime();

          var Difference_In_Days = parseInt(
            (Difference_In_Time / (1000 * 3600 * 24)).toString()
          );
          var Difference_In_Days2 = parseInt(
            (Difference_In_Time2 / (1000 * 3600 * 24)).toString()
          );

          if (0.7 < Difference_In_Days / Difference_In_Days2) {
            return 'text-yellow-500 fw-bold';
          }
        }
      }
    }
    return '';
  }
  backgroungColor(row: any) {
    if (Object.keys(row).length === 0) return '';
    if (!(row.stopProjectType != 1)) {
      return 'stopProjectcolor';
    }
    return '';
  }
  // selectTask_Late(){
  //   if(this.selectedTask2[0]!=null)
  //   {
  //     this.TaskDataLate.selected=true;
  //     this.GetTaskListtxt_Late(parseInt(this.selectedTask2[0].phaseid));
  //   }
  //   else{
  //     this.TaskDataLate.selected=false;
  //   }
  // }
  phasePriValue: any = '1';
  phasePriValueTemp: any = '1';
  taskLongDesc: any = '';
  taskLongDescTemp: any = '';

  phasePriValueLate: any = '1';
  phasePriValueTempLate: any = '1';
  taskLongDescLate: any = '';
  taskLongDescTempLate: any = '';

  GetTaskListtxt(phaseid: any) {
    this._phasestaskService.GetTaskListtxt(phaseid).subscribe((data) => {
      this.TaskData.Obj = data.result;

      if (data.result.taskTimeFrom == '' || data.result.taskTimeTo == '') {
        this.TaskData.TaskTimeFrom_Merge = data.result.taskStart;
        this.TaskData.TaskTimeTo_Merge = data.result.endDateCalc;
      } else {
        this.TaskData.TaskTimeFrom_Merge = JSON.stringify(
          data.result.taskStart + ' - ' + data.result.taskTimeFrom
        );
        this.TaskData.TaskTimeTo_Merge = JSON.stringify(
          data.result.endDateCalc + ' - ' + data.result.taskTimeTo
        );
      }
      var priorty = 'بدون';
      if (data.result.phasePriority == 1) {
        priorty = 'منخفض';
      } else if (data.result.phasePriority == 2) {
        priorty = 'متوسط';
      } else if (data.result.phasePriority == 3) {
        priorty = 'مرتفع';
      } else if (data.result.phasePriority == 4) {
        priorty = 'عاجل';
      } else {
        priorty = 'بدون';
      }
      this.TaskData.priorty = priorty;

      this.TaskData.notesStrVac=null;
      if(this.TaskData.Obj.numAdded>0 && this.TaskData.Obj.timeType==2)
      {
        var str1="";
        if(this.TaskData.Obj.timeType==1){str1=this.TaskData.Obj.timeMinutes + " ساعة ";}
        else{str1=this.TaskData.Obj.timeMinutes + " يوم ";}
        var str2=(this.TaskData.Obj.numAdded).toString();
        var str3=(this.TaskData.Obj.numAdded+this.TaskData.Obj.timeMinutes).toString();;
        const combined = `${" المهمة مدتها "}${str1}${" وبينهم "}${str2}${" يوم أجازة أصبحت "}${str3}${" يوم "}`;
        this.TaskData.notesStrVac = combined;
      }




      this.phasePriValue = String(data.result.phasePriority);
      this.phasePriValueTemp = this.phasePriValue;
      this.taskLongDesc = data.result.taskLongDesc;
      this.taskLongDescTemp = this.taskLongDesc;
      // pstatus
      // console\.log("---------------");
      // console\.log(this.TaskData.Obj);
      // console\.log(this.TaskData.Obj.isRetrieved);
      // console\.log(this.TaskData.Obj.isConverted);
      // console\.log(this.TaskData.Obj.plusTime);

      this.GetValueChartTask(data.result);
      var perc = this.TaskChartData.TaskValueChart;
      var arr = [perc, this.TaskChartData.TaskValueChart - perc];
      this.arrSeries = arr;

      this.chartOptions = {
        series: this.arrSeries,
        chart: {
          type: 'donut',
        },
        labels: ['النسبة', 'المتبقي'],
        legend: null,

        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 150,
              },
            },
          },
        ],
      };
    });
  }
  GetTaskListtxt_Late(phaseid: any) {
    this._phasestaskService.GetTaskListtxt(phaseid).subscribe((data) => {
      // console\.log(data.result);
      this.TaskDataLate.Obj = data.result;
      // console\.log("this.TaskDataLate.Obj");
      // console\.log(this.TaskDataLate.Obj);

      if (data.result.taskTimeFrom == '' || data.result.taskTimeTo == '') {
        this.TaskDataLate.TaskTimeFrom_Merge = data.result.taskStart;
        this.TaskDataLate.TaskTimeTo_Merge = data.result.endDateCalc;
      } else {
        this.TaskDataLate.TaskTimeFrom_Merge = JSON.stringify(
          data.result.taskStart + ' - ' + data.result.taskTimeFrom
        );
        this.TaskDataLate.TaskTimeTo_Merge = JSON.stringify(
          data.result.endDateCalc + ' - ' + data.result.taskTimeTo
        );
      }
      var priorty = 'بدون';
      if (data.result.phasePriority == 1) {
        priorty = 'منخفض';
      } else if (data.result.phasePriority == 2) {
        priorty = 'متوسط';
      } else if (data.result.phasePriority == 3) {
        priorty = 'مرتفع';
      } else if (data.result.phasePriority == 4) {
        priorty = 'عاجل';
      } else {
        priorty = 'بدون';
      }
      this.TaskDataLate.priorty = priorty;

      this.TaskDataLate.notesStrVac=null;
      if(this.TaskDataLate.Obj.numAdded>0 && this.TaskDataLate.Obj.timeType==2)
      {
        var str1="";
        if(this.TaskDataLate.Obj.timeType==1){str1=this.TaskDataLate.Obj.timeMinutes + " ساعة ";}
        else{str1=this.TaskDataLate.Obj.timeMinutes + " يوم ";}
        var str2=(this.TaskDataLate.Obj.numAdded).toString();
        var str3=(this.TaskDataLate.Obj.numAdded+this.TaskDataLate.Obj.timeMinutes).toString();;
        const combined = `${" المهمة مدتها "}${str1}${" وبينهم "}${str2}${" يوم أجازة أصبحت "}${str3}${" يوم "}`;
        this.TaskDataLate.notesStrVac = combined;
      }

      this.phasePriValueLate = String(data.result.phasePriority);
      this.phasePriValueTempLate = this.phasePriValueLate;
      this.taskLongDescLate = data.result.taskLongDesc;
      this.taskLongDescTempLate = this.taskLongDescLate;
      this.GetValueChartTask_Late(data.result);
      var perc = this.TaskChartData.LateTaskValueChart;
      var arr = [perc, this.TaskChartData.LateTaskValueChart - perc];
      this.arrSeries = arr;

      this.chartOptionsLate = {
        series: this.arrSeries,
        chart: {
          type: 'donut',
        },
        labels: ['النسبة', 'المتبقي'],
        legend: null,

        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 150,
              },
            },
          },
        ],
      };
    });
  }
  TaskChartData: any = {
    TaskValueChart: 0,
    TaskValueCharttxt: null,
    LateTaskValueChart: 0,
    LateTaskValueCharttxt: null,
  };

  GetValueChartTask(data: any) {
    var tsktime = 0;
    var parvalue = 0;
    if (data.remaining <= 0) {
      this.TaskChartData.TaskValueChart = 100;
      this.TaskChartData.TaskValueCharttxt = 'متاخرة';
    } else if (data.remaining > 0) {
      if (data.timeType == 1) {
        tsktime = data.timeMinutes * 60;
      } else if (data.timeType == 2) {
        tsktime = data.timeMinutes * 24 * 60;
      }
      var remn = ((data.remaining / tsktime) * 100) / 100;
      var parvalue = 1 - remn;
      parvalue = parseInt((parvalue * 100).toString());
      this.TaskChartData.TaskValueChart = parvalue;
    } else {
      this.TaskChartData.TaskValueChart = 0;
    }
  }
  GetValueChartTask_Late(data: any) {
    var tsktime = 0;
    var parvalue = 0;
    if (data.remaining <= 0) {
      this.TaskChartData.LateTaskValueChart = 100;
      this.TaskChartData.LateTaskValueCharttxt = 'متاخرة';
    } else if (data.remaining > 0) {
      if (data.timeType == 1) {
        tsktime = data.timeMinutes * 60;
      } else if (data.timeType == 2) {
        tsktime = data.timeMinutes * 24 * 60;
      }
      var remn = ((data.remaining / tsktime) * 100) / 100;
      var parvalue = 1 - remn;
      parvalue = parseInt((parvalue * 100).toString());
      this.TaskChartData.LateTaskValueChart = parvalue;
    } else {
      this.TaskChartData.LateTaskValueChart = 0;
    }
  }
  ChangeGoal() {
    if (this.TaskData.goalcheck) {
      if (this.TaskData.Obj.projectId != null) {
        this._phasestaskService
          .FillProjectRequirmentSelect(this.TaskData.Obj.projectId)
          .subscribe((result: any) => {
            if (result.result != null) {
              if (result.result.requirementGoalId != 0) {
                this.TaskData.goalname = result.result.requirmentName;
              } else {
                this.TaskData.goalcheck = false;
                this.TaskData.goalname = null;
              }
            } else {
              this.TaskData.goalcheck = false;
              this.TaskData.goalname = null;
            }
          });
      } else {
        this.TaskData.goalcheck = false;
        this.TaskData.goalname = null;
        this.toast.error('من فضلك أختر مشروع أولا', 'رسالة');
        return;
      }
    } else {
      this.TaskData.taskgoal = false;
      this.TaskData.goalname = null;
    }
  }
  ChangeGoalLate() {
    if (this.TaskDataLate.goalcheck) {
      if (this.TaskDataLate.Obj.projectId != null) {
        this._phasestaskService
          .FillProjectRequirmentSelect(this.TaskDataLate.Obj.projectId)
          .subscribe((result: any) => {
            if (result.result != null) {
              if (result.result.requirementGoalId != 0) {
                this.TaskDataLate.goalname = result.result.requirmentName;
              } else {
                this.TaskDataLate.goalcheck = false;
                this.TaskDataLate.goalname = null;
              }
            } else {
              this.TaskDataLate.goalcheck = false;
              this.TaskDataLate.goalname = null;
            }
          });
      } else {
        this.TaskDataLate.goalcheck = false;
        this.TaskDataLate.goalname = null;
        this.toast.error('من فضلك أختر مشروع أولا', 'رسالة');
        return;
      }
    } else {
      this.TaskDataLate.taskgoal = false;
      this.TaskDataLate.goalname = null;
    }
  }

  GetTimeMinutestxt(date1: any, date2: any) {
    var diff = Math.abs(date1.getTime() - date2.getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    return diffDays + 1;
  }
  //------------------------------TaskBtns-------------------------------------------
  //#region
  GlobalRowSelectTaskOrLate: any;

  FinishTaskCheck(modal: any) {
    this._phasestaskService.FinishTaskCheck(modal).subscribe((result: any) => {});
  }

  finishTask(modal: any) {
    var PlayTaskObj: any = {};
    debugger
    if(this.GlobalRowSelectTaskOrLate.Obj.execPercentage==100){this.GlobalRowSelectTaskOrLate.Obj.status=4;}
    PlayTaskObj.ExecPercentage =this.GlobalRowSelectTaskOrLate.Obj.execPercentage;
    PlayTaskObj.Status = this.GlobalRowSelectTaskOrLate.Obj.status;
    PlayTaskObj.PhaseTaskId = this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId;
    this._phasestaskService.FinishTask(PlayTaskObj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.FinishTaskCheck(PlayTaskObj);
          if(PlayTaskObj.Status==4)
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          else
          this.toast.success(this.translate.instant("تم حفظ النسبة"),this.translate.instant('Message'));
        
        // this.refreshData();
        modal.dismiss();
        //this.GetNewTasksByUserId(this.tdayy);
        this.GetNewTasksByUserId_paging(this.tdayy, 1, 10);
        // this.GetLateTasksByUserIdHome(this.tdayy);
        this.GetLateTasksByUserIdHome_paging(this.tdayy, 1, 10);

        this.GetUserStatistics();
        this.getstatistics();
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }
  confirm_endtask(modal: any) {
    var PlayTaskObj: any = {};
    PlayTaskObj.PhaseTaskId = this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId;
    PlayTaskObj.Status = 4;
    PlayTaskObj.ExecPercentage = 100;
    this._phasestaskService.FinishTask(PlayTaskObj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.FinishTaskCheck(PlayTaskObj);
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        // this.refreshData();
        modal.dismiss();
        this.taskmodal.dismiss();
        //this.GetNewTasksByUserId(this.tdayy);
        this.GetNewTasksByUserId_paging(this.tdayy, 1, 10);
        // this.GetLateTasksByUserIdHome(this.tdayy);
        this.GetLateTasksByUserIdHome_paging(this.tdayy, 1, 10);

        this.GetUserStatistics();
        this.getstatistics();
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }
  confirm_playandstoptask(type: number, modal: any) {
    var PlayTaskObj: any = {};
    PlayTaskObj.PhaseTaskId = this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId;
    PlayTaskObj.Status = type;
    this._phasestaskService
      .PlayPauseTask(PlayTaskObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          // this.refreshData();

          modal.dismiss();
          //this.GetNewTasksByUserId(this.tdayy);
          this.GetNewTasksByUserId_paging(this.tdayy, 1, 10);
          // this.GetLateTasksByUserIdHome(this.tdayy);
          this.GetLateTasksByUserIdHome_paging(this.tdayy, 1, 10);
          this.GetUserStatistics();
          this.getstatistics();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  confirm_deletetask() {
    this._phasestaskService
      .DeleteProjectPhasesTasksNEW(
        this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId
      )
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          // this.refreshData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  progress = 0;
  uploading = false;
  disableButtonSave_File = false;

  resetprog() {
    this.disableButtonSave_File = false;
    this.progress = 0;
    this.uploading = false;
  }

  confirm_SaveFiles(modal: any) {
    if (this.controlTask?.value.length > 0) {
      setTimeout(() => {
        this.resetprog();
      }, 60000);
      this.progress = 0;
      this.disableButtonSave_File = true;
      this.uploading = true;

      // console\.log(this.controlTask?.value[0]);
      const formData: FormData = new FormData();
      formData.append('uploadesgiles', this.controlTask?.value[0]);

      formData.append('RequirementId', String(0));
      formData.append(
        'PhasesTaskID',
        this.GlobalRowSelectTaskOrLate?.Obj?.phaseTaskId ?? 0
      );
      formData.append('OrderId', this.OrderData?.Obj?.workOrderId ?? 0);

      if ((this.OrderData?.Obj?.workOrderId ?? 0) > 0) {
        formData.append('PageInsert', '4');
      } else {
        formData.append('PageInsert', '1');
      }

      if (
        (this.OrderData?.Obj?.workOrderId ?? 0) > 0 &&
        this.OrderData?.Obj?.projectId == null
      ) {
        const formData: FormData = new FormData();
        formData.append(
          'WorkOrderId',
          String(this.OrderData?.Obj?.workOrderId)
        );
        formData.append('postedFiles', this.controlTask?.value[0]);

        this._workordersService
          .SaveWorkOrderFile(formData)
          .subscribe((result: any) => {
            if (result.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * result.loaded) / result.total);
            }

            if (result?.body?.statusCode == 200) {
              this.controlTask.removeFile(this.controlTask?.value[0]);
              this.toast.success(
                this.translate.instant(result?.body?.reasonPhrase),
                'رسالة'
              );
              modal.dismiss();
              this.resetprog();
            } else if (result?.type >= 0) {
            } else {
              this.toast.error(
                this.translate.instant(result?.body?.reasonPhrase),
                'رسالة'
              );
              this.resetprog();
            }
          });
      } else {
        this._phasestaskService
          .SaveProjectRequirement4(formData)
          .subscribe((result: any) => {
            if (result.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * result.loaded) / result.total);
            }

            if (result?.body?.statusCode == 200) {
              this.controlTask.removeFile(this.controlTask?.value[0]);
              this.toast.success(
                this.translate.instant(result?.body?.reasonPhrase),
                'رسالة'
              );
              modal.dismiss();
              this.resetprog();
            } else if (result?.type >= 0) {
            } else {
              this.toast.error(
                this.translate.instant(result?.body?.reasonPhrase),
                'رسالة'
              );
              this.resetprog();
            }
          });
      }
    }
  }
  confirm_changeTaskTime() {
    if (
      this.extendedData.DateTo == null &&
      this.extendedData.selectedTaskType == 2
    ) {
      this.toast.error('اختر تاريخ نهاية', 'رسالة');
      return;
    }
    var PlusTimeTaskObj: any = {};
    PlusTimeTaskObj.PhaseTaskId =
      this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId;
    if (this.extendedData.selectedTaskType == 1) {
      PlusTimeTaskObj.TimeMinutes = this.extendedData.TimeH;
    } else {
      PlusTimeTaskObj.TimeMinutes = this.GetTimeMinutestxt(
        this.extendedData.DateFrom,
        this.extendedData.DateTo
      );
      PlusTimeTaskObj.EndDate = this._sharedService.date_TO_String(
        this.extendedData.DateTo
      );
    }
    PlusTimeTaskObj.Cost = 0;
    PlusTimeTaskObj.TimeType = this.extendedData.selectedTaskType;
    this._phasestaskService
      .ChangeTaskTime(PlusTimeTaskObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          // this.refreshData();
          // this.GetInProgressProjectPhasesTasks_Branches();
          this.GetInProgressProjectPhasesTasks_Branches_paging(1, 10);
          this.GetTaskById(this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId);
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  confirm_converttask() {
    if (this.UsersSelectConvert == null) {
      this.toast.error('أختر مستخدم', 'رسالة');
      return;
    }
    var ConvertTaskObj: any = {};
    ConvertTaskObj.PhaseTaskId = this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId;
    ConvertTaskObj.UserId = this.UsersSelectConvert;
    this._phasestaskService
      .ConvertTask(ConvertTaskObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          // this.refreshData();
          // this.GetInProgressProjectPhasesTasks_Branches();
          this.GetInProgressProjectPhasesTasks_Branches_paging(1, 10);
          this.GetTaskById(this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId);
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  confirm_changeTaskTime2(modal: any) {
    // if(this.extendedData.DateTo==null && this.extendedData.selectedTaskType==2){
    //   this.toast.error("اختر تاريخ نهاية", 'رسالة');return;
    // }
    var PlusTimeTaskObj: any = {};
    PlusTimeTaskObj.PhaseTaskId =
      this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId;
    // PlusTimeTaskObj.EndDate = this._sharedService.date_TO_String(this.extendedData.DateTo);
    // PlusTimeTaskObj.TimeMinutes = this.GetTimeMinutestxt(this.extendedData.DateFrom,this.extendedData.DateTo);
    // PlusTimeTaskObj.Cost = 0;
    // PlusTimeTaskObj.TimeType = this.extendedData.selectedTaskType;
    this._phasestaskService
      .PlustimeTask(PlusTimeTaskObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          modal.dismiss();
          // this.refreshData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  confirm_converttask2(modal: any) {
    var ConvertTaskObj: any = {};
    ConvertTaskObj.PhaseTaskId = this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId;
    ConvertTaskObj.IsConverted = 1;
    // ConvertTaskObj.UserId = this.UsersSelectConvert;
    this._phasestaskService
      .RequestConvertTask(ConvertTaskObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          modal.dismiss();
          // this.refreshData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  ShowImgAdded() {
    var img = environment.PhotoURL + this.TaskData.Obj?.addedTaskImg;
    return img;
  }
  ShowImgManager() {
    var img = environment.PhotoURL + this.TaskData.Obj?.projectManagerImg;
    return img;
  }

  //#endregion
  //--------------------------- (end)---TaskBtns-------------------------------------------

  load_UsersSelectConvert: any;
  UsersSelectConvert: any = null;

  Fillcustomerhavingoffer() {
    this._phasestaskService.FillUsersSelect(0).subscribe((data) => {
      this.load_UsersSelectConvert = data;
    });
  }
  TimeHChange() {
    if (this.extendedData.TimeH > 24) {
      this.extendedData.TimeH = 24;
    } else if (this.extendedData.TimeH < 1) {
      this.extendedData.TimeH = 1;
    }
  }

  SaveTaskLongDesc(type: any) {
    var details = '';
    if (type == 'task') {
      this.GlobalRowSelectTaskOrLate = this.TaskData;
      details = this.taskLongDesc;
    } else if (type == 'latetask') {
      this.GlobalRowSelectTaskOrLate = this.TaskDataLate;
      details = this.taskLongDescLate;
    }
    this._phasestaskService
      .SaveTaskLongDesc(this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId, details)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          // this.refreshData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  ChangePriorityTask(type: any) {
    var per = 0;
    if (type == 'task') {
      this.GlobalRowSelectTaskOrLate = this.TaskData;
      per = parseInt(this.phasePriValue);
    } else if (type == 'latetask') {
      this.GlobalRowSelectTaskOrLate = this.TaskDataLate;
      per = parseInt(this.phasePriValueLate);
    }

    var PlayTaskObj: any = {};
    PlayTaskObj.PhaseTaskId = this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId;
    PlayTaskObj.PhasePriority = per;
    this._phasestaskService
      .ChangePriorityTask(PlayTaskObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          // this.refreshData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  ShowImgAddedLate() {
    var img = environment.PhotoURL + this.TaskDataLate.Obj?.addedTaskImg;
    return img;
  }
  ShowImgManagerLate() {
    var img = environment.PhotoURL + this.TaskDataLate.Obj?.projectManagerImg;
    return img;
  }

  onPageChange2(event: any) {
    this.pageNumber2 = event.pageIndex;

    // console\.log(this.pageNumber2 * 10, (this.pageNumber2 + 1) * 10);

    this.rows.projects = new MatTableDataSource(
      this.projectsdata.slice(
        this.pageNumber2 * 10,
        (this.pageNumber2 + 1) * 10
      )
    );
  }

  onPageChange3(event: any) {
    this.pageNumber3 = event.pageIndex;

    // console\.log(this.pageNumber3 * 10, (this.pageNumber3 + 1) * 10);

    this.rows.CostTasks = new MatTableDataSource(
      this.CostTasksData.slice(
        this.pageNumber3 * 10,
        (this.pageNumber3 + 1) * 10
      )
    );
  }
  onPageChange4(event: any) {
    this.pageNumber4 = event.pageIndex;

    // console\.log(this.pageNumber4 * 10, (this.pageNumber4 + 1) * 10);

    this.rows.WorkOrders = new MatTableDataSource(
      this.WorkOrersData.slice(
        this.pageNumber4 * 10,
        (this.pageNumber4 + 1) * 10
      )
    );
  }
  //#endregion
  //------------------------------------(end)------DataTask------------------------------------------
  getTaskclich(PhaseId: any) {
    this.GetDateAndPercentListsForTask(PhaseId);
  }
  PercentsList_Task: any = [];
  DatesList_Task: any = [];
  GetDateAndPercentListsForTask(PhaseId: any) {
    this._homesernice.GetPhaseTaskData(PhaseId).subscribe({
      next: (data: any) => {
        this.PercentsList_Task = [];
        this.DatesList_Task = [];
        data.result.forEach((item: any) => {
          this.PercentsList_Task.push(item?.taskpercentage);
          this.DatesList_Task.push(item?.actualDateTime);
        });

        this.drawTaskChart(this.PercentsList_Task, this.DatesList_Task);
      },
      error: (error) => {},
    });
  }

  drawTaskChart(_PercentsList: any, _DatesList: any) {
    //data_y = [30, 40, 90];
    //data_x = ['2023-01-01', '2023-01-02', '2023-01-03'];

    this.data_yT2 = null;
    this.data_xT2 = null;
    this.data_yT2 = _PercentsList;
    this.data_xT2 = _DatesList;
    this.chartOptionsTask2 = [];
    this.chartOptionsTask2 = {
      series: [
        {
          name: 'نسبة انجاز',
          data: this.data_yT2,
        },
      ],
      chart: {
        height: 350,
        type: 'area',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      xaxis: {
        type: 'datetime',
        categories: this.data_xT2,
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    };

    if (this.isRTL) {
      this.chartOptionsTask2.xaxis['categories'].reverse();
    }
  }

  ////////////////////////////////////////////////work order////////////////////////////////////////

  WorkOrersData = [];
  pageNumber4: any = 0;
  OrderCustomerFilterid: any;
  GetAllWorkOrders() {
    this._homesernice
      .GetAllWorkOrders(this.OrderCustomerFilterid ?? 0)
      .subscribe((data) => {
        // console\.log(data);
        this.WorkOrersData = data;
        this.rows.WorkOrders = new MatTableDataSource(data);
        this.rows.WorkOrders.paginator = this.tasksPaginator2;
      });
  }
  applyFilterWorkOrders(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.rows.WorkOrders.filter = filterValue.trim().toLowerCase();
  }

  //------------------------------------------Financial Flow-Up--------------------------------------
  //#region
  @ViewChild('paginatorSaleinvoices') paginatorSaleinvoices: MatPaginator;
  @ViewChild('paginatorUnpostedsalesinvoices')
  paginatorUnpostedsalesinvoices: MatPaginator;
  @ViewChild('paginatorBillswithoutaproject')
  paginatorBillswithoutaproject: MatPaginator;
  @ViewChild('paginatorPurchaseinvoices')
  paginatorPurchaseinvoices: MatPaginator;
  @ViewChild('paginatorUnpostedpurchaseinvoices')
  paginatorUnpostedpurchaseinvoices: MatPaginator;
  @ViewChild('paginatorNonpostreceiptvouchers')
  paginatorNonpostreceiptvouchers: MatPaginator;
  @ViewChild('paginatorNonpostbonds') paginatorNonpostbonds: MatPaginator;

  FinfolData: any = {
    Saleinvoices: new MatTableDataSource(),
    Unpostedsalesinvoices: new MatTableDataSource(),
    Billswithoutaproject: new MatTableDataSource(),
    Purchaseinvoices: new MatTableDataSource(),
    Unpostedpurchaseinvoices: new MatTableDataSource(),
    Nonpostreceiptvouchers: new MatTableDataSource(),
    Nonpostbonds: new MatTableDataSource(),
  };

  FilterLoadData: any = {
    CustomerId: null,
    paytypeId: null,
    supplierId: null,
    searchtext: null,
    page: 1,
    pagesize: 10,
    loadCustomer: [],
    loadSupplier: [],
    loadpaytype: [],
    AllJournalEntries: [],
    RevCounterHome: null,
    ExpCounterHome: null,
    BoxNetCounterHome: null,
    BankNetCounterHome: null,
    selectedDate: 1,
  };

  resetFilterLoad(event: any) {
    this.FilterLoadData.CustomerId = null;
    this.FilterLoadData.paytypeId = null;
    this.FilterLoadData.supplierId = null;
    this.FilterLoadData.searchtext = null;
    var TabType = event.index + 1;
    this.FilterLoadData.pagesize = 10;
    this.FilterLoadData.page = 1;
    this.GetFinancialfollowup_paging(TabType);
  }
  GetFinancialfollowup(TabType: any) {
    const formData: FormData = new FormData();
    if (this.FilterLoadData?.CustomerId) {
      formData.append('CustomerId', this.FilterLoadData?.CustomerId);
    }
    if (this.FilterLoadData?.supplierId) {
      formData.append('SupplierId', this.FilterLoadData?.supplierId);
    }
    if (this.FilterLoadData?.paytypeId) {
      formData.append('PayType', this.FilterLoadData?.paytypeId);
    }
    var StartDate = new Date();
    var EndDate = new Date();

    if (this.FilterLoadData.selectedDate == 1) {
      formData.append(
        'startdate',
        this._sharedService.date_TO_String(StartDate)
      );
      formData.append('enddate', this._sharedService.date_TO_String(EndDate));
    } else if (this.FilterLoadData.selectedDate == 2) {
      StartDate = new Date(
        StartDate.setDate(StartDate.getDate() - (StartDate.getDay() + 1))
      );
      formData.append(
        'startdate',
        this._sharedService.date_TO_String(StartDate)
      );
      formData.append('enddate', this._sharedService.date_TO_String(EndDate));
    } else if (this.FilterLoadData.selectedDate == 3) {
      var y = StartDate.getFullYear(),
        m = StartDate.getMonth();
      StartDate = new Date(y, m, 1);

      formData.append(
        'startdate',
        this._sharedService.date_TO_String(StartDate)
      );
      formData.append('enddate', this._sharedService.date_TO_String(EndDate));
    }
    formData.append('TabType', TabType);
    this._homesernice.GetFinancialfollowup(formData).subscribe((data) => {
      if (TabType == 1) {
        this.FinfolData.Saleinvoices = new MatTableDataSource(data);
        this.FinfolData.Saleinvoices.paginator = this.paginatorSaleinvoices;
      } else if (TabType == 2) {
        this.FinfolData.Unpostedsalesinvoices = new MatTableDataSource(data);
        this.FinfolData.Unpostedsalesinvoices.paginator =
          this.paginatorUnpostedsalesinvoices;
      } else if (TabType == 3) {
        this.FinfolData.Billswithoutaproject = new MatTableDataSource(data);
        this.FinfolData.Billswithoutaproject.paginator =
          this.paginatorBillswithoutaproject;
      } else if (TabType == 4) {
        this.FinfolData.Purchaseinvoices = new MatTableDataSource(data);
        this.FinfolData.Purchaseinvoices.paginator =
          this.paginatorPurchaseinvoices;
      } else if (TabType == 5) {
        this.FinfolData.Unpostedpurchaseinvoices = new MatTableDataSource(data);
        this.FinfolData.Unpostedpurchaseinvoices.paginator =
          this.paginatorUnpostedpurchaseinvoices;
      } else if (TabType == 6) {
        this.FinfolData.Nonpostreceiptvouchers = new MatTableDataSource(data);
        this.FinfolData.Nonpostreceiptvouchers.paginator =
          this.paginatorNonpostreceiptvouchers;
      } else if (TabType == 7) {
        this.FinfolData.Nonpostbonds = new MatTableDataSource(data);
        this.FinfolData.Nonpostbonds.paginator = this.paginatorNonpostbonds;
      }
    });
  }
  addDays(date: any, days: any) {
    var copy = new Date(Number(date));
    copy.setDate(date.getDate() + days);
    return copy;
  }

  InitFinancialfollowup() {
    this.FilterLoadData.loadpaytype = [
      { id: 1, name: { ar: 'نقدي', en: 'Monetary' } },
      { id: 8, name: { ar: 'آجل', en: 'Postpaid' } },
      {
        id: 17,
        name: { ar: 'نقدا نقاط بيع - مدى-ATM', en: 'Cash points of sale ATM' },
      },
      { id: 9, name: { ar: 'شبكة', en: 'Network' } },
      { id: 6, name: { ar: 'حوالة', en: 'Transfer' } },
    ];
    this.GetDetailedRevenuCount();
    this.GetDetailedExpensesdCount();
    this.GetBoxNetCount();
    this.GetBankNetCount();
    for (var i = 0; i < 7; i++) {
      this.GetFinancialfollowup_paging(i + 1);
    }
  }
  refreshAllFinancialfollowup() {
    for (var i = 0; i < 7; i++) {
      this.GetFinancialfollowup_paging(i + 1);
    }
  }

  downloadFileFinfollowup(data: any) {
    try {
      var link = environment.PhotoURL + data.fileUrl;
      window.open(link, '_blank');
    } catch (error) {
      this.toast.error('تأكد من الملف', 'رسالة');
    }
  }

  GetAllJournalsByInvID(invid: any) {
    this.FilterLoadData.AllJournalEntries = [];
    this._invoiceService.GetAllJournalsByInvID(invid).subscribe((data) => {
      this.FilterLoadData.AllJournalEntries = data.result;
    });
  }
  GetAllJournalsByInvIDPurchase(invid: any) {
    this.FilterLoadData.AllJournalEntries = [];
    this._invoiceService
      .GetAllJournalsByInvIDPurchase(invid)
      .subscribe((data) => {
        this.FilterLoadData.AllJournalEntries = data.result;
      });
  }
  get totaldepit() {
    var sum = 0;
    this.FilterLoadData?.AllJournalEntries.forEach((element: any) => {
      sum =
        +parseFloat(sum.toString()).toFixed(2) +
        +parseFloat(element.depit.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }

  get totalcredit() {
    var sum = 0;
    this.FilterLoadData?.AllJournalEntries.forEach((element: any) => {
      sum =
        +parseFloat(sum.toString()).toFixed(2) +
        +parseFloat(element.credit.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }

  PrintJournalsVyInvIdRetPurchase() {
    if (this.FilterLoadData?.AllJournalEntries[0].invoiceId) {
      this.print.print('reportaccountingentryModal', environment.printConfig);
    }
  }

  FillSupplierSelect() {
    this._homesernice.FillSuppliersSelect().subscribe((data) => {
      this.FilterLoadData.loadSupplier = data;
    });
  }
  GetDetailedRevenuCount() {
    this._homesernice.GetDetailedRevenuCount().subscribe((data) => {
      // console\.log("GetDetailedRevenuCount");
      // console\.log(data);
      this.FilterLoadData.RevCounterHome = parseFloat(data).toFixed(2);
    });
  }
  GetDetailedExpensesdCount() {
    this._homesernice.GetDetailedExpensesdCount().subscribe((data) => {
      // console\.log("GetDetailedExpensesdCount");
      // console\.log(data);
      this.FilterLoadData.ExpCounterHome = parseFloat(data).toFixed(2);
    });
  }
  GetBoxNetCount() {
    this._homesernice.GetBoxNetCount().subscribe((data) => {
      this.FilterLoadData.BoxNetCounterHome = parseFloat(data).toFixed(2);
    });
  }
  GetBankNetCount() {
    this._homesernice.GetBankNetCount().subscribe((data) => {
      this.FilterLoadData.BankNetCounterHome = parseFloat(data).toFixed(2);
    });
  }
  applySaleinvoices(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.FinfolData.Saleinvoices.filter = filterValue.trim().toLowerCase();
  }
  applyUnpostedsalesinvoices(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.FinfolData.Unpostedsalesinvoices.filter = filterValue
      .trim()
      .toLowerCase();
  }
  applyBillswithoutaproject(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.FinfolData.Billswithoutaproject.filter = filterValue
      .trim()
      .toLowerCase();
  }
  applyPurchaseinvoices(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.FinfolData.Purchaseinvoices.filter = filterValue.trim().toLowerCase();
  }
  applyUnpostedpurchaseinvoices(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.FinfolData.Unpostedpurchaseinvoices.filter = filterValue
      .trim()
      .toLowerCase();
  }
  applyNonpostreceiptvouchers(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.FinfolData.Nonpostreceiptvouchers.filter = filterValue
      .trim()
      .toLowerCase();
  }
  applyNonpostbonds(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.FinfolData.Nonpostbonds.filter = filterValue.trim().toLowerCase();
  }
  //#endregion
  //--------------------------------------------------------------------------------------------------
  //------------------------------------------Financial Flow-Up--------------------------------------
  //#region
  @ViewChild('paginatorprojects') paginatorprojects: MatPaginator;
  @ViewChild('paginatorProjectRevenuesAndExpenses')
  paginatorProjectRevenuesAndExpenses: MatPaginator;
  @ViewChild('paginatorSupervisor') paginatorSupervisor: MatPaginator;
  // @ViewChild('paginatorPurchaseinvoices') paginatorPurchaseinvoices: MatPaginator;
  @ViewChild('paginatortasksPerProjects')
  paginatortasksPerProjects: MatPaginator;
  @ViewChild('paginatoremployeeTasks') paginatoremployeeTasks: MatPaginator;

  ProjectsData: any = {
    projects: new MatTableDataSource(),
    ProjectRevenuesAndExpenses: new MatTableDataSource(),
    Supervisor: new MatTableDataSource(),
    // Purchaseinvoices:new MatTableDataSource(),
    tasksPerProjects: new MatTableDataSource(),
    employeeTasks: new MatTableDataSource(),
  };

  FilterLoadDataProjects: any = {
    CustomerId: null,
    UserId: null,
    PhaseId: null,
    ProjectId: null,
    DepartmentId: null,
    TaskStatus: null,

    loadCustomer: [],
    loadProjects: [],
    loadUserId: [],
    loadTaskPhaseId: [],
    loadDepartmentId: [],
    loadTaskStatus: [],

    GetProjectsInProgressCount: 0,
    GetProjectsNaturalCount: 0,
    GetProjectsStoppedVMCount: 0,
    GetProjectsWithoutContractVMVMCount: 0,
    getLateProjectsVMCount: 0,
    GetProjectsWithProSettingVMCount: 0,
    GetProjectsWithoutProSettingVMCount: 0,
    GetProjectsSupervisionVMVMCount: 0,
    GetdestinationsUploadVMCount: 0,
  };

  GetProjectVMCount() {
    this._projectService.GetProjectVM().subscribe((data) => {
      this.FilterLoadDataProjects.GetProjectsInProgressCount =
        data.getProjectsInProgressCount;
      this.FilterLoadDataProjects.GetProjectsNaturalCount =
        data.getProjectsNaturalCount;
      this.FilterLoadDataProjects.GetProjectsStoppedVMCount =
        data.getProjectsStoppedVMCount;
      this.FilterLoadDataProjects.GetProjectsWithoutContractVMVMCount =
        data.getProjectsWithoutContractVMVMCount;
      this.FilterLoadDataProjects.GetLateProjectsVMCount =
        data.getLateProjectsVMCount;
      this.FilterLoadDataProjects.GetProjectsWithProSettingVMCount =
        data.getProjectsWithProSettingVMCount;
      this.FilterLoadDataProjects.GetProjectsWithoutProSettingVMCount =
        data.getProjectsWithoutProSettingVMCount;
      this.FilterLoadDataProjects.GetProjectsSupervisionVMVMCount =
        data.getProjectsSupervisionVMVMCount;
      this.FilterLoadDataProjects.GetdestinationsUploadVMCount =
        data.getdestinationsUploadVMCount;
    });
  }

  resetFilterLoadProjects(event: any) {
    this.FilterLoadDataProjects.CustomerId = null;
    this.FilterLoadDataProjects.UserId = null;
    this.FilterLoadDataProjects.PhaseId = null;
    this.FilterLoadDataProjects.ProjectId = null;
    this.FilterLoadDataProjects.DepartmentId = null;
    this.FilterLoadDataProjects.TaskStatus = null;
    var TabType = event.index + 1;
    if (TabType == 1) this.GetProjects();
    else if (TabType == 2) this.RefreshProjectRevenuesAndExpenses_paging(1, 10);
    //this.getProjectRevenuesAndExpenses();
    else if (TabType == 3)
      this.RefreshSupervisor_paging(1, 10); // this.getSupervisor();
    //else if(TabType==4) this.getSupervisor();
    else if (TabType == 5)
      this.RefreshtasksPerProjects_paging(1, 10); // this.gettasksPerProjects();
    else if (TabType == 6) this.RefreshemployeeTasks_paging(1, 10); // this.getemployeeTasks();
  }
  public _projectVM: ProjectVM;
  GetProjects() {
    var cust = this.FilterLoadDataProjects.CustomerId ?? 0;
    var userid = this.FilterLoadDataProjects.UserId ?? 0;
    this._proreportsService
      .GetUserProjectsReportS(userid, cust, '', '')
      .subscribe((data) => {
        this.ProjectsData.projects = new MatTableDataSource(data);
        this.ProjectsData.projects.paginator = this.paginatorprojects;
      });
  }

  getProjectRevenuesAndExpenses() {
    this._followprojectService
      .GetAllProjectsWithCostE_CostS()
      .subscribe((data) => {
        this.ProjectsData.ProjectRevenuesAndExpenses = new MatTableDataSource(
          data
        );
        this.ProjectsData.ProjectRevenuesAndExpenses.paginator =
          this.paginatorProjectRevenuesAndExpenses;
      });
  }
  RefreshProjectRevenuesAndExpenses() {
    this._projectVM = new ProjectVM();
    this._projectVM.customerId = this.FilterLoadDataProjects.CustomerId;
    this._projectVM.mangerId = this.FilterLoadDataProjects.UserId;
    this._projectVM.status = 0;
    var obj = this._projectVM;
    this._followprojectService.GetProjectsSearch(obj).subscribe((data) => {
      this.ProjectsData.ProjectRevenuesAndExpenses = new MatTableDataSource(
        data
      );
      this.ProjectsData.ProjectRevenuesAndExpenses.paginator =
        this.paginatorProjectRevenuesAndExpenses;
    });
  }
  GetPercProfit(Obj: any) {
    var valCostE =
      +parseFloat(Obj.costE_W).toFixed(2) +
      +parseFloat(Obj.costE_Depit_W).toFixed(2) -
      +parseFloat(Obj.costE_Credit_W).toFixed(2);
    valCostE = +parseFloat(valCostE.toString()).toFixed(2);

    var valCostS =
      +parseFloat(Obj.costS_W).toFixed(2) +
      +parseFloat(Obj.oper_expeValue).toFixed(2);
    valCostS = +parseFloat(valCostS.toString()).toFixed(2);

    var valDiff = valCostE - valCostS; //ايرادات - مصروفات
    var Res = 0;
    if (Obj.contractValue != 0) {
      Res = (valDiff / Obj.contractValue) * 100;
    } else {
      Res = 0;
    }
    return parseFloat(Res.toString()).toFixed(2);
  }
  GetNet(Obj: any) {
    var valCostE =
      +parseFloat(Obj.costE_W).toFixed(2) +
      +parseFloat(Obj.costE_Depit_W).toFixed(2) -
      +parseFloat(Obj.costE_Credit_W).toFixed(2);
    valCostE = +parseFloat(valCostE.toString()).toFixed(2);

    var valCostS =
      +parseFloat(Obj.costS_W).toFixed(2) +
      +parseFloat(Obj.oper_expeValue).toFixed(2);
    valCostS = +parseFloat(valCostS.toString()).toFixed(2);

    var valDiff = valCostE - valCostS; //ايرادات - مصروفات
    return parseFloat(valDiff.toString()).toFixed(2);
  }
  GetvalCostE(Obj: any) {
    var valCostE =
      +parseFloat(Obj.costE_W).toFixed(2) +
      +parseFloat(Obj.costE_Depit_W).toFixed(2) -
      +parseFloat(Obj.costE_Credit_W).toFixed(2);
    valCostE = +parseFloat(valCostE.toString()).toFixed(2);
    return parseFloat(valCostE.toString()).toFixed(2);
  }
  GetvalCostS(Obj: any) {
    var valCostS =
      +parseFloat(Obj.costS_W).toFixed(2) +
      +parseFloat(Obj.oper_expeValue).toFixed(2);
    valCostS = +parseFloat(valCostS.toString()).toFixed(2);
    return parseFloat(valCostS.toString()).toFixed(2);
  }

  getemployeeTasks() {
    this._proreportsService
      .GetAllProjectPhasesTasksW_whithworkorder()
      .subscribe((data) => {
        this.ProjectsData.employeeTasks = new MatTableDataSource(data);
        this.ProjectsData.employeeTasks.paginator = this.paginatoremployeeTasks;
      });
  }

  RefreshemployeeTasks() {
    if (
      this.FilterLoadDataProjects.TaskStatus == 0 ||
      this.FilterLoadDataProjects.TaskStatus == null
    ) {
      this.getData_SemployeeTasks();
    } else if (this.FilterLoadDataProjects.TaskStatus == 8) {
      this.getData_SLateemployeeTasks();
    } else {
      this.getData_WithStatusemployeeTasks();
    }
  }

  getData_SemployeeTasks() {
    var userid = this.FilterLoadDataProjects.UserId ?? 0;
    var status = this.FilterLoadDataProjects.TaskStatus ?? 0;
    var from = this.data.filter.DateFrom_P ?? '';
    var to = this.data.filter.DateTo_P ?? '';

    this._proreportsService
      .GetAllProjectPhasesTasksS_whithworkorder(userid, status, from, to)
      .subscribe((data) => {
        this.ProjectsData.employeeTasks = new MatTableDataSource(data);
        this.ProjectsData.employeeTasks.paginator = this.paginatoremployeeTasks;
      });
  }
  getData_SLateemployeeTasks() {
    var userid = this.FilterLoadDataProjects.UserId ?? 0;
    var status = this.FilterLoadDataProjects.TaskStatus ?? 0;
    var from = '';
    var to = '';

    this._proreportsService
      .GetAllLateProjectPhasesByuser_rpt(userid, status, from, to)
      .subscribe((data) => {
        this.ProjectsData.employeeTasks = new MatTableDataSource(data);
        this.ProjectsData.employeeTasks.paginator = this.paginatoremployeeTasks;
      });
  }
  getData_WithStatusemployeeTasks() {
    var userid = this.FilterLoadDataProjects.UserId ?? 0;
    var status = this.FilterLoadDataProjects.TaskStatus ?? 0;
    var from = '';
    var to = '';
    this._proreportsService
      .GetAllProjectPhasesTasksbystatus_WithworkOrder(userid, status, from, to)
      .subscribe((data) => {
        this.ProjectsData.employeeTasks = new MatTableDataSource(data);
        this.ProjectsData.employeeTasks.paginator = this.paginatoremployeeTasks;
      });
  }

  PercentFn(obj: any) {
    if (Object.keys(obj).length === 0) return '';
    var count = obj.taskExecPercentage_Count;
    if (count == 0) {
      return '0 %';
    } else {
      var Percent = parseInt(
        (
          ((obj.taskExecPercentage_Sum + parseInt(obj.workOrder_Sum)) /
            ((obj.taskExecPercentage_Count + obj.workOrder_Count) * 100)) *
          100
        ).toString()
      );
    }
    return Percent + ' %';
  }

  //--------------------------------------
  gettasksPerProjects() {
    this._proreportsService
      .GetAllTasksByProjectIdW_whithWotkOrder()
      .subscribe((data) => {
        this.ProjectsData.tasksPerProjects = new MatTableDataSource(data);
        this.ProjectsData.tasksPerProjects.paginator =
          this.paginatortasksPerProjects;
      });
  }
  RefreshtasksPerProjects() {
    var projectid = this.FilterLoadDataProjects.ProjectId ?? 0;
    var departmentId = this.FilterLoadDataProjects.DepartmentId ?? 0;
    this._proreportsService
      .GetAllTasksByProjectIdS_withworkorder(projectid, departmentId, '', '')
      .subscribe((data) => {
        this.ProjectsData.tasksPerProjects = new MatTableDataSource(data);
        this.ProjectsData.tasksPerProjects.paginator =
          this.paginatortasksPerProjects;
      });
  }
  mergeS(Obj: any) {
    if (Object.keys(Obj).length === 0) return '';

    var TaskTimeTo_Merge = '';
    if (Obj.taskTimeFrom == '' || Obj.taskTimeFrom == null) {
      TaskTimeTo_Merge = Obj.taskStart;
    } else {
      TaskTimeTo_Merge = JSON.stringify(
        Obj.taskStart + ' - ' + Obj.taskTimeFrom
      );
    }
    return TaskTimeTo_Merge;
  }
  mergeE(Obj: any) {
    if (Object.keys(Obj).length === 0) return '';

    var TaskTimeTo_Merge = '';
    if (Obj.taskTimeTo == '' || Obj.taskTimeTo == null) {
      TaskTimeTo_Merge = Obj.endDateCalc;
    } else {
      TaskTimeTo_Merge = JSON.stringify(
        Obj.endDateCalc + ' - ' + Obj.taskTimeTo
      );
    }
    return TaskTimeTo_Merge;
  }




  //--------------------------------------
  getSupervisor() {
    this._supervisionsService.GetAllSupervisions(null).subscribe((data) => {
      this.ProjectsData.Supervisor = new MatTableDataSource(data);
      this.ProjectsData.Supervisor.paginator = this.paginatorSupervisor;
    });
  }
  RefreshSupervisor() {
    var empid = this.FilterLoadDataProjects.UserId;
    var phaseId = this.FilterLoadDataProjects.PhaseId;

    this._supervisionsService
      .GetAllBySupervisionSearch(null, null, empid, phaseId, null, null)
      .subscribe((data) => {
        this.ProjectsData.Supervisor = new MatTableDataSource(data);
        this.ProjectsData.Supervisor.paginator = this.paginatorSupervisor;
      });
  }
  //--------------------------------------
  InitProjectsData() {
    this.FilterLoadDataProjects.loadTaskStatus = [
      { id: 1, name: { ar: 'نقدي', en: 'Monetary' } },
      { id: 8, name: { ar: 'آجل', en: 'Postpaid' } },
      {
        id: 17,
        name: { ar: 'نقدا نقاط بيع - مدى-ATM', en: 'Cash points of sale ATM' },
      },
      { id: 9, name: { ar: 'شبكة', en: 'Network' } },
      { id: 6, name: { ar: 'حوالة', en: 'Transfer' } },
    ];
    this.GetProjectVMCount();

    if (this.userG?.userPrivileges.includes(151117)) {
      // this.GetProjects();
      this.GetUserProjectsReportS_paging(1, 10);
    }
    if (this.userG?.userPrivileges.includes(151118)) {
      // this.getProjectRevenuesAndExpenses();
      this.RefreshProjectRevenuesAndExpenses_paging(1, 10);
    }
    if (this.userG?.userPrivileges.includes(151119)) {
      // this.getSupervisor();
      this.RefreshSupervisor_paging(1, 10);
    }
    if (this.userG?.userPrivileges.includes(151121)) {
      // this.gettasksPerProjects();
      this.RefreshtasksPerProjects_paging(1, 10);
    }
    if (this.userG?.userPrivileges.includes(151122)) {
      //this.getemployeeTasks();
      this.RefreshemployeeTasks_paging(1, 10);
    }
  }

  FillUsersSelect() {
    this._proreportsService.FillAllUsersSelectAll().subscribe((data) => {
      this.FilterLoadDataProjects.loadUserId = data;
    });
  }
  FillDepartmentSelect() {
    this._phasestaskService.FillDepartmentSelect().subscribe((data) => {
      this.FilterLoadDataProjects.loadDepartmentId = data;
    });
  }
  FillSuperPhasesSelect() {
    this._supervisionsService.FillSuperPhasesSelect().subscribe((data) => {
      this.FilterLoadDataProjects.loadTaskPhaseId = data;
    });
  }
  applyprojects(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ProjectsData.projects.filter = filterValue.trim().toLowerCase();
  }
  applyProjectRevenuesAndExpenses(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ProjectsData.ProjectRevenuesAndExpenses.filter = filterValue
      .trim()
      .toLowerCase();
  }
  applySupervisor(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ProjectsData.Supervisor.filter = filterValue.trim().toLowerCase();
  }
  // applyPurchaseinvoices(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.FinfolData.Purchaseinvoices.filter = filterValue.trim().toLowerCase();
  // }
  applytasksPerProjects(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ProjectsData.tasksPerProjects.filter = filterValue
      .trim()
      .toLowerCase();
  }
  applyemployeeTasks(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ProjectsData.employeeTasks.filter = filterValue.trim().toLowerCase();
  }
  taskmodal: any;
  setpopup(modal: any) {
    this.taskmodal = modal;
  }

  //#endregion
  //--------------------------------------------------------------------------------------------------

  /////////////////////////////////////////////////ALERT//////////////////////////////////////////
  dataalert: any = {
    alerts: new MatTableDataSource([{}]),
  };
  dataSourceTemp: any = [];
  AlertTodelete: any;
  load_Users: any;
  Fill_Depart: any;

  name = null;
  description = null;
  userId = null;
  DepartmentId = null;
  allusers = null;
  done = null;
  currentuser: any = {};

  public NotificationObj: Notification;
  displayedColumns: string[] = [
    'Name',
    'Date',
    'SendUserName',
    'Description',
    'operations',
  ];
  originalList: NotificationVM[] = [];
  selectedColumnList: any[] = [];
  filteredList: any[] = [];
  getALERTData() {
    this._alertservice.GetUserAlert().subscribe({
      next: (data: any) => {
        // assign data to table

        // console\.log(data.result)
        this.dataalert.alerts = new MatTableDataSource(data.result);
        this.dataSourceTemp = data.result;
        this.originalList = data.result;
        this.filteredList = this.originalList.filter(
          (item) => item.isRead === false
        );
        this.selectedColumnList = this.filteredList.map(
          (item) => item.notificationId
        );

        this.dataalert.alerts.paginator = this.paginator;
        this.dataalert.alerts.sort = this.sort;
        this.ReadAllAlert();
      },
      error: (error) => {
        // console\.log(error);
      },
    });
  }

  getRow(row: any) {
    this.AlertTodelete = row;
    // console\.log("row to delete" + row);
  }

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    const tempsource = this.dataSourceTemp.filter(function (d: any) {
      return (
        d.description?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.name?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.sendUserName?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.date?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    this.dataalert.alerts = new MatTableDataSource(tempsource);
    this.dataalert.alerts.paginator = this.paginator;
    this.dataalert.alerts.sort = this.sort;
  }

  DeleteAlert() {
    this._alertservice
      .HideAlert(this.AlertTodelete.notificationId)
      .subscribe((result: any) => {
        // console\.log(result);
        // console\.log("result");
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.getALERTData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  ReadAllAlert() {
    this._alertservice
      .ReadNotificationList(this.selectedColumnList)
      .subscribe((result: any) => {
        // console\.log(result);
        // console\.log("result");
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  fill_Department() {
    this._alertservice.FillDepartmentSelect().subscribe((data) => {
      // console\.log(data);
      this.Fill_Depart = data;
    });
  }
  departments: any;
  fill_Departments() {
    this._alertservice.FillDepartmentSelect().subscribe((data) => {
      // console\.log(data);
      this.departments = data;
    });
  }
  /////////////////////////////////////////////////
  taskfileexists: false;
  TaskFilesCount: any;
  TaskFiles: any;
  showfile() {}
  GetProjectRequirementByTaskId_Count(TaskID: any) {
    this._homesernice
      .GetProjectRequirementByTaskId_Count(TaskID)
      .subscribe((data) => {
        // console\.log('filescount',data);
        this.TaskFilesCount = parseInt(data);
      });
  }

  GetAllProjectRequirementByTaskId(taskdata: any) {
    this._homesernice
      .GetAllProjectRequirementByTaskId(taskdata.phaseTaskId)
      .subscribe((data) => {
        // console\.log('filescount',data);
        this.TaskFiles = data;
      });
  }

  orderfileexists: false;
  OrderFilesCount: any;
  OrderFiles: any;

  GetProjectRequirementByOrderId_Count(OrderId: any) {
    this._homesernice
      .GetProjectRequirementByOrderId_Count(OrderId)
      .subscribe((data) => {
        // console\.log('Ofilescount',data);
        this.OrderFilesCount = parseInt(data);
      });
  }

  GetAllProjectRequirementByOrderId(orderdata: any) {
    this._homesernice
      .GetAllProjectRequirementByOrderId(orderdata.workOrderId)
      .subscribe((data) => {
        // console\.log('order files',data);
        this.OrderFiles = data;
      });
  }
  //-----Employee Managment----------------------------------------------------------------------------
  //#region
  @ViewChild('paginatorResidentAboutToExpire')
  paginatorResidentAboutToExpire: MatPaginator;
  @ViewChild('paginatorResidentExpired') paginatorResidentExpired: MatPaginator;
  @ViewChild('paginatorOfficialDocAboutToExpire')
  paginatorOfficialDocAboutToExpire: MatPaginator;
  @ViewChild('paginatorOfficialDocExpired')
  paginatorOfficialDocExpired: MatPaginator;
  @ViewChild('paginatorContractAboutToExpired')
  paginatorContractAboutToExpired: MatPaginator;
  @ViewChild('paginatorContractExpired') paginatorContractExpired: MatPaginator;
  @ViewChild('paginatorEmployeeWithoutContract')
  paginatorEmployeeWithoutContract: MatPaginator;

  EmpManagement: any = {
    ResidentAboutToExpire: new MatTableDataSource(),
    ResidentExpired: new MatTableDataSource(),
    OfficialDocAboutToExpire: new MatTableDataSource(),
    OfficialDocExpired: new MatTableDataSource(),
    ContractAboutToExpired: new MatTableDataSource(),
    ContractExpired: new MatTableDataSource(),
    EmployeeWithoutContract: new MatTableDataSource(),
  };
  ResDencesAbouutToExpireDepartment: any;
  ResidentExpiredDepartment: any;
  OfficialDocAboutToExpireDepartment: any;
  OfficialDocExpiredDepartment: any;
  ContractAboutToExpiredDepartment: any;
  ContractExpiredDepartment: any;
  EmployeeswithoutcontractDepartment: any;
  ResidentAboutToExpirert: any;

  GetResDencesAbouutToExpire() {
    this._homesernice
      .GetResDencesAbouutToExpire(
        this.ResDencesAbouutToExpireDepartment ?? 0,
        this.ResidentAboutToExpirert ?? false
      )
      .subscribe((data) => {
        this.EmpManagement.ResidentAboutToExpire = new MatTableDataSource(data);
        this.EmpManagement.ResidentAboutToExpire.paginator =
          this.paginatorResidentAboutToExpire;
      });
  }

  ResidentAboutToExpiresearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.EmpManagement.ResidentAboutToExpire.filter = filterValue
      .trim()
      .toLowerCase();
  }
  sortResDencesAbouutToExpire() {
    let sortedItems = this.EmpManagement.ResidentAboutToExpire.sort(
      (a: any, b: any) => {
        // Sort by date in descending order
        return b.contractEndDate.getTime() - a.contractEndDate.getTime();
      }
    );
  }

  GetResDencesExpired() {
    this._homesernice
      .GetResDencesExpired(this.ResidentExpiredDepartment ?? 0)
      .subscribe((data) => {
        this.EmpManagement.ResidentExpired = new MatTableDataSource(
          data.result
        );
        this.EmpManagement.ResidentExpired.paginator =
          this.paginatorResidentExpired;
      });
  }
  ResidentExpiredsearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.EmpManagement.ResidentExpired.filter = filterValue
      .trim()
      .toLowerCase();
  }
  OfficialDocAboutToExpiresort: any;
  GetOfficialDocsAboutToExpire() {
    this._homesernice
      .GetOfficialDocsAboutToExpire(
        this.OfficialDocAboutToExpireDepartment ?? 0,
        this.OfficialDocAboutToExpiresort ?? false
      )
      .subscribe((data) => {
        this.EmpManagement.OfficialDocAboutToExpire = new MatTableDataSource(
          data
        );
        this.EmpManagement.OfficialDocAboutToExpire.paginator =
          this.paginatorOfficialDocAboutToExpire;
      });
  }

  OfficialDocAboutToExpiresearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.EmpManagement.OfficialDocAboutToExpire.filter = filterValue
      .trim()
      .toLowerCase();
  }
  GetOfficialDocsExpired() {
    this._homesernice
      .GetOfficialDocsExpired(this.OfficialDocExpiredDepartment ?? 0)
      .subscribe((data) => {
        this.EmpManagement.OfficialDocExpired = new MatTableDataSource(
          data.result
        );
        this.EmpManagement.OfficialDocExpired.paginator =
          this.paginatorOfficialDocExpired;
      });
  }
  OfficialDocExpiredsearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.EmpManagement.OfficialDocExpired.filter = filterValue
      .trim()
      .toLowerCase();
  }
  ContractAboutToExpiredsort: any;
  GetEmpContractsAboutToExpire() {
    this._homesernice
      .GetEmpContractsAboutToExpire(
        this.ContractAboutToExpiredDepartment ?? 0,
        this.ContractAboutToExpiredsort ?? false
      )
      .subscribe((data) => {
        this.EmpManagement.ContractAboutToExpired = new MatTableDataSource(
          data
        );
        this.EmpManagement.ContractAboutToExpired.paginator =
          this.paginatorContractAboutToExpired;
      });
  }
  ContractAboutToExpiredrt: any;
  ContractAboutToExpiredsearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.EmpManagement.ContractAboutToExpired.filter = filterValue
      .trim()
      .toLowerCase();
  }
  GetEmpContractsExpired() {
    this._homesernice
      .GetEmpContractsExpired(this.ContractExpiredDepartment ?? 0)
      .subscribe((data) => {
        this.EmpManagement.ContractExpired = new MatTableDataSource(data);
        this.EmpManagement.ContractExpired.paginator =
          this.paginatorContractExpired;
      });
  }
  ContractExpiredsearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.EmpManagement.ContractExpired.filter = filterValue
      .trim()
      .toLowerCase();
  }

  GetEmployeesWithoutContract() {
    this._homesernice
      .GetEmployeesWithoutContract(this.EmployeeswithoutcontractDepartment ?? 0)
      .subscribe((data) => {
        this.EmpManagement.EmployeeWithoutContract = new MatTableDataSource(
          data.result
        );
        this.EmpManagement.EmployeeWithoutContract.paginator =
          this.paginatorEmployeeWithoutContract;
      });
  }
  EmployeeWithoutContractsearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.EmpManagement.EmployeeWithoutContract.filter = filterValue
      .trim()
      .toLowerCase();
  }
  //#endregion
  selectedDatemangementemp: any = 1;
  reportabsnteefrom: any;
  reportabsenteeto: any;
  absenteebranchid: any;
  absenteeempid: any;
  EmployeeSearch: any;
  BranchSearch: any;
  CheckDateabsentee(event: any) {
    if (event != null) {
      var from = this._sharedService.date_TO_String(event[0]);
      var to = this._sharedService.date_TO_String(event[1]);
      //this.RefreshData_ByDate(from,to);
      this.reportabsnteefrom = from;
      this.reportabsenteeto = to;
    } else {
      this.data.filter.DateFrom_P = '';
      this.data.filter.DateTo_P = '';
      //this.RefreshData();
    }
  }

  getemployeereports() {
    this.getabsentee();
    this.GetLateEmployee();
    this.GetNotLogin();
    this.getattendence();
  }

  absenteecount = 0;
  getabsentee() {
    var StartDate = new Date();
    var EndDate = new Date();

    if (this.selectedDatemangementemp == 1) {
      this.reportabsnteefrom = this._sharedService.date_TO_String(StartDate);
      this.reportabsenteeto = this._sharedService.date_TO_String(EndDate);
    } else if (this.selectedDatemangementemp == 2) {
      StartDate = this.addDays(EndDate, -7);
      this.reportabsnteefrom = this._sharedService.date_TO_String(StartDate);
      this.reportabsenteeto = this._sharedService.date_TO_String(EndDate);
    } else if (this.selectedDatemangementemp == 3) {
      StartDate = this.addDays(EndDate, -30);
      this.reportabsnteefrom = this._sharedService.date_TO_String(StartDate);
      this.reportabsenteeto = this._sharedService.date_TO_String(EndDate);
    }

    if (this.absenteeempid != null) {
      this.absenteeempid = this.absenteeempid;
    } else {
      this.absenteeempid = '0';
    }

    if (this.absenteebranchid != null) {
      this.absenteebranchid = this.absenteebranchid;
    } else {
      this.absenteebranchid = '0';
    }

    this._report
      .GetAbsenceDataDGV(
        this.reportabsnteefrom,
        this.reportabsenteeto,
        this.absenteeempid,
        this.absenteebranchid
      )
      .subscribe({
        next: (data: any) => {
          // assign data to table

          this.data.absence = data;
          this.absenteecount = data.length;
          // this.carsMovement = new MatTableDataSource(data.result);
          // this.dataSource = new MatTableDataSource(this.carsMovement.filteredData);
          // this.dataSource.paginator = this.paginator;
        },
        error: (error) => {},
      });
  }

  FillEmployeeSearch() {
    this._report.FillEmployeeSearch().subscribe((data) => {
      this.EmployeeSearch = data;
    });
  }
  FillBranchSearch() {
    this._report.FillBranchSearch().subscribe((data) => {
      this.BranchSearch = data;
    });
  }
  getDayName(data: any) {
    //var days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    let days = [
      'السبت',
      'اﻷحد',
      'اﻷثنين',
      'الثلاثاء',
      'اﻷربعاء',
      'الخميس',
      'الجمعة',
    ];
    return days[data - 1];
  }

  datalate: any;
  datalatecount = 0;
  GetLateEmployee() {
    var StartDate = new Date();
    var EndDate = new Date();

    if (this.selectedDatemangementemp == 1) {
      this.reportabsnteefrom = this._sharedService.date_TO_String(StartDate);
      this.reportabsenteeto = this._sharedService.date_TO_String(EndDate);
    } else if (this.selectedDatemangementemp == 2) {
      StartDate = this.addDays(EndDate, -7);
      this.reportabsnteefrom = this._sharedService.date_TO_String(StartDate);
      this.reportabsenteeto = this._sharedService.date_TO_String(EndDate);
    } else if (this.selectedDatemangementemp == 3) {
      StartDate = this.addDays(EndDate, -30);
      this.reportabsnteefrom = this._sharedService.date_TO_String(StartDate);
      this.reportabsenteeto = this._sharedService.date_TO_String(EndDate);
    }

    this._report
      .GetLateDataDGV(
        this.reportabsnteefrom,
        this.reportabsenteeto,
        '0',
        '0',
        '0'
      )
      .subscribe({
        next: (data: any) => {
          // assign data to table

          this.datalate = data.result;
          this.datalatecount = data.result.length;

          // this.carsMovement = new MatTableDataSource(data.result);
          // this.dataSource = new MatTableDataSource(this.carsMovement.filteredData);
          // this.dataSource.paginator = this.paginator;
        },
        error: (error) => {},
      });
  }

  ///////////////////////////////////attendence///////////////////////////////////////////
  attendencecount = 0;
  getattendence() {
    this._AttendenceVM = new AttendenceVM();
    var StartDate = new Date();
    var EndDate = new Date();

    if (this.selectedDatemangementemp == 1) {
      this.reportabsnteefrom = this._sharedService.date_TO_String(StartDate);
      this.reportabsenteeto = this._sharedService.date_TO_String(EndDate);
    } else if (this.selectedDatemangementemp == 2) {
      StartDate = this.addDays(EndDate, -7);
      this.reportabsnteefrom = this._sharedService.date_TO_String(StartDate);
      this.reportabsenteeto = this._sharedService.date_TO_String(EndDate);
    } else if (this.selectedDatemangementemp == 3) {
      StartDate = this.addDays(EndDate, -30);
      this.reportabsnteefrom = this._sharedService.date_TO_String(StartDate);
      this.reportabsenteeto = this._sharedService.date_TO_String(EndDate);
    }
    this._AttendenceVM.empId = 0;
    this._AttendenceVM.branchId = 0;
    this._AttendenceVM.startDate = this.reportabsnteefrom;
    this._AttendenceVM.endDate = this.reportabsenteeto;
    this._report.EmpAttendenceSearch(this._AttendenceVM).subscribe({
      next: (data: any) => {
        this.attendencecount = data.result.length;
        // assign data to table
      },
      error: (error) => {},
    });
  }

  NotlogoutCount = 0;
  GetNotLogin() {
    var StartDate = new Date();
    var EndDate = new Date();

    if (this.selectedDatemangementemp == 1) {
      this.reportabsnteefrom = this._sharedService.date_TO_String(StartDate);
      this.reportabsenteeto = this._sharedService.date_TO_String(EndDate);
    } else if (this.selectedDatemangementemp == 2) {
      StartDate = this.addDays(EndDate, -7);
      this.reportabsnteefrom = this._sharedService.date_TO_String(StartDate);
      this.reportabsenteeto = this._sharedService.date_TO_String(EndDate);
    } else if (this.selectedDatemangementemp == 3) {
      StartDate = this.addDays(EndDate, -30);
      this.reportabsnteefrom = this._sharedService.date_TO_String(StartDate);
      this.reportabsenteeto = this._sharedService.date_TO_String(EndDate);
    }
    this._report
      .GetNotLoggedOutDataDGV(
        this.reportabsnteefrom,
        this.reportabsenteeto,
        '0'
      )
      .subscribe({
        next: (data: any) => {
          // assign data to table

          this.NotlogoutCount = data.result.length;
        },
        error: (error) => {},
      });
  }

  acceptreason: any;

  CheckLoan(modal: any) {
    this._homesernice
      .CheckLoan(
        this.vacationidupdated.vacationId,
        this.vacationtypeselected,
        this.acceptreason
      )
      .subscribe({
        next: (result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            modal.dismiss();
            this.getwaitingvacation();
          } else {
            if (this.vacationtypeselected == 2) {
              modal.dismiss();
              this.modalService.open(this.confirmModal, {
                size: 'md',
                centered: true,
              });
            } else {
              this.toast.error(
                this.translate.instant(result.reasonPhrase),
                this.translate.instant('Message')
              );
            }
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
          // assign data to table
        },
        error: (error) => {},
      });
  }

  updatevacation(modal: any) {
    this._homesernice
      .UpdateVacation(
        this.vacationidupdated.vacationId,
        this.vacationtypeselected,
        this.acceptreason
      )
      .subscribe({
        next: (result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            modal.dismiss();
            this.getwaitingvacation();
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            modal.dismiss();
          }
        },
        error: (error) => {},
      });
  }

  loanreason: any;
  UpdateStatus(modal: any) {
    this._homesernice
      .UpdateStatus(
        this.loanupdate.loanId,
        this.loanselectedtype,
        this.loanreason
      )
      .subscribe({
        next: (result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            modal.dismiss();
            this.getwaitingImprests();
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            modal.dismiss();
          }
        },
        error: (error) => {},
      });
  }

  //----------------------------------------------Print---------------------------------------

  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }
  RowInvoiceData: any;
  InvPrintData: any = null;
  CustomData: any = {
    AccualValue: null,
    Diff: null,
    Total: null,
    netVal: null,
    DiscPer: '0',
    TotalAfterDisc: null,
    Account1Img: null,
    Account2Img: null,
    Account1Bank: null,
    Account2Bank: null,
    OrgImg: null,
    PrintType: null,
    PrintTypeName: null,
    headerurl: null,
    footerurl: null,
    ContractNo: null,
  };
  resetCustomData() {
    this.InvPrintData = null;
    this.CustomData = {
      AccualValue: null,
      Diff: null,
      Total: null,
      netVal: null,
      Disc: null,
      DiscPer: '0',
      TotalAfterDisc: null,
      Account1Img: null,
      Account2Img: null,
      Account1Bank: null,
      Account2Bank: null,
      OrgImg: null,
      PrintType: null,
      PrintTypeName: null,
      headerurl: null,
      footerurl: null,
      ContractNo: null,
    };
  }
  GetInvoicePrint(obj: any, TempCheck: any) {
    this.resetCustomData();
    this._printreportsService
      .ChangeInvoice_PDF(obj.invoiceId, TempCheck)
      .subscribe((data) => {
        this.InvPrintData = data;
        this.InvPrintData.voucherDetailsVM_VD.forEach((element: any) => {
          element.servicesPricesOffer.sort(
            (a: { lineNumber: number }, b: { lineNumber: number }) =>
              (a.lineNumber ?? 0) - (b.lineNumber ?? 0)
          ); // b - a for reverse sort
        });
        if (
          this.InvPrintData?.invoicesVM_VD?.contractNo == null ||
          this.InvPrintData?.invoicesVM_VD?.contractNo == ''
        ) {
          this.CustomData.ContractNo = 'بدون';
        } else {
          this.CustomData.ContractNo =
            this.InvPrintData?.invoicesVM_VD?.contractNo;
        }
        this.CustomData.PrintType = TempCheck;
        if (TempCheck == 29) this.CustomData.PrintTypeName = 'اشعار دائن';
        else if (TempCheck == 30) this.CustomData.PrintTypeName = 'اشعار مدين';
        else this.CustomData.PrintType = '';

        var TotalInvWithoutDisc = 0;
        var netVal = 0;
        var DiscountValue_Det_Total_withqty = 0;
        if (this.InvPrintData?.voucherDetailsVM_VD[0]?.taxType == 3) {
          netVal = this.InvPrintData?.invoicesVM_VD?.totalValue;
          TotalInvWithoutDisc = this.InvPrintData?.invoicesVM_VD?.totalValue;
        } else {
          netVal = this.InvPrintData?.invoicesVM_VD?.invoiceValue;
          TotalInvWithoutDisc = this.InvPrintData?.invoicesVM_VD?.invoiceValue;
        }
        this.InvPrintData?.voucherDetailsVM_VD?.forEach((element: any) => {
          DiscountValue_Det_Total_withqty =
            DiscountValue_Det_Total_withqty + element.discountValue_Det ?? 0;
        });

        this.CustomData.DiscPer = parseFloat(
          (
            (DiscountValue_Det_Total_withqty * 100) /
            (TotalInvWithoutDisc + DiscountValue_Det_Total_withqty)
          ).toString()
        ).toFixed(2);
        this.CustomData.Disc = DiscountValue_Det_Total_withqty;
        this.CustomData.Total =
          TotalInvWithoutDisc + DiscountValue_Det_Total_withqty;
        this.CustomData.netVal = netVal;
        this.CustomData.TotalAfterDisc = TotalInvWithoutDisc;

        if (this.InvPrintData?.invoicesVM_VD.printBankAccount != true) {
          this.CustomData.Account1Bank =
            this.InvPrintData?.orgIsRequired_VD == true
              ? this.InvPrintData?.org_VD.accountBank
              : this.InvPrintData?.branch_VD.accountBank;
          this.CustomData.Account2Bank =
            this.InvPrintData?.orgIsRequired_VD == true
              ? this.InvPrintData?.org_VD.accountBank2
              : this.InvPrintData?.branch_VD.accountBank2;
          this.CustomData.Account1Img =
            this.InvPrintData?.orgIsRequired_VD == true
              ? this.InvPrintData?.org_VD.bankIdImgURL
              : this.InvPrintData?.branch_VD.bankIdImgURL;
          this.CustomData.Account2Img =
            this.InvPrintData?.orgIsRequired_VD == true
              ? this.InvPrintData?.org_VD.bankId2ImgURL
              : this.InvPrintData?.branch_VD.bankId2ImgURL;
        } else {
          this.CustomData.Account1Bank = null;
          this.CustomData.Account2Bank = null;
          this.CustomData.Account1Img = null;
          this.CustomData.Account2Img = null;
        }
        if (this.CustomData.Account1Img)
          this.CustomData.Account1Img =
            environment.PhotoURL + this.CustomData.Account1Img;
        else this.CustomData.Account1Img = null;

        if (this.CustomData.Account2Img)
          this.CustomData.Account2Img =
            environment.PhotoURL + this.CustomData.Account2Img;
        else this.CustomData.Account2Img = null;
        if (
          this.InvPrintData?.branch_VD.isPrintInvoice == true &&
          this.InvPrintData?.branch_VD.branchLogoUrl != '' &&
          this.InvPrintData?.branch_VD.branchLogoUrl != null
        ) {
          this.CustomData.OrgImg =
            environment.PhotoURL + this.InvPrintData?.branch_VD.branchLogoUrl;
        } else {
          if (this.InvPrintData?.org_VD.logoUrl)
            this.CustomData.OrgImg =
              environment.PhotoURL + this.InvPrintData?.org_VD.logoUrl;
          else this.CustomData.OrgImg = null;
        }
        if (
          this.InvPrintData?.branch_VD.headerPrintInvoice == true &&
          this.InvPrintData?.branch_VD.headerLogoUrl != '' &&
          this.InvPrintData?.branch_VD.headerLogoUrl != null
        ) {
          this.CustomData.headerurl =
            environment.PhotoURL + this.InvPrintData?.branch_VD.headerLogoUrl;
        } else {
          this.CustomData.headerurl = null;
        }

        if (
          this.InvPrintData?.branch_VD.headerPrintInvoice == true &&
          this.InvPrintData?.branch_VD.footerLogoUrl != '' &&
          this.InvPrintData?.branch_VD.footerLogoUrl != null
        ) {
          this.CustomData.footerurl =
            environment.PhotoURL + this.InvPrintData?.branch_VD.footerLogoUrl;
        } else {
          this.CustomData.footerurl = null;
        }
      });
  }

  GetInvoicePurchasePrint(obj: any, TempCheck: any) {
    this.resetCustomData();
    this._printreportsService
      .ChangePurchase_PDF(obj.invoiceId, TempCheck)
      .subscribe((data) => {
        this.InvPrintData = data;
        this.CustomData.PrintType = TempCheck;
        if (TempCheck == 29) this.CustomData.PrintTypeName = 'اشعار دائن';
        else if (TempCheck == 30) this.CustomData.PrintTypeName = 'اشعار مدين';
        else this.CustomData.PrintType = '';

        var TotalInvWithoutDisc = 0;
        var netVal = 0;
        var DiscountValue_Det_Total_withqty = 0;
        if (this.InvPrintData?.voucherDetailsVM_VD[0]?.taxType == 3) {
          netVal = this.InvPrintData?.invoicesVM_VD?.totalValue;
          TotalInvWithoutDisc = this.InvPrintData?.invoicesVM_VD?.totalValue;
        } else {
          netVal = this.InvPrintData?.invoicesVM_VD?.invoiceValue;
          TotalInvWithoutDisc = this.InvPrintData?.invoicesVM_VD?.invoiceValue;
        }
        this.InvPrintData?.voucherDetailsVM_VD?.forEach((element: any) => {
          DiscountValue_Det_Total_withqty =
            DiscountValue_Det_Total_withqty + element.discountValue_Det ?? 0;
        });

        this.CustomData.DiscPer = parseFloat(
          (
            (DiscountValue_Det_Total_withqty * 100) /
            (TotalInvWithoutDisc + DiscountValue_Det_Total_withqty)
          ).toString()
        ).toFixed(2);
        this.CustomData.Disc = DiscountValue_Det_Total_withqty;
        this.CustomData.Total =
          TotalInvWithoutDisc + DiscountValue_Det_Total_withqty;
        this.CustomData.netVal = netVal;
        this.CustomData.TotalAfterDisc = TotalInvWithoutDisc;

        if (this.InvPrintData?.invoicesVM_VD.printBankAccount != true) {
          this.CustomData.Account1Bank =
            this.InvPrintData?.orgIsRequired_VD == true
              ? this.InvPrintData?.org_VD.accountBank
              : this.InvPrintData?.branch_VD.accountBank;
          this.CustomData.Account2Bank =
            this.InvPrintData?.orgIsRequired_VD == true
              ? this.InvPrintData?.org_VD.accountBank2
              : this.InvPrintData?.branch_VD.accountBank2;
          this.CustomData.Account1Img =
            this.InvPrintData?.orgIsRequired_VD == true
              ? this.InvPrintData?.org_VD.bankIdImgURL
              : this.InvPrintData?.branch_VD.bankIdImgURL;
          this.CustomData.Account2Img =
            this.InvPrintData?.orgIsRequired_VD == true
              ? this.InvPrintData?.org_VD.bankId2ImgURL
              : this.InvPrintData?.branch_VD.bankId2ImgURL;
        } else {
          this.CustomData.Account1Bank = null;
          this.CustomData.Account2Bank = null;
          this.CustomData.Account1Img = null;
          this.CustomData.Account2Img = null;
        }
        if (this.CustomData.Account1Img)
          this.CustomData.Account1Img =
            environment.PhotoURL + this.CustomData.Account1Img;
        else this.CustomData.Account1Img = null;

        if (this.CustomData.Account2Img)
          this.CustomData.Account2Img =
            environment.PhotoURL + this.CustomData.Account2Img;
        else this.CustomData.Account2Img = null;
        if (
          this.InvPrintData?.branch_VD.isPrintInvoice == true &&
          this.InvPrintData?.branch_VD.branchLogoUrl != '' &&
          this.InvPrintData?.branch_VD.branchLogoUrl != null
        ) {
          this.CustomData.OrgImg =
            environment.PhotoURL + this.InvPrintData?.branch_VD.branchLogoUrl;
        } else {
          if (this.InvPrintData?.org_VD.logoUrl)
            this.CustomData.OrgImg =
              environment.PhotoURL + this.InvPrintData?.org_VD.logoUrl;
          else this.CustomData.OrgImg = null;
        }
        if (
          this.InvPrintData?.branch_VD.headerPrintInvoice == true &&
          this.InvPrintData?.branch_VD.headerLogoUrl != '' &&
          this.InvPrintData?.branch_VD.headerLogoUrl != null
        ) {
          this.CustomData.headerurl =
            environment.PhotoURL + this.InvPrintData?.branch_VD.headerLogoUrl;
        } else {
          this.CustomData.headerurl = null;
        }

        if (
          this.InvPrintData?.branch_VD.headerPrintInvoice == true &&
          this.InvPrintData?.branch_VD.footerLogoUrl != '' &&
          this.InvPrintData?.branch_VD.footerLogoUrl != null
        ) {
          this.CustomData.footerurl =
            environment.PhotoURL + this.InvPrintData?.branch_VD.footerLogoUrl;
        } else {
          this.CustomData.footerurl = null;
        }
      });
  }
  @ViewChild('conditionimg')
  set watch(img: ElementRef) {
    if (img) {
      //this.printDiv("divHtml_a");
    }
  }

  GetAccualValue(item: any) {
    var AccualValue = 0;
    if (item.taxType == 3) {
      AccualValue =
        ((item.totalAmount ?? 0) + (item.discountValue_Det ?? 0)) /
        (item.qty ?? 1);
    } else {
      AccualValue =
        ((item.amount ?? 0) + (item.discountValue_Det ?? 0)) / (item.qty ?? 1);
    }
    return AccualValue;
  }
  GetDiff(item: any) {
    var Diff = '0';
    Diff = parseFloat((item?.totalAmount - item?.taxAmount).toString()).toFixed(
      2
    );
    return Diff;
  }

  PrintVoucher(obj: any) {
    this._printreportsService
      .PrintVoucher(obj.invoiceId, 4)
      .subscribe((data) => {
        var PDFPath = environment.PhotoURL + data.reasonPhrase;
        printJS({ printable: PDFPath, type: 'pdf', showModal: true });
      });
  }
  PrintJournal() {
    this._printreportsService
      .PrintJournalsVyInvId(this.RowInvoiceData.invoiceId)
      .subscribe((data) => {
        var PDFPath = environment.PhotoURL + data.reasonPhrase;
        printJS({ printable: PDFPath, type: 'pdf', showModal: true });
      });
  }
  EntryVoucherPrintData: any = null;
  CustomDataCR: any;
  CustomDataNoteInvoice: any;
  CustomDatatoInvoice: any;
  @ViewChild('printDivModalRC') printDivModalRC: any;
  GetReport(obj: any) {
    this._printreportsService.GetReport(obj.invoiceId).subscribe((data) => {
      this.EntryVoucherPrintData = data;
      if (
        this.EntryVoucherPrintData.voucherVM[0].toInvoiceId == '' ||
        this.EntryVoucherPrintData.voucherVM[0].toInvoiceId == null
      ) {
        this.CustomDataNoteInvoice = 'لا يوجد رقم فاتورة لسند القبض';
        this.CustomDatatoInvoice = 'بدون';
      } else {
        this.CustomDataNoteInvoice = null;
        this.CustomDatatoInvoice =
          this.EntryVoucherPrintData.voucherVM[0].toInvoiceId;
      }
      if (this.EntryVoucherPrintData?.org_VD.logoUrl)
        this.CustomDataCR =
          environment.PhotoURL + this.EntryVoucherPrintData?.org_VD.logoUrl;
      else this.CustomDataCR = null;

      this.open(this.printDivModalRC);
    });
  }
  CustomDataR: any;
  @ViewChild('printDivModalR') printDivModalR: any;
  GetReportR(obj: any) {
    this._printreportsService.GetReport(obj.invoiceId).subscribe((data) => {
      this.EntryVoucherPrintData = data;
      if (this.EntryVoucherPrintData?.org_VD.logoUrl)
        this.CustomDataR =
          environment.PhotoURL + this.EntryVoucherPrintData?.org_VD.logoUrl;
      else this.CustomDataR = null;

      this.open(this.printDivModalR);
    });
  }

  PayTypeList = [
    { id: 1, name: 'monetary' },
    { id: 17, name: 'Cash account points of sale - Mada-ATM' },
    { id: 2, name: 'Check' },
    { id: 6, name: 'transfer' },
    { id: 9, name: 'Network/transfer' },
  ];
  getpayType(id: any) {
    var PrintJournalsByPayTypeName = '';
    this.PayTypeList.forEach((element: any) => {
      if (element.id == id) {
        PrintJournalsByPayTypeName = element.name;
      }
    });
    return this.translate.instant(PrintJournalsByPayTypeName);
  }
  /////////////////////////////////////////////////////////////////////////////////
  datePrintabcence: any = this.datePipe.transform(new Date(), 'YYYY-MM-dd');

  logourl: any;
  GetOrganizationData() {
    this._sharedService.GetOrganizationData().subscribe((data) => {
      this.logourl = environment.PhotoURL + data.logoUrl;
    });
  }
  Printabsence() {
    this.printDiv('reportabsemce');
  }

  printdashboard(type: any, Departmentid: any) {
    this._printreportsService
      .GetEmployeeDashboardReport(type, Departmentid ?? 0)
      .subscribe((result) => {
        if (result.statusCode == 200) {
          var link = environment.PhotoURL + result.reasonPhrase;
          window.open(link, '_blank');
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  ///////////////////////////////// Reports Tab Print //////////////////////////////////////
  printDoneTasks() {
    this.printDiv('DoneTasksDGV');
  }
  printEmpDoneWOsDGV() {
    this.printDiv('EmpDoneWOsDGV');
  }
  printInProgressProjectPhasesTasksHome_Search() {
    this.printDiv('InProgressProjectPhasesTasksHome_Search');
  }
  printEmpUnderGoingWOsDGV() {
    this.printDiv('EmpUnderGoingWOsDGV');
  }
  printLateTasksByUserIdHome_Search() {
    this.printDiv('LateTasksByUserIdHome_Search');
  }

  ////////////////////////////////////////////////Vacation and Loan Print////////////////////////
  /////////vacation
  printmodel: any = {
    employeeName: null,
    employeeJob: null,
    employeeNo: null,
    nationalitiId: null,
    branchName: null,
    vacatuinType: null,
    timestr: null,
    status: null,
    acceptedUser: null,
    vacationReason: null,
    from: null,
    to: null,
    date: null,
    isDiscount: null,
    acceptedDate: null,
  };
  refreshprintdata() {
    this.printmodel.employeeName = null;
    this.printmodel.employeeJob = null;
    this.printmodel.employeeNo = null;
    this.printmodel.nationalitiId = null;
    this.printmodel.branchName = null;

    this.printmodel.vacationReason = null;
    this.printmodel.vacatuinType = null;
    this.printmodel.timestr = null;
    this.printmodel.status = null;
    this.printmodel.acceptedUser = null;

    this.printmodel.from = null;
    this.printmodel.to = null;
    this.printmodel.date = null;
    this.printmodel.isDiscount = null;
    this.printmodel.acceptedDate = null;
  }
  setdatatoprint(data: any) {
    this.refreshprintdata();
    this.printmodel.employeeName = data.employeeName;
    this.printmodel.employeeJob = data.employeeJob;
    this.printmodel.employeeNo = data.employeeNo;
    this.printmodel.nationalitiId = data.identityNo;
    this.printmodel.branchName = data.branchName;

    this.printmodel.vacationReason = data.vacationReason;
    this.printmodel.vacatuinType = data.vacationTypeName;
    this.printmodel.timestr = data.timeStr;
    this.printmodel.status = data.vacationStatusName;
    this.printmodel.acceptedUser = data.acceptUser;

    this.printmodel.from = data.startDate;
    this.printmodel.to = data.endDate;
    this.printmodel.date = data.date;
    this.printmodel.isDiscount = data.isDiscount;
    this.printmodel.acceptedDate = data.acceptedDate;
  }
  PrintVacation() {
    const timeoutDuration = 5000;

    setTimeout(() => {
      // Code to be executed after the timeout
      this.printDiv('reportholiday');
    }, timeoutDuration);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////

  printmodelloan: any = {
    employeeName: null,
    employeeJob: null,
    employeeNo: null,
    nationalitiId: null,
    branchName: null,
    acceptUser: null,

    acceptedDate: null,
    departmentName: null,
    date: null,
    amount: null,
    monthNo: null,
    startDate: null,
    note: null,
    loanStatusName: null,
  };
  refreshprintdataloan() {
    this.printmodelloan.employeeName = null;
    this.printmodelloan.employeeJob = null;
    this.printmodelloan.employeeNo = null;
    this.printmodelloan.nationalitiId = null;
    this.printmodelloan.branchName = null;
    this.printmodelloan.departmentName = null;

    this.printmodelloan.date = null;
    this.printmodelloan.amount = null;
    this.printmodelloan.monthNo = null;
    this.printmodelloan.startDate = null;
    this.printmodelloan.loanStatusName = null;
    this.printmodelloan.note = null;

    this.printmodelloan.acceptedDate = null;

    this.printmodelloan.acceptUser = null;
  }
  setdataprint(data: any) {
    this.refreshprintdataloan();

    this.printmodelloan.employeeName = data.employeeName;
    this.printmodelloan.employeeJob = data.employeeJob;
    this.printmodelloan.employeeNo = data.employeeNo;
    this.printmodelloan.nationalitiId = data.identityNo;
    this.printmodelloan.branchName = data.branchName;
    this.printmodelloan.departmentName = data.departmentName;

    this.printmodelloan.date = data.date;
    this.printmodelloan.amount = data.amount;
    this.printmodelloan.monthNo = data.monthNo;
    this.printmodelloan.startDate = data.startDate;
    this.printmodelloan.loanStatusName = data.loanStatusName;
    this.printmodelloan.note = data.note;

    this.printmodelloan.acceptedDate = data.acceptedDate;

    this.printmodelloan.acceptUser = data.acceptUser;
  }
  Printloan() {
    const timeoutDuration = 5000;

    setTimeout(() => {
      // Code to be executed after the timeout
      this.printDiv('reportloan');
    }, timeoutDuration);
  }
  ///////////////////////////////////////////////////////////////////////

  SupervisionPrintBase: any = null;
  CustomDataPrintBase: any = {
    OrgImg: null,
  };
  resetCustomDataContract() {
    this.SupervisionPrintBase = null;
    this.CustomDataPrintBase = {
      OrgImg: null,
    };
  }
  PrintSupervisionBase(obj: any) {
    this._supervisionsService
      .PrintSupervisionMail(obj.supervisionId)
      .subscribe((data) => {
        this.SupervisionPrintBase = data;
        if (this.SupervisionPrintBase?.org_VD.logoUrl)
          this.CustomDataPrintBase.OrgImg =
            environment.PhotoURL + this.SupervisionPrintBase?.org_VD.logoUrl;
        else this.CustomDataPrintBase.OrgImg = null;
      });
  }

  GetStatusName(item: any) {
    if (item.isRead == 1) {
      return 'تم الأستلام';
    } else if (item.isRead == 1) {
      return 'غير متوفر';
    } else {
      return 'لم يتم الاستلام';
    }
  }

  SupervisionPrintData: any = null;
  CustomDataSupervision: any = {
    OrgImg: null,
    BaladyImg: null,
    hammerCourt: null,
    HeadImageUrl: null,
    HeadImageUrl2: null,
    stampUrl: null,
  };
  SupervisionReport(obj: any) {
    this._supervisionsService
      .ChangeSupervision(obj.supervisionId, obj.superCode)
      .subscribe((data) => {
        this.SupervisionPrintData = data;
        this.CustomDataSupervision.BaladyImg = '/assets/images/logo_Balady.png';
        this.CustomDataSupervision.hammerCourt =
          '/assets/images/hammerCourt.png';

        if (
          this.SupervisionPrintData.supervision.length > 0 &&
          this.SupervisionPrintData?.supervision[0].headImageUrl
        )
          this.CustomDataSupervision.HeadImageUrl =
            environment.PhotoURL +
            this.SupervisionPrintData?.supervision[0].headImageUrl;
        else this.CustomDataSupervision.HeadImageUrl = null;

        if (
          this.SupervisionPrintData.supervision.length > 0 &&
          this.SupervisionPrintData?.supervision[0].headImageUrl2
        )
          this.CustomDataSupervision.HeadImageUrl2 =
            environment.PhotoURL +
            this.SupervisionPrintData?.supervision[0].headImageUrl2;
        else this.CustomDataSupervision.HeadImageUrl2 = null;

        if (this.SupervisionPrintData?.stampUrl)
          this.CustomDataSupervision.stampUrl =
            environment.PhotoURL + '/' + this.SupervisionPrintData?.stampUrl;
        else this.CustomDataSupervision.stampUrl = null;

        if (this.SupervisionPrintData?.org_VD.logoUrl)
          this.CustomDataSupervision.OrgImg =
            environment.PhotoURL + this.SupervisionPrintData?.org_VD.logoUrl;
        else this.CustomDataSupervision.OrgImg = null;
      });
  }

  counter(i: number) {
    return new Array(i);
  }

  checknot() {
    const action = this._sharedService.getAction();
    if (action === 'clickButton') {
      setTimeout(() => {
        this.modalService.open(this.notifications, {
          size: 'xl',
          centered: true,
        });
      }, 3000);
      this._sharedService.setAction('');
    }
  }

  checknot2() {
    const action = this._sharedService.getAction();
    if (action === 'clickButton2') {
      setTimeout(() => {
        this.modalService.open(this.notifications, {
          size: 'xl',
          centered: true,
        });
      }, 3000);
      this._sharedService.setAction('');
    }
  }

  gettasklatecolor(data: any) {
    var x = data.remaining;
    if (data.remaining != null) {
      if (data.remaining <= 0) {
        // متأخرة "أحمر"
        return 'text-danger';
      } else if (
        data.remaining > 0 &&
        data.remaining < this.CalcultateRest70(data)
      ) {
        // فاضل 70% من مدة المهمة --> "برتقالي"
        return 'text-warning';
      }
    }

    if (data.stopProjectType == 1) {
      return 'text-muted';
    }

    return '';
  }

  CalcultateRest70(task: any) {
    let rest = 0;
    if (task.timeType == 1) {
      //hour
      rest = (task.timeMinutes * 60 * 70) / 100;
    } else {
      rest = (task.timeMinutes * 24 * 60 * 70) / 100;
    }
    return rest;
  }

  ////////////////////////////////////////

  totalpagedprojects: any;
  projectsearchtext: any = '';
  GetUserProjectsReportS_paging(page: any, size: any) {
    var cust = this.FilterLoadDataProjects.CustomerId ?? 0;
    var userid = this.FilterLoadDataProjects.UserId ?? 0;
    this._proreportsService
      .GetUserProjectsReportS_paging(
        userid,
        cust,
        '',
        '',
        page,
        size,
        this.projectsearchtext
      )
      .subscribe((data) => {
        debugger;
        this.ProjectsData.projects = new MatTableDataSource(data.items);
        // this.ProjectsData.projects.paginator = this.paginatorprojects;
        this.totalpagedprojects = data.metaData.totalCount;
        // this.ProjectsData.projects = new MatTableDataSource(
        //   data.slice(page * size, (page + 1) * size)
        // );
      });
  }
  onPageChange_ProjectUser(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.GetUserProjectsReportS_paging(this.pageNumber2 + 1, 10);
  }

  ///////////////////////////////region Tasks ///////////////////////////////
  totalCostTasks: any;
  CostTaskssearchtext: any = '';
  GetInProgressProjectPhasesTasks_Branches_paging(page: any, size: any) {
    this._homesernice
      .GetInProgressProjectPhasesTasks_Branches_paging(
        this.coststaskcustomerfilterid ?? 0,
        this.CostTaskssearchtext,
        page,
        size
      )
      .subscribe((data) => {
        // console\.log(data);
        // this.CostTasksData = data;
        this.rows.CostTasks = new MatTableDataSource(data.items);
        this.totalCostTasks = data.metaData.totalCount;
        //this.rows.CostTasks.paginator = this.tasksPaginator2;
      });
  }

  onPageChange_CostTasks(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.GetInProgressProjectPhasesTasks_Branches_paging(
      this.pageNumber2 + 1,
      event.pageSize
    );
  }
  ///////////////////////////////////////////////Work Order ////////////////////
  totalWorkOrders: any;
  WorkOrderssearchtext: any = '';
  GetAllWorkOrders_paging(page: any, size: any) {
    this._homesernice
      .GetAllWorkOrders_Paging(
        this.OrderCustomerFilterid ?? 0,
        this.WorkOrderssearchtext,
        page,
        size
      )
      .subscribe((data) => {
        // console\.log(data);
        this.WorkOrersData = data;
        this.rows.WorkOrders = new MatTableDataSource(data.items);
        this.totalWorkOrders = data.metaData.totalCount;
        // this.rows.WorkOrders.paginator = this.tasksPaginator2;
      });
  }

  onPageChange_WorkOrders(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.GetAllWorkOrders_paging(this.pageNumber2 + 1, event.pageSize);
  }

  ////////////////////////////Projects /////////////////////////////////
  searchtextproject: any = '';
  totalcountprojects: any;
  getDataPaging(page: any, size: any) {
    this._projectvm = new ProjectVM();
    this._projectvm.customerId = this.customerfilterid;
    this._projectvm.status = 0;
    this._homesernice
      .GetAllProjectsNew_DashBoard_Paging(
        this._projectvm,
        this.searchtextproject,
        page,
        size
      )
      .subscribe({
        next: (data: any) => {
          this.projectsdata = data;
          this.rows.projects = new MatTableDataSource(data.items);
          // this.rows.projects.paginator = this.ProjectPaginator;
          this.rows.projects2 = new MatTableDataSource(data.items);
          // this.rows.projects2.paginator = this.ProjectPaginator2;
          this.totalcountprojects = data.metaData.totalCount;
        },
        error: (error) => {},
      });
  }

  onPageChange_projects(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.getDataPaging(this.pageNumber2 + 1, event.pageSize);
  }
  ///////////////////////////// New Tasks /////////////////////////////////
  searchtextNewTasks: any = '';
  totalcountNewTasks: any;
  GetNewTasksByUserId_paging(Enddate: any, page: any, pageSize: any) {
    this._homesernice
      .GetNewTasksByUserId2_Paging(
        this.NewTasksProjectid ?? 0,
        this.NewTasksCustomerId ?? 0,
        this.searchtextNewTasks,
        page,
        pageSize
      )
      .subscribe((data) => {
        this.NewTasks = new MatTableDataSource(data.items);
        // this.NewTasks.paginator = this.NewtasksPaginator;
        this.NewTasksCountByUserId = data.metaData.totalCount;
        //this.NewTasksCountByUserId = data.result.length;
        //this.NewTasks=data.result;
      });
  }
  onPageChange_NewTasks(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.GetNewTasksByUserId_paging(null, this.pageNumber2 + 1, event.pageSize);
  }

  ///////////////////////////////////Late Tasks /////////////////////////////////////
  searchtextLateTasks: any = '';
  GetLateTasksByUserIdHome_paging(Enddate: any, page: any, pageSize: any) {
    this._homesernice
      .GetLateTasksByUserIdHomeFilterd_paging(
        this.LateTasksProjectid ?? 0,
        this.LateTasksCustomerId ?? 0,
        this.searchtextLateTasks,
        page,
        pageSize
      )
      .subscribe((data) => {
        // console\.log('late tasks',data.result);
        this.LateTasks = new MatTableDataSource(data.items);
        // this.LateTasks.paginator = this.LateTaskPaginator;
        this.LateTasksCountByUserId = data.metaData.totalCount;
        ///this.LateTasksCountByUserId = data.result.length;

        //this.LateTasks=data.result;
      });
  }
  onPageChange_LateTasks(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.GetLateTasksByUserIdHome_paging(
      null,
      this.pageNumber2 + 1,
      event.pageSize
    );
  }

  //////////////////////////////////////New Work Order ////////////////////////
  searchtextNewWorkorder: any = '';
  GetNewWorkOrdersByUserId_paging(Enddate: any, page: any, pageSize: any) {
    this._homesernice
      .GetNewWorkOrdersByUserIdFilterd_paging(
        Enddate ?? '',
        this.NewWorkOrdersCustomerId ?? 0,
        this.NewWorkOrdersProjectid ?? 0,
        this.searchtextNewWorkorder,
        page,
        pageSize
      )
      .subscribe((data) => {
        console.log(data.result);
        this.NewWorkorder = new MatTableDataSource(data.items);
        // this.NewWorkorder.paginator = this.NewWorkOrderPaginator;
        // this.NewWorkOrdersCountByUserId = data.result.length;
        this.NewWorkOrdersCountByUserId = data.metaData.totalCount;

        //this.NewWorkorder=data.result;
      });
  }

  onPageChange_NewWorkorder(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.GetLateTasksByUserIdHome_paging(
      null,
      this.pageNumber2 + 1,
      event.pageSize
    );
  }
  ///////////////////////////////////////////////// Late Work Order ////////////////////////////////
  searchtextLateWorkorder: any = '';
  GetLateWorkOrdersByUserId_paging(Enddate: any, page: any, pageSize: any) {
    this._homesernice
      .GetLateWorkOrdersByUserIdFilterd_paging(
        Enddate ?? '',
        this.LateWorkOrdersCustomerId ?? 0,
        this.LateWorkOrdersProjectid ?? 0,
        this.searchtextLateWorkorder,
        page,
        pageSize
      )
      .subscribe((data) => {
        console.log(data.result);
        //this.LateWorkorder=data.result;
        this.LateWorkorder = new MatTableDataSource(data.items);
        // this.LateWorkorder.paginator = this.LateWorkOrderPaginator;
        // this.UserLateWorkOrderCount = data.result.length;
        this.UserLateWorkOrderCount = data.metaData.totalCount;
      });
  }

  onPageChange_LateWorkorder(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.GetLateWorkOrdersByUserId_paging(
      null,
      this.pageNumber2 + 1,
      event.pageSize
    );
  }
  /////////////////////////////////////  Project revenue ///////////////////////////////
  searchtextProjectRevenuesAndExpenses: any = '';
  totalcountProjectRevenuesAndExpenses: any;
  RefreshProjectRevenuesAndExpenses_paging(page: any, pageSize: any) {
    this._projectVM = new ProjectVM();
    this._projectVM.customerId = this.FilterLoadDataProjects.CustomerId;
    this._projectVM.mangerId = this.FilterLoadDataProjects.UserId;
    this._projectVM.status = 0;
    var obj = this._projectVM;
    this._followprojectService
      .GetProjectsSearch_paging(
        obj,
        this.searchtextProjectRevenuesAndExpenses,
        page,
        pageSize
      )
      .subscribe((data) => {
        this.ProjectsData.ProjectRevenuesAndExpenses = new MatTableDataSource(
          data.items
        );
        // this.ProjectsData.ProjectRevenuesAndExpenses.paginator =
        //   this.paginatorProjectRevenuesAndExpenses;
        this.totalcountProjectRevenuesAndExpenses = data.metaData.totalCount;
      });
  }

  onPageChange_ProjectRevenuesAndExpenses(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.RefreshProjectRevenuesAndExpenses_paging(
      this.pageNumber2 + 1,
      event.pageSize
    );
  }
  //////////////////////////////////// Super Vision //////////////////////////////
  searchtextSupervisor: any = '';
  totalcountSupervisor: any;
  RefreshSupervisor_paging(page: any, pageSize: any) {
    var empid = this.FilterLoadDataProjects.UserId;
    var phaseId = this.FilterLoadDataProjects.PhaseId;

    this._supervisionsService
      .GetAllBySupervisionSearch_paging(
        null,
        null,
        empid,
        phaseId,
        null,
        null,
        this.searchtextSupervisor,
        page,
        pageSize
      )
      .subscribe((data) => {
        this.ProjectsData.Supervisor = new MatTableDataSource(data.items);
        // this.ProjectsData.Supervisor.paginator = this.paginatorSupervisor;
        this.totalcountSupervisor = data.metaData.totalCount;
      });
  }

  onPageChange_Supervisor(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.RefreshSupervisor_paging(this.pageNumber2 + 1, event.pageSize);
  }
  /////////////////////////////////Task By Project ///////////////////////////////////
  searchtexttasksPerProjects: any = '';
  totalcounttasksPerProjects: any;
  RefreshtasksPerProjects_paging(page: any, pageSize: any) {
    var projectid = this.FilterLoadDataProjects.ProjectId ?? 0;
    var departmentId = this.FilterLoadDataProjects.DepartmentId ?? 0;
    this._proreportsService
      .GetAllTasksByProjectIdS_withworkorder_paging(
        projectid,
        departmentId,
        '',
        '',
        this.searchtexttasksPerProjects,
        page,
        pageSize
      )
      .subscribe((data) => {
        this.ProjectsData.tasksPerProjects = new MatTableDataSource(data.items);
        // this.ProjectsData.tasksPerProjects.paginator =
        //   this.paginatortasksPerProjects;
        this.totalcounttasksPerProjects = data.metaData.totalCount;
      });
  }

  onPageChange_tasksPerProjects(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.RefreshtasksPerProjects_paging(this.pageNumber2 + 1, event.pageSize);
  }
  //////////////////////////////////////EMployee Tasks ///////////////////////

  RefreshemployeeTasks_paging(page: any, pageSize: any) {
    debugger;
    if (
      this.FilterLoadDataProjects.TaskStatus == 0 ||
      this.FilterLoadDataProjects.TaskStatus == null
    ) {
      this.getData_SemployeeTasks_paging(page, pageSize);
    } else if (this.FilterLoadDataProjects.TaskStatus == 8) {
      this.getData_SLateemployeeTasks_paging(page, pageSize);
    } else {
      this.getData_WithStatusemployeeTasks_paging(page, pageSize);
    }
  }
  searchtextemployeeTasks: any = '';
  totalcountemployeeTasks: any;
  getData_SemployeeTasks_paging(page: any, pageSize: any) {
    var userid = this.FilterLoadDataProjects.UserId ?? 0;
    var status = this.FilterLoadDataProjects.TaskStatus ?? 0;
    var from = this.data.filter.DateFrom_P ?? '';
    var to = this.data.filter.DateTo_P ?? '';

    this._proreportsService
      .GetAllProjectPhasesTasksS_whithworkorder_paging(
        userid,
        status,
        from,
        to,
        this.searchtextemployeeTasks,
        page,
        pageSize
      )
      .subscribe((data) => {
        this.ProjectsData.employeeTasks = new MatTableDataSource(data.items);
        this.totalcountemployeeTasks = data.metaData.totalCount;
        // this.ProjectsData.employeeTasks.paginator = this.paginatoremployeeTasks;
      });
  }

  getData_SLateemployeeTasks_paging(page: any, pageSize: any) {
    var userid = this.FilterLoadDataProjects.UserId ?? 0;
    var status = this.FilterLoadDataProjects.TaskStatus ?? 0;
    var from = '';
    var to = '';

    this._proreportsService
      .GetAllLateProjectPhasesByuser_rpt_paging(
        userid,
        status,
        from,
        to,
        this.searchtextemployeeTasks,
        page,
        pageSize
      )
      .subscribe((data) => {
        this.ProjectsData.employeeTasks = new MatTableDataSource(data.items);
        this.totalcountemployeeTasks = data.metaData.totalCount;

        // this.ProjectsData.employeeTasks.paginator = this.paginatoremployeeTasks;
      });
  }
  getData_WithStatusemployeeTasks_paging(page: any, pageSize: any) {
    var userid = this.FilterLoadDataProjects.UserId ?? 0;
    var status = this.FilterLoadDataProjects.TaskStatus ?? 0;
    var from = '';
    var to = '';
    this._proreportsService
      .GetAllProjectPhasesTasksbystatus_WithworkOrder_paging(
        userid,
        status,
        from,
        to,
        this.searchtextemployeeTasks,
        page,
        pageSize
      )
      .subscribe((data) => {
        this.ProjectsData.employeeTasks = new MatTableDataSource(data.items);
        // this.ProjectsData.employeeTasks.paginator = this.paginatoremployeeTasks;
        this.totalcountemployeeTasks = data.metaData.totalCount;
      });
  }

  onPageChange_temployeeTasks(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.RefreshemployeeTasks_paging(this.pageNumber2 + 1, event.pageSize);
  }
  //////////////////////////////////////Financial region //////////////////////////
  Saleinvoicescount: any = null;
  Unpostedsalesinvoicescount: any = null;
  Billswithoutaprojectcount: any = null;
  Purchaseinvoicescount: any = null;
  Unpostedpurchaseinvoicescount: any = null;
  Nonpostreceiptvoucherscount: any = null;
  Nonpostbondscount: any = null;

  GetFinancialfollowup_paging(TabType: any) {
    const formData: FormData = new FormData();
    if (this.FilterLoadData?.CustomerId) {
      formData.append('CustomerId', this.FilterLoadData?.CustomerId);
    }
    if (this.FilterLoadData?.supplierId) {
      formData.append('SupplierId', this.FilterLoadData?.supplierId);
    }
    if (this.FilterLoadData?.paytypeId) {
      formData.append('PayType', this.FilterLoadData?.paytypeId);
    }

    if (this.FilterLoadData?.page) {
      formData.append('Page', this.FilterLoadData?.page);
    }
    if (this.FilterLoadData?.pagesize) {
      formData.append('PageSize', this.FilterLoadData?.pagesize);
    }
    if (this.FilterLoadData?.searchtext) {
      formData.append('SearchText', this.FilterLoadData?.searchtext);
    }
    var StartDate = new Date();
    var EndDate = new Date();

    if (this.FilterLoadData.selectedDate == 1) {
      formData.append(
        'startdate',
        this._sharedService.date_TO_String(StartDate)
      );
      formData.append('enddate', this._sharedService.date_TO_String(EndDate));
    } else if (this.FilterLoadData.selectedDate == 2) {
      StartDate = new Date(
        StartDate.setDate(StartDate.getDate() - (StartDate.getDay() + 1))
      );
      formData.append(
        'startdate',
        this._sharedService.date_TO_String(StartDate)
      );
      formData.append('enddate', this._sharedService.date_TO_String(EndDate));
    } else if (this.FilterLoadData.selectedDate == 3) {
      var y = StartDate.getFullYear(),
        m = StartDate.getMonth();
      StartDate = new Date(y, m, 1);

      formData.append(
        'startdate',
        this._sharedService.date_TO_String(StartDate)
      );
      formData.append('enddate', this._sharedService.date_TO_String(EndDate));
    }
    formData.append('TabType', TabType);
    this._homesernice
      .GetFinancialfollowup_pageing(formData)
      .subscribe((data) => {
        if (TabType == 1) {
          this.FinfolData.Saleinvoices = new MatTableDataSource(data.items);
          this.Saleinvoicescount = data.metaData.totalCount;

          // this.FinfolData.Saleinvoices.paginator = this.paginatorSaleinvoices;
        } else if (TabType == 2) {
          this.FinfolData.Unpostedsalesinvoices = new MatTableDataSource(
            data.items
          );
          this.Unpostedsalesinvoicescount = data.metaData.totalCount;

          // this.FinfolData.Unpostedsalesinvoices.paginator =
          //   this.paginatorUnpostedsalesinvoices;
        } else if (TabType == 3) {
          this.FinfolData.Billswithoutaproject = new MatTableDataSource(
            data.items
          );
          this.Billswithoutaprojectcount = data.metaData.totalCount;

          // this.FinfolData.Billswithoutaproject.paginator =
          //   this.paginatorBillswithoutaproject;
        } else if (TabType == 4) {
          this.FinfolData.Purchaseinvoices = new MatTableDataSource(data.items);
          this.Purchaseinvoicescount = data.metaData.totalCount;

          // this.FinfolData.Purchaseinvoices.paginator =
          //   this.paginatorPurchaseinvoices;
        } else if (TabType == 5) {
          this.FinfolData.Unpostedpurchaseinvoices = new MatTableDataSource(
            data.items
          );
          this.Unpostedpurchaseinvoicescount = data.metaData.totalCount;

          // this.FinfolData.Unpostedpurchaseinvoices.paginator =
          //   this.paginatorUnpostedpurchaseinvoices;
        } else if (TabType == 6) {
          this.FinfolData.Nonpostreceiptvouchers = new MatTableDataSource(
            data.items
          );
          // this.FinfolData.Nonpostreceiptvouchers.paginator =
          //   this.paginatorNonpostreceiptvouchers;
          this.Nonpostreceiptvoucherscount = data.metaData.totalCount;
        } else if (TabType == 7) {
          this.FinfolData.Nonpostbonds = new MatTableDataSource(data.items);
          this.Nonpostbondscount = data.metaData.totalCount;
          // this.FinfolData.Nonpostbonds.paginator = this.paginatorNonpostbonds;
        }
      });
  }
  onPageChange_Saleinvoices(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.FilterLoadData.page = this.pageNumber2 + 1;
    this.FilterLoadData.pagesize = event.pageSize;
    this.GetFinancialfollowup_paging(1);
  }
  onPageChange_Unpostedsalesinvoices(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.FilterLoadData.page = this.pageNumber2 + 1;
    this.FilterLoadData.pagesize = event.pageSize;
    this.GetFinancialfollowup_paging(2);
  }
  onPageChange_Billswithoutaproject(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.FilterLoadData.page = this.pageNumber2 + 1;
    this.FilterLoadData.pagesize = event.pageSize;
    this.GetFinancialfollowup_paging(3);
  }
  onPageChange_Purchaseinvoices(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.FilterLoadData.page = this.pageNumber2 + 1;
    this.FilterLoadData.pagesize = event.pageSize;
    this.GetFinancialfollowup_paging(4);
  }
  onPageChange_Unpostedpurchaseinvoices(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.FilterLoadData.page = this.pageNumber2 + 1;
    this.FilterLoadData.pagesize = event.pageSize;
    this.GetFinancialfollowup_paging(5);
  }
  onPageChange_Nonpostreceiptvouchers(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.FilterLoadData.page = this.pageNumber2 + 1;
    this.FilterLoadData.pagesize = event.pageSize;
    this.GetFinancialfollowup_paging(6);
  }
  onPageChange_Nonpostbonds(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.FilterLoadData.page = this.pageNumber2 + 1;
    this.FilterLoadData.pagesize = event.pageSize;
    this.GetFinancialfollowup_paging(7);
  }
  /////////////////////////////////////////Employee Management////////////////////////////////////////////////////
  searchtextResidentAboutToExpire: any = '';
  totalcountResidentAboutToExpire: any;
  GetResDencesAbouutToExpire_paging(page: any, pagesize: any) {
    this._homesernice
      .GetResDencesAbouutToExpire_paging(
        this.ResDencesAbouutToExpireDepartment ?? 0,
        this.ResidentAboutToExpirert ?? false,
        this.searchtextResidentAboutToExpire,
        page,
        pagesize
      )
      .subscribe((data) => {
        this.EmpManagement.ResidentAboutToExpire = new MatTableDataSource(
          data.items
        );
        // this.EmpManagement.ResidentAboutToExpire.paginator =
        //   this.paginatorResidentAboutToExpire;
        this.totalcountResidentAboutToExpire = data.metaData.totalCount;
      });
  }
  onPageChange_ResidentAboutToExpire(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.GetResDencesAbouutToExpire_paging(
      this.pageNumber2 + 1,
      event.pageSize
    );
  }

  //////////////////////////////////
  searchtextResidentExpired: any = '';
  totalcountResidentExpired: any;
  GetResDencesExpired_paging(page: any, pagesize: any) {
    this._homesernice
      .GetResDencesExpired_paging(
        this.ResidentExpiredDepartment ?? 0,
        this.searchtextResidentExpired,
        page,
        pagesize
      )
      .subscribe((data) => {
        this.EmpManagement.ResidentExpired = new MatTableDataSource(data.items);
        this.totalcountResidentExpired = data.metaData.totalCount;
      });
  }

  onPageChange_ResidentExpired(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.GetResDencesExpired_paging(this.pageNumber2 + 1, event.pageSize);
  }
  /////////////////////////////
  searchtextOfficialDocAboutToExpire: any = '';
  totalcountOfficialDocAboutToExpire: any;
  GetOfficialDocsAboutToExpire_paging(page: any, pagesize: any) {
    this._homesernice
      .GetOfficialDocsAboutToExpire_paging(
        this.OfficialDocAboutToExpireDepartment ?? 0,
        this.OfficialDocAboutToExpiresort ?? false,
        this.searchtextOfficialDocAboutToExpire,
        page,
        pagesize
      )
      .subscribe((data) => {
        this.EmpManagement.OfficialDocAboutToExpire = new MatTableDataSource(
          data.items
        );
        // this.EmpManagement.OfficialDocAboutToExpire.paginator =
        //   this.paginatorOfficialDocAboutToExpire;
        this.totalcountOfficialDocAboutToExpire = data.metaData.totalCount;
      });
  }

  onPageChange_OfficialDocAboutToExpire(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.GetOfficialDocsAboutToExpire_paging(
      this.pageNumber2 + 1,
      event.pageSize
    );
  }
  ///////////////////////
  searchtextOfficialDocExpired: any = '';
  totalcountOOfficialDocExpired: any;
  GetOfficialDocsExpired_paging(page: any, pagesize: any) {
    this._homesernice
      .GetOfficialDocsExpired_paging(
        this.OfficialDocExpiredDepartment ?? 0,
        this.searchtextOfficialDocExpired,
        page,
        pagesize
      )
      .subscribe((data) => {
        this.EmpManagement.OfficialDocExpired = new MatTableDataSource(
          data.items
        );
        this.totalcountOOfficialDocExpired = data.metaData.totalCount;
      });
  }

  onPageChange_OfficialDocExpired(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.GetOfficialDocsExpired_paging(this.pageNumber2 + 1, event.pageSize);
  }
  ///////////////////////////////////////
  searchtextContractAboutToExpired: any = '';
  totalcountContractAboutToExpired: any;
  GetEmpContractsAboutToExpire_paging(page: any, pagesize: any) {
    this._homesernice
      .GetEmpContractsAboutToExpire_paging(
        this.ContractAboutToExpiredDepartment ?? 0,
        this.ContractAboutToExpiredsort ?? false,
        this.searchtextContractAboutToExpired,
        page,
        pagesize
      )
      .subscribe((data) => {
        this.EmpManagement.ContractAboutToExpired = new MatTableDataSource(
          data.items
        );
        // this.EmpManagement.ContractAboutToExpired.paginator =
        //   this.paginatorContractAboutToExpired;
        this.totalcountContractAboutToExpired = data.metaData.totalCount;
      });
  }
  onPageChange_ContractAboutToExpired(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.GetEmpContractsAboutToExpire_paging(
      this.pageNumber2 + 1,
      event.pageSize
    );
  }
  ///////////////////////////////////
  searchtextContractExpired: any = '';
  totalcountContractExpired: any;
  GetEmpContractsExpired_paging(page: any, pagesize: any) {
    this._homesernice
      .GetEmpContractsExpired_paging(
        this.ContractExpiredDepartment ?? 0,
        this.searchtextContractExpired,
        page,
        pagesize
      )
      .subscribe((data) => {
        this.EmpManagement.ContractExpired = new MatTableDataSource(data.items);
        this.totalcountContractExpired = data.metaData.totalCount;
      });
  }

  onPageChange_ContractExpired(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.GetEmpContractsExpired_paging(this.pageNumber2 + 1, event.pageSize);
  }
  //////////////////////////////////////
  searchtextEmployeeWithoutContract: any = '';
  totalcountEmployeeWithoutContract: any;
  GetEmployeesWithoutContract_paging(page: any, pagesize: any) {
    this._homesernice
      .GetEmployeesWithoutContract_paging(
        this.EmployeeswithoutcontractDepartment ?? 0,
        this.searchtextEmployeeWithoutContract,
        page,
        pagesize
      )
      .subscribe((data) => {
        this.EmpManagement.EmployeeWithoutContract = new MatTableDataSource(
          data.items
        );
        this.totalcountEmployeeWithoutContract = data.metaData.totalCount;
      });
  }
  onPageChange_EmployeeWithoutContract(event: any) {
    debugger;
    this.pageNumber2 = event.pageIndex;
    this.GetEmployeesWithoutContract_paging(
      this.pageNumber2 + 1,
      event.pageSize
    );
  }
}
