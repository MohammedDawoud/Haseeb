import { Component } from '@angular/core';
import { AttendenceAndDepartureService } from 'src/app/core/services/Employees-Services/attendence-and-departure.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
import { icon, latLng, marker, popup, tileLayer } from 'leaflet';
import * as L from 'leaflet';

@Component({
  selector: 'app-application-attendance',
  templateUrl: './application-attendance.component.html',
  styleUrls: ['./application-attendance.component.scss'],
})
export class ApplicationAttendanceComponent {
  mapOptions: any;

  title: any = {
    main: {
      name: {
        ar: 'شؤون الموظفين',
        en: 'Employees Affairs',
      },
      link: '/employees',
    },
    sub: {
      ar: 'الحضور من التطبيق',
      en: 'Application Attendance',
    },
  };
  modalDetails: any;
  data: any = {
    employees: [],
    date: new Date(),
    period: 1,
    branchid: null,
    startDate: null,
    endDate: null,
  };
  options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  Latitude = '24.215';
  longitude = '24.215';

  date: any = new Date();

  icon: any = {
    url: '/assets/user-test.png',
    scaledSize: {
      width: 50,
      height: 50,
    },
  };

  branchesSelect: any;
  environmenturl: any;
  constructor(
    private api: RestApiService,
    private _attservice: AttendenceAndDepartureService,
    private _sharedService: SharedService
  ) {}

  FillBranchSelect() {
    debugger;
    this._attservice.FillBranchSearch().subscribe((data) => {
      debugger;

      this.branchesSelect = data;
    });
  }
  getData() {
    this.refreshmap();
    var branchid = this.data.branchid;
    if (this.data.branchid == null) {
      branchid = '0';
    }

    debugger;
    this._attservice
      .GetAttendanceDataDGV_application(
        this.data.startDate,
        this.data.toDate,
        this.data.period,
        branchid
      )
      .subscribe((data) => {
        debugger;
        this.data.employees = data;

        console.log(this.data.employees);
      });
  }
  firstMday: any;
  ngOnInit(): void {
    var now = new Date();
    var dayNow = ('0' + now.getDate()).slice(-2);
    var monthNow = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + monthNow + '-' + dayNow;

    var day = ('0' + now.getDate()).slice(-2);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var todayMin = now.getFullYear() + '-' + month + '-01';
    this.firstMday = todayMin;
    this.data.startDate = today;
    this.data.toDate = today;
    this.getData();
    this.FillBranchSelect();
    this.environmenturl = environment.PhotoURL;
  }

  employeetotal: any = {
    attend: 0,
    abcence: 0,
    Late: 0,
  };
  refreshtotals() {
    this.employeetotal.attend = 0;
    this.employeetotal.abcence = 0;
    this.employeetotal.Late = 0;
  }

  GetEmployeeTotal(empid: any) {
    this.refreshtotals();
    var branchid = this.data.branchid;
    if (this.data.branchid == null) {
      branchid = '0';
    }

    debugger;
    this._attservice
      .GetEmployeeTotal(
        this.firstMday,
        this.data.toDate,
        empid,
        this.data.period,
        branchid
      )
      .subscribe((data) => {
        debugger;
        this.employeetotal.attend = data.attend;
        this.employeetotal.abcence = data.abcence;
        this.employeetotal.Late = data.late;
      });
  }

  changeperiod(period: any) {
    this.data.period = period;
    this.getData();
    this.refreshmap();
  }
  toLocal(date: any) {
    let lang = localStorage.getItem('lang');
    return date.toLocaleDateString(lang, this.options);
  }

  // google maps zoom level
  zoom: number = 8;

  // initial center position for the map
  lat: number = 24.701735728926153;
  lng: number = 46.71405309220546;
  refreshmap() {
    this.lat = 24.701735728926153;
    this.lng = 46.71405309220546;
    this.branchname = '';
    this.show = 0;
    this.empname = '';
    this.jobname = '';
    this.timejoin = '';
    this.timeleave = '';
    this.icon = {
      url: '/assets/user-test.png',
      scaledSize: {
        width: 50,
        height: 50,
      },
    };
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  mapClicked($event: google.maps.MapMouseEvent) {
    console.log($event.latLng);

    // this.markers.push({
    //   lat: $event.latLng,
    //   lng: $event.latLng,
    //   draggable: true,
    // });
  }

  CheckDate(event: any) {
    if (event != null) {
      debugger;
      var from = this._sharedService.date_TO_String(event[0]);
      var to = this._sharedService.date_TO_String(event[1]);
      //this.RefreshData_ByDate(from,to);
      this.data.startDate = from;
      this.data.toDate = to;
      this.getData();
    } else {
      this.data.startDate = '';
      this.data.toDate = '';
      //this.RefreshData();
    }
  }

  mapData: any = {
    name: 'احمد المحمدي',
    position: 'موظف مكتب',
    period: 'تسجيل حضور الفترة الاولي',
    date:
      new Date().getDate() +
      '/' +
      new Date().getMonth() +
      '/' +
      new Date().getFullYear(),
    location: 'الفرع الاول للمؤسسة',
  };
  mapLat = 24.701735728926153;
  mapLan = 46.71405309220546;
  setMapReq: any = false;
  setMap(lat: any, lon: any, img: any, data: any) {
    this.setMapReq = false;
    setTimeout(() => {
      let popupContent: any = `<p>${data?.name}  </p><p> ${data?.position}  </p><p>       ${data?.period} </p><p> ${data?.date}</p><p> ${data?.date2}</p><p><i class="fa-solid fa-location-dot"style = "margin-inline-end: 10px"></i><span>     ${data?.location} </span></p>`;

      this.mapOptions = {
        layers: [
          tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '...',
          }),
          marker([lat, lon], {
            icon: icon({
              iconUrl: img,
            }),
          })
            .bindPopup(popupContent, {
              closeButton: false,
              closeOnClick: false,
              autoPan: true,
              keepInView: true,
            })
            .openPopup(),
        ],
        zoom: 5,
        center: latLng(lat, lon),
      };

      this.setMapReq = true;
    }, 100);
  }

  empname: any;
  jobname: any;
  timejoin: any;
  timeleave: any;
  branchname: any;
  show = 0;
  dateday: any;
  setlocation(data: any) {
    debugger;
    this.show = 1;
    this.lat = data.latitude;
    this.lng = data.longitude;
    this.branchname = data.branchName;
    this.empname = data.fullName;
    this.jobname = data.jobName;
    this.dateday = data.dateDay;
    //this.icon.url=this.environmenturl +data.photoUrl

    this.icon = {
      url: this.environmenturl + data.photoUrl,
      scaledSize: {
        width: 50,
        height: 50,
      },
    };
    var perid = '';
    if (this.data.period == 1) {
      this.timejoin = data.timeJoin1;
      this.timeleave = data.timeLeave1;
      perid = 'الفترة الاولي';
    } else {
      this.timejoin = data.timeJoin2;
      this.timeleave = data.timeLeave2;
      perid = 'الفترة الثانية';
    }

    let mapData: any = {
      name: data.fullName,
      position: data.jobName,
      period: perid,
      date: this.timejoin,
      date2: this.timeleave,
      location: data.branchName,
    };

    this.modalDetails = mapData;
    this.modalDetails.mapLat = this.lat;
    this.modalDetails.mapLan = this.lng;
    this.setMap(
      data.latitude,
      data.longitude,
      this.environmenturl + data.photoUrl,
      mapData
    );
  }

  onMapReady(map: L.Map) {
    let popupContent: any = `<p>${this.modalDetails?.name}  </p><p> ${this.modalDetails?.position}  </p><p>       ${this.modalDetails?.period} </p> <p>${this.modalDetails.date}</p><p>${this.modalDetails.date2}</p><p><i class="fa-solid fa-location-dot"style = "margin-inline-end: 10px"></i><span>     ${this.modalDetails?.location} </span></p>`;
    console.log();
    var popup = L.popup({
      closeButton: false,
      closeOnClick: false,
      autoPan: true,
      keepInView: true,
    })
      .setContent(popupContent)
      .setLatLng([this.modalDetails.mapLat, this.modalDetails.mapLan]);
    map.openPopup(popup);
  }
}
