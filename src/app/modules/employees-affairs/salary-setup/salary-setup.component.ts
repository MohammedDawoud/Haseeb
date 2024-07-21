import { BehaviorSubject, Subscription } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SelectionModel } from '@angular/cdk/collections';
import { EmployeesVM } from 'src/app/core/Classes/ViewModels/employeesVM';
import { EmployeePayrollmarchesserviceService } from 'src/app/core/services/Employees-Services/employee-payrollmarchesservice.service';
import { ToastrService } from 'ngx-toastr';
import { DiscountReward } from 'src/app/core/Classes/DomainObjects/discountReward';
import { EmployeesServiceService } from 'src/app/core/services/Employees-Services/employees-service.service';
import { Loan } from 'src/app/core/Classes/DomainObjects/loan';
import { Allowance } from 'src/app/core/Classes/DomainObjects/allowance';
import { AllowanceType } from 'src/app/core/Classes/DomainObjects/allowanceType';
import { TranslateService } from '@ngx-translate/core';
import { NgxPrintElementService } from 'ngx-print-element';
import { RestApiService } from 'src/app/shared/services/api.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-salary-setup',
  templateUrl: './salary-setup.component.html',
  styleUrls: ['./salary-setup.component.scss'],
})
export class SalarySetupComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent | any;

  showBranches: any = false;

  selectedUser: any;
  users: any;
  allBranches = true;
  closeResult = '';
  dayes: any[] = [];
  totals: any[] = [];

  rows = [
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
  ];
  temp: any = [
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
  ];

  isEditable: any = {};

  title: any = {
    main: {
      name: {
        ar: 'شؤون الموظفين',
        en: 'Employees Affairs',
      },
      link: '/employees',
    },
    sub: {
      ar: 'اعداد المسير الشهري',
      en: 'Salary Setup',
    },
  };

  displayedColumns: string[] = [
    'select',
    'employeName',
    'salary',
    'housingallownce',
    'Allowances',
    'bounes',
    'rewards',
    'imprest',
    'discounts',
    'Insurances',
    'absence',
    'deductedSalary',
    'net',
    'operations',
  ];

  dataSource: MatTableDataSource<any>;
  dataSourceWaitingImprest: MatTableDataSource<any>;
  dataSourceAcceptingImprest: MatTableDataSource<any>;

  displayedColumnsWaitingImprest: string[] = [
    'date',
    'employeeName',
    'branch',
    'amount',
    'installmentNumber',
    'startDate',
    'dicesion',
  ];

  displayedColumnsAcceptingImprest: string[] = [
    'imprestNo',
    'date',
    'imprestStatus',
    'employeeName',
    'amount',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  modalDetails: any = {
    id: null,
    date: null,
    amound: null,
    AllowancesNumber: null,
    from: null,
    details: null,
  };

  salaries: any;
  waitingImprests: any;
  acceptingImprests: any;

  public _employeevm: EmployeesVM;

  branchselect: any;
  branches: any;
  monthno: any;
  daysselect: any;
  salarytopost: any;
  salarytopostback: any;
  TSalary = 0;
  TCommunicationAllawance = 0;
  TProfessionAllawance = 0;
  TTransportationAllawance = 0;
  THousingAllowance = 0;
  TMonthlyAllowances = 0;
  TExtraAllowances = 0;
  TTotalLoans = 0;
  TBonus = 0;
  TTotalDiscounts = 0;
  TTotalDayAbs = 0;
  TTotalRewards = 0;
  TTotalySalaries = 0;
  TTotalTaamen = 0;
  TTotalPaidVacations = 0;

  employeeDisscount: any;
  employeeAllowances: any;
  employeeAlloans: any;
  empeditsalaryid: any;
  Basicsalary: any;
  Bonuss: any;
  HousingAllwence: any;
  EmpId: any;
  /////////////////////////////////////////////
  //Discount Reward

  discountRewardobj: any = {
    discountRewardId: 0,
    discountRewardName: null,
    monthnm: null,
    status: null,
    amount: null,
    notes: null,
  };

  public _discountrewardobj: DiscountReward;
  discountrewardiddelete: any;
  discountrewardselect: any;
  discountrewardlist: any;
  ///////////////////////////////////////////////////
  /////////////////////////////////////////////
  //Allownce Type

  AllownceTypeobj: any = {
    AllownceTypeId: 0,
    nameAr: null,
    nameEn: null,
    notes: null,
  };

  public _allowncetype: AllowanceType;
  allowncetypeiddelete: any;
  allowncetypeselect: any;
  allowncetypelist: any;
  ///////////////////////////////////////////////////
  //Allownce

  Allownceobj: any = {
    AllownceId: 0,
    AllownceTypeId: null,
    amount: null,
    monthNo: null,
  };

  public _allownce: Allowance;
  allownceiddelete: any;
  allownceselect: any;
  allowncelist: any;

  //////////////////////////////////////////////////////////////
  //Loan

  loanobj: any = {
    loanId: 0,
    date: null,
    amount: null,
    monthNo: null,
    startMonth: null,
    notes: null,
  };

  public _loan: Loan;
  loaniddelete: any;
  loanlist: any;
  ///////////////////////////////////////////////////
  Months: any;
  lang: any = 'ar';
  userG: any = {};
  datePrintJournals: any = new Date();

  constructor(
    private modalService: NgbModal,
    private _payrolservice: EmployeePayrollmarchesserviceService,
    private toast: ToastrService,
    private _EmpService: EmployeesServiceService,
    private translate: TranslateService,
    private print: NgxPrintElementService,
    private api: RestApiService,
    private authenticationService: AuthenticationService
  ) {
    this.dataSource = new MatTableDataSource([{}]);
    this.dataSourceWaitingImprest = new MatTableDataSource([{}]);
    this.dataSourceAcceptingImprest = new MatTableDataSource([{}]);

    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
    this._employeevm = new EmployeesVM();
    api.lang.subscribe((res) => {
      this.lang = res;
    });
    this.userG = this.authenticationService.userGlobalObj;
    this.PrintEmployeesSalaryReport2();
  }

  FillBranchSelect() {
    debugger;
    this._payrolservice.FillBranchSelect().subscribe((data) => {
      debugger;

      this.branchselect = data;
    });
  }
  FillAllowanceTypeSelect() {
    this._EmpService.FillAllowanceTypeSelect().subscribe((data) => {
      this.allowncetypeselect = data;
    });
  }
  getdayes() {
    debugger
    console.log(this.userG);
    let Today = new Date();
    this._payrolservice.GetCurrentYear().subscribe((result: any) => {
      debugger
      if (result == Today.getFullYear()) {
  if (Today.getMonth() + 1 == 1) {
      this.dayes = [{ id: 1, name: ' يناير' }];
    } else if (Today.getMonth() + 1 == 2) {
      this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
      ];
    } else if (Today.getMonth() + 1 == 3) {
      this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
        { id: 3, name: ' مارس ' },
      ];
    } else if (Today.getMonth() + 1 == 4) {
      this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
        { id: 3, name: ' مارس ' },
        { id: 4, name: ' ابريل ' },
      ];
    } else if (Today.getMonth() + 1 == 5) {
      this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
        { id: 3, name: ' مارس ' },
        { id: 4, name: ' ابريل ' },
        { id: 5, name: ' مايو ' },
      ];
    } else if (Today.getMonth() + 1 == 6) {
      this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
        { id: 3, name: ' مارس ' },
        { id: 4, name: ' ابريل ' },
        { id: 5, name: ' مايو ' },
        { id: 6, name: ' يونيه ' },
      ];
    } else if (Today.getMonth() + 1 == 7) {
      this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
        { id: 3, name: ' مارس ' },
        { id: 4, name: ' ابريل ' },
        { id: 5, name: ' مايو ' },
        { id: 6, name: ' يونيه ' },
        { id: 7, name: ' يوليو ' },
      ];
    } else if (Today.getMonth() + 1 == 8) {
      this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
        { id: 3, name: ' مارس ' },
        { id: 4, name: ' ابريل ' },
        { id: 5, name: ' مايو ' },
        { id: 6, name: ' يونيه ' },
        { id: 7, name: ' يوليو ' },
        { id: 8, name: ' أغسطس ' },
      ];
    } else if (Today.getMonth() + 1 == 9) {
      this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
        { id: 3, name: ' مارس ' },
        { id: 4, name: ' ابريل ' },
        { id: 5, name: ' مايو ' },
        { id: 6, name: ' يونيه ' },
        { id: 7, name: ' يوليو ' },
        { id: 8, name: ' أغسطس ' },
        { id: 9, name: ' سبتمبر ' },
      ];
    } else if (Today.getMonth() + 1 == 10) {
      this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
        { id: 3, name: ' مارس ' },
        { id: 4, name: ' ابريل ' },
        { id: 5, name: ' مايو ' },
        { id: 6, name: ' يونيه ' },
        { id: 7, name: ' يوليو ' },
        { id: 8, name: ' أغسطس ' },
        { id: 9, name: ' سبتمبر ' },
        { id: 10, name: ' اكتوبر ' },
      ];
    } else if (Today.getMonth() + 1 == 11) {
      this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
        { id: 3, name: ' مارس ' },
        { id: 4, name: ' ابريل ' },
        { id: 5, name: ' مايو ' },
        { id: 6, name: ' يونيه ' },
        { id: 7, name: ' يوليو ' },
        { id: 8, name: ' أغسطس ' },
        { id: 9, name: ' سبتمبر ' },
        { id: 10, name: ' اكتوبر ' },
        { id: 11, name: ' نوفمبر ' },
      ];
    } else if (Today.getMonth() + 1 == 12) {
      this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
        { id: 3, name: ' مارس ' },
        { id: 4, name: ' ابريل ' },
        { id: 5, name: ' مايو ' },
        { id: 6, name: ' يونيه ' },
        { id: 7, name: ' يوليو ' },
        { id: 8, name: ' أغسطس ' },
        { id: 9, name: ' سبتمبر ' },
        { id: 10, name: ' اكتوبر ' },
        { id: 11, name: ' نوفمبر ' },
        { id: 12, name: ' ديسمبر ' },
      ];
    }
      } else {
         this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
        { id: 3, name: ' مارس ' },
        { id: 4, name: ' ابريل ' },
        { id: 5, name: ' مايو ' },
        { id: 6, name: ' يونيه ' },
        { id: 7, name: ' يوليو ' },
        { id: 8, name: ' أغسطس ' },
        { id: 9, name: ' سبتمبر ' },
        { id: 10, name: ' اكتوبر ' },
        { id: 11, name: ' نوفمبر ' },
        { id: 12, name: ' ديسمبر ' },
      ];
      }
    });
    
  }
  salaryRptVM_New: any;
  empsalaries: any = [];
  logourl: any;
  Totallaries: any;
  BranchName: any;
  MonthName: any;
  // @ViewChild('reportsalary') reportsalary: any;
  PrintEmployeesSalaryReport2() {
    this._employeevm = new EmployeesVM();
    if (this.allBranches == true) {
      this._employeevm.isAllBranch = true;
      this._employeevm.branchId = this.branches;
    } else {
      this._employeevm.isAllBranch = false;
      this._employeevm.branchId = this.branches;
    }
    this._employeevm.isSearch = true;
    this._employeevm.monthNo = this.daysselect;
    this._payrolservice
      .PrintEmployeesSalaryReport2(this._employeevm)
      .subscribe({
        next: (data: any) => {
          debugger;
          console.log('data', data);
          this.salaryRptVM_New = data;
          this.empsalaries = data.employeesSalaries;
          this.Totallaries = data.total;

          this.BranchName = data.branchName;
          this.MonthName = data.monthName;
          this.logourl = environment.PhotoURL + data.orgData.logoUrl;
          // this.printDiv('reportsalary');
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  PrintEmployeesSalaryReport3() {
    this.printDiv('reportsalary');
  }
  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }
  tempdatasource: any;
  GetEmpPayrollMarches() {
    debugger;
    this._employeevm = new EmployeesVM();
    if (this.allBranches == true) {
      this._employeevm.isAllBranch = true;
      this._employeevm.branchId = this.branches;
    } else {
      this._employeevm.isAllBranch = false;
      this._employeevm.branchId = this.branches;
    }
    this._employeevm.isSearch = true;
    this._employeevm.monthNo = this.daysselect;

    this._payrolservice.GetEmpPayrollMarches(this._employeevm).subscribe({
      next: (data: any) => {
        // assign data to table
        debugger;
        console.log(data);
        //this.totals=data;
        this.salaries = new MatTableDataSource(data);
        this.dataSource = new MatTableDataSource(this.salaries.filteredData);
        // this.dataSource = new MatTableDataSource(this.salaries);
        this.tempdatasource = data;
        this.dataSource.paginator = this.paginator;

        debugger;
        this.TSalary = 0;
        this.TCommunicationAllawance = 0;
        this.TProfessionAllawance = 0;
        this.TTransportationAllawance = 0;
        this.THousingAllowance = 0;
        this.TMonthlyAllowances = 0;
        this.TExtraAllowances = 0;
        this.TTotalLoans = 0;
        this.TBonus = 0;
        this.TTotalDiscounts = 0;
        this.TTotalDayAbs = 0;
        this.TTotalRewards = 0;
        this.TTotalySalaries = 0;
        this.TTotalTaamen = 0;

        for (var i = 0; i < data.length; i++) {
          debugger;
          this.TSalary += data[i].salaryOfThisMonth;
          //TCommunicationAllawance += json[i].CommunicationAllawance;
          //TProfessionAllawance += json[i].ProfessionAllawance;
          //TTransportationAllawance += json[i].TransportationAllawance;
          this.THousingAllowance += data[i].housingAllowance;
          this.TMonthlyAllowances += data[i].monthlyAllowances;
          this.TExtraAllowances += data[i].extraAllowances;
          this.TTotalLoans += data[i].totalLoans;
          this.TBonus += data[i].bonus;
          this.TTotalDiscounts += data[i].totalDiscounts;
          this.TTotalTaamen += parseInt(data[i].taamen);
          this.TTotalDayAbs += parseInt(data[i].totalAbsDays);
          this.TTotalRewards += data[i].totalRewards;
          this.TTotalySalaries += data[i].totalSalaryOfThisMonth;
          this.TTotalPaidVacations += data[i].totalVacations;
        }
        debugger;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  exportData() {
    let x = [];

    for (let index = 0; index < this.tempdatasource.length; index++) {
      x.push({
        employeeName: this.tempdatasource[index].empName,
        salary: this.tempdatasource[index].salaryOfThisMonth,
        housingAllowance: this.tempdatasource[index].housingAllowance,
        monthlyAllowances: this.tempdatasource[index].monthlyAllowances,
        extraAllowances: this.tempdatasource[index].extraAllowances,
        totalLoans: this.tempdatasource[index].totalLoans,
        bonus: this.tempdatasource[index].bonus,
        totalDiscounts: this.tempdatasource[index].totalDiscounts,
        taamen: this.tempdatasource[index].taamen,
        totalDayAbs: this.tempdatasource[index].totalDayAbs,
        totalRewards: this.tempdatasource[index].totalRewards,
        totalVacations: this.tempdatasource[index].totalVacations,

        totalSalaryOfThisMonth:
          this.tempdatasource[index].totalSalaryOfThisMonth,
      });
    }
    debugger;
    this._payrolservice.customExportExcel(x, ' اعداد المسير الشهري');
  }

  transfertomanagement() {
    debugger;
    this._payrolservice
      .PostEmpPayroll(this.salarytopost.payrollId)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');
        debugger;
        if (result.statusCode == 200) {
          this.GetEmpPayrollMarches();
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

  postback() {
    debugger;
    this._payrolservice
      .PostEmpPayroll_Back(this.salarytopostback.payrollId)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');
        debugger;
        if (result.statusCode == 200) {
          this.GetEmpPayrollMarches();
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

  Postall() {
    console.log(this.selection.selected);

    var data = this.selection.selected.map((t) => t.payrollId);
    this._payrolservice.PostEmployeeCheckBox(data).subscribe((result: any) => {
      console.log(result);
      console.log('result');
      debugger;
      if (result.statusCode == 200) {
        this.GetEmpPayrollMarches();
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
  ngOnInit(): void {
    this.GetEmpPayrollMarches();
    this.getdayes();
    this.FillBranchSelect();
    this.FillAllowanceTypeSelect();
    this.Months = [
      { id: 1, Name: 'يناير' },
      { id: 2, Name: 'فبراير' },
      { id: 3, Name: 'مارس' },
      { id: 4, Name: 'إبريل' },
      { id: 5, Name: 'مايو' },
      { id: 6, Name: 'يونية' },
      { id: 7, Name: 'يوليو' },
      { id: 8, Name: 'أغسطس' },
      { id: 9, Name: 'سبتمبر' },
      { id: 10, Name: 'أكتوبر' },
      { id: 11, Name: 'نوفمبر' },
      { id: 12, Name: 'ديسمبر' },
    ];

    // this.users = [
    //   { id: 1, Name: 'محمود نافع' },
    //   { id: 2, Name: 'محمود نافع' },
    //   { id: 3, Name: 'محمود نافع' },
    //   { id: 4, Name: 'محمود نافع' },
    //   { id: 5, Name: 'محمود نافع' },
    //   { id: 6, Name: 'محمود نافع' },
    //   { id: 7, Name: 'محمود نافع' },
    //   { id: 8, Name: 'محمود نافع' },
    //   { id: 9, Name: 'محمود نافع' },
    //   { id: 10, Name: 'محمود نافع' },
    //   { id: 11, Name: 'محمود نافع' },
    // ];

    // this.salaries = [
    //   {
    //     employeName: 'dvfrsf',
    //     salary: 10,
    //     Allowances: 0,
    //     bounes: 10,
    //     rewards: 10,
    //     imprest: 15,
    //     discounts: 15,
    //     Insurances: 15,
    //     absence: 15,
    //     deductedSalary: 2,
    //     net: 15,
    //     status: 1,
    //   },
    //   {
    //     employeName: 'dvfrsf',
    //     salary: 10,
    //     Allowances: 0,
    //     bounes: 10,
    //     rewards: 10,
    //     imprest: 15,
    //     discounts: 15,
    //     Insurances: 15,
    //     absence: 15,
    //     deductedSalary: 2,
    //     net: 15,
    //     status: 0,
    //   },
    //   {
    //     employeName: 'dvfrsf',
    //     salary: 10,
    //     Allowances: 0,
    //     bounes: 10,
    //     rewards: 10,
    //     imprest: 15,
    //     discounts: 15,
    //     Insurances: 15,
    //     absence: 15,
    //     deductedSalary: 2,
    //     net: 15,
    //     status: 1,
    //   },
    //   {
    //     employeName: 'dvfrsf',
    //     salary: 10,
    //     Allowances: 0,
    //     bounes: 10,
    //     rewards: 10,
    //     imprest: 15,
    //     discounts: 15,
    //     Insurances: 15,
    //     absence: 15,
    //     deductedSalary: 2,
    //     net: 15,
    //     status: 0,
    //   },
    //   {
    //     employeName: 'dvfrsf',
    //     salary: 10,
    //     Allowances: 0,
    //     bounes: 10,
    //     rewards: 10,
    //     imprest: 15,
    //     discounts: 15,
    //     Insurances: 15,
    //     absence: 15,
    //     deductedSalary: 2,
    //     net: 15,
    //     status: 1,
    //   },
    // ];
    // this.dataSource = new MatTableDataSource(this.salaries);

    // this.waitingImprests = [
    //   {
    //     date: new Date(),
    //     employeeName: 'addvkmam',
    //     branch: 'cacmaca',
    //     amount: 'vamvkma',
    //     installmentNumber: 'ackas',
    //     startDate: new Date(),
    //     dicesion: 'cascasmc',
    //   },
    //   {
    //     date: new Date(),
    //     employeeName: 'addvkmam',
    //     branch: 'cacmaca',
    //     amount: 'vamvkma',
    //     installmentNumber: 'ackas',
    //     startDate: new Date(),
    //     dicesion: 'cascasmc',
    //   },
    //   {
    //     date: new Date(),
    //     employeeName: 'addvkmam',
    //     branch: 'cacmaca',
    //     amount: 'vamvkma',
    //     installmentNumber: 'ackas',
    //     startDate: new Date(),
    //     dicesion: 'cascasmc',
    //   },
    // ];
    // this.dataSourceWaitingImprest = new MatTableDataSource(
    //   this.waitingImprests
    // );

    // this.acceptingImprests = [
    //   {
    //     imprestNo: 'addvkmam',
    //     date: new Date(),
    //     imprestStatus: 'cacmaca',
    //     employeeName: 'vamvkma',
    //     amount: 'ackas',
    //   },
    //   {
    //     imprestNo: 'addvkmam',
    //     date: new Date(),
    //     imprestStatus: 'cacmaca',
    //     employeeName: 'vamvkma',
    //     amount: 'ackas',
    //   },
    //   {
    //     imprestNo: 'addvkmam',
    //     date: new Date(),
    //     imprestStatus: 'cacmaca',
    //     employeeName: 'vamvkma',
    //     amount: 'ackas',
    //   },
    // ];
    // this.dataSourceAcceptingImprest = new MatTableDataSource(
    //   this.acceptingImprests
    // );
  }

  withReason = false;
  payrollcount: any;
  EmpNameInEditlary: any;
  open(content: any, data?: any, type?: any, info?: any) {
    if (data && type == 'edit') {
      console.log('asdd');

      this.modalDetails = data;
      this.modalDetails['id'] = '1';
    }

    if (info) {
      this.withReason = true;
    }
    debugger;
    if (data && type == 'review') {
      this.salarytopost = data;
    }
    if (data && type == 'postback') {
      debugger;
      this.salarytopostback = data;
    }
    if (data && type == 'editsalary') {
      this.empeditsalaryid = data.empId;
      this.EmpId = data.empId;
      this.Basicsalary = data.mainSalary;
      this.Bonuss = data.bonus;
      this.EmpNameInEditlary = data.empName;
      this.GetAllDiscountRewards(data.empId);
      this.GetAllAllowncetype();
      this.GetAllLoans();
      this.GetAllAllownce();
    }

    if (data && type == 'discountreward') {
      this.discountrewardiddelete = data.discountRewardId;
    }
    if (data && type == 'deleteallownceType') {
      this.allowncetypeiddelete = data.allowanceTypeId;
    }

    if (data && type == 'deleteallownce') {
      this.allownceiddelete = data.allowanceId;
    }

    if (data && type == 'deleteloan') {
      this.loaniddelete = data.loanId;
    }
    if (type == 'postallpayroll') {
      this.payrollcount = this.selection.selected.length;
      if (this.selection.selected.length <= 0) {
        this.toast.error('اختر مسير واحد علي الاقل', 'رسالة');
        return;
      }
    }
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
        centered: true,
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
    this.modalDetails = {
      id: null,
      date: null,
      amound: null,
      AllowancesNumber: null,
      from: null,
      details: null,
    };

    this.control.clear();
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // delete
  confirm() {}

  EditImprestRequest() {
    console.log(this.modalDetails);
  }
  AddImprestRequest() {
    console.log(this.modalDetails);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

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
      FileUploadValidators.accept(['image/*']),
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

  selection = new SelectionModel<any>(true, []);
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  //////////////////////////////////////////////////////Discount Reward Crud Operations////////////////////////////////////////////////////////////////

  GetAllDiscountRewards(EmpId: any) {
    debugger;
    this._payrolservice.GetAllDiscountRewards(EmpId).subscribe((data) => {
      debugger;
      this.employeeDisscount = data.result;
    });
  }

  editreward(data: any) {
    this.discountRewardobj.employeeid = data.employeeId;
    this.discountRewardobj.discountRewardId = data.discountRewardId;
    this.discountRewardobj.monthnm = data.monthNo;
    this.discountRewardobj.amount = data.amount;
    this.discountRewardobj.status = data.type;
    this.discountRewardobj.notes = data.notes;
  }

  Savediscountreward() {
    if (
      this.discountRewardobj.monthnm == null ||
      this.discountRewardobj.amount == null ||
      this.discountRewardobj.status == null ||
      this.discountRewardobj.notes == null ||
      this.discountRewardobj.monthnm == '' ||
      this.discountRewardobj.amount == '' ||
      this.discountRewardobj.status == '' ||
      this.discountRewardobj.notes == ''
    ) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }

    console.log(this.discountRewardobj);

    this._discountrewardobj = new DiscountReward();
    this._discountrewardobj.employeeId = this.empeditsalaryid;
    this._discountrewardobj.discountRewardId =
      this.discountRewardobj.discountRewardId;
    this._discountrewardobj.monthNo = this.discountRewardobj.monthnm;
    this._discountrewardobj.amount = this.discountRewardobj.amount;
    this._discountrewardobj.type = this.discountRewardobj.status;
    this._discountrewardobj.notes = this.discountRewardobj.notes;

    this._EmpService
      .SaveDiscountReward(this._discountrewardobj)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.GetAllDiscountRewards(this.empeditsalaryid);
          this.refreshdiscountreward();

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

  DeleteDiscountReward() {
    this._EmpService
      .DeleteDiscountReward(this.discountrewardiddelete)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.GetAllDiscountRewards(this.empeditsalaryid);
          this.refreshdiscountreward();

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

  refreshdiscountreward() {
    this.discountRewardobj.discountRewardId = 0;
    this.discountRewardobj.monthnm = '';
    this.discountRewardobj.amount = '';
    this.discountRewardobj.status = '';
    this.discountRewardobj.notes = '';
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////Allownce Type Crud Operations////////////////////////////////////////////////////////////////
  GetAllAllowncetype() {
    this._EmpService.GetAllAllowancesTypes('').subscribe((data) => {
      this.allowncetypelist = data.result;
      console.log(data);
    });
  }

  editallowncetype(data: any) {
    this.AllownceTypeobj.allowanceTypeId = data.allowanceTypeId;
    this.AllownceTypeobj.nameAr = data.nameAr;
    this.AllownceTypeobj.nameEn = data.nameEn;
    this.AllownceTypeobj.notes = data.notes;
  }

  SaveAllownceType() {
    if (
      this.AllownceTypeobj.nameAr == null ||
      this.AllownceTypeobj.nameEn == null ||
      this.AllownceTypeobj.notes == null ||
      this.AllownceTypeobj.nameAr == '' ||
      this.AllownceTypeobj.nameEn == '' ||
      this.AllownceTypeobj.notes == ''
    ) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }

    console.log(this.AllownceTypeobj);

    this._allowncetype = new AllowanceType();
    this._allowncetype.allowanceTypeId = this.AllownceTypeobj.allowanceTypeId;
    this._allowncetype.nameAr = this.AllownceTypeobj.nameAr;
    this._allowncetype.nameEn = this.AllownceTypeobj.nameEn;
    this._allowncetype.notes = this.AllownceTypeobj.notes;

    this._EmpService
      .SaveAllowanceType(this._allowncetype)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.GetAllAllowncetype();
          this.refreshallowncetype();

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

  DeleteAllownceTyp() {
    this._EmpService
      .DeleteAllowanceType(this.allowncetypeiddelete)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.GetAllAllowncetype();
          this.refreshallowncetype();

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

  refreshallowncetype() {
    this.AllownceTypeobj.allowanceTypeId = 0;
    this.AllownceTypeobj.nameAr = '';
    this.AllownceTypeobj.nameEn = '';
    this.AllownceTypeobj.notes = '';
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////Allownce  Crud Operations////////////////////////////////////////////////////////////////
  GetAllAllownce() {
    this._EmpService
      .GetAllAllowances(this.empeditsalaryid, '')
      .subscribe((data) => {
        this.allowncelist = data.result;
        console.log(data);
      });
  }

  editallownce(data: any) {
    this.Allownceobj.allowanceId = data.allowanceId;
    this.Allownceobj.allowanceTypeId = data.allowanceTypeId;
    this.Allownceobj.amount = data.amount;
    this.Allownceobj.monthNo = data.monthNo;
  }

  SaveAllownce() {
    if (
      this.Allownceobj.allowanceTypeId == null ||
      this.Allownceobj.amount == null ||
      this.Allownceobj.monthNo == null ||
      this.Allownceobj.allowanceTypeId == '' ||
      this.Allownceobj.amount == '' ||
      this.Allownceobj.monthNo == ''
    ) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }

    console.log(this.Allownceobj);

    this._allownce = new Allowance();
    this._allownce.allowanceId = this.Allownceobj.allowanceId ?? 0;
    this._allownce.employeeId = this.empeditsalaryid;
    this._allownce.allowanceTypeId = this.Allownceobj.allowanceTypeId;
    this._allownce.allowanceAmount = this.Allownceobj.amount;
    this._allownce.allowanceMonthNo = this.Allownceobj.monthNo;

    this._EmpService.SaveAllowance(this._allownce).subscribe((result: any) => {
      console.log(result);
      console.log('result');

      if (result.statusCode == 200) {
        this.GetAllAllownce();
        this.refreshallownce();

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

  DeleteAllownce() {
    this._EmpService
      .DeleteAllowance(this.allownceiddelete)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.GetAllAllownce();
          this.refreshallownce();

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

  refreshallownce() {
    this.Allownceobj.allowanceId = 0;
    this.Allownceobj.allowanceTypeId = '';
    this.Allownceobj.amount = '';
    this.Allownceobj.monthNo = '';
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////loans  Crud Operations////////////////////////////////////////////////////////////////
  GetAllLoans() {
    this._EmpService
      .GetAllLoansE(this.empeditsalaryid, '')
      .subscribe((data) => {
        this.loanlist = data.result;
        console.log(data);
      });
  }

  editloan(data: any) {
    this.loanobj.loanId = data.loanId;
    this.loanobj.date = new Date(data.date);
    this.loanobj.amount = data.amount;
    this.loanobj.monthNo = data.monthNo;
    this.loanobj.startMonth = data.startMonth;
  }

  SaveLoans() {
    if (
      this.loanobj.date == null ||
      this.loanobj.amount == null ||
      this.loanobj.monthNo == null ||
      this.loanobj.startMonth == null ||
      this.loanobj.date == '' ||
      this.loanobj.amount == '' ||
      this.loanobj.monthNo == '' ||
      this.loanobj.startMonth == ''
    ) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }

    console.log(this.loanobj);

    this._loan = new Loan();
    this._loan.loanId = this.loanobj.loanId ?? 0;
    this._loan.employeeId = this.empeditsalaryid;
    this._loan.date = this.loanobj.date;
    this._loan.amount = this.loanobj.amount;
    this._loan.monthNo = this.loanobj.monthNo;
    this._loan.startMonth = this.loanobj.startMonth;
    this._loan.note = this.loanobj.notes;

    this._EmpService.SaveLoan2(this._loan).subscribe((result: any) => {
      console.log(result);
      console.log('result');

      if (result.statusCode == 200) {
        this.GetAllLoans();
        this.refreshloan();

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

  DeleteLoan() {
    this._EmpService.DeleteLoan(this.loaniddelete).subscribe((result: any) => {
      console.log(result);
      console.log('result');

      if (result.statusCode == 200) {
        this.GetAllLoans();
        this.refreshloan();

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

  refreshloan() {
    this.loanobj.loanId = 0;
    this.loanobj.date = '';
    this.loanobj.amount = '';
    this.loanobj.monthNo = '';
    this.loanobj.startMonth = '';
    this.loanobj.notes = '';
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////
}
