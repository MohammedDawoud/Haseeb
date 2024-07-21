import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
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
import { ProjectPhasesTasks } from 'src/app/core/Classes/DomainObjects/projectPhasesTasks';
import { ProjectPhasesTasksVM } from 'src/app/core/Classes/ViewModels/projectPhasesTasksVM';
import { BehaviorSubject } from 'rxjs';
import { FileUploadControl, FileUploadValidators } from '@iplab/ngx-file-upload';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-project-setting-running',
  templateUrl: './project-setting-running.component.html',
  styleUrls: ['./project-setting-running.component.scss']
})
export class ProjectSettingRunningComponent {

  projectData:any=null;

  constructor(private modalService: NgbModal, private ar: ActivatedRoute,
    private _projectsettingService: ProjectsettingService,
    private _phasestaskService: PhasestaskService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,) {
    if(window.history.state){
      this.projectData=window.history.state?.data;
    }
    this.userG = this.authenticationService.userGlobalObj;
    console.log("projectData");
    console.log(this.projectData);

    this.setModalDetails(this.projectData);
    this.modalDetails = {};

    // if(this.diagram){
    //   this.diagram.div=null;
    //   this.diagram= new go.Diagram();
    // }

  }
  deletedrow:any;

  missions: any;
  //Data Fill
  public _projectType: ProjectType; public _projectSubTypes: ProjectSubTypes;
   public _settingsVM: SettingsVM; public _settings: Settings;
   public _projectPhasesTasksVM: ProjectPhasesTasksVM; public _projectPhasesTasks: ProjectPhasesTasks;

   projectTypenameAr_M=null; projectSubTypnameAr_M=null; mainphasenameAr_M=null;submainphasenameAr_M=null;
   projectTypenameEn_M=null; projectSubTypnameEn_M=null; mainphasenameEn_M=null;submainphasenameEn_M=null;
   projectSubTyptime_M=null;
   projectTypeList:any = [];projectSubTypesList:any = [];mainphaseList:any = [];submainphaseList:any = [];

   rowsprojectType:any = []; tempprojectType: any = [];rowsprojectSubTypes:any = []; tempprojectSubTypes: any = [];
   rowsmainphase:any = []; tempmainphase: any = [];rowssubmainphase:any = []; tempsubmainphase: any = [];
   rowsoption:any = []; tempoption: any = []; optionList:any = [];
  //End Data Fill

  EditData_setting :any={
    SettingData:[],
    nodeArray:[],
    linkArray:[],
  }

  model2_setting  :any;
  nodeDataArray_setting = [
    { key: 1,loc:"0 0" },
    { key: 2, group: 4,color: 'lightblue' },
    { key: 3, group: 4,color: 'orange' },
    { key: 4, isGroup: true,color: 'lightgreen' },
    { key: 5 }
  ];
  linkDataArray_setting  = [
    { from: 1, to: 2 },  // from outside the Group to inside it
    { from: 2, to: 3 },  // this link is a member of the Group
    { from: 4, to: 5}  // from the Group to a Node
  ];
  userG: any = {};
  WhatsAppData: any={
    sendactivation:false,
    sendactivationOffer:false,
    sendactivationProject:false,
    sendactivationSupervision:false,
  };
  ngOnInit(): void {
    debugger
    this.TaskType = [
      { id: 1, name: { ar: 'ساعة', en: 'Hour' } },
      { id: 2, name: { ar: 'يوم', en: 'Day' } },
    ];

    this.nodeDataArray_setting =[];
    this.linkDataArray_setting =[];
    this.model2_setting = new go.GraphLinksModel(this.nodeDataArray_setting, this.linkDataArray_setting);
    this._sharedService.GetWhatsAppSetting().subscribe((data: any) => {
      if(data?.result!=null){this.WhatsAppData=data?.result;}
      else{this.WhatsAppData={sendactivation:false,sendactivationOffer:false,sendactivationProject:false,sendactivationSupervision:false,};}
    });
  }
  @ViewChild(DatatableComponent) table: DatatableComponent | any;
  closeResult = '';
  isEditable: any = {};
  AddPotionParam: any = {
    id: null,
    namear: null,
    nameen: null,
    time: null,
    type: 0, //for 4 popup (1 projtype),(2 projsubtype),(3 mainphase),(4 submainphase)
  };
  linkProject: any;
  missionsDataSourceTemp:any = [];
  missionsDataSource = new MatTableDataSource();
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

  missionsDisplayedColumns: string[] = [
    'select',
    'name',
    'duration',
    'assigned',
    'desc',
    'operations',
  ];

  titleEdit: any = {
    main: {
      name: {
        ar: 'ادارة المشاريع',
        en: 'Projects Management',
      },
      link: '/projects',
    },
    sub: {
      en: 'Edit project workflow',
      ar: 'تعديل سير قائم',
    },
  };
  public selectedNode_setting = null;
  public setSelectedNode_setting (node:any) {
    this.selectedNode_setting = node;
  }
  ProjectName_setting :any=null;
    //-----------------ProjectSettingEdit--------------------------------
    setModalDetails(data: any) {
      //this.fill_Projects();
      this.modalDetails = data;
      console.log("------------------------------------------");
      console.log(this.modalDetails);
      console.log(this.modalDetails.projectId);
      this.ProjectName_setting =this.modalDetails.projectNo+"-"+this.modalDetails.customerName;
      //this.modalDetails.projectId = data.projectId ;
      this.modalDetails.mainStage=null;
      this.modalDetails.subStage=null;
      this.FillProjectMainPhases_setting ();
      //this.GetTimePeriordBySubTypeId();
      //this.GetAllSettingsByProjectIDwithoutmain();
      this.getProjectSettingEdit_setting ();
      this.rowssubmainphase=[]; this.tempsubmainphase=[]; this.submainphaseList=[];
    }
    projectIdList:any;
    // fill_Projects(){
    //   this._projectsettingService.FillProjectSelectByCustomerIdNotifaction().subscribe(data=>{
    //     console.log("fill_Projects");
    //     console.log(data);

    //     this.projectIdList=data;
    //   });
    // }

    getProjectSettingEdit_setting (){
      debugger
      var ProId=this.projectData.projectId;
      var projno=this.projectData.projectNo+"-"+this.projectData.customerName;

      this.EditData_setting.nodeArray=[];
      this.EditData_setting.linkArray=[];
      this.nodeDataArray_setting =[];
      this.linkDataArray_setting =[];

      if(ProId==null)
      {
        this.model2_setting = new go.GraphLinksModel(this.nodeDataArray_setting, this.linkDataArray_setting);
        return;
      }
      this._projectsettingService.GetAllNodesTasks_Project(ProId).subscribe(res=>{
          this.EditData_setting .SettingData=res;
          console.log("this.EditData_setting.SettingData");
          console.log(this.EditData_setting.SettingData);

          this.EditData_setting.nodeArray.push({ "key": 0, "loc": "-584 -74", "name": projno, "colorfill": "#0fac03" })
          res.nodeDataArray.forEach((r: any) => {
            if (r.nodeLocation != null) {
              if (r.type === 1) {   //mainphase
                this.EditData_setting.nodeArray.push({ "key": r.phaseTaskId, "loc": r.nodeLocation, "name": r.descriptionAr, isGroup: true, "colorfill": "#70b9dc" })
              }
              else if (r.type === 2) { //subphase
                this.EditData_setting.nodeArray.push({ "key": r.phaseTaskId, "loc": r.nodeLocation, "name": r.descriptionAr, group: r.parentId, isGroup: true, "colorfill": "#b7e89d"  })
              }
              else {  ///task
                debugger
                if (r.isTemp == true) {
                  this.EditData_setting.nodeArray.push({ "key": r.phaseTaskId, "name": r.descriptionAr,"namee": r.userName, group: r.parentId, "toolTipName": r.userName, "colorfill": "#d42d34" })
                }
                else {
                  if (r.execPercentage != null) {
                    if (r.execPercentage == 100) {
                      this.EditData_setting.nodeArray.push({ "key": r.phaseTaskId, "name": r.descriptionAr,"namee": r.userName, group: r.parentId, "toolTipName": r.userName, "colorfill": "#bfbfbf" })
                    }
                    else {
                      this.EditData_setting.nodeArray.push({ "key": r.phaseTaskId, "name": r.descriptionAr,"namee": r.userName, group: r.parentId, "toolTipName": r.userName, "colorfill": "#fe9100" })
                    }
                  }
                  else {
                    this.EditData_setting.nodeArray.push({ "key": r.phaseTaskId, "name": r.descriptionAr,"namee": r.userName, group: r.parentId, "toolTipName": r.userName, "colorfill": "#fe9100" })
                  }
                }
              }
          }
          else {
              if (r.type === 1) {  //mainphase
                this.EditData_setting.nodeArray.push({ "key": r.phaseTaskId, "loc": "50 50", size: "150 50", "name": r.descriptionAr, isGroup: true, "colorfill": "#70b9dc" })
              }
              else if (r.type === 2) { //subphase
                this.EditData_setting.nodeArray.push({ "key": r.phaseTaskId, "loc": "50 50", size: "150 50", "name": r.descriptionAr, group: r.parentId, isGroup: true, "colorfill": "#b7e89d"  })
              }
              else { ///task
                debugger
                if (r.isTemp == true) {
                  this.EditData_setting.nodeArray.push({ "key": r.phaseTaskId, "name": r.descriptionAr,"namee": r.userName, group: r.parentId, "toolTipName": r.userName, "colorfill": "#d42d34" })
                }
                else {
                  if (r.execPercentage != null) {
                    if (r.execPercentage == 100) {
                      this.EditData_setting.nodeArray.push({ "key": r.phaseTaskId, "name": r.descriptionAr,"namee": r.userName, group: r.parentId, "toolTipName": r.userName, "colorfill": "#bfbfbf" })
                    }
                    else {
                      this.EditData_setting.nodeArray.push({ "key": r.phaseTaskId, "name": r.descriptionAr,"namee": r.userName, group: r.parentId, "toolTipName": r.userName, "colorfill": "#fe9100" })
                    }
                  }
                  else {
                    this.EditData_setting.nodeArray.push({ "key": r.phaseTaskId, "name": r.descriptionAr,"namee": r.userName, group: r.parentId, "toolTipName": r.userName, "colorfill": "#fe9100" })
                  }
                }
              }
          }
          });
          res.firstLevelNode.forEach((r: any) => {
            this.EditData_setting.linkArray.push({ "from": 0, "to": r.phaseTaskId, "name": "" })
          });
          res.linkDataArray.forEach((r: any) => {
            this.EditData_setting.linkArray.push({ "from": r.predecessorId, "to": r.successorId, "name": "" })
          });

          this.nodeDataArray_setting=this.EditData_setting.nodeArray;
          this.linkDataArray_setting=this.EditData_setting.linkArray;

          // console.log("this.nodeDataArray------------ linkDataArray");
          // console.log(this.nodeDataArray_setting);
          // console.log(this.linkDataArray_setting);

          this.model2_setting = new go.GraphLinksModel(this.nodeDataArray_setting, this.linkDataArray_setting);
      });
    }
    //-----------------(End) ProjectSettingEdit--------------------------------


    //Data Fill
    //--------------------------------------Mainphase-------------------------------------------------
    SaveNewProjectPhasesTasks(data: any,type:any) {
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
      var PhaseObj:any = {};
      PhaseObj.PhaseTaskId = 0;
      if(type==1){
        PhaseObj.DescriptionAr = this.mainphasenameAr_M;;
        PhaseObj.DescriptionEn = this.mainphasenameEn_M;
      }
      else
      {
        PhaseObj.ParentId = this.modalDetails.mainStage;
        PhaseObj.DescriptionAr = this.submainphasenameAr_M;
        PhaseObj.DescriptionEn = this.submainphasenameEn_M;
      }
      PhaseObj.ProjectId = this.projectData.projectId;
      PhaseObj.Type=type;
      PhaseObj.IsConverted = 0;
      PhaseObj.IsMerig = -1;

      this._projectsettingService.SaveNewProjectPhasesTasks(PhaseObj).subscribe((result: any)=>{
        if(result.statusCode==200){
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
          this.getProjectSettingEdit_setting ();

          if(type==1)
          {
            this.mainphasenameAr_M=null; this.mainphasenameEn_M=null;
            this.FillProjectMainPhases_setting ();
          }
          else
          {
            this.submainphasenameAr_M=null; this.submainphasenameEn_M=null;
            this.FillProjectSubPhases_setting ();
          }

        }
        else{this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));}
      });
    }
    FillProjectMainPhases_setting (){
      if(this.projectData.projectId!=null)
      {
        this._projectsettingService.FillProjectMainPhases(this.projectData.projectId).subscribe(data=>{
          console.log(data);
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
    FillProjectSubPhases_setting (){
      if(this.modalDetails.mainStage!=null)
      {
        this._projectsettingService.FillProjectSubPhases(this.modalDetails.mainStage).subscribe(data=>{
          console.log(data);
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
        return (d.name?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.nameEn?.trim().toLowerCase().indexOf(val) !== -1 || !val);
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
        return (d.name?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        || (d.nameEn?.trim().toLowerCase().indexOf(val) !== -1 || !val);
      });
      this.rowssubmainphase = tempsubmainphase;
      this.rowsoption = tempsubmainphase;

      if (this.table) {
        this.table!.offset = 0;
      }
    }
    editNewProjectPhasesTasks(row: any, rowIndex: any,type:any) {
      this.isEditable[rowIndex] = !this.isEditable[rowIndex];
      var PhaseObj:any = {};
      PhaseObj.PhaseTaskId = row.id;
      PhaseObj.ProjectId = this.projectData.projectId;
      PhaseObj.Type = type;
      PhaseObj.DescriptionAr = row.name;;
      PhaseObj.DescriptionEn = row.nameEn;
      this._projectsettingService.SaveNewProjectPhasesTasks(PhaseObj).subscribe((result: any)=>{
        if(result.statusCode==200){
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        }
        else{
          this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));
        }
        this.getProjectSettingEdit_setting ();

        if(type==1)this.FillProjectMainPhases_setting ();
        else this.FillProjectSubPhases_setting ();
      });
    }
    DeleteProjectPhasesTasks(row: any, rowIndex: any,type:any) {
      this.isEditable[rowIndex] = !this.isEditable[rowIndex];
      this._projectsettingService.DeleteProjectPhasesTasks(row.id).subscribe((result: any)=>{
        if(result.statusCode==200){
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
          this.getProjectSettingEdit_setting ();
          if(type==1)this.FillProjectMainPhases_setting ();
          else this.FillProjectSubPhases_setting ();
        }
        else{this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));}
      });
    }
    //------------------------------------(End)--ProjectSubType-------------------------------------------------

    publicCalcList:any=[];
    GetAllSettingsByProjectIDwithoutmainAll(){
      this._projectsettingService.GetAllSettingsByProjectIDwithoutmainAll().subscribe(res=>{
        this.publicCalcList=res;
      });
    }

    mainStage_Change(){
      this.FillProjectSubPhases_setting ();
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
    }


    open(content: any, data?: any, type?: any,idRow?:any) {
      if(type=='copy'){this.AddPotionParam.type=0;}
      else if (type=='mainphase'){this.AddPotionParam.type=3;this.FillProjectMainPhases_setting (); }
      else if (type=='subphase'){this.AddPotionParam.type=4;this.FillProjectSubPhases_setting (); }
      else if (type=='showMaintask'){this.AddPotionParam.type=5;this.getTasks(); this.selection.clear(); }
      else if (type=='showSubMaintask'){this.AddPotionParam.type=6;this.getTasks();  this.selection.clear(); }
      else if(type=='addtaskmain'){this.AddPotionParam.type=7;this.resetTaskData();}
      else if(type=='addtasksub'){this.AddPotionParam.type=8;this.resetTaskData();}
      else if(type=='edittask'){this.getedittask(data);this.selection.clear();}
      else if(type=='merge'){this.SettingDetailsData.Description=null;this.SettingDetailsData.Note=null;}
      else if(type=='addtasktype'){this.idRow_Public=idRow}

      // else{this.AddPotionParam.type=0;}
      debugger
      console.log("rowsoption");
      console.log(this.rowsoption);
      var sizet="lg";
      if(type=='addtaskmain'|| type=='addtasksub' || type=='edittask')
      {
        sizet='xl';
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
      this._projectsettingService.GetAllProjectTasksByPhaseId(phaseid).subscribe(data=>{
        console.log(data.result);
          this.missionsDataSource = new MatTableDataSource(data.result);
          this.missionsDataSourceTemp=data.result;

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
        this.SettingDetailsData.TasksIdArray.push(element.phaseTaskId);
      });

      if(this.SettingDetailsData.TasksIdArray.length>=2)
      {
        this._projectsettingService.MerigTasks_Phases(this.SettingDetailsData).subscribe((result: any)=>{
          if(result?.statusCode==200){
            this.toast.success(result?.reasonPhrase,this.translate.instant("Message"));
            this.getTasks();
            debugger
            this.getProjectSettingEdit_setting();
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
          this.FillProjectSubPhases_setting ();
          this.getProjectSettingEdit_setting ();
        }
        else{this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));}
      });
    }

    confirm() {
      this._projectsettingService.DeleteProjectPhasesTasks(this.deletedrow.phaseTaskId).subscribe((result: any)=>{
        if(result.statusCode==200){
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
          this.getTasks();
          this.getProjectSettingEdit_setting ();
        }
        else{this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));}
      });
    }
    VoucherTaskStop() {
      this._projectsettingService.VoucherTaskStop(this.deletedrow.phaseTaskId).subscribe((result: any)=>{
        if(result.statusCode==200){
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
          this.getTasks();
          this.getProjectSettingEdit_setting();
        }
        else{this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));}
      });
    }
    VoucherTaskStopR() {
      this._projectsettingService.VoucherTaskStopR(this.deletedrow.phaseTaskId).subscribe((result: any)=>{
        if(result.statusCode==200){
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
          this.getTasks();
          this.getProjectSettingEdit_setting();
        }
        else{this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));}
      });
    }
  //-----------------------------------------Add Tasks-----------------------------------------------

  //-----------------------------------Tasktype------------------------------------------------
  dataAdd: any = {
    Tasktype: {
      id: 0,
      nameAr: null,
      nameEn: null,
    },
  };
  TaskTypeRowSelected_setting :any;
  getTasktypeRow_setting (row :any){
    this.TaskTypeRowSelected_setting =row;
    console.log(this.TaskTypeRowSelected_setting );
   }
  setTaskTypeInSelect_setting (data:any,modal:any){
    let index = this.Tasks.findIndex((d: { idRow: any; }) => d.idRow == this.idRow_Public);
    this.Tasks[index].TaskType_M=data.id;
  }
  resetTaskType_setting (){
    this.dataAdd.Tasktype.id=0;this.dataAdd.Tasktype.nameAr=null;this.dataAdd.Tasktype.nameEn=null;
  }
  saveTaskType_setting () {
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
        this.resetTaskType_setting();
        this.FillTaskSelect();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));}
    });
  }
  confirmTasktypeDelete_setting () {
    this._phasestaskService.DeleteTaskType(this.TaskTypeRowSelected_setting .id).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.FillTaskSelect();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));}
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
        phaseTaskId:0,
        projSubTypeId:null,
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
      //this.FillProjectTypeRequirmentSelect();

    }
    getedittask(data:any){
      this.Tasks=[];
      console.log("data");
      console.log(data);

      this.FillTaskSelect();
      this.fill_TasksUsers();
      //this.FillProjectTypeRequirmentSelect();
      var Check=false;
      if(data.requirmentId>0) Check=true;
      else Check=false;

      var CheckisUrgent=1;
      if(data.isUrgent==true) CheckisUrgent=4;
      else CheckisUrgent=1;

      let Task = {
        idRow:1,
        settingId:data.settingId,
        phaseTaskId:data.phaseTaskId,
        projSubTypeId:data.projSubTypeId,
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
        //this.FillProjectTypeRequirmentSelect();
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
    TaskType_setting:any;
    TaskTypesPopup:any;
    FillTaskSelect(){
      this._projectsettingService.FillTaskTypeSelect().subscribe(data=>{
        console.log(data)
        this.TaskType_setting =data;
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

        this.load_ProjectGoals=this.dataa;
        //this.load_ProjectGoals=data;

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
      var _projectPhasesTasksList:any=[];
      console.log("this.Tasks");
      console.log(this.Tasks);

      this.Tasks.forEach((element: any) => {
        this._projectPhasesTasks=new ProjectPhasesTasks();
        this._projectPhasesTasks.phaseTaskId=element.phaseTaskId;
        this._projectPhasesTasks.projSubTypeId=element.projSubTypeId;
        this._projectPhasesTasks.settingId=element.settingId;
        this._projectPhasesTasks.type=3;
        if(this.AddPotionParam.type==7){
          this._projectPhasesTasks.parentId=this.modalDetails.mainStage;
        }
        else if(this.AddPotionParam.type==8){
          this._projectPhasesTasks.parentId=this.modalDetails.subStage;
        }
        else{
        }
        this._projectPhasesTasks.descriptionAr=element.TaskNameAr_M;
        this._projectPhasesTasks.descriptionEn=element.TaskNameEn_M;
        this._projectPhasesTasks.userId=element.TaskUser_M;
        this._projectPhasesTasks.notes="";
        this._projectPhasesTasks.taskType=element.TaskType_M;
        this._projectPhasesTasks.phasePriority=element.TaskUrgent_M;
        this._projectPhasesTasks.timeType=element.TaskTimeType_M;
        this._projectPhasesTasks.timeMinutes=element.TaskDurationTime_M;
        this._projectPhasesTasks.isUrgent=(element.TaskprojectgoalsValuek_M == 4?true:false);
        _projectPhasesTasksList.push(this._projectPhasesTasks);
      });
      console.log("_projectPhasesTasksList");
      console.log(_projectPhasesTasksList);

      this._projectsettingService.SaveTaskSetting(_projectPhasesTasksList).subscribe((result: any)=>{
        if(result.statusCode==200){
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
          this.Tasks=[];
          this.getProjectSettingEdit_setting ();
          modal?.dismiss();
          this.getTasks();
        }
        else{this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));}
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
      console.log(this.nodeDataArray_setting );
      console.log(this.linkDataArray_setting );
      this.DependencyData.ProjSubTypeId=null;
      this.DependencyData.TaskLinkList=null;
      this.DependencyData.NodeLocList=null;

      var LinkArrayList = [];
      var NodelocationList = [];
      for (var i = 0; i < this.linkDataArray_setting.length; i++) {
          if (this.linkDataArray_setting [i].from != 0) {
          var dependencyObj :any = {};
          dependencyObj.DependencyId = 0;
          dependencyObj.PredecessorId = this.linkDataArray_setting [i].from;
          dependencyObj.SuccessorId = this.linkDataArray_setting [i].to;

          LinkArrayList.push(dependencyObj);
         }
      }
      if (LinkArrayList.length == 0) {
          for (var i = 0; i < this.linkDataArray_setting.length; i++) {
              if (this.linkDataArray_setting [i].from == 0) {
                  var dependencyObj1 :any = {};
                  dependencyObj1.DependencyId = 0;
                  dependencyObj1.PredecessorId = this.linkDataArray_setting [i].to;
                  dependencyObj1.SuccessorId = this.linkDataArray_setting [i].to;
                  LinkArrayList.push(dependencyObj1);
              }
          }
      }
      for (var i = 0; i < this.nodeDataArray_setting .length; i++) {
          if (this.nodeDataArray_setting [i].key != 0) {
              var LocObj :any = {};
              LocObj.LocationId = 0;
              LocObj.SettingId = this.nodeDataArray_setting [i].key;
              LocObj.ProSubTypeId = this.modalDetails.subProjectType;
              LocObj.Location = this.nodeDataArray_setting [i].loc;
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
        else{this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));}
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
      this._projectsettingService.SaveDependencySettings(obj).subscribe((result: any)=>{
        if(result.statusCode==200){
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
          this.getProjectSettingEdit_setting ();

          //mtnash reset all here
        }
        else{this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));}
      });
    }
    editProSettings() {}

  //-------------------------------------Add TAsk-------------------------------------------------------
  //#region
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
  selectedTaskType:any;
  nodeDataArray=[];
  linkDataArray=[];
  TaskType: any;

  AddTaskData:any={
    userid:null,
    tasktype:null,
    tasknamear:null,
    tasknameen:null,
    customerid:null,
    projectid:null,
    phaseid:null,
    subphaseid:null,
    timetypeid:null,
    datefrom:null,
    dateto:null,
    timefrom:null,
    timeto:null,
    taskgoal:false,
    projectgoalstxt:null,
    projectgoals:null,

    departmentCheck:false,
    departmentId:null,

    priorty:"1",
    hourTime:1,

    loaddepartmentId:[],
    loaduserid:[],
    loadtasktype:[],
    loadcustomer:[],
    loadproject:[],
    loadphases:[],
    loadsubphases:[],

    tasktypedata:{
      id:0,
      namear:null,
      nameen:null,
    },
    notVacCalc:false,

    uploadfile:[],
    TimeMinutestxt:null,
    RetCheckUserDawamBool:true,
  }
  TaskTypeRowSelected:any;
  getTasktypeRow(row :any){
    this.TaskTypeRowSelected=row;
   }
  setTaskTypeInSelect(data:any,modal:any){
    this.AddTaskData.tasktype=data.id;
    this.AddTaskData.tasknamear=data.name;
    this.AddTaskData.tasknameen=data.nameE??data.name;
    //modal?.dismiss();
  }
  confirmTasktypeDelete() {
    this._phasestaskService.DeleteTaskType(this.TaskTypeRowSelected.id).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.FillTaskTypeSelect();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));}
    });
  }

  saveTaskType() {

    if(this.AddTaskData.tasktypedata.namear==null || this.AddTaskData.tasktypedata.nameen==null)
    {
      this.toast.error("من فضلك أكمل البيانات", this.translate.instant("Message"));
      return;
    }
    var TaskTypeObj:any = {};
    TaskTypeObj.TaskTypeId = this.AddTaskData.tasktypedata.id;
    TaskTypeObj.NameAr = this.AddTaskData.tasktypedata.namear;
    TaskTypeObj.NameEn = this.AddTaskData.tasktypedata.nameen;

    var obj=TaskTypeObj;
    this._phasestaskService.SaveTaskType(obj).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.resetTaskType();
        this.FillTaskTypeSelect();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));}
    });
  }
  resetTaskType(){
    this.AddTaskData.tasktypedata.id=0;this.AddTaskData.tasktypedata.namear=null;this.AddTaskData.tasktypedata.nameen=null;
  }
  _projectRequirements:any;
  SaveFiles(phaseid: any) {
    if(phaseid==null || phaseid==0){return;}

    if(this.control?.value.length>0)
    {
      const formData: FormData = new FormData();
      formData.append('uploadesgiles', this.control?.value[0]);
      formData.append('RequirementId', String(0));
      formData.append('PhasesTaskID', phaseid);
      formData.append('PageInsert', "1");
       this._phasestaskService.SaveProjectRequirement4(formData).subscribe(result => {
       });
    }
  }
  FillAllUsersSelectsomeByBranch() {
    this._phasestaskService.FillAllUsersSelectsomeByBranch().subscribe((data) => {
      this.AddTaskData.loaduserid = data;
    });
  }

  FillAllTasks(){
    this._phasestaskService.FillAllUsersSelectAll().subscribe(data=>{
      this.AddTaskData.loaduserid=data;
    });
  }
  FillAllUsersSelect(){
    this._phasestaskService.FillAllUsersSelect().subscribe(data=>{
      this.AddTaskData.loaduserid=data;
    });
  }
  FillTaskTypeSelect(){
    this._phasestaskService.FillTaskTypeSelect().subscribe(data=>{
      this.AddTaskData.loadtasktype=data;
    });
  }
  FillCustomersOwnProjects(){
    this._phasestaskService.FillCustomersOwnProjects().subscribe(data=>{
      this.AddTaskData.loadcustomer=data;
    });
  }
  FillProjectSelectByCustomerId(){
    this.AddTaskData.projectid=null;
    if(this.projectData.customerId!=null){
      this._phasestaskService.FillProjectSelectByCustomerId(this.projectData.customerId).subscribe(data=>{
        this.AddTaskData.loadproject=data;
        this.ChangeProject();
      });
    }
    else{
      this.AddTaskData.loadproject=[];
    }

  }
  FillProjectMainPhases(){
    // this.AddTaskData.phaseid=null;
    // this.AddTaskData.subphaseid=null;
    if(this.AddTaskData.projectid!=null){
      this._phasestaskService.FillProjectMainPhases(this.AddTaskData.projectid).subscribe(data=>{
        this.AddTaskData.loadphases=data;
        if(this.AddTaskData.loadphases.length==1)
        {
          this.AddTaskData.phaseid=this.AddTaskData.loadphases[0].id;
          this.FillSubPhases();
        }
      });
    }
    else{
      this.AddTaskData.loadphases=[];
    }

  }
  FillSubPhases(){
    this.AddTaskData.subphaseid=null;
    if(this.AddTaskData.phaseid!=null){
      this._phasestaskService.FillSubPhases(this.AddTaskData.phaseid).subscribe(data=>{
        this.AddTaskData.loadsubphases=data;
        if(this.AddTaskData.loadsubphases.length==1)
        {
          this.AddTaskData.subphaseid=this.AddTaskData.loadsubphases[0].id;
        }
      });
    }
    else{
      this.AddTaskData.loadsubphases=[];
    }

  }
  updateTasktype($event:any){
    this.AddTaskData.tasknamear=$event.name;
    this.AddTaskData.tasknameen=$event.nameE??$event.name;
  }
  resetTaskData(){
    if (this.userG.userPrivileges.includes(111316)) {
      this.FillAllUsersSelectsomeByBranch();
    } else {
      this.FillAllTasks();
    }
    // this.FillAllTasks();
    this.FillDepartmentSelect();
    this.FillTaskTypeSelect();
    this.FillCustomersOwnProjects();
    this.FillProjectSelectByCustomerId();
    debugger
    this.AddTaskData={
      userid:null,
      tasktype:null,
      tasknamear:null,
      tasknameen:null,
      customerid:this.projectData.customerId,
      projectid:this.projectData.projectId,
      phaseid:null,
      subphaseid:null,
      timetypeid:2,
      datefrom:new Date(),
      dateto:new Date(),
      timefrom:null,
      timeto:null,
      taskgoal:false,
      projectgoalstxt:null,
      projectgoals:null,

      departmentCheck:false,
      departmentId:null,

      tasktypedata: {
        id: 0,
        namear: null,
        nameen: null,
      },

      priorty:"1",
      hourTime:1,
      TimeMinutestxt:1,
      RetCheckUserDawamBool:true,
    }
    this.FillProjectMainPhases();
    this.AddTaskData.phaseid=this.modalDetails.mainStage;
    this.FillSubPhases();
    if(this.AddPotionParam.type==8)
    {
      this.AddTaskData.subphaseid=this.modalDetails.subStage;
    }
  }
  Atttable:any;
  GetAllAttTimeDetails2(){
    this.Atttable=null;
    if(this.AddTaskData.userid!=null){
      this._phasestaskService.GetAllAttTimeDetails2(this.AddTaskData.userid).subscribe(data=>{
        this.Atttable=data.result;
      });
    }
    else{
      this.Atttable=null;
    }

  }

  ChangeUser(){
    this.GetAllAttTimeDetails2();
  }

  GetDayName(data:any){
    return data.dayName;
  }
  GetShift(data:any){
    try {
      var _1StFromHour = data._1StFromHour;var _1StToHour = data._1StToHour;var _2ndFromHour = data._2ndFromHour;
      var _2ndToHour = data._2ndToHour;

      var firstshift = "";var secondshift = "";var fullshifts = "";
      var firststring = "";var secondstring = "";var shiftstr = "";
      if (_1StFromHour != null && _1StToHour != null) {
        let timefrom = this._sharedService.formatTimeOnly(new Date(data._1StFromHour));
        let timeto = this._sharedService.formatTimeOnly(new Date(data._1StToHour));

        let timefrom_ampm = this._sharedService.formatAMPMOnly(new Date(data._1StFromHour));
        let timeto_ampm = this._sharedService.formatAMPMOnly(new Date(data._1StToHour));

          if (timefrom_ampm == "AM") {firststring = "صباحا";}
          else {firststring = "مساءا";}
          if (timeto_ampm == "AM") {secondstring = "صباحا";} else { secondstring = "مساءا";}
          if (firststring == "صباحا") {shiftstr = "الصباح";}
          else {shiftstr = "المساء";}
          firstshift = shiftstr+" : "+timefrom+" "+firststring+" "+timeto+" "+secondstring;
        }
      if (_2ndFromHour != null && _2ndToHour != null) {

        let timefrom = this._sharedService.formatTimeOnly(new Date(data._2ndFromHour));
        let timeto = this._sharedService.formatTimeOnly(new Date(data._2ndToHour));

        let timefrom_ampm = this._sharedService.formatAMPMOnly(new Date(data._2ndFromHour));
        let timeto_ampm = this._sharedService.formatAMPMOnly(new Date(data._2ndToHour));

        if (timefrom_ampm == "AM") {firststring = "صباحا";} else {firststring = "مساءا";}
        if (timeto_ampm == "AM") {secondstring = "صباحا";} else {secondstring = "مساءا";}
        if (firststring == "صباحا") {shiftstr = "الصباح";}
        else {shiftstr = "المساء";}
        secondshift = shiftstr+" : "+timefrom+" "+firststring+" "+timeto+" "+secondstring;
        }
      fullshifts = firstshift + " " + secondshift;
      return fullshifts;

    } catch (error) {
      return "";
    }
  }

  changetimetype(){
    if (this.AddTaskData.timetypeid == 1) {
      debugger
      this.AddTaskData.datefrom=new Date();
      this.AddTaskData.dateto=new Date();
      this.AddTaskData.TimeMinutestxt=this.AddTaskData.hourTime;
    }
    else if (this.AddTaskData.timetypeid == 2) {
      this.AddTaskData.TimeMinutestxt=null;
      var Difference_In_Time = this.AddTaskData.dateto.getTime() - this.AddTaskData.datefrom.getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      this.AddTaskData.TimeMinutestxt=Difference_In_Days + 1;
    }
  }
  CalTotalTime() {
    if (this.AddTaskData.datefrom != null && this.AddTaskData.dateto != null) {
        var Difference_In_Time = this.AddTaskData.dateto.getTime() - this.AddTaskData.datefrom.getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        this.AddTaskData.TimeMinutestxt=Difference_In_Days + 1;
    }
}

  addNewTask(modal:any) {
    if(this.AddTaskData.tasktype==null || this.AddTaskData.tasknamear==null|| this.AddTaskData.tasknameen==null
      || this.AddTaskData.customerid==null|| this.AddTaskData.projectid==null|| this.AddTaskData.phaseid==null)
    {
      this.toast.error("من فضلك أكمل البيانات", this.translate.instant("Message"));
      return;
    }
    debugger
    var Value = this.AddTaskData.loadphases.filter((a: { id: any; })=>a.id==this.AddTaskData.phaseid)[0]
    var TextValue = this.AddTaskData.loadphases.filter((a: { id: any; })=>a.id==this.AddTaskData.phaseid)[0].name;
    var TaskStatus_V = 1;
    if (TextValue == 'بدون مرحلة رئيسية') {
        TaskStatus_V = 2;
    }
    else {
        TaskStatus_V = 1;
    }
    var desc = "";


    if (this.AddTaskData.timetypeid == 1 || this.AddTaskData.timetypeid == 2) {
        if (this.AddTaskData.timefrom == null || this.AddTaskData.timeto== null) {
            this.toast.error("من فضلك تأكد من بداية المهمة ونهايتها بالتوقيت", this.translate.instant("Message"));return;
        }
        else {
            // var V=this.CheckDwamTime(this.AddTaskData.userid);
            // if (V == false) {
            //     this.toast.error("من فضلك تأكد من بداية المهمة ونهايتها بالتوقيت في فترة الدوام", this.translate.instant("Message"));return;
            // }
        }
    }
    else {
        if (this.AddTaskData.datefrom == null || this.AddTaskData.dateto == null) {
            this.toast.error("من فضلك تأكد من بداية المهمة ونهايتها بالتاريخ", this.translate.instant("Message"));return;
        }
    }
    this.CalTotalTime();
    var aaa =this.AddTaskData;
    var TaskObj:any = {};
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

    if (this.AddTaskData.datefrom.getTime() == this.AddTaskData.dateto.getTime()) {
        TaskObj.TimeMinutes = this.AddTaskData.hourTime;
    }
    else {
        TaskObj.TimeMinutes = Math.round(this.AddTaskData.TimeMinutestxt);
    }
    TaskObj.Cost = null;
    TaskObj.TimeType = this.AddTaskData.timetypeid;
    TaskObj.PhasePriority = parseInt(this.AddTaskData.priorty);
    TaskObj.StartDate = null;
    TaskObj.EndDate = null;

    if (this.AddTaskData.timetypeid == 1 || this.AddTaskData.timetypeid == 2) {
        TaskObj.TaskTimeFrom =this._sharedService.formatAMPM(this.AddTaskData.timefrom);
        TaskObj.TaskTimeTo =this._sharedService.formatAMPM(this.AddTaskData.timeto);
    }
    else {
        TaskObj.TaskTimeFrom =null;
        TaskObj.TaskTimeTo = null;
    }

    TaskObj.ExcpectedStartDate =this._sharedService.date_TO_String(this.AddTaskData.datefrom);
    TaskObj.ExcpectedEndDate = this._sharedService.date_TO_String(this.AddTaskData.dateto);
    TaskObj.ExecPercentage = 0;

    if(this.AddTaskData.taskgoal==true)
      TaskObj.ProjectGoals =1;
    else
      TaskObj.ProjectGoals =0;

    if (this.AddTaskData.subphaseid == null) {
        TaskObj.MainPhaseId = this.AddTaskData.phaseid;
        TaskObj.ParentId = this.AddTaskData.phaseid;
        TaskObj.TaskOn = 1;
    }
    else {
        TaskObj.SubPhaseId = this.AddTaskData.subphaseid;
        TaskObj.ParentId = this.AddTaskData.subphaseid;
        TaskObj.TaskOn = 2;
    }

    if (this.AddTaskData.subphaseid > 0) {

        TaskObj.SubPhaseId = this.AddTaskData.subphaseid;
        TaskObj.ParentId = this.AddTaskData.subphaseid;
        TaskObj.TaskOn = 2;
    }
    else {
        TaskObj.MainPhaseId = this.AddTaskData.phaseid;
        TaskObj.ParentId = this.AddTaskData.phaseid;
        TaskObj.TaskOn = 1;
    }
    TaskObj.NotVacCalc = this.AddTaskData.notVacCalc;

    var obj=TaskObj;

    this._phasestaskService.SaveNewProjectPhasesTasks_E(obj).subscribe((result: any)=>{
      if(result.statusCode==200){
        modal?.dismiss();
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.SaveFiles(result.returnedParm);
        this.resetTaskData();
        this.getProjectSettingEdit_setting();
        if(this.WhatsAppData.sendactivationProject==true)
        {
          this.SendWhatsAppTask(result.returnedParm,null);
        }
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));}
    });
  }
  addHours(date:any, hours:any) {
    date.setHours(date.getHours() + hours);
    return date;
  }
  ChangehourTime(){
    if(this.AddTaskData.hourTime<0 || this.AddTaskData.hourTime==null || this.AddTaskData.hourTime>24)
    {
      this.AddTaskData.hourTime=1;
    }
    // else if(this.AddTaskData.hourTime>24)
    // {
    //   this.AddTaskData.hourTime=24;
    // }
    this.AddTaskData.TimeMinutestxt=this.AddTaskData.hourTime;
    if(this.AddTaskData.timefrom!=null){
      this.SetEndTaskTimeTo(this.AddTaskData.hourTime);
    }
  }
  SetEndTaskTimeTo(hours:any) {
    debugger
      if (this.AddTaskData.timefrom!=null) {
        if(this.AddTaskData.timeto!=null)
        var startTime=this.AddTaskData.timefrom.getTime();
        var endTime = new Date(startTime + hours * 60 * 60000);
        this.AddTaskData.timeto=endTime;
      }
  }
  SetEndTaskTimeTo_Hours(startTime:any, endTime:any) {
    if (this.AddTaskData.timefrom!=null) {
        startTime = startTime.getHours();
        endTime = endTime.getHours();
        var hourDiff = endTime - startTime;
        if(hourDiff<0)hourDiff=hourDiff+24;
        this.AddTaskData.hourTime=hourDiff;
    }
  }
  END_START_CHECK(timeFrom:any, timeTo:any) {
    if (this.AddTaskData.timefrom==null || this.AddTaskData.timeto==null) {
        return
    }
    debugger
    if (timeFrom >= timeTo) {
        var hourValue = this.AddTaskData.hourTime;
        this.SetEndTaskTimeTo(hourValue);

    } else {
      this.SetEndTaskTimeTo_Hours(timeFrom, timeTo);
    }
  }
  Changetimefrom(){
    if(this.AddTaskData.hourTime<0)this.AddTaskData.hourTime=this.AddTaskData.hourTime+24;

    this.SetEndTaskTimeTo(this.AddTaskData.hourTime);
  }
  Changetimeto(){
    if (this.AddTaskData.timefrom==null || this.AddTaskData.timeto==null) {

    }
    else {
      var startTime=this.AddTaskData.timefrom.getTime();
      var endTime = this.AddTaskData.timeto.getTime();
        this.END_START_CHECK(this.AddTaskData.timefrom, this.AddTaskData.timeto);
    }
  }
  CheckDwamTime(userid:any) {
      this.AddTaskData.RetCheckUserDawamBool = true;

      let timefrom = this._sharedService.formatTimeHourOnly(this.AddTaskData.timefrom);
      let timeto = this._sharedService.formatTimeHourOnly(this.AddTaskData.timeto);

      let timefrom_ampm = this._sharedService.formatAMPMOnly(this.AddTaskData.timefrom);
      let timeto_ampm = this._sharedService.formatAMPMOnly(this.AddTaskData.timeto);
      if(timefrom_ampm == "PM")
      {
          timefrom = timefrom + 12;
      }

      if (timeto_ampm  == "PM") {
          timeto = timeto + 12;
      }
      var dayno = new Date().getDay();

      var accdayno = 0;
      if (dayno == 0) { accdayno = 2 }
      else if (dayno == 1) { accdayno = 3 }
      else if (dayno == 2) { accdayno = 4 }
      else if (dayno == 3) { accdayno = 5 }
      else if (dayno == 4) { accdayno = 6 }
      else if (dayno == 5) { accdayno = 7 }
      else if (dayno == 6) { accdayno = 1 }
      else { accdayno = 1 }

      this._phasestaskService.CheckUserPerDawamUserExist(userid,timefrom,timeto,accdayno).subscribe((result: any)=>{
        this.AddTaskData.RetCheckUserDawamBool = result.result;
      });
      return this.AddTaskData.RetCheckUserDawamBool;
  }

  ChangeProject(){
    this.FillProjectMainPhases();
    this.GetProjectById();
    this.LoadTabSetting();
  }
  GetProjectById() {
    if(this.AddTaskData.projectid!=null){
      this._phasestaskService.GetProjectById(this.AddTaskData.projectid).subscribe((result: any)=>{
        this.RemTimeProjData.produrationexpect=result.result.timeStr;
         this.getremainprojectdate(result.result.projectDate, result.result.projectExpireDate);
      });
    }
    else{
      this.RemTimeProjData.timerem=null;
      this.RemTimeProjData.prendexpect=null;
      this.RemTimeProjData.footerdetails=null;
      this.RemTimeProjData.statusLate=0;
      this.RemTimeProjData.produrationexpect=null;
    }

}

RemTimeProjData:any={
  timerem:null,
  prendexpect:null,
  footerdetails:null,
  statusLate:0,
  produrationexpect:null,
}

 getremainprojectdate(stdate:any, enddat:any) {
    var date1=new Date(enddat);
    var date2=new Date();
    var Difference_In_Time = date1.getTime() - date2.getTime();

    var Difference_In_Days = parseInt((Difference_In_Time / (1000 * 3600 * 24)).toString());

    if (date2 <= date1) {
        if (Difference_In_Days < 30 && Difference_In_Days > 0) {
            this.RemTimeProjData.timerem = Difference_In_Days + "يوم";

        } else if (Difference_In_Days == 30) {
          this.RemTimeProjData.timerem = Difference_In_Days + "شهر";
        }
        else if (Difference_In_Days > 30) {
          this.RemTimeProjData.timerem = parseInt((Difference_In_Days / 30).toString()) + "شهر" + parseInt((Difference_In_Days % 30).toString()) + "يوم";
        }
        this.RemTimeProjData.prendexpect="بعد " + this.RemTimeProjData.timerem;
        this.RemTimeProjData.footerdetails=null;
        this.RemTimeProjData.statusLate=0;
    } else if (date1 <= date2) {
      this.RemTimeProjData.prendexpect="مشروع متأخر ";
      this.RemTimeProjData.footerdetails="هذا المشروع متاخر ، ولا يمكن اضافة مهام عليه الا بعد تمديد مدة المشروع";
      this.RemTimeProjData.statusLate=1;

    }
    else {
      this.RemTimeProjData.prendexpect=null;
      this.RemTimeProjData.footerdetails=null;
      this.RemTimeProjData.statusLate=0;
    }
  }

Changeorgisreq() {
  if(this.AddTaskData.taskgoal)
  {
    if(this.AddTaskData.projectid!=null)
    {
      this._phasestaskService.FillProjectRequirmentSelect(this.AddTaskData.projectid).subscribe((result: any)=>{
        if(result.result!=null)
        {
          if(result.result.requirementGoalId!=0)
          {
            this.AddTaskData.projectgoalstxt=result.result.requirmentName;
            this.AddTaskData.projectgoals=result.result.requirementGoalId;
          }
          else
          {
            this.AddTaskData.taskgoal=false;this.AddTaskData.projectgoalstxt=null;this.AddTaskData.projectgoals=null;
          }
        }
        else{
          this.AddTaskData.taskgoal=false;this.AddTaskData.projectgoalstxt=null;this.AddTaskData.projectgoals=null;
        }
      });
    }
    else
    {
      this.AddTaskData.taskgoal=false;this.AddTaskData.projectgoalstxt=null;this.AddTaskData.projectgoals=null;
      this.toast.error("من فضلك أختر مشروع أولا", this.translate.instant("Message")); return;
    }
  }
  else
  {
    this.AddTaskData.taskgoal=false;this.AddTaskData.projectgoalstxt=null;this.AddTaskData.projectgoals=null;
  }

}
ChangedepartSwitch(){
  this.AddTaskData.userid=null;
  this.AddTaskData.departmentId=null;
  this.Atttable=null;
}
FillDepartmentSelect(){
  this._phasestaskService.FillDepartmentSelect().subscribe(data=>{
    this.AddTaskData.loaddepartmentId=data;
  });
}
public selectedNode = null;
model2 :any;
EditData:any={
  SettingData:[],
  nodeArray:[],
  linkArray:[],
}

public setSelectedNode(node:any) {
  this.selectedNode = node;
}

LoadTabSetting(){
  if(this.AddTaskData.projectid){
    this.getProjectSettingEdit(this.AddTaskData.projectid);
  }
  else{
    this.EditData.nodeArray=[];
    this.EditData.linkArray=[];
    this.nodeDataArray =[];
    this.linkDataArray =[];
  }
}
ProjectName:any;
getProjectSettingEdit(projectid:any){

  this.EditData.nodeArray=[];
  this.EditData.linkArray=[];
  this.nodeDataArray =[];
  this.linkDataArray =[];

  if(projectid==null)
  {
    this.model2 = new go.GraphLinksModel(this.nodeDataArray, this.linkDataArray);
    return;
  }
  this.ProjectName=this.AddTaskData.loadproject.filter((ele: { id: any; })=>ele.id==projectid)[0].name;

  this._projectsettingService.GetAllNodesTasks(projectid).subscribe(res=>{
      this.EditData.SettingData=res;
      this.EditData.nodeArray.push({ "key": 0, "loc": "-584 -74", "name": this.ProjectName, "colorfill": "#0fac03" })
      res.nodeDataArray.forEach((r: any) => {
        if (r.nodeLocation != null) {
          if (r.type === 1) {   //mainphase
            this.EditData.nodeArray.push({ "key": r.settingId, "loc": r.nodeLocation, "name": r.descriptionAr, isGroup: true, "colorfill": "#70b9dc" })
          }
          else if (r.type === 2) { //subphase
            this.EditData.nodeArray.push({ "key": r.settingId, "loc": r.nodeLocation, "name": r.descriptionAr, group: r.parentId, isGroup: true, "colorfill": "#b7e89d"  })
          }
          else {  ///task
            this.EditData.nodeArray.push({ "key": r.settingId, "loc": r.nodeLocation, "name": r.descriptionAr, group: r.parentId, "toolTipName": r.userName, "colorfill": "#fe9100" })
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
            this.EditData.nodeArray.push({ "key": r.settingId, "name": r.descriptionAr, group: r.parentId, "toolTipName": r.userName, "colorfill": "#fe9100" })
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
      this.model2 = new go.GraphLinksModel(this.nodeDataArray, this.linkDataArray);
  });
}

  //#endregion
  //-------------------------------(End)------Add TAsk---------------------------------------------------

  TasksDependencyData:any={
    ProjectId:null,
    TaskLinkList:null,
    NodeLocList:null
  };
  SaveProSettingFun() {
    this.TasksDependencyData.ProjectId=null;
    this.TasksDependencyData.TaskLinkList=null;
    this.TasksDependencyData.NodeLocList=null;

    var LinkArrayList = [];
    var NodelocationList = [];
    debugger
    for (var i = 0; i < this.linkDataArray_setting.length; i++) {
      if (this.linkDataArray_setting[i].from != 0) {
          var dependencyObj:any = {};
          dependencyObj.DependencyId = 0;
          dependencyObj.PredecessorId = this.linkDataArray_setting[i].from;
          dependencyObj.SuccessorId = this.linkDataArray_setting[i].to;
          LinkArrayList.push(dependencyObj);
      }
    }
    for (var i = 0; i < this.nodeDataArray_setting.length; i++) {
        if (this.nodeDataArray_setting[i].key != 0) {
            var LocObj:any = {};
            LocObj.LocationId = 0;
            LocObj.TaskId = this.nodeDataArray_setting[i].key;
            LocObj.ProjectId = this.projectData.projectId;
            LocObj.Location = this.nodeDataArray_setting[i].loc;
            NodelocationList.push(LocObj);
        }
    }
    this.TasksDependencyData.ProjectId=this.projectData.projectId;
    this.TasksDependencyData.TaskLinkList=LinkArrayList;
    this.TasksDependencyData.NodeLocList=NodelocationList;
    var obj=this.TasksDependencyData;
    this._projectsettingService.SaveDependencyPhasesTask(obj).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.getProjectSettingEdit_setting ();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));}
    });

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
    SendWhatsAppTask(taskId:any,projectid:any) {
      const formData = new FormData();
      if(taskId!=null){formData.append('taskId', taskId);}
      if(projectid!=null){formData.append('projectid', projectid);}
      formData.append('environmentURL', environment.PhotoURL);
      this._phasestaskService.SendWhatsAppTask(formData).subscribe((result: any) => {

      });
    }
}
