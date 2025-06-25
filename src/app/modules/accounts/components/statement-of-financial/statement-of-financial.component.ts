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
import { FormGroup, FormBuilder } from '@angular/forms';

import { environment } from 'src/environments/environment';
import { NgxPrintElementService } from 'ngx-print-element';
import { RestApiService } from 'src/app/shared/services/api.service';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';

import { BehaviorSubject, Subscription } from 'rxjs';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ReportCustomer } from 'src/app/core/Classes/ViewModels/reportCustomer';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-statement-of-financial',
  templateUrl: './statement-of-financial.component.html',
  styleUrls: ['./statement-of-financial.component.scss']
})
export class StatementOfFinancialComponent implements OnInit {
  title: any = {
    main: {
      name: {
        ar: 'الحسابات',
        en: 'Projects Management',
      },
      link: '/accounts',
    },
    sub: {
      ar: 'قائمة المركز المالي ',
      en: 'Statement of financial position',
    },
  };

  myForm!: FormGroup;

  TrialbBalanceEntries: any = [];

  showTable: boolean = false;
  showTablezeroCheck: boolean = false;
  projects: any;
  @ViewChild('SmartFollower') smartModal: any;

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
  projectDisplayedColumns: string[] = ['account', 'debtor', 'Creditor'];

  projectUsersColumns: string[] = ['name', 'responsibility'];
  projectTasksColumns: string[] = ['taskName', 'name', 'duration'];

  userPermissionsDataSource = new MatTableDataSource();

  projectGoalsDataSource = new MatTableDataSource();

  projectUsersDataSource = new MatTableDataSource();
  projectTasksDataSource = new MatTableDataSource();

  projectsDataSource: any = [];

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
  ];

  projectTasks: any = [
  ];
  lang: any = 'ar';
  userG: any = {};

  startDate = new Date();
  endDate = new Date();
  constructor(
    private modalService: NgbModal,
    private print: NgxPrintElementService,
    private _accountsreportsService: AccountsreportsService,
    private authenticationService: AuthenticationService,
    private api: RestApiService,
    private _sharedService: SharedService
  ) {
    this.userG = this.authenticationService.userGlobalObj;
    this.getOrgDataInReady();
        this.api.GetBranchByBranchId().subscribe((data: any) => {
        this.BranchName = data.result[0].branchName;

    });

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
    //this.FillAccountsSelect();
    this.FillCostCenterSelect();
    this.users = [];

    this.projectsDataSource = []

    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );
  }

  ngAfterViewInit() {
    // this.open(this.smartModal, null, 'smartModal');
  }

  open(content: any, data?: any, type?: any) {
    if (data && type == 'edit') {
      this.modalDetails = data;
      this.modalDetails['id'] = 1;
    }
    this.modalService;
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type == 'edit' ? 'xl' : 'xl',
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
              level: null,
              ChooseLevel: null,

              //
            };
          }
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  load_costCenters: any;
  FillCostCenterSelect() {
    this._accountsreportsService.FillCostCenterSelect().subscribe((data) => {
      //console.log(data);
      this.load_costCenters = data;
    });
  }
  load_accountIds: any;
  FillAccountsSelect() {
    this._accountsreportsService.FillAccountsSelect().subscribe((data) => {
      this.load_accountIds = data;
    });
  }
  data: any = {
    filter: {
      enable: false,
      date: null,
      lvlid: null,
      choseid: null,
      DateFrom_P: null,
      DateTo_P: null,
      filteringType: null,
      costCenter: null,
      isCheckedYear: false,
      isCheckedBranch: false,
      ZeroCheck: null,
      FilteringTypeStr: [],
      TypeF: null,
      search_accountId: null,
    },
  };
  reset() {
    this.data = {
      filter: {
        enable: false,
        date: null,
        lvlid: null,
        choseid: null,
        DateFrom_P: null,
        DateTo_P: null,
        filteringType: null,
        costCenter: null,
        isCheckedYear: false,
        isCheckedBranch: false,
        ZeroCheck: null,
        FilteringTypeStr: [],
        TypeF: null,
        search_accountId: null,
      },
    };
  }
  ChoseList = [
    { id: 1, name: 'المستوي الاول' },
    { id: 2, name: 'المستوي الثاني' },
    { id: 3, name: 'المستوي الثالث' },
    { id: 4, name: 'المستوي الرابع' },
    { id: 5, name: 'المستوي الخامس' },
    { id: 6, name: 'المستوي السادس' },
    { id: 7, name: 'المستوي السابع' },
    { id: 8, name: 'المستوي الثامن' },
    { id: 9, name: 'المستوي التاسع' },
    { id: 10, name: 'المستوي العاشر' },
  ];

  filteringTypeList: any = [
    { id: 2, name: 'العملاء' },
    { id: 3, name: 'الموردين' },
    { id: 1, name: 'المشاريع' },
    { id: 5, name: 'الموظفين' },
    { id: 4, name: 'الفروع' },
    { id: 6, name: 'الخدمات' },
  ];
  FilteringTypeStrList: any = [];
  // FillFilteringIncomeStateSelectfilteringType() {
  //   this._accountsreportsService.FillFilteringIncomeStateSelect(this.data.filter.filteringType).subscribe(data => {
  //     this.FilteringTypeStrList = data;
  //   });
  // }
  FillFilteringSelect() {
    this._accountsreportsService
      .FillFilteringSelect(this.data.filter.filteringType)
      .subscribe((data) => {
        this.data.filter.FilteringTypeStr = [];
        this.FilteringTypeStrList = data;
      });
  }
  projectsDataSourceTemp: any = [];
  DataSource: any = [];

  RefreshData() {
    debugger
    var _voucherFilterVM = new ReportCustomer();
    _voucherFilterVM.lvl = this.data.filter.choseid;
    _voucherFilterVM.filteringType = this.data.filter.filteringType;
    _voucherFilterVM.FilteringTypeStr = this.data.filter.FilteringTypeStr;
    _voucherFilterVM.CostCenter = this.data.filter.costCenter;
    _voucherFilterVM.isCheckedYear = this.data.filter.isCheckedYear;
    _voucherFilterVM.isCheckedBranch = this.data.filter.isCheckedBranch;
    _voucherFilterVM.search_accountId = this.data.filter.search_accountId;

    // if (this.showTablezeroCheck == true) {
    //   _voucherFilterVM.zeroCheck = 1;
    // } else {
    //   _voucherFilterVM.zeroCheck = 0;
    // }
    _voucherFilterVM.zeroCheck = 0;
    if (
      this.data.filter.DateFrom_P != null &&
      this.data.filter.DateTo_P != null
    ) {
      _voucherFilterVM.dateFrom = this.data.filter.DateFrom_P.toString();
      _voucherFilterVM.dateTo = this.data.filter.DateTo_P.toString();
    }
    var obj = _voucherFilterVM;
    this._accountsreportsService.GetGeneralBudgetAMRDGVNew(obj).subscribe((data: any) => {
      data.result.sort((a: { lineNumber: number }, b: { lineNumber: number }) =>(a.lineNumber ?? 0) - (b.lineNumber ?? 0)); // b - a for reverse sort     
      //console.log(data.result);
        this.projectsDataSource = data.result;
        this.DataSource = data.result;
        this.projectsDataSourceTemp = data.result;
        this.projectsDataSource.paginator = this.paginator;
        this.projectsDataSource.sort = this.sort;
        console.log("this.projectsDataSource",this.projectsDataSource);
        debugger
        //------------------------------------------------------------------------------------
        //#region 
        const Ahlaksum = this.projectsDataSource.filter((item: { level: string; }) => item.level === "1").reduce((sum: number, current: { ahDipet: number; ahCredit: number; }) => sum + (+current.ahDipet - +current.ahCredit), 0);
        console.log("Ahlaksum",Ahlaksum);
        this.projectsDataSource.forEach((ele: any) => {
          if(ele.accountId!=0)
          {
            let filteritemAh = this.projectsDataSource.filter((d: { accountIdAhlak: any }) => d.accountIdAhlak == ele.accountId);
            if(filteritemAh.length>0)
            {
              let itemTotal = +ele.ahDipet - +ele.ahCredit;
              ele.totalFinal=itemTotal;
            }
          }
        });
        debugger
        
        let filteritemAh1 = this.projectsDataSource.filter((d: { accountId: any }) => d.accountId == 2);
        if(filteritemAh1.length>0)
        {
          filteritemAh1[0].totalFinal= +filteritemAh1[0].totalFinal - +Ahlaksum;
        }
        let filteritemAh2 = this.projectsDataSource.filter((d: { accountId: any }) => d.accountId == 20);
        if(filteritemAh2.length>0)
        {
          filteritemAh2[0].totalFinal= +filteritemAh2[0].totalFinal - +Ahlaksum;
        }
        let filteritemAh3 = this.projectsDataSource.filter((d: { accountId: any }) => d.accountId == 27);
        if(filteritemAh3.length>0)
        {
          filteritemAh3[0].totalFinal= +filteritemAh3[0].totalFinal - +Ahlaksum;
        }

        let totalsumAcc = this.projectsDataSource.filter((d: { accountId: any }) => d.accountId == 0);
        if(totalsumAcc.length>0)
        {
          totalsumAcc[0].totalFinal= +totalsumAcc[0].totalFinal - +Ahlaksum;
        }

        if (this.showTablezeroCheck == true) {
          this.projectsDataSource = this.projectsDataSource.filter((d: { totalFinal: any }) => d.totalFinal != 0);
        } 

        //#endregion
        //------------------------------------------------------------------------------------
      }     
    );
  }

  CheckDate(event: any) {
    if (event != null) {
      this.data.filter.DateFrom_P = this._sharedService.date_TO_String(
        event[0]
      );
      this.data.filter.DateTo_P = this._sharedService.date_TO_String(event[1]);
      //this.RefreshData();
    } else {
      this.data.filter.DateFrom_P = null;
      this.data.filter.DateTo_P = null;
      this.data.filter.date = null;
      //this.RefreshData();
    }
  }

  backgroungColor(row: any) {
    if (Object.keys(row).length === 0) return '';
    if ((row.level == 1 && row.classification==15)) {
      return 'Assetscolor';
    } else if ((row.level == 1 && row.classification==16)) {
      return 'liabilitiestcolor';
    }
    else if ((row.level == 1 && row.classification==21)) {
      return 'equitycolor';
    }
    return '';
  }

  valapplyFilter: any;

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    this.valapplyFilter = val;

    const tempsource = this.projectsDataSourceTemp.filter(function (d: any) {
      return (
        (d.accCode != null
          ? d.accCode.toString()?.trim().toLowerCase().indexOf(val) !== -1 ||
            !val
          : '') ||
        (d.acc_NameAr != null
          ? d.acc_NameAr.toString()?.trim().toLowerCase().indexOf(val) !== -1 ||
            !val
          : '') ||
        (d.totalFinal != null
          ? d.totalFinal.toString()?.trim().toLowerCase().indexOf(val) !== -1 ||
            !val
          : '') 
      );
    });

    this.projectsDataSource = tempsource;
    this.DataSource = tempsource;
    this.projectsDataSource.paginator = this.paginator;
    this.projectsDataSource.sort = this.sort;
  }
  OrganizationData: any;
  environmentPho: any;
  dateprint: any;
  printprojectsDataSource: any = [];
  BranchName: any;
  PrintDataProject :any=null;
  ProjectTableCustom:any={
   OrgImg: null,
   From:null,
   To:null,
  }
  getOrgDataInReady(){
    this.api.GetOrganizationDataLogin().subscribe({next: (res: any) => {
          this.OrganizationData = res.result;},error: (error) => {this.OrganizationData=null},})
   }
  getPrintdata(id: any)
  {
   this.printprojectsDataSource = [];
   this.printprojectsDataSource = this.projectsDataSource;
   this.environmentPho = environment.PhotoURL + this.OrganizationData.logoUrl;
   var date = new Date();
   this.dateprint=date.toLocaleString();

   setTimeout(() => {
    this.print.print(id, environment.printConfig);
  }, 500);
  }

  MonitorName: any;
  creditORdepit: any;

  @ViewChild('DetailsMonitorModal') DetailsMonitorModal: any;
  GetDetailsMonitor(item: any, id: any) {
    // if (this.data.filter.DateFrom_P != null && this.data.filter.DateTo_P != null) {
    if (this.showTable == true) {
      this.MonitorName = item.acc_NameAr;
      this.DetailsMonitorProject = [];
      this.DetailsMonitorService = [];
      this.DetailsMonitorCustomer = [];
      this.DetailsMonitorEmployee = [];
      this.DetailsMonitorSupplier = [];
      this.DetailsMonitorVoucher = [];
      this.DetailsMonitorBranch = [];
      if (id == 1 || id == 3 || id == 5 || id == 7) {
        this.creditORdepit = false;
      } else {
        this.creditORdepit = true;
      }
      this.GetDetailsMonitor_Func1(item, id);
      this.GetDetailsMonitor_Func2(item, id);
      this.GetDetailsMonitor_Func3(item, id);
      this.GetDetailsMonitor_Func4(item, id);
      this.open(this.DetailsMonitorModal);
    } else {
      return;
    }
    // }
  }
  DetailsMonitorBranch: any;
  DetailsMonitorService: any;
  DetailsMonitorProject: any;
  DetailsMonitorEmployee: any;
  DetailsMonitorVoucher: any;
  DetailsMonitorCustomer: any;
  DetailsMonitorSupplier: any;
  GetDetailsMonitor_Func1(item: any, id: any) {
    var obj = {
      FromDate: this.data.filter.DateFrom_P,
      ToDate: this.data.filter.DateTo_P,
      CostCenter: this.data.filter.costCenter,
      isCheckedYear: this.data.filter.isCheckedYear,
      FilteringType: this.data.filter.filteringType,
      FilteringTypeStr: this.data.filter.FilteringTypeStr,
      AccountId: item.accountId,
      Type: 1,
      Type2: id,
    };
    this._accountsreportsService.GetDetailsMonitor(obj).subscribe(
      (data: any) => {
        data.result.forEach((element: any) => {
          //debugger;
          element.total = 0;
          var _type = 1;
          if (id == 1) {
            element.total = element.depit;
          } else if (id == 2) {
            element.total = element.credit;
          } else if (id == 3) {
            element.total = element.depit;
          } else if (id == 4) {
            element.total = element.credit;
          } else if (id == 5) {
            if (element.depit - element.credit > 0) {
              element.total = element.depit - element.credit;
            } else {
              element.total = 0;
            }
          } else if (id == 6) {
            if (element.credit - element.depit > 0) {
              element.total = element.credit - element.depit;
            } else {
              element.total = 0;
            }
          } else if (id == 7) {
            if (element.depit - element.credit > 0) {
              element.total = element.depit - element.credit;
            } else {
              element.total = 0;
            }
          } else if (id == 8) {
            if (element.credit - element.depit > 0) {
              element.total = element.credit - element.depit;
            } else {
              element.total = 0;
            }
          }

          if (element.total != 0) {
            if (_type == 1 && element.cus_Emp_Sup == 1) {
              this.DetailsMonitorCustomer.push(element);
            }
            // if (_type == 1 && element.cus_Emp_Sup == 2) {
            //   this.DetailsMonitorEmployee.push(element);
            // }
            if (_type == 1 && element.cus_Emp_Sup == 3) {
              this.DetailsMonitorSupplier.push(element);
            }
            if (_type == 1) {
              this.DetailsMonitorVoucher.push(element);
            }
            if (_type == 1) {
              this.DetailsMonitorBranch.push(element);
            }
          }
        });
      },
      (err) => {}
    );
  }
  GetDetailsMonitor_Func2(item: any, id: any) {
    var obj = {
      FromDate: this.data.filter.DateFrom_P,
      ToDate: this.data.filter.DateTo_P,
      CostCenter: this.data.filter.costCenter,
      isCheckedYear: this.data.filter.isCheckedYear,
      FilteringType: this.data.filter.filteringType,
      FilteringTypeStr: this.data.filter.FilteringTypeStr,
      AccountId: item.accountId,
      Type: 2,
      Type2: id,
    };
    this._accountsreportsService.GetDetailsMonitor(obj).subscribe(
      (data: any) => {
        data.result.forEach((element: any) => {
          element.total = 0;
          var _type = 2;
          if (id == 1) {
            element.total = element.depit;
          } else if (id == 2) {
            element.total = element.credit;
          } else if (id == 3) {
            element.total = element.depit;
          } else if (id == 4) {
            element.total = element.credit;
          }
          if (id == 5) {
            if (element.credit - element.depit > 0) {
              element.total = 0;
            }
          } else if (id == 6) {
            if (element.credit - element.depit > 0) {
              element.total = element.credit - element.depit;
            }
          } else if (id == 7) {
            if (element.credit - element.depit > 0) {
              element.total = element.credit - element.depit;
            }
          } else if (id == 8) {
            if (element.credit - element.depit > 0) {
              element.total = element.credit - element.depit;
            }
          }

          if (element.total != 0) {
            if (_type == 2) {
              this.DetailsMonitorProject.push(element);
            }
          }
        });
      },
      (err) => {}
    );
  }
  GetDetailsMonitor_Func3(item: any, id: any) {
    var obj = {
      FromDate: this.data.filter.DateFrom_P,
      ToDate: this.data.filter.DateTo_P,
      CostCenter: this.data.filter.costCenter,
      isCheckedYear: this.data.filter.isCheckedYear,
      FilteringType: this.data.filter.filteringType,
      FilteringTypeStr: this.data.filter.FilteringTypeStr,
      AccountId: item.accountId,
      Type: 3,
      Type2: id,
    };
    this._accountsreportsService.GetDetailsMonitor(obj).subscribe(
      (data: any) => {
        data.result.forEach((element: any) => {
          element.total = 0;
          var _type = 3;
          if (id == 1) {
            element.total = element.depit;
          } else if (id == 2) {
            element.total = element.credit;
          } else if (id == 3) {
            element.total = element.depit;
          } else if (id == 4) {
            element.total = element.credit;
          }
          if (id == 5) {
            if (element.credit - element.depit > 0) {
              element.total = 0;
            }
          } else if (id == 6) {
            if (element.credit - element.depit > 0) {
              element.total = element.credit - element.depit;
            }
          } else if (id == 7) {
            if (element.credit - element.depit > 0) {
              element.total = element.credit - element.depit;
            }
          } else if (id == 8) {
            if (element.credit - element.depit > 0) {
              element.total = element.credit - element.depit;
            }
          }

          if (element.total != 0) {
            if (_type == 3) {
              this.DetailsMonitorService.push(element);
            }
          }
        });
      },
      (err) => {}
    );
  }

  GetDetailsMonitor_Func4(item: any, id: any) {
    var obj = {
      FromDate: this.data.filter.DateFrom_P,
      ToDate: this.data.filter.DateTo_P,
      CostCenter: this.data.filter.costCenter,
      isCheckedYear: this.data.filter.isCheckedYear,
      FilteringType: this.data.filter.filteringType,
      FilteringTypeStr: this.data.filter.FilteringTypeStr,
      AccountId: item.accountId,
      Type: 4,
      Type2: id,
    };
    this._accountsreportsService.GetDetailsMonitor(obj).subscribe(
      (data: any) => {
        data.result.forEach((element: any) => {
          //debugger;
          element.total = 0;
          var _type = 4;
          if (id == 1) {
            element.total = element.credit;
          } else if (id == 2) {
            element.total = element.depit;
          } else if (id == 3) {
            element.total = element.credit;
          } else if (id == 4) {
            element.total = element.depit;
          } else if (id == 5) {
            if (element.credit - element.depit > 0) {
              element.total = element.credit - element.depit;
            } else {
              element.total = 0;
            }
          } else if (id == 6) {
            if (element.depit - element.credit > 0) {
              element.total = element.depit - element.credit;
            } else {
              element.total = 0;
            }
          } else if (id == 7) {
            if (element.credit - element.depit > 0) {
              element.total = element.credit - element.depit;
            } else {
              element.total = 0;
            }
          } else if (id == 8) {
            if (element.depit - element.credit > 0) {
              element.total = element.depit - element.credit;
            } else {
              element.total = 0;
            }
          }

          if (element.total != 0) {
            if (_type == 4 && element.cus_Emp_Sup == 2) {
              this.DetailsMonitorEmployee.push(element);
            }
          }
        });
      },
      (err) => {}
    );
  }

  exportData() {
    let x = [];

    for (let index = 0; index < this.projectsDataSource.length; index++) {
      if (this.projectsDataSource[index].accountId != 0) {
        x.push({
          'الرصيد':parseFloat(this.projectsDataSource[index].totalFinal),
          'الحساب': this.projectsDataSource[index].acc_NameAr,
          'الكود': this.projectsDataSource[index].accCode,
        });
      }
    }

    for (let index = 0; index < this.projectsDataSource.length; index++) {
      if (this.projectsDataSource[index].accountId == 0) {
        x.push({
          'الرصيد':parseFloat(this.projectsDataSource[index].totalFinal),
          'الحساب': 'إجمالي الالتزمات وحقوق الملكية',
          'الكود': null,
        });
      }
    }
    this.lang == 'ar'
      ? this._accountsreportsService.customExportExcel(x, 'قائمة المركز المالي')
      : this._accountsreportsService.customExportExcel(x, 'Statement of financial position');
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

  // Save row
  save(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    //console.log('Row saved: ' + rowIndex);
    //console.log(row);
  }

  selectGoalForProject(index: any) {}

  addNewMission() {}

  onSort(event: any) {
    //console.log(event);
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
}
