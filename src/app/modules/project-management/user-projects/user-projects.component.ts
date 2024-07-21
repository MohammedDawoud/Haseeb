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
  selector: 'app-user-projects',
  templateUrl: './user-projects.component.html',
  styleUrls: ['./user-projects.component.scss'],
})
export class UserProjectsComponent {
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
      ar: 'مشاريع المستخدم',
      en: 'User Projects',
    },
  };
  load_Users:any;
  displayedColumns: string[] = [
    'projectNumber',
    'projectStart',
    'projectEnd',
    'projectType',
    'subProjectType',
    'percentage',
    'projectPeriod',
    'projectDescription',
  ];
  data: any = {
    userProjects: new MatTableDataSource([{}]),
    filter: {
      enable: false,
      date: null,
      DateFrom_P:"",
      DateTo_P:"",
    },
    userProjectsTemp:[],
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
                    this.BranchName = data.result[0].branchName;

    });
  }

  getData(){
    this._proreportsService.GetUserProjectsReportW().subscribe(data=>{
      this.data.userProjects = new MatTableDataSource(data);
      this.data.userProjectsTemp=data;
      this.data.userProjects.paginator = this.paginator;
      this.data.userProjects.sort = this.sort;
    });
  }

  getData_S(){
    var userid=this.data.selected??0;
    var from=this.data.filter.DateFrom_P??"";
    var to=this.data.filter.DateTo_P??"";
    this._proreportsService.GetUserProjectsReportS(userid,"0",from,to).subscribe(data=>{
      this.data.userProjects = new MatTableDataSource(data);
      this.data.userProjectsTemp=data;
      this.data.userProjects.paginator = this.paginator;
      this.data.userProjects.sort = this.sort;
    });
  }
  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    const tempsource = this.data.userProjectsTemp.filter(function (d: any) {
      return (d.projectNo?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.firstProjectDate?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.firstProjectExpireDate?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.projectTypesName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.projectSubTypeName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.timeStr?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.projectDescription?.trim().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.data.userProjects = new MatTableDataSource(tempsource);
    this.data.userProjects.paginator = this.paginator;
    this.data.userProjects.sort = this.sort;
  }
  fill_Users(){
    this._proreportsService.FillAllUsersSelectAll().subscribe(data=>{
      console.log(data);
      this.load_Users=data;
    });
  }
  CheckDate(event: any){
    if(event!=null)
    {
      this.data.filter.DateFrom_P= this._sharedService.date_TO_String(event[0]);
      this.data.filter.DateTo_P= this._sharedService.date_TO_String(event[1]);
      this.getData_S();
    }
    else{
      this.data.filter.DateFrom_P="";
      this.data.filter.DateTo_P="";
      this.getData_S();
    }
  }
  PercentFn(obj:any){
    if (Object.keys(obj).length===0)return "";

    var count = obj.taskExecPercentage_Count;
      if (count == 0) {return "0 %";}
          else {
          var Percent = parseInt((((obj.taskExecPercentage_Sum + parseInt(obj.workOrder_Sum)) / ((obj.taskExecPercentage_Count + obj.workOrder_Count) * 100)) * 100).toString());
      }
      return Percent + " %";
  }
  ColorProject(mData:any){
    if (Object.keys(mData).length===0)
      return "";
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
    if(this.data.userProjects.sort)
    {
      this.PrintDataProject=this.data.userProjects.sortData(this.data.userProjects.filteredData,this.data.userProjects.sort);
    }
    else
    {
      this.PrintDataProject=this.data.userProjects.data;
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
