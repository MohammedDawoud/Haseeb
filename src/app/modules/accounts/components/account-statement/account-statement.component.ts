import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { environment } from 'src/environments/environment';
import { NgxPrintElementService } from 'ngx-print-element';
import { RestApiService } from 'src/app/shared/services/api.service';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';

import { BehaviorSubject, Subscription } from 'rxjs';
import { ReportCustomer } from 'src/app/core/Classes/ViewModels/reportCustomer';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { Transactions } from 'src/app/core/Classes/DomainObjects/transactions';
import { TranslateService } from '@ngx-translate/core';
import { InvoiceService } from 'src/app/core/services/acc_Services/invoice.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { EntryvoucherService } from 'src/app/core/services/acc_Services/entryvoucher.service';
import { ReceiptService } from 'src/app/core/services/acc_Services/receipt.service';
import { DebentureService } from 'src/app/core/services/acc_Services/debenture.service';
import { ToastrService } from 'ngx-toastr';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PrintreportsService } from 'src/app/core/services/acc_Services/printreports.service';
import { PurchasesBillService } from 'src/app/core/services/acc_Services/purchasesBill.service';
import { PayVoucherService } from 'src/app/core/services/acc_Services/pay-voucher.service';
const hijriSafe = require('hijri-date/lib/safe');
const HijriDate = hijriSafe.default;
const toHijri = hijriSafe.toHijri;


@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.scss']
})

export class AccountStatementComponent implements OnInit {

  addInvoice() { }

  editInvoice() { }



  userG: any = {};


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
    {
      date: '2023-07-02',
      bondNumber: '456',
      bondType: 'Type B',
      registrationNumber: '789',
      accountCode: '012',
      accountName: 'Account B',
      statement: 'Statement B',
      debtor: 200,
      creditor: 150
    }
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
      ar: 'كشف حساب',
      en: 'Account Statement',
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
    'accTransactionDate',
    'notes',
    'transactionDate',
    "invoiceNumber",
    'depit',
    'credit',
    'balance',
    'typeName',
    'journalNo',
    'costCenterName',
  ];
  displayedColumns2: string[] = ["accTransactionDate2",
    "notes2",
    "transactionDate2",
    "invoiceNumber2",
    "depit2",
    "credit2",
    "balance2",
    "typeName2",
    "journalNo2",
    "costCenterName2",]
  projectUsersColumns: string[] = ['name', 'responsibility'];
  projectTasksColumns: string[] = ['taskName', 'name', 'duration'];

  userPermissionsDataSource = new MatTableDataSource();

  projectGoalsDataSource = new MatTableDataSource();

  projectUsersDataSource = new MatTableDataSource();
  projectTasksDataSource = new MatTableDataSource();

  projectsDataSource = new MatTableDataSource();

  DataSourceTemp = new MatTableDataSource();
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
  constructor(private modalService: NgbModal,
    private _accountsreportsService: AccountsreportsService,
    private _payvoucherservice: PayVoucherService,
    private api: RestApiService,
    private _invoiceService: InvoiceService,
    private _debentureService: DebentureService,
    private toast: ToastrService,
    private receiptService: ReceiptService,
    private print: NgxPrintElementService,
    private formBuilder: FormBuilder,
    private _entryvoucherService: EntryvoucherService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private purchasesBillService: PurchasesBillService,
    private _printreportsService: PrintreportsService,
    private _sharedService: SharedService,) {
      this.userG = this.authenticationService.userGlobalObj;
      this.ReceiptVoucherFormintial();
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
    this.FillCostCenterSelect_Sta()
    this.FillAccountsSelect()
    this.GetLayoutReadyVm();



    this.projectsDataSource = new MatTableDataSource();

    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );


  }

  ngAfterViewInit() {
    // this.open(this.smartModal, null, 'smartModal');
  }
  WhichTypeAddEditView: number = 1;



  hijriDate: any;
  R_theInvoice: any = null;
  Registrationnumber: any = null;
  ClientId: any = null;
  referenceNumber: any = null;
  paymenttype: any = null;
  ReceiptVoucherFormintial() {
    this.ReceiptVoucherForm = this.formBuilder.group({
      VoucherId: [0, []],
      dateM: [new Date(), []],
      VoucherNumber: [null, []],
      costCentersId: [null, [Validators.required]],
      // referenceNumber: [null, []],
      // R_theInvoice: [null, []],
      // Registrationnumber: [null, []],
      // paymenttype: [null, []],
      fileUrl: [null, []],
      // ClientId: [null, []],
      recipientName: [null, [Validators.required]],
      AmountOf: [null, [Validators.required]],
      amountWriting: [null, []],
      AndThatFor: [null, [Validators.required]],
      fromAccount: [null, [Validators.required]],
      AccCodeFrom: [null, []],
      toAccount: [null, [Validators.required]],
      AccCodeTo: [null, []],
      Statement: [null, []],
      Notes: [null, []],
    });
  }
  checkdetailsList: any = [];

  modalType: any = 'Create';
  hijritype: boolean = false;

  FillCustAccountsSelect2listTO: any;
  FillSubAccountLoad() {
    this.receiptService.FillSubAccountLoadNotMain_Branch().subscribe((data) => {
      this.FillCustAccountsSelect2listTO = data.result;
    });
  }
  FillCustAccountsSelect2listFROM: any;
  FillCustAccountsSelect2_Catch(PayTypeId: any) {
    if (PayTypeId == null) {
      this.receiptService.FillSubAccountLoad().subscribe((data) => {
        this.FillCustAccountsSelect2listFROM = data.result;
      });
    } else {
      this.receiptService
        .FillCustAccountsSelect2(PayTypeId)
        .subscribe((data) => {
          this.FillCustAccountsSelect2listFROM = data;
        });
    }
  }

  BankSelectList: any;
  FillBankSelect() {
    this.receiptService.FillBankSelect().subscribe((data) => {
      this.BankSelectList = data;
    });
  }
  costCentersList: any;
  FillCostCenterSelect_Catch() {
    this._accountsreportsService.FillCostCenterSelect().subscribe((data) => {
      this.costCentersList = data;
    });
  }
  GetAccCodeFormID(AccID: any, id: any) {
    if (AccID != null) {
      this.receiptService.GetAccCodeFormID(AccID).subscribe((data) => {
        if (id == 1) {
          this.ReceiptVoucherForm.controls['AccCodeFrom'].setValue(data);
        } else {
          this.ReceiptVoucherForm.controls['AccCodeTo'].setValue(data);
        }
      });
    } else {
      if (id == 1) {
        this.ReceiptVoucherForm.controls['AccCodeFrom'].setValue(null);
      } else {
        this.ReceiptVoucherForm.controls['AccCodeTo'].setValue(null);
      }
    }
  }
  AllCustomerForDropWithBranchList: any;
  GetAllCustomerForDropWithBranch() {
    this.receiptService.GetAllCustomerForDropWithBranch().subscribe((data) => {
      this.AllCustomerForDropWithBranchList = data.result;
    });
  }

  ConvertNumToString_Catch(val: any) {
    if (val != null) {
      this.receiptService.ConvertNumToString(val).subscribe((data) => {
        this.ReceiptVoucherForm.controls['amountWriting'].setValue(
          data?.reasonPhrase
        );
      });
    }
  }
  gethigridate() {
    this._sharedService
      .GetHijriDate(
        this.ReceiptVoucherForm.controls['dateM'].value,
        'Contract/GetHijriDate2'
      )
      .subscribe({
        next: (data: any) => {
          this.hijriDate = data;
        },
        error: (error) => {},
      });
  }
  addUser: any;
  addDate: any;
  addInvoiceImg: any;
  DetailsByVoucher: any;
  CustCheckPage: any = null;

  // @ViewChild('EditCheckDetailsModal') EditCheckDetailsModal: any;
  FillCustAc(add: any) {
    debugger;
    // var PayType = this.ReceiptVoucherForm.controls["paymenttype"].value
    var PayType = this.paymenttype;
    if (PayType == 1) {
      this.checkdetailsList = [];
      this.FillCustAccountsSelect2_Catch(1);
    } else if (PayType == 2 || PayType == 6) {
      this.checkdetailsList = [];
      this.FillCustAccountsSelect2_Catch(6);
      if (add == false) {
        // this.open(
        //   this.EditCheckDetailsModal,
        //   '',
        //   'EditCheckDetailsModal',
        //   'newCheckDetails'
        // );
      }
    } else if (PayType == 3) {
      this.checkdetailsList = [];
      this.FillCustAccountsSelect2_Catch(4);
    } else if (PayType == 4) {
      this.checkdetailsList = [];
      this.FillCustAccountsSelect2_Catch(5);
    } else if (PayType == 5) {
      this.checkdetailsList = [];
      this.FillCustAccountsSelect2_Catch(6);
    } else if (PayType == 9) {
      this.checkdetailsList = [];
      this.FillCustAccountsSelect2_Catch(9);
    } else if (PayType == 17) {
      this.checkdetailsList = [];
      this.FillCustAccountsSelect2_Catch(17);
      if (add == false) {
        // this.open(
        //   this.EditCheckDetailsModal,
        //   '',
        //   'EditCheckDetailsModal',
        //   'newCheckDetails'
        // );
      }
    } else {
      this.checkdetailsList = [];
      this.FillCustAccountsSelect2_Catch(PayType);
    }
  }
  RemainingInvoiceValue: any;
  totalvalue: any;
  paidvalue: any;
  totalwitoutpaid: any;
  GetInvoiceByNo(invoiceno: any) {
    this.receiptService.GetInvoiceByNo(invoiceno).subscribe((data) => {
      this.totalvalue =
        +parseFloat(parseFloat(data.totalValue).toFixed(2)) -
        +parseFloat(parseFloat(data.paidValue).toFixed(2));
      //this.totalvalue = data.totalValue;
      this.GetVousherRe_Sum(data.invoiceId, this.totalvalue);
      // this.ReceiptVoucherForm.controls['AmountOf'].setValue(
      //   this.RemainingInvoiceValue

      //);
      //this.ConvertNumToString_Catch(this.RemainingInvoiceValue);
    });
  }
  GetVousherRe_Sum(invId: any, Value: any) {
    this.receiptService.VousherRe_Sum(invId).subscribe((result: any) => {
      if (result.statusCode == 200) {
        debugger;
        var AccValue:any = 0;
        if (Value > parseFloat(result.reasonPhrase)) {
          AccValue = Value - parseFloat(result.reasonPhrase);
        } else {
          AccValue = 0;
        }
        AccValue=parseFloat(AccValue.toString()).toFixed(2);

        this.RemainingInvoiceValue = AccValue;
        this.ConvertNumToString_Catch(AccValue);
        this.ReceiptVoucherForm.controls['AmountOf'].setValue(AccValue);
      } else {
        this.ReceiptVoucherForm.controls['AmountOf'].setValue(0);
        this.ConvertNumToString_Catch(0);
      }
    });
  }

  GetCustomersByCustomerId() {
    this.receiptService.GetCustomersByCustomerId(this.ClientId).subscribe(
      (data) => {
        this.ReceiptVoucherForm.controls['toAccount'].setValue(
          data.result.accountId
        );
        this.GetAccCodeFormID(
          this.ReceiptVoucherForm.controls['toAccount'].value,
          2
        );
      },
      (error) => {}
    );
  }
  submitted: boolean = false;

  InvoicesWithCustomer: any;
  GetInvoiceByCustomer() {
    this.receiptService
      .GetInvoiceByCustomer(this.ClientId)
      .subscribe((data) => {
        this.InvoicesWithCustomer = data;
      });
  }
  PayTypeList = [
    { id: 1, name: 'monetary' },
    { id: 17, name: 'Cash account points of sale - Mada-ATM' },
    { id: 2, name: 'Check' },
    { id: 6, name: 'transfer' },
    { id: 9, name: 'Network/transfer' },
    { id: 15, name: 'عهد موظفين' },
    { id: 16, name: 'جاري المالك' },
  ];

  editInvoices(element: any) {
    this.receiptService
      .GetAllDetailsByVoucherId(element.invoiceId)
      .subscribe((data) => {
        debugger;
        this.addUser = null;
        this.addDate = null;
        this.addInvoiceImg = null;
        this.DetailsByVoucher = data.result[0];

        if (element.customerId == null) {
          this.CustCheckPage = 'noCustomer';
          // this.ReceiptVoucherForm.controls["ClientId"].setValue(null)
          this.ClientId = null;
        } else {
          this.CustCheckPage = 'withCustomer';
          // this.ReceiptVoucherForm.controls["ClientId"].setValue(element.customerId)
          this.ClientId = element.customerId;
        }
        if (element.addDate != null) {
          this.addUser = element.addUser;
          this.addDate = element.addDate;
          if (element.addInvoiceImg != '' && element.addInvoiceImg != null) {
            this.addInvoiceImg = element.addInvoiceImg;
          }
        }

        this.ReceiptVoucherForm.controls['VoucherNumber'].setValue(
          element.invoiceNumber
        );
        this.ReceiptVoucherForm.controls['dateM'].setValue(
          new Date(element.date)
        );
        // this.hijriDate = element.hijriDate
        this.gethigridate();
        this.ReceiptVoucherForm.controls['Notes'].setValue(element.notes);
        this.ReceiptVoucherForm.controls['Statement'].setValue(
          element.invoiceNotes
        );
        // this.ReceiptVoucherForm.controls["Registrationnumber"].setValue(element.journalNumber)
        this.Registrationnumber = element.journalNumber;
        this.ReceiptVoucherForm.controls['VoucherId'].setValue(
          element.invoiceId
        );
        this.referenceNumber = element.invoiceReference;
        this.R_theInvoice = element.toInvoiceId;
        this.ReceiptVoucherForm.controls['AmountOf'].setValue(
          element.totalValue
        );
        this.ConvertNumToString_Catch(
          this.ReceiptVoucherForm.controls['AmountOf'].value
        );
        this.ReceiptVoucherForm.controls['recipientName'].setValue(
          element.recevierTxt
        );
        // this.ReceiptVoucherForm.controls["paymenttype"].setValue(element.payType)
        this.paymenttype = element.payType;

        this.FillCustAc(true);
        this.ReceiptVoucherForm.controls['fromAccount'].setValue(
          element.toAccountId
        );
        this.GetAccCodeFormID(
          this.ReceiptVoucherForm.controls['fromAccount'].value,
          1
        );

        this.ReceiptVoucherForm.controls['toAccount'].setValue(
          this.DetailsByVoucher.accountId
        );
        this.GetAccCodeFormID(
          this.ReceiptVoucherForm.controls['toAccount'].value,
          2
        );
        this.ReceiptVoucherForm.controls['costCentersId'].setValue(
          this.DetailsByVoucher.costCenterId
        );
        this.ReceiptVoucherForm.controls['AndThatFor'].setValue(
          this.DetailsByVoucher.description
        );
        if (
          this.DetailsByVoucher.payType == 2 ||
          this.DetailsByVoucher.payType == 6 ||
          this.DetailsByVoucher.payType == 17
        ) {
          if (this.DetailsByVoucher.payType == 2) {
            this.CheckDetailsForm.controls['paymenttypeName'].setValue('شيك');
            this.CheckDetailsForm.controls['Check_transferNumber'].setValue(
              this.DetailsByVoucher.checkNo
            );
            this.CheckDetailsForm.controls['dateCheck_transfer'].setValue(
              this.DetailsByVoucher.checkDate
            );
            this.CheckDetailsForm.controls['BankId'].setValue(
              this.DetailsByVoucher.bankId
            );
            this.CheckDetailsForm.controls['bankName'].setValue(
              this.DetailsByVoucher.bankName
            );
          } else if (this.DetailsByVoucher.payType == 6) {
            this.CheckDetailsForm.controls['paymenttypeName'].setValue('حوالة');
            this.CheckDetailsForm.controls['Check_transferNumber'].setValue(
              this.DetailsByVoucher.moneyOrderNo
            );
            this.CheckDetailsForm.controls['dateCheck_transfer'].setValue(
              this.DetailsByVoucher.moneyOrderDate
            );
            this.CheckDetailsForm.controls['BankId'].setValue(
              this.DetailsByVoucher.bankId
            );
            this.CheckDetailsForm.controls['bankName'].setValue(
              this.DetailsByVoucher.bankName
            );
          } else if (this.DetailsByVoucher.payType == 17) {
            this.CheckDetailsForm.controls['paymenttypeName'].setValue(
              'نقاط بيع'
            );
            this.CheckDetailsForm.controls['Check_transferNumber'].setValue(
              this.DetailsByVoucher.moneyOrderNo
            );
            this.CheckDetailsForm.controls['dateCheck_transfer'].setValue(
              this.DetailsByVoucher.moneyOrderDate
            );
            this.CheckDetailsForm.controls['BankId'].setValue(
              this.DetailsByVoucher.bankId
            );
            this.CheckDetailsForm.controls['bankName'].setValue(
              this.DetailsByVoucher.bankName
            );
          }
          this.checkdetailsTabel();
        }
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
  popuptype = 0;
  open(content: any, data?: any, type?: any, status?: any) {
    if (data && type == 'edit') {
      this.modalDetails = data;
      this.modalDetails['id'] = 1;
    }
    if (type == 'InvoiceView') {
      this.ListDataServices_Invoice = [];
      this.SureServiceList_Invoice = [];
      this.OfferPopupAddorEdit_Invoice = 1;
      this.InvoicePublicView = data;
      this.resetInvoiceData();
      this.InvoiceView(data);
    }
    if (type == 'serviceDetails_Invoice' && data) {
      this.GetServicesPriceByParentId_Invoice(data);
    }
    if (type == 'ViewEntryVoucherModal') {
      this.WhichTypeAddEditView = 3;
      this.EditEntryVoucherPopup(data);
    }
     else if (type == 'ViewVoucher') {
      this.popuptype = 3;
      this.editvouccher(data);
    } 
    if (type == 'viewReceiptModal') {
      this.ReceiptVoucherForm.controls['VoucherId'].setValue(data.invoiceId);
      this.hijriDate = null;
      this.FillCostCenterSelect_Catch();
      this.GetAllCustomerForDropWithBranch();

      this.ReceiptVoucherFormintial();
      this.checkdetailsList = [];
      this.R_theInvoice = null;
      this.referenceNumber = null;
      this.paymenttype = null;
      this.ClientId = null;

      this.FillCustAccountsSelect2_Catch(null);
      this.FillSubAccountLoad();
      this.gethigridate();
      //this.GenerateVoucherNumber();
      this.ReceiptVoucherForm.controls['VoucherNumber'].disable();
      // this.ReceiptVoucherForm.controls['Registrationnumber'].disable();
      this.ReceiptVoucherForm.controls['amountWriting'].disable();
      this.ReceiptVoucherForm.controls['AccCodeFrom'].disable();
      this.ReceiptVoucherForm.controls['AccCodeTo'].disable();
      this.ReceiptVoucherForm.controls['VoucherId'].disable();
      this.ReceiptVoucherForm.controls['dateM'].disable();
      this.ReceiptVoucherForm.controls['costCentersId'].disable();
      // this.ReceiptVoucherForm.controls['paymenttype'].disable();
      this.ReceiptVoucherForm.controls['fileUrl'].disable();
      // this.ReceiptVoucherForm.controls['ClientId'].disable();
      this.ReceiptVoucherForm.controls['recipientName'].disable();
      this.ReceiptVoucherForm.controls['AmountOf'].disable();
      this.ReceiptVoucherForm.controls['AndThatFor'].disable();
      this.ReceiptVoucherForm.controls['fromAccount'].disable();
      this.ReceiptVoucherForm.controls['toAccount'].disable();
      this.ReceiptVoucherForm.controls['Statement'].disable();
      this.ReceiptVoucherForm.controls['Notes'].disable();
      this.modalType = 'View';
      this.hijritype = true;
      this.editInvoices(data);
    }
    this.modalService
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
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



  load_costCenters: any;
  FillCostCenterSelect_Sta() {
    this._accountsreportsService.FillCostCenterSelect().subscribe(data => {
      
      this.load_costCenters = data;
    });
  }
  load_accountIds: any;
  FillAccountsSelect() {
    this._accountsreportsService.FillAccountsSelect().subscribe(data => {
      this.load_accountIds = data;
    });
  }
  data: any = {
    filter: {
      enable: false,
      date: null,
      search_accountId: null,
      search_costCenterId: null,
      DateFrom_P: null,
      DateTo_P: null,
      isChecked: false,
      isCheckedYear: false,
      isCheckedBranch: false,

    }
  };
  projectsDataSourceTemp: any = [];
  DataSource: any = []
  sumcredit: any = 0
  sumdepit: any = 0
  sumbalance: any = 0
  afterDatebalance: any = 0
  afterDate: boolean = false
  RefreshData() {
    var _voucherFilterVM = new ReportCustomer();
    _voucherFilterVM.isCheckedYear = this.data.filter.isCheckedYear;
    _voucherFilterVM.isCheckedBranch = this.data.filter.isCheckedBranch;

    _voucherFilterVM.accountId = this.data.filter.search_accountId;
    _voucherFilterVM.customerId = this.data.filter.search_costCenterId;
    if (this.data.filter.DateFrom_P != null && this.data.filter.DateTo_P != null) {
      _voucherFilterVM.dateFrom = this.data.filter.DateFrom_P.toString();
      _voucherFilterVM.dateTo = this.data.filter.DateTo_P.toString();
    }
    var obj = _voucherFilterVM;
    if (this.data.filter.DateFrom_P != null && this.data.filter.DateTo_P != null) {
      this.afterDate = true
      this.afterDatebalance = this.sumbalance
    } else {
      this.afterDate = false
      this.afterDatebalance = 0
    }
    this._accountsreportsService.GetAllTransSearch_New(obj).subscribe((data: any) => {
      this.sumbalance = 0
      this.sumcredit = 0
      this.sumdepit = 0
      data.forEach((element: any) => {
        this.sumcredit += Number(element.credit)
        this.sumdepit += Number(element.depit)
        this.sumbalance = this.afterDatebalance
        element.balance = this.sumbalance + (element.depit - element.credit)
        this.sumbalance = element.balance

        // this.sumbalance += Number(finalbalance)
      });
      this.projectsDataSource = new MatTableDataSource(data);
      
      this.DataSource = data;
      this.DataSourceTemp = data;
      this.projectsDataSourceTemp = data;
      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
    }, (err) => {
      this.sumbalance = 0
      this.sumcredit = 0
      this.sumdepit = 0
    }
    );
  }

  BalanceBefore: any = {
    text: null,
    value: null,
    show: null,
  }


  GetBalanceBefore() {

  }

  CheckDate(event: any) {
    if (event != null) {
      this.data.filter.DateFrom_P = this._sharedService.date_TO_String(event[0]);
      this.data.filter.DateTo_P = this._sharedService.date_TO_String(event[1]);
      this.RefreshData_ByDate(this.data.filter.DateFrom_P, this.data.filter.DateTo_P);
      this.BalanceBeforeObj.Show = true;

    }
  }

  // CheckDate(event: any) {
  //   if (event != null) {
  //     this.data.filter.DateFrom_P = this._sharedService.date_TO_String(event[0]);
  //     this.data.filter.DateTo_P = this._sharedService.date_TO_String(event[1]);
  //     this.RefreshData();
  //   }
  //   else {
  //     this.data.filter.DateFrom_P = null;
  //     this.data.filter.DateTo_P = null;
  //     this.data.filter.date = null;
  //     this.RefreshData();
  //   }
  // }


  // valapplyFilter: any

  // applyFilter(event: any) {
  //   const val = event.target.value.toLowerCase();
  //   this.valapplyFilter = val
  //   const tempsource = this.projectsDataSourceTemp.filter(function (d: any) {
  //     return (d.accTransactionDate.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
  //       || (d.notes.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
  //       || (d.transactionDate.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
  //       || (d.depit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
  //       || (d.credit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
  //       || (d.balance.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
  //       || (d.typeName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
  //       || (d.journalNo.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
  //       || (d.costCenterName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)


  //   });
  //   this.sumbalance = 0
  //   this.sumcredit = 0
  //   this.sumdepit = 0
  //   tempsource.forEach((element: any) => {
  //     this.sumcredit += Number(element.credit)
  //     this.sumdepit += Number(element.depit)
  //     element.balance = this.sumbalance + (element.depit - element.credit)
  //     this.sumbalance = element.balance

  //     // this.sumbalance += Number(finalbalance)
  //   });
  //   this.projectsDataSource = new MatTableDataSource(tempsource);
  //   this.projectsDataSource.paginator = this.paginator;
  //   this.DataSource = tempsource
  //   this.projectsDataSource.sort = this.sort;
  // }








  changeAccount() {
    this.RefreshData_ByDate(this.data.filter.DateFrom_P ?? '', this.data.filter.DateTo_P ?? '');
    // this.BalanceBeforeObj.Show = false;

  }
  changeAccountYear() {
    if(this.data.filter.search_accountId)
      this.RefreshData_ByDate(this.data.filter.DateFrom_P ?? '', this.data.filter.DateTo_P ?? '');
    // this.BalanceBeforeObj.Show = false;

  }
  ResetSearchTime() {
    if (!this.data.filter.enable) {
      this.RefreshData_ByDate("", "");
      this.BalanceBeforeObj.Show = false;
    }
    else {
      if (this.data.filter.DateFrom_P == "" || this.data.filter.DateTo_P == "") this.BalanceBeforeObj.Show = false;
      else this.BalanceBeforeObj.Show = true;
      this.RefreshData_ByDate(this.data.filter.DateFrom_P ?? "", this.data.filter.DateTo_P ?? "");
    }
  }
  BalanceBeforeObj: any = {
    BalanceBefore: 0,
    Show: false,
  }
  ChangeClassVis() {
    if (this.BalanceBeforeObj.Show == false) {
      return "HideBalanceBefore"
    }
    else {
      return "ShowBalanceBefore";
    }
  }

  GetNetBalance(data: any) {
    this.BalanceBeforeObj.BalanceBefore = 0;
    data.forEach((element: any) => {
      this.BalanceBeforeObj.BalanceBefore += (element.depit - element.credit);
    });
    this.BalanceBeforeObj.BalanceBefore = parseFloat(this.BalanceBeforeObj.BalanceBefore).toFixed(2);
  }
  DataSourceSortedlist=[]
  RefreshData_ByDate(FromDate: any, ToDate: any) {
    debugger
    this.BalanceBeforeObj.BalanceBefore = 0
    if (FromDate == "" || ToDate == "") {
      this.BalanceBeforeObj.Show = false;
    } else {
      this.BalanceBeforeObj.Show = true;
    }

    var _voucherFilterVM = new ReportCustomer();
    _voucherFilterVM.isCheckedYear = this.data.filter.isCheckedYear;
    _voucherFilterVM.isCheckedBranch = this.data.filter.isCheckedBranch;

    _voucherFilterVM.accountId = this.data.filter.search_accountId;
    _voucherFilterVM.customerId = this.data.filter.search_costCenterId;
    _voucherFilterVM.dateFrom = '';
    _voucherFilterVM.dateTo = '';
    var objdata = _voucherFilterVM;
    this._accountsreportsService.GetAllTransSearch_New(objdata).subscribe((data: any) => {
      if (FromDate != null && ToDate != null) {
        _voucherFilterVM.dateFrom = FromDate.toString();
        _voucherFilterVM.dateTo = ToDate.toString();
      }
      var Obj = null;
      if (!(FromDate == "" || ToDate == "")) {
        var ObjBefore = data.filter((a: { transactionDate: any; }) => new Date(a.transactionDate) < new Date(FromDate));
        this.GetNetBalance(ObjBefore);
        Obj = data.filter((a: { transactionDate: any; }) => new Date(a.transactionDate) >= new Date(FromDate) && new Date(a.transactionDate) <= new Date(ToDate));
      }
      else {
        Obj = data;
      }
    
      this.projectsDataSource = new MatTableDataSource(Obj);
      this.DataSourceTemp = new MatTableDataSource(Obj);
      this.DataSource = Obj;
      this.DataSourceSortedlist = data;
      this.projectsDataSourceTemp = Obj;
      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
      this.allbalance()
    }, (err) => {
    }
    );
  }

  GetTransactionNote(element:any){
    if(element.type==8)
    {
      if(element.details==""||element.details==null)
      {
        return element.notes;
      }
      else
      {
        return element.details;
      }
    }
    else
    {
      return element.notes;
    }
  }

  totalBeforeFilter: any;
  totalAfterFilter: any;

  findsumByColumn(colName: string) {
    var total: any;
    var data = this.projectsDataSourceTemp as Array<Transactions>;

    if (colName == "depit") {
      total = data.map(a => a.depit).reduce(function (a, b) {
        return a! + b!;
      });
    }
    if (colName == "credit") {

      total = data.map(a => a.credit).reduce(function (a, b) {
        return a! + b!;
      });
    }

    return total;
    
  }

  findRasedBefore_filter(data: any) {

    var _data = data as Array<Transactions>;

    var totalDepit = _data.map(a => a.depit).reduce(function (a, b) {
      return a! + b!;
    });

    var totalCredit = _data.map(a => a.credit).reduce(function (a, b) {
      return a! + b!;
    });
    this.totalBeforeFilter = totalCredit! - totalDepit!;
    
  }


  totalbalance: any;


  CurrentDataAfterSort: any;
  CurrentBalanceNew(index: any) {
    this.projectsDataSource.connect().subscribe(d => this.CurrentDataAfterSort = d);
    var sum = 0;
    if( this.BalanceBeforeObj.Show == true){sum = Number(this.BalanceBeforeObj.BalanceBefore)}
    for (var i = 0; i <= index; i++) {
      sum += +parseFloat((this.CurrentDataAfterSort[i]?.depit ?? 0).toString()).toFixed(2) - +parseFloat((this.CurrentDataAfterSort[i]?.credit ?? 0).toString()).toFixed(2);
    }
    return parseFloat(sum.toString()).toFixed(2);
  }
  CurrentBalance: any;
  CurrentData: any;
  allbalance() {
    this.DataSourceTemp.connect().subscribe((d: any) => this.CurrentData = d);
    var sum = 0;
    for (var i = 0; i <= this.projectsDataSourceTemp.length; i++) {
      sum += +parseFloat((this.CurrentData[i]?.depit ?? 0).toString()).toFixed(2) - +parseFloat((this.CurrentData[i]?.credit ?? 0).toString()).toFixed(2);
    }
    this.CurrentBalance = Number(sum)
    return parseFloat(sum.toString()).toFixed(2);
  }

  get totalexDepit() {
    var sum = 0;
    this.projectsDataSource?.data?.forEach((element: any) => {
      sum = +parseFloat(sum.toString()).toFixed(2) + +parseFloat((element?.depit ?? 0).toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }
  get totalexCredit() {
    var sum = 0;
    this.projectsDataSource?.data?.forEach((element: any) => {
      sum = +parseFloat(sum.toString()).toFixed(2) + +parseFloat((element?.credit ?? 0).toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }
  get AllBalance() {
    var sum =Number(this.CurrentBalance??0) + Number(this.BalanceBeforeObj.BalanceBefore??0)
    return   sum
  }

  get totaltxt() {
    var dep = this.totalexDepit ?? 0;
    var cre = this.totalexCredit ?? 0;
    if (+(+parseFloat(dep.toString()).toFixed(2) - +parseFloat(cre.toString()).toFixed(2)) > 0) {
      return 'مدين';
    }
    else {
      return 'دائن';
    }
  }
  // findRasedSum(data:any){
  //    debugger
  //    var _data=data as Array<Transactions > ;

  //     for(var item of data){
  //       this.CurrentBalance = (+parseFloat(this.CurrentBalance).toFixed(2) + +parseFloat(item.Depit).toFixed(2) - parseFloat(item.Credit)).toFixed(2);

  //     }
  //  return   this.totalbalance = this.CurrentBalance;

  //   }


  findRasedAfter_filter(data: any) {

    var _data = data as Array<Transactions>;

    var totalDepit = _data.map(a => a.depit).reduce(function (a, b) {
      return a! + b!;
    });

    var totalCredit = _data.map(a => a.credit).reduce(function (a, b) {
      return a! + b!;
    });

    this.totalAfterFilter = totalCredit! - totalDepit!;
    
  }



  valapplyFilter: any
  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    this.valapplyFilter = val

    var tempsource = this.projectsDataSourceTemp;
    if (val) {
      tempsource = this.projectsDataSourceTemp.filter((d: any) => {
        return (d.accTransactionDate != null ? d.accTransactionDate.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.notes != null ? d.notes.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.transactionDate != null ? d.transactionDate.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.depit != null ? d.depit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.credit != null ? d.credit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.balance != null ? d.balance.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.typeName != null ? d.typeName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.journalNo != null ? d.journalNo.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.costCenterName != null ? d.costCenterName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
      });
    }

    this.projectsDataSource = new MatTableDataSource(tempsource);
    this.DataSourceTemp = new MatTableDataSource(tempsource);
    this.projectsDataSource.paginator = this.paginator;
    this.DataSource = tempsource
    this.projectsDataSource.sort = this.sort;
    this.allbalance()

  }


















  OrganizationData: any
  environmentPho: any
  dateprint: any
  printprojectsDataSource: any = []

  accountName: any
  costCenterName: any
  printsumbalance: any
  printsumcredit: any
  printsumdepit: any
  BranchName:any
  getPrintdata(id: any) {
    var _voucherFilterVM = new ReportCustomer();
    _voucherFilterVM.isCheckedYear = this.data.filter.isCheckedYear;
    _voucherFilterVM.isCheckedBranch = this.data.filter.isCheckedBranch;

    _voucherFilterVM.accountId = this.data.filter.search_accountId;
    _voucherFilterVM.customerId = this.data.filter.search_costCenterId;
    _voucherFilterVM.rasedBefore= this.BalanceBeforeObj.BalanceBefore;
    _voucherFilterVM.dateFrom = '';
    _voucherFilterVM.dateTo = '';

    _voucherFilterVM.Sortedlist = []
    this.DataSourceSortedlist.forEach((element: any) => {
      _voucherFilterVM.Sortedlist.push(element.transactionId)
    });

    var objdata = _voucherFilterVM;
    this._accountsreportsService.TransactionsGetReportGrid(objdata).subscribe((data: any) => {
      debugger
      if (this.data.filter.DateFrom_P != null && this.data.filter.DateTo_P != null) {
        this.data.filter.DateFrom_P = this.data.filter.DateFrom_P.toString();
        this.data.filter.DateTo_P = this.data.filter.DateTo_P.toString();
      }else{
        this.data.filter.DateFrom_P = '';
        this.data.filter.DateTo_P = '';
      }
      var Obj = null;
      if (!(this.data.filter.DateFrom_P == "" || this.data.filter.DateTo_P == "")) {
        var ObjBefore = data.transactionVM.filter((a: { transactionDate: any; }) => new Date(a.transactionDate) < new Date(this.data.filter.DateFrom_P));
        this.GetNetBalance(ObjBefore);
        Obj = data.transactionVM.filter((a: { transactionDate: any; }) => new Date(a.transactionDate) >= new Date(this.data.filter.DateFrom_P) && new Date(a.transactionDate) <= new Date(this.data.filter.DateTo_P));



        this.load_accountIds.forEach((element: any) => {
          if (this.data.filter.search_accountId == element.id) {
            this.accountName = element.name
          }
        });
        this.load_costCenters.forEach((element: any) => {
          if (this.data.filter.search_costCenterId == element.id) {
            this.costCenterName = element.name
          }
        });


        this.printprojectsDataSource = [];
        const val = this.valapplyFilter;
        this.dateprint = data.dateTimeNow
        this.OrganizationData = data.org_VD;
        this.BranchName = data.branchName;
        this.environmentPho = environment.PhotoURL + this.OrganizationData.logoUrl;
        const tempsource = Obj.filter(function (d: any) {
          return (d.accTransactionDate!=null?d.accTransactionDate.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
            || (d.notes!=null?d.notes.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
            || (d.transactionDate!=null?d.transactionDate.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
            || (d.depit!=null?d.depit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
            || (d.credit!=null?d.credit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
            || (d.balance!=null?d.balance.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
            || (d.typeName!=null?d.typeName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
            || (d.journalNo!=null?d.journalNo.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
            || (d.costCenterName!=null?d.costCenterName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        });
        // this.printsumbalance = 0
        // this.printsumcredit = 0
        // this.printsumdepit = 0
        // tempsource.forEach((element: any) => {
        //   this.printsumcredit += Number(element.credit)
        //   this.printsumdepit += Number(element.depit)
        //   element.balance = this.printsumbalance + (element.depit - element.credit)
        //   this.printsumbalance = element.balance

        //   // this.printsumbalance += Number(finalbalance)
        // });


        debugger
        //this.printprojectsDataSource = tempsource;
        if(this.projectsDataSource.sort)
        {
          this.printprojectsDataSource=this.projectsDataSource.sortData(this.projectsDataSource.filteredData,this.projectsDataSource.sort);
        }
        else
        {
          this.printprojectsDataSource=this.projectsDataSource.data;
        }
        this.printsumbalance = 0
        if(this.BalanceBeforeObj.Show == true){
          this.printsumbalance = Number(this.BalanceBeforeObj.BalanceBefore)
        }

        this.printsumcredit = 0
        this.printsumdepit = 0
        this.printprojectsDataSource.forEach((element: any) => {
          this.printsumcredit += Number(element.credit)
          this.printsumdepit += Number(element.depit)
          element.balance = this.printsumbalance + (element.depit - element.credit)
          this.printsumbalance = element.balance

          // this.printsumbalance += Number(finalbalance)
        });
        setTimeout(() => {
          this.print.print(id, environment.printConfig);
        }, 500);
      }
      else {
        Obj = data;
              this.load_accountIds.forEach((element: any) => {
                if (this.data.filter.search_accountId == element.id) {
                  this.accountName = element.name
                }
              });
              this.load_costCenters.forEach((element: any) => {
                if (this.data.filter.search_costCenterId == element.id) {
                  this.costCenterName = element.name
                }
              });
              this.printsumbalance = 0
              this.printsumcredit = 0
              this.printsumdepit = 0
              Obj.transactionVM.forEach((element: any) => {
                this.printsumcredit += Number(element.credit)
                this.printsumdepit += Number(element.depit)
                this.printsumbalance = this.afterDatebalance
                element.balance = this.printsumbalance + (element.depit - element.credit)
                this.printsumbalance = element.balance

                // this.printsumbalance += Number(finalbalance)
              });

              this.printprojectsDataSource = [];
              const val = this.valapplyFilter;
              this.dateprint = Obj.dateTimeNow
              this.OrganizationData = Obj.org_VD;
              this.environmentPho = environment.PhotoURL + this.OrganizationData.logoUrl;
              const tempsource = Obj.transactionVM.filter(function (d: any) {
                return (d.accTransactionDate!=null?d.accTransactionDate.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
                  || (d.notes!=null?d.notes.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
                  || (d.transactionDate!=null?d.transactionDate.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
                  || (d.depit!=null?d.depit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
                  || (d.credit!=null?d.credit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
                  || (d.balance!=null?d.balance.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
                  || (d.typeName!=null?d.typeName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
                  || (d.journalNo!=null?d.journalNo.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
                  || (d.costCenterName!=null?d.costCenterName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
              });



              debugger
              //this.printprojectsDataSource = tempsource;
              if(this.projectsDataSource.sort)
              {
                this.printprojectsDataSource=this.projectsDataSource.sortData(this.projectsDataSource.filteredData,this.projectsDataSource.sort);
              }
              else
              {
                this.printprojectsDataSource=this.projectsDataSource.data;
              }
              this.printsumbalance = 0
              this.printsumcredit = 0
              this.printsumdepit = 0
              this.printprojectsDataSource.forEach((element: any) => {
                this.printsumcredit += Number(element.credit)
                this.printsumdepit += Number(element.depit)
                element.balance = this.printsumbalance + (element.depit - element.credit)
                this.printsumbalance = element.balance

                // this.printsumbalance += Number(finalbalance)
              });
              setTimeout(() => {
                this.print.print(id, environment.printConfig);
              }, 500);
      }
    }, (err) => {
      this.printsumbalance = 0
      this.printsumcredit = 0
      this.printsumdepit = 0
    }
    );
  }

  getBalanceStatus(totalDepit:any,totalCredit:any){
    var dep = totalDepit ?? 0;
    var cre = totalCredit ?? 0;
    if (+(+parseFloat(dep.toString()).toFixed(2) - +parseFloat(cre.toString()).toFixed(2)) > 0) {
      return 'مدين';
    }
    else {
      return 'دائن';
    }
  }
  GetDeff(totalDepit:any,totalCredit:any){
    var dep = totalDepit ?? 0;
    var cre = totalCredit ?? 0;
    var Deff = (+parseFloat(dep.toString()).toFixed(2) - +parseFloat(cre.toString()).toFixed(2));
      return parseFloat(Deff.toString()).toFixed(2);
  }

  CurrentBalanceNewExport(index: any,CurrentData:any) {
    var sum = 0;
    if( this.BalanceBeforeObj.Show == true){sum = Number(this.BalanceBeforeObj.BalanceBefore)}
    for (var i = 0; i <= index; i++) {
      sum += +parseFloat((this.CurrentData[i]?.depit ?? 0).toString()).toFixed(2) - +parseFloat((this.CurrentData[i]?.credit ?? 0).toString()).toFixed(2);
    }
    return parseFloat(sum.toString()).toFixed(2);
  }

  ExcelprojectsDataSource: any = []

  exportData() {
    this.ExcelprojectsDataSource=[];
    let x = [];
    if(this.BalanceBeforeObj.Show == true){
    x.push({
      accTransactionDate: null,
      notes:"الرصيد ما قبل الفترة" ,
      transactionDate: null,
      invoiceNumber: null,
      depit: null,
      credit: null,
      balance: this.BalanceBeforeObj.BalanceBefore,
      typeName: null,
      journalNo: null,
      costCenterName: null,
    })}
    if(this.projectsDataSource.sort)
    {
      this.ExcelprojectsDataSource=this.projectsDataSource.sortData(this.projectsDataSource.filteredData,this.projectsDataSource.sort);
    }
    else
    {
      this.ExcelprojectsDataSource=this.projectsDataSource.data;
    }
    for (let index = 0; index < this.ExcelprojectsDataSource.length; index++) {
      x.push({
        accTransactionDate: this.ExcelprojectsDataSource[index].accTransactionDate,
        notes:this.GetTransactionNote(this.ExcelprojectsDataSource[index]),
        transactionDate: this.ExcelprojectsDataSource[index].transactionDate,
        invoiceNumber: this.ExcelprojectsDataSource[index].invoiceNumber,
        depit: parseFloat(this.ExcelprojectsDataSource[index].depit),
        credit: parseFloat(this.ExcelprojectsDataSource[index].credit),
        balance: parseFloat(this.CurrentBalanceNewExport(index,this.ExcelprojectsDataSource)),
        typeName: this.ExcelprojectsDataSource[index].typeName,
        journalNo: this.ExcelprojectsDataSource[index].journalNo,
        costCenterName: this.ExcelprojectsDataSource[index].costCenterName,
      })
    }
    x.push({
      accTransactionDate: null,
      notes: "الاجمالي",
      transactionDate: null,
      invoiceNumber: null,
      depit: parseFloat(this.totalexDepit),
      credit: parseFloat(this.totalexCredit),
      balance: parseFloat(this.totaltxt),
      typeName: null,
      journalNo: null,
      costCenterName: null,
    })
    this.lang == "ar" ? this._accountsreportsService.customExportExcel(x, "كشف حساب") :
    this._accountsreportsService.customExportExcel(x, "Account Statement");

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



  // Save row
  save(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];

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

  //-----------------------------------------------------------
  //#region

  //---------------------------------------Invoice---------------------------------------------
  //#region

  //Date-Hijri
  ChangeInvoiceGre(event: any) {
    if (event != null) {
      const DateHijri = toHijri(this.modalInvoice.Date);
      var DateGre = new HijriDate(
        DateHijri._year,
        DateHijri._month,
        DateHijri._date
      );
      DateGre._day = DateGre._date;
      this.modalInvoice.HijriDate = DateGre;
    } else {
      this.modalInvoice.HijriDate = null;
    }
  }
  ChangeInvoiceDateHijri(event: any) {
    if (event != null) {
      const DateGre = new HijriDate(event.year, event.month, event.day);
      const dayGreg = DateGre.toGregorian();
      this.modalInvoice.Date = dayGreg;
    } else {
      this.modalInvoice.Date = null;
    }
  }
  InvoicePublicView: any;

  modalInvoice: any = {
    InvoiceId: 0,
    InvoiceNumber: null,
    JournalNumber: null,
    InvoicePayType: null,
    Date: new Date(),
    HijriDate: null,
    Notes: null,
    InvoiceNotes: null,
    Type: 2,
    InvoiceValue: 0,
    TotalValue: 0,
    TaxAmount: 0,
    ToAccountId: null,
    ProjectId: null,
    PayType: 1,
    DiscountPercentage: 0,
    DiscountValue: 0,
    customerId: null,
    printBankAccount: false,
    InvoiceReference: null,
    PageInsert: 1,
    CostCenterId: null,
    VoucherAlarmDate: null,
    VoucherAlarmCheck: null,
    IsSendAlarm: null,
    AlarmVoucherInvDate: null,
    Currency: null,
    BranchSelect: null,
    OrganizationsMobile: null,
    OrganizationsAddress: null,
    Reference: null,
    popuptype: 1, //(1) normal invoice - (2) invoice without project - (3) Creditnoti
    CreditNotiLbl: 0,
    DepitNotiLbl: 0,

    CustomerTax: null,
    CustomerAddress: null,
    Customeridtype: null,

    AllCustomerCheck: false,
    OfferPriceNoCheck: null,
    OfferPriceNo: null,

    descountmoney: null,
    descountpersentage: null,
    PaidValue: 0,
    remainder: 0,

    taxtype: 2,
    totalAmount: 0,
    discounMoneytVal: 0,
    total_: 0,
    totalWithDiscount: 0,
    taxAmountLbl: 0,
    VoucherValue: 0,
    TotalVoucherValueLbl: 0,
    GlobalTotalFatora: null,
    WhichClick: 1,
    AddOrView: 1,
    TempBox: null,
  };
  InvoiceDetailsRows: any = [];
  Paytype: any;
  pathurl = environment.PhotoURL;
  public uploadedFiles: Array<File> = [];
  @ViewChild('paginatorServices') paginatorServices!: MatPaginator;

  resetInvoiceData() {
    this.uploadedFiles = [];

    this.Paytype = [
      { id: 1, name: { ar: 'نقدي', en: 'Monetary' } },
      { id: 8, name: { ar: 'آجل', en: 'Postpaid' } },
      {
        id: 17,
        name: { ar: 'نقدا نقاط بيع - مدى-ATM', en: 'Cash points of sale ATM' },
      },
      { id: 9, name: { ar: 'شبكة', en: 'Network' } },
      { id: 6, name: { ar: 'حوالة', en: 'Transfer' } },
    ];

    this.InvoiceDetailsRows = [];
    this.load_CostCenter = [];
    this.load_Accounts = [];
    this.load_Customer = [];
    this.load_Projects = [];
    this.load_OfferPrices = [];
    const DateHijri = toHijri(new Date());
    var DateGre = new HijriDate(
      DateHijri._year,
      DateHijri._month,
      DateHijri._date
    );
    DateGre._day = DateGre._date;

    this.modalInvoice = {
      InvoiceId: 0,
      InvoiceNumber: null,
      JournalNumber: null,
      InvoicePayType: null,
      Date: new Date(),
      HijriDate: DateGre,
      Notes: null,
      InvoiceNotes: null,
      Type: 2,
      InvoiceValue: 0,
      TotalValue: 0,
      TaxAmount: 0,
      ToAccountId: null,
      ProjectId: null,
      PayType: 1,
      DiscountPercentage: 0,
      DiscountValue: 0,
      customerId: null,
      printBankAccount: false,
      InvoiceReference: null,
      PageInsert: 1,
      CostCenterId: null,
      VoucherAlarmDate: null,
      VoucherAlarmCheck: null,
      IsSendAlarm: null,
      AlarmVoucherInvDate: null,
      Currency: null,
      BranchSelect: null,
      OrganizationsMobile: null,
      OrganizationsAddress: null,
      Reference: null,
      popuptype: 1, //(1) normal invoice - (2) invoice without project - (3) Creditnoti
      CreditNotiLbl: 0,
      DepitNotiLbl: 0,

      CustomerTax: null,
      CustomerAddress: null,
      Customeridtype: null,

      AllCustomerCheck: false,
      OfferPriceNoCheck: null,
      OfferPriceNo: null,

      descountmoney: null,
      descountpersentage: null,
      PaidValue: 0,
      remainder: 0,

      taxtype: 2,
      totalAmount: 0,
      discounMoneytVal: 0,
      total_: 0,
      totalWithDiscount: 0,
      taxAmountLbl: 0,
      VoucherValue: 0,
      TotalVoucherValueLbl: 0,
      GlobalTotalFatora: 0,
      WhichClick: 1,
      AddOrView: 1,
      TempBox: null,
      IsPost: null,
    };
  }
  GetAllCustomerForDrop() {
    this._invoiceService.GetAllCustomerForDrop().subscribe((data) => {
      this.load_Customer = data.result;
    });
  }
  FillAllProjectSelectByNAccIdWithout(param: any) {
    this._invoiceService
      .FillAllProjectSelectByNAccIdWithout(param)
      .subscribe((data) => {
        this.load_Projects = data;
      });
  }
  GetAllProjByCustomerIdWithout(param: any) {
    this._invoiceService
      .GetAllProjByCustomerIdWithout(param)
      .subscribe((data) => {
        this.load_Projects = data;
      });
  }
  InvoiceView(data: any) {
    this.modalInvoice.AddOrView = 2;
    this.GetAllCustomerForDrop();
    this.FillStorehouseSelect();
    if (data.addDate !== null) {
      var AddDate = this._sharedService.date_TO_String(new Date(data.addDate));
      //data.addUser
      if (data.addInvoiceImg != '' && data.addInvoiceImg != null) {
      } else {
      }
    }
    var date = this._sharedService.String_TO_date(data.date);
    const DateHijri = toHijri(new Date(date));
    var DateGre = new HijriDate(
      DateHijri._year,
      DateHijri._month,
      DateHijri._date
    );
    DateGre._day = DateGre._date;

    var VoucherValue = data.invoiceValue;
    var TaxValue = data.taxAmount;
    var VoucherTotalValue = data.totalValue;
    var descm_VTemp = data.discountValue || 0;

    VoucherTotalValue =
      +parseFloat(VoucherTotalValue).toFixed(2) +
      +parseFloat(descm_VTemp).toFixed(2);

    this.FillCustAccountsSelect2(data.payType);

    // if (data.payType == 1) {
    //   this.FillAllProjectSelectByNAccIdWithout(data.toAccountId);
    // }
    // if (data.payType == 17) {
    //   this.FillAllProjectSelectByNAccIdWithout(data.toAccountId);
    // }
    this.FillAllProjectSelectByNAccIdWithout(data.toAccountId);

    var popuptype = 1;
    if (data.projectId > 0) {
      popuptype = 1;
      this.FillCostCenterSelect_Invoices(data.projectId);
    } else {
      popuptype = 2;
      this.FillCostCenterSelect();
    }
    if (data.payType == 8) {
      this.GetAllProjByCustomerIdWithout(data.customerId);
      this.getCusAccID(data.customerId, true);
    } else {
      this.getCusAccID(data.customerId, false);
    }

    var taxtype = 2;
    var costcenterid = null;

    data.voucherDetails.forEach((item: any) => {
      var AmountVal = 0;
      var AmountValWithDisc = 0;

      if (item.taxType == 3) {
        AmountVal =
          (+parseFloat(item.totalAmount).toFixed(2) +
            +parseFloat(item.discountValue_Det).toFixed(2)) /
          item.qty;
      } else {
        AmountVal =
          (+parseFloat(item.amount).toFixed(2) +
            +parseFloat(item.discountValue_Det).toFixed(2)) /
          item.qty;
      }

      var maxVal = 0;
      if (this.InvoiceDetailsRows.length > 0) {
        maxVal = Math.max(
          ...this.InvoiceDetailsRows.map((o: { idRow: any }) => o.idRow)
        );
      } else {
        maxVal = 0;
      }

      this.InvoiceDetailsRows?.push({
        idRow: maxVal + 1,
        AccJournalid: item.servicesPriceId,
        UnitConst: item.serviceTypeName,
        QtyConst: item.qty,
        DiscountValueConst: item.discountValue_Det,
        DiscountPercentageConst: item.discountPercentage_Det,
        accountJournaltxt: item.servicesPriceName,
        AmountBeforeTaxtxt: AmountVal,
        Amounttxt: AmountVal,
        taxAmounttxt: item.taxAmount,
        TotalAmounttxt: item.totalAmount,
      });

      taxtype = item.taxType;
      costcenterid = item.costCenterId;
    });
    var paid_V2 = data.paidValue ?? 0;
    var descm_V = data.discountValue ?? 0;
    var Total = +parseFloat(VoucherTotalValue).toFixed(2);
    var val_vouc = data.invoiceValue;
    if (taxtype == 3) {
      val_vouc = parseFloat(
        (parseFloat(data.invoiceValue) - parseFloat(data.taxAmount)).toString()
      ).toFixed(2);
    } else {
      val_vouc = parseFloat(data.InvoiceValue).toFixed(2);
    }
    this.modalInvoice = {
      InvoiceId: data.invoiceId,
      InvoiceNumber: data.invoiceNumber,
      JournalNumber: data.journalNumber,
      InvoicePayType: null,
      storehouseId:data.storehouseId,
      Date: date,
      HijriDate: DateGre,
      Notes: data.notes,
      InvoiceNotes: data.invoiceNotes,
      Type: 2,
      InvoiceValue: 0,
      TotalValue: 0,
      TaxAmount: 0,
      ToAccountId: data.toAccountId,
      ProjectId: data.projectId,
      PayType: data.payType,
      DiscountPercentage: 0,
      DiscountValue: 0,
      customerId: data.customerId,
      printBankAccount: data.printBankAccount,
      InvoiceReference: data.invoiceReference,
      PageInsert: 1,
      CostCenterId: costcenterid,
      VoucherAlarmDate: null,
      VoucherAlarmCheck: null,
      IsSendAlarm: null,
      AlarmVoucherInvDate: null,
      Currency: null,
      BranchSelect: null,
      OrganizationsMobile: null,
      OrganizationsAddress: null,
      Reference: data.invoiceReference,
      popuptype: popuptype, //(1) normal invoice - (2) invoice without project - (3) Creditnoti
      CreditNotiLbl: 0,
      DepitNotiLbl: 0,

      CustomerTax: null,
      CustomerAddress: null,
      Customeridtype: null,

      AllCustomerCheck: false,
      OfferPriceNoCheck: null,
      OfferPriceNo: null,

      descountmoney: data.discountValue ?? 0,
      descountpersentage: data.discountPercentage ?? 0,
      PaidValue: data.paidValue ?? 0,
      remainder: 0,

      taxtype: taxtype,
      totalAmount: Total,
      discounMoneytVal: 0,
      total_: Total,
      totalWithDiscount: val_vouc,
      taxAmountLbl: data.taxAmount,
      VoucherValue: val_vouc,
      TotalVoucherValueLbl: VoucherTotalValue,
      GlobalTotalFatora: 0,
      WhichClick: 1,
      AddOrView: 2,
      addInvoiceImg: data.addInvoiceImg,
      TempBox: null,
      IsPost: data.isPost,
    };

    this.CalculateTotal(1);

    this.modalInvoice.PaidValue = paid_V2;
    this.modalInvoice.CreditNotiLbl = data.creditNotiTotal;
    this.modalInvoice.DepitNotiLbl = data.depitNotiTotal;

    descm_V = descm_V || '0';
    Total = Total - descm_V;

    var CalcAll =
      +parseFloat(Total.toString()).toFixed(2) +
      +parseFloat(data.depitNotiTotal.toString()).toFixed(2);
    CalcAll = +parseFloat(
      (
        +parseFloat(CalcAll.toString()).toFixed(2) -
        parseFloat(data.creditNotiTotal)
      ).toString()
    ).toFixed(2);
    this.modalInvoice.TotalVoucherValueLbl = CalcAll;
    this.checkRemainder();
  }

  load_Customer: any;
  FillAllCustomerSelectNotHaveProjWithBranch() {
    this._invoiceService
      .FillAllCustomerSelectNotHaveProjWithBranch()
      .subscribe((data) => {
        this.load_Customer = data;
      });
  }
  FillAllCustomerSelectWithBranch() {
    this._invoiceService.FillAllCustomerSelectWithBranch().subscribe((data) => {
      this.load_Customer = data;
    });
  }
  FillCustomerSelectWProOnlyWithBranch() {
    this._invoiceService
      .FillCustomerSelectWProOnlyWithBranch()
      .subscribe((data) => {
        this.load_Customer = data;
      });
  }
  load_CostCenter: any;
  FillCostCenterSelect() {
    this._invoiceService.FillCostCenterSelect().subscribe((data) => {
      this.load_CostCenter = data;
      this._invoiceService.GetBranch_Costcenter().subscribe((data) => {
        if (this.modalInvoice.AddOrView == 1) {
          this.modalInvoice.CostCenterId = data.result.costCenterId;
        }
        this.modalInvoice.OrganizationsAddress = data.result.nameAr;
      });
    });
  }
  FillCostCenterSelect_Invoices(projectid: any) {
    this._invoiceService.GetBranch_Costcenter().subscribe((data) => {
      this.modalInvoice.OrganizationsAddress = data.result.nameAr;
    });

    if (projectid != null) {
      this._invoiceService
        .FillCostCenterSelect_Invoices(projectid)
        .subscribe((data) => {
          this.load_CostCenter = data;
        });
    } else {
      this.load_CostCenter = [];
      this.modalInvoice.CostCenterId = null;
    }
  }
  FillCostCenterSelect_InvoicesWithGet(projectid: any) {
    if (projectid != null) {
      this._invoiceService
        .FillCostCenterSelect_Invoices(projectid)
        .subscribe((data) => {
          this.load_CostCenter = data;
          this.GetCostCenterByProId_Proj(this.modalInvoice.ProjectId);
        });
    } else {
      this.load_CostCenter = [];
      this.modalInvoice.CostCenterId = null;
    }
  }
  // GetBranch_Costcenter(){
  //   this._invoiceService.GetBranch_Costcenter().subscribe(data=>{
  //     console.log(data.result); //.costCenterId
  //   });
  // }
  GetBranchOrganization() {
    this._invoiceService.GetBranchOrganization().subscribe((data) => {
      this.modalInvoice.OrganizationsMobile = data.result.mobile;
    });
  }
  GenerateVoucherNumber() {
    this._invoiceService
      .GenerateVoucherNumber(this.modalInvoice.Type)
      .subscribe((data) => {
        this.modalInvoice.InvoiceNumber = data.reasonPhrase;
        this.InvoiceDetailsRows = [];
        this.addInvoiceRow();
      });
  }
  load_Accounts: any;
  FillCustAccountsSelect2(PayType: any) {
    if (PayType) {
      this._invoiceService
        .FillCustAccountsSelect2(PayType)
        .subscribe((data) => {
          this.load_Accounts = data;
        });
    } else {
      this.load_Accounts = [];
    }
  }
  FillCustAccountsSelect2AndUpdate(PayType: any) {
    if (PayType) {
      this._invoiceService
        .FillCustAccountsSelect2(PayType)
        .subscribe((data) => {
          this.load_Accounts = data;
          if (PayType != 8) {
            if (this.load_Accounts?.length > 0) {
              this.modalInvoice.ToAccountId = this.load_Accounts[0]?.id;
            } else {
              this.modalInvoice.ToAccountId = null;
            }
          }
        });
    } else {
      this.load_Accounts = [];
    }
  }

  load_Projects: any;
  FillAllProjectSelectByNAccId(PayType: any) {
    if (PayType) {
      this._invoiceService
        .FillAllProjectSelectByNAccId(PayType)
        .subscribe((data) => {
          this.load_Projects = data;
        });
    } else {
      this.load_Projects = [];
    }
  }
  GetAllProjByCustomerId(customerid: any) {
    debugger;
    this.load_Projects = [];
    if (this.modalInvoice.popuptype == 1) {
      this.load_CostCenter = [];
      this.modalInvoice.CostCenterId = null;
    }
    this.modalInvoice.ProjectId = null;
    if (customerid) {
      this._invoiceService
        .GetAllProjByCustomerId(customerid)
        .subscribe((data) => {
          this.load_Projects = data;
          if (this.load_Projects.length == 1) {
            this.modalInvoice.ProjectId = this.load_Projects[0].id;
            this.ProjectIdChange();
            //this.GetCostCenterByProId_Proj(this.modalInvoice.ProjectId);
          }
        });
    } else {
      this.load_Projects = [];
    }
  }
  GetCostCenterByProId_Proj(projectid: any) {
    if (projectid) {
      this._invoiceService.GetCostCenterByProId(projectid).subscribe((data) => {
        this.modalInvoice.CostCenterId = data.result.costCenterId;
      });
    } else {
      this.modalInvoice.CostCenterId = null;
    }
  }
  AllCustomerCheckChange() {
    this.modalInvoice.customerId = null;
    if (this.modalInvoice.AllCustomerCheck) {
      this.FillAllCustomerSelectWithBranch();
    } else {
      this.FillAllCustomerSelectNotHaveProjWithBranch();
    }
  }
  PayTypeChange() {
    this.modalInvoice.ToAccountId = null;
    if (this.modalInvoice.PayType != null) {
      this.FillAllProjectSelectByNAccId(0); //
      if (this.modalInvoice.popuptype == 1) {
        this.FillCustomerSelectWProOnlyWithBranch();
      } else if (this.modalInvoice.popuptype == 2) {
        this.FillAllCustomerSelectNotHaveProjWithBranch();
      }
    }
    if (this.modalInvoice.PayType == 8) {
      this.FillCustAccountsSelect2(this.modalInvoice.PayType);
      this.getCusAccID(this.modalInvoice.customerId, true);
      this.CalculateTotal2(1);
    } else if (this.modalInvoice.PayType == 1) {
      this.FillCustAccountsSelect2AndUpdate(this.modalInvoice.PayType);
    } else if (this.modalInvoice.PayType == 17) {
      this.FillCustAccountsSelect2AndUpdate(this.modalInvoice.PayType);
    } else {
      this.FillCustAccountsSelect2(this.modalInvoice.PayType);
    }
  }

  getCusAccID(customerid: any, paytype: any) {
    if (customerid != null) {
      this._invoiceService
        .GetCustomersByCustomerId(customerid)
        .subscribe((data) => {
          if (paytype) {
            this.modalInvoice.ToAccountId = data.result.accountId;
          }
          if (data.result.customerTypeId == 2) {
            this.modalInvoice.CustomerTax = data.result.customerAddress;
            this.modalInvoice.CustomerAddress = data.result.customerAddress;
            this.modalInvoice.Customeridtype = data.result.customerTypeId;
          } else {
            this.modalInvoice.CustomerTax = data.result.commercialRegister;
            this.modalInvoice.CustomerAddress = data.result.customerAddress;
            this.modalInvoice.Customeridtype = data.result.customerTypeId;
          }
        });
    }
  }

  load_OfferPrices: any;
  FillAllOfferTodropdownOld(customerid: any) {
    if (customerid != null) {
      this._invoiceService
        .FillAllOfferTodropdownOld(customerid)
        .subscribe((data) => {
          this.load_OfferPrices = data;
        });
    } else {
      this.load_OfferPrices = [];
    }
  }

  ProjectIdChange() {
    debugger;
    if (this.modalInvoice.ProjectId != null) {
      this.FillCostCenterSelect_Invoices(this.modalInvoice.ProjectId);
      this.GetCostCenterByProId_Proj(this.modalInvoice.ProjectId);
    } else {
      this.load_CostCenter = [];
      this.modalInvoice.CostCenterId = null;
    }
  }

  accountIdChange() {
    if (this.modalInvoice.ToAccountId) {
      this._invoiceService
        .GetCustomersByAccountId(this.modalInvoice.ToAccountId)
        .subscribe((data) => {
          debugger;
          this.modalInvoice.customerId = data.result.customerId;
          if (this.modalInvoice.PayType == 8) {
            this.modalInvoice.ProjectId = null;
            this.modalInvoice.CostCenterId = null;
            this.FillAllOfferTodropdownOld(data.result.customerId);
            this.GetAllProjByCustomerId(data.result.customerId);
            this.getCusAccID(data.result.customerId, false);
          } else {
            this.modalInvoice.customerId = null;
            this.modalInvoice.ProjectId = null;
            this.modalInvoice.CostCenterId = null;
          }
        });
    } else {
      this.modalInvoice.customerId = null;
      this.modalInvoice.ProjectId = null;
      this.modalInvoice.CostCenterId = null;
    }
  }

  customerIdChange() {
    this.FillAllOfferTodropdownOld(this.modalInvoice.customerId);

    if (this.modalInvoice.PayType == 8) {
      this.getCusAccID(this.modalInvoice.customerId, true);
    } else {
      this.getCusAccID(this.modalInvoice.customerId, false);
    }

    if (this.modalInvoice.popuptype != 2) {
      this.GetAllProjByCustomerId(this.modalInvoice.customerId);
    }

    //this.GetAllProjByCustomerId(this.modalInvoice.customerId);
  }

  CalculateTotal2(type: any) {
    this.modalInvoice.descountmoney = null;
    this.modalInvoice.descountpersentage = null;
    this.modalInvoice.PaidValue = 0;
    this.CalculateTotal(type);
  }
  CalculateTotal(type: any) {
    var totalwithtaxes = 0;
    var totalAmount = 0;
    var totalDisc = 0;
    var totalDiscWithamountAll = 0;
    var totaltax = 0;
    var totalAmountIncludeT = 0;
    var vAT_TaxVal = parseFloat(this.userG.orgVAT ?? 0);
    this.InvoiceDetailsRows.forEach((element: any) => {
      var ValueAmount = parseFloat((element.Amounttxt ?? 0).toString()).toFixed(
        2
      );
      ValueAmount = parseFloat(
        (+ValueAmount * element.QtyConst).toString()
      ).toFixed(2);
      var DiscountValue_Det;
      if (type == 1) {
        DiscountValue_Det = parseFloat(
          (element.DiscountValueConst ?? 0).toString()
        ).toFixed(2);
      } else {
        var Discountper_Det = parseFloat(
          (element.DiscountPercentageConst ?? 0).toString()
        ).toFixed(2);
        DiscountValue_Det = parseFloat(
          ((+Discountper_Det * +ValueAmount) / 100).toString()
        ).toFixed(2);
        this.InvoiceDetailsRows.filter(
          (a: { idRow: any }) => a.idRow == element.idRow
        )[0].DiscountValueConst = parseFloat(
          DiscountValue_Det.toString()
        ).toFixed(2);
      }
      var Value = parseFloat(
        (+ValueAmount - +DiscountValue_Det).toString()
      ).toFixed(2);
      if (!(+Value >= 0)) {
        this.InvoiceDetailsRows.filter(
          (a: { idRow: any }) => a.idRow == element.idRow
        )[0].DiscountValueConst = 0;
        this.InvoiceDetailsRows.filter(
          (a: { idRow: any }) => a.idRow == element.idRow
        )[0].DiscountPercentageConst = 0;
        DiscountValue_Det = 0;
        Value = parseFloat(
          (+ValueAmount - +DiscountValue_Det).toString()
        ).toFixed(2);
      }
      if (type == 1) {
        var DiscountPercentage_Det;
        if (+ValueAmount > 0) {
          DiscountPercentage_Det = (+DiscountValue_Det * 100) / +ValueAmount;
        } else {
          DiscountPercentage_Det = 0;
        }
        DiscountPercentage_Det = parseFloat(
          DiscountPercentage_Det.toString()
        ).toFixed(2);
        this.InvoiceDetailsRows.filter(
          (a: { idRow: any }) => a.idRow == element.idRow
        )[0].DiscountPercentageConst = DiscountPercentage_Det;
      }

      var FValDisc = DiscountValue_Det;
      var FValAmountAll = ValueAmount;
      var FVal = Value;
      var FValIncludeT = FVal;
      var taxAmount = 0;
      var totalwithtax = 0;

      var TaxV8erS = parseFloat(
        (
          +parseFloat((+Value * vAT_TaxVal).toString()).toFixed(2) / 100
        ).toString()
      ).toFixed(2);
      var TaxVS = parseFloat(
        (
          +Value -
          +parseFloat((+Value / (vAT_TaxVal / 100 + 1)).toString()).toFixed(2)
        ).toString()
      ).toFixed(2);

      if (this.modalInvoice.taxtype == 2) {
        taxAmount = +TaxV8erS;
        totalwithtax = +parseFloat(
          (+parseFloat(Value) + +parseFloat(TaxV8erS)).toString()
        ).toFixed(2);
      } else {
        taxAmount = +TaxVS;
        FValIncludeT = parseFloat(
          (+parseFloat(Value).toFixed(2) - +TaxVS).toString()
        ).toFixed(2);
        totalwithtax = +parseFloat(Value).toFixed(2);
      }

      this.InvoiceDetailsRows.filter(
        (a: { idRow: any }) => a.idRow == element.idRow
      )[0].AmountBeforeTaxtxt = parseFloat(FValIncludeT.toString()).toFixed(2);
      this.InvoiceDetailsRows.filter(
        (a: { idRow: any }) => a.idRow == element.idRow
      )[0].taxAmounttxt = parseFloat(taxAmount.toString()).toFixed(2);
      this.InvoiceDetailsRows.filter(
        (a: { idRow: any }) => a.idRow == element.idRow
      )[0].TotalAmounttxt = parseFloat(totalwithtax.toString()).toFixed(2);

      totalwithtaxes = +parseFloat(
        (
          +parseFloat(totalwithtaxes.toString()).toFixed(2) +
          +parseFloat(totalwithtax.toString()).toFixed(2)
        ).toString()
      ).toFixed(2);
      totalAmount = +parseFloat(
        (
          +parseFloat(totalAmount.toString()).toFixed(2) +
          +parseFloat(FVal).toFixed(2)
        ).toString()
      ).toFixed(2);
      totalAmountIncludeT = +parseFloat(
        (
          +parseFloat(totalAmountIncludeT.toString()).toFixed(2) +
          +parseFloat(totalwithtax.toString()).toFixed(2)
        ).toString()
      ).toFixed(2);
      totaltax = +parseFloat(
        (
          +parseFloat(totaltax.toString()).toFixed(2) +
          +parseFloat(taxAmount.toString()).toFixed(2)
        ).toString()
      ).toFixed(2);
      totalDisc = +parseFloat(
        (
          +parseFloat(totalDisc.toString()).toFixed(2) +
          +parseFloat(FValDisc.toString()).toFixed(2)
        ).toString()
      ).toFixed(2);
      totalDiscWithamountAll = +parseFloat(
        (
          +parseFloat(totalDiscWithamountAll.toString()).toFixed(2) +
          +parseFloat(FValAmountAll).toFixed(2)
        ).toString()
      ).toFixed(2);
    });

    this.modalInvoice.totalAmount = parseFloat(
      totalDiscWithamountAll.toString()
    ).toFixed(2);
    this.modalInvoice.discounMoneytVal = parseFloat(
      totalDisc.toString()
    ).toFixed(2);
    this.modalInvoice.total_ = parseFloat(totalAmount.toString()).toFixed(2);
    this.modalInvoice.totalWithDiscount = parseFloat(
      totalAmount.toString()
    ).toFixed(2);
    this.modalInvoice.taxAmountLbl = parseFloat(totaltax.toString()).toFixed(2);

    if (this.modalInvoice.taxtype == 2) {
      this.modalInvoice.VoucherValue = parseFloat(
        totalAmount.toString()
      ).toFixed(2);
      this.modalInvoice.TotalVoucherValueLbl = parseFloat(
        (+totalAmount + +totaltax).toString()
      ).toFixed(2);
    } else {
      this.modalInvoice.VoucherValue = parseFloat(
        (+totalAmount - +totaltax).toString()
      ).toFixed(2);
      this.modalInvoice.TotalVoucherValueLbl = parseFloat(
        totalAmount.toString()
      ).toFixed(2);
    }
    this.checkRemainder();
  }

  checkRemainder() {
    var _paidValInvoice = parseFloat(this.modalInvoice.PaidValue).toFixed(2);
    var totalInvoiceVal = parseFloat(
      this.modalInvoice.TotalVoucherValueLbl
    ).toFixed(2);
    if (
      parseInt(_paidValInvoice) > parseInt(totalInvoiceVal) &&
      parseInt(totalInvoiceVal) != 0
    ) {
      this.modalInvoice.PaidValue = totalInvoiceVal;
    }
    var remainder =
      +parseFloat(this.modalInvoice.TotalVoucherValueLbl).toFixed(2) -
      +parseFloat(this.modalInvoice.PaidValue).toFixed(2);
      var Accremainder = parseFloat(remainder.toString()).toFixed(2);
      this.modalInvoice.remainder = Accremainder;
  }

  offerpriceChange() {
    var stu = this.modalInvoice.OfferPriceNoCheck;
    if (this.modalInvoice.OfferPriceNo != null && stu == true) {
      this.InvoiceDetailsRows = [];
      this.GetOfferPriceServiceForContract(this.modalInvoice.OfferPriceNo);
    } else {
      this.InvoiceDetailsRows = [];
      this.addInvoiceRow();
    }
  }
  taxtypeChange() {
    this.CalculateTotal(1);
  }
  applyFilterServiceList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.serviceListDataSource.filter = filterValue.trim().toLowerCase();
  }
  serviceListDataSource = new MatTableDataSource();
  servicesListdisplayedColumns: string[] = ['name', 'price'];
  servicesList: any;
  selectedServiceRow: any;
  serviceListDataSourceTemp: any = [];
  GetAllServicesPrice() {
    this._invoiceService.GetAllServicesPrice().subscribe((data) => {
      this.serviceListDataSource = new MatTableDataSource(data.result);
      this.serviceListDataSource.paginator = this.paginatorServices;

      this.servicesList = data.result;
      this.serviceListDataSourceTemp = data.result;
    });
  }
  GetServwithOffer(OfferPriceNo: any) {
    this._invoiceService
      .GetOfferservicenByid(OfferPriceNo)
      .subscribe((data) => {
        this.serviceListDataSource = new MatTableDataSource(data.result);
        this.serviceListDataSource.paginator = this.paginatorServices;
        this.servicesList = data.result;
        this.serviceListDataSourceTemp = data.result;
      });
  }

  GetOfferPriceServiceForContract(OfferId: any) {
    this._invoiceService.GetOfferservicenByid(OfferId).subscribe((data) => {
      data.result.forEach((element: any) => {
        this.modalInvoice.taxtype = element.taxType;
        this.GetServicesPriceByServiceId(element);
      });
    });
  }

  GetServicesPriceByServiceId(offerdata: any) {
    this._invoiceService
      .GetServicesPriceByServiceId(offerdata.serviceId)
      .subscribe((data) => {
        var maxVal = 0;

        if (this.InvoiceDetailsRows.length > 0) {
          maxVal = Math.max(
            ...this.InvoiceDetailsRows.map((o: { idRow: any }) => o.idRow)
          );
        } else {
          maxVal = 0;
        }
        this.setServiceRowValueNew(
          maxVal + 1,
          data.result,
          offerdata.serviceQty,
          offerdata.serviceamountval,
          offerdata
        );
      });
  }

  GetAccountJournalSearchGrid() {
    if (this.modalInvoice.OfferPriceNo != null) {
      this.GetServwithOffer(this.modalInvoice.OfferPriceNo);
    } else {
      this.GetAllServicesPrice();
    }
  }

  addInvoiceRow() {
    var maxVal = 0;
    if (this.InvoiceDetailsRows.length > 0) {
      maxVal = Math.max(
        ...this.InvoiceDetailsRows.map((o: { idRow: any }) => o.idRow)
      );
    } else {
      maxVal = 0;
    }

    this.InvoiceDetailsRows?.push({
      idRow: maxVal + 1,
      AccJournalid: null,
      UnitConst: null,
      QtyConst: null,
      DiscountValueConst: null,
      DiscountPercentageConst: null,
      accountJournaltxt: null,
      AmountBeforeTaxtxt: null,
      Amounttxt: null,
      taxAmounttxt: null,
      TotalAmounttxt: null,
    });
  }

  deleteInvoiceRow(idRow: any) {
    let index = this.InvoiceDetailsRows.findIndex(
      (d: { idRow: any }) => d.idRow == idRow
    );
    this.InvoiceDetailsRows.splice(index, 1);
    this.CalculateTotal(1);
  }

  setServiceRowValue(element: any) {
    this.InvoiceDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == this.selectedServiceRow
    )[0].AccJournalid = element.servicesId;
    this.InvoiceDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == this.selectedServiceRow
    )[0].UnitConst = element.serviceTypeName;
    this.InvoiceDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == this.selectedServiceRow
    )[0].QtyConst = 1;
    this.InvoiceDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == this.selectedServiceRow
    )[0].accountJournaltxt = element.servicesName;
    this.InvoiceDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == this.selectedServiceRow
    )[0].Amounttxt = element.amount;
    this.CalculateTotal2(1);
    this.addInvoiceRow();
  }

  setServiceRowValueNew(indexRow: any, item: any, Qty: any, servamount: any,data:any) {
      var AmountVal = 0;
      if (data.taxType == 3) {
        AmountVal =(+parseFloat(data.totalAmount).toFixed(2) + +parseFloat(data.discountValue_Det).toFixed(2)) /Qty;
      } else {
        AmountVal =(+parseFloat(data.amount).toFixed(2) + +parseFloat(data.discountValue_Det).toFixed(2)) / Qty;
      }

    this.addInvoiceRow();
    this.InvoiceDetailsRows.filter((a: { idRow: any }) => a.idRow == indexRow)[0].AccJournalid = item.servicesId;
    this.InvoiceDetailsRows.filter((a: { idRow: any }) => a.idRow == indexRow)[0].UnitConst = item.serviceTypeName;
    this.InvoiceDetailsRows.filter((a: { idRow: any }) => a.idRow == indexRow)[0].QtyConst = Qty;
    this.InvoiceDetailsRows.filter((a: { idRow: any }) => a.idRow == indexRow)[0].accountJournaltxt = item.name;
    this.InvoiceDetailsRows.filter((a: { idRow: any }) => a.idRow == indexRow)[0].Amounttxt = servamount;

    this.InvoiceDetailsRows.filter((a: { idRow: any }) => a.idRow == indexRow)[0].DiscountValueConst = data.discountValue_Det;
    this.InvoiceDetailsRows.filter((a: { idRow: any }) => a.idRow == indexRow)[0].DiscountPercentageConst = data.discountPercentage_Det;
    this.InvoiceDetailsRows.filter((a: { idRow: any }) => a.idRow == indexRow)[0].AmountBeforeTaxtxt = AmountVal;
    this.InvoiceDetailsRows.filter((a: { idRow: any }) => a.idRow == indexRow)[0].Amounttxt = AmountVal;
    this.InvoiceDetailsRows.filter((a: { idRow: any }) => a.idRow == indexRow)[0].taxAmounttxt = data.taxAmount;
    this.InvoiceDetailsRows.filter((a: { idRow: any }) => a.idRow == indexRow)[0].TotalAmounttxt = data.totalAmount;

    this.CalculateTotal(1);
  }


  ValidateObjMsgInvoice: any = { status: true, msg: null };
  validateInvoiceForm() {
    this.ValidateObjMsgInvoice = { status: true, msg: null };
    if (this.modalInvoice.customerId == null) {
      this.ValidateObjMsgInvoice = { status: false, msg: 'من فضلك اختر عميل' };
      return this.ValidateObjMsgInvoice;
    }
    if (this.modalInvoice.popuptype == 1) {
      if (this.modalInvoice.ProjectId == null) {
        this.ValidateObjMsgInvoice = {
          status: false,
          msg: 'من فضلك اختر مشروع',
        };
        return this.ValidateObjMsgInvoice;
      }
    }
    if (this.InvoiceDetailsRows.length == 0) {
      this.ValidateObjMsgInvoice = { status: false, msg: 'من فضلك اختر خدمة' };
      return this.ValidateObjMsgInvoice;
    }

    this.ValidateObjMsgInvoice = { status: true, msg: null };
    return this.ValidateObjMsgInvoice;
  }

  disableButtonSave_Invoice = false;

  ConvertNumToString(val: any) {
    this._sharedService.ConvertNumToString(val).subscribe((data) => {
      
      //this.modalDetails.total_amount_text=data?.reasonPhrase;
    });
  }
  selectedDateType = DateType.Hijri;


  //-------------------------------------------------------------------------
  //#region

  OfferPopupAddorEdit_Invoice: any = 0; //add

  ListDataServices_Invoice: any = [];
  GetServicesPriceByParentId_Invoice(element: any) {
    debugger;
    this.serviceDetails_Invoice = [];
    if (element.AccJournalid != null) {
      if (this.OfferPopupAddorEdit_Invoice == 0) {
        if (this.modalInvoice.OfferPriceNo != null) {
          this._invoiceService
            .GetServicesPriceVouByParentId(
              element.AccJournalid,
              this.modalInvoice.OfferPriceNo
            )
            .subscribe((data) => {
              this.serviceDetails_Invoice = data.result;
              debugger;
              var Check = true;
              if (this.ListDataServices_Invoice.length > 0) {
                for (let ele of this.ListDataServices_Invoice) {
                  var val = ele.filter(
                    (a: { parentId: any }) => a.parentId == element.AccJournalid
                  );
                  if (val.length == 0) {
                    Check = false;
                  } else {
                    Check = true;
                    break;
                  }
                }
              } else {
                Check = false;
              }

              if (Check == false) {
                this.ListDataServices_Invoice.push(this.serviceDetails_Invoice);
              }
              this.SetDetailsCheck_Invoice(this.serviceDetails_Invoice);
              this.serviceDetails_Invoice.sort(
                (a: { lineNumber: number }, b: { lineNumber: number }) =>
                  (a.lineNumber ?? 0) - (b.lineNumber ?? 0)
              ); // b - a for reverse sort
            });
        } else {
          this._invoiceService
            .GetServicesPriceByParentId(element.AccJournalid)
            .subscribe((data) => {
              this.serviceDetails_Invoice = data.result;
              debugger;
              var Check = true;
              if (this.ListDataServices_Invoice.length > 0) {
                for (let ele of this.ListDataServices_Invoice) {
                  var val = ele.filter(
                    (a: { parentId: any }) => a.parentId == element.AccJournalid
                  );
                  if (val.length == 0) {
                    Check = false;
                  } else {
                    Check = true;
                    break;
                  }
                }
              } else {
                Check = false;
              }

              if (Check == false) {
                this.ListDataServices_Invoice.push(this.serviceDetails_Invoice);
              }
              this.SetDetailsCheck_Invoice(this.serviceDetails_Invoice);
            });
        }
      } else {
        this._invoiceService
          .GetServicesPriceVouByParentIdAndInvoiceId(
            element.AccJournalid,
            this.InvoicePublicView.invoiceId
          )
          .subscribe((data) => {
            this.serviceDetails_Invoice = data.result;
            debugger;
            var Check = true;
            if (this.ListDataServices_Invoice.length > 0) {
              for (let ele of this.ListDataServices_Invoice) {
                var val = ele.filter(
                  (a: { parentId: any }) => a.parentId == element.AccJournalid
                );
                if (val.length == 0) {
                  Check = false;
                } else {
                  Check = true;
                  break;
                }
              }
            } else {
              Check = false;
            }

            if (Check == false) {
              this.ListDataServices_Invoice.push(this.serviceDetails_Invoice);
            }
            this.serviceDetails_Invoice.sort(
              (a: { lineNumber: number }, b: { lineNumber: number }) =>
                (a.lineNumber ?? 0) - (b.lineNumber ?? 0)
            ); // b - a for reverse sort
          });
      }
    }
  }

  SureServiceList_Invoice: any = [];
  MarkServiceDetails_Invoice(item: any) {
    if (item?.SureService == 1) item.SureService = 0;
    else item.SureService = 1;
    this.SureServiceList_Invoice.push(item);
  }
  UnMarkServiceDetails_Invoice(item: any) {
    if (item?.SureService == 1) item.SureService = 0;
    else item.SureService = 1;
    if (this.SureServiceList_Invoice.length > 0) {
      let index = this.SureServiceList_Invoice.findIndex(
        (d: { servicesId: any }) => d.servicesId == item.servicesId
      );
      if (index != -1) {
        this.SureServiceList_Invoice.splice(index, 1);
      }
    }
  }
  RemoveServicesparent_invoice(ele: any) {
    {
      debugger;
      var TempService = this.ListDataServices_Invoice;
      this.ListDataServices_Invoice = [];
      let newArray = this.SureServiceList_Invoice.filter(
        (d: { parentId: any }) => d.parentId != ele.AccJournalid
      );
      TempService.forEach((element: any) => {
        let newArray2 = element.filter(
          (d: { parentId: any }) => d.parentId != ele.AccJournalid
        );
        if (newArray2.length > 0) {
          this.ListDataServices_Invoice.push(newArray2);
        }
      });
      this.SureServiceList_Invoice = newArray;
    }
  }
  SetDetailsCheck_Invoice(item: any) {
    item.forEach((element: any) => {
      let filteritem = this.SureServiceList_Invoice.filter(
        (d: { servicesId: any }) => d.servicesId == element.servicesId
      );
      if (filteritem.length > 0) {
        element.SureService = 1;
      }
    });
  }
  serviceDetails_Invoice: any = [];

  drop_Invoice(event: CdkDragDrop<string[]>) {
    debugger;
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    var TempService = this.ListDataServices_Invoice;
    this.ListDataServices_Invoice = [];

    TempService.forEach((element: any) => {
      let newArray2 = element.filter(
        (d: { parentId: any }) =>
          d.parentId != this.serviceDetails_Invoice[0].parentId
      );
      if (newArray2.length > 0) {
        this.ListDataServices_Invoice.push(newArray2);
      }
    });
    this.ListDataServices_Invoice.push(this.serviceDetails_Invoice);

  }

  //#endregion


  //#endregion
  //------------------------------------(End) Invoice-------------------------------------------

  //#region
  //----------------------------------EntryVoucher------------------------------------------

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
    TotalDepit: 0,
    diff: 0,
    WhichClick: 1,
    addUser: null,
    addDate: null,
    addedImg: null,
  };

  resetEntryData() {
    this.uploadedFiles = [];
    this.EntryVoucherDetailsRows = [];
    this.load_CostCenter = [];
    const DateHijri = toHijri(new Date());
    var DateGre = new HijriDate(
      DateHijri._year,
      DateHijri._month,
      DateHijri._date
    );
    DateGre._day = DateGre._date;

    this.modalEntryVoucher = {
      InvoiceId: 0,
      InvoiceNumber: null,
      JournalNumber: null,
      Date: new Date(),
      HijriDate: DateGre,
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
      TotalDepit: 0,
      diff: 0,
      WhichClick: 1,
      addUser: null,
      addDate: null,
      addedImg: null,
    };
  }
  GetAllTransByVoucherId(inv: any) {
    this.EntryVoucherDetailsRows = [];
    this._entryvoucherService.GetAllTransByVoucherId(inv).subscribe((data) => {
      var TotalCredit = 0;
      var TotalDepit = 0;
      if (data.result.length > 0) {
        data.result.forEach((element: any) => {
          var Credit = 0;
          var Depit = 0;
          if (element.depit < element.credit) {
            Credit = parseFloat(element.credit);
            Depit = 0;
            TotalCredit = TotalCredit + Credit;
            TotalCredit+=+element.amounttax;
          }
          if (element.credit < element.depit) {
            Credit = 0;
            Depit = parseFloat(element.depit);
            TotalDepit = TotalDepit + Depit;
            TotalDepit+=+element.amounttax;
          }
          // var maxVal = 0;
          // if (this.EntryVoucherDetailsRows.length > 0) {
          //   maxVal = Math.max(
          //     ...this.EntryVoucherDetailsRows.map(
          //       (o: { idRow: any }) => o.idRow
          //     )
          //   );
          // } else {
          //   maxVal = 0;
          // }
          this.EntryVoucherDetailsRows?.push({
            //idRow: maxVal + 1,
            idRow: element.lineNumber,
            Amounttxt: element.amount,
            AmountTaxtxt: element.amounttax,
            AccJournalid: element.accountId,
            accountJournaltxt: element.accountName,
            CreditDepitStatus: Credit > Depit ? 'C' : 'D',
            CostCenterId: element.costCenterId,
            CostCenterName: element.costCenterName,
            Notes: element.notes,
            InvoiceReference: element.invoiceReference,
            AccCalcExpen: element.accCalcExpen,
            AccCalcIncome: element.accCalcIncome,
            AccCalcAll: element.accCalcAll,
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
      } else {
        this.EntryVoucherDetailsRows = [];
      }
    });
  }
  EditEntryVoucherPopup(data: any) {
    this.resetEntryData();
    this.GetAllTransByVoucherId(data.invoiceId);
    const DateHijri = toHijri(this._sharedService.String_TO_date(data.date));
    var DateGre = new HijriDate(
      DateHijri._year,
      DateHijri._month,
      DateHijri._date
    );
    DateGre._day = DateGre._date;

    this.modalEntryVoucher = {
      InvoiceId: data.invoiceId,
      InvoiceNumber: data.invoiceNumber,
      JournalNumber: data.journalNumber,
      Date: this._sharedService.String_TO_date(data.date),
      HijriDate: DateGre,
      Notes: data.notes,
      InvoiceNotes: data.invoiceNotes,
      Type: 8,
      InvoiceValue: 0,
      InvoiceReference: data.invoiceReference,
      VoucherAdjustment: data.voucherAdjustment,
      DunCalc: data.dunCalc,
      CostCenterId: data.costCenterId,
      Reference: null,
      WhichClick: 1,
      addUser: data.addUser,
      addDate: data.addDate,
      addedImg: data.addInvoiceImg,
    };

    this.FillCostCenterSelect();
    // this.FillSubAccountLoadTable();
  }

  EntryVoucherDetailsRows: any = [];


  //Date-Hijri
  ChangeEntryVoucherGre(event: any) {
    if (event != null) {
      const DateHijri = toHijri(this.modalEntryVoucher.Date);
      var DateGre = new HijriDate(
        DateHijri._year,
        DateHijri._month,
        DateHijri._date
      );
      DateGre._day = DateGre._date;
      this.modalEntryVoucher.HijriDate = DateGre;
    } else {
      this.modalEntryVoucher.HijriDate = null;
    }
  }
  ChangeEntryVoucherHijri(event: any) {
    if (event != null) {
      const DateGre = new HijriDate(event.year, event.month, event.day);
      const dayGreg = DateGre.toGregorian();
      this.modalEntryVoucher.Date = dayGreg;
    } else {
      this.modalEntryVoucher.Date = null;
    }
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

  ShowImg(pho: any) {
    var img = environment.PhotoURL + pho;
    return img;
  }
  //----------------------------------End EntryVoucher-------------------------------------
  //#endregion

  //#region
  //---------------------------------CatchReceipt----------------------------------------

  ReceiptVoucherForm: FormGroup;
  CheckDetailsForm: FormGroup;


  //--------------------------------End CatchReceipt-------------------------------------
  //#endregion


  
  //#region 
  @ViewChild('NewInvoiceModal') newInvoiceModal: any;
  @ViewChild('EntryVoucherModal') entryVoucherModal: any;
  @ViewChild('ReceiptVoucherwithoutCustomerModal') receiptVoucherwithoutCustomerModal: any;
  @ViewChild('printDivModal') printDivModal: any;
  @ViewChild('printDivModalReVoucher') printDivModalReVoucher: any;
  @ViewChild('printDivModalDailyVoucher') printDivModalDailyVoucher: any;
  @ViewChild('printDivModalReceipt') printDivModalReceipt: any;
  @ViewChild('printDivModalPurchase') printDivModalPurchase: any;
  @ViewChild('NewVoucherModal') NewVoucherModal: any;

  ShowVoucher(element:any){
    var InvoiceId=element.invoiceId;
    this._invoiceService.GetInvoiceById_Tran(InvoiceId).subscribe(data => {
      if(element.type==2)
      {
        this.open(this.newInvoiceModal, data, 'InvoiceView');
      }
      else if(element.type==5)
      {
        this.open(this.NewVoucherModal, data, 'ViewVoucher');
      }
      else if(element.type==6)
      {
        this.open(this.receiptVoucherwithoutCustomerModal, data, 'viewReceiptModal');
      }
      else if(element.type==8 || element.type==17)
      {
        this.open(this.entryVoucherModal, data, 'ViewEntryVoucherModal');
      }

    });
  }
  PrintVoucher(element:any){
    var InvoiceId=element.invoiceId;
    this._invoiceService.GetInvoiceById_Tran(InvoiceId).subscribe(data => {
      if(element.type==2)
      {
        this.GetInvoicePrint(element,1);
        this.open(this.printDivModal);
      }
      if(element.type==29)
      {
        this.GetInvoicePrint(element,29,false,data);
        this.open(this.printDivModal);
      }
      if(element.type==1)
      {
        this.GetInvoicePrint_Purchase(element,1);
        this.open(this.printDivModalPurchase);
      }
      if(element.type==33)
      {
        this.GetInvoicePrintDepit(element,33,data);
        this.open(this.printDivModalPurchase);
      }
      else if(element.type==5)
      {
        this.GetReport(element);
        this.open(this.printDivModalReceipt);
      }
      else if(element.type==6)
      {
        this.GetReport(element);
      }
      else if(element.type==8 || element.type==17)
      {
        this.DailyVoucherReport(element);
        this.open(this.printDivModalDailyVoucher);
      }

    });
  }

    printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }
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
    TotalCredit: 0,
    TotalDepit: 0,
  };
  resetCustomData() {
    this.EntryVoucherPrintData = null;
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
      TotalCredit: 0,
      TotalDepit: 0,
    };
  }
  ZatcaPrintP=false;
  GetInvoicePrint(obj: any, TempCheck: any,ZatcaPrint?:boolean,dataP?:any) {
    if(ZatcaPrint){this.ZatcaPrintP=true;}
    else {this.ZatcaPrintP=false;}
    this.resetCustomData();
    var InvVal=0;
    if(TempCheck==29)InvVal=dataP.creditNotiId;
   else InvVal=obj.invoiceId;
    this._printreportsService.ChangeInvoice_PDF(obj.invoiceId, TempCheck).subscribe((data) => {
        console.log("GetInvoicePrint",data);

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
        debugger
        if (TempCheck == 29){
          this.CustomData.PrintTypeName = 'اشعار دائن';
        } 
        else if (TempCheck == 30)
        {
          this.CustomData.PrintTypeName = 'اشعار مدين';

        } 
        else this.CustomData.PrintType = 1;
        console.log("aaaaa",this.CustomData?.PrintType);
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
            DiscountValue_Det_Total_withqty + (element.discountValue_Det ?? 0);
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
        {
            this.CustomData.Account1Img =this.CustomData.Account1Img;
        }
        
        else this.CustomData.Account1Img = null;
        if (this.CustomData.Account2Img)
        {
          this.CustomData.Account2Img =this.CustomData.Account2Img;
        }         
        else this.CustomData.Account2Img = null;
        if (
          this.InvPrintData?.branch_VD.isPrintInvoice == true &&
          this.InvPrintData?.branch_VD.branchLogoUrl != '' &&
          this.InvPrintData?.branch_VD.branchLogoUrl != null
        ) {
              this.CustomData.OrgImg =this.InvPrintData?.branch_VD.branchLogoUrl;
        } else {
          if (this.InvPrintData?.org_VD.logoUrl)
          {
              this.CustomData.OrgImg =this.InvPrintData?.org_VD.logoUrl;
          }
          else this.CustomData.OrgImg = null;
        }
        if (
          this.InvPrintData?.branch_VD.headerPrintInvoice == true &&
          this.InvPrintData?.branch_VD.headerLogoUrl != '' &&
          this.InvPrintData?.branch_VD.headerLogoUrl != null
        ) {
          this.CustomData.headerurl =this.InvPrintData?.branch_VD.headerLogoUrl;

        } else {
          this.CustomData.headerurl = null;
        }

        if (
          this.InvPrintData?.branch_VD.headerPrintInvoice == true &&
          this.InvPrintData?.branch_VD.footerLogoUrl != '' &&
          this.InvPrintData?.branch_VD.footerLogoUrl != null
        ) {
          this.CustomData.footerurl =this.InvPrintData?.branch_VD.footerLogoUrl;

        } else {
          this.CustomData.footerurl = null;
        }
      });
  }
  async downloadPDF(id:any) {
    debugger
    var content=(document.getElementById(id) as HTMLFormElement);
    const canvas = await html2canvas(content);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgWidth = 190; // Adjust based on content width
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    const pdfBlob = pdf.output('blob');
    const reader = new FileReader();
    reader.readAsArrayBuffer(pdfBlob);
    reader.onloadend = () => {
    const byteArray = new Uint8Array(reader.result as ArrayBuffer);
    //console.log(byteArray);
    this.PDFDownloadZatca(byteArray);
    };
  }
  PDFDownloadZatca(byteArray:any) {
    debugger
    const formData = new FormData();
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });
    formData.append('UploadedFile', blob);
    formData.append('InvoiceId', this.InvPrintData?.invoicesVM_VD?.invoiceId);
    this._invoiceService.ConvertEncodedXMLToPDFA3ByteArray(formData).subscribe((data) => {     
      if (data.statusCode == 200) {
        var PDFPath = environment.PhotoURL + data.reasonPhrase;
        const printwindow=window.open(PDFPath,'_blank');
        printwindow?.print();
        //printJS({ printable: PDFPath, type: 'pdf', showModal: true });
      } else {
        this.toast.error(this.translate.instant(data.reasonPhrase), this.translate.instant('Message'));
      }    
    });
  }
  GetAccualValue(item: any) {
    //debugger
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

  EntryVoucherPrintData: any = null;
  CustomDataNoteInvoice: any;
  CustomDatatoInvoice: any;
  GetReport(obj: any) {
    this.resetCustomData();
    this.receiptService.GetReport(obj.invoiceId).subscribe((data) => {
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
      // if (this.EntryVoucherPrintData?.org_VD.logoUrl)
      //   this.CustomData =
      //     environment.PhotoURL + this.EntryVoucherPrintData?.org_VD.logoUrl;
      // else this.CustomData = null;

      if (
        this.EntryVoucherPrintData?.branch.headerPrintrevoucher == true &&
        this.EntryVoucherPrintData?.branch.branchLogoUrl != '' &&
        this.EntryVoucherPrintData?.branch.branchLogoUrl != null
      ) {
        this.CustomData.OrgImg =
          environment.PhotoURL + this.EntryVoucherPrintData?.branch.branchLogoUrl;
      } else {
        if (this.EntryVoucherPrintData?.org_VD.logoUrl)
          this.CustomData.OrgImg =
            environment.PhotoURL + this.EntryVoucherPrintData?.org_VD.logoUrl;
        else this.CustomData.OrgImg = null;
      }
      if (
        this.EntryVoucherPrintData?.branch.headerPrintrevoucher == true &&
        this.EntryVoucherPrintData?.branch.headerLogoUrl != '' &&
        this.EntryVoucherPrintData?.branch.headerLogoUrl != null
      ) {
        this.CustomData.headerurl =
          environment.PhotoURL + this.EntryVoucherPrintData?.branch.headerLogoUrl;
      } else {
        this.CustomData.headerurl = null;
      }

      if (
        this.EntryVoucherPrintData?.branch.headerPrintrevoucher == true &&
        this.EntryVoucherPrintData?.branch.footerLogoUrl != '' &&
        this.EntryVoucherPrintData?.branch.footerLogoUrl != null
      ) {
        this.CustomData.footerurl =
          environment.PhotoURL + this.EntryVoucherPrintData?.branch.footerLogoUrl;
      } else {
        this.CustomData.footerurl = null;
      }
    });
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

  CustomData2: any = {
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

  resetCustomData2() {
    this.CustomData2 = {
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

  DailyVoucherReport(obj: any) {
    this._entryvoucherService
      .DailyVoucherReport(obj.invoiceId)
      .subscribe((data) => {
        //debugger;
        this.EntryVoucherPrintData = data;
        var TotalCredit = 0;
        var TotalDepit = 0;
        if (data.invoicesVM.length > 0) {
          data.invoicesVM.forEach((element: any) => {
            var Credit = 0;
            var Depit = 0;
            if (+element.depit < +element.credit) {
              Credit = parseFloat(element.credit);
              Depit = 0;
              TotalCredit = TotalCredit + Credit;
            }
            if (+element.credit < +element.depit) {
              Credit = 0;
              Depit = parseFloat(element.depit);
              TotalDepit = TotalDepit + Depit;
            }
          });
          this.CustomData.TotalCredit = parseFloat(
            TotalCredit.toString()
          ).toFixed(2);
          this.CustomData.TotalDepit = parseFloat(
            TotalDepit.toString()
          ).toFixed(2);
        }

        // if (this.EntryVoucherPrintData?.org_VD.logoUrl)
        //   this.CustomData.OrgImg =
        //     environment.PhotoURL + this.EntryVoucherPrintData?.org_VD.logoUrl;
        // else this.CustomData.OrgImg = null;
        
      if (
        this.EntryVoucherPrintData?.branch.headerprintdarvoucher == true &&
        this.EntryVoucherPrintData?.branch.branchLogoUrl != '' &&
        this.EntryVoucherPrintData?.branch.branchLogoUrl != null
      ) {
        this.CustomData2.OrgImg =
          environment.PhotoURL + this.EntryVoucherPrintData?.branch.branchLogoUrl;
      } else {
        if (this.EntryVoucherPrintData?.org_VD.logoUrl)
          this.CustomData2.OrgImg =
            environment.PhotoURL + this.EntryVoucherPrintData?.org_VD.logoUrl;
        else this.CustomData2.OrgImg = null;
      }
      if (
        this.EntryVoucherPrintData?.branch.headerprintdarvoucher == true &&
        this.EntryVoucherPrintData?.branch.headerLogoUrl != '' &&
        this.EntryVoucherPrintData?.branch.headerLogoUrl != null
      ) {
        this.CustomData2.headerurl =
          environment.PhotoURL + this.EntryVoucherPrintData?.branch.headerLogoUrl;
      } else {
        this.CustomData2.headerurl = null;
      }

      if (
        this.EntryVoucherPrintData?.branch.headerprintdarvoucher == true &&
        this.EntryVoucherPrintData?.branch.footerLogoUrl != '' &&
        this.EntryVoucherPrintData?.branch.footerLogoUrl != null
      ) {
        this.CustomData2.footerurl =
          environment.PhotoURL + this.EntryVoucherPrintData?.branch.footerLogoUrl;
      } else {
        this.CustomData2.footerurl = null;
      }

      });
  }

  GetInvoicePrint_Purchase(obj: any, TempCheck: any) {
    this.resetCustomData();
    this.purchasesBillService.ChangePurchase_PDF(obj.invoiceId, TempCheck).subscribe((data) => {
        this.InvPrintData = data;
        this.CustomData.PrintType = TempCheck;
        if (TempCheck == 32) this.CustomData.PrintTypeName = 'اشعار دائن';
        else if (TempCheck == 33) this.CustomData.PrintTypeName = 'اشعار مدين';
        else this.CustomData.PrintType = 1;

        var TotalInvWithoutDisc = 0;
        var netVal = 0;
        var DiscountValue_Det_Total_withqty = 0;
        debugger
        if (this.InvPrintData?.voucherDetailsVM_VD[0]?.taxType == 3) {
          netVal = this.InvPrintData?.invoicesVM_VD?.totalValue;
          TotalInvWithoutDisc = this.InvPrintData?.invoicesVM_VD?.totalValue;
        } else {
          netVal = this.InvPrintData?.invoicesVM_VD?.invoiceValue;
          TotalInvWithoutDisc = this.InvPrintData?.invoicesVM_VD?.invoiceValue;
        }
        this.InvPrintData?.voucherDetailsVM_VD?.forEach((element: any) => {
          DiscountValue_Det_Total_withqty =
            DiscountValue_Det_Total_withqty + (element.discountValue_Det ?? 0);
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

  GetInvoicePrintDepit(obj: any, TempCheck: any,dataP:any) {
    this.resetCustomData();
    var InvVal=0;
    if(TempCheck==33)InvVal=dataP.depitNotiId;
   else InvVal=obj.invoiceId;
    this.purchasesBillService.ChangeInvoice_PDFCreditPurchase(InvVal, TempCheck).subscribe((data) => {
        this.InvPrintData = data;
        this.CustomData.PrintType = TempCheck;
        if (TempCheck == 32) this.CustomData.PrintTypeName = 'اشعار دائن';
        else if (TempCheck == 33) this.CustomData.PrintTypeName = 'اشعار مدين';
        else this.CustomData.PrintType = 1;

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
            DiscountValue_Det_Total_withqty + (element.discountValue_Det ?? 0);
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

  DigitalNumGlobal: any;
  Taxchechdisabl = false;
  CopyData:any=null;
  clauseseleted: any;
  supplierseleted: any;
  FillSuppliersSelect2() {
    this._payvoucherservice.FillSuppliersSelect2().subscribe((data) => {
        this.supplierseleted = data;
      }
    );
  }
  FillClausesSelect() {
    this._payvoucherservice.FillClausesSelect().subscribe((data) => {
        this.clauseseleted = data;
      }
    );
  }
  PasteDataFromRow(){
  }
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
  GetLayoutReadyVm() {
    //debugger;
    this._payvoucherservice.GetLayoutReadyVm().subscribe((data) => {
      //debugger;
      if (data.decimalPoints == null || data.decimalPoints == '') {
        this.DigitalNumGlobal = 0;
      } else {
        this.DigitalNumGlobal = parseInt(data.decimalPoints);
      }
    });
  }
  GetTaxNoBySuppId(suppid: any) {
    this._payvoucherservice.GetTaxNoBySuppId(suppid).subscribe((data) => {
      this.vouchermodel.supplierTaxID = data ?? '';
    });
  }
  Toaccount: any;
  FillCustAccountsSelect2_Receipt(PayTypeId: any) {
    this.receiptService.FillCustAccountsSelect2(PayTypeId).subscribe((data) => {
      this.Toaccount = data;
    });
  }
  FillCustAccountsSelect(type: any) {
    this._payvoucherservice.FillCustAccountsSelect2(type).subscribe((data) => {
     
      this.Toaccount = data;
    });
  }
  getaccountcode(accountid: any, type: any) {
    //debugger;
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
  CheckDetailsIntial() {
    this.CheckDetailsForm = this.formBuilder.group({
      dateCheck_transfer: [new Date(), []],
      paymenttypeName: [null, []],
      Check_transferNumber: [null, []],
      BankId: [null, []],
      bankName: [null, []],
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
  editvouccher(data: any) {
      this.resetvouchermodel();
      this.FillClausesSelect();
      this.FillSuppliersSelect2();
      this.FillCostCenterSelect_Catch();
      this.modalType=2;
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
        //debugger;
  
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
      // if (parseFloat(data.taxAmount).toFixed(2).toString() == '0.00') {
      //   this.Taxchechdisabl = false;
  
      //   this.vouchermodel.taxcheck1 = true;
      // } else {
      //   this.Taxchechdisabl = false;
  
      //   this.vouchermodel.taxcheck1 = false;
      // }
      this.Taxchechdisabl=true;
      var DunCalcV = data.dunCalc;
      //debugger;
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
        this.FillCustAccountsSelect2_Receipt(1);
      } else if (payType == 2 || payType == 6) {
        this.FillCustAccountsSelect2_Receipt(6);
      } else if (payType == 3) {
        this.FillCustAccountsSelect2_Receipt(4);
      } else if (payType == 4) {
        this.FillCustAccountsSelect2_Receipt(5);
      } else if (payType == 5) {
        this.FillCustAccountsSelect2_Receipt(6);
      } else if (payType == 9) {
        this.FillCustAccountsSelect2_Receipt(9);
      } else if (payType == 15) {
        this.FillCustAccountsSelect2_Receipt(15);
      } else if (payType == 16) {
        this.FillCustAccountsSelect2_Receipt(16);
      } else if (payType == 17) {
        this.FillCustAccountsSelect2_Receipt(17);
      } else {
        this.FillCustAccountsSelect2_Receipt(0);
      }
  
      this._payvoucherservice
        .GetAllDetailsByVoucherId(voucherId)
        .subscribe((data2) => {
          //debugger;
  
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

  //#endregion

  
    //-----------------------------------Storehouse------------------------------------------------
  //#region 

  dataAdd: any = {
    Storehouse: {
      id: 0,
      nameAr: null,
      nameEn: null,
    },
  }
  Storehouse: any;
  StorehousePopup: any;

  FillStorehouseSelect() {
    this.Storehouse = [];
    this.StorehousePopup = [];
    this._debentureService.FillStorehouseSelect().subscribe((data) => {
      this.Storehouse = data;
      this.StorehousePopup = data;
    });
  }
  StorehouseRowSelected: any;
  getStorehouseRow(row: any) {
    this.StorehouseRowSelected = row;
  }
  setStorehouseInSelect(data: any, model: any) {
    this.modalInvoice.storehouseId = data.id;
  }
  resetStorehouse() {
    this.dataAdd.Storehouse.id = 0;
    this.dataAdd.Storehouse.nameAr = null;
    this.dataAdd.Storehouse.nameEn = null;
  }
  saveStorehouse() {
    if (
      this.dataAdd.Storehouse.nameAr == null ||
      this.dataAdd.Storehouse.nameEn == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    var StorehouseObj: any = {};
    StorehouseObj.StorehouseId = this.dataAdd.Storehouse.id;
    StorehouseObj.NameAr = this.dataAdd.Storehouse.nameAr;
    StorehouseObj.NameEn = this.dataAdd.Storehouse.nameEn;
    this._debentureService
      .SaveStorehouse(StorehouseObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.resetStorehouse();
          this.FillStorehouseSelect();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  confirmStorehouseDelete() {
    this._debentureService
      .DeleteStorehouse(this.StorehouseRowSelected.id)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),this.translate.instant('Message')
          );
          this.FillStorehouseSelect();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),this.translate.instant('Message')
          );
        }
      });
  }
  //#endregion
  //----------------------------------(End)-Storehouse---------------------------------------------

}
