import { update_add_customerVM } from './../../../core/Classes/ViewModels/update_add-CustomerVM';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ProjectsettingService } from 'src/app/core/services/pro_Services/projectsetting.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as go from 'gojs';
import { ProjectType } from 'src/app/core/Classes/DomainObjects/projectType';
import { ProjectSubTypes } from 'src/app/core/Classes/DomainObjects/projectSubTypes';
import { SettingsVM } from 'src/app/core/Classes/ViewModels/settingsVM';
import { Settings } from 'src/app/core/Classes/DomainObjects/settings';
import { PhasestaskService } from 'src/app/core/services/pro_Services/phasestask.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import printJS from 'print-js';
import { NgxPrintElementService } from 'ngx-print-element';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-project-setting',
  templateUrl: './project-setting.component.html',
  styleUrls: ['./project-setting.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectSettingComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent | any;

  currentPage = 'view';
//------------------------------------dawoud----------------------------------------------
  public selectedNode = null;

  public model: go.TreeModel = new go.TreeModel(
    [
      { 'key': 1, 'name': 'Stella Payne Diaz' },
      { 'key': 2, 'name': 'Luke Warm', 'parent': 1 },
      { 'key': 3, 'name': 'Meg Meehan Hoffa', 'parent': 2 },
      { 'key': 4, 'name': 'Peggy Flaming', 'parent': 1 },
      { 'key': 5, 'name': 'Saul Wellingood', 'parent': 4 },
      { 'key': 6, 'name': 'Al Ligori', 'parent': 2 },
      { 'key': 7, 'name': 'Dot Stubadd', 'parent': 3 },
      { 'key': 8, 'name': 'Les Ismore', 'parent': 5 },
      { 'key': 9, 'name': 'April Lynn Parris', 'parent': 6 },
      { 'key': 10, 'name': 'Xavier Breath', 'parent': 4 },
      { 'key': 11, 'name': 'Anita Hammer', 'parent': 5 },
      { 'key': 12, 'name': 'Billy Aiken', 'parent': 10 },
      { 'key': 13, 'name': 'Stan Wellback', 'parent': 10 },
      { 'key': 14, 'name': 'Marge Innovera', 'parent': 10 },
      { 'key': 15, 'name': 'Evan Elpus', 'parent': 5 },
      { 'key': 16, 'name': 'Lotta B. Essen', 'parent': 3,group: 17 },
      { 'key': 17, 'name': 'Dawoud Group', isGroup: true }

    ]
  );





  model2 :any;
  nodeDataArray = [
    { key: 1,loc:"0 0" },
    { key: 2, group: 4,color: 'lightblue' },
    { key: 3, group: 4,color: 'orange' },
    { key: 4, isGroup: true,color: 'lightgreen' },
    { key: 5 }
  ];
  linkDataArray = [
    { from: 1, to: 2 },  // from outside the Group to inside it
    { from: 2, to: 3 },  // this link is a member of the Group
    { from: 4, to: 5}  // from the Group to a Node
  ];

  public setSelectedNode(node:any) {
    this.selectedNode = node;
  }
//------------------------------------dawoud----------------------------------------------
  EditData:any={
    SettingData:[],
    nodeArray:[],
    linkArray:[],
  }
  //Data Fill
  public _projectType: ProjectType; public _projectSubTypes: ProjectSubTypes;
   public _settingsVM: SettingsVM; public _settings: Settings;
   projectTypenameAr_M=null; projectSubTypnameAr_M=null; mainphasenameAr_M=null;submainphasenameAr_M=null;
   projectTypenameEn_M=null; projectSubTypnameEn_M=null; mainphasenameEn_M=null;submainphasenameEn_M=null;
   projectSubTyptime_M=null;
   projectTypeList:any = [];projectSubTypesList:any = [];mainphaseList:any = [];submainphaseList:any = [];

   rowsprojectType:any = []; tempprojectType: any = [];rowsprojectSubTypes:any = []; tempprojectSubTypes: any = [];
   rowsmainphase:any = []; tempmainphase: any = [];rowssubmainphase:any = []; tempsubmainphase: any = [];
   rowsoption:any = []; tempoption: any = []; optionList:any = [];
  //End Data Fill

  title: any = {
    main: {
      name: {
        ar: 'ادارة المشاريع',
        en: 'Projects Management',
      },
      link: '/projects',
    },
    sub: {
      ar: ' سير عمل المشروع      ',
      en: 'track projects',
    },
  };

  titleAdd: any = {
    main: {
      name: {
        ar: 'ادارة المشاريع',
        en: 'Projects Management',
      },
      link: '/projects',
    },
    sub: {
      ar: ' سير عمل المشروع      ',
      en: 'track projects',
    },
    child: {
      ar: 'اضافة سير عمل جديد',
      en: 'add project workflow',
    },
  };

  titleEdit: any = {
    main: {
      name: {
        ar: 'ادارة المشاريع',
        en: 'Projects Management',
      },
      link: '/projects',
    },
    sub: {
      ar: ' سير عمل المشروع      ',
      en: 'track projects',
    },
    child: {
      en: 'Edit project workflow',
      ar: 'تعديل سير عمل المشروع',
    },
  };

  missionsDisplayedColumns: string[] = [
    'select',
    'name',
    'duration',
    'assigned',
    'desc',
    'operations',
  ];

  selectedUser: any;
  users: any;
  deletedrow:any;
  closeResult = '';
  userG : any = {};


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  workOrdersDisplayedColumns: string[] = [
    'projectWorkflowNo',
    'projectWorkflowDesc',
    'projectType',
    'subProjectType',
    'duration',
    'total_duration',
    'added_date',
    'user',
    'operations',
  ];
  projectWorkflowsDataSourceTemp:any = [];

  projectWorkflowsDataSource = new MatTableDataSource();

  missionsDataSourceTemp:any = [];

  missionsDataSource = new MatTableDataSource();

  workFlows: any;

  modalDetails: any = {
    id: null,
    projectWorkflowNo: null,
    projectWorkflowDesc: null,
    projectType: null,
    subProjectType: null,
    duration: null,
    total_duration: null,
    added_date: null,
    user: null,
    mainStage: null,
    subStage: null,
  };

  AddPotionParam: any = {
    id: null,
    namear: null,
    nameen: null,
    time: null,
    type: 0, //for 4 popup (1 projtype),(2 projsubtype),(3 mainphase),(4 submainphase)
  };

nameArGrid:any;
nameEnGrid:any;

  startDate = new Date();
  endDate = new Date();

  filterType: any;
  filterByDate: any;

  linkProject: any;

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

  missions: any;


  load_ProjectType_From :any;
  load_ProjectSubType_From :any;
  load_ProjectType_To :any;
  load_ProjectSubType_To :any;


  Sel_ProjectType_From:any;
  Sel_ProjectSubType_From:any;
  Sel_ProjectType_To:any;
  Sel_ProjectSubType_To:any;

  constructor(private modalService: NgbModal, private ar: ActivatedRoute,
    private _projectsettingService: ProjectsettingService,
    private _phasestaskService: PhasestaskService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private translate: TranslateService,
    private print: NgxPrintElementService,
    private authenticationService: AuthenticationService,) {
    console.log(window.history.state);
    this.userG = this.authenticationService.userGlobalObj;

    if (window.history.state?.type) {
      this.currentPage = window.history.state?.type;
      this.modalDetails = {};
      this.modalDetails['proSettingId'] = 1;
    } else {
      this.currentPage = 'view';
    }
  }

  ngOnInit(): void {
    this.nodeDataArray=[];
    this.linkDataArray=[];
    this.model2 = new go.GraphLinksModel(this.nodeDataArray, this.linkDataArray);
    this.GetAllSettingsByProjectIDwithoutmainAll();
    this.getData();
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

    // this.missions = [
    //   {
    //     name: 'adawdw',
    //     duration: 'adwawd',
    //     assigned: 'adawc',
    //     desc: 'acaqwwad',
    //   },
    // ];
    // this.missionsDataSource = new MatTableDataSource(this.missions);
  }
  //-----------------ProjectSettingSearch--------------------------------
  getData(){
    this._projectsettingService.getAllProjectSettingSearch().subscribe(data=>{
        this.projectWorkflowsDataSource = new MatTableDataSource(data.result);
        this.projectWorkflowsDataSourceTemp=data.result;
        this.projectWorkflowsDataSource.paginator = this.paginator;
        // this.projectWorkflowsDataSource.sort = this.sort;
    });
  }
  getduration(o:any){
    var timerem = "";
    if (parseInt(o.expectedTime) > 0) {
        if (parseInt(o.expectedTime) < 30 && parseInt(o.expectedTime) > 0) {
            timerem = parseInt(o.expectedTime) + "يوم";
        } else if (parseInt(o.expectedTime) == 30) {
            timerem = "شهر";
        }
        else if (parseInt(o.expectedTime) > 30) {
            timerem = parseInt((parseInt(o.expectedTime) / 30).toString()) + "شهر"
            + parseInt((parseInt(o.expectedTime) % 30).toString()) + "يوم";
        }
    }
    return timerem;
  }
  calculatetsksduration2(element:any) {
    var phaseid=element.projectSubtypeId;
    if(phaseid!=null)
    {
      var dayes = 0,months = 0,hours = 0,weeks = 0;
      var List=this.publicCalcList.filter((a: { projSubTypeId: any; })=>a.projSubTypeId==phaseid)
      if(List!=null)
      {
        List.forEach((r: any) => {
          if (r.timeType == 2) {
            dayes = dayes + parseInt(r.timeMinutes ?? 0);
          } else if (r.timeType == 3) {
            weeks = weeks + parseInt(r.timeMinutes ?? 0);
          } else if (r.timeType == 4) {
            months = months + parseInt(r.timeMinutes ?? 0);
          } else if (r.timeType == 1) {
            hours = hours + parseInt(r.timeMinutes ?? 0);
          }
          else{
            hours = hours + parseInt(r.timeMinutes ?? 0);
          }
        });
        var totaldayes = 0,dayeshour = 0,allemonth = 0,remainhour = 0,totalweek = 0,alldayes = 0;
        totaldayes = parseInt((weeks * 7 + months * 30 + dayes).toString());
        dayeshour = parseInt((hours / 24).toString());
        remainhour = parseInt((hours % 24).toString());
        totaldayes = parseInt((totaldayes + dayeshour).toString());
        allemonth = parseInt((totaldayes / 30).toString());
        totalweek = parseInt(((totaldayes % 30) / 7).toString());
        alldayes = parseInt(((totaldayes % 30) % 7).toString());
        var monthstr = '',weekstr = '',daystr = '',hourstr = '';

        if (allemonth > 0) {monthstr = allemonth + ' شهر ';}
        if (totalweek > 0) {weekstr = totalweek + ' اسبوع ';}
        if (alldayes > 0) {daystr = alldayes + ' يوم ';}
        if (remainhour > 0) {hourstr = remainhour + ' ساعة ';}
        var duration = monthstr + weekstr + daystr + hourstr;
        return duration;
      }
      else{return null;}
    }
    {return null;}
  }
 calculatetsksduration(element:any) {
  var phaseid=element.projectSubtypeId;
  if(phaseid!=null)
  {
    this._projectsettingService.GetAllSettingsByProjectIDwithoutmain(phaseid).subscribe(res=>{
      if(res!=null)
      {
        var timehour = 0, timeday = 0, timeweek = 0, timemonth = 0, timehourstr, timedaystr, timeweekstr, timemonthstr, fulltimestr;
        res.forEach((r: any) => {
          if (r.timeType == 1) {
              timehour = timehour + r.timeMinutes;
          }
          else if (r.timeType == 2) {
              timeday = timeday + r.timeMinutes;
          }
          else if (r.timeType == 3) {
              timeweek = timeweek + r.timeMinutes;
          }
          else {
              timemonth = timemonth + r.timeMinutes;
          }
        });
        if (timehour > 0) {
            timehourstr = timehour + "ساعة"
        } else {
            timehourstr = "";
        }

        if (timeday > 0) {
            timedaystr = timeday + "يوم"

        } else {
            timedaystr = "";
        }
        if (timeweek > 0) {
            timeweekstr = timeweek + "اسبوع"

        } else {
            timeweekstr = "";
        }
        if (timemonth > 0) {
            timemonthstr = timemonth + "شهر";
        } else {
            timemonthstr = "";
        }
        fulltimestr = timemonthstr + timeweekstr + timedaystr + timehourstr;
        return fulltimestr;;
      }
      else{return null;}
    });
  }
  {return null;}
}




  confirm() {
    this._projectsettingService.deleteProjectSetting(this.deletedrow.proSettingId).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.getData();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
    });
  }

  fill_ProjectType_From(){
    this._projectsettingService.FillProjectTypeSelect().subscribe(data=>{
      this.load_ProjectType_From=data;
    });
  }
  fill_ProjectSubType_From(param:any){
    this._projectsettingService.FillProjectSubTypesSelect(param).subscribe(data=>{
      this.load_ProjectSubType_From=data;
    });
  }
  fill_ProjectType_To(){
    this._projectsettingService.FillProjectTypeSelect().subscribe(data=>{
      this.load_ProjectType_To=data;
    });
  }
  fill_ProjectSubType_To(param:any){
    this._projectsettingService.FillProjectSubTypesSelect(param).subscribe(data=>{
      this.load_ProjectSubType_To=data;
    });
  }
//----------------------------------Select Change Fn-------------------------------
  ProjectType_From_Change(){
    this.Sel_ProjectSubType_From=null;
    this.Sel_ProjectType_To=null;
    this.Sel_ProjectSubType_To=null;
    var val=this.Sel_ProjectType_From;
    if(val==null){val=0;}
    this.fill_ProjectSubType_From(val);
  }
  ProjectType_To_Change(){
    this.Sel_ProjectSubType_To=null;
    var val=this.Sel_ProjectType_To;
    if(val==null){val=0;}
    this.fill_ProjectSubType_To(val);
  }
  ProjectSubType_From_Change(){
    this.Sel_ProjectType_To=null;
    this.Sel_ProjectSubType_To=null;
    this.fill_ProjectType_To();
  }

  //-----------------------------(End)---Select Change Fn-----------------------------

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    const tempsource = this.projectWorkflowsDataSourceTemp.filter(function (d: any) {
      return (d.proSettingNo?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.proSettingNote?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.projectTypeName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.projectSubTypeName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.userName?.trim().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.projectWorkflowsDataSource = new MatTableDataSource(tempsource);
  }


  copyprojectWorkflow(modal:any) {
    if(this.Sel_ProjectSubType_From==this.Sel_ProjectSubType_To)
    {
      this.toast.error("لا يمكنك النسخ لنفس نوع المشروع الفرعي",this.translate.instant("Message"));
      return;
    }
    this._projectsettingService.transferSetting(this.Sel_ProjectSubType_From,this.Sel_ProjectSubType_To).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        modal?.dismiss()
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
    });
  }

  //-----------------(End) ProjectSettingSearch--------------------------------------------------------------------------------

  //-----------------ProjectSettingEdit--------------------------------
  setModalDetails(data: any) {
    this.getAllProjectTypes();
    this.modalDetails = data;
    console.log("------------------------------------------");

    this.modalDetails.proSettingId = data.proSettingId;
    this.modalDetails.projectWorkflowNo = data.proSettingNo;
    this.modalDetails.projectWorkflowDesc = data.proSettingNote;
    this.modalDetails.projectType = data.projectTypeId ;
    this.modalDetails.mainStage=null;
    this.modalDetails.subStage=null;
    this.getAllProjectSubTypes();
    this.modalDetails.subProjectType = data.projectSubtypeId;
    this.getAllMainphases();
    this.getProSettingnumber();
    this.GetTimePeriordBySubTypeId();
    this.GetAllSettingsByProjectIDwithoutmain();
    this.getProjectSettingEdit(this.modalDetails.subProjectType);
    this.rowssubmainphase=[]; this.tempsubmainphase=[]; this.submainphaseList=[];
  }
  getProjectSettingEdit(ProSubTypeId:any){

    this.EditData.nodeArray=[];
    this.EditData.linkArray=[];
    this.nodeDataArray =[];
    this.linkDataArray =[];

    if(ProSubTypeId==null)
    {
      this.model2 = new go.GraphLinksModel(this.nodeDataArray, this.linkDataArray);
      return;
    }
    this._projectsettingService.GetAllNodesTasks(ProSubTypeId).subscribe(res=>{
        this.EditData.SettingData=res;
        this.EditData.nodeArray.push({ "key": 0, "loc": "-584 -74", "name": this.modalDetails.projectSubTypeName??this.subProjectTypeName_Public, "colorfill": "#0fac03" })
        res.nodeDataArray.forEach((r: any) => {
          debugger
          if (r.nodeLocation != null) {
            if (r.type === 1) {   //mainphase
              this.EditData.nodeArray.push({ "key": r.settingId, "loc": r.nodeLocation, "name": r.descriptionAr, isGroup: true, "colorfill": "#70b9dc" })
            }
            else if (r.type === 2) { //subphase
              this.EditData.nodeArray.push({ "key": r.settingId, "loc": r.nodeLocation, "name": r.descriptionAr, group: r.parentId, isGroup: true, "colorfill": "#b7e89d"  })
            }
            else {  ///task
              this.EditData.nodeArray.push({ "key": r.settingId, "loc": r.nodeLocation, "name": r.descriptionAr, "namee": r.userName, group: r.parentId, "toolTipName": r.userName, "colorfill": "#fe9100" })
            }
        }
        else {
            if (r.type === 1) {  //mainphase
              this.EditData.nodeArray.push({ "key": r.settingId, "loc": "50 50", size: "150 50", "name": r.descriptionAr, isGroup: true, "colorfill": "#70b9dc" })
            }
            else if (r.type === 2) { //subphase
              this.EditData.nodeArray.push({ "key": r.settingId, "loc": "50 50", size: "150 50", "name": r.descriptionAr, group: r.parentId, isGroup: true, "colorfill": "#b7e89d"  })
            }
            else { ///task
              this.EditData.nodeArray.push({ "key": r.settingId, "name": r.descriptionAr, "namee": r.userName, group: r.parentId, "toolTipName": r.userName, "colorfill": "#fe9100" })
            }
        }
        });
        res.firstLevelNode.forEach((r: any) => {
          this.EditData.linkArray.push({ "from": 0, "to": r.settingId, "name": "" })
        });
        res.linkDataArray.forEach((r: any) => {
          this.EditData.linkArray.push({ "from": r.predecessorId, "to": r.successorId, "name": "" })
        });

        this.nodeDataArray=this.EditData.nodeArray;
        this.linkDataArray=this.EditData.linkArray;

        // console.log("this.nodeDataArray------------ linkDataArray");
        // console.log(this.nodeDataArray);
        // console.log(this.linkDataArray);

        this.model2 = new go.GraphLinksModel(this.nodeDataArray, this.linkDataArray);
    });
  }
  //-----------------(End) ProjectSettingEdit--------------------------------


  //--------------------------------------ProjectType-------------------------------------------------
  saveProjectType(data: any) {
    debugger
    if(this.projectTypenameAr_M==null || this.projectTypenameEn_M==null)
    {
      this.toast.error("من فضلك أكمل البيانات", this.translate.instant("Message"));
      return;
    }
    this._projectType=new ProjectType();
    this._projectType.typeId=0;
    this._projectType.nameAr=this.projectTypenameAr_M;
    this._projectType.nameEn=this.projectTypenameEn_M;
    var obj=this._projectType;
    this._projectsettingService.saveProjectType(obj).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.projectTypenameAr_M=null; this.projectTypenameEn_M=null; this.getAllProjectTypes();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
    });
  }
  getAllProjectTypes(){
    this._projectsettingService.getAllProjectTypes("").subscribe(data=>{
      this.rowsprojectType=data; this.tempprojectType=data; this.projectTypeList=data;
      this.rowsoption = data; this.tempoption = data; this.optionList = data;

    });
  }
  updateFilterprojectType(event: any) {
    const val = event.target.value.toLowerCase();
    const tempprojectType = this.tempprojectType.filter(function (d: any) {
      return (d.nameAr?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      || (d.nameEn?.trim().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rowsprojectType = tempprojectType;
    this.rowsoption=tempprojectType;
    if (this.table) {
      this.table!.offset = 0;
    }
  }
  editprojectType(row: any, rowIndex: any) {
    debugger
    if(row.nameAr==null || row.nameEn==null)
    {
      this.toast.error("من فضلك أكمل البيانات", this.translate.instant("Message"));
      return;
    }
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    this._projectType=new ProjectType();
    this._projectType.typeId=row.typeId;
    this._projectType.nameAr=row.nameAr;
    this._projectType.nameEn=row.nameEn;
    this._projectsettingService.saveProjectType(this._projectType).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.getAllProjectTypes();
      }
      else{
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.getAllProjectTypes();
      }
    });
  }
  deleteprojectType(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    this._projectType=new ProjectType();
    this._projectType.typeId=row.typeId;
    this._projectsettingService.DeleteProjectType(this._projectType.typeId).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.getAllProjectTypes();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
    });
  }
  //------------------------------------(End)--ProjectType-------------------------------------------------
  //--------------------------------------ProjectSubType-------------------------------------------------
  SaveProjectSubType(data: any) {
    debugger
    if(this.projectSubTypnameAr_M==null || this.projectSubTypnameEn_M==null)
    {
      this.toast.error("من فضلك أكمل البيانات", this.translate.instant("Message"));
      return;
    }
    this._projectSubTypes=new ProjectSubTypes();
    this._projectSubTypes.subTypeId=0;
    this._projectSubTypes.nameAr=this.projectSubTypnameAr_M
    this._projectSubTypes.projectTypeId=this.modalDetails.projectType;
    this._projectSubTypes.nameEn=this.projectSubTypnameEn_M;
    this._projectSubTypes.timePeriod=String(this.projectSubTyptime_M);

    var obj=this._projectSubTypes;
    this._projectsettingService.SaveProjectSubType(obj).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.projectSubTypnameAr_M=null; this.projectSubTypnameEn_M=null;  this.projectSubTyptime_M=null; this.getAllProjectSubTypes();
        //this.AddPotionParam.namear=null;this.AddPotionParam.nameen=null;this.getAllProjectSubTypes();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
    });
  }
  getAllProjectSubTypes(){
    if(this.modalDetails.projectType!=null)
    {
      this._projectsettingService.GetAllProjectSubsByProjectTypeId(this.modalDetails.projectType).subscribe(data=>{
        this.rowsprojectSubTypes=data; this.tempprojectSubTypes=data; this.projectSubTypesList=data;
        this.rowsoption = data; this.tempoption = data; this.optionList = data;

      });
    }
    else
    {
      this.rowsprojectSubTypes=[]; this.tempprojectSubTypes=[]; this.projectSubTypesList=[];
      this.rowsoption = []; this.tempoption = []; this.optionList = [];

    }
  }
  updateFilterprojectsubType(event: any) {
    const val = event.target.value.toLowerCase();
    const tempprojectsubType = this.tempprojectSubTypes.filter(function (d: any) {
      return (d.nameAr?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      || (d.nameEn?.trim().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rowsprojectSubTypes = tempprojectsubType;
    this.rowsoption = tempprojectsubType;

    if (this.table) {
      this.table!.offset = 0;
    }
  }
  editprojectsubType(row: any, rowIndex: any) {
    if(row.nameAr==null || row.nameEn)
    {
      this.toast.error("من فضلك أكمل البيانات", this.translate.instant("Message"));
      return;
    }
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    this._projectSubTypes=new ProjectSubTypes();
    this._projectSubTypes.subTypeId=row.subTypeId;
    this._projectSubTypes.projectTypeId=row.projectTypeId;
    this._projectSubTypes.timePeriod=row.timePeriod;
    this._projectSubTypes.nameAr=row.nameAr;
    this._projectSubTypes.nameEn=row.nameEn;

    this._projectsettingService.SaveProjectSubType(this._projectSubTypes).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.getAllProjectSubTypes();
      }
      else{
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.getAllProjectSubTypes();
      }
    });
  }
  deleteprojectsubType(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    this._projectSubTypes=new ProjectSubTypes();
    this._projectSubTypes.subTypeId=row.subTypeId;
    this._projectsettingService.DeleteProjectSubTypes(this._projectSubTypes.subTypeId).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.getAllProjectSubTypes();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
    });
  }
  //------------------------------------(End)--ProjectSubType-------------------------------------------------


  //Data Fill
  //--------------------------------------Mainphase-------------------------------------------------
  SaveSettings(data: any,type:any) {
    debugger
    if(type==1){
      if(this.mainphasenameAr_M==null || this.mainphasenameEn_M==null)
      {
        this.toast.error("من فضلك أكمل البيانات", this.translate.instant("Message"));
        return;
      }
    }
    else
    {
      if(this.submainphasenameAr_M==null || this.submainphasenameEn_M==null)
      {
        this.toast.error("من فضلك أكمل البيانات", this.translate.instant("Message"));
        return;
      }
    }
    this._settings=new Settings();
    this._settings.settingId=0;
    if(type==1){
      this._settings.descriptionAr=this.mainphasenameAr_M;
      this._settings.descriptionEn=this.mainphasenameEn_M;
    }
    else
    {
      this._settings.descriptionAr=this.submainphasenameAr_M;
      this._settings.descriptionEn=this.submainphasenameEn_M;
      this._settings.parentId=this.modalDetails.mainStage;
    }

    this._settings.projSubTypeId=this.modalDetails.subProjectType;
    this._settings.type=type;

    var obj=this._settings;
    this._projectsettingService.SaveSettings(obj).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        //this.AddPotionParam.namear=null;this.AddPotionParam.nameen=null;
        this.getProjectSettingEdit(this.modalDetails.subProjectType);

        if(type==1)
        {
          this.mainphasenameAr_M=null; this.mainphasenameEn_M=null;
          this.getAllMainphases();
        }
        else
        {
          this.submainphasenameAr_M=null; this.submainphasenameEn_M=null;
          this.getAllSubPhases();
        }

      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
    });
  }
  getAllMainphases(){
    if(this.modalDetails.subProjectType!=null)
    {
      this._projectsettingService.GetAllMainPhases(this.modalDetails.subProjectType).subscribe(data=>{
        this.rowsmainphase=data; this.tempmainphase=data; this.mainphaseList=data;
        this.rowsoption = data; this.tempoption = data; this.optionList = data;

      });
    }
    else
    {
      this.rowsmainphase=[]; this.tempmainphase=[]; this.mainphaseList=[];
      this.rowsoption = []; this.tempoption = []; this.optionList = [];

    }
  }
  getAllSubPhases(){
    if(this.modalDetails.mainStage!=null)
    {
      this._projectsettingService.GetAllSubPhases(this.modalDetails.mainStage).subscribe(data=>{
        this.rowssubmainphase=data; this.tempsubmainphase=data; this.submainphaseList=data;
        this.rowsoption = data; this.tempoption = data; this.optionList = data;
      });
    }
    else
    {
      this.rowssubmainphase=[]; this.tempsubmainphase=[]; this.submainphaseList=[];
      this.rowsoption = []; this.tempoption = []; this.optionList = [];
    }
  }
  updateFilterSettings_Main(event: any) {
    const val = event.target.value.toLowerCase();
    const tempmainphase = this.tempmainphase.filter(function (d: any) {
      return (d.descriptionAr?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      || (d.descriptionEn?.trim().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rowsmainphase = tempmainphase;
    this.rowsoption = tempmainphase;

    if (this.table) {
      this.table!.offset = 0;
    }
  }
  updateFilterSettings_SubMain(event: any) {
    const val = event.target.value.toLowerCase();
    const tempsubmainphase = this.tempsubmainphase.filter(function (d: any) {
      return (d.descriptionAr?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      || (d.descriptionEn?.trim().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rowssubmainphase = tempsubmainphase;
    this.rowsoption = tempsubmainphase;

    if (this.table) {
      this.table!.offset = 0;
    }
  }
  editSettings(row: any, rowIndex: any,type:any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    this._settings=new Settings();
    this._settings.settingId=row.settingId;
    this._settings.descriptionAr=row.descriptionAr;
    this._settings.descriptionEn=row.descriptionEn;
    this._settings.projSubTypeId=row.subProjectType;
    this._settings.type=type;


    this._projectsettingService.SaveSettings(this._settings).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
      }
      else{
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
      }
      this.getProjectSettingEdit(this.modalDetails.subProjectType);

      if(type==1)this.getAllMainphases();
      else this.getAllSubPhases();
    });
  }
  deleteSettings(row: any, rowIndex: any,type:any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    this._settings=new Settings();
    this._settings.settingId=row.settingId;
    this._projectsettingService.DeleteSettings(this._settings.settingId).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.getProjectSettingEdit(this.modalDetails.subProjectType);
        if(type==1)this.getAllMainphases();
        else this.getAllSubPhases();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
    });
  }
  //------------------------------------(End)--ProjectSubType-------------------------------------------------

  getProSettingnumber(){
    if(this.modalDetails.projectType!=null && this.modalDetails.subProjectType!=null)
    {
      this._projectsettingService.getProSettingnumber(this.modalDetails.projectType,this.modalDetails.subProjectType).subscribe(data=>{
        if(data!=null)
        {
          this.modalDetails.proSettingId=data.proSettingId;
          this.modalDetails.projectWorkflowNo=data.proSettingNo;
          this.modalDetails.projectWorkflowDesc=data.proSettingNote;
        }
        else{
          this.modalDetails.proSettingId=0;
          this.modalDetails.projectWorkflowNo=null;
          this.modalDetails.projectWorkflowDesc=null;
        }
      });
    }
    else
    {
      this.modalDetails.proSettingId=0;
      this.modalDetails.projectWorkflowNo=null;
      this.modalDetails.projectWorkflowDesc=null;
    }
  }

  GetTimePeriordBySubTypeId(){
    var durtion="";
    if(this.modalDetails.subProjectType!=null)
    {
      this._projectsettingService.GetTimePeriordBySubTypeId(this.modalDetails.subProjectType).subscribe(res=>{
        if(res!=null)
        {
          var timeP=0;
          if(res.timePeriod==null || res.timePeriod=="")
          {
            timeP=0;
          }
          else
          {
            timeP=parseInt(res.timePeriod);
          }
          if (timeP > 0) {
            if (timeP < 30) {
                durtion = timeP.toString() + "يوم"
            } else if (timeP == 30) {
                durtion = "شهر";
            }
            else if (timeP > 30) {

                durtion = (timeP / 30).toString() + "شهر" + (timeP % 30).toString() + "يوم";
            }
            this.modalDetails.duration=durtion;
          }
        }
        else{this.modalDetails.duration=null;}
      });
    }
    else
    {this.modalDetails.duration=null;}
  }



  GetAllSettingsByProjectIDwithoutmain() {
    if(this.modalDetails.subProjectType!=null){
      var dayes = 0,months = 0,hours = 0,weeks = 0;
      this._projectsettingService.GetAllSettingsByProjectIDwithoutmain(this.modalDetails.subProjectType).subscribe(res=>{
        if(res!=null){
          res.forEach((r: any) => {
            if (r.timeType == 2) {
              dayes = dayes + parseInt(r.timeMinutes ?? 0);
            } else if (r.timeType == 3) {
              weeks = weeks + parseInt(r.timeMinutes ?? 0);
            } else if (r.timeType == 4) {
              months = months + parseInt(r.timeMinutes ?? 0);
            } else if (r.timeType == 1) {
              hours = hours + parseInt(r.timeMinutes ?? 0);
            }
            else{
              hours = hours + parseInt(r.timeMinutes ?? 0);
            }
          });
          var totaldayes = 0,dayeshour = 0,allemonth = 0,remainhour = 0,totalweek = 0,alldayes = 0;
          totaldayes = parseInt((weeks * 7 + months * 30 + dayes).toString());
          dayeshour = parseInt((hours / 24).toString());
          remainhour = parseInt((hours % 24).toString());
          totaldayes = parseInt((totaldayes + dayeshour).toString());
          allemonth = parseInt((totaldayes / 30).toString());
          totalweek = parseInt(((totaldayes % 30) / 7).toString());
          alldayes = parseInt(((totaldayes % 30) % 7).toString());
          var monthstr = '',weekstr = '',daystr = '',hourstr = '';

          if (allemonth > 0) {monthstr = allemonth + ' شهر ';}
          if (totalweek > 0) {weekstr = totalweek + ' اسبوع ';}
          if (alldayes > 0) {daystr = alldayes + ' يوم ';}
          if (remainhour > 0) {hourstr = remainhour + ' ساعة ';}
          var duration = monthstr + weekstr + daystr + hourstr;
          this.modalDetails.total_duration = duration;
        }
        else{this.modalDetails.total_duration=null;}
      });
    }
    else{this.modalDetails.total_duration=null;}
  }

  GetAllSettingsByProjectIDwithoutmain2(){
    if(this.modalDetails.subProjectType!=null)
    {
      this._projectsettingService.GetAllSettingsByProjectIDwithoutmain(this.modalDetails.subProjectType).subscribe(res=>{
        if(res!=null)
        {
          debugger
          var AllHour=0,TempHour=0;

          var timehour = 0, timeday = 0, timeweek = 0, timemonth = 0, timehourstr, timedaystr, timeweekstr, timemonthstr, fulltimestr;
          res.forEach((r: any) => {
            TempHour=0;
            if (r.timeType == 1) {
                //timehour = timehour + r.timeMinutes;
                TempHour=r.timeMinutes;
                AllHour=AllHour+TempHour;
            }
            else if (r.timeType == 2) {
                //timeday = timeday + r.timeMinutes;
                TempHour=r.timeMinutes*24;
                AllHour=AllHour+TempHour;

            }
            else if (r.timeType == 3) {
                //timeweek = timeweek + r.timeMinutes;
                TempHour=r.timeMinutes*7*24;
                AllHour=AllHour+TempHour;
            }
            else {
                //timemonth = timemonth + r.timeMinutes;
                TempHour=r.timeMinutes*30*24;
                AllHour=AllHour+TempHour;
            }
          });
          if (timehour > 0) {
              timehourstr = timehour + "ساعة"
          } else {
              timehourstr = "";
          }

          if (timeday > 0) {
              timedaystr = timeday + "يوم"

          } else {
              timedaystr = "";
          }
          if (timeweek > 0) {
              timeweekstr = timeweek + "اسبوع"

          } else {
              timeweekstr = "";
          }
          if (timemonth > 0) {
              timemonthstr = timemonth + "شهر";
          } else {
              timemonthstr = "";
          }
          fulltimestr = timemonthstr + timeweekstr + timedaystr + timehourstr;
          this.modalDetails.total_duration=fulltimestr;
        }
        else{this.modalDetails.total_duration=null;}
      });
    }
    else{this.modalDetails.total_duration=null;}
  }
  publicCalcList:any=[];
  GetAllSettingsByProjectIDwithoutmainAll(){
    this._projectsettingService.GetAllSettingsByProjectIDwithoutmainAll().subscribe(res=>{
      this.publicCalcList=res;
    });
  }

  ProjectType_Change(){
    this.modalDetails.subProjectType=null;
    this.modalDetails.mainStage=null;
    this.modalDetails.subStage=null;
    this.rowsmainphase=[]; this.tempmainphase=[]; this.mainphaseList=[];
    this.rowssubmainphase=[]; this.tempsubmainphase=[]; this.submainphaseList=[];
    this.getAllProjectSubTypes();
    this.getProjectSettingEdit(this.modalDetails.subProjectType);

  }
  subProjectTypeName_Public=null;
  ProjectSubType_Change(List:any,selected:any){
    debugger
    this.getAllMainphases();
    this.getProSettingnumber();
    this.GetTimePeriordBySubTypeId();
    this.GetAllSettingsByProjectIDwithoutmain();
    this.getProjectSettingEdit(this.modalDetails.subProjectType);
    this.modalDetails.mainStage=null;
    this.modalDetails.subStage=null;
    this.rowssubmainphase=[]; this.tempsubmainphase=[]; this.submainphaseList=[];
    console.log("List");
    console.log(List);
    console.log("selected");
    console.log(selected);
    this.subProjectTypeName_Public=List.filter((ele: { subTypeId: any; })=>ele.subTypeId==selected)[0].nameAr;
  }

  mainStage_Change(){
    this.getAllSubPhases();
  }
  SubPhase_Change(){

  }
  resetModalDetails() {
    this.modalDetails = {
      proSettingId: null,
      projectWorkflowNo: null,
      projectWorkflowDesc: null,
      projectType: null,
      subProjectType: null,
      duration: null,
      total_duration: null,
      added_date: null,
      user: null,
      mainStage: null,
      subStage: null,
    };
    this.getAllProjectTypes();
  }

  confirmTask() {
    this._projectsettingService.DeleteSettings(this.deletedrow.settingId).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.getTasks();
        this.getProjectSettingEdit(this.modalDetails.subProjectType);
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
    });
  }


  open(content: any, data?: any, type?: any,idRow?:any) {
    if(type=='copy'){this.fill_ProjectType_From();this.AddPotionParam.type=0;}
    else if (type=='protype'){this.AddPotionParam.type=1;this.getAllProjectTypes(); }
    else if (type=='subprotype'){this.AddPotionParam.type=2;this.getAllProjectSubTypes(); }
    else if (type=='mainphase'){this.AddPotionParam.type=3;this.getAllMainphases(); }
    else if (type=='subphase'){this.AddPotionParam.type=4;this.getAllSubPhases(); }
    else if (type=='showMaintask'){this.AddPotionParam.type=5;this.getTasks(); this.selection.clear(); }
    else if (type=='showSubMaintask'){this.AddPotionParam.type=6;this.getTasks();  this.selection.clear(); }
    else if(type=='addtaskmain'){this.AddPotionParam.type=7;this.Tasks=[];}
    else if(type=='addtasksub'){this.AddPotionParam.type=8;this.Tasks=[];}
    else if(type=='edittask'){this.getedittask(data);this.selection.clear();}
    else if(type=='addtasktype'){this.idRow_Public=idRow}
    else if(type=='merge'){this.SettingDetailsData.Description=null;this.SettingDetailsData.Note=null;}



    // else{this.AddPotionParam.type=0;}

    console.log("rowsoption");
    console.log(this.rowsoption);
    var sizet="lg";
    if(type=='addtaskmain'|| type=='addtasksub' || type=='edittask')
    {
      sizet='xxl';
    }
    else{
      sizet=type ? (type == 'delete' ? 'md' : 'xl') : 'lg'
    }
    this.deletedrow=data;
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: sizet,
        centered: type ? (type == 'delete' ? true : false) : false,
        backdrop : 'static',
        keyboard : false
      })
      .result.then(
        (result: any) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason: any) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any, type?: any): string {
    this.linkProject = null;
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getTasks(){
    debugger
    var phaseid;
    if(this.AddPotionParam.type==5)
    {
      phaseid=this.modalDetails.mainStage;
    }
    else if(this.AddPotionParam.type==6)
    {
      phaseid=this.modalDetails.subStage;
    }
    this._projectsettingService.GetAllTasksByPhaseId(phaseid).subscribe(data=>{
        this.missionsDataSource = new MatTableDataSource(data);
        this.missionsDataSourceTemp=data;
    });
  }

  SettingDetailsData:any={
    TasksIdArray:[],
    Description:null,
    Note:null
  }
  merge(modal:any) {

    if(this.SettingDetailsData.Description==null || this.SettingDetailsData.Description== null)
    {
      this.toast.error("من فضلك أكنب اسم المهمة و الملاحظات", this.translate.instant("Message"));return;
    }

    debugger
    this.SettingDetailsData.TasksIdArray=[];
    this.selection.selected.forEach((element: any) => {
      this.SettingDetailsData.TasksIdArray.push(element.settingId);
    });

    if(this.SettingDetailsData.TasksIdArray.length>=2)
    {
      this._projectsettingService.MerigTasks(this.SettingDetailsData).subscribe((result: any)=>{
        if(result?.statusCode==200){
          this.toast.success(result?.reasonPhrase,this.translate.instant("Message"));
          this.getTasks();
          debugger
          this.getProjectSettingEdit(this.modalDetails.subProjectType);
          this.selection.clear();
          modal?.dismiss();
        }
        else{this.toast.error(result?.reasonPhrase, this.translate.instant("Message"));}
      });
    }
    else{
      this.toast.error("من فضلك اختر اكثر من مهمة",this.translate.instant("Message"));
    }

  }

  ConvertTasksSubToMain(){
    debugger
    this._projectsettingService.ConvertTasksSubToMain(this.modalDetails.subStage).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.getAllSubPhases();
        this.getProjectSettingEdit(this.modalDetails.projectSubtypeId);
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
    });
  }

//-----------------------------------------Add Tasks-----------------------------------------------

//-----------------------------------City Type------------------------------------------------
dataAdd: any = {
  Tasktype: {
    id: 0,
    nameAr: null,
    nameEn: null,
  },
};
TaskTypeRowSelected:any;
getTasktypeRow(row :any){
  this.TaskTypeRowSelected=row;
  console.log(this.TaskTypeRowSelected);
 }
setTaskTypeInSelect(data:any,modal:any){
  let index = this.Tasks.findIndex((d: { idRow: any; }) => d.idRow == this.idRow_Public);
  this.Tasks[index].TaskType_M=data.id;
}
resetTaskType(){
  this.dataAdd.Tasktype.id=0;this.dataAdd.Tasktype.nameAr=null;this.dataAdd.Tasktype.nameEn=null;
}
saveTaskType() {
  debugger
  if(this.dataAdd.Tasktype.nameAr==null || this.dataAdd.Tasktype.nameEn==null)
  {
    this.toast.error("من فضلك أكمل البيانات", this.translate.instant("Message"));
    return;
  }
  var TaskTypeObj:any = {};
  TaskTypeObj.TaskTypeId = this.dataAdd.Tasktype.id;
  TaskTypeObj.NameAr = this.dataAdd.Tasktype.nameAr;
  TaskTypeObj.NameEn = this.dataAdd.Tasktype.nameEn;
  this._phasestaskService.SaveTaskType(TaskTypeObj).subscribe((result: any)=>{
    if(result.statusCode==200){
      this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
      this.resetTaskType();
      this.FillTaskSelect();
    }
    else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
  });
}
confirmTasktypeDelete() {
  this._phasestaskService.DeleteTaskType(this.TaskTypeRowSelected.id).subscribe((result: any)=>{
    if(result.statusCode==200){
      this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
      this.FillTaskSelect();
    }
    else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
  });
}
//----------------------------------(End)-City Type---------------------------------------------




  TasksDetails: any;
  TasksList: any;
  selectedTasksRow: any;
  //load_Tasks :any;
  load_TasksUsers :any;
  load_ProjectGoals :any;

  Tasks: any = [];

  addNewRow() {
    var maxVal=0;
    debugger
    if(this.Tasks.length>0)
    {
      maxVal = Math.max(...this.Tasks.map((o: { idRow: any; }) => o.idRow))
    }
    else{
      maxVal=0;
    }
    let Task = {
      idRow:maxVal+1,
      settingId:0,
      TaskType_M:null,
      TaskNameAr_M:null,
      TaskNameEn_M:null,
      TaskUser_M:null,
      TaskUrgent_M:1,
      TaskTimeType_M:1,
      TaskDurationTime_M:null,
      TaskprojectgoalsCheck_M:false,
      TaskprojectgoalsValuek_M:null,

    };
    this.Tasks.push(Task);
    this.FillTaskSelect();
    this.fill_TasksUsers();
    this.FillProjectTypeRequirmentSelect();

  }
  getedittask(data:any){
    this.Tasks=[];
    console.log("data");
    console.log(data);

    this.FillTaskSelect();
    this.fill_TasksUsers();
    this.FillProjectTypeRequirmentSelect();
    var Check=false;
    if(data.requirmentId>0) Check=true;
    else Check=false;

    var CheckisUrgent=1;
    if(data.isUrgent==true) CheckisUrgent=4;
    else CheckisUrgent=1;

    let Task = {
      idRow:1,
      settingId:data.settingId,
      TaskType_M:data.taskType,
      TaskNameAr_M:data.descriptionAr,
      TaskNameEn_M:data.descriptionEn,
      TaskUser_M:data.userId,
      TaskUrgent_M:CheckisUrgent,
      TaskTimeType_M:data.timeType,
      TaskDurationTime_M:data.timeMinutes,
      TaskprojectgoalsCheck_M:Check,
      TaskprojectgoalsValuek_M:data.requirmentId,
    };
    this.Tasks.push(Task);
  }
  deleteRow(idRow: any) {
    debugger
    let index = this.Tasks.findIndex((d: { idRow: any; }) => d.idRow == idRow);
    this.Tasks.splice(index, 1);
  }

  setTasksRowValue(index: any) {
    this.Tasks[this.selectedTasksRow] = this.TasksList[index];
  }
  changeGoal(event: any,content: any, goalsCheck?: any,  idRow?: any,type?: any) {
    debugger
    this.idRow_Public=idRow
    if(goalsCheck==true)
    {
      this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? (type == 'delete' ? 'md' : 'xl') : 'lg',
        centered: type ? (type == 'delete' ? true : false) : false,
        backdrop : 'static',
        keyboard : false
      })
      .result.then(
        (result: any) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason: any) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    }
    else{
      this.FillProjectTypeRequirmentSelect();
    }
  }


  GoalSelectVal=null;
  idRow_Public=0;
  projectGoal_Change(){

    let index = this.Tasks.findIndex((d: { idRow: any; }) => d.idRow == this.idRow_Public);
    this.Tasks[index].TaskprojectgoalsValuek_M=this.GoalSelectVal;
    //this.Tasks[index].TaskNameEn_M=$event.nameE??$event.name;
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.serviceListDataSource.filter = filterValue.trim().toLowerCase();
  // }

  updateTask($event:any, idRow:any){
    debugger
    let index = this.Tasks.findIndex((d: { idRow: any; }) => d.idRow == idRow);
    this.Tasks[index].TaskNameAr_M=$event.name;
    this.Tasks[index].TaskNameEn_M=$event.nameE??$event.name;
  }
  updateUser($event:any, idRow:any){

  }
  // fill_Tasks(){
  //   this._projectsettingService.FillTaskTypeSelect().subscribe(data=>{
  //     console.log(data);
  //     this.load_Tasks=data;
  //   });
  // }
  TaskType:any;
  TaskTypesPopup:any;
  FillTaskSelect(){
    this._projectsettingService.FillTaskTypeSelect().subscribe(data=>{
      console.log(data)
      this.TaskType=data;
      this.TaskTypesPopup=data;
    });
  }
  fill_TasksUsers(){
    this._projectsettingService.FillAllUsersSelectAll().subscribe(data=>{
      console.log(data);
      this.load_TasksUsers=data;
    });
  }
  dataa:any=[{id:1,name:'mmmm'},{id:2,name:'wwwwww'},{id:3,name:'kkkkkk'},{id:4,name:'cccccc'}]
  FillProjectTypeRequirmentSelect(){
    this._projectsettingService.FillProjectTypeRequirmentSelect(this.modalDetails.projectType,this.modalDetails.subProjectType).subscribe(data=>{
      console.log(data);

      //this.load_ProjectGoals=this.dataa;
      this.load_ProjectGoals=data;

    });
  }

  editTask(row: any, model: any){
    model?.show();
  }

  deleteTask(i:any){

  }
  SaveTask(modal:any)
  {
    debugger
    var CheckValid=1;
    this.Tasks.forEach((element: any) => {
      if(element.TaskType_M==null || element.TaskNameAr_M==null ||element.TaskNameEn_M==null ||element.TaskUser_M==null
        ||element.TaskUrgent_M==null ||element.TaskDurationTime_M==null ||element.TaskTimeType_M==null ){
          CheckValid=0;
        }
    });
    if(CheckValid==0)
    {
      this.toast.error("من فضلك أكمل البيانات", this.translate.instant("Message"));
      return;
    }
    var settingsList:any=[];
    console.log("this.Tasks");
    console.log(this.Tasks);

    this.Tasks.forEach((element: any) => {
      this._settings=new Settings();
      this._settings.settingId=element.settingId;
      this._settings.projSubTypeId=this.modalDetails.subProjectType;
      this._settings.type=3;
      if(this.AddPotionParam.type==7){
        this._settings.parentId=this.modalDetails.mainStage;
      }
      else if(this.AddPotionParam.type==8){
        this._settings.parentId=this.modalDetails.subStage;
      }
      else{
      }
      this._settings.descriptionAr=element.TaskNameAr_M;
      this._settings.descriptionEn=element.TaskNameEn_M;
      this._settings.userId=element.TaskUser_M;
      this._settings.notes="";
      this._settings.taskType=element.TaskType_M;
      this._settings.priority=element.TaskUrgent_M;
      this._settings.timeType=element.TaskTimeType_M;
      this._settings.timeMinutes=element.TaskDurationTime_M;
      this._settings.requirmentId=element.TaskprojectgoalsValuek_M;
      this._settings.isUrgent=(element.TaskprojectgoalsValuek_M == 4?true:false);
      settingsList.push(this._settings);
    });
    this._projectsettingService.SaveSettingsList(settingsList).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.Tasks=[];
        this.getProjectSettingEdit(this.modalDetails.subProjectType);
        modal?.dismiss();
        this.getTasks();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
    });

    console.log("this.Tasks");
    console.log(this.Tasks);
  }
  DependencyData:any={
    ProjSubTypeId:null,
    TaskLinkList:null,
    NodeLocList:null
  };

  saveProSettings() {


    if(this.modalDetails.projectWorkflowNo==null || this.modalDetails.projectWorkflowDesc==null)
    {
      this.toast.error("اكتب وصف السير ورقمه", this.translate.instant("Message"));
      return;
    }

    console.log("this.nodeDataArray------------ linkDataArray");
    console.log(this.nodeDataArray);
    console.log(this.linkDataArray);
    this.DependencyData.ProjSubTypeId=null;
    this.DependencyData.TaskLinkList=null;
    this.DependencyData.NodeLocList=null;
    debugger
    var LinkArrayList = [];
    var NodelocationList = [];
    for (var i = 0; i < this.linkDataArray.length; i++) {
        if (this.linkDataArray[i].from != 0) {
        var dependencyObj :any = {};
        dependencyObj.DependencyId = 0;
        dependencyObj.PredecessorId = this.linkDataArray[i].from;
        dependencyObj.SuccessorId = this.linkDataArray[i].to;

        LinkArrayList.push(dependencyObj);
       }
    }
    if (LinkArrayList.length == 0) {
        for (var i = 0; i < this.linkDataArray.length; i++) {
            if (this.linkDataArray[i].from == 0) {
                var dependencyObj1 :any = {};
                dependencyObj1.DependencyId = 0;
                dependencyObj1.PredecessorId = this.linkDataArray[i].to;
                dependencyObj1.SuccessorId = this.linkDataArray[i].to;
                LinkArrayList.push(dependencyObj1);
            }
        }
    }
    for (var i = 0; i < this.nodeDataArray.length; i++) {
        if (this.nodeDataArray[i].key != 0) {
            var LocObj :any = {};
            LocObj.LocationId = 0;
            LocObj.SettingId = this.nodeDataArray[i].key;
            LocObj.ProSubTypeId = this.modalDetails.subProjectType;
            // var Objloc=this.nodeDataArray[i].loc as any ;
            // var str1 = new String(Objloc?.x??"50");
            // var str2 = new String(" ");
            // var str3 = new String(Objloc?.y??"50");
            // var str = str2.concat(str3.toString())
            // str = str1.concat(str.toString())
            // console.log("Concatenated String : " + str);
            // LocObj.Location =  str;
            LocObj.Location = this.nodeDataArray[i].loc;
            NodelocationList.push(LocObj);
        }
    }
    this.DependencyData.ProjSubTypeId=this.modalDetails.subProjectType;
    this.DependencyData.TaskLinkList=LinkArrayList;
    this.DependencyData.NodeLocList=NodelocationList;
    var obj=this.DependencyData;
    this._projectsettingService.SaveDependencySettings(obj).subscribe((result: any)=>{
      if(result.statusCode==200){
        //this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.SaveProSettingDetailsFun();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
    });

  }
  SaveProSettingDetailsFun(){
    var ProSettingDetailsObj:any = {};
    ProSettingDetailsObj.ProSettingId = this.modalDetails.proSettingId;
    ProSettingDetailsObj.ProSettingNo = this.modalDetails.projectWorkflowNo;
    ProSettingDetailsObj.ProSettingNote = this.modalDetails.projectWorkflowDesc;
    ProSettingDetailsObj.ProjectTypeId = this.modalDetails.projectType;
    ProSettingDetailsObj.ProjectSubtypeId = this.modalDetails.subProjectType;
    var obj=ProSettingDetailsObj;
    this._projectsettingService.SaveProSettingsDetails(obj).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        // this.nodeDataArray=[];
        // this.linkDataArray=[];
        // this.model2 = new go.GraphLinksModel(this.nodeDataArray, this.linkDataArray);
        this.getData();
        this.getProjectSettingEdit(this.modalDetails.subProjectType);

        //mtnash reset all here
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
    });
  }
  editProSettings() {}


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

  // Save row
  save(row: any, rowIndex: any) {

    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    console.log('Row saved: ' + rowIndex);
    console.log(row);
  }

  // Delete row
  delete(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    this.rows.splice(rowIndex, 1);
    console.log('Row deleted: ' + rowIndex);
  }





  selection = new SelectionModel<any>(true, []);
  select: any = {
    selected: null,
  };
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.missionsDataSource.data?.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.missionsDataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }
  viewFullScreen(){
    if(document.fullscreenElement === null)
    {
      this.openfullscreen();
    }
    else
    {
      this.closefullscreen();
    }
  }

  isfullscreen=false;
  openfullscreen() {
    const docElmWithBrowsersFullScreenFunctions = document.getElementById("myDiagramDiv") as any  & {
      mozRequestFullScreen(): Promise<void>;
      webkitRequestFullscreen(): Promise<void>;
      msRequestFullscreen(): Promise<void>;
    };
    if (docElmWithBrowsersFullScreenFunctions.requestFullscreen) {
      docElmWithBrowsersFullScreenFunctions.requestFullscreen();
    } else if (docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen) { /* Firefox */
      docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen();
    } else if (docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen();
    } else if (docElmWithBrowsersFullScreenFunctions.msRequestFullscreen) { /* IE/Edge */
      docElmWithBrowsersFullScreenFunctions.msRequestFullscreen();
    }
    this.isfullscreen = true;
  }

  closefullscreen(){
    const docWithBrowsersExitFunctions = document as Document & {
      mozCancelFullScreen(): Promise<void>;
      webkitExitFullscreen(): Promise<void>;
      msExitFullscreen(): Promise<void>;
    };
    if (docWithBrowsersExitFunctions.exitFullscreen) {
      docWithBrowsersExitFunctions.exitFullscreen();
    } else if (docWithBrowsersExitFunctions.mozCancelFullScreen) { /* Firefox */
      docWithBrowsersExitFunctions.mozCancelFullScreen();
    } else if (docWithBrowsersExitFunctions.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      docWithBrowsersExitFunctions.webkitExitFullscreen();
    } else if (docWithBrowsersExitFunctions.msExitFullscreen) { /* IE/Edge */
      docWithBrowsersExitFunctions.msExitFullscreen();
    }
    this.isfullscreen = false;
  }

  BackToSettingsPage(){
    this.currentPage = 'view';
  }

   // if width or height are below 50, they are set to 50
   generateImages(width:any, height:any) {
    debugger
    // sanitize input
    width = parseInt(width);
    height = parseInt(height);
    if (isNaN(width)) width = 100;
    if (isNaN(height)) height = 100;
    // Give a minimum size of 50x50
    width = Math.max(width, 50);
    height = Math.max(height, 50);

    var imgDiv = document.getElementById('myImages');
    if(imgDiv!=null)
    {
      imgDiv.innerHTML = ''; // clear out the old images, if any

      //var myDiagram=document.getElementById("myDiagramDiv") as any;
      var myDiagram=this.myDiagram.diagram;
      var db = myDiagram.documentBounds;

      // var boundswidth = myDiagram.offsetWidth;
      // var boundsheight = myDiagram.offsetHeight;

      var boundswidth = db.width;
      var boundsheight = db.height;
      var imgWidth = width;
      var imgHeight = height;
      var p = db.position;
      // var p = {x:0,y:0};

      for (let i = 0; i < boundsheight; i += imgHeight) {
        for (let j = 0; j < boundswidth; j += imgWidth) {
          var img = myDiagram.makeSvg({
            scale: 1,
            position: new go.Point(p.x + j, p.y + i),
            size: new go.Size(imgWidth, imgHeight)
          });
          // Append the new HTMLImageElement to the #myImages div
          // img.className = 'images';
          imgDiv.appendChild(img);
          imgDiv.appendChild(document.createElement('br'));
        }
      }
    }
    var svgstr = new XMLSerializer().serializeToString(img);
    var blob = new Blob([svgstr], { type: 'image/svg+xml' });
    this.myCallback(blob);
  }
  @ViewChild('myDiagram') myDiagram: any;
  printSetting(){




    this.generateImages(1000,2000);
    debugger
    // let sgvd = document.getElementById('myImages') as any;

    // var svgstr = new XMLSerializer().serializeToString(sgvd.innerHTML);
    // var blob = new Blob([svgstr], { type: 'image/svg+xml' });
    // this.myCallback(blob);
    // let sgvd = document.getElementById('myImages') as any;
    // let innerContents =sgvd.innerHTML;
    // var img =this.myDiagram.diagram.makeImage({
    //   scale: 1.1,
    //   size: new go.Size(2000,Infinity)
    // });
    // var imgDiv = document.getElementById('myImages')as any;

    // imgDiv.appendChild(img);
    //var newWindow = window.open("","newWindow") as any;
    //newWindow.document.write('<html><head><style></style></head><body onload="window.print()"><svg>' + innerContents + '</svg></html>');

    //this.print.print('myImages', environment.printConfig);
    //printJS('myImages', 'html');

  }


  myCallback(blob:any) {
    var url = window.URL.createObjectURL(blob);
    var filename = 'mySVGFile.svg';

    var a = document.createElement('a') as any;
    a.style = 'display: none';
    a.href = url;
    a.download = filename;

    // // IE 11
    // if (window.navigator.msSaveBlob !== undefined) {
    //   window.navigator.msSaveBlob(blob, filename);
    //   return;
    // }

    document.body.appendChild(a);
    requestAnimationFrame(() => {
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }
  myCallback_PNG(blob:any) {
    var url = window.URL.createObjectURL(blob);
    var filename = 'myBlobFile.png';

    var a = document.createElement('a') as any;
    a.style = 'display: none';
    a.href = url;
    a.download = filename;

    // // IE 11
    // if (window.navigator.msSaveBlob !== undefined) {
    //   window.navigator.msSaveBlob(blob, filename);
    //   return;
    // }

    document.body.appendChild(a);
    requestAnimationFrame(() => {
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }
  makeSvg() {
    var svg = this.myDiagram.diagram.makeSvg({ scale: 1,size: new go.Size(2000,Infinity), background: 'white' });
    var svgstr = new XMLSerializer().serializeToString(svg);
    var blob = new Blob([svgstr], { type: 'image/svg+xml' });
    this.myCallback(blob);
  }
   makeBlob() {
    var blob = this.myDiagram.diagram.makeImageData({ background: 'white',scale: 1,size: new go.Size(2000,Infinity), returnType: 'blob', callback: this.myCallback_PNG });
    // this.myCallback(blob);
  }

}
