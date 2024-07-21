import { Component } from '@angular/core';
import { EmployeeReportService } from 'src/app/core/services/Employees-Services/employee-report.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NgxPrintElementService } from 'ngx-print-element';

@Component({
  selector: 'app-absentee-staff',
  templateUrl: './absentee-staff.component.html',
  styleUrls: ['./absentee-staff.component.scss'],
  providers: [DatePipe],
})
export class AbsenteeStaffComponent {
  title: any = {
    main: {
      name: {
        ar: 'شؤون الموظفين',
        en: 'Employees Affairs',
      },
      link: '/employees',
    },
    sub: {
      ar: '  الموظفون الغائبون ',
      en: ' Absentee Staff ',
    },
  };

  data: any = {
    filter: {
      enable: false,
      date: null,
      empid: null,
      branchid: null,
      fromDate: null,
      toDate: null,
    },
  };
  EmployeeSearch: any;
  BranchSearch: any;
  lang: any = 'ar';
  datePrintJournals: any = this.datepipe.transform(new Date(), 'YYYY-MM-dd');
  logourl: any;
  userG: any = {};
  constructor(
    private api: RestApiService,
    private _report: EmployeeReportService,
    private _sharedService: SharedService,
    public datepipe: DatePipe,
    private authenticationService: AuthenticationService,
    private print: NgxPrintElementService
  ) {
    api.lang.subscribe((res) => {
      this.lang = res;
    });
    this.userG = this.authenticationService.userGlobalObj;
  }

  // getData() {
  //   this.api.get('../../../../../../assets/employee.json').subscribe({
  //     next: (data: any) => {
  //       // assign data to table
  //       this.data.absence = data.absence;
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     },
  //   });
  // }
  BranchName: any
  fromdate: any
  todate:any
  ngOnInit(): void {
    this.FillEmployeeSearch();
    this.FillBranchSearch();
    this.GetOrganizationData();

    var now = new Date();
    var dayNow = ('0' + now.getDate()).slice(-2);
    var monthNow = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + monthNow + '-' + dayNow;
    this.data.filter.toDate = new Date(today);
    var day = ('0' + now.getDate()).slice(-2);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var todayMin = now.getFullYear() + '-' + month + '-01';
    this.data.filter.fromDate = new Date(todayMin);
    this.todate = today
        this.fromdate=todayMin

    this.GetReport();
        this.api.GetBranchByBranchId().subscribe((data: any) => {
      debugger
                    this.BranchName = data.result[0].branchName;

    });
  }

  FillEmployeeSearch() {
    this._report.FillEmployeeSearch().subscribe((data) => {
      console.log(data);
      this.EmployeeSearch = data;
    });
  }
  FillBranchSearch() {
    this._report.FillBranchSearch().subscribe((data) => {
      console.log(data);
      this.BranchSearch = data;
    });
  }
  emp: any;
  branid: any;

  alldata: any;
  GetReport() {
    debugger;

    if (this.data.filter.empid != null) {
      this.emp = this.data.filter.empid;
    } else {
      this.emp = '0';
    }

    if (this.data.filter.branchid != null) {
      this.branid = this.data.filter.branchid;
    } else {
      this.branid = '0';
    }
    let start_date = this.datepipe.transform(
      this.data.filter.fromDate,
      'yyyy-MM-dd'
    );
    let end_date = this.datepipe.transform(
      this.data.filter.toDate,
      'yyyy-MM-dd'
    );

    this._report
      .GetAbsenceDataDGV(start_date, end_date, this.emp, this.branid)
      .subscribe({
        next: (data: any) => {
          // assign data to table
          debugger;
          console.log(data);
          this.data.absence = data;
          this.alldata = data;
          // this.carsMovement = new MatTableDataSource(data.result);
          // this.dataSource = new MatTableDataSource(this.carsMovement.filteredData);
          // this.dataSource.paginator = this.paginator;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }


    exportData() {
    let x = [];

    for (let index = 0; index < this.alldata.length; index++) {
      x.push({
        'الفرع': this.alldata[index].e_BranchId,
        'اليوم': this.getDayName(this.alldata[index].dayNOfWeek),
        'التاريخ': this.alldata[index].mdate,
        'الرقم الوظيفى': this.alldata[index].empNo,
        'اسم الموظف': this.alldata[index].e_FullName,
  
      });
    }
    this._report.ExportExcelRTL(x, 'Staff Absentee');
  }
  getDayName(data: any) {
    //var days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    let days = [
      'السبت',
      'اﻷحد',
      'اﻷثنين',
      'الثلاثاء',
      'اﻷربعاء',
      'الخميس',
      'الجمعة',
    ];
    return days[data - 1];
  }
  CheckDate(event: any) {
    if (event != null) {
      debugger;
      var from = this._sharedService.date_TO_String(event[0]);
      var to = this._sharedService.date_TO_String(event[1]);
      //this.RefreshData_ByDate(from,to);
      this.data.filter.fromDate = from;
      this.data.filter.toDate = to;
      this.fromdate = this._sharedService.date_TO_String(from);
      this.todate=this._sharedService.date_TO_String(to)
      this.GetReport();
    } else {
      this.data.filter.DateFrom_P = '';
      this.data.filter.DateTo_P = '';
      //this.RefreshData();
    }
  }
  applyFilter(event: Event) {}

  GetOrganizationData() {
    this._sharedService.GetOrganizationData().subscribe((data) => {
      this.logourl = environment.PhotoURL + data.logoUrl;
    });
  }
  Printabsence() {
    this.printDiv('reportloan');
  }
  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }
}
