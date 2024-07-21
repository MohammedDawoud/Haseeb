import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgxPrintElementService } from 'ngx-print-element';
import { AttendenceAndDepartureService } from 'src/app/core/services/Employees-Services/attendence-and-departure.service';
import { EmployeeReportService } from 'src/app/core/services/Employees-Services/employee-report.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-absentees-today',
  templateUrl: './absentees-today.component.html',
  styleUrls: ['./absentees-today.component.scss'],
  providers: [DatePipe],
})
export class AbsenteesTodayComponent {
  title: any = {
    main: {
      name: {
        ar: 'شؤون الموظفين',
        en: 'Employees Affairs',
      },
      link: '/employees',
    },
    sub: {
      ar: 'الغائبون اليوم',
      en: 'Absentees Today',
    },
  };

  data: any = {
    absence: [],
  };
  lang: any = 'ar';
  datePrintJournals: any = this.datepipe.transform(new Date(), 'YYYY-MM-dd');
  logourl: any;
  userG: any = {};
  BranchName:any
  constructor(
    private api: RestApiService,
    private _attendencedeptrure: AttendenceAndDepartureService,

    private _sharedService: SharedService,
    public datepipe: DatePipe,
    private authenticationService: AuthenticationService,
    private print: NgxPrintElementService,
    private _report:EmployeeReportService
  ) {
    this.getData();
    this.GetOrganizationData();
        this.api.GetBranchByBranchId().subscribe((data: any) => {
      debugger
                    this.BranchName = data.result[0].branchName;

    });
  }
  alldata: any;
  getData() {
    this._attendencedeptrure.GetAbsenceDataTodayDGV().subscribe({
      next: (data: any) => {
        debugger;
        // assign data to table
        console.log(data);
        this.data.absence = data.result;
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
        'الفرع': this.alldata[index].e_BranchId,
        'اليوم': this.getDayName(this.alldata[index].dayNOfWeek),
         'التاريخ': this.alldata[index].mdate,
        'الرقم الوظيفى': this.alldata[index].empNo,
        'اسم الموظف': this.alldata[index].e_FullName,
        
      });
    }
    this._report.ExportExcelRTL(x, 'Staff Absentee');
  }
  applyFilter(event: Event) {}

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

  GetOrganizationData() {
    this._sharedService.GetOrganizationData().subscribe((data) => {
      this.logourl = environment.PhotoURL + data.logoUrl;
    });
  }
  Printabsence() {
    this.printDiv('reportabsence');
  }
  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }
}
