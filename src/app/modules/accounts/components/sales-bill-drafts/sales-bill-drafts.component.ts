import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  TemplateRef,
  Inject,
  HostListener,
  ElementRef,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SelectionModel } from '@angular/cdk/collections';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { NgxPrintElementService } from 'ngx-print-element';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { DOCUMENT } from '@angular/common';

import { VoucherFilterVM } from 'src/app/core/Classes/ViewModels/voucherFilterVM';
import { InvoiceService } from 'src/app/core/services/acc_Services/invoice.service';
import { Invoices } from 'src/app/core/Classes/DomainObjects/invoices';
import { PrintreportsService } from 'src/app/core/services/acc_Services/printreports.service';

import printJS from 'print-js';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
//import { PrintStyle } from 'src/app/shared/printcustom/invoiceprint.css';
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import { ReceiptService } from 'src/app/core/services/acc_Services/receipt.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import 'hijri-date';
import { RestApiService } from 'src/app/shared/services/api.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { DebentureService } from 'src/app/core/services/acc_Services/debenture.service';
const hijriSafe = require('hijri-date/lib/safe');
const HijriDate = hijriSafe.default;
const toHijri = hijriSafe.toHijri;

@Component({
  selector: 'app-sales-bill-drafts',
  templateUrl: './sales-bill-drafts.component.html',
  styleUrls: ['./sales-bill-drafts.component.scss']
})
export class SalesBillDraftsComponent implements OnInit {
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
      ar: 'مسودات ',
      en: 'Sales bill drafts',
    },
  };

  selectedUser: any;
  users: any;

  closeResult = '';

  showStats = false;
  showFilters = false;
  showPrice = false;

  @ViewChild(DatatableComponent) table: DatatableComponent | any;
  @ViewChild('paginatorServices') paginatorServices!: MatPaginator;

  columns: any = [];

  isEditable: any = {};

  openBox: any = false;
  boxId: any;

  // revision
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

  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  delayedProjects: any;
  latedProjects: any;

  currentDate: any;

  selectedProject: any;
  selectedRow: any;

  selectAllValue = false;

  invoiceDisplayedColumns: string[] = [
    'select',
    'invoiceNumber',
    'date',
    'totalValue',
    'PaymentType',
    'projectNumber',
    'ClientName',
    'InvoiceStatus',
    'PostingDate',
    'operations',
  ];

  InvoicessDataSource = new MatTableDataSource();

  startDate = new Date();
  endDate = new Date();
  userG: any = {};
  //dawoud
  constructor(
    private modalService: NgbModal,
    @Inject(DOCUMENT) private document: Document,
    private _invoiceService: InvoiceService,
    private _debentureService: DebentureService,
    private print: NgxPrintElementService,
    private _printreportsService: PrintreportsService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private translate: TranslateService,
    private receiptService: ReceiptService,
    private formBuilder: FormBuilder,
    private api: RestApiService,
    private authenticationService: AuthenticationService,
    private _accountsreportsService: AccountsreportsService
  ) {
    this.userG = this.authenticationService.userGlobalObj;
    console.log(this.userG);
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();

    this.api.lang.subscribe((res) => {
      this.lang = res;
    });
  }
  invoicetype: any;

  OrganizationData: any;
  environmentPho: any;
  dateprint: any;
  datePrintJournals: any = new Date();
  lang: any = 'ar';

  WhatsAppData: any={
    sendactivation:false,
    sendactivationOffer:false,
    sendactivationProject:false,
    sendactivationSupervision:false,
  };
  ngOnInit(): void {
    this.LoadData();
    this.FillCustomerSelect();
    this.FillProjectSelect();
    this.FillCustAccountsSelect2REC(1);

    this._sharedService.GetWhatsAppSetting().subscribe((data: any) => {
      if(data?.result!=null){this.WhatsAppData=data?.result;}
      else{this.WhatsAppData={sendactivation:false,sendactivationOffer:false,sendactivationProject:false,sendactivationSupervision:false,};}
    });

    this.api.GetOrganizationDataLogin().subscribe((data: any) => {
      this.OrganizationData = data.result;
      this.dateprint =this._sharedService.date_TO_String(new Date());
      this.environmentPho =
        environment.PhotoURL + this.OrganizationData.logoUrl;
    });
    this.invoicetype = [
      { id: 1, name: { ar: 'تم الترحيل', en: 'Posted' } },
      { id: 2, name: { ar: 'غير مرحل', en: 'Not Posted' } },
      { id: 3, name: { ar: 'ملغي', en: 'Canceled' } },
    ];

    this.users = [
      { id: 1, Name: 'محمود نافع' },
      { id: 2, Name: 'محمود نافع' },
      { id: 3, Name: 'محمود نافع' },
      { id: 4, Name: 'محمود نافع' },
      { id: 5, Name: 'محمود نافع' },
      { id: 6, Name: 'محمود نافع' },
    ];
  }

  ngAfterViewInit() {
    // this.open(this.smartModal, null, 'smartModal');
  }
  InvoiceModelPublic: any;
  InvoicePublicView: any;
  voucheriddeleted: any;

  open(
    content: any,
    data?: any,
    type?: any,
    idRow?: any,
    status?: any,
    model?: any
  ) {
    if (idRow != null) {
      this.selectedServiceRow = idRow;
    }
    if (data) {
      this.RowInvoiceData = data;
      // console.log(this.RowInvoiceData);

    }
    if (data && type == 'edit') {
      this.modalInvoice = data;
      this.modalInvoice['id'] = 1;
    }
    if (type == 'addInvoice') {
      this.ListDataServices_Invoice = [];
      this.SureServiceList_Invoice = [];
      this.OfferPopupAddorEdit_Invoice = 0;
      this.InvoicePopup(1);
    } else if (type == 'editReceiptModal') {
      this.ReceiptVoucherFormintial();
      this.uploadedFilesReceipt = [];
      this.hijritype = true;
      this.ReceiptVoucherForm.controls['VoucherId'].setValue(data.invoiceId);
      this.hijriDateReceipt = null;
      this.ReceiptVoucherFormintial();
      this.checkdetailsList = [];
      this.Registrationnumber = null;
      this.R_theInvoice = null;
      this.referenceNumber = null;
      this.ClientId = null;
      this.paymenttype = null;
      this.FillCustAccountsSelect2REC(1);
      this.FillSubAccountLoad();
      this.GetAllCustomerForDropWithBranch();
      this.FillCostCenterSelectREC();
      this.gethigridate();
      this.FillBankSelect();
      this.GenerateVoucherNumberREC();
      this.ReceiptVoucherForm.controls['VoucherNumber'].disable();
      // this.ReceiptVoucherForm.controls['Registrationnumber'].disable();
      this.ReceiptVoucherForm.controls['amountWriting'].disable();
      this.ReceiptVoucherForm.controls['AccCodeFrom'].disable();
      this.ReceiptVoucherForm.controls['AccCodeTo'].disable();

      this.CustCheckPage = status;
      this.modalType = 'Edit';
      this.editInvoices(data);
    } else if (type == 'EditCheckDetailsModal') {
      if (status == 'newCheckDetails') {
        this.CheckDetailsIntial();
        this.CheckDetailsForm.controls['paymenttypeName'].disable();
        // var PayType = this.ReceiptVoucherForm.controls["paymenttype"].value
        var PayType = this.paymenttype;

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
      this.BanksId = null;
      this.BanksNameAr = null;
      this.BanksNameEn = null;
    } else if (type == 'deleteBank') {
      this.DeletebanksId = data.bankId;
    } else if (type == 'addInvoicewithoutProject') {
      this.ListDataServices_Invoice = [];
      this.SureServiceList_Invoice = [];
      this.OfferPopupAddorEdit_Invoice = 0;
      this.InvoicePopup(2);
    } else if (type == 'accountingentry') {
      this.GetAllJournalsByInvID(data.invoiceId);
    } else if (type == 'postModal') {
      this.WhichPost = 1;
    } else if (type == 'postModalCheckbox') {
      this.WhichPost = 2;
    } else if (type == 'AlarmVoucher') {
      this.resetAlarmData();
      this.FillAllAlarmVoucher();
    } else if (type == 'servicesList') {
      this.GetAccountJournalSearchGrid();
    } else if (type == 'NoticeCreditorModal') {
      this.resetNotiPopup();
    } else if (type == 'InvoiceView') {
      this.ListDataServices_Invoice = [];
      this.SureServiceList_Invoice = [];
      this.OfferPopupAddorEdit_Invoice = 1;
      this.InvoicePublicView = data;
      this.resetInvoiceData();
      this.InvoiceView(data);
    } else if (type == 'InvoiceEdit') {
      this.ListDataServices_Invoice = [];
      this.SureServiceList_Invoice = [];
      this.OfferPopupAddorEdit_Invoice = 1;
      this.InvoicePublicView = data;
      this.resetInvoiceData();
      this.InvoiceEdit(data);
    } else if (type == 'InvCredit') {
      if (this.NotiData.invoiceid == null) {
        this.toast.error('من فضلك أختر فاتورة أولا', 'رسالة');
        return;
      }
      this.ListDataServices_Invoice = [];
      this.SureServiceList_Invoice = [];
      this.OfferPopupAddorEdit_Invoice = 0;
      this.resetInvoiceData();
      this.InvCreditView(this.NotiData.invoiceid);
    }

    if (type == 'NewProjectType') {
      this.GetAllProjectType();
    }
    if (type == 'deleteProjectTypeModal') {
      this.pTypeId = data.typeId;
    }

    if (type == 'SubprojectTypeModal') {
      if (this.SerivceModalForm.controls['ProjectType'].value == null) {
        this.toast.error('من فضلك أختر نوع المشروع', 'رسالة');
        return;
      }
      this.GetAllProjectSubsByProjectTypeId();
    }
    if (type == 'deleteSubprojectTypeModal') {
      this.psubTypeId = data.subTypeId;
    }

    if (type == 'PackagesModal') {
      this.GetAllPackages();
    }
    if (type == 'deletePackagesModal') {
      this.PackageIdD = data.packageId;
    }
    if (type == 'DeleteVoucherModal') {
      this.voucheriddeleted = data.invoiceId;
    }
    if (type == 'costCenterModal') {
      this.servicesId = 0;
      this.accountName = null;
      this.servicesName = null;
      this.GetAllcostCenter();
    }
    if (type == 'deletecostCenterModal') {
      this.ServicesPriceIdindex = idRow;
      this.ServicesPriceId = data.servicesId;
    }
    if (type == 'addSerivceModal') {
      this.details = [];
      this.AllcostCenterlist = [];
      this.SubprojecttypeList = [];
      this.intialModelBranchOrganization();
      this.FillServiceAccount();
      this.FillServiceAccountPurchase();
      this.FillCostCenterSelect_Service();
      this.FillProjectTypeSelectService();
      this.FillPackagesSelect();
    }
    if (type == 'SaveInvoiceConfirmModal') {
      this.InvoiceModelPublic = model;
    }
    if (type == 'serviceDetails_Invoice' && data) {
      this.GetServicesPriceByParentId_Invoice(data);
    }
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
        centered:
          type == 'SaveInvoiceConfirmModal' ? true : type ? false : true,
        backdrop: 'static',
        keyboard: false,
      })

      .result.then(
        (result) => {
          if (type == 'edit') {
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

  //--------------------------------------Search---------------------------------
  //#region
  dataInvoice: any = {
    filter: {
      enable: false,
      date: null,
      search_InvoiceNumber: null,
      search_CustomerName: null,
      search_projectId: null,
      search_invoicetype: null,
      DateFrom_P: null,
      DateTo_P: null,
      isChecked: false,
      Type: 34,
      AllInvoice: false,
      InvoiceRet: false,
      ContractInvoice: false,
    },
  };

  load_customers: any;
  FillCustomerSelect() {
    this._invoiceService
      .FillAllCustomerSelectByAllFawater()
      .subscribe((data) => {
        this.load_customers = data;
      });
  }
  load_projectsSearch: any;
  FillProjectSelect() {
    this._invoiceService
      .FillAllProjectSelectByAllFawater()
      .subscribe((data) => {
        this.load_projectsSearch = data;
      });
  }

  InvoicessDataSourceTemp: any = [];

  LoadData() {
    var _voucherFilterVM = new VoucherFilterVM();
    _voucherFilterVM.type = this.dataInvoice.filter.Type;
    var obj = _voucherFilterVM;
    this._invoiceService.GetAllVouchersSearchInvoice(obj).subscribe((data) => {
      this.InvoicessDataSource = new MatTableDataSource(data);
      this.InvoicessDataSourceTemp = data;
      this.InvoicessDataSource.paginator = this.paginator;
      this.InvoicessDataSource.sort = this.sort;
    });
  }
  LoadDataContract() {
    var _voucherFilterVM = new VoucherFilterVM();
    _voucherFilterVM.type = this.dataInvoice.filter.Type;
    var obj = _voucherFilterVM;
    this._invoiceService
      .GetAllVouchersfromcontractSearch(obj)
      .subscribe((data) => {
        this.InvoicessDataSource = new MatTableDataSource(data);
        this.InvoicessDataSourceTemp = data;
        this.InvoicessDataSource.paginator = this.paginator;
        this.InvoicessDataSource.sort = this.sort;
      });
  }
  LoadDataRet() {
    var _voucherFilterVM = new VoucherFilterVM();
    _voucherFilterVM.type = this.dataInvoice.filter.Type;
    var obj = _voucherFilterVM;
    this._invoiceService.GetAllVouchersRetSearch(obj).subscribe((data) => {
      this.InvoicessDataSource = new MatTableDataSource(data);
      this.InvoicessDataSourceTemp = data;
      this.InvoicessDataSource.paginator = this.paginator;
      this.InvoicessDataSource.sort = this.sort;
    });
  }
  RefreshData() {
    var _voucherFilterVM = new VoucherFilterVM();
    _voucherFilterVM.type = this.dataInvoice.filter.Type;
    // _voucherFilterVM.voucherNo=this.dataInvoice.filter.search_InvoiceNumber;
    _voucherFilterVM.isSearch = true;
    _voucherFilterVM.customerId = this.dataInvoice.filter.search_CustomerName;
    _voucherFilterVM.isPost = this.dataInvoice.filter.search_invoicetype;
    _voucherFilterVM.projectId = this.dataInvoice.filter.search_projectId;
    if (
      this.dataInvoice.filter.DateFrom_P != null &&
      this.dataInvoice.filter.DateTo_P != null
    ) {
      _voucherFilterVM.dateFrom = this.dataInvoice.filter.DateFrom_P;
      _voucherFilterVM.dateTo = this.dataInvoice.filter.DateTo_P;
      _voucherFilterVM.isChecked = true;
    } else {
      _voucherFilterVM.isChecked = false;
    }

    var obj = _voucherFilterVM;
    this._invoiceService.GetAllVouchers(obj).subscribe((data) => {
      this.InvoicessDataSource = new MatTableDataSource(data);
      this.InvoicessDataSourceTemp = data;
      this.InvoicessDataSource.paginator = this.paginator;
      this.InvoicessDataSource.sort = this.sort;
    });
  }

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    const tempsource = this.InvoicessDataSourceTemp.filter(function (d: any) {
      return (
        d.invoiceNumber?.toString().trim().toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    this.InvoicessDataSource = new MatTableDataSource(tempsource);
    this.InvoicessDataSource.paginator = this.paginator;
    this.InvoicessDataSource.sort = this.sort;
  }

  ShowVouchercontract() {
    if (this.dataInvoice.filter.ContractInvoice) {
      this.LoadDataContract();
    } else {
      if (this.dataInvoice.filter.AllInvoice) {
        this.RefreshData();
      } else {
        this.LoadData();
      }
    }
  }
  ShowVoucherRet() {
    if (this.dataInvoice.filter.InvoiceRet) {
      this.LoadDataRet();
    } else {
      if (this.dataInvoice.filter.AllInvoice) {
        this.RefreshData();
      } else {
        this.LoadData();
      }
    }
  }
  ShowAllVoucher() {
    if (this.dataInvoice.filter.AllInvoice) {
      this.RefreshData();
    } else {
      this.LoadData();
    }
    this.selection.clear();
  }
  CheckDate(event: any) {
    if (event != null) {
      this.dataInvoice.filter.DateFrom_P = this._sharedService.date_TO_String(
        event[0]
      );
      this.dataInvoice.filter.DateTo_P = this._sharedService.date_TO_String(
        event[1]
      );
      this.RefreshData();
    } else {
      this.dataInvoice.filter.DateFrom_P = null;
      this.dataInvoice.filter.DateTo_P = null;
      this.RefreshData();
    }
  }
  getColorStatus(element: any) {
    if (element?.type==34) {
      return '#0060a6';
    } 
    else if (element?.isPost == true && element?.rad != 1) {
      return '#30b550';
    } else if (element?.isPost != true && element?.rad != 1) {
      return '#c51313';
    } else {
      return '#000000';
    }
  }
  //#endregion
  //-----------------------------------------------------------------------------
  //----------------------------------Alarm-------------------------------------------

  //#region
  AlarmData: any = {
    invoiceid: null,
    date: null,
  };

  load_AllAlarmVoucher: any;
  FillAllAlarmVoucher() {
    this.load_AllAlarmVoucher = [];
    this._invoiceService
      .FillAllAlarmVoucher(new VoucherFilterVM())
      .subscribe((data) => {
        this.load_AllAlarmVoucher = data;
      });
  }
  VoucherDate_G: any = null;

  ConfirmAlarm(modal: any) {
    if (this.AlarmData.invoiceid == null || this.AlarmData.date == null) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    this._invoiceService
      .GetInvoiceDateById(this.AlarmData.invoiceid)
      .subscribe((data) => {
        this.VoucherDate_G = data.result.date;
        if (this.VoucherDate_G != null) {
          var date1 = new Date(this.VoucherDate_G);
          var date2 = new Date(this.AlarmData.date);
          if (date1.getTime() > date2.getTime()) {
            var Str =
              ' لا يمكنك اختيار تاريخ أصغر من تاريخ الفاتورة ' +
              ' : ' +
              this.VoucherDate_G;
            this.toast.error(Str, 'رسالة');
            return;
          } else {
            this.SaveVoucherAlarmDate(modal);
          }
        }
      });
  }
  resetAlarmData() {
    this.AlarmData = {
      invoiceid: null,
      date: null,
    };
  }

  SaveVoucherAlarmDate(modal: any) {
    this._invoiceService
      .SaveVoucherAlarmDate(
        this.AlarmData.invoiceid,
        this._sharedService.date_TO_String(this.AlarmData.date)
      )
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.ShowAllVoucher();
          modal?.dismiss();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  //#endregion
  //----------------------------------------End Alarm---------------------------------------------------
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

  modalInvoice: any = {
    InvoiceId: 0,
    InvoiceNumber: null,
    InvoiceNumberDraft:null,
    JournalNumber: null,
    InvoicePayType: null,
    Date: new Date(),
    HijriDate: null,
    Notes: null,
    InvoiceNotes: null,
    Type: 34,
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
      InvoiceNumberDraft: null,
      JournalNumber: null,
      InvoicePayType: null,
      Date: new Date(),
      HijriDate: DateGre,
      Notes: null,
      InvoiceNotes: null,
      Type: 34,
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

  InvoicePopup(typepage: any) {
    if (typepage == 2) {
      this.FillCostCenterSelect();
      this.FillAllCustomerSelectNotHaveProjWithBranch();
      //this.GetBranch_Costcenter();
    } else if (typepage == 1) {
      this.FillCostCenterSelect_Invoices(null);
      this.FillCustomerSelectWProOnlyWithBranch();
    }
    this.FillStorehouseSelect();
    this.resetInvoiceData();
    this.modalInvoice.popuptype = typepage;
    this.GetBranchOrganization();
    this.GenerateVoucherNumber();

    this.FillCustAccountsSelect2AndUpdate(this.modalInvoice.PayType);
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
        this.modalInvoice.InvoiceNumberDraft ="M"+data.reasonPhrase;
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
          offerdata.serviceamountval
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

  setServiceRowValueNew(indexRow: any, item: any, Qty: any, servamount: any) {
    this.addInvoiceRow();
    this.InvoiceDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == indexRow
    )[0].AccJournalid = item.servicesId;
    this.InvoiceDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == indexRow
    )[0].UnitConst = item.serviceTypeName;
    this.InvoiceDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == indexRow
    )[0].QtyConst = Qty;
    this.InvoiceDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == indexRow
    )[0].accountJournaltxt = item.name;
    this.InvoiceDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == indexRow
    )[0].Amounttxt = servamount;
    this.CalculateTotal(1);
  }

  getCusAccID_Save(customerid: any, paytype: any) {
    if (customerid != null) {
      this._invoiceService
        .GetCustomersByCustomerId(customerid)
        .subscribe((data) => {
          if (paytype) {
            this.modalInvoice.ToAccountId = data.result.accountId;
            this.saveInvoice();
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
  FillCustAccountsSelect2_Save(PayType: any) {
    if (PayType) {
      this._invoiceService
        .FillCustAccountsSelect2(PayType)
        .subscribe((data) => {
          this.load_Accounts = data;
          this.getCusAccID_Save(this.modalInvoice.customerId, true);
        });
    } else {
      this.load_Accounts = [];
    }
  }

  FillCustAccountsSelect2AndUpdate_Save(PayType: any) {
    if (PayType) {
      this._invoiceService
        .FillCustAccountsSelect2(PayType)
        .subscribe((data) => {
          this.load_Accounts = data;
          if (PayType != 8) {
            if (this.load_Accounts?.length > 0) {
              this.modalInvoice.ToAccountId = this.load_Accounts[0]?.id;
              this.saveInvoice();
            } else {
              this.modalInvoice.ToAccountId = null;
              this.toast.error('تأكد من الحساب', 'رسالة');
              return;
            }
          }
        });
    } else {
      this.load_Accounts = [];
    }
  }
  checkPayTypeAndSave() {
    var val = this.validateInvoiceForm();
    if (val.status == false) {
      this.toast.error(val.msg, 'رسالة');
      return;
    }
    if (this.modalInvoice.remainder > 0) {
      //hna mfrod afth popup yogd motbke
    }

    var _paidValue = parseFloat(this.modalInvoice.PaidValue).toFixed(2);
    var remainder = parseFloat(this.modalInvoice.remainder).toFixed(2);
    if (+remainder < 1 && +_paidValue > 0) {
      //agel to be n2di
      if (this.modalInvoice.PayType == 8) {
        this.modalInvoice.PayType = 1;
        this.FillCustAccountsSelect2AndUpdate_Save(1);
      } else {
        this.saveInvoice();
      }
    } else if (
      +remainder >= 0 &&
      (this.modalInvoice.PayType == 1 ||
        this.modalInvoice.PayType == 17 ||
        this.modalInvoice.PayType == 9 ||
        this.modalInvoice.PayType == 6)
    ) {
      if (this.modalInvoice.PayType != 8) {
        this.modalInvoice.TempBox = this.modalInvoice.ToAccountId;
        this.modalInvoice.PayType = 8;
        this.FillCustAccountsSelect2_Save(8);
      } else {
        this.saveInvoice();
      }
    } else {
      this.saveInvoice();
    }
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
  confirm_saveinvoice() {
    this.InvoiceModelPublic?.dismiss();
  }
  disableButtonSave_Invoice = false;
  saveInvoice() {
    if (!(parseInt(this.modalInvoice.TotalVoucherValueLbl) > 0)) {
      this.toast.error('من فضلك أدخل قيمة صحيحة للفاتورة', 'رسالة');
      return;
    }

    debugger;
    if (this.modalInvoice.WhichClick == 3) {
      if (
        parseFloat(this.modalInvoice.TotalVoucherValueLbl) >
        parseFloat(this.modalInvoice.GlobalTotalFatora)
      ) {
        this.toast.error(
          'لا يمكن ان يكون مبلغ الإشعار أكبر من صافي الفاتورة',
          'رسالة'
        );
        return;
      }
    }
    var VoucherDetailsList: any = [];
    var VoucherObj: any = {};
    VoucherObj.InvoiceId = this.modalInvoice.InvoiceId;
    VoucherObj.InvoiceNumber = this.modalInvoice.InvoiceNumber;
    VoucherObj.JournalNumber = this.modalInvoice.JournalNumber;
    //VoucherObj.InvoicePayType= this.modalInvoice.PayType;
    if (this.modalInvoice.Date != null) {
      VoucherObj.Date = this._sharedService.date_TO_String(
        this.modalInvoice.Date
      );
      const nowHijri = toHijri(this.modalInvoice.Date);
      VoucherObj.HijriDate = this._sharedService.hijri_TO_String(nowHijri);
    }
    VoucherObj.Notes = this.modalInvoice.Notes;
    VoucherObj.InvoiceNotes = this.modalInvoice.InvoiceNotes;
    VoucherObj.Type = this.modalInvoice.Type;
    VoucherObj.InvoiceValue = this.modalInvoice.VoucherValue;
    VoucherObj.StorehouseId = this.modalInvoice.storehouseId;
    VoucherObj.TotalValue = this.modalInvoice.TotalVoucherValueLbl;
    VoucherObj.TaxAmount = this.modalInvoice.taxAmountLbl;
    VoucherObj.ToAccountId = this.modalInvoice.ToAccountId;
    if (this.modalInvoice.popuptype == 1) {
      VoucherObj.ProjectId = this.modalInvoice.ProjectId;
    }
    VoucherObj.PayType = this.modalInvoice.PayType;
    VoucherObj.DiscountPercentage = this.modalInvoice.DiscountPercentage;
    VoucherObj.DiscountValue = this.modalInvoice.DiscountValue;
    VoucherObj.CustomerId = this.modalInvoice.customerId;
    VoucherObj.printBankAccount = this.modalInvoice.printBankAccount;
    VoucherObj.InvoiceReference = this.modalInvoice.Reference;
    VoucherObj.PaidValue = this.modalInvoice.PaidValue;
    VoucherObj.PageInsert = 1;
    VoucherObj.CostCenterId = this.modalInvoice.CostCenterId;
    if (this.modalInvoice.PayType == 8) {
      if (this.modalInvoice.AlarmVoucherInvDate == null) {
        VoucherObj.VoucherAlarmDate = null;
        VoucherObj.VoucherAlarmCheck = null;
        VoucherObj.IsSendAlarm = null;
      } else {
        VoucherObj.VoucherAlarmDate = this._sharedService.date_TO_String(
          this.modalInvoice.AlarmVoucherInvDate
        );
        VoucherObj.VoucherAlarmCheck = true;
        VoucherObj.IsSendAlarm = 0;
      }
    } else {
      VoucherObj.VoucherAlarmDate = null;
      VoucherObj.VoucherAlarmCheck = null;
      VoucherObj.IsSendAlarm = null;
    }
    var input = { valid: true, message: '' };
    this.InvoiceDetailsRows.forEach((element: any, index: any) => {
      if (element.AccJournalid == null) {
        input.valid = false;
        input.message = 'من فضلك أختر خدمة صحيحة';
        return;
      }
      if (element.Amounttxt == null) {
        input.valid = false;
        input.message = 'من فضلك أختر مبلغ صحيح';
        return;
      }
      if (element.QtyConst == null) {
        input.valid = false;
        input.message = 'من فضلك أختر كمية صحيحة';
        return;
      }
      debugger;
      var VoucherDetailsObj: any = {};
      VoucherDetailsObj.LineNumber = index + 1;
      VoucherDetailsObj.AccountId = this.modalInvoice.TempBox;
      VoucherDetailsObj.ServicesPriceId = element.AccJournalid;
      VoucherDetailsObj.Amount = element.Amounttxt;
      VoucherDetailsObj.Qty = element.QtyConst;
      VoucherDetailsObj.TaxType = this.modalInvoice.taxtype;
      VoucherDetailsObj.TaxAmount = element.taxAmounttxt;
      VoucherDetailsObj.TotalAmount = element.TotalAmounttxt;

      VoucherDetailsObj.DiscountValue_Det = element.DiscountValueConst;
      VoucherDetailsObj.DiscountPercentage_Det =
        element.DiscountPercentageConst;

      VoucherDetailsObj.PayType = this.modalInvoice.PayType;

      //this.checkPayType();
      VoucherDetailsObj.ToAccountId = this.modalInvoice.ToAccountId;
      VoucherDetailsObj.CostCenterId = this.modalInvoice.CostCenterId;
      VoucherDetailsObj.ReferenceNumber = this.modalInvoice.Reference;
      VoucherDetailsObj.Description = '';
      VoucherDetailsList.push(VoucherDetailsObj);
    });
    if (!input.valid) {
      this.toast.error(input.message);
      return;
    }

    debugger;
    var DetailsList: any = [];
    var counter = 0;
    if (this.OfferPopupAddorEdit_Invoice == 1) {
      this.ListDataServices_Invoice.forEach((elementService: any) => {
        elementService.forEach((element: any) => {
          var Detailsobj: any = {};
          counter++;
          //element.servicesIdVou??0
          Detailsobj.ServicesIdVou = 0;
          Detailsobj.ServicesId = element.servicesId;
          Detailsobj.ParentId = element.parentId;
          Detailsobj.SureService = 1;
          Detailsobj.LineNumber = counter;
          DetailsList.push(Detailsobj);
        });
      });
    } else {
      this.ListDataServices_Invoice.forEach((elementService: any) => {
        let dataSer = elementService.filter(
          (d: { SureService: any }) => d.SureService == 1
        );
        dataSer.forEach((element: any) => {
          var Detailsobj: any = {};
          counter++;
          Detailsobj.ServicesIdVou = 0;
          Detailsobj.ServicesId = element.servicesId;
          Detailsobj.ParentId = element.parentId;
          Detailsobj.SureService = element.SureService ?? 0;
          Detailsobj.LineNumber = counter;
          DetailsList.push(Detailsobj);
        });
      });
    }

    VoucherObj.ServicesPriceOffer = DetailsList;

    VoucherObj.VoucherDetails = VoucherDetailsList;
    VoucherObj.ToAccountId = this.modalInvoice.ToAccountId;
    VoucherObj.PayType = this.modalInvoice.PayType;

    this.disableButtonSave_Invoice = true;
    setTimeout(() => {
      this.disableButtonSave_Invoice = false;
    }, 15000);

    if (this.modalInvoice.WhichClick == 1) {
      this._invoiceService
        .SaveInvoiceForServicesDraft(VoucherObj)
        .subscribe((result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            if (this.uploadedFiles.length > 0) {
              const formData = new FormData();
              formData.append('UploadedFile', this.uploadedFiles[0]);
              formData.append('InvoiceId', result.returnedParm);
              this._invoiceService
                .UploadPayVoucherImage(formData)
                .subscribe((result) => {
                  this.ShowAllVoucher();
                });
            } else {
              this.ShowAllVoucher();
            }
            this.resetInvoiceData();
            this.InvoiceModelPublic?.dismiss();
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        });
    } else if (this.modalInvoice.WhichClick == 4) {
      //VoucherObj.InvoiceId = this.modalInvoice.InvoiceId;
      this._invoiceService
        .UpdateVoucherDraft(this.modalInvoice.InvoiceId)
        .subscribe((result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            if (this.uploadedFiles.length > 0) {
              const formData = new FormData();
              formData.append('UploadedFile', this.uploadedFiles[0]);
              formData.append('InvoiceId', result.returnedParm);
              this._invoiceService
                .UploadPayVoucherImage(formData)
                .subscribe((result) => {
                  this.ShowAllVoucher();
                });
            } else {
              this.ShowAllVoucher();
            }
            this.resetInvoiceData();
            this.InvoiceModelPublic?.dismiss();
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        });
    }
  }

  ConvertNumToString(val: any) {
    this._sharedService.ConvertNumToString(val).subscribe((data) => {
      console.log(data);
      //this.modalDetails.total_amount_text=data?.reasonPhrase;
    });
  }
  //#endregion
  //------------------------------------(End) Invoice-------------------------------------------

  //-----------------------------------invoice btn---------------------------------------------
  //#region

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
      InvoiceNumberDraft:"M"+data.invoiceNumber,
      JournalNumber: data.journalNumber,
      InvoicePayType: null,
      storehouseId:data.storehouseId,
      Date: date,
      HijriDate: DateGre,
      Notes: data.notes,
      InvoiceNotes: data.invoiceNotes,
      Type: 34,
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
  InvoiceEdit(data: any) {
    this.modalInvoice.AddOrView = 4;
    this.GetAllCustomerForDrop();
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
      InvoiceNumberDraft:"M"+data.invoiceNumber,
      JournalNumber: data.journalNumber,
      InvoicePayType: null,
      storehouseId:data.storehouseId,
      Date: date,
      HijriDate: DateGre,
      Notes: data.notes,
      InvoiceNotes: data.invoiceNotes,
      Type: 34,
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
      AddOrView: 4,
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
  InvCreditView(InvoiceIdV: any) {
    this.modalInvoice.AddOrView = 3;

    this.GetAllCustomerForDrop();
    this._invoiceService
      .GetVouchersSearchInvoiceByID(InvoiceIdV)
      .subscribe((data) => {
        console.log('GetVouchersSearchInvoiceByID');
        console.log(data);
        if (data.addDate !== null) {
          var AddDate = this._sharedService.date_TO_String(
            new Date(data.addDate)
          );
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
            (
              parseFloat(data.invoiceValue) - parseFloat(data.taxAmount)
            ).toString()
          ).toFixed(2);
        } else {
          val_vouc = parseFloat(data.InvoiceValue).toFixed(2);
        }
        debugger;
        this.modalInvoice = {
          InvoiceId: data.invoiceId,
          InvoiceNumber: data.invoiceNumber,
          InvoiceNumberDraft:"M"+data.invoiceNumber,
          JournalNumber: data.journalNumber,
          InvoicePayType: null,
          storehouseId:data.storehouseId,
          Date: date,
          HijriDate: DateGre,
          Notes: data.notes,
          InvoiceNotes: data.invoiceNotes,
          Type: 29,
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
          WhichClick: 3,
          AddOrView: 3,
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
        this.modalInvoice.GlobalTotalFatora = CalcAll;
        this.checkRemainder();
        this.CalculateTotal2(1);
      });
  }

  ShowImgAdded(pho: any) {
    var img = environment.PhotoURL + pho;
    return img;
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
  AllJournalEntries: any = [];
  GetAllJournalsByInvID(invid: any) {
    this._invoiceService.GetAllJournalsByInvID(invid).subscribe((data) => {
      this.AllJournalEntries = data.result;
    });
  }
  InvoicesIds: any = [];
  WhichPost: number = 1;

  RowInvoiceData: any;

  postbtn() {
    this.InvoicesIds = [];
    if (this.WhichPost == 2) {
      this.selection.selected.forEach((element: any) => {
        this.InvoicesIds.push(element.invoiceId);
      });
    } else {
      this.InvoicesIds.push(this.RowInvoiceData.invoiceId);
    }
    if (this.InvoicesIds) {
      this._invoiceService
        .PostVouchersCheckBox(this.InvoicesIds)
        .subscribe((result: any) => {
          if (result?.body?.statusCode == 200) {
            this.toast.success(result?.body?.reasonPhrase, 'رسالة');
            this.ShowAllVoucher();
            this.selection.clear();
          } else if (result?.type == 0) {
          } else {
            this.toast.error(result?.body?.reasonPhrase, 'رسالة');
          }
        });
    } else {
      this.toast.error('من فضلك اختر مستخدم', 'رسالة');
    }
  }

  getAlaramNote(element: any) {
    var note = ' تذكير استحقاق  ' + ' بتاريخ ' + element?.voucherAlarmDate;
    return note ?? '';
  }

  InvoicesObjs: Invoices[] = [];
  invoice: any;
  public _invoices: Invoices;

  PostBackVouchers() {
    this.InvoicesObjs = [];
    this.InvoicesObjs.push(this.RowInvoiceData);

    var invoicesList: any = [];

    this.InvoicesObjs.forEach((element: any) => {
      this._invoices = new Invoices();
      this._invoices.invoiceId = element.invoiceId;
      this._invoices.type = element.type;
      invoicesList.push(this._invoices);
    });

    this._invoiceService
      .PostBackVouchers(invoicesList)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.InvoicesObjs = [];
          this.ShowAllVoucher();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  NotiData: any = {
    invoiceid: null,
  };
  LoadInvoiceNumbers: any = [];
  FillAllNotiVoucher() {
    var _voucherFilterVM = new VoucherFilterVM();
    _voucherFilterVM.type = this.dataInvoice.filter.Type;
    var obj = _voucherFilterVM;
    this._invoiceService.FillAllNotiVoucher(obj).subscribe((data) => {
      this.LoadInvoiceNumbers = data;
    });
  }

  resetNotiPopup() {
    this.NotiData = {
      invoiceid: null,
    };
    this.FillAllNotiVoucher();
  }
  ReturnNotiCreditBack(modal: any) {
    if (this.NotiData.invoiceid == null) {
      this.toast.error('من فضلك أختر فاتورة أولا', 'رسالة');
      return;
    }
    var VoucherObj: any = {};
    VoucherObj.InvoiceId = this.NotiData.invoiceid;
    this._invoiceService
      .ReturnNotiCreditBack(VoucherObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.resetNotiPopup();
          this.ShowAllVoucher();
          modal?.dismiss();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  //#endregion
  //---------------------------------(end)--invoice btn-----------------------------------------

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
    const numRows = this.InvoicessDataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.InvoicessDataSource.data);
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
            this.addInvoiceRow();
          }
          break;
      }
    }
  }

  //----------------------------------------------Print---------------------------------------
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
        console.log('GetInvoicePrint');
        console.log(data);

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
        ((item.amount ?? 0) + (item.dDiscountValue_Det ?? 0)) / (item.qty ?? 1);
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
      .PrintVoucher(obj.invoiceId, 5)
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

  //----------------------------ServicePrice----------------------------
  //#region
  ServiceTypelist = [
    { id: 1, name: 'خدمة' },
    { id: 2, name: 'تقرير' },
  ];

  CostCenterSelectlist: any = [];
  ServiceAccountlist: any = [];
  ServiceAccountPurlist: any = [];
  FillCostCenterSelect_Service() {
    this._accountsreportsService.FillCostCenterSelect().subscribe((data) => {
      this.CostCenterSelectlist = data;
    });
  }
  FillServiceAccount() {
    this._accountsreportsService.FillServiceAccount().subscribe((data) => {
      this.ServiceAccountlist = data;
    });
  }
  FillServiceAccountPurchase() {
    this._accountsreportsService.FillSubAccountLoad().subscribe(data => {
      this.ServiceAccountPurlist = data.result;
    });
  }
  packageList: any = [];
  FillPackagesSelect() {
    this._accountsreportsService.FillPackagesSelect().subscribe((data) => {
      this.packageList = data;
    });
  }
  ProjectTypeList: any = [];
  SubprojecttypeList: any = [];
  ProjectTypeId: any;
  SubprojecttypeId: any;
  ServiceName: any;
  FillProjectTypeSelectService() {
    this._accountsreportsService.FillProjectTypeSelect().subscribe((data) => {
      this.ProjectTypeList = data;
    });
  }
  FillProjectSubTypesSelectService(id: any) {
    this._accountsreportsService
      .FillProjectSubTypesSelect(id)
      .subscribe((data) => {
        this.SubprojecttypeList = data;
      });
  }

  projectsDataSourceTemp: any = [];
  DataSource: any = [];

  SerivceModalForm: FormGroup;
  SerivceModalDetails: any;

  intialModelBranchOrganization() {
    this.SerivceModalForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      ProjectType: [null, [Validators.required]],
      SubprojectType: [null, [Validators.required]],
      ServiceName: [null, [Validators.required]],
      ServiceNameEN: [null, [Validators.required]],
      ServiceType: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      costCenter: [null, [Validators.required]],
      ServiceRevenueAccount: [null, [Validators.required]],
      nameAccount: [null, [Validators.required]],
      PackageId: [null, [Validators.required]],

      AmountPur: [null, [Validators.required]],
      AccountIdPur: [null, [Validators.required]],
      Begbalance: [null],
      SerialNumber: [null],
      ItemCode: [null, [Validators.required]],

    });
  }

  details: any = [];

  SaveServicePriceWithDetails(modal?: any) {
    this.ServiceAccountlist.forEach((element: any) => {
      if (
        this.SerivceModalForm.controls['ServiceRevenueAccount'].value ==
        element.id
      ) {
        this.SerivceModalForm.controls['nameAccount'].setValue(element.name);
      }
    });
    if (this.SerivceModalForm.controls['id'].value != 0) {
      this.details = [];
    } else {
      this.details.forEach((element: any) => {
        element.servicesId = 0;
      });
    }

    const params = {
      services_price: {
        AccountId: this.SerivceModalForm.controls["ServiceRevenueAccount"].value,
        accountName: 'ايرادات',
        Amount: Number(this.SerivceModalForm.controls["amount"].value),
        // CostCenterId: this.SerivceModalForm.controls["costCenter"].value,
        // PackageId: this.SerivceModalForm.controls["PackageId"].value,
        // ProjectId: this.SerivceModalForm.controls["ProjectType"].value,
        // ProjectSubTypeID: this.SerivceModalForm.controls["SubprojectType"].value,
        ServiceName_EN: this.SerivceModalForm.controls["ServiceNameEN"].value,
        // ServiceType: this.SerivceModalForm.controls["ServiceType"].value,
        ServicesId: this.SerivceModalForm.controls["id"].value,
        servicesName: this.SerivceModalForm.controls["ServiceName"].value,

        amountPur: this.SerivceModalForm.controls["AmountPur"].value,
        accountIdPur: this.SerivceModalForm.controls["AccountIdPur"].value,
        begbalance: this.SerivceModalForm.controls["Begbalance"].value,
        serialNumber: this.SerivceModalForm.controls["SerialNumber"].value,
        itemCode: this.SerivceModalForm.controls["ItemCode"].value,

      },
      details: this.details,
    };

    this._accountsreportsService
      .SaveServicePriceWithDetails(params)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          // this.GetAllServicesPrice()
          modal.dismiss();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  AllProjectTypelist: any = [];
  GetAllProjectType() {
    this._accountsreportsService.GetAllProjectType().subscribe((data) => {
      this.AllProjectTypelist = data;
    });
  }
  applyFilterProjectType(event: any) {
    const val = event.target.value.toLowerCase();
    this._accountsreportsService.GetAllProjectType(val).subscribe((data) => {
      this.AllProjectTypelist = [];
      this.AllProjectTypelist = data.result;
    });
  }
  TypeId: any = '0';
  ProjectTypenameEn: any;
  ProjectTypenameAr: any;
  SaveProjectType() {
    if (this.ProjectTypenameEn != null && this.ProjectTypenameAr != null) {
      const prames = {
        TypeId: this.TypeId.toString(),
        NameEn: this.ProjectTypenameEn,
        NameAr: this.ProjectTypenameAr,
      };
      this._accountsreportsService.SaveProjectType(prames).subscribe(
        (data) => {
          this.ProjectTypenameEn = null;
          this.ProjectTypenameAr = null;
          this.TypeId = '0';
          this.FillProjectTypeSelectService();
          this.GetAllProjectType();
          this.toast.success(data.reasonPhrase, 'رسالة');
        },
        (error) => {
          this.toast.error(error.reasonPhrase, 'رسالة');
        }
      );
    }
  }
  updateProjectType(group: any) {
    this.TypeId = group.typeId;
    this.ProjectTypenameEn = group.nameEn;
    this.ProjectTypenameAr = group.nameAr;
  }
  pTypeId: any;

  DeleteProjectType(modal?: any) {
    this._accountsreportsService.DeleteProjectType(this.pTypeId).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.toast.success(data.reasonPhrase, 'رسالة');
          this.FillProjectTypeSelectService();
          this.GetAllProjectType();
          this.pTypeId = null;
          modal.dismiss();
        }
      },
      (error) => {
        this.pTypeId = null;
        this.toast.error(error.reasonPhrase, 'رسالة');
      }
    );
  }

  AllProjectSubsByProjectTypelist: any = [];
  GetAllProjectSubsByProjectTypeId(search?: any) {
    this._accountsreportsService
      .GetAllProjectSubsByProjectTypeId(
        search,
        this.SerivceModalForm.controls['ProjectType'].value
      )
      .subscribe((data) => {
        this.AllProjectSubsByProjectTypelist = data;
      });
  }
  applyFilterSubsByProjectTypeId(event: any) {
    const val = event.target.value.toLowerCase();
    this._accountsreportsService
      .GetAllProjectSubsByProjectTypeId(
        val,
        this.SerivceModalForm.controls['ProjectType'].value
      )
      .subscribe((data) => {
        this.AllProjectSubsByProjectTypelist = [];
        this.AllProjectSubsByProjectTypelist = data.result;
      });
  }

  SubTypeId: any = '0';
  SubprojectTypenameEn: any;
  SubprojectTypenameAr: any;
  TimePeriodStr: any;
  SaveSubprojectType() {
    if (
      this.SubprojectTypenameEn != null &&
      this.SubprojectTypenameAr != null
    ) {
      const prames = {
        SubTypeId: this.SubTypeId.toString(),
        NameEn: this.SubprojectTypenameEn,
        NameAr: this.SubprojectTypenameAr,
        ProjectTypeId: this.SerivceModalForm.controls['ProjectType'].value,
        TimePeriod: this.TimePeriodStr,
      };
      this._accountsreportsService.SaveProjectSubType(prames).subscribe(
        (data) => {
          this.TimePeriodStr = null;
          this.SubprojectTypenameAr = null;
          this.SubprojectTypenameEn = null;
          this.SubTypeId = '0';
          this.FillProjectSubTypesSelectService(
            this.SerivceModalForm.controls['ProjectType'].value
          );
          this.GetAllProjectSubsByProjectTypeId();
          this.toast.success(data.reasonPhrase, 'رسالة');
        },
        (error) => {
          this.toast.error(error.reasonPhrase, 'رسالة');
        }
      );
    }
  }
  updateSubprojectType(group: any) {
    this.SubTypeId = group.subTypeId;
    this.SubprojectTypenameEn = group.nameEn;
    this.TimePeriodStr = group.timePeriod;
    this.SubprojectTypenameAr = group.nameAr;
  }
  psubTypeId: any;

  DeleteProjectSubTypes(modal?: any) {
    this._accountsreportsService
      .DeleteProjectSubTypes(this.psubTypeId)
      .subscribe(
        (data) => {
          if (data.statusCode == 200) {
            this.toast.success(data.reasonPhrase, 'رسالة');
            this.FillProjectSubTypesSelectService(
              this.SerivceModalForm.controls['ProjectType'].value
            );
            this.GetAllProjectSubsByProjectTypeId();
            this.psubTypeId = null;
            modal.dismiss();
          }
        },
        (error) => {
          this.psubTypeId = null;
          this.toast.error(error.reasonPhrase, 'رسالة');
        }
      );
  }

  ChangeProjectType() {
    if (this.SerivceModalForm.controls['ProjectType'].value) {
      this.FillProjectSubTypesSelectService(
        this.SerivceModalForm.controls['ProjectType'].value
      );
    } else {
      this.SubprojecttypeList = [];
    }
  }

  AllPackageslist: any = [];
  GetAllPackages() {
    this._accountsreportsService.GetAllPackages().subscribe((data) => {
      this.AllPackageslist = data.result;
    });
  }
  applyFilterPackages(event: any) {
    const val = event.target.value.toLowerCase();
    this._accountsreportsService.GetAllPackages(val).subscribe((data) => {
      this.AllPackageslist = [];
      this.AllPackageslist = data.result;
    });
  }

  PackageId: any = '0';
  PackageName: any;
  MeterPrice1: any;
  MeterPrice2: any;
  MeterPrice3: any;
  PackageRatio1: any;
  PackageRatio2: any;
  PackageRatio3: any;
  SavePackages() {
    if (
      this.PackageName != null &&
      this.MeterPrice1 != null &&
      this.MeterPrice2 != null &&
      this.MeterPrice3 != null &&
      this.PackageRatio1 != null &&
      this.PackageRatio2 != null &&
      this.PackageRatio3 != null
    ) {
      const prames = {
        PackageId: this.PackageId.toString(),
        PackageName: this.PackageName,
        MeterPrice3: this.MeterPrice3,
        MeterPrice2: this.MeterPrice2,
        MeterPrice1: this.MeterPrice1,
        PackageRatio1: this.PackageRatio1,
        PackageRatio2: this.PackageRatio2,
        PackageRatio3: this.PackageRatio3,
      };
      this._accountsreportsService.SavePackage(prames).subscribe(
        (data) => {
          this.PackageName = null;
          this.MeterPrice1 = null;
          this.MeterPrice2 = null;
          this.MeterPrice3 = null;
          this.PackageRatio1 = null;
          this.PackageRatio2 = null;
          this.PackageRatio3 = null;
          this.PackageId = '0';
          this.FillPackagesSelect();
          this.GetAllPackages();
          this.toast.success(data.reasonPhrase, 'رسالة');
        },
        (error) => {
          this.toast.error(error.reasonPhrase, 'رسالة');
        }
      );
    }
  }
  updatePackages(group: any) {
    this.PackageId = group.packageId;
    this.PackageName = group.packageName;
    this.MeterPrice1 = group.meterPrice1;
    this.MeterPrice2 = group.meterPrice2;
    this.MeterPrice3 = group.meterPrice3;
    this.PackageRatio1 = group.packageRatio1;
    this.PackageRatio2 = group.packageRatio2;
    this.PackageRatio3 = group.packageRatio3;
  }
  PackageIdD: any;

  DeletePackages(modal?: any) {
    this._accountsreportsService.DeletePackage(this.PackageIdD).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.toast.success(data.reasonPhrase, 'رسالة');
          this.FillPackagesSelect();
          this.GetAllPackages();
          this.PackageIdD = null;
          modal.dismiss();
        }
      },
      (error) => {
        this.PackageIdD = null;
        this.toast.error(error.reasonPhrase, 'رسالة');
      }
    );
  }

  AllcostCenterlist: any = [];
  GetAllcostCenter() {
    if (this.SerivceModalForm.controls['id'].value != 0) {
      this._accountsreportsService
        .GetServicesPriceByParentId(this.SerivceModalForm.controls['id'].value)
        .subscribe((data) => {
          this.AllcostCenterlist = data.result;
        });
    }
  }

  servicesId: any = '0';
  accountName: any;
  servicesName: any;
  SavecostCenter() {
    if (this.accountName != null && this.servicesName != null) {
      if (this.SerivceModalForm.controls['id'].value == 0) {
        var obj = this.details.filter((ele: any) => {
          return ele.servicesId == this.servicesId;
        });
        if (obj.length > 0) {
          this.details.forEach((element: any) => {
            if (obj[0].servicesId == element.servicesId) {
              element.accountName = this.accountName;
              element.servicesName = this.servicesName;
              return;
            }
          });
          this.servicesId = 0;
          this.accountName = null;
          this.servicesName = null;
          return;
        }
        this.details.push({
          servicesId: this.details.length + 1,
          accountName: this.accountName,
          servicesName: this.servicesName,
          ParentId: this.SerivceModalForm.controls['id'].value,
        });
        this.AllcostCenterlist = [];
        this.AllcostCenterlist = this.details;
        this.accountName = null;
        this.servicesName = null;
      } else {
        const prames = {
          servicesId: this.servicesId ?? 0,
          accountName: this.accountName,
          servicesName: this.servicesName,
          ParentId: this.SerivceModalForm.controls['id'].value,
        };
        this._accountsreportsService.SaveServicesPrice(prames).subscribe(
          (data) => {
            this.accountName = null;
            this.servicesName = null;
            this.servicesId = '0';
            this.GetAllcostCenter();
            this.toast.success(data.reasonPhrase, 'رسالة');
          },
          (error) => {
            this.toast.error(error.reasonPhrase, 'رسالة');
          }
        );
      }
    }
  }
  updatecostCenter(group: any) {
    this.servicesId = group.servicesId;
    this.accountName = group.accountName;
    this.servicesName = group.servicesName;
  }
  ServicesPriceId: any;
  ServicesPriceIdindex: any;
  DeleteService(modal?: any) {
    if (this.SerivceModalForm.controls['id'].value == 0) {
      this.details.splice(this.ServicesPriceIdindex, 1);
      this.AllcostCenterlist = [];
      this.AllcostCenterlist = this.details;
      modal.dismiss();
    } else {
      this._accountsreportsService
        .DeleteService(this.ServicesPriceId)
        .subscribe(
          (data) => {
            if (data.statusCode == 200) {
              this.toast.success(data.reasonPhrase, 'رسالة');
              this.GetAllcostCenter();
              this.ServicesPriceId = null;
              modal.dismiss();
            }
          },
          (error) => {
            this.ServicesPriceId = null;
            this.toast.error(error.reasonPhrase, 'رسالة');
          }
        );
    }
  }

  AllTotalSpacesRangelist: any = [];
  GetAllTotalSpacesRange() {
    this._accountsreportsService.GetAllTotalSpacesRange().subscribe((data) => {
      this.AllTotalSpacesRangelist = data.result;
    });
  }
  applyFilterTotalSpacesRange(event: any) {
    const val = event.target.value.toLowerCase();
    this._accountsreportsService
      .GetAllTotalSpacesRange(val)
      .subscribe((data) => {
        this.AllTotalSpacesRangelist = [];
        this.AllTotalSpacesRangelist = data.result;
      });
  }
  TotalSpacesRangeId: any = '0';
  rangeName: any;
  RangeValue: any;
  SaveTotalSpacesRange() {
    if (this.rangeName != null && this.RangeValue != null) {
      const prames = {
        TotalSpacesRangeId: this.TotalSpacesRangeId.toString(),
        TotalSpacesRengeName: this.rangeName,
        RangeValue: this.RangeValue,
      };
      this._accountsreportsService.SaveTotalSpacesRange(prames).subscribe(
        (data) => {
          this.rangeName = null;
          this.RangeValue = null;
          this.TotalSpacesRangeId = '0';
          this.GetAllTotalSpacesRange();
          this.toast.success(data.reasonPhrase, 'رسالة');
        },
        (error) => {
          this.toast.error(error.reasonPhrase, 'رسالة');
        }
      );
    }
  }
  updateTotalSpacesRange(group: any) {
    this.TotalSpacesRangeId = group.totalSpacesRangeId;
    this.rangeName = group.totalSpacesRengeName;
    this.RangeValue = group.rangeValue;
  }
  DTotalSpacesRangeId: any;

  deleteTotalSpaces(modal?: any) {
    this._accountsreportsService
      .DeleteTotalSpacesRange(this.DTotalSpacesRangeId)
      .subscribe(
        (data) => {
          if (data.statusCode == 200) {
            this.toast.success(data.reasonPhrase, 'رسالة');
            this.GetAllTotalSpacesRange();
            this.DTotalSpacesRangeId = null;
            modal.dismiss();
          }
        },
        (error) => {
          this.pTypeId = null;
          this.toast.error(error.reasonPhrase, 'رسالة');
        }
      );
  }

  AllFloorslist: any = [];
  GetAllFloorsService() {
    this._accountsreportsService.GetAllFloors().subscribe((data) => {
      this.AllFloorslist = data.result;
    });
  }
  applyFilterFloor(event: any) {
    const val = event.target.value.toLowerCase();
    this._accountsreportsService.GetAllFloors(val).subscribe((data) => {
      this.AllFloorslist = [];
      this.AllFloorslist = data.result;
    });
  }
  FloorId: any = '0';
  FloorName: any;
  FloorRatio: any;
  SaveFloor() {
    if (this.FloorName != null && this.FloorRatio != null) {
      const prames = {
        FloorId: this.FloorId.toString(),
        FloorName: this.FloorName,
        FloorRatio: this.FloorRatio,
      };
      this._accountsreportsService.SaveFloor(prames).subscribe(
        (data) => {
          this.FloorName = null;
          this.FloorRatio = null;
          this.FloorId = '0';
          this.GetAllFloorsService();
          this.toast.success(data.reasonPhrase, 'رسالة');
        },
        (error) => {
          this.toast.error(error.reasonPhrase, 'رسالة');
        }
      );
    }
  }
  updatefloor(group: any) {
    this.FloorId = group.floorId;
    this.FloorName = group.floorName;
    this.FloorRatio = group.floorRatio;
  }
  DFloors: any;
  DeleteFloor(modal?: any) {
    this._accountsreportsService.DeleteFloor(this.DFloors).subscribe(
      (data) => {
        if (data.result.statusCode == 200) {
          this.GetAllFloorsService();
          this.toast.success(data.reasonPhrase, 'رسالة');
          this.DFloors = null;
          modal.dismiss();
        }
      },
      (error) => {
        this.DFloors = null;
        this.toast.error(error.reasonPhrase, 'رسالة');
      }
    );
  }
  //#endregion
  //--------------------------End--ServicePrice----------------------------

  //--------------------------Start--catch-receipt----------------------------
  ReceiptVoucherForm: FormGroup;
  CheckDetailsForm: FormGroup;
  public uploadedFilesReceipt: Array<File> = [];
  selectedDateType = DateType.Hijri;
  hijriDateReceipt: any;
  R_theInvoice: any = null;
  Registrationnumber: any = null;
  ClientId: any = null;
  referenceNumber: any = null;
  paymenttype: any = null;
  transferNumber: boolean = false;
  CustCheckPage: any = null;
  modalType: any = 'Edit';
  checkdetailsList: any = [];
  hijritype: boolean = false;

  PayTypeList = [
    { id: 1, name: 'monetary' },
    { id: 17, name: 'Cash account points of sale - Mada-ATM' },
    { id: 2, name: 'Check' },
    { id: 6, name: 'transfer' },
    { id: 9, name: 'Network/transfer' },
  ];
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
  CheckDetailsIntial() {
    this.CheckDetailsForm = this.formBuilder.group({
      dateCheck_transfer: [null, []],
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
  FillCustAccountsSelect2listFROM: any;
  FillCustAccountsSelect2REC(PayTypeId: any) {
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
  costCentersList: any;
  FillCostCenterSelectREC() {
    this._accountsreportsService.FillCostCenterSelect().subscribe((data) => {
      this.costCentersList = data;
    });
  }
  FillCustAccountsSelect2listTO: any;
  FillSubAccountLoad() {
    this.receiptService.FillSubAccountLoad_Branch().subscribe((data) => {
      this.FillCustAccountsSelect2listTO = data.result;
    });
  }
  BankSelectList: any;
  FillBankSelect() {
    this.receiptService.FillBankSelect().subscribe((data) => {
      this.BankSelectList = data;
    });
  }
  GenerateVoucherNumberREC() {
    this.receiptService.GenerateVoucherNumber().subscribe((data) => {
      this.ReceiptVoucherForm.controls['VoucherNumber'].setValue(
        data.reasonPhrase
      );
    });
  }
  AllCustomerForDropWithBranchList: any;
  GetAllCustomerForDropWithBranch() {
    this.receiptService.GetAllCustomerForDropWithBranch().subscribe((data) => {
      this.AllCustomerForDropWithBranchList = data.result;
    });
  }
  GetCustomersByCustomerId() {
    this.receiptService.GetCustomersByCustomerId(this.ClientId).subscribe(
      (data) => {
        this.ReceiptVoucherForm.controls['toAccount'].setValue(
          data.result.accountId
        );
      },
      (error) => {}
    );
  }
  gethigridate() {
    this._sharedService
      .GetHijriDate(
        this.ReceiptVoucherForm.controls['dateM'].value,
        'Contract/GetHijriDate2'
      )
      .subscribe({
        next: (data: any) => {
          this.hijriDateReceipt = data;
        },
        error: (error) => {},
      });
  }
  @ViewChild('EditCheckDetailsModal') EditCheckDetailsModal: any;
  FillCustAc(add: any) {
    debugger;
    // var PayType = this.ReceiptVoucherForm.controls["paymenttype"].value
    var PayType = this.paymenttype;
    if (PayType == 1) {
      this.checkdetailsList = [];
      this.FillCustAccountsSelect2REC(1);
    } else if (PayType == 2 || PayType == 6) {
      this.checkdetailsList = [];
      this.FillCustAccountsSelect2REC(6);
      if (add == false) {
        this.open(
          this.EditCheckDetailsModal,
          '',
          'EditCheckDetailsModal',
          '',
          'newCheckDetails'
        );
      }
    } else if (PayType == 3) {
      this.checkdetailsList = [];
      this.FillCustAccountsSelect2REC(4);
    } else if (PayType == 4) {
      this.checkdetailsList = [];
      this.FillCustAccountsSelect2REC(5);
    } else if (PayType == 5) {
      this.checkdetailsList = [];
      this.FillCustAccountsSelect2REC(6);
    } else if (PayType == 9) {
      this.checkdetailsList = [];
      this.FillCustAccountsSelect2REC(9);
    } else if (PayType == 17) {
      this.checkdetailsList = [];
      this.FillCustAccountsSelect2REC(17);
      if (add == false) {
        this.open(
          this.EditCheckDetailsModal,
          '',
          'EditCheckDetailsModal',
          '',
          'newCheckDetails'
        );
      }
    } else {
      this.checkdetailsList = [];
      this.FillCustAccountsSelect2REC(PayType);
    }
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
    }
  }
  ConvertNumToString_Offer(val: any) {
    if (val != null) {
      this.receiptService.ConvertNumToString(val).subscribe((data) => {
        this.ReceiptVoucherForm.controls['amountWriting'].setValue(
          data?.reasonPhrase
        );
      });
    } else {
      this.ReceiptVoucherForm.controls['amountWriting'].setValue(null);
    }
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

        this.ConvertNumToString_Offer(AccValue);
        this.ReceiptVoucherForm.controls['AmountOf'].setValue(AccValue);
      } else {
        this.ReceiptVoucherForm.controls['AmountOf'].setValue(0);
        this.ConvertNumToString_Offer(0);
      }
    });
  }
  UpdateStoreid(invId: any) {
    this.receiptService.UpdateVoucher(invId).subscribe((result: any) => {
      this.ShowAllVoucher();
    });
  }

  submitted: boolean = false;

  addUser: any;
  addDate: any;
  addInvoiceImg: any;
  DetailsByVoucher: any;
  InvoiceReVoucherPublic: any = 0;
  editInvoices(element: any) {
    this.InvoiceReVoucherPublic = 0;
    this.receiptService
      .GetAllDetailsByVoucherId(element.invoiceId)
      .subscribe((data) => {
        this.addUser = null;
        this.addDate = null;
        this.addInvoiceImg = null;
        this.DetailsByVoucher = data.result[0];
        this.InvoiceReVoucherPublic = element.invoiceId;

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

        // this.ReceiptVoucherForm.controls["VoucherNumber"].setValue(element.invoiceNumber)
        this.ReceiptVoucherForm.controls['dateM'].setValue(new Date());
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
        this.R_theInvoice = element.invoiceNumber;
        // this.ReceiptVoucherForm.controls["AmountOf"].setValue(element.totalValue)
        // this.ConvertNumToString_Offer(this.ReceiptVoucherForm.controls["AmountOf"].value)
        var Val =
          +parseFloat(parseFloat(element.totalValue).toFixed(2)) -
          +parseFloat(parseFloat(element.paidValue).toFixed(2));
        this.GetVousherRe_Sum(element.invoiceId, Val);

        this.ReceiptVoucherForm.controls['recipientName'].setValue(
          element.recevierTxt
        );
        // this.ReceiptVoucherForm.controls["paymenttype"].setValue(element.payType)
        this.PayTypeList.forEach((element: any) => {
          if (element.payType == element.id) {
            this.paymenttype = element.payType;
          }
        });
        this.paymenttype == null ? (this.paymenttype = 1) : this.paymenttype;

        this.FillCustAc(true);

        this.FillCustAccountsSelect2listFROM.forEach((element: any) => {
          if (element.toAccountId == element.id) {
            this.ReceiptVoucherForm.controls['fromAccount'].setValue(
              element.toAccountId
            );
          }
        });

        // this.ReceiptVoucherForm.controls["fromAccount"].setValue(element.toAccountId)
        this.GetAccCodeFormID(
          this.ReceiptVoucherForm.controls['fromAccount'].value,
          1
        );

        this.ReceiptVoucherForm.controls['toAccount'].setValue(
          element.toAccountId
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
  disableButtonSave_Voucher = false;

  SaveVoucher(modal: any, PostVouchers?: any) {
    this.submitted == true;
    var VoucherObj: any = {};

    if (
      this.ReceiptVoucherForm.controls['dateM'].value != null &&
      typeof this.ReceiptVoucherForm.controls['dateM'].value != 'string'
    ) {
      var date = this._sharedService.date_TO_String(
        this.ReceiptVoucherForm.controls['dateM'].value
      );
      VoucherObj.Date = date;
    } else {
      VoucherObj.Date = this.ReceiptVoucherForm.controls['dateM'].value;
    }

    this.hijriDateReceipt =
      this.hijriDateReceipt.year +
      '-' +
      this.hijriDateReceipt.month +
      '-' +
      this.hijriDateReceipt.day;

    var VoucherDetailsList = [];
    VoucherObj.Type = 6;
    VoucherObj.TaxAmount = null;
    VoucherObj.InvoiceId = 0;
    VoucherObj.toInvoiceId = this.R_theInvoice;
    VoucherObj.InvoiceNumber =
      this.ReceiptVoucherForm.controls['VoucherNumber'].value;
    // VoucherObj.JournalNumber = this.ReceiptVoucherForm.controls["Registrationnumber"].value;

    //VoucherObj.JournalNumber = this.Registrationnumber;

    // VoucherObj.Date = this.ReceiptVoucherForm.controls["dateM"].value;
    VoucherObj.HijriDate = this.hijriDateReceipt;
    VoucherObj.Notes = this.ReceiptVoucherForm.controls['Notes'].value;
    VoucherObj.InvoiceNotes =
      this.ReceiptVoucherForm.controls['Statement'].value;
    VoucherObj.InvoiceValue =
      this.ReceiptVoucherForm.controls['AmountOf'].value;
    VoucherObj.ToAccountId =
      this.ReceiptVoucherForm.controls['fromAccount'].value;
    VoucherObj.InvoiceReference = this.referenceNumber;
    VoucherObj.RecevierTxt =
      this.ReceiptVoucherForm.controls['recipientName'].value;
    // VoucherObj.PayType = this.ReceiptVoucherForm.controls["paymenttype"].value;
    VoucherObj.PayType = this.paymenttype;
    VoucherObj.StoreId = 1;

    if (this.CustCheckPage == 'withCustomer') {
      // VoucherObj.CustomerId = this.ReceiptVoucherForm.controls["ClientId"].value;
      VoucherObj.CustomerId = this.ClientId.toString();
    }
    var VoucherDetailsObj: any = {};
    VoucherDetailsObj.LineNumber = 1;
    VoucherDetailsObj.TaxType = 0;
    VoucherDetailsObj.TaxAmount = null;
    VoucherDetailsObj.AccountId =
      this.ReceiptVoucherForm.controls['toAccount'].value;
    VoucherDetailsObj.Amount =
      this.ReceiptVoucherForm.controls['AmountOf'].value;
    VoucherDetailsObj.TotalAmount =
      this.ReceiptVoucherForm.controls['AmountOf'].value;
    // VoucherDetailsObj.PayType = this.ReceiptVoucherForm.controls["paymenttype"].value;
    VoucherDetailsObj.PayType = this.paymenttype;
    VoucherDetailsObj.ToAccountId =
      this.ReceiptVoucherForm.controls['fromAccount'].value;
    VoucherDetailsObj.CostCenterId =
      this.ReceiptVoucherForm.controls['costCentersId'].value;
    VoucherDetailsObj.Description =
      this.ReceiptVoucherForm.controls['AndThatFor'].value;
    VoucherDetailsObj.ReferenceNumber = this.referenceNumber;
    if (this.checkdetailsList.length == 1) {
      var payType = this.checkdetailsList[0].checkdetailpaytype;
      if (payType == 'شيك') {
        VoucherDetailsObj.CheckNo =
          this.checkdetailsList[0].checkdetailcheckNo?.toString();
        VoucherDetailsObj.CheckDate =
          this.checkdetailsList[0].checkdetailcheckDate;
        VoucherDetailsObj.BankId = this.checkdetailsList[0].checkdetailbankId;
      } else if (payType == 'حوالة') {
        VoucherDetailsObj.MoneyOrderNo =
          this.checkdetailsList[0].checkdetailcheckNo?.toString();
        VoucherDetailsObj.MoneyOrderDate =
          this.checkdetailsList[0].checkdetailcheckDate;
        VoucherDetailsObj.BankId = this.checkdetailsList[0].checkdetailbankId;
      } else if (payType == 'نقاط بيع') {
        VoucherDetailsObj.MoneyOrderNo =
          this.checkdetailsList[0].checkdetailcheckNo?.toString();
        VoucherDetailsObj.MoneyOrderDate =
          this.checkdetailsList[0].checkdetailcheckDate;
        VoucherDetailsObj.BankId = this.checkdetailsList[0].checkdetailbankId;
      }
    }
    VoucherDetailsList.push(VoucherDetailsObj);
    VoucherObj.VoucherDetails = VoucherDetailsList;
    this.disableButtonSave_Voucher = true;
    setTimeout(() => {
      this.disableButtonSave_Voucher = false;
    }, 15000);
    this.receiptService.SaveVoucher(VoucherObj).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          debugger;
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
          this.UpdateStoreid(this.InvoiceReVoucherPublic);
          modal.dismiss();
          this.ShowAllVoucher();
          this.submitted == false;
        } else {
          this.submitted == false;
          this.toast.error(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
          if (
            this.ReceiptVoucherForm.controls['dateM'].value == null &&
            typeof this.ReceiptVoucherForm.controls['dateM'].value == 'string'
          ) {
            this.ReceiptVoucherForm.controls['dateM'].setValue(
              new Date(this.ReceiptVoucherForm.controls['dateM'].value)
            );
          }
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

  selectedRowIndex = -1;
  highlight(row: any) {
    this.selectedRowIndex = row.invoiceId;
  }
  PrintJournalsVyInvIdRetPurchase() {
    if (this.AllJournalEntries.length > 0) {
      this.print.print('reportaccountingentryModal', environment.printConfig);
    }
  }

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

    // console.log(this.serviceDetails_Invoice);
    // console.log(this.ListDataServices_Invoice);
  }

  //#endregion

  //------------------------------------------------------------------
  DeleteVoucher(modal: any) {
    this._invoiceService.DeleteVoucher(this.voucheriddeleted).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.toast.success(this.translate.instant(data.reasonPhrase),this.translate.instant('Message'));
          modal.dismiss();
          this.ShowAllVoucher();
        } else {
          this.toast.error( this.translate.instant(data.reasonPhrase), this.translate.instant('Message'));
        }
      }
    );
  }
  //-------------------------------------------------------------------
  SendWInvoice(element:any,modal:any) {
    console.log(element);
    const formData = new FormData();
    if (element.files.length > 0) {
      formData.append('fileTypeUpload', "1");
    }
    else
    {
      formData.append('fileTypeUpload', "2");
    }

    if (this.RowInvoiceData.customerMobile=="" || this.RowInvoiceData.customerMobile==null) {
      this.toast.error("تأكد من رقم العميل", this.translate.instant('Message'));
      return;
    }
    else{
      formData.append('UploadedFile', element.files[0]);
      formData.append('InvoiceId', this.RowInvoiceData.invoiceId);
      formData.append('Notes', element.WhatsAppText);
      formData.append('environmentURL', environment.PhotoURL);

      this._invoiceService
        .SendWInvoice(formData)
        .subscribe((result: any) => {
          if (result.statusCode == 200) {
            this.control.clear();
            modal?.dismiss();
            this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          } else {
            this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant('Message'));
          }
        });
    }
  }
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
