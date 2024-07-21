import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
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
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ReportCustomer } from 'src/app/core/Classes/ViewModels/reportCustomer';
import { environment } from 'src/environments/environment';
import { NgxPrintElementService } from 'ngx-print-element';
import { RestApiService } from 'src/app/shared/services/api.service';


@Component({
  selector: 'app-statement-of-customers-deferred-balances',
  templateUrl: './statement-of-customers-deferred-balances.component.html',
  styleUrls: ['./statement-of-customers-deferred-balances.component.scss']
})

export class StatementOfCustomersDeferredBalancesComponent implements OnInit {

  addInvoice() { }

  editInvoice() { }





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
      creditor: 50
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
      creditor: 150
    }
  ];

  get totalDebtor() {
    return this.accountingEntries.reduce((total, entry) => total + entry.debtor, 0);
  }

  get totalCreditor() {
    return this.accountingEntries.reduce((total, entry) => total + entry.creditor, 0);
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
      ar: 'كشف بالأرصدة الآجلة للعملاء ',
      en: 'Statement of customers deferred balances',
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
    // 'accountName',
    // 'code',
    // 'totalDepitOpeningBalance',
    // 'totalCreditOpeningBalance',
    // 'totalDepit',
    // 'totalCredit',
    // 'totalDepitBalance',
    // 'totalCreditBalance',
    'acc_NameAr',
    'accCode',
    'opDipet',
    'opCredit',
    'netDebitTotal',
    'netCreditTotal',
    'totalDebitEnd',
    'totalCriditEnd',
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
  lang: any = 'ar';

  startDate = new Date();
  endDate = new Date();
  constructor(private modalService: NgbModal,
    private _accountsreportsService: AccountsreportsService,
    private api: RestApiService,
    private print: NgxPrintElementService,
    private _sharedService: SharedService) {
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
    this.RefreshData();
    this.FillCustomerSelect();

    this.projectsDataSource = new MatTableDataSource(this.projects);

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


  GetCustomerFinancialDetails() {
    this._accountsreportsService.GetCustomerFinancialDetails().subscribe((data: any) => {
      let totalDepits = 0, toalCreits = 0, totalDepitbalances = 0, ctotalCreditBalances = 0, totalDepitopenbalances = 0, totalcreitopenbalnces = 0, to = 0;

      data.result[0].childAccounts.forEach((element: any) => {
        totalDepitopenbalances += element.totalDepitOpeningBalance ?? 0;
        totalcreitopenbalnces += element.totalCreditOpeningBalance ?? 0;
        totalDepits += element.totalDepit ?? 0;
        toalCreits += element.totalCredit ?? 0;
        totalDepitbalances += element.totalDepitBalance ?? 0;
        ctotalCreditBalances += element.totalCreditBalance ?? 0;
      });
      to = totalDepits - toalCreits
      if (to > 0) {
        totalDepitbalances = to
        ctotalCreditBalances = 0
      }else{
        ctotalCreditBalances = to
        totalDepitbalances = 0
      }
      data.result[0].childAccounts.unshift({
        accountName: data.result[0].accountName,
        code: data.result[0].code,
        totalDepitOpeningBalance: totalDepitopenbalances,
        totalCreditOpeningBalance: totalcreitopenbalnces,
        totalDepit: totalDepits,
        totalCredit: toalCreits,
        totalDepitBalance: totalDepitbalances,
        totalCreditBalance: ctotalCreditBalances
      })
      let totalDepit = 0, toalCreit = 0, totalDepitbalance = 0, atotalCreditBalance = 0, totalDepitopenbalance = 0, totalcreitopenbalnce = 0;

      data.result.forEach((element: any) => {
        if (element.isMain == false) {
          totalDepitopenbalance += element.totalDepitOpeningBalance;
          totalcreitopenbalnce += element.totalCreditOpeningBalance;
          totalDepit += element.totalDepit;
          toalCreit += element.totalCredit;
        }
      });

      totalDepitbalance = (totalDepitopenbalance - totalcreitopenbalnce + totalDepit - toalCreit) > 0 ?
        (totalDepitopenbalance - totalcreitopenbalnce + totalDepit - toalCreit) : 0;
      atotalCreditBalance = (totalDepitopenbalance - totalcreitopenbalnce + totalDepit - toalCreit) < 0 ?
        -(totalDepitopenbalance - totalcreitopenbalnce + totalDepit - toalCreit) : 0;
      data.result[0].childAccounts.unshift({
        accountName: "كشف بالارصده المؤجله للعملاء",
        code: '',
        totalDepitOpeningBalance: totalDepitopenbalance,
        totalCreditOpeningBalance: totalcreitopenbalnce,
        totalDepit: totalDepit,
        totalCredit: toalCreit,
        totalDepitBalance: totalDepitbalance,
        totalCreditBalance: atotalCreditBalance
      })


      this.projectsDataSource = new MatTableDataSource(data.result[0].childAccounts);
      this.projectsDataSourceTemp = data.result[0].childAccounts;
      this.DataSource = data.result[0].childAccounts;
      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
    });
  }




  load_customers: any;
  FillCustomerSelect() {
    this._accountsreportsService.FillAllCustomer().subscribe(data => {
      // console.log("FillCustomerSelect");
      // console.log(data);
      this.load_customers = data;
    });
  }
  // FillCustomerSelectNew() {
  //   this._accountsreportsService.FillCustomerSelectNew().subscribe(data => {
  //     console.log("FillCustomerSelectNew");
  //     console.log(data);

  //     this.load_customers = data;
  //   });
  // }
  data: any = {
    filter: {
      enable: false,
      date: null,
      search_CustomerName: null,
      DateFrom_P: null,
      DateTo_P: null,
      ZeroCheck: 0,
      isChecked: false,
    }
  };
  projectsDataSourceTemp: any = [];

  DataSource: any
  RefreshData() {
    // if (this.data.filter.DateFrom_P == null && this.data.filter.DateTo_P == null && this.data.filter.search_CustomerName == null
    //   && this.showTable == false) {
    //   this.GetCustomerFinancialDetails()
    // } else {
      var _voucherFilterVM = new ReportCustomer();
      _voucherFilterVM.customerId = this.data.filter.search_CustomerName;
      if (this.data.filter.DateFrom_P != null && this.data.filter.DateTo_P != null) {
        _voucherFilterVM.dateFrom = this.data.filter.DateFrom_P.toString();
        _voucherFilterVM.dateTo = this.data.filter.DateTo_P.toString();
      }
      if (this.showTable == true) {
        _voucherFilterVM.zeroCheck = 1
      } else {
        _voucherFilterVM.zeroCheck = 0
      }
      var obj = _voucherFilterVM;
      this._accountsreportsService.GetCustomerFinancialDetailsNew(obj).subscribe((data: any) => {
        // if (data.result[0].childAccounts == 0) {
        //   var totalDepit = 0, toalCreit = 0, totalDepitbalance = 0, totalCreditBalance = 0, totalDepitopenbalance = 0, totalcreitopenbalnce = 0;
        //   data.result.forEach((element: any) => {
        //     if (element.isMain == false) {
        //       totalDepitopenbalance += element.totalDepitOpeningBalance;
        //       totalcreitopenbalnce += element.totalCreditOpeningBalance;
        //       totalDepit += element.totalDepit;
        //       toalCreit += element.totalCredit;
        //     }
        //   });
        //   totalDepitbalance = (totalDepitopenbalance - totalcreitopenbalnce + totalDepit - toalCreit) > 0 ?
        //     (totalDepitopenbalance - totalcreitopenbalnce + totalDepit - toalCreit) : 0;
        //   totalCreditBalance = (totalDepitopenbalance - totalcreitopenbalnce + totalDepit - toalCreit) < 0 ?
        //     -(totalDepitopenbalance - totalcreitopenbalnce + totalDepit - toalCreit) : 0;
        //   data.result.unshift({
        //     accountName: "كشف بالارصده المؤجله للعملاء",
        //     code: '',
        //     totalDepitOpeningBalance: totalDepitopenbalance,
        //     totalCreditOpeningBalance: totalcreitopenbalnce,
        //     totalDepit: totalDepit,
        //     totalCredit: toalCreit,
        //     totalDepitBalance: totalDepitbalance,
        //     totalCreditBalance: totalCreditBalance
        //   })
        //   this.projectsDataSource = new MatTableDataSource(data.result);
        //   this.projectsDataSourceTemp = data.result;
        //   this.DataSource = data.result;
        //   this.projectsDataSource.paginator = this.paginator;
        //   this.projectsDataSource.sort = this.sort;
        // } else {
        //   let totalDepits = 0, toalCreits = 0, totalDepitbalances = 0, ctotalCreditBalances = 0, totalDepitopenbalances = 0, totalcreitopenbalnces = 0,to;

        //   data.result[0].childAccounts.forEach((element: any) => {
        //     totalDepitopenbalances += element.totalDepitOpeningBalance ?? 0;
        //     totalcreitopenbalnces += element.totalCreditOpeningBalance ?? 0;
        //     totalDepits += element.totalDepit ?? 0;
        //     toalCreits += element.totalCredit ?? 0;
        //     totalDepitbalances += element.totalDepitBalance ?? 0;
        //     ctotalCreditBalances += element.totalCreditBalance ?? 0;
        //   });
        //   to = totalDepits - toalCreits
        //   if (to > 0) {
        //     totalDepitbalances = to
        //     ctotalCreditBalances = 0
        //   }else{
        //     ctotalCreditBalances = to
        //     totalDepitbalances = 0
        //   }
        //   data.result[0].childAccounts.unshift({
        //     accountName: data.result[0].accountName,
        //     code: data.result[0].code,
        //     totalDepitOpeningBalance: totalDepitopenbalances,
        //     totalCreditOpeningBalance: totalcreitopenbalnces,
        //     totalDepit: totalDepits,
        //     totalCredit: toalCreits,
        //     totalDepitBalance: totalDepitbalances,
        //     totalCreditBalance: ctotalCreditBalances
        //   })


        //   let totalDepit = 0, toalCreit = 0, totalDepitbalance = 0, ftotalCreditBalance = 0, totalDepitopenbalance = 0, totalcreitopenbalnce = 0;

        //   data.result.forEach((element: any) => {
        //     if (element.isMain == false) {
        //       totalDepitopenbalance += element.totalDepitOpeningBalance;
        //       totalcreitopenbalnce += element.totalCreditOpeningBalance;
        //       totalDepit += element.totalDepit;
        //       toalCreit += element.totalCredit;
        //     }
        //   });

        //   totalDepitbalance = (totalDepitopenbalance - totalcreitopenbalnce + totalDepit - toalCreit) > 0 ?
        //     (totalDepitopenbalance - totalcreitopenbalnce + totalDepit - toalCreit) : 0;
        //   ftotalCreditBalance = (totalDepitopenbalance - totalcreitopenbalnce + totalDepit - toalCreit) < 0 ?
        //     -(totalDepitopenbalance - totalcreitopenbalnce + totalDepit - toalCreit) : 0;
        //   data.result[0].childAccounts.unshift({
        //     accountName: "كشف بالارصده المؤجله للعملاء",
        //     code: '',
        //     totalDepitOpeningBalance: totalDepitopenbalance,
        //     totalCreditOpeningBalance: totalcreitopenbalnce,
        //     totalDepit: totalDepit,
        //     totalCredit: toalCreit,
        //     totalDepitBalance: totalDepitbalance,
        //     totalCreditBalance: ftotalCreditBalance
        //   })


        //   this.projectsDataSource = new MatTableDataSource(data.result[0].childAccounts);
        //   this.projectsDataSourceTemp = data.result[0].childAccounts;
        //   this.DataSource = data.result[0].childAccounts;
        //   this.projectsDataSource.paginator = this.paginator;
        //   this.projectsDataSource.sort = this.sort;
        // }
        data.result.forEach((element:any) => {
          if(element.accountId ==0)
          data.result.unshift({
            acc_NameAr: "كشف بالارصده المؤجله للعملاء",
            accCode: '',
            opDipet:element.opDipet,
            opCredit:element.opCredit,
            netDebitTotal:element.netDebitTotal,
            netCreditTotal:element.netCreditTotal,
            totalDebitEnd:element.totalDebitEnd,
            totalCriditEnd:element.totalCriditEnd
          });
        })
        data.result = data.result.filter((x:any)=>x.accountId!=0)
        this.projectsDataSource = new MatTableDataSource(data.result);
        this.projectsDataSourceTemp = data.result;
        this.DataSource = data.result;
        this.projectsDataSource.paginator = this.paginator;
        this.projectsDataSource.sort = this.sort;


      }, (err) => {

      }
      );
    // }
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
      return (d.acc_NameAr != null ? d.acc_NameAr.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
        || (d.accCode != null ? d.accCode.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
        || (d.opDipet != null ? d.opDipet.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
        || (d.opCredit != null ? d.opCredit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
        || (d.netDebitTotal != null ? d.netDebitTotal.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
        || (d.netCreditTotal != null ? d.netCreditTotal.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
        || (d.totalDebitEnd != null ? d.totalDebitEnd.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
        || (d.totalCriditEnd != null ? d.totalCriditEnd.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
    });
    this.projectsDataSource = new MatTableDataSource(tempsource);
    this.projectsDataSource.paginator = this.paginator;
    this.projectsDataSource.sort = this.sort;
  }
  printsumTotalValue: any
  printsumTotal: any
  printsumTaxes: any
  OrganizationData: any
  environmentPho: any
  dateprint: any
  printprojectsDataSource: any
    BranchName: any;

  getPrintdata(id: any) {
    var _voucherFilterVM = new ReportCustomer();
    _voucherFilterVM.customerId = this.data.filter.search_CustomerName;
    if (this.data.filter.DateFrom_P != null && this.data.filter.DateTo_P != null) {
      _voucherFilterVM.dateFrom = this.data.filter.DateFrom_P.toString();
      _voucherFilterVM.dateTo = this.data.filter.DateTo_P.toString();
    }
    if (this.showTable == true) {
      _voucherFilterVM.zeroCheck = 1
    } else {
      _voucherFilterVM.zeroCheck = 0
    }
    var obj = _voucherFilterVM;
    this._accountsreportsService.PrintVoucher(obj).subscribe((data: any) => {
      this.printprojectsDataSource = [];
      const val = this.valapplyFilter;
      this.dateprint = data.dateTimeNow
      this.OrganizationData = data.org_VD;
                    this.BranchName = data.branchName;

      this.environmentPho = environment.PhotoURL + this.OrganizationData.logoUrl;
      data.result.forEach((element:any) => {
        if(element.accountId ==0)
        data.result.unshift({
          acc_NameAr: "كشف بالارصده المؤجله للعملاء",
          accCode: '',
          opDipet:element.opDipet,
          opCredit:element.opCredit,
          netDebitTotal:element.netDebitTotal,
          netCreditTotal:element.netCreditTotal,
          totalDebitEnd:element.totalDebitEnd,
          totalCriditEnd:element.totalCriditEnd
        });
      })
      data.result = data.result.filter((x:any)=>x.accountId!=0)
        const tempsource = data.result.filter(function (d: any) {
          return (d.acc_NameAr != null ? d.acc_NameAr.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
            || (d.accCode != null ? d.accCode.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
            || (d.opDipet != null ? d.opDipet.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
            || (d.opCredit != null ? d.opCredit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
            || (d.netDebitTotal != null ? d.netDebitTotal.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
            || (d.netCreditTotal != null ? d.netCreditTotal.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
            || (d.totalDebitEnd != null ? d.totalDebitEnd.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
            || (d.totalCriditEnd != null ? d.totalCriditEnd.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
        });

        this.printprojectsDataSource = tempsource;

        setTimeout(() => {
          this.print.print(id, environment.printConfig);
        }, 500);


      // if (data.result[0].childAccounts == 0) {
      //   var totalDepit = 0, toalCreit = 0, totalDepitbalance = 0, totalCreditBalance = 0, totalDepitopenbalance = 0, totalcreitopenbalnce = 0;
      //   data.result.forEach((element: any) => {
      //     if (element.isMain == false) {
      //       totalDepitopenbalance += element.totalDepitOpeningBalance;
      //       totalcreitopenbalnce += element.totalCreditOpeningBalance;
      //       totalDepit += element.totalDepit;
      //       toalCreit += element.totalCredit;
      //     }
      //   });
      //   totalDepitbalance = (totalDepitopenbalance - totalcreitopenbalnce + totalDepit - toalCreit) > 0 ?
      //     (totalDepitopenbalance - totalcreitopenbalnce + totalDepit - toalCreit) : 0;
      //   totalCreditBalance = (totalDepitopenbalance - totalcreitopenbalnce + totalDepit - toalCreit) < 0 ?
      //     -(totalDepitopenbalance - totalcreitopenbalnce + totalDepit - toalCreit) : 0;
      //   data.result.unshift({
      //     accountName: "كشف بالارصده المؤجله للعملاء",
      //     code: '',
      //     totalDepitOpeningBalance: totalDepitopenbalance,
      //     totalCreditOpeningBalance: totalcreitopenbalnce,
      //     totalDepit: totalDepit,
      //     totalCredit: toalCreit,
      //     totalDepitBalance: totalDepitbalance,
      //     totalCreditBalance: totalCreditBalance
      //   })

      //   const tempsource = data.result.filter(function (d: any) {
      //     return (d.accountName != null ? d.accountName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
      //       || (d.code != null ? d.code.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
      //       || (d.totalDepitOpeningBalance != null ? d.totalDepitOpeningBalance.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
      //       || (d.totalCreditOpeningBalance != null ? d.totalCreditOpeningBalance.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
      //       || (d.totalDepit != null ? d.totalDepit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
      //       || (d.totalCredit != null ? d.totalCredit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
      //       || (d.totalDepitBalance != null ? d.totalDepitBalance.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
      //       || (d.totalCreditBalance != null ? d.totalCreditBalance.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val : "")
      //   });

      //   this.printprojectsDataSource = tempsource;

      //   setTimeout(() => {
      //     this.print.print(id, environment.printConfig);
      //   }, 500);
      // } else {
      //   var totalDepits = 0, toalCreits = 0, totalDepitbalances = 0, totalCreditBalances = 0, totalDepitopenbalances = 0, totalcreitopenbalnces = 0,to=0;

      //   data.result[0].childAccounts.forEach((element: any) => {
      //     totalDepitopenbalances += element.totalDepitOpeningBalance ?? 0;
      //     totalcreitopenbalnces += element.totalCreditOpeningBalance ?? 0;
      //     totalDepits += element.totalDepit ?? 0;
      //     toalCreits += element.totalCredit ?? 0;
      //     totalDepitbalances += element.totalDepitBalance ?? 0;
      //     totalCreditBalances += element.totalCreditBalance ?? 0;
      //   });

      //   to = totalDepits - toalCreits
      //   if (to > 0) {
      //     totalDepitbalances = to
      //     totalCreditBalances = 0
      //   }else{
      //     totalCreditBalances = to
      //     totalDepitbalances = 0
      //   }
      //   data.result[0].childAccounts.unshift({
      //     accountName: data.result[0].accountName,
      //     code: data.result[0].code,
      //     totalDepitOpeningBalance: totalDepitopenbalances,
      //     totalCreditOpeningBalance: totalcreitopenbalnces,
      //     totalDepit: totalDepits,
      //     totalCredit: toalCreits,
      //     totalDepitBalance: totalDepitbalances,
      //     totalCreditBalance: totalCreditBalances
      //   })


      //   var totalDepit = 0, toalCreit = 0, totalDepitbalance = 0, totalCreditBalance = 0, totalDepitopenbalance = 0, totalcreitopenbalnce = 0;

      //   data.result.forEach((element: any) => {
      //     if (element.isMain == false) {
      //       totalDepitopenbalance += element.totalDepitOpeningBalance;
      //       totalcreitopenbalnce += element.totalCreditOpeningBalance;
      //       totalDepit += element.totalDepit;
      //       toalCreit += element.totalCredit;
      //     }
      //   });

      //   totalDepitbalance = (totalDepitopenbalance - totalcreitopenbalnce + totalDepit - toalCreit) > 0 ?
      //     (totalDepitopenbalance - totalcreitopenbalnce + totalDepit - toalCreit) : 0;
      //   totalCreditBalance = (totalDepitopenbalance - totalcreitopenbalnce + totalDepit - toalCreit) < 0 ?
      //     -(totalDepitopenbalance - totalcreitopenbalnce + totalDepit - toalCreit) : 0;
      //   data.result[0].childAccounts.unshift({
      //     accountName: "كشف بالارصده المؤجله للعملاء",
      //     code: '',
      //     totalDepitOpeningBalance: totalDepitopenbalance,
      //     totalCreditOpeningBalance: totalcreitopenbalnce,
      //     totalDepit: totalDepit,
      //     totalCredit: toalCreit,
      //     totalDepitBalance: totalDepitbalance,
      //     totalCreditBalance: totalCreditBalance
      //   })
      //   const tempsource = data.result[0].childAccounts.filter(function (d: any) {
      //     return (d.accountName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      //       || (d.code.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      //       || (d.totalDepitOpeningBalance.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      //       || (d.totalCreditOpeningBalance.toString().toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      //       || (d.totalDepit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      //       || (d.totalCredit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      //       || (d.totalDepitBalance.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      //       || (d.totalCreditBalance.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      //   });

      //   this.printprojectsDataSource = tempsource;

      //   setTimeout(() => {
      //     this.print.print(id, environment.printConfig);
      //   }, 500);
      // }




    }, (err) => {

      this.printsumTotalValue = 0
      this.printsumTotal = 0
      this.printsumTaxes = 0
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
