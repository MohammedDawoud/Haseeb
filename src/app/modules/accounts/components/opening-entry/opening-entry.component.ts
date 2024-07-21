import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
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
import { RestApiService } from 'src/app/shared/services/api.service';
import { Router } from '@angular/router';
import { InvoiceService } from 'src/app/core/services/acc_Services/invoice.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { OpeningEntrtyService } from 'src/app/core/services/acc_Services/opening-entrty.service';
import { Invoices } from 'src/app/core/Classes/DomainObjects/invoices';
import { environment } from 'src/environments/environment';
import { NgxPrintElementService } from 'ngx-print-element';
import { DateType } from 'ngx-hijri-gregorian-datepicker';


@Component({
  selector: 'app-opening-entry',
  templateUrl: './opening-entry.component.html',
  styleUrls: ['./opening-entry.component.scss']
})
export class OpeningEntryComponent implements OnInit {
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
      ar: 'القيد الافتتاحي ',
      en: 'opening entry',
    },
  };

  selectedUser: any;
  users: any;

  closeResult = '';

  showStats = false;
  showFilters = false;
  showTable = true;

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
    'invoiceNumber',
    'date',
    'totalValue',
    'statusName',
    'postDate',
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
  userG: any = {};
  endDate = new Date();
  constructor(
    private modalService: NgbModal,
    private api: RestApiService,
    private router: Router,

    private toast: ToastrService,
    private translate: TranslateService,
    private _sharedService: SharedService,
    private _invoiceService: InvoiceService,
    private openingEntrtyService: OpeningEntrtyService,
    private authenticationService: AuthenticationService,
    private print: NgxPrintElementService,
  ) {
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();
    this.userG = this.authenticationService.userGlobalObj;
  }

  ngOnInit(): void {
    this.users = [
      { id: 1, Name: 'محمود نافع' },
      { id: 2, Name: 'محمود نافع' },
    ];

    this.delayedProjects = [
      {
        user: 'adwawd',
        customerName: 'adawdv',
        projectStatus: 4,
        startDate: new Date(),
        endDate: new Date(),
      },
    ];
    this.latedProjects = [
      {
        user: 'adwawd',
        customerName: 'adawdv',
        projectStatus: 0,
        startDate: new Date(),
        endDate: new Date(),
      },
    ];

    this.projects = [
      {
        BondNumber: '000056',
        BondDate: '2023-06-13',
        BondTotal: 'أجل',
        BondCondition: 50,
        PostingDate: 50,
        progress: 50,
      },
      {
        BondNumber: '000056',
        BondDate: '2023-06-13',
        BondTotal: 'أجل',
        BondCondition: 50,
        PostingDate: 50,
        progress: 50,
      },
      {
        BondNumber: '000056',
        BondDate: '2023-06-13',
        BondTotal: 'أجل',
        BondCondition: 50,
        PostingDate: 50,
        progress: 50,
      },
      {
        BondNumber: '000056',
        BondDate: '2023-06-13',
        BondTotal: 'أجل',
        BondCondition: 50,
        PostingDate: 50,
        progress: 50,
      },
      {
        BondNumber: '000056',
        BondDate: '2023-06-13',
        BondTotal: 'أجل',
        BondCondition: 50,
        PostingDate: 50,
        progress: 50,
      },
    ];

    this.userPermissions = [
      {
        userName: 'adawdawd',
        watch: false,
        add: true,
        edit: true,
        delete: false,
      },
      {
        userName: 'adawdawd',
        watch: false,
        add: true,
        edit: true,
        delete: false,
      },
      {
        userName: 'adawdawd',
        watch: false,
        add: true,
        edit: true,
        delete: true,
      },
      {
        userName: 'adawdawd',
        watch: false,
        add: false,
        edit: true,
        delete: false,
      },
      {
        userName: 'adawdawd',
        watch: false,
        add: true,
        edit: true,
        delete: false,
      },
      {
        userName: 'adawdawd',
        watch: true,
        add: true,
        edit: true,
        delete: false,
      },
      {
        userName: 'adawdawd',
        watch: true,
        add: true,
        edit: true,
        delete: true,
      },
    ];

    this.projectsDataSource = new MatTableDataSource();

    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );

    this.projectGoalsDataSource = new MatTableDataSource(this.projectGoals);

    this.projectUsersDataSource = new MatTableDataSource(this.projectUsers);

    this.projectTasksDataSource = new MatTableDataSource(this.projectTasks);

    this.LoadDataEntryVoucher()
  }

  ngAfterViewInit() {
    // this.open(this.smartModal, null, 'smartModal');
  }
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
    if (data && type == "decodingPagingModal") {
      this.RowEntryVouvherData = data;
    } else if (data && type == "deleteModal") {
      this.RowEntryVouvherData = data;
    } else if (idRow != null && type == "AccountsListModal") {
      this.selectedAccountRowTable = idRow;
      this.FillSubAccountLoadTable();
    } else if (idRow != null && type == "CostCenterListModal") {
      this.selectedCostCenterRowTable = idRow;
      this.FillCostCenterSelect();
    } else if (type == "openingDocumentModal") {
      this.WhichTypeAddEditView = 1;
      this.EntryVoucherPopup();
    }
    else if (type == "EditopeningDocumentModal") {
      this.WhichTypeAddEditView = 2;
      this.EditEntryVoucherPopup(data);
    }
    else if (type == "ViewopeningDocumentModal") {
      this.WhichTypeAddEditView = 3;
      this.EditEntryVoucherPopup(data);
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
  objOfInvoices: any
  EditEntryVoucherPopup(data: any) {
    this.resetEntryData();
    this.GetAllTransByVoucherId(data.invoiceId);
    this.modalEntryVoucher = {
      InvoiceId: data.invoiceId,
      InvoiceNumber: data.invoiceNumber,
      JournalNumber: data.journalNumber,
      Date: this._sharedService.String_TO_date(data.date),
      HijriDate: null,
      Notes: data.notes,
      InvoiceNotes: data.invoiceNotes,
      Type: 10,
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
    // this.objOfInvoices = []
    this.objOfInvoices = data
    this.FillCostCenterSelect();
    this.FillSubAccountLoadTable();
    this.gethigridate()
  }
  GetAllTransByVoucherId(inv: any) {
    this.EntryVoucherDetailsRows = [];
    this.openingEntrtyService.GetAllTransByVoucherId(inv).subscribe((data: any) => {
      var TotalCredit = 0; var TotalDepit = 0;
      if (data.result.length > 0) {
        data.result.forEach((element: any) => {
          var Credit = 0; var Depit = 0;
          if (element.depit < element.credit) {
            Credit = parseFloat(element.credit); Depit = 0;
            TotalCredit = TotalCredit + Credit;
          }
          if (element.credit < element.depit) {
            Credit = 0; Depit = element.depit;
            TotalDepit = TotalDepit + Depit;
          }
          var maxVal = 0;
          if (this.EntryVoucherDetailsRows.length > 0) {
            maxVal = Math.max(...this.EntryVoucherDetailsRows.map((o: { idRow: any; }) => o.idRow))
          }
          else {
            maxVal = 0;
          }
          this.EntryVoucherDetailsRows?.push({
            idRow: maxVal + 1,
            Amounttxt: element.amount,
            AccJournalid: element.accountId,
            accountJournaltxt: element.accountName,
            CreditDepitStatus: Credit > Depit ? "C" : "D",
            CostCenterId: element.costCenterId,
            CostCenterName: element.costCenterName,
            Notes: element.notes,
            InvoiceReference: element.invoiceReference,
            AccCalcExpen: element.accCalcExpen,
            AccCalcIncome: element.accCalcIncome,
          });

        });
        this.modalEntryVoucher.TotalCredit = parseFloat((TotalCredit).toString()).toFixed(2);
        this.modalEntryVoucher.TotalDepit = parseFloat((TotalDepit).toString()).toFixed(2);
        this.modalEntryVoucher.diff = parseFloat((TotalDepit - TotalCredit).toString()).toFixed(2);
      }
      else {
        this.EntryVoucherDetailsRows = [];
      }
    });
  }
  getColorStatus(element: any) {
    if ((element?.isPost == true && element?.rad != 1)) { return "#30b550"; }
    else if ((element?.isPost != true && element?.rad != 1)) { return "#c51313"; }
    else { return "#000000"; }
  }
  modalEntryVoucher: any = {
    InvoiceId: 0,
    InvoiceNumber: null,
    JournalNumber: null,
    Date: new Date(),
    HijriDate: null,
    Notes: null,
    InvoiceNotes: null,
    Type: 10,
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
      Type: 10,
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
  EntryVoucherDetailsRows: any = [];

  EntryVoucherDataSource = new MatTableDataSource();
  EntryVoucherSourceTemp: any = [];
  LoadDataEntryVoucher() {
    this.openingEntrtyService.GetAllVouchers().subscribe(data => {
      this.EntryVoucherDataSource = new MatTableDataSource(data);
      this.EntryVoucherSourceTemp = data;
      this.EntryVoucherDataSource.paginator = this.paginator;
      this.EntryVoucherDataSource.sort = this.sort;
    });
  }
  GenerateEntryVoucherNumber() {
    this._invoiceService.GenerateVoucherNumber(this.modalEntryVoucher.Type).subscribe(data => {
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
    this._invoiceService.FillCostCenterSelect().subscribe(data => {
      this.load_CostCenter = data;
      this.CostCenterListDataSource = new MatTableDataSource(data);
      this.CostCenterListDataSource.paginator = this.paginatorCostCenter;
      this.CostCenterList = data;
      this.CostCenterListDataSourceTemp = data;
    });
  }

  EntryVoucherPopup() {
    var date = new Date();
    var datebefore = this._sharedService.date_TO_String(date);
    var Hijridate = this._sharedService.GetHijriDate(date, "Contract/GetHijriDate");
    this.FillCostCenterSelect();
    this.FillSubAccountLoadTable();
    this.resetEntryData();
    this.GenerateEntryVoucherNumber();
    this.gethigridate()
  }

  AccountListDataSource = new MatTableDataSource();
  AccountListDataSourceTemp: any;
  AccountList: any;
  @ViewChild('paginatorAccount') paginatorAccount: MatPaginator;

  FillSubAccountLoadTable() {
    this._invoiceService.FillSubAccountLoad().subscribe(data => {
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
      maxVal = Math.max(...this.EntryVoucherDetailsRows.map((o: { idRow: any; }) => o.idRow))
    }
    else {
      maxVal = 0;
    }
    this.EntryVoucherDetailsRows?.push({
      idRow: maxVal + 1,
      Amounttxt: null,
      AccJournalid: null,
      accountJournaltxt: null,
      CreditDepitStatus: "D",
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
    var totalDebit = 0, totalCredit = 0, totalBalance = 0; this.journalDebitNmRows = 0; this.journalCreditNmRows = 0;
    this.EntryVoucherDetailsRows.forEach((element: any, index: any) => {
      var Value = 0, Rate = 1;
      Value = element.Amounttxt;
      if (element.CreditDepitStatus == "D") {
        this.journalDebitNmRows += 1;
        totalDebit += (Value * Rate);
        totalBalance = +parseFloat((totalDebit - totalCredit).toString()).toFixed(2);
      }
      else {
        this.journalCreditNmRows += 1;
        totalCredit += (Value * Rate);
        totalBalance = +parseFloat((totalDebit - totalCredit).toString()).toFixed(2);
      }
    });
    this.modalEntryVoucher.TotalCredit = parseFloat((totalCredit).toString()).toFixed(2);
    this.modalEntryVoucher.TotalDepit = parseFloat((totalDebit).toString()).toFixed(2);
    this.modalEntryVoucher.diff = parseFloat((totalDebit - totalCredit).toString()).toFixed(2);
  }

  applyFilterAccountsList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.AccountListDataSource.filter = filterValue.trim().toLowerCase();
  }

  setAccountRowValue(element: any) {
    this.EntryVoucherDetailsRows.filter((a: { idRow: any; })=>a.idRow==this.selectedAccountRowTable)[0].AccJournalid = element.id;
    this.EntryVoucherDetailsRows.filter((a: { idRow: any; })=>a.idRow==this.selectedAccountRowTable)[0].accountJournaltxt = element.name;
  }
  setCostCenterRowValue(element: any) {
    this.EntryVoucherDetailsRows.filter((a: { idRow: any; })=>a.idRow==this.selectedCostCenterRowTable)[0].CostCenterId = element.id;
    this.EntryVoucherDetailsRows.filter((a: { idRow: any; })=>a.idRow==this.selectedCostCenterRowTable)[0].CostCenterName = element.name;
  }
  applyFilterCostCenterList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.CostCenterListDataSource.filter = filterValue.trim().toLowerCase();
  }


  deleteEntryVoucherRow(idRow: any) {
    let index = this.EntryVoucherDetailsRows.findIndex((d: { idRow: any; }) => d.idRow == idRow);
    this.EntryVoucherDetailsRows.splice(index, 1);
    this.CalculateEntryVoucher();
  }
  gethigridate() {
    this._sharedService.GetHijriDate(this.modalEntryVoucher.Date, 'Contract/GetHijriDate2').subscribe({
      next: (data: any) => { this.modalEntryVoucher.HijriDate = data },
      error: (error) => { },
    });
  }

  saveEntryVoucher(modal: any) {
    if (!(parseInt(this.modalEntryVoucher.TotalDepit) > 0 && parseInt(this.modalEntryVoucher.diff) == 0)) {
      this.toast.error("من فضلك أدخل قيم صحيحة للقيد", this.translate.instant("Message"));
      return;
    }
    var VoucherDetailsList: any = [];
    var VoucherObj: any = {};
    VoucherObj.InvoiceId = this.modalEntryVoucher.InvoiceId;
    VoucherObj.InvoiceNumber = this.modalEntryVoucher.InvoiceNumber;
    VoucherObj.JournalNumber = this.modalEntryVoucher.JournalNumber;
    VoucherObj.Date = this._sharedService.date_TO_String(this.modalEntryVoucher.Date);
    VoucherObj.Notes = this.modalEntryVoucher.Notes;
    VoucherObj.InvoiceNotes = this.modalEntryVoucher.InvoiceNotes;
    VoucherObj.Type = this.modalEntryVoucher.Type;
    VoucherObj.InvoiceReference = this.modalEntryVoucher.InvoiceReference;
    VoucherObj.CostCenterId = this.modalEntryVoucher.CostCenterId;
    VoucherObj.DunCalc = this.modalEntryVoucher.DunCalc;
    VoucherObj.VoucherAdjustment = this.modalEntryVoucher.VoucherAdjustment;;
    VoucherObj.IsPost = false;
    VoucherObj.InvoiceValue = parseFloat(this.modalEntryVoucher.TotalDepit.replace(/,/g, ''));

    var input = { valid: true, message: "" };
    var totalDepit = 0;
    var totalCredit = 0;

    this.EntryVoucherDetailsRows.forEach((element: any, index: any) => {
      if (element.AccJournalid == null) {
        input.valid = false; input.message = "من فضلك أختر حساب "; return;
      }
      if (element.Amounttxt == null) {
        input.valid = false; input.message = "من فضلك أختر مبلغ صحيح"; return;
      }

      var VoucherDetailsObj: any = {};
      VoucherDetailsObj.LineNumber = (index + 1);
      VoucherDetailsObj.AccountId = element.AccJournalid;
      VoucherDetailsObj.Amount = element.Amounttxt;
      VoucherDetailsObj.CostCenterId = element.CostCenterId;
      VoucherDetailsObj.AccCalcExpen = element.AccCalcExpen;
      VoucherDetailsObj.AccCalcIncome = element.AccCalcIncome;
      VoucherDetailsObj.Notes = VoucherDetailsObj.Details = element.Notes;
      VoucherDetailsObj.InvoiceReference = element.InvoiceReference;
      VoucherDetailsObj.Type = this.modalEntryVoucher.Type;
      VoucherDetailsObj.IsPost = false;

      if (element.CreditDepitStatus == "D") {
        VoucherDetailsObj.Depit = parseFloat(element.Amounttxt ?? 0);
        VoucherDetailsObj.Credit = 0.00;
        totalDepit = totalDepit + VoucherDetailsObj.Depit;
      }
      else {
        VoucherDetailsObj.Credit = parseFloat(element.Amounttxt ?? 0);
        VoucherDetailsObj.Depit = 0.00;
        totalCredit = totalCredit + VoucherDetailsObj.Credit;
      }

      VoucherDetailsList.push(VoucherDetailsObj);
    });
    if (!input.valid) {
      this.toast.error(input.message); return;
    }
    //VoucherObj.VoucherDetails = VoucherDetailsList;
    VoucherObj.TransactionDetails = VoucherDetailsList;

    if (!(parseFloat(totalCredit.toString()).toFixed(2) == parseFloat(totalDepit.toString()).toFixed(2))) {
      this.toast.error("قيد غير متوازن", this.translate.instant("Message"));
    }
    this.disableButtonSave_EntryVoucher = true;
    setTimeout(() => { this.disableButtonSave_EntryVoucher = false }, 7000);
    if (this.modalEntryVoucher.WhichClick == 1) {
      this.openingEntrtyService.SaveOpeningVoucher(VoucherObj).subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));

          this.LoadDataEntryVoucher();

          this.resetEntryData();
          modal?.dismiss();
        }
        else { this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message")); }
      });
    }
    else if (this.modalEntryVoucher.WhichClick == 2) {
      this.openingEntrtyService.SaveandPostOpeningVoucher(VoucherObj).subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));
          this.LoadDataEntryVoucher();
          this.resetEntryData();
          modal?.dismiss();
        }
        else { this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message")); }
      });

    }
  }



  confirmEntryVoucher(modal: any) {
    this.openingEntrtyService.DeleteVoucher(this.RowEntryVouvherData.invoiceId).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));
        this.LoadDataEntryVoucher();
        modal?.dismiss();
      }
      else { this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message")); }
    });
  }
  InvoicesObjs: Invoices[] = [];
  invoice: any;
  public _invoices: Invoices;
  PostBackVouchers() {
    this.InvoicesObjs = [];
    this.InvoicesObjs.push(this.RowEntryVouvherData);

    var invoicesList: any = [];

    this.InvoicesObjs.forEach((element: any) => {
      this._invoices = new Invoices();
      this._invoices.invoiceId = element.invoiceId;
      this._invoices.type = element.type;
      invoicesList.push(this._invoices);
    });

    this._invoiceService.PostBackVouchers(invoicesList).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));
        this.InvoicesObjs = [];
        this.LoadDataEntryVoucher();
      }
      else { this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message")); }
    });
  }



  EntryVoucherPrintData: any = null;
  CustomData: any = {
    OrgImg: null,
  }
  resetCustomData() {
    this.EntryVoucherPrintData = null;
    this.CustomData = {
      OrgImg: null,
    }
  }

  PostVouchers(modal: any) {
    let parems = []
    parems.push(this.objOfInvoices.invoiceId)
    this.openingEntrtyService.PostVouchersCheckBox(parems).subscribe(
      (result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));
          this.LoadDataEntryVoucher()
          modal?.dismiss();
        }
        else { this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message")); }
      },
      (error) => {
        this.toast.error(this.translate.instant(error.reasonPhrase), this.translate.instant('Message'));
      }
    );


  }

  DailyVoucherReport(obj: any) {
    this.openingEntrtyService.OpeningVoucherReport(obj.invoiceId).subscribe(data => {
      // this.EntryVoucherPrintData = data;
      // if (this.EntryVoucherPrintData?.org_VD.logoUrl)
      //   this.CustomData.OrgImg = environment.PhotoURL + this.EntryVoucherPrintData?.org_VD.logoUrl;
      // else this.CustomData.OrgImg = null;
this.downloadFileUrl(data.reasonPhrase)



    });
  }

downloadFileUrl(file: any) {
    try
    {
      var link=environment.PhotoURL+file;
      window.open(link, '_blank');
    }
    catch (error)
    {
      this.toast.error("تأكد من الملف", this.translate.instant("Message"));
    }
  }
  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.EntryVoucherDataSource.filter = filterValue.trim().toLowerCase();
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

  saveOption(data: any) { }

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

  selectGoalForProject(index: any) { }

  addNewMission() { }

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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1
      }`;
  }

  existValue: any = false;

  selectedVoucher: any;
  sendToPrint(id?: any) {
    const printContents: any = window.document.getElementById(id)!.innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  }


  // +++++++++

  employees: any = [];
  addEmployee(index: any) {
    console.log(this.employees, index);

    this.employees?.push({
      amount: '',
      accountName: '',
      credit_debit: '',
      costCenter: '',
      Statement: '',
      referenceNumber: '',
    });
  }

  deleteEmployee(index: any) {
    this.employees?.splice(index, 1);
  }

  remeberOptions = [
    { ar: 'يومين', en: '2 days' },
    { ar: 'اسبوع', en: 'week' },
    { ar: 'شهر', en: 'month' },
  ];

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
