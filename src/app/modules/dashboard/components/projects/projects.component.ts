import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
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
import { BehaviorSubject } from 'rxjs';
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import { ProjectstatusService } from 'src/app/core/services/pro_Services/projectstatus.service';
import { PhasestaskService } from 'src/app/core/services/pro_Services/phasestask.service';
import { ProjectsettingService } from 'src/app/core/services/pro_Services/projectsetting.service';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent,
} from 'ng-apexcharts';
import { ProjectService } from 'src/app/core/services/pro_Services/project.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as go from 'gojs';

////////////////////////////

import { environment } from 'src/environments/environment';
import { ProjectVM } from 'src/app/core/Classes/ViewModels/projectVM';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent {
  @ViewChild(DatatableComponent) table: DatatableComponent | any;

  columns: any = [];
  checkedEmail: any;
  checkedPhone: any;
  stopCheckedEmail: any;
  stopCheckedPhone: any;

  isEditable: any = {};
  projectDetails: any = {
    projectNo: 'fefwqf',
    customer: 'fefwqf',
    projectType: 'fefwqf',
    projectName: 'fefwqf',
    subProjectType: 'fefwqf',
    stage: 'fefwqf',
    subStage: 'fefwqf',
    user: 'fefwqf',
    Region: 'fefwqf',
    contractNumber: 0,
    projectDuration: 'fefwqf',
    status: 2,
    progress: 50,
  };
  projects: any;
  openBox: any = false;
  boxId: any;
  @ViewChild('SmartFollower') smartModal: any;
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
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  showStats = false;
  showFilters = false;

  // delayedProjects: any;
  // latedProjects: any;

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

  userPermissionsDataSource = new MatTableDataSource();

  projectGoalsDataSource = new MatTableDataSource();

  projectUsersDataSource = new MatTableDataSource();
  projectTasksDataSource = new MatTableDataSource();

  projectsDataSource = new MatTableDataSource();

  modalDetails: any = {
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
  serviceListDataSource = new MatTableDataSource();

  servicesList: any;
  servicesListdisplayedColumns: string[] = ['name', 'price'];

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
    private translate: TranslateService
  ) {
    this.userG = this.authenticationService.userGlobalObj;
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();
    debugger;
    var IsLoaded = localStorage.getItem('IsLoadedBefore1') || 'false';
    if (IsLoaded == 'true') {
      this.IsLoadedBefore = 'true';
    } else {
      this.IsLoadedBefore = 'false';
      localStorage.setItem('IsLoadedBefore1', 'true');
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

    debugger;
    if (this.IsLoadedBefore == 'false') {
      this.getSmartFollowerData_Perm();
    }
    this.GetMyProjects();
    this.FillReasonsSelect();
    this._sharedService.GetWhatsAppSetting().subscribe((data: any) => {
      if(data?.result!=null){this.WhatsAppData=data?.result;}
      else{this.WhatsAppData={sendactivation:false,sendactivationOffer:false,sendactivationProject:false,sendactivationSupervision:false,};}
    });
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

    this.projects = [
      {
        projectNo: 'fefwqf',
        customer: 'fefwqf',
        projectType: 'fefwqf',
        projectName: 'fefwqf',
        subProjectType: 'fefwqf',
        stage: 'fefwqf',
        subStage: 'fefwqf',
        user: 'fefwqf',
        Region: 'fefwqf',
        contractNumber: 0,
        projectDuration: 'fefwqf',
        status: 2,
        progress: 50,
      },
      {
        projectNo: 'zxvzxv',
        customer: 'fefwqf',
        projectType: 'fefwqf',
        projectName: 'fefwqf',
        subProjectType: 'fefwqf',
        stage: 'fefwqf',
        subStage: 'fefwqf',
        user: 'fefwqf',
        Region: 'fefwqf',
        contractNumber: 'fefwqf',
        projectDuration: 'fefwqf',
        status: 2,
        progress: 50,
      },
      {
        projectNo: 'bfddg',
        customer: 'fefwqf',
        projectType: 'fefwqf',
        projectName: 'fefwqf',
        subProjectType: 'fefwqf',
        stage: 'fefwqf',
        subStage: 'fefwqf',
        user: 'fefwqf',
        Region: 'fefwqf',
        contractNumber: 'fefwqf',
        projectDuration: 'fefwqf',
        status: 0,
        progress: 10,
      },
      {
        projectNo: 'qweqe',
        customer: 'fefwqf',
        projectType: 'fefwqf',
        projectName: 'fefwqf',
        subProjectType: 'fefwqf',
        stage: 'fefwqf',
        subStage: 'fefwqf',
        user: 'fefwqf',
        Region: 'fefwqf',
        contractNumber: 'fefwqf',
        projectDuration: 'fefwqf',
        status: 2,
        progress: 50,
      },
      {
        projectNo: 'gtjrtjrt',
        customer: 'fefwqf',
        projectType: 'fefwqf',
        projectName: 'fefwqf',
        subProjectType: 'fefwqf',
        stage: 'fefwqf',
        subStage: 'fefwqf',
        user: 'fefwqf',
        Region: 'fefwqf',
        contractNumber: 'fefwqf',
        projectDuration: 'fefwqf',
        status: 5,
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

    this.projectsDataSource = new MatTableDataSource(this.projects);

    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );

    this.projectGoalsDataSource = new MatTableDataSource(this.projectGoals);

    this.projectUsersDataSource = new MatTableDataSource(this.projectUsers);

    this.projectTasksDataSource = new MatTableDataSource(this.projectTasks);

    this.servicesList = [
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

    this.serviceListDataSource = new MatTableDataSource(this.servicesList);
  }

  ngAfterViewInit() {
    // this.open(this.smartModal, null, 'smartModal');
  }

  ResetAllControls() {
    this.modalDetails = {
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
      VoucherNo: null,
    };
    this.GetProjectDurationStr();
  }
  projectDetails2: any;
  openproj(content: any, size?: any, data?: any, positions?: any, role?: any)
  {
    debugger
       if (role == 'details') {
      this.projectDetails2 = data;
      this.GetProSettingDetails(data.projectId);
      //this.projectDetails['id'] = 1;
    }

    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: size ? size : 'xl',
        centered: size == 'infoAction' ? true : false,
        backdrop: 'static',
        keyboard: false,
      })
      .result.then(
        (result) => {
          // this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  projDet: any = {
    settingNoP: null,
    settingNoteP: null,
  };
  GetProSettingDetails(projectId: any) {
    this._projectService.GetProSettingDetails(projectId).subscribe((data) => {
      // console\.log("GetProSettingDetails");
      // console\.log(data);
      this.projDet.settingNoP = data.settingNoP;
      this.projDet.settingNoteP = data.settingNoteP;
    });
  }


  open(content: any, data?: any, type?: any, index?: any) {
    if (index != null) {
      this.selectedServiceRow = index;
    }
    if (data && type == 'edit') {
      this.editProject(data);
      //this.modalDetails = data;
      //this.modalDetails['id'] = 1;
    }

    if (data && type == 'details') {
      this.projectDetails = data;
      this.projectDetails['id'] = 1;
    }

    if (type == 'Project Type') {
      this.addProjectType = true;
    }

    if (type == 'runningTasksModal') {
      this.currenttasks_btn(data);
    }
    if (type == 'runningTasksModal') {
      this.currenttasks_btn(data);
    }
    if (type == 'projectUsersModal') {
      this.getprojectWorkers_btn(data);
    }
    if (type == 'projectGoalsModal') {
      if (this.modalDetails.projectType == null) {
        this.toast.error('أختر نوع المشروع أولا', 'رسالة');
        return;
      }
    }
    if (type == 'modifyPermissionsModal') {
      if (this.modalDetails.customer == null) {
        this.toast.error('من فضلك أختر عميل أولا', 'رسالة');
        return;
      } else {
        this.FillUserPermission();
      }
    }
    if (type == 'Pro_modifyPermissionsModal') {
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
      this.serviceDetails['items'] = [
        { name: 'adwdawd' },
        { name: 'adwdawd' },
        { name: 'adwdawd' },
        { name: 'adwdawd' },
        { name: 'adwdawd' },
        { name: 'adwdawd' },
        { name: 'adwdawd' },
        { name: 'adwdawd' },
        { name: 'adwdawd' },
      ];
    }
    if (type == 'addNewTask') {
      this.resetTaskData();
    }
    if (type == 'Installments') {
      this.contractWithInstallments = true;
    }

    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? (type == 'contract' ? 'xxl' : 'xl') : 'lg',
        centered: type ? (type == 'contract' ? true : false) : true,
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

  addProject() {}

  // extend() {}

  // skip() {}

  confirm() {}

  unSaveProjectInTop() {}

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

  applyFilterServiceList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.serviceListDataSource.filter = filterValue.trim().toLowerCase();
  }

  setServiceRowValue(index: any) {
    this.offerServices[this.selectedServiceRow] = this.servicesList[index];
  }

  addBand(index: any) {
    console.log(index);

    this.bands?.push({
      clauseId: index + 1,
      clause: '',
    });
  }

  deleteBand(index: any) {
    this.bands?.splice(index, 1);
  }

  addParticipant(index: any) {
    console.log(index);

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
  ShowImguser(pho: any) {
    if (pho != null) {
      var img = environment.PhotoURL + pho;
      return img;
    }
    return '';
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
    if (this.dataFinish.fini_Reason == '') {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    this._projectstatusService
      .FinishProject(
        this.RowData.projectId,
        this.dataFinish.fini_radio,
        this.dataFinish.fini_Reason,
        this.dataFinish.fini_radio,
        reatxt,
        this._sharedService.date_TO_String(new Date()),
        0,
        0
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

  ///////////////////////////////////////////////////////////////////////////////////////////
  //#region MyProjects

  projectstatistics: any = {
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
  resetprojectstatistics() {
    this.projectstatistics = {
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
  MyProjects: any;

  GetMyProjects() {
    this._projectService.GetMyProjects().subscribe((data) => {
      this.MyProjects = data;
      console.log('my projects', data);
    });
  }



  Tasks: any;
  GetProjectMainPhasesByProjectId(projectid: any) {
    this._projectService.GetProjectMainPhasesByProjectId(projectid).subscribe({
      next: (data: any) => {
        // assign data to table
        debugger;
        this.Tasks = data.result;
        console.log('my Tasks', data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  MainPhaseSelect(item: any) {
    this.GetAllSubPhasesByMainPhaseId(item.phaseTaskId);
    this.GetAllSubPhasesTasksbyUserId2(item.phaseTaskId);
  }
  Supphasetasks: any;
  GetAllSubPhasesByMainPhaseId(phasetaskid: any) {
    this._projectService.GetProjectSubPhasesByProjectId(phasetaskid).subscribe({
      next: (data: any) => {
        // assign data to table
        debugger;
        this.Supphasetasks = data.result;
        console.log('my Tasks', data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  Supphasetasks2: any;
  GetAllSubPhasesTasksbyUserId2(phasetaskid: any) {
    this._projectService.GetAllSubPhasesTasksbyUserId2(phasetaskid).subscribe({
      next: (data: any) => {
        // assign data to table
        debugger;
        this.Supphasetasks2 = data.result;
        console.log('my Tasks', data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  TaskDetails: any = {
    remaining: null,
    descriptionAr: null,
    timeStr: null,
    projectMangerName: null,
    taskId: null,
  };
  GetTaskById(TaskId: any) {
    this._projectService.GetTaskById(TaskId).subscribe({
      next: (data: any) => {
        // assign data to table
        debugger;
        this.TaskDetails = data.result;
        this.TaskDetails.remaining =
          this.TaskDetails.remaining < 0 ? 'متاخرة' : 'جديدة';
        console.log('my Tasks', data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  ProjectSelect2(item: any) {
    debugger;
    console.log(item);
  }

  projectobj: any;

  getprojectstatistics_btn(element: any) {
    this.projectobj = element;
    this.resetprojectstatistics();
    debugger;
    this.projectstatistics.projectId = element.projectId;
    this.projectstatistics.projectNo = element.projectNo;
    this.projectstatistics.customername = element.customerName;

    this.projectstatistics.ProjectDatestring = element.timeStr;
    this.projectstatistics.datefrom = element.projectDate;
    this.projectstatistics.dateto = element.projectExpireDate;
    this.projectstatistics.percentage = this.SetPerRunningTasks(element);
    this.GetProjectMainPhasesByProjectId(element.projectId);
  }

  SetPerRunningTasks(dataObj: any) {
    debugger;
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

  ///////////////////////////////////////////////////////////////////////////////////
  //#region Action on project

  getRowDataProject(data: any) {
    debugger;
    this.RowData = data;
    // this._phasestaskService.GetProjectById(data.projectId).subscribe((result: any)=>{
    //   debugger;
    //   this.RowData=result.result;
    // });
  }
  //#endregion
  //-------------------------------------Add TAsk-------------------------------------------------------
  //#region Tasks
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
      console.log(this.control?.value[0]);
      const formData: FormData = new FormData();
      formData.append('uploadesgiles', this.control?.value[0]);
      formData.append('RequirementId', String(0));
      formData.append('PhasesTaskID', phaseid);
      formData.append('PageInsert', "1");
      this._phasestaskService
        .SaveProjectRequirement4(formData)
        .subscribe((result) => {});
    }
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
          this.GetMyProjects();
          element.destinationsUpload = statusVal;
          // this.getRowDataProject(element);
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
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
  FillProjectMainPhases() {
    this.AddTaskData.phaseid = null;
    if (this.AddTaskData.projectid != null) {
      this._phasestaskService
        .FillProjectMainPhases(this.AddTaskData.projectid)
        .subscribe((data) => {
          this.AddTaskData.loadphases = data;
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
    this.FillProjectSelectByCustomerId();

    //dawoud
    console.log(this.RowData);
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
      debugger;
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
    debugger;
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
    console.log('this.AddTaskData');
    console.log(this.AddTaskData);

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

    if (this.AddTaskData.datefrom == this.AddTaskData.dateto) {
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

    console.log('TaskObj-------------');
    console.log(TaskObj);

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
    debugger;
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
    debugger;
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
      this.RemTimeProjData.produrationexpect = null;
    }
  }

  RemTimeProjData: any = {
    timerem: null,
    prendexpect: null,
    footerdetails: null,
    produrationexpect: null,
  };

  getremainprojectdate(stdate: any, enddat: any) {
    debugger;
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
    } else if (date1 <= date2) {
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

  ShowImg(pho: any) {
    debugger;
    var img = environment.PhotoURL + pho;
    return img;
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

  //#endregion

  //#region

  currenttasks_btn(element: any) {
    this.resetRunningTask();
    debugger;
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
      console.log(data);
      this.runningTask.tasks = data.result;
      this.projectTasksDataSource = new MatTableDataSource(data.result);
    });
  }

  getdiffsate(end: any) {
    var enddate = new Date(end);
    var today = new Date();
    const oneDay = 1000 * 60 * 60 * 24;
    if (enddate > today) {
      const diffInTime = enddate.getTime() - today.getTime();
      const diffInDays = Math.round(diffInTime / oneDay);
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
      console.log(data);
      this.projectWorkers.users = data.result;
      this.projectUsersDataSource = new MatTableDataSource(data.result);
    });
  }

  getprojectWorkers_btn(element: any) {
    this.resetprojectWorkers();
    debugger;
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
  projectRow: any;
  publicidRow: any;
  projectFinish: any = {
    fini_radio: '',
    fini_Reason: '',
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
          //this.GetAllProjects();
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
          this.getSmartFollowerData_Perm();
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
    console.log('event');
    console.log(event);
    this.Pro_selectedUserPermissions['select'] = event.target.checked;
    this.Pro_selectedUserPermissions['insert'] = event.target.checked;
    this.Pro_selectedUserPermissions['update'] = event.target.checked;
    this.Pro_selectedUserPermissions['delete'] = event.target.checked;
  }
  Pro_addNewUserPermissions() {
    console.log(this.Pro_userPermissions);
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

    console.log('PrivsObj');
    console.log(PrivsObj);

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
    debugger;
    console.log('this.publicidRow');
    console.log(this.publicidRow);

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
      console.log(data);
      this.Pro_UserperFill = data;
    });
  }

  GetAllPriv() {
    debugger;
    if (this.RowData.projectNo != null) {
      this._projectService
        .GetAllPriv(this.RowData.projectNo)
        .subscribe((data) => {
          console.log('GetAllPriv');
          console.log(data);

          this.Pro_userPermissions = data;
          this.Pro_userPermissionsDataSource = new MatTableDataSource(
            this.Pro_userPermissions
          );
        });
    }
  }

  //----------------------------------end----btn--------------------------------------------
  //-----------------------------Project--Permissions----------------------------------------

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
    console.log(this.userPermissions);
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
    debugger;
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
      console.log(data);
      this.UserperFill = data;
    });
  }

  //-----------------------------------------------------------------------

  //-------------------------------Req---------------------------------------
  projectgoalList: any = [];
  projectreqandgoalpopupLabel: any;
  getallreqbyprojecttype() {
    this.projectgoalList = [];
    if (this.modalDetails.projectType == null) {
      this.toast.error('أختر نوع المشروع أولا', 'رسالة');
      return;
    }
    this.projectreqandgoalpopupLabel = 'تحديد اهداف المشروع ';

    this._projectService
      .GetAllRequirmentbyprojecttype(this.modalDetails.projectType)
      .subscribe((data) => {
        console.log(data);
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
      monthstr = allemonth + 'شهر';
    }
    if (totalweek > 0) {
      weekstr = totalweek + 'اسبوع';
    }
    if (alldayes > 0) {
      daystr = alldayes + 'يوم';
    }
    if (remainhour > 0) {
      hourstr = remainhour + 'ساعة';
    }

    var duration = monthstr + weekstr + daystr + hourstr;
    this.Totaltimestr = duration;
  }
  selectGoalForProject(data: any) {
    console.log(data);
  }

  //----------------------------------------------------------------------
  //#endregion

  /////////////////////////////////////#region  Projects////////////////////////////////
  BuildTypes: any;
  BuildTypesPopup: any;
  projectRequirementsDataSource = new MatTableDataSource();

  FillBuildTypeSelect() {
    this._projectService.FillBuildTypeSelect().subscribe((data) => {
      console.log(data);
      this.BuildTypes = data;
      this.BuildTypesPopup = data;
    });
  }
  City: any;
  CityTypesPopup: any;

  FillCitySelect() {
    this._projectService.FillCitySelect().subscribe((data) => {
      console.log(data);
      this.City = data;
      this.CityTypesPopup = data;
    });
  }
  ProjectTypes: any;
  ProjectTypesPopup: any;

  FillProjectTypeSelect() {
    this.ProjectSubTypes = [];
    this._projectService.FillProjectTypeSelect().subscribe((data) => {
      console.log(data);
      this.ProjectTypes = data;
      this.ProjectTypesPopup = data;
    });
  }
  ProjectSubTypes: any;
  ProjectSubTypesPopup: any;
  FillProjectSubTypesSelect() {
    if (this.modalDetails.projectType != null) {
      this._projectService
        .FillProjectSubTypesSelect(this.modalDetails.projectType)
        .subscribe((data) => {
          console.log(data);
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
      console.log(data.result);
      this.Customers = data.result;
    });
  }
  Managers: any;
  FillAllUsersSelectAll() {
    this._projectService.FillAllUsersSelectAll().subscribe((data) => {
      console.log(data);
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
      console.log(data);
      this.Department = data;
    });
  }
  Branches: any;
  FillBranchByUserIdSelect() {
    this.CostCenters = [];
    this._projectService.FillBranchByUserIdSelect().subscribe((data) => {
      console.log(data);
      this.Branches = data;
    });
  }
  CostCenters: any;
  FillCostCenterSelectBranch() {
    if (this.modalDetails.branch != null) {
      this._projectService
        .FillCostCenterSelectBranch(this.modalDetails.branch)
        .subscribe((data) => {
          console.log(data);
          this.CostCenters = data;
        });
    } else {
      this.CostCenters = [];
    }
  }

  branchChange() {
    this.FillCostCenterSelectBranch();
  }
  ProjectNoType = 1; // generated
  ProjectNoTxtChenged() {
    this.ProjectNoType = 2; // manual
  }

  CheckStartDate(event: any) {
    debugger;
    if (event != null) {
      this.modalDetails.from = event;
      this.GetProjectDurationStr();
    } else {
      this.modalDetails.from = null;
    }
  }
  CheckEndDate(event: any) {
    debugger;
    if (event != null) {
      this.modalDetails.to = event;
      this.GetProjectDurationStr();
    } else {
      this.modalDetails.to = null;
    }
  }

  GetProjectDurationStr() {
    if (this.modalDetails.from != null && this.modalDetails.to != null) {
      debugger;
      if (this.modalDetails.from > this.modalDetails.to) {
        debugger;
        this.modalDetails.from = new Date();
        this.modalDetails.to = this.addDays(new Date(), 1);
        this.modalDetails.projectDuration = null;
        this.toast.error(
          'لا يمكنك اختيار تاريخ النهاية أصغر من البداية',
          'رسالة'
        );
        return;
      }

      this._projectService
        .GetProjectDurationStr(
          this._sharedService.date_TO_String(this.modalDetails.from),
          this._sharedService.date_TO_String(this.modalDetails.to)
        )
        .subscribe((data) => {
          console.log(data);
          this.modalDetails.projectDuration = data.reasonPhrase;
        });
    } else {
      this.modalDetails.projectDuration = null;
    }
  }
  // CheckDateValid(){
  //   if(this.modalDetails.from!=null && this.modalDetails.to!=null)
  //   {
  //     if(this.modalDetails.from>this.modalDetails.to){
  //       debugger
  //       this.modalDetails.from=new Date();
  //       this.modalDetails.to=this.addDays(new Date(),1);

  //       this.toast.error('لا يمكنك اختيار تاريخ النهاية أصغر من البداية', 'رسالة');return;
  //     }
  //   }
  // }
  serviceList: any;
  GetServicesPriceByProjectId2() {
    if (
      this.modalDetails.projectType != null &&
      this.modalDetails.subProjectDetails != null
    ) {
      this._projectService
        .GetServicesPriceByProjectId2(
          this.modalDetails.projectType,
          this.modalDetails.subProjectDetails
        )
        .subscribe((data) => {
          console.log(data.result);
          this.serviceList = data.result;
        });
    } else {
      this.serviceList = [];
    }
  }
  GetTimePeriordBySubTypeId() {
    if (this.modalDetails.subProjectDetails != null) {
      this._projectService
        .GetTimePeriordBySubTypeId(this.modalDetails.subProjectDetails)
        .subscribe((data) => {
          console.log(data);
          if (data != null) {
            if (parseInt(data.TimePeriod) > 0) {
              this.SetNewDatewithTimePeriord(parseInt(data.timePeriod));
            }
          }
        });
    }
  }
  offerpriceList: any;
  FillAllOfferTodropdown() {
    this.modalDetails.offerPriceNumber = null;
    this.offerpriceList = [];
    if (this.modalDetails.customer != null) {
      this._projectService
        .FillAllOfferTodropdown(this.modalDetails.customer)
        .subscribe((data) => {
          console.log('offerpriceList');
          console.log(data);

          this.offerpriceList = data;
        });
    }
  }

  addDays(date: any, days: any) {
    var copy = new Date(Number(date));
    copy.setDate(date.getDate() + days);
    return copy;
  }
  SetNewDatewithTimePeriord(TimePeriod: any) {
    var date2 = this.modalDetails.from;
    var newDate = this.addDays(date2, TimePeriod);
    this.modalDetails.from = date2;
    this.modalDetails.to = newDate;
    this.GetProjectDurationStr();
  }

  TypeProjectChange() {
    this.modalDetails.subProjectDetails = null;
    this.FillProjectSubTypesSelect();
    this.GetAllCustomerForDropWithBranch();
    this.getallreqbyprojecttype();
  }
  subTypeProjectChange(model: any) {
    this.modalDetails.service = null;
    this.modalDetails.ProjectFlag = true;
    this.modalDetails.servicesDiv = true;
    this.GetServicesPriceByProjectId2();

    this.GetTimePeriordBySubTypeId();
    this.modalDetails.ProjectSettingNo = null;
    this.modalDetails.ProjectSettingNote = null;

    this.getProSettingnumber();
    this.GetProjectRequirementByProjectSubTypeSearchIdPoupup(model);
  }
  subTypeProjectChangeEdit() {
    this.modalDetails.service = null;
    this.modalDetails.ProjectFlag = true;
    this.modalDetails.servicesDiv = true;
    this.GetServicesPriceByProjectId2();

    this.GetTimePeriordBySubTypeId();
    this.modalDetails.ProjectSettingNo = null;
    this.modalDetails.ProjectSettingNote = null;

    this.CheckProSetting();
  }
  GetProjectSettingsDetails() {
    if (
      this.modalDetails.projectType != null &&
      this.modalDetails.subProjectDetails != null
    ) {
      this._projectService
        .GetProjectSettingsDetails(
          this.modalDetails.projectType,
          this.modalDetails.subProjectDetails
        )
        .subscribe((data) => {
          debugger;
          if (data.result != null) {
            this.modalDetails.ProjectSettingNo = data.result.proSettingNo;
            this.modalDetails.ProjectSettingNote = data.result.proSettingNote;
            this.modalDetails.ProjectFlag = true;
          } else {
            this.modalDetails.ProjectSettingNo = null;
            this.modalDetails.ProjectSettingNote = null;
            this.modalDetails.ProjectFlag = false;
          }
        });
    } else {
      this.modalDetails.ProjectSettingNo = null;
      this.modalDetails.ProjectSettingNote = null;
      this.modalDetails.ProjectFlag = false;
    }
  }

  CheckProSetting() {
    if (this.modalDetails.projectId != null) {
      this._projectService
        .GetProjectSettingsDetailsIFExist(this.modalDetails.projectId)
        .subscribe((data) => {
          debugger;
          if (data.result != null) {
            this.modalDetails.ProjectSettingNo = data.result.proSettingNo;
            this.modalDetails.ProjectSettingNote = data.result.proSettingNote;
            this.modalDetails.ProjectFlag = true;
          } else {
            this.modalDetails.ProjectSettingNo = null;
            this.modalDetails.ProjectSettingNote = null;
            this.modalDetails.ProjectFlag = false;
          }
        });
    } else {
      this.modalDetails.ProjectSettingNo = null;
      this.modalDetails.ProjectSettingNote = null;
      this.modalDetails.ProjectFlag = false;
    }
  }

  getProSettingnumber() {
    this.GetProjectSettingsDetails();
  }
  ProjectRequirementsList: any;
  GetProjectRequirementByProjectSubTypeSearchIdPoupup(model: any) {
    this.ProjectRequirementsList = [];
    if (this.modalDetails.subProjectDetails != null) {
      this._projectService
        .GetProjectRequirementByProjectSubTypeId(
          this.modalDetails.subProjectDetails
        )
        .subscribe((data) => {
          console.log(data);
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
      debugger;
      var link = environment.PhotoURL + data.attachmentUrl;
      window.open(link, '_blank');
    } catch (error) {
      this.toast.error('تأكد من الملف', 'رسالة');
    }
  }
  customerChange() {
    this.FillAllOfferTodropdown();
  }
  //#endregion
  //-----------------------------------------End Add Project---------------------------

  //#endregion

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
  };

  //-----------------------------------Project Type------------------------------------------------
  ProjectTypeRowSelected: any;
  getProjecttypeRow(row: any) {
    this.ProjectTypeRowSelected = row;
    console.log(this.ProjectTypeRowSelected);
  }
  setProjectTypeInSelect(data: any, model: any) {
    this.modalDetails.projectType = data.id;
  }
  resetProjectType() {
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
    //checkvalid2();

    // var RequirementsandGoals = [];
    // $('#DailyVoucherdetailsTabel tr.detailclass').each(function (i) {

    //     debugger;
    //     var requirmentgoalobj = {};

    //     var lnNumber = $("#DailyVoucherdetailsTabel tr.detailclass").index(this) + 1;

    //     requirmentgoalobj.LineNumber = lnNumber;//(i + 1);

    //     requirmentgoalobj.RequirementId = $($(this).find("[id^='RequirementIdEdit']")[0]).val();//$("#DailyVoucherdetailsTabel #AccJournalSelectId_N" + lnNumber).val();

    //     requirmentgoalobj.RequirmentName = $($(this).find("[id^='Requiregoalname']")[0]).val();//$("#DailyVoucherdetailsTabel #AccJournalSelectId_N" + lnNumber).val();

    //     requirmentgoalobj.EmployeeId = $($(this).find("[id^='EmpSelectedId_N']")[0]).val();//$("#DailyVoucherdetailsTabel #JournalCostCenterSelectId_N" + lnNumber).val();

    //     requirmentgoalobj.DepartmentId = $($(this).find("[id^='DeptSelectedId_N']")[0]).val();// $("#DailyVoucherdetailsTabel #referenceNotxt" + lnNumber).val();
    //     requirmentgoalobj.TimeNo = $($(this).find("[id^='TimeNo_N']")[0]).val();
    //     requirmentgoalobj.TimeType = $($(this).find("[id^='TimeSelectId_N']")[0]).val();

    //     RequirementsandGoals.push(requirmentgoalobj);
    // });
    // debugger;
    // ProjectTypeObj.RequirementsandGoals = RequirementsandGoals;

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
  //----------------------------------(End)-Project Type---------------------------------------------

  //-----------------------------------SubProject Type------------------------------------------------
  SubProjectTypeRowSelected: any;
  getSubProjecttypeRow(row: any) {
    this.SubProjectTypeRowSelected = row;
    console.log(this.SubProjectTypeRowSelected);
  }
  setSubProjectTypeInSelect(data: any, model: any) {
    this.modalDetails.subProjectDetails = data.id;
  }
  resetSubProjectType() {
    this.dataAdd.subprojecttype.id = 0;
    this.dataAdd.subprojecttype.nameAr = null;
    this.dataAdd.subprojecttype.nameEn = null;
  }
  saveSubProjectType() {
    debugger;
    if (
      this.dataAdd.subprojecttype.nameAr == null ||
      this.dataAdd.subprojecttype.nameEn == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    var ProSubTypeObj: any = {};
    ProSubTypeObj.SubTypeId = this.dataAdd.subprojecttype.id;
    ProSubTypeObj.ProjectTypeId = this.modalDetails.projectType;
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
    console.log(this.BuildTypeRowSelected);
  }
  setbuildTypeInSelect(data: any, model: any) {
    this.modalDetails.buildingType = data.id;
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
    console.log(this.CityTypeRowSelected);
  }
  setcityTypeInSelect(data: any, modal: any) {
    this.modalDetails.region = data.id;
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
  //#endregion
  //-------------------------------------------------------------------------------------------

  //------------------------------EditProject------------------------------
  editProject(data: any) {
    this.ProjectPopupFunc();

    console.log('edit project');
    console.log(data);

    this.modalDetails = {
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

      VoucherNo: null,
    };

    this.GetProjectDurationStr();
    this.branchChange();
    this.TypeProjectChange();
    this.modalDetails.subProjectDetails = data.subProjectTypeId;
    this.customerChange();
    if (data.offersPricesId == 0) this.modalDetails.offerPriceNumber = null;
    else this.modalDetails.offerPriceNumber = data.offersPricesId;

    this.subTypeProjectChangeEdit();
  }
  //---------------------------End EditProject-----------------------------
  ProjectIdPublicReturn: any;
  @ViewChild('noticModal') noticModal!: any;

  projectRequirementsColumns: string[] = ['File Name', 'cost', 'Attachments'];
  applyRequirementsFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectRequirementsDataSource.filter = filterValue
      .trim()
      .toLowerCase();
  }

  addProject_Edit() {
    console.log('this.modalDetails');
    console.log(this.modalDetails);
    if (this.ProjectNoType == 2) {
      this._projectService.GetProjectCode_S().subscribe((data) => {
        console.log('GetProjectCode_S');
        console.log(data);
        var ValueUser = this.modalDetails.projectNo;
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
    if (this.modalDetails.projectNo == null) {
      this.toast.error('لا يمكنك حفظ مشروع بدون رقم', 'رسالة');
      return;
    }
    // if(this.userPermissions.length==0){
    //   this.toast.error('من فضلك أختر صلاحيات المستخدم', 'رسالة');return;
    // }
    if (this.modalDetails.from >= this.modalDetails.to) {
      this.toast.error('من فضلك أختر تاريخ صحيح', 'رسالة');
      return;
    }
    if (
      this.modalDetails.projectNo == null ||
      this.modalDetails.branch == null ||
      this.modalDetails.center == null ||
      this.modalDetails.from == null ||
      this.modalDetails.to == null ||
      this.modalDetails.projectType == null ||
      this.modalDetails.subProjectDetails == null ||
      this.modalDetails.customer == null ||
      this.modalDetails.buildingType == null ||
      this.modalDetails.user == null ||
      this.modalDetails.projectDescription == null ||
      this.modalDetails.projectDepartment == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }

    console.log('projectgoalList');
    console.log(this.projectgoalList);
    let data = this.projectgoalList.filter(
      (a: { choose: any }) => a.choose == true
    );

    var RequirementsandGoals: any = [];
    data.forEach((element: any) => {
      var req: any = {};
      req.RequirementId = element.requirementId;
      RequirementsandGoals.push(req);
    });

    console.log('data');
    console.log(data);

    console.log('RequirementsandGoals');
    console.log(RequirementsandGoals);

    var ProjectObj: any = {};
    ProjectObj.ProjectId = this.modalDetails.projectId;
    ProjectObj.ProjectNo = this.modalDetails.projectNo;
    ProjectObj.ProjectDate = this._sharedService.date_TO_String(
      this.modalDetails.from
    );
    ProjectObj.ProjectHijriDate = null;
    ProjectObj.ProjectExpireDate = this._sharedService.date_TO_String(
      this.modalDetails.to
    );
    ProjectObj.ProjectExpireHijriDate = null;
    ProjectObj.ParentProjectId = null;
    ProjectObj.CustomerId = this.modalDetails.customer;
    ProjectObj.BuildingType = this.modalDetails.buildingType;
    ProjectObj.MangerId = this.modalDetails.user;
    ProjectObj.DepartmentId = this.modalDetails.projectDepartment;
    ProjectObj.CityId = this.modalDetails.region;
    ProjectObj.ProjectDescription = this.modalDetails.projectDescription;
    ProjectObj.ProjectTypeId = this.modalDetails.projectType;
    ProjectObj.SubProjectTypeId = this.modalDetails.subProjectDetails;
    ProjectObj.BranchId = this.modalDetails.branch;
    ProjectObj.CostCenterId = this.modalDetails.center;
    ProjectObj.ProjectNoType = this.ProjectNoType;
    ProjectObj.OffersPricesId = this.modalDetails.offerPriceNumber;
    //ProjectObj.IsNotSent = false;

    ProjectObj.ProjectRequirementsGoals = RequirementsandGoals;
    console.log('ProjectObj');
    console.log(ProjectObj);

    //return;

    if (this.modalDetails.ProjectFlag == true) {
      this._projectService
        .UpdateProjectPhasesTasks(ProjectObj)
        .subscribe((result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            this.ProjectIdPublicReturn = result.returnedStr;
            console.log('ProjectIdPublicReturn');
            console.log(this.ProjectIdPublicReturn);
            this.modalService.dismissAll();
            this.modalService.open(this.noticModal);
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
            console.log('ProjectIdPublicReturn');
            console.log(this.ProjectIdPublicReturn);
            this.modalService.dismissAll();
            this.modalService.open(this.noticModal);
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        });
    }
  }

  //-------------------------------------------Add Project ----------------------------
  //#region

  ProjectPopupFunc() {
    this.modalDetails.projectPermissions = [];
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
      this.modalDetails.projectNo = data.result;
    });
  }

  //-------------------------------------------------------------------------------------------

  //#endregion
  //-----------------------------------------End Add Project---------------------------

  Pro_applyFilterPerm(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.Pro_userPermissionsDataSource.filter = filterValue
      .trim()
      .toLowerCase();
  }
  checkedEmailProject: any;
  checkedPhoneProject: any;

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
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }
  playProject() {
    this._projectService
      .PlayProject(this.RowData.projectId, 0, 0)
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
  stopProject() {
    this._projectService
      .StopProject(this.RowData.projectId, 0, 0)
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

    // console.log(this.latitude, this.longitude);

    this.getAddress(lat, lng);
  }

  markerDragEnd(event: any) {
    this.latitude = event.latLng.lat();
    this.longitude = event.latLng.lng();

    // console.log(this.latitude, this.longitude);

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
            // console.log(this.address);
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

  //-----------------------------------Reason Type------------------------------------------------
  Reason: any;
  ReasonTypesPopup: any;
  typeFinishCheck = 1;

  FillReasonsSelect() {
    this.dataFinish.fini_ReasonId = null;
    this.projectFinish.fini_ReasonId = null;
    this._projectService.FillReasonsSelect().subscribe((data) => {
      debugger;
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
  SendWhatsAppTask(taskId:any,projectid:any) {
    const formData = new FormData();
    if(taskId!=null){formData.append('taskId', taskId);}
    if(projectid!=null){formData.append('projectid', projectid);}
    formData.append('environmentURL', environment.PhotoURL);
    this._phasestaskService.SendWhatsAppTask(formData).subscribe((result: any) => {

    });
  }
}
