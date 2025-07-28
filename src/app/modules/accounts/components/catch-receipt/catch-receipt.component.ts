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
import { SelectionModel } from '@angular/cdk/collections';

import { environment } from 'src/environments/environment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { SharedService } from 'src/app/core/services/shared.service';
import { NgxPrintElementService } from 'ngx-print-element';
import { RestApiService } from 'src/app/shared/services/api.service';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ReceiptService } from 'src/app/core/services/acc_Services/receipt.service';
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import { VoucherFilterVM } from 'src/app/core/Classes/ViewModels/voucherFilterVM';
import printJS from 'print-js';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { InvoiceService } from 'src/app/core/services/acc_Services/invoice.service';
import { take } from 'rxjs';
@Component({
  selector: 'app-catch-receipt',
  templateUrl: './catch-receipt.component.html',
  styleUrls: ['./catch-receipt.component.scss'],
})
export class CatchReceiptComponent implements OnInit {
  ReceiptVoucherForm: FormGroup;
  CheckDetailsForm: FormGroup;
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
      ar: 'سند قبض ',
      en: 'Catch Receipt',
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
    'select',
    'invoiceNumber',
    'date',
    'customerName',
    'totalValue',
    'payTypeName',
    'statusName',
    'journalNumber',
    'postDate',
    'BondAttachments',
    'operations',
  ];

  AllJournalsByReVoucherColumns: string[] = [
    'transactionDate',
    'invoiceNumber',
    'typeName',
    'journalNo',
    'accountCode',
    'accountName',
    'notes',
    'depit',
    'credit',
  ];
  projectUsersColumns: string[] = ['name', 'responsibility'];
  projectTasksColumns: string[] = ['taskName', 'name', 'duration'];

  userPermissionsDataSource = new MatTableDataSource();

  projectGoalsDataSource = new MatTableDataSource();

  projectUsersDataSource = new MatTableDataSource();
  projectTasksDataSource = new MatTableDataSource();

  projectsDataSource = new MatTableDataSource();
  AllJournalsByReVoucherlist = new MatTableDataSource();
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

  userG: any = {};
  constructor(
    private modalService: NgbModal,
    private _accountsreportsService: AccountsreportsService,
    private _invoiceService: InvoiceService,
    private receiptService: ReceiptService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private api: RestApiService,
    private print: NgxPrintElementService,
    private _sharedService: SharedService,
    private authenticationService: AuthenticationService
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
  selectedId: number | null = null;
  ngOnInit(): void {
    this._sharedService.selectedId$.subscribe(id => {
        this.selectedId = id;
    });

    this.projectsDataSource = new MatTableDataSource();

    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );

    this.projectGoalsDataSource = new MatTableDataSource(this.projectGoals);

    this.projectUsersDataSource = new MatTableDataSource(this.projectUsers);

    this.projectTasksDataSource = new MatTableDataSource(this.projectTasks);
    this.ReceiptVoucherFormintial();
    this.CheckDetailsIntial();

    this.GetAllVouchers();
    this.getFillAllCustomerSelectByAllReVoucher();
    this.GetBranch_Costcenter();
    this.FillBankSelect();
    this.FillCostCenterSelect_Catch();
    this.GetAllCustomerForDropWithBranch();

    this.api.GetOrganizationDataLogin().subscribe((data: any) => {
      this.OrganizationData = data.result;
      this.dateprint = new Date();
      this.environmentPho =
        environment.PhotoURL + this.OrganizationData.logoUrl;
    });
  }

  ngAfterViewInit() {
    // this.open(this.smartModal, null, 'smartModal');
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

  PayTypeList = [
    { id: 1, name: 'monetary' },
    { id: 17, name: 'Cash account points of sale - Mada-ATM' },
    { id: 2, name: 'Check' },
    { id: 6, name: 'transfer' },
    { id: 9, name: 'Network/transfer' },
    { id: 15, name: 'عهد موظفين' },
    { id: 16, name: 'جاري المالك' },
  ];
  datafilter: any = {
    enable: false,
    voucherNo: null,
    invoiceNote: null,
    datefilter: null,
    dateFrom: null,
    dateTo: null,
    customerId: null,
    isPost: null,
    type: 6,
    isSearch: false,
    isChecked: false,
  };
  reset() {
    this.datafilter = {
      enable: false,
      voucherNo: null,
      invoiceNote: null,
      datefilter: null,
      dateFrom: null,
      dateTo: null,
      customerId: null,
      isPost: null,
      type: 6,
      isChecked: false,
      isSearch: false,
    };
    if (this.showFilters == true) {
      this.datafilter.isSearch = true;
    } else {
      this.datafilter.isSearch = true;
    }
  }
  transferNumber: boolean = false;
  CustCheckPage: any = null;
  modalType: any = 'Create';
  hijritype: boolean = false;
  ReceiptVoucherModelPublic: any;
  ReceiptSaveType: any=1;


  open(content: any, data?: any, type?: any, status?: any, model?: any) {
    if (data && type == 'edit') {
      this.modalDetails = data;
      this.modalDetails['id'] = 1;
    }
    if (type == 'SaveReceiptVoucherConfirmModal') {
      this.ReceiptVoucherModelPublic = model;
      this.ReceiptSaveType=1;
    }
    if (type == 'SavePostReceiptVoucherConfirmModal') {
      this.ReceiptVoucherModelPublic = model;
      this.ReceiptSaveType=2;
    }
    this.hijritype = false;
    if (type == 'ReceiptVoucherwithoutCustomerModal') {
      this.hijriDate = null;
      this.uploadedFiles = [];
      this.ReceiptVoucherFormintial();
      this.checkdetailsList = [];
      this.R_theInvoice = null;
      this.Registrationnumber = null;
      this.referenceNumber = null;
      this.ClientId = null;
      this.paymenttype = null;
      this.InvoicesWithCustomer = null;
      this.RemainingInvoiceValue = null;
      this.totalvalue = null;
      this.FillCustAccountsSelect2_Catch(null);
      this.FillSubAccountLoad();
      this.gethigridate();
      this.GenerateVoucherNumber();
      this.CustCheckPage = status;
      this.ReceiptVoucherForm.controls['VoucherNumber'].disable();
      // this.ReceiptVoucherForm.controls['Registrationnumber'].disable();
      this.ReceiptVoucherForm.controls['amountWriting'].disable();
      this.ReceiptVoucherForm.controls['AccCodeFrom'].disable();
      this.ReceiptVoucherForm.controls['AccCodeTo'].disable();
      this.modalType = 'Create';
      this.GetBranch_Costcenter();
    } else if (type == 'editReceiptModal') {
      this.uploadedFiles = [];
      this.ReceiptVoucherForm.controls['VoucherId'].setValue(data.invoiceId);
      this.hijriDate = null;
      this.ReceiptVoucherFormintial();
      this.checkdetailsList = [];
      this.Registrationnumber = null;
      this.R_theInvoice = null;
      this.referenceNumber = null;
      this.ClientId = null;
      this.paymenttype = null;
      this.FillCustAccountsSelect2_Catch(null);
      this.FillSubAccountLoad();
      this.gethigridate();
      this.GenerateVoucherNumber();
      this.ReceiptVoucherForm.controls['VoucherNumber'].disable();
      // this.ReceiptVoucherForm.controls['Registrationnumber'].disable();
      this.ReceiptVoucherForm.controls['amountWriting'].disable();
      this.ReceiptVoucherForm.controls['AccCodeFrom'].disable();
      this.ReceiptVoucherForm.controls['AccCodeTo'].disable();

      this.CustCheckPage = status;
      this.modalType = 'Edit';
      this.editInvoices(data);
    } else if (type == 'viewReceiptModal') {
      this.ReceiptVoucherForm.controls['VoucherId'].setValue(data.invoiceId);
      this.hijriDate = null;
      this.ReceiptVoucherFormintial();
      this.checkdetailsList = [];
      this.R_theInvoice = null;
      this.referenceNumber = null;
      this.paymenttype = null;
      this.ClientId = null;

      this.FillCustAccountsSelect2_Catch(null);
      this.FillSubAccountLoad();
      this.gethigridate();
      this.GenerateVoucherNumber();
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
    } else if (type == 'DeleteVoucherModal') {
      this.ReceiptVoucherForm.controls['VoucherId'].setValue(data.invoiceId);
      this.R_theInvoice = null;
      this.R_theInvoice = data.toInvoiceId;
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
    } else if (type == 'PostBackVouchers') {
      this.ReceiptVoucherForm.controls['VoucherId'].setValue(data.invoiceId);
    }
    // else if (type == 'AllJournalsByReVoucheModal') {
    //   this.GetAllJournalsByReVoucherID(data.invoiceId)
    // }
    else if (type == 'AddModalBanks') {
      this.GetAllBanks();
    } else if (type == 'deleteBank') {
      this.DeletebanksId = data.bankId;
    } else if (type == 'accountingentry') {
      this.GetAllJournalsByInvID(data.invoiceId);
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
  selectedDateType = DateType.Hijri;
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

  GetAllVouchersList: any;
  GetAllVouchers() {
    let obj = {
      voucherNo:
        this.datafilter.voucherNo == '' ? null : this.datafilter.voucherNo,
      invoiceNote: this.datafilter.invoiceNote,
      dateFrom: this.datafilter.dateFrom,
      dateTo: this.datafilter.dateTo,
      customerId: this.datafilter.customerId ?? 0,
      isPost: this.datafilter.isPost ?? 0,
      type: 6,
      isSearch: this.datafilter.isSearch,
      isChecked: this.datafilter.dateFrom == null ? false : true,
    };
    this.receiptService.GetAllVouchers(obj).subscribe((data) => {
      this.GetAllVouchersList = data;
      this.projectsDataSource = new MatTableDataSource(data);
      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
    });
  }
  AllCustomerSelectByAllReVoucherList: any;
  getFillAllCustomerSelectByAllReVoucher() {
    this.receiptService
      .FillAllCustomerSelectByAllReVoucher()
      .subscribe((data) => {
        this.AllCustomerSelectByAllReVoucherList = data;
      });
  }
  Branch_Costcenter: any;
  GetBranch_Costcenter() {
    this.receiptService.GetBranch_Costcenter().subscribe((data) => {
      this.Branch_Costcenter = data.result;
      this.ReceiptVoucherForm.controls['costCentersId'].setValue(
        data.result.costCenterId
      );
    });
  }
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
  GenerateVoucherNumber() {
    this.receiptService.GenerateVoucherNumber().subscribe((data) => {
      this.ReceiptVoucherForm.controls['VoucherNumber'].setValue(
        data.reasonPhrase
      );
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

  @ViewChild('EditCheckDetailsModal') EditCheckDetailsModal: any;
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
        this.open(
          this.EditCheckDetailsModal,
          '',
          'EditCheckDetailsModal',
          'newCheckDetails'
        );
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
        this.open(
          this.EditCheckDetailsModal,
          '',
          'EditCheckDetailsModal',
          'newCheckDetails'
        );
      }
    } else {
      this.checkdetailsList = [];
      this.FillCustAccountsSelect2_Catch(PayType);
    }
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

  GetAllDetailsByVoucherId(VoucherId: any) {
    this.receiptService
      .GetAllDetailsByVoucherId(VoucherId)
      .subscribe((data) => {
        this.DetailsByVoucher = data.result;
      });
  }
  addUser: any;
  addDate: any;
  addInvoiceImg: any;
  DetailsByVoucher: any;
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
  selectedFiles?: FileList;
  currentFile?: File;
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }
  public uploadedFiles: Array<File> = [];
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
      this.GetAllVouchers();
    });
  }
  submitted: boolean = false;
  disableButtonSave_Voucher = false;

  SaveVoucher() {
    if (this.R_theInvoice != null && this.R_theInvoice != 0) {
      if (
        this.RemainingInvoiceValue <
        this.ReceiptVoucherForm.controls['AmountOf'].value
      ) {
        this.toast.error(
          'قيمه السند اكبرمن المتبقي من الفاتوره',
          this.translate.instant('Message')
        );
        return;
      }
    }
    this.submitted == true;

    if (
      this.ReceiptVoucherForm.controls['dateM'].value != null &&
      typeof this.ReceiptVoucherForm.controls['dateM'].value != 'string'
    ) {
      var date = this._sharedService.date_TO_String(
        this.ReceiptVoucherForm.controls['dateM'].value
      );
      this.ReceiptVoucherForm.controls['dateM'].setValue(date);
    }

    this.hijriDate =
      this.hijriDate.year +
      '-' +
      this.hijriDate.month +
      '-' +
      this.hijriDate.day;

    var VoucherDetailsList = [];
    var VoucherObj: any = {};
    VoucherObj.Type = 6;
    VoucherObj.TaxAmount = null;
    VoucherObj.InvoiceId = this.ReceiptVoucherForm.controls['VoucherId'].value;
    VoucherObj.InvoiceNumber =
      this.ReceiptVoucherForm.controls['VoucherNumber'].value;
    VoucherObj.toInvoiceId = this.R_theInvoice;
    // VoucherObj.JournalNumber = this.ReceiptVoucherForm.controls["Registrationnumber"].value;
    VoucherObj.JournalNumber = this.Registrationnumber;
    VoucherObj.Date = this.ReceiptVoucherForm.controls['dateM'].value;
    VoucherObj.HijriDate = this.hijriDate;
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
    this.receiptService.SaveVoucher(VoucherObj).pipe(take(1)).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          if (this.uploadedFiles.length > 0) {
            this.savefile(data.returnedParm);
          }
          if (this.ReceiptSaveType == 2) {
            this.PostVouchers(data.returnedParm);
          }
          debugger;
          if (this.R_theInvoice != null && this.R_theInvoice != 0) {
            this.UpdateStoreid(this.R_theInvoice);
          }
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
          this.ReceiptVoucherModelPublic.dismiss();
          this.GetAllVouchers();
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
      }
    );
  }
  PostVouchersCheckBox(modal: any) {
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
          this.GetAllVouchers();
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

  PostVouchers(id: any, modal?: any) {
    this.receiptService.GetAllDetailsByVoucherId(id).subscribe((data) => {
      this.receiptService.PostVouchers(data.result).subscribe(
        (data) => {
          if (data.statusCode == 200) {
            this.toast.success(
              this.translate.instant(data.reasonPhrase),
              this.translate.instant('Message')
            );
            this.GetAllVouchers();
            modal.dismiss();
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
  PostBackV(modal: any) {
    this.receiptService
      .GetAllDetailsByVoucherId(
        this.ReceiptVoucherForm.controls['VoucherId'].value
      )
      .subscribe((data) => {
        this.receiptService.PostBackVouchers(data.result).subscribe(
          (data) => {
            if (data.statusCode == 200) {
              this.toast.success(
                this.translate.instant(data.reasonPhrase),
                this.translate.instant('Message')
              );
              modal.dismiss();
              this.GetAllVouchers();
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
  // totaldepit: any
  // totalcredit: any
  // GetAllJournalsByReVoucherID(id: any) {
  //   this.receiptService.GetAllJournalsByReVoucherID(id).subscribe(
  //     (data) => {
  //       this.totaldepit = null
  //       this.totalcredit = null

  //       data.result.forEach((element: any) => {
  //         this.totaldepit += element.depit
  //         this.totalcredit += element.credit
  //       });
  //       this.AllJournalsByReVoucherlist = new MatTableDataSource(data.result);
  //     },
  //     (error) => {
  //     }
  //   );
  // }

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
    this.receiptService.GetAllJournalsByReVoucherID(invid).subscribe((data) => {
      this.AllJournalEntries = data.result;
    });
  }
  datePrintJournals: any = new Date();
  PrintJournalsByReVoucher() {
    if (this.AllJournalEntries[0].invoiceId) {
      this.receiptService
        .PrintJournalsByReVoucherId(this.AllJournalEntries[0].invoiceId)
        .subscribe((data) => {
          this.printDiv('reportaccountingentryModal');
        });
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
  CheckDate(event: any) {
    if (event != null) {
      this.datafilter.dateFrom = this._sharedService.date_TO_String(event[0]);
      this.datafilter.dateTo = this._sharedService.date_TO_String(event[1]);
      this.GetAllVouchers();
    } else {
      this.datafilter.dateFrom = null;
      this.datafilter.dateTo = null;
      this.datafilter.datefilter = null;
      this.GetAllVouchers();
    }
  }
  ResetSearchTime() {
    if (!this.data.enable) {
      // this.RefreshData_ByDate("", "");
    } else {
      // this.RefreshData_ByDate(this.data.filter.DateFrom_P ?? "", this.data.filter.DateTo_P ?? "");
    }
  }
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
  exportData() {
    let x = [];

    for (let index = 0; index < this.GetAllVouchersList.length; index++) {
      x.push({
        invoiceNumber: this.GetAllVouchersList[index].invoiceNumber,
        date: this.GetAllVouchersList[index].date,
        customerName: this.GetAllVouchersList[index].customerName,
        totalValue:parseFloat( this.GetAllVouchersList[index].totalValue),
        payTypeName: this.GetAllVouchersList[index].payTypeName,
        statusName: this.GetAllVouchersList[index].statusName,
        journalNumber: this.GetAllVouchersList[index].journalNumber,
        postDate: this.GetAllVouchersList[index].postDate,
        // BondAttachments: this.GetAllVouchersList[index].BondAttachments,
      });
    }
    this.receiptService.customExportExcel(x, 'Statement of customer revenue');
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

    let obj = {
      voucherNo:
        this.datafilter.voucherNo == '' ? null : this.datafilter.voucherNo,
      invoiceNote: this.datafilter.invoiceNote,
      dateFrom: this.datafilter.dateFrom,
      dateTo: this.datafilter.dateTo,
      customerId: this.datafilter.customerId ?? 0,
      isPost: this.datafilter.isPost ?? 0,
      type: 6,
      isSearch: this.datafilter.isSearch,
      isChecked: this.datafilter.dateFrom == null ? false : true,
    };
    this.receiptService.Printdiffrentvoucher(obj).subscribe((data) => {
      var PDFPath = environment.PhotoURL + data.reasonPhrase;
      printJS({ printable: PDFPath, type: 'pdf', showModal: true });
    });
  }
  items: any = [1, 2, 3, 4, 5, 6, 7, 8];

  EntryVoucherPrintData: any = null;
  CustomData: any;
  CustomDataNoteInvoice: any;
  CustomDatatoInvoice: any;

  @ViewChild('printDivModal') printDivModal: any;

  GetReport(obj: any) {
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
      if (this.EntryVoucherPrintData?.org_VD.logoUrl)
        this.CustomData =
          environment.PhotoURL + this.EntryVoucherPrintData?.org_VD.logoUrl;
      else this.CustomData = null;

      this.open(this.printDivModal);
    });
  }
  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }

  downloadFile(data: any) {
    try {
      var link = environment.PhotoURL + data.fileUrl;
      window.open(link, '_blank');
    } catch (error) {
      this.toast.error('تأكد من الملف', 'رسالة');
    }
  }

  DeleteVoucher(modal: any) {
    this.receiptService
      .DeleteVoucher(this.ReceiptVoucherForm.controls['VoucherId'].value)
      .subscribe(
        (data) => {
          if (data.statusCode == 200) {
            this.toast.success(
              this.translate.instant(data.reasonPhrase),
              this.translate.instant('Message')
            );
            if (this.R_theInvoice != null && this.R_theInvoice != 0) {
              this.UpdateStoreid(this.R_theInvoice);
            }
            modal.dismiss();
            this.GetAllVouchers();
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
  rowlistselect: any = [];
  toggleAllRows() {
    if (this.rowlistselect.length > 0) {
      this.selection.clear();
      this.rowlistselect = [];
      return;
    }
    this.rowlistselect = [];
    this.projectsDataSource.data.forEach((element: any) => {
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

  existValue: any = false;

  UpdateStoreid(invId: any) {
    this.receiptService
      .UpdateVoucher_recipient(invId)
      .subscribe((result: any) => {});
  }

  //////////////////////////////////////////////////
  InvoicesWithCustomer: any;
  GetInvoiceByCustomer() {
    this.receiptService
      .GetInvoiceByCustomer(this.ClientId)
      .subscribe((data) => {
        this.InvoicesWithCustomer = data;
      });
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
  var InvoiceNum = this.ReceiptVoucherForm.controls['VoucherNumber'].value;

  this.uploadedFiles = [];
  this.hijriDate = null;
  this.ReceiptVoucherFormintial();
  this.checkdetailsList = [];
  this.Registrationnumber = null;
  this.R_theInvoice = null;
  this.referenceNumber = null;
  this.ClientId = null;
  this.paymenttype = null;
  this.FillCustAccountsSelect2_Catch(null);
  this.FillSubAccountLoad();
  //this.GenerateVoucherNumber();
  this.CopyCatch_Receipt(data);
  this.ReceiptVoucherForm.controls['VoucherNumber'].setValue(InvoiceNum);
  
}
CopyCatch_Receipt(element: any) {
  this.receiptService.GetAllDetailsByVoucherId(element.invoiceId).subscribe((data) => {
      this.addUser = null;
      this.addDate = null;
      this.addInvoiceImg = null;
      this.DetailsByVoucher = data.result[0];

      if (element.customerId == null) {
        this.CustCheckPage = 'noCustomer';
        this.ClientId = null;
      } else {
        this.CustCheckPage = 'withCustomer';
        this.ClientId = element.customerId;
      }
      this.ReceiptVoucherForm.controls['dateM'].setValue(
        new Date(element.date)
      );
      this.gethigridate();
      this.ReceiptVoucherForm.controls['Notes'].setValue(element.notes);
      this.ReceiptVoucherForm.controls['Statement'].setValue(element.invoiceNotes);
      this.Registrationnumber = null;
      this.ReceiptVoucherForm.controls['VoucherId'].setValue(0);
      this.referenceNumber = element.invoiceReference;
      this.R_theInvoice = element.toInvoiceId;
      this.ReceiptVoucherForm.controls['AmountOf'].setValue(element.totalValue);
      this.ConvertNumToString_Catch(this.ReceiptVoucherForm.controls['AmountOf'].value);
      this.ReceiptVoucherForm.controls['recipientName'].setValue(element.recevierTxt);
      this.paymenttype = element.payType;
      this.FillCustAc(true);
      this.ReceiptVoucherForm.controls['fromAccount'].setValue(element.toAccountId);
      this.GetAccCodeFormID(this.ReceiptVoucherForm.controls['fromAccount'].value, 1 );
      this.ReceiptVoucherForm.controls['toAccount'].setValue(this.DetailsByVoucher.accountId);
      this.GetAccCodeFormID(this.ReceiptVoucherForm.controls['toAccount'].value,2);
      this.ReceiptVoucherForm.controls['costCentersId'].setValue(this.DetailsByVoucher.costCenterId);
      this.ReceiptVoucherForm.controls['AndThatFor'].setValue(this.DetailsByVoucher.description);
      if (this.DetailsByVoucher.payType == 2 ||this.DetailsByVoucher.payType == 6 ||this.DetailsByVoucher.payType == 17 ) {
        if (this.DetailsByVoucher.payType == 2) {
          this.CheckDetailsForm.controls['paymenttypeName'].setValue('شيك');
          this.CheckDetailsForm.controls['Check_transferNumber'].setValue(this.DetailsByVoucher.checkNo);
          this.CheckDetailsForm.controls['dateCheck_transfer'].setValue(this.DetailsByVoucher.checkDate);
          this.CheckDetailsForm.controls['BankId'].setValue(this.DetailsByVoucher.bankId );
          this.CheckDetailsForm.controls['bankName'].setValue(this.DetailsByVoucher.bankName);
        } else if (this.DetailsByVoucher.payType == 6) {
          this.CheckDetailsForm.controls['paymenttypeName'].setValue('حوالة');
          this.CheckDetailsForm.controls['Check_transferNumber'].setValue(this.DetailsByVoucher.moneyOrderNo);
          this.CheckDetailsForm.controls['dateCheck_transfer'].setValue( this.DetailsByVoucher.moneyOrderDate);
          this.CheckDetailsForm.controls['BankId'].setValue(this.DetailsByVoucher.bankId);
          this.CheckDetailsForm.controls['bankName'].setValue( this.DetailsByVoucher.bankName);
        } else if (this.DetailsByVoucher.payType == 17) {
          this.CheckDetailsForm.controls['paymenttypeName'].setValue('نقاط بيع');
          this.CheckDetailsForm.controls['Check_transferNumber'].setValue(this.DetailsByVoucher.moneyOrderNo);
          this.CheckDetailsForm.controls['dateCheck_transfer'].setValue(this.DetailsByVoucher.moneyOrderDate);
          this.CheckDetailsForm.controls['BankId'].setValue( this.DetailsByVoucher.bankId);
          this.CheckDetailsForm.controls['bankName'].setValue(this.DetailsByVoucher.bankName);
        }
        this.checkdetailsTabel();
      }
    });
}

//#endregion
  //------------------------------------End-CopyData----------------------------------------------


}
