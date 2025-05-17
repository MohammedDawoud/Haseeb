import {
  Component,
  HostListener,
  Injectable,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { BehaviorSubject, take } from 'rxjs';
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import { ProjectService } from 'src/app/core/services/pro_Services/project.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ProjectstatusService } from 'src/app/core/services/pro_Services/projectstatus.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { environment } from 'src/environments/environment';
import { ProjectVM } from 'src/app/core/Classes/ViewModels/projectVM';
import { PhasestaskService } from 'src/app/core/services/pro_Services/phasestask.service';
import { ProjectsettingService } from 'src/app/core/services/pro_Services/projectsetting.service';
import * as go from 'gojs';
import { InvoiceService } from 'src/app/core/services/acc_Services/invoice.service';
import { ProjectFiles } from 'src/app/core/Classes/DomainObjects/projectFiles';
import { FileuploadcenterService } from 'src/app/core/services/pro_Services/fileuploadcenter.service';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import 'hijri-date';
import { RestApiService } from 'src/app/shared/services/api.service';
import { DebentureService } from 'src/app/core/services/acc_Services/debenture.service';
const hijriSafe = require('hijri-date/lib/safe');
const HijriDate = hijriSafe.default;
const toHijri = hijriSafe.toHijri;

// import {  BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-track-projects',
  templateUrl: './track-projects.component.html',
  styleUrls: ['./track-projects.component.scss'],
})
export class TrackProjectsComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent | any;

  columns: any = [];

  isEditable: any = {};

  info: any = [
    {
      title: {
        ar: 'مهام مسندة لقسم',
        en: '  Assigned tasks to a department',
      },
      img: 'Path 33991@2x',
      color: '#f1854e',
    },
  ];

  @ViewChild('paginatorServices') paginatorServices!: MatPaginator;

  projects: any;
  openBox: any = false;
  boxId: any;
  @ViewChild('SmartFollower') smartModal: any;
  @ViewChild('NewInvoiceModal') newInvoiceModal: any;

  title: any = {
    main: {
      name: {
        ar: 'ادارة المشاريع',
        en: 'Projects Management',
      },
      link: '/projects',
    },
    sub: {
      ar: 'حركة المشاريع',
      en: 'track projects',
    },
  };

  selectedUser: any;
  users: any;

  closeResult = '';

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
  dataSource: MatTableDataSource<any>;
  projectsDataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  //@ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('paginatorProject') paginatorProject!: MatPaginator;

  @ViewChild('paginatortaketask') paginatortaketask!: MatPaginator;

  showStats = false;
  showFilters = false;

  currentDate: any;

  selectedProject: any;
  selectedRow: any;

  selectAllValue = false;

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
  projectRequirementsColumns: string[] = ['File Name', 'cost', 'Attachments'];
  projectDisplayedColumns: string[] = [
    'projectNo',
    'customer',
    'projectType',
    'projectName',
    'subProjectType',
    'stage',
    'subStage',
    'user',
    'Region',
    'contractNumber',
    'projectDuration',
    'operations',
  ];

  projectUsersColumns: string[] = ['name', 'responsibility'];
  projectTasksColumns: string[] = ['taskName', 'name', 'duration'];

  projectGoalsDataSource = new MatTableDataSource();
  projectRequirementsDataSource = new MatTableDataSource();

  projectUsersDataSource = new MatTableDataSource();
  projectTasksDataSource = new MatTableDataSource();

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

  startDate = new Date();
  endDate = new Date();

  projectDetails: any;
  date = new Date();
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
      // FileUploadValidators.accept(['image/*']),
      FileUploadValidators.filesLimit(1),
    ]
  );

  expected_project_duration = new Date();

  expected_end_date = new Date();

  // steps
  firstFormGroup = this._formBuilder.group({
    contractNo: ['', Validators.required],
    date: [''],
    dateHijri: [''],
    office: [''],
    represents: [''],
    as: [''],
    customer: [''],
    project: [''],
    iDNumber: [''],
    check: [''],
    offerPrice: [''],
  });
  secondFormGroup = this._formBuilder.group({
    include_tax: [''],
  });
  thredFormGroup = this._formBuilder.group({
    secondCtrl: [''],
  });

  offerPriceChecked: any;

  offerServices: any = [];
  serviceListDataSource_Offer = new MatTableDataSource();

  assignedTasks: any = [];

  servicesList_Offer: any;
  servicesListdisplayedColumns: string[] = ['name', 'price'];

  assignedTasksDisplayedColumns: string[] = [
    'name',
    'duration',
    'remind',
    'stepName',
    'projectNo',
    'clientName',
    'operations',
  ];

  selectedServiceRow: any;

  serviceDetails: any;

  bands: any = [];
  participants: any = [];

  selectedDate: any;
  selectedDateType = DateType.Hijri;

  addProjectType = false;

  contractWithInstallments = false;

  installments: any = [
    {
      batchNumber: 'asdasd',
      BatchDate: 'asdasd',
      BatchDateHijri: 'asdasd',
      amount: 'asdasd',
      Tax: 'asdasd',
      total: 'asdasd',
    },
  ];

  @ViewChild('noticModal') noticModal!: any;
  @ViewChild('projectDetailsModal') projectDetailsModal!: any;

  showPrice: any;

  userG: any = {};
  IsLoadedBefore = 'false';
  constructor(
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _projectstatusService: ProjectstatusService,
    private _phasestaskService: PhasestaskService,
    private _projectsettingService: ProjectsettingService,
    private _projectService: ProjectService,
    private authenticationService: AuthenticationService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private translate: TranslateService,
    private _invoiceService: InvoiceService,
    private _debentureService: DebentureService,
    private _fileuploadcenterService: FileuploadcenterService,
    private api: RestApiService
  ) {
    this.userG = this.authenticationService.userGlobalObj;
    console.log(this.userG);
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();
    var IsLoaded = localStorage.getItem('IsLoadedBefore') || 'false';
    if (IsLoaded == 'true') {
      this.IsLoadedBefore = 'true';
    } else {
      this.IsLoadedBefore = 'false';
      localStorage.setItem('IsLoadedBefore', 'true');
    }
  }
  WhatsAppData: any={
    sendactivation:false,
    sendactivationOffer:false,
    sendactivationProject:false,
    sendactivationSupervision:false,
  };
  ngOnInit(): void {
    this.TaskType = [
      { id: 1, name: { ar: 'ساعة', en: 'Hour' } },
      { id: 2, name: { ar: 'يوم', en: 'Day' } },
    ];
    this.nodeDataArray = [];
    this.linkDataArray = [];
    this.model2 = new go.GraphLinksModel(
      this.nodeDataArray,
      this.linkDataArray
    );
    this._sharedService.GetWhatsAppSetting().subscribe((data: any) => {
      if(data?.result!=null){this.WhatsAppData=data?.result;}
      else{this.WhatsAppData={sendactivation:false,sendactivationOffer:false,sendactivationProject:false,sendactivationSupervision:false,};}
    });
    this.GetTasksWithoutUser();
    if (this.IsLoadedBefore == 'false') {
      this.getSmartFollowerData_Perm();
    }
    this.GetAllProjects();
    this.GetProjectVM();
    this.FillReasonsSelect();
    this.getorgdata();
    this.users = [
      { id: 1, Name: 'محمود نافع' },
      { id: 2, Name: 'محمود نافع' },
      { id: 3, Name: 'محمود نافع' },
      { id: 4, Name: 'محمود نافع' },
      { id: 5, Name: 'محمود نافع' },
      { id: 6, Name: 'محمود نافع' },
      { id: 7, Name: 'محمود نافع' },
      { id: 8, Name: 'محمود نافع' },
      { id: 9, Name: 'محمود نافع' },
      { id: 10, Name: 'محمود نافع' },
      { id: 11, Name: 'محمود نافع' },
    ];

    this.projectUsersDataSource = new MatTableDataSource(this.projectUsers);

    //this.projectTasksDataSource = new MatTableDataSource(this.projectTasks);

    this.servicesList_Offer = [
      {
        id: 10,
        name: 'awdawd',
        unit: '12',
        amount: 451,
        price: 35200,
        vatTax: 10,
        taxes: 20,
      },
      {
        id: 11,
        name: 'bsdvsv',
        unit: '12',
        amount: 451,
        price: 35200,
        vatTax: 10,
        taxes: 20,
      },
      {
        id: 12,
        name: 'gergerg',
        unit: '12',
        amount: 451,
        price: 35200,
        vatTax: 10,
        taxes: 20,
      },
      {
        id: 13,
        name: 'awdawd',
        unit: '12',
        amount: 451,
        price: 35200,
        vatTax: 10,
        taxes: 20,
      },
      {
        id: 14,
        name: 'dfbdfbf',
        unit: '12',
        amount: 451,
        price: 35200,
        vatTax: 10,
        taxes: 20,
      },
      {
        id: 15,
        name: 'zccszscz',
        unit: '12',
        amount: 451,
        price: 35200,
        vatTax: 10,
        taxes: 20,
      },
    ];

    this.serviceListDataSource_Offer = new MatTableDataSource(
      this.servicesList_Offer
    );
  }

  ngAfterViewInit() {
    // if(this.IsLoadedBefore=="false"){
    //   this.open(this.smartModal, null, 'smartModal');
    // }
  }

  //---------------------------SmartFollower--------------------------------------
  //#region
  ExcludedProjects: any = [];
  delayedProjects: any = [];
  latedProjects: any = [];

  RowData: any;
  dataFinish: any = {
    fini_radio: '',
    fini_Reason: '',
    fini_ReasonId: null,
  };
  extendData: any = {
    EndDate: null,
    TimesCount: 0,
  };
  skipData: any = {
    TimesCount: 0,
  };

  getSmartFollowerData_Admin() {
    this._projectService
      .GetAllProjectsmartfollowforadmin()
      .subscribe((data) => {
        data.forEach((element: any) => {
          var contain = this.ExcludedProjects.includes(element.projectId);
          if (contain == false) {
            var percnt = this.calculateprojectlates(
              element.projectDate,
              element.projectExpireDate
            );
            if (percnt > 70 && percnt <= 100) {
              this.delayedProjects.push(element);
            } else if (percnt > 100) {
              this.latedProjects.push(element);
            }
          }
        });
        if (this.delayedProjects.length > 0 || this.latedProjects.length > 0) {
          if (this.IsLoadedBefore == 'false') {
            this.open(this.smartModal, null, 'smartModal');
          }
        }
      });
  }
  getSmartFollowerData() {
    debugger;
    this._projectService.GetAllProjectsmartfollow().subscribe((data) => {
      data.forEach((element: any) => {
        var contain = this.ExcludedProjects.includes(element.projectId);
        if (contain == false) {
          var percnt = this.calculateprojectlates(
            element.projectDate,
            element.projectExpireDate
          );
          if (percnt > 70 && percnt <= 100) {
            this.delayedProjects.push(element);
          } else if (percnt > 100) {
            this.latedProjects.push(element);
          }
        }
      });
      if (this.delayedProjects.length > 0 || this.latedProjects.length > 0) {
        if (this.IsLoadedBefore == 'false') {
          this.open(this.smartModal, null, 'smartModal');
        }
      }
    });
  }
  getSmartFollowerData_Perm() {
    this.delayedProjects = [];
    this.latedProjects = [];
    this.modalService.dismissAll();
    if (this.userG.userPrivileges.includes(111028)) {
      this.getSmartFollowerData_Admin();
    } else {
      this.getSmartFollowerData();
    }
  }
  calculateprojectlates(stdate: any, endate: any) {
    var date1 = new Date(endate);
    var date2 = new Date();
    var date3 = new Date(stdate);
    var Difference_In_Time = date2.getTime() - date3.getTime();
    var Difference_In_Time2 = date1.getTime() - date3.getTime();
    var Difference_In_Days = parseInt(
      (Difference_In_Time / (1000 * 3600 * 24)).toString()
    );
    var Difference_In_Days2 = parseInt(
      (Difference_In_Time2 / (1000 * 3600 * 24)).toString()
    );
    var perc = Difference_In_Days / Difference_In_Days2;
    var percentage = parseInt((perc * 100).toString());
    return percentage;
  }

  calculatenumberoflatedate(endate: any) {
    var monthnum = 0,
      daynum = 0,
      fulltime = '',
      monthstr = '',
      daystr = '';
    var date1 = new Date(endate);
    var date2 = new Date();
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = parseInt(
      (Difference_In_Time / (1000 * 3600 * 24)).toString()
    );
    monthnum = parseInt((Difference_In_Days / 30).toString());
    daynum = parseInt((Difference_In_Days % 30).toString());
    if (monthnum > 0) {
      monthstr = monthnum + 'شهر';
    } else {
      monthstr = '';
    }
    if (daynum > 0) {
      daystr = daynum + 'يوم';
    } else {
      daystr = '';
    }
    fulltime = monthstr + daystr;
    return fulltime;
  }
  getRowData(data: any) {
    this.extendData = {
      EndDate: null,
      TimesCount: data.plustimecount ?? 0,
    };
    this.skipData = {
      TimesCount: data.skipCount ?? 0,
    };
    this.RowData = data;
  }
  finishProject(modal: any) {
    var reatxt = '';
    if (this.dataFinish.fini_radio == '1') reatxt = 'مكتمل';
    else if (this.dataFinish.fini_radio == '2') reatxt = 'ملغاه';
    else if (this.dataFinish.fini_radio == '3') reatxt = 'متوقف';
    else {
      reatxt = '';
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    if (this.dataFinish.fini_ReasonId == null) {
      this.toast.error('من فضلك أختر السبب ', 'رسالة');
      return;
    }
    var type = 0;
    var whichClickDesc = 4;
    if (this.checkedEmail == true) type = 1;
    else if (this.checkedPhone == true) type = 2;
    else if (this.checkedEmail == true && this.checkedPhone == true) type = 3;
    this._projectstatusService
      .FinishProject(
        this.RowData.projectId,
        this.dataFinish.fini_ReasonId,
        reatxt,
        this.dataFinish.fini_radio,
        reatxt,
        this._sharedService.date_TO_String(new Date()),
        type,
        whichClickDesc
      )
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.getSmartFollowerData_Perm();
          //getPtoject();
          modal?.dismiss();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  confirmDelete() {
    this._projectstatusService
      .DeleteProject(this.RowData.projectId)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.getSmartFollowerData_Perm();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  extend() {
    if (this.extendData.EndDate == null) {
      this.toast.error('اختر تاريخ انهاء المشروع', 'رسالة');
      return;
    }
    if (this.extendData.EndDate.getTime() < new Date().getTime()) {
      this.toast.error('لا يمكنك اختيار تاريخ اقل من تاريخ اليوم', 'رسالة');
      return;
    }
    this._projectService
      .UpdateProjectEnddate(
        this.RowData.projectId,
        this._sharedService.date_TO_String(this.extendData.EndDate)
      )
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.getSmartFollowerData_Perm();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  skip() {
    this._projectService
      .Updateskiptime(this.RowData.projectId)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.ExcludedProjects.push(parseInt(this.RowData.projectId));
          this.getSmartFollowerData_Perm();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  //#endregion
  //---------------------------------------------------------------------
  //-------------------------------stastistc--------------------------
  //#region
  ProjectStat: any = {
    GetProjectsStoppedVMCount: 0,
    GetProjectsWithoutContractVMVMCount: 0,
    GetLateProjectsVMCount: 0,
    GetProjectsWithProSettingVMCount: 0,
    GetProjectsWithoutProSettingVMCount: 0,
    GetProjectsSupervisionVMVMCount: 0,
  };

  GetProjectVM() {
    this._projectService.GetProjectVM().subscribe((data) => {
      this.ProjectStat.GetProjectsStoppedVMCount =
        data.getProjectsStoppedVMCount;
      this.ProjectStat.GetProjectsWithoutContractVMVMCount =
        data.getProjectsWithoutContractVMVMCount;
      this.ProjectStat.GetLateProjectsVMCount = data.getLateProjectsVMCount;
      this.ProjectStat.GetProjectsWithProSettingVMCount =
        data.getProjectsWithProSettingVMCount;
      this.ProjectStat.GetProjectsWithoutProSettingVMCount =
        data.getProjectsWithoutProSettingVMCount;
      this.ProjectStat.GetProjectsSupervisionVMVMCount =
        data.getProjectsSupervisionVMVMCount;
    });
  }
  //#endregion
  //-----------------------------------------------------

  //----------------Project Dash -----------------------
  //#region

  projectsDataSourceTemp: any = [];
  GetAllProjects() {
    this._projectService.GetAllProjects().subscribe((data) => {
      this.projectsDataSource = new MatTableDataSource(data);
      this.projectsDataSourceTemp = data;
      this.projectsDataSource.paginator = this.paginatorProject;
      //this.projectsDataSource.sort = this.sort;
    });
  }
  ColorProject(mData: any) {
    if (Object.keys(mData).length === 0) return '';
    var today = this._sharedService.date_TO_String(new Date());
    if (
      mData.firstProjectExpireDate != null &&
      mData.firstProjectDate != null
    ) {
      if (mData.firstProjectDate < today) {
        if (mData.firstProjectExpireDate < today) {
          return 'text-red-500 fw-bold';
        } else if (mData.firstProjectExpireDate == today) {
        } else {
          var date1 = new Date(mData.firstProjectExpireDate);
          var date2 = new Date(today);
          var date3 = new Date(mData.firstProjectDate);
          var Difference_In_Time = date2.getTime() - date3.getTime();
          var Difference_In_Time2 = date1.getTime() - date3.getTime();

          var Difference_In_Days = parseInt(
            (Difference_In_Time / (1000 * 3600 * 24)).toString()
          );
          var Difference_In_Days2 = parseInt(
            (Difference_In_Time2 / (1000 * 3600 * 24)).toString()
          );

          if (0.7 < Difference_In_Days / Difference_In_Days2) {
            return 'text-yellow-500 fw-bold';
          }
        }
      }
    }
    return '';
  }
  backgroungColor(row: any) {
    if (Object.keys(row).length === 0) return '';
    if (!(row.stopProjectType != 1)) {
      return 'stopProjectcolor';
    } else if (row.flag == 1) {
      return 'flagProjectcolor';
    }
    return '';
  }
  AssignedTasksDataSource: MatTableDataSource<any> = new MatTableDataSource([
    {},
  ]);

  AssignedTaskCount: any = 0;
  GetTasksWithoutUser() {
    this._projectService
      .GetTasksWithoutUser(this.userG.departmentId)
      .subscribe((data) => {
        this.AssignedTaskCount = data.result.length;
        this.AssignedTasksDataSource = new MatTableDataSource(data.result);
        this.AssignedTasksDataSource.paginator = this.paginatortaketask;
      });
  }
  getRemainig(element: any) {
    var result = [];
    if (element?.remaining > 0) {
      var value = element?.remaining;
      var units: any = {
        سنة: 24 * 60 * 365,
        شهر: 24 * 60 * 30,
        اسبوع: 24 * 60 * 7,
        يوم: 24 * 60,
        ساعة: 1 * 60,
        دقيقة: 1,
      };
      for (var name in units) {
        var p = Math.floor(value / units[name]);
        if (p == 1) result.push(p + ' ' + name);
        if (p >= 2) result.push(p + ' ' + name);
        value %= units[name];
      }
    } else {
      result.push('متأخرة');
    }
    return result;
  }
  SetUserTask(data: any) {
    var impobj: any = {};
    impobj.PhaseTaskId = data.phaseTaskId;
    impobj.UserId = this.userG.userId;
    this._projectService.SetUserTask(impobj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.GetTasksWithoutUser();
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }
  //#endregion
  //----------------------------------------------------

  //-------------------------------------------Add Project ----------------------------
  //#region
  modalDetailsProject: any = {
    projectId: 0,
    projectNo: null,
    projectDuration: null,
    branch: null,
    center: null,
    from: new Date(),
    to: new Date(),
    projectType: null,
    subProjectDetails: null,
    customer: null,
    buildingType: null,
    service: null,
    user: null,
    region: null,
    projectDescription: null,
    offerPriceNumber: null,
    projectDepartment: null,
    projectPermissions: [],
    projectGoals: null,

    //proSettingdet:false,
    ProjectSettingNo: null,
    ProjectSettingNote: null,
    projectDurationLbl: null,

    servicesDiv: false,

    pmimgdiv: false,
    ProjectFlag: false,
    SubProjectFlag: false,
    SubProjectBranch: false,
    totalPhases_duration_txt: null,
    totalPhases_duration_Acc: 0,
    totalProject_duration_Acc: 0,
  };

  ResetAllControls() {
    this.modalDetailsProject = {
      projectId: 0,
      projectNo: null,
      projectDuration: null,
      branch: null,
      center: null,
      from: new Date(),
      to: new Date(),
      projectType: null,
      subProjectDetails: null,
      customer: null,
      buildingType: null,
      service: null,
      user: null,
      region: null,
      projectDescription: null,
      offerPriceNumber: null,
      projectDepartment: null,
      projectPermissions: [],
      projectGoals: null,

      //proSettingdet:false,
      ProjectSettingNo: null,
      ProjectSettingNote: null,
      projectDurationLbl: null,

      servicesDiv: false,

      pmimgdiv: false,
      ProjectFlag: false,
      SubProjectFlag: false,
      SubProjectBranch: false,
      totalPhases_duration_txt: null,
      totalPhases_duration_Acc: 0,
      totalProject_duration_Acc: 0,
    };
    this.GetProjectDurationStr();
  }

  ProjectPopupFunc() {
    this.modalDetailsProject.projectPermissions = [];
    //ResetVoucherControls();
    this.ResetAllControls();
    this.FillBuildTypeSelect();
    this.FillCitySelect();
    this.FillProjectTypeSelect();
    this.GetAllCustomerForDropWithBranch();
    this.FillAllUsersSelectAll();
    //this.FillProjectSelect();
    this.FillDepartmentSelectByTypeUser();
    this.FillBranchByUserIdSelect();
    this.userPermissions = [];
    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );

    this.projectgoalList = [];
    this.ProjectNoType = 1;
  }

  GenerateNextProjectNumber() {
    this._projectService.GenerateNextProjectNumber().subscribe((data) => {
      this.modalDetailsProject.projectNo = data.result;
    });
  }
  //-----------------------------------Fill------------------------------------------
  BuildTypes: any;
  BuildTypesPopup: any;

  FillBuildTypeSelect() {
    this._projectService.FillBuildTypeSelect().subscribe((data) => {
      this.BuildTypes = data;
      this.BuildTypesPopup = data;
    });
  }
  City: any;
  CityTypesPopup: any;

  FillCitySelect() {
    this._projectService.FillCitySelect().subscribe((data) => {
      this.City = data;
      this.CityTypesPopup = data;
    });
  }
  ProjectTypes: any;
  ProjectTypesPopup: any;

  FillProjectTypeSelect() {
    this.ProjectSubTypes = [];
    this._projectService.FillProjectTypeSelect().subscribe((data) => {
      this.ProjectTypes = data;
      this.ProjectTypesPopup = data;
    });
  }
  ProjectSubTypes: any;
  ProjectSubTypesPopup: any;
  FillProjectSubTypesSelect() {
    if (this.modalDetailsProject.projectType != null) {
      this._projectService
        .FillProjectSubTypesSelect(this.modalDetailsProject.projectType)
        .subscribe((data) => {
          this.ProjectSubTypes = data;
          this.ProjectSubTypesPopup = data;
        });
    } else {
      this.ProjectSubTypes = [];
      this.ProjectSubTypesPopup = [];
    }
  }
  Customers: any;
  GetAllCustomerForDropWithBranch() {
    this._projectService.GetAllCustomerForDropWithBranch().subscribe((data) => {
      this.Customers = data.result;
    });
  }
  Managers: any;
  FillAllUsersSelectAll() {
    this._projectService.FillAllUsersSelectAll().subscribe((data) => {
      this.Managers = data;
    });
  }
  ParentProjectBranch: any;
  FillProjectSelect() {
    this._projectService.FillProjectSelect().subscribe((data) => {
      console.log(data);
      this.ParentProjectBranch = data;
    });
  }
  Department: any;
  FillDepartmentSelectByTypeUser() {
    this._projectService.FillDepartmentSelectByTypeUser(1).subscribe((data) => {
      this.Department = data;
    });
  }
  Branches: any;
  FillBranchByUserIdSelect() {
    this.CostCenters = [];
    this._projectService.FillBranchByUserIdSelect().subscribe((data) => {
      this.Branches = data;
    });
  }
  CostCenters: any;
  FillCostCenterSelectBranch() {
    if (this.modalDetailsProject.branch != null) {
      this._projectService
        .FillCostCenterSelectBranch(this.modalDetailsProject.branch)
        .subscribe((data) => {
          this.CostCenters = data;
        });
    } else {
      this.CostCenters = [];
    }
  }
  //-------------------------------------------------------------------------------------------

  ChangeService() {
    this.resetInvoiceData();

    if (this.modalDetailsProject.customer == null) {
      this.modalDetailsProject.service = null;
      this.toast.error('من فضلك أختر عميل أولا', 'رسالة');
      return;
    }
    if (this.modalDetailsProject.center == null) {
      this.modalDetailsProject.service = null;
      this.toast.error('من فضلك أختر مركز تكلفة أولا', 'رسالة');
      return;
    }

    if (this.modalDetailsProject.service != null) {
      this.open(this.newInvoiceModal, null, 'addInvoiceProject');
      var element = {
        serviceId: this.modalDetailsProject.service,
      };
      this.GetServicesPriceByServiceIdForProject(element);
    }
  }
  GetServicesPriceByServiceIdForProject(offerdata: any) {
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
          1,
          data.result.amount
        );
      });
  }
  branchChange() {
    this.modalDetailsProject.center = null;
    this.FillCostCenterSelectBranch();
  }
  ProjectNoType = 1; // generated
  ProjectNoTxtChenged() {
    this.ProjectNoType = 2; // manual
  }

  CheckStartDate(event: any) {
    if (event != null) {
      this.modalDetailsProject.from = event;
      this.GetProjectDurationStr();
    } else {
      this.modalDetailsProject.from = null;
    }
  }
  CheckEndDate(event: any) {
    if (event != null) {
      this.modalDetailsProject.to = event;
      this.GetProjectDurationStr();
    } else {
      this.modalDetailsProject.to = null;
    }
  }

  GetProjectDurationStr() {
    if (
      this.modalDetailsProject.from != null &&
      this.modalDetailsProject.to != null
    ) {
      if (this.modalDetailsProject.from > this.modalDetailsProject.to) {
        this.modalDetailsProject.from = new Date();
        this.modalDetailsProject.to = this.addDays(new Date(), 1);
        this.modalDetailsProject.projectDuration = null;
        this.modalDetailsProject.totalProject_duration_Acc = 0;
        this.toast.error(
          'لا يمكنك اختيار تاريخ النهاية أصغر من البداية',
          'رسالة'
        );
        return;
      }

      this._projectService
        .GetProjectDurationStr(
          this._sharedService.date_TO_String(this.modalDetailsProject.from),
          this._sharedService.date_TO_String(this.modalDetailsProject.to)
        )
        .subscribe((data) => {
          this.modalDetailsProject.projectDuration = data.reasonPhrase;
          this.modalDetailsProject.totalProject_duration_Acc =
            data.returnedParm;
        });
    } else {
      this.modalDetailsProject.projectDuration = null;
      this.modalDetailsProject.totalProject_duration_Acc = 0;
    }
  }
  // CheckDateValid(){
  //   if(this.modalDetailsProject.from!=null && this.modalDetailsProject.to!=null)
  //   {
  //     if(this.modalDetailsProject.from>this.modalDetailsProject.to){
  //       this.modalDetailsProject.from=new Date();
  //       this.modalDetailsProject.to=this.addDays(new Date(),1);

  //       this.toast.error('لا يمكنك اختيار تاريخ النهاية أصغر من البداية', 'رسالة');return;
  //     }
  //   }
  // }
  serviceList: any;
  GetServicesPriceByProjectId2() {
    if (
      this.modalDetailsProject.projectType != null &&
      this.modalDetailsProject.subProjectDetails != null
    ) {
      this._projectService
        .GetServicesPriceByProjectId2(
          this.modalDetailsProject.projectType,
          this.modalDetailsProject.subProjectDetails
        )
        .subscribe((data) => {
          this.serviceList = data.result;
        });
    } else {
      this.serviceList = [];
    }
  }
  GetTimePeriordBySubTypeId() {
    if (this.modalDetailsProject.subProjectDetails != null) {
      this._projectService
        .GetTimePeriordBySubTypeId(this.modalDetailsProject.subProjectDetails)
        .subscribe((data) => {
          if (data != null) {
            if (parseInt(data.TimePeriod) > 0) {
              this.SetNewDatewithTimePeriord(parseInt(data.timePeriod));
            }
          }
        });
    }
  }
  offerpriceList: any;
  FillAllOfferTodropdownProject() {
    this.modalDetailsProject.offerPriceNumber = null;
    this.offerpriceList = [];
    if (this.modalDetailsProject.customer != null) {
      this._projectService
        .FillAllOfferTodropdownProject(this.modalDetailsProject.customer,this.modalDetailsProject.projectId)
        .subscribe((data) => {
          this.offerpriceList = data;
          console.log("this.offerpriceList");
          console.log(this.offerpriceList);
          console.log(this.modalDetailsProject.projectId);

        });
    }
  }

  addDays(date: any, days: any) {
    var copy = new Date(Number(date));
    copy.setDate(date.getDate() + days);
    return copy;
  }
  SetNewDatewithTimePeriord(TimePeriod: any) {
    var date2 = this.modalDetailsProject.from;
    var newDate = this.addDays(date2, TimePeriod);
    this.modalDetailsProject.from = date2;
    this.modalDetailsProject.to = newDate;
    this.GetProjectDurationStr();
  }

  TypeProjectChange() {
    this.modalDetailsProject.subProjectDetails = null;
    this.FillProjectSubTypesSelect();
    this.GetAllCustomerForDropWithBranch();
    this.getallreqbyprojecttype();
  }
  subTypeProjectChange(model: any) {
    this.modalDetailsProject.service = null;
    this.modalDetailsProject.ProjectFlag = true;
    this.modalDetailsProject.servicesDiv = true;
    this.GetServicesPriceByProjectId2();

    this.GetTimePeriordBySubTypeId();
    this.modalDetailsProject.ProjectSettingNo = null;
    this.modalDetailsProject.ProjectSettingNote = null;
    this.GetAllSettingsByProjectIDwithoutmain();
    this.getProSettingnumber();
    this.GetProjectRequirementByProjectSubTypeSearchIdPoupup(model);
  }
  subTypeProjectChangeEdit() {
    this.modalDetailsProject.service = null;
    this.modalDetailsProject.ProjectFlag = true;
    this.modalDetailsProject.servicesDiv = true;
    this.GetServicesPriceByProjectId2();

    this.GetTimePeriordBySubTypeId();
    this.GetAllSettingsByProjectIDwithoutmain();
    this.modalDetailsProject.ProjectSettingNo = null;
    this.modalDetailsProject.ProjectSettingNote = null;

    this.CheckProSetting();
  }
  GetProjectSettingsDetails() {
    if (
      this.modalDetailsProject.projectType != null &&
      this.modalDetailsProject.subProjectDetails != null
    ) {
      this._projectService
        .GetProjectSettingsDetails(
          this.modalDetailsProject.projectType,
          this.modalDetailsProject.subProjectDetails
        )
        .subscribe((data) => {
          if (data.result != null) {
            this.modalDetailsProject.ProjectSettingNo =
              data.result.proSettingNo;
            this.modalDetailsProject.ProjectSettingNote =
              data.result.proSettingNote;
            this.modalDetailsProject.ProjectFlag = true;
          } else {
            this.modalDetailsProject.ProjectSettingNo = null;
            this.modalDetailsProject.ProjectSettingNote = null;
            this.modalDetailsProject.ProjectFlag = false;
          }
        });
    } else {
      this.modalDetailsProject.ProjectSettingNo = null;
      this.modalDetailsProject.ProjectSettingNote = null;
      this.modalDetailsProject.ProjectFlag = false;
    }
  }

  CheckProSetting() {
    debugger;
    if (this.modalDetailsProject.projectId != null) {
      this._projectService
        .GetProjectSettingsDetailsIFExist(this.modalDetailsProject.projectId)
        .subscribe((data) => {
          if (data.result != null) {
            this.modalDetailsProject.ProjectSettingNo =
              data.result.proSettingNo;
            this.modalDetailsProject.ProjectSettingNote =
              data.result.proSettingNote;
            this.modalDetailsProject.ProjectFlag = true;
          } else {
            this.modalDetailsProject.ProjectSettingNo = null;
            this.modalDetailsProject.ProjectSettingNote = null;
            this.modalDetailsProject.ProjectFlag = false;
          }
        });
    } else {
      this.modalDetailsProject.ProjectSettingNo = null;
      this.modalDetailsProject.ProjectSettingNote = null;
      this.modalDetailsProject.ProjectFlag = false;
    }
  }

  getProSettingnumber() {
    this.GetProjectSettingsDetails();
  }
  ProjectRequirementsList: any;
  GetProjectRequirementByProjectSubTypeSearchIdPoupup(model: any) {
    this.ProjectRequirementsList = [];
    if (this.modalDetailsProject.subProjectDetails != null) {
      this._projectService
        .GetProjectRequirementByProjectSubTypeId(
          this.modalDetailsProject.subProjectDetails
        )
        .subscribe((data) => {
          this.ProjectRequirementsList = data;
          this.projectRequirementsDataSource = new MatTableDataSource(data);
          if (data.length > 0) {
            this.modalService.open(model);
          }
        });
    } else {
      this.ProjectRequirementsList = [];
    }
  }
  downloadFile(data: any) {
    try {
      var link = environment.PhotoURL + data.attachmentUrl;
      window.open(link, '_blank');
    } catch (error) {
      this.toast.error('تأكد من الملف', 'رسالة');
    }
  }
  customerChange() {
    this.FillAllOfferTodropdownProject();
  }
  //#endregion
  //-----------------------------------------End Add Project---------------------------

  SetPerRunningTasks(dataObj: any) {
    var date1 = new Date(dataObj.projectExpireDate);
    var date2 = new Date();
    var date3 = new Date(dataObj.projectDate);
    var Difference_In_Time = date2.getTime() - date3.getTime();
    var Difference_In_Time2 = date1.getTime() - date3.getTime();
    var Difference_In_Days = parseInt(
      (Difference_In_Time / (1000 * 3600 * 24)).toString()
    );
    var Difference_In_Days2 = parseInt(
      (Difference_In_Time2 / (1000 * 3600 * 24)).toString()
    );
    var perc = Difference_In_Days / Difference_In_Days2;
    var percentage = parseInt((perc * 100).toString());
    return percentage;
  }

  //-------------------------------------Add TAsk-------------------------------------------------------
  //#region
  selectedTaskType: any;
  nodeDataArray = [];
  linkDataArray = [];
  TaskType: any;

  AddTaskData: any = {
    userid: null,
    tasktype: null,
    tasknamear: null,
    tasknameen: null,
    customerid: null,
    projectid: null,
    phaseid: null,
    subphaseid: null,
    timetypeid: null,
    datefrom: null,
    dateto: null,
    timefrom: null,
    timeto: null,
    taskgoal: false,
    projectgoalstxt: null,
    projectgoals: null,

    departmentCheck: false,
    departmentId: null,

    priorty: '1',
    hourTime: 1,

    loaddepartmentId: [],
    loaduserid: [],
    loadtasktype: [],
    loadcustomer: [],
    loadproject: [],
    loadphases: [],
    loadsubphases: [],

    tasktypedata: {
      id: 0,
      namear: null,
      nameen: null,
    },
    notVacCalc:false,
    uploadfile: [],
    TimeMinutestxt: null,
    RetCheckUserDawamBool: true,
  };
  TaskTypeRowSelected: any;
  getTasktypeRow(row: any) {
    this.TaskTypeRowSelected = row;
  }
  setTaskTypeInSelect(data: any, modal: any) {
    this.AddTaskData.tasktype = data.id;
    this.AddTaskData.tasknamear = data.name;
    this.AddTaskData.tasknameen = data.nameE ?? data.name;
    //modal?.dismiss();
  }
  confirmTasktypeDelete() {
    this._phasestaskService
      .DeleteTaskType(this.TaskTypeRowSelected.id)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.FillTaskTypeSelect();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  saveTaskType() {
    if (
      this.AddTaskData.tasktypedata.namear == null ||
      this.AddTaskData.tasktypedata.nameen == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    var TaskTypeObj: any = {};
    TaskTypeObj.TaskTypeId = this.AddTaskData.tasktypedata.id;
    TaskTypeObj.NameAr = this.AddTaskData.tasktypedata.namear;
    TaskTypeObj.NameEn = this.AddTaskData.tasktypedata.nameen;

    var obj = TaskTypeObj;
    this._phasestaskService.SaveTaskType(obj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.resetTaskType();
        this.FillTaskTypeSelect();
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }
  resetTaskType() {
    this.AddTaskData.tasktypedata.id = 0;
    this.AddTaskData.tasktypedata.namear = null;
    this.AddTaskData.tasktypedata.nameen = null;
  }
  _projectRequirements: any;
  SaveFiles(phaseid: any) {
    if (phaseid == null || phaseid == 0) {
      return;
    }

    if (this.control?.value.length > 0) {
      const formData: FormData = new FormData();
      formData.append('uploadesgiles', this.control?.value[0]);
      formData.append('RequirementId', String(0));
      formData.append('PhasesTaskID', phaseid);
      formData.append('PageInsert', '1');
      this._phasestaskService
        .SaveProjectRequirement4(formData)
        .subscribe((result) => {});
    }
  }
  FillAllUsersSelectsomeByBranch() {
    this._phasestaskService.FillAllUsersSelectsomeByBranch().subscribe((data) => {
      this.AddTaskData.loaduserid = data;
    });
  }

  FillAllTasks() {
    this._phasestaskService.FillAllUsersSelectAll().subscribe((data) => {
      this.AddTaskData.loaduserid = data;
    });
  }
  FillAllUsersSelect() {
    this._phasestaskService.FillAllUsersSelect().subscribe((data) => {
      this.AddTaskData.loaduserid = data;
    });
  }
  FillTaskTypeSelect() {
    this._phasestaskService.FillTaskTypeSelect().subscribe((data) => {
      this.AddTaskData.loadtasktype = data;
    });
  }
  FillCustomersOwnProjects() {
    this._phasestaskService.FillCustomersOwnProjects().subscribe((data) => {
      this.AddTaskData.loadcustomer = data;
    });
  }
  FillProjectSelectByCustomerId() {
    this.AddTaskData.projectid = null;
    if (this.RowData.customerId != null) {
      this._phasestaskService
        .FillProjectSelectByCustomerId(this.RowData.customerId)
        .subscribe((data) => {
          this.AddTaskData.loadproject = data;
          this.ChangeProject();
        });
    } else {
      this.AddTaskData.loadproject = [];
    }
  }

  FillProjectSelectByCustomerIdWiBranch() {
    this.AddTaskData.projectid = null;
    if (this.RowData.customerId != null) {
      this._phasestaskService
        .FillProjectSelectByCustomerIdWiBranch(this.RowData.customerId)
        .subscribe((data) => {
          this.AddTaskData.loadproject = data;
          this.ChangeProject();
        });
    } else {
      this.AddTaskData.loadproject = [];
    }
  }

  FillProjectMainPhases() {
    this.AddTaskData.phaseid = null;
    this.AddTaskData.subphaseid = null;
    if (this.AddTaskData.projectid != null) {
      this._phasestaskService
        .FillProjectMainPhases(this.AddTaskData.projectid)
        .subscribe((data) => {
          this.AddTaskData.loadphases = data;
          if (this.AddTaskData.loadphases.length == 1) {
            this.AddTaskData.phaseid = this.AddTaskData.loadphases[0].id;
            this.FillSubPhases();
          }
        });
    } else {
      this.AddTaskData.loadphases = [];
    }
  }
  FillSubPhases() {
    this.AddTaskData.subphaseid = null;
    if (this.AddTaskData.phaseid != null) {
      this._phasestaskService
        .FillSubPhases(this.AddTaskData.phaseid)
        .subscribe((data) => {
          this.AddTaskData.loadsubphases = data;
          if (this.AddTaskData.loadsubphases.length == 1) {
            this.AddTaskData.subphaseid = this.AddTaskData.loadsubphases[0].id;
          }
        });
    } else {
      this.AddTaskData.loadsubphases = [];
    }
  }
  updateTasktype($event: any) {
    this.AddTaskData.tasknamear = $event.name;
    this.AddTaskData.tasknameen = $event.nameE ?? $event.name;
  }
  resetTaskData() {
    if (this.userG.userPrivileges.includes(111316)) {
      this.FillAllUsersSelectsomeByBranch();
    } else {
      this.FillAllTasks();
    }
    //this.FillAllTasks();
    this.FillDepartmentSelect();
    this.FillTaskTypeSelect();
    this.FillCustomersOwnProjects();
    if ((this.NewTaskpop = 2)) {
      this.FillProjectSelectByCustomerIdWiBranch();
    } else {
      this.FillProjectSelectByCustomerId();
    }

    this.AddTaskData = {
      userid: null,
      tasktype: null,
      tasknamear: null,
      tasknameen: null,
      customerid: this.RowData.customerId,
      projectid: this.RowData.projectId,
      phaseid: null,
      subphaseid: null,
      timetypeid: 2,
      datefrom: new Date(),
      dateto: new Date(),
      timefrom: null,
      timeto: null,
      taskgoal: false,
      projectgoalstxt: null,
      projectgoals: null,

      departmentCheck: false,
      departmentId: null,

      tasktypedata: {
        id: 0,
        namear: null,
        nameen: null,
      },

      priorty: '1',
      hourTime: 1,
      TimeMinutestxt: 1,
      RetCheckUserDawamBool: true,
    };
    this.FillProjectMainPhases();
  }
  Atttable: any;
  GetAllAttTimeDetails2() {
    this.Atttable = null;
    if (this.AddTaskData.userid != null) {
      this._phasestaskService
        .GetAllAttTimeDetails2(this.AddTaskData.userid)
        .subscribe((data) => {
          this.Atttable = data.result;
        });
    } else {
      this.Atttable = null;
    }
  }

  ChangeUser() {
    this.GetAllAttTimeDetails2();
  }

  GetDayName(data: any) {
    return data.dayName;
  }
  GetShift(data: any) {
    try {
      var _1StFromHour = data._1StFromHour;
      var _1StToHour = data._1StToHour;
      var _2ndFromHour = data._2ndFromHour;
      var _2ndToHour = data._2ndToHour;

      var firstshift = '';
      var secondshift = '';
      var fullshifts = '';
      var firststring = '';
      var secondstring = '';
      var shiftstr = '';
      if (_1StFromHour != null && _1StToHour != null) {
        let timefrom = this._sharedService.formatTimeOnly(
          new Date(data._1StFromHour)
        );
        let timeto = this._sharedService.formatTimeOnly(
          new Date(data._1StToHour)
        );

        let timefrom_ampm = this._sharedService.formatAMPMOnly(
          new Date(data._1StFromHour)
        );
        let timeto_ampm = this._sharedService.formatAMPMOnly(
          new Date(data._1StToHour)
        );

        if (timefrom_ampm == 'AM') {
          firststring = 'صباحا';
        } else {
          firststring = 'مساءا';
        }
        if (timeto_ampm == 'AM') {
          secondstring = 'صباحا';
        } else {
          secondstring = 'مساءا';
        }
        if (firststring == 'صباحا') {
          shiftstr = 'الصباح';
        } else {
          shiftstr = 'المساء';
        }
        firstshift =
          shiftstr +
          ' : ' +
          timefrom +
          ' ' +
          firststring +
          ' ' +
          timeto +
          ' ' +
          secondstring;
      }
      if (_2ndFromHour != null && _2ndToHour != null) {
        let timefrom = this._sharedService.formatTimeOnly(
          new Date(data._2ndFromHour)
        );
        let timeto = this._sharedService.formatTimeOnly(
          new Date(data._2ndToHour)
        );

        let timefrom_ampm = this._sharedService.formatAMPMOnly(
          new Date(data._2ndFromHour)
        );
        let timeto_ampm = this._sharedService.formatAMPMOnly(
          new Date(data._2ndToHour)
        );

        if (timefrom_ampm == 'AM') {
          firststring = 'صباحا';
        } else {
          firststring = 'مساءا';
        }
        if (timeto_ampm == 'AM') {
          secondstring = 'صباحا';
        } else {
          secondstring = 'مساءا';
        }
        if (firststring == 'صباحا') {
          shiftstr = 'الصباح';
        } else {
          shiftstr = 'المساء';
        }
        secondshift =
          shiftstr +
          ' : ' +
          timefrom +
          ' ' +
          firststring +
          ' ' +
          timeto +
          ' ' +
          secondstring;
      }
      fullshifts = firstshift + ' ' + secondshift;
      return fullshifts;
    } catch (error) {
      return '';
    }
  }

  changetimetype() {
    if (this.AddTaskData.timetypeid == 1) {
      this.AddTaskData.datefrom = new Date();
      this.AddTaskData.dateto = new Date();
      this.AddTaskData.TimeMinutestxt = this.AddTaskData.hourTime;
    } else if (this.AddTaskData.timetypeid == 2) {
      this.AddTaskData.TimeMinutestxt = null;
      var Difference_In_Time =
        this.AddTaskData.dateto.getTime() - this.AddTaskData.datefrom.getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      this.AddTaskData.TimeMinutestxt = Difference_In_Days + 1;
    }
  }
  CalTotalTime() {
    if (this.AddTaskData.datefrom != null && this.AddTaskData.dateto != null) {
      var Difference_In_Time =
        this.AddTaskData.dateto.getTime() - this.AddTaskData.datefrom.getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      this.AddTaskData.TimeMinutestxt = Difference_In_Days + 1;
    }
  }

  addNewTask(modal: any) {
    if (
      this.AddTaskData.tasktype == null ||
      this.AddTaskData.tasknamear == null ||
      this.AddTaskData.tasknameen == null ||
      this.AddTaskData.customerid == null ||
      this.AddTaskData.projectid == null ||
      this.AddTaskData.phaseid == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }

    var Value = this.AddTaskData.loadphases.filter(
      (a: { id: any }) => a.id == this.AddTaskData.phaseid
    )[0];
    var TextValue = this.AddTaskData.loadphases.filter(
      (a: { id: any }) => a.id == this.AddTaskData.phaseid
    )[0].name;
    var TaskStatus_V = 1;
    if (TextValue == 'بدون مرحلة رئيسية') {
      TaskStatus_V = 2;
    } else {
      TaskStatus_V = 1;
    }
    var desc = '';

    if (this.AddTaskData.timetypeid == 1 || this.AddTaskData.timetypeid == 2) {
      if (
        this.AddTaskData.timefrom == null ||
        this.AddTaskData.timeto == null
      ) {
        this.toast.error(
          'من فضلك تأكد من بداية المهمة ونهايتها بالتوقيت',
          'رسالة'
        );
        return;
      } else {
        // var V=this.CheckDwamTime(this.AddTaskData.userid);
        // if (V == false) {
        //     this.toast.error("من فضلك تأكد من بداية المهمة ونهايتها بالتوقيت في فترة الدوام", 'رسالة');return;
        // }
      }
    } else {
      if (
        this.AddTaskData.datefrom == null ||
        this.AddTaskData.dateto == null
      ) {
        this.toast.error(
          'من فضلك تأكد من بداية المهمة ونهايتها بالتاريخ',
          'رسالة'
        );
        return;
      }
    }
    this.CalTotalTime();
    var aaa = this.AddTaskData;
    var TaskObj: any = {};
    TaskObj.PhaseTaskId = 0;
    TaskObj.ProjSubTypeId = this.AddTaskData.subphaseid;
    TaskObj.Type = 3;
    TaskObj.Status = TaskStatus_V;
    TaskObj.ProjectId = this.AddTaskData.projectid;
    TaskObj.DescriptionAr = this.AddTaskData.tasknamear;
    TaskObj.DescriptionEn = this.AddTaskData.tasknameen;
    TaskObj.UserId = this.AddTaskData.userid;
    TaskObj.TaskType = this.AddTaskData.tasktype;
    TaskObj.DepartmentId = this.AddTaskData.departmentId;
    TaskObj.IsConverted = 0;

    this.AddTaskData.datefrom.setHours(0, 0, 0, 0);
    this.AddTaskData.dateto.setHours(0, 0, 0, 0);
    if (
      this.AddTaskData.datefrom.getTime() == this.AddTaskData.dateto.getTime()
    ) {
      TaskObj.TimeMinutes = this.AddTaskData.hourTime;
    } else {
      TaskObj.TimeMinutes = Math.round(this.AddTaskData.TimeMinutestxt);
    }
    TaskObj.Cost = null;
    TaskObj.TimeType = this.AddTaskData.timetypeid;
    TaskObj.PhasePriority = parseInt(this.AddTaskData.priorty);
    TaskObj.StartDate = null;
    TaskObj.EndDate = null;

    if (this.AddTaskData.timetypeid == 1 || this.AddTaskData.timetypeid == 2) {
      TaskObj.TaskTimeFrom = this._sharedService.formatAMPM(
        this.AddTaskData.timefrom
      );
      TaskObj.TaskTimeTo = this._sharedService.formatAMPM(
        this.AddTaskData.timeto
      );
    } else {
      TaskObj.TaskTimeFrom = null;
      TaskObj.TaskTimeTo = null;
    }

    TaskObj.ExcpectedStartDate = this._sharedService.date_TO_String(
      this.AddTaskData.datefrom
    );
    TaskObj.ExcpectedEndDate = this._sharedService.date_TO_String(
      this.AddTaskData.dateto
    );
    TaskObj.ExecPercentage = 0;

    if (this.AddTaskData.taskgoal == true) TaskObj.ProjectGoals = 1;
    else TaskObj.ProjectGoals = 0;

    if (this.AddTaskData.subphaseid == null) {
      TaskObj.MainPhaseId = this.AddTaskData.phaseid;
      TaskObj.ParentId = this.AddTaskData.phaseid;
      TaskObj.TaskOn = 1;
    } else {
      TaskObj.SubPhaseId = this.AddTaskData.subphaseid;
      TaskObj.ParentId = this.AddTaskData.subphaseid;
      TaskObj.TaskOn = 2;
    }

    if (this.AddTaskData.subphaseid > 0) {
      TaskObj.SubPhaseId = this.AddTaskData.subphaseid;
      TaskObj.ParentId = this.AddTaskData.subphaseid;
      TaskObj.TaskOn = 2;
    } else {
      TaskObj.MainPhaseId = this.AddTaskData.phaseid;
      TaskObj.ParentId = this.AddTaskData.phaseid;
      TaskObj.TaskOn = 1;
    }
    TaskObj.NotVacCalc = this.AddTaskData.notVacCalc;

    var obj = TaskObj;

    this._phasestaskService
      .SaveNewProjectPhasesTasks_E(obj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          modal?.dismiss();
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.SaveFiles(result.returnedParm);
          this.resetTaskData();
          this.GetAllProjects();
          this.GetTasksWithoutUser();
          if(this.WhatsAppData.sendactivationProject==true)
          {
            this.SendWhatsAppTask(result.returnedParm,null);
          }
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  addHours(date: any, hours: any) {
    date.setHours(date.getHours() + hours);
    return date;
  }
  ChangehourTime() {
    if (
      this.AddTaskData.hourTime < 0 ||
      this.AddTaskData.hourTime == null ||
      this.AddTaskData.hourTime > 24
    ) {
      this.AddTaskData.hourTime = 1;
    }
    // else if(this.AddTaskData.hourTime>24)
    // {
    //   this.AddTaskData.hourTime=24;
    // }
    this.AddTaskData.TimeMinutestxt = this.AddTaskData.hourTime;
    if (this.AddTaskData.timefrom != null) {
      this.SetEndTaskTimeTo(this.AddTaskData.hourTime);
    }
  }
  SetEndTaskTimeTo(hours: any) {
    if (this.AddTaskData.timefrom != null) {
      if (this.AddTaskData.timeto != null)
        var startTime = this.AddTaskData.timefrom.getTime();
      var endTime = new Date(startTime + hours * 60 * 60000);
      this.AddTaskData.timeto = endTime;
    }
  }
  SetEndTaskTimeTo_Hours(startTime: any, endTime: any) {
    if (this.AddTaskData.timefrom != null) {
      startTime = startTime.getHours();
      endTime = endTime.getHours();
      var hourDiff = endTime - startTime;
      if (hourDiff < 0) hourDiff = hourDiff + 24;
      this.AddTaskData.hourTime = hourDiff;
    }
  }
  END_START_CHECK(timeFrom: any, timeTo: any) {
    if (this.AddTaskData.timefrom == null || this.AddTaskData.timeto == null) {
      return;
    }
    if (timeFrom >= timeTo) {
      var hourValue = this.AddTaskData.hourTime;
      this.SetEndTaskTimeTo(hourValue);
    } else {
      this.SetEndTaskTimeTo_Hours(timeFrom, timeTo);
    }
  }
  Changetimefrom() {
    if (this.AddTaskData.hourTime < 0)
      this.AddTaskData.hourTime = this.AddTaskData.hourTime + 24;

    this.SetEndTaskTimeTo(this.AddTaskData.hourTime);
  }
  Changetimeto() {
    if (this.AddTaskData.timefrom == null || this.AddTaskData.timeto == null) {
    } else {
      var startTime = this.AddTaskData.timefrom.getTime();
      var endTime = this.AddTaskData.timeto.getTime();
      this.END_START_CHECK(this.AddTaskData.timefrom, this.AddTaskData.timeto);
    }
  }
  CheckDwamTime(userid: any) {
    this.AddTaskData.RetCheckUserDawamBool = true;

    let timefrom = this._sharedService.formatTimeHourOnly(
      this.AddTaskData.timefrom
    );
    let timeto = this._sharedService.formatTimeHourOnly(
      this.AddTaskData.timeto
    );

    let timefrom_ampm = this._sharedService.formatAMPMOnly(
      this.AddTaskData.timefrom
    );
    let timeto_ampm = this._sharedService.formatAMPMOnly(
      this.AddTaskData.timeto
    );
    if (timefrom_ampm == 'PM') {
      timefrom = timefrom + 12;
    }

    if (timeto_ampm == 'PM') {
      timeto = timeto + 12;
    }
    var dayno = new Date().getDay();

    var accdayno = 0;
    if (dayno == 0) {
      accdayno = 2;
    } else if (dayno == 1) {
      accdayno = 3;
    } else if (dayno == 2) {
      accdayno = 4;
    } else if (dayno == 3) {
      accdayno = 5;
    } else if (dayno == 4) {
      accdayno = 6;
    } else if (dayno == 5) {
      accdayno = 7;
    } else if (dayno == 6) {
      accdayno = 1;
    } else {
      accdayno = 1;
    }

    this._phasestaskService
      .CheckUserPerDawamUserExist(userid, timefrom, timeto, accdayno)
      .subscribe((result: any) => {
        this.AddTaskData.RetCheckUserDawamBool = result.result;
      });
    return this.AddTaskData.RetCheckUserDawamBool;
  }

  ChangeProject() {
    this.FillProjectMainPhases();
    this.GetProjectById();
    this.LoadTabSetting();
  }
  GetProjectById() {
    if (this.AddTaskData.projectid != null) {
      this._phasestaskService
        .GetProjectById(this.AddTaskData.projectid)
        .subscribe((result: any) => {
          this.RemTimeProjData.produrationexpect = result.result.timeStr;
          this.getremainprojectdate(
            result.result.projectDate,
            result.result.projectExpireDate
          );
        });
    } else {
      this.RemTimeProjData.timerem = null;
      this.RemTimeProjData.prendexpect = null;
      this.RemTimeProjData.footerdetails = null;
      this.RemTimeProjData.statusLate = 0;
      this.RemTimeProjData.produrationexpect = null;
    }
  }

  RemTimeProjData: any = {
    timerem: null,
    prendexpect: null,
    footerdetails: null,
    statusLate: 0,
    produrationexpect: null,
  };

  getremainprojectdate(stdate: any, enddat: any) {
    //dawoud
    var date1 = new Date(enddat);
    var date2 = new Date();

    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);

    var Difference_In_Time = date1.getTime() - date2.getTime();

    var Difference_In_Days = parseInt(
      (Difference_In_Time / (1000 * 3600 * 24)).toString()
    );
    Difference_In_Days = Difference_In_Days + 1;
    if (date2 <= date1) {
      if (Difference_In_Days < 30 && Difference_In_Days > 0) {
        this.RemTimeProjData.timerem = Difference_In_Days + 'يوم';
      } else if (Difference_In_Days == 30) {
        this.RemTimeProjData.timerem = Difference_In_Days + 'شهر';
      } else if (Difference_In_Days > 30) {
        this.RemTimeProjData.timerem =
          parseInt((Difference_In_Days / 30).toString()) +
          'شهر' +
          parseInt((Difference_In_Days % 30).toString()) +
          'يوم';
      }
      this.RemTimeProjData.prendexpect = 'بعد ' + this.RemTimeProjData.timerem;
      this.RemTimeProjData.footerdetails = null;
      this.RemTimeProjData.statusLate = 0;
    } else if (date1 < date2) {
      this.RemTimeProjData.prendexpect = 'مشروع متأخر ';
      this.RemTimeProjData.footerdetails =
        'هذا المشروع متاخر ، ولا يمكن اضافة مهام عليه الا بعد تمديد مدة المشروع';
      this.RemTimeProjData.statusLate = 1;
    } else {
      this.RemTimeProjData.prendexpect = null;
      this.RemTimeProjData.footerdetails = null;
      this.RemTimeProjData.statusLate = 0;
    }
  }

  Changeorgisreq() {
    if (this.AddTaskData.taskgoal) {
      if (this.AddTaskData.projectid != null) {
        this._phasestaskService
          .FillProjectRequirmentSelect(this.AddTaskData.projectid)
          .subscribe((result: any) => {
            if (result.result != null) {
              if (result.result.requirementGoalId != 0) {
                this.AddTaskData.projectgoalstxt = result.result.requirmentName;
                this.AddTaskData.projectgoals = result.result.requirementGoalId;
              } else {
                this.AddTaskData.taskgoal = false;
                this.AddTaskData.projectgoalstxt = null;
                this.AddTaskData.projectgoals = null;
              }
            } else {
              this.AddTaskData.taskgoal = false;
              this.AddTaskData.projectgoalstxt = null;
              this.AddTaskData.projectgoals = null;
            }
          });
      } else {
        this.AddTaskData.taskgoal = false;
        this.AddTaskData.projectgoalstxt = null;
        this.AddTaskData.projectgoals = null;
        this.toast.error('من فضلك أختر مشروع أولا', 'رسالة');
        return;
      }
    } else {
      this.AddTaskData.taskgoal = false;
      this.AddTaskData.projectgoalstxt = null;
      this.AddTaskData.projectgoals = null;
    }
  }
  ChangedepartSwitch() {
    this.AddTaskData.userid = null;
    this.AddTaskData.departmentId = null;
    this.Atttable = null;
  }
  FillDepartmentSelect() {
    this._phasestaskService.FillDepartmentSelect().subscribe((data) => {
      this.AddTaskData.loaddepartmentId = data;
    });
  }
  public selectedNode = null;
  model2: any;
  EditData: any = {
    SettingData: [],
    nodeArray: [],
    linkArray: [],
  };

  public setSelectedNode(node: any) {
    this.selectedNode = node;
  }

  LoadTabSetting() {
    if (this.AddTaskData.projectid) {
      this.getProjectSettingEdit(this.AddTaskData.projectid);
    } else {
      this.EditData.nodeArray = [];
      this.EditData.linkArray = [];
      this.nodeDataArray = [];
      this.linkDataArray = [];
    }
  }
  ProjectName: any;
  getProjectSettingEdit(projectid: any) {
    this.EditData.nodeArray = [];
    this.EditData.linkArray = [];
    this.nodeDataArray = [];
    this.linkDataArray = [];

    if (projectid == null) {
      this.model2 = new go.GraphLinksModel(
        this.nodeDataArray,
        this.linkDataArray
      );
      return;
    }
    this.ProjectName = this.AddTaskData.loadproject.filter(
      (ele: { id: any }) => ele.id == projectid
    )[0].name;

    this._projectsettingService.GetAllNodesTasks(projectid).subscribe((res) => {
      this.EditData.SettingData = res;
      this.EditData.nodeArray.push({
        key: 0,
        loc: '-584 -74',
        name: this.ProjectName,
        colorfill: '#0fac03',
      });
      res.nodeDataArray.forEach((r: any) => {
        if (r.nodeLocation != null) {
          if (r.type === 1) {
            //mainphase
            this.EditData.nodeArray.push({
              key: r.settingId,
              loc: r.nodeLocation,
              name: r.descriptionAr,
              isGroup: true,
              colorfill: '#70b9dc',
            });
          } else if (r.type === 2) {
            //subphase
            this.EditData.nodeArray.push({
              key: r.settingId,
              loc: r.nodeLocation,
              name: r.descriptionAr,
              group: r.parentId,
              isGroup: true,
              colorfill: '#b7e89d',
            });
          } else {
            ///task
            this.EditData.nodeArray.push({
              key: r.settingId,
              loc: r.nodeLocation,
              name: r.descriptionAr,
              group: r.parentId,
              toolTipName: r.userName,
              colorfill: '#fe9100',
            });
          }
        } else {
          if (r.type === 1) {
            //mainphase
            this.EditData.nodeArray.push({
              key: r.settingId,
              loc: '50 50',
              size: '150 50',
              name: r.descriptionAr,
              isGroup: true,
              colorfill: '#70b9dc',
            });
          } else if (r.type === 2) {
            //subphase
            this.EditData.nodeArray.push({
              key: r.settingId,
              loc: '50 50',
              size: '150 50',
              name: r.descriptionAr,
              group: r.parentId,
              isGroup: true,
              colorfill: '#b7e89d',
            });
          } else {
            ///task
            this.EditData.nodeArray.push({
              key: r.settingId,
              name: r.descriptionAr,
              group: r.parentId,
              toolTipName: r.userName,
              colorfill: '#fe9100',
            });
          }
        }
      });
      res.firstLevelNode.forEach((r: any) => {
        this.EditData.linkArray.push({ from: 0, to: r.settingId, name: '' });
      });
      res.linkDataArray.forEach((r: any) => {
        this.EditData.linkArray.push({
          from: r.predecessorId,
          to: r.successorId,
          name: '',
        });
      });

      this.nodeDataArray = this.EditData.nodeArray;
      this.linkDataArray = this.EditData.linkArray;
      this.model2 = new go.GraphLinksModel(
        this.nodeDataArray,
        this.linkDataArray
      );
    });
  }

  //#endregion
  //-------------------------------(End)------Add TAsk---------------------------------------------------

  //-------------------------------btn------------------------------------------------

  flagProject(data: any, flag: any) {
    var impobj: any = {};
    impobj.ImportantProId = data.importantid;
    impobj.Flag = flag;
    impobj.ProjectId = data.projectId;
    this._projectService.ChangeFlag(impobj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.GetAllProjects();
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }
  ChangeImportant(data: any, isImportant: any) {
    var impobj: any = {};
    impobj.ImportantProId = data.importantid;
    impobj.isImportant = isImportant;
    impobj.ProjectId = data.projectId;
    this._projectService.ChangeImportant(impobj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.GetAllProjects();
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }
  playProject() {
    var type = 0;
    var whichClickDesc = 3;
    if (this.checkedEmail == true) type = 1;
    else if (this.checkedPhone == true) type = 2;
    else if (this.checkedEmail == true && this.checkedPhone == true) type = 3;
    this._projectService
      .PlayProject(this.RowData.projectId, type, whichClickDesc)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetAllProjects();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  stopProject() {
    var type = 0;
    var whichClickDesc = 2;
    if (this.checkedEmail == true) type = 1;
    else if (this.checkedPhone == true) type = 2;
    else if (this.checkedEmail == true && this.checkedPhone == true) type = 3;
    this._projectService
      .StopProject(this.RowData.projectId, type, whichClickDesc)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetAllProjects();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  DestinationsUploadProject(element: any) {
    var statusVal = 0;
    if ((element.destinationsUpload ?? 0) == 1) statusVal = 0;
    else statusVal = 1;
    this._projectService
      .DestinationsUploadProject(element.projectId, statusVal)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetAllProjects();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  //-----------------------------------Search----------------------------------------
  //------------------load Fill----------------------------------
  load_CustomerName: any;
  load_Department: any;
  load_ProjectManeger: any;
  load_ProjectType: any;
  load_Area: any;

  fill_CustomerName() {
    this._projectService.FillCustomerSelect().subscribe((data) => {
      this.load_CustomerName = data;
    });
  }
  fill_Department() {
    this._phasestaskService.FillDepartmentSelect().subscribe((data) => {
      this.load_Department = data;
    });
  }
  fill_ProjectManeger() {
    this._projectService.FillAllUsersSelectAll().subscribe((data) => {
      this.load_ProjectManeger = data;
    });
  }
  fill_ProjectType() {
    this._projectService.FillProjectTypeSelect().subscribe((data) => {
      this.load_ProjectType = data;
    });
  }
  fill_Area() {
    this._projectService.FillCitySelect().subscribe((data) => {
      this.load_Area = data;
    });
  }
  //------------------ End load Fill----------------------------------

  public _projectVM: ProjectVM;
  searchBox: any = {
    open: false,
    searchType: null,
  };
  data: any = {
    filter: {
      enable: true,
      date: null,
      search_CustomerName: 0,
      search_Department: 0,
      search_ProjectManeger: 0,
      search_ProjectType: 0,
      search_Area: 0,
      search_contractnumber: '',
      search_NationalId: '',
      search_MobileNumber: '',
      search_ProjectNumber: '',
      search_Description: '',
      search_FilterType: null,
      isChecked: false,
    },
  };
  RefreshData() {
    this._projectVM = new ProjectVM();
    if (this.searchBox.searchType == 1) {
      this._projectVM.customerId = this.data.filter.search_CustomerName;
    } else if (this.searchBox.searchType == 2) {
      this._projectVM.projectNo = this.data.filter.search_ProjectNumber;
    } else if (this.searchBox.searchType == 3) {
      this._projectVM.projectTypeId = this.data.filter.search_ProjectType;
    } else if (this.searchBox.searchType == 4) {
      this._projectVM.mangerId = this.data.filter.search_ProjectManeger;
    } else if (this.searchBox.searchType == 5) {
      this._projectVM.contractNo = this.data.filter.search_contractnumber;
    } else if (this.searchBox.searchType == 6) {
      this._projectVM.nationalNumber = this.data.filter.search_NationalId;
    } else if (this.searchBox.searchType == 7) {
      this._projectVM.mobile = this.data.filter.search_MobileNumber;
    } else if (this.searchBox.searchType == 8) {
      this._projectVM.cityId = this.data.filter.search_Area;
    } else if (this.searchBox.searchType == 9) {
      this._projectVM.projectDescription = this.data.filter.search_Description;
    }
    if (this.searchBox.searchType == 10) {
      this._projectVM.departmentId = this.data.filter.search_Department;
    }
    this._projectVM.filterType = this.data.filter.search_FilterType ?? 0;

    this._projectVM.status = 0;
    var obj = this._projectVM;
    this._projectService.SearchFn(obj).subscribe((data) => {
      this.projectsDataSource = new MatTableDataSource(data);
      this.projectsDataSourceTemp = data;
      this.projectsDataSource.paginator = this.paginatorProject;
      //this.projectsDataSource.sort = this.sort;
    });
  }
  checkValue(event: any) {
    if (event == 'A') {
      this.GetAllProjects();
    } else {
      this.RefreshData();
    }
  }
  CheckDate(event: any) {
    if (event != null) {
      var from = this._sharedService.date_TO_String(event[0]);
      var to = this._sharedService.date_TO_String(event[1]);
      this.RefreshData_ByDate(from, to);
    } else {
      this.data.filter.DateFrom_P = '';
      this.data.filter.DateTo_P = '';
      this.RefreshData();
    }
  }
  RefreshData_ByDate(from: any, to: any) {
    this._projectService.SearchDateFn(from, to).subscribe((data) => {
      this.projectsDataSource = new MatTableDataSource(data);
      this.projectsDataSourceTemp = data;
      this.projectsDataSource.paginator = this.paginatorProject;
      //this.projectsDataSource.sort = this.sort;
    });
  }

  Searchbtn() {
    if (this.showFilters) {
      this.fill_CustomerName();
      this.fill_Department();
      this.fill_ProjectManeger();
      this.fill_ProjectType();
      this.fill_Area();
    } else {
      this.searchBox.searchType = null;
      this.data.filter.search_CustomerName = 0;
      this.data.filter.search_ProjectManeger = 0;
      this.data.filter.search_ProjectType = 0;
      this.data.filter.search_Area = 0;
      this.data.filter.search_contractnumber = '';
      this.data.filter.search_NationalId = '';
      this.data.filter.search_MobileNumber = '';
      this.data.filter.search_ProjectNumber = '';
      this.data.filter.search_Description = '';
      this.data.filter.isChecked = false;
      this.data.filter.search_FilterType = null;
      this.GetAllProjects();
    }
  }

  //----------------------------------End Search-------------------------------------

  //-------------------------------runningTask------------------------------------------------

  runningTask: any = {
    projectId: 0,
    projectNo: null,
    customername: null,
    remaindays: null,
    tasks: [],
    datefrom: null,
    dateto: null,
    ProjectDatestring: null,
    percentage: null,
  };
  resetRunningTask() {
    this.runningTask = {
      projectId: 0,
      projectNo: null,
      customername: null,
      remaindays: null,
      tasks: [],
      datefrom: null,
      dateto: null,
      ProjectDatestring: null,
      percentage: null,
    };
  }
  GetAllProjCurrentTasks(projid: any) {
    this._projectService.GetAllProjectCurrentTasks(projid).subscribe((data) => {
      debugger;
      this.runningTask.tasks = data.result;
      this.projectTasksDataSource = new MatTableDataSource(data.result);
    });
  }

  currenttasks_btn(element: any) {
    this.resetRunningTask();
    this.runningTask.projectId = element.projectId;
    this.runningTask.projectNo = element.projectNo;
    var remaindays = this.getdiffsate(element.projectExpireDate);
    this.runningTask.remaindays = remaindays + 'يوم';
    this.runningTask.customername = element.customerName;

    this.runningTask.ProjectDatestring = element.timeStr;
    this.runningTask.datefrom = element.projectDate;
    this.runningTask.dateto = element.projectExpireDate;
    this.GetAllProjCurrentTasks(element.projectId);
    this.runningTask.percentage = this.SetPerRunningTasks(element);
  }
  getdiffsate(end: any) {
    var enddate = new Date(end);
    var today = new Date();
    enddate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const oneDay = 1000 * 60 * 60 * 24;
    if (today <= enddate) {
      const diffInTime = enddate.getTime() - today.getTime();
      var diffInDays = Math.round(diffInTime / oneDay);
      diffInDays = diffInDays + 1;
      return diffInDays;
    } else {
      return 0;
    }
  }

  //----------------------------end---runningTask------------------------------------------------

  //-------------------------------runningTask------------------------------------------------

  projectWorkers: any = {
    projectId: 0,
    projectNo: null,
    customername: null,
    remaindays: null,
    users: [],
    datefrom: null,
    dateto: null,
    ProjectDatestring: null,
    percentage: null,
  };
  resetprojectWorkers() {
    this.projectWorkers = {
      projectId: 0,
      projectNo: null,
      customername: null,
      remaindays: null,
      users: [],
      datefrom: null,
      dateto: null,
      ProjectDatestring: null,
      percentage: null,
    };
  }
  GetAllProjectWorkers(projid: any) {
    this._projectService.GetAllProjectWorkers(projid).subscribe((data) => {
      this.projectWorkers.users = data.result;
      this.projectUsersDataSource = new MatTableDataSource(data.result);
    });
  }
  ShowImg(pho: any) {
    var img = environment.PhotoURL + pho;
    return img;
  }
  getprojectWorkers_btn(element: any) {
    this.resetprojectWorkers();
    this.projectWorkers.projectId = element.projectId;
    this.projectWorkers.projectNo = element.projectNo;
    this.projectWorkers.customername = element.customerName;

    this.projectWorkers.ProjectDatestring = element.timeStr;
    this.projectWorkers.datefrom = element.projectDate;
    this.projectWorkers.dateto = element.projectExpireDate;
    this.GetAllProjectWorkers(element.projectId);
    this.projectWorkers.percentage = this.SetPerRunningTasks(element);
  }

  //----------------------------end---runningTask------------------------------------------------
  getRowDataProject(data: any) {
    this.RowData = data;
  }
  getRowDataProjectSave() {
    var data = {
      projectId: parseInt(this.PopupAfterSaveObj.ProjectId),
      customerId: parseInt(this.PopupAfterSaveObj.CustomerId),
    };
    this.RowData = data;
  }

  projectFinish: any = {
    fini_radio: '',
    fini_Reason: '',
    fini_ReasonId: null,
  };
  finishProject_btn(modal: any) {
    var reatxt = '';
    if (this.projectFinish.fini_radio == '1') reatxt = 'مكتمل';
    else if (this.projectFinish.fini_radio == '2') reatxt = 'ملغاه';
    else if (this.projectFinish.fini_radio == '3') reatxt = 'متوقف';
    else {
      reatxt = '';
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    if (this.projectFinish.fini_ReasonId == null) {
      this.toast.error('من فضلك أختر السبب ', 'رسالة');
      return;
    }

    var type = 0;
    var whichClickDesc = 4;
    if (this.checkedEmail == true) type = 1;
    else if (this.checkedPhone == true) type = 2;
    else if (this.checkedEmail == true && this.checkedPhone == true) type = 3;

    this._projectstatusService
      .FinishProject(
        this.RowData.projectId,
        this.projectFinish.fini_ReasonId,
        reatxt,
        this.projectFinish.fini_radio,
        reatxt,
        this._sharedService.date_TO_String(new Date()),
        type,
        whichClickDesc
      )
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetAllProjects();
          modal?.dismiss();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  confirmDelete_btn() {
    this._projectstatusService
      .DeleteProject(this.RowData.projectId)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetAllProjects();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  Pro_userPermissionsDataSource = new MatTableDataSource();
  Pro_userPermissions: any = [];
  Pro_selectAllValue = false;

  Pro_selectedUserPermissions: any = {
    userPrivId: 0,
    userId: null,
    privilegeId: null,
    projectID: null,
    projectno: null,
    select: null,
    insert: null,
    update: null,
    delete: null,
  };

  Pro_resetPrivProject() {
    this.Pro_selectedUserPermissions = {
      userPrivId: 0,
      userId: null,
      privilegeId: null,
      projectID: null,
      projectno: null,
      select: null,
      insert: null,
      update: null,
      delete: null,
    };
    this.Pro_selectAllValue = false;
  }
  Pro_setSelectedUserPermissions(userPrivId: any) {
    let data = this.Pro_userPermissions.filter(
      (a: { userPrivId: any }) => a.userPrivId == userPrivId
    )[0];
    this.Pro_selectedUserPermissions = data;
  }
  Pro_setValues(event: any) {
    this.Pro_selectedUserPermissions['select'] = event.target.checked;
    this.Pro_selectedUserPermissions['insert'] = event.target.checked;
    this.Pro_selectedUserPermissions['update'] = event.target.checked;
    this.Pro_selectedUserPermissions['delete'] = event.target.checked;
  }
  Pro_addNewUserPermissions() {
    var val = this.CheckProjectPerm(9, null);
    if (val.status == false) {
      this.toast.error(val.msg, 'رسالة');
      return;
    }

    var count = this.Pro_userPermissions.filter(
      (a: { userId: any }) =>
        a.userId == this.Pro_selectedUserPermissions.userId
    ).length;
    if (this.Pro_selectedUserPermissions.userPrivId == 0) {
      if (count > 0) {
        this.toast.error('تم أختيار هذا المستخدم مسبقا', 'رسالة');
        return;
      }
    }
    if (this.Pro_selectedUserPermissions.userId == null) {
      this.toast.error('أختر مستخدم', 'رسالة');
      return;
    }
    var PrivsObj: any = {};
    PrivsObj.UserPrivId = this.Pro_selectedUserPermissions.userPrivId;
    PrivsObj.PrivilegeId = '121212';
    PrivsObj.Projectno = this.RowData.projectNo;
    PrivsObj.ProjectID = this.RowData.projectId;
    PrivsObj.CustomerID = this.RowData.customerId;
    PrivsObj.UserId = this.Pro_selectedUserPermissions.userId;

    PrivsObj.Select = this.Pro_selectedUserPermissions.select ?? false;
    PrivsObj.Insert = this.Pro_selectedUserPermissions.insert ?? false;
    PrivsObj.Update = this.Pro_selectedUserPermissions.update ?? false;
    PrivsObj.Delete = this.Pro_selectedUserPermissions.delete ?? false;
    this._projectService.SavePriv2(PrivsObj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.Pro_resetPrivProject();
        this.GetAllPriv();
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }
  Pro_deletePermissions() {
    this._projectService
      .DeletePriv(this.publicidRow.userPrivId)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.Pro_resetPrivProject();
          this.GetAllPriv();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  Pro_UserperFill: any;
  Pro_FillUserPermission() {
    this._projectService.FillAllUsersSelectAll().subscribe((data) => {
      this.Pro_UserperFill = data;
    });
  }

  GetAllPriv() {
    if (this.RowData.projectNo != null) {
      this._projectService
        .GetAllPriv(this.RowData.projectNo)
        .subscribe((data) => {
          this.Pro_userPermissions = data;
          this.Pro_userPermissionsDataSource = new MatTableDataSource(
            this.Pro_userPermissions
          );
        });
    }
  }

  //----------------------------------end----btn--------------------------------------------
  //-----------------------------Project--Permissions----------------------------------------
  userPermissionsDataSource = new MatTableDataSource();
  userPermissions: any = [];

  selectedUserPermissions: any = {
    idRow: 0,
    userName: null,
    userid: null,
    watch: null,
    add: null,
    edit: null,
    delete: null,
  };

  resetPrivProject() {
    this.selectedUserPermissions = {
      idRow: 0,
      userid: null,
      userName: null,
      watch: null,
      add: null,
      edit: null,
      delete: null,
    };
    this.selectAllValue = false;
  }
  setSelectedUserPermissions(index: any) {
    let data = this.userPermissions.filter(
      (a: { idRow: any }) => a.idRow == index
    )[0];
    this.selectedUserPermissions = data;
  }
  setValues(event: any) {
    console.log('event');
    console.log(event);
    this.selectedUserPermissions['watch'] = event.target.checked;
    this.selectedUserPermissions['add'] = event.target.checked;
    this.selectedUserPermissions['edit'] = event.target.checked;
    this.selectedUserPermissions['delete'] = event.target.checked;
  }
  addNewUserPermissions() {
    var count = this.userPermissions.filter(
      (a: { userid: any }) => a.userid == this.selectedUserPermissions.userid
    ).length;
    if (this.selectedUserPermissions.idRow == 0) {
      if (count > 0) {
        this.toast.error('تم أختيار هذا المستخدم مسبقا', 'رسالة');
        return;
      }
    }
    if (this.selectedUserPermissions.userid == null) {
      this.toast.error('أختر مستخدم', 'رسالة');
      return;
    }
    var UserNameF = this.UserperFill.filter(
      (a: { id: any }) => a.id == this.selectedUserPermissions.userid
    )[0].name;
    if (this.selectedUserPermissions.idRow == 0) {
      var maxVal = 0;
      debugger;
      if (this.userPermissions.length > 0) {
        maxVal = Math.max(
          ...this.userPermissions.map((o: { idRow: any }) => o.idRow)
        );
      } else {
        maxVal = 0;
      }
      this.userPermissions?.push({
        idRow: maxVal + 1,
        userid: this.selectedUserPermissions.userid,
        userName: UserNameF,
        watch: this.selectedUserPermissions.watch,
        add: this.selectedUserPermissions.add,
        edit: this.selectedUserPermissions.edit,
        delete: this.selectedUserPermissions.delete,
      });
    } else {
      //edit
      var obj = this.userPermissions.filter(
        (a: { idRow: any }) => a.idRow == this.selectedUserPermissions.idRow
      )[0];
      obj.idRow = this.selectedUserPermissions.idRow;
      obj.userid = this.selectedUserPermissions.userid;
      obj.userName = UserNameF;
      obj.watch = this.selectedUserPermissions.watch;
      obj.add = this.selectedUserPermissions.add;
      obj.edit = this.selectedUserPermissions.edit;
      obj.delete = this.selectedUserPermissions.delete;
    }
    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );
    this.resetPrivProject();
  }
  deletePermissions() {
    let index = this.userPermissions.findIndex(
      (d: { idRow: any }) => d.idRow == this.publicidRow
    );
    this.userPermissions.splice(index, 1);
    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );
  }

  UserperFill: any;
  FillUserPermission() {
    this._projectService.FillAllUsersSelectAll().subscribe((data) => {
      debugger;
      this.UserperFill = data;
    });
  }

  //-----------------------------------------------------------------------

  //-------------------------------Req---------------------------------------
  projectgoalList: any = [];
  projectreqandgoalpopupLabel: any;
  getallreqbyprojecttype() {
    this.projectgoalList = [];
    if (this.modalDetailsProject.projectType == null) {
      this.toast.error('أختر نوع المشروع أولا', 'رسالة');
      return;
    }
    this.projectreqandgoalpopupLabel = 'تحديد اهداف المشروع ';

    this._projectService
      .GetAllRequirmentbyprojecttype(this.modalDetailsProject.projectType)
      .subscribe((data) => {
        this.projectgoalList = data.result;
        this.projectGoalsDataSource = new MatTableDataSource(data.result);
        this.calctotal2();
      });
  }

  Totaltimestr: any = 0;
  calctotal2() {
    var dayes = 0,
      months = 0,
      hours = 0,
      weeks = 0;
    this.projectgoalList.forEach((element: any) => {
      if (element.timeType == '1') {
        dayes = dayes + parseInt(element.timeNo);
      } else if (element.timeType == '2') {
        weeks = weeks + parseInt(element.timeNo);
      } else if (element.timeType == '3') {
        months = months + parseInt(element.timeNo);
      } else if (element.timeType == '4') {
        hours = hours + parseInt(element.timeNo);
      }
    });
    var totaldayes = 0;
    var dayeshour = 0;
    var allemonth = 0;
    var remainhour = 0;
    var totalweek = 0;
    var alldayes = 0;
    totaldayes = parseInt((weeks * 7 + months * 30 + dayes).toString());
    dayeshour = parseInt((hours / 24).toString());
    remainhour = parseInt((hours % 24).toString());
    totaldayes = parseInt((totaldayes + dayeshour).toString());
    allemonth = parseInt((totaldayes / 30).toString());
    totalweek = parseInt(((totaldayes % 30) / 7).toString());
    alldayes = parseInt(((totaldayes % 30) % 7).toString());
    var monthstr = '';
    var weekstr = '';
    var daystr = '';
    var hourstr = '';
    if (allemonth > 0) {
      monthstr = allemonth + ' شهر ';
    }
    if (totalweek > 0) {
      weekstr = totalweek + ' اسبوع ';
    }
    if (alldayes > 0) {
      daystr = alldayes + ' يوم ';
    }
    if (remainhour > 0) {
      hourstr = remainhour + ' ساعة ';
    }

    var duration = monthstr + weekstr + daystr + hourstr;
    this.Totaltimestr = duration;
  }
  selectGoalForProject(data: any) {}

  //----------------------------------------------------------------------

  //------------------------------EditProject------------------------------
  editProject(data: any) {
    this.ProjectPopupFunc();
    this.modalDetailsProject = {
      projectId: data.projectId,
      projectNo: data.projectNo,
      projectDuration: null,
      branch: data.branchId,
      center: data.costCenterId,
      from: this._sharedService.String_TO_date(data.projectDate),
      to: this._sharedService.String_TO_date(data.projectExpireDate),
      projectType: data.projectTypeId,
      subProjectDetails: data.subProjectTypeId,
      customer: data.customerId,
      buildingType: data.buildingType,
      service: null,
      user: data.mangerId,
      region: data.cityId,
      projectDescription: data.projectDescription,
      offerPriceNumber: data.offersPricesId,
      projectDepartment: data.departmentId,
      projectPermissions: [],
      projectGoals: null,

      //proSettingdet:false,
      ProjectSettingNo: null,
      ProjectSettingNote: null,
      projectDurationLbl: null,

      servicesDiv: false,

      pmimgdiv: false,
      ProjectFlag: false,
      SubProjectFlag: false,
      SubProjectBranch: false,
      totalPhases_duration_txt: null,
      totalPhases_duration_Acc: 0,
      totalProject_duration_Acc: 0,
    };
    this.GetImgManager();
    this.GetProjectDurationStr();
    this.branchChange();
    this.modalDetailsProject.center = data.costCenterId;
    this.TypeProjectChange();
    this.modalDetailsProject.subProjectDetails = data.subProjectTypeId;
    this.customerChange();
    if (data.offersPricesId == 0)
      this.modalDetailsProject.offerPriceNumber = null;
    else this.modalDetailsProject.offerPriceNumber = data.offersPricesId;

    this.subTypeProjectChangeEdit();
  }
  //---------------------------End EditProject-----------------------------

  projectRow: any;
  publicidRow: any;

  invoicepop = 1;

  NewTaskpop = 1;
  InvoiceModelPublic: any;

  open(content: any, data?: any, type?: any, index?: any, model?: any) {
    this.publicidRow = 0;
    if (index != null) {
      this.selectedServiceRow = index;
    }
    if (type == 'addproject') {
      this.ProjectPopupFunc();
      this.GenerateNextProjectNumber();
    }
    if (data && type == 'edit') {
      var val = this.CheckProjectPerm(7, data);
      if (val.status == false) {
        this.toast.error(val.msg, 'رسالة');
        return;
      }
      this.editProject(data);
    }
    if (type == 'addInvoice') {
      this.ListDataServices_Invoice = [];
      this.SureServiceList_Invoice = [];
      this.OfferPopupAddorEdit_Invoice = 0;
      this.invoicepop = 3;
      this.InvoicePopup(2);
    }
    if (type == 'addInvoiceProject') {
      this.ListDataServices_Invoice = [];
      this.SureServiceList_Invoice = [];
      this.OfferPopupAddorEdit_Invoice = 0;
      this.invoicepop = 2;
      this.InvoicePopup(2);
    }
    if (type == 'contract') {
      this.projectRow = data;
    }
    if (type == 'details') {
      var val = this.CheckProjectPerm(8, data);
      if (val.status == false) {
        this.toast.error(val.msg, 'رسالة');
        return;
      }

      this.projectDetails = data;
      this.GetProSettingDetails(data.projectId);
    }
    // if (type == 'detailsAfterProjSave') {
    //   //this.GetProDetails(this.PopupAfterSaveObj.ProjectId);
    //   this.GetProDetails(40);

    // }
    if (type == 'detailsCon') {
      var val = this.CheckProjectPerm(8, this.projectRow);
      if (val.status == false) {
        this.toast.error(val.msg, 'رسالة');
        return;
      }
      this.projectDetails = this.projectRow;
      this.GetProSettingDetails(this.projectRow.projectId);
    } else if (type == 'addNewTaskSave') {
      this.NewTaskpop = 2;
      this.resetTaskData();
    } else if (type == 'addNewTask') {
      var val = this.CheckProjectPerm(1, data);
      if (val.status == false) {
        this.toast.error(val.msg, 'رسالة');
        return;
      }
      this.NewTaskpop = 1;
      this.resetTaskData();
    }
    if (type == 'addtasktype') {
      debugger;
      this.resetTaskType();
    }
    if (type == 'stopProjectModal') {
      var val = this.CheckProjectPerm(2, data);
      if (val.status == false) {
        this.toast.error(val.msg, 'رسالة');
        return;
      }
    }
    if (type == 'playProjectModal') {
      var val = this.CheckProjectPerm(3, data);
      if (val.status == false) {
        this.toast.error(val.msg, 'رسالة');
        return;
      }
    }
    if (type == 'deleteProjectModal') {
      var val = this.CheckProjectPerm(4, data);
      if (val.status == false) {
        this.toast.error(val.msg, 'رسالة');
        return;
      }
    }
    if (type == 'endModalProject') {
      var val = this.CheckProjectPerm(5, data);
      if (val.status == false) {
        this.toast.error(val.msg, 'رسالة');
        return;
      }
    }
    if (type == 'Project Type') {
      this.addProjectType = true;
    }
    if (type == 'AssignedTasksModal') {
      //this.GetTasksWithoutUser();
    }
    if (type == 'runningTasksModal') {
      this.currenttasks_btn(data);
    }
    if (type == 'projectUsersModal') {
      this.getprojectWorkers_btn(data);
    }
    if (type == 'projectGoalsModal') {
      if (this.modalDetailsProject.projectType == null) {
        this.toast.error('أختر نوع المشروع أولا', 'رسالة');
        return;
      }
    }
    if (type == 'modifyPermissionsModal') {
      if (this.modalDetailsProject.customer == null) {
        this.toast.error('من فضلك أختر عميل أولا', 'رسالة');
        return;
      } else {
        this.FillUserPermission();
      }
    }
    if (type == 'Pro_modifyPermissionsModal') {
      var val = this.CheckProjectPerm(6, data);
      if (val.status == false) {
        this.toast.error(val.msg, 'رسالة');
        return;
      }
      this.publicidRow = data;
      this.Pro_FillUserPermission();
      this.GetAllPriv();
    }

    if (type === 'deleteModalPerm') {
      this.publicidRow = data.idRow;
    }
    if (type === 'Pro_deleteModalPerm') {
      this.publicidRow = data;
    }

    if (type == 'serviceDetails' && data) {
      this.serviceDetails = data;
    }

    if (type == 'Installments') {
      this.contractWithInstallments = true;
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
        size: type ? (type == 'contract' ? 'xxl' : 'xl') : 'lg',
        centered: type
          ? type == 'contract'
            ? true
            : type == 'SaveInvoiceConfirmModal'
            ? true
            : false
          : true,
        backdrop: 'static',
        keyboard: false,
      })
      .result.then(
        (result) => {
          if (type == 'edit') {
            this.ResetAllControls();
          }
          this.contractWithInstallments = false;
          this.participants = [];
          this.installments = [];
          this.bands = [];
          this.offerServices = [];
          this.addProjectType = false;
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any, type?: any): string {
    this.addProjectType = false;
    this.contractWithInstallments = false;
    this.participants = [];
    this.installments = [];
    this.bands = [];
    this.offerServices = [];
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  ValidateMsg: any = { status: true, msg: null };
  CheckProjectPerm(type: any, data: any) {
    this.ValidateMsg = { status: true, msg: null };

    if (type == 1) {
      //add task
      var date1 = new Date(data.projectExpireDate);
      var date2 = new Date();
      date1.setHours(0, 0, 0, 0);
      date2.setHours(0, 0, 0, 0);
      if (data.stopProjectType == 1) {
        this.ValidateMsg = { status: false, msg: 'قم بتشغيل المشروع اولا' };
        return this.ValidateMsg;
      } else if (date1 < date2) {
        this.ValidateMsg = {
          status: false,
          msg: 'المشروع متأخر لا يمكنك اضافة مهمة عليه الان',
        };
        return this.ValidateMsg;
      } else if (
        this.userG?.userPrivileges.includes(1118) ||
        this.userG?.isAdmin ||
        data.insert
      ) {
        this.ValidateMsg = { status: true, msg: 'لديك صلاحية' };
        return this.ValidateMsg;
      } else {
        this.ValidateMsg = { status: false, msg: 'ليس لديك صلاحية' };
        return this.ValidateMsg;
      }
    } else if (type == 2 || type == 3) {
      //stop project play project
      if (this.userG?.userPrivileges.includes(1117)) {
        this.ValidateMsg = { status: true, msg: 'لديك صلاحية' };
        return this.ValidateMsg;
      } else {
        this.ValidateMsg = { status: false, msg: 'ليس لديك صلاحية' };
        return this.ValidateMsg;
      }
    } else if (type == 4) {
      //delete project
      if (data.stopProjectType == 1) {
        this.ValidateMsg = { status: false, msg: 'قم بتشغيل المشروع اولا' };
        return this.ValidateMsg;
      }

      if (
        this.userG?.userPrivileges.includes(1118) ||
        this.userG?.isAdmin ||
        data.delete
      ) {
        this.ValidateMsg = { status: true, msg: 'لديك صلاحية' };
        return this.ValidateMsg;
      } else {
        this.ValidateMsg = { status: false, msg: 'ليس لديك صلاحية' };
        return this.ValidateMsg;
      }
    } else if (type == 5) {
      //finish project
      if (data.stopProjectType == 1) {
        this.ValidateMsg = { status: false, msg: 'قم بتشغيل المشروع اولا' };
        return this.ValidateMsg;
      }

      if (
        this.userG?.userPrivileges.includes(1118) ||
        this.userG?.userPrivileges.includes(111026) ||
        this.userG?.isAdmin
      ) {
        this.ValidateMsg = { status: true, msg: 'لديك صلاحية' };
        return this.ValidateMsg;
      } else {
        this.ValidateMsg = { status: false, msg: 'ليس لديك صلاحية' };
        return this.ValidateMsg;
      }
    } else if (type == 6) {
      //edit project priv
      if (data.stopProjectType == 1) {
        this.ValidateMsg = { status: false, msg: 'قم بتشغيل المشروع اولا' };
        return this.ValidateMsg;
      }

      if (
        this.userG?.userPrivileges.includes(1118) ||
        this.userG?.isAdmin ||
        data.update
      ) {
        this.ValidateMsg = { status: true, msg: 'لديك صلاحية' };
        return this.ValidateMsg;
      } else if (
        data.mangerId == this.userG.userId ||
        data.addUser == this.userG.userId
      ) {
        this.ValidateMsg = { status: true, msg: 'لديك صلاحية' };
        return this.ValidateMsg;
      } else {
        this.ValidateMsg = { status: false, msg: 'ليس لديك صلاحية' };
        return this.ValidateMsg;
      }
    } else if (type == 7) {
      //edit project
      if (data.stopProjectType == 1) {
        this.ValidateMsg = { status: false, msg: 'قم بتشغيل المشروع اولا' };
        return this.ValidateMsg;
      }

      if (
        this.userG?.userPrivileges.includes(1118) ||
        this.userG?.isAdmin ||
        data.update
      ) {
        this.ValidateMsg = { status: true, msg: 'لديك صلاحية' };
        return this.ValidateMsg;
      } else {
        this.ValidateMsg = { status: false, msg: 'ليس لديك صلاحية' };
        return this.ValidateMsg;
      }
    } else if (type == 8) {
      // project Details
      if (
        this.userG?.userPrivileges.includes(1118) ||
        this.userG?.isAdmin ||
        data.select
      ) {
        this.ValidateMsg = { status: true, msg: 'لديك صلاحية' };
        return this.ValidateMsg;
      } else {
        this.ValidateMsg = { status: false, msg: 'ليس لديك صلاحية' };
        return this.ValidateMsg;
      }
    } else if (type == 9) {
      // save priv
      if (
        this.userG?.userPrivileges.includes(1118) ||
        this.userG?.isAdmin ||
        this.publicidRow.insert ||
        this.publicidRow.update
      ) {
        this.ValidateMsg = { status: true, msg: 'لديك صلاحية' };
        return this.ValidateMsg;
      } else if (
        this.publicidRow.mangerId == this.userG.userId ||
        this.publicidRow.addUser == this.userG.userId
      ) {
        this.ValidateMsg = { status: true, msg: 'لديك صلاحية' };
        return this.ValidateMsg;
      } else {
        this.ValidateMsg = { status: false, msg: 'ليس لديك صلاحية' };
        return this.ValidateMsg;
      }
    }

    this.ValidateMsg = { status: false, msg: 'ليس لديك صلاحية' };
    return this.ValidateMsg;
  }

  CheckPrivProject(mData: any) {
    if (Object.keys(mData).length === 0) return false;
    if (
      this.userG?.userPrivileges.includes(1118) ||
      this.userG?.userPrivileges.includes(1111) ||
      this.userG?.isAdmin ||
      mData.update
    ) {
      return true;
    } else if (mData.stopProjectType == 1) {
      return false;
    } else {
      return false;
    }
  }
  CheckPrivProjectShow(mData: any) {
    if (Object.keys(mData).length === 0) return false;
    if (
      this.userG?.userPrivileges.includes(1118) ||
      this.userG?.userPrivileges.includes(1111) ||
      this.userG?.isAdmin ||
      mData.update
    ) {
      return false;
    } else if (mData.select) {
      return true;
    } else {
      return false;
    }
  }

  projDet: any = {
    settingNoP: null,
    settingNoteP: null,
  };
  resetprojDet() {
    this.projDet = {
      settingNoP: null,
      settingNoteP: null,
    };
  }
  GetProSettingDetails(projectId: any) {
    this.resetprojDet();
    this._projectService.GetProSettingDetails(projectId).subscribe((data) => {
      this.projDet.settingNoP = data.settingNoP;
      this.projDet.settingNoteP = data.settingNoteP;
    });
  }
  ManagerImg: any = null;
  GetImgManager() {
    if (this.modalDetailsProject.user != null) {
      this._projectService
        .GetUserById(this.modalDetailsProject.user)
        .subscribe((data) => {
          this.ManagerImg = environment.PhotoURL + data.result.imgUrl;
        });
    } else {
      this.ManagerImg = '/assets/images/login-img.png';
    }
  }
  GetProDetails() {
    this.resetprojDet();
    //this.PopupAfterSaveObj.ProjectId
    this._projectService
      .GetProDetails(this.PopupAfterSaveObj.ProjectId)
      .subscribe((data) => {
        this.projectDetails = data;
        this.projDet.settingNoP = data.settingNoP;
        this.projDet.settingNoteP = data.settingNoteP;
        this.modalService.open(this.projectDetailsModal, { size: 'xl' });
      });
  }
  addProject() {
    if (this.ProjectNoType == 2) {
      this._projectService.GetProjectCode_S().subscribe((data) => {
        var ValueUser = this.modalDetailsProject.projectNo;
        var ValueSys = data.result;
        var NewValue = ValueUser.substring(0, ValueSys.length);
        if (NewValue == ValueSys) {
          this.toast.error(
            'لا يمكن إدخال رقم مشروع بنفس الرقم التسلسلي ، فضلا أدخل رقما مختلفا',
            'رسالة'
          );
          return;
        }
        this.saveProject();
      });
    } else {
      this.saveProject();
    }
  }

  checkedEmail: any;
  checkedPhone: any;
  EmailValue: any;
  PhoneValue: any;

  // stopCheckedEmail: any; stopCheckedPhone: any;

  // checkedEmailProject: any;checkedPhoneProject: any;
  // stopCheckedEmailProject: any; stopCheckedPhoneProject: any;

  GetCustomersByCustomerId(id: any) {
    this._projectService.GetCustomersByCustomerId(id).subscribe((data) => {
      this.checkedEmail = false;
      this.checkedPhone = false;
      this.EmailValue = data.result.customerEmail;
      this.PhoneValue = data.result.customerMobile;
    });
  }

  SendCustomerEmail_SMS(type: any) {
    var typesend = 0;
    if (type == 'Email') typesend = 1;
    else if (type == 'Mobile') typesend = 2;

    this._projectService
      .SendCustomerEmail_SMS(
        this.PopupAfterSaveObj.CustomerId,
        this.PopupAfterSaveObj.ProjectId,
        typesend
      )
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  ProjectIdPublicReturn: any;

  PopupAfterSaveObj: any = {
    ProjectId: 0,
    CustomerId: 0,
    ProjectNo: null,
    WithSetting: null,
    FirstTaskUserName: null,
    CustomerName: null,
    BranchName: null,
    ManagerName: null,
    ProjectDuration: null,
    DepartmentName: null,
  };
  disableButtonSave_Project = false;
  saveProject() {
    // this.GetCustomersByCustomerId(1);
    // this.PopupAfterSaveObj.ProjectId=1;
    // this.modalService.dismissAll();
    // this.modalService.open(this.noticModal, { size: 'xl' });
    // return;
    if (this.modalDetailsProject.projectNo == null) {
      this.toast.error('لا يمكنك حفظ مشروع بدون رقم', 'رسالة');
      return;
    }
    if (this.userPermissions.length == 0) {
      this.toast.error('من فضلك أختر صلاحيات المستخدم', 'رسالة');
      return;
    }
    if (this.modalDetailsProject.from >= this.modalDetailsProject.to) {
      this.toast.error('من فضلك أختر تاريخ صحيح', 'رسالة');
      return;
    }
    if (
      this.modalDetailsProject.projectNo == null ||
      this.modalDetailsProject.branch == null ||
      this.modalDetailsProject.center == null ||
      this.modalDetailsProject.from == null ||
      this.modalDetailsProject.to == null ||
      this.modalDetailsProject.projectType == null ||
      this.modalDetailsProject.subProjectDetails == null ||
      this.modalDetailsProject.customer == null ||
      this.modalDetailsProject.buildingType == null ||
      this.modalDetailsProject.user == null ||
      this.modalDetailsProject.projectDescription == null ||
      this.modalDetailsProject.projectDepartment == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    var Privs = [];
    this.userPermissions.forEach((element: any) => {
      var priv: any = {};
      priv.UserPrivId = 0;
      priv.PrivilegeId = '121212';
      priv.Projectno = this.modalDetailsProject.projectNo;
      priv.UserId = element.userid;
      priv.ProjectID = 0;
      priv.CustomerID = this.modalDetailsProject.customer;
      priv.Select = element.watch ?? false;
      priv.Insert = element.add ?? false;
      priv.Update = element.edit ?? false;
      priv.Delete = element.delete ?? false;

      Privs.push(priv);
    });

    var priv2: any = {};
    priv2.UserPrivId = 0;
    priv2.PrivilegeId = '121212';
    priv2.Projectno = this.modalDetailsProject.projectNo;
    priv2.UserId = this.userG.userId;
    priv2.ProjectID = 0;
    priv2.CustomerID = this.modalDetailsProject.customer;
    priv2.Select = true;
    priv2.Insert = true;
    priv2.Update = true;
    priv2.Delete = true;
    Privs.push(priv2);

    let data = this.projectgoalList.filter(
      (a: { choose: any }) => a.choose == true
    );

    var RequirementsandGoals: any = [];
    data.forEach((element: any) => {
      var req: any = {};
      req.RequirementId = element.requirementId;
      RequirementsandGoals.push(req);
    });

    var ProjectObj: any = {};
    ProjectObj.ProjectId = 0;
    ProjectObj.ProjectNo = this.modalDetailsProject.projectNo;

    if (this.modalDetailsProject.from != null) {
      ProjectObj.ProjectDate = this._sharedService.date_TO_String(
        this.modalDetailsProject.from
      );
      const nowHijri = toHijri(this.modalDetailsProject.from);
      ProjectObj.ProjectHijriDate =
        this._sharedService.hijri_TO_String(nowHijri);
    }
    if (this.modalDetailsProject.to != null) {
      ProjectObj.ProjectExpireDate = this._sharedService.date_TO_String(
        this.modalDetailsProject.to
      );
      const nowHijri2 = toHijri(this.modalDetailsProject.to);
      ProjectObj.ProjectExpireHijriDate =
        this._sharedService.hijri_TO_String(nowHijri2);
    }
    // ProjectObj.ProjectDate = this._sharedService.date_TO_String(this.modalDetailsProject.from);
    // ProjectObj.ProjectHijriDate = null
    // ProjectObj.ProjectExpireDate = this._sharedService.date_TO_String(this.modalDetailsProject.to);
    // ProjectObj.ProjectExpireHijriDate = null;

    ProjectObj.ParentProjectId = null;
    ProjectObj.CustomerId = this.modalDetailsProject.customer;
    ProjectObj.BuildingType = this.modalDetailsProject.buildingType;
    ProjectObj.MangerId = this.modalDetailsProject.user;
    ProjectObj.DepartmentId = this.modalDetailsProject.projectDepartment;
    ProjectObj.CityId = this.modalDetailsProject.region;
    ProjectObj.ProjectDescription = this.modalDetailsProject.projectDescription;
    ProjectObj.ProjectTypeId = this.modalDetailsProject.projectType;
    ProjectObj.SubProjectTypeId = this.modalDetailsProject.subProjectDetails;
    ProjectObj.BranchId = this.modalDetailsProject.branch;
    ProjectObj.CostCenterId = this.modalDetailsProject.center;
    ProjectObj.ProjectNoType = this.ProjectNoType;
    ProjectObj.OffersPricesId = this.modalDetailsProject.offerPriceNumber;
    ProjectObj.IsNotSent = false;

    if (
      this.modalInvoice.InvoiceNumber == 0 ||
      this.modalInvoice.InvoiceNumber == null
    ) {
      ProjectObj.TransactionTypeId = 0;
    } else {
      ProjectObj.TransactionTypeId = 1;
    }
    ProjectObj.ProUserPrivileges = Privs;
    ProjectObj.ProjectRequirementsGoals = RequirementsandGoals;

    //return;
    this.disableButtonSave_Project = true;
    setTimeout(() => {
      this.disableButtonSave_Project = false;
    }, 7000);

    if (this.modalDetailsProject.ProjectFlag == true) {
      this._projectService
        .SaveProjectPhasesTasks(ProjectObj)
        .subscribe((result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            this.ProjectIdPublicReturn = result.returnedStr;
            this.saveReqForProject(result.returnedStr);
            if(this.WhatsAppData.sendactivationProject==true)
            {
              this.SendWhatsAppTask(null,result.returnedStr);
            }
            var custname = this.Customers.filter(
              (a: { id: any }) => a.id == this.modalDetailsProject.customer
            )[0].name;
            var branname = this.Branches.filter(
              (a: { id: any }) => a.id == this.modalDetailsProject.branch
            )[0].name;
            var manname = this.Managers.filter(
              (a: { id: any }) => a.id == this.modalDetailsProject.user
            )[0].name;
            var depname = this.Department.filter(
              (a: { id: any }) =>
                a.id == this.modalDetailsProject.projectDepartment
            )[0].name;

            this.PopupAfterSaveObj = {
              ProjectId: result.returnedStr,
              CustomerId: this.modalDetailsProject.customer,
              ProjectNo: this.modalDetailsProject.projectNo,
              WithSetting: null,
              FirstTaskUserName: null,
              CustomerName: custname,
              BranchName: branname,
              ManagerName: manname,
              ProjectDuration: this.modalDetailsProject.projectDuration,
              DepartmentName: depname,
            };
            if (this.modalDetailsProject.ProjectFlag == true) {
              this.PopupAfterSaveObj.WithSetting = 'بسير';
            } else {
              this.PopupAfterSaveObj.WithSetting = 'بدون سير';
            }
            if (
              !(
                this.modalInvoice.InvoiceNumber == 0 ||
                this.modalInvoice.InvoiceNumber == null
              )
            ) {
              this.modalInvoice.ProjectId = result.returnedStr;
              this.modalInvoice.WhichClick = 1;
              this.checkPayTypeAndSave();
            }
            this.GetCustomersByCustomerId(this.PopupAfterSaveObj.CustomerId);
            this.modalService.dismissAll();
            this.modalService.open(this.noticModal, { size: 'xl' });
            this.GetAllProjects();
          } else {
            console.log(result.returnedStr);
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        });
    } else {
      this._projectService.SaveProject(ProjectObj).subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.ProjectIdPublicReturn = result.returnedStr;
          this.saveReqForProject(result.returnedStr);
          var custname = this.Customers.filter(
            (a: { id: any }) => a.id == this.modalDetailsProject.customer
          )[0].name;
          var branname = this.Branches.filter(
            (a: { id: any }) => a.id == this.modalDetailsProject.branch
          )[0].name;
          var manname = this.Managers.filter(
            (a: { id: any }) => a.id == this.modalDetailsProject.user
          )[0].name;
          var depname = this.Department.filter(
            (a: { id: any }) =>
              a.id == this.modalDetailsProject.projectDepartment
          )[0].name;

          this.PopupAfterSaveObj = {
            ProjectId: result.returnedStr,
            CustomerId: this.modalDetailsProject.customer,
            ProjectNo: this.modalDetailsProject.projectNo,
            WithSetting: null,
            FirstTaskUserName: null,
            CustomerName: custname,
            BranchName: branname,
            ManagerName: manname,
            ProjectDuration: this.modalDetailsProject.projectDuration,
            DepartmentName: depname,
          };
          if (this.modalDetailsProject.ProjectFlag == true) {
            this.PopupAfterSaveObj.WithSetting = 'بسير';
          } else {
            this.PopupAfterSaveObj.WithSetting = 'بدون سير';
          }
          if (
            !(
              this.modalInvoice.InvoiceNumber == 0 ||
              this.modalInvoice.InvoiceNumber == null ||
              this.modalInvoice.TotalVoucherValueLbl == 0 ||
              this.modalInvoice.TotalVoucherValueLbl == null
            )
          ) {
            this.modalInvoice.ProjectId = result.returnedStr;
            this.modalInvoice.WhichClick = 1;
            this.checkPayTypeAndSave();
          }

          this.GetCustomersByCustomerId(this.PopupAfterSaveObj.CustomerId);

          this.modalService.dismissAll();
          this.modalService.open(this.noticModal, { size: 'xl' });

          this.GetAllProjects();
        } else {
          console.log(result.returnedStr);
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
    }
  }

  saveReqForProject(projectid: any) {
    this._projectService
      .SaveRequirementsbyProjectId(projectid)
      .subscribe((result: any) => {});
  }

  addProject_Edit() {
    if (this.ProjectNoType == 2) {
      this._projectService.GetProjectCode_S().subscribe((data) => {
        var ValueUser = this.modalDetailsProject.projectNo;
        var ValueSys = data.result;
        var NewValue = ValueUser.substring(0, ValueSys.length);
        if (NewValue == ValueSys) {
          this.toast.error(
            'لا يمكن إدخال رقم مشروع بنفس الرقم التسلسلي ، فضلا أدخل رقما مختلفا',
            'رسالة'
          );
          return;
        }
        this.saveProject_Edit();
      });
    } else {
      this.saveProject_Edit();
    }
  }
  saveProject_Edit() {
    if (this.modalDetailsProject.projectNo == null) {
      this.toast.error('لا يمكنك حفظ مشروع بدون رقم', 'رسالة');
      return;
    }
    // if(this.userPermissions.length==0){
    //   this.toast.error('من فضلك أختر صلاحيات المستخدم', 'رسالة');return;
    // }
    if (this.modalDetailsProject.from >= this.modalDetailsProject.to) {
      this.toast.error('من فضلك أختر تاريخ صحيح', 'رسالة');
      return;
    }
    if (
      this.modalDetailsProject.projectNo == null ||
      this.modalDetailsProject.branch == null ||
      this.modalDetailsProject.center == null ||
      this.modalDetailsProject.from == null ||
      this.modalDetailsProject.to == null ||
      this.modalDetailsProject.projectType == null ||
      this.modalDetailsProject.subProjectDetails == null ||
      this.modalDetailsProject.customer == null ||
      this.modalDetailsProject.buildingType == null ||
      this.modalDetailsProject.user == null ||
      this.modalDetailsProject.projectDescription == null ||
      this.modalDetailsProject.projectDepartment == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }

    let data = this.projectgoalList.filter(
      (a: { choose: any }) => a.choose == true
    );

    var RequirementsandGoals: any = [];
    data.forEach((element: any) => {
      var req: any = {};
      req.RequirementId = element.requirementId;
      RequirementsandGoals.push(req);
    });

    var ProjectObj: any = {};
    ProjectObj.ProjectId = this.modalDetailsProject.projectId;
    ProjectObj.ProjectNo = this.modalDetailsProject.projectNo;
    ProjectObj.ProjectDate = this._sharedService.date_TO_String(
      this.modalDetailsProject.from
    );
    ProjectObj.ProjectHijriDate = null;
    ProjectObj.ProjectExpireDate = this._sharedService.date_TO_String(
      this.modalDetailsProject.to
    );
    ProjectObj.ProjectExpireHijriDate = null;
    ProjectObj.ParentProjectId = null;
    ProjectObj.CustomerId = this.modalDetailsProject.customer;
    ProjectObj.BuildingType = this.modalDetailsProject.buildingType;
    ProjectObj.MangerId = this.modalDetailsProject.user;
    ProjectObj.DepartmentId = this.modalDetailsProject.projectDepartment;
    ProjectObj.CityId = this.modalDetailsProject.region;
    ProjectObj.ProjectDescription = this.modalDetailsProject.projectDescription;
    ProjectObj.ProjectTypeId = this.modalDetailsProject.projectType;
    ProjectObj.SubProjectTypeId = this.modalDetailsProject.subProjectDetails;
    ProjectObj.BranchId = this.modalDetailsProject.branch;
    ProjectObj.CostCenterId = this.modalDetailsProject.center;
    ProjectObj.ProjectNoType = this.ProjectNoType;
    ProjectObj.OffersPricesId = this.modalDetailsProject.offerPriceNumber;
    //ProjectObj.IsNotSent = false;

    ProjectObj.ProjectRequirementsGoals = RequirementsandGoals;

    //return;
    this.disableButtonSave_Project = true;
    setTimeout(() => {
      this.disableButtonSave_Project = false;
    }, 7000);

    if (this.modalDetailsProject.ProjectFlag == true) {
      this._projectService
        .UpdateProjectPhasesTasks(ProjectObj)
        .subscribe((result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            this.ProjectIdPublicReturn = result.returnedStr;
            this.modalService.dismissAll();
            // this.modalService.open(this.noticModal);
            this.GetAllProjects();
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        });
    } else {
      this._projectService
        .UpdateProject(ProjectObj)
        .subscribe((result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            this.ProjectIdPublicReturn = result.returnedStr;
            this.modalService.dismissAll();
            // this.modalService.open(this.noticModal);
            this.GetAllProjects();
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        });
    }
  }

  CheckcharNo() {}

  endProject() {}

  unSaveProjectInTop() {}

  applyProjectFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectsDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterPerm(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userPermissionsDataSource.filter = filterValue.trim().toLowerCase();
  }
  Pro_applyFilterPerm(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.Pro_userPermissionsDataSource.filter = filterValue
      .trim()
      .toLowerCase();
  }

  applyRequirementsFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectRequirementsDataSource.filter = filterValue
      .trim()
      .toLowerCase();
  }
  applyGoalsFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectGoalsDataSource.filter = filterValue.trim().toLowerCase();
  }
  applytaskswithoutuserFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.AssignedTasksDataSource.filter = filterValue.trim().toLowerCase();
  }
  applyUsersFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectUsersDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyTasksFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectTasksDataSource.filter = filterValue.trim().toLowerCase();
  }

  changeRequestStatus(event: any) {
    this.modalDetailsProject.ProjectFlag = event.target.checked;
    if (this.modalDetailsProject.ProjectSettingNo == null) {
      this.modalDetailsProject.ProjectFlag = false;
    }
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

  addNewMission() {}

  addService(index: any) {
    this.offerServices?.push({
      id: index + 1,
      name: '',
      unit: '',
      amount: 0,
      price: 0,
      vatTax: 0,
      taxes: 0,
    });
  }

  deleteService(index: any) {
    this.offerServices?.splice(index, 1);
  }

  applyFilterServiceList_Offer(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.serviceListDataSource_Offer.filter = filterValue.trim().toLowerCase();
  }

  setServiceRowValue_Offer(index: any) {
    this.offerServices[this.selectedServiceRow] =
      this.servicesList_Offer[index];
  }

  addBand(index: any) {
    this.bands?.push({
      clauseId: index + 1,
      clause: '',
    });
  }

  deleteBand(index: any) {
    this.bands?.splice(index, 1);
  }

  addParticipant(index: any) {
    this.participants?.push({
      id: index + 1,
      employeeName: '',
      duration: '',
      percentage: '',
      salary: '',
      cost: '',
    });
  }

  deleteParticipant(index: any) {
    this.participants?.splice(index, 1);
  }

  setOfferPriceChecked(event: any) {
    this.offerPriceChecked = event.target.checked;
  }

  addInstallments(data: any) {}

  addContract() {}
  //-------------------------------------btn (+) -------------------------------
  //#region
  dataAdd: any = {
    projecttype: {
      id: 0,
      nameAr: null,
      nameEn: null,
      typeum: null,
    },
    subprojecttype: {
      id: 0,
      nameAr: null,
      nameEn: null,
      timePeriod: null,
    },
    buildtype: {
      id: 0,
      nameAr: null,
      nameEn: null,
      description: null,
    },
    citytype: {
      id: 0,
      nameAr: null,
      nameEn: null,
    },
    Reasontype: {
      id: 0,
      nameAr: null,
      nameEn: null,
    },
    Storehouse: {
      id: 0,
      nameAr: null,
      nameEn: null,
    },
  };

  //-----------------------------------Project Type------------------------------------------------
  ProjectTypeRowSelected: any;
  getProjecttypeRow(row: any) {
    this.ProjectTypeRowSelected = row;
  }
  setProjectTypeInSelect(data: any, model: any) {
    this.modalDetailsProject.projectType = data.id;
  }
  resetProjectType() {
    this.resetGoalsProjectType();
    this.dataAdd.projecttype.id = 0;
    this.dataAdd.projecttype.nameAr = null;
    this.dataAdd.projecttype.nameEn = null;
  }
  saveProjectType() {
    if (
      this.dataAdd.projecttype.nameAr == null ||
      this.dataAdd.projecttype.nameEn == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    var ProjectTypeObj: any = {};
    ProjectTypeObj.TypeId = this.dataAdd.projecttype.id;
    ProjectTypeObj.NameAr = this.dataAdd.projecttype.nameAr;
    ProjectTypeObj.NameEn = this.dataAdd.projecttype.nameEn;
    ProjectTypeObj.Typeum = this.dataAdd.projecttype.typeum;
    var input = { valid: true, message: '' };
    this.ProjectTypeGoals.forEach((element: any, index: any) => {
      if (element.RequirmentName == null || element.RequirmentName == '') {
        input.valid = false;
        input.message = 'من فضلك أكتب اسم المتطلب والهدف';
        return;
      }
      if (element.EmpDepType == 1) {
        if (element.EmployeeId == null || element.EmployeeId == 0) {
          input.valid = false;
          input.message = 'من فضلك أختر اسم المستخدم';
          return;
        }
      } else {
        if (element.DepartmentId == null || element.DepartmentId == 0) {
          input.valid = false;
          input.message = 'من فضلك أختر القسم';
          return;
        }
      }
      if (element.timeNo == null || element.timeNo == 0) {
        input.valid = false;
        input.message = 'من فضلك أختر المدة المتوقعة';
        return;
      }
    });
    if (!input.valid) {
      this.toast.error(input.message);
      return;
    }
    var RequirementsandGoals: any = [];
    this.ProjectTypeGoals.forEach((element: any) => {
      var req: any = {};
      req.RequirementId = element.RequirementId;
      req.LineNumber = element.idRow;
      req.RequirmentName = element.RequirmentName;
      if (parseInt(element.EmpDepType) == 1) {
        req.EmployeeId = element.EmployeeId;
        req.DepartmentId = null;
      } else {
        req.EmployeeId = null;
        req.DepartmentId = element.DepartmentId;
      }
      req.TimeNo = element.timeNo.toString();
      req.TimeType = element.timeType.toString();
      RequirementsandGoals.push(req);
    });

    ProjectTypeObj.RequirementsandGoals = RequirementsandGoals;

    this._projectService
      .SaveProjectType(ProjectTypeObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.resetProjectType();
          this.FillProjectTypeSelect();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  confirmProjecttypeDelete() {
    this._projectService
      .DeleteProjectType(this.ProjectTypeRowSelected.id)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.FillProjectTypeSelect();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  resetGoalsProjectType() {
    this.ProjectTypeGoals = [];
  }
  ProjectTypeGoals: any = [];

  addNewRowProjectGoal() {
    var maxVal = 0;
    if (this.ProjectTypeGoals.length > 0) {
      maxVal = Math.max(
        ...this.ProjectTypeGoals.map((o: { idRow: any }) => o.idRow)
      );
    } else {
      maxVal = 0;
    }
    let Goal = {
      idRow: maxVal + 1,
      RequirementId: 0,
      RequirmentName: null,
      EmpDepType: 1,
      EmployeeId: null,
      DepartmentId: null,
      timeNo: null,
      timeType: 4,
    };
    this.ProjectTypeGoals.push(Goal);
    this.FillSelectEmployee_ProGoals();
    this.FillDepartment_ProGoals();
  }
  Employee_ProGoals: any;
  FillSelectEmployee_ProGoals() {
    this._projectService.FillSelectEmployee().subscribe((data) => {
      this.Employee_ProGoals = data;
    });
  }
  Department_ProGoals: any;
  FillDepartment_ProGoals() {
    this._projectService.FillDepartmentSelectByTypeUser(1).subscribe((data) => {
      this.Department_ProGoals = data;
    });
  }
  deleteRow(idRow: any) {
    let index = this.ProjectTypeGoals.findIndex(
      (d: { idRow: any }) => d.idRow == idRow
    );
    this.ProjectTypeGoals.splice(index, 1);
  }

  timeTypemodelChangeFn(event: any, idRow: any) {
    let data = this.ProjectTypeGoals.filter(
      (d: { idRow: any }) => d.idRow == idRow
    )[0];
    data.timeType = event;
  }
  timeNomodelChangeFn(event: any, idRow: any) {
    let data = this.ProjectTypeGoals.filter(
      (d: { idRow: any }) => d.idRow == idRow
    )[0];
    data.timeNo = event;
  }
  Totaltimestr_ProGoals: any = null;
  calctotal() {
    var dayes = 0,
      months = 0,
      hours = 0,
      weeks = 0;
    this.ProjectTypeGoals.forEach((element: any) => {
      if (element.timeType == '1') {
        dayes = dayes + parseInt(element.timeNo ?? 0);
      } else if (element.timeType == '2') {
        weeks = weeks + parseInt(element.timeNo ?? 0);
      } else if (element.timeType == '3') {
        months = months + parseInt(element.timeNo ?? 0);
      } else if (element.timeType == '4') {
        hours = hours + parseInt(element.timeNo ?? 0);
      }
    });
    var totaldayes = 0;
    var dayeshour = 0;
    var allemonth = 0;
    var remainhour = 0;
    var totalweek = 0;
    var alldayes = 0;
    totaldayes = parseInt((weeks * 7 + months * 30 + dayes).toString());
    dayeshour = parseInt((hours / 24).toString());
    remainhour = parseInt((hours % 24).toString());
    totaldayes = parseInt((totaldayes + dayeshour).toString());
    allemonth = parseInt((totaldayes / 30).toString());
    totalweek = parseInt(((totaldayes % 30) / 7).toString());
    alldayes = parseInt(((totaldayes % 30) % 7).toString());
    var monthstr = '';
    var weekstr = '';
    var daystr = '';
    var hourstr = '';
    if (allemonth > 0) {
      monthstr = allemonth + ' شهر ';
    }
    if (totalweek > 0) {
      weekstr = totalweek + ' اسبوع ';
    }
    if (alldayes > 0) {
      daystr = alldayes + ' يوم ';
    }
    if (remainhour > 0) {
      hourstr = remainhour + ' ساعة ';
    }

    var duration = monthstr + weekstr + daystr + hourstr;
    this.Totaltimestr_ProGoals = duration;
  }

  addRow_ProGoalsl(element: any) {
    var EmpDepTypeV = 1;
    if (element.employeeId != null) EmpDepTypeV = 1;
    else EmpDepTypeV = 2;

    var maxVal = 0;
    if (this.ProjectTypeGoals.length > 0) {
      maxVal = Math.max(
        ...this.ProjectTypeGoals.map((o: { idRow: any }) => o.idRow)
      );
    } else {
      maxVal = 0;
    }
    let Goal = {
      idRow: maxVal + 1,
      RequirementId: element.requirementId,
      RequirmentName: element.requirmentName,
      EmpDepType: EmpDepTypeV,
      EmployeeId: element.employeeId,
      DepartmentId: element.departmentId,
      timeNo: element.timeNo,
      timeType: element.timeType,
    };
    this.ProjectTypeGoals.push(Goal);
    this.FillSelectEmployee_ProGoals();
    this.FillDepartment_ProGoals();
  }

  getallreq_ProGoals(element: any) {
    this.ProjectTypeGoals = [];
    this._projectService
      .GetAllRequirmentbyprojecttype(element.id)
      .subscribe((data) => {
        data.result.forEach((element: any) => {
          this.addRow_ProGoalsl(element);
        });
        this.calctotal();
      });
  }

  //----------------------------------(End)-Project Type---------------------------------------------

  //-----------------------------------SubProject Type------------------------------------------------
  SubProjectTypeRowSelected: any;
  getSubProjecttypeRow(row: any) {
    this.SubProjectTypeRowSelected = row;
  }
  setSubProjectTypeInSelect(data: any, model: any) {
    this.modalDetailsProject.subProjectDetails = data.id;
  }
  resetSubProjectType() {
    this.dataAdd.subprojecttype.id = 0;
    this.dataAdd.subprojecttype.nameAr = null;
    this.dataAdd.subprojecttype.nameEn = null;
  }
  saveSubProjectType() {
    if (
      this.dataAdd.subprojecttype.nameAr == null ||
      this.dataAdd.subprojecttype.nameEn == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    var ProSubTypeObj: any = {};
    ProSubTypeObj.SubTypeId = this.dataAdd.subprojecttype.id;
    ProSubTypeObj.ProjectTypeId = this.modalDetailsProject.projectType;
    ProSubTypeObj.NameAr = this.dataAdd.subprojecttype.nameAr;
    ProSubTypeObj.NameEn = this.dataAdd.subprojecttype.nameEn;
    ProSubTypeObj.TimePeriod =
      this.dataAdd.subprojecttype.timePeriod.toString();

    this._projectService
      .SaveProjectSubType(ProSubTypeObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.resetSubProjectType();
          this.FillProjectSubTypesSelect();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  confirmSubProjecttypeDelete() {
    debugger;
    this._projectService
      .DeleteProjectSubTypes(this.SubProjectTypeRowSelected.id)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.FillProjectSubTypesSelect();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  //------------------------------(End)-SubProject Type----------------------------------------
  //-----------------------------------build Type------------------------------------------------
  BuildTypeRowSelected: any;
  getbuildypeRow(row: any) {
    this.BuildTypeRowSelected = row;
  }
  setbuildTypeInSelect(data: any, model: any) {
    this.modalDetailsProject.buildingType = data.id;
  }
  resetbuildType() {
    this.dataAdd.buildtype.id = 0;
    this.dataAdd.buildtype.nameAr = null;
    this.dataAdd.buildtype.nameEn = null;
  }
  savebuildType() {
    if (
      this.dataAdd.buildtype.nameAr == null ||
      this.dataAdd.buildtype.nameEn == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    var BuildTypesObj: any = {};
    BuildTypesObj.BuildTypeId = this.dataAdd.buildtype.id;
    BuildTypesObj.NameAr = this.dataAdd.buildtype.nameAr;
    BuildTypesObj.NameEn = this.dataAdd.buildtype.nameEn;
    BuildTypesObj.Description = null;
    this._projectService
      .SaveBuildTypes(BuildTypesObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.resetbuildType();
          this.FillBuildTypeSelect();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  confirmbuildtypeDelete() {
    this._projectService
      .DeleteBuildTypes(this.BuildTypeRowSelected.id)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.FillBuildTypeSelect();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  //----------------------------------(End)-Build Type---------------------------------------------
  //-----------------------------------City Type------------------------------------------------
  CityTypeRowSelected: any;
  getcitytypeRow(row: any) {
    this.CityTypeRowSelected = row;
  }
  setcityTypeInSelect(data: any, modal: any) {
    this.modalDetailsProject.region = data.id;
  }
  resetcityType() {
    this.dataAdd.citytype.id = 0;
    this.dataAdd.citytype.nameAr = null;
    this.dataAdd.citytype.nameEn = null;
  }
  savecityType() {
    if (
      this.dataAdd.citytype.nameAr == null ||
      this.dataAdd.citytype.nameEn == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    var ProCityObj: any = {};
    ProCityObj.CityId = this.dataAdd.citytype.id;
    ProCityObj.NameAr = this.dataAdd.citytype.nameAr;
    ProCityObj.NameEn = this.dataAdd.citytype.nameEn;
    this._projectService.SaveCity(ProCityObj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.resetcityType();
        this.FillCitySelect();
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }
  confirmcitytypeDelete() {
    this._projectService
      .DeleteCity(this.CityTypeRowSelected.id)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.FillCitySelect();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  //----------------------------------(End)-City Type---------------------------------------------

  //-----------------------------------Reason Type------------------------------------------------
  Reason: any;
  ReasonTypesPopup: any;
  typeFinishCheck = 1;
  FillReasonsSelect() {
    this.dataFinish.fini_ReasonId = null;
    this.projectFinish.fini_ReasonId = null;
    this._projectService.FillReasonsSelect().subscribe((data) => {
      this.Reason = data;
      this.ReasonTypesPopup = data;
    });
  }
  ReasonTypeRowSelected: any;
  getReasontypeRow(row: any) {
    this.ReasonTypeRowSelected = row;
  }
  setReasonTypeInSelect(data: any, modal: any) {
    if (this.typeFinishCheck == 1) {
      //smart
      this.dataFinish.fini_ReasonId = data.id;
    } //project
    else {
      this.projectFinish.fini_ReasonId = data.id;
    }
  }
  resetReasonType() {
    this.dataAdd.Reasontype.id = 0;
    this.dataAdd.Reasontype.nameAr = null;
    this.dataAdd.Reasontype.nameEn = null;
  }
  saveReasonType() {
    if (
      this.dataAdd.Reasontype.nameAr == null ||
      this.dataAdd.Reasontype.nameEn == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    var ProReasonObj: any = {};
    ProReasonObj.ReasonsId = this.dataAdd.Reasontype.id;
    ProReasonObj.NameAr = this.dataAdd.Reasontype.nameAr;
    ProReasonObj.NameEn = this.dataAdd.Reasontype.nameEn;
    this._projectService.SaveReason(ProReasonObj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.resetReasonType();
        this.FillReasonsSelect();
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }
  confirmReasontypeDelete() {
    this._projectService
      .DeleteReason(this.ReasonTypeRowSelected.id)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.FillReasonsSelect();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  //----------------------------------(End)-Reason Type---------------------------------------------
  //#endregion
  //-------------------------------------------------------------------------------------------

  latitude: any = 24.72030293127678;
  longitude: any = 46.698462762671475;
  mapReady: boolean = false;
  zoom!: number;
  address!: string;
  private geoCoder: any;

  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 16;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }
  onMapReady(map?: google.maps.Map) {
    if (map) {
      map.setOptions({
        streetViewControl: false,
        fullscreenControl: false,
      });
      google.maps.event.addListener(map, 'click', (event) => {
        this.setLocation(event.latLng.lat(), event.latLng.lng());
      });
    }
  }
  setLocation(lat: any, lng: any) {
    this.latitude = lat;
    this.longitude = lng;
    this.getAddress(lat, lng);
  }

  markerDragEnd(event: any) {
    this.latitude = event.latLng.lat();
    this.longitude = event.latLng.lng();

    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude: any, longitude: any) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.geoCoder?.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results: any, status: any) => {
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 16;
            this.address = results[1].formatted_address;
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }

  uploadFile(data: any) {}

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

    WhichClick: 1,
    AddOrView: 1,
    TempBox: null,
  };
  InvoiceDetailsRows: any = [];
  Paytype: any;
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
      PayType: 8,
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

      WhichClick: 1,
      AddOrView: 1,
      TempBox: null,
    };
  }
  setCustomerInvoice() {
    this.modalInvoice.customerId = this.modalDetailsProject.customer;
    this.customerIdChange();
  }
  InvoicePopup(typepage: any) {
    if (typepage == 2) {
      this.FillCostCenterSelect();
      //this.FillAllCustomerSelectNotHaveProjWithBranch();
      this.FillAllCustomerSelectWithBranch();
      //this.GetBranch_Costcenter();
    } else if (typepage == 1) {
      this.FillCostCenterSelect_Invoices(null);
      this.FillCustomerSelectWProOnlyWithBranch();
    }
    this.FillStorehouseSelect();
    this.resetInvoiceData();
    if (this.invoicepop == 3) {
      this.modalInvoice.customerId = this.PopupAfterSaveObj.CustomerId;
      this.modalInvoice.ProjectId = this.PopupAfterSaveObj.ProjectId;
    }

    this.modalInvoice.popuptype = typepage;
    this.GetBranchOrganization();
    this.GenerateVoucherNumber();

    this.FillCustAccountsSelect2AndUpdate(this.modalInvoice.PayType);
    this.GetAllServicesPrice();
    this.setCustomerInvoice();
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
        this.modalInvoice.CostCenterId = data.result.costCenterId;
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
  //     this.modalInvoice.CostCenterId=data.result.costCenterId;

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
        // this.InvoiceDetailsRows=[];
        if (this.invoicepop != 2) {
          this.addInvoiceRow();
        }
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
    this.load_Projects = [];
    this.modalInvoice.ProjectId = null;
    if (customerid) {
      this._invoiceService
        .GetAllProjByCustomerId(customerid)
        .subscribe((data) => {
          this.load_Projects = data;
          if (this.load_Projects.length == 1) {
            this.modalInvoice.ProjectId = this.load_Projects[0].id;
            this.GetCostCenterByProId_Proj(this.modalInvoice.ProjectId);
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
      } else if (
        this.modalInvoice.popuptype == 2 ||
        this.modalInvoice.popuptype == 3
      ) {
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

    this.GetAllProjByCustomerId(this.modalInvoice.customerId);
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
  servicesList: any;
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
    if(this.modalInvoice.ToAccountId==null || this.modalInvoice.ToAccountId=="")
      {
        this.ValidateObjMsgInvoice = { status: false, msg: 'من فضلك أختر الحساب' };
        return this.ValidateObjMsgInvoice;
      }

    this.ValidateObjMsgInvoice = { status: true, msg: null };
    return this.ValidateObjMsgInvoice;
  }
  continuou(modal: any) {
    if (!(parseInt(this.modalInvoice.TotalVoucherValueLbl) > 0)) {
      this.toast.error('من فضلك أدخل قيمة صحيحة للفاتورة', 'رسالة');
      return;
    }
    modal?.dismiss();
  }
  disableButtonSave_Invoice = false;
  saveInvoice() {
    if (!(parseInt(this.modalInvoice.TotalVoucherValueLbl) > 0)) {
      this.toast.error('من فضلك أدخل قيمة صحيحة للفاتورة', 'رسالة');
      return;
    }
    var VoucherDetailsList: any = [];
    var VoucherObj: any = {};
    VoucherObj.InvoiceId = this.modalInvoice.InvoiceId;
    VoucherObj.InvoiceNumber = this.modalInvoice.InvoiceNumber;
    VoucherObj.JournalNumber = this.modalInvoice.JournalNumber;
    // VoucherObj.InvoicePayType= this.modalInvoice.PayType;
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
    if (this.modalInvoice.popuptype == 1 || this.invoicepop == 2) {
      VoucherObj.ProjectId = this.modalInvoice.ProjectId;
      VoucherObj.PageInsert = 3;
    }
    if (this.invoicepop == 3) {
      VoucherObj.ProjectId = this.PopupAfterSaveObj.ProjectId;
      VoucherObj.PageInsert = 1;
    }
    VoucherObj.PayType = this.modalInvoice.PayType;
    VoucherObj.DiscountPercentage = this.modalInvoice.DiscountPercentage;
    VoucherObj.DiscountValue = this.modalInvoice.DiscountValue;
    VoucherObj.CustomerId = this.modalInvoice.customerId;
    VoucherObj.printBankAccount = this.modalInvoice.printBankAccount;
    VoucherObj.InvoiceReference = this.modalInvoice.Reference;
    VoucherObj.PaidValue = this.modalInvoice.PaidValue;
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
    }, 9000);

    if (this.modalInvoice.WhichClick == 1) {
      this._invoiceService
        .SaveInvoiceForServices(VoucherObj).pipe(take(1))
        .subscribe((result: any) => {
          if (this.invoicepop != 2) {
            if (result.statusCode == 200) {
              this.toast.success(
                this.translate.instant(result.reasonPhrase),
                this.translate.instant('Message')
              );
              debugger;
              this.resetInvoiceData();
              //this.GetAllProjects();
              this.InvoiceModelPublic?.dismiss();
            } else {
              this.toast.error(
                this.translate.instant(result.reasonPhrase),
                this.translate.instant('Message')
              );
            }
          }
          debugger;
          if (result.statusCode == 200) {
            if (this.uploadedFiles.length > 0) {
              const formData = new FormData();
              formData.append('UploadedFile', this.uploadedFiles[0]);
              formData.append('InvoiceId', result.returnedParm);
              this._invoiceService
                .UploadPayVoucherImage(formData)
                .subscribe((result) => {});
            } else {
            }
          }
        });
    } else if (this.modalInvoice.WhichClick == 2) {
      this._invoiceService
        .SaveandPostInvoiceForServices(VoucherObj).pipe(take(1))
        .subscribe((result: any) => {
          if (this.invoicepop != 2) {
            if (result.statusCode == 200) {
              this.toast.success(
                this.translate.instant(result.reasonPhrase),
                this.translate.instant('Message')
              );
              this.resetInvoiceData();
              //this.GetAllProjects();
              this.InvoiceModelPublic?.dismiss();
            } else {
              this.toast.error(
                this.translate.instant(result.reasonPhrase),
                this.translate.instant('Message')
              );
            }
          }
          debugger;
          if (result.statusCode == 200) {
            if (this.uploadedFiles.length > 0) {
              const formData = new FormData();
              formData.append('UploadedFile', this.uploadedFiles[0]);
              formData.append('InvoiceId', result.returnedParm);
              this._invoiceService
                .UploadPayVoucherImage(formData)
                .subscribe((result) => {});
            } else {
            }
          }
        });
    } else if (this.modalInvoice.WhichClick == 3) {
      this._invoiceService
        .SaveInvoiceForServicesNoti(VoucherObj).pipe(take(1))
        .subscribe((result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            this.resetInvoiceData();
            //this.GetAllProjects();
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
      //this.modalDetailsProject.total_amount_text=data?.reasonPhrase;
    });
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
            if (this.invoicepop != 2) {
              this.addInvoiceRow();
            }
          }
          break;
      }
    }
  }

  //#endregion
  //------------------------------------(End) Invoice-------------------------------------------

  //---------------------filetype---------------
  //#region
  dataProjectFile: any = {
    filter: {
      enable: false,
      date: null,
      isChecked: false,
      filetypesearch: null,
    },
    file: {
      nameAr: null,
      nameEn: null,
      id: 0,
    },
    files: {
      nameAr: null,
      nameEn: null,
      id: 0,
    },
    FileId: 0,
    FileName: null,
    FileTypeValue: null,
    Certificate: false,
    allProjectNumbers: [],
    allProjectNumbersTemp: [],
    fileTemp: [],
  };
  public _projectFiles: ProjectFiles;

  FileRowSelected: any;
  FileTypeRowSelected: any;

  confirmFiletypeDelete() {
    this._fileuploadcenterService
      .DeleteFileType(this.FileTypeRowSelected.id)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.FillFileTypeSelect();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  getRow(row: any) {
    this.FileRowSelected = row;
  }
  getFiletypeRow(row: any) {
    this.FileTypeRowSelected = row;
  }

  applyFilterFileType(event: any) {
    const val = event.target.value.toLowerCase();
    const tempsource = this.dataProjectFile.fileTemp.filter(function (d: any) {
      return (
        d.name?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.nameEn?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    this.dataProjectFile.files = tempsource;
  }
  load_Project: any;
  load_FileType: any;
  FillProjectSelectFile() {
    this._fileuploadcenterService.FillProjectSelect().subscribe((data) => {
      this.load_Project = data;
      this.dataProjectFile.allProjectNumbers = data;
      this.dataProjectFile.allProjectNumbersTemp = data;
    });
  }
  FillFileTypeSelect() {
    this._fileuploadcenterService.FillFileTypeSelect().subscribe((data) => {
      this.load_FileType = data;
      this.dataProjectFile.files = data;
      this.dataProjectFile.fileTemp = data;
    });
  }

  AddPopup() {
    this.ClearField();
    this.FillProjectSelectFile();
    this.FillFileTypeSelect();
  }
  public uploadedFiles: Array<File> = [];
  selectedFiles?: FileList;
  currentFile?: File;

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }
  SaveprojectFiles(type: any, dataFile: any) {
    if (
      this.dataProjectFile.FileName == null ||
      this.dataProjectFile.FileTypeValue == null
    ) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }
    if (this.control?.value.length > 0) {
      console.log(this.control?.value[0]);
    }
    this._projectFiles = new ProjectFiles();
    if (type == 'add') {
      this._projectFiles.fileId = 0;
    } else {
      this._projectFiles.fileId = this.dataProjectFile.FileId;
    }
    this._projectFiles.projectId = this.PopupAfterSaveObj.ProjectId;
    this._projectFiles.fileName = this.dataProjectFile.FileName;
    this._projectFiles.isCertified = this.dataProjectFile.Certificate;
    this._projectFiles.typeId = this.dataProjectFile.FileTypeValue;
    this._projectFiles.notes = null;
    this._projectFiles.pageInsert = 2;

    if (this.control?.value.length > 0) {
      var obj = this._projectFiles;
      this._fileuploadcenterService
        .SaveprojectFiles(this.control?.value[0], obj)
        .subscribe((result: any) => {
          if (result?.body?.statusCode == 200) {
            this.toast.success(result?.body?.reasonPhrase, 'رسالة');
            this.ClearField();
            this.control.removeFile(this.control?.value[0]);
          } else if (result?.type >= 0) {
          } else {
            this.toast.error(result?.body?.reasonPhrase, 'رسالة');
          }
        });
    } else {
      this.toast.error('من فضلك أختر ملف', 'رسالة');
    }
  }
  ClearField() {
    this.dataProjectFile.FileId = 0;
    this.dataProjectFile.FileName = null;
    this.dataProjectFile.FileTypeValue = null;
    this.dataProjectFile.Certificate = false;
    this.selectedFiles = undefined;
    this.uploadedFiles = [];
  }
  setFileTypeInSelect(data: any, modal: any) {
    this.dataProjectFile.FileTypeValue = data.id;
  }

  //-----------------------------------------------------------------

  saveFileType() {
    if (
      this.dataProjectFile.file.nameAr == null ||
      this.dataProjectFile.file.nameEn == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }

    var FileTypeObj: any = {};
    FileTypeObj.FileTypeId = this.dataProjectFile.file.id;
    FileTypeObj.NameAr = this.dataProjectFile.file.nameAr;
    FileTypeObj.NameEn = this.dataProjectFile.file.nameEn;
    var obj = FileTypeObj;
    this._fileuploadcenterService.SaveFileType(obj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.resetFileType();
        this.FillFileTypeSelect();
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }
  resetFileType() {
    this.dataProjectFile.file.id = 0;
    this.dataProjectFile.file.nameAr = null;
    this.dataProjectFile.file.nameEn = null;
  }
  //#endregion
  //-------------------------------------------
  GetAllSettingsByProjectIDwithoutmain() {
    if (this.modalDetailsProject.subProjectDetails != null) {
      var dayes = 0,
        months = 0,
        hours = 0,
        weeks = 0;
      this._projectsettingService
        .GetAllSettingsByProjectIDwithoutmain(
          this.modalDetailsProject.subProjectDetails
        )
        .subscribe((res) => {
          if (res != null) {
            res.forEach((r: any) => {
              if (r.timeType == 2) {
                dayes = dayes + parseInt(r.timeMinutes ?? 0);
              } else if (r.timeType == 3) {
                weeks = weeks + parseInt(r.timeMinutes ?? 0);
              } else if (r.timeType == 4) {
                months = months + parseInt(r.timeMinutes ?? 0);
              } else if (r.timeType == 1) {
                hours = hours + parseInt(r.timeMinutes ?? 0);
              } else {
                hours = hours + parseInt(r.timeMinutes ?? 0);
              }
            });
            var totaldayes = 0,
              dayeshour = 0,
              allemonth = 0,
              remainhour = 0,
              totalweek = 0,
              alldayes = 0;
            totaldayes = parseInt((weeks * 7 + months * 30 + dayes).toString());
            dayeshour = parseInt((hours / 24).toString());
            remainhour = parseInt((hours % 24).toString());
            totaldayes = parseInt((totaldayes + dayeshour).toString());
            allemonth = parseInt((totaldayes / 30).toString());
            totalweek = parseInt(((totaldayes % 30) / 7).toString());
            alldayes = parseInt(((totaldayes % 30) % 7).toString());
            var monthstr = '',
              weekstr = '',
              daystr = '',
              hourstr = '';

            if (allemonth > 0) {
              monthstr = allemonth + ' شهر ';
            }
            if (totalweek > 0) {
              weekstr = totalweek + ' اسبوع ';
            }
            if (alldayes > 0) {
              daystr = alldayes + ' يوم ';
            }
            if (remainhour > 0) {
              hourstr = remainhour + ' ساعة ';
            }
            var duration = monthstr + weekstr + daystr + hourstr;
            this.modalDetailsProject.totalPhases_duration_txt = duration;
            this.modalDetailsProject.totalPhases_duration_Acc = totaldayes;
          } else {
            this.modalDetailsProject.totalPhases_duration_txt = null;
            this.modalDetailsProject.totalPhases_duration_Acc = 0;
          }
        });
    } else {
      this.modalDetailsProject.totalPhases_duration_txt = null;
      this.modalDetailsProject.totalPhases_duration_Acc = 0;
    }
  }

  selectedRowIndex = -1;
  highlight(row: any) {
    this.selectedRowIndex = row.projectId;
  }
  @ViewChild('contractCustomerMainModal') contractCustomerMainModal!: any;

  contractAddObj: any = {
    ContractType: 1,
  };
  OpenContract(type: any) {
    debugger;
    if (type == 'newContract') {
      this.contractAddObj.ContractType = 1;
      this.contractAddObj.CustomerId = parseInt(this.projectRow.customerId);
      this.contractAddObj.ProjectId = parseInt(this.projectRow.projectId);
    }
    if (type == 'Installments') {
      this.contractAddObj.ContractType = 2;
      this.contractAddObj.CustomerId = parseInt(this.projectRow.customerId);
      this.contractAddObj.ProjectId = parseInt(this.projectRow.projectId);
    }
    if (type == 'newContract_A') {
      this.contractAddObj.ContractType = 1;
      this.contractAddObj.CustomerId = parseInt(
        this.PopupAfterSaveObj.CustomerId
      );
      this.contractAddObj.ProjectId = parseInt(
        this.PopupAfterSaveObj.ProjectId
      );
    }
    if (type == 'Installments_A') {
      this.contractAddObj.ContractType = 2;
      this.contractAddObj.CustomerId = parseInt(
        this.PopupAfterSaveObj.CustomerId
      );
      this.contractAddObj.ProjectId = parseInt(
        this.PopupAfterSaveObj.ProjectId
      );
    }
    this.modalService.open(this.contractCustomerMainModal, { size: 'xl' });
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
      }
      // else
      // {
      //   this._invoiceService.GetServicesPriceVouByParentIdAndInvoiceId(element.AccJournalid,this.InvoicePublicView.invoiceId).subscribe(data=>{
      //     this.serviceDetails_Invoice = data.result;
      //     debugger
      //     var Check=true;
      //     if(this.ListDataServices_Invoice.length>0)
      //     {
      //       for (let ele of this.ListDataServices_Invoice) {
      //         var val = ele.filter((a: { parentId: any; })=>a.parentId==element.AccJournalid);
      //         if(val.length==0){Check=false;}
      //         else{Check=true;break;}
      //      }
      //     }
      //     else{Check=false;}

      //     if(Check==false){
      //       this.ListDataServices_Invoice.push(this.serviceDetails_Invoice);
      //     }
      //     this.serviceDetails_Invoice.sort((a: { lineNumber: number; },b: { lineNumber: number; }) => (a.lineNumber??0) - (b.lineNumber??0)); // b - a for reverse sort
      //   });
      // }
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

  OrganizationData: any;
  getorgdata() {
    debugger;
    this.api.GetOrganizationDataLogin().subscribe({
      next: (res: any) => {
        this.OrganizationData = res.result;
      },
      error: (error) => {},
    });
  }

  //#endregion

  SendWhatsAppTask(taskId:any,projectid:any) {
    const formData = new FormData();
    if(taskId!=null){formData.append('taskId', taskId);}
    if(projectid!=null){formData.append('projectid', projectid);}
    formData.append('environmentURL', environment.PhotoURL);
    this._phasestaskService.SendWhatsAppTask(formData).subscribe((result: any) => {

    });
  }

    //-----------------------------------Storehouse------------------------------------------------
  //#region 

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
