import { BehaviorSubject, Subscription } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { EmployeeLoanService } from 'src/app/core/services/Employees-Services/employee-loan.service';
import { LoanVM } from 'src/app/core/Classes/ViewModels/loanVM';
import { SharedService } from 'src/app/core/services/shared.service';
import { Loan } from 'src/app/core/Classes/DomainObjects/loan';
import { ToastrService } from 'ngx-toastr';
import { PayVoucherService } from 'src/app/core/services/acc_Services/pay-voucher.service';
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import { ReceiptService } from 'src/app/core/services/acc_Services/receipt.service';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { TranslateService } from '@ngx-translate/core';
import { Invoices } from 'src/app/core/Classes/DomainObjects/invoices';
import { DatePipe } from '@angular/common';
import { VoucherDetails } from 'src/app/core/Classes/DomainObjects/voucherDetails';
import { environment } from 'src/environments/environment';
import { Acc_Clauses } from 'src/app/core/Classes/DomainObjects/acc_Clauses';
import { Acc_Suppliers } from 'src/app/core/Classes/DomainObjects/acc_Suppliers';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NgxPrintElementService } from 'ngx-print-element';
import { RestApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-employee-loan',
  templateUrl: './employee-loan.component.html',
  styleUrls: ['./employee-loan.component.scss'],
  providers: [DatePipe],
})
export class EmployeeLoanComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent | any;

  rows = [
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
  ];
  temp: any = [
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
  ];

  isEditable: any = {};

  title: any = {
    main: {
      name: {
        ar: 'شؤون الموظفين',
        en: 'Employees Affairs',
      },
      link: '/employees',
    },
    sub: {
      ar: 'السلف',
      en: 'Imprest',
    },
  };

  showDate = false;

  selectedUser: any;
  users: any;
  Employeesearch: any;
  EmployeeWorker: any;
  EmployeeWorkerE: any;
  Months: any;

  status: any;
  closeResult = '';

  displayedColumns: string[] = [
    'employeName',
    'imprestDate',
    'imprestStatus',
    'manager',
    'installmentMonths',
    'startingMonth',
    'operations',
  ];

  dataSource: MatTableDataSource<any>;
  dataSourceWaitingImprest: MatTableDataSource<any>;
  dataSourceAcceptingImprest: MatTableDataSource<any>;

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

  data: any = {
    filter: {
      date: null,
      EmployeeId: null,
      StartDate: null,
      EndDate: null,
      Status: null,
    },
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  modalDetails: any = {
    id: null,
    date: null,
    amound: null,
    installmentsNumber: null,
    from: null,
    details: null,
  };

  imprests: any;
  waitingImprests: any;
  acceptingImprests: any;
  public _loanVM: LoanVM;
  public _loan: Loan;
  public _LoanEdit: Loan;
  // toast: any;
  Impresttoconvert: any;
  Loandeleted: any;
  LoanIdEdit: any;

  ////////////////////////////////////
  employeeId = '';
  employeeIdw = '';
  date = '';
  amount = '';
  monthNo = '';
  startMonths = '';
  note = '';
  noteview = '';

  monthnumberdetails: any;
  ///////////////////////////////////
  lang: any = 'ar';
  datePrintJournals: any = this.datePipe.transform(new Date(), 'YYYY-MM-dd');
  logourl: any;

  constructor(
    private modalService: NgbModal,
    private _loanservice: EmployeeLoanService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private _payvoucherservice: PayVoucherService,
    private receiptService: ReceiptService,
    private _accountsreportsService: AccountsreportsService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private authenticationService: AuthenticationService,
    private print: NgxPrintElementService,
    private api: RestApiService
  ) {
    this.dataSource = new MatTableDataSource([{}]);
    this.dataSourceWaitingImprest = new MatTableDataSource([{}]);
    this.dataSourceAcceptingImprest = new MatTableDataSource([{}]);

    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
    this._loanVM = new LoanVM();
    this._loan = new Loan();
    this._LoanEdit = new Loan();
    api.lang.subscribe((res) => {
      this.lang = res;
    });
    this.userG = this.authenticationService.userGlobalObj;
  }

  getloandata(issearched: any) {
    debugger;
    this._loanVM = new LoanVM();
    this._loanVM.startDate = this.data.filter.StartDate;
    this._loanVM.endDate = this.data.filter.EndDate;
    this._loanVM.status = this.data.filter.Status;
    this._loanVM.employeeId = this.data.filter.EmployeeId;
    if (issearched == 1) {
      this._loanVM.isSearch = true;
    }
    this._loanservice.GetAllImprestSearch(this._loanVM).subscribe({
      next: (data: any) => {
        // assign data to table
        debugger;
        console.log('loandata', data.result);
        this.imprests = new MatTableDataSource(data.result);
        this.dataSource = new MatTableDataSource(this.imprests.filteredData);
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  fillfillEmployeesearch() {
    this._loanservice.FillEmployeeSearch().subscribe((data) => {
      console.log(data);
      this.Employeesearch = data;
    });
  }
  fillfillEmployeeWorker() {
    this._loanservice.FillEmployeeworker().subscribe((data) => {
      console.log(data);
      this.EmployeeWorker = data;
    });
  }

  fillEmployeeWorkerE() {
    this._loanservice.FillEmployeeSearch().subscribe((data) => {
      console.log('employee edit' + data);
      this.EmployeeWorkerE = data;
    });
  }

  GetOrganizationData() {
    this._sharedService.GetOrganizationData().subscribe((data) => {
      this.logourl = environment.PhotoURL + data.logoUrl;
    });
  }

  getallloansw() {
    debugger;
    this._loanservice.GetAllLoansW(null).subscribe((data) => {
      debugger;
      console.log(data);
      this.waitingImprests = data.result;
      this.dataSourceWaitingImprest = new MatTableDataSource(
        this.waitingImprests
      );
    });
  }

  getloandetails(loanid: any, monthno: any) {
    console.log(loanid);
    this.monthnumberdetails = monthno;
    this._loanservice.GetAllLoanDetails(loanid).subscribe((data) => {
      debugger;
      console.log(data);
      this.acceptingImprests = data;
      this.dataSourceAcceptingImprest = new MatTableDataSource(
        this.acceptingImprests
      );
    });
  }
  payed: any;
  remaning: any;
  GetAmountPayedAndNotPayed(loanid: any) {
    console.log(loanid);
    this._loanservice.GetAmountPayedAndNotPayed(loanid).subscribe((data) => {
      debugger;
      console.log(data);
      this.payed = data.result.amountPayed;
      this.remaning = data.result.amountNotPayed;
     
     
    });
  }
  ngOnInit(): void {
    this.getloandata(0);
    this.fillfillEmployeeWorker();
    this.fillfillEmployeesearch();
    this.fillEmployeeWorkerE();
    this.getallloansw();

    this.FillBankSelect();
    this.FillCostCenterSelect();
    this.FillClausesSelect();
    this.FillCitySelect();
    this.FillSuppliersSelect2();
    this.GetLayoutReadyVm();
    this.GetOrganizationData();
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

    this.status = [
      { id: 1, Name: 'طلب جديد' },
      { id: 2, Name: ' تم الموافقة علي السلفه' },
      { id: 3, Name: ' تم رفض السلفه' },
      { id: 4, Name: ' مراجعة' },
      { id: 5, Name: ' تأجيل' },
    ];
    // this.waitingImprests = [
    //   {
    //     date: new Date(),
    //     employeeName: 'addvkmam',
    //     branch: 'cacmaca',
    //     amount: 'vamvkma',
    //     installmentNumber: 'ackas',
    //     startDate: new Date(),
    //     dicesion: 'cascasmc',
    //   },

    // ];
  }

  withReason = false;
  edit = 0;
  userloanedit: any;
  employeetopay: any = null;
  loanidvoucher: any = 0;
  open(content: any, data?: any, type?: any, info?: any) {
    debugger;
    this.edit = 0;
    if (data && type == 'edit') {
      this.edit = 1;
      data.date = new Date(data.date);
      this.userloanedit = data.employeeId;
      this.LoanIdEdit = data.loanId;
      this.modalDetails = data;
      this.modalDetails['id'] = '1';
    } else {
      this.modalDetails['id'] = '1';
    }

    if (data && type == 'note') {
      this.noteview = data;
      // this.modalDetails['id'] = '2';
    }

    if (data && type == 'Converttoadmin') {
      this.Impresttoconvert = data.loanId;
    }

    if (data && type == 'delete') {
      this.Loandeleted = data.loanId;
    }

    if (info) {
      this.withReason = true;
    }

    //  if (data && type == 'edit') {
    //    this.modalDetails = data;
    //    this.modalDetails['id'] = 1;
    //  }
    if (type == 'EditCheckDetailsModal') {
      if (info == 'newCheckDetails') {
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
      } else if (info == 'EditCheckDetails') {
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
      this.gethigridate();
      if (this.userG?.userPrivileges.includes(13100307)) {
        this.saveandpost = 1;
      }
      this.GenerateVoucherNumber();
      this.FillSubAccountLoad();
      this.FillCustAccountsSelect(1);
      this.GetBranch_Costcenter();
      this.popuptype = 1;
      this.vouchermodel.taxtype = 3;
      this.employeetopay = data.employeeName;
      this.vouchermodel.recevierTxt = data.employeeName;
      this.vouchermodel.invoiceValue = data.amount;
      this.loanidvoucher = data.loanId;
      this.invoiceValuechange();
    } else if (type == 'editvoucher') {
      this.popuptype = 2;
    } else if (type == 'ViewVoucher') {
      this.popuptype = 3;
    } else if (type == 'accountingentry') {
      this.GetAllJournalsByInvID(data.invoiceId);
    }

    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        // size: type ? 'xl' : 'lg',
        size: 'lg',
        centered: true,
        backdrop: 'static',
        keyboard: false,
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
    this.modalDetails = {
      id: null,
      date: null,
      amound: null,
      installmentsNumber: null,
      from: null,
      details: null,
    };

    this.control.clear();
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // delete
  confirm() {}

  Delete() {
    debugger;
    this._loanservice.DeleteLoan(this.Loandeleted).subscribe((result: any) => {
      console.log(result);
      console.log('result');
      debugger;
      if (result.statusCode == 200) {
        this.getloandata(0);
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
      } else {
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
      }
    });
  }

  ConvertToAdmin() {
    debugger;
    this._loanservice
      .ConvertToAdmin(this.Impresttoconvert, 1)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');
        debugger;
        if (result.statusCode == 200) {
          this.getloandata(0);
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      });
  }

  EditImprestRequest(loanobj: any) {
    debugger;
    console.log(loanobj);
    if (
      this.userloanedit == null ||
      loanobj.date == null ||
      loanobj.amount == null ||
      loanobj.monthNo == null ||
      loanobj.startMonth == null
    ) {
      this.toast.error('من فضلك اكمل البيانات', 'رسالة');
      return;
    }
    debugger;
    this._LoanEdit.employeeId = this.userloanedit;
    this._LoanEdit.date = loanobj.date;
    this._LoanEdit.amount = loanobj.amount;
    this._LoanEdit.monthNo = loanobj.monthNo;
    this._LoanEdit.startMonth = loanobj.startMonth;
    this._LoanEdit.note = loanobj.note;
    this._LoanEdit.loanId = this.LoanIdEdit;
    this._LoanEdit.status = 1;

    console.log(loanobj);

    var loan = this._LoanEdit;
    this._loanservice.SaveLoanWorker(loan).subscribe((result: any) => {
      console.log(result);
      console.log('result');
      if (result.statusCode == 200) {
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.getloandata(0);
      } else {
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
      }
    });
  }
  AddImprestRequest(loanobj: any) {
    debugger;

    if (
      loanobj.employeeIdw == null ||
      loanobj.date == null ||
      loanobj.amount == null ||
      loanobj.monthNo == null ||
      loanobj.startMonths == null
    ) {
      this.toast.error('من فضلك اكمل البيانات', 'رسالة');
      return;
    }
    this._loan.employeeId = loanobj.employeeIdw;
    this._loan.date = loanobj.date;
    this._loan.amount = loanobj.amount;
    this._loan.monthNo = loanobj.monthNo;
    this._loan.startMonth = loanobj.startMonths;
    this._loan.note = loanobj.note;
    this._loan.status = 1;
    console.log(loanobj);

    var loan = this._loan;
    this._loanservice.SaveLoanWorker(loan).subscribe((result: any) => {
      console.log(result);
      console.log('result');
      if (result.statusCode == 200) {
        this.toast.success(result.reasonPhrase, 'رسالة');
        this.getloandata(0);
      } else {
        this.toast.error(result.reasonPhrase, 'رسالة');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // upload img ]
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
      FileUploadValidators.accept(['image/*']),
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

  CheckDate(event: any) {
    if (event != null) {
      var from = this._sharedService.date_TO_String(event[0]);
      var to = this._sharedService.date_TO_String(event[1]);
      //this.RefreshData_ByDate(from,to);
      this.data.filter.StartDate = from;
      this.data.filter.EndDate = to;
      this.getloandata(1);
    } else {
      this.data.filter.DateFrom_P = '';
      this.data.filter.DateTo_P = '';
      //this.RefreshData();
    }
  }

  //#region ADD PayVoucher
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  modalType = 0;
  VoucherType: any = 5;
  submitted = true;
  userG: any = {};
  saveandpost: any;
  popuptype = 0;
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
    this.receiptService.FillSubAccountLoad_Branch().subscribe((data) => {
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
  gethigridate() {
    this._sharedService
      .GetHijriDate(this.vouchermodel.date, 'Contract/GetHijriDate2')
      .subscribe({
        next: (data: any) => {
          debugger;
          //  this.vouchermodel.hijriDate = data;
          //  this.hijriDate=data;
        },
        error: (error) => {},
      });
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
      console.log(data);
      this.Toaccount = data;
    });
  }
  addUser: any;
  addDate: any;
  addInvoiceImg: any;
  editvouccher(data: any) {
    this.resetvouchermodel();
    debugger;
    console.log(data);
    this.vouchermodel.invoiceNumber = data.invoiceNumber;
    var date = data.date;
    this.vouchermodel.date = new Date(date);
    this.vouchermodel.hijriDate = data.hijriDate;
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
    this.vouchermodel.RecevierTxt = data.recevierTxt;
    this.vouchermodel.invoiceReference = data.invoiceReference;
    this.vouchermodel.invoiceValue = data.invoiceValue;
    this.vouchermodel.reVoucherNValueText = data.invoiceValueText;

    if (parseInt(data.invoiceValue) == parseInt(data.totalValue)) {
      this.vouchermodel.valuebefore = parseFloat(
        (
          parseFloat(data.invoiceValue.toString()) -
          parseFloat(data.taxAmount.tostring)
        ).toString()
      ).toFixed(this.DigitalNumGlobal);
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
      console.log(data);
      this.vouchermodel.supplierTaxID = data ?? '';
    });
  }

  saveandpostvoucher(type: any, modal: any) {
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
    VoucherObj.date = this.datePipe.transform(
      this.vouchermodel.date,
      'YYYY-MM-dd'
    );
    VoucherObj.hijriDate = this.vouchermodel.hijriDate;
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
    if (type == 1) {
      this._payvoucherservice.SaveandPostVoucherP(VoucherObj).subscribe(
        (data) => {
          if (this.uploadedFiles.length > 0) {
            this.savefile(data.returnedParm);
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

          this.Updateconverttoaccounts();
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
    VoucherObj.date = this.datePipe.transform(
      this.vouchermodel.date,
      'YYYY-MM-dd'
    );
    VoucherObj.hijriDate = this.vouchermodel.hijriDate;
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
          this.submitted == false;
        } else {
          this.submitted == false;
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

  PostVouchers(id: any) {
    this.receiptService.GetAllDetailsByVoucherId(id).subscribe((data) => {
      this.receiptService.PostVouchers(data.result).subscribe(
        (data) => {
          if (data.statusCode == 200) {
            this.toast.success(
              this.translate.instant(data.reasonPhrase),
              this.translate.instant('Message')
            );
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
    this.receiptService.UploadPayVoucherImage(formData).subscribe((data) => {});
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

  items: any = [1, 2, 3, 4, 5, 6, 7, 8];

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

  Updateconverttoaccounts() {
    this._loanservice.Updateconverttoaccounts(this.loanidvoucher).subscribe(
      (data) => {
        this.getloandata(0);
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

  //#endregion
  //////////////////////////////////////////////////////////////////////////////////////////////

  printmodel: any = {
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
  refreshprintdata() {
    this.printmodel.employeeName = null;
    this.printmodel.employeeJob = null;
    this.printmodel.employeeNo = null;
    this.printmodel.nationalitiId = null;
    this.printmodel.branchName = null;
    this.printmodel.departmentName = null;

    this.printmodel.date = null;
    this.printmodel.amount = null;
    this.printmodel.monthNo = null;
    this.printmodel.startDate = null;
    this.printmodel.loanStatusName = null;
    this.printmodel.note = null;

    this.printmodel.acceptedDate = null;

    this.printmodel.acceptUser = null;
  }
  setdataprint(data: any) {
    this.refreshprintdata();

    console.log(data);
    debugger;
    this.printmodel.employeeName = data.employeeName;
    this.printmodel.employeeJob = data.employeeJob;
    this.printmodel.employeeNo = data.employeeNo;
    this.printmodel.nationalitiId = data.identityNo;
    this.printmodel.branchName = data.branchName;
    this.printmodel.departmentName = data.departmentName;

    this.printmodel.date = data.date;
    this.printmodel.amount = data.amount;
    this.printmodel.monthNo = data.monthNo;
    this.printmodel.startDate = data.startDate;
    this.printmodel.loanStatusName = data.loanStatusName;
    this.printmodel.note = data.note;

    this.printmodel.acceptedDate = data.acceptedDate;

    this.printmodel.acceptUser = data.acceptUser;
  }
  Printloan() {
    const timeoutDuration = 5000;

    setTimeout(() => {
      // Code to be executed after the timeout
      this.printDiv('reportloan');
    }, timeoutDuration);
  }
  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }
}
