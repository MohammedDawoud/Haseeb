import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgxPrintElementService } from 'ngx-print-element';
import { EmployeeReportService } from 'src/app/core/services/Employees-Services/employee-report.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-late-today',
  templateUrl: './late-today.component.html',
  styleUrls: ['./late-today.component.scss'],
  providers: [DatePipe],
})
export class LateTodayComponent {
  title: any = {
    main: {
      name: {
        ar: 'شؤون الموظفين',
        en: 'Employees Affairs',
      },
      link: '/employees',
    },
    sub: {
      ar: 'المتأخرون اليوم',
      en: 'Late today',
    },
  };

  data: any = {
    lateEmployee: [],
  };
  DateNow: any;
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
    var now = new Date();
    var dayNow = ('0' + now.getDate()).slice(-2);
    var monthNow = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + monthNow + '-' + dayNow;
    this.DateNow = today;

    this.getData();
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
  alldata: any;
  getData() {
    let reportabsnteefrom = this._sharedService.date_TO_String(new Date());
    let reportabsenteeto = this._sharedService.date_TO_String(new Date());
    this._report
      .GetLateDataDGV(reportabsnteefrom, reportabsenteeto, '0', '0', '0')
      .subscribe({
        next: (data: any) => {
          // assign data to table
          this.data.lateEmployee = data.result;
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
        'زمن التأخير	': this.alldata[index].moveTimeStringJoin2,
        'حضور فترة ثانية	': this.alldata[index].timeJoin2,
        'زمن التأخير': this.alldata[index].moveTimeStringJoin1,
        'حضور فترة اولى	': this.alldata[index].timeJoin1,
        'التاريخ': this.alldata[index].dateDay,
        'الرقم الوظيفى': this.alldata[index].empNo,
        'اسم الموظف': this.alldata[index].fullName,
      });
    }
    this._report.ExportExcelRTL(x, 'Late Today');
  }
  applyFilter(event: Event) {}
  GetOrganizationData() {
    this._sharedService.GetOrganizationData().subscribe((data) => {
      this.logourl = environment.PhotoURL + data.logoUrl;
    });
  }
  PrintLateEmp() {
    this.printDiv('reportlateemployee');
  }
  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }
}
