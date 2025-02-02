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

import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';

import { BehaviorSubject, Subscription } from 'rxjs';
import { ServiceAlertService } from 'src/app/core/services/acc_Services/service-alert.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Department } from 'src/app/core/Classes/DomainObjects/department';
import { DatePipe } from '@angular/common';
import { ServicesVM } from 'src/app/core/Classes/ViewModels/servicesVM';
import { SharedService } from 'src/app/core/services/shared.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-billing-services',
  templateUrl: './billing-services.component.html',
  styleUrls: ['./billing-services.component.scss'],
  providers: [DatePipe],
})
export class BillingServicesComponent implements OnInit {
  searchType: any;

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
      ar: ' تذكير الفواتير والخدمة',
      en: 'Billing and service reminders',
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
    'serviceNumber',
    'postPaid',
    'DateOfPublicationAD',
    'ChapterDateAD',
    'accountName',
    'operations',
  ];

  projectUsersColumns: string[] = ['name', 'responsibility'];
  projectTasksColumns: string[] = ['taskName', 'name', 'duration'];

  userPermissionsDataSource = new MatTableDataSource();

  projectGoalsDataSource = new MatTableDataSource();

  projectUsersDataSource = new MatTableDataSource();
  projectTasksDataSource = new MatTableDataSource();

  projectsDataSource = new MatTableDataSource();

  serviceList = new MatTableDataSource();

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

  startDate = new Date();
  endDate = new Date();
  constructor(
    private modalService: NgbModal,
    private _Service: ServiceAlertService,
    private toast: ToastrService,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private _sharedService: SharedService
  ) {
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();
    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
  }
  today: any = new Date();

  ngOnInit(): void {
    this.users = [
      { id: 1, Name: 'محمود نافع' },
      { id: 2, Name: 'محمود نافع' },
    ];
    this.GetAllServices();
    this.FillDepartmentSelectByType();
    this.FillBankSelect();
    this.FillAccountsSelect();
    var dd: any = this.today.getDate();
    var mm: any = this.today.getMonth() + 1;
    var yyyy: any = this.today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    this.today = yyyy + '-' + mm + '-' + dd;

    // this.delayedProjects = [
    //   {
    //     user: 'adwawd',
    //     customerName: 'adawdv',
    //     projectStatus: 4,
    //     startDate: new Date(),
    //     endDate: new Date(),
    //   },
    // ];
    // this.latedProjects = [
    //   {
    //     user: 'adwawd',
    //     customerName: 'adawdv',
    //     projectStatus: 0,
    //     startDate: new Date(),
    //     endDate: new Date(),
    //   },
    // ];

    // this.projects = [
    //   {
    //     serviceNumber: '000056',
    //     postPaid: '2023-06-13',
    //     DateOfPublicationAD: 'أجل',
    //     ChapterDateAD: 50,
    //     accountName: 50,
    //     progress: 50,
    //   },
    //   {
    //     serviceNumber: '000056',
    //     postPaid: '2023-06-13',
    //     DateOfPublicationAD: 'أجل',
    //     ChapterDateAD: 50,
    //     accountName: 50,
    //     progress: 50,
    //   },
    //   {
    //     serviceNumber: '000056',
    //     postPaid: '2023-06-13',
    //     DateOfPublicationAD: 'أجل',
    //     ChapterDateAD: 50,
    //     accountName: 50,
    //     progress: 50,
    //   },
    //   {
    //     serviceNumber: '000056',
    //     postPaid: '2023-06-13',
    //     DateOfPublicationAD: 'أجل',
    //     ChapterDateAD: 50,
    //     accountName: 50,
    //     progress: 50,
    //   },
    //   {
    //     serviceNumber: '000056',
    //     postPaid: '2023-06-13',
    //     DateOfPublicationAD: 'أجل',
    //     ChapterDateAD: 50,
    //     accountName: 50,
    //     progress: 50,
    //   },
    // ];

    // this.userPermissions = [
    //   {
    //     userName: 'adawdawd',
    //     watch: false,
    //     add: true,
    //     edit: true,
    //     delete: false,
    //   },
    //   {
    //     userName: 'adawdawd',
    //     watch: false,
    //     add: true,
    //     edit: true,
    //     delete: false,
    //   },
    //   {
    //     userName: 'adawdawd',
    //     watch: false,
    //     add: true,
    //     edit: true,
    //     delete: true,
    //   },
    //   {
    //     userName: 'adawdawd',
    //     watch: false,
    //     add: false,
    //     edit: true,
    //     delete: false,
    //   },
    //   {
    //     userName: 'adawdawd',
    //     watch: false,
    //     add: true,
    //     edit: true,
    //     delete: false,
    //   },
    //   {
    //     userName: 'adawdawd',
    //     watch: true,
    //     add: true,
    //     edit: true,
    //     delete: false,
    //   },
    //   {
    //     userName: 'adawdawd',
    //     watch: true,
    //     add: true,
    //     edit: true,
    //     delete: true,
    //   },
    // ];

    // this.projectsDataSource = new MatTableDataSource(this.projects);

    // this.userPermissionsDataSource = new MatTableDataSource(
    //   this.userPermissions
    // );

    // this.projectGoalsDataSource = new MatTableDataSource(this.projectGoals);

    // this.projectUsersDataSource = new MatTableDataSource(this.projectUsers);

    // this.projectTasksDataSource = new MatTableDataSource(this.projectTasks);
  }

  ngAfterViewInit() {
    // this.open(this.smartModal, null, 'smartModal');
  }
  //#region -------------------------------------------------- Billing rvice Alert -------------------------------------------
  // serviceList:any;

  date: any;
  enddate: any;
  servisedelted: any;
  modalDetails: any = {
    serviceId: null,
    number: null,
    departmentId: null,
    date: null,
    hijriDate: null,
    expireDate: null,
    expireHijriDate: null,
    accountId: null,
    bankId: null,
    notifyCount: null,
    repeatAlarm: null,
    recurrenceRateId: null,
    notes: null,
    attachmentUrl: null,
  };
  FilterModel: any = {
    departmentId: null,
    accountId: null,
    date: null,
    expireDate: null,
  };

  public uploadedFiles: Array<File> = [];

  GetAllServices() {
    this._Service.GetAllServices().subscribe((data) => {
      this.serviceList = new MatTableDataSource(data.result);
    });
  }
  searchservice() {
    var _service = new ServicesVM();
    _service.departmentId = this.FilterModel.departmentId;
    _service.accountId = this.FilterModel.accountId;
    _service.date =
      this.FilterModel.date == null
        ? null
        : this._sharedService.date_TO_String(this.FilterModel.date);
    _service.expireDate =
      this.FilterModel.expireDate == null
        ? null
        : this._sharedService.date_TO_String(this.FilterModel.expireDate);
    this._Service.Searchaservice(_service).subscribe((data) => {
      this.serviceList = new MatTableDataSource(data.result);
    });
  }
  servicesearchtext(event: Event) {
    debugger;
    const filterValue = (event.target as HTMLInputElement).value;
    this.serviceList.filter = filterValue.trim().toLowerCase();
  }
  refreshsearch() {
    this.FilterModel.departmentId = null;
    this.FilterModel.accountId = null;
    this.FilterModel.expireDate = null;
    this.FilterModel.date = null;

    this.GetAllServices();
  }
  AccountSelectList: any;
  FillAccountsSelect() {
    this._Service.FillAccountsSelect().subscribe((data) => {
      this.AccountSelectList = data;
    });
  }

  Saveservice(modal: any) {
    debugger;
    if (
      this.modalDetails.number == null ||
      this.modalDetails.departmentId == null ||
      this.modalDetails.date == null ||
      this.modalDetails.expireDate == null ||
      this.modalDetails.accountId == null
    ) {
      this.toast.error(
        'من فضلك اكمل البيانات',
        this.translate.instant('Message')
      );
      return;
    }
    const formData = new FormData();
    formData.append('postedFiles', this.uploadedFiles[0]);
    formData.append('ServiceId', this.modalDetails.serviceId ?? '0');
    formData.append('Number', this.modalDetails.number);
    formData.append('DepartmentId', this.modalDetails.departmentId ?? '0');
    this.date = this.datePipe.transform(this.modalDetails.date, 'YYYY-MM-dd');
    formData.append('Date', this.date);
    formData.append('HijriDate', this.modalDetails.hijriDate);
    this.enddate = this.datePipe.transform(
      this.modalDetails.expireDate,
      'YYYY-MM-dd'
    );
    formData.append('ExpireDate', this.enddate);
    formData.append('ExpireHijriDate', this.modalDetails.expireHijriDate);

    formData.append('AccountId', this.modalDetails.accountId ?? '0');
    formData.append('BankId', this.modalDetails.bankId ?? '0');
    formData.append('NotifyCount', this.modalDetails.notifyCount);
    formData.append('RepeatAlarm', this.showTable.toString());
    //if(checkAlarm.checked)
    //    formData.RecurrenceRateId = $('#RecurrenceRateId').val();
    //else
    //    formData.RecurrenceRateId = null;
    formData.append(
      'RecurrenceRateId',
      this.modalDetails.recurrenceRateId ?? '0'
    );
    formData.append('Notes', this.modalDetails.notes);

    this._Service.SaveService(formData).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.GetAllServices();
          modal.dismiss();
          this.refreshdepartment();
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
  }

  refresservice() {
    this.modalDetails.serviceId = 0;
    this.modalDetails.number = null;
    this.modalDetails.departmentId = null;
    this.modalDetails.date = null;
    this.modalDetails.hijriDate = null;
    this.modalDetails.expireDate = null;
    this.modalDetails.EndDate = null;
    this.modalDetails.expireHijriDate = null;
    this.modalDetails.accountId = null;
    this.modalDetails.bankId = null;
    this.showTable = false;
    this.modalDetails.notifyCount = null;
    this.modalDetails.repeatAlarm = null;

    this.modalDetails.recurrenceRateId = null;
    this.modalDetails.notes = null;
    this.modalDetails.attachmentUrl = null;
  }
  editservice(data: any) {
    debugger;
    this.modalDetails.serviceId = data.serviceId;
    this.modalDetails.number = data.number;
    this.modalDetails.departmentId = data.departmentId;
    this.modalDetails.date = new Date(data.date);
    this.modalDetails.hijriDate = data.hijriDate;
    this.modalDetails.expireDate = new Date(data.expireDate);
    this.modalDetails.EndDate = data.EndDate;
    this.modalDetails.expireHijriDate = data.expireHijriDate;
    this.modalDetails.accountId = data.accountId;
    this.modalDetails.bankId = data.bankId;
    this.showTable = false;
    this.modalDetails.notifyCount = data.notifyCount;
    this.modalDetails.repeatAlarm = data.repeatAlarm;

    this.modalDetails.recurrenceRateId = data.recurrenceRateId;
    this.modalDetails.notes = data.notes;
    this.modalDetails.attachmentUrl = data.attachmentUrl;
  }

  Deleteservice(modal: any) {
    debugger;
    this._Service.DeleteService(this.servisedelted).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.GetAllServices();
          modal.dismiss();
          this.refresservice();
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
  }

  todayy: any = new Date();

  getnotidate(data: any) {
    let NotifyDay = new Date(data.expiredDate);
    NotifyDay.setDate(NotifyDay.getDate() - data.notifyCount);
    return NotifyDay;
  }

  //#endregion ---------------------------------------------------------------------------------------------------------------

  //#region  ------------------------------------Department----------------------------------------------
  searchdepartment: any = '';
  departmentlist: any;
  departmentdeleted: any;
  departmentselectedlist: any;
  departmentmodel: any = {
    departmentId: 0,
    departmentNameAr: null,
    departmentNameEn: null,
    type: null,
  };
  GetAllDepartmentbyType() {
    this._Service
      .GetAllDepartmentbyType(2, this.searchdepartment)
      .subscribe((data) => {
        this.departmentlist = data.result;
      });
  }
  FillDepartmentSelectByType() {
    this._Service.FillExternalDepartmentSelect().subscribe((data) => {
      debugger;
      this.departmentselectedlist = data;
    });
  }
  SaveDepartment() {
    debugger;
    if (
      this.departmentmodel.departmentNameAr == null ||
      this.departmentmodel.departmentNameAr == '' ||
      this.departmentmodel.departmentNameEn == null ||
      this.departmentmodel.departmentNameEn == ''
    ) {
      this.toast.error(
        'من فضلك اكمل البيانات',
        this.translate.instant('Message')
      );
      return;
    }
    var _department = new Department();
    _department.departmentId = this.departmentmodel.departmentId;
    _department.departmentNameAr = this.departmentmodel.departmentNameAr;
    _department.departmentNameEn = this.departmentmodel.departmentNameEn;
    _department.type = 2;

    this._Service.SaveDepartment(_department).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.GetAllDepartmentbyType();
          this.FillDepartmentSelectByType();
          this.refreshdepartment();
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
  }
  DeleteVoucher(data: any) {
    debugger;
    this._Service.DeleteDepartment(data.departmentId).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.GetAllDepartmentbyType();
          this.FillDepartmentSelectByType();
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
  }
  refreshdepartment() {
    this.departmentmodel.departmentId = 0;
    this.departmentmodel.departmentNameAr = null;
    this.departmentmodel.departmentNameEn = null;
    this.departmentmodel.type = null;
  }
  setdatatoedit(data: any) {
    this.departmentmodel.departmentId = data.departmentId;
    this.departmentmodel.departmentNameAr = data.departmentNameAr;
    this.departmentmodel.departmentNameEn = data.departmentNameEn;
    this.departmentmodel.type = 2;
  }

  //#endregion-------------------------------------------------------------------------------------------
  ////////////////////////////////////// Banks ////////////////////////////////////

  //#region Banks
  BanksList: any;
  GetAllBanks() {
    this._Service.GetAllBanks().subscribe(
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
      this._Service.Savebanks(prames).subscribe(
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
    this._Service.DeleteBanks(this.DeletebanksId).subscribe(
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
  BankSelectList: any;
  FillBankSelect() {
    this._Service.FillBankSelect().subscribe((data) => {
      this.BankSelectList = data;
    });
  }
  //#endregion
  //////////////////////////////////////////////////////////////////////////

  open(content: any, data?: any, type?: any) {
    if (data && type == 'edit') {
      this.modalDetails = data;
      this.modalDetails['id'] = 1;
    } else if (type == 'department') {
      this.GetAllDepartmentbyType();
    } else if (type == 'AddModalBanks') {
      this.GetAllBanks();
    } else if (type == 'deleteBank') {
      this.DeletebanksId = data.bankId;
    } else if (type == 'deletedservice') {
      this.servisedelted = data.serviceId;
    } else if (type == 'editservice') {
      this.editservice(data);
    }

    this.modalService;
    this.modalService
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

  private getDismissReason(reason: any, type?: any): string {
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

  addInvoice() {}

  editInvoice() {}

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  downattach(data: any) {
    var link = environment.PhotoURL + data;
    window.open(link, '_blank');
  }
}
