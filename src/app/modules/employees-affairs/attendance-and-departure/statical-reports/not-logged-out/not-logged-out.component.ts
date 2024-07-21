import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgxPrintElementService } from 'ngx-print-element';
import { EmployeeReportService } from 'src/app/core/services/Employees-Services/employee-report.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-not-logged-out',
  templateUrl: './not-logged-out.component.html',
  styleUrls: ['./not-logged-out.component.scss'],
  providers: [DatePipe],
})
export class NotLoggedOutComponent {
  title: any = {
    main: {
      name: {
        ar: 'شؤون الموظفين',
        en: 'Employees Affairs',
      },
      link: '/employees',
    },
    sub: {
      ar: 'لم يسجلوا الخروج',
      en: 'Not logged out',
    },
  };

  data: any = {
    filter: {
      enable: false,
      date: null,
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
  BranchName:any
  constructor(
    private api: RestApiService,
    private _report: EmployeeReportService,
    private _sharedService: SharedService,
    private authenticationService: AuthenticationService,
    private print: NgxPrintElementService,
    public datepipe: DatePipe
  ) {
    this.FillBranchSearch();

    var now = new Date();
    var dayNow = ('0' + now.getDate()).slice(-2);
    var monthNow = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + monthNow + '-' + dayNow;
    this.data.filter.toDate = new Date(today);

    var day = ('0' + now.getDate()).slice(-2);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var todayMin = now.getFullYear() + '-' + month + '-01';
    this.data.filter.fromDate = new Date(todayMin);

    this.GetReport();
    this.GetOrganizationData();
    api.lang.subscribe((res) => {
      this.lang = res;
    });
    this.userG = this.authenticationService.userGlobalObj;
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
  shift: any;
  alldata: any;
  GetReport() {
    debugger;

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
      .GetNotLoggedOutDataDGV(start_date, end_date, this.branid)
      .subscribe({
        next: (data: any) => {
          // assign data to table
          debugger;
          console.log(data);
          this.data.notLoggedOut = data.result;
                              this.alldata = data.result;

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
        'الفرع': this.alldata[index].branchName,
        'اليوم': this.alldata[index].dayName,
        'التاريخ': this.alldata[index].checkTime,
        'الرقم الوظيفى': this.alldata[index].empNo,
        'اسم الموظف': this.alldata[index].fullName,
      });
    }
    this._report.ExportExcel(x, 'Not-Logged-Out');
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
    return days[data];
  }
  CheckDate(event: any) {
    if (event != null) {
      debugger;
      var from = this._sharedService.date_TO_String(event[0]);
      var to = this._sharedService.date_TO_String(event[1]);
      //this.RefreshData_ByDate(from,to);
      this.data.filter.fromDate = from;
      this.data.filter.toDate = to;
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
  PrintNotLoggedOutEmp() {
    this.printDiv('reportnotloggedout');
  }
  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }
}
