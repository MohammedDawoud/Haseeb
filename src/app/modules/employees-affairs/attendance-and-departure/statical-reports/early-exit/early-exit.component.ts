import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgxPrintElementService } from 'ngx-print-element';
import { EmployeeReportService } from 'src/app/core/services/Employees-Services/employee-report.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-early-exit',
  templateUrl: './early-exit.component.html',
  styleUrls: ['./early-exit.component.scss'],
  providers: [DatePipe],
})
export class EarlyExitComponent {
  title: any = {
    main: {
      name: {
        ar: 'شؤون الموظفين',
        en: 'Employees Affairs',
      },
      link: '/employees',
    },
    sub: {
      ar: 'الخروج المبكر',
      en: 'Early exit',
    },
  };

  data: any = {
    filter: {
      enable: false,
      date: null,
      empid: null,
      shift: null,
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
    this.FillEmployeeSearch();
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
    if (this.data.filter.shift != null) {
      this.shift = this.data.filter.shift;
    } else {
      this.shift = '0';
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
      .GetEarlyDepartureDataDGV(
        start_date,
        end_date,
        this.emp,
        this.shift,
        this.branid
      )
      .subscribe({
        next: (data: any) => {
          // assign data to table
          debugger;
          console.log(data);
          this.data.earlyExite = data.result;
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
        'انصراف مبكر': this.alldata[index].moveTimeStringLeave2,
         'انصراف فترة ثانية	': this.alldata[index].timeLeave2,
        'انصراف مبكر	': this.alldata[index].moveTimeStringLeave1,
        'انصراف فترة اولى	': this.alldata[index].timeLeave1,
        'التاريخ': this.alldata[index].dateDay,
        'الرقم الوظيفى': this.alldata[index].empNo,
        'اسم الموظف': this.alldata[index].fullName,
        
      });
    }
    this._report.ExportExcelRTL(x, 'Late Employee');
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
  PrintearlyexitEmp() {
    this.printDiv('reportearlyexit');
  }
  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }
}
