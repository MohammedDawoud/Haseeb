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
  selector: 'app-attendance-and-departure-of-employees',
  templateUrl: './attendance-and-departure-of-employees.component.html',
  styleUrls: ['./attendance-and-departure-of-employees.component.scss'],
  providers: [DatePipe],
})
export class AttendanceAndDepartureOfEmployeesComponent {
  title: any = {
    main: {
      name: {
        ar: 'شؤون الموظفين',
        en: 'Employees Affairs',
      },
      link: '/employees',
    },
    sub: {
      ar: 'الحضور بالبصمة',
      en: 'Attendance and departure of employees',
    },
  };
  data: any = {
    fingerAttendence: [],
    filter: {
      enable: false,
      date: null,
      branchid: null,
      StartDate: null,
      EndDate: null,
    },
  };
  branchselect: any;
  branchid: '0';
  shid: '0';
  lang: any = 'ar';
  datePrintJournals: any = this.datepipe.transform(new Date(), 'YYYY-MM-dd');
  logourl: any;
  userG: any = {};
  alldata: any;
  constructor(
    private api: RestApiService,
    private _attendencedeptrure: AttendenceAndDepartureService,
    private _sharedService: SharedService,
    private authenticationService: AuthenticationService,
    private print: NgxPrintElementService,
    public datepipe: DatePipe,
    private _report: EmployeeReportService
  ) {
    this.FillBranchSelect();
    this.GetOrganizationData();

    api.lang.subscribe((res) => {
      this.lang = res;
    });
    this.userG = this.authenticationService.userGlobalObj;
  }

  FillBranchSelect() {
    debugger;
    this._attendencedeptrure.FillBranchSearch().subscribe((data) => {
      debugger;

      this.branchselect = data;
    });
  }
  isLoading: boolean = false;

  Getattendenceanddeptrure(issearch: any) {
    debugger;
    this.isLoading=true;
    if (this.data.filter.branchid == null) {
      this.branchid = '0';
    } else {
      this.branchid = this.data.filter.branchid;
    }
    this.shid = '0';

    this._attendencedeptrure
      .GetAttendanceDataDGV(
        this.data.filter.StartDate,
        this.data.filter.EndDate,
        this.shid,
        this.branchid
      )
      .subscribe({
        next: (data: any) => {
          debugger;
          // assign data to table
          this.data.fingerAttendence = data.result;
          this.alldata = data.result;
          console.log(data.result);
          this.isLoading=false;
        },
        error: (error) => {
          console.log(error);
          this.isLoading=false;
        },
      });
  }
     exportData() {
    let x = [];

    for (let index = 0; index < this.alldata.length; index++) {
      x.push({
        'اجمالى التأخير	': this.alldata[index].late,
        'اجمالي الغياب	': this.alldata[index].absence,
         'اجمالي الحضور	': this.alldata[index].attend,
         'انصراف فترة ثانية	': this.alldata[index].timeLeave2,
         'حضور فترة ثانية	': this.alldata[index].timeJoin2,
         'انصراف فترة اولى	': this.alldata[index].timeLeave1,
          'حضور فترة اولى	': this.alldata[index].timeJoin1,
         'التاريخ': this.alldata[index].dateDay,
         'الرقم الوظيفى': this.alldata[index].empNo,
        'اسم الموظف': this.alldata[index].fullName,
      });
    }
    this._report.ExportExcelRTL(x, 'Staff Absentee');
  }

  // getData() {
  //   this.api.get('../../../../../../assets/employee.json').subscribe({
  //     next: (data: any) => {
  //       // assign data to table
  //       this.data.fingerAttendence = data.fingerAttendence;
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     },
  //   });
  // }
  ngOnInit(): void {
    this.setdefaultdate();
    this.Getattendenceanddeptrure(1);
  }

  setdefaultdate() {
    var now = new Date();
    var dayNow = ('0' + now.getDate()).slice(-2);
    var monthNow = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + monthNow + '-' + dayNow;

    var day = ('0' + now.getDate()).slice(-2);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var todayMin = now.getFullYear() + '-' + month + '-01';
    this.data.filter.StartDate = todayMin;

    this.data.filter.EndDate = today;
  }
  applyFilter(event: Event) {}

  getDayName(data: any) {
    var days = [
      'Saturday',
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
    ];
    return days[data - 1];
  }

  CheckDate(event: any) {
    if (event != null) {
      var from = this._sharedService.date_TO_String(event[0]);
      var to = this._sharedService.date_TO_String(event[1]);
      //this.RefreshData_ByDate(from,to);
      this.data.filter.StartDate = from;
      this.data.filter.EndDate = to;
      this.Getattendenceanddeptrure(1);
    } else {
      this.data.filter.DateFrom_P = '';
      this.data.filter.DateTo_P = '';
      //this.RefreshData();
    }
  }

  refresh(datefilter: any) {
    console.log(datefilter);
    if (datefilter == false) {
      this.data.filter.date = null;
      var now = new Date();
      var dayNow = ('0' + now.getDate()).slice(-2);
      var monthNow = ('0' + (now.getMonth() + 1)).slice(-2);
      var today = now.getFullYear() + '-' + monthNow + '-' + dayNow;
      this.data.filter.EndDate = new Date(today);

      var day = ('0' + now.getDate()).slice(-2);
      var month = ('0' + (now.getMonth() + 1)).slice(-2);
      var todayMin = now.getFullYear() + '-' + month + '-01';
      this.data.filter.StartDate = new Date(todayMin);
      this.Getattendenceanddeptrure(1);
    }
  }

  GetOrganizationData() {
    this._sharedService.GetOrganizationData().subscribe((data) => {
      this.logourl = environment.PhotoURL + data.logoUrl;
    });
  }
  Printemployeeattendence() {
    this.printDiv('reportemployeeattendence');
  }
  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }
}
