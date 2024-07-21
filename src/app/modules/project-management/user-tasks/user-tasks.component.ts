import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RestApiService } from 'src/app/shared/services/api.service';
import { ProreportsService } from 'src/app/core/services/pro_Services/proreports.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NgxPrintElementService } from 'ngx-print-element';
import printJS from 'print-js';
import { environment } from 'src/environments/environment';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-user-tasks',
  templateUrl: './user-tasks.component.html',
  styleUrls: ['./user-tasks.component.scss'],
})
export class UserTasksComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  title: any = {
    main: {
      name: {
        ar: 'إدارة المشاريع',
        en: 'Projects Manegment',
      },
      link: '/customers',
    },
    sub: {
      ar: 'جميع المهام',
      en: 'All Tasks',
    },
  };
  load_Users:any;

  displayedColumns: string[] = [
    'name','projectName','projectNumber','projectType',// 'subProjectType', // 'userName',
    'taskStart','taskEnd','taskStatus','taskTime','achievementDays',
  ];
  data: any = {
    userTasks: new MatTableDataSource([{}]),
    filter: {
      enable: false,
      date: null,
      DateFrom_P:"",
      DateTo_P:"",
      selectedStatus:0,
    },
    userTasksTemp:[],
  };
  BranchName:any
  constructor(private api: RestApiService,
    private _proreportsService: ProreportsService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private modalService: NgbModal,
    private print: NgxPrintElementService,
    private translate: TranslateService,) {
    this.getData();
    this.fill_Users();
    this.getOrgDataInReady();
        this.api.GetBranchByBranchId().subscribe((data: any) => {
      debugger
                    this.BranchName = data.result[0].branchName;

    });
  }

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    const tempsource = this.data.userTasksTemp.filter(function (d: any) {
      return (d.clientName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.taskTypeName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.projectNumber?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.projectTypeName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.statusName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.timeStr?.trim().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.data.userTasks = new MatTableDataSource(tempsource);
    this.data.userTasks.paginator = this.paginator;
    this.data.userTasks.sort = this.sort;
  }

  getData(){
    this._proreportsService.GetAllProjectPhasesTasksW_whithworkorder().subscribe(data=>{
      console.log(data);
      this.data.userTasks = new MatTableDataSource(data);
      this.data.userTasksTemp=data;
      this.data.userTasks.paginator = this.paginator;
      this.data.userTasks.sort = this.sort;
    });
  }
  getData_S(){
    var userid=this.data.selected??0;
    var status=this.data.filter.selectedStatus??0;
    var from=this.data.filter.DateFrom_P??"";
    var to=this.data.filter.DateTo_P??"";

    this._proreportsService.GetAllProjectPhasesTasksS_whithworkorder(userid,status,from,to).subscribe(data=>{
      console.log(data);
      this.data.userTasks = new MatTableDataSource(data);
      this.data.userTasksTemp=data;
      this.data.userTasks.paginator = this.paginator;
      this.data.userTasks.sort = this.sort;
    });
  }
  getData_SLate(){
    var userid=this.data.selected??0;
    var status=this.data.filter.selectedStatus??0;
    var from=this.data.filter.DateFrom_P??"";
    var to=this.data.filter.DateTo_P??"";

    this._proreportsService.GetAllLateProjectPhasesByuser_rpt(userid,status,from,to).subscribe(data=>{
      console.log(data);
      this.data.userTasks = new MatTableDataSource(data);
      this.data.userTasksTemp=data;
      this.data.userTasks.paginator = this.paginator;
      this.data.userTasks.sort = this.sort;
    });
  }
  getData_WithStatus(){
    var userid=this.data.selected??0;
    var status=this.data.filter.selectedStatus??0;
    var from=this.data.filter.DateFrom_P??"";
    var to=this.data.filter.DateTo_P??"";

    this._proreportsService.GetAllProjectPhasesTasksbystatus_WithworkOrder(userid,status,from,to).subscribe(data=>{
      console.log(data);
      this.data.userTasks = new MatTableDataSource(data);
      this.data.userTasksTemp=data;
      this.data.userTasks.paginator = this.paginator;
      this.data.userTasks.sort = this.sort;
    });
  }
  CheckDate(event: any){
    if(event!=null)
    {
      this.data.filter.DateFrom_P= this._sharedService.date_TO_String(event[0]);
      this.data.filter.DateTo_P= this._sharedService.date_TO_String(event[1]);
      this.CheckStatus();
    }
    else{
      this.data.filter.DateFrom_P="";
      this.data.filter.DateTo_P="";
      this.CheckStatus();
    }
  }
  CheckStatus(){
    debugger
    if(this.data.filter.selectedStatus==0 || this.data.filter.selectedStatus==null)
    {
      this.getData_S();
    }
    else if(this.data.filter.selectedStatus==8)
    {
      this.getData_SLate();
    }
    else
    {
      this.getData_WithStatus();
    }
  }

  mergeS(Obj:any){
    if (Object.keys(Obj).length===0)return "";

    var TaskTimeTo_Merge = "";
    if (Obj.taskTimeFrom == "") {
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
    if (Obj.TaskTimeTo == "") {
        TaskTimeTo_Merge = Obj.endDateCalc;
    }
    else {
        TaskTimeTo_Merge = JSON.stringify(Obj.endDateCalc + " - " + Obj.taskTimeTo);
    }
    return TaskTimeTo_Merge;
  }

  fill_Users(){
    this._proreportsService.FillAllUsersSelectAll().subscribe(data=>{
      console.log(data);
      this.load_Users=data;
    });
  }
  ColorProject(mData:any){
    if (Object.keys(mData).length===0)
      return "";
    debugger
    var today = this._sharedService.date_TO_String(new Date());
    if (mData.firstProjectExpireDate != null && mData.firstProjectDate != null) {

        if (mData.firstProjectDate < today) {
            if (mData.firstProjectExpireDate < today) {
                return 'text-red-500 fw-bold';
            }
            else if (mData.firstProjectExpireDate == today) {
            }
            else
            {
                var date1 = new Date(mData.firstProjectExpireDate);
                var date2 = new Date(today);
                var date3 = new Date(mData.firstProjectDate);
                var Difference_In_Time = date2.getTime() - date3.getTime();
                var Difference_In_Time2 = date1.getTime() - date3.getTime();

                var Difference_In_Days = parseInt((Difference_In_Time / (1000 * 3600 * 24)).toString());
                var Difference_In_Days2 = parseInt((Difference_In_Time2 / (1000 * 3600 * 24)).toString());

                if (0.7 < (Difference_In_Days / Difference_In_Days2)) {
                    return 'text-yellow-500 fw-bold';
                 }
            }
        }
    }
    return '';
   }



   getAchievementStatus(element: any) {
    if (Object.keys(element).length===0)return "";
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
    if (Object.keys(element).length===0){return ""};
    let statuscolor = '';
    if(element.status==4)
      {
        if (element.remaining != null) {
          if(element.remaining>0)
            {
              statuscolor='text-green-600 fw-bold';
            }
            else if(element.remaining<0){
              statuscolor='text-red-500 fw-bold';
            }
            else{
              statuscolor='text-yellow-500 fw-bold';
            }
        }
      }
      else
      {
        statuscolor='';
      }
    return statuscolor;
  }

   //#region
   //Print Project Table

   closeResult = '';
   open(content: any, data?: any, type?: any, idRow?: any,model?:any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type
          ? type == 'contract' || type == 'file' || type == 'contracts' || type=='deletePaymentModal'
            ? 'md':  type == 'EditPaymentModal'?'lg'
            : 'xl'
          : 'lg',
        centered:type=='SaveInvoiceConfirmModal'?true: type ? (type == 'contracts' || type == 'EditPaymentModal' || type=='deletePaymentModal' ? true : false) : true,
        backdrop:'static',
        keyboard:false,
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


   OrganizationDataProject :any=null;
   PrintDataProject :any=null;
   ProjectTableCustom:any={
    OrgImg: null,
    DateTimeNow:null,
    From:null,
    To:null,
   }
   GetPrintProjectTable()
   {
    if(this.data.userTasks.sort)
    {
      this.PrintDataProject=this.data.userTasks.sortData(this.data.userTasks.filteredData,this.data.userTasks.sort);
    }
    else
    {
      this.PrintDataProject=this.data.userTasks.data;
    }
    this.ProjectTableCustom.OrgImg = environment.PhotoURL + this.OrganizationDataProject.logoUrl;
    var date = new Date();
    this.ProjectTableCustom.DateTimeNow=date.toLocaleString();

    if(this.data.filter.DateFrom_P=="" || this.data.filter.DateFrom_P==null)
    {
      this.ProjectTableCustom.From=null;
    }
    else
    {
      this.ProjectTableCustom.From=this.data.filter.DateFrom_P;
    }
    if(this.data.filter.DateTo_P=="" || this.data.filter.DateTo_P==null)
    {
      this.ProjectTableCustom.To=null;

    }
    else
    {
      this.ProjectTableCustom.To=this.data.filter.DateTo_P;
    }
   }


   printDivProject(id: any) {
    this.print.print(id, environment.printConfig);
   }

   getOrgDataInReady(){
    this.api.GetOrganizationDataLogin().subscribe({next: (res: any) => {
          this.OrganizationDataProject = res.result;},error: (error) => {this.OrganizationDataProject=null},})
   }

   //#endregion

}
