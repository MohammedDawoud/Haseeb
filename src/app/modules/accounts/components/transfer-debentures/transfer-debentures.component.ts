
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
import { DebentureService } from 'src/app/core/services/acc_Services/debenture.service';
const hijriSafe = require('hijri-date/lib/safe');
const HijriDate = hijriSafe.default;
const toHijri = hijriSafe.toHijri;

@Component({
  selector: 'app-transfer-debentures',
  templateUrl: './transfer-debentures.component.html',
  styleUrls: ['./transfer-debentures.component.scss']
})
export class TransferDebenturesComponent {
  title: any = {
    main: {
      name: {
        ar: 'الحسابات',
        en: 'Projects Management',
      },
      link: '/accounts',
    },
    sub: {
      ar: 'سند نقل',
      en: 'Transfer Debenture',
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
    // 'select',
    'BondNumber',
    'BondDate',
    'Qty',
    'FromStorehouseStr',
    // 'BondAttachments',
    'operations',
  ];

  modalDebenture: any = {
    DebentureId: 0,
    DebentureNumber: null,
    Type: 11,
    Date: new Date(),
    HijriDate: null,
    Notes: null,
    ServicesId: null,
    FromStorehouseId: null,
    ToStorehouseId: null,
    Qty: null,
    QtyText: null,
    BranchId: null,
    YearId: null,
    CostCenterId: null,
    addUser: null,
    addDate: null,
    addedImg: null,
  };

  resetDebentureData() {
    const DateHijri = toHijri(new Date());
    var DateGre = new HijriDate(
      DateHijri._year,
      DateHijri._month,
      DateHijri._date
    );
    DateGre._day = DateGre._date;
    this.modalDebenture = {
      DebentureId: 0,
      DebentureNumber: null,
      Type: 11,
      Date: new Date(),
      HijriDate: DateGre,
      Notes: null,
      ServicesId: null,
      FromStorehouseId: null,
      ToStorehouseId: null,
      Qty: null,
      QtyText: null,
      BranchId: null,
      YearId: null,
      CostCenterId: null,
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
    private _debentureService: DebentureService,
    private toast: ToastrService,
    private translate: TranslateService,
    private _sharedService: SharedService,
    private api: RestApiService,
    private print: NgxPrintElementService,
    private authenticationService: AuthenticationService,
    private _printreportsService: PrintreportsService
  ) {
    this.userG = this.authenticationService.userGlobalObj;

    this.LoadDataDebenture();
    this.currentDate = new Date();
    this.api.lang.subscribe((res) => {
      this.lang = res;
    });
  }

  dataDebentureVoucher: any = {
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
      Desc: null,
      Type: 11,
      AllEntryVoucher: false,
    },
  };
  DebentureDataSource = new MatTableDataSource();
  DebentureSourceTemp: any = [];

  LoadDataDebenture() {
    this._debentureService.GetAllDebentures(this.dataDebentureVoucher.filter.Type).subscribe((data) => {
      this.DebentureDataSource = new MatTableDataSource(data.result);
      this.DebentureSourceTemp = data.result;
      this.DebentureDataSource.paginator = this.paginator;
      this.DebentureDataSource.sort = this.sort;
    });
  }

  LoadDataDebentureSearch() {
    var _voucherFilterVM = new VoucherFilterVM();
    _voucherFilterVM.type = this.dataDebentureVoucher.filter.Type;
    // _voucherFilterVM.voucherNo=this.dataDebentureVoucher.filter.search_Number;
    // _voucherFilterVM.invoiceNote=this.dataDebentureVoucher.filter.invoiceNote;
    if (
      this.dataDebentureVoucher.filter.DateFrom_P != null &&
      this.dataDebentureVoucher.filter.DateFrom_P != null
    ) {
      _voucherFilterVM.dateFrom = this.dataDebentureVoucher.filter.DateFrom_P;
      _voucherFilterVM.dateTo = this.dataDebentureVoucher.filter.DateTo_P;
      _voucherFilterVM.isChecked = true;
    } else {
      _voucherFilterVM.dateFrom = null;
      _voucherFilterVM.dateTo = null;
      _voucherFilterVM.isChecked = false;
    }
    if (this.dataDebentureVoucher.filter.StatusPost > 0)
      _voucherFilterVM.isSearch = true;
    else _voucherFilterVM.isSearch = this.dataDebentureVoucher.filter.isSearch;

    _voucherFilterVM.isPost = this.dataDebentureVoucher.filter.StatusPost;
    var obj = _voucherFilterVM;
    this._debentureService.GetAllDebentures(obj).subscribe((data) => {
      this.DebentureDataSource = new MatTableDataSource(data);
      this.DebentureSourceTemp = data;
      this.DebentureDataSource.paginator = this.paginator;
      this.DebentureDataSource.sort = this.sort;
    });
  }
  ResetRefresh() {
    if (this.showFilters == false) {
      this.dataDebentureVoucher.filter.DateFrom_P = null;
      this.dataDebentureVoucher.filter.DateTo_P = null;
      this.dataDebentureVoucher.filter.date = null;
      this.dataDebentureVoucher.filter.StatusPost = null;
      this.dataDebentureVoucher.filter.search_Input = null;
      this.LoadDataDebenture();
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.DebentureDataSource.filter = filterValue.trim().toLowerCase();
  }
  CheckDate(event: any) {
    this.dataDebentureVoucher.filter.isSearch = true;
    if (event != null) {
      this.dataDebentureVoucher.filter.DateFrom_P =
        this._sharedService.date_TO_String(event[0]);
      this.dataDebentureVoucher.filter.DateTo_P =
        this._sharedService.date_TO_String(event[1]);
      this.LoadDataDebenture();
    } else {
      this.dataDebentureVoucher.filter.DateFrom_P = null;
      this.dataDebentureVoucher.filter.DateTo_P = null;
      this.LoadDataDebenture();
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
  OrganizationData: any;
  environmentPho: any;
  dateprint: any;
  datePrintJournals: any = new Date();
  lang: any = 'ar';

  ngOnInit(): void {
    this.api.GetOrganizationDataLogin().subscribe((data: any) => {
      this.OrganizationData = data.result;
      this.dateprint =this._sharedService.date_TO_String(new Date());
      this.environmentPho =
        environment.PhotoURL + this.OrganizationData.logoUrl;
    });
  }


  DebentureVoucherPopup() {
    debugger
    this.resetDebentureData();
    this.FillStorehouseSelect();
    this.FillCostCenterSelect();
    this.GenerateDebentureNumber();
  }

  EditDebentureVoucherPopup(data: any) {
    this.resetDebentureData();
    this.FillStorehouseSelect();
    this.FillCostCenterSelect();
    const DateHijri = toHijri(this._sharedService.String_TO_date(data.date));
    var DateGre = new HijriDate(
      DateHijri._year,
      DateHijri._month,
      DateHijri._date
    );
    DateGre._day = DateGre._date;

    this.modalDebenture = {


      DebentureId: data.debentureId,
      DebentureNumber: data.debentureNumber,
      Type: 11,
      Date: this._sharedService.String_TO_date(data.date),
      HijriDate: DateGre,
      Notes: data.notes,
      ServicesId: data.servicesId,
      FromStorehouseId: data.fromStorehouseId,
      ToStorehouseId: data.toStorehouseId,
      Qty: data. qty,
      QtyText: null,
      BranchId: null,
      YearId: null,
      CostCenterId: null,
      addUser: data.addUser,
      addDate: data.addDate,
      addedImg: data.addInvoiceImg,
    };
  }

  GenerateDebentureNumber() {
    this._debentureService
      .GenerateDebentureNumber(this.modalDebenture.Type)
      .subscribe((data) => {
        this.modalDebenture.DebentureNumber = data.reasonPhrase;
      });
  }

  ngAfterViewInit() {}
  confirmDebentureVoucher() {
    this._debentureService
      .DeleteDebenture(this.RowDebentureData.debentureId)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
             this.LoadDataDebenture();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      });
  }
  InvoicesIds: any = [];
  WhichPost: number = 1;
  WhichTypeAddEditView: number = 1;

  RowDebentureData: any;
  selectedAccountRowTable: any;
  selectedCostCenterRowTable: any;

  EntryVoucherModelPublic: any;
  open(content: any, data?: any, type?: any, idRow?: any, model?: any) {
    if (data && type == 'edit') {
      this.modalDebenture = data;
    }
    if (data) {
      this.RowDebentureData = data;
    }
    if (type == 'DebentureVoucherModal') {
      this.WhichTypeAddEditView = 1;
      this.DebentureVoucherPopup();
    } else if (type == 'EditDebentureVoucherModal') {
      this.WhichTypeAddEditView = 2;
      this.EditDebentureVoucherPopup(data);
    } else if (type == 'ViewDebentureVoucherModal') {
      this.WhichTypeAddEditView = 3;
      this.EditDebentureVoucherPopup(data);
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

  InvoicesObjs: Invoices[] = [];
  invoice: any;
  public _invoices: Invoices;


  disableButtonSave_EntryVoucher = false;
  AccountListdisplayedColumns: string[] = ['name'];
  CostCenterListdisplayedColumns: string[] = ['name'];
  CostCentercol: any = 'اختر';


  CostCenterListDataSource = new MatTableDataSource();
  CostCenterListDataSourceTemp: any;
  CostCenterList: any;
  @ViewChild('paginatorCostCenter') paginatorCostCenter!: MatPaginator;

  applyFilterCostCenterList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.CostCenterListDataSource.filter = filterValue.trim().toLowerCase();
  }

  //-----------------------------------------------------------------------------------

  AccountListDataSource = new MatTableDataSource();
  AccountListDataSourceTemp: any;
  AccountList: any;
  @ViewChild('paginatorAccount') paginatorAccount: MatPaginator;

  journalDebitNmRows = 0;
  journalCreditNmRows = 0;
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
    if (this.modalDebenture.Date==null || this.modalDebenture.Date=='') {
      this.toast.error('من فضلك أختر تاريخ', 'رسالة');return;
    }
    if (this.modalDebenture.DebentureNumber==null || this.modalDebenture.DebentureNumber=='') {
      this.toast.error('من فضلك تأكد كم رقم السند', 'رسالة');return;
    }
    if (this.modalDebenture.FromStorehouseId==null || this.modalDebenture.FromStorehouseId=='' || this.modalDebenture.FromStorehouseId==0) {
      this.toast.error('من فضلك أختر من مستودع', 'رسالة');return;
    }
    if (this.modalDebenture.ToStorehouseId==null || this.modalDebenture.ToStorehouseId=='' || this.modalDebenture.ToStorehouseId==0) {
      this.toast.error('من فضلك أختر الي مستودع', 'رسالة');return;
    }
    if (this.modalDebenture.ServicesId==null || this.modalDebenture.ServicesId=='') {
      this.toast.error('من فضلك أختر اسم الصنف', 'رسالة');return;
    }
    if (this.modalDebenture.Qty==null || this.modalDebenture.Qty=='') {
      this.toast.error('من فضلك أدخل الكمية', 'رسالة');return;
    }
    debugger
    if (this.modalDebenture.FromStorehouseId==this.modalDebenture.ToStorehouseId) {
      this.toast.error('لا يمكنك اختيار نفس المستودع', 'رسالة');return;
    }

    var VoucherObj: any = {};
    VoucherObj.DebentureId = this.modalDebenture.DebentureId;
    VoucherObj.DebentureNumber = this.modalDebenture.DebentureNumber;

    if (this.modalDebenture.Date != null) {
      VoucherObj.Date = this._sharedService.date_TO_String( this.modalDebenture.Date);
      const nowHijri = toHijri(this.modalDebenture.Date);
      VoucherObj.HijriDate = this._sharedService.hijri_TO_String(nowHijri);
    }
    VoucherObj.Notes = this.modalDebenture.Notes;
    VoucherObj.Type = this.modalDebenture.Type;
    VoucherObj.ServicesId = this.modalDebenture.ServicesId;
    VoucherObj.FromStorehouseId = this.modalDebenture.FromStorehouseId;
    VoucherObj.ToStorehouseId = this.modalDebenture.ToStorehouseId;
    VoucherObj.Qty = this.modalDebenture.Qty;

    this.disableButtonSave_EntryVoucher = true;
    setTimeout(() => {
      this.disableButtonSave_EntryVoucher = false;
    }, 7000);
    this._debentureService.SaveDebenture(VoucherObj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.LoadDataDebenture();
        this.resetDebentureData();
        this.EntryVoucherModelPublic?.dismiss();
      } else {
        this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant('Message'));
      }
    });
  }


  // ############### send sms

  modal?: BsModalRef;

  // selection in table

  selection = new SelectionModel<any>(true, []);
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.DebentureDataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.DebentureDataSource.data);
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
      .PrintJournalsByDailyId(this.RowDebentureData.invoiceId)
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
    _voucherFilterVM.type = this.dataDebentureVoucher.filter.Type;
    // _voucherFilterVM.voucherNo=this.dataDebentureVoucher.filter.search_Number;
    // _voucherFilterVM.invoiceNote=this.dataDebentureVoucher.filter.invoiceNote;
    if (
      this.dataDebentureVoucher.filter.DateFrom_P != null &&
      this.dataDebentureVoucher.filter.DateFrom_P != null
    ) {
      _voucherFilterVM.dateFrom = this.dataDebentureVoucher.filter.DateFrom_P;
      _voucherFilterVM.dateTo = this.dataDebentureVoucher.filter.DateTo_P;
      _voucherFilterVM.isChecked = true;
    } else {
      _voucherFilterVM.dateFrom = null;
      _voucherFilterVM.dateTo = null;
      _voucherFilterVM.isChecked = false;
    }
    if (this.dataDebentureVoucher.filter.StatusPost > 0)
      _voucherFilterVM.isSearch = true;
    else _voucherFilterVM.isSearch = this.dataDebentureVoucher.filter.isSearch;

    _voucherFilterVM.isPost = this.dataDebentureVoucher.filter.StatusPost;
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
      const DateHijri = toHijri(this.modalDebenture.Date);
      var DateGre = new HijriDate(
        DateHijri._year,
        DateHijri._month,
        DateHijri._date
      );
      DateGre._day = DateGre._date;
      this.modalDebenture.HijriDate = DateGre;
    } else {
      this.modalDebenture.HijriDate = null;
    }
  }
  ChangeEntryVoucherHijri(event: any) {
    if (event != null) {
      const DateGre = new HijriDate(event.year, event.month, event.day);
      const dayGreg = DateGre.toGregorian();
      this.modalDebenture.Date = dayGreg;
    } else {
      this.modalDebenture.Date = null;
    }
  }

  load_ServicePrice: any;
  FillCostCenterSelect() {
    this.load_ServicePrice=[];
    this._debentureService.FillAllServicePrice().subscribe((data) => {
      console.log(data);
      this.load_ServicePrice = data;
    });
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
    this.modalDebenture.FromStorehouseId = data.id;
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
