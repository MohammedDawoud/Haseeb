import { Component, OnInit, ViewChild } from '@angular/core';
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

// import { PayVoucherService } from 'src/app/core/services/acc_Services/pay-voucher.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SharedService } from 'src/app/core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { VoucherFilterVM } from 'src/app/core/Classes/ViewModels/voucherFilterVM';
import { PayVoucherService } from 'src/app/core/services/acc_Services/pay-voucher.service';
import { ReceiptService } from 'src/app/core/services/acc_Services/receipt.service';
import { Acc_Clauses } from 'src/app/core/Classes/DomainObjects/acc_Clauses';
import { Acc_Suppliers } from 'src/app/core/Classes/DomainObjects/acc_Suppliers';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import { Invoices } from 'src/app/core/Classes/DomainObjects/invoices';
import { VoucherDetails } from 'src/app/core/Classes/DomainObjects/voucherDetails';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { NgxPrintElementService } from 'ngx-print-element';
import { RestApiService } from 'src/app/shared/services/api.service';
import printJS from 'print-js';
import { InvoiceService } from 'src/app/core/services/acc_Services/invoice.service';
const hijriSafe = require('hijri-date/lib/safe');
const HijriDate = hijriSafe.default;
const toHijri = hijriSafe.toHijri;

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],
  providers: [DatePipe],
})
export class ReceiptComponent implements OnInit {
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
  pathurl = environment.PhotoURL;
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
      ar: 'سند صرف ',
      en: 'receipt',
    },
  };

  selectedUser: any;
  users: any;

  closeResult = '';

  showStats = false;
  showFilters = false;
  showTable = false;

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
  // @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

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
    'select',
    'BondNumber',
    'BondDate',
    'BondTotal',
    'PaymentType',
    'BondCondition',
    'PurchaseInvoiceNumber',
    'RegistrationNumber',
    'PostingDate',
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
    // private api: RestApiService,
    // private router: Router,
    private _payvoucherservice: PayVoucherService,
    private receiptService: ReceiptService,
    // private formBuilder: FormBuilder,
    private formBuilder: FormBuilder,
    private _invoiceService: InvoiceService,
    private _sharedService: SharedService,
    private translate: TranslateService,
    private toast: ToastrService,
    private _accountsreportsService: AccountsreportsService,
    private authenticationService: AuthenticationService,
    private datePipe: DatePipe,
    private print: NgxPrintElementService,
    private api: RestApiService
  ) {
    this.userG = this.authenticationService.userGlobalObj;
    this.GetBranchByBranchIdCheck();

    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();
    api.lang.subscribe((res) => {
      this.lang = res;
    });
    this.userG = this.authenticationService.userGlobalObj;
  }

  TaxCodeCheck:boolean=false
  GetBranchByBranchIdCheck(){
    this._invoiceService.GetBranchByBranchIdCheck().subscribe(data=>{
      debugger
      if(!(data.result.taxCode=="" || data.result.taxCode==null))
      {
        this.TaxCodeCheck=true;
      }
      else
      {
        this.TaxCodeCheck=false;
        this.toast.error(this.translate.instant("من فضلك قم بحفظ اعدادات الفرع و تأكد من الرقم الضريبي للفرع"),this.translate.instant('Message'));
      }
    });
  }

  ngOnInit(): void {
    this.users = [
      { id: 1, Name: 'محمود نافع' },
      { id: 2, Name: 'محمود نافع' },
    ];
    this.GetAllVouchersLastMonth();
    this.FillBankSelect();
    this.FillCostCenterSelect();
    this.FillClausesSelect();
    this.FillCitySelect();
    this.FillSuppliersSelect2();
    this.GetLayoutReadyVm();

    // this.projectsDataSource = new MatTableDataSource(this.projects);

    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );

    this.projectGoalsDataSource = new MatTableDataSource(this.projectGoals);

    this.projectUsersDataSource = new MatTableDataSource(this.projectUsers);

    this.projectTasksDataSource = new MatTableDataSource(this.projectTasks);
    this.dataSource.sort = this.sort;
  }

  datafilter: any = {
    enable: false,
    VoucherNo: null,
    InvoiceNote: null,
    Datefilter: null,
    DateFrom: null,
    DateTo: null,
    deportationStatusId: null,
    CustomerId: null,
    IsPost: null,
    Type: 5,
    isSearch: false,
    isChecked: false,
  };
  reset() {
    this.datafilter.VoucherNo = null;
    this.datafilter.InvoiceNote = null;
    this.datafilter.Datefilter = null;
    this.datafilter = {
      enable: false,
      VoucherNo: null,
      InvoiceNote: null,
      Datefilter: null,
      DateFrom: null,
      DateTo: null,
      deportationStatusId: null,
      CustomerId: null,
      IsPost: null,
      Type: 5,
      isSearch: false,
      isChecked: false,
    };
    if (this.showFilters == true) {
      this.datafilter.isSearch = true;
    } else {
      this.datafilter.isSearch = true;
    }
  }

  deportationStatusList = [
    {
      id: 1,
      name: 'Deported',
    },
    {
      id: 2,
      name: 'Not carried over',
    },
  ];
  GetAllVouchersList: any;
  VoucherType: any = 5;
  Loadvouchers() {
    debugger;
    if (this.showTable == true) {
      this.GetAllVouchers();
    } else {
      this.GetAllVouchersLastMonth();
    }
  }
  ResetSearchTime() {
    if (!this.data.enable) {
      // this.RefreshData_ByDate("", "");
    } else {
      // this.RefreshData_ByDate(this.data.filter.DateFrom_P ?? "", this.data.filter.DateTo_P ?? "");
    }
  }
  CheckDate(event: any) {
    if (event != null) {
      this.datafilter.DateFrom = this._sharedService.date_TO_String(event[0]);
      this.datafilter.DateTo = this._sharedService.date_TO_String(event[1]);
      this.datafilter.isChecked = true;
      this.GetAllVouchers();
    }
  }

  GetAllVouchers() {
    // var _voucherFilterVM=new VoucherFilterVM();
    // _voucherFilterVM.type=this.VoucherType;
    // _voucherFilterVM.isSearch=false;
    // var obj=_voucherFilterVM;
    this.receiptService.GetAllVouchers(this.datafilter).subscribe((data) => {
      this.projectsDataSource = new MatTableDataSource(data);
      this.GetAllVouchersList = data;

      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
      console.log('alldata', data);
    });
  }
  GetAllVouchersLastMonth() {
    var _voucherFilterVM = new VoucherFilterVM();
    _voucherFilterVM.type = this.VoucherType;
    var obj = _voucherFilterVM;

    this._payvoucherservice.GetAllVouchersLastMonth(obj).subscribe((data) => {
      this.projectsDataSource = new MatTableDataSource(data);
      this.GetAllVouchersList = data;

      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
      console.log('alldata', data);
    });
  }

  Voucherssearchtext(event: Event) {
    debugger;
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectsDataSource.filter = filterValue.trim().toLowerCase();
  }
  //#region ADD PayVoucher
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  modalType = 0;
  submitted = true;
  userG: any = {};
  saveandpost: any;
  public uploadedFiles: Array<File> = [];
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
  @ViewChild('EditCheckDetailsModal') EditCheckDetailsModal: any;
  CheckDetailsForm: FormGroup;
  transferNumber: boolean = false;
  Toaccount: any;
  hijriDate: any = { year: 1455, month: 4, day: 20 };
  selectedDateType = DateType.Hijri;
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
    const DateHijri = toHijri(new Date());
    var DateGre = new HijriDate(
      DateHijri._year,
      DateHijri._month,
      DateHijri._date
    );
    DateGre._day = DateGre._date;

    this.vouchermodel.invoiceId = 0;
    this.vouchermodel.invoiceNumber = null;
    this.vouchermodel.journalNumber = null;
    this.vouchermodel.date = new Date();
    this.vouchermodel.hijriDate = DateGre;
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

  FillCustAc(add: any) {
    debugger;
    var PayType = this.vouchermodel.payType;
    this.checkdetailsList = [];

    if (PayType == 1) {
      this.FillCustAccountsSelect2(1);
    } else if (PayType == 2 || PayType == 6) {
      this.FillCustAccountsSelect2(6);
      if (add == false) {
        this.open(
          this.EditCheckDetailsModal,
          '',
          'EditCheckDetailsModal',
          'newCheckDetails'
        );
      }
    } else if (PayType == 3) {
      this.FillCustAccountsSelect2(4);
    } else if (PayType == 4) {
      this.FillCustAccountsSelect2(5);
    } else if (PayType == 5) {
      this.FillCustAccountsSelect2(6);
    } else if (PayType == 9) {
      this.FillCustAccountsSelect2(9);
    } else if (PayType == 15) {
      this.FillCustAccountsSelect2(15);
    } else if (PayType == 16) {
      this.FillCustAccountsSelect2(16);
    } else if (PayType == 17) {
      this.FillCustAccountsSelect2(17);
      if (add == false) {
        this.open(
          this.EditCheckDetailsModal,
          '',
          'EditCheckDetailsModal',
          'newCheckDetails'
        );
      }
    } else {
      this.FillCustAccountsSelect2(0);
    }
  }

  FillCustAccountsSelect2listTO: any;
  FillSubAccountLoad() {
    this.receiptService.FillSubAccountLoadNotMain_Branch().subscribe((data) => {
      this.FillCustAccountsSelect2listTO = data.result;
    });
  }
  FillCustAccountsSelect2listFROM: any;
  FillCustAccountsSelect2(PayTypeId: any) {
    this.receiptService.FillCustAccountsSelect2(PayTypeId).subscribe((data) => {
      this.Toaccount = data;
    });
  }

  costCentersList: any;
  FillCostCenterSelect() {
    this._accountsreportsService.FillCostCenterSelect().subscribe((data) => {
      this.costCentersList = data;
    });
  }

  BankSelectList: any;
  FillBankSelect() {
    this.receiptService.FillBankSelect().subscribe((data) => {
      this.BankSelectList = data;
    });
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
  checkdetailsList: any = [];
  checkdetailsTabel(modal?: any) {
    debugger;
    this.BankSelectList.forEach((element: any) => {
      if (element.id == this.CheckDetailsForm.controls['BankId'].value)
        this.CheckDetailsForm.controls['bankName'].setValue(element.name);
    });

    if (
      this.CheckDetailsForm.controls['dateCheck_transfer'].value != null &&
      typeof this.CheckDetailsForm.controls['dateCheck_transfer'].value !=
        'string'
    ) {
      var date = this._sharedService.date_TO_String(
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

  FieldsEnable(status: any) {}
  TaxCheckEnable() {}
  TaxCheckDisabled() {}
  GetALLOrgData() {}

  //Date-Hijri
  ChangeReceiptVoucherGre(event: any) {
    if (event != null) {
      const DateHijri = toHijri(this.vouchermodel.date);
      var DateGre = new HijriDate(
        DateHijri._year,
        DateHijri._month,
        DateHijri._date
      );
      DateGre._day = DateGre._date;
      this.vouchermodel.hijriDate = DateGre;
    } else {
      this.vouchermodel.hijriDate = null;
    }
  }
  ChangeReceiptVoucherHijri(event: any) {
    if (event != null) {
      const DateGre = new HijriDate(event.year, event.month, event.day);
      const dayGreg = DateGre.toGregorian();
      this.vouchermodel.date = dayGreg;
    } else {
      this.vouchermodel.date = null;
    }
  }

  GetBranch_Costcenter() {
    this._payvoucherservice.GetBranch_Costcenter().subscribe({
      next: (data: any) => {
        debugger;
        this.vouchermodel.CostCenterId = data.result.costCenterId;
      },
      error: (error) => {},
    });
  }

  GenerateVoucherNumber() {
    this._payvoucherservice
      .GenerateVoucherNumber(this.VoucherType)
      .subscribe((data) => {
        debugger;
        this.vouchermodel.invoiceNumber = data.reasonPhrase;
      });
  }

  FillCustAccountsSelect(type: any) {
    this._payvoucherservice.FillCustAccountsSelect2(type).subscribe((data) => {
     
      this.Toaccount = data;
    });
  }
  addUser: any;
  addDate: any;
  addInvoiceImg: any;
  editvouccher(data: any) {
    this.resetvouchermodel();
    const DateHijri = toHijri(this._sharedService.String_TO_date(data.date));
    var DateGre = new HijriDate(
      DateHijri._year,
      DateHijri._month,
      DateHijri._date
    );
    DateGre._day = DateGre._date;
    this.vouchermodel.invoiceNumber = data.invoiceNumber;
    this.vouchermodel.date = this._sharedService.String_TO_date(data.date);
    this.vouchermodel.hijriDate = DateGre;
    this.vouchermodel.notes = data.notes;
    this.vouchermodel.invoiceNotes = data.invoiceNotes;
    var VoucherValue = data.invoiceValue;
    var TaxValue = 0;
    //var VoucherTotalValue = $('#receiptVoucherGrid').DataTable().row($(this).closest('tr')).data().TotalValue;
    this.vouchermodel.journalNumber = data.journalNumber;
    var voucherId = parseInt(data.invoiceId);
    this.vouchermodel.invoiceId = voucherId;

    // this.vouchermodel.supplierInvoiceNo=data.supplierInvoiceNo;
    this.vouchermodel.supplierInvoiceNo = data.supplierInvoiceNo;
    this.vouchermodel.recevierTxt = data.recevierTxt;
    this.vouchermodel.invoiceReference = data.invoiceReference;
    this.vouchermodel.invoiceValue = data.invoiceValue;
    this.vouchermodel.reVoucherNValueText = data.invoiceValueText;

    if (parseInt(data.invoiceValue) == parseInt(data.totalValue)) {
      debugger;

      if (data.taxAmount != null) {
        this.vouchermodel.valuebefore = parseFloat(
          (
            parseFloat(data.invoiceValue.toString()) -
            parseFloat(data.taxAmount.toString())
          ).toString()
        ).toFixed(this.DigitalNumGlobal);
      } else {
        this.vouchermodel.valuebefore = parseFloat(data.invoiceValue).toFixed(
          this.DigitalNumGlobal
        );
      }
    } else {
      this.vouchermodel.valuebefore = parseFloat(data.invoiceValue).toFixed(
        this.DigitalNumGlobal
      );
    }

    this.vouchermodel.taxAmount = data.taxAmount;
    this.vouchermodel.valueafter = data.totalValue;
    if (parseFloat(data.taxAmount).toFixed(2).toString() == '0.00') {
      this.Taxchechdisabl = false;

      this.vouchermodel.taxcheck1 = true;
    } else {
      this.Taxchechdisabl = false;

      this.vouchermodel.taxcheck1 = false;
    }

    var DunCalcV = data.dunCalc;
    debugger;
    if (DunCalcV == true) {
      this.vouchermodel.dunCalc = true;
    } else {
      this.vouchermodel.dunCalc = false;
    }

    var taxType =
      parseInt(data.totalValue) === parseInt(data.tnvoiceValue) ? 3 : 2;
    this.vouchermodel.taxtype = taxType;

    this.vouchermodel.clauseId = data.clauseId;
    this.vouchermodel.supplierId = data.supplierId;

    if (data.addDate != null) {
      this.addUser = data.addUser;
      this.addDate = data.addDate;
      if (data.addInvoiceImg != '' && data.addInvoiceImg != null) {
        this.addInvoiceImg = data.addInvoiceImg;
      }
    }

    this.GetTaxNoBySuppId(data.supplierId);

    var payType = parseInt(data.payType);
    this.vouchermodel.payType = payType;

    //payFlagselectClick(1)
    this.FillSubAccountLoad();
    if (payType == 1) {
      this.FillCustAccountsSelect2(1);
    } else if (payType == 2 || payType == 6) {
      this.FillCustAccountsSelect2(6);
    } else if (payType == 3) {
      this.FillCustAccountsSelect2(4);
    } else if (payType == 4) {
      this.FillCustAccountsSelect2(5);
    } else if (payType == 5) {
      this.FillCustAccountsSelect2(6);
    } else if (payType == 9) {
      this.FillCustAccountsSelect2(9);
    } else if (payType == 15) {
      this.FillCustAccountsSelect2(15);
    } else if (payType == 16) {
      this.FillCustAccountsSelect2(16);
    } else if (payType == 17) {
      this.FillCustAccountsSelect2(17);
    } else {
      this.FillCustAccountsSelect2(0);
    }

    this._payvoucherservice
      .GetAllDetailsByVoucherId(voucherId)
      .subscribe((data2) => {
        debugger;

        this.vouchermodel.toAccountId = data2.result[0].toAccountId;
        this.vouchermodel.CostCenterId = data2.result[0].costCenterId;
        this.vouchermodel.accountId = data2.result[0].accountId;
        this.vouchermodel.notes = data2.result[0].description;
        this.getaccountcode(data2.result[0].accountId, 2);
        this.getaccountcode(data2.result[0].toAccountId, 1);

        this.vouchermodel.amount = data2.result[0].amount;
        this.vouchermodel.taxtype = data2.result[0].taxType;
        this.vouchermodel.taxAmount = data2.result[0].taxAmount;

        this.vouchermodel.totalAmount = data2.result[0].totalAmount;
        this.vouchermodel.payType = data2.result[0].payType;

        this.vouchermodel.referenceNumber = data2.result[0].referenceNumber;

        if (
          data2.result[0].payType == 2 ||
          data2.result[0].payType == 6 ||
          data2.result[0].payType == 17
        ) {
          this.CheckDetailsIntial();

          if (data2.result[0].payType == 2) {
            this.CheckDetailsForm.controls['paymenttypeName'].setValue('شيك');
            this.CheckDetailsForm.controls['Check_transferNumber'].setValue(
              data2.result[0].checkNo
            );
            this.CheckDetailsForm.controls['dateCheck_transfer'].setValue(
              new Date(data2.result[0].checkDate)
            );
            this.CheckDetailsForm.controls['BankId'].setValue(
              data2.result[0].bankId
            );
            this.CheckDetailsForm.controls['bankName'].setValue(
              data2.result[0].bankName
            );
          } else if (data2.result[0].payType == 6) {
            this.CheckDetailsForm.controls['paymenttypeName'].setValue('حوالة');
            this.CheckDetailsForm.controls['Check_transferNumber'].setValue(
              data2.result[0].moneyOrderNo
            );
            this.CheckDetailsForm.controls['dateCheck_transfer'].setValue(
              new Date(data2.result[0].moneyOrderDate)
            );
            this.CheckDetailsForm.controls['BankId'].setValue(
              data2.result[0].bankId
            );
            this.CheckDetailsForm.controls['bankName'].setValue(
              data2.result[0].bankName
            );
          } else if (data2.result[0].payType == 17) {
            this.CheckDetailsForm.controls['paymenttypeName'].setValue(
              'نقاط بيع'
            );
            this.CheckDetailsForm.controls['Check_transferNumber'].setValue(
              data2.result[0].moneyOrderNo
            );
            this.CheckDetailsForm.controls['dateCheck_transfer'].setValue(
              new Date(data2.result[0].moneyOrderDate)
            );
            this.CheckDetailsForm.controls['BankId'].setValue(
              data2.result[0].bankId
            );
            this.CheckDetailsForm.controls['bankName'].setValue(
              data2.result[0].bankName
            );
          }
          this.checkdetailsTabel();
        }
      });
  }

  GetTaxNoBySuppId(suppid: any) {
    this._payvoucherservice.GetTaxNoBySuppId(suppid).subscribe((data) => {
      this.vouchermodel.supplierTaxID = data ?? '';
    });
  }

  saveandpostvoucher() {
    debugger;
    console.log('voucher', this.vouchermodel);

    if (
      this.vouchermodel.date == null ||
      this.vouchermodel.invoiceValue == null ||
      this.vouchermodel.toAccountId == null ||
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
    }
    var VoucherDetailsList = [];
    var VoucherObj = new Invoices();
    VoucherObj.invoiceId = this.vouchermodel.invoiceId;
    VoucherObj.invoiceNumber = this.vouchermodel.invoiceNumber;
    VoucherObj.journalNumber = this.vouchermodel.journalNumber;

    if (this.vouchermodel.date != null) {
      VoucherObj.date = this._sharedService.date_TO_String(
        this.vouchermodel.date
      );
      const nowHijri = toHijri(this.vouchermodel.date);
      VoucherObj.hijriDate = this._sharedService.hijri_TO_String(nowHijri);
    }

    VoucherObj.notes = this.vouchermodel.notes;
    VoucherObj.invoiceNotes = this.vouchermodel.invoiceNotes;
    VoucherObj.type = this.VoucherType;
    VoucherObj.invoiceValue = this.vouchermodel.invoiceValue;
    VoucherObj.taxAmount = this.vouchermodel.taxAmount;
    VoucherObj.totalValue = this.vouchermodel.valueafter;

    VoucherObj.toAccountId = this.vouchermodel.toAccountId;
    VoucherObj.invoiceReference = this.vouchermodel.invoiceReference;

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
    VoucherDetailsObj.referenceNumber = this.vouchermodel.referenceNumber;
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
    console.log(VoucherObj);
    if (this.ReceiptSSaveType == 2) {
      this._payvoucherservice.SaveandPostVoucherP(VoucherObj).subscribe(
        (data) => {
          if (this.uploadedFiles.length > 0) {
            this.savefile(data.returnedParm);
            this.GetAllVouchersLastMonth();
            this.ReceiptSVoucherModelPublic.dismiss();
            this.toast.success(
              this.translate.instant(data.reasonPhrase),
              this.translate.instant('Message')
            );
          } else {
            this.GetAllVouchersLastMonth();
            this.ReceiptSVoucherModelPublic.dismiss();

            this.toast.success(
              this.translate.instant(data.reasonPhrase),
              this.translate.instant('Message')
            );
          }
          if (
            this.vouchermodel.supplierInvoiceNo != null &&
            this.vouchermodel.supplierInvoiceNo != ''
          ) {
            this.UpdateStoreid(this.vouchermodel.supplierInvoiceNo);
          }
        },
        (error) => {
          this.toast.error(
            this.translate.instant(error.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      );
    } else {
      this._payvoucherservice.SaveVoucherP(VoucherObj).subscribe(
        (data) => {
          if (this.uploadedFiles.length > 0) {
            this.savefile(data.returnedParm);
            this.GetAllVouchersLastMonth();
            this.ReceiptSVoucherModelPublic.dismiss();

            this.toast.success(
              this.translate.instant(data.reasonPhrase),
              this.translate.instant('Message')
            );
          } else {
            this.GetAllVouchers();
            this.ReceiptSVoucherModelPublic.dismiss();

            this.toast.success(
              this.translate.instant(data.reasonPhrase),
              this.translate.instant('Message')
            );
          }
          if (
            this.vouchermodel.supplierInvoiceNo != null &&
            this.vouchermodel.supplierInvoiceNo != ''
          ) {
            this.UpdateStoreid(this.vouchermodel.supplierInvoiceNo);
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
  }

  saveandpostvoucher2(modal: any) {
    debugger;
    var list: any = [];
    list.push(this.vouchermodel.invoiceId.toString());
    this.receiptService.PostVouchersCheckBox(list).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          modal.dismiss();
          this.GetAllVouchersLastMonth();
          this.toast.success(
            this.translate.instant('Deported'),
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

  saveandpostvoucher22(modal: any) {
    debugger;
    console.log('voucher', this.vouchermodel);

    if (
      this.vouchermodel.date == null ||
      this.vouchermodel.invoiceValue == null ||
      this.vouchermodel.toAccountId == null ||
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
    }
    var VoucherDetailsList = [];
    var VoucherObj = new Invoices();
    VoucherObj.invoiceId = this.vouchermodel.invoiceId;
    VoucherObj.invoiceNumber = this.vouchermodel.invoiceNumber;
    VoucherObj.journalNumber = this.vouchermodel.journalNumber;
    if (this.vouchermodel.date != null) {
      VoucherObj.date = this._sharedService.date_TO_String(
        this.vouchermodel.date
      );
      const nowHijri = toHijri(this.vouchermodel.date);
      VoucherObj.hijriDate = this._sharedService.hijri_TO_String(nowHijri);
    }
    VoucherObj.notes = this.vouchermodel.notes;
    VoucherObj.invoiceNotes = this.vouchermodel.invoiceNotes;
    VoucherObj.type = this.VoucherType;
    VoucherObj.invoiceValue = this.vouchermodel.invoiceValue;
    VoucherObj.taxAmount = this.vouchermodel.taxAmount;
    VoucherObj.totalValue = this.vouchermodel.valueafter;

    VoucherObj.toAccountId = this.vouchermodel.toAccountId;
    VoucherObj.invoiceReference = this.vouchermodel.invoiceReference;

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
    VoucherDetailsObj.referenceNumber = this.vouchermodel.referenceNumber;
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
    console.log(VoucherObj);
    this.receiptService.SaveVoucher(VoucherObj).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          if (this.uploadedFiles.length > 0) {
            this.savefile(data.returnedParm);
          }

          this.PostVouchers(data.returnedParm);

          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
          modal.dismiss();
          this.GetAllVouchersLastMonth();
          this.submitted == false;
        } else {
          this.submitted == false;
          this.toast.error(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        }
        if (
          this.vouchermodel.supplierInvoiceNo != null &&
          this.vouchermodel.supplierInvoiceNo != ''
        ) {
          this.UpdateStoreid(this.vouchermodel.supplierInvoiceNo);
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

  PostVouchers(id: any) {
    this.receiptService.GetAllDetailsByVoucherId(id).subscribe((data) => {
      this.receiptService.PostVouchers(data.result).subscribe(
        (data) => {
          if (data.statusCode == 200) {
            this.toast.success(
              this.translate.instant(data.reasonPhrase),
              this.translate.instant('Message')
            );
            this.GetAllVouchersLastMonth();
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
    });
  }

  savefile(id: any) {
    const formData = new FormData();
    // if (this.selectedFiles) {
    //   const file: File | null = this.selectedFiles.item(0);

    //   if (file) {
    //     this.currentFile = file;
    //     formData.append('UploadedFile', this.currentFile);
    //   }
    //   else {
    //     this.currentFile = undefined;
    //   }
    // }
    // formData.append('InvoiceId', id);

    formData.append('UploadedFile', this.uploadedFiles[0]);
    formData.append('InvoiceId', id);
    this.receiptService.UploadPayVoucherImage(formData).subscribe((data) => {
      this.GetAllVouchersLastMonth();
    });
  }
  // totalInvoices:any=0;
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

  invoiceValuechange() {
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

  Taxckeck1Change() {
    debugger;
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
        debugger;
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

  getaccountcode(accountid: any, type: any) {
    debugger;
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

  downloadFile(data: any) {
    try {
      var link = environment.PhotoURL + data.fileUrl;
      window.open(link, '_blank');
    } catch (error) {
      this.toast.error('تأكد من الملف', 'رسالة');
    }
  }

  getpayType(id: any) {
    var PrintJournalsByPayTypeName = '';
    this.PayTypeList.forEach((element: any) => {
      if (element.id == id) {
        PrintJournalsByPayTypeName = element.name;
      }
    });
    return this.translate.instant(PrintJournalsByPayTypeName);
  }

  OrganizationData: any;
  dateprint: any;
  environmentPho: any;
  printprojectsDataSource: any = [];
  getPrintdata(id: any) {
    // this.receiptService.Printdiffrentvoucher(this.datafilter).subscribe(
    //   (data) => {

    //     this.printprojectsDataSource = data;

    //     setTimeout(() => {
    //       this.print.print(id, environment.printConfig);
    //     }, 500);
    //   },
    //   (error) => {
    //   }
    // );

    var obj = this.datafilter;
    this.receiptService.Printdiffrentvoucher(obj).subscribe((data) => {
      var PDFPath = environment.PhotoURL + data.reasonPhrase;
      printJS({ printable: PDFPath, type: 'pdf', showModal: true });
    });
  }
  items: any = [1, 2, 3, 4, 5, 6, 7, 8];

  EntryVoucherPrintData: any = null;
  CustomData: any;
  @ViewChild('printDivModal') printDivModal: any;

  GetReport(obj: any) {
    this.receiptService.GetReport(obj.invoiceId).subscribe((data) => {
      this.EntryVoucherPrintData = data;
      if (this.EntryVoucherPrintData?.org_VD.logoUrl)
        this.CustomData =
          environment.PhotoURL + this.EntryVoucherPrintData?.org_VD.logoUrl;
      else this.CustomData = null;

      this.open(this.printDivModal);
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //#endregion
  DigitalNumGlobal: any;
  GetLayoutReadyVm() {
    debugger;
    this._payvoucherservice.GetLayoutReadyVm().subscribe((data) => {
      debugger;
      if (data.decimalPoints == null || data.decimalPoints == '') {
        this.DigitalNumGlobal = 0;
      } else {
        this.DigitalNumGlobal = parseInt(data.decimalPoints);
      }
    });
  }

  ////////////////////////////////////// Banks ////////////////////////////////////

  //#region Banks
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
  //#endregion
  //////////////////////////////////////////////////////////////////////////

  AllJournalEntries: any = [];
  GetAllJournalsByInvID(invid: any) {
    this._payvoucherservice
      .GetAllJournalsByPayVoucherID(invid)
      .subscribe((data) => {
        debugger;
        this.AllJournalEntries = data.result;
      });
  }
  datePrintJournals: any = new Date();
  PrintJournalsByReVoucher() {
    if (this.AllJournalEntries[0].invoiceId) {
      this._payvoucherservice
        .PrintJournalsByPayVoucherId(this.AllJournalEntries[0].invoiceId)
        .subscribe((data) => {
          this.printDiv('reportaccountingentryModal');
        });
    }
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

  PostBackV(modal: any) {
    this.receiptService
      .GetAllDetailsByVoucherId(this.voucheridpostedback)
      .subscribe((data) => {
        this.receiptService.PostBackVouchers(data.result).subscribe(
          (data) => {
            if (data.statusCode == 200) {
              this.toast.success(
                this.translate.instant(data.reasonPhrase),
                this.translate.instant('Message')
              );
              modal.dismiss();
              this.GetAllVouchersLastMonth();
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
      });
  }

  DeleteVoucher(modal: any) {
    debugger;
    this._payvoucherservice.DeleteVoucher(this.voucheriddeleted).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
          modal.dismiss();
          this.GetAllVouchersLastMonth();
          if (this.invoiverefdelted != null && this.invoiverefdelted != 0) {
            this.UpdateStoreid(this.invoiverefdelted);
          }
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
  isButtonDisabled(): boolean {
    // Check if any item in the list has a specific value selected
    return this.selection.selected.some(
      (item) => item.statusName === 'غير مرحل'
    );
  }
  PostVouchersCheckBox(modal: any) {
    debugger;
    var list: any = [];
    this.selection.selected.forEach((element) => {
      if (element.statusName == 'غير مرحل') {
        list.push(element.invoiceId.toString());
      }
    });
    this.receiptService.PostVouchersCheckBox(list).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          modal.dismiss();
          this.GetAllVouchersLastMonth();
          this.toast.success(
            this.translate.instant('Deported'),
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

  exportData() {
    let x = [];

    for (let index = 0; index < this.GetAllVouchersList.length; index++) {
      x.push({
        invoiceNumber: this.GetAllVouchersList[index].invoiceNumber,
        date: this.GetAllVouchersList[index].date,
        totalValue:parseFloat( this.GetAllVouchersList[index].totalValue),
        payTypeName: this.GetAllVouchersList[index].payTypeName,
        statusName: this.GetAllVouchersList[index].statusName,
        supplierInvoiceNo: this.GetAllVouchersList[index].supplierInvoiceNo,
        journalNumber: this.GetAllVouchersList[index].journalNumber,

        postDate: this.GetAllVouchersList[index].postDate,
        // BondAttachments: this.GetAllVouchersList[index].BondAttachments,
      });
    }
    this.receiptService.customExportExcel(x, 'Statement of customer revenue');
  }
  ///////////////////////////////////region clause//////////////////////////////////
  //#region Clause
  searchClause: any = null;
  claselist: any;
  clausedeleted: any;
  clauseseleted: any;

  Clausemodel: any = {
    id: null,
    nameAr: null,
    nameEn: null,
  };
  GetAllClauses() {
    this._payvoucherservice.GetAllClauses(this.searchClause ?? '').subscribe(
      (data) => {
        this.claselist = data.result;
        console.log(this.claselist);
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
  FillClausesSelect() {
    this._payvoucherservice.FillClausesSelect().subscribe(
      (data) => {
        this.clauseseleted = data;
        console.log(this.clauseseleted);
      },
      (error) => {}
    );
  }

  //#endregion
  ///////////////////////////////////region supplier//////////////////////////////////

  //#region supplier
  searchsupplier: any = null;
  supplierlist: any;
  supplierdeleted: any;
  supplierseleted: any;
  citylect: any;

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
  GetAllSuppliers() {
    this._payvoucherservice
      .GetAllSuppliers(this.searchsupplier ?? '')
      .subscribe(
        (data) => {
          this.supplierlist = data;
          console.log(this.supplierlist);
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
        this.GetAllSuppliers();
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
        this.GetAllSuppliers();
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
  FillSuppliersSelect2() {
    this._payvoucherservice.FillSuppliersSelect2().subscribe(
      (data) => {
        this.supplierseleted = data;
        console.log(this.supplierseleted);
      },
      (error) => {}
    );
  }

  FillCitySelect() {
    this._payvoucherservice.FillCitySelect().subscribe(
      (data) => {
        this.citylect = data;
        console.log(this.citylect);
      },
      (error) => {}
    );
  }
  //#endregion
  //////////////////////////////////////////////////////////////////////////////////////////////

  ngAfterViewInit() {
    // this.open(this.smartModal, null, 'smartModal');
  }
  voucheridpostedback: any;
  voucheriddeleted: any;
  popuptype = 0;
  invoiverefdelted: any;
  ReceiptSVoucherModelPublic: any;
  ReceiptSSaveType: any=1;
  open(content: any, data?: any, type?: any, status?: any, model?: any) {
    debugger;
    if (type == 'SaveReceiptSVoucherConfirmModal') {
      this.ReceiptSVoucherModelPublic = model;
      this.ReceiptSSaveType=1;
    }
    if (type == 'SavePostReceiptSVoucherConfirmModal') {
      this.ReceiptSVoucherModelPublic = model;
      this.ReceiptSSaveType=2;
    }
    if (data && type == 'edit') {
      this.modalDetails = data;
      this.modalDetails['id'] = 1;
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
    } else if (type == 'AddModalBanks') {
      this.GetAllBanks();
    } else if (type == 'deleteBank') {
      this.DeletebanksId = data.bankId;
    } else if (type == 'clause') {
      this.GetAllClauses();
    } else if (type == 'deleteclase') {
      this.clausedeleted = data.clauseId;
    } else if (type == 'supplier') {
      this.GetAllSuppliers();
    } else if (type == 'deletesupplier') {
      this.supplierdeleted = data.supplierId;
    } else if (type == 'addnewpayvoucher') {
      this.resetvouchermodel();
      this.vouchermodel.date = new Date();
      this.FieldsEnable(true);
      this.TaxCheckEnable();
      //this.gethigridate();
      if (this.userG?.userPrivileges.includes(13100307)) {
        this.saveandpost = 1;
      }
      this.GenerateVoucherNumber();
      this.FillSubAccountLoad();
      this.FillCustAccountsSelect(1);
      this.GetBranch_Costcenter();
      this.popuptype = 1;
    } else if (type == 'editvoucher') {
      this.popuptype = 2;
    } else if (type == 'ViewVoucher') {
      this.popuptype = 3;
    } else if (type == 'accountingentry') {
      this.GetAllJournalsByInvID(data.invoiceId);
    } else if (type == 'PostBackVouchers') {
      this.voucheridpostedback = data.invoiceId;
    } else if (type == 'DeleteVoucherModal') {
      this.voucheriddeleted = data.invoiceId;
      this.invoiverefdelted = data.supplierInvoiceNo;
    }

    this.modalService
      // .open(content, {
      //   ariaLabelledBy: 'modal-basic-title',
      //   size: type == 'runningTasksModal' ? 'xxl' : 'xl' ,
      //   centered: type ? false : true
      // })

      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type && !this.popuptype ? 'xl' : 'lg',
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userPermissionsDataSource.filter = filterValue.trim().toLowerCase();
  }
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

  sendSMS(sms: any) {
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
    //this.checkselected();
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

  existValue: any = false;

  selectedVoucher: any;

  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }
  isanyselected: boolean = true;
  checkselected() {
    debugger;
    // this.selection.selected.some((element) => {
    //   if (element.statusName == 'غير مرحل') {
    //     debugger;

    //     this.isanyselected = false;
    //   } else {
    //     this.isanyselected = true;
    //   }
    // });

    this.selection.select(
      this.selection.selected.forEach((element) => {
        element.statusName == 'غير مرحل';
      })
    );
  }

  ////////////////////////////////////////////////////
  RemainingInvoiceValue: any;
  totalvalue: any;
  paidvalue: any;
  totalwitoutpaid: any;
  GetInvoiceByNo(invoiceno: any) {
    this.receiptService.GetInvoiceByNo_purches(invoiceno).subscribe((data) => {
      this.totalvalue =
        +parseFloat(parseFloat(data.totalValue).toFixed(2)) -
        +parseFloat(parseFloat(data.paidValue).toFixed(2));
      //this.totalvalue = data.totalValue;
      this.GetVousherpay_Sum(data.invoiceId, this.totalvalue);
      // this.ReceiptVoucherForm.controls['AmountOf'].setValue(
      //   this.RemainingInvoiceValue

      //);
      //this.ConvertNumToString_Offer(this.RemainingInvoiceValue);
    });
  }

  GetVousherpay_Sum(invId: any, Value: any) {
    this.receiptService.VousherRe_Sum(invId).subscribe((result: any) => {
      if (result.statusCode == 200) {
        debugger;
        var AccValue = 0;
        if (Value > parseFloat(result.reasonPhrase)) {
          AccValue = Value - parseFloat(result.reasonPhrase);
        } else {
          AccValue = 0;
        }
        this.RemainingInvoiceValue = AccValue;
        this.ConvertNumToString_Offer(AccValue);
        this.vouchermodel.invoiceValue = AccValue;
      } else {
        this.vouchermodel.invoiceValue = 0;
        this.ConvertNumToString_Offer(0);
      }
    });
  }
  ConvertNumToString_Offer(number: any) {
    this._payvoucherservice.ConvertNumToString(number).subscribe((data) => {
      debugger;
      this.vouchermodel.reVoucherNValueText = data.reasonPhrase;
    });
  }

  UpdateStoreid(invId: any) {
    this.receiptService
      .UpdateVoucher_payed_bySupp(invId)
      .subscribe((result: any) => {});
  }

    //-------------------------------------CopyData----------------------------------------------
  //#region 
  CopyData:any=null;
  
  CopyDataFromRow(data:any){
      this.CopyData=data;
  }
  PasteDataFromRow(){
    debugger
    this.CopyEntryVoucherPopup(this.CopyData);
}

CopyEntryVoucherPopup(data: any) {
  var InvoiceNum = this.vouchermodel.invoiceNumber
  this.Copy_Receipt(data);
  this.vouchermodel.invoiceNumber=InvoiceNum;
}
Copy_Receipt(data: any) {
  this.resetvouchermodel();
  const DateHijri = toHijri(this._sharedService.String_TO_date(data.date));
  var DateGre = new HijriDate(DateHijri._year,DateHijri._month,DateHijri._date);
  DateGre._day = DateGre._date;
  this.vouchermodel.date = this._sharedService.String_TO_date(data.date);
  this.vouchermodel.hijriDate = DateGre;
  this.vouchermodel.notes = data.notes;
  this.vouchermodel.invoiceNotes = data.invoiceNotes;
  var VoucherValue = data.invoiceValue;
  var TaxValue = 0;
  this.vouchermodel.journalNumber = null;
  var voucherId = parseInt(data.invoiceId);
  this.vouchermodel.invoiceId = 0;
  this.vouchermodel.supplierInvoiceNo = data.supplierInvoiceNo;
  this.vouchermodel.recevierTxt = data.recevierTxt;
  this.vouchermodel.invoiceReference = data.invoiceReference;
  this.vouchermodel.invoiceValue = data.invoiceValue;
  this.vouchermodel.reVoucherNValueText = data.invoiceValueText;

  if (parseInt(data.invoiceValue) == parseInt(data.totalValue)) {
    if (data.taxAmount != null) {
      this.vouchermodel.valuebefore = parseFloat(
        (parseFloat(data.invoiceValue.toString()) -parseFloat(data.taxAmount.toString())).toString()
      ).toFixed(this.DigitalNumGlobal);
    } else {
      this.vouchermodel.valuebefore = parseFloat(data.invoiceValue).toFixed(this.DigitalNumGlobal);
    }
  } else {
    this.vouchermodel.valuebefore = parseFloat(data.invoiceValue).toFixed(this.DigitalNumGlobal);
  }
  this.vouchermodel.taxAmount = data.taxAmount;
  this.vouchermodel.valueafter = data.totalValue;
  if (parseFloat(data.taxAmount).toFixed(2).toString() == '0.00') {
    this.Taxchechdisabl = false;
    this.vouchermodel.taxcheck1 = true;
  } else {
    this.Taxchechdisabl = false;
    this.vouchermodel.taxcheck1 = false;
  }

  var DunCalcV = data.dunCalc;
  debugger;
  if (DunCalcV == true) {
    this.vouchermodel.dunCalc = true;
  } else {
    this.vouchermodel.dunCalc = false;
  }
  var taxType =parseInt(data.totalValue) === parseInt(data.tnvoiceValue) ? 3 : 2; 
    this.vouchermodel.taxtype = taxType;

  this.vouchermodel.clauseId = data.clauseId;
  this.vouchermodel.supplierId = data.supplierId;
  this.GetTaxNoBySuppId(data.supplierId);
  var payType = parseInt(data.payType);
  this.vouchermodel.payType = payType;
  this.FillSubAccountLoad();
  if (payType == 1) {
    this.FillCustAccountsSelect2(1);
  } else if (payType == 2 || payType == 6) {
    this.FillCustAccountsSelect2(6);
  } else if (payType == 3) {
    this.FillCustAccountsSelect2(4);
  } else if (payType == 4) {
    this.FillCustAccountsSelect2(5);
  } else if (payType == 5) {
    this.FillCustAccountsSelect2(6);
  } else if (payType == 9) {
    this.FillCustAccountsSelect2(9);
  } else if (payType == 15) {
    this.FillCustAccountsSelect2(15);
  } else if (payType == 16) {
    this.FillCustAccountsSelect2(16);
  } else if (payType == 17) {
    this.FillCustAccountsSelect2(17);
  } else {
    this.FillCustAccountsSelect2(0);
  }
  this._payvoucherservice.GetAllDetailsByVoucherId(voucherId).subscribe((data2) => {
      this.vouchermodel.toAccountId = data2.result[0].toAccountId;
      this.vouchermodel.CostCenterId = data2.result[0].costCenterId;
      this.vouchermodel.accountId = data2.result[0].accountId;
      this.vouchermodel.notes = data2.result[0].description;
      this.getaccountcode(data2.result[0].accountId, 2);
      this.getaccountcode(data2.result[0].toAccountId, 1);
      this.vouchermodel.amount = data2.result[0].amount;
      this.vouchermodel.taxtype = data2.result[0].taxType;
      this.vouchermodel.taxAmount = data2.result[0].taxAmount;
      this.vouchermodel.totalAmount = data2.result[0].totalAmount;
      this.vouchermodel.payType = data2.result[0].payType;
      this.vouchermodel.referenceNumber = data2.result[0].referenceNumber;
      if (data2.result[0].payType == 2 ||data2.result[0].payType == 6 ||data2.result[0].payType == 17) {
        this.CheckDetailsIntial();
        if (data2.result[0].payType == 2) {
          this.CheckDetailsForm.controls['paymenttypeName'].setValue('شيك');
          this.CheckDetailsForm.controls['Check_transferNumber'].setValue(data2.result[0].checkNo);
          this.CheckDetailsForm.controls['dateCheck_transfer'].setValue(new Date(data2.result[0].checkDate));
          this.CheckDetailsForm.controls['BankId'].setValue(data2.result[0].bankId);
          this.CheckDetailsForm.controls['bankName'].setValue(data2.result[0].bankName);
        } else if (data2.result[0].payType == 6) {
          this.CheckDetailsForm.controls['paymenttypeName'].setValue('حوالة');
          this.CheckDetailsForm.controls['Check_transferNumber'].setValue(data2.result[0].moneyOrderNo);
          this.CheckDetailsForm.controls['dateCheck_transfer'].setValue(new Date(data2.result[0].moneyOrderDate));
          this.CheckDetailsForm.controls['BankId'].setValue( data2.result[0].bankId);
          this.CheckDetailsForm.controls['bankName'].setValue(data2.result[0].bankName);
        } else if (data2.result[0].payType == 17) {this.CheckDetailsForm.controls['paymenttypeName'].setValue('نقاط بيع');
          this.CheckDetailsForm.controls['Check_transferNumber'].setValue(data2.result[0].moneyOrderNo);
          this.CheckDetailsForm.controls['dateCheck_transfer'].setValue(new Date(data2.result[0].moneyOrderDate));
          this.CheckDetailsForm.controls['BankId'].setValue(data2.result[0].bankId);
          this.CheckDetailsForm.controls['bankName'].setValue(data2.result[0].bankName);
        }
        this.checkdetailsTabel();
      }
    });
}

//#endregion
  //------------------------------------End-CopyData----------------------------------------------
}
