import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  TemplateRef,
  HostListener,
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
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';
import { NgxPrintElementService } from 'ngx-print-element';
import { RestApiService } from 'src/app/shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { AdoptionManagerService } from 'src/app/core/services/acc_Services/adoption-manager.service';
import { VoucherFilterVM } from 'src/app/core/Classes/ViewModels/voucherFilterVM';
import { TranslateService } from '@ngx-translate/core';
import { Acc_Clauses } from 'src/app/core/Classes/DomainObjects/acc_Clauses';
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OpeningEntrtyService } from 'src/app/core/services/acc_Services/opening-entrty.service';
import { InvoiceService } from 'src/app/core/services/acc_Services/invoice.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { PayVoucherService } from 'src/app/core/services/acc_Services/pay-voucher.service';
import { Invoices } from 'src/app/core/Classes/DomainObjects/invoices';
import { ReceiptService } from 'src/app/core/services/acc_Services/receipt.service';
import { VoucherDetails } from 'src/app/core/Classes/DomainObjects/voucherDetails';
import { Acc_Suppliers } from 'src/app/core/Classes/DomainObjects/acc_Suppliers';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-adoption-of-themanager',
  templateUrl: './adoption-of-themanager.component.html',
  styleUrls: ['./adoption-of-themanager.component.scss'],
  providers: [DatePipe],
})
export class AdoptionOfThemanagerComponent implements OnInit {
  // ##
  projectRequirmentsDisplayedColumns: string[] = [
    'projectType',
    'subProjectType',
    'fileName',
    'cost',
    'operations',
  ];

  projectRequirmentsDataSource = new MatTableDataSource();

  projectRequirments: any;

  modalDetails2: any = {
    id: null,
    projectType: null,
    subProjectType: null,
    fileName: null,
    cost: null,
  };

  // ##

  addInvoice() {}
  editInvoice() {}

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

  get totalDebtor() {
    return this.accountingEntries.reduce(
      (total, entry) => total + entry.debtor,
      0
    );
  }

  get totalCreditor() {
    return this.accountingEntries.reduce(
      (total, entry) => total + entry.creditor,
      0
    );
  }

  showInput: boolean = true;

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
      ar: ' مراجعة واعتماد الرواتب',
      en: 'Review and approval of salaries',
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
    'empName',
    'salaryOfThisMonth',
    'monthlyAllowances',
    'bonus',
    'totalRewards',
    'totalLoans',
    'totalDiscounts',
    'taamen',
    'totalAbsDays',
    'totalVacations',
    'totalSalaryOfThisMonth',
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
  userG: any = {};
  startDate = new Date();
  endDate = new Date();
  constructor(
    private modalService: NgbModal,
    private adoptionManagerService: AdoptionManagerService,

    private invoiceService: InvoiceService,
    private openingEntrtyService: OpeningEntrtyService,
    private toast: ToastrService,
    private receiptService: ReceiptService,
    private api: RestApiService,
    private authenticationService: AuthenticationService,
    private print: NgxPrintElementService,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private _accountsreportsService: AccountsreportsService,
    private _payvoucherservice: PayVoucherService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();
    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
    api.lang.subscribe((res) => {
      this.lang = res;
    });
    this.userG = this.authenticationService.userGlobalObj;
  }

  ngOnInit(): void {
    this.FillBranchSelect();
    this.GetEmployeesForPayroll();
    this.projectsDataSource = new MatTableDataSource();

    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );

    this.projectGoalsDataSource = new MatTableDataSource(this.projectGoals);

    this.projectUsersDataSource = new MatTableDataSource(this.projectUsers);

    this.projectTasksDataSource = new MatTableDataSource(this.projectTasks);
  }
  datafilter: any = {
    enable: false,
    date: null,
    search_CustomerName: null,
    search_projectId: null,
    DateFrom_P: null,
    DateTo_P: null,
    isChecked: false,
    BranchId: null,
    MonthId: null,
  };
  MonthList = [
    { id: 1, name: 'يناير' },
    { id: 2, name: 'فبراير' },
    { id: 3, name: 'مارس' },
    { id: 4, name: 'ابريل' },
    { id: 5, name: 'مايو' },
    { id: 6, name: 'يونيو' },
    { id: 7, name: 'يوليو' },
    { id: 8, name: 'اغسطس' },
    { id: 9, name: 'سبتمبر' },
    { id: 10, name: 'اكتوبر' },
    { id: 11, name: 'نوفمبر' },
    { id: 12, name: 'ديسمبر' },
  ];
  ngAfterViewInit() {
    // this.open(this.smartModal, null, 'smartModal');
  }

  open(content: any, data?: any, type?: any, status?: any, idRow?: any) {
    if (data && type == 'edit') {
      this.modalDetails = data;
      this.modalDetails['id'] = 1;
    }
    if (type == 'postvouchers') {
      this.WhichTypeAddEditView = 1;
      this.EntryVoucherPopup(data);
      this.clickedtype = 1;
    }
    if (data && type == 'decodingPagingModal') {
      this.RowEntryVouvherData = data;
    } else if (data && type == 'deleteModal') {
      this.RowEntryVouvherData = data;
    } else if (idRow != null && type == 'AccountsListModal') {
      this.selectedAccountRowTable = idRow;
      this.FillSubAccountLoadTable();
    } else if (idRow != null && type == 'CostCenterListModal') {
      this.selectedCostCenterRowTable = idRow;
      this.FillCostCenterSelect();
    } else if (type == 'openingDocumentModal') {
      this.WhichTypeAddEditView = 1;
      this.EntryVoucherPopup(data);
      this.clickedtype = 0;
    }

    if (type == 'clause') {
      this.GetAllClauses();
    } else if (type == 'deleteclase') {
      this.clausedeleted = data.clauseId;
    } else if (type == 'postpayvouchers') {
      this.FillCustAccountsSelect2R(1);

      this.CheckDetailsIntial();
      this.clickedtypepay = 1;
      this.GetAllVouchersLastMonth();
      this.FillBankSelect();
      this.FillCostCentersSelect();
      this.FillClausesSelect();
      this.FillCitySelects();
      this.FillSuppliersSelect2();
      this.FillBankSelect();
      this.GetLayoutReadyVm();
      if (this.userG?.userPrivileges.includes(13100307)) {
        this.saveandpost = 1;
      }
      this.GenerateVoucherNumberR();
      this.FillSubAccountLoadR();
      this.GetBranch_CostcenterR();
    } else if (type == 'editvoucher') {
      this.FillCustAccountsSelect2R(1);
      this.CheckDetailsIntial();
      this.clickedtypepay = 0;
      this.vouchermodel.taxtype = 3;
      this.GetAllVouchersLastMonth();
      this.FillBankSelect();
      this.FillCostCentersSelect();
      this.FillClausesSelect();
      this.FillCitySelects();
      this.FillSuppliersSelect2();
      this.FillBankSelect();
      this.GetLayoutReadyVm();
      if (this.userG?.userPrivileges.includes(13100307)) {
        this.saveandpost = 1;
      }
      this.GenerateVoucherNumberR();
      this.FillSubAccountLoadR();
      this.GetBranch_CostcenterR();
    } else if (type == 'EditCheckDetailsModal') {
      if (status == 'newCheckDetails') {
        this.CheckDetailsIntial();
        this.CheckDetailsForm.controls['paymenttypeName'].disable();
        // var PayType = this.ReceiptVoucherForm.controls["paymenttype"].value
        var PayType = this.vouchermodel.payType;

        if (PayType == 2) {
          this.transferNumber = true;
          this.CheckDetailsForm.controls['paymenttypeName'].setValue(
            this.translate.instant('Check')
          );
        } else if (PayType == 6) {
          this.transferNumber = true;
          this.CheckDetailsForm.controls['paymenttypeName'].setValue(
            this.translate.instant('transfer')
          );
        } else if (PayType == 17) {
          this.transferNumber = false;
          this.CheckDetailsForm.controls['paymenttypeName'].setValue(
            this.translate.instant('Cash account points of sale - Mada-ATM')
          );
        }
      } else if (status == 'EditCheckDetails') {
        this.CheckDetailsForm.controls['paymenttypeName'].disable();
        this.CheckDetailsIntial();
        this.CheckDetailsForm.controls['paymenttypeName'].setValue(
          data.checkdetailpaytype
        );
        this.CheckDetailsForm.controls['Check_transferNumber'].setValue(
          data.checkdetailcheckNo
        );
        this.CheckDetailsForm.controls['dateCheck_transfer'].setValue(
          new Date(data.checkdetailcheckDate)
        );
        this.CheckDetailsForm.controls['BankId'].setValue(
          data.checkdetailbankId
        );
      }
    } else if (type == 'supplier') {
      this.GetAllSuppliersR();
    } else if (type == 'deletesupplier') {
      this.supplierdeleted = data.supplierId;
    } else if (type == 'AddModalBanks') {
      this.GetAllBanks();
    } else if (type == 'deleteBank') {
      this.DeletebanksId = data.bankId;
    }
    this.modalService;
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type == 'edit' || type == 'openingDocumentModal' ? 'xl' : 'lg',
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

  BranchList: any;
  FillBranchSelect() {
    this.adoptionManagerService.FillBranchSelect().subscribe((data) => {
      this.BranchList = data;
    });
  }
  projectsDataSourceTemp: any = [];
  DataSource: any = [];

  TSalary = 0;
  TCommunicationAllawance = 0;
  TProfessionAllawance = 0;
  TTransportationAllawance = 0;
  THousingAllowance = 0;
  TMonthlyAllowances = 0;
  TExtraAllowances = 0;
  TTotalLoans = 0;
  TBonus = 0;
  TTotalDiscounts = 0;
  TTotalDayAbs = 0;
  TTotalPaidVacations = 0;
  TTotalRewards = 0;
  TTotalySalaries = 0;
  TTotalTaamen = 0;
  reset() {
    this.TSalary = 0;
    this.TCommunicationAllawance = 0;
    this.TProfessionAllawance = 0;
    this.TTransportationAllawance = 0;
    this.THousingAllowance = 0;
    this.TMonthlyAllowances = 0;
    this.TExtraAllowances = 0;
    this.TTotalLoans = 0;
    this.TBonus = 0;
    this.TTotalDiscounts = 0;
    this.TTotalDayAbs = 0;
    this.TTotalPaidVacations = 0;
    this.TTotalRewards = 0;
    this.TTotalySalaries = 0;
    this.TTotalTaamen = 0;
  }
  allpayrollsforpay: any;
  allpayrolls: any;
  btnpostvouchers: boolean = false;
  btnpostpayvouchers: boolean = false;
  RefreshData() {
    var obj = {
      BranchId: this.datafilter.BranchId,
      MonthNo: this.datafilter.MonthId,
    };
    this.adoptionManagerService.GetEmpPayrollMarchesNew(obj).subscribe(
      (data: any) => {
        this.reset();
        data.forEach((element: any) => {
          this.TSalary += element.salaryOfThisMonth ?? 0;
          this.TCommunicationAllawance += element.communicationAllawance ?? 0;
          this.TProfessionAllawance += element.professionAllawance ?? 0;
          this.TTransportationAllawance += element.transportationAllawance ?? 0;
          this.TMonthlyAllowances += element.monthlyAllowances ?? 0;
          this.TTotalLoans += element.totalLoans ?? 0;
          this.TBonus += element.bonus ?? 0;
          this.TTotalDiscounts += element.totalDiscounts ?? 0;
          this.TTotalTaamen += element.taamen ?? 0;
          this.TTotalDayAbs += element.totalAbsDays ?? 0;
          this.TTotalPaidVacations = element.totalVacations ?? 0;
          this.TTotalRewards += element.totalRewards ?? 0;
          this.TTotalySalaries += element.totalSalaryOfThisMonth ?? 0;
        });

        this.allpayrolls = [];
        this.allpayrollsforpay = [];

        var count1 = 0;
        var count2 = 0;
        var count3 = 0;
        data.forEach((element: any) => {
          if (element.IsPostVoucher != true) {
            count1++;
            this.allpayrolls.push(element.PayrollId);
          } else {
            if (element.IsPostPayVoucher != true) {
              count3++;
              this.allpayrollsforpay.push(element.PayrollId);
            }
          }
          count2++;
        });
        if (count1 == count2) {
          this.btnpostvouchers = false;
        } else {
          if (count3 == count2) {
            this.btnpostpayvouchers = true;
          } else {
            this.btnpostpayvouchers = false;
          }
          this.btnpostvouchers = false;
        }

        this.projectsDataSource = new MatTableDataSource(data);
        this.projectsDataSourceTemp = data;
        this.DataSource = data;
        this.projectsDataSource.paginator = this.paginator;
        this.projectsDataSource.sort = this.sort;
      },
      (err) => {}
    );
  }
  valapplyFilter: any;
  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    this.valapplyFilter = val;
    const tempsource = this.projectsDataSourceTemp.filter(function (d: any) {
      return (
        (d.empName != null
          ? d.empName.toString()?.trim().toLowerCase().indexOf(val) !== -1 ||
            !val
          : '') ||
        (d.salaryOfThisMonth != null
          ? d.salaryOfThisMonth
              .toString()
              ?.trim()
              .toLowerCase()
              .indexOf(val) !== -1 || !val
          : '') ||
        (d.monthlyAllowances != null
          ? d.monthlyAllowances
              .toString()
              ?.trim()
              .toLowerCase()
              .indexOf(val) !== -1 || !val
          : '') ||
        (d.bonus != null
          ? d.bonus.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val
          : '') ||
        (d.totalRewards != null
          ? d.totalRewards.toString()?.trim().toLowerCase().indexOf(val) !==
              -1 || !val
          : '') ||
        (d.totalLoans != null
          ? d.totalLoans.toString()?.trim().toLowerCase().indexOf(val) !== -1 ||
            !val
          : '') ||
        (d.totalDiscounts != null
          ? d.totalDiscounts.toString()?.trim().toLowerCase().indexOf(val) !==
              -1 || !val
          : '') ||
        (d.taamen != null
          ? d.taamen.toString()?.trim().toLowerCase().indexOf(val) !== -1 ||
            !val
          : '') ||
        (d.totalAbsDays != null
          ? d.totalAbsDays.toString()?.trim().toLowerCase().indexOf(val) !==
              -1 || !val
          : '') ||
        (d.totalVacations != null
          ? d.totalVacations.toString()?.trim().toLowerCase().indexOf(val) !==
              -1 || !val
          : '') ||
        (d.totalSalaryOfThisMonth != null
          ? d.totalSalaryOfThisMonth
              .toString()
              ?.trim()
              .toLowerCase()
              .indexOf(val) !== -1 || !val
          : '')
      );
    });

    this.reset();
    tempsource.forEach((element: any) => {
      this.TSalary += element.salaryOfThisMonth;
      this.TCommunicationAllawance += element.communicationAllawance;
      this.TProfessionAllawance += element.professionAllawance;
      this.TTransportationAllawance += element.transportationAllawance;
      this.TMonthlyAllowances += element.monthlyAllowances;
      this.TTotalLoans += element.totalLoans;
      this.TBonus += element.bonus;
      this.TTotalDiscounts += element.totalDiscounts;
      this.TTotalTaamen += element.taamen;
      this.TTotalDayAbs += element.totalAbsDays;
      this.TTotalPaidVacations = element.totalVacations;
      this.TTotalRewards += element.totalRewards;
      this.TTotalySalaries += element.totalSalaryOfThisMonth;
    });
    this.projectsDataSource = new MatTableDataSource(tempsource);
    this.DataSource = tempsource;
    this.projectsDataSource.paginator = this.paginator;
    this.projectsDataSource.sort = this.sort;
  }

  ListEmployeesForPayrol: any = [];
  GetEmployeesForPayroll() {
    this.adoptionManagerService
      .GetEmployeesForPayrollNew()
      .subscribe((data: any) => {
        this.reset();
        this.ListEmployeesForPayrol = data;
        this.datafilter.BranchId = null;
        this.datafilter.MonthId = null;
        this.RefreshData();
      });
  }

  // =============================================

  RowInvoiceData: any;
  selectedDateType = DateType.Hijri;
  WhichTypeAddEditView: number = 1;
  RowEntryVouvherData: any;
  selectedAccountRowTable: any;
  selectedCostCenterRowTable: any;
  modalEntryVoucher: any = {
    InvoiceId: 0,
    InvoiceNumber: null,
    JournalNumber: null,
    Date: new Date(),
    HijriDate: null,
    Notes: null,
    InvoiceNotes: null,
    Type: 8,
    InvoiceValue: 0,
    InvoiceReference: null,
    VoucherAdjustment: false,
    DunCalc: false,
    CostCenterId: null,
    Reference: null,
    TotalCredit: 0,
    bonus: 0,
    monthlyAllowances: 0,
    salaryOfThisMonth: 0,
    totalDiscounts: 0,
    totalVacations: 0,
    totalAbsDays: 0,
    totalLoans: 0,
    totalRewards: 0,
    empName: null,
    TotalDepit: 0,
    diff: 0,
    WhichClick: 1,
    addUser: null,
    addDate: null,
    addedImg: null,
  };

  resetEntryData() {
    this.EntryVoucherDetailsRows = [];
    this.load_CostCenter = [];
    this.modalEntryVoucher = {
      InvoiceId: 0,
      InvoiceNumber: null,
      JournalNumber: null,
      Date: new Date(),
      HijriDate: null,
      Notes: null,
      InvoiceNotes: null,
      Type: 8,
      InvoiceValue: 0,
      InvoiceReference: null,
      VoucherAdjustment: false,
      DunCalc: false,
      CostCenterId: null,
      Reference: null,
      totalDiscounts: 0,
      totalAbsDays: 0,
      TotalCredit: 0,
      totalRewards: 0,
      totalVacations: 0,
      totalLoans: 0,
      salaryOfThisMonth: 0,
      empName: null,
      bonus: 0,
      monthlyAllowances: 0,
      TotalDepit: 0,
      diff: 0,
      WhichClick: 1,
      addUser: null,
      addDate: null,
      addedImg: null,
    };
  }
  EntryVoucherDetailsRows: any = [];

  EntryVoucherDataSource = new MatTableDataSource();
  EntryVoucherSourceTemp: any = [];
  LoadDataEntryVoucher() {
    this.openingEntrtyService.GetAllVouchers().subscribe((data) => {
      this.EntryVoucherDataSource = new MatTableDataSource(data);
      this.EntryVoucherSourceTemp = data;
      this.EntryVoucherDataSource.paginator = this.paginator;
      this.EntryVoucherDataSource.sort = this.sort;
    });
  }
  GenerateEntryVoucherNumber() {
    this.invoiceService
      .GenerateVoucherNumber(this.modalEntryVoucher.Type)
      .subscribe((data) => {
        this.modalEntryVoucher.InvoiceNumber = data.reasonPhrase;
        this.EntryVoucherDetailsRows = [];
        this.addEntryVoucherRow();
      });
  }

  CostCenterListDataSource = new MatTableDataSource();
  CostCenterListDataSourceTemp: any;
  CostCenterList: any;
  @ViewChild('paginatorCostCenter') paginatorCostCenter!: MatPaginator;
  load_CostCenter: any;
  FillCostCenterSelect() {
    this.invoiceService.FillCostCenterSelect().subscribe((data) => {
      this.load_CostCenter = data;
      this.CostCenterListDataSource = new MatTableDataSource(data);
      this.CostCenterListDataSource.paginator = this.paginatorCostCenter;
      this.CostCenterList = data;
      this.CostCenterListDataSourceTemp = data;
    });
  }
  clickedtype: any = 0;
  payrollIdGlobal: any = 0;
  EntryVoucherPopup(data: any) {
    this.EntryVoucherDetailsRows = [];
    this.load_CostCenter = [];
    this.modalEntryVoucher = {
      InvoiceId: 0,
      InvoiceNumber: null,
      JournalNumber: null,
      Date: new Date(),
      HijriDate: null,
      Notes: null,
      InvoiceNotes: null,
      Type: 8,
      InvoiceValue: 0,
      InvoiceReference: null,
      VoucherAdjustment: false,
      DunCalc: false,
      CostCenterId: null,
      Reference: null,
      TotalCredit: 0,
      totalRewards: 0,
      totalLoans: 0,
      totalAbsDays: 0,
      totalVacations: 0,
      totalDiscounts: 0,
      salaryOfThisMonth: 0,
      empName: null,
      monthlyAllowances: 0,
      bonus: 0,
      TotalDepit: 0,
      diff: 0,
      WhichClick: 1,
      addUser: null,
      addDate: null,
      addedImg: null,
    };
    var date = new Date();
    var datebefore = this.sharedService.date_TO_String(date);
    var Hijridate = this.sharedService.GetHijriDate(
      date,
      'Contract/GetHijriDate'
    );
    this.FillCostCenterSelect();
    this.FillSubAccountLoadTable();
    this.GenerateEntryVoucherNumber();
    this.gethigridate();
    this.GetBranch_Costcenter();
    this.modalEntryVoucher.empName = data.empName;
    this.modalEntryVoucher.salaryOfThisMonth = data.salaryOfThisMonth;
    this.modalEntryVoucher.monthlyAllowances = data.monthlyAllowances;
    this.modalEntryVoucher.bonus = data.bonus;
    this.modalEntryVoucher.totalRewards = data.totalRewards;
    this.modalEntryVoucher.totalLoans = data.totalLoans;
    this.modalEntryVoucher.totalDiscounts = data.totalDiscounts;
    this.modalEntryVoucher.totalAbsDays = data.totalAbsDays;
    this.modalEntryVoucher.totalVacations = data.totalVacations;
    this.payrollIdGlobal = data.payrollId;
  }

  AccountListDataSource = new MatTableDataSource();
  AccountListDataSourceTemp: any;
  AccountList: any;
  @ViewChild('paginatorAccount') paginatorAccount: MatPaginator;

  FillSubAccountLoadTable() {
    this.invoiceService.FillSubAccountLoad().subscribe((data) => {
      this.AccountListDataSource = new MatTableDataSource(data.result);
      this.AccountListDataSource.paginator = this.paginatorAccount;
      this.AccountList = data.result;
      this.AccountListDataSourceTemp = data.result;
    });
  }

  disableButtonSave_EntryVoucher = false;
  AccountListdisplayedColumns: string[] = ['name'];
  CostCenterListdisplayedColumns: string[] = ['name'];

  addEntryVoucherRow() {
    var maxVal = 0;
    if (this.EntryVoucherDetailsRows.length > 0) {
      maxVal = Math.max(
        ...this.EntryVoucherDetailsRows.map((o: { idRow: any }) => o.idRow)
      );
    } else {
      maxVal = 0;
    }
    this.EntryVoucherDetailsRows?.push({
      idRow: maxVal + 1,
      Amounttxt: null,
      AccJournalid: null,
      accountJournaltxt: null,
      CreditDepitStatus: 'D',
      CostCenterId: null,
      CostCenterName: null,
      Notes: null,
      InvoiceReference: null,
      AccCalcExpen: false,
      AccCalcIncome: false,
    });
    this.GetCostCenterRow(maxVal + 1);
  }
  GetCostCenterRow(index: any) {
    this.adoptionManagerService.GetBranch_Costcenter().subscribe((data) => {
      this.EntryVoucherDetailsRows.filter(
        (a: { idRow: any }) => a.idRow == index
      )[0].CostCenterId = data.result.costCenterId;
      this.EntryVoucherDetailsRows.filter(
        (a: { idRow: any }) => a.idRow == index
      )[0].CostCenterName = data.result.costCenterName;
    });
  }
  journalDebitNmRows = 0;
  journalCreditNmRows = 0;
  CalculateEntryVoucher() {
    var totalDebit = 0,
      totalCredit = 0,
      totalBalance = 0;
    this.journalDebitNmRows = 0;
    this.journalCreditNmRows = 0;
    this.EntryVoucherDetailsRows.forEach((element: any, index: any) => {
      var Value = 0,
        Rate = 1;
      Value = element.Amounttxt;
      if (element.CreditDepitStatus == 'D') {
        this.journalDebitNmRows += 1;
        totalDebit += Value * Rate;
        totalBalance = +parseFloat(
          (totalDebit - totalCredit).toString()
        ).toFixed(2);
      } else {
        this.journalCreditNmRows += 1;
        totalCredit += Value * Rate;
        totalBalance = +parseFloat(
          (totalDebit - totalCredit).toString()
        ).toFixed(2);
      }
    });
    this.modalEntryVoucher.TotalCredit = parseFloat(
      totalCredit.toString()
    ).toFixed(2);
    this.modalEntryVoucher.TotalDepit = parseFloat(
      totalDebit.toString()
    ).toFixed(2);
    this.modalEntryVoucher.diff = parseFloat(
      (totalDebit - totalCredit).toString()
    ).toFixed(2);
  }

  applyFilterAccountsList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.AccountListDataSource.filter = filterValue.trim().toLowerCase();
  }

  setAccountRowValue(element: any) {
    this.EntryVoucherDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == this.selectedAccountRowTable
    )[0].AccJournalid = element.id;
    this.EntryVoucherDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == this.selectedAccountRowTable
    )[0].accountJournaltxt = element.name;
  }
  setCostCenterRowValue(element: any) {
    this.EntryVoucherDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == this.selectedCostCenterRowTable
    )[0].CostCenterId = element.id;
    this.EntryVoucherDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == this.selectedCostCenterRowTable
    )[0].CostCenterName = element.name;
  }
  applyFilterCostCenterList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.CostCenterListDataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteEntryVoucherRow(idRow: any) {
    let index = this.EntryVoucherDetailsRows.findIndex(
      (d: { idRow: any }) => d.idRow == idRow
    );
    this.EntryVoucherDetailsRows.splice(index, 1);
    this.CalculateEntryVoucher();
  }
  gethigridate() {
    this.sharedService
      .GetHijriDate(this.modalEntryVoucher.Date, 'Contract/GetHijriDate2')
      .subscribe({
        next: (data: any) => {
          this.modalEntryVoucher.HijriDate = data;
        },
        error: (error) => {},
      });
  }

  ChangeAccCalc(index: any, type: any) {
    var CalcExpen = this.EntryVoucherDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == index
    )[0].AccCalcExpen;
    var CalcIncome = this.EntryVoucherDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == index
    )[0].AccCalcIncome;
    if (type == 1) {
      if (CalcExpen == true && CalcIncome == true) {
        this.EntryVoucherDetailsRows.filter(
          (a: { idRow: any }) => a.idRow == index
        )[0].AccCalcIncome = false;
      }
    } else {
      if (CalcIncome == true && CalcExpen == true) {
        this.EntryVoucherDetailsRows.filter(
          (a: { idRow: any }) => a.idRow == index
        )[0].AccCalcExpen = false;
      }
    }
  }
  objOfInvoices: any;

  saveEntryVoucher(modal: any) {
    if (
      !(
        parseFloat(this.modalEntryVoucher.TotalDepit) > 0 &&
        parseFloat(this.modalEntryVoucher.diff) == 0
      )
    ) {
      this.toast.error('من فضلك أدخل قيم صحيحة للقيد', 'رسالة');
      return;
    }
    var VoucherDetailsList: any = [];
    var VoucherObj: any = {};
    VoucherObj.InvoiceId = this.modalEntryVoucher.InvoiceId;
    VoucherObj.InvoiceNumber = this.modalEntryVoucher.InvoiceNumber;
    VoucherObj.JournalNumber = this.modalEntryVoucher.JournalNumber;
    VoucherObj.Date = this.sharedService.date_TO_String(
      this.modalEntryVoucher.Date
    );
    VoucherObj.Notes = this.modalEntryVoucher.Notes;
    VoucherObj.InvoiceNotes = this.modalEntryVoucher.InvoiceNotes;
    VoucherObj.Type = this.modalEntryVoucher.Type;
    VoucherObj.InvoiceReference = this.modalEntryVoucher.InvoiceReference;
    VoucherObj.CostCenterId = this.modalEntryVoucher.CostCenterId;
    VoucherObj.DunCalc = this.modalEntryVoucher.DunCalc;
    VoucherObj.VoucherAdjustment = this.modalEntryVoucher.VoucherAdjustment;
    VoucherObj.IsPost = false;
    VoucherObj.InvoiceValue = parseFloat(
      this.modalEntryVoucher.TotalDepit.replace(/,/g, '')
    );

    var input = { valid: true, message: '' };
    var totalDepit = 0;
    var totalCredit = 0;

    this.EntryVoucherDetailsRows.forEach((element: any, index: any) => {
      if (element.AccJournalid == null) {
        input.valid = false;
        input.message = 'من فضلك أختر حساب ';
        return;
      }
      if (element.Amounttxt == null) {
        input.valid = false;
        input.message = 'من فضلك أختر مبلغ صحيح';
        return;
      }

      if (element.Notes == null) {
        input.valid = false;
        input.message = 'من فضلك ادخل البيان ';
        return;
      }
      var VoucherDetailsObj: any = {};
      VoucherDetailsObj.LineNumber = index + 1;
      VoucherDetailsObj.AccountId = element.AccJournalid;
      VoucherDetailsObj.Amount = element.Amounttxt;
      VoucherDetailsObj.CostCenterId = element.CostCenterId;
      VoucherDetailsObj.AccCalcExpen = element.AccCalcExpen;
      VoucherDetailsObj.AccCalcIncome = element.AccCalcIncome;
      VoucherDetailsObj.Notes = VoucherDetailsObj.Details = element.Notes;
      VoucherDetailsObj.InvoiceReference = element.InvoiceReference;
      VoucherDetailsObj.Type = this.modalEntryVoucher.Type;
      VoucherDetailsObj.IsPost = false;

      if (element.CreditDepitStatus == 'D') {
        VoucherDetailsObj.Depit = parseFloat(element.Amounttxt ?? 0);
        VoucherDetailsObj.Credit = 0.0;
        totalDepit = totalDepit + VoucherDetailsObj.Depit;
      } else {
        VoucherDetailsObj.Credit = parseFloat(element.Amounttxt ?? 0);
        VoucherDetailsObj.Depit = 0.0;
        totalCredit = totalCredit + VoucherDetailsObj.Credit;
      }

      VoucherDetailsList.push(VoucherDetailsObj);
    });
    if (!input.valid) {
      this.toast.error(input.message);
      return;
    }
    //VoucherObj.VoucherDetails = VoucherDetailsList;
    VoucherObj.TransactionDetails = VoucherDetailsList;

    if (
      !(
        parseFloat(totalCredit.toString()).toFixed(2) ==
        parseFloat(totalDepit.toString()).toFixed(2)
      )
    ) {
      this.toast.error('قيد غير متوازن', 'رسالة');
    }
    this.disableButtonSave_EntryVoucher = true;
    setTimeout(() => {
      this.disableButtonSave_EntryVoucher = false;
    }, 7000);
    this.adoptionManagerService.SaveEmpVoucher(VoucherObj).subscribe(
      (result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.RefreshData();
          this.resetEntryData();

          if (this.clickedtype == 1) {
            this.PostAllEmpPayrollVoucher();
          } else {
            this.PostEmpPayrollVoucher();
          }

          modal?.dismiss();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }

  PostEmpPayrollVoucher() {
    this.adoptionManagerService
      .PostEmpPayrollVoucher(this.payrollIdGlobal)
      .subscribe(
        (data) => {
          this.RefreshData();
        },
        (error) => {}
      );
  }
  PostAllEmpPayrollVoucher() {
    this.adoptionManagerService
      .PostAllEmpPayrollVoucher(this.allpayrolls)
      .subscribe(
        (data) => {
          this.RefreshData();
        },
        (error) => {}
      );
  }

  PostVouchers(modal: any) {
    let parems = [];
    parems.push(this.objOfInvoices);
    this.adoptionManagerService.PostVouchersCustody(parems).subscribe(
      (result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          modal?.dismiss();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }

  Branch_Costcenter: any;
  GetBranch_Costcenter() {
    this.adoptionManagerService.GetBranch_Costcenter().subscribe((data) => {
      this.Branch_Costcenter = data.result;
      this.modalEntryVoucher.CostCenterId = data.result.costCenterId;
    });
  }
  // ============================

  searchClause: any = null;
  claselist: any;
  clausedeleted: any;
  clauseseleted: any = [];
  VoucherTypeR: any = 5;
  projectsDataSourceR = new MatTableDataSource();

  Clausemodel: any = {
    id: null,
    nameAr: null,
    nameEn: null,
  };
  GetAllVouchersList: any;
  GetAllVouchersLastMonth() {
    var _voucherFilterVM = new VoucherFilterVM();
    _voucherFilterVM.type = this.VoucherTypeR;
    var obj = _voucherFilterVM;

    this._payvoucherservice.GetAllVouchersLastMonth(obj).subscribe((data) => {
      this.projectsDataSourceR = new MatTableDataSource(data);
      this.GetAllVouchersList = data;
      this.projectsDataSourceR.paginator = this.paginator;
      this.projectsDataSourceR.sort = this.sort;
    });
  }
  FillClausesSelect() {
    this._payvoucherservice.FillClausesSelect().subscribe(
      (data) => {
        this.clauseseleted = data;
      },
      (error) => {}
    );
  }
  costCentersList: any;
  FillCostCentersSelect() {
    this._accountsreportsService.FillCostCenterSelect().subscribe((data) => {
      this.costCentersList = data;
    });
  }
  citylect: any;

  FillCitySelects() {
    this._payvoucherservice.FillCitySelect().subscribe(
      (data) => {
        this.citylect = data;
      },
      (error) => {}
    );
  }
  supplierseleted: any;
  FillSuppliersSelect2() {
    this._payvoucherservice.FillSuppliersSelect2().subscribe(
      (data) => {
        this.supplierseleted = data;
      },
      (error) => {}
    );
  }

  BankSelectList: any;
  FillBankSelect() {
    this.receiptService.FillBankSelect().subscribe((data) => {
      this.BankSelectList = data;
    });
  }
  vouchermodel: any = {
    invoiceNumber: null,
    journalNumber: null,
    date: null,
    hijriDate: null,
    notes: null,
    type: null,
    invoiceValue: null,
    taxAmount: null,
    totalValue: null,
    toAccountId: null,
    invoiceReference: null,
    supplierInvoiceNo: null,
    recevierTxt: null,
    clauseId: null,
    supplierId: null,
    dunCalc: null,
    payType: 1,
    taxtype: 2,
    costCenterId: null,
    reftxt: null,
    reVoucherNValueText: null,
    valuebefore: null,
    valueafter: null,
    supplierTaxID: null,
    fromAccountId2Code: null,
    toAccountIdCode: null,
    invoiceNotes: null,
    taxcheck1: false,
    CostCenterId: null,
  };
  voucherDetails: any = {
    invoiceNumber: null,
    journalNumber: null,
    date: new Date(),
    hijriDate: null,
    notes: null,
    type: null,
    invoiceValue: null,
    checkNo: null,
    checkDate: null,
    bankId: null,
    moneyOrderNo: null,
    moneyOrderDate: null,
  };
  resetvouchermodel() {
    this.vouchermodel.invoiceNumber = null;
    this.vouchermodel.journalNumber = null;
    this.vouchermodel.date = null;
    this.vouchermodel.hijriDate = null;
    this.vouchermodel.notes = null;
    this.vouchermodel.type = null;
    this.vouchermodel.invoiceValue = null;
    this.vouchermodel.taxAmount = null;
    this.vouchermodel.totalValue = null;
    this.vouchermodel.toAccountId = null;
    this.vouchermodel.invoiceReference = null;
    this.vouchermodel.supplierInvoiceNo = null;
    this.vouchermodel.recevierTxt = null;
    this.vouchermodel.clauseId = null;
    this.vouchermodel.supplierId = null;
    this.vouchermodel.dunCalc = null;
    (this.vouchermodel.payType = 1),
      (this.vouchermodel.taxtype = 2),
      (this.vouchermodel.costCenterId = null);
    this.vouchermodel.reftxt = null;
    this.vouchermodel.reVoucherNValueText = null;
    this.vouchermodel.valuebefore = null;
    this.vouchermodel.valueafter = null;
    this.vouchermodel.supplierTaxID = null;
    this.vouchermodel.fromAccountId2Code = null;
    this.vouchermodel.toAccountIdCode = null;
    this.vouchermodel.accountId = null;
    this.vouchermodel.invoiceNotes = null;
    (this.vouchermodel.taxcheck1 = false),
      (this.vouchermodel.CostCenterId = null);

    this.voucherDetails.invoiceNumber = null;
    this.voucherDetails.journalNumber = null;
    (this.voucherDetails.date = new Date()),
      (this.voucherDetails.hijriDate = null);
    this.voucherDetails.notes = null;
    this.voucherDetails.type = null;
    this.voucherDetails.invoiceValue = null;
    this.voucherDetails.checkNo = null;
    this.voucherDetails.checkDate = null;
    this.voucherDetails.bankId = null;
    this.voucherDetails.moneyOrderNo = null;
    this.voucherDetails.moneyOrderDate = null;
    this.checkdetailsList = [];
  }
  checkdetailsList: any = [];
  addUser: any;
  addDate: any;
  addInvoiceImg: any;
  modalType = 0;
  saveandpost: any;
  public uploadedFilesR: Array<File> = [];
  Taxchechdisabl = false;
  PayTypeList = [
    { id: 1, name: 'monetary' },
    { id: 17, name: 'Cash account points of sale - Mada-ATM' },
    { id: 2, name: 'Check' },
    { id: 6, name: 'transfer' },
    { id: 9, name: 'Network/transfer' },
    { id: 15, name: 'عهد موظفين' },
    { id: 16, name: 'جاري المالك' },
  ];

  gethigridateR() {
    this.sharedService
      .GetHijriDate(this.vouchermodel.date, 'Contract/GetHijriDate2')
      .subscribe({
        next: (data: any) => {
          this.hijriDate = data;
        },
        error: (error) => {},
      });
  }
  projectId: any;
  @ViewChild('EditCheckDetailsModal') EditCheckDetailsModal: any;
  CheckDetailsForm: FormGroup;
  transferNumber: boolean = false;
  Toaccount: any;
  hijriDate: any = { year: 1455, month: 4, day: 20 };
  selectedDateTypeR = DateType.Hijri;
  submitted: boolean = false;
  payrollIdGlobal2: any;
  editvouccher(data: any) {
    this.projectId = null;
    this.vouchermodel.invoiceNumber = null;
    this.vouchermodel.journalNumber = null;
    this.vouchermodel.date = null;
    this.vouchermodel.hijriDate = null;
    this.vouchermodel.notes = null;
    this.vouchermodel.type = null;
    this.vouchermodel.invoiceValue = null;
    this.vouchermodel.taxAmount = null;
    this.vouchermodel.totalValue = null;
    this.vouchermodel.toAccountId = null;
    this.vouchermodel.invoiceReference = null;
    this.vouchermodel.supplierInvoiceNo = null;
    this.vouchermodel.recevierTxt = null;
    this.vouchermodel.clauseId = null;
    this.vouchermodel.supplierId = null;
    this.vouchermodel.dunCalc = null;
    (this.vouchermodel.payType = 1),
      (this.vouchermodel.taxtype = 2),
      (this.vouchermodel.costCenterId = null);
    this.vouchermodel.reftxt = null;
    this.vouchermodel.reVoucherNValueText = null;
    this.vouchermodel.valuebefore = null;
    this.vouchermodel.valueafter = null;
    this.vouchermodel.supplierTaxID = null;
    this.vouchermodel.fromAccountId2Code = null;
    this.vouchermodel.toAccountIdCode = null;
    this.vouchermodel.accountId = null;
    this.vouchermodel.invoiceNotes = null;
    (this.vouchermodel.taxcheck1 = false),
      (this.vouchermodel.CostCenterId = null);

    this.voucherDetails.invoiceNumber = null;
    this.voucherDetails.journalNumber = null;
    (this.voucherDetails.date = new Date()),
      (this.voucherDetails.hijriDate = null);
    this.voucherDetails.notes = null;
    this.voucherDetails.type = null;
    this.voucherDetails.invoiceValue = null;
    this.voucherDetails.checkNo = null;
    this.voucherDetails.checkDate = null;
    this.voucherDetails.bankId = null;
    this.voucherDetails.moneyOrderNo = null;
    this.voucherDetails.moneyOrderDate = null;
    this.checkdetailsList = [];
    // this.vouchermodel.invoiceNumber = data.invoiceNumber;
    var date = data.date;
    this.payrollIdGlobal2 = data.payrollId;
    this.vouchermodel.date = new Date();
    // this.vouchermodel.hijriDate = data.hijriDate;
    this.gethigridateR();
    this.vouchermodel.notes = data?.notes;
    this.vouchermodel.invoiceNotes = data?.invoiceNotes;
    var VoucherValue = data?.invoiceValue;
    var TaxValue = 0;
    //var VoucherTotalValue = $('#receiptVoucherGrid').DataTable().row($(this).closest('tr')).data().TotalValue;
    this.vouchermodel.journalNumber = data?.journalNumber;

    // this.vouchermodel.supplierInvoiceNo=data?.supplierInvoiceNo;
    this.vouchermodel.supplierInvoiceNo = data?.invoiceNumber;
    this.vouchermodel.recevierTxt = data?.empName;
    this.vouchermodel.invoiceReference = data?.invoiceReference;
    this.vouchermodel.invoiceValue = data?.invoiceValue;
    this.vouchermodel.reVoucherNValueText = data?.invoiceValueText;

    if (parseInt(data?.invoiceValue) == parseInt(data?.totalValue)) {
      this.vouchermodel.valuebefore = parseFloat(
        (
          parseFloat(data?.invoiceValue?.toString()) -
          parseFloat(data?.taxAmount?.toString())
        ).toString()
      ).toFixed(this.DigitalNumGlobal);
    } else {
      this.vouchermodel.valuebefore = parseFloat(data?.invoiceValue).toFixed(
        this.DigitalNumGlobal
      );
    }

    var DunCalcV = data?.dunCalc;

    if (DunCalcV == true) {
      this.vouchermodel.dunCalc = true;
    } else {
      this.vouchermodel.dunCalc = false;
    }

    var taxType =
      parseInt(data?.totalValue) === parseInt(data?.tnvoiceValue) ? 3 : 2;
    this.vouchermodel.taxtype = taxType;

    // this.vouchermodel.supplierId = data?.supplierId;
    if (data?.addDate != null) {
      this.addUser = data?.addUser;
      this.addDate = data?.addDate;
      if (data?.addInvoiceImg != '' && data?.addInvoiceImg != null) {
        this.addInvoiceImg = data?.addInvoiceImg;
      }
    }
  }

  CheckDetailsIntial() {
    this.CheckDetailsForm = this.formBuilder.group({
      dateCheck_transfer: [new Date(), []],
      paymenttypeName: [null, []],
      Check_transferNumber: [null, []],
      BankId: [null, []],
      bankName: [null, []],
    });
  }
  checkdetailsTabel(modal?: any) {
    this.BankSelectList.forEach((element: any) => {
      if (element.id == this.CheckDetailsForm.controls['BankId'].value)
        this.CheckDetailsForm.controls['bankName'].setValue(element.name);
    });

    if (
      this.CheckDetailsForm.controls['dateCheck_transfer'].value != null &&
      typeof this.CheckDetailsForm.controls['dateCheck_transfer'].value !=
        'string'
    ) {
      var date = this.sharedService.date_TO_String(
        this.CheckDetailsForm.controls['dateCheck_transfer'].value
      );
      this.CheckDetailsForm.controls['dateCheck_transfer'].setValue(date);
    }
    this.checkdetailsList = [
      {
        checkdetail: 1,
        checkdetailpaytype:
          this.CheckDetailsForm.controls['paymenttypeName'].value,
        checkdetailcheckNo:
          this.CheckDetailsForm.controls['Check_transferNumber'].value,
        checkdetailcheckDate:
          this.CheckDetailsForm.controls['dateCheck_transfer'].value,
        checkdetailbankId: this.CheckDetailsForm.controls['BankId'].value,
        checkdetailbankName: this.CheckDetailsForm.controls['bankName'].value,
      },
    ];
    if (modal) {
      modal.dismiss();
    }
  }

  GetTaxNoBySuppIdR(suppid: any) {
    this._payvoucherservice.GetTaxNoBySuppId(suppid).subscribe((data) => {
      this.vouchermodel.supplierTaxID = data ?? '';
    });
  }

  FillCustAccountsSelect2listTO: any;
  FillSubAccountLoadR() {
    this.receiptService.FillSubAccountLoad().subscribe((data) => {
      this.FillCustAccountsSelect2listTO = data.result;
    });
  }

  FillCustAccountsSelect2listFROM: any;
  FillCustAccountsSelect2R(PayTypeId: any) {
    this.receiptService.FillCustAccountsSelect2(PayTypeId).subscribe((data) => {
      this.Toaccount = data;
      this.vouchermodel.toAccountId = data[0]?.id;
      this.getaccountcode(this.vouchermodel.toAccountId, 1);
    });
  }

  getaccountcode(accountid: any, type: any) {
    if (accountid == null || accountid == '') {
      if (type == 1) {
        this.vouchermodel.toAccountIdCode = null;
      } else {
        this.vouchermodel.fromAccountId2Code = null;
      }
    } else {
      this._payvoucherservice.GetAccCodeFormID(accountid).subscribe((data) => {
        if (type == 1) {
          this.vouchermodel.toAccountIdCode = data;
        } else {
          this.vouchermodel.fromAccountId2Code = data;
        }
      });
    }
  }

  savefileR(id: any) {
    const formData = new FormData();
    formData.append('UploadedFile', this.uploadedFilesR[0]);
    formData.append('InvoiceId', id);
    this.receiptService.UploadPayVoucherImage(formData).subscribe((data) => {
      this.GetAllVouchersLastMonth();
    });
  }
  clickedtypepay: any = 0;
  savevoucher(type: any, modal: any) {
    this.submitted = true;

    if (
      this.vouchermodel.date == null ||
      this.vouchermodel.invoiceValue == null ||
      this.vouchermodel.toAccountId == null ||
      this.vouchermodel.recevierTxt == null ||
      this.vouchermodel.clauseId == null ||
      this.vouchermodel.supplierId == null ||
      this.vouchermodel.CostCenterId == null ||
      this.vouchermodel.accountId == null ||
      this.vouchermodel.payType == null
    ) {
      this.toast.error(
        this.translate.instant('من فضلك اكمل البيانات'),
        this.translate.instant('Message')
      );
      return;
    }
    var VoucherDetailsList = [];
    var VoucherObj = new Invoices();
    VoucherObj.invoiceId = 0;
    VoucherObj.invoiceNumber = this.vouchermodel.invoiceNumber;
    VoucherObj.journalNumber = this.vouchermodel.journalNumber;
    VoucherObj.date = this.datePipe.transform(
      this.vouchermodel.date,
      'YYYY-MM-dd'
    );
    VoucherObj.hijriDate = this.vouchermodel.hijriDate;
    VoucherObj.notes = this.vouchermodel.notes;
    VoucherObj.invoiceNotes = this.vouchermodel.invoiceNotes;
    VoucherObj.type = this.VoucherTypeR;
    VoucherObj.invoiceValue = this.vouchermodel.invoiceValue;
    VoucherObj.taxAmount = this.vouchermodel.taxAmount;
    VoucherObj.totalValue = this.vouchermodel.valueafter;

    VoucherObj.toAccountId = this.vouchermodel.toAccountId;
    VoucherObj.invoiceReference = this.vouchermodel.invoiceReference;

    VoucherObj.toInvoiceId = this.vouchermodel.supplierInvoiceNo;
    VoucherObj.supplierInvoiceNo = this.vouchermodel.supplierInvoiceNo;
    VoucherObj.recevierTxt = this.vouchermodel.recevierTxt;
    VoucherObj.clauseId = this.vouchermodel.clauseId;
    VoucherObj.supplierId = this.vouchermodel.supplierId;
    //  if (this.vouchermodel.) {
    VoucherObj.dunCalc = this.vouchermodel.dunCalc ?? false;
    // }
    // else {
    //     VoucherObj.dunCalc = false;
    // }
    VoucherObj.payType = this.vouchermodel.payType;
    // var input = { valid: true, message: "" }
    // var ValidCostCenterAcc = true;
    // var SelctedAccCostList = [];

    var VoucherDetailsObj = new VoucherDetails();
    VoucherDetailsObj.lineNumber = 1;
    VoucherDetailsObj.accountId = this.vouchermodel.accountId;
    VoucherDetailsObj.amount = this.vouchermodel.amount;
    VoucherDetailsObj.taxType = this.vouchermodel.taxtype;
    VoucherDetailsObj.taxAmount = this.vouchermodel.taxAmount;

    VoucherDetailsObj.totalAmount = this.vouchermodel.valueafter;
    VoucherDetailsObj.payType = this.vouchermodel.payType;
    VoucherDetailsObj.toAccountId = this.vouchermodel.toAccountId;

    VoucherDetailsObj.costCenterId = this.vouchermodel.CostCenterId;
    VoucherDetailsObj.referenceNumber = this.vouchermodel.invoiceReference;
    VoucherDetailsObj.description = this.vouchermodel.notes;

    if (this.vouchermodel.payType == 2) {
      const checkTransferNumber =
        this.CheckDetailsForm.controls['Check_transferNumber'].value;
      VoucherDetailsObj.checkNo = checkTransferNumber
        ? checkTransferNumber.toString()
        : '';
      VoucherDetailsObj.checkDate =
        this.CheckDetailsForm.controls['dateCheck_transfer'].value;
      VoucherDetailsObj.bankId = this.CheckDetailsForm.controls['BankId'].value;
    } else if (this.vouchermodel.payType == 6) {
      VoucherDetailsObj.moneyOrderNo =
        this.CheckDetailsForm.controls['Check_transferNumber'].value;
      VoucherDetailsObj.moneyOrderDate =
        this.CheckDetailsForm.controls['dateCheck_transfer'].value;
      VoucherDetailsObj.bankId = this.CheckDetailsForm.controls['BankId'].value;
    } else if (this.vouchermodel.payType == 17) {
      VoucherDetailsObj.moneyOrderNo =
        this.CheckDetailsForm.controls['Check_transferNumber'].value;
      VoucherDetailsObj.moneyOrderDate =
        this.CheckDetailsForm.controls['dateCheck_transfer'].value;
      VoucherDetailsObj.bankId = this.CheckDetailsForm.controls['BankId'].value;
    }

    VoucherDetailsList.push(VoucherDetailsObj);

    VoucherObj.voucherDetails = VoucherDetailsList;
    if (type == 1) {
      this._payvoucherservice.SaveandPostVoucherP(VoucherObj).pipe(take(1)).subscribe(
        (data) => {
          this.submitted = false;
          if (data.statusCode == 200) {
            if (this.clickedtypepay == 1) {
              this.PostALLPayrollPayVoucherClick();
            } else {
              this.PostPayrollPayVoucherClick();
            }
            this.RefreshData();
            if (this.uploadedFilesR.length > 0) {
              this.savefileR(data.returnedParm);
              this.GetAllVouchersLastMonth();
              modal.dismiss();
              this.toast.success(
                this.translate.instant(data.reasonPhrase),
                this.translate.instant('Message')
              );
            } else {
              this.submitted = false;
              modal.dismiss();
              this.toast.success(
                this.translate.instant(data.reasonPhrase),
                this.translate.instant('Message')
              );
            }
          } else {
            this.toast.error(
              this.translate.instant(data.reasonPhrase),
              this.translate.instant('Message')
            );
            this.submitted = false;
          }
        }
      );
    } else {
      this._payvoucherservice.SaveVoucherP(VoucherObj).pipe(take(1)).subscribe(
        (data) => {
          this.submitted = false;
          this.RefreshData();
          if (data.statusCode == 200) {
            if (this.clickedtypepay == 1) {
              this.PostALLPayrollPayVoucherClick();
            } else {
              this.PostPayrollPayVoucherClick();
            }

            if (this.uploadedFilesR.length > 0) {
              this.GetAllVouchersLastMonth();
              this.savefileR(data.returnedParm);
              modal.dismiss();
              this.toast.success(
                this.translate.instant(data.reasonPhrase),
                this.translate.instant('Message')
              );
            } else {
              modal.dismiss();
              this.toast.success(
                this.translate.instant(data.reasonPhrase),
                this.translate.instant('Message')
              );
            }
          } else {
            this.toast.error(
              this.translate.instant(data.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        }
      );
    }
  }

  PostALLPayrollPayVoucherClick() {
    this.adoptionManagerService
      .PostALLEmpPayrollPayVoucher(this.allpayrollsforpay)
      .subscribe(
        (data) => {
          this.RefreshData();
        },
        (error) => {}
      );
  }

  PostPayrollPayVoucherClick() {
    this.adoptionManagerService
      .PostEmpPayrollPayVoucher(this.payrollIdGlobal2)
      .subscribe(
        (data) => {
          this.RefreshData();
        },
        (error) => {}
      );
  }

  FillCustAc(add: any) {
    var PayType = this.vouchermodel.payType;
    this.checkdetailsList = [];

    if (PayType == 1) {
      this.FillCustAccountsSelect2R(1);
    } else if (PayType == 2 || PayType == 6) {
      this.FillCustAccountsSelect2R(6);
      if (add == false) {
        this.open(
          this.EditCheckDetailsModal,
          '',
          'EditCheckDetailsModal',
          'newCheckDetails'
        );
      }
    } else if (PayType == 3) {
      this.FillCustAccountsSelect2R(4);
    } else if (PayType == 4) {
      this.FillCustAccountsSelect2R(5);
    } else if (PayType == 5) {
      this.FillCustAccountsSelect2R(6);
    } else if (PayType == 9) {
      this.FillCustAccountsSelect2R(9);
    } else if (PayType == 15) {
      this.FillCustAccountsSelect2R(15);
    } else if (PayType == 16) {
      this.FillCustAccountsSelect2R(16);
    } else if (PayType == 17) {
      this.FillCustAccountsSelect2R(17);
      if (add == false) {
        this.open(
          this.EditCheckDetailsModal,
          '',
          'EditCheckDetailsModal',
          'newCheckDetails'
        );
      }
    } else {
      this.FillCustAccountsSelect2R(0);
    }
  }

  GetAllClauses() {
    this._payvoucherservice.GetAllClauses(this.searchClause ?? '').subscribe(
      (data) => {
        this.claselist = data.result;
      },
      (error) => {}
    );
  }
  editclause(item: any) {
    console.log(item);
    this.Clausemodel.id = item.id;
    this.Clausemodel.nameAr = item.nameAr;
    this.Clausemodel.nameEn = item.nameEn;
  }

  SaveClause() {
    var _Clause = new Acc_Clauses();
    if (
      this.Clausemodel.nameAr == null ||
      this.Clausemodel.nameAr == '' ||
      this.Clausemodel.nameEn == null ||
      this.Clausemodel.nameEn == ''
    ) {
      this.toast.error('من فضلك اكمل البيانات');
      return;
    }
    _Clause.clauseId = this.Clausemodel.id ?? 0;
    _Clause.nameAr = this.Clausemodel.nameAr;
    _Clause.nameEn = this.Clausemodel.nameEn;

    this._payvoucherservice.SaveClause(_Clause).subscribe(
      (data) => {
        this.GetAllClauses();
        this.FillClausesSelect();
        this.toast.success(
          this.translate.instant(data.reasonPhrase),
          this.translate.instant('Message')
        );
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }

  DeleteClause(modal: any) {
    this._payvoucherservice.DeleteClause(this.clausedeleted).subscribe(
      (data) => {
        this.GetAllClauses();
        this.FillClausesSelect();
        modal.dismiss();
        this.toast.success(
          this.translate.instant(data.reasonPhrase),
          this.translate.instant('Message')
        );
      },
      (error) => {
        modal.dismiss();

        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }

  taxtypeChangeR() {
    if (this.vouchermodel.taxtype == 2) {
      this._payvoucherservice.GetALLOrgData().subscribe((data) => {
        var vAT_TaxVal = data.result.vat;

        let totalInvoices = parseFloat(this.vouchermodel.invoiceValue).toFixed(
          this.DigitalNumGlobal
        );

        var tax = parseFloat(
          ((parseFloat(totalInvoices.toString()) * vAT_TaxVal) / 100).toString()
        ).toFixed(this.DigitalNumGlobal);

        var totalwithtax = parseFloat(
          (+totalInvoices + +tax).toString()
        ).toFixed(this.DigitalNumGlobal);

        // $("#ValueTax").val(tax);
        // $("#ValueBefore").val(totalInvoices);
        // $("#ValueAfter").val(totalwithtax);

        this.vouchermodel.taxAmount = tax;
        this.vouchermodel.valuebefore = totalInvoices;
        this.vouchermodel.valueafter = totalwithtax;
      });
    } else if (this.vouchermodel.taxtype == 3) {
      this._payvoucherservice.GetALLOrgData().subscribe((data) => {
        var vAT_TaxVal = data.result.vat;

        let totalInvoices = parseFloat(this.vouchermodel.invoiceValue); //.toFixed(this.DigitalNumGlobal);
        // var totalWithtaxInvoices = parseFloat($("#TotalVoucherValueLbl").val()).toFixed($('#DigitalNumGlobal').val());

        var tax = parseFloat(
          (
            parseFloat(totalInvoices.toString()) -
            parseFloat(totalInvoices.toString()) / (vAT_TaxVal / 100 + 1)
          ).toString()
        ); //.toFixed(this.DigitalNumGlobal);

        //var totalwithtax = parseFloat((totalWithtaxInvoices - tax).toString()).toFixed(this.DigitalNumGlobal);

        this.vouchermodel.taxAmount = tax.toFixed(this.DigitalNumGlobal);
        this.vouchermodel.valuebefore = parseFloat(
          (totalInvoices - tax).toString()
        ).toFixed(this.DigitalNumGlobal);
        this.vouchermodel.valueafter = totalInvoices.toFixed(
          this.DigitalNumGlobal
        );
      });
    }
  }

  searchsupplier: any = null;
  supplierlist: any;
  supplierdeleted: any;

  suppliermodel: any = {
    id: null,
    nameAr: null,
    nameEn: null,
    taxNo: null,
    phoneNo: null,
    compAddress: null,
    postalCodeFinal: null,
    externalPhone: null,
    country: null,
    neighborhood: null,
    streetName: null,
    buildingNumber: null,
    commercialRegInvoice: null,
    cityId: null,
  };
  GetAllSuppliersR() {
    this._payvoucherservice
      .GetAllSuppliers(this.searchsupplier ?? '')
      .subscribe(
        (data) => {
          this.supplierlist = data;
        },
        (error) => {}
      );
  }

  editsupplier(item: any) {
    console.log(item);
    this.suppliermodel.id = item.supplierId;
    this.suppliermodel.nameAr = item.nameAr;
    this.suppliermodel.nameEn = item.nameEn;
    this.suppliermodel.taxNo = item.taxNo;
    this.suppliermodel.phoneNo = item.phoneNo;
    this.suppliermodel.compAddress = item.compAddress;
    this.suppliermodel.postalCodeFinal = item.postalCodeFinal;
    this.suppliermodel.externalPhone = item.externalPhone;
    this.suppliermodel.country = item.country;
    this.suppliermodel.neighborhood = item.neighborhood;
    this.suppliermodel.streetName = item.streetName;
    this.suppliermodel.buildingNumber = item.buildingNumber;
    this.suppliermodel.commercialRegInvoice = item.commercialRegInvoice;
    this.suppliermodel.cityId = item.cityId;
  }
  resetsupplier() {
    this.suppliermodel.id = null;
    this.suppliermodel.nameAr = null;
    this.suppliermodel.nameEn = null;
    this.suppliermodel.taxNo = null;
    this.suppliermodel.phoneNo = null;
    this.suppliermodel.compAddress = null;
    this.suppliermodel.postalCodeFinal = null;
    this.suppliermodel.externalPhone = null;
    this.suppliermodel.country = null;
    this.suppliermodel.neighborhood = null;
    this.suppliermodel.streetName = null;
    this.suppliermodel.buildingNumber = null;
    this.suppliermodel.commercialRegInvoice = null;
    this.suppliermodel.cityId = null;
  }

  savesupplier() {
    var _supplier = new Acc_Suppliers();
    if (
      this.suppliermodel.nameAr == null ||
      this.suppliermodel.nameAr == '' ||
      this.suppliermodel.nameEn == null ||
      this.suppliermodel.nameEn == ''
    ) {
      this.toast.error('من فضلك اكمل البيانات');
      return;
    }

    _supplier.supplierId = this.suppliermodel.id ?? 0;
    _supplier.nameAr = this.suppliermodel.nameAr;
    _supplier.nameEn = this.suppliermodel.nameEn;
    _supplier.taxNo = this.suppliermodel.taxNo;
    _supplier.phoneNo = this.suppliermodel.phoneNo;
    _supplier.compAddress = this.suppliermodel.compAddress;
    _supplier.postalCodeFinal = this.suppliermodel.postalCodeFinal;
    _supplier.externalPhone = this.suppliermodel.externalPhone;
    _supplier.country = this.suppliermodel.country;
    _supplier.neighborhood = this.suppliermodel.neighborhood;
    _supplier.streetName = this.suppliermodel.streetName;
    _supplier.buildingNumber = this.suppliermodel.buildingNumber;
    _supplier.cityId = this.suppliermodel.cityId;

    this._payvoucherservice.SaveSupplier(_supplier).subscribe(
      (data) => {
        this.GetAllSuppliersR();
        this.FillSuppliersSelect2();
        this.resetsupplier();
        this.toast.success(
          this.translate.instant(data.reasonPhrase),
          this.translate.instant('Message')
        );
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }

  DeleteSupplier(modal: any) {
    this._payvoucherservice.DeleteSupplier(this.supplierdeleted).subscribe(
      (data) => {
        this.GetAllSuppliersR();
        this.FillSuppliersSelect2();
        modal.dismiss();
        this.toast.success(
          this.translate.instant(data.reasonPhrase),
          this.translate.instant('Message')
        );
      },
      (error) => {
        modal.dismiss();

        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }

  Taxckeck1Change() {
    if (this.vouchermodel.taxcheck1 == false) {
      this.vouchermodel.taxtype = 3;
      this.Taxchechdisabl = true;
      let totalInvoices = parseFloat(this.vouchermodel.invoiceValue);
      this.vouchermodel.taxAmount = 0;
      this.vouchermodel.valuebefore = 0;
      this.vouchermodel.valueafter = totalInvoices.toFixed(
        this.DigitalNumGlobal
      );
    } else {
      this.Taxchechdisabl = false;
      this._payvoucherservice.GetALLOrgData().subscribe((data) => {
        var vAT_TaxVal = data.result.vat;

        let totalInvoices = parseFloat(this.vouchermodel.invoiceValue); //.toFixed(this.DigitalNumGlobal);

        var tax = parseFloat(
          (
            parseFloat(totalInvoices.toString()) -
            parseFloat(totalInvoices.toString()) / (vAT_TaxVal / 100 + 1)
          ).toString()
        ); //.toFixed(this.DigitalNumGlobal);

        this.vouchermodel.taxAmount = tax.toFixed(this.DigitalNumGlobal);
        this.vouchermodel.valuebefore = parseFloat(
          (totalInvoices - tax).toString()
        ).toFixed(this.DigitalNumGlobal);
        this.vouchermodel.valueafter = totalInvoices.toFixed(
          this.DigitalNumGlobal
        );
      });
    }
  }
  invoiceValuechange() {
    if (this.vouchermodel.taxtype == 2) {
      this._payvoucherservice.GetALLOrgData().subscribe((data) => {
        var vAT_TaxVal = data.result.vat;

        let totalInvoices = parseFloat(this.vouchermodel.invoiceValue).toFixed(
          this.DigitalNumGlobal
        );

        var tax = parseFloat(
          ((parseFloat(totalInvoices.toString()) * vAT_TaxVal) / 100).toString()
        ).toFixed(this.DigitalNumGlobal);

        var totalwithtax = parseFloat(
          (+totalInvoices + +tax).toString()
        ).toFixed(this.DigitalNumGlobal);

        // $("#ValueTax").val(tax);
        // $("#ValueBefore").val(totalInvoices);
        // $("#ValueAfter").val(totalwithtax);

        this.vouchermodel.taxAmount = tax;
        this.vouchermodel.valuebefore = totalInvoices;
        this.vouchermodel.valueafter = totalwithtax;
      });
    } else if (this.vouchermodel.taxtype == 3) {
      this._payvoucherservice.GetALLOrgData().subscribe((data) => {
        var vAT_TaxVal = data.result.vat;

        let totalInvoices = parseFloat(this.vouchermodel.invoiceValue); //.toFixed(this.DigitalNumGlobal);
        // var totalWithtaxInvoices = parseFloat($("#TotalVoucherValueLbl").val()).toFixed($('#DigitalNumGlobal').val());

        var tax = parseFloat(
          (
            parseFloat(totalInvoices.toString()) -
            parseFloat(totalInvoices.toString()) / (vAT_TaxVal / 100 + 1)
          ).toString()
        ); //.toFixed(this.DigitalNumGlobal);

        //var totalwithtax = parseFloat((totalWithtaxInvoices - tax).toString()).toFixed(this.DigitalNumGlobal);

        this.vouchermodel.taxAmount = tax.toFixed(this.DigitalNumGlobal);
        this.vouchermodel.valuebefore = parseFloat(
          (totalInvoices - tax).toString()
        ).toFixed(this.DigitalNumGlobal);
        this.vouchermodel.valueafter = totalInvoices.toFixed(
          this.DigitalNumGlobal
        );
      });
    }
    this._payvoucherservice
      .ConvertNumToString(this.vouchermodel.invoiceValue)
      .subscribe((data) => {
        this.vouchermodel.reVoucherNValueText = data.reasonPhrase;
      });
  }
  invoiceValuechange_pay() {
    debugger;
    if (this.vouchermodel.taxtype == 2) {
      this._payvoucherservice.GetALLOrgData().subscribe((data) => {
        var vAT_TaxVal = data.result.vat;
        debugger;
        let totalInvoices = parseFloat(this.vouchermodel.invoiceValue).toFixed(
          this.DigitalNumGlobal
        );

        var tax = parseFloat(
          ((parseFloat(totalInvoices.toString()) * vAT_TaxVal) / 100).toString()
        ).toFixed(this.DigitalNumGlobal);

        var totalwithtax = parseFloat(
          (+totalInvoices + +tax).toString()
        ).toFixed(this.DigitalNumGlobal);

        // $("#ValueTax").val(tax);
        // $("#ValueBefore").val(totalInvoices);
        // $("#ValueAfter").val(totalwithtax);

        this.vouchermodel.taxAmount = tax;
        this.vouchermodel.valuebefore = totalInvoices;
        this.vouchermodel.valueafter = totalwithtax;
      });
    } else if (this.vouchermodel.taxtype == 3) {
      this._payvoucherservice.GetALLOrgData().subscribe((data) => {
        var vAT_TaxVal = data.result.vat;
        debugger;
        let totalInvoices = parseFloat(this.vouchermodel.invoiceValue); //.toFixed(this.DigitalNumGlobal);
        // var totalWithtaxInvoices = parseFloat($("#TotalVoucherValueLbl").val()).toFixed($('#DigitalNumGlobal').val());

        var tax = parseFloat(
          (
            parseFloat(totalInvoices.toString()) -
            parseFloat(totalInvoices.toString()) / (vAT_TaxVal / 100 + 1)
          ).toString()
        ); //.toFixed(this.DigitalNumGlobal);

        //var totalwithtax = parseFloat((totalWithtaxInvoices - tax).toString()).toFixed(this.DigitalNumGlobal);

        this.vouchermodel.taxAmount = tax.toFixed(this.DigitalNumGlobal);
        this.vouchermodel.valuebefore = parseFloat(
          (totalInvoices - tax).toString()
        ).toFixed(this.DigitalNumGlobal);
        this.vouchermodel.valueafter = totalInvoices.toFixed(
          this.DigitalNumGlobal
        );
      });
    }
    this._payvoucherservice
      .ConvertNumToString(this.vouchermodel.invoiceValue)
      .subscribe((data) => {
        debugger;
        this.vouchermodel.reVoucherNValueText = data.reasonPhrase;
      });
  }

  BanksList: any;
  GetAllBanks() {
    this.receiptService.GetAllBanks().subscribe(
      (data) => {
        this.BanksList = data.result;
      },
      (error) => {}
    );
  }
  BanksId: any = '0';
  BanksNameAr: any;
  BanksNameEn: any;
  SaveBanks() {
    if (this.BanksNameAr != null && this.BanksNameEn != null) {
      const prames = {
        bankId: this.BanksId,
        NameAr: this.BanksNameAr,
        NameEn: this.BanksNameEn,
      };
      this.receiptService.Savebanks(prames).subscribe(
        (data) => {
          this.BanksNameAr = null;
          this.BanksNameEn = null;
          this.BanksId = '0';
          this.FillBankSelect();
          this.GetAllBanks();
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        },
        (error) => {
          this.toast.error(
            this.translate.instant(error.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      );
    }
  }
  updateBanks(Banks: any) {
    this.BanksId = Banks.bankId;
    this.BanksNameAr = Banks.nameAr;
    this.BanksNameEn = Banks.nameEn;
  }

  DeletebanksId: any;
  DeleteBank(modal: any) {
    this.receiptService.DeleteBanks(this.DeletebanksId).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
          this.FillBankSelect();
          this.GetAllBanks();
          this.DeletebanksId = null;
          modal.dismiss();
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }

  GenerateVoucherNumberR() {
    this._payvoucherservice
      .GenerateVoucherNumber(this.VoucherTypeR)
      .subscribe((data) => {
        debugger;
        this.vouchermodel.invoiceNumber = data.reasonPhrase;
      });
  }
  GetBranch_CostcenterR() {
    this._payvoucherservice.GetBranch_Costcenter().subscribe({
      next: (data: any) => {
        this.vouchermodel.CostCenterId = data.result.costCenterId;
      },
      error: (error) => {},
    });
  }
  DigitalNumGlobal: any;
  GetLayoutReadyVm() {
    this._payvoucherservice.GetLayoutReadyVm().subscribe((data) => {
      if (data.decimalPoints == null || data.decimalPoints == '') {
        this.DigitalNumGlobal = 0;
      } else {
        this.DigitalNumGlobal = parseInt(data.decimalPoints);
      }
    });
  }

  taxtypeChange() {
    debugger;
    if (this.vouchermodel.taxtype == 2) {
      this._payvoucherservice.GetALLOrgData().subscribe((data) => {
        var vAT_TaxVal = data.result.vat;
        debugger;
        let totalInvoices = parseFloat(this.vouchermodel.invoiceValue).toFixed(
          this.DigitalNumGlobal
        );

        var tax = parseFloat(
          ((parseFloat(totalInvoices.toString()) * vAT_TaxVal) / 100).toString()
        ).toFixed(this.DigitalNumGlobal);

        var totalwithtax = parseFloat(
          (+totalInvoices + +tax).toString()
        ).toFixed(this.DigitalNumGlobal);

        // $("#ValueTax").val(tax);
        // $("#ValueBefore").val(totalInvoices);
        // $("#ValueAfter").val(totalwithtax);

        this.vouchermodel.taxAmount = tax;
        this.vouchermodel.valuebefore = totalInvoices;
        this.vouchermodel.valueafter = totalwithtax;
      });
    } else if (this.vouchermodel.taxtype == 3) {
      this._payvoucherservice.GetALLOrgData().subscribe((data) => {
        debugger;
        var vAT_TaxVal = data.result.vat;

        let totalInvoices = parseFloat(this.vouchermodel.invoiceValue); //.toFixed(this.DigitalNumGlobal);
        // var totalWithtaxInvoices = parseFloat($("#TotalVoucherValueLbl").val()).toFixed($('#DigitalNumGlobal').val());

        var tax = parseFloat(
          (
            parseFloat(totalInvoices.toString()) -
            parseFloat(totalInvoices.toString()) / (vAT_TaxVal / 100 + 1)
          ).toString()
        ); //.toFixed(this.DigitalNumGlobal);

        //var totalwithtax = parseFloat((totalWithtaxInvoices - tax).toString()).toFixed(this.DigitalNumGlobal);

        this.vouchermodel.taxAmount = tax.toFixed(this.DigitalNumGlobal);
        this.vouchermodel.valuebefore = parseFloat(
          (totalInvoices - tax).toString()
        ).toFixed(this.DigitalNumGlobal);
        this.vouchermodel.valueafter = totalInvoices.toFixed(
          this.DigitalNumGlobal
        );
      });
    }
  }

  // ============================

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
  }

  // Delete row
  delete(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    this.rows.splice(rowIndex, 1);
  }

  selectGoalForProject(index: any) {}

  addNewMission() {}

  onSort(event: any) {
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
        //#region
  //--------------------------------------------------
  key: any;
  isShift = false;

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
    this.isShift = !!event.shiftKey; // typecast to boolean
    if (this.isShift) {
      switch (this.key) {
        case 16: // ignore shift key
          break;
        default:
          if (event.code == 'KeyA') {
            this.addEntryVoucherRow();
          }
          break;
      }
    }
  }
  //#endregion
}
