import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AttendenceLocationService } from 'src/app/core/services/Employees-Services/attendence-location.service';

@Component({
  selector: 'app-attendanceList',
  templateUrl: './attendanceList.component.html',
  styleUrls: ['./attendanceList.component.scss'],
})
export class AttendanceListComponent implements OnInit {

  title: any = {
    main: {
      name: {
        ar: 'لوحة التحكم',
        en: 'Control Panel',
      },
      link: '/controlpanel',
    },
    sub: {
      ar: 'مواقع العمل ',
      en: ' Work Location',
    },
  };

  attendanceData!: {
    attendenceLocationSettingsId:number;
    name: string;
    employeeCount:number;
    coordinates: {
      xmin: number;
      ymin: number;
      xmax: number;
      ymax: number;
    };
    center: {
      lng: number;
      lat: number;
    };
  }[];

  constructor(
    private modalService: NgbModal,
    private _attendencelocation: AttendenceLocationService,
    private toast: ToastrService,
    private translate: TranslateService
    ,private router: Router
  ) {
    this.attendanceData= [];
  }

  ngOnInit() {
    // this.attendanceData = this.attendanceDataService.attendanceData;
    this.GetAllAttendencelocations();
  }

  GetAllAttendencelocations() {
    this._attendencelocation.GetAllAttendencelocations('').subscribe((data) => {
      console.log(data.result);
      data.result.forEach((element: any) => {
        var ObjList = {
          attendenceLocationSettingsId:element.attendenceLocationSettingsId,
          name: element.name,
          employeeCount: element.employeeCount,
          coordinates: {
            xmin: element.xmin,
            ymin: element.ymin,
            xmax: element.xmax,
            ymax: element.ymax,
          },
          center: {
            lng: element.longitude,
            lat: element.latitude,
          },
        };

        this.attendanceData.push(ObjList);

      });
    });
  }
}
