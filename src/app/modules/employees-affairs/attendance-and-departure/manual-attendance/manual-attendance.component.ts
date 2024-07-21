import { Component } from '@angular/core';
import { RestApiService } from 'src/app/shared/services/api.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AttendenceAndDepartureService } from 'src/app/core/services/Employees-Services/attendence-and-departure.service';
import { ToastrService } from 'ngx-toastr';
import { AttTimeDetailsVM } from 'src/app/core/Classes/ViewModels/attTimeDetailsVM';
import { OfficalHolidayVM } from 'src/app/core/Classes/ViewModels/officalHolidayVM';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { SharedService } from 'src/app/core/services/shared.service';
import { Attendence } from 'src/app/core/Classes/DomainObjects/attendence';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeReportService } from 'src/app/core/services/Employees-Services/employee-report.service';
//import { moment } from 'ngx-bootstrap/chronos/testing/chain';
@Component({
  selector: 'app-manual-attendance',
  templateUrl: './manual-attendance.component.html',
  styleUrls: ['./manual-attendance.component.scss'],
  providers: [DatePipe],
})
export class ManualAttendanceComponent {
  title: any = {
    main: {
      name: {
        ar: 'شؤون الموظفين',
        en: 'Employees Affairs',
      },
      link: '/employees',
    },
    sub: {
      ar: 'الحضور اليدوي',
      en: 'Maniual attendance',
    },
  };

  data: any = {
    fingerAttendence: [],
    filter: {
      show: 1,
      branchid: null,
    },
    day: new Date(),
    days: [],
    week: this.selectWeek(),
  };
  search: any = {
    branchid: 0,
    employeeid: null,
  };
  employeeattendenceobj: any = {
    empId: null,
    empName: null,
    shift: null,
    checkin: null,
    checkout: null,
    dawamdetails: null,
    attendenceid: 0,
  };

  empeditattendenceobj: any = {
    empId: null,
    empName: null,
    shift: null,
    checkin: null,
    checkout: null,
    dawamdetails: null,
    attendenceid: 0,
    date: null,
  };

  branchid: any;
  shid: any;
  employeesselect: any;

  resultarr: any;
  environmenturl: any;

  AllDawaam: AttTimeDetailsVM[];
  Dawaam: AttTimeDetailsVM[];
  dawaamErrMsg = 'يرجى ضبط الدوام للموظف: ';
  dawaamErrExists = false;
  retData: AttTimeDetailsVM[];
  temp: AttTimeDetailsVM[];
  retdata2: OfficalHolidayVM[];
  OfficialHoliday: OfficalHolidayVM;
  OfficialHolidays: OfficalHolidayVM[] = [];
  Attendence_W: any;
  currentWeek: Date[] = [];
  public _AttendenceObj: Attendence;
  constructor(
    private api: RestApiService,
    private modalService: NgbModal,
    private _attendencedeptrure: AttendenceAndDepartureService,
    private toast: ToastrService,
    private datePipe: DatePipe,
    private _sharedservice: SharedService,
    private translate: TranslateService,
    private _report:EmployeeReportService
  ) {
    this.environmenturl = environment.PhotoURL;
    this._AttendenceObj = new Attendence();
  }

  getAllAttTimeDetails = () => {
    this._attendencedeptrure.GetAllAttTimeDetailsScreen().subscribe((data) => {
      this.retData = data;
      console.log(this.retData);
    });
    if (this.retData != null) return;
    this.AllDawaam = this.retData;
  };

  ngOnInit(): void {
    this.getData();
    this.getDaysInMonthUTC();
    this.FillEmployeeSelect();
    //this.getOfficialHolidays();
    debugger;
    //this.filterData(this.resultarr);
  }

  IsWorkDay: any;
  getDayName(date = new Date(), locale = 'en-US') {
    return date.toLocaleDateString(locale, { weekday: 'long' });
  }
  getAttTimeDetails(attTimeId: any, empName: any) {
    debugger;
    attTimeId = parseInt(attTimeId) ?? 0;
    if (attTimeId && this.Dawaam != null) return;
    this._attendencedeptrure
      .GetAllAttTimeDetailsScreenByid(attTimeId)
      .subscribe((data) => {
        debugger;
        this.temp = data;
        this.Dawaam = this.temp;

        let ToDay = new Date();
        let DayofWeekname = this.getDayName(ToDay);
        let DayofWeek = this.GetWeekDay(DayofWeekname);
        this.IsWorkDay = this.Dawaam.filter((obj) => {
          return obj.day == DayofWeek;
        });

        debugger;
        if (this.IsWorkDay.length > 0) {
          // moment.locale("ar-SA");

          let firstIn = this.datePipe.transform(
            this.IsWorkDay[0]._1StFromHour,
            'hh:mm a'
          );
          let firstOut = this.datePipe.transform(
            this.IsWorkDay[0]._1StToHour,
            'hh:mm a'
          );
          let text = firstIn + ' : ' + firstOut;
          if (this.IsWorkDay[0]._2ndFromHour != null) {
            // let SecondIn =new Date(parseInt(this.IsWorkDay[0]._2ndFromHour.substr(6)));
            // let Secondout =new Date(parseInt(this.IsWorkDay[0]._2ndToHour.substr(6)));
            let SecondIn = this.datePipe.transform(
              this.IsWorkDay[0]._2ndFromHour,
              'hh:mm a'
            );
            let Secondout = this.datePipe.transform(
              this.IsWorkDay[0]._2ndToHour,
              'hh:mm a'
            );
            text = text + '     |       ' + SecondIn + ' : ' + Secondout;
            //$('#divShiftTime').css("display", "block");
          }
          //else {
          //    $('#divShiftTime').css("display", "none");
          //}
          this.employeeattendenceobj.dawamdetails = text;
        }
      });
  }

  getOfficialHolidays() {
    this._attendencedeptrure.GetAllOfficalHoliday().subscribe((data) => {
      debugger;
      this.retdata2 = data.result;
      console.log(this.retData);
      debugger;
      if (this.retdata2.length != 0) {
        for (var i = 0; i < this.retdata2.length; i++) {
          this.OfficialHoliday = new OfficalHolidayVM();
          let fromDate = new Date(
            parseInt(this.retdata2[i].fromDate.substr(6))
          );
          this.OfficialHoliday.fromDate = new Date(
            fromDate.getFullYear(),
            fromDate.getMonth(),
            fromDate.getDate()
          ).toString();

          let toDate = new Date(parseInt(this.retdata2[i].toDate.substr(6)));
          this.OfficialHoliday.toDate = new Date(
            toDate.getFullYear(),
            toDate.getMonth(),
            toDate.getDate()
          ).toString();
          debugger;
          this.OfficialHolidays.push(this.OfficialHoliday);
          console.log(this.OfficialHolidays);
        }
      }
    });
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

  GetWeekDay(Day: any) {
    switch (Day) {
      case 'Saturday':
        return 1;
      case 'Sunday':
        return 2;
      case 'Monday':
        return 3;
      case 'Tuesday':
        return 4;
      case 'Wednesday':
        return 5;
      case 'Thursday':
        return 6;
      case 'Friday':
        return 7;
      default:
        return 0;
    }
  }
  FillEmployeeSelect() {
    debugger;
    this._attendencedeptrure.FillEmployeeSearch().subscribe((data) => {
      debugger;

      this.employeesselect = data;
    });
  }
  alldata: any;
  getData() {
    if (this.data.filter.branchid == null) {
      this.branchid = '0';
    } else {
      this.branchid = this.data.filter.branchid;
    }
    this.shid = '0';
    let empid = 0;
    if (this.search.employeeid == null) {
      empid = 0;
    } else {
      empid = this.search.employeeid;
    }
    debugger;
    if (this.data.filter.show == 1) {
      this._attendencedeptrure
        .GetAttendance_Screen(
          '',
          '',
          this.shid,
          this.branchid,
          this.data.filter.show,
          empid
        )
        .subscribe({
          next: (data: any) => {
            debugger;
            // assign data to table
            this.data.fingerAttendence = data;
            this.alldata = data;
            this.fillDropDown(data);
            console.log(data);
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else if (this.data.filter.show == 2) {
      this._attendencedeptrure
        .GetAttendance_Screen(
          '',
          '',
          this.shid,
          this.branchid,
          this.data.filter.show,
          empid
        )
        .subscribe({
          next: (data: any) => {
            debugger;
            // assign data to table
            this.resultarr = data;
            this.data.fingerAttendence = data;
             this.alldata = data;
            //////////////////////////////////////////
            // this.data.fingerAttendence = data;
            console.log(data);
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else if (this.data.filter.show == 3) {
      this._attendencedeptrure
        .GetAttendance_Screen_W(
          this.shid,
          this.branchid,
          this.data.filter.show,
          empid
        )
        .subscribe({
          next: (data: any) => {
            debugger;
            // assign data to table
            this.data.fingerAttendence = data;
             this.alldata = data;
            //this.Attendence_W=data;
            console.log(data);
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else if (this.data.filter.show == 4) {
      this._attendencedeptrure
        .GetAttendance_Screen_M(
          this.shid,
          this.branchid,
          this.data.filter.show,
          empid
        )
        .subscribe({
          next: (data: any) => {
            debugger;
            // assign data to table
            this.data.fingerAttendence = data;
             this.alldata = data;
            console.log(data);
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }

    exportData() {
    let x = [];
debugger
      if (this.data.filter.show < 3) {
        
      
        for (let index = 0; index < this.alldata.length; index++) {
          x.push({
            'انصراف فترة ثانية	': this.alldata[index].timeLeave2,
            'حضور فترة ثانية	': this.alldata[index].timeJoin2,
            'انصراف فترة اولى	': this.alldata[index].timeLeave1,
            'حضور فترة اولى	': this.alldata[index].timeJoin1,
            'التاريخ': this.alldata[index].dateDay,
            'الحالة': this.alldata[index].status,
            'الرقم الوظيفى': this.alldata[index].empNo,
            'اسم الموظف': this.alldata[index].fullName,
            
          });
        }
        this._report.ExportExcelRTL(x, 'Manual Attendence');
      } else if (this.data.filter.show == 4)
      {
        for (let index = 0; index < this.alldata.length; index++) {
          debugger
          // x.push({
            
          //   'السبت': this.alldata[index].m_status[0],
          //   'الرقم الوظيفى': this.alldata[index].empNo,
          //   'اسم الموظف': this.alldata[index].fullName,
          // });
          const dataObj: any ={'':''};
          


  for (let day = this.data.days.length -1; day >=0 ; day--) {
    var label = this.toLocalString(this.data.days[day]);
     const dayString = `${label} ${day +1}`;
    dataObj[dayString] = this.alldata[index].m_status[day] || ''; // Adjust according to the actual data structure
          }
            
          dataObj['الرقم الوظيفى'] = this.alldata[index].empNo;
          dataObj['اسم الموظف'] = this.alldata[index].fullName;


  x.push(dataObj);
        }
                this._report.ExportExcelRTL(x, 'Manual Attendence');

      

         } else if (this.data.filter.show == 3)
      {
        for (let index = 0; index < this.alldata.length; index++) {
          
          x.push({
            'الجمعه': this.alldata[index].m_status[6],
            'الخميس': this.alldata[index].m_status[5],
            'الاربعاء': this.alldata[index].m_status[4],
            'الثلاثاء': this.alldata[index].m_status[3],
            'الاثنين': this.alldata[index].m_status[2],
            'الاحد': this.alldata[index].m_status[1],
            'السبت': this.alldata[index].m_status[0],
            'الرقم الوظيفى': this.alldata[index].empNo,
            'اسم الموظف': this.alldata[index].fullName,
            
               
              
               
               
               
           });
        }
                this._report.ExportExcelRTL(x, 'Manual Attendence');

      }
  }


  applyFilter(event: Event) {}
  getDaysInMonthUTC() {
    let month = new Date().getMonth();
    let year = new Date().getFullYear();
    var date = new Date(Date.UTC(year, month, 1));
    var days = [];
    while (date.getUTCMonth() === month) {
      days.push(new Date(date));
      date.setUTCDate(date.getUTCDate() + 1);
    }
    this.data.days = days;
    return days;
  }

  selectWeek() {
    // return Array(7)
    //   .fill(new Date(new Date()))
    //   .map((el, idx) => new Date(el.setDate(el.getDate() - el.getDay() + idx)));

    //   const currentDate = new Date();
    // const dayOfWeek = currentDate.getDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    // const daysUntilSaturday = (4 - dayOfWeek + 1) % 7; // Calculate how many days to add to reach Saturday

    // return Array(7)
    //   .fill(0)
    //   .map((_, idx) => {
    //     const date = new Date(currentDate);
    //     date.setDate(currentDate.getDate() - daysUntilSaturday + idx);
    //     return date;
    //   });
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const daysToAdd = 6 - currentDayOfWeek; // Days to add to reach Friday
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - currentDayOfWeek - 1); // Start from Saturday

    this.currentWeek = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      debugger;
      return day;
    });
    console.log(this.currentWeek);
    return this.currentWeek;
  }

  toLocalString(date: any) {
    let lang = localStorage.getItem('lang') || 'ar';
    return date.toLocaleString(lang, { weekday: 'long' });
  }
  open(content: any, data?: any, type?: any) {
    if (data && type == 'edit') {
      // this.modalDetails = data;
      // this.modalDetails['id'] = 1;
    }

    if (data && type == 'editempattendence') {
      debugger;
      this.employeeattendenceobj.empName = data.fullName;
      this.employeeattendenceobj.empId = data.empId;
      console.log(this.Dawaam);

      this.getAttTimeDetails(data.dawamId, data.employeeName);
    }

    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
        centered: type ? false : true,
        backdrop: 'static',
        keyboard: false,
      })
      .result.then(
        (result) => {
          // this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  saveattendence() {
    debugger;
    if (
      this.employeeattendenceobj.checkin == null &&
      this.employeeattendenceobj.checkout == null
    ) {
      this.toast.error('لا يمكنك حفظ بدون تسجيل دخول أو خروج');
      return;
    }
    this._AttendenceObj = new Attendence();

    this._AttendenceObj.attendenceId = this.employeeattendenceobj.attendenceid;
    this._AttendenceObj.empId = this.employeeattendenceobj.empId;
    this._AttendenceObj.realEmpId = this.employeeattendenceobj.empId;

    debugger;
    let caseNum = 0;
    this._AttendenceObj.checkIn = this.datePipe.transform(
      new Date(),
      'YYYY-MM-dd'
    );

    if (
      this.employeeattendenceobj.checkin != null &&
      (this.employeeattendenceobj.checkout == null ||
        this.employeeattendenceobj.checkout == '')
    ) {
      this._AttendenceObj.checkTime =
        this.convertTime(this.employeeattendenceobj.checkin) ?? new Date();
      caseNum = 1;
    } else if (
      (this.employeeattendenceobj.checkin == null ||
        this.employeeattendenceobj.checkin == '') &&
      this.employeeattendenceobj.checkout != null
    ) {
      this._AttendenceObj.checkTime =
        this.convertTime(this.employeeattendenceobj.checkout) ?? new Date();
      caseNum = 2;
    } else if (
      this.employeeattendenceobj.checkin != null &&
      this.employeeattendenceobj.checkout != null
    ) {
      this._AttendenceObj.checkTime =
        this.convertTime(this.employeeattendenceobj.checkin) ?? new Date();
      caseNum = 3;
    }
    if (this.employeeattendenceobj.checkin != null) {
      const splitArray = this.employeeattendenceobj.checkin.split(':');
      this._AttendenceObj.Hour = splitArray[0];
      this._AttendenceObj.Minute = splitArray[1];
    } else {
      const splitArray = this.employeeattendenceobj.checkout.split(':');
      this._AttendenceObj.Hour = splitArray[0];
      this._AttendenceObj.Minute = splitArray[1];
    }
    this._AttendenceObj.shiftTime = 0;

    this._AttendenceObj.attendenceDate = this.datePipe.transform(
      new Date(),
      'YYYY-MM-dd'
    );
    var date = this._sharedservice.GetHijriDate(
      new Date(),
      'Contract/GetHijriDate'
    );
    var data = date.subscribe((data) => {
      debugger;
      this._AttendenceObj.attendenceHijriDate = data.result;
      data;
    });

    this._attendencedeptrure
      .SaveAttendence_N(this._AttendenceObj)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');
        debugger;
        if (result.statusCode == 200) {
          if (caseNum == 3) {
            this._AttendenceObj.checkTime =
              this.convertTime(this.employeeattendenceobj.checkout) ??
              new Date();
            if (this.employeeattendenceobj.checkout != null) {
              const splitArray = this.employeeattendenceobj.checkout.split(':');
              this._AttendenceObj.Hour = splitArray[0];
              this._AttendenceObj.Minute = splitArray[1];
            }
            this._attendencedeptrure
              .SaveAttendence_N(this._AttendenceObj)
              .subscribe((result: any) => {
                console.log(result);
                console.log('result');
                debugger;
                if (result.statusCode == 200) {
                  this.getData();
                  this.toast.success(result.reasonPhrase, 'رسالة');
                } else {
                  this.toast.error(
                    this.translate.instant(result.reasonPhrase),
                    this.translate.instant('Message')
                  );
                }
              });
          } else {
            this.getData();
            this.toast.success(result.reasonPhrase, 'رسالة');
          }

          //this.getData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  convertTime(timestring: any) {
    let dat = new Date();
    if (timestring) {
      const [hours, minutes] = timestring.split(':');
      const date = new Date();
      date.setHours(Number(hours));
      date.setMinutes(Number(minutes));
      date.setSeconds(0); // Optional: Set seconds to 0 if needed

      dat = date;
    }
    return dat;
  }
  empid: any;
  checkindisable2: boolean = false;
  checkoutdisable2: boolean = false;
  DateValid: boolean = false;
  empdwawamlist: Array<empdawmobj> = [];
  public empdo = new empdawmobj();
  fillDropDown(data: any) {
    let items = '';
    for (var item of data) {
      debugger;
      this.empdo = new empdawmobj();
      items =
        items +
        "<ng-option [value]='" +
        item.empId +
        "' >" +
        item.fullName +
        '</ng-option>';
      this.empdo.id = item.empId;
      this.empdo.name = item.fullName;
      this.empdo.dawamid = item.dawamId;
      this.empdwawamlist.push(this.empdo);
    }
    // this.empdwawamlist=items;
    console.log(this.empdwawamlist);
  }
  checkdate() {
    debugger;
    let dawamobj = this.empdwawamlist.filter((obj) => {
      return obj.id == this.empeditattendenceobj.empId;
    });
    console.log(dawamobj[0].dawamid);
    this.getAttTimeDetails2(
      dawamobj[0].dawamid,
      '',
      this.empeditattendenceobj.date
    );
  }

  getAttTimeDetails2(attTimeId: any, empName: any, editdate: any) {
    debugger;
    attTimeId = parseInt(attTimeId) ?? 0;
    this._attendencedeptrure
      .GetAllAttTimeDetailsScreenByid(attTimeId)
      .subscribe((data) => {
        debugger;
        this.temp = data;
        this.Dawaam = this.temp;
        let ToDay = new Date(editdate);
        let maxDate = new Date();

        let d = new Date();
        d.setDate(d.getDate() - 30);
        let minDate = d;

        if (new Date(ToDay) >= new Date(maxDate)) {
          this.toast.error('من فضلك أختر تاريخ أقل من تاريخ اليوم', 'رسالة');
          return;
        }
        if (new Date(ToDay) < new Date(minDate)) {
          this.toast.error('من فضلك اختر تاريخ خلال هذا الشهر', 'رسالة');
          return;
        }

        this.DateValid = true;

        debugger;

        //let DayofWeek = ToDay.getDay();
        let DayofWeekname = this.getDayName(ToDay);
        let DayofWeek = this.GetWeekDay(DayofWeekname);
        let IsWorkDay = this.Dawaam.filter((obj) => {
          return obj.day == DayofWeek;
        });
        let text = '';
        if (IsWorkDay.length > 0) {
          let firstIn = this.datePipe.transform(
            IsWorkDay[0]._1StFromHour,
            'hh:mm a'
          );
          let firstOut = this.datePipe.transform(
            IsWorkDay[0]._1StToHour,
            'hh:mm a'
          );
          let text = firstIn + ' : ' + firstOut;
          if (IsWorkDay[0]._2ndFromHour != null) {
            // let SecondIn =new Date(parseInt(this.IsWorkDay[0]._2ndFromHour.substr(6)));
            // let Secondout =new Date(parseInt(this.IsWorkDay[0]._2ndToHour.substr(6)));
            let SecondIn = this.datePipe.transform(
              IsWorkDay[0]._2ndFromHour,
              'hh:mm a'
            );
            let Secondout = this.datePipe.transform(
              IsWorkDay[0]._2ndToHour,
              'hh:mm a'
            );
            text = text + '     |       ' + SecondIn + ' : ' + Secondout;
            //$('#divShiftTime').css("display", "block");
          }

          this.checkindisable2 = false;
          this.checkoutdisable2 = false;
        } else {
          text = 'نهاية أسبوع';
          this.checkindisable2 = true;
          this.checkoutdisable2 = true;
        }
        this.empeditattendenceobj.dawamdetails = text;
      });
  }
  //////////////////////////////////////////////////save editing attendence/////////////////////////

  saveeditingattendence() {
    if (
      this.empeditattendenceobj.checkin == null &&
      this.empeditattendenceobj.checkout == null
    ) {
      this.toast.error('لا يمكنك حفظ بدون تسجيل دخول أو خروج');
      return;
    }

    if (!this.DateValid) {
      this.toast.error('اختر تاريخ صحيح');
      return;
    }
    this._AttendenceObj = new Attendence();

    this._AttendenceObj.attendenceId = this.empeditattendenceobj.attendenceid;
    this._AttendenceObj.empId = this.empeditattendenceobj.empId;
    this._AttendenceObj.realEmpId = this.empeditattendenceobj.empId;

    debugger;
    let caseNum = 0;
    this._AttendenceObj.checkIn = this.datePipe.transform(
      new Date(),
      'YYYY-MM-dd'
    );

    if (
      this.empeditattendenceobj.checkin != null &&
      (this.empeditattendenceobj.checkout == null ||
        this.empeditattendenceobj.checkout == '')
    ) {
      this._AttendenceObj.checkTime =
        this.convertTime(this.empeditattendenceobj.checkin) ?? new Date();
      caseNum = 1;
    } else if (
      (this.empeditattendenceobj.checkin == null ||
        this.empeditattendenceobj.checkin == '') &&
      this.empeditattendenceobj.checkout != null
    ) {
      this._AttendenceObj.checkTime =
        this.convertTime(this.empeditattendenceobj.checkout) ?? new Date();
      caseNum = 2;
    } else if (
      this.empeditattendenceobj.checkin != null &&
      this.empeditattendenceobj.checkout != null
    ) {
      this._AttendenceObj.checkTime =
        this.convertTime(this.empeditattendenceobj.checkin) ?? new Date();
      caseNum = 3;
    }

    this._AttendenceObj.shiftTime = 0;
    if (this.empeditattendenceobj.checkin != null) {
      const splitArray = this.empeditattendenceobj.checkin.split(':');
      this._AttendenceObj.Hour = splitArray[0];
      this._AttendenceObj.Minute = splitArray[1];
    } else {
      const splitArray = this.empeditattendenceobj.checkout.split(':');
      this._AttendenceObj.Hour = splitArray[0];
      this._AttendenceObj.Minute = splitArray[1];
    }

    this._AttendenceObj.attendenceDate = this.datePipe.transform(
      this.empeditattendenceobj.date,
      'YYYY-MM-dd'
    );
    var date = this._sharedservice.GetHijriDate(
      new Date(),
      'Contract/GetHijriDate'
    );
    var data = date.subscribe((data) => {
      debugger;
      this._AttendenceObj.attendenceHijriDate = data.result;
      data;
    });
    debugger;
    // this._attendencedeptrure.DeleteAttendence_N(this.empeditattendenceobj.date).subscribe((result: any)=>{
    //   console.log(result);
    //   console.log("result");
    //   debugger;
    //   if(result.statusCode==200){

    this._attendencedeptrure
      .SaveAttendence_N(this._AttendenceObj)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');
        debugger;
        if (result.statusCode == 200) {
          if (caseNum == 3) {
            this._AttendenceObj.checkTime =
              this.convertTime(this.employeeattendenceobj.checkout) ??
              new Date();
            if (this.empeditattendenceobj.checkout != null) {
              const splitArray = this.empeditattendenceobj.checkout.split(':');
              this._AttendenceObj.Hour = splitArray[0];
              this._AttendenceObj.Minute = splitArray[1];
            }

            this._attendencedeptrure
              .SaveAttendence_N(this._AttendenceObj)
              .subscribe((result: any) => {
                console.log(result);
                console.log('result');
                debugger;
                if (result.statusCode == 200) {
                  this.getData();
                  this.toast.success(result.reasonPhrase, 'رسالة');
                } else {
                  this.toast.error(
                    this.translate.instant(result.reasonPhrase),
                    this.translate.instant('Message')
                  );
                }
              });
          } else {
            this.getData();
            this.toast.success(result.reasonPhrase, 'رسالة');
          }

          //this.getData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });

    //   }
    // });
  }
}
export class empdawmobj {
  id: number;
  name: string;
  dawamid: number;
}
