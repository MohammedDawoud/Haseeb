import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NodeItem, TreeCallbacks, TreeMode } from 'tree-ngx';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent,
} from 'ng-apexcharts';
import { ProjectstatusService } from 'src/app/core/services/pro_Services/projectstatus.service';
import { PhasestaskService } from 'src/app/core/services/pro_Services/phasestask.service';
import { ProjectsettingService } from 'src/app/core/services/pro_Services/projectsetting.service';
import { ProjectService } from 'src/app/core/services/pro_Services/project.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { WorkordersService } from 'src/app/core/services/pro_Services/workorders.service';
import { HomeServiceService } from 'src/app/core/services/Dashboard-Services/home-service.service';
import { HttpEventType } from '@angular/common/http';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: any;
  public chartOptionsLate!: any;

  title: any = {
    main: {
      name: {
        ar: 'لوحة التحكم',
        en: 'Control Panel',
      },
      link: '/dash/tasks',
    },
    sub: {
      ar: 'المهام',
      en: 'Tasks',
    },
  };
  closeResult: any;
  selectedItems: any;
  selectedTask1: any;
  selectedTask2: any;
  stratDate = new Date();
  endDate = new Date();
  expected_project_duration = new Date();
  expected_end_date = new Date();
  items = [
    {
      assignedTo: 'محمد هلهل	',
      ProjectNumber: '2022-63	',
      CustomerName: 'احمد',
      taskStatus: 'منخفض',
    },
  ];
  nodeItems: any;
  users: any;
  selectedUser: any;
  isEditable: any = {};
  rows = [
    { id: 1, name_ar: 'اسم النشاط 1', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط 2', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط 3', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
  ];
  temp: any = [
    { id: 1, name_ar: 'اسم النشاط 1', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط 2', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط 3', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
  ];
  constructor(
    private modalService: NgbModal,
    private _workordersService: WorkordersService,
    private _homesernice: HomeServiceService,
    private _projectstatusService: ProjectstatusService,
    private _phasestaskService: PhasestaskService,
    private _projectsettingService: ProjectsettingService,
    private _projectService: ProjectService,
    private authenticationService: AuthenticationService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private translate: TranslateService
  ) {}

  private getDismissReason(reason: any, type?: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  // upload img ]
  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );
  public readonly control = new FileUploadControl(
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
  open(content: any, type?: any) {
    debugger;
    if (type == 'task') {
      this.GlobalRowSelectTaskOrLate = this.TaskData;
    }
    if (type == 'savepercentage') {
      this.GlobalRowSelectTaskOrLate = this.TaskData;
      this.TaskData.Obj.execPercentage = this.percentage;
      if (
        this.TaskData.Obj.execPercentage == null ||
        this.TaskData.Obj.execPercentage == '' ||
        this.TaskData.Obj.execPercentage < 0
      ) {
        this.toast.error('ادخل نسبه');
        return;
      }
    } else if (type == 'latetask') {
      //ht8yr l tht de l late
      this.GlobalRowSelectTaskOrLate = this.TaskDataLate;
    } else if (type == 'ConvertVac') {
      this.FillUsersTasksVacationSelect();
      this.FillConverVacUser();
    } else if (type == 'Converttouser') {
      this.FillConvertAllUser();
    }

    // else if(type=="projectgoalAddTask")
    // {
    //   this.ChangeGoal();
    //   if(this.AddTaskData.taskgoal==false)
    //   {
    //     return;
    //   }
    // }
    else if (type == 'projectgoal') {
      this.ChangeGoal();
      if (this.TaskData.taskgoal == false) {
        return;
      }
    } else if (type == 'projectgoalLate') {
      this.ChangeGoalLate();
      if (this.TaskDataLate.taskgoal == false) {
        return;
      }
    }
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type == 'AddOption' || type == 'infoAction' ? 'md' : 'xl',
        centered: true,
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  ngOnInit(): void {
    this.GetTasksByUserIdUser(0);
    this.GetWorkOrdersByUserId();
    this.GetDay_Tasks();
    this.GetWeek_Tasks();
    this.GetMonth_Tasks();
    this.GetDay_Orders();
    this.GetWeek_Orders();
    this.GetMonth_Orders();
    this.nodeItems = [
      {
        id: '0',
        name: 'Heros',
        children: [
          {
            id: '1',
            name: 'Batman',
            item: {
              phrase: 'I am the batman',
            },
          },
          {
            id: '2',
            name: 'Superman',
            item: {
              phrase: 'Man of steel',
            },
          },
        ],
      },
      {
        id: '3',
        name: 'Villains',
        children: [
          {
            id: '4',
            name: 'Joker',
            item: {
              phrase: 'Why so serius',
            },
          },
          {
            id: '5',
            name: 'Lex luthor',
            item: {
              phrase: 'I am the villain of this story',
            },
          },
        ],
      },
      {
        id: '0',
        name: 'Heros',
        children: [
          {
            id: '1',
            name: 'Batman',
            item: {
              phrase: 'I am the batman',
            },
          },
          {
            id: '2',
            name: 'Superman',
            item: {
              phrase: 'Man of steel',
            },
          },
        ],
      },
      {
        id: '3',
        name: 'Villains',
        children: [
          {
            id: '4',
            name: 'Joker',
            item: {
              phrase: 'Why so serius',
            },
          },
          {
            id: '5',
            name: 'Lex luthor',
            item: {
              phrase: 'I am the villain of this story',
            },
          },
        ],
      },
      {
        id: '0',
        name: 'Heros',
        children: [
          {
            id: '1',
            name: 'Batman',
            item: {
              phrase: 'I am the batman',
            },
          },
          {
            id: '2',
            name: 'Superman',
            item: {
              phrase: 'Man of steel',
            },
          },
        ],
      },
      {
        id: '3',
        name: 'Villains',
        children: [
          {
            id: '4',
            name: 'Joker',
            item: {
              phrase: 'Why so serius',
            },
          },
          {
            id: '5',
            name: 'Lex luthor',
            item: {
              phrase: 'I am the villain of this story',
            },
          },
        ],
      },
      {
        id: '0',
        name: 'Heros',
        children: [
          {
            id: '1',
            name: 'Batman',
            item: {
              phrase: 'I am the batman',
            },
          },
          {
            id: '2',
            name: 'Superman',
            item: {
              phrase: 'Man of steel',
            },
          },
        ],
      },
      {
        id: '3',
        name: 'Villains',
        children: [
          {
            id: '4',
            name: 'Joker',
            item: {
              phrase: 'Why so serius',
            },
          },
          {
            id: '5',
            name: 'Lex luthor',
            item: {
              phrase: 'I am the villain of this story',
            },
          },
        ],
      },
      {
        id: '0',
        name: 'Heros',
        children: [
          {
            id: '1',
            name: 'Batman',
            item: {
              phrase: 'I am the batman',
            },
          },
          {
            id: '2',
            name: 'Superman',
            item: {
              phrase: 'Man of steel',
            },
          },
        ],
      },
      {
        id: '3',
        name: 'Villains',
        children: [
          {
            id: '4',
            name: 'Joker',
            item: {
              phrase: 'Why so serius',
            },
          },
          {
            id: '5',
            name: 'Lex luthor',
            item: {
              phrase: 'I am the villain of this story',
            },
          },
        ],
      },
      {
        id: '0',
        name: 'Heros',
        children: [
          {
            id: '1',
            name: 'Batman',
            item: {
              phrase: 'I am the batman',
            },
          },
          {
            id: '2',
            name: 'Superman',
            item: {
              phrase: 'Man of steel',
            },
          },
        ],
      },
      {
        id: '3',
        name: 'Villains',
        children: [
          {
            id: '4',
            name: 'Joker',
            item: {
              phrase: 'Why so serius',
            },
          },
          {
            id: '5',
            name: 'Lex luthor',
            item: {
              phrase: 'I am the villain of this story',
            },
          },
        ],
      },
      {
        id: '0',
        name: 'Heros',
        children: [
          {
            id: '1',
            name: 'Batman',
            item: {
              phrase: 'I am the batman',
            },
          },
          {
            id: '2',
            name: 'Superman',
            item: {
              phrase: 'Man of steel',
            },
          },
        ],
      },
      {
        id: '3',
        name: 'Villains',
        children: [
          {
            id: '4',
            name: 'Joker',
            item: {
              phrase: 'Why so serius',
            },
          },
          {
            id: '5',
            name: 'Lex luthor',
            item: {
              phrase: 'I am the villain of this story',
            },
          },
        ],
      },
    ];

    this.users = [
      { id: 1, Name: 'محمود نافع' },
      { id: 2, Name: 'محمود نافع' },
      { id: 3, Name: 'محمود نافع' },
      { id: 4, Name: 'محمود نافع' },
      { id: 5, Name: 'محمود نافع' },
      { id: 6, Name: 'محمود نافع' },
      { id: 7, Name: 'محمود نافع' },
      { id: 8, Name: 'محمود نافع' },
      { id: 9, Name: 'محمود نافع' },
      { id: 10, Name: 'محمود نافع' },
      { id: 11, Name: 'محمود نافع' },
    ];
    this.TaskType = [
      { id: 1, name: { ar: 'ساعة', en: 'Hour' } },
      { id: 2, name: { ar: 'يوم', en: 'Day' } },
    ];
    this.extendedData.selectedTaskType = 1;
    this.extendedData.TimeH = 1;
    this.extendedData.DateFrom = new Date();
    this.chartOptions = {
      series: [44],
      chart: {
        type: 'donut',
      },
      labels: null,
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

    this.chartOptionsLate = {
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
  }
  formatDate(date: any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////

  TasksList: any;
  GetTasksByUserIdUser(status: any) {
    this._phasestaskService
      .GetTasksByUserIdUser(status)
      .subscribe((result: any) => {
        this.TasksList = result.result;
      });
  }

  TasksDayWeekMonthclick(flag: any) {
    if (flag == 1) {
      this._phasestaskService
        .GetTasksFilterationByUserId(1)
        .subscribe((result: any) => {
          debugger;
          this.TasksList = result.result;
        });
    } else if (flag == 2) {
      var curr = new Date();
      var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
      var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));
      var startdate = this.formatDate(firstday);
      var endate = this.formatDate(lastday);
      this._phasestaskService
        .GetTasksFilterationByUserId2(2, startdate, endate)
        .subscribe((result: any) => {
          debugger;

          this.TasksList = result.result;
        });
    } else {
      this._phasestaskService
        .GetTasksFilterationByUserId(3)
        .subscribe((result: any) => {
          this.TasksList = result.result;
        });
    }
  }

  TaskDay: any;
  GetDay_Tasks() {
    this._phasestaskService
      .GetDayWeekMonth_Tasks(1)
      .subscribe((result: any) => {
        this.TaskDay = result;
      });
  }

  Taskmonth: any;

  GetWeek_Tasks() {
    var curr = new Date();
    var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
    var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));
    var startdate = this.formatDate(firstday);
    var endate = this.formatDate(lastday);
    this._phasestaskService
      .GetDayWeekMonth_Tasks2(1, startdate, endate)
      .subscribe((result: any) => {
        this.Taskmonth = result;
      });
  }

  TaskMonth: any;
  GetMonth_Tasks() {
    this._phasestaskService
      .GetDayWeekMonth_Tasks(3)
      .subscribe((result: any) => {
        this.TaskMonth = result;
      });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  WorkOrderList: any;
  GetWorkOrdersByUserId() {
    this._phasestaskService.GetWorkOrdersByUserId().subscribe((result: any) => {
      this.WorkOrderList = result.result;
      console.log('worder', this.WorkOrderList);
    });
  }

  OrdersDayWeekMonthclick(flag: any) {
    if (flag == 1) {
      this._phasestaskService
        .GetWorkOrdersFilterationByUserId(1)
        .subscribe((result: any) => {
          this.WorkOrderList = result.result;
          console.log('worder', this.WorkOrderList);
        });
    } else if (flag == 2) {
      var curr = new Date();
      var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
      var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));
      var startdate = this.formatDate(firstday);
      var endate = this.formatDate(lastday);
      this._phasestaskService
        .GetWorkOrdersFilterationByUserId2(2, startdate, endate)
        .subscribe((result: any) => {
          this.WorkOrderList = result.result;
          console.log('worder', this.WorkOrderList);
        });
    } else {
      this._phasestaskService
        .GetWorkOrdersFilterationByUserId(3)
        .subscribe((result: any) => {
          this.WorkOrderList = result.result;
          console.log('worder', this.WorkOrderList);
        });
    }
  }

  OrdersDay: any;
  GetDay_Orders() {
    this._phasestaskService
      .GetDayWeekMonth_Orders(1)
      .subscribe((result: any) => {
        debugger;
        this.OrdersDay = result;
      });
  }

  Ordermonth: any;

  GetWeek_Orders() {
    var curr = new Date();
    var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
    var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));
    var startdate = this.formatDate(firstday);
    var endate = this.formatDate(lastday);
    this._phasestaskService
      .GetDayWeekMonth_Orders2(1, startdate, endate)
      .subscribe((result: any) => {
        debugger;
        this.Ordermonth = result;
      });
  }

  OrderMonth: any;
  GetMonth_Orders() {
    this._phasestaskService
      .GetDayWeekMonth_Orders(3)
      .subscribe((result: any) => {
        this.OrderMonth = result;
      });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////

  //------------------------------------------DataTask----------------------------------------------
  //#region

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
  TaskDataLate: any = {
    selected: false,
    Obj: null,
    TaskTimeFrom_Merge: null,
    TaskTimeTo_Merge: null,
    priorty: null,
    goalcheck: false,
    goalname: null,
    notesStrVac:null,
  };
  OrderData: any = {
    selected: false,
    Obj: null,
    percentComplete:null,
    required:null,
  };

  orderfileexists: false;
  OrderFilesCount: any;
  OrderFiles: any;
  GetProjectRequirementByOrderId_Count(OrderId: any) {
    this._homesernice
      .GetProjectRequirementByOrderId_Count(OrderId)
      .subscribe((data) => {
        // console\.log('Ofilescount',data);
        this.OrderFilesCount = parseInt(data);
      });
  }

  GetAllProjectRequirementByOrderId(orderdata: any) {
    this._homesernice
      .GetAllProjectRequirementByOrderId(orderdata.workOrderId)
      .subscribe((data) => {
        // console\.log('order files',data);
        this.OrderFiles = data;
      });
  }


  selectOrder(order: any) {
    debugger;
    if (order != null) {
      this.OrderData.selected = true;
      this.GetOrderListtxt(parseInt(order.workOrderId));
      this.GetProjectRequirementByOrderId_Count(parseInt(order.workOrderId));
    } else {
      this.OrderData.selected = false;
    }
  }
  downloadFileWorkOrder(data: any) {
    try
    {
      debugger
      var link=environment.PhotoURL+data.attatchmentUrl;
      window.open(link, '_blank');
    }
    catch (error)
    {
      this.toast.error("تأكد من الملف", 'رسالة');
    }
  }

  downloadFile(data: any) {
    var link = environment.PhotoURL + data;
    window.open(link, '_blank');
  }

  GetOrderListtxt(phaseid: any) {
    debugger;
    this._phasestaskService
      .GetWorkOrdersByUserIdandtask(phaseid)
      .subscribe((data) => {
        debugger;
        // console.log(data.result[0]);
        this.OrderData.Obj = data.result[0];
        this.OrderData.percentComplete = data.result[0]?.percentComplete;
        this.OrderData.required = data.result[0]?.required;
        // console.log('this.OrderData.Obj');
        // console.log(this.OrderData.Obj);

        debugger;
      });
  }

  FinishOrder() {
    debugger;
    var PlayTaskObj: any = {};
    PlayTaskObj.WorkOrderId = this.OrderData.Obj.workOrderId;
    PlayTaskObj.OrderNo = this.OrderData.Obj.orderNo;
    PlayTaskObj.WOStatus = 3;
    PlayTaskObj.PercentComplete = 100;
    PlayTaskObj.WOStatustxt = 'منتهية';

    this._phasestaskService
      .FinishOrder(PlayTaskObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetWorkOrdersByUserId();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  SavePercentage() {
    debugger;
    var PlayTaskObj: any = {};
    if (parseInt(this.OrderData.percentComplete) == 100) {
      PlayTaskObj.WorkOrderId = this.OrderData.Obj.workOrderId;
      PlayTaskObj.OrderNo = this.OrderData.Obj.orderNo;
      PlayTaskObj.WOStatus = 3;
      PlayTaskObj.PercentComplete = 100;
      PlayTaskObj.WOStatustxt = 'منتهية';
    } else {
      PlayTaskObj.WorkOrderId = this.OrderData.Obj.workOrderId;
      PlayTaskObj.OrderNo = this.OrderData.Obj.orderNo;
      PlayTaskObj.PercentComplete = parseInt(
        this.OrderData.percentComplete
      );
      PlayTaskObj.WOStatus = parseInt(
        this.OrderData.Obj.wOStatus
      );
    }

    this._phasestaskService
      .FinishOrder(PlayTaskObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant("تم الحفظ"),
            this.translate.instant('Message')
          );
          this.GetWorkOrdersByUserId();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  selectTask(task: any) {
    debugger;
    if (task != null) {
      this.TaskData.selected = true;
      this.GetTaskListtxt(parseInt(task.phaseTaskId));
    } else {
      this.TaskData.selected = false;
    }
  }
  selectTask_Late() {
    debugger;
    if (this.selectedTask2[0] != null) {
      this.TaskDataLate.selected = true;
      this.GetTaskListtxt_Late(parseInt(this.selectedTask2[0].phaseid));
    } else {
      this.TaskDataLate.selected = false;
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
  percentage: any;

  GetTaskListtxt(phaseid: any) {
    debugger;
    this._phasestaskService.GetTaskListtxt(phaseid).subscribe((data) => {
      console.log(data.result);
      this.TaskData.Obj = data.result;
      console.log('this.TaskData.Obj');
      console.log(this.TaskData.Obj);
      this.percentage = data.result?.execPercentage ?? 0;

      debugger;
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
  GetTaskListtxt_Late(phaseid: any) {
    this._phasestaskService.GetTaskListtxt(phaseid).subscribe((data) => {
      console.log(data.result);
      this.TaskDataLate.Obj = data.result;
      console.log('this.TaskDataLate.Obj');
      console.log(this.TaskDataLate.Obj);

      debugger;
      if (data.result.taskTimeFrom == '' || data.result.taskTimeTo == '') {
        this.TaskDataLate.TaskTimeFrom_Merge = data.result.taskStart;
        this.TaskDataLate.TaskTimeTo_Merge = data.result.endDateCalc;
      } else {
        this.TaskDataLate.TaskTimeFrom_Merge = JSON.stringify(
          data.result.taskStart + ' - ' + data.result.taskTimeFrom
        );
        this.TaskDataLate.TaskTimeTo_Merge = JSON.stringify(
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
      this.TaskDataLate.priorty = priorty;
      this.TaskDataLate.notesStrVac=null;
      if(this.TaskDataLate.Obj.numAdded>0 && this.TaskDataLate.Obj.timeType==2)
      {
        var str1="";
        if(this.TaskDataLate.Obj.timeType==1){str1=this.TaskDataLate.Obj.timeMinutes + " ساعة ";}
        else{str1=this.TaskDataLate.Obj.timeMinutes + " يوم ";}
        var str2=(this.TaskDataLate.Obj.numAdded).toString();
        var str3=(this.TaskDataLate.Obj.numAdded+this.TaskDataLate.Obj.timeMinutes).toString();;
        const combined = `${" المهمة مدتها "}${str1}${" وبينهم "}${str2}${" يوم أجازة أصبحت "}${str3}${" يوم "}`;
        this.TaskDataLate.notesStrVac = combined;
      }
      this.phasePriValueLate = String(data.result.phasePriority);
      this.phasePriValueTempLate = this.phasePriValueLate;
      this.taskLongDescLate = data.result.taskLongDesc;
      this.taskLongDescTempLate = this.taskLongDescLate;
      this.GetValueChartTask_Late(data.result);
      var perc = this.TaskChartData.LateTaskValueChart;
      var arr = [perc, this.TaskChartData.LateTaskValueChart - perc];
      this.arrSeries = arr;

      this.chartOptionsLate = {
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
  GetValueChartTask_Late(data: any) {
    debugger;
    var tsktime = 0;
    var parvalue = 0;
    if (data.remaining <= 0) {
      this.TaskChartData.LateTaskValueChart = 100;
      this.TaskChartData.LateTaskValueCharttxt = 'متاخرة';
    } else if (data.remaining > 0) {
      if (data.timeType == 1) {
        tsktime = data.timeMinutes * 60;
      } else if (data.timeType == 2) {
        tsktime = data.timeMinutes * 24 * 60;
      }
      var remn = ((data.remaining / tsktime) * 100) / 100;
      var parvalue = 1 - remn;
      parvalue = parseInt((parvalue * 100).toString());
      this.TaskChartData.LateTaskValueChart = parvalue;
    } else {
      this.TaskChartData.LateTaskValueChart = 0;
    }
  }
  ChangeGoal() {
    debugger;
    if (this.TaskData.goalcheck) {
      if (this.TaskData.Obj.projectId != null) {
        this._phasestaskService
          .FillProjectRequirmentSelect(this.TaskData.Obj.projectId)
          .subscribe((result: any) => {
            if (result.result != null) {
              if (result.result.requirementGoalId != 0) {
                this.TaskData.goalname = result.result.requirmentName;
              } else {
                this.TaskData.goalcheck = false;
                this.TaskData.goalname = null;
              }
            } else {
              this.TaskData.goalcheck = false;
              this.TaskData.goalname = null;
            }
          });
      } else {
        this.TaskData.goalcheck = false;
        this.TaskData.goalname = null;
        this.toast.error('من فضلك أختر مشروع أولا', 'رسالة');
        return;
      }
    } else {
      this.TaskData.taskgoal = false;
      this.TaskData.goalname = null;
    }
  }
  ChangeGoalLate() {
    debugger;
    if (this.TaskDataLate.goalcheck) {
      if (this.TaskDataLate.Obj.projectId != null) {
        this._phasestaskService
          .FillProjectRequirmentSelect(this.TaskDataLate.Obj.projectId)
          .subscribe((result: any) => {
            if (result.result != null) {
              if (result.result.requirementGoalId != 0) {
                this.TaskDataLate.goalname = result.result.requirmentName;
              } else {
                this.TaskDataLate.goalcheck = false;
                this.TaskDataLate.goalname = null;
              }
            } else {
              this.TaskDataLate.goalcheck = false;
              this.TaskDataLate.goalname = null;
            }
          });
      } else {
        this.TaskDataLate.goalcheck = false;
        this.TaskDataLate.goalname = null;
        this.toast.error('من فضلك أختر مشروع أولا', 'رسالة');
        return;
      }
    } else {
      this.TaskDataLate.taskgoal = false;
      this.TaskDataLate.goalname = null;
    }
  }

  GetTimeMinutestxt(date1: any, date2: any) {
    var diff = Math.abs(date1.getTime() - date2.getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    return diffDays + 1;
  }
  //------------------------------TaskBtns-------------------------------------------
  //#region
  GlobalRowSelectTaskOrLate: any;
  FinishTaskCheck(modal: any) {
    this._phasestaskService.FinishTaskCheck(modal).subscribe((result: any) => {});
  }
  confirm_endtask() {
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
        this.refreshData();
        this.TaskData.selected = false;
        this.GetTasksByUserIdUser(0);
        this.GetWorkOrdersByUserId();
        this.GetDay_Tasks();
        this.GetWeek_Tasks();
        this.GetMonth_Tasks();
        this.GetDay_Orders();
        this.GetWeek_Orders();
        this.GetMonth_Orders();
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }
  isdisabled = 0;
  disablesavingpercentage() {
    this.isdisabled = 1;
  }
  confirm_playandstoptask(type: number) {
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
          this.refreshData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  confirm_deletetask() {
    this._phasestaskService
      .DeleteProjectPhasesTasksNEW(
        this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId
      )
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.refreshData();
          this.TaskData.selected = false;
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  progress = 0;
  uploading=false;
  disableButtonSave_File = false;

  resetprog(){
    this.disableButtonSave_File = false;
    this.progress = 0;
    this.uploading=false;
  }
  confirm_SaveFiles(modal: any) {
    debugger;
    if (this.controlTask?.value.length > 0) {
      console.log(this.controlTask?.value[0]);
      const formData: FormData = new FormData();
      formData.append('uploadesgiles', this.controlTask?.value[0]);
      formData.append('RequirementId', String(0));

      if((this.OrderData?.Obj?.workOrderId ?? 0)>0)
      {
        formData.append('PageInsert', "4");
      }
      else
      {
        formData.append('PageInsert', "1");
      }

      formData.append(
        'PhasesTaskID',
        this.GlobalRowSelectTaskOrLate?.Obj?.phaseTaskId ?? 0
      );
      formData.append('OrderId', this.OrderData?.Obj?.workOrderId ?? 0);

      if(((this.OrderData?.Obj?.workOrderId ?? 0) >0) && (this.OrderData?.Obj?.projectId==null))
      {

        const formData: FormData = new FormData();
        formData.append('WorkOrderId',  String(this.OrderData?.Obj?.workOrderId));
        formData.append('postedFiles', this.controlTask?.value[0]);
          this._workordersService.SaveWorkOrderFile(formData).subscribe((result: any)=>{

            debugger;

            if (result.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * result.loaded / result.total);
            }

            if(result?.body?.statusCode==200){
              this.controlTask.removeFile(this.controlTask?.value[0]);
              this.toast.success(this.translate.instant(result?.body?.reasonPhrase),'رسالة');
              modal.dismiss();
              this.resetprog();
            }
            else if(result?.type>=0)
            {}
            else{this.toast.error(this.translate.instant(result?.body?.reasonPhrase), 'رسالة');this.resetprog();}
          });
      }
      else
      {

        setTimeout(() => {
          this.resetprog();
        }, 60000);
        this.progress = 0;
        this.disableButtonSave_File = true;
        this.uploading=true;

        this._phasestaskService.SaveProjectRequirement4(formData).subscribe((result: any) => {


          if (result.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * result.loaded / result.total);
          }

          if(result?.body?.statusCode==200){
            this.controlTask.removeFile(this.controlTask?.value[0]);
            this.toast.success(this.translate.instant(this.translate.instant(result?.body?.reasonPhrase)),this.translate.instant("Message"));
            modal.dismiss();
            this.refreshData();
            this.resetprog();
          }
          else if(result?.type>=0)
          {}
          else{this.toast.error(this.translate.instant(result?.body?.reasonPhrase), this.translate.instant("Message"));this.resetprog();}
          });

      }
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
    PlusTimeTaskObj.EndDate = this._sharedService.date_TO_String(
      this.extendedData.DateTo
    );
    PlusTimeTaskObj.TimeMinutes = this.GetTimeMinutestxt(
      this.extendedData.DateFrom,
      this.extendedData.DateTo
    );
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
          this.refreshData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  confirm_changeTaskTime2(modal: any) {
    debugger;
    // if(this.extendedData.DateTo==null && this.extendedData.selectedTaskType==2){
    //   this.toast.error("اختر تاريخ نهاية", 'رسالة');return;
    // }
    var PlusTimeTaskObj: any = {};
    PlusTimeTaskObj.PhaseTaskId =
      this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId;
    // PlusTimeTaskObj.EndDate = this._sharedService.date_TO_String(this.extendedData.DateTo);
    // PlusTimeTaskObj.TimeMinutes = this.GetTimeMinutestxt(this.extendedData.DateFrom,this.extendedData.DateTo);
    // PlusTimeTaskObj.Cost = 0;
    // PlusTimeTaskObj.TimeType = this.extendedData.selectedTaskType;
    this._phasestaskService
      .PlustimeTask(PlusTimeTaskObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          modal.dismiss();
          this.refreshData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
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
          this.refreshData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  confirm_converttask2(modal: any) {
    var ConvertTaskObj: any = {};
    ConvertTaskObj.PhaseTaskId = this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId;
    ConvertTaskObj.IsConverted = 1;
    // ConvertTaskObj.UserId = this.UsersSelectConvert;
    this._phasestaskService
      .RequestConvertTask(ConvertTaskObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          modal.dismiss();
          this.refreshData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  //#endregion
  //--------------------------- (end)---TaskBtns-------------------------------------------

  load_UsersSelectConvert: any;
  UsersSelectConvert: any = null;

  Fillcustomerhavingoffer() {
    this._phasestaskService.FillUsersSelect(0).subscribe((data) => {
      this.load_UsersSelectConvert = data;
    });
  }
  TimeHChange() {
    if (this.extendedData.TimeH > 24) {
      this.extendedData.TimeH = 24;
    } else if (this.extendedData.TimeH < 1) {
      this.extendedData.TimeH = 1;
    }
  }

  SaveTaskLongDesc(type: any) {
    debugger;
    var details = '';
    if (type == 'task') {
      this.GlobalRowSelectTaskOrLate = this.TaskData;
      details = this.taskLongDesc;
    } else if (type == 'latetask') {
      this.GlobalRowSelectTaskOrLate = this.TaskDataLate;
      details = this.taskLongDescLate;
    }
    this._phasestaskService
      .SaveTaskLongDesc(this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId, details)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.refreshData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  ChangePriorityTask(type: any) {
    debugger;
    var per = 0;
    if (type == 'task') {
      this.GlobalRowSelectTaskOrLate = this.TaskData;
      per = parseInt(this.phasePriValue);
    } else if (type == 'latetask') {
      this.GlobalRowSelectTaskOrLate = this.TaskDataLate;
      per = parseInt(this.phasePriValueLate);
    }
    debugger;
    var PlayTaskObj: any = {};
    PlayTaskObj.PhaseTaskId = this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId;
    PlayTaskObj.PhasePriority = per;
    this._phasestaskService
      .ChangePriorityTask(PlayTaskObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.refreshData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
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

  ShowImgAddedLate() {
    var img = environment.PhotoURL + this.TaskDataLate.Obj?.addedTaskImg;
    return img;
  }
  ShowImgManagerLate() {
    var img = environment.PhotoURL + this.TaskDataLate.Obj?.projectManagerImg;
    return img;
  }
  //#endregion
  //------------------------------------(end)------DataTask------------------------------------------

  // Save row
  save(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    // console.log('Row saved: ' + rowIndex);
    // console.log(row);
  }
  addNewTask() {}
  saveOption(data: any) {}
  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d: any) {
      return d.name_ar.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
  }
  // Delete row
  delete(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    this.rows.splice(rowIndex, 1);
    // console.log('Row deleted: ' + rowIndex);
  }
  confirm() {}

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
  ////////////////////////////////////////////////////////////////////////////////////////
  AddTaskData: any = {
    userid: null,
    tasktype: null,
    tasknamear: null,
    tasknameen: null,
    customerid: null,
    projectid: null,
    phaseid: null,
    subphaseid: null,
    timetypeid: null,
    datefrom: null,
    dateto: null,
    timefrom: null,
    timeto: null,
    taskgoal: false,
    projectgoalstxt: null,
    projectgoals: null,

    departmentCheck: false,
    departmentId: null,

    priorty: '1',
    hourTime: 1,

    loaddepartmentId: [],
    loaduserid: [],
    loadtasktype: [],
    loadcustomer: [],
    loadproject: [],
    loadphases: [],
    loadsubphases: [],

    tasktypedata: {
      id: 0,
      namear: null,
      nameen: null,
    },
    notVacCalc:false,

    uploadfile: [],
    TimeMinutestxt: null,
    RetCheckUserDawamBool: true,
  };
  TaskTypeRowSelected: any;
  refreshData() {
    this.GetTasksByUserIdUser(0);
    // if(this.selectedTask1?.length)
    // {
    //   this.GetTaskListtxt(parseInt(this.selectedTask1[0].phaseid));
    // }
    // if(this.selectedTask2?.length)
    // {
    //   this.GetTaskListtxt_Late(parseInt(this.selectedTask2[0].phaseid));
    // }
  }
  addHours(date: any, hours: any) {
    date.setHours(date.getHours() + hours);
    return date;
  }
  ChangehourTime() {
    if (
      this.AddTaskData.hourTime < 0 ||
      this.AddTaskData.hourTime == null ||
      this.AddTaskData.hourTime > 24
    ) {
      this.AddTaskData.hourTime = 1;
    }
    // else if(this.AddTaskData.hourTime>24)
    // {
    //   this.AddTaskData.hourTime=24;
    // }
    this.AddTaskData.TimeMinutestxt = this.AddTaskData.hourTime;
    if (this.AddTaskData.timefrom != null) {
      this.SetEndTaskTimeTo(this.AddTaskData.hourTime);
    }
  }
  SetEndTaskTimeTo(hours: any) {
    debugger;
    if (this.AddTaskData.timefrom != null) {
      var startTime = this.AddTaskData.timefrom.getTime();
      var endTime = new Date(startTime + hours * 60 * 60000);
      this.AddTaskData.timeto = endTime;
    }
  }
  SetEndTaskTimeTo_Hours(startTime: any, endTime: any) {
    if (this.AddTaskData.timefrom != null) {
      startTime = startTime.getHours();
      endTime = endTime.getHours();
      var hourDiff = endTime - startTime;
      if (hourDiff < 0) hourDiff = hourDiff + 24;
      this.AddTaskData.hourTime = hourDiff;
    }
  }
  END_START_CHECK(timeFrom: any, timeTo: any) {
    if (this.AddTaskData.timefrom == null || this.AddTaskData.timeto == null) {
      return;
    }
    debugger;
    if (timeFrom >= timeTo) {
      var hourValue = this.AddTaskData.hourTime;
      this.SetEndTaskTimeTo(hourValue);
    } else {
      this.SetEndTaskTimeTo_Hours(timeFrom, timeTo);
    }
  }
  Changetimefrom() {
    this.SetEndTaskTimeTo(this.AddTaskData.hourTime);
  }
  Changetimeto() {
    if (this.AddTaskData.timefrom == null || this.AddTaskData.timeto == null) {
    } else {
      var startTime = this.AddTaskData.timefrom.getTime();
      var endTime = this.AddTaskData.timeto.getTime();
      this.END_START_CHECK(this.AddTaskData.timefrom, this.AddTaskData.timeto);
    }
  }
  CheckDwamTime(userid: any) {
    this.AddTaskData.RetCheckUserDawamBool = true;

    let timefrom = this._sharedService.formatTimeHourOnly(
      this.AddTaskData.timefrom
    );
    let timeto = this._sharedService.formatTimeHourOnly(
      this.AddTaskData.timeto
    );

    let timefrom_ampm = this._sharedService.formatAMPMOnly(
      this.AddTaskData.timefrom
    );
    let timeto_ampm = this._sharedService.formatAMPMOnly(
      this.AddTaskData.timeto
    );
    if (timefrom_ampm == 'PM') {
      timefrom = timefrom + 12;
    }

    if (timeto_ampm == 'PM') {
      timeto = timeto + 12;
    }
    var dayno = new Date().getDay();

    var accdayno = 0;
    if (dayno == 0) {
      accdayno = 2;
    } else if (dayno == 1) {
      accdayno = 3;
    } else if (dayno == 2) {
      accdayno = 4;
    } else if (dayno == 3) {
      accdayno = 5;
    } else if (dayno == 4) {
      accdayno = 6;
    } else if (dayno == 5) {
      accdayno = 7;
    } else if (dayno == 6) {
      accdayno = 1;
    } else {
      accdayno = 1;
    }

    this._phasestaskService
      .CheckUserPerDawamUserExist(userid, timefrom, timeto, accdayno)
      .subscribe((result: any) => {
        this.AddTaskData.RetCheckUserDawamBool = result.result;
      });
    return this.AddTaskData.RetCheckUserDawamBool;
  }

  ChangeProject() {
    this.FillProjectMainPhases();
    this.GetProjectById();
  }
  GetProjectById() {
    if (this.AddTaskData.projectid != null) {
      this._phasestaskService
        .GetProjectById(this.AddTaskData.projectid)
        .subscribe((result: any) => {
          this.RemTimeProjData.produrationexpect = result.result.timeStr;
          this.getremainprojectdate(
            result.result.projectDate,
            result.result.projectExpireDate
          );
        });
    } else {
      this.RemTimeProjData.timerem = null;
      this.RemTimeProjData.prendexpect = null;
      this.RemTimeProjData.footerdetails = null;
      this.RemTimeProjData.produrationexpect = null;
    }
  }

  RemTimeProjData: any = {
    timerem: null,
    prendexpect: null,
    footerdetails: null,
    produrationexpect: null,
  };

  getremainprojectdate(stdate: any, enddat: any) {
    var date1 = new Date(enddat);
    var date2 = new Date();
    var Difference_In_Time = date1.getTime() - date2.getTime();

    var Difference_In_Days = parseInt(
      (Difference_In_Time / (1000 * 3600 * 24)).toString()
    );

    if (date2 <= date1) {
      if (Difference_In_Days < 30 && Difference_In_Days > 0) {
        this.RemTimeProjData.timerem = Difference_In_Days + 'يوم';
      } else if (Difference_In_Days == 30) {
        this.RemTimeProjData.timerem = Difference_In_Days + 'شهر';
      } else if (Difference_In_Days > 30) {
        this.RemTimeProjData.timerem =
          parseInt((Difference_In_Days / 30).toString()) +
          'شهر' +
          parseInt((Difference_In_Days % 30).toString()) +
          'يوم';
      }
      this.RemTimeProjData.prendexpect = 'بعد ' + this.RemTimeProjData.timerem;
      this.RemTimeProjData.footerdetails = null;
    } else if (date1 <= date2) {
      this.RemTimeProjData.prendexpect = 'مشروع متأخر ';
      this.RemTimeProjData.footerdetails =
        'هذا المشروع متاخر ، ولا يمكن اضافة مهام علية الا بعد تمديد مدة المشروع';
    } else {
      this.RemTimeProjData.prendexpect = null;
      this.RemTimeProjData.footerdetails = null;
    }
  }

  Changeorgisreq() {
    if (this.AddTaskData.taskgoal) {
      if (this.AddTaskData.projectid != null) {
        this._phasestaskService
          .FillProjectRequirmentSelect(this.AddTaskData.projectid)
          .subscribe((result: any) => {
            if (result.result != null) {
              if (result.result.requirementGoalId != 0) {
                this.AddTaskData.projectgoalstxt = result.result.requirmentName;
                this.AddTaskData.projectgoals = result.result.requirementGoalId;
              } else {
                this.AddTaskData.taskgoal = false;
                this.AddTaskData.projectgoalstxt = null;
                this.AddTaskData.projectgoals = null;
              }
            } else {
              this.AddTaskData.taskgoal = false;
              this.AddTaskData.projectgoalstxt = null;
              this.AddTaskData.projectgoals = null;
            }
          });
      } else {
        this.AddTaskData.taskgoal = false;
        this.AddTaskData.projectgoalstxt = null;
        this.AddTaskData.projectgoals = null;
        this.toast.error('من فضلك أختر مشروع أولا', 'رسالة');
        return;
      }
    } else {
      this.AddTaskData.taskgoal = false;
      this.AddTaskData.projectgoalstxt = null;
      this.AddTaskData.projectgoals = null;
    }
  }
  ChangedepartSwitch() {
    this.AddTaskData.userid = null;
    this.AddTaskData.departmentId = null;
    this.Atttable = null;
  }
  FillDepartmentSelect() {
    this._phasestaskService.FillDepartmentSelect().subscribe((data) => {
      this.AddTaskData.loaddepartmentId = data;
    });
  }
  Atttable: any;
  GetAllAttTimeDetails2() {
    this.Atttable = null;
    if (this.AddTaskData.userid != null) {
      this._phasestaskService
        .GetAllAttTimeDetails2(this.AddTaskData.userid)
        .subscribe((data) => {
          this.Atttable = data.result;
        });
    } else {
      this.Atttable = null;
    }
  }

  FillProjectMainPhases() {
    this.AddTaskData.phaseid = null;
    if (this.AddTaskData.projectid != null) {
      this._phasestaskService
        .FillProjectMainPhases(this.AddTaskData.projectid)
        .subscribe((data) => {
          this.AddTaskData.loadphases = data;
        });
    } else {
      this.AddTaskData.loadphases = [];
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  //-----------------------------------------Convert-------------------------------------------------
  //#region

  VacTaskdata: any = {
    task_V: null,
    userId_V: null,
  };

  TasksVacation: any;
  FillUsersTasksVacationSelect() {
    this._phasestaskService
      .FillUsersTasksVacationSelect(0)
      .subscribe((data) => {
        this.TasksVacation = data;
      });
  }
  ConverVacUser: any;
  FillConverVacUser() {
    this._phasestaskService.FillUsersSelect(0).subscribe((data) => {
      this.ConverVacUser = data;
    });
  }

  ConvertUserTasksSome(modal: any) {
    if (this.AllTaskdata.task_V == null || this.VacTaskdata.userId_V == null) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    this._phasestaskService
      .ConvertUserTasksSome(
        this.VacTaskdata.task_V,
        0,
        this.VacTaskdata.userId_V
      )
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          modal?.dismiss();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  AllTaskdata: any = {
    userId_a: null,
  };
  ConvertAllUser: any;
  FillConvertAllUser() {
    this._phasestaskService.FillUsersSelect(0).subscribe((data) => {
      this.ConvertAllUser = data;
    });
  }
  ConvertUserTasksAll(modal: any) {
    if (this.AllTaskdata.userId_a == null) {
      this.toast.error('من فضلك أختر مستخدم', 'رسالة');
      return;
    }
    this._phasestaskService
      .ConvertUserTasks(0, this.AllTaskdata.userId_a)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          modal?.dismiss();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  //#endregion
  //-------------------------------------End----Convert-------------------------------------------------

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
        this.GetTasksByUserIdUser(0);
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }
}
