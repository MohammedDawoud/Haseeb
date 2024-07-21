import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AttendenceVM } from 'src/app/core/Classes/ViewModels/attendenceVM';
import { EmployeeReportService } from 'src/app/core/services/Employees-Services/employee-report.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { RestApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-attendance-and-departure',
  templateUrl: './attendance-and-departure.component.html',
  styleUrls: ['./attendance-and-departure.component.scss'],
  providers: [DatePipe]
})
export class AttendanceAndDepartureComponent {
  title: any = {
    main: {
      name: {
        ar: 'شؤون الموظفين',
        en: 'Employees Affairs',
      },
      link: '/employees',
    },
    sub: {
      ar: 'الحضور والانصراف',
      en: 'Attendance and Departure',
    },
  };

  // dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'EmployeeName',
    'BranchName',
    'CheckIn',
    'ShiftTime',
    'CheckType',
    'CheckTime',
  ];
  data: any = {
    filter: {
      enable: false,
      date: null,
      empid:null,
      shift:null,
      branchid:null,
      fromDate:null,
      toDate:null,
    },
    
  };
  attendence: any = {
    attendence: new MatTableDataSource([{}]),
  };
  EmployeeSearch:any;
  BranchSearch:any;
  public _AttendenceVM:AttendenceVM;
  constructor(private api: RestApiService,private _report:EmployeeReportService
    , private _sharedService: SharedService,
    public datepipe: DatePipe) {
      this._AttendenceVM=new AttendenceVM();
    this.FillEmployeeSearch();
    this.FillBranchSearch();



    var now = new Date();
    var dayNow = ("0" + now.getDate()).slice(-2);
    var monthNow = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (monthNow) + "-" + (dayNow);
    this.data.filter.toDate=new Date(today);

    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var todayMin = now.getFullYear() + "-" + month + "-01";
    this.data.filter.fromDate=new Date(todayMin);

    this.GetReport();
  }

  FillEmployeeSearch(){
    this._report.FillEmployeeSearch().subscribe(data=>{
      console.log(data);
      this.EmployeeSearch=data;
    });
  }
  FillBranchSearch(){
    this._report.FillBranchSearch().subscribe(data=>{
      console.log(data);
      this.BranchSearch=data;
    });
  }
  emp:any;
  branid:any;
  shift:any
  refresh(datefilter:any){
console.log(datefilter);
if(datefilter==false){
  this.data.filter.date=null;    var now = new Date();
  var dayNow = ("0" + now.getDate()).slice(-2);
  var monthNow = ("0" + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear() + "-" + (monthNow) + "-" + (dayNow);
  this.data.filter.toDate=new Date(today);

  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  var todayMin = now.getFullYear() + "-" + month + "-01";
  this.data.filter.fromDate=new Date(todayMin);

  this.GetReport();
}
  }
  attendenceData2: any = []
  alldata: any;
  GetReport(){
    this._AttendenceVM=new AttendenceVM();
debugger;
if(this.data.filter.empid !=null){
  this.emp=this.data.filter.empid;
}
else{
  this.emp='0';
}

if(this.data.filter.branchid !=null){
  this.branid=this.data.filter.branchid;
}
else{
  this.branid='0';
}

let start_date =this.datepipe.transform(this.data.filter.fromDate, 'yyyy-MM-dd');
let end_date =this.datepipe.transform(this.data.filter.toDate, 'yyyy-MM-dd');
this._AttendenceVM.empId=this.emp;
this._AttendenceVM.branchId=this.branid;
this._AttendenceVM.startDate=start_date;
this._AttendenceVM.endDate=end_date;
    this._report.EmpAttendenceSearch(this._AttendenceVM).subscribe({
      next: (data: any) => {
        // assign data to table
    debugger;
        console.log(data)
        this.attendenceData2 = data.result;
        this.alldata = data.result;

        this.attendence.attendence = new MatTableDataSource(this.attendenceData2);
        this.attendence.attendence.paginator = this.paginator;
        this.attendence.attendence.sort = this.sort;
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
        'الوقت': this.datepipe.transform(this.alldata[index].checkTime, 'h:mm a') ,
        'الحالة': this.alldata[index].checkType,
        'الفترة': this.alldata[index].shiftTime == 1 ? 'فترة صباحية' : 'فترة مسائية',
        'التاريخ': this.datepipe.transform(this.alldata[index].checkTime, 'YYYY/MM/dd') ,
        'الفرع': this.alldata[index].branchName,
        'الموظف': this.alldata[index].employeeName,
        
      });
    }
    this._report.ExportExcelRTL(x, 'EmployeeAttendence');
  }
  pageNumber: any = 0;

  onPageChange(event: any) {
    this.pageNumber = event.pageIndex;

    console.log(this.pageNumber * 10, (this.pageNumber + 1) * 10);

    this.data.notifications = new MatTableDataSource(
      this.attendence.attendence.slice(this.pageNumber * 10, (this.pageNumber + 1) * 10)
    );
  }
  getDayName(data:any) {
    //var days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    let days = ["السبت", "اﻷحد", "اﻷثنين", "الثلاثاء", "اﻷربعاء", "الخميس", "الجمعة"];
    return days[data-1];
}
  CheckDate(event: any){
    if(event!=null)
    {
      debugger;
      var from= this._sharedService.date_TO_String(event[0]);
      var to= this._sharedService.date_TO_String(event[1]);
      //this.RefreshData_ByDate(from,to);
      this.data.filter.fromDate =from; 
      this.data.filter.toDate =to; 
     this.GetReport();
    }
    else{
      this.data.filter.DateFrom_P="";
      this.data.filter.DateTo_P="";
      //this.RefreshData();
    }
  }
  applyFilter(event: Event) {}
}
