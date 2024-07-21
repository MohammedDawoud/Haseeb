import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SelectionModel } from '@angular/cdk/collections';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { FileUploadControl, FileUploadValidators } from '@iplab/ngx-file-upload';
import { RestApiService } from 'src/app/shared/services/api.service';
import { Router } from '@angular/router';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-service-prices',
  templateUrl: './service-prices.component.html',
  styleUrls: ['./service-prices.component.scss']
})
export class ServicePricesComponent implements OnInit {
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
      ar: '  اسعار الخدمات ',
      en: 'Service prices',
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
    'projectName',
    'projectSubTypeName',
    'serviceName_EN',
    'amount',
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
    ProjectType: null,
    ServiceName: null,
    SubprojectType: null,
    ServiceNameEN: null,
    costCenter: null,
    ServiceType: null,
    price: null,
    ServiceRevenueAccount: null,
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
  constructor(
    private modalService: NgbModal,
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private api: RestApiService,
    private _accountsreportsService: AccountsreportsService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();
    api.lang.subscribe((res) => {
      this.lang = res;
    });
  }

  ngOnInit(): void {
    this.intialModelBranchOrganization()
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
        ProjectType: '000056',
        SubprojectType: '2023-06-13',
        ServiceName: 'أجل',
        price: 50,
        progress: 50,
      },
      {
        ProjectType: '000056',
        SubprojectType: '2023-06-13',
        ServiceName: 'أجل',
        price: 50,
        progress: 50,
      },
      {
        ProjectType: '000056',
        SubprojectType: '2023-06-13',
        ServiceName: 'أجل',
        price: 50,
        progress: 50,
      },
      {
        ProjectType: '000056',
        SubprojectType: '2023-06-13',
        ServiceName: 'أجل',
        price: 50,
        progress: 50,
      },
      {
        ProjectType: '000056',
        SubprojectType: '2023-06-13',
        ServiceName: 'أجل',
        price: 50,
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
    this.GetAllServicesPrice()

    this.FillProjectTypeSelect()
  }

  ngAfterViewInit() {
    // this.open(this.smartModal, null, 'smartModal');
  }
  DetailsServicelist: any = []
  DetailsService: any
  open(content: any, data?: any, type?: any, index?: any) {
    if (data && type == 'edit') {
      this.modalDetails = data;
      this.modalDetails['id'] = 1;
    }

    if (data && type == 'NewSubgenre') {
      this.modalDetails = data;
      this.modalDetails['type'] = 'newSub';
    }

    if (data && type == 'ServiceDetails') {
      this.modalDetails = data;
      this.modalDetails['type'] = 'ServiceDetails';
    }

    if (type == 'NewProjectType') {
      this.GetAllProjectType()
    }
    if (type == 'deleteProjectTypeModal') {
      this.pTypeId = data.typeId
    }

    if (type == 'SubprojectTypeModal') {
      if (this.SerivceModalForm.controls["ProjectType"].value == null) {

        this.toast.error('رسالة');
        return
      }
      this.GetAllProjectSubsByProjectTypeId()
    }
    if (type == 'deleteSubprojectTypeModal') {
      this.psubTypeId = data.subTypeId
    }

    if (type == 'PackagesModal') {
      this.GetAllPackages()
    }
    if (type == 'deletePackagesModal') {
      this.PackageIdD = data.packageId
    }

    if (type == 'costCenterModal') {
      this.servicesId = 0
      this.accountName = null
      this.servicesName = null
      this.GetAllcostCenter()
    }
    if (type == 'deletecostCenterModal') {
      this.ServicesPriceIdindex = index
      this.ServicesPriceId = data.servicesId
    }
    if (type == 'addtotalSurfacesModal') {
      this.GetAllTotalSpacesRange()
    }
    if (type == 'deleteTotalSpacesRange') {
      this.DTotalSpacesRangeId = data.totalSpacesRangeId
    }

    if (type == 'floortotalSurfacesModal') {
      this.GetAllFloors()
    }
    if (type == 'deletefloor') {
      this.DFloors = data.floorId
    }

    if (type == 'deleteSerivceModal') {
      this.DSerivcelistid = data.servicesId
    }
    if (type == 'DetailsServiceModal') {
      this.DetailsServicelist = []
      this.DetailsService = null
      this._accountsreportsService.GetServicesPriceByParentId(data.servicesId).subscribe(result => {
        this.DetailsService = data
        this.DetailsServicelist = result.result;
      });
    }



    this.modalService
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type == 'delete' ? 'lg' : 'xl',
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
              type: null
            };
          }
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );

    if (type == 'addSerivceModal') {

    this.details = []
    this.AllcostCenterlist = []
      this.SubprojecttypeList = []
      this.intialModelBranchOrganization()
      this.FillServiceAccount()
      this.FillCostCenterSelect()
      this.FillProjectTypeSelect()
      this.FillPackagesSelect()
    }
    if (data && type == 'editSerivceModal') {
      this.SubprojecttypeList = []

      this.details = []
      this.AllcostCenterlist = []
      this.intialModelBranchOrganization()
      this.FillServiceAccount()
      this.FillCostCenterSelect()
      this.FillProjectTypeSelect()
      this.FillPackagesSelect()
      this.SerivceModalDetails = data;
      this.SerivceModalForm.controls["id"].setValue(data.servicesId)
      this.SerivceModalForm.controls["nameAccount"].setValue(data.accountName)
      this.SerivceModalForm.controls["ProjectType"].setValue(data.projectId)
      this.SerivceModalForm.controls["SubprojectType"].setValue(data.projectSubTypeID)
      this.SerivceModalForm.controls["ServiceName"].setValue(data.servicesName)
      this.SerivceModalForm.controls["ServiceNameEN"].setValue(data.serviceName_EN)
      this.SerivceModalForm.controls["ServiceType"].setValue(data.serviceType)
      this.SerivceModalForm.controls["amount"].setValue(data.amount)
      this.SerivceModalForm.controls["costCenter"].setValue(data.costCenterId)
      this.SerivceModalForm.controls["ServiceRevenueAccount"].setValue(data.accountId)
      this.SerivceModalForm.controls["PackageId"].setValue(data.packageId)

      this._accountsreportsService.FillProjectSubTypesSelect(this.SerivceModalForm.controls["ProjectType"].value).subscribe(data => {
        this.SubprojecttypeList = data;
      });
    }
  }
  DSerivcelistid: any

  deleteSerivcelist(modal?: any) {
    this._accountsreportsService.DeleteServicelist(this.DSerivcelistid).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.toast.success(this.translate.instant(data.reasonPhrase), this.translate.instant('Message'));
          this.GetAllServicesPrice()

          this.DFloors = null
          modal.dismiss()
        }
      },
      (error) => {
        this.pTypeId = null
        this.toast.error(this.translate.instant(error.reasonPhrase), this.translate.instant('Message'));
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
  ServiceTypelist = [
    { id: 1, name: 'خدمة' },
    { id: 2, name: 'تقرير' }
  ]

  CostCenterSelectlist: any = []
  ServiceAccountlist: any = []
  FillCostCenterSelect() {
    this._accountsreportsService.FillCostCenterSelect().subscribe(data => {
      this.CostCenterSelectlist = data;
    });
  }
  FillServiceAccount() {
    this._accountsreportsService.FillServiceAccount().subscribe(data => {
      this.ServiceAccountlist = data;
    });
  }
  packageList: any = []
  FillPackagesSelect() {
    this._accountsreportsService.FillPackagesSelect().subscribe(data => {
      this.packageList = data;
    });
  }
  ProjectTypeList: any = []
  SubprojecttypeList: any = []
  ProjectTypeId: any
  SubprojecttypeId: any
  ServiceName: any
  FillProjectTypeSelect() {
    this._accountsreportsService.FillProjectTypeSelect().subscribe(data => {
      this.ProjectTypeList = data;
    });
  }
  FillProjectSubTypesSelect(id: any) {
    this._accountsreportsService.FillProjectSubTypesSelect(id).subscribe(data => {
      this.SubprojecttypeList = data;
    });
  }

  projectsDataSourceTemp: any = [];
  DataSource: any = []

  GetAllServicesPrice() {
    this._accountsreportsService.GetAllServicesPrice().subscribe(data => {
      this.projectsDataSource = new MatTableDataSource(data.result);
      this.DataSource = data.result;
      this.projectsDataSourceTemp = data.result;
      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
    });
  }
  RefreshData() {
    const params = {
      Project1: this.ProjectTypeId,
      Project2: this.SubprojecttypeId,
      ServiceName: this.ServiceName,
      ServiceDesc: "",
    }
    this._accountsreportsService.GetServicePriceByProject_Search(params).subscribe((data: any) => {
      this.projectsDataSource = new MatTableDataSource(data.result);
      this.DataSource = data.result;
      this.projectsDataSourceTemp = data.result;
      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
    });
  }
  valapplyFilter: any
  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    this.valapplyFilter = val
    const tempsource = this.projectsDataSourceTemp.filter(function (d: any) {
      return (d.projectName!=null?d.projectName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.projectSubTypeName!=null?d.projectSubTypeName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.serviceName_EN!=null?d.serviceName_EN.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.amount!=null?d.amount.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
    });
    this.projectsDataSource = new MatTableDataSource(tempsource);
    this.DataSource = tempsource
    this.projectsDataSource.paginator = this.paginator;
    this.projectsDataSource.sort = this.sort;
  }



  SerivceModalForm: FormGroup;
  SerivceModalDetails: any

  intialModelBranchOrganization() {
    this.SerivceModalForm = this.formBuilder.group({
      id: ["0", [Validators.required]],
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
    })
  }

  details: any = []

  SaveServicePriceWithDetails(modal?: any) {
    this.ServiceAccountlist.forEach((element: any) => {
      if (this.SerivceModalForm.controls["ServiceRevenueAccount"].value == element.id) {
        this.SerivceModalForm.controls["nameAccount"].setValue(element.name)
      }
    });
    if (this.SerivceModalForm.controls["id"].value != 0) {
      this.details = []
    }else{
      this.details.forEach((element:any) => {
        element.servicesId = 0
      });
    }

    const params = {
      services_price: {
        AccountId: this.SerivceModalForm.controls["ServiceRevenueAccount"].value,
        accountName: 'ايرادات',
        Amount: Number(this.SerivceModalForm.controls["amount"].value),
        CostCenterId: this.SerivceModalForm.controls["costCenter"].value,
        PackageId: this.SerivceModalForm.controls["PackageId"].value,
        ProjectId: this.SerivceModalForm.controls["ProjectType"].value,
        ProjectSubTypeID: this.SerivceModalForm.controls["SubprojectType"].value,
        ServiceName_EN: this.SerivceModalForm.controls["ServiceNameEN"].value,
        ServiceType: this.SerivceModalForm.controls["ServiceType"].value,
        ServicesId: this.SerivceModalForm.controls["id"].value,
        servicesName: this.SerivceModalForm.controls["ServiceName"].value,
      },
      details: this.details
    }

    // var details : any = []
    // const formData = new FormData();
    // formData.append('AccountId', this.SerivceModalForm.controls['ServiceRevenueAccount'].value);
    // formData.append('accountName',  'ايرادات');
    // formData.append('Amount', this.SerivceModalForm.controls['amount'].value);
    // formData.append('CostCenterId', this.SerivceModalForm.controls['costCenter'].value);
    // formData.append('Details', details);
    // formData.append('PackageId', this.SerivceModalForm.controls['PackageId'].value);
    // formData.append('ProjectId', this.SerivceModalForm.controls['ProjectType'].value);
    // formData.append('ProjectSubTypeID', this.SerivceModalForm.controls['SubprojectType'].value);
    // formData.append('ServiceName_EN', this.SerivceModalForm.controls['ServiceNameEN'].value);
    // formData.append('ServiceType', this.SerivceModalForm.controls['ServiceType'].value);
    // formData.append('ServicesId', this.SerivceModalForm.controls['id'].value);
    // formData.append('servicesName', this.SerivceModalForm.controls['ServiceName'].value);
    this._accountsreportsService.SaveServicePriceWithDetails(params).subscribe((result: any) => {

      if (result.statusCode == 200) {
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.GetAllServicesPrice()
        modal.dismiss()
      }
      else { this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message")); }
    });
  }
  AllProjectTypelist: any = []
  GetAllProjectType() {
    this._accountsreportsService.GetAllProjectType().subscribe(data => {
      this.AllProjectTypelist = data;
    });
  }
  applyFilterProjectType(event: any) {
    const val = event.target.value.toLowerCase();
    this._accountsreportsService.GetAllProjectType(val).subscribe(data => {
      this.AllProjectTypelist = []
      this.AllProjectTypelist = data.result;
    });
  }
  TypeId: any = "0"
  ProjectTypenameEn: any
  ProjectTypenameAr: any
  SaveProjectType() {
    if (this.ProjectTypenameEn != null && this.ProjectTypenameAr != null) {
      const prames = {
        TypeId: this.TypeId.toString(),
        NameEn: this.ProjectTypenameEn,
        NameAr: this.ProjectTypenameAr
      }
      this._accountsreportsService.SaveProjectType(prames).subscribe(
        (data) => {
          this.ProjectTypenameEn = null
          this.ProjectTypenameAr = null
          this.TypeId = "0"
          this.FillProjectTypeSelect()
          this.GetAllProjectType()
          this.toast.success(data.reasonPhrase, 'رسالة');
        },
        (error) => {
          this.toast.error(error.reasonPhrase, 'رسالة');
        }
      );
    }
  }
  updateProjectType(group: any) {
    this.TypeId = group.typeId
    this.ProjectTypenameEn = group.nameEn
    this.ProjectTypenameAr = group.nameAr
  }
  pTypeId: any

  DeleteProjectType(modal?: any) {
    this._accountsreportsService.DeleteProjectType(this.pTypeId).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.toast.success(data.reasonPhrase, 'رسالة');
          this.FillProjectTypeSelect()
          this.GetAllProjectType()
          this.pTypeId = null
          modal.dismiss()
        }
      },
      (error) => {
        this.pTypeId = null
        this.toast.error(error.reasonPhrase, 'رسالة');
      }
    );
  }


  AllProjectSubsByProjectTypelist: any = []
  GetAllProjectSubsByProjectTypeId(search?: any) {
    this._accountsreportsService.GetAllProjectSubsByProjectTypeId(search, this.SerivceModalForm.controls["ProjectType"].value).subscribe(data => {
      this.AllProjectSubsByProjectTypelist = data;
    });
  }
  applyFilterSubsByProjectTypeId(event: any) {
    const val = event.target.value.toLowerCase();
    this._accountsreportsService.GetAllProjectSubsByProjectTypeId(val, this.SerivceModalForm.controls["ProjectType"].value).subscribe(data => {
      this.AllProjectSubsByProjectTypelist = []
      this.AllProjectSubsByProjectTypelist = data.result;
    });
  }

  SubTypeId: any = "0"
  SubprojectTypenameEn: any
  SubprojectTypenameAr: any
  TimePeriodStr: any
  SaveSubprojectType() {
    if (this.SubprojectTypenameEn != null && this.SubprojectTypenameAr != null) {
      const prames = {
        SubTypeId: this.SubTypeId.toString(),
        NameEn: this.SubprojectTypenameEn,
        NameAr: this.SubprojectTypenameAr,
        ProjectTypeId: this.SerivceModalForm.controls["ProjectType"].value,
        TimePeriod: this.TimePeriodStr
      }
      this._accountsreportsService.SaveProjectSubType(prames).subscribe(
        (data) => {
          this.TimePeriodStr = null
          this.SubprojectTypenameAr = null
          this.SubprojectTypenameEn = null
          this.SubTypeId = "0"
          this.FillProjectSubTypesSelect(this.SerivceModalForm.controls["ProjectType"].value)
          this.GetAllProjectSubsByProjectTypeId()
          this.toast.success(data.reasonPhrase, 'رسالة');
        },
        (error) => {
          this.toast.error(error.reasonPhrase, 'رسالة');
        }
      );
    }
  }
  updateSubprojectType(group: any) {
    this.SubTypeId = group.subTypeId
    this.SubprojectTypenameEn = group.nameEn
    this.TimePeriodStr = group.timePeriod
    this.SubprojectTypenameAr = group.nameAr
  }
  psubTypeId: any

  DeleteProjectSubTypes(modal?: any) {
    this._accountsreportsService.DeleteProjectSubTypes(this.psubTypeId).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.toast.success(data.reasonPhrase, 'رسالة');
          this.FillProjectSubTypesSelect(this.SerivceModalForm.controls["ProjectType"].value)
          this.GetAllProjectSubsByProjectTypeId()
          this.psubTypeId = null
          modal.dismiss()
        }
      },
      (error) => {
        this.psubTypeId = null
        this.toast.error(error.reasonPhrase, 'رسالة');
      }
    );
  }





  AllPackageslist: any = []
  GetAllPackages() {
    this._accountsreportsService.GetAllPackages().subscribe(data => {
      this.AllPackageslist = data.result;
    });
  }
  applyFilterPackages(event: any) {
    const val = event.target.value.toLowerCase();
    this._accountsreportsService.GetAllPackages(val).subscribe(data => {
      this.AllPackageslist = []
      this.AllPackageslist = data.result;
    });
  }

  PackageId: any = "0"
  PackageName: any
  MeterPrice1: any
  MeterPrice2: any
  MeterPrice3: any
  PackageRatio1: any
  PackageRatio2: any
  PackageRatio3: any
  SavePackages() {
    if (this.PackageName != null && this.MeterPrice1 != null && this.MeterPrice2 != null && this.MeterPrice3 != null
      && this.PackageRatio1 != null && this.PackageRatio2 != null && this.PackageRatio3 != null) {
      const prames = {
        PackageId: this.PackageId.toString(),
        PackageName: this.PackageName,
        MeterPrice3: this.MeterPrice3,
        MeterPrice2: this.MeterPrice2,
        MeterPrice1: this.MeterPrice1,
        PackageRatio1: this.PackageRatio1,
        PackageRatio2: this.PackageRatio2,
        PackageRatio3: this.PackageRatio3,
      }
      this._accountsreportsService.SavePackage(prames).subscribe(
        (data) => {
          this.PackageName = null
          this.MeterPrice1 = null
          this.MeterPrice2 = null
          this.MeterPrice3 = null
          this.PackageRatio1 = null
          this.PackageRatio2 = null
          this.PackageRatio3 = null
          this.PackageId = "0"
          this.FillPackagesSelect()
          this.GetAllPackages()
          this.toast.success(data.reasonPhrase, 'رسالة');
        },
        (error) => {
          this.toast.error(error.reasonPhrase, 'رسالة');
        }
      );
    }
  }
  updatePackages(group: any) {
    this.PackageId = group.packageId
    this.PackageName = group.packageName
    this.MeterPrice1 = group.meterPrice1
    this.MeterPrice2 = group.meterPrice2
    this.MeterPrice3 = group.meterPrice3
    this.PackageRatio1 = group.packageRatio1
    this.PackageRatio2 = group.packageRatio2
    this.PackageRatio3 = group.packageRatio3
  }
  PackageIdD: any

  DeletePackages(modal?: any) {
    this._accountsreportsService.DeletePackage(this.PackageIdD).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.toast.success(data.reasonPhrase, 'رسالة');
          this.FillPackagesSelect()
          this.GetAllPackages()
          this.PackageIdD = null
          modal.dismiss()
        }
      },
      (error) => {
        this.PackageIdD = null
        this.toast.error(error.reasonPhrase, 'رسالة');
      }
    );
  }




  AllcostCenterlist: any = []
  GetAllcostCenter() {
    if (this.SerivceModalForm.controls["id"].value != 0) {
      this._accountsreportsService.GetServicesPriceByParentId(this.SerivceModalForm.controls["id"].value).subscribe(data => {
        this.AllcostCenterlist = data.result;
      });
    }
  }

  servicesId: any = "0"
  accountName: any
  servicesName: any
  SavecostCenter() {
    if (this.accountName != null && this.servicesName != null) {

      if (this.SerivceModalForm.controls["id"].value == 0) {


        var obj = this.details.filter((ele:any)=>{ return ele.servicesId == this.servicesId})
        if(obj.length>0){
          this.details.forEach((element:any) => {
            if(obj[0].servicesId == element.servicesId){
              element.accountName=this.accountName
              element.servicesName=this.servicesName
              return
            }
          });
          this.servicesId = 0
          this.accountName = null
          this.servicesName = null
          return
        }
        this.details.push({
          servicesId: this.details.length + 1,
          accountName: this.accountName,
          servicesName: this.servicesName,
          ParentId: this.SerivceModalForm.controls["id"].value
        })
        this.AllcostCenterlist = []
        this.AllcostCenterlist = this.details

        this.accountName = null
        this.servicesName = null
      } else {
        const prames = {
          servicesId: this.servicesId??0,
          accountName: this.accountName,
          servicesName: this.servicesName,
          ParentId: this.SerivceModalForm.controls["id"].value
        }
        this._accountsreportsService.SaveServicesPrice(prames).subscribe(
          (data) => {
            this.accountName = null
            this.servicesName = null
            this.servicesId = "0"
            this.GetAllcostCenter()
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
    this.servicesId = group.servicesId
    this.accountName = group.accountName
    this.servicesName = group.servicesName
  }
  ServicesPriceId: any
  ServicesPriceIdindex: any
  DeleteService(modal?: any) {

    if (this.SerivceModalForm.controls["id"].value == 0) {
       this.details.splice(this.ServicesPriceIdindex,1)
      this.AllcostCenterlist =[]
      this.AllcostCenterlist = this.details
      modal.dismiss()

    } else {
      this._accountsreportsService.DeleteService(this.ServicesPriceId).subscribe(
        (data) => {
          if (data.statusCode == 200) {
            this.toast.success(data.reasonPhrase, 'رسالة');
            this.GetAllcostCenter()
            this.ServicesPriceId = null
            modal.dismiss()
          }
        },
        (error) => {
          this.ServicesPriceId = null
          this.toast.error(error.reasonPhrase, 'رسالة');
        }
      );
    }
  }




  AllTotalSpacesRangelist: any = []
  GetAllTotalSpacesRange() {
    this._accountsreportsService.GetAllTotalSpacesRange().subscribe(data => {
      this.AllTotalSpacesRangelist = data.result;
    });
  }
  applyFilterTotalSpacesRange(event: any) {
    const val = event.target.value.toLowerCase();
    this._accountsreportsService.GetAllTotalSpacesRange(val).subscribe(data => {
      this.AllTotalSpacesRangelist = []
      this.AllTotalSpacesRangelist = data.result;
    });
  }
  TotalSpacesRangeId: any = "0"
  rangeName: any
  RangeValue: any
  SaveTotalSpacesRange() {
    if (this.rangeName != null && this.RangeValue != null) {
      const prames = {
        TotalSpacesRangeId: this.TotalSpacesRangeId.toString(),
        TotalSpacesRengeName: this.rangeName,
        RangeValue: this.RangeValue
      }
      this._accountsreportsService.SaveTotalSpacesRange(prames).subscribe(
        (data) => {
          this.rangeName = null
          this.RangeValue = null
          this.TotalSpacesRangeId = "0"
          this.GetAllTotalSpacesRange()
          this.toast.success(data.reasonPhrase, 'رسالة');
        },
        (error) => {
          this.toast.error(error.reasonPhrase, 'رسالة');
        }
      );
    }
  }
  updateTotalSpacesRange(group: any) {
    this.TotalSpacesRangeId = group.totalSpacesRangeId
    this.rangeName = group.totalSpacesRengeName
    this.RangeValue = group.rangeValue
  }
  DTotalSpacesRangeId: any

  deleteTotalSpaces(modal?: any) {
    this._accountsreportsService.DeleteTotalSpacesRange(this.DTotalSpacesRangeId).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.toast.success(data.reasonPhrase, 'رسالة');
          this.GetAllTotalSpacesRange()
          this.DTotalSpacesRangeId = null
          modal.dismiss()
        }
      },
      (error) => {
        this.pTypeId = null
        this.toast.error(error.reasonPhrase, 'رسالة');
      }
    );
  }

  AllFloorslist: any = []
  GetAllFloors() {
    this._accountsreportsService.GetAllFloors().subscribe(data => {
      this.AllFloorslist = data.result;
    });
  }
  applyFilterFloor(event: any) {
    const val = event.target.value.toLowerCase();
    this._accountsreportsService.GetAllFloors(val).subscribe(data => {
      this.AllFloorslist = []
      this.AllFloorslist = data.result;
    });
  }
  FloorId: any = "0"
  FloorName: any
  FloorRatio: any
  SaveFloor() {
    if (this.FloorName != null && this.FloorRatio != null) {
      const prames = {
        FloorId: this.FloorId.toString(),
        FloorName: this.FloorName,
        FloorRatio: this.FloorRatio
      }
      this._accountsreportsService.SaveFloor(prames).subscribe(
        (data) => {
          this.FloorName = null
          this.FloorRatio = null
          this.FloorId = "0"
          this.GetAllFloors()
          this.toast.success(data.reasonPhrase, 'رسالة');
        },
        (error) => {
          this.toast.error(error.reasonPhrase, 'رسالة');
        }
      );
    }
  }
  updatefloor(group: any) {
    this.FloorId = group.floorId
    this.FloorName = group.floorName
    this.FloorRatio = group.floorRatio
  }
  DFloors: any
  DeleteFloor(modal?: any) {
    this._accountsreportsService.DeleteFloor(this.DFloors).subscribe(
      (data) => {
        if (data.result.statusCode == 200) {
          this.GetAllFloors()
          this.toast.success(data.reasonPhrase, 'رسالة');
          this.DFloors = null
          modal.dismiss()
        }
      },
      (error) => {
        this.DFloors = null
        this.toast.error(error.reasonPhrase, 'رسالة');
      }
    );
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


}
