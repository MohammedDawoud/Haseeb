import { BehaviorSubject, Subscription } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { DatatableComponent } from '@swimlane/ngx-datatable';
import { EmployeePayrollmarchesserviceService } from 'src/app/core/services/Employees-Services/employee-payrollmarchesservice.service';
import { EmployeesVM } from 'src/app/core/Classes/ViewModels/employeesVM';
import { NgxPrintElementService } from 'ngx-print-element';
import { RestApiService } from 'src/app/shared/services/api.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payroll-marches',
  templateUrl: './payroll-marches.component.html',
  styleUrls: ['./payroll-marches.component.scss'],
})
export class PayrollMarchesComponent implements OnInit {
  title: any = {
    main: {
      name: {
        ar: 'شؤون الموظفين',
        en: 'Employees Affairs',
      },
      link: '/employees',
    },
    sub: {
      ar: ' مسيرات الرواتب',
      en: 'Salary marches',
    },
  };

  showBranches = false;

  selectedUser: any;
  users: any;
  allBranches = true;
  closeResult = '';
  dayes: any[] = [];
  totals: any[] = [];

  displayedColumns: string[] = [
    'employeName',
    'salary',
    'housingAllowance',
    'monthlyAllowance',
    'additionalAllowance',
    'bonuses',
    'rewards',
    'imprest',
    'discounts',
    'insurances',
    'absenceDays',
    'net',
  ];

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public _employeevm: EmployeesVM;

  salaries: any;

  branchselect: any;
  branches: any;
  monthno: any;
  daysselect: any;
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
Months: any;
  lang: any = 'ar';
  userG: any = {};
    logourl: any;
  datePrintJournals: any = new Date();
  constructor(private _payrolservice: EmployeePayrollmarchesserviceService,
    private print: NgxPrintElementService,
    private api: RestApiService,
    private authenticationService: AuthenticationService) {
    this.dataSource = new MatTableDataSource([{}]);
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
  tempdatasource: any;
  GetAllVacationsSearch() {
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

    this._payrolservice.GetAllEmployeeSearch(this._employeevm).subscribe({
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
          this.TSalary += data[i].salary;
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
          this.TTotalDayAbs += data[i].totalDayAbs;
          this.TTotalRewards += data[i].totalRewards;
          this.TTotalySalaries += data[i].totalySalaries;
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
        employeeName: this.tempdatasource[index].employeeName,
        salary: this.tempdatasource[index].salary,
        housingAllowance: this.tempdatasource[index].housingAllowance,
        monthlyAllowances: this.tempdatasource[index].monthlyAllowances,
        extraAllowances: this.tempdatasource[index].extraAllowances,
        totalLoans: this.tempdatasource[index].totalLoans,
        bonus: this.tempdatasource[index].bonus,
        totalDiscounts: this.tempdatasource[index].totalDiscounts,
        taamen: this.tempdatasource[index].taamen,
        totalDayAbs: this.tempdatasource[index].totalDayAbs,
        totalRewards: this.tempdatasource[index].totalRewards,
        totalySalaries: this.tempdatasource[index].totalySalaries,
      });
    }
    debugger;
    this._payrolservice.customExportExcel(x, 'مسيرات الرواتب');
  }

  getTSalary() {
    return this.totals
      .map((t) => t.Salary)
      .reduce((acc, value) => acc + value, 0);
  }
  getTHousingAllowance() {
    return this.totals
      .map((t) => t.THousingAllowance)
      .reduce((acc, value) => acc + value, 0);
  }
  getTMonthlyAllowances() {
    return this.totals
      .map((t) => t.TMonthlyAllowances)
      .reduce((acc, value) => acc + value, 0);
  }
  getTExtraAllowances() {
    return this.totals
      .map((t) => t.TExtraAllowances)
      .reduce((acc, value) => acc + value, 0);
  }
  getTTotalLoans() {
    return this.totals
      .map((t) => t.TTotalLoans)
      .reduce((acc, value) => acc + value, 0);
  }
  getTBonus() {
    return this.totals
      .map((t) => t.TBonus)
      .reduce((acc, value) => acc + value, 0);
  }
  getTTotalDiscounts() {
    return this.totals
      .map((t) => t.TTotalDiscounts)
      .reduce((acc, value) => acc + value, 0);
  }
  getTTotalTaamen() {
    return this.totals
      .map((t) => t.TTotalTaamen)
      .reduce((acc, value) => acc + value, 0);
  }
  getTTotalDayAbs() {
    return this.totals
      .map((t) => t.TTotalDayAbs)
      .reduce((acc, value) => acc + value, 0);
  }
  getTTotalRewards() {
    return this.totals
      .map((t) => t.TTotalRewards)
      .reduce((acc, value) => acc + value, 0);
  }
  getTTotalySalaries() {
    return this.totals
      .map((t) => t.TTotalySalaries)
      .reduce((acc, value) => acc + value, 0);
  }

  ngOnInit(): void {
    this.GetAllVacationsSearch();
    this.getdayes();
    this.FillBranchSelect();
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
    //     salary: 'asdadsd',
    //     housingAllowance: 0,
    //     monthlyAllowance: 'dvfrsf',
    //     additionalAllowance: 'dvfrsf',
    //     bonuses: 'asdad',
    //     rewards: 'dvfrsf',
    //     imprest: 'asdadsd',
    //     discounts: 0,
    //     insurances: 'dvfrsf',
    //     absenceDays: 'dvfrsf',
    //     net: 'asdad',
    //   },
    //   {
    //     employeName: 'dvfrsf',
    //     salary: 'asdadsd',
    //     housingAllowance: 0,
    //     monthlyAllowance: 'dvfrsf',
    //     additionalAllowance: 'dvfrsf',
    //     bonuses: 'asdad',
    //     rewards: 'dvfrsf',
    //     imprest: 'asdadsd',
    //     discounts: 0,
    //     insurances: 'dvfrsf',
    //     absenceDays: 'dvfrsf',
    //     net: 'asdad',
    //   },
    //   {
    //     employeName: 'dvfrsf',
    //     salary: 'asdadsd',
    //     housingAllowance: 0,
    //     monthlyAllowance: 'dvfrsf',
    //     additionalAllowance: 'dvfrsf',
    //     bonuses: 'asdad',
    //     rewards: 'dvfrsf',
    //     imprest: 'asdadsd',
    //     discounts: 0,
    //     insurances: 'dvfrsf',
    //     absenceDays: 'dvfrsf',
    //     net: 'asdad',
    //   },
    //   {
    //     employeName: 'dvfrsf',
    //     salary: 'asdadsd',
    //     housingAllowance: 0,
    //     monthlyAllowance: 'dvfrsf',
    //     additionalAllowance: 'dvfrsf',
    //     bonuses: 'asdad',
    //     rewards: 'dvfrsf',
    //     imprest: 'asdadsd',
    //     discounts: 0,
    //     insurances: 'dvfrsf',
    //     absenceDays: 'dvfrsf',
    //     net: 'asdad',
    //   },
    //   {
    //     employeName: 'dvfrsf',
    //     salary: 'asdadsd',
    //     housingAllowance: 0,
    //     monthlyAllowance: 'dvfrsf',
    //     additionalAllowance: 'dvfrsf',
    //     bonuses: 'asdad',
    //     rewards: 'dvfrsf',
    //     imprest: 'asdadsd',
    //     discounts: 0,
    //     insurances: 'dvfrsf',
    //     absenceDays: 'dvfrsf',
    //     net: 'asdad',
    //   },
    // ];
    // this.dataSource = new MatTableDataSource(this.salaries);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  salaryRptVM_New: any;
  empsalaries: any = [];
  Totallaries: any;
  BranchName: any;
  MonthName: any;

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
    debugger
    this.printDiv('reportsalary');
  }
  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }
}
