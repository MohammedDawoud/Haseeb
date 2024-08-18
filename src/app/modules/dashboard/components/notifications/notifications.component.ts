import { SelectionModel } from '@angular/cdk/collections';
import { HttpEventType } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
} from 'ng-apexcharts';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { HomeServiceService } from 'src/app/core/services/Dashboard-Services/home-service.service';
import { PhasestaskService } from 'src/app/core/services/pro_Services/phasestask.service';
import { ProjectService } from 'src/app/core/services/pro_Services/project.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {
  @ViewChild(MatPaginator) notifications_paginator!: MatPaginator;
  @ViewChild(MatSort) notifications_sort!: MatSort;
  @ViewChild(MatPaginator) notificationsent_paginator!: MatPaginator;
  @ViewChild(MatSort) notificationsent_sort!: MatSort;
  public chartOptions!: Partial<ChartOptions> | any;
  // public chartOptionsTask!: Partial<ChartOptions> | any;
  title: any = {
    main: {
      name: {
        ar: 'لوحة التحكم',
        en: 'Control Panel',
      },
      link: '/dash/notifications',
    },
    sub: {
      ar: 'الاشعارات',
      en: 'Notifications',
    },
  };

  NotificationOnProject: any = false;

  lang: any;
  notificationdelete: any;
  projectDetails: any;
  // = {
  //   projectNo: 'zxvzxv',
  //   customer: 'fefwqf',
  //   projectType: 'fefwqf',
  //   projectName: 'fefwqf',
  //   subProjectType: 'fefwqf',
  //   stage: 'fefwqf',
  //   subStage: 'fefwqf',
  //   user: 'fefwqf',
  //   Region: 'fefwqf',
  //   contractNumber: 'fefwqf',
  //   projectDuration: 'fefwqf',
  //   status: 2,
  //   progress: 50,
  // };
  data: any = {
    notifications: new MatTableDataSource([{}]),
    notificationsent: new MatTableDataSource([{}]),
  };

  pageNumber: any = 0;

  pageNumber2: any = 0;
  notificationsData2: any = [];

  columns: any = {
    notifications: [
      'select',
      'SendUserName',
      'Description',
      'Date',
      // 'ProjectNo',
      'operations',
    ],
    notificationsent: [
      'select',
      'Description',
      'ReceivedUserName',
      'Date',
      'IsRead',
      // 'ProjectNo',
      'operations',
    ],
  };

  notificationmodal: any = {
    uploadedFile: null,
    projectId: null,
    notificationId: null,
    name: null,
    description: null,
    assignedUsersIds: null,
    allUsers: null,
    users: null,
  };

  notificationnt: any;
  constructor(
    private api: RestApiService,
    private modalService: NgbModal,
    private _homeservice: HomeServiceService,
    private toast: ToastrService,
    private _projectService: ProjectService,
    private translate: TranslateService,
    private _phasestaskService: PhasestaskService,
    private _homesernice: HomeServiceService,
    private _sharedService: SharedService
  ) {
    //this.getData();

    api.lang.subscribe((res) => {
      if (res) {
        this.lang = res;
      } else {
        this.lang = 'ar';
      }
    });
  }

  loadData(selectedTabIndex: any): void {
    debugger;
    console.log('event', selectedTabIndex);
    if (selectedTabIndex == 2) {
      this.NotificationsSent2();
    }
    if (selectedTabIndex == 1) {
      this.GetNotificationReceived();
    }
  }
  isRTL = true;
  notificationsData: any = [];
  data_yT: any;
  data_xT: any;
  chartOptionsTask: any;
  ngOnInit(): void {
    this.TaskType = [
      { id: 1, name: { ar: 'ساعة', en: 'Hour' } },
      { id: 2, name: { ar: 'يوم', en: 'Day' } },
    ];
    this.extendedData.selectedTaskType = 1;
    this.extendedData.TimeH = 1;
    this.extendedData.DateFrom = new Date();
    this.GetNotificationReceived();
    // this.NotificationsSent2();
    this.GetAllUsersNotOpenUser();
    this.GetNotificationReceivedcounts();

    this.chartOptions = {
      series: [
        {
          name: 'series1',
          data: [31, 40, 28, 51, 42, 109, 100],
        },
        {
          name: 'series2',
          data: [11, 32, 45, 32, 34, 52, 41],
        },
      ],
      chart: {
        height: 350,
        type: 'area',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      xaxis: {
        type: 'datetime',
        categories: [
          '2018-09-19T00:00:00.000Z',
          '2018-09-19T01:30:00.000Z',
          '2018-09-19T02:30:00.000Z',
          '2018-09-19T03:30:00.000Z',
          '2018-09-19T04:30:00.000Z',
          '2018-09-19T05:30:00.000Z',
          '2018-09-19T06:30:00.000Z',
        ],
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    };

    if (this.isRTL) {
      this.chartOptions.xaxis['categories'].reverse();
    }

    this.chartOptionsTask = {
      series: [
        {
          name: 'series1',
          data: [31, 40, 28, 51, 42, 109, 100],
        },
      ],
      chart: {
        height: 350,
        type: 'area',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      xaxis: {
        type: 'datetime',
        categories: [
          '2018-09-19T00:00:00.000Z',
          '2018-09-19T01:30:00.000Z',
          '2018-09-19T02:30:00.000Z',
          '2018-09-19T03:30:00.000Z',
          '2018-09-19T04:30:00.000Z',
          '2018-09-19T05:30:00.000Z',
          '2018-09-19T06:30:00.000Z',
        ],
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    };

    if (this.isRTL) {
      this.chartOptionsTask.xaxis['categories'].reverse();
    }
  }
  GetNotificationReceived() {
    this._homeservice.GetNotificationReceived().subscribe((data) => {
      debugger;
      console.log(data);
      // this.dataSourceWaitingImprest=data.result;
      this.notificationsData = data.result;
      this.data.notifications = new MatTableDataSource(this.notificationsData);
      this.data.notifications.paginator = this.notifications_paginator;
      this.data.notifications.sort = this.notifications_sort;
    });
  }
  NotificationsSent2() {
    debugger;
    this._homeservice.NotificationsSent2().subscribe((data) => {
      debugger;
      console.log(data);
      this.notificationsData2 = data.result;
      this.data.notificationsent = new MatTableDataSource(
        this.notificationsData2
      );
      this.data.notificationsent.paginator = this.notificationsent_paginator;
      this.data.notificationsent.sort = this.notificationsent_sort;
    });
  }
  usersselect: any;
  GetAllUsersNotOpenUser() {
    this._homeservice.GetAllUsersNotOpenUser().subscribe((data) => {
      debugger;
      console.log(data);
      this.usersselect = data.result;
    });
  }

  Projectselect: any;
  projects: any;
  FillProjectSelectByCustomerIdNotifaction() {
    this._homeservice
      .FillProjectSelectByCustomerIdNotifaction()
      .subscribe((data) => {
        debugger;
        console.log(data);
        this.Projectselect = data;
      });
  }

  ReadNotification(NotId: any) {
    this._homeservice.ReadNotification(NotId).subscribe((result) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.GetNotificationReceivedcounts();
        this._sharedService.callFunc();
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }
  SetNotificationStatus(modal: any) {
    this._homeservice
      .SetNotificationStatus(this.notificationdelete)
      .subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          modal.dismiss();
          this.GetNotificationReceived();
          // this.NotificationsSent2();
          this.GetAllUsersNotOpenUser();
          this.GetNotificationReceivedcounts();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const file: File = input.files[0];
      this.notificationmodal.uploadedFile = file;
    }
  }
  sendNotification() {
    if (
      this.notificationmodal.users == null ||
      this.notificationmodal.description == null
    ) {
      this.toast.error('من فضلك اكمل البيانات', 'رسالة');
      return;
    }
    debugger;
    console.log('data', this.notificationmodal);
    var formData = new FormData();
    var testuser = [];
    formData.append('postedFiles', this.notificationmodal.uploadedFile);
    formData.append('ProjectId', this.notificationmodal.projectId ?? 0);
    formData.append('NotificationId', '0');
    formData.append('Name', 'اشعار');
    formData.append('Description', this.notificationmodal.description);
    //formData.append('AttachmentUrl',  this.notificationmodal.att);
    var index = 0;
    debugger;
    if (this.notificationmodal.users != 0) {
      for (var userId of this.notificationmodal.users) {
        formData.append('AssignedUsersIds[' + index + ']', userId);
        testuser.push(userId);
        index++;
      }
    }
    debugger;
    console.log(testuser);
    const myList: [] = this.notificationmodal.users;
    let containsValue: boolean = myList.some((item) => item === 0);
    //formData.append('AllUsers', containsValue);
    this._homeservice.SaveNotification2(formData).subscribe((result) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }

  unreaded = 0;
  readed = 0;
  GetNotificationReceivedcounts() {
    this._homeservice.GetNotificationReceived().subscribe((data) => {
      this.unreaded = 0;
      this.readed = 0;
      for (var userId of data.result) {
        if (userId.isRead != 1) {
          this.unreaded = this.unreaded + 1;
        } else {
          this.readed = this.readed + 1;
        }
      }
    });
  }

  // getData() {
  //   this.api.get('../../../../../../assets/dropMenu.json').subscribe({
  //     next: (data: any) => {
  //       // assign notifications to table
  //       // this.data.notifications = new MatTableDataSource(data.notifications);
  //       // this.data.notifications.paginator = this.notifications_paginator;
  //       // this.data.notifications.sort = this.notifications_sort;
  //       // assign notifications data to table
  //       this.data.issued = new MatTableDataSource(data.issued);
  //       this.data.issued.paginator = this.issued_paginator;
  //       this.data.issued.sort = this.issued_sort;
  //     },
  //     error: (error) => {
  //       // console.log(error);
  //     },
  //   });
  // }

  projDet: any = {
    settingNoP: null,
    settingNoteP: null,
  };
  GetProSettingDetails(projectId: any) {
    this._projectService.GetProSettingDetails(projectId).subscribe((data) => {
      console.log('GetProSettingDetails');
      console.log(data);
      this.projDet.settingNoP = data.settingNoP;
      this.projDet.settingNoteP = data.settingNoteP;
    });
  }

  GetProjectById(projectId: any) {
    this._projectService.GetProjectById(projectId).subscribe((data) => {
      console.log('projectdata');
      debugger;
      console.log(data);
      this.projectDetails = data.result;
    });
  }
  role: any;
  IsadminTask: any;
  GlobalRowSelectTaskOrLate: any;
  open(content: any, data: any, size: any, positions?: any, role?: any) {
    if (role == 'deletenote') {
      this.notificationdelete = data?.notificationId;
    }
    debugger;
    if (role == 'details') {
      //this.projectDetails = data;
      //this.GetProjectById(data.projectId);
      this.GetProSettingDetails(data.projectId);
      //this.projectDetails['id'] = 1;
    }
    if (role == 'newtaskpopupadmin') {
      this.GetTaskById(data.taskId);
      this.IsadminTask = 1;
    }
    if (role == 'task') {
      this.GlobalRowSelectTaskOrLate = this.TaskData;
      if (size == 'savepercentage') {
        this.TaskData.Obj.execPercentage = this.percentage;
        if (
          this.TaskData.Obj.execPercentage == null ||
          this.TaskData.Obj.execPercentage == '' ||
          this.TaskData.Obj.execPercentage < 0
        ) {
          this.toast.error('ادخل نسبه');
          return;
        }
      }
    }

    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: size,
        centered: !positions ? true : false,
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

  selection = {
    notifications: new SelectionModel<any>(true, []),
    issued: new SelectionModel<any>(true, []),
  };
  /** Whether the number of selected elements matches the total number of  */
  isAllSelected() {
    const numSelected = this.selection.notifications.selected.length;
    const numRows = this.data.notifications.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.notifications.clear();
      return;
    }

    this.selection.notifications.select(...this.data.notifications.data);
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${
      this.selection.notifications.isSelected(row) ? 'deselect' : 'select'
    } row ${row.position + 1}`;
  }

  //
  //notificationsent
  //
  deleteallnot2() {
    debugger;
    console.log(this.selection.issued.selected);
    console.log(this.data.notificationsent.length);

    let not = this.selection.issued.selected.map((t) => t.notificationId);
    if (this.selection.issued.selected.length > 0) {
      this._homeservice.SetNotificationStatus2(not).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.NotificationsSent2();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
    } else {
      this.toast.error('اختر اشعار واحد علي الاقل', 'رسالة');
      return;
    }
  }
  deleteallnot() {
    debugger;
    console.log(this.selection.notifications.selected);
    console.log(this.data.notifications.length);

    let not = this.selection.notifications.selected.map(
      (t) => t.notificationId
    );
    if (this.selection.notifications.selected.length > 0) {
      this._homeservice.SetNotificationStatus2(not).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetNotificationReceived();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
    } else {
      this.toast.error('اختر اشعار واحد علي الاقل', 'رسالة');
      return;
    }
  }

  /** Whether the number of selected elements matches the total number of  */
  isAllSelectedPro() {
    const numSelected = this.selection.issued.selected.length;
    const numRows = this.data.issued; //.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRowsPro() {
    if (this.isAllSelectedPro()) {
      this.selection.issued.clear();
      return;
    }

    this.selection.issued.select(...this.data.issued.data);
  }
  /** The label for the checkbox on the passed row */
  checkboxLabelPro(row?: any): string {
    if (!row) {
      return `${this.isAllSelectedPro() ? 'deselect' : 'select'} all`;
    }
    return `${
      this.selection.issued.isSelected(row) ? 'deselect' : 'select'
    } row ${row.position + 1}`;
  }

  setNotificationOnProject(event: any) {
    this.NotificationOnProject = event?.checked;
    this.FillProjectSelectByCustomerIdNotifaction();
  }

  showOptions: boolean = false;
  showAction(element: any) {
    debugger;
    let item: any = this.data?.notifications?.filteredData?.find(
      (not: any) => not?.NotificationId == element?.NotificationId
    );

    // item['showOptions'] = true;

    this.showOptions = true;
    this.ReadNotification(element?.notificationId);
    element.isRead = 1;
  }

  onPageChange(event: any) {
    this.pageNumber = event.pageIndex;

    console.log(this.pageNumber * 10, (this.pageNumber + 1) * 10);

    this.data.notifications = new MatTableDataSource(
      this.notificationsData.slice(
        this.pageNumber * 10,
        (this.pageNumber + 1) * 10
      )
    );
  }

  onPageChange2(event: any) {
    this.pageNumber2 = event.pageIndex;

    console.log(this.pageNumber2 * 10, (this.pageNumber2 + 1) * 10);

    this.data.notificationsent = new MatTableDataSource(
      this.notificationsData2.slice(
        this.pageNumber2 * 10,
        (this.pageNumber2 + 1) * 10
      )
    );
  }

  downloadFile(data: any) {
    var link = environment.PhotoURL + data.attachmentUrl;
    window.open(link, '_blank');
  }
  ///////////////////////////////////////////#region end Tasks///////////////////////////////////////////////////////////////////
  TaskData: any = {
    selected: false,
    Obj: null,
    TaskTimeFrom_Merge: null,
    TaskTimeTo_Merge: null,
    priorty: null,
    goalcheck: false,
    goalname: null,
    notesStrVac:null,
  };

  arrSeries: any = [0, 0];
  TaskType: any;

  extendedData: any = {
    selectedTaskType: null,
    DateFrom: null,
    DateTo: null,
    TimeH: null,
  };

  selectedTaskType: any;
  nodeDataArray = [];
  linkDataArray = [];

  TaskDataLate: any = {
    selected: false,
    Obj: null,
    TaskTimeFrom_Merge: null,
    TaskTimeTo_Merge: null,
    priorty: null,
    goalcheck: false,
    goalname: null,
  };
  selectTask(task: any) {
    debugger;
    if (task != null) {
      this.TaskData.selected = true;
      this.GetTaskListtxt(parseInt(task.taskId));
      this.GetProjectRequirementByTaskId_Count(parseInt(task.taskId));
      //       if(task.isNew==1){
      // this.UpdateIsNew(task.isNew);
      //       }
    } else {
      this.TaskData.selected = false;
    }
  }

  phasePriValue: any = '1';
  phasePriValueTemp: any = '1';
  taskLongDesc: any = '';
  taskLongDescTemp: any = '';

  phasePriValueLate: any = '1';
  phasePriValueTempLate: any = '1';
  taskLongDescLate: any = '';
  taskLongDescTempLate: any = '';

  GetTaskListtxt(phaseid: any) {
    debugger;
    this._phasestaskService.GetTaskListtxt(phaseid).subscribe((data) => {
      this.TaskData.Obj = data.result;

      if (data.result.taskTimeFrom == '' || data.result.taskTimeTo == '') {
        this.TaskData.TaskTimeFrom_Merge = data.result.taskStart;
        this.TaskData.TaskTimeTo_Merge = data.result.endDateCalc;
      } else {
        this.TaskData.TaskTimeFrom_Merge = JSON.stringify(
          data.result.taskStart + ' - ' + data.result.taskTimeFrom
        );
        this.TaskData.TaskTimeTo_Merge = JSON.stringify(
          data.result.endDateCalc + ' - ' + data.result.taskTimeTo
        );
      }
      var priorty = 'بدون';
      if (data.result.phasePriority == 1) {
        priorty = 'منخفض';
      } else if (data.result.phasePriority == 2) {
        priorty = 'متوسط';
      } else if (data.result.phasePriority == 3) {
        priorty = 'مرتفع';
      } else if (data.result.phasePriority == 4) {
        priorty = 'عاجل';
      } else {
        priorty = 'بدون';
      }
      this.TaskData.priorty = priorty;
      this.TaskData.notesStrVac=null;
      if(this.TaskData.Obj.numAdded>0 && this.TaskData.Obj.timeType==2)
      {
        var str1="";
        if(this.TaskData.Obj.timeType==1){str1=this.TaskData.Obj.timeMinutes + " ساعة ";}
        else{str1=this.TaskData.Obj.timeMinutes + " يوم ";}
        var str2=(this.TaskData.Obj.numAdded).toString();
        var str3=(this.TaskData.Obj.numAdded+this.TaskData.Obj.timeMinutes).toString();;
        const combined = `${" المهمة مدتها "}${str1}${" وبينهم "}${str2}${" يوم أجازة أصبحت "}${str3}${" يوم "}`;
        this.TaskData.notesStrVac = combined;
      }
      this.phasePriValue = String(data.result.phasePriority);
      this.phasePriValueTemp = this.phasePriValue;
      this.taskLongDesc = data.result.taskLongDesc;
      this.taskLongDescTemp = this.taskLongDesc;
      // pstatus
      // console\.log("---------------");
      // console\.log(this.TaskData.Obj);
      // console\.log(this.TaskData.Obj.isRetrieved);
      // console\.log(this.TaskData.Obj.isConverted);
      // console\.log(this.TaskData.Obj.plusTime);

      this.GetValueChartTask(data.result);
      var perc = this.TaskChartData.TaskValueChart;
      var arr = [perc, this.TaskChartData.TaskValueChart - perc];
      this.arrSeries = arr;

      this.chartOptions = {
        series: this.arrSeries,
        chart: {
          type: 'donut',
        },
        labels: ['النسبة', 'المتبقي'],
        legend: null,

        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 150,
              },
            },
          },
        ],
      };
    });
  }
  TaskChartData: any = {
    TaskValueChart: 0,
    TaskValueCharttxt: null,
    LateTaskValueChart: 0,
    LateTaskValueCharttxt: null,
  };

  GetValueChartTask(data: any) {
    debugger;
    var tsktime = 0;
    var parvalue = 0;
    if (data.remaining <= 0) {
      this.TaskChartData.TaskValueChart = 100;
      this.TaskChartData.TaskValueCharttxt = 'متاخرة';
    } else if (data.remaining > 0) {
      if (data.timeType == 1) {
        tsktime = data.timeMinutes * 60;
      } else if (data.timeType == 2) {
        tsktime = data.timeMinutes * 24 * 60;
      }
      var remn = ((data.remaining / tsktime) * 100) / 100;
      var parvalue = 1 - remn;
      parvalue = parseInt((parvalue * 100).toString());
      this.TaskChartData.TaskValueChart = parvalue;
    } else {
      this.TaskChartData.TaskValueChart = 0;
    }
  }

  taskfileexists: false;
  TaskFilesCount: any;
  TaskFiles: any;
  GetProjectRequirementByTaskId_Count(TaskID: any) {
    this._homesernice
      .GetProjectRequirementByTaskId_Count(TaskID)
      .subscribe((data) => {
        // console\.log('filescount',data);
        this.TaskFilesCount = parseInt(data);
      });
  }

  percentage: any;
  promanager: any;
  selectedTask: any;

  GetTaskById(TaskId: any) {
    this._homesernice.GetTaskById(TaskId).subscribe((data) => {
      debugger;
      // console\.log(data.result);
      this.selectedTask = data.result;
      this.percentage = data.result?.execPercentage ?? 0;
      this.GetUserById(data.result.projectManagerId);
    });
  }

  GetUserById(UserId: any) {
    this._homesernice.GetUserById(UserId).subscribe((data) => {
      debugger;
      // console\.log(data.result);
      this.promanager = data.result;
    });
  }

  taskmodal: any;
  setpopup(modal: any) {
    this.taskmodal = modal;
  }

  isdisabled = 0;
  disablesavingpercentage() {
    this.isdisabled = 1;
  }
  GetAllProjectRequirementByTaskId(taskdata: any) {
    debugger;
    this._homesernice
      .GetAllProjectRequirementByTaskId(taskdata.phaseTaskId)
      .subscribe((data) => {
        // console\.log('filescount',data);
        this.TaskFiles = data;
      });
  }

  load_UsersSelectConvert: any;
  UsersSelectConvert: any = null;

  Fillcustomerhavingoffer() {
    this._phasestaskService.FillUsersSelect(0).subscribe((data) => {
      this.load_UsersSelectConvert = data;
    });
  }
  ShowImgAdded() {
    var img = environment.PhotoURL + this.TaskData.Obj?.addedTaskImg;
    return img;
  }
  ShowImgManager() {
    var img = environment.PhotoURL + this.TaskData.Obj?.projectManagerImg;
    return img;
  }


  FinishTaskCheck(modal: any) {
    this._phasestaskService.FinishTaskCheck(modal).subscribe((result: any) => {});
  }
  confirm_endtask(modal: any) {
    debugger;
    var PlayTaskObj: any = {};
    PlayTaskObj.PhaseTaskId = this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId;
    PlayTaskObj.Status = 4;
    PlayTaskObj.ExecPercentage = 100;
    this._phasestaskService.FinishTask(PlayTaskObj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.FinishTaskCheck(PlayTaskObj);
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        // this.refreshData();
        modal.dismiss();
        this.taskmodal.dismiss();
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }
  confirm_playandstoptask(type: number, modal: any) {
    var PlayTaskObj: any = {};
    PlayTaskObj.PhaseTaskId = this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId;
    PlayTaskObj.Status = type;
    this._phasestaskService
      .PlayPauseTask(PlayTaskObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          // this.refreshData();

          modal.dismiss();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  TimeHChange() {
    if (this.extendedData.TimeH > 24) {
      this.extendedData.TimeH = 24;
    } else if (this.extendedData.TimeH < 1) {
      this.extendedData.TimeH = 1;
    }
  }
  confirm_changeTaskTime() {
    debugger;
    if (
      this.extendedData.DateTo == null &&
      this.extendedData.selectedTaskType == 2
    ) {
      this.toast.error('اختر تاريخ نهاية', 'رسالة');
      return;
    }
    var PlusTimeTaskObj: any = {};
    PlusTimeTaskObj.PhaseTaskId =
      this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId;
    if (this.extendedData.selectedTaskType == 1) {
      PlusTimeTaskObj.TimeMinutes = this.extendedData.TimeH;
    } else {
      PlusTimeTaskObj.TimeMinutes = this.GetTimeMinutestxt(
        this.extendedData.DateFrom,
        this.extendedData.DateTo
      );
      PlusTimeTaskObj.EndDate = this._sharedService.date_TO_String(
        this.extendedData.DateTo
      );
    }
    PlusTimeTaskObj.Cost = 0;
    PlusTimeTaskObj.TimeType = this.extendedData.selectedTaskType;
    this._phasestaskService
      .ChangeTaskTime(PlusTimeTaskObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          // this.refreshData();
          this.GetTaskById(this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId);
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  GetTimeMinutestxt(date1: any, date2: any) {
    var diff = Math.abs(date1.getTime() - date2.getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    return diffDays + 1;
  }
  confirm_converttask() {
    if (this.UsersSelectConvert == null) {
      this.toast.error('أختر مستخدم', 'رسالة');
      return;
    }
    var ConvertTaskObj: any = {};
    ConvertTaskObj.PhaseTaskId = this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId;
    ConvertTaskObj.UserId = this.UsersSelectConvert;
    this._phasestaskService
      .ConvertTask(ConvertTaskObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          // this.refreshData();

          this.GetTaskById(this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId);
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );

  public readonly controlTask = new FileUploadControl(
    {
      listVisible: true,
      // accept: ['image/*'],
      discardInvalid: true,
      multiple: false,
    },
    [
      // FileUploadValidators.accept(['image/*']),
      FileUploadValidators.filesLimit(1),
    ]
  );
  public readonly uploadedFileTask: BehaviorSubject<string> =
    new BehaviorSubject('');

  progress = 0;
  uploading = false;
  disableButtonSave_File = false;

  resetprog() {
    this.disableButtonSave_File = false;
    this.progress = 0;
    this.uploading = false;
  }

  confirm_SaveFiles(modal: any) {
    debugger;
    if (this.controlTask?.value.length > 0) {
      // console\.log(this.controlTask?.value[0]);
      const formData: FormData = new FormData();
      formData.append('uploadesgiles', this.controlTask?.value[0]);
      formData.append('RequirementId', String(0));
      formData.append('PageInsert', '1');
      formData.append(
        'PhasesTaskID',
        this.GlobalRowSelectTaskOrLate?.Obj?.phaseTaskId ?? 0
      );
      formData.append('OrderId', '0');
      setTimeout(() => {
        this.resetprog();
      }, 60000);
      this.progress = 0;
      this.disableButtonSave_File = true;
      this.uploading = true;

      this._phasestaskService
        .SaveProjectRequirement4(formData)
        .subscribe((result: any) => {
          if (result.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * result.loaded) / result.total);
          }

          if (result?.body?.statusCode == 200) {
            this.controlTask.removeFile(this.controlTask?.value[0]);
            this.toast.success(
              this.translate.instant(
                this.translate.instant(result?.body?.reasonPhrase)
              ),
              this.translate.instant('Message')
            );
            modal.dismiss();
            this.resetprog();
          } else if (result?.type >= 0) {
          } else {
            this.toast.error(
              this.translate.instant(result?.body?.reasonPhrase),
              this.translate.instant('Message')
            );
            this.resetprog();
          }
        });
    }
  }

  private getImage(file: File): void {
    if (FileReader && file) {
      const fr = new FileReader();
      fr.onload = (e: any) => this.uploadedFile.next(e.target.result);
      fr.readAsDataURL(file);
    } else {
      this.uploadedFile.next('');
    }
  }

  latitude: any = 24.72030293127678;
  longitude: any = 46.698462762671475;
  mapReady: boolean = false;
  zoom!: number;
  address!: string;
  private geoCoder: any;

  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 16;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }
  onMapReady(map?: google.maps.Map) {
    if (map) {
      map.setOptions({
        streetViewControl: false,
        fullscreenControl: false,
      });
      google.maps.event.addListener(map, 'click', (event) => {
        this.setLocation(event.latLng.lat(), event.latLng.lng());
      });
    }
  }
  setLocation(lat: any, lng: any) {
    this.latitude = lat;
    this.longitude = lng;

    // console.log(this.latitude, this.longitude);

    this.getAddress(lat, lng);
  }

  markerDragEnd(event: any) {
    this.latitude = event.latLng.lat();
    this.longitude = event.latLng.lng();

    // console.log(this.latitude, this.longitude);

    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude: any, longitude: any) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.geoCoder?.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results: any, status: any) => {
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 16;
            this.address = results[1].formatted_address;
            // console.log(this.address);
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }

  finishTask(modal: any) {
    var PlayTaskObj: any = {};

    PlayTaskObj.ExecPercentage =
      this.GlobalRowSelectTaskOrLate.Obj.execPercentage;
    PlayTaskObj.Status = this.GlobalRowSelectTaskOrLate.Obj.status;
    PlayTaskObj.PhaseTaskId = this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId;
    this._phasestaskService.FinishTask(PlayTaskObj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.FinishTaskCheck(PlayTaskObj);
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        // this.refreshData();
        modal.dismiss();
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }
  //#endregion
}
