import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FileUploadControl, FileUploadValidators } from '@iplab/ngx-file-upload';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { VoucherFilterVM } from 'src/app/core/Classes/ViewModels/voucherFilterVM';
import { ExportationService } from 'src/app/core/services/exportation-service/exportation.service';
import { environment } from 'src/environments/environment';
import { NgxPrintElementService } from 'ngx-print-element';
import { RestApiService } from 'src/app/shared/services/api.service';
import { ReportCustomer } from 'src/app/core/Classes/ViewModels/reportCustomer';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-customer-revenue',
  templateUrl: './customer-revenue.component.html',
  styleUrls: ['./customer-revenue.component.scss']
})

export class CustomerRevenueComponent implements OnInit {

  addInvoice() { }

  editInvoice() { }

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
      ar: '  كشف بإيراد العميل (تفصيلي)',
      en: 'Statement of customer revenue (detailed)',
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
    'date',
    // 'project',
    'accountName',
    'transactionTypeName',
    'notes',
    'payTypeName',
    'totalValue',
    'totalValueDepit',
  ];

  projectUsersColumns: string[] = ['name', 'responsibility'];
  projectTasksColumns: string[] = ['taskName', 'name', 'duration'];

  userPermissionsDataSource = new MatTableDataSource();

  projectGoalsDataSource = new MatTableDataSource();

  projectUsersDataSource = new MatTableDataSource();
  projectTasksDataSource = new MatTableDataSource();

  projectsDataSource = new MatTableDataSource();

  modalDetails: any = {
    serviceNumber: null,
    postPaid: null,
    DateOfPublicationAD: null,
    ChapterDateAD: null,
    accountName: null,
    Bank: null,
    warningBefore: null,
    recurrenceRate: null,
    WarningText: null,
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
  lang: any = 'ar';

  constructor(private modalService: NgbModal,
    private _accountsreportsService: AccountsreportsService,
    private toast: ToastrService,
    private api: RestApiService,
    private print: NgxPrintElementService,
    private _sharedService: SharedService,) {
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();
    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );

    api.lang.subscribe((res) => {
      this.lang = res;
    });
  }
  ngOnInit(): void {
    this.FillCustomerSelect();
    this.FillProjectSelect();

    this.users = [
      { id: 1, Name: 'محمود نافع' },
      { id: 2, Name: 'محمود نافع' }
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
        projectNumber: '000056',
        date: '5',
        accountName: '2023-06-13',
        BondType: 50,
        Statement: 50,
        PaymentType: '000056',
        amount_Credit: '5',
        amount_Debit: '2023-06-13'
      },
      {
        projectNumber: '000056',
        date: '5',
        accountName: '2023-06-13',
        BondType: 50,
        Statement: 50,
        PaymentType: '000056',
        amount_Credit: '5',
        amount_Debit: '2023-06-13'
      },
      {
        projectNumber: '000056',
        date: '5',
        accountName: '2023-06-13',
        BondType: 50,
        Statement: 50,
        PaymentType: '000056',
        amount_Credit: '5',
        amount_Debit: '2023-06-13'
      },
      {
        projectNumber: '000056',
        date: '5',
        accountName: '2023-06-13',
        BondType: 50,
        Statement: 50,
        PaymentType: '000056',
        amount_Credit: '5',
        amount_Debit: '2023-06-13'
      },
      {
        projectNumber: '000056',
        date: '5',
        accountName: '2023-06-13',
        BondType: 50,
        Statement: 50,
        PaymentType: '000056',
        amount_Credit: '5',
        amount_Debit: '2023-06-13'
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
  }

  ngAfterViewInit() {
    // this.open(this.smartModal, null, 'smartModal');
  }

  open(content: any, data?: any, type?: any) {
    if (data && type == 'edit') {
      this.modalDetails = data;
      this.modalDetails['id'] = 1;
    }

    this.modalService
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type == 'edit' ? 'xl' : 'lg',
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
            };
          }
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  load_customers: any;
  FillCustomerSelect() {
    this._accountsreportsService.FillAllCustomer().subscribe(data => {
      this.load_customers = data;
    });
  }
  load_projects: any;
  FillProjectSelect() {
    if (this.data.filter.search_CustomerName != null) {
      this._accountsreportsService.FillProjectSelectByCustomerId_W(this.data.filter.search_CustomerName).subscribe(data => {
        this.load_projects = data;
      });
    }
    else {
      this.load_projects = [];
    }

  }
  data: any = {
    filter: {
      enable: false,
      date: null,
      search_CustomerName: null,
      search_projectId: null,
      DateFrom_P: null,
      DateTo_P: null,
      isChecked: false,
    }
  };
  projectsDataSourceTemp: any = [];
  DataSource: any
  sumtotalValue: any = 0
  sumtotalValueDepit: any = 0
  RefreshData() {
    var _voucherFilterVM = new VoucherFilterVM();
    _voucherFilterVM.customerId = this.data.filter.search_CustomerName;
    _voucherFilterVM.projectId = this.data.filter.search_projectId;
    if (this.data.filter.DateFrom_P != null && this.data.filter.DateTo_P != null) {
      _voucherFilterVM.dateFrom = this.data.filter.DateFrom_P.toString();
      _voucherFilterVM.dateTo = this.data.filter.DateTo_P.toString();
    }
    var obj = _voucherFilterVM;
    this._accountsreportsService.getCustomerRevenue(obj).subscribe((data: any) => {
      this.sumtotalValue = 0
      this.sumtotalValueDepit = 0
      data.result.forEach((element: any) => {
        this.sumtotalValue += Number(element.totalValue)
        this.sumtotalValueDepit += Number(element.totalValueDepit)
      });
      this.projectsDataSource = new MatTableDataSource(data.result);
      this.projectsDataSourceTemp = data.result;
      this.DataSource = data.result;

      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
    }, (err) => {
      this.sumtotalValue = 0
      this.sumtotalValueDepit = 0
    }
    );
  }



  CheckDate(event: any) {
    if (event != null) {
      this.data.filter.DateFrom_P = this._sharedService.date_TO_String(event[0]);
      this.data.filter.DateTo_P = this._sharedService.date_TO_String(event[1]);
      this.RefreshData();
    }
    else {
      this.data.filter.DateFrom_P = null;
      this.data.filter.date = null;
      this.data.filter.DateTo_P = null;
      this.RefreshData();
    }
  }


  valapplyFilter: any
  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    this.valapplyFilter = val
    const tempsource = this.projectsDataSourceTemp.filter(function (d: any) {
      return (d.date!=null?d.date.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.project!=null?d.project.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.accountName!=null?d.accountName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.transactionTypeName!=null?d.transactionTypeName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.notes!=null?d.notes.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.payTypeName!=null?d.payTypeName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.totalValue!=null?d.totalValue.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.totalValueDepit!=null?d.totalValueDepit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
    });
    this.sumtotalValue = 0
    this.sumtotalValueDepit = 0
    tempsource.forEach((element: any) => {
      this.sumtotalValue += Number(element.totalValue)
      this.sumtotalValueDepit += Number(element.totalValueDepit)
    });
    this.projectsDataSource = new MatTableDataSource(tempsource);
    this.DataSource = tempsource
    this.projectsDataSource.paginator = this.paginator;
    this.projectsDataSource.sort = this.sort;
  }

  exportData() {
    let x = [];

    for (let index = 0; index < this.DataSource.length; index++) {

      x.push({
        date: this.DataSource[index].date,
        project: this.DataSource[index].project,
        accountName: this.DataSource[index].accountName,
        transactionTypeName: this.DataSource[index].transactionTypeName,
        notes: this.DataSource[index].notes,
        payTypeName: this.DataSource[index].payTypeName,
        totalValue:parseFloat(this.DataSource[index].totalValue),
        totalValueDepit:parseFloat( this.DataSource[index].totalValueDepit),
      })
    }
    x.push({
      date: null,
      project: null,
      accountName: null,
      transactionTypeName: "الاجمالي",
      notes:null,
      payTypeName: null,
      totalValue:parseFloat( this.sumtotalValue),
      totalValueDepit:parseFloat( this.sumtotalValueDepit),
    })

    this.lang == "ar" ? this._accountsreportsService.customExportExcel(x, "كشف بإيراد العميل (تفصيلي)") :
    this._accountsreportsService.customExportExcel(x, "Statement of customer revenue (detailed)");

  }   
  projectname: any
  CustomerName: any
  printsumtotalValue: any
  printsumtotalValueDepit: any
  printprojectsDataSource: any
  OrganizationData: any
  environmentPho: any
  dateprint: any
    BranchName: any;

  getPrintdata(id: any) {
    // if(this.data.filter.search_projectId == null){
    //   this.toast.error('برجاء ادخل رقم المشروع');
    // }
    if(this.data.filter.search_CustomerName == null){
      this.toast.error(' برجاء ادخل عميل');
    }
    var _voucherFilterVM = new ReportCustomer();
    _voucherFilterVM.customerId = this.data.filter.search_CustomerName;
    _voucherFilterVM.projectId = this.data.filter.search_projectId;
    if (this.data.filter.DateFrom_P != null && this.data.filter.DateTo_P != null) {
      _voucherFilterVM.dateFrom = this.data.filter.DateFrom_P.toString();
      _voucherFilterVM.dateTo = this.data.filter.DateTo_P.toString();
    }
    _voucherFilterVM.projectNo = []
    this.load_projects.forEach((element: any) => {
      _voucherFilterVM.projectNo.push(element.name)
    });
    // _voucherFilterVM.projectNo=_voucherFilterVM.projectNo
    var obj = _voucherFilterVM;
    this._accountsreportsService.DetailedRevenuReportExtra(obj).subscribe((data: any) => {
      this.load_projects.forEach((element: any) => {
        if (this.data.filter.search_projectId == element.id) {
          this.projectname = element.name
        }
      });
      this.load_customers.forEach((element: any) => {
        if (this.data.filter.search_CustomerName == element.id) {
          this.CustomerName = element.name
        }
      });


      this.printsumtotalValue = 0
      this.printsumtotalValueDepit = 0
      data.result.forEach((element: any) => {
        this.printsumtotalValue += Number(element.totalValue)
        this.printsumtotalValueDepit += Number(element.totalValueDepit)
      });
      this.printprojectsDataSource = [];

      const val = this.valapplyFilter;
      this.dateprint = data.dateTimeNow
      this.OrganizationData = data.org_VD;
                    this.BranchName = data.branchName;

      this.environmentPho = environment.PhotoURL + this.OrganizationData.logoUrl;
      const tempsource = data.result.filter(function (d: any) {
        return (d.date!=null?d.date.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.project!=null?d.project.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.accountName!=null?d.accountName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.transactionTypeName!=null?d.transactionTypeName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.notes!=null?d.notes.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.payTypeName!=null?d.payTypeName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.totalValue!=null?d.totalValue.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.totalValueDepit!=null?d.totalValueDepit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
      });
      this.printsumtotalValue = 0
      this.printsumtotalValueDepit = 0
      tempsource.forEach((element: any) => {
        this.printsumtotalValue += Number(element.totalValue)
        this.printsumtotalValueDepit += Number(element.totalValueDepit)
      });
      this.printprojectsDataSource = tempsource;

      setTimeout(() => {
        this.print.print(id, environment.printConfig);
      }, 1000);
    }, (err) => {
      this.printsumtotalValue = 0
      this.printsumtotalValueDepit = 0
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
  }

  // Delete row
  delete(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    this.rows.splice(rowIndex, 1);
  }

  selectGoalForProject(index: any) { }

  addNewMission() { }

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
  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
