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
import { SelectionModel } from '@angular/cdk/collections';

import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { NgxPrintElementService } from 'ngx-print-element';
import { environment } from 'src/environments/environment';
import { InvoiceService } from 'src/app/core/services/acc_Services/invoice.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { FinancialCovenantService } from 'src/app/core/services/acc_Services/financial-covenant.service';
import { VoucherFilterVM } from 'src/app/core/Classes/ViewModels/voucherFilterVM';
import { ReportCustomer } from 'src/app/core/Classes/ViewModels/reportCustomer';
import { Invoices } from 'src/app/core/Classes/DomainObjects/invoices';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { OpeningEntrtyService } from 'src/app/core/services/acc_Services/opening-entrty.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { DateType } from 'ngx-hijri-gregorian-datepicker';

@Component({
  selector: 'app-financial-covenant',
  templateUrl: './financial-covenant.component.html',
  styleUrls: ['./financial-covenant.component.scss'],
})
export class FinancialCovenantComponent implements OnInit {
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
      ar: ' العهد المالية للموظفين',
      en: 'Financial covenant for employees',
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
    'employeeName',
    'itemName',
    'itemPrice',
    'date',
    'invoiceNumber',
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
    BondNumber: null,
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
  constructor(
    private modalService: NgbModal,
    private api: RestApiService,
    private print: NgxPrintElementService,
    private sharedService: SharedService,
    private invoiceService: InvoiceService,
    private financialCovenantService: FinancialCovenantService,
    private openingEntrtyService: OpeningEntrtyService,
    private translate: TranslateService,
    private toast: ToastrService
  ) {
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();
    api.lang.subscribe((res) => {
      this.lang = res;
    });
  }

  ngOnInit(): void {
    this.GetSomeCustodyVoucher();
    this.FillEmployeeSelect();
    this.api.GetOrganizationDataLogin().subscribe((data: any) => {
      this.OrganizationData = data.result;
      this.dateprint = new Date();
      this.environmentPho =
        environment.PhotoURL + this.OrganizationData.logoUrl;
    });
    this.projectsDataSource = new MatTableDataSource(this.projects);

    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );

    this.projectGoalsDataSource = new MatTableDataSource();

    this.projectUsersDataSource = new MatTableDataSource(this.projectUsers);

    this.projectTasksDataSource = new MatTableDataSource(this.projectTasks);
  }

  ngAfterViewInit() {
    // this.open(this.smartModal, null, 'smartModal');
  }
  Branch_Costcenter: any;
  GetBranch_Costcenter() {
    this.financialCovenantService.GetBranch_Costcenter().subscribe((data) => {
      this.Branch_Costcenter = data.result;
      this.modalEntryVoucher.CostCenterId = data.result.costCenterId;
    });
  }
  employeeselectlist: any = [];
  FillEmployeeSelect() {
    this.financialCovenantService.FillEmployeeSelect().subscribe((data) => {
      this.employeeselectlist = data;
    });
  }
  GetSomeCustodyVoucher() {
    this.financialCovenantService.GetSomeCustodyVoucher().subscribe((data) => {
      this.projectsDataSource = new MatTableDataSource(data.result);
      this.projectsDataSourceTemp = data.result;
      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
    });
  }
  projectsDataSourceTemp: any = [];
  EmployeeId: any = null;
  RefreshData() {
    var _voucherFilterVM = new ReportCustomer();
    _voucherFilterVM.employeeId = this.EmployeeId;
    var obj = _voucherFilterVM;
    this.financialCovenantService
      .SearchCustodyVoucher(obj)
      .subscribe((data) => {
        this.projectsDataSource = new MatTableDataSource(data.result);
        this.projectsDataSourceTemp = data.result;
        this.projectsDataSource.paginator = this.paginator;
        this.projectsDataSource.sort = this.sort;
      });
  }

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    const tempsource = this.projectsDataSourceTemp.filter(function (d: any) {
      return (
        d.employeeName?.toString().trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.itemName?.toString().trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.itemPrice?.toString().trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.date?.toString().trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.invoiceNumber?.toString().trim().toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    this.projectsDataSource = new MatTableDataSource(tempsource);
    this.projectsDataSource.paginator = this.paginator;
    this.projectsDataSource.sort = this.sort;
  }

  RowInvoiceData: any;

  selectedDateType = DateType.Hijri;

  WhichTypeAddEditView: number = 1;
  RowEntryVouvherData: any;
  selectedAccountRowTable: any;
  selectedCostCenterRowTable: any;
  open(content: any, data?: any, type?: any, idRow?: any) {
    if (data && type == 'edit') {
      this.modalDetails = data;
      this.modalDetails['id'] = 1;
    }

    if (data) {
      this.RowInvoiceData = data;
    }
    if (type == 'accountingentryModal') {
      this.GetAllJournalsByDailyID_Custody(data.invoiceId);
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
    } else if (type == 'EditopeningDocumentModal') {
      this.WhichTypeAddEditView = 2;
      this.EditEntryVoucherPopup(data);
    } else if (type == 'ViewopeningDocumentModal') {
      this.WhichTypeAddEditView = 3;
      this.EditEntryVoucherPopup(data);
    } else if (type == 'DeleteVoucherModal') {
      this.voucheriddeleted = data.invoiceId;
    }
    this.modalService
      // .open(content, {
      //   ariaLabelledBy: 'modal-basic-title',
      //   size: type == 'runningTasksModal' ? 'xxl' : 'xl' ,
      //   centered: type ? false : true
      // })

      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
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

  OrganizationData: any;
  environmentPho: any;
  dateprint: any;
  datePrintJournals: any = new Date();
  AllJournalEntries: any = [];
  GetAllJournalsByDailyID_Custody(invid: any) {
    this.financialCovenantService
      .GetAllJournalsByDailyID_Custody(invid)
      .subscribe((data) => {
        this.AllJournalEntries = data.result;
      });
  }

  get totaldepit() {
    var sum = 0;
    this.AllJournalEntries.forEach((element: any) => {
      sum =
        +parseFloat(sum.toString()).toFixed(2) +
        +parseFloat(element.depit.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }

  get totalcredit() {
    var sum = 0;
    this.AllJournalEntries.forEach((element: any) => {
      sum =
        +parseFloat(sum.toString()).toFixed(2) +
        +parseFloat(element.credit.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }

  PrintJournalsVyInvIdRetPurchase() {
    if (this.AllJournalEntries.length > 0) {
      this.print.print('reportaccountingentryModal', environment.printConfig);
    }
  }

  InvoicesObjs: Invoices[] = [];
  invoice: any;
  public _invoices: Invoices;
  PostBack_Func(modal: any) {
    this.InvoicesObjs = [];
    this.InvoicesObjs.push(this.RowInvoiceData);

    // var invoicesList: any = [];

    // this.InvoicesObjs.forEach((element: any) => {
    //   this._invoices = new Invoices();
    //   this._invoices.invoiceId = element.invoiceId;
    //   this._invoices.type = element.type;
    //   invoicesList.push(this._invoices);
    // });

    this.financialCovenantService
      .PostBackVouchersCustody(this.InvoicesObjs)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.InvoicesObjs = [];
          modal?.dismiss();
          this.GetSomeCustodyVoucher();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  // =============================================
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
    custodyId: 0,
    CustodyValue: 0,
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
      TotalCredit: 0,
      CustodyValue: 0,
      custodyId: 0,
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
      CustodyValue: 0,
      custodyId: 0,
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
    this.modalEntryVoucher.CustodyValue = data.itemPrice;
    (this.modalEntryVoucher.custodyId = data.custodyId),
      this.GetBranch_Costcenter();
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
  EditEntryVoucherPopup(el: any) {
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
      CustodyValue: 0,
      custodyId: 0,
      TotalDepit: 0,
      diff: 0,
      WhichClick: 1,
      addUser: null,
      addDate: null,
      addedImg: null,
    };
    this.EntryVoucherDetailsRows = [];
    this.financialCovenantService
      .GetInvoiceById(el.invoiceId)
      .subscribe((data: any) => {
        var TotalCredit = 0;
        var TotalDepit = 0;
        if (data?.result?.transactions.length > 0) {
          data?.result?.transactions.forEach((element: any) => {
            var Credit = 0;
            var Depit = 0;
            if (element.depit < element.credit) {
              Credit = parseFloat(element.credit);
              Depit = 0;
              TotalCredit = TotalCredit + Credit;
            }
            if (element.credit < element.depit) {
              Credit = 0;
              Depit = element.depit;
              TotalDepit = TotalDepit + Depit;
            }
            var maxVal = 0;
            if (this.EntryVoucherDetailsRows.length > 0) {
              maxVal = Math.max(
                ...this.EntryVoucherDetailsRows.map(
                  (o: { idRow: any }) => o.idRow
                )
              );
            } else {
              maxVal = 0;
            }
            this.EntryVoucherDetailsRows?.push({
              idRow: maxVal + 1,
              Amounttxt: element.amount,
              AccJournalid: element.accountId,
              accountJournaltxt: element.accountName,
              CreditDepitStatus: Credit > Depit ? 'C' : 'D',
              CostCenterId: element.costCenterId,
              CostCenterName: element.costCenterName,
              Notes: element.notes,
              InvoiceReference: element.invoiceReference,
              AccCalcExpen: element.accCalcExpen,
              AccCalcIncome: element.accCalcIncome,
            });
          });
          this.modalEntryVoucher.TotalCredit = parseFloat(
            TotalCredit.toString()
          ).toFixed(2);
          this.modalEntryVoucher.TotalDepit = parseFloat(
            TotalDepit.toString()
          ).toFixed(2);
          this.modalEntryVoucher.diff = parseFloat(
            (TotalDepit - TotalCredit).toString()
          ).toFixed(2);

          this.modalEntryVoucher = {
            InvoiceId: data?.result?.invoiceId,
            InvoiceNumber: data?.result?.invoiceNumber,
            JournalNumber: data?.result?.journalNumber,
            Date: this.sharedService.String_TO_date(data?.result?.date),
            HijriDate: null,
            Notes: data?.result?.notes,
            InvoiceNotes: data?.result?.invoiceNotes,
            Type: 10,
            InvoiceValue: 0,
            InvoiceReference: data?.result?.invoiceReference,
            VoucherAdjustment: data?.result?.voucherAdjustment,
            DunCalc: data?.result?.dunCalc,
            CostCenterId: data?.result?.costCenterId,
            Reference: null,
            WhichClick: 1,
            addUser: data?.result?.addUser,
            addDate: data?.result?.addDate,
            addedImg: data?.result?.addInvoiceImg,
            CustodyValue: el.itemPrice,
            custodyId: el.custodyId,
          };
          this.CalculateEntryVoucher();
        } else {
          this.EntryVoucherDetailsRows = [];
        }
      });
    // this.objOfInvoices = []
    this.objOfInvoices = el;
    this.FillCostCenterSelect();
    this.FillSubAccountLoadTable();
    this.gethigridate();
  }

  saveEntryVoucher(modal: any) {
    if (
      this.modalEntryVoucher.TotalCredit != this.modalEntryVoucher.CustodyValue
    ) {
      this.toast.error('يجب ان يكون مبلغ العهدة مطابق للقيد', this.translate.instant("Message"));
      return;
    }

    if (
      !(
        parseInt(this.modalEntryVoucher.TotalDepit) > 0 &&
        parseInt(this.modalEntryVoucher.diff) == 0
      )
    ) {
      this.toast.error('من فضلك أدخل قيم صحيحة للقيد', this.translate.instant("Message"));
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
      this.toast.error('قيد غير متوازن', this.translate.instant("Message"));
    }
    this.disableButtonSave_EntryVoucher = true;
    setTimeout(() => {
      this.disableButtonSave_EntryVoucher = false;
    }, 7000);
    this.financialCovenantService.SaveandPostDailyVoucher(VoucherObj).subscribe(
      (result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetSomeCustodyVoucher();
          this.SaveCustodyVoucher(result.returnedParm);
          this.resetEntryData();
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
  SaveCustodyVoucher(id: any) {
    const prames = {
      CustodyId: this.modalEntryVoucher.custodyId,
      InvoiceId: id,
      Type: 2,
    };
    this.financialCovenantService.SaveCustodyVoucher(prames).subscribe(
      (result: any) => {
        this.GetSomeCustodyVoucher();
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }

  confirmEntryVoucher(modal: any) {
    this.openingEntrtyService
      .DeleteVoucher(this.RowEntryVouvherData.invoiceId)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.LoadDataEntryVoucher();
          modal?.dismiss();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  printDailyVoucherReport_Custody(element: any) {
    this.financialCovenantService
      .DailyVoucherReport_Custody(element.invoiceId)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          var link = environment.PhotoURL + result.reasonPhrase;
          window.open(link, '_blank');
          console.log(result);
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  PostVouchers(modal: any) {
    let parems = [];
    parems.push(this.objOfInvoices);
    this.financialCovenantService.PostVouchersCustody(parems).subscribe(
      (result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetSomeCustodyVoucher();
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
  voucheriddeleted: any;
  DeletedVoucherObjId: any;
  DeleteVoucher(modal: any) {
    this.financialCovenantService
      .DeleteVoucher(this.voucheriddeleted)
      .subscribe(
        (data: any) => {
          if (data.statusCode == 200) {
            this.toast.success(
              this.translate.instant(data.reasonPhrase),
              this.translate.instant('Message')
            );
            modal.dismiss();
            this.GetSomeCustodyVoucher();
          } else {
            this.toast.error(
              this.translate.instant(data.reasonPhrase),
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
  // ===========================

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
    console.log('Row saved: ' + rowIndex);
    console.log(row);
  }

  // Delete row
  delete(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    this.rows.splice(rowIndex, 1);
    console.log('Row deleted: ' + rowIndex);
  }

  selectGoalForProject(index: any) {}

  addNewMission() {}

  onSort(event: any) {
    console.log(event);
  }
  // ############### send sms

  data: any = {
    type: '0',
    orgEmail: 'asdwd@dwa',
    numbers: {
      all: 0,
      citizens: 0,
      investor: 0,
      government: 0,
    },
    fileType: {
      NameAr: '',
      Id: '',
      NameEn: '',
    },
    files: [],
    clients: [],
    branches: [],
    cities: [],
    filesTypes: [],
  };
  modal?: BsModalRef;
  sendEMAIL(sms: any) {
    console.log(sms);
    this.control.clear();
    this.modal?.hide();
  }

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
  public uploadedFiles: Array<File> = [];

  sendSMS(sms: any) {
    console.log(sms);
    this.modal?.hide();
  }

  // selection in table

  selection = new SelectionModel<any>(true, []);
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.projectsDataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.projectsDataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
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

  existValue: any = false;
}
