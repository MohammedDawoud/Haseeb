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
import { NgxPrintElementService } from 'ngx-print-element';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { EntryvoucherService } from 'src/app/core/services/acc_Services/entryvoucher.service';
import { InvoiceService } from 'src/app/core/services/acc_Services/invoice.service';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { VoucherFilterVM } from 'src/app/core/Classes/ViewModels/voucherFilterVM';
import { SharedService } from 'src/app/core/services/shared.service';
import { Invoices } from 'src/app/core/Classes/DomainObjects/invoices';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import printJS from 'print-js';
import 'hijri-date';
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import { PrintreportsService } from 'src/app/core/services/acc_Services/printreports.service';
import { RestApiService } from 'src/app/shared/services/api.service';
const hijriSafe = require('hijri-date/lib/safe');
const HijriDate = hijriSafe.default;
const toHijri = hijriSafe.toHijri;

@Component({
  selector: 'app-under-daily',
  templateUrl: './under-daily.component.html',
  styleUrls: ['./under-daily.component.scss'],
})
export class UnderDailyComponent implements OnInit {
  projects: any;

  title: any = {
    main: {
      name: {
        ar: 'الحسابات',
        en: 'Projects Management',
      },
      link: '/accounts',
    },
    sub: {
      ar: 'قيد يومية',
      en: 'Under daily',
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

  currentDate: any;

  selectedProject: any;
  selectedRow: any;

  selectAllValue = false;
  pathurl = environment.PhotoURL;
  projectDisplayedColumns: string[] = [
    'select',
    'BondNumber',
    'BondDate',
    'BondTotal',
    'RegistrationNumber',
    'BondCondition',
    'PostingDate',
    // 'BondAttachments',
    'operations',
  ];

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

  userG: any = {};

  startDate = new Date();
  endDate = new Date();
  constructor(
    private modalService: NgbModal,
    private _entryvoucherService: EntryvoucherService,
    private _invoiceService: InvoiceService,
    private _accountsreportsService: AccountsreportsService,
    private toast: ToastrService,
    private translate: TranslateService,
    private _sharedService: SharedService,
    private api: RestApiService,
    private print: NgxPrintElementService,
    private authenticationService: AuthenticationService,
    private _printreportsService: PrintreportsService
  ) {
    this.userG = this.authenticationService.userGlobalObj;

    this.LoadDataEntryVoucher();
    this.currentDate = new Date();
    this.api.lang.subscribe((res) => {
      this.lang = res;
    });
  }

  dataEntryVoucher: any = {
    filter: {
      enable: false,
      date: null,
      search_Number: null,
      invoiceNote: null,
      search_Input: null,
      DateFrom_P: null,
      DateTo_P: null,
      isSearch: false,
      StatusPost: null,
      SearchType: null,
      Desc: null,
      Type: 8,
      AllEntryVoucher: false,
    },
  };
  EntryVoucherDataSource = new MatTableDataSource();
  EntryVoucherSourceTemp: any = [];

  LoadDataEntryVoucher() {
    var _voucherFilterVM = new VoucherFilterVM();
    _voucherFilterVM.type = this.dataEntryVoucher.filter.Type;
    // _voucherFilterVM.voucherNo=this.dataEntryVoucher.filter.search_Number;
    // _voucherFilterVM.invoiceNote=this.dataEntryVoucher.filter.invoiceNote;
    if (
      this.dataEntryVoucher.filter.DateFrom_P != null &&
      this.dataEntryVoucher.filter.DateFrom_P != null
    ) {
      _voucherFilterVM.dateFrom = this.dataEntryVoucher.filter.DateFrom_P;
      _voucherFilterVM.dateTo = this.dataEntryVoucher.filter.DateTo_P;
      _voucherFilterVM.isChecked = true;
    } else {
      _voucherFilterVM.dateFrom = null;
      _voucherFilterVM.dateTo = null;
      _voucherFilterVM.isChecked = false;
    }
    if (this.dataEntryVoucher.filter.StatusPost > 0)
      _voucherFilterVM.isSearch = true;
    else _voucherFilterVM.isSearch = this.dataEntryVoucher.filter.isSearch;

    _voucherFilterVM.isPost = this.dataEntryVoucher.filter.StatusPost;
    var obj = _voucherFilterVM;
    this._entryvoucherService.GetAllVouchersNew(obj).subscribe((data) => {
      this.EntryVoucherDataSource = new MatTableDataSource(data);
      this.EntryVoucherSourceTemp = data;
      this.EntryVoucherDataSource.paginator = this.paginator;
      this.EntryVoucherDataSource.sort = this.sort;
    });
  }
  ResetRefresh() {
    if (this.showFilters == false) {
      this.dataEntryVoucher.filter.DateFrom_P = null;
      this.dataEntryVoucher.filter.DateTo_P = null;
      this.dataEntryVoucher.filter.date = null;
      this.dataEntryVoucher.filter.StatusPost = null;
      this.dataEntryVoucher.filter.search_Input = null;
      this.LoadDataEntryVoucher();
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    var tempsource = this.EntryVoucherSourceTemp;

    if(this.dataEntryVoucher.filter.SearchType==1)
    {
      if (filterValue) {
        tempsource = this.EntryVoucherSourceTemp.filter((d: any) => {
          return (d.invoiceNumber != null ? d.invoiceNumber.toString()?.trim().toLowerCase().indexOf(filterValue) !== -1 || !filterValue:"")
        });
      } 
      this.EntryVoucherDataSource = new MatTableDataSource(tempsource);
      this.EntryVoucherDataSource.paginator = this.paginator;
      this.EntryVoucherDataSource.sort = this.sort; 
    }
    else if(this.dataEntryVoucher.filter.SearchType==2)
    {
      if (filterValue) {
        tempsource = this.EntryVoucherSourceTemp.filter((d: any) => {
          return (d.journalNumber != null ? d.journalNumber.toString()?.trim().toLowerCase().indexOf(filterValue) !== -1 || !filterValue:"")
        });
      }  
      this.EntryVoucherDataSource = new MatTableDataSource(tempsource);
      this.EntryVoucherDataSource.paginator = this.paginator;
      this.EntryVoucherDataSource.sort = this.sort;
    }
    else if(this.dataEntryVoucher.filter.SearchType==3)
      {
        if (filterValue) {
          tempsource = this.EntryVoucherSourceTemp.filter((d: any) => {
            return (d.invoiceNotes != null ? d.invoiceNotes.toString()?.trim().toLowerCase().indexOf(filterValue) !== -1 || !filterValue:"")
          });
        }  
        this.EntryVoucherDataSource = new MatTableDataSource(tempsource);
        this.EntryVoucherDataSource.paginator = this.paginator;
        this.EntryVoucherDataSource.sort = this.sort;
      }
    
    else{
      this.EntryVoucherDataSource.filter = filterValue.trim().toLowerCase();
    }
  }
  CheckDate(event: any) {
    this.dataEntryVoucher.filter.isSearch = true;
    if (event != null) {
      this.dataEntryVoucher.filter.DateFrom_P =
        this._sharedService.date_TO_String(event[0]);
      this.dataEntryVoucher.filter.DateTo_P =
        this._sharedService.date_TO_String(event[1]);
      this.LoadDataEntryVoucher();
    } else {
      this.dataEntryVoucher.filter.DateFrom_P = null;
      this.dataEntryVoucher.filter.DateTo_P = null;
      this.LoadDataEntryVoucher();
    }
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
  EntryVouchertype: any;
  EntryVoucherSearchtype: any;

  OrganizationData: any;
  environmentPho: any;
  dateprint: any;
  datePrintJournals: any = new Date();
  lang: any = 'ar';

  ngOnInit(): void {
    this.EntryVouchertype = [
      { id: 1, name: { ar: 'تم الترحيل', en: 'Posted' } },
      { id: 2, name: { ar: 'غير مرحل', en: 'Not Posted' } },
    ];
    this.EntryVoucherSearchtype = [
      { id: 1, name: { ar: 'برقم السند', en: 'By Voucher Num' } },
      { id: 2, name: { ar: 'برقم القيد', en: 'By Journal Num' } },
      { id: 3, name: { ar: 'بالبيان', en: 'By Note' } },

    ];
    this.api.GetOrganizationDataLogin().subscribe((data: any) => {
      this.OrganizationData = data.result;
      this.dateprint =this._sharedService.date_TO_String(new Date());
      this.environmentPho =
        environment.PhotoURL + this.OrganizationData.logoUrl;
    });
  }

  load_CostCenter: any;
  FillCostCenterSelect() {
    this._invoiceService.FillCostCenterSelect().subscribe((data) => {
      this.load_CostCenter = data;
      let newItem = { id: 0, name: 'أختر' };
      this.CostCenterListDataSource = new MatTableDataSource(data);
      this.CostCenterListDataSource.paginator = this.paginatorCostCenter;
      this.CostCenterList = data;
      this.CostCenterListDataSourceTemp = data;
      this.CostCenterListDataSource.data.unshift(newItem);
    });
  }

  EntryVoucherPopup() {
    this.FillCostCenterSelect();
    this.FillSubAccountLoadTable();
    this.resetEntryData();
    this.GenerateEntryVoucherNumber();
    this.GetCostCenterMain();
    // this.FillCostCenterSelectTable();
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
          }
          if (element.credit < element.depit) {
            Credit = 0;
            Depit = parseFloat(element.depit);
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
    this.FillSubAccountLoadTable();
  }

  EntryVoucherDetailsRows: any = [];

  GenerateEntryVoucherNumber() {
    this._invoiceService
      .GenerateVoucherNumber(this.modalEntryVoucher.Type)
      .subscribe((data) => {
        this.modalEntryVoucher.InvoiceNumber = data.reasonPhrase;
        this.EntryVoucherDetailsRows = [];
        this.addEntryVoucherRow();
      });
  }

  ngAfterViewInit() {}
  confirmEntryVoucher() {
    this._entryvoucherService
      .DeleteVoucher(this.RowEntryVouvherData.invoiceId)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.LoadDataEntryVoucher();
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
  WhichTypeAddEditView: number = 1;

  RowEntryVouvherData: any;
  selectedAccountRowTable: any;
  selectedCostCenterRowTable: any;

  EntryVoucherModelPublic: any;
  open(content: any, data?: any, type?: any, idRow?: any, model?: any) {
    if (data && type == 'edit') {
      this.modalEntryVoucher = data;
    }
    if (idRow != null && type == 'AccountsListModal') {
      this.selectedAccountRowTable = idRow;
      this.FillSubAccountLoadTable();
    }
    if (idRow != null && type == 'CostCenterListModal') {
      this.selectedCostCenterRowTable = idRow;
      this.FillCostCenterSelect();
    }
    if (data) {
      this.RowEntryVouvherData = data;
    }
    if (type == 'EntryVoucherModal') {
      this.WhichTypeAddEditView = 1;
      this.EntryVoucherPopup();
    } else if (type == 'EditEntryVoucherModal') {
      this.WhichTypeAddEditView = 2;
      this.EditEntryVoucherPopup(data);
    } else if (type == 'ViewEntryVoucherModal') {
      this.WhichTypeAddEditView = 3;
      this.EditEntryVoucherPopup(data);
    } else if (type == 'accountingentry') {
      this.GetAllJournalsByInvID(data.invoiceId);
    } else if (type == 'postModal') {
      this.WhichPost = 1;
    } else if (type == 'postModalCheckbox') {
      this.WhichPost = 2;
    }

    if (type == 'SaveEntryVoucherConfirmModal') {
      this.EntryVoucherModelPublic = model;
    }

    this.modalService

      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
        centered:
          type == 'SaveEntryVoucherConfirmModal' ? true : type ? false : true,
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
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ShowImg(pho: any) {
    var img = environment.PhotoURL + pho;
    return img;
  }
  //----------------------btn----------------------------
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
    this._entryvoucherService
      .GetAllJournalsByDailyID(invid)
      .subscribe((data) => {
        this.AllJournalEntries = data.result;
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

  postbtn() {
    debugger;
    this.InvoicesIds = [];
    if (this.WhichPost == 2) {
      this.selection.selected.forEach((element: any) => {
        this.InvoicesIds.push(element.invoiceId);
      });
    } else {
      this.InvoicesIds.push(this.RowEntryVouvherData.invoiceId);
    }
    if (this.InvoicesIds) {
      this._invoiceService
        .PostVouchersCheckBox(this.InvoicesIds)
        .subscribe((result: any) => {
          if (result?.body?.statusCode == 200) {
            this.toast.success(result?.body?.reasonPhrase, 'رسالة');
            this.LoadDataEntryVoucher();
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

    this._invoiceService
      .PostBackVouchers(invoicesList)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.InvoicesObjs = [];
          this.LoadDataEntryVoucher();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  deleteEntryVoucherRow(idRow: any) {
    let index = this.EntryVoucherDetailsRows.findIndex(
      (d: { idRow: any }) => d.idRow == idRow
    );
    this.EntryVoucherDetailsRows.splice(index, 1);
    this.CalculateEntryVoucher();
  }

  disableButtonSave_EntryVoucher = false;
  AccountListdisplayedColumns: string[] = ['name'];
  CostCenterListdisplayedColumns: string[] = ['name'];
  CostCentercol: any = 'اختر';
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

  CostCenterListDataSource = new MatTableDataSource();
  CostCenterListDataSourceTemp: any;
  CostCenterList: any;
  @ViewChild('paginatorCostCenter') paginatorCostCenter!: MatPaginator;
  setCostCenterRowValue(element: any) {
    debugger;
    this.EntryVoucherDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == this.selectedCostCenterRowTable
    )[0].CostCenterId = element.id;
    this.EntryVoucherDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == this.selectedCostCenterRowTable
    )[0].CostCenterName = element.name == 'أختر' ? '' : element.name;
  }
  applyFilterCostCenterList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.CostCenterListDataSource.filter = filterValue.trim().toLowerCase();
  }

  //-----------------------------------------------------------------------------------

  AccountListDataSource = new MatTableDataSource();
  AccountListDataSourceTemp: any;
  AccountList: any;
  @ViewChild('paginatorAccount') paginatorAccount: MatPaginator;

  FillSubAccountLoadTable() {
    this._invoiceService.FillSubAccountLoadNotMain_Branch().subscribe((data) => {
      this.AccountListDataSource = new MatTableDataSource(data.result);
      this.AccountListDataSource.paginator = this.paginatorAccount;
      this.AccountList = data.result;
      this.AccountListDataSourceTemp = data.result;
    });
  }

  setAccountRowValue(element: any) {
    this.EntryVoucherDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == this.selectedAccountRowTable
    )[0].AccJournalid = element.id;
    this.EntryVoucherDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == this.selectedAccountRowTable
    )[0].accountJournaltxt = element.name;
  }
  applyFilterAccountsList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.AccountListDataSource.filter = filterValue.trim().toLowerCase();
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
  downloadFile(data: any) {
    try {
      var link = environment.PhotoURL + data.fileUrl;
      window.open(link, '_blank');
    } catch (error) {
      this.toast.error('تأكد من الملف', 'رسالة');
    }
  }
  //-----------------------------------------------------------------------------------
  saveEntryVoucher() {
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

    if (this.modalEntryVoucher.Date != null) {
      VoucherObj.Date = this._sharedService.date_TO_String(
        this.modalEntryVoucher.Date
      );
      const nowHijri = toHijri(this.modalEntryVoucher.Date);
      VoucherObj.HijriDate = this._sharedService.hijri_TO_String(nowHijri);
    }
    VoucherObj.Notes = this.modalEntryVoucher.Notes;
    VoucherObj.InvoiceNotes = this.modalEntryVoucher.InvoiceNotes;
    VoucherObj.Type = this.modalEntryVoucher.Type;
    // VoucherObj.InvoiceValue = this.modalEntryVoucher.VoucherValue;
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
      debugger;
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
    }, 10000);
    if (this.modalEntryVoucher.WhichClick == 1) {
      this._entryvoucherService
        .SaveDailyVoucher(VoucherObj)
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
              this._entryvoucherService
                .UploadPayVoucherImage(formData)
                .subscribe((result) => {
                  this.LoadDataEntryVoucher();
                });
            } else {
              this.LoadDataEntryVoucher();
            }
            this.resetEntryData();
            this.LoadDataEntryVoucher();
            this.EntryVoucherModelPublic?.dismiss();
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        });
    } else if (this.modalEntryVoucher.WhichClick == 2) {
      this._entryvoucherService
        .SaveandPostDailyVoucher(VoucherObj)
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
              this._entryvoucherService
                .UploadPayVoucherImage(formData)
                .subscribe((result) => {
                  this.LoadDataEntryVoucher();
                });
            } else {
              this.LoadDataEntryVoucher();
            }
            this.resetEntryData();
            this.EntryVoucherModelPublic?.dismiss();
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        });
    }
  }

  GetCostCenterMain() {
    this._entryvoucherService.GetBranch_Costcenter().subscribe((data) => {
      this.modalEntryVoucher.CostCenterId = data.result.costCenterId;
    });
  }
  GetCostCenterRow(index: any) {
    this._entryvoucherService.GetBranch_Costcenter().subscribe((data) => {
      this.EntryVoucherDetailsRows.filter(
        (a: { idRow: any }) => a.idRow == index
      )[0].CostCenterId = data.result.costCenterId;
      this.EntryVoucherDetailsRows.filter(
        (a: { idRow: any }) => a.idRow == index
      )[0].CostCenterName = data.result.costCenterName;
    });
  }

  onSort(event: any) {
    console.log(event);
  }
  // ############### send sms

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
    const numRows = this.EntryVoucherDataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.EntryVoucherDataSource.data);
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

  //-----------------------------Print-------------------------------------
  items: any = [1, 2, 3, 4, 5, 6, 7, 8];

  EntryVoucherPrintData: any = null;
  CustomData: any = {
    OrgImg: null,
    TotalCredit: 0,
    TotalDepit: 0,
  };
  resetCustomData() {
    this.EntryVoucherPrintData = null;
    this.CustomData = {
      OrgImg: null,
      TotalCredit: 0,
      TotalDepit: 0,
    };
  }

  DailyVoucherReport(obj: any) {
    this._entryvoucherService
      .DailyVoucherReport(obj.invoiceId)
      .subscribe((data) => {
        debugger;
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

        if (this.EntryVoucherPrintData?.org_VD.logoUrl)
          this.CustomData.OrgImg =
            environment.PhotoURL + this.EntryVoucherPrintData?.org_VD.logoUrl;
        else this.CustomData.OrgImg = null;
      });
  }

  PrintJournal() {
    this._printreportsService
      .PrintJournalsByDailyId(this.RowEntryVouvherData.invoiceId)
      .subscribe((data) => {
        var PDFPath = environment.PhotoURL + data.reasonPhrase;
        printJS({ printable: PDFPath, type: 'pdf', showModal: true });
      });
  }

  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }
  Printdiffrentvoucher() {
    var _voucherFilterVM = new VoucherFilterVM();
    _voucherFilterVM.type = this.dataEntryVoucher.filter.Type;
    // _voucherFilterVM.voucherNo=this.dataEntryVoucher.filter.search_Number;
    // _voucherFilterVM.invoiceNote=this.dataEntryVoucher.filter.invoiceNote;
    if (
      this.dataEntryVoucher.filter.DateFrom_P != null &&
      this.dataEntryVoucher.filter.DateFrom_P != null
    ) {
      _voucherFilterVM.dateFrom = this.dataEntryVoucher.filter.DateFrom_P;
      _voucherFilterVM.dateTo = this.dataEntryVoucher.filter.DateTo_P;
      _voucherFilterVM.isChecked = true;
    } else {
      _voucherFilterVM.dateFrom = null;
      _voucherFilterVM.dateTo = null;
      _voucherFilterVM.isChecked = false;
    }
    if (this.dataEntryVoucher.filter.StatusPost > 0)
      _voucherFilterVM.isSearch = true;
    else _voucherFilterVM.isSearch = this.dataEntryVoucher.filter.isSearch;

    _voucherFilterVM.isPost = this.dataEntryVoucher.filter.StatusPost;
    var obj = _voucherFilterVM;
    this._entryvoucherService.Printdiffrentvoucher(obj).subscribe((data) => {
      var PDFPath = environment.PhotoURL + data.reasonPhrase;
      printJS({ printable: PDFPath, type: 'pdf', showModal: true });
    });
  }

  //-------------------------------------------------------------
  selectedDateType = DateType.Hijri;
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

  PrintJournalsVyInvIdRetPurchase() {
    if (this.AllJournalEntries.length > 0) {
      this.print.print('reportaccountingentryModal', environment.printConfig);
    }
  }

  //#region
  //--------------------------------------------------

  dataSourceExportExcel: any = [];

  exportData() {
    debugger
    let x = [];
    this.dataSourceExportExcel= this.EntryVoucherDataSource.data;
    //this.dataSourceExportExcel=this.EntryVoucherSourceTemp
    for (let index = 0; index < this.dataSourceExportExcel.length; index++) {
      x.push({
        invoiceNumber: this.dataSourceExportExcel[index].invoiceNumber,
        date: this.dataSourceExportExcel[index].date,
        totalValue: parseFloat(this.dataSourceExportExcel[index].totalValue),
        journalNumber: this.dataSourceExportExcel[index].journalNumber,
        statusName: this.dataSourceExportExcel[index].statusName,
        postDate: this.dataSourceExportExcel[index].postDate,
      })
    }
    this.lang == "ar" ? this._accountsreportsService.customExportExcel(x, " قيد اليومية") :
    this._accountsreportsService.customExportExcel(x, "Daily Voucher");
}

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
  var InvoiceNum=this.modalEntryVoucher.InvoiceNumber;
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
    InvoiceId: 0,
    InvoiceNumber: InvoiceNum,
    JournalNumber: null,
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
    addUser: null,
    addDate: null,
    addedImg: null,
  };
  this.FillCostCenterSelect();
  this.FillSubAccountLoadTable();
  //this.GenerateEntryVoucherNumberForCopy();
}

GenerateEntryVoucherNumberForCopy() {
  this._invoiceService.GenerateVoucherNumber(this.modalEntryVoucher.Type).subscribe((data) => {
      this.modalEntryVoucher.InvoiceNumber = data.reasonPhrase;
    });
}

//#endregion
  //------------------------------------End-CopyData----------------------------------------------

}
