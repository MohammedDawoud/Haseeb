import { Search_Project } from './../../../core/Classes/Search/search_Project';
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
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as go from 'gojs';
import { ProjectsettingService } from 'src/app/core/services/pro_Services/projectsetting.service';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent,
} from 'ng-apexcharts';
import { PhasestaskService } from 'src/app/core/services/pro_Services/phasestask.service';
import { environment } from 'src/environments/environment';
import { ProjectRequirements } from 'src/app/core/Classes/DomainObjects/projectRequirements';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { HttpEventType } from '@angular/common/http';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-track-missions',
  templateUrl: './track-missions.component.html',
  styleUrls: ['./track-missions.component.scss'],
})
export class TrackMissionsComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: any;
  public chartOptionsLate!: any;

  @ViewChild(DatatableComponent) table: DatatableComponent | any;

  title: any = {
    main: {
      name: {
        ar: 'ادارة المشاريع',
        en: 'Projects Management',
      },
      link: '/projects',
    },
    sub: {
      ar: 'حركة المهام',
      en: 'track tasks',
    },
  };
  selectedItems: any;

  nodeItems: any = [];
  selectedTask1: any;
  selectedTask2: any;

  options = {
    mode: TreeMode.SingleSelect,
    checkboxes: false,
    alwaysEmitSelected: false,
    allowParentSelection: true,
    hasCollapseExpand: true,
    //isCollapsedContent:false,
  };

  openSearch = false;
  selectedUser: any;
  users: any;

  closeResult: any;

  isEditable: any = {};

  rows = [
    { id: 1, name_ar: 'اسم النشاط1', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط2', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط3', name_en: 'test test' },
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
    { id: 1, name_ar: 'اسم النشاط1', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط2', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط3', name_en: 'test test' },
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

  items = [
    {
      assignedTo: 'محمد هلهل	',
      ProjectNumber: '2022-63	',
      CustomerName: 'احمد',
      taskStatus: 'منخفض',
    },
  ];
  // upload img ]
  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );
  public readonly uploadedFileTask: BehaviorSubject<string> =
    new BehaviorSubject('');
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

  data: any = {
    files: [],
  };

  expected_project_duration = new Date();
  expected_end_date = new Date();

  showBox1 = false;
  showBox2 = false;

  stratDate = new Date();
  endDate = new Date();
  userG: any = {};

  constructor(
    private modalService: NgbModal,
    private _phasestaskService: PhasestaskService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private _projectsettingService: ProjectsettingService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService
  ) {
    this.userG = this.authenticationService.userGlobalObj;
  }
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
  WhatsAppData: any={
    sendactivation:false,
    sendactivationOffer:false,
    sendactivationProject:false,
    sendactivationSupervision:false,
  };
  ngOnInit(): void {
    this.TaskType = [
      { id: 1, name: { ar: 'ساعة', en: 'Hour' } },
      { id: 2, name: { ar: 'يوم', en: 'Day' } },
    ];
    this.extendedData.selectedTaskType = 1;
    this.extendedData.TimeH = 1;
    this.extendedData.DateFrom = new Date();

    this.nodeDataArray = [];
    this.linkDataArray = [];
    this.model2 = new go.GraphLinksModel(
      this.nodeDataArray,
      this.linkDataArray
    );
    this._sharedService.GetWhatsAppSetting().subscribe((data: any) => {
      if(data?.result!=null){this.WhatsAppData=data?.result;}
      else{this.WhatsAppData={sendactivation:false,sendactivationOffer:false,sendactivationProject:false,sendactivationSupervision:false,};}
    });
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
    this.arrSeries = [0, 0];
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
    this.loadPrivTree();
    this.loadPrivTreeLate();
  }
  @ViewChild('tree') tree: any;
  @ViewChild('treelate') treelate: any;

  ngAfterViewInit() {
    setTimeout(() => {
      this.tree.collapseAll();
      this.treelate.collapseAll();
    }, 1000);
  }

  loadPrivTreeObj: any = [];
  loadPrivTree() {
    this._phasestaskService.loadPrivTree().subscribe((data) => {
      this.loadPrivTreeObj = data;
    });
  }
  loadPrivTreeLateObj: any = [];
  loadPrivTreeLate() {
    this._phasestaskService.loadPrivTreeLate().subscribe((data) => {
      this.loadPrivTreeLateObj = data;
    });
  }

  loadPrivTreeSearch() {
    const formData = new FormData();
    if (this.Searchdata.userId_S != null) {
      formData.append('UserId', this.Searchdata.userId_S);
    }
    if (this.Searchdata.customerId_S != null) {
      formData.append('CustomerId', this.Searchdata.customerId_S);
    }
    if (this.Searchdata.projectId_S != null) {
      formData.append('ProjectId', this.Searchdata.projectId_S);
    }

    this._phasestaskService
      .GetTasksByUserIdCustomerIdProjectIdTree(formData)
      .subscribe((data) => {
        this.loadPrivTreeObj = data;
      });
  }
  loadPrivTreeLateSearch() {
    const formData = new FormData();
    if (this.Searchdata.userId_S != null) {
      formData.append('UserId', this.Searchdata.userId_S);
    }
    if (this.Searchdata.customerId_S != null) {
      formData.append('CustomerId', this.Searchdata.customerId_S);
    }
    if (this.Searchdata.projectId_S != null) {
      formData.append('ProjectId', this.Searchdata.projectId_S);
    }

    this._phasestaskService
      .GetLateTasksByUserIdCustomerIdProjectIdTree(formData)
      .subscribe((data) => {
        this.loadPrivTreeLateObj = data;
      });
  }

  //--------Search------------------
  SearchCustomerFilter() {
    this.TaskData.selected = false;
    this.TaskDataLate.selected = false;
    this.Searchdata.projectId_S = null;
    this.GetAllProjByCustomerIdHaveTasks();
    this.loadPrivTreeSearch();
    this.loadPrivTreeLateSearch();
  }
  SearchFilter() {
    this.TaskData.selected = false;
    this.TaskDataLate.selected = false;

    this.loadPrivTreeSearch();
    this.loadPrivTreeLateSearch();
  }
  //--------end search--------------

  //------------------------------------------DataTask----------------------------------------------
  //#region
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
  selectTask() {
    if (this.selectedTask1[0] != null) {
      this.TaskData.selected = true;
      this.GetTaskListtxt(parseInt(this.selectedTask1[0].phaseid));
    } else {
      this.TaskData.selected = false;
    }
  }
  selectTask_Late() {
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

      if (data.result.taskLongDesc == '' || data.result.taskLongDesc == null) {
        this.taskLongDesc = data.result.retrievedReason;
      } else {
        this.taskLongDesc = data.result.taskLongDesc;
      }

      this.taskLongDescTemp = this.taskLongDesc;

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
      this.TaskDataLate.Obj = data.result;
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
      this.phasePriValueTemp = this.phasePriValue;
      debugger;
      if (data.result.taskLongDesc == '' || data.result.taskLongDesc == null) {
        this.taskLongDescLate = data.result.retrievedReason;
      } else {
        this.taskLongDescLate = data.result.taskLongDesc;
      }
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
  FinishTaskCheck(modal: any) {
    this._phasestaskService.FinishTaskCheck(modal).subscribe((result: any) => {});
  }
  confirm_endtask() {
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
      } else {
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
      }
    });
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
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
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
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      });
  }

  progress = 0;
  uploading = false;
  disableButtonSave_File = false;

  resetprog() {
    this.disableButtonSave_File = false;
    this.progress = 0;
    this.uploading = false;
  }

  confirm_SaveFiles(modal: any) {
    if (this.controlTask?.value.length > 0) {
      const formData: FormData = new FormData();
      formData.append('uploadesgiles', this.controlTask?.value[0]);
      formData.append('RequirementId', String(0));
      formData.append(
        'PhasesTaskID',
        this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId
      );
      formData.append('PageInsert', '1');

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
            this.refreshData();
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
  confirm_changeTaskTime() {
    debugger;
    if (
      this.extendedData.DateTo == null &&
      this.extendedData.selectedTaskType == 2
    ) {
      this.toast.error('اختر تاريخ نهاية', 'رسالة');
      return;
    }
    if (this.extendedData.selectedTaskType == 1) {
      this.extendedData.DateTo = this._sharedService.String_TO_date(
        this.GlobalRowSelectTaskOrLate.Obj.endDateCalc
      );
    }
    var PlusTimeTaskObj: any = {};
    PlusTimeTaskObj.PhaseTaskId =
      this.GlobalRowSelectTaskOrLate.Obj.phaseTaskId;
    PlusTimeTaskObj.EndDate = this._sharedService.date_TO_String(
      this.extendedData.DateTo
    );
    if (this.extendedData.selectedTaskType == 1) {
      PlusTimeTaskObj.TimeMinutes = this.extendedData.TimeH;
      +(this.GlobalRowSelectTaskOrLate.Obj.timeMinutes ?? 0);
      if (
        this.GlobalRowSelectTaskOrLate.Obj.taskTimeTo != null &&
        this.GlobalRowSelectTaskOrLate.Obj.taskTimeTo != ''
      ) {
        PlusTimeTaskObj.TaskTimeTo =
          this.GlobalRowSelectTaskOrLate.Obj.taskTimeTo;
        var matches = this.GlobalRowSelectTaskOrLate.Obj.taskTimeTo
          .toLowerCase()
          .match(/(\d{1,2}):(\d{2}) ([ap]m)/);
        var NewHours = parseInt(matches[1]) + this.extendedData.TimeH;
        var newtaskTimeTo = null;
        if (NewHours >= 12) {
          if (NewHours > 12) {
            NewHours = NewHours - 12;
          }
          if (matches[3] == 'am') {
            newtaskTimeTo = NewHours + ':' + matches[2] + ' ' + 'PM';
          } else {
            newtaskTimeTo = NewHours + ':' + matches[2] + ' ' + 'AM';
          }
        } else {
          if (NewHours > 12) {
            NewHours = NewHours - 12;
          }
          if (matches[3] == 'am') {
            newtaskTimeTo = NewHours + ':' + matches[2] + ' ' + 'AM';
          } else {
            newtaskTimeTo = NewHours + ':' + matches[2] + ' ' + 'PM';
          }
        }
        PlusTimeTaskObj.TaskTimeTo = newtaskTimeTo;
        var date = newtaskTimeTo;
      }
    } else {
      PlusTimeTaskObj.TimeMinutes = this.GetTimeMinutestxt(
        this.extendedData.DateFrom,
        this.extendedData.DateTo
      );
      PlusTimeTaskObj.TaskTimeTo = null;
    }
    PlusTimeTaskObj.Cost = 0;
    PlusTimeTaskObj.TimeType = this.extendedData.selectedTaskType;
    // console.log(PlusTimeTaskObj);
    // return;
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
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
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
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
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
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      });
  }
  ChangePriorityTask(type: any) {
    var per = 0;
    if (type == 'task') {
      this.GlobalRowSelectTaskOrLate = this.TaskData;
      per = parseInt(this.phasePriValue);
    } else if (type == 'latetask') {
      this.GlobalRowSelectTaskOrLate = this.TaskDataLate;
      per = parseInt(this.phasePriValueLate);
    }
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
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
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

  //-----------------------------------------Search-------------------------------------------------
  //#region
  Searchdata: any = {
    customerId_S: null,
    projectId_S: null,
    userId_S: null,
  };

  customerIdSelectIdFilter: any;
  GetCustomersOwnNotArcheivedProjects() {
    this._phasestaskService
      .GetCustomersOwnNotArcheivedProjects()
      .subscribe((data) => {
        this.customerIdSelectIdFilter = data;
      });
  }
  projectSelectIdFilter: any;
  GetAllProjByCustomerIdHaveTasks() {
    //if (this.Searchdata.customerId_S != null) {
    this._phasestaskService
      .GetAllProjByCustomerIdHaveTasks(this.Searchdata.customerId_S ?? 0)
      .subscribe((data) => {
        this.projectSelectIdFilter = data;
      });
    // } else {
    //   this.projectSelectIdFilter = [];
    // }
  }
  UserSelectIdFilter: any;
  FillUsershaveRunningTasks() {
    this._phasestaskService.FillUsershaveRunningTasks().subscribe((data) => {
      this.UserSelectIdFilter = data;
    });
  }
  LoadSelectSearch() {
    if (this.openSearch == true) {
      debugger;
      this.GetCustomersOwnNotArcheivedProjects();
      this.FillUsershaveRunningTasks();
      this.GetAllProjByCustomerIdHaveTasks();
    }
  }
  //#endregion
  //------------------------------------(end)------Search------------------------------------------

  //-----------------------------------------Convert-------------------------------------------------
  //#region

  VacTaskdata: any = {
    task_V: null,
    userId_V: null,
  };

  TasksVacation: any;
  FillUsersTasksVacationSelect() {
    this._phasestaskService
      .FillUsersTasksVacationSelect(this.Searchdata.userId_S ?? 0)
      .subscribe((data) => {
        this.TasksVacation = data;
      });
  }
  ConverVacUser: any;
  FillConverVacUser() {
    this._phasestaskService
      .FillUsersSelect(this.Searchdata.userId_S ?? 0)
      .subscribe((data) => {
        this.ConverVacUser = data;
      });
  }

  ConvertUserTasksSome(modal: any) {
    debugger
    if (this.VacTaskdata.task_V == null || this.VacTaskdata.userId_V == null) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    this._phasestaskService
      .ConvertUserTasksSome(
        this.VacTaskdata.task_V,
        this.Searchdata.userId_S ?? 0,
        this.VacTaskdata.userId_V
      )
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          modal?.dismiss();
          this.FillUsersTasksVacationSelect();
          this.FillConverVacUser();
          this.VacTaskdata.task_V = null;
          this.VacTaskdata.userId_V = null;
          this.SearchFilter();
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      });
  }

  AllTaskdata: any = {
    userId_a: null,
  };
  ConvertAllUser: any;
  FillConvertAllUser() {
    this._phasestaskService
      .FillUsersSelect(this.Searchdata.userId_S ?? 0)
      .subscribe((data) => {
        this.ConvertAllUser = data;
      });
  }
  ConvertUserTasksAll(modal: any) { 
    if (this.AllTaskdata.userId_a == null) {
      this.toast.error('من فضلك أختر مستخدم', 'رسالة');
      return;
    }
    this._phasestaskService
      .ConvertUserTasks(
        this.Searchdata.userId_S ?? 0,
        this.AllTaskdata.userId_a
      )
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          modal?.dismiss();
          this.SearchFilter();
          this.FillConvertAllUser();
          this.AllTaskdata.userId_a = null;
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      });
  }
  //#endregion
  //-------------------------------------End----Convert-------------------------------------------------

  //-------------------------------------Add TAsk-------------------------------------------------------
  //#region
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
  getTasktypeRow(row: any) {
    this.TaskTypeRowSelected = row;
  }
  setTaskTypeInSelect(data: any, modal: any) {
    this.AddTaskData.tasktype = data.id;
    this.AddTaskData.tasknamear = data.name;
    this.AddTaskData.tasknameen = data.nameE ?? data.name;
    modal?.dismiss();
  }
  confirmTasktypeDelete() {
    this._phasestaskService
      .DeleteTaskType(this.TaskTypeRowSelected.id)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.FillTaskTypeSelect();
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      });
  }

  saveTaskType() {
    if (
      this.AddTaskData.tasktypedata.namear == null ||
      this.AddTaskData.tasktypedata.nameen == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    var TaskTypeObj: any = {};
    TaskTypeObj.TaskTypeId = this.AddTaskData.tasktypedata.id;
    TaskTypeObj.NameAr = this.AddTaskData.tasktypedata.namear;
    TaskTypeObj.NameEn = this.AddTaskData.tasktypedata.nameen;

    var obj = TaskTypeObj;
    this._phasestaskService.SaveTaskType(obj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.resetTaskType();
        this.FillTaskTypeSelect();
      } else {
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
      }
    });
  }
  resetTaskType() {
    this.AddTaskData.tasktypedata.id = 0;
    this.AddTaskData.tasktypedata.namear = null;
    this.AddTaskData.tasktypedata.nameen = null;
  }
  _projectRequirements: any;
  SaveFiles(phaseid: any) {
    if (phaseid == null || phaseid == 0) {
      return;
    }

    if (this.control?.value.length > 0) {
      console.log(this.control?.value[0]);
      const formData: FormData = new FormData();
      formData.append('uploadesgiles', this.control?.value[0]);
      formData.append('RequirementId', String(0));
      formData.append('PhasesTaskID', phaseid);
      formData.append('PageInsert', '1');
      this._phasestaskService
        .SaveProjectRequirement4(formData)
        .subscribe((result) => {});
    }
  }

  FillAllUsersSelectsomeByBranch() {
    this._phasestaskService.FillAllUsersSelectsomeByBranch().subscribe((data) => {
      this.AddTaskData.loaduserid = data;
    });
  }
  FillAllUsersSelectAll() {
    this._phasestaskService.FillAllUsersSelectAll().subscribe((data) => {
      this.AddTaskData.loaduserid = data;
    });
  }
  FillAllUsersSelect() {
    this._phasestaskService.FillAllUsersSelect().subscribe((data) => {
      this.AddTaskData.loaduserid = data;
    });
  }
  FillTaskTypeSelect() {
    this._phasestaskService.FillTaskTypeSelect().subscribe((data) => {
      this.AddTaskData.loadtasktype = data;
    });
  }
  FillCustomersOwnProjects() {
    this._phasestaskService
      .FillCustomersOwnProjectsByBranch()
      .subscribe((data) => {
        this.AddTaskData.loadcustomer = data;
      });
  }
  FillProjectSelectByCustomerId() {
    this.AddTaskData.projectid = null;
    if (this.AddTaskData.customerid != null) {
      this._phasestaskService
        .FillProjectSelectByCustomerId(this.AddTaskData.customerid)
        .subscribe((data) => {
          this.AddTaskData.loadproject = data;
        });
    } else {
      this.AddTaskData.loadproject = [];
    }
  }
  FillProjectMainPhases() {
    this.AddTaskData.phaseid = null;
    this.AddTaskData.subphaseid = null;
    if (this.AddTaskData.projectid != null) {
      this._phasestaskService
        .FillProjectMainPhases(this.AddTaskData.projectid)
        .subscribe((data) => {
          this.AddTaskData.loadphases = data;
          if (this.AddTaskData.loadphases.length == 1) {
            this.AddTaskData.phaseid = this.AddTaskData.loadphases[0].id;
            this.FillSubPhases();
          }
        });
    } else {
      this.AddTaskData.loadphases = [];
    }
  }
  FillSubPhases() {
    this.AddTaskData.subphaseid = null;
    if (this.AddTaskData.phaseid != null) {
      this._phasestaskService
        .FillSubPhases(this.AddTaskData.phaseid)
        .subscribe((data) => {
          this.AddTaskData.loadsubphases = data;
          if (this.AddTaskData.loadsubphases.length == 1) {
            this.AddTaskData.subphaseid = this.AddTaskData.loadsubphases[0].id;
          }
        });
    } else {
      this.AddTaskData.loadsubphases = [];
    }
  }
  updateTasktype($event: any) {
    this.AddTaskData.tasknamear = $event.name;
    this.AddTaskData.tasknameen = $event.nameE ?? $event.name;
  }
  resetTaskData() {

    if (this.userG.userPrivileges.includes(111316)) {
      this.FillAllUsersSelectsomeByBranch();
    } else {
      this.FillAllUsersSelectAll();
    }
    //this.FillAllUsersSelectAll();

    this.FillDepartmentSelect();
    this.FillTaskTypeSelect();
    this.FillCustomersOwnProjects();

    this.AddTaskData = {
      userid: null,
      tasktype: null,
      tasknamear: null,
      tasknameen: null,
      customerid: null,
      projectid: null,
      phaseid: null,
      subphaseid: null,
      timetypeid: 2,
      datefrom: new Date(),
      dateto: new Date(),
      timefrom: null,
      timeto: null,
      taskgoal: false,
      projectgoalstxt: null,
      projectgoals: null,

      departmentCheck: false,
      departmentId: null,

      priorty: '1',
      hourTime: 1,

      // loaddepartmentId:[],
      // loaduserid:[],
      // loadtasktype:[],
      // loadcustomer:[],
      // loadproject:[],
      // loadphases:[],
      // loadsubphases:[],

      tasktypedata: {
        id: 0,
        namear: null,
        nameen: null,
      },

      // uploadfile:[],
      TimeMinutestxt: 1,
      RetCheckUserDawamBool: true,
    };
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

  ChangeUser() {
    this.GetAllAttTimeDetails2();
  }

  GetDayName(data: any) {
    return data.dayName;
  }
  GetShift(data: any) {
    try {
      var _1StFromHour = data._1StFromHour;
      var _1StToHour = data._1StToHour;
      var _2ndFromHour = data._2ndFromHour;
      var _2ndToHour = data._2ndToHour;

      var firstshift = '';
      var secondshift = '';
      var fullshifts = '';
      var firststring = '';
      var secondstring = '';
      var shiftstr = '';
      if (_1StFromHour != null && _1StToHour != null) {
        let timefrom = this._sharedService.formatTimeOnly(
          new Date(data._1StFromHour)
        );
        let timeto = this._sharedService.formatTimeOnly(
          new Date(data._1StToHour)
        );

        let timefrom_ampm = this._sharedService.formatAMPMOnly(
          new Date(data._1StFromHour)
        );
        let timeto_ampm = this._sharedService.formatAMPMOnly(
          new Date(data._1StToHour)
        );

        if (timefrom_ampm == 'AM') {
          firststring = 'صباحا';
        } else {
          firststring = 'مساءا';
        }
        if (timeto_ampm == 'AM') {
          secondstring = 'صباحا';
        } else {
          secondstring = 'مساءا';
        }
        if (firststring == 'صباحا') {
          shiftstr = 'الصباح';
        } else {
          shiftstr = 'المساء';
        }
        firstshift =
          shiftstr +
          ' : ' +
          timefrom +
          ' ' +
          firststring +
          ' ' +
          timeto +
          ' ' +
          secondstring;
      }
      if (_2ndFromHour != null && _2ndToHour != null) {
        let timefrom = this._sharedService.formatTimeOnly(
          new Date(data._2ndFromHour)
        );
        let timeto = this._sharedService.formatTimeOnly(
          new Date(data._2ndToHour)
        );

        let timefrom_ampm = this._sharedService.formatAMPMOnly(
          new Date(data._2ndFromHour)
        );
        let timeto_ampm = this._sharedService.formatAMPMOnly(
          new Date(data._2ndToHour)
        );

        if (timefrom_ampm == 'AM') {
          firststring = 'صباحا';
        } else {
          firststring = 'مساءا';
        }
        if (timeto_ampm == 'AM') {
          secondstring = 'صباحا';
        } else {
          secondstring = 'مساءا';
        }
        if (firststring == 'صباحا') {
          shiftstr = 'الصباح';
        } else {
          shiftstr = 'المساء';
        }
        secondshift =
          shiftstr +
          ' : ' +
          timefrom +
          ' ' +
          firststring +
          ' ' +
          timeto +
          ' ' +
          secondstring;
      }
      fullshifts = firstshift + ' ' + secondshift;
      return fullshifts;
    } catch (error) {
      return '';
    }
  }

  changetimetype() {
    if (this.AddTaskData.timetypeid == 1) {
      this.AddTaskData.datefrom = new Date();
      this.AddTaskData.dateto = new Date();
      this.AddTaskData.TimeMinutestxt = this.AddTaskData.hourTime;
    } else if (this.AddTaskData.timetypeid == 2) {
      this.AddTaskData.TimeMinutestxt = null;
      var Difference_In_Time =
        this.AddTaskData.dateto.getTime() - this.AddTaskData.datefrom.getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      this.AddTaskData.TimeMinutestxt = Difference_In_Days + 1;
    }
  }
  CalTotalTime() {
    if (this.AddTaskData.datefrom != null && this.AddTaskData.dateto != null) {
      var Difference_In_Time =
        this.AddTaskData.dateto.getTime() - this.AddTaskData.datefrom.getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      this.AddTaskData.TimeMinutestxt = Difference_In_Days + 1;
    }
  }

  addNewTask(modal: any) {
    if (
      this.AddTaskData.tasktype == null ||
      this.AddTaskData.tasknamear == null ||
      this.AddTaskData.tasknameen == null ||
      this.AddTaskData.customerid == null ||
      this.AddTaskData.projectid == null ||
      this.AddTaskData.phaseid == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    var Value = this.AddTaskData.loadphases.filter(
      (a: { id: any }) => a.id == this.AddTaskData.phaseid
    )[0];
    var TextValue = this.AddTaskData.loadphases.filter(
      (a: { id: any }) => a.id == this.AddTaskData.phaseid
    )[0].name;
    var TaskStatus_V = 1;
    if (TextValue == 'بدون مرحلة رئيسية') {
      TaskStatus_V = 2;
    } else {
      TaskStatus_V = 1;
    }
    var desc = '';

    if (this.AddTaskData.timetypeid == 1 || this.AddTaskData.timetypeid == 2) {
      if (
        this.AddTaskData.timefrom == null ||
        this.AddTaskData.timeto == null
      ) {
        this.toast.error(
          'من فضلك تأكد من بداية المهمة ونهايتها بالتوقيت',
          'رسالة'
        );
        return;
      } else {
        // var V=this.CheckDwamTime(this.AddTaskData.userid);
        // if (V == false) {
        //     this.toast.error("من فضلك تأكد من بداية المهمة ونهايتها بالتوقيت في فترة الدوام", 'رسالة');return;
        // }
      }
    } else {
      if (
        this.AddTaskData.datefrom == null ||
        this.AddTaskData.dateto == null
      ) {
        this.toast.error(
          'من فضلك تأكد من بداية المهمة ونهايتها بالتاريخ',
          'رسالة'
        );
        return;
      }
    }
    this.CalTotalTime();

    var TaskObj: any = {};
    TaskObj.PhaseTaskId = 0;
    TaskObj.ProjSubTypeId = this.AddTaskData.subphaseid;
    TaskObj.Type = 3;
    TaskObj.Status = TaskStatus_V;
    TaskObj.ProjectId = this.AddTaskData.projectid;
    TaskObj.DescriptionAr = this.AddTaskData.tasknamear;
    TaskObj.DescriptionEn = this.AddTaskData.tasknameen;
    TaskObj.UserId = this.AddTaskData.userid;
    TaskObj.TaskType = this.AddTaskData.tasktype;
    TaskObj.DepartmentId = this.AddTaskData.departmentId;
    TaskObj.IsConverted = 0;

    this.AddTaskData.datefrom.setHours(0, 0, 0, 0);
    this.AddTaskData.dateto.setHours(0, 0, 0, 0);
    if (
      this.AddTaskData.datefrom.getTime() == this.AddTaskData.dateto.getTime()
    ) {
      TaskObj.TimeMinutes = this.AddTaskData.hourTime;
    } else {
      TaskObj.TimeMinutes = Math.round(this.AddTaskData.TimeMinutestxt);
    }
    TaskObj.Cost = null;
    TaskObj.TimeType = this.AddTaskData.timetypeid;
    TaskObj.PhasePriority = parseInt(this.AddTaskData.priorty);
    TaskObj.StartDate = null;
    TaskObj.EndDate = null;

    if (this.AddTaskData.timetypeid == 1 || this.AddTaskData.timetypeid == 2) {
      TaskObj.TaskTimeFrom = this._sharedService.formatAMPM(
        this.AddTaskData.timefrom
      );
      TaskObj.TaskTimeTo = this._sharedService.formatAMPM(
        this.AddTaskData.timeto
      );
    } else {
      TaskObj.TaskTimeFrom = null;
      TaskObj.TaskTimeTo = null;
    }

    TaskObj.ExcpectedStartDate = this._sharedService.date_TO_String(
      this.AddTaskData.datefrom
    );
    TaskObj.ExcpectedEndDate = this._sharedService.date_TO_String(
      this.AddTaskData.dateto
    );
    TaskObj.ExecPercentage = 0;

    if (this.AddTaskData.taskgoal == true) TaskObj.ProjectGoals = 1;
    else TaskObj.ProjectGoals = 0;

    if (this.AddTaskData.subphaseid == null) {
      TaskObj.MainPhaseId = this.AddTaskData.phaseid;
      TaskObj.ParentId = this.AddTaskData.phaseid;
      TaskObj.TaskOn = 1;
    } else {
      TaskObj.SubPhaseId = this.AddTaskData.subphaseid;
      TaskObj.ParentId = this.AddTaskData.subphaseid;
      TaskObj.TaskOn = 2;
    }

    if (this.AddTaskData.subphaseid > 0) {
      TaskObj.SubPhaseId = this.AddTaskData.subphaseid;
      TaskObj.ParentId = this.AddTaskData.subphaseid;
      TaskObj.TaskOn = 2;
    } else {
      TaskObj.MainPhaseId = this.AddTaskData.phaseid;
      TaskObj.ParentId = this.AddTaskData.phaseid;
      TaskObj.TaskOn = 1;
    }

    TaskObj.NotVacCalc = this.AddTaskData.notVacCalc;
    var obj = TaskObj;
    this._phasestaskService
      .SaveNewProjectPhasesTasks_E(obj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          modal?.dismiss();
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.SaveFiles(result.returnedParm);
          this.resetTaskData();
          this.refreshData();
          if(this.WhatsAppData.sendactivationProject==true)
          {
            this.SendWhatsAppTask(result.returnedParm,null);
          }
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      });
  }
  refreshData() {
    this.loadPrivTreeSearch();
    this.loadPrivTreeLateSearch();
    if (this.selectedTask1?.length) {
      this.GetTaskListtxt(parseInt(this.selectedTask1[0].phaseid));
    }
    if (this.selectedTask2?.length) {
      this.GetTaskListtxt_Late(parseInt(this.selectedTask2[0].phaseid));
    }
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
    this.LoadTabSetting();
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
      this.RemTimeProjData.statusLate = 0;
      this.RemTimeProjData.produrationexpect = null;
    }
  }

  RemTimeProjData: any = {
    timerem: null,
    prendexpect: null,
    footerdetails: null,
    produrationexpect: null,
    statusLate: 0,
  };

  getremainprojectdate(stdate: any, enddat: any) {
    var date1 = new Date(enddat);
    var date2 = new Date();
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);
    var Difference_In_Time = date1.getTime() - date2.getTime();

    var Difference_In_Days = parseInt(
      (Difference_In_Time / (1000 * 3600 * 24)).toString()
    );
    Difference_In_Days = Difference_In_Days + 1;

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
      this.RemTimeProjData.statusLate = 0;
    } else if (date1 < date2) {
      this.RemTimeProjData.prendexpect = 'مشروع متأخر ';
      this.RemTimeProjData.footerdetails =
        'هذا المشروع متاخر ، ولا يمكن اضافة مهام عليه الا بعد تمديد مدة المشروع';
      this.RemTimeProjData.statusLate = 1;
    } else {
      this.RemTimeProjData.prendexpect = null;
      this.RemTimeProjData.footerdetails = null;
      this.RemTimeProjData.statusLate = 0;
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
  public selectedNode = null;
  model2: any;
  EditData: any = {
    SettingData: [],
    nodeArray: [],
    linkArray: [],
  };

  public setSelectedNode(node: any) {
    this.selectedNode = node;
  }

  LoadTabSetting() {
    if (this.AddTaskData.projectid) {
      this.getProjectSettingEdit(this.AddTaskData.projectid);
    } else {
      this.EditData.nodeArray = [];
      this.EditData.linkArray = [];
      this.nodeDataArray = [];
      this.linkDataArray = [];
    }
  }
  ProjectName: any;
  getProjectSettingEdit(projectid: any) {
    this.EditData.nodeArray = [];
    this.EditData.linkArray = [];
    this.nodeDataArray = [];
    this.linkDataArray = [];

    if (projectid == null) {
      this.model2 = new go.GraphLinksModel(
        this.nodeDataArray,
        this.linkDataArray
      );
      return;
    }
    this.ProjectName = this.AddTaskData.loadproject.filter(
      (ele: { id: any }) => ele.id == projectid
    )[0].name;

    this._projectsettingService.GetAllNodesTasks(projectid).subscribe((res) => {
      this.EditData.SettingData = res;
      this.EditData.nodeArray.push({
        key: 0,
        loc: '-584 -74',
        name: this.ProjectName,
        colorfill: '#0fac03',
      });
      res.nodeDataArray.forEach((r: any) => {
        if (r.nodeLocation != null) {
          if (r.type === 1) {
            //mainphase
            this.EditData.nodeArray.push({
              key: r.settingId,
              loc: r.nodeLocation,
              name: r.descriptionAr,
              isGroup: true,
              colorfill: '#70b9dc',
            });
          } else if (r.type === 2) {
            //subphase
            this.EditData.nodeArray.push({
              key: r.settingId,
              loc: r.nodeLocation,
              name: r.descriptionAr,
              group: r.parentId,
              isGroup: true,
              colorfill: '#b7e89d',
            });
          } else {
            ///task
            this.EditData.nodeArray.push({
              key: r.settingId,
              loc: r.nodeLocation,
              name: r.descriptionAr,
              group: r.parentId,
              toolTipName: r.userName,
              colorfill: '#fe9100',
            });
          }
        } else {
          if (r.type === 1) {
            //mainphase
            this.EditData.nodeArray.push({
              key: r.settingId,
              loc: '50 50',
              size: '150 50',
              name: r.descriptionAr,
              isGroup: true,
              colorfill: '#70b9dc',
            });
          } else if (r.type === 2) {
            //subphase
            this.EditData.nodeArray.push({
              key: r.settingId,
              loc: '50 50',
              size: '150 50',
              name: r.descriptionAr,
              group: r.parentId,
              isGroup: true,
              colorfill: '#b7e89d',
            });
          } else {
            ///task
            this.EditData.nodeArray.push({
              key: r.settingId,
              name: r.descriptionAr,
              group: r.parentId,
              toolTipName: r.userName,
              colorfill: '#fe9100',
            });
          }
        }
      });
      res.firstLevelNode.forEach((r: any) => {
        this.EditData.linkArray.push({ from: 0, to: r.settingId, name: '' });
      });
      res.linkDataArray.forEach((r: any) => {
        this.EditData.linkArray.push({
          from: r.predecessorId,
          to: r.successorId,
          name: '',
        });
      });

      this.nodeDataArray = this.EditData.nodeArray;
      this.linkDataArray = this.EditData.linkArray;
      this.model2 = new go.GraphLinksModel(
        this.nodeDataArray,
        this.linkDataArray
      );
    });
  }

  //#endregion
  //-------------------------------(End)------Add TAsk---------------------------------------------------
  gaugeType: any = 'semi';
  gaugeValue = 28.3;
  gaugeLabel = 'Speed';
  gaugeAppendText = 'km/hr';

  GlobalRowSelectTaskOrLate: any;
  open(content: any, type?: any, data?: any) {
    if (type == 'task') {
      this.GlobalRowSelectTaskOrLate = this.TaskData;
    } else if (type == 'latetask') {
      //ht8yr l tht de l late
      this.GlobalRowSelectTaskOrLate = this.TaskDataLate;
    } else if (type == 'ConvertVac') {
      if (this.Searchdata.userId_S == null) {
        this.toast.error('من فضلك أختر مستخدم أولا من البحث', 'رسالة');
        return;
      } else {
        this.FillUsersTasksVacationSelect();
        this.FillConverVacUser();
      }
    } else if (type == 'Converttouser') {
      if (this.Searchdata.userId_S == null) {
        this.toast.error('من فضلك أختر مستخدم أولا من البحث', 'رسالة');
        return;
      } else {
        this.FillConvertAllUser();
      }
    } else if (type == 'addNewTask') {
      this.resetTaskData();
    } else if (type == 'addtasktype') {
      this.resetTaskType();
    } else if (type == 'deletetasktype') {
      this.getTasktypeRow(data);
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
        backdrop: 'static',
        keyboard: false,
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

  private getDismissReason(reason: any, type?: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d: any) {
      return d.name_ar.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;

    if (this.table) {
      this.table!.offset = 0;
    }
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

    this.getAddress(lat, lng);
  }

  markerDragEnd(event: any) {
    this.latitude = event.latLng.lat();
    this.longitude = event.latLng.lng();
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
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }


  SendWhatsAppTask(taskId:any,projectid:any) {
    const formData = new FormData();
    if(taskId!=null){formData.append('taskId', taskId);}
    if(projectid!=null){formData.append('projectid', projectid);}
    formData.append('environmentURL', environment.PhotoURL);
    this._phasestaskService.SendWhatsAppTask(formData).subscribe((result: any) => {

      });
  }
}
