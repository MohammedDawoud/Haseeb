import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Editor, toHTML } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { Notification } from 'src/app/core/Classes/DomainObjects/notification';
import { AlertService } from 'src/app/core/services/Employees-Services/AlertService';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ProjectarchivesService } from 'src/app/core/services/pro_Services/projectarchives.service';
import { RestApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-general-alert',
  templateUrl: './general-alert.component.html',
  styleUrls: ['./general-alert.component.scss'],
  providers: [DatePipe],
})
export class GeneralAlertComponent implements OnInit {
  editorFirstNotificationSubject: Editor;
  title: any = {
    main: {
      name: {
        ar: 'شؤون الموظفين',
        en: 'Employees Affairs',
      },
      link: '/employees',
    },
    sub: {
      ar: ' ادارة التعاميم',
      en: 'General Alerts',
    },
  };
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  data: any = {
    alerts: new MatTableDataSource([{}]),
  };
  dataSourceTemp: any = [];
  AlertTodelete: any;
  load_Users: any;
  Fill_Depart: any;

  name = null;
  description = null;
  date = null;
  userId = null;
  DepartmentId = null;
  allusers = null;
  done = null;
  currentuser: any = {};

  public NotificationObj: Notification;
  displayedColumns: string[] = [
    'Name',
    'Date',
    'SendUserName',
    'Description',
    'operations',
    'IsRead',
  ];
  constructor(
    private api: RestApiService,
    private modalService: NgbModal,
    private _alertservice: AlertService,
    private toast: ToastrService,
    private _projectarchivesService: ProjectarchivesService,
    private authenticationService: AuthenticationService,
    private datePipe: DatePipe,
    private translate: TranslateService
  ) {
    this.NotificationObj = new Notification();
    this.getData();
    this.fill_User();
    this.fill_Department();
    this.currentuser = this.authenticationService.userGlobalObj;
  }
  ngOnInit(): void {
    this.editorFirstNotificationSubject = new Editor();
  }

  getData() {
    this._alertservice.getAllAlerts().subscribe({
      next: (data: any) => {
        // assign data to table
        debugger;
        console.log(data.result);
        this.data.alerts = new MatTableDataSource(data.result);
        this.dataSourceTemp = data.result;

        this.data.alerts.paginator = this.paginator;
        this.data.alerts.sort = this.sort;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  fill_User() {
    this._projectarchivesService.FillAllUsersSelect().subscribe((data) => {
      console.log(data);
      this.load_Users = data;
    });
  }

  fill_Department() {
    this._alertservice.FillDepartmentSelect().subscribe((data) => {
      console.log(data);
      this.Fill_Depart = data;
    });
  }

  open(content: any, data?: any, type?: any) {
    if (data && type == 'edit') {
      // this.modalDetails = data;
      // this.modalDetails['id'] = 1;
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
  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    const tempsource = this.dataSourceTemp.filter(function (d: any) {
      return (
        d.description?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.name?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.sendUserName?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.date?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    this.data.alerts = new MatTableDataSource(tempsource);
    this.data.alerts.paginator = this.paginator;
    this.data.alerts.sort = this.sort;
  }

  getRow(row: any) {
    debugger;
    this.AlertTodelete = row;
    console.log('row to delete' + row);
  }

  DeleteAlert() {
    this._alertservice
      .DeleteAlert(this.AlertTodelete.notificationId)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.getData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  saveAlert(data: any, modal: any) {
    debugger;
    if (
      data.name == null ||
      data.date == null ||
      data.name == '' ||
      data.date == ''
    ) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }

    if (
      (data.departmentId == null || data.departmentId == '') &&
      (data.userId == null || data.userId == '') &&
      (data.allusers == null || data.allusers == '')
    ) {
      this.toast.error(
        'من فضلك اختر قسم او مستخدم او التعميم علي كل الموظفين ',
        'رسالة'
      );
      return;
    }
    this.NotificationObj.departmentId =
      data.departmentId == null || data.departmentId == ''
        ? null
        : data.departmentId;
    this.NotificationObj.receiveUserId =
      data.userId == null || data.userId == '' ? null : data.userId;
    this.NotificationObj.name = data.name;
    this.NotificationObj.date = this.datePipe.transform(
      data.date,
      'YYYY-MM-dd'
    );
    this.NotificationObj.done =
      data.done == null || data.done == '' ? false : data.done;

    this.NotificationObj.description = toHTML(data.description);
    console.log(toHTML(data.description));

    // data.description.content
    // ? data.description.content[0].content[0].text
    // : data.description;

    this.NotificationObj.type = 2;
    this.NotificationObj.allUsers =
      data.allusers == null || data.allusers == '' ? null : data.allusers;
    this.NotificationObj.notificationId = 0;
    this.NotificationObj.hijriDate = null;

    //console.log("alertdatattosave" +data.name+this.currentuser?.userId)
    var alerts = this.NotificationObj;
    this._alertservice
      .SaveNotification(alerts, this.currentuser?.userId)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.getData();
          this.refreshalert();
          modal.dismiss();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  refreshalert() {
    this.name = null;
    this.description = null;
    this.date = null;
    this.userId = null;
    this.DepartmentId = null;
    this.allusers = null;
    this.done = null;
  }
  ngOnDestroy(): void {
    this.editorFirstNotificationSubject.destroy();
  }
}
