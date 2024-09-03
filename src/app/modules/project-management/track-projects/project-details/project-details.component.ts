
import { SelectionModel } from '@angular/cdk/collections';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subscription } from 'rxjs';
import { RestApiService } from 'src/app/shared/services/api.service';
import { ProjectdetailsService } from './../../../../core/services/pro_Services/projectdetails.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { environment } from 'src/environments/environment';
import { NodeItem, TreeCallbacks, TreeMode } from 'tree-ngx';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { FileuploadcenterService } from 'src/app/core/services/pro_Services/fileuploadcenter.service';
import { ProjectFiles } from 'src/app/core/Classes/DomainObjects/projectFiles';
import { Project } from 'src/app/core/Classes/DomainObjects/project';
import { OfferpriceService } from 'src/app/core/services/pro_Services/offerprice.service';
import printJS from 'print-js'
import { NgxPrintElementService } from 'ngx-print-element';
import { SupervisionsService } from 'src/app/core/services/pro_Services/supervisions.service';
import 'hijri-date';
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { PhasestaskService } from 'src/app/core/services/pro_Services/phasestask.service';
import { OutInboxrviceService } from 'src/app/core/services/Communications/out-inboxrvice.service';
const hijriSafe= require('hijri-date/lib/safe');
const HijriDate =  hijriSafe.default;
const toHijri  = hijriSafe.toHijri;


@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent | any;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('paginatorSupervision') paginatorSupervision: MatPaginator;
  @ViewChild('paginatorTask') paginatorTask: MatPaginator;
  @ViewChild('paginatorNoti') paginatorNoti: MatPaginator;
  @ViewChild('paginatorFile') paginatorFile: MatPaginator;
  @ViewChild('paginatorWorkorder') paginatorWorkorder: MatPaginator;

  @ViewChild('paginatorInbox') paginatorInbox: MatPaginator;
  @ViewChild('paginatorOutbox') paginatorOutbox: MatPaginator;
  @ViewChild('paginatorInboxFile') paginatorInboxFile: MatPaginator;
  @ViewChild('paginatorOutboxFile') paginatorOutboxFile: MatPaginator;
  @ViewChild('paginatorCustomerFiles') paginatorCustomerFiles: MatPaginator;


  @Input() projectDetails: any;


  users: any;
  dateNow = new Date();
  closeResult: any;

  isEditable: any = {};
  userG : any = {};



  TasksDisplayedColumns: string[] = [
    'taskName',
    'taskStatus',
    'assigned',
    'duration',
    'start_date',
    'end_date',
    'operations',
  ];

  projectFilesDisplayedColumns: string[] = [
    'uploadDate',
    'fileName',
    'fileType',
    'filePageInsert',
    'user',
    'notes',
    'operations',
  ];

  noticesDisplayedColumns: string[] = ['title', 'date', 'from', 'to'];

  documentsDisplayedColumns: string[] = [
    'name',
    'type',
    'comment',
    'operations',
  ];

  projectOutgoingDisplayedColumns: string[] = [
    'id',
    'important',
    'type',
    'date',
    'archive',
    'entity',
    'to',
  ];

  projectOutgoingFilesDisplayedColumns: string[] = [
    'FileName',
    'uploadDate',
    'operations',
  ];

  projectWardDisplayedColumns: string[] = [
    'id',
    'important',
    'type',
    'date',
    'archive',
    'entity',
    'to',
  ];

  projectWardFilesDisplayedColumns: string[] = [
    'FileName',
    'uploadDate',
    'operations',
  ];

  workOrdersDisplayedColumns: string[] = [
    'name',
    'type',
    'assigned',
    'duration',
    'start',
    'end',
  ];

  supervisionDisplayedColumns: string[] = [
    'id',
    'stage',
    'assigned',
    'Commissioning_date',
    'status',
    'operations',
  ];

  projectFilesDataSource = new MatTableDataSource();




  projectTasks: any;
  projectNotics: any;
  projectFiles: any;
  projectDocuments: any;

  projectOutgoing: any;
  projectOutgoingFiles: any;
  projectWard: any;
  projectWardFiles: any;

  filterByDate: any;

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
  Licensedate_Convert:any=null;
  addedImg:any=null;
  managerImg:any=null;

  percentagePro=0;

  // ProjPriv:any={
  //   SelectPriv:false,
  //   AddPriv:false,
  //   EditPriv:false,
  //   DeletePriv:false,
  // }
  // resetProjPriv(){
  //   this.ProjPriv={
  //     SelectPriv:false,
  //     AddPriv:false,
  //     EditPriv:false,
  //     DeletePriv:false,
  //   }
  // }
  constructor(private modalService: NgbModal,
    private _phasestaskService: PhasestaskService,
    private _projectdetailsService: ProjectdetailsService,
    private _fileuploadcenterService: FileuploadcenterService,
    private authenticationService: AuthenticationService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private _offerpriceService: OfferpriceService,
    private _supervisionsService: SupervisionsService,
    private print: NgxPrintElementService,
    private translate: TranslateService,
    private _outinbox :OutInboxrviceService) {
      this.userG = this.authenticationService.userGlobalObj;
      console.log(this.userG);


    }

  ngOnInit(): void {
    this.SetNullValues();
    debugger
    if(this.projectDetails?.licensedate!="" && this.projectDetails?.licensedate!=null)
    {
      this.Licensedate_Convert=this._sharedService.String_TO_date(this.projectDetails.licensedate);
    }
    if(this.projectDetails?.addedUserImg!="" && this.projectDetails?.addedUserImg!=null)
    {
      this.addedImg=environment.PhotoURL+this.projectDetails?.addedUserImg;
    }
    this.percentagePro=this.SetPerProjectDetails(this.projectDetails);

    this.GetProDetailsReadyVm();
    this.GetAllSupervisions();
    this.LoadTasksGrid();
    this.GetAllNotifications();
    //this.GetAllFilesForProject();
    this.loadallFilesTree();
    this.data.files=[];
    this.data.allProjectNumbers=[];
    this.FillFileTypeSelect();
    this.GetAllCustomerFiles();
    this.LoadInboxGrid();
    this.LoadOutboxGrid();
    this.GetAllInstruments();
    this.LoadOfferPrices();
    this.LoadServices();
    this.LoadConditions();

    //this.GetAllWorkOrdersyProjectId();
  }

  SetNullValues(){
    this.resetInstruments();
    if(this.projectDetails.regionTypeId==0 || this.projectDetails.regionTypeId=="")
    {
      this.projectDetails.regionTypeId=null;
    }
    if(this.projectDetails.pieceNo==0 || this.projectDetails.pieceNo=="")
    {
      this.projectDetails.pieceNo=null;
    }
    if(this.projectDetails.contractorSelectId==0 || this.projectDetails.contractorSelectId=="")
    {
      this.projectDetails.contractorSelectId=null;
    }
    if(this.projectDetails.cityId==0 || this.projectDetails.cityId=="")
    {
      this.projectDetails.cityId=null;
    }
    if(this.projectDetails.buildingType==0 || this.projectDetails.buildingType=="")
    {
      this.projectDetails.buildingType=null;
    }
    if(this.projectDetails.municipalId==0 || this.projectDetails.municipalId=="")
    {
      this.projectDetails.municipalId=null;
    }
    if(this.projectDetails.subMunicipalityId==0 || this.projectDetails.subMunicipalityId=="")
    {
      this.projectDetails.subMunicipalityId=null;
    }
    if(this.projectDetails.adwAR==0 || this.projectDetails.adwAR=="")
    {
      this.projectDetails.adwAR=null;
    }
    console.log(this.projectDetails);
    console.log(this.projectDetails.stopProjectType);
    console.log(this.projectDetails.status);


    // this.GetAllPrivUser();
  }

  // GetAllPrivUser(){
  //   this._projectdetailsService.GetAllPrivUser(this.projectDetails.projectId).subscribe(data=>{
  //     if(data.length>0)
  //     {
  //       debugger
  //       this.ProjPriv.SelectPriv=data[0].select;
  //       this.ProjPriv.AddPriv=data[0].insert;
  //       this.ProjPriv.EditPriv=data[0].update;
  //       this.ProjPriv.DeletePriv=data[0].delete;
  //     }
  //     else{
  //       this.resetProjPriv();
  //     }
  //   });
  // }
  serviceDetails: any;
  GetServicesPriceByParentId(element:any){
    debugger
    this.serviceDetails=[];
    if(element.AccJournalid!=null)
    {
      this._offerpriceService.GetServicesPriceVouByParentId(element.AccJournalid,element.offerId).subscribe(data=>{
        this.serviceDetails = data.result;
      });
    }
  }

  open(content: any, data?: any, type?: any) {

    if (type == 'serviceDetails' && data) {
      this.GetServicesPriceByParentId(data);
    }

    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
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

  private getDismissReason(reason: any, type?: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


//----------------------------------------------
ProDetailsReadyVm:any
GetProDetailsReadyVm(){
  this._projectdetailsService.GetProDetailsReadyVm(this.projectDetails.projectId,this.projectDetails.mangerId).subscribe(data=>{
    this.ProDetailsReadyVm = data;
    this.workOrdersDataSource = new MatTableDataSource(data.workOrder.result);
    this.workOrdersDataSource.paginator = this.paginatorWorkorder;
    //this.workOrdersDataSource.sort = this.sort;
    debugger
    if(data.users.result.imgUrl!="" && data.users.result.imgUrl!=null)
    {
      this.managerImg=environment.PhotoURL+data.users.result.imgUrl;
    }

    this.InstrumentSourcesPopup=this.InstrumentSources=this.ProDetailsReadyVm?.prodetailsInstrumentSources_DropLoad;
    this.RegionTypesPopup=this.RegionTypes=this.ProDetailsReadyVm?.projectDetailsRegion_DropLoad;
    this.ProjectPiecesPopup=this.ProjectPieces=this.ProDetailsReadyVm?.workOrderProDetPicNo_DropLoad;
    this.ContractorsPopup=this.Contractors=this.ProDetailsReadyVm?.contractor_DropLoad;
    this.MunicipalsPopup=this.Municipals=this.ProDetailsReadyVm?.municipal_DropLoad;
    this.SubMunicipalitysPopup=this.SubMunicipalitys=this.ProDetailsReadyVm?.subMunicipality_DropLoad;
    this.BuildTypePopup=this.BuildType=this.ProDetailsReadyVm?.proBuilding_DropLoad;
  });
}





SetPerProjectDetails(dataObj:any){
  debugger;
  var date1 = new Date(dataObj.projectExpireDate);
  var date2 = new Date();
  var date3 = new Date(dataObj.projectDate);
  if(dataObj.status==0)
  {
    date2 = new Date();
  }
  else
  {
    if(dataObj.finishDate!=null)
    {
      date2 = this._sharedService.String_TO_date(dataObj.finishDate);
    }
    else
    {
      date2 = new Date();
    }
  }
  var Difference_In_Time = date2.getTime() - date3.getTime();
  var Difference_In_Time2 = date1.getTime() - date3.getTime();
  var Difference_In_Days = parseInt((Difference_In_Time / (1000 * 3600 * 24)).toString());
  var Difference_In_Days2 = parseInt((Difference_In_Time2 / (1000 * 3600 * 24)).toString());
  var perc = (Difference_In_Days / Difference_In_Days2);
  var percentage = parseInt((perc * 100).toString());
  return percentage;
}
resetcontractorData(){
  this.projectDetails.contractorEmail_T=null;
  this.projectDetails.contractorPhone_T=null;
  this.projectDetails.contractorCom_T=null;
}
// GetContractorData(){
//   debugger
//   this.resetcontractorData();
//   if(this.projectDetails?.contractorSelectId>0)
//   {
//     this._projectdetailsService.GetContractorData(this.projectDetails.contractorSelectId).subscribe(data=>{
//       this.projectDetails.contractorEmail_T=data.email;
//       this.projectDetails.contractorPhone_T=data.phoneNo;
//       this.projectDetails.contractorCom_T=data.commercialRegister;
//     });
//   }
// }

projectSupervisionDataSource = new MatTableDataSource();
GetAllSupervisions(){
  this._projectdetailsService.GetAllSupervisions(this.projectDetails.projectId).subscribe(data=>{
    console.log(data);
    this.projectSupervisionDataSource = new MatTableDataSource(data);
    this.projectSupervisionDataSource.paginator = this.paginatorSupervision;
    //this.projectSupervisionDataSource.sort = this.sort;
  });
}

projectNoticesDataSource = new MatTableDataSource();
GetAllNotifications(){
  this._projectdetailsService.GetAllNotifications(this.projectDetails.projectId).subscribe(data=>{
    this.projectNoticesDataSource = new MatTableDataSource(data.result);
    this.projectNoticesDataSource.paginator = this.paginatorNoti;
  });
}

workOrdersDataSource = new MatTableDataSource();
GetAllWorkOrdersyProjectId(){
  this._projectdetailsService.GetAllWorkOrdersyProjectId(this.projectDetails.projectId).subscribe(data=>{
    this.workOrdersDataSource = new MatTableDataSource(data.result);
    this.workOrdersDataSource.paginator = this.paginatorWorkorder;
    //this.workOrdersDataSource.sort = this.sort;
  });
}

TaskNameSearch:any=null;
projectTasksDataSource = new MatTableDataSource();


//#region


FileData_phase:any={
  selected:false,
  Obj:null,
}
GetFilesById_phase(fileId:any){
  debugger
  if(parseInt(fileId)==0)
  {
    this.FileData_phase={
      selected:this.FileData_phase.selected,
      Obj:{
        nameAr:null,
        pageInsertName:null,
      }
    }
    this.FileData_phase.Obj.nameAr="لا يوجد";
    this.FileData_phase.Obj.pageInsertName="لا يوجد";

    return;
  }
  this._fileuploadcenterService.GetAllProjectRequirementById(fileId).subscribe(data=>{
      console.log(data);
      this.FileData_phase.Obj = data[0];
  });
}
TaskData:any={
  selected:false,
  Obj:null,
  TaskTimeFrom_Merge:null,
  TaskTimeTo_Merge:null,
  priorty:null,
  goalcheck:false,
  goalname:null,
  notesStrVac:null,
  AchievementStatus:null,
}
phasePriValue:any="1";
phasePriValueTemp:any="1";
taskLongDesc:any="";
taskLongDescTemp:any="";
statuscolor:any = '';
GetTaskListtxt(phaseid:any){
  debugger
  this._phasestaskService.GetTaskListtxt(phaseid).subscribe(data=>{
      this.TaskData.Obj=data.result;
    console.log(this.TaskData.Obj);
      if (data.result.taskTimeFrom == "" || data.result.taskTimeTo == "") {
          this.TaskData.TaskTimeFrom_Merge = data.result.taskStart;
          this.TaskData.TaskTimeTo_Merge = data.result.endDateCalc;
      }
      else {

        this.TaskData.TaskTimeFrom_Merge = JSON.stringify(data.result.taskStart + " - " + data.result.taskTimeFrom);
        this.TaskData.TaskTimeTo_Merge = JSON.stringify(data.result.endDateCalc + " - " + data.result.taskTimeTo);
      }
      var priorty = "بدون";
      if (data.result.phasePriority == 1) {priorty = "منخفض";}
      else if (data.result.phasePriority == 2) {priorty = "متوسط";}
      else if (data.result.phasePriority == 3) {priorty = "مرتفع";}
      else if (data.result.phasePriority == 4) {priorty = "عاجل";}
      else {priorty = "بدون";}
      this.TaskData.priorty=priorty;
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
      this.phasePriValue=String(data.result.phasePriority);
      this.phasePriValueTemp=this.phasePriValue;
      this.taskLongDesc=data.result.taskLongDesc;
      this.taskLongDescTemp=this.taskLongDesc;
      debugger


      var result = [];


      if(data.result.status==4)
        {
          var Rem=data.result.remaining;
          if (Rem != null) {
            if(Rem>0)
              {
                this.statuscolor='greenCla';
                result.push('أنجزت قبل موعدها ب : ');
                var value = Rem;
                var units: any = {
                  سنة: 24 * 60 * 365,
                  شهر: 24 * 60 * 30,
                  اسبوع: 24 * 60 * 7,
                  يوم: 24 * 60,
                  ساعة: 1 * 60,
                  دقيقة: 1,
                };
                for (var name in units) {
                  var p = Math.floor(value / units[name]);
                  if (p == 1) result.push(p + ' ' + name);
                  if (p >= 2) result.push(p + ' ' + name);
                  value %= units[name];
                }
              }
              else if(Rem<0){
                Rem=Rem*-1;
                this.statuscolor='redCla';
                result.push('أنجزت بعد موعدها ب : ');
                var value = Rem;
                var units: any = {
                  سنة: 24 * 60 * 365,
                  شهر: 24 * 60 * 30,
                  اسبوع: 24 * 60 * 7,
                  يوم: 24 * 60,
                  ساعة: 1 * 60,
                  دقيقة: 1,
                };
                for (var name in units) {
                  var p = Math.floor(value / units[name]);
                  if (p == 1) result.push(p + ' ' + name);
                  if (p >= 2) result.push(p + ' ' + name);
                  value %= units[name];
                }
              }
              else{
                this.statuscolor='yellowCla';
                result.push("في المعاد بالتحديد");
              }
          }
        }
        else
        {
          this.statuscolor='';
          result.push("لم تنتهي المهمة بعد");
        }
        this.TaskData.AchievementStatus=result;
  });
}






ShowImgAdded_phase() {
  var img=environment.PhotoURL+this.FileData_phase.Obj?.addedFileImg;
  return img;
}
ShowImgManager_phase() {
  var img=environment.PhotoURL+this.FileData_phase.Obj?.projectManagerImg;
  return img;
}

selectedFile1_phase: any;

selectTask_phase(){
  debugger
  if(this.selectedFile1_phase[0]!=null)
  {
    this.FileData_phase.selected=true;
    this.GetFilesById_phase(parseInt(this.selectedFile1_phase[0].phaseid));
    this.GetTaskListtxt(parseInt(this.selectedFile1_phase[0].phaseTaskId));
  }
  else{
    this.FileData_phase.selected=false;
  }
}
//#endregion

loadTasksTreeObj:any=[];

LoadTasksGrid(){

  const formData = new FormData();
  if(this.projectDetails.projectId!=null){formData.append('ProjectId', this.projectDetails.projectId);}
  if(this.TaskNameSearch!=null){formData.append('SearchText', this.TaskNameSearch);}

  debugger
  if(this.selectedFile1_phase?.length)
  {
    if(this.selectedFile1_phase[0]!=null)
    {
      this.GetFilesById_phase(parseInt(this.selectedFile1_phase[0].phaseid));
      this.GetTaskListtxt(parseInt(this.selectedFile1_phase[0].phaseTaskId));
    }
  }

  this._projectdetailsService.LoadTasksGridTree(formData).subscribe(data=>{
    // this.projectTasksDataSource = new MatTableDataSource(data);
    // this.projectTasksDataSource.paginator = this.paginatorTask;
    this.loadTasksTreeObj=data;
    console.log(this.loadTasksTreeObj);
  });
}

mergeS(Obj:any){
  if (Object.keys(Obj).length===0)return "";

  var TaskTimeTo_Merge = "";
  if (Obj.taskTimeFrom == "" || Obj.taskTimeFrom == null) {
      TaskTimeTo_Merge = Obj.taskStart;
  }
  else {
      TaskTimeTo_Merge = JSON.stringify(Obj.taskStart + " - " + Obj.taskTimeFrom);
  }
  return TaskTimeTo_Merge;
}
mergeE(Obj:any){
  if (Object.keys(Obj).length===0)return "";

  var TaskTimeTo_Merge = "";
  if (Obj.taskTimeTo == "" || Obj.taskTimeTo == null) {
      TaskTimeTo_Merge = Obj.endDateCalc;
  }
  else {
      TaskTimeTo_Merge = JSON.stringify(Obj.endDateCalc + " - " + Obj.taskTimeTo);
  }
  return TaskTimeTo_Merge;
}


getAchievementStatus(element: any) {
  // if (Object.keys(element).length===0)return "";
  var result = [];
  if(element.status==4)
    {
      var Rem=element.remaining;
      if (Rem != null) {
        if(Rem>0)
          {
            var value = Rem;
            var units: any = {
              سنة: 24 * 60 * 365,
              شهر: 24 * 60 * 30,
              اسبوع: 24 * 60 * 7,
              يوم: 24 * 60,
              ساعة: 1 * 60,
              دقيقة: 1,
            };
            for (var name in units) {
              var p = Math.floor(value / units[name]);
              if (p == 1) result.push(p + ' ' + name);
              if (p >= 2) result.push(p + ' ' + name);
              value %= units[name];
            }
          }
          else if(Rem<0){
            Rem=Rem*-1;

            var value = Rem;
            var units: any = {
              سنة: 24 * 60 * 365,
              شهر: 24 * 60 * 30,
              اسبوع: 24 * 60 * 7,
              يوم: 24 * 60,
              ساعة: 1 * 60,
              دقيقة: 1,
            };
            for (var name in units) {
              var p = Math.floor(value / units[name]);
              if (p == 1) result.push(p + ' ' + name);
              if (p >= 2) result.push(p + ' ' + name);
              value %= units[name];
            }
          }
          else{
            result.push("في المعاد بالتحديد");
          }
      }
    }
    else
    {
      result.push("لم تنتهي المهمة بعد");
    }

  return result;
}


getAchievementStatusColor(element: any) {
  // if (Object.keys(element).length===0){return ""};
  let statuscolor = '';
  if(element.status==4)
    {
      if (element.remaining != null) {
        if(element.remaining>0)
          {
            statuscolor='greenCla';
          }
          else if(element.remaining<0){
            statuscolor='redCla';
          }
          else{
            statuscolor='yellowCla';
          }
      }
    }
    else
    {
      statuscolor='';
    }
  return statuscolor;
}

TaskRowSelected:any;
getTaskRow(data:any){
  debugger
  this.TaskRowSelected=data;
}
RetrievedReason:any=null;
RestartTask(modal:any) {
  if(this.RetrievedReason==null || this.RetrievedReason=="")
  {
    this.toast.error("من فضلك أدخل السبب", this.translate.instant("Message"));
    return;
  }
  this._projectdetailsService.RestartTask(this.TaskRowSelected.phaseTaskId,this.RetrievedReason).subscribe((result: any)=>{
    if(result.statusCode==200){
      this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
      this.RetrievedReason=null;
      modal.dismiss();
      this.LoadTasksGrid();
    }
    else{this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));}
  });
}
SupervisionRow:any;
superimgtype:any=1;
GetSuperRow(element:any,type:any){
  this.SupervisionRow=element;
  this.superimgtype=type;
}
UploadHeadImage(modal:any){
  debugger
  if(this.control?.value.length>0){
    var formData = new FormData();
    formData.append('uploadesgiles', this.control?.value[0]);
    formData.append('SupervisionId', this.SupervisionRow.supervisionId);
    if(this.superimgtype==1)
    {
      this._projectdetailsService.UploadHeadImageFir(formData).subscribe(result => {
        if(result.statusCode==200){
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
          this.control.clear();
          modal?.dismiss();
          this.GetAllSupervisions();
        }
        else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"))};
      });
    }
    else
    {
      this._projectdetailsService.UploadHeadImageSec(formData).subscribe(result => {
        if(result.statusCode==200){
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
          this.control.clear();
          modal?.dismiss();
          this.GetAllSupervisions();
        }
        else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"))};
      });
    }

  }
  else{
    this.toast.error("من فضلك أختر ملف أولا ", this.translate.instant("Message"));return;
  }
}
downloadimageUrlSupervision(data: any) {
  debugger
  try
  {
    var link=environment.PhotoURL+data.imageUrl;
    window.open(link, '_blank');
  }
  catch (error)
  {
    this.toast.error("تأكد من الملف", 'رسالة');
  }
}
downloadimageUrl2_Supervision(data: any) {
  debugger
  try
  {
    var link=environment.PhotoURL+data.imageUrl2;
    window.open(link, '_blank');
  }
  catch (error)
  {
    this.toast.error("تأكد من الملف", 'رسالة');
  }
}

projectDocumentsDataSource = new MatTableDataSource();
GetAllCustomerFiles(){
  this._projectdetailsService.GetAllCustomerFiles(this.projectDetails.customerId).subscribe(data=>{
    this.projectDocumentsDataSource = new MatTableDataSource(data.result);
    this.projectDocumentsDataSource.paginator = this.paginatorCustomerFiles;
  });
}
downloadFile_Customer(data: any) {
  try
  {
    var link=environment.PhotoURL+data.fileUrl;
    window.open(link, '_blank');
  }
  catch (error)
  {
    this.toast.error("تأكد من الملف", 'رسالة');
  }
}


getsendname(data:any){
  if(data.sendUserId==1){
    return 'SysNotification'
  }else{
    return data.sendUserName;
  }
}

//-----inbox and outbox
projectOutgoingDataSource = new MatTableDataSource();
projectOutgoingFilesDataSource = new MatTableDataSource();
projectWardDataSource = new MatTableDataSource();
projectWardFilesDataSource = new MatTableDataSource();

LoadInboxGrid(){
  this._projectdetailsService.GetOutInboxProjectFiles(2,this.projectDetails.projectId).subscribe(data=>{
    this.projectWardDataSource = new MatTableDataSource(data.result);
    this.projectWardDataSource.paginator = this.paginatorInbox;
  });
}
LoadInboxFileGrid(data:any){
  this._projectdetailsService.GetAllFiles(data.outInBoxId).subscribe(data=>{
    this.projectWardFilesDataSource = new MatTableDataSource(data.result);
    this.projectWardFilesDataSource.paginator = this.paginatorInboxFile;
  });
}
LoadOutboxGrid(){
  this._projectdetailsService.GetOutInboxProjectFiles(1,this.projectDetails.projectId).subscribe(data=>{
    this.projectOutgoingDataSource = new MatTableDataSource(data.result);
    this.projectOutgoingDataSource.paginator = this.paginatorOutbox;
  });
}
LoadOutboxFileGrid(data:any){
  this._projectdetailsService.GetAllFiles(data.outInBoxId).subscribe(data=>{
    this.projectOutgoingFilesDataSource = new MatTableDataSource(data.result);
    this.projectOutgoingFilesDataSource.paginator = this.paginatorOutboxFile;
  });
}

downloadFile_InOutBox(data: any) {
  try
  {
    var link=environment.PhotoURL+data.fileUrl;
    window.open(link, '_blank');
  }
  catch (error)
  {
    this.toast.error("تأكد من الملف", 'رسالة');
  }
}



//--------------------------------------------

//---------------------filetype---------------
data: any = {
  filter: {
    enable: false,
    date: null,
    isChecked:false,
    filetypesearch:null,
    FileNameSearch:null,
  },
  file: {
    nameAr: null,
    nameEn: null,
    id: 0,
  },
  files: {
    nameAr: null,
    nameEn: null,
    id: 0,
  },
  FileId:0,
  FileName:null,
  FileTypeValue:null,
  Certificate:false,
  allProjectNumbers: [],
  allProjectNumbersTemp: [],
  fileTemp: [],

};
public _projectFiles: ProjectFiles;

FileRowSelected:any;
FileTypeRowSelected:any;
FileShareData:any={
  ShareTimetxt:1,
  ShareTypeHour:"1",
  SelectmaterialCheckedShare:false,
}
resetfileshare(){
  this.FileShareData={
    ShareTimetxt:1,
    ShareTypeHour:"1",
    SelectmaterialCheckedShare:false,
  }
}


share(modal:any) {

  if(this.FileShareData.ShareTimetxt<=0)
  {
    this.toast.error("من فضلك اكتب مدة المشاركة بطريقة صحيحة", 'رسالة');return;
  }
  if(this.FileShareData.SelectmaterialCheckedShare==false)
  {
    this.toast.error("من فضلك اختر مشاهدة", 'رسالة');return;
  }

  var ShareObj:any = {};
  ShareObj.FileId = this.FileRowSelected.fileId;
  ShareObj.ViewShare = this.FileShareData.SelectmaterialCheckedShare;
  ShareObj.DonwloadShare = false;
  ShareObj.IsShare = true;
  ShareObj.TimeShare = this.FileShareData.ShareTimetxt;
  ShareObj.TimeTypeShare = parseInt(this.FileShareData.ShareTypeHour);
  this._projectdetailsService.UpdateFileShare(ShareObj).subscribe((result: any)=>{
    if(result?.statusCode==200){
      this.toast.success(result?.reasonPhrase,'رسالة');
      this.loadallFilesTree();
      this.resetfileshare();
      modal.dismiss('Cross click');
    }
    else{this.toast.error(result?.reasonPhrase, 'رسالة');}

  });
}

confirmCancelFileShare() {
  var ShareObj:any = {};
  ShareObj.FileId = this.FileRowSelected.fileId;
  this._projectdetailsService.NotUpdateFileShare(ShareObj).subscribe((result: any)=>{
    if(result?.statusCode==200){
      this.toast.success(result?.reasonPhrase,'رسالة');
      this.loadallFilesTree();
    }
    else{this.toast.error(result?.reasonPhrase, 'رسالة');}
  });
}


checkExistbtn(data:any){
  var now = new Date().getTime();
  var countDown = new Date(data?.timeShareDate).getTime();
  var timeleft = countDown - now;
  if (data?.isShare && timeleft > 0){
    return false;
  }
  else{
    return true;
  }
}

GetAllFilesForProject(){
  this._fileuploadcenterService.GetAllFilesForProject(this.projectDetails.projectId,null,null,null,null).subscribe(data=>{
      this.projectFilesDataSource = new MatTableDataSource(data);
      this.projectFilesDataSource.paginator = this.paginatorFile;
      //this.projectFilesDataSource.sort = this.sortFile;
  });
}
getDataCert(){
  this._fileuploadcenterService.GetAllCertificateFiles(this.projectDetails.projectId,this.data.filter.isChecked).subscribe(data=>{
      this.projectFilesDataSource = new MatTableDataSource(data);
      this.projectFilesDataSource.paginator = this.paginatorFile;
      //this.projectFilesDataSource.sort = this.sortFile;
      //this.data.allProjectNumbers = data.length;
  });
}
downloadFile(data: any) {
  debugger
  var link=environment.PhotoURL+data.fileUrl;
  window.open(link, '_blank');
}
downloadFileW(data: any) {
  var link=environment.PhotoURL+data.fileUrlW;
  window.open(link, '_blank');
}

downloadFileReq(data: any) {
  debugger
  var link=environment.PhotoURL+data.attachmentUrl;
  window.open(link, '_blank');
}

confirmDelete_phase() {
  debugger
  this._fileuploadcenterService.DeleteRequirement(this.FileRowSelected.requirementId).subscribe((result: any)=>{
    if(result.statusCode==200){
      this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
      this.selectedFile1_phase[0]=null;
      this.FileData_phase.selected=false;
      this.LoadTasksGrid();
    }
    else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
  });
}
confirmDelete() {
  this._fileuploadcenterService.DeleteFile(this.FileRowSelected.fileId).subscribe((result: any)=>{
    if(result.statusCode==200){
      this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
      this.selectedFile1[0]=null;
      this.FileData.selected=false;
      this.loadallFilesTree();
    }
    else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
  });
}
confirmFiletypeDelete() {
  this._fileuploadcenterService.DeleteFileType(this.FileTypeRowSelected.id).subscribe((result: any)=>{
    if(result.statusCode==200){
      this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
      this.FillFileTypeSelect();
    }
    else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
  });
}

getRow(row :any){
  this.FileRowSelected=row;
 }
 getFiletypeRow(row :any){
  this.FileTypeRowSelected=row;
 }
 CheckDate(event: any){
  if(event!=null)
  {
    var from= this._sharedService.date_TO_String(event[0]);
    var to= this._sharedService.date_TO_String(event[1]);
    this.data.filter.DateFrom_P=from;
    this.data.filter.DateTo_P=to;
    this.loadallFilesTree();
  }
  else{
    this.data.filter.DateFrom_P=null;
    this.data.filter.DateTo_P=null;
    this.loadallFilesTree();
  }
}
RefreshData_ByDate(from: any,to: any) {
  this._fileuploadcenterService.GetAllFilesForProject(this.projectDetails.projectId,null,from,to,this.data.filter.filetypesearch).subscribe(data=>{
    this.projectFilesDataSource = new MatTableDataSource(data);
      this.projectFilesDataSource.paginator = this.paginatorFile;
      //this.projectFilesDataSource.sort = this.sortFile;
  });
}
Refreshfiles() {
  this._fileuploadcenterService.GetAllFilesForProject(this.projectDetails.projectId,null,this.data.filter.DateFrom_P,this.data.filter.DateTo_P,this.data.filter.filetypesearch).subscribe(data=>{
    this.projectFilesDataSource = new MatTableDataSource(data);
      this.projectFilesDataSource.paginator = this.paginatorFile;
      //this.projectFilesDataSource.sort = this.sortFile;
  });
}

checkValue(event: any){
  // if(event=='A')
  // {this.getDataCert();}
  // else
  // {this.GetAllFilesForProject();}
  this.loadallFilesTree();
}

applyFilterFiles(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.projectFilesDataSource.filter = filterValue.trim().toLowerCase();
}
applyFilterFileType(event: any) {
  const val = event.target.value.toLowerCase();
  const tempsource = this.data.fileTemp.filter(function (d: any) {
    return (d.name?.trim().toLowerCase().indexOf(val) !== -1 || !val)
    || (d.nameEn?.trim().toLowerCase().indexOf(val) !== -1 || !val);
  });
  this.data.files = tempsource;
}
load_Project:any;
load_FileType:any;
FillProjectSelect(){
  this._fileuploadcenterService.FillProjectSelect().subscribe(data=>{
    this.load_Project=data;
    this.data.allProjectNumbers=data;
    this.data.allProjectNumbersTemp=data;
  });
}
FillFileTypeSelect(){
  this._fileuploadcenterService.FillFileTypeSelect().subscribe(data=>{
    this.load_FileType=data;
    this.data.files=data;
    this.data.fileTemp=data
  });
}

AddPopup(){
  this.ClearField();
  this.FillProjectSelect();
  this.FillFileTypeSelect();
}
public uploadedFiles: Array<File> = [];
selectedFiles?: FileList;
currentFile?: File;

progress = 0;
uploading=false;
disableButtonSave_File = false;

resetprog(){
  this.disableButtonSave_File = false;
  this.progress = 0;
  this.uploading=false;
}

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }
  SaveprojectFiles(type:any,dataFile:any) {
    debugger

  if(this.data.FileName==null || this.data.FileTypeValue==null)
  {
    this.toast.error("من فضلك أكمل البيانات ", 'رسالة');
    return;
  }
  if(this.control?.value.length>0){
  }
    this._projectFiles=new ProjectFiles();
    if(type=='add'){
      this._projectFiles.fileId=0;
    }
    else{
      this._projectFiles.fileId=this.data.FileId;
    }
    debugger
    this._projectFiles.projectId=this.projectDetails.projectId;
    this._projectFiles.fileName=this.data.FileName;
    this._projectFiles.isCertified=this.data.Certificate;
    this._projectFiles.typeId=this.data.FileTypeValue;
    this._projectFiles.notes=null;
    this._projectFiles.pageInsert=3;
    this.progress = 0;
    this.disableButtonSave_File = true;
    this.uploading=true;
    setTimeout(() => {
      this.resetprog();
    }, 60000);

    if (this.control?.value.length>0) {
      var obj=this._projectFiles;
      this._fileuploadcenterService.SaveprojectFiles(this.control?.value[0],obj).subscribe((result: any)=>{
        debugger

        if (result.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * result.loaded / result.total);
        }

        if(result?.body?.statusCode==200){
          this.control.removeFile(this.control?.value[0]);
          this.toast.success(this.translate.instant(result?.body?.reasonPhrase),'رسالة');
          this.loadallFilesTree();
          this.ClearField();
          this.resetprog();
        }
        else if(result?.type>=0)
        {}
        else{this.toast.error(this.translate.instant(result?.body?.reasonPhrase), 'رسالة');this.resetprog();}

      });
    }
    else{this.toast.error("من فضلك أختر ملف", 'رسالة');}


  }
ClearField(){
  this.data.FileId=0;
  this.data.FileName=null;
  this.data.FileTypeValue=null;
  this.data.Certificate=false;
  this.selectedFiles = undefined;
  this.uploadedFiles=[];
}
setFileTypeInSelect(data:any,modal:any){
  this.data.FileTypeValue=data.id;
}


//#region
@ViewChild('tree') tree:any;
@ViewChild('tree_phase') tree_phase:any;


ngAfterViewInit() {
  setTimeout(() => { this.tree.collapseAll();}, 1000);
  setTimeout(() => { this.tree_phase.collapseAll();}, 1000);
}
loadFilesTreeObj:any=[];

loadallFilesTree(){
  const formData = new FormData();
  if(this.data.filter.DateFrom_P!=null){formData.append('DateFrom', this.data.filter.DateFrom_P);}
  if(this.data.filter.DateTo_P!=null){formData.append('DateTo', this.data.filter.DateTo_P);}
  if(this.data.filter.filetypesearch!=null){formData.append('Filetype',this.data.filter.filetypesearch)}
  if(this.data.filter.isChecked!=null){formData.append('IsCertified',this.data.filter.isChecked)}
  if(this.projectDetails.projectId!=null){formData.append('ProjectId',this.projectDetails.projectId)}
  if(this.data.filter.FileNameSearch!=null){formData.append('SearchText',this.data.filter.FileNameSearch)}

  debugger
  if(this.selectedFile1?.length)
  {
    if(this.selectedFile1[0]!=null)
    {
      this.GetFilesById(parseInt(this.selectedFile1[0].phaseid));
    }
  }
  this._fileuploadcenterService.GetAllFilesTree(formData).subscribe(data=>{
      this.loadFilesTreeObj=data;
      console.log(this.loadFilesTreeObj);
  });
}

FileData:any={
  selected:false,
  Obj:null,
}
GetFilesById(fileId:any){
  this._fileuploadcenterService.GetFilesById(fileId).subscribe(data=>{
      console.log(data);
      this.FileData.Obj = data;
  });
}

ShowImgAdded() {
  var img=environment.PhotoURL+this.FileData.Obj?.addedFileImg;
  return img;
}
ShowImgManager() {
  var img=environment.PhotoURL+this.FileData.Obj?.projectManagerImg;
  return img;
}

selectedFile1: any;

options = {
  mode: TreeMode.SingleSelect,
  checkboxes: false,
  alwaysEmitSelected: false,
  allowParentSelection:true,
  hasCollapseExpand: true,
  //isCollapsedContent:false,
};

selectTask(){
  debugger
  if(this.selectedFile1[0]!=null)
  {
    this.FileData.selected=true;
    this.GetFilesById(parseInt(this.selectedFile1[0].phaseid));
  }
  else{
    this.FileData.selected=false;
  }
}
//#endregion



//-----------------------------------------------------------------

saveFileType() {

  if(this.data.file.nameAr==null || this.data.file.nameEn==null)
  {
    this.toast.error("من فضلك أكمل البيانات", 'رسالة');
    return;
  }

  var FileTypeObj:any = {};
  FileTypeObj.FileTypeId = this.data.file.id;
  FileTypeObj.NameAr = this.data.file.nameAr;
  FileTypeObj.NameEn = this.data.file.nameEn;
  var obj=FileTypeObj;
  this._fileuploadcenterService.SaveFileType(obj).subscribe((result: any)=>{
    if(result.statusCode==200){
      this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
      this.resetFileType();
      this.FillFileTypeSelect();
    }
    else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
  });
}
resetFileType(){
  this.data.file.id=0;this.data.file.nameAr=null;this.data.file.nameEn=null;
}

//-------------------------------------------


SaveProjectDetails(){
  if(this.projectDetails.mangerId==null)
  {
    this.toast.error("من فضلك اختر مدير المشروع", 'رسالة');
    return;
  }
  var obj=this.projectDetails;
  console.log(obj);
  this._projectdetailsService.SaveProjectDetails(obj).subscribe((result: any)=>{
    if(result.statusCode==200){
      this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
    }
    else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
  });
}


  saveOption(data: any) {}


  confirm() {}

  uploadFile(data: any) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectTasksDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterNotices(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectNoticesDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilteWorkOrders(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.workOrdersDataSource.filter = filterValue.trim().toLowerCase();
  }
  applyFilterSupervision(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectSupervisionDataSource.filter = filterValue.trim().toLowerCase();
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

  //---------------------------------------AllFill--------------------------------------------
  //#region
  dataAddDetails: any = {
    RegionTypes: {
      id: 0,
      nameAr: null,
      nameEn: null,
    },
    ProjectPieces: {
      id: 0,
      nameAr: null,
      notes: null,
      projectId:null,
    },
    InstrumentSources: {
      id: 0,
      nameAr: null,
      nameEn: null,
    },
    Contractors: {
      id: 0,
      nameAr: null,
      nameEn: null,
      email: null,
      commercialRegister: null,
      phoneNo: null,
    },
    Municipals: {
      id: 0,
      nameAr: null,
      nameEn: null,
    },
    SubMunicipalitys: {
      id: 0,
      nameAr: null,
      nameEn: null,
    },
    BuildType: {
      id: 0,
      nameAr: null,
      nameEn: null,
      description:null,
    },
  };

  //-----------------------------------RegionType------------------------------------------------
  //#region
  RegionTypes:any;
  RegionTypesPopup:any;

  FillRegionTypesSelect(){
    this._projectdetailsService.FillRegionTypesSelect().subscribe(data=>{
      this.RegionTypes=data;
      this.RegionTypesPopup=data;
    });
  }
  RegionTypesRowSelected:any;
  getRegionTypesRow(row :any){
    this.RegionTypesRowSelected=row;
   }
  setRegionTypesInSelect(data:any,modal:any){
    this.projectDetails.regionTypeId=data.id;
  }
  resetRegionTypes(){
    this.dataAddDetails.RegionTypes.id=0;this.dataAddDetails.RegionTypes.nameAr=null;this.dataAddDetails.RegionTypes.nameEn=null;
  }
  saveRegionTypes() {
    if(this.dataAddDetails.RegionTypes.nameAr==null || this.dataAddDetails.RegionTypes.nameEn==null)
    {
      this.toast.error("من فضلك أكمل البيانات", 'رسالة');
      return;
    }
    var Obj:any = {};
    Obj.RegionTypeId = this.dataAddDetails.RegionTypes.id;
    Obj.NameAr = this.dataAddDetails.RegionTypes.nameAr;
    Obj.NameEn = this.dataAddDetails.RegionTypes.nameEn;
    this._projectdetailsService.SaveRegionTypes(Obj).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.resetRegionTypes();
        this.FillRegionTypesSelect();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }
  confirmRegionTypesDelete() {
    this._projectdetailsService.DeleteRegionTypes(this.RegionTypesRowSelected.id).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.FillRegionTypesSelect();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }
  //#endregion
  //----------------------------------(End)-RegionTypes---------------------------------------------
  //-----------------------------------ProjectPieces------------------------------------------------
  //#region
  ProjectPieces:any;
  ProjectPiecesPopup:any;

  FillProjectPiecesSelect(){
    this._projectdetailsService.FillProjectPieces(this.projectDetails.projectId).subscribe(data=>{
      this.ProjectPieces=data;
      this.ProjectPiecesPopup=data;
    });
  }
  ProjectPiecesRowSelected:any;
  getProjectPiecesRow(row :any){
    this.ProjectPiecesRowSelected=row;
   }
  setProjectPiecesInSelect(data:any,modal:any){
    this.projectDetails.pieceNo=data.id;
  }
  resetProjectPieces(){
    this.dataAddDetails.ProjectPieces.id=0;this.dataAddDetails.ProjectPieces.nameAr=null;this.dataAddDetails.ProjectPieces.nameEn=null;
    this.dataAddDetails.RegionTypes.projectId=null;
  }
  saveProjectPieces() {
    if(this.dataAddDetails.ProjectPieces.nameAr==null || this.dataAddDetails.ProjectPieces.notes==null)
    {
      this.toast.error("من فضلك أكمل البيانات", 'رسالة');
      return;
    }
    debugger
    var Obj:any = {};
    Obj.PieceId = this.dataAddDetails.ProjectPieces.id;
    Obj.PieceNo = this.dataAddDetails.ProjectPieces.nameAr;
    Obj.Notes = this.dataAddDetails.ProjectPieces.notes;
    Obj.ProjectId = this.projectDetails.projectId;

    this._projectdetailsService.SaveProjectPieces(Obj).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.resetProjectPieces();
        this.FillProjectPiecesSelect();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }
  confirmProjectPiecesDelete() {
    this._projectdetailsService.DeleteProjectPieces(this.ProjectPiecesRowSelected.id).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.FillProjectPiecesSelect();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }
  //#endregion
  //----------------------------------(End)-ProjectPieces---------------------------------------------
    //-----------------------------------InstrumentSources------------------------------------------------
  //#region
  InstrumentSources:any;
  InstrumentSourcesPopup:any;

  FillInstrumentSourcesSelect(){
    this._projectdetailsService.FillInstrumentSourcesSelect().subscribe(data=>{
      this.InstrumentSources=data;
      this.InstrumentSourcesPopup=data;
    });
  }
  InstrumentSourcesRowSelected:any;
  getInstrumentSourcesRow(row :any){
    this.InstrumentSourcesRowSelected=row;
   }
  setInstrumentSourcesInSelect(data:any,modal:any){
    this.projectDetails.regionTypeId=data.id;
  }
  resetInstrumentSources(){
    this.dataAddDetails.InstrumentSources.id=0;this.dataAddDetails.InstrumentSources.nameAr=null;this.dataAddDetails.InstrumentSources.nameEn=null;
  }
  saveInstrumentSources() {
    if(this.dataAddDetails.InstrumentSources.nameAr==null || this.dataAddDetails.InstrumentSources.nameEn==null)
    {
      this.toast.error("من فضلك أكمل البيانات", 'رسالة');
      return;
    }

    var Obj:any = {};
    Obj.SourceId = this.dataAddDetails.InstrumentSources.id;
    Obj.NameAr = this.dataAddDetails.InstrumentSources.nameAr;
    Obj.NameEn = this.dataAddDetails.InstrumentSources.nameEn;

    this._projectdetailsService.SaveInstrumentSources(Obj).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.resetInstrumentSources();
        this.FillInstrumentSourcesSelect();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }
  confirmInstrumentSourcesDelete() {
    this._projectdetailsService.DeleteInstrumentSources(this.InstrumentSourcesRowSelected.id).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.FillInstrumentSourcesSelect();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }
  //#endregion
  //----------------------------------(End)-InstrumentSources---------------------------------------------
  //-----------------------------------Contractors------------------------------------------------
  //#region
  Contractors:any;
  ContractorsPopup:any;

  FillContractorsSelect(){
    this._projectdetailsService.FillContractorsSelect().subscribe(data=>{
      console.log("FillContractorsSelect");
      console.log(data);
      this.Contractors=data;
      this.ContractorsPopup=data;
    });
  }
  ContractorChange(){
    debugger
    if(this.projectDetails.contractorSelectId)
    {
      this.projectDetails.contractorEmail_T=this.Contractors.filter((a: { id: any; })=>a.id==this.projectDetails.contractorSelectId)[0].email;
      this.projectDetails.contractorPhone_T=this.Contractors.filter((a: { id: any; })=>a.id==this.projectDetails.contractorSelectId)[0].phoneNo;
      this.projectDetails.contractorCom_T=this.Contractors.filter((a: { id: any; })=>a.id==this.projectDetails.contractorSelectId)[0].commercialRegister;
    }
    else
    {
      this.resetcontractorData();
    }
  }
  ContractorsRowSelected:any;
  getContractorsRow(row :any){
    this.ContractorsRowSelected=row;
   }
  setContractorsInSelect(data:any,modal:any){
    this.projectDetails.contractorSelectId=data.id;
  }
  resetContractors(){
    this.dataAddDetails.Contractors.id=0;this.dataAddDetails.Contractors.nameAr=null;this.dataAddDetails.Contractors.nameEn=null;
    this.dataAddDetails.Contractors.email=null;this.dataAddDetails.Contractors.commercialRegister=null;this.dataAddDetails.Contractors.phoneNo=null;

  }
  saveContractors() {
    if(this.dataAddDetails.Contractors.nameAr==null || this.dataAddDetails.Contractors.nameEn==null)
    {
      this.toast.error("من فضلك أكمل البيانات", 'رسالة');
      return;
    }

    var Obj:any = {};
    Obj.ContractorId = this.dataAddDetails.Contractors.id;
    Obj.NameAr = this.dataAddDetails.Contractors.nameAr;
    Obj.NameEn = this.dataAddDetails.Contractors.nameEn;
    Obj.Email = this.dataAddDetails.Contractors.email;
    Obj.CommercialRegister =this.dataAddDetails.Contractors.commercialRegister;
    Obj.PhoneNo = this.dataAddDetails.Contractors.phoneNo;

    this._projectdetailsService.SaveSuperContractor(Obj).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.resetContractors();
        this.FillContractorsSelect();
        this.ContractorChange();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }
  confirmContractorsDelete() {
    this._projectdetailsService.DeleteSuperContractor(this.ContractorsRowSelected.id).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.projectDetails.contractorSelectId=null;
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.FillContractorsSelect();
        this.ContractorChange();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }
  //#endregion
  //----------------------------------(End)-Contractors---------------------------------------------
  //-----------------------------------Municipals------------------------------------------------
  //#region
  Municipals:any;
  MunicipalsPopup:any;

  FillMunicipalsSelect(){
    this._projectdetailsService.FillMunicipalsSelect().subscribe(data=>{
      this.Municipals=data;
      this.MunicipalsPopup=data;
    });
  }
  MunicipalsRowSelected:any;
  getMunicipalsRow(row :any){
    this.MunicipalsRowSelected=row;
   }
  setMunicipalsInSelect(data:any,modal:any){
    this.projectDetails.municipalId=data.id;
  }
  resetMunicipals(){
    this.dataAddDetails.Municipals.id=0;this.dataAddDetails.Municipals.nameAr=null;this.dataAddDetails.Municipals.nameEn=null;
  }
  saveMunicipals() {
    if(this.dataAddDetails.Municipals.nameAr==null || this.dataAddDetails.Municipals.nameEn==null)
    {
      this.toast.error("من فضلك أكمل البيانات", 'رسالة');
      return;
    }

    var Obj:any = {};
    Obj.MunicipalId = this.dataAddDetails.Municipals.id;
    Obj.NameAr = this.dataAddDetails.Municipals.nameAr;
    Obj.NameEn = this.dataAddDetails.Municipals.nameEn;

    this._projectdetailsService.SaveMunicipal(Obj).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.resetMunicipals();
        this.FillMunicipalsSelect();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }
  confirmMunicipalsDelete() {
    this._projectdetailsService.DeleteMunicipal(this.MunicipalsRowSelected.id).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.FillMunicipalsSelect();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }
  //#endregion
  //----------------------------------(End)-Municipals---------------------------------------------
  //-----------------------------------SubMunicipalitys------------------------------------------------
  //#region
  SubMunicipalitys:any;
  SubMunicipalitysPopup:any;

  FillSubMunicipalitysSelect(){
    this._projectdetailsService.FillSubMunicipalitysSelect().subscribe(data=>{
      this.SubMunicipalitys=data;
      this.SubMunicipalitysPopup=data;
    });
  }
  SubMunicipalitysRowSelected:any;
  getSubMunicipalitysRow(row :any){
    this.SubMunicipalitysRowSelected=row;
   }
  setSubMunicipalitysInSelect(data:any,modal:any){
    this.projectDetails.subMunicipalityId=data.id;
  }
  resetSubMunicipalitys(){
    this.dataAddDetails.SubMunicipalitys.id=0;this.dataAddDetails.SubMunicipalitys.nameAr=null;this.dataAddDetails.SubMunicipalitys.nameEn=null;
  }
  saveSubMunicipalitys() {
    if(this.dataAddDetails.SubMunicipalitys.nameAr==null || this.dataAddDetails.SubMunicipalitys.nameEn==null)
    {
      this.toast.error("من فضلك أكمل البيانات", 'رسالة');
      return;
    }

    var Obj:any = {};
    Obj.SubMunicipalityId = this.dataAddDetails.SubMunicipalitys.id;
    Obj.NameAr = this.dataAddDetails.SubMunicipalitys.nameAr;
    Obj.NameEn = this.dataAddDetails.SubMunicipalitys.nameEn;

    this._projectdetailsService.SaveSubMunicipality(Obj).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.resetSubMunicipalitys();
        this.FillSubMunicipalitysSelect();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }
  confirmSubMunicipalitysDelete() {
    this._projectdetailsService.DeleteSubMunicipality(this.SubMunicipalitysRowSelected.id).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.FillSubMunicipalitysSelect();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }
  //#endregion
  //----------------------------------(End)-SubMunicipalitys---------------------------------------------
    //-----------------------------------BuildType------------------------------------------------
  //#region
  BuildType:any;
  BuildTypePopup:any;

  FillBuildTypeSelect(){
    this._projectdetailsService.FillBuildTypeSelect().subscribe(data=>{
      this.BuildType=data;
      this.BuildTypePopup=data;
    });
  }
  BuildTypeRowSelected:any;
  getBuildTypeRow(row :any){
    this.BuildTypeRowSelected=row;
   }
  setBuildTypeInSelect(data:any,modal:any){
    this.projectDetails.buildingType=data.id;
  }
  resetBuildType(){
    this.dataAddDetails.BuildType.id=0;this.dataAddDetails.BuildType.nameAr=null;this.dataAddDetails.BuildType.nameEn=null;
  }
  saveBuildType() {
    if(this.dataAddDetails.BuildType.nameAr==null || this.dataAddDetails.BuildType.nameEn==null)
    {
      this.toast.error("من فضلك أكمل البيانات", 'رسالة');
      return;
    }
    debugger
    var Obj:any = {};
    Obj.BuildTypeId = this.dataAddDetails.BuildType.id;
    Obj.NameAr = this.dataAddDetails.BuildType.nameAr;
    Obj.NameEn = this.dataAddDetails.BuildType.nameEn;
    Obj.Description = null;

    this._projectdetailsService.SaveBuildTypes(Obj).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.resetBuildType();
        this.FillBuildTypeSelect();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }
  confirmBuildTypeDelete() {
    this._projectdetailsService.DeleteBuildTypes(this.BuildTypeRowSelected.id).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.FillBuildTypeSelect();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }
  //#endregion
  //----------------------------------(End)-BuildType---------------------------------------------
  //#endregion
  //-------------------------------------End Fill--------------------------------------------------
  hideInstruments=false;

  InstrumentsData: any= {
    id: 0,
    InstrumentNo: null,
    Date: null,
    SourceId: null,
    HijriDate: null,
    ProjectId: null,
  };
  AllInstrumentsList:any=[];
  GetAllInstruments(){
    this._projectdetailsService.GetAllInstruments(this.projectDetails.projectId).subscribe(data=>{
      this.AllInstrumentsList=data.result;
    });
  }
  InstrumentsRowSelected:any;
  getInstrumentsRow(row :any){
    this.InstrumentsRowSelected=row;
   }
  resetInstruments(){
    this.InstrumentsData.id=0;this.InstrumentsData.InstrumentNo=null;this.InstrumentsData.Date=null;
    this.InstrumentsData.SourceId=null;this.InstrumentsData.HijriDate=null;this.InstrumentsData.ProjectId=null;
  }
  saveInstruments() {
    debugger
    if(this.InstrumentsData.InstrumentNo==null || this.InstrumentsData.Date==null || this.InstrumentsData.SourceId==null)
    {
      this.toast.error("من فضلك أكمل البيانات", 'رسالة');
      return;
    }
    var instumentobj:any = {};
    instumentobj.InstrumentId = this.InstrumentsData.id;
    instumentobj.InstrumentNo  = this.InstrumentsData.InstrumentNo;
    if(this.InstrumentsData.Date!=null)
    {
      instumentobj.Date =this._sharedService.date_TO_String(this.InstrumentsData.Date);
      const nowHijri =toHijri(this.InstrumentsData.Date);
      instumentobj.HijriDate= this._sharedService.hijri_TO_String(nowHijri);
    }
    instumentobj.SourceId  = this.InstrumentsData.SourceId;
    instumentobj.ProjectId = this.projectDetails.projectId;

    this._projectdetailsService.SaveInstrument(instumentobj).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.resetInstruments();
        this.GetAllInstruments();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }
  projectInstrumentsColumns: string[] = [
    'InstrumentNo',
    'Instrumentdate',
    'instrumentsource',
    'choose',
  ];
  editInstruments(element:any){
    this.InstrumentsData= {
      id: element.instrumentId,
      InstrumentNo: element.instrumentNo,
      Date: this._sharedService.String_TO_date(element.date),
      SourceId: element.sourceId,
      HijriDate: null,//element.hijriDate,
      ProjectId: element.projectId,
    };
  }
  deleteInstruments(element:any) {
    debugger
    this._projectdetailsService.DeleteInstruments(element.instrumentId).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.GetAllInstruments();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }


//--------------------------------Quotations-Services-Conditions---------------------------------
//#region

columnstab: any = {
  OfferPrices: [
    'offer_id',
    'date',
    'customer',
    'price',
    'user',
  ],
  Services: [
    'invoiceNumber',
    'InvoiceDate',
    'InvoiceAmount',
    'PaymentType',
    'InvoiceStatus',
    'PostingDate',
    'customerName',
    'projectNumber',
  ],
  Conditions: [
    'fileName',
    'cost',
    'confirmStatustxt',
    'confirmStatusDate',
    'addUserName',
    'operations',
  ],
};

  @ViewChild('paginatorOfferPrices') paginatorOfferPrices: MatPaginator;
  @ViewChild('paginatorServices') paginatorServices: MatPaginator;
  @ViewChild('paginatorConditions') paginatorConditions: MatPaginator;

  QuotSerCondData:any={
    OfferPrices: new MatTableDataSource(),
    //Services:new MatTableDataSource(),
    Conditions:new MatTableDataSource(),
  }

  resetFilterLoad(event:any){
    debugger
    var TabType=event.index+1;
    // this.GetFinancialfollowup(TabType);

  }

  LoadOfferPrices(){
    this._projectdetailsService.GetAllOffersByProjectId(this.projectDetails.projectId).subscribe(data => {
      this.QuotSerCondData.OfferPrices = new MatTableDataSource(data.result);this.QuotSerCondData.OfferPrices.paginator = this.paginatorOfferPrices;
     });
  }

  LoadConditions(){
    this._projectdetailsService.GetAllRequirementsByProjectId(this.projectDetails.projectId).subscribe(data => {
      this.QuotSerCondData.Conditions = new MatTableDataSource(data.result);this.QuotSerCondData.Conditions.paginator = this.paginatorConditions;
     });
  }




  downloadFileConditions(data: any) {
    var link=environment.PhotoURL+data.attachmentUrl;
    window.open(link, '_blank');
  }
  publicCondRow:any=null;
  getCondRow(element:any){
    this.publicCondRow=element;
  }
  ConfirmRequirementStatus(data:any) {
    var status=!(data.confirmStatus??false);
    this._projectdetailsService.ConfirmRequirementStatus(data.requirementId,status).subscribe((result: any)=>{
      if(result?.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.LoadConditions();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }
  DeleteRequirement() {
    this._projectdetailsService.DeleteRequirement(this.publicCondRow.requirementId).subscribe((result: any)=>{
      if(result?.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.LoadConditions();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }
  temptaxtype=2;
  modalDetailsOffer:any={
    taxtype:2,
    total_amount:null,
    total_amount_text:null,
  }

  offerServices: any = [];
  LoadServices(){
    this._projectdetailsService.GetOfferservicenByProjectId(this.projectDetails.projectId).subscribe(data => {
      debugger
      data.forEach((element: any) => {
        this.modalDetailsOffer.taxtype=element.taxType;
        this.GetServicesPriceByServiceId_Offer(element);
      });
     });
  }


  GetServicesPriceByServiceId_Offer(offerdata:any){
    this._offerpriceService.GetServicesPriceByServiceId(offerdata.serviceId).subscribe(data=>{
      var maxVal=0;

      if(this.offerServices.length>0)
      {
        maxVal = Math.max(...this.offerServices.map((o: { idRow: any; }) => o.idRow))
      }
      else{
        maxVal=0;
      }
      this.setServiceRowValueNew_Offer(maxVal+1,data.result,offerdata.serviceQty,offerdata.serviceamountval,offerdata.offerId);
    });
  }

  setServiceRowValueNew_Offer(indexRow:any,item: any, Qty: any,servamount: any,offerId:any) {
    debugger
    this.addService();
    this.offerServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].AccJournalid = item.servicesId;
    this.offerServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].UnitConst = item.serviceTypeName;
    this.offerServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].QtyConst = Qty;
    this.offerServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].accountJournaltxt = item.name;
    this.offerServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].Amounttxt = servamount;
    this.offerServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].offerId = offerId;
    this.CalculateTotal_Offer();
  }

  addService() {

    var maxVal=0;
    debugger
    if(this.offerServices.length>0)
    {
      maxVal = Math.max(...this.offerServices.map((o: { idRow: any; }) => o.idRow))
    }
    else{
      maxVal=0;
    }


    this.offerServices?.push({
      idRow: maxVal+1,
      AccJournalid: null,
      UnitConst: null,
      QtyConst: null,
      accountJournaltxt: null,
      Amounttxt: null,
      AmountBeforeTaxtxt:null,
      taxAmounttxt: null,
      TotalAmounttxt: null,
      //--------------
      offerId:null,
      //--------------
      MeterPrice1: null,
      MeterPrice2: null,
      MeterPrice3: null,
      PackageRatio1: null,
      PackageRatio2: null,
      PackageRatio3: null,
    });
  }

  CalculateTotal_Offer() {
    var totalwithtaxes = 0;var totalAmount = 0;var totaltax = 0;var totalAmountIncludeT = 0;var vAT_TaxVal = parseFloat(this.userG.orgVAT??0);

    this.offerServices.forEach((element: any) => {
      var Value = parseFloat((element.Amounttxt??0).toString()).toFixed(2);
      var FVal = +Value * element.QtyConst;
      var FValIncludeT = FVal;
      var taxAmount = 0;
      var totalwithtax = 0;
      var TaxV8erS = parseFloat((+parseFloat((+Value * vAT_TaxVal).toString()).toFixed(2) / 100).toString()).toFixed(2);
      var TaxVS =parseFloat((+Value- +parseFloat((+Value/((vAT_TaxVal / 100) + 1)).toString()).toFixed(2)).toString()).toFixed(2);
      if (this.modalDetailsOffer.taxtype == 2) {
          taxAmount = +TaxV8erS;
          totalwithtax = +parseFloat((+parseFloat(Value) + +parseFloat(TaxV8erS)).toString()).toFixed(2);
      }
      else {
          taxAmount=+TaxVS;
          FValIncludeT = +parseFloat((+parseFloat(Value).toFixed(2) - +TaxVS).toString()).toFixed(2);
          totalwithtax = +parseFloat(Value).toFixed(2);
      }
      this.offerServices.filter((a: { idRow: any }) => a.idRow == element.idRow)[0].AmountBeforeTaxtxt = parseFloat(FValIncludeT.toString()).toFixed(2);
      this.offerServices.filter((a: { idRow: any; })=>a.idRow==element.idRow)[0].taxAmounttxt= parseFloat(taxAmount.toString()).toFixed(2);
      this.offerServices.filter((a: { idRow: any; })=>a.idRow==element.idRow)[0].TotalAmounttxt= parseFloat((totalwithtax * element.QtyConst).toString()).toFixed(2);

      totalwithtaxes += totalwithtax;
      totalAmount +=(FVal) ;
      totalAmountIncludeT += (totalwithtax);
      totaltax += taxAmount;
    });
    this.CalcSumTotal();
}


CalcSumTotal(){
  let sum=0;
  this.offerServices.forEach((element: any) => {
    sum= +sum + +parseFloat((element.TotalAmounttxt??0)).toFixed(2);
  });
  this.modalDetailsOffer.total_amount=parseFloat(sum.toString()).toFixed(2);
  this.ConvertNumToString_Offer(this.modalDetailsOffer.total_amount);
}


ConvertNumToString_Offer(val:any){
  this._offerpriceService.ConvertNumToString(val).subscribe(data=>{
    this.modalDetailsOffer.total_amount_text=data?.reasonPhrase;
  });
}
  applyOfferPrices(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.QuotSerCondData.OfferPrices.filter = filterValue.trim().toLowerCase();
  }
  applyServices(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.QuotSerCondData.Services.filter = filterValue.trim().toLowerCase();
  }
  applyConditions(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.QuotSerCondData.Conditions.filter = filterValue.trim().toLowerCase();
  }


//#endregion
//-------------------------------End-Quotations-Services-Conditions---------------------------------

//------------------------------PrintSupervision-----------------------------------
SupervisionPrintData:any=null;
CustomDataSupervision:any={
  OrgImg:null,
  BaladyImg:null,
  hammerCourt:null,
  HeadImageUrl:null,
  HeadImageUrl2:null,
  stampUrl:null,
}
SupervisionReport(obj:any){
  this._supervisionsService.ChangeSupervision(obj.supervisionId,obj.superCode).subscribe(data=>{
    this.SupervisionPrintData=data;
    this.CustomDataSupervision.BaladyImg="/assets/images/logo_Balady.png";
    this.CustomDataSupervision.hammerCourt="/assets/images/hammerCourt.png";
    console.log("this.SupervisionPrintData");
    console.log("-------------------------------------");
    console.log(this.SupervisionPrintData);
    console.log(this.CustomDataSupervision.stampUrl);

    if(this.SupervisionPrintData.supervision.length>0 && this.SupervisionPrintData?.supervision[0].headImageUrl)
    this.CustomDataSupervision.HeadImageUrl=environment.PhotoURL+this.SupervisionPrintData?.supervision[0].headImageUrl;
    else this.CustomDataSupervision.HeadImageUrl=null;

    if(this.SupervisionPrintData.supervision.length>0 && this.SupervisionPrintData?.supervision[0].headImageUrl2)
    this.CustomDataSupervision.HeadImageUrl2=environment.PhotoURL+this.SupervisionPrintData?.supervision[0].headImageUrl2;
    else this.CustomDataSupervision.HeadImageUrl2=null;

    if(this.SupervisionPrintData?.stampUrl)
    this.CustomDataSupervision.stampUrl=environment.PhotoURL+"/"+this.SupervisionPrintData?.stampUrl;
    else this.CustomDataSupervision.stampUrl=null;

    if(this.SupervisionPrintData?.org_VD.logoUrl)
    this.CustomDataSupervision.OrgImg=environment.PhotoURL+this.SupervisionPrintData?.org_VD.logoUrl;
    else this.CustomDataSupervision.OrgImg=null;
  });
}

printDiv(id: any) {
  this.print.print(id, environment.printConfig);
}

counter(i: number) {
  return new Array(i);
}


SupervisionPrintBase:any=null;
CustomDataPrintBase:any={
  OrgImg:null,
}
resetCustomDataContract(){
  this.SupervisionPrintBase=null;
  this.CustomDataPrintBase={
    OrgImg:null,
  }
}
PrintSupervisionBase(obj:any){
  debugger
  this._supervisionsService.PrintSupervisionMail(obj.supervisionId).subscribe(data=>{
    debugger
    this.SupervisionPrintBase=data;
    if(this.SupervisionPrintBase?.org_VD.logoUrl)
    this.CustomDataPrintBase.OrgImg=environment.PhotoURL+this.SupervisionPrintBase?.org_VD.logoUrl;
    else this.CustomDataPrintBase.OrgImg=null;
    console.log(obj);
    console.log(this.SupervisionPrintBase);
  });
}
GetStatusName(item:any){
  if(item.isRead==1){
    return "تم الأستلام";
  }
  else if(item.isRead==1){
    return "غير متوفر";
  }
  else{
    return "لم يتم الاستلام";
  }
}



//-------------------------------------------------------------
selectedDateType = DateType.Hijri;
  //Date-Hijri
  ChangeInstrumentsDataGre(event:any){
    if(event!=null)
    {
      const DateHijri =toHijri(this.InstrumentsData.Date);
      var DateGre = new HijriDate(DateHijri._year, DateHijri._month, DateHijri._date);
      DateGre._day=DateGre._date;
      this.InstrumentsData.HijriDate=DateGre;
    }
    else{
      this.InstrumentsData.HijriDate=null;
    }
  }
  ChangeInstrumentsDateHijri(event:any){
    if(event!=null)
    {
      const DateGre = new HijriDate(event.year, event.month, event.day);
      const dayGreg = DateGre.toGregorian();
      this.InstrumentsData.Date=dayGreg;
    }
    else{
      this.InstrumentsData.Date=null;
    }
  }
  status: "initial" | "uploading" | "success" | "fail" = "initial"; // Variable to store file status

  clickfile(evenet:any)
  {
    debugger
    var aaa=evenet;
    console.log(evenet);
  }
  focusfile(evenet:any)
  {
    debugger
    var aaa=evenet;
    console.log(evenet);
  }
  blurfile(evenet:any)
  {
    debugger
    var aaa=evenet;
    console.log(evenet);
  }

  ////////////////////////////////////////////////////////////////
  //#region  Out Inbox
  OutboxData: any;
  InboxData: any;
  Getoutbox(){
    this._outinbox.GetOutInboxProjectFiles(1, this.projectDetails.projectId).subscribe(data => {
    console.log(data);
    
    this.OutboxData = data.result;
    
  });
  }
  
    GetInbox(){
      this._outinbox.GetOutInboxProjectFiles(2, this.projectDetails.projectId).subscribe(data => {
    console.log(data);
    
      this.InboxData = data.result;
  });
}
  //#endregion
}
