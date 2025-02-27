import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  TemplateRef,
  ElementRef,
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
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/core/services/shared.service';
import { PrintreportsService } from 'src/app/core/services/acc_Services/printreports.service';
import { NgxPrintElementService } from 'ngx-print-element';
import { VoucherFilterVM } from 'src/app/core/Classes/ViewModels/voucherFilterVM';
import { PurchasesBillService } from 'src/app/core/services/acc_Services/purchasesBill.service';
import { DateType } from 'ngx-hijri-gregorian-datepicker';

import { environment } from 'src/environments/environment';
import 'hijri-date';
import { InvoiceService } from 'src/app/core/services/acc_Services/invoice.service';
import { Invoices } from 'src/app/core/Classes/DomainObjects/invoices';
import { RestApiService } from 'src/app/shared/services/api.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { PayVoucherService } from 'src/app/core/services/acc_Services/pay-voucher.service';
import { ReceiptService } from 'src/app/core/services/acc_Services/receipt.service';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { VoucherDetails } from 'src/app/core/Classes/DomainObjects/voucherDetails';
import { DatePipe } from '@angular/common';
import { Acc_Clauses } from 'src/app/core/Classes/DomainObjects/acc_Clauses';
import { Acc_Suppliers } from 'src/app/core/Classes/DomainObjects/acc_Suppliers';
import { DebentureService } from 'src/app/core/services/acc_Services/debenture.service';
const hijriSafe = require('hijri-date/lib/safe');
const HijriDate = hijriSafe.default;
const toHijri = hijriSafe.toHijri;

@Component({
  selector: 'app-purchases-bill',
  templateUrl: './purchases-bill.component.html',
  styleUrls: ['./purchases-bill.component.scss'],
  providers: [DatePipe],
})
export class PurchasesBillComponent implements OnInit {
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
      ar: ' فاتورة مشتريات ',
      en: 'Purchases bill',
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
    'select',
    'invoiceNumber',
    'date',
    'totalValue',
    'PaymentType',
    'InvoiceStatus',
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
    InvoiceNumber: null,
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

  projectUsers: any = [];

  projectTasks: any = [];

  startDate = new Date();
  endDate = new Date();

  suppliers: any = [];

  Items: any = [];

  categoryTypes: any = [];

  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );
  InvoicessDataSource = new MatTableDataSource();
  userG: any = {};
  constructor(
    private modalService: NgbModal,
    private print: NgxPrintElementService,
    private _printreportsService: PrintreportsService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private purchasesBillService: PurchasesBillService,
    private _accountsreportsService: AccountsreportsService,
    private _invoiceService: InvoiceService,
    private _debentureService: DebentureService,
    private api: RestApiService,
    private receiptService: ReceiptService,
    private _payvoucherservice: PayVoucherService,
    private datePipe: DatePipe,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder
  ) {
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();
    this.GetBranchByBranchIdCheck();
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
  lang: any = 'ar';
  OrganizationData: any;
  environmentPho: any;
  dateprint: any;
  invoicetype: any = [];
  ngOnInit(): void {
    this.LoadData();
    this.FillSuppliersSelect();
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
  }
  //--------------------------------------Search---------------------------------
  //#region
  dataInvoice: any = {
    filter: {
      enable: false,
      date: null,
      search_InvoiceNumber: null,
      search_SupplierName: null,
      search_projectId: null,
      search_invoicetype: null,
      DateFrom_P: null,
      DateTo_P: null,
      isChecked: false,
      Type: 1,
      AllInvoice: false,
      InvoiceRet: false,
      ContractInvoice: false,
    },
  };

  load_Suppliers: any = [];
  FillSuppliersSelect() {
    this.purchasesBillService.FillSuppliersSelect().subscribe((data) => {
      this.load_Suppliers = data;
    });
  }
  InvoicessDataSourceTemp: any = [];
  LoadData() {
    var _voucherFilterVM = new VoucherFilterVM();
    _voucherFilterVM.type = this.dataInvoice.filter.Type;
    var obj = _voucherFilterVM;
    this.purchasesBillService.GetAllVouchersPurchase(obj).subscribe((data) => {
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
    this.purchasesBillService
      .GetAllVouchersRetSearchPurchase(obj)
      .subscribe((data) => {
        this.InvoicessDataSource = new MatTableDataSource(data);
        this.InvoicessDataSourceTemp = data;
        this.InvoicessDataSource.paginator = this.paginator;
        this.InvoicessDataSource.sort = this.sort;
      });
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

  RefreshData() {
    var _voucherFilterVM = new VoucherFilterVM();
    _voucherFilterVM.type = this.dataInvoice.filter.Type;
    _voucherFilterVM.voucherNo = this.dataInvoice.filter.search_InvoiceNumber;
    _voucherFilterVM.isSearch = true;
    _voucherFilterVM.supplierId = this.dataInvoice.filter.search_SupplierName;
    _voucherFilterVM.isPost = this.dataInvoice.filter.search_invoicetype;
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
    this.purchasesBillService.GetAllVouchersPurchase(obj).subscribe((data) => {
      this.InvoicessDataSource = new MatTableDataSource(data);
      this.InvoicessDataSourceTemp = data;
      this.InvoicessDataSource.paginator = this.paginator;
      this.InvoicessDataSource.sort = this.sort;
    });
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
      this.dataInvoice.filter.date = null;
      this.dataInvoice.filter.DateTo_P = null;
      this.RefreshData();
    }
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

  getColorStatus(element: any) {
    if (element?.isPost == true && element?.rad != 1) {
      return '#30b550';
    } else if (element?.isPost != true && element?.rad != 1) {
      return '#c51313';
    } else {
      return '#000000';
    }
  }

  //--------------------------
  NotiData: any = {
    invoiceid: null,
  };
  LoadInvoiceNumbers: any = [];
  FillAllNotiPurchaseVoucher() {
    var _voucherFilterVM = new VoucherFilterVM();
    _voucherFilterVM.type = this.dataInvoice.filter.Type;
    var obj = _voucherFilterVM;
    this.purchasesBillService
      .FillAllNotiPurchaseVoucher(obj)
      .subscribe((data) => {
        this.LoadInvoiceNumbers = data;
      });
  }

  resetNotiPopup() {
    this.NotiData = {
      invoiceid: null,
    };
    this.FillAllNotiPurchaseVoucher();
  }
  ReturnNotiDepitBack(modal: any) {
    if (this.NotiData.invoiceid == null) {
      this.toast.error('من فضلك أختر فاتورة أولا', this.translate.instant("Message"));
      return;
    }
    var VoucherObj: any = {};
    VoucherObj.InvoiceId = this.NotiData.invoiceid;
    this.purchasesBillService
      .ReturnNotiDepitBack(VoucherObj)
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
      this.purchasesBillService
        .PostVouchersCheckBox(this.InvoicesIds)
        .subscribe((result: any) => {
          if (result?.body?.statusCode == 200) {
            this.toast.success(result?.body?.reasonPhrase, this.translate.instant("Message"));
            this.ShowAllVoucher();
            this.selection.clear();
          } else if (result?.type == 0) {
          } else {
            this.toast.error(result?.body?.reasonPhrase, this.translate.instant("Message"));
          }
        });
    } else {
      this.toast.error('من فضلك اختر فاتورة علي الأقل', this.translate.instant("Message"));
    }
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

  ngAfterViewInit() {
    // this.open(this.smartModal, null, 'smartModal');
  }
  InvoiceModelPublic:any;
  Purchasepopuptype: boolean = true;
  open(content: any, data?: any, type?: any, idRow?: any, status?: any,model?:any) {
    this.Purchasepopuptype = true;
    if (data && type == 'edit') {
      this.modalDetails = data;
      this.modalDetails['id'] = 1;
    }
    if (idRow != null) {
      this.selectedServiceRow = idRow;
    }
    if (data) {
      this.RowInvoiceData = data;
    }
    if(type=='SaveInvoiceConfirmModal')
    {
      this.InvoiceModelPublic=model;
    }
    if (type == 'AddItem') {
      this.FilltAllCategoryType();
      this.GetAllCategoryType();
      this.FillSubAccountLoad();
      //this.GetAllCategory();
      this.GetAllServicesPrice();
      this.nAmeAr = null;
      this.nAmeEn = null;
      this.AccountId = null;
      this.CategorTypeId = null;
      this.Note = null;
      this.Price = null;
      this.categoryId = '0';
    }
    if (type == 'AddOption') {
      this.FillCitySelect();
      this.GetAllSuppliers();
      this.FillSuppliersSelect();
      this.buildingNumber = null;
      this.cityId = null;
      this.compAddress = null;
      this.country = 'المملكة العربية السعودية';
      this.externalPhone = null;
      this.nameAr = null;
      this.nameEn = null;
      this.neighborhood = null;
      this.phoneNo = null;
      this.postalCodeFinal = null;
      this.streetName = null;
      this.taxNo = null;
      this.supplierId = '0';
    }
    if (type == 'ItemTypeModal') {
      this.FilltAllCategoryType();
      this.GetAllCategoryType();
      this.CategoryNameAr = null;
      this.CategoryNameEn = null;
      this.categorTypeId = '0';
    } else if (type == 'deleteCategoryType') {
      this.DeleteCategoryId = data.categorTypeId;
    } else if (type == 'deleteCategory') {
      this.DeleteCatId = data.categoryId;
    } else if (type == 'deletesupplier') {
      this.Deletesupplier = data.supplierId;
    } else if (type == 'NoticeCreditorModal') {
      this.resetNotiPopup();
    } else if (type == 'postModal') {
      this.WhichPost = 1;
    } else if (type == 'postModalCheckbox') {
      this.WhichPost = 2;
    } else if (type == 'addInvoice') {
      this.InvoicePopup();
    } else if (type == 'InvoiceView') {
      this.resetInvoiceData();
      this.InvoiceView(data);
    } else if (type == 'InvCredit') {
      this.Purchasepopuptype = false;
      if (this.NotiData.invoiceid == null) {
        this.toast.error('من فضلك أختر فاتورة أولا', this.translate.instant("Message"));
        return;
      }
      this.resetInvoiceData();
      this.InvCreditView(this.NotiData.invoiceid);
    }

    if (type == 'servicesList') {
      //this.GetAllCategory();
      this.GetAllServicesPrice();
    }
    if (type == 'accountingentry') {
      this.GetAllJournalsByInvIDPurchase(data.invoiceId);
    } else if (type == 'clause') {
      this.GetAllClauses();
    } else if (type == 'deleteclase') {
      this.clausedeleted = data.clauseId;
    } else if (type == 'editvoucher') {
      this.FillCustAccountsSelect2R(1);
      this.CheckDetailsIntial();

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
    this.modalService

      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
        centered: type=='SaveInvoiceConfirmModal'?true: type? false : true,
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
  //---------------------------------------Invoice---------------------------------------------
  //#region
  selectedDateType = DateType.Hijri;
  modalInvoice: any = {
    InvoiceId: 0,
    InvoiceNumber: null,
    JournalNumber: null,
    InvoicePayType: null,
    Date: new Date(),
    HijriDate: null,
    Notes: null,
    InvoiceNotes: null,
    Type: 1,
    InvoiceValue: 0,
    TotalValue: 0,
    TaxAmount: 0,
    ToAccountId: null,
    ProjectId: null,
    PayType: 1,
    DiscountPercentage: 0,
    DiscountValue: 0,
    R_D_Supplier: null,
    customerId: null,
    supplierId: null,
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
  resetInvoiceData() {
    this.Paytype = [
      { id: 1, name: { ar: 'نقدي', en: 'Monetary' } },
      { id: 8, name: { ar: 'آجل', en: 'Postpaid' } },
      {
        id: 17,
        name: { ar: 'نقدا نقاط بيع - مدى-ATM', en: 'Cash points of sale ATM' },
      },
      { id: 9, name: { ar: 'شبكة', en: 'Network' } },
      { id: 6, name: { ar: 'حوالة', en: 'Transfer' } },
      { id: 15, name: { ar: 'عهد موظفين', en: 'Era of employees' } },
      { id: 16, name: { ar: 'جاري المالك', en: 'My neighbor is the owner' } },
    ];

    this.InvoiceDetailsRows = [];
    this.load_CostCenter = [];
    this.load_Accounts = [];
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
      Type: 1,
      InvoiceValue: 0,
      TotalValue: 0,
      TaxAmount: 0,
      ToAccountId: null,
      ProjectId: null,
      PayType: 1,
      DiscountPercentage: 0,
      DiscountValue: 0,
      supplierId: null,
      R_D_Supplier: null,
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

  setAddress_Inv() {
    this.modalInvoice.OrganizationsAddress = 'المركز الرئيسي';
  }

  InvoicePopup() {
    this.setAddress_Inv();
    this.FillCostCenterSelect();
    this.FillSuppliersSelect();
    this.GetBranch_Costcenter();
    this.FillStorehouseSelect();
    this.resetInvoiceData();
    this.modalInvoice.popuptype = 2;
    this.GetBranchOrganization();
    this.GenerateVoucherNumber();

    this.FillCustAccountsSelect2AndUpdate(this.modalInvoice.PayType);
  }

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

  load_CostCenter: any;
  FillCostCenterSelect() {
    this._invoiceService.FillCostCenterSelect().subscribe((data) => {
      this.load_CostCenter = data;
    });
    this._invoiceService.GetBranch_Costcenter().subscribe((data) => {
      this.modalInvoice.OrganizationsAddress = data.result.nameAr;
    });
  }
  FillCostCenterSelect_Invoices(projectid: any) {
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
  GetBranch_Costcenter() {
    this._invoiceService.GetBranch_Costcenter().subscribe((data) => {
      this.modalInvoice.OrganizationsAddress = data.result.nameAr;
      this.modalInvoice.CostCenterId = data.result.costCenterId;
    });
  }
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

  GetCostCenterByProId_Proj(projectid: any) {
    if (projectid) {
      this._invoiceService.GetCostCenterByProId(projectid).subscribe((data) => {
        this.modalInvoice.CostCenterId = data.result.costCenterId;
      });
    } else {
      this.modalInvoice.CostCenterId = null;
    }
  }

  PayTypeChange() {
    this.modalInvoice.ToAccountId = null;

    if (this.modalInvoice.PayType == 8) {
      this.FillSuppAccountsSelect(this.modalInvoice.PayType);
      this.GetAccIdBySuppId(this.modalInvoice.supplierId);
      this.CalculateTotal2(1);
    } else if (this.modalInvoice.PayType == 1) {
      this.FillCustAccountsSelect2AndUpdate(this.modalInvoice.PayType);
    } else if (this.modalInvoice.PayType == 17) {
      this.FillCustAccountsSelect2AndUpdate(this.modalInvoice.PayType);
    } else {
      this.FillCustAccountsSelect2(this.modalInvoice.PayType);
    }
  }
  FillSuppAccountsSelect(PayType: any) {
    this.purchasesBillService
      .FillSuppAccountsSelect(PayType)
      .subscribe((data) => {
        this.load_Accounts = data.result;
      });
  }


  GetTaxNoBySuppId() {
    if (this.modalInvoice.supplierId != null) {
      this.purchasesBillService
        .GetTaxNoBySuppId(this.modalInvoice.supplierId)
        .subscribe((data) => {
          this.modalInvoice.R_D_Supplier = data;
          if (this.modalInvoice.PayType == 8) {
            this.modalInvoice.ToAccountId = data.result.accountId;
          }
        });
    } else {
      this.modalInvoice.R_D_Supplier = null;
    }
  }
  GetAccIdBySuppId(supplierId: any) {
    this.purchasesBillService.GetAccIdBySuppId(supplierId).subscribe((data) => {
      this.modalInvoice.ToAccountId = data;
    });
  }
  GetSuppIdByAccId() {
    if (this.modalInvoice.ToAccountId != null) {
      if (this.modalInvoice.PayType == 8) {
        this.purchasesBillService
          .GetSuppIdByAccId(this.modalInvoice.ToAccountId)
          .subscribe((data) => {
            this.modalInvoice.supplierId = data;
          });
      }
    }
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
    var vAT_TaxVal = 15;
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
  GetAllCategory() {
    this.purchasesBillService.GetAllCategory().subscribe((data) => {
      this.serviceListDataSource = new MatTableDataSource(data.result);
      this.serviceListDataSource.paginator = this.paginatorServices;

      this.servicesList = data.result;
      this.serviceListDataSourceTemp = data.result;
    });
  }
  GetAllServicesPrice() {
    this._invoiceService.GetAllServicesPrice().subscribe((data) => {
      this.serviceListDataSource = new MatTableDataSource(data.result);
      this.serviceListDataSource.paginator = this.paginatorServices;

      this.servicesList = data.result;
      this.serviceListDataSourceTemp = data.result;
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

  // setServiceRowValue(element: any) {
  //   this.InvoiceDetailsRows.filter(
  //     (a: { idRow: any }) => a.idRow == this.selectedServiceRow
  //   )[0].AccJournalid = element.categoryId;
  //   this.InvoiceDetailsRows.filter(
  //     (a: { idRow: any }) => a.idRow == this.selectedServiceRow
  //   )[0].UnitConst = element.categorTypeName;
  //   this.InvoiceDetailsRows.filter(
  //     (a: { idRow: any }) => a.idRow == this.selectedServiceRow
  //   )[0].QtyConst = 1;
  //   this.InvoiceDetailsRows.filter(
  //     (a: { idRow: any }) => a.idRow == this.selectedServiceRow
  //   )[0].accountJournaltxt =
  //     this.lang == 'ar' ? element.nAmeAr : element.nAmeEn;
  //   this.InvoiceDetailsRows.filter(
  //     (a: { idRow: any }) => a.idRow == this.selectedServiceRow
  //   )[0].Amounttxt = element.price;
  //   this.CalculateTotal2(1);
  //   this.addInvoiceRow();
  // }

  // setServiceRowValueNew(indexRow: any, item: any, Qty: any, servamount: any) {
  //   this.addInvoiceRow();
  //   this.InvoiceDetailsRows.filter(
  //     (a: { idRow: any }) => a.idRow == indexRow
  //   )[0].AccJournalid = item.categoryId;
  //   this.InvoiceDetailsRows.filter(
  //     (a: { idRow: any }) => a.idRow == indexRow
  //   )[0].UnitConst = item.categorTypeName;
  //   this.InvoiceDetailsRows.filter(
  //     (a: { idRow: any }) => a.idRow == indexRow
  //   )[0].QtyConst = Qty;
  //   this.InvoiceDetailsRows.filter(
  //     (a: { idRow: any }) => a.idRow == indexRow
  //   )[0].accountJournaltxt = item.name;
  //   this.InvoiceDetailsRows.filter(
  //     (a: { idRow: any }) => a.idRow == indexRow
  //   )[0].Amounttxt = servamount;
  //   this.CalculateTotal(1);
  // }

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


  FillCustAccountsSelect2_Save(PayType: any, modal: any) {
    if (PayType) {
      this._invoiceService
        .FillCustAccountsSelect2(PayType)
        .subscribe((data) => {
          this.load_Accounts = data;
          this.purchasesBillService
            .GetAccIdBySuppId(this.modalInvoice.supplierId)
            .subscribe((data) => {
              this.modalInvoice.ToAccountId = data;
            });
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
              this.toast.error('تأكد من الحساب', this.translate.instant("Message"));
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
      this.toast.error(val.msg, this.translate.instant("Message"));
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
        this.FillSuppAccountsSelect_Save(8);
      } else {
        this.saveInvoice();
      }
    } else {
      this.saveInvoice();
    }
  }
  FillSuppAccountsSelect_Save(PayType: any) {
    if (PayType) {
      this.purchasesBillService
        .FillSuppAccountsSelect(PayType)
        .subscribe((data) => {
          this.load_Accounts = data.result;
          this.purchasesBillService
            .GetAccIdBySuppId(this.modalInvoice.supplierId)
            .subscribe((data) => {
              this.modalInvoice.ToAccountId = data;
              this.saveInvoice();
            });
        });
    } else {
      this.load_Accounts = [];
    }
  }
  ValidateObjMsgInvoice: any = { status: true, msg: null };
  validateInvoiceForm() {
    this.ValidateObjMsgInvoice = { status: true, msg: null };

    if (this.InvoiceDetailsRows.length == 0) {
      this.ValidateObjMsgInvoice = { status: false, msg: 'من فضلك اختر خدمة' };
      return this.ValidateObjMsgInvoice;
    }

    this.ValidateObjMsgInvoice = { status: true, msg: null };
    return this.ValidateObjMsgInvoice;
  }
  disableButtonSave_Invoice = false;
  saveInvoice() {
    if (!(parseInt(this.modalInvoice.TotalVoucherValueLbl) > 0)) {
      this.toast.error('من فضلك أدخل قيمة صحيحة للفاتورة', this.translate.instant("Message"));
      return;
    }
    if (this.modalInvoice.WhichClick == 3) {
      if (
        parseFloat(this.modalInvoice.TotalVoucherValueLbl) >
        parseFloat(this.modalInvoice.GlobalTotalFatora)
      ) {
        this.toast.error(
          'لا يمكن ان يكون مبلغ الإشعار أكبر من صافي الفاتورة',
          this.translate.instant("Message")
        );
        return;
      }
    }
    var VoucherDetailsList: any = [];
    var VoucherObj: any = {};
    VoucherObj.InvoiceId = this.modalInvoice.InvoiceId;
    VoucherObj.InvoiceNumber = this.modalInvoice.InvoiceNumber;
    VoucherObj.JournalNumber = this.modalInvoice.JournalNumber;
    VoucherObj.InvoicePayType = this.modalInvoice.PayType;
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
    VoucherObj.PayType = this.modalInvoice.PayType;
    VoucherObj.DiscountPercentage = this.modalInvoice.DiscountPercentage;
    VoucherObj.DiscountValue = this.modalInvoice.DiscountValue;
    VoucherObj.supplierId = this.modalInvoice.supplierId;
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
      // VoucherDetailsObj.CategoryId = element.AccJournalid;
      
      VoucherDetailsObj.ServicesPriceId = element.AccJournalid;

      // VoucherDetailsObj.AccountId =this.modalInvoice.WhichClick == 3? this.modalInvoice.ToAccountId: this.modalInvoice.TempBox;
      VoucherDetailsObj.AccountId = this.modalInvoice.TempBox;
      VoucherDetailsObj.Amount = element.Amounttxt;
      VoucherDetailsObj.Qty = element.QtyConst;
      VoucherDetailsObj.TaxType = this.modalInvoice.taxtype;
      VoucherDetailsObj.TaxAmount = element.taxAmounttxt;
      VoucherDetailsObj.TotalAmount = element.TotalAmounttxt;
      VoucherDetailsObj.InvoiceId = this.modalInvoice.InvoiceId;

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

    VoucherObj.VoucherDetails = VoucherDetailsList;
    VoucherObj.ToAccountId = this.modalInvoice.ToAccountId;
    VoucherObj.PayType = this.modalInvoice.PayType;

    this.disableButtonSave_Invoice = true;
    setTimeout(() => {
      this.disableButtonSave_Invoice = false;
    }, 15000);

    if (this.modalInvoice.WhichClick == 1) {
      this.purchasesBillService.SavePurchaseForServices(VoucherObj).subscribe(
        (result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            this.resetInvoiceData();
            this.ShowAllVoucher();
            this.InvoiceModelPublic?.dismiss();
            if (this.uploadedFiles.length > 0) {
              this.savefile(result.returnedParm);
            }
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
    } else if (this.modalInvoice.WhichClick == 2) {
      this.purchasesBillService
        .SaveandPostPurchaseForServices(VoucherObj)
        .subscribe(
          (result: any) => {
            if (result.statusCode == 200) {
              this.toast.success(
                this.translate.instant(result.reasonPhrase),
                this.translate.instant('Message')
              );
              this.resetInvoiceData();
              this.ShowAllVoucher();
              this.InvoiceModelPublic?.dismiss();
              if (this.uploadedFiles.length > 0) {
                this.savefile(result.returnedParm);
              }
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
    } else if (this.modalInvoice.WhichClick == 3) {
      this.purchasesBillService
        .SavePurchaseForServicesNotiDepit(VoucherObj)
        .subscribe(
          (result: any) => {
            if (result.statusCode == 200) {
              this.toast.success(
                this.translate.instant(result.reasonPhrase),
                this.translate.instant('Message')
              );
              this.resetInvoiceData();
              this.ShowAllVoucher();
              this.InvoiceModelPublic?.dismiss();
              if (this.uploadedFiles.length > 0) {
                this.savefile(result.returnedParm);
              }
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
  }

  selectedFiles?: FileList;
  currentFile?: File;
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }
  public uploadedFiles: Array<File> = [];
  savefile(id: any) {
    const formData = new FormData();
    formData.append('UploadedFile', this.uploadedFiles[0]);
    formData.append('InvoiceId', id);
    this.purchasesBillService
      .UploadPayVoucherImage(formData)
      .subscribe((data) => {
        this.ShowAllVoucher();
      });
  }

  downloadFile(data: any) {
    try {
      var link = environment.PhotoURL + data.fileUrl;
      window.open(link, '_blank');
    } catch (error) {
      this.toast.error('تأكد من الملف', this.translate.instant("Message"));
    }
  }

  ConvertNumToString(val: any) {
    this._sharedService.ConvertNumToString(val).subscribe((data) => {
      
      //this.modalDetails.total_amount_text=data?.reasonPhrase;
    });
  }
  //#endregion
  //------------------------------------(End) Invoice-------------------------------------------

  AllJournalEntries: any = [];
  GetAllJournalsByInvIDPurchase(invid: any) {
    this._invoiceService
      .GetAllJournalsByInvIDPurchase(invid)
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
  datePrintJournals: any = new Date();
  PrintJournalsVyInvIdRetPurchase() {
    if (this.AllJournalEntries[0].invoiceId) {
      this.purchasesBillService
        .PrintJournalsVyInvIdRetPurchase(this.AllJournalEntries[0].invoiceId)
        .subscribe((data) => {
          this.print.print(
            'reportaccountingentryModal',
            environment.printConfig
          );
        });
    }
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

  //-----------------------------------invoice btn---------------------------------------------
  //#region

  InvoiceView(data: any) {
    this.setAddress_Inv();
    this.FillSuppliersSelect();
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

    this.FillSuppAccountsSelect(data.payType);

    var popuptype = 2;
    this.FillCostCenterSelect();

    this.GetAccIdBySuppId(data.supplierId);

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
      debugger
      this.InvoiceDetailsRows?.push({
        idRow: maxVal + 1,
        // AccJournalid: item.categoryId,
        AccJournalid: item.servicesPriceId,
        // UnitConst: item.categoryTypeName,
        UnitConst: item.serviceTypeName,
        QtyConst: item.qty,
        DiscountValueConst: item.discountValue_Det,
        DiscountPercentageConst: item.discountPercentage_Det,
        // accountJournaltxt: item.categoryName,
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
      Type: 1,
      InvoiceValue: 0,
      TotalValue: 0,
      TaxAmount: 0,
      ToAccountId: data.toAccountId,
      ProjectId: data.projectId,
      PayType: data.payType,
      DiscountPercentage: 0,
      DiscountValue: 0,
      customerId: data.customerId,
      supplierId: data.supplierId,
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
      +parseFloat(Total.toString()).toFixed(2) -
      +parseFloat(data.depitNotiTotal.toString()).toFixed(2);
    CalcAll = +parseFloat(
      (
        +parseFloat(CalcAll.toString()).toFixed(2) +
        parseFloat(data.creditNotiTotal ?? 0)
      ).toString()
    ).toFixed(2);
    this.modalInvoice.TotalVoucherValueLbl = CalcAll;
    this.checkRemainder();
  }

  InvCreditView(InvoiceIdV: any) {
    this.setAddress_Inv();
    this.FillSuppliersSelect();

    this.purchasesBillService
      .GetVouchersSearchInvoicePurchaseByID(InvoiceIdV)
      .subscribe((data) => {
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

        this.FillSuppAccountsSelect(data.payType);

        var popuptype = 1;
        popuptype = 2;
        this.FillCostCenterSelect();

        if (data.payType == 8) {
          this.GetAccIdBySuppId(data.supplierId);
        } else if (data.payType == 1) {
          this.FillCustAccountsSelect2AndUpdate(data.payType);
        } else if (data.payType == 17) {
          this.FillCustAccountsSelect2AndUpdate(data.payType);
        } else {
          this.FillCustAccountsSelect2(data.payType);
        }

        //this.GetAccIdBySuppId(data.supplierId);

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
            // AccJournalid: item.categoryId,
            AccJournalid: item.servicesPriceId,
            // UnitConst: item.categoryTypeName,
            UnitConst: item.serviceTypeName,
            QtyConst: item.qty,
            DiscountValueConst: item.discountValue_Det,
            DiscountPercentageConst: item.discountPercentage_Det,
            // accountJournaltxt: item.categoryName,
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
          Type: 33,
          InvoiceValue: 0,
          TotalValue: 0,
          TaxAmount: 0,
          ToAccountId: data.toAccountId,
          ProjectId: data.projectId,
          PayType: data.payType,
          DiscountPercentage: 0,
          DiscountValue: 0,
          customerId: data.customerId,
          supplierId: data.supplierId,
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
          +parseFloat(Total.toString()).toFixed(2) -
          +parseFloat(data.depitNotiTotal.toString()).toFixed(2);
        // CalcAll = +parseFloat((+parseFloat(CalcAll.toString()).toFixed(2) - parseFloat(data.creditNotiTotal??0)).toString()).toFixed(2);
        this.modalInvoice.TotalVoucherValueLbl = CalcAll;
        this.modalInvoice.GlobalTotalFatora = CalcAll;
        this.checkRemainder();
        this.CalculateTotal2(1);
      });
  }

  //#endregion
  //---------------------------------(end)--invoice btn-----------------------------------------

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
    };
  }
  GetInvoicePrint(obj: any, TempCheck: any) {
    this.resetCustomData();
    this.purchasesBillService
      .ChangePurchase_PDF(obj.invoiceId, TempCheck)
      .subscribe((data) => {
        this.InvPrintData = data;
        this.CustomData.PrintType = TempCheck;
        if (TempCheck == 32) this.CustomData.PrintTypeName = 'اشعار دائن';
        else if (TempCheck == 33) this.CustomData.PrintTypeName = 'اشعار مدين';
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

  GetInvoicePrintDepit(obj: any, TempCheck: any) {
    this.resetCustomData();
    this.purchasesBillService
      .ChangeInvoice_PDFCreditPurchase(obj.invoiceId, TempCheck)
      .subscribe((data) => {
        this.InvPrintData = data;
        this.CustomData.PrintType = TempCheck;
        if (TempCheck == 32) this.CustomData.PrintTypeName = 'اشعار دائن';
        else if (TempCheck == 33) this.CustomData.PrintTypeName = 'اشعار مدين';
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

  //------------------------------------------------------------------------------
  categoryType: any;
  CategoryTypeList: any;
  FilltAllCategoryType() {
    this.purchasesBillService.FilltAllCategoryType().subscribe((data) => {
      this.CategoryTypeList = data;
    });
  }

  AllCategoryList: any;
  GetAllCategoryType() {
    this.purchasesBillService.GetAllCategoryType().subscribe(
      (data) => {
        this.AllCategoryList = data.result;
      },
      (error) => {}
    );
  }
  categorTypeId: any = '0';
  CategoryNameAr: any;
  CategoryNameEn: any;
  SaveCategoryType() {
    if (this.CategoryNameAr != null && this.CategoryNameEn != null) {
      const prames = {
        categorTypeId: this.categorTypeId,
        NameAr: this.CategoryNameAr,
        NameEn: this.CategoryNameEn,
      };
      this.purchasesBillService.SaveCategoryType(prames).subscribe(
        (data) => {
          this.CategoryNameAr = null;
          this.CategoryNameEn = null;
          this.categorTypeId = '0';
          this.FilltAllCategoryType();
          this.GetAllCategoryType();
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
  updateCategory(Category: any) {
    this.categorTypeId = Category.categorTypeId;
    this.CategoryNameAr = Category.nAmeAr;
    this.CategoryNameEn = Category.nAmeEn;
  }

  DeleteCategoryId: any;
  DeleteCategorytype(modal: any) {
    this.purchasesBillService
      .DeleteCategoryType(this.DeleteCategoryId)
      .subscribe(
        (data) => {
          if (data.statusCode == 200) {
            this.toast.success(
              this.translate.instant(data.reasonPhrase),
              this.translate.instant('Message')
            );
            this.FilltAllCategoryType();
            this.GetAllCategoryType();
            this.DeleteCategoryId = null;
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
  FillSubAccountList: any;
  FillSubAccountLoad() {
    this.purchasesBillService.FillSubAccountLoad().subscribe((data) => {
      this.FillSubAccountList = data.result;
    });
  }

  categoryId: any = '0';
  nAmeAr: any;
  nAmeEn: any;
  AccountId: any;
  CategorTypeId: any;
  Note: any;
  Price: any;
  SaveCategory() {
    if (this.nAmeAr != null && this.nAmeEn != null) {
      const prames = {
        categoryId: this.categoryId,
        NameAr: this.nAmeAr,
        NameEn: this.nAmeEn,
        AccountId: this.AccountId,
        CategorTypeId: this.CategorTypeId,
        Note: this.Note,
        Price: this.Price,
      };
      this.purchasesBillService.SaveCategory(prames).subscribe(
        (data) => {
          this.nAmeAr = null;
          this.nAmeEn = null;
          this.AccountId = null;
          this.CategorTypeId = null;
          this.Note = null;
          this.Price = null;
          this.categoryId = '0';
          this.FilltAllCategoryType();
          this.FillSubAccountLoad();
          this.GetAllCategoryType();
          this.GetAllCategory();
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
  updateCategories(Category: any) {
    this.categoryId = Category.categoryId;
    this.nAmeAr = Category.nAmeAr;
    this.nAmeEn = Category.nAmeEn;
    this.AccountId = Category.accountId;
    this.CategorTypeId = Category.categorTypeId;
    this.Note = Category.note;
    this.Price = Category.price;
  }

  DeleteCatId: any;
  DeleteCategory(modal: any) {
    this.purchasesBillService.DeleteCategory(this.DeleteCatId).subscribe(
      (data) => {
        this.nAmeAr = null;
        this.nAmeEn = null;
        this.AccountId = null;
        this.CategorTypeId = null;
        this.Note = null;
        this.Price = null;
        this.categoryId = '0';
        if (data.statusCode == 200) {
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
          this.FilltAllCategoryType();
          this.FillSubAccountLoad();
          this.GetAllCategoryType();
          this.GetAllCategory();
          this.DeleteCatId = null;
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

  FillCityList: any;
  FillCitySelect() {
    this.purchasesBillService.FillCitySelect().subscribe((data) => {
      this.FillCityList = data;
    });
  }
  SuppliersList: any;
  GetAllSuppliers() {
    this.purchasesBillService.GetAllSuppliers().subscribe((data) => {
      this.SuppliersList = data;
    });
  }

  buildingNumber: any;
  cityId: any;
  compAddress: any;
  country: any = 'المملكة العربية السعودية';
  externalPhone: any;
  nameAr: any;
  nameEn: any;
  neighborhood: any;
  phoneNo: any;
  postalCodeFinal: any;
  streetName: any;
  supplierId: any;
  taxNo: any;
  SaveSupplier() {
    let text = this.taxNo;
    let firstChar = text.charAt(0);
    let lastChar = text.charAt(text.length - 1);
    if (firstChar != '3' && lastChar != '3') {
      this.toast.error(
        this.translate.instant('يجب ان يبدأ الرقم الضريبي برقم 3 وينتهي برقم 3')
      );
      return;
    }
    if (this.taxNo.length != 15) {
      this.toast.error(
        this.translate.instant('يجب ان يكون الرقم الضريبي 15 رقم')
      );
      return;
    }
    if (this.nameAr==null || this.nameAr=='') {
      this.toast.error(this.translate.instant('من فضلك أكمل البيانات أدخل الاسم عربي'));
      return;
    }
    if (this.nameEn==null || this.nameEn=='') {
      this.toast.error(this.translate.instant('من فضلك أكمل البيانات أدخل الاسم انجليزي'));
      return;
    }
    if (this.compAddress==null || this.compAddress=='') {
      this.toast.error(this.translate.instant('من فضلك أكمل البيانات أدخل العنوان'));
      return;
    }
    if (this.postalCodeFinal==null || this.postalCodeFinal=='') {
      this.toast.error(this.translate.instant('من فضلك أكمل البيانات أدخل الرمز البريدي'));
      return;
    }

    if (this.externalPhone==null || this.externalPhone=='') {
      this.toast.error(this.translate.instant('من فضلك أكمل البيانات أدخل الرقم الإضافي'));
      return;
    }
    if (this.country==null || this.country=='') {
      this.toast.error(this.translate.instant('من فضلك أكمل البيانات أدخل البلد'));
      return;
    }
    if (this.neighborhood==null || this.neighborhood=='') {
      this.toast.error(this.translate.instant('من فضلك أكمل البيانات أدخل الحي'));
      return;
    }

    if (this.streetName==null || this.streetName=='') {
      this.toast.error(this.translate.instant('من فضلك أكمل البيانات أدخل اسم الشارع'));
      return;
    }
    if (this.buildingNumber==null || this.buildingNumber=='') {
      this.toast.error(this.translate.instant('من فضلك أكمل البيانات أدخل رقم المبني'));
      return;
    }

    if (this.cityId==null || this.cityId=='') {
      this.toast.error(this.translate.instant('من فضلك أكمل البيانات أدخل المنطقة'));
      return;
    }

    if (this.nameAr != null && this.nameEn != null) {
      const prames = {
        buildingNumber: this.buildingNumber,
        cityId: this.cityId,
        compAddress: this.compAddress,
        country: this.country,
        externalPhone: this.externalPhone,
        nameAr: this.nameAr,
        nameEn: this.nameEn,
        neighborhood: this.neighborhood,
        phoneNo: this.phoneNo.toString(),
        postalCodeFinal: this.postalCodeFinal,
        streetName: this.streetName,
        taxNo: this.taxNo,
        supplierId: this.supplierId,
      };
      this.purchasesBillService.SaveSupplier(prames).subscribe(
        (data) => {
          this.buildingNumber = null;
          this.cityId = null;
          this.compAddress = null;
          this.country = 'المملكة العربية السعودية';
          this.externalPhone = null;
          this.nameAr = null;
          this.nameEn = null;
          this.neighborhood = null;
          this.phoneNo = null;
          this.postalCodeFinal = null;
          this.streetName = null;
          this.taxNo = null;
          this.supplierId = '0';
          this.FillCitySelect();
          this.GetAllSuppliers();
          this.FillSuppliersSelect();
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
  updatesupplier(supplier: any) {
    this.buildingNumber = supplier.buildingNumber;
    this.cityId = supplier.cityId;
    this.compAddress = supplier.compAddress;
    this.country = supplier.country;
    this.externalPhone = supplier.externalPhone;
    this.nameAr = supplier.nameAr;
    this.nameEn = supplier.nameEn;
    this.neighborhood = supplier.neighborhood;
    this.phoneNo = supplier.phoneNo;
    this.postalCodeFinal = supplier.postalCodeFinal;
    this.streetName = supplier.streetName;
    this.taxNo = supplier.taxNo;
    this.supplierId = supplier.supplierId;
  }

  Deletesupplier: any;
  deletesupp(modal: any) {
    this.purchasesBillService.DeleteSupplier(this.Deletesupplier).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.buildingNumber = null;
          this.cityId = null;
          this.compAddress = null;
          this.country = 'المملكة العربية السعودية';
          this.externalPhone = null;
          this.nameAr = null;
          this.nameEn = null;
          this.neighborhood = null;
          this.phoneNo = null;
          this.postalCodeFinal = null;
          this.streetName = null;
          this.taxNo = null;
          this.supplierId = '0';
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
          this.FillCitySelect();
          this.GetAllSuppliers();
          this.FillSuppliersSelect();
          this.Deletesupplier = null;
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

  // ==========================================================

  searchClause: any = null;
  claselist: any;
  clausedeleted: any;
  clauseseleted: any = [];
  VoucherType: any = 5;

  Clausemodel: any = {
    id: null,
    nameAr: null,
    nameEn: null,
  };
  GetAllVouchersList: any;
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
  FillClausesSelect() {
    this._payvoucherservice.FillClausesSelect().subscribe(
      (data) => {
        this.clauseseleted = data;
        console.log(this.clauseseleted);
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

  @ViewChild('EditCheckDetailsModal') EditCheckDetailsModal: any;
  CheckDetailsForm: FormGroup;
  transferNumber: boolean = false;
  Toaccount: any;
  hijriDate: any = { year: 1455, month: 4, day: 20 };
  selectedDateTypeR = DateType.Hijri;
  submitted: boolean = false;
  InvoicepayVoucherPublic: any = 0;

  editvouccher(data: any) {
    const DateHijri = toHijri(new Date());
    var DateGre = new HijriDate(
      DateHijri._year,
      DateHijri._month,
      DateHijri._date
    );
    DateGre._day = DateGre._date;
    this.vouchermodel.invoiceId = 0;
    this.InvoicepayVoucherPublic = 0;
    this.InvoicepayVoucherPublic = data.invoiceId;

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
    var date = data.date;
    this.vouchermodel.date = new Date();
    this.vouchermodel.notes = data.notes;
    this.vouchermodel.invoiceNotes = data.invoiceNotes;

    this.vouchermodel.journalNumber = data.journalNumber;
    debugger;
    // this.vouchermodel.supplierInvoiceNo=data.supplierInvoiceNo;
    this.vouchermodel.supplierInvoiceNo = data.invoiceNumber;
    this.vouchermodel.RecevierTxt = data.recevierTxt;
    this.vouchermodel.invoiceReference = data.invoiceReference;
    this.vouchermodel.invoiceValue = data.invoiceValue;
    this.vouchermodel.reVoucherNValueText = data.invoiceValueText;
    debugger;
    if (parseInt(data.invoiceValue) == parseInt(data.totalValue)) {
      this.vouchermodel.valuebefore = parseFloat(
        (
          parseFloat(data.invoiceValue?.toString()) -
          parseFloat(data.taxAmount?.toString())
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

    if (DunCalcV == true) {
      this.vouchermodel.dunCalc = true;
    } else {
      this.vouchermodel.dunCalc = false;
    }

    var taxType =
      parseInt(data.totalValue) === parseInt(data.tnvoiceValue) ? 3 : 2;
    this.vouchermodel.taxtype = taxType;

    // this.vouchermodel.supplierId = data.supplierId;
    this._payvoucherservice.FillClausesSelect().subscribe(
      (data) => {
        this.clauseseleted = data;
        if (this.clauseseleted.length > 0) {
          this.vouchermodel.clauseId = this.clauseseleted[0].id;
        }
      },
      (error) => {}
    );
    if (data.addDate != null) {
      this.addUser = data.addUser;
      this.addDate = data.addDate;
      if (data.addInvoiceImg != '' && data.addInvoiceImg != null) {
        this.addInvoiceImg = data.addInvoiceImg;
      }
    }

    this.GetTaxNoBySuppIdR(data.supplierId);

    /////////////////////////////////

    var Val =
      +parseFloat(parseFloat(data.totalValue).toFixed(2)) -
      +parseFloat(parseFloat(data.paidValue).toFixed(2));
    this.GetVousherRe_Sum(data.invoiceId, Val);
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

  GetTaxNoBySuppIdR(suppid: any) {
    this._payvoucherservice.GetTaxNoBySuppId(suppid).subscribe((data) => {
      this.vouchermodel.supplierTaxID = data ?? '';
    });
  }

  FillCustAccountsSelect2listTO: any;
  FillSubAccountLoadR() {
    this.receiptService.FillSubAccountLoad_Branch().subscribe((data) => {
      this.FillCustAccountsSelect2listTO = data.result;
    });
  }

  FillCustAccountsSelect2listFROM: any;
  FillCustAccountsSelect2R(PayTypeId: any) {
    this.receiptService.FillCustAccountsSelect2(PayTypeId).subscribe((data) => {
      this.Toaccount = data;
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
    VoucherObj.taxAmount = 0; // this.vouchermodel.taxAmount;
    VoucherObj.totalValue = this.vouchermodel.invoiceValue; // this.vouchermodel.valueafter;

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
    VoucherDetailsObj.amount = this.vouchermodel.invoiceValue;
    VoucherDetailsObj.taxType = 3; // this.vouchermodel.taxtype;
    VoucherDetailsObj.taxAmount = 0; // this.vouchermodel.taxAmount;

    VoucherDetailsObj.totalAmount = this.vouchermodel.invoiceValue; // this.vouchermodel.valueafter;
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
    if (type == 1) {
      this._payvoucherservice.SaveandPostVoucherP(VoucherObj).subscribe(
        (data) => {
          debugger;

          if (data.statusCode == 200) {
            this.submitted = false;
            if (this.uploadedFilesR.length > 0) {
              this.savefileR(data.returnedParm);
              this.GetAllVouchersLastMonth();
              modal.dismiss();
              this.toast.success(
                this.translate.instant(data.reasonPhrase),
                this.translate.instant('Message')
              );
            } else {
              this.GetAllVouchersLastMonth();
              modal.dismiss();
              this.toast.success(
                this.translate.instant(data.reasonPhrase),
                this.translate.instant('Message')
              );
            }
            this.UpdateStoreid(this.InvoicepayVoucherPublic);
          } else {
            this.toast.error(
              this.translate.instant(data.reasonPhrase),
              this.translate.instant('Message')
            );
            this.submitted = false;
          }
        },
        (error) => {
          this.toast.error(
            this.translate.instant(error.reasonPhrase),
            this.translate.instant('Message')
          );
          this.submitted = false;
        }
      );
    } else {
      this._payvoucherservice.SaveVoucherP(VoucherObj).subscribe(
        (data) => {
          this.submitted = false;
          debugger;

          if (data.statusCode == 200) {
            if (this.uploadedFilesR.length > 0) {
              this.savefileR(data.returnedParm);
              this.GetAllVouchersLastMonth();
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
            this.UpdateStoreid(this.InvoicepayVoucherPublic);
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
          this.submitted = false;
        }
      );
    }
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
      .GenerateVoucherNumber(this.VoucherType)
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

  // =========================================================

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

  getisPostbackground(element: any) {
    if (element?.isPost == true && element?.rad != 1) {
      return '#8dcdba';
    } else if (element?.isPost != true && element?.rad != 1) {
      return '#e19898';
    } else {
      return 'green';
    }
  }
  getisPostpointerEvents(element: any) {
    if (element?.isPost == true && element?.rad != 1) {
      return 'none';
    } else if (element?.isPost != true && element?.rad != 1) {
      return 'all';
    } else {
      return 'all';
    }
  }
  rowlistselect: any = [];
  toggleAllRows() {
    if (this.rowlistselect.length > 0) {
      this.selection.clear();
      this.rowlistselect = [];
      return;
    }
    this.rowlistselect = [];
    this.InvoicessDataSource.data.forEach((element: any) => {
      if (element.isPost == false) {
        this.rowlistselect.push(element);
      }
    });
    this.selection.select(...this.rowlistselect);
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

  GetVousherRe_Sum(invId: any, Value: any) {
    this.receiptService.PayVousher_Sum(invId).subscribe((result: any) => {
      if (result.statusCode == 200) {
        debugger;
        var AccValue:any = 0;
        if (Value > parseFloat(result.reasonPhrase)) {
          AccValue = Value - parseFloat(result.reasonPhrase);
        } else {
          AccValue = 0;
        }
        AccValue=parseFloat(AccValue.toString()).toFixed(2);

        this.ConvertNumToString_Offer((AccValue = AccValue));
        this.vouchermodel.invoiceValue = AccValue;
        // this.ReceiptVoucherForm.controls['AmountOf'].setValue(AccValue);
      } else {
        // this.ReceiptVoucherForm.controls['AmountOf'].setValue(0);
        this.vouchermodel.invoiceValue = 0;

        this.ConvertNumToString_Offer(0);
      }
    });
  }
  UpdateStoreid(invId: any) {
    this.receiptService.UpdateVoucher_payed(invId).subscribe((result: any) => {
      this.ShowAllVoucher();
    });
  }

  ConvertNumToString_Offer(val: any) {
    if (val != null) {
      this.receiptService.ConvertNumToString(val).subscribe((data) => {
        this.vouchermodel.reVoucherNValueText = data?.reasonPhrase;
        // this.ReceiptVoucherForm.controls['amountWriting'].setValue(
        //   data?.reasonPhrase
        // );
      });
    } else {
      // this.ReceiptVoucherForm.controls['amountWriting'].setValue(null);
      this.vouchermodel.reVoucherNValueText = '';
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
