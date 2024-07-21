import { Component, ViewChild } from '@angular/core';
import { RestApiService } from 'src/app/shared/services/api.service';
import { ProreportsService } from 'src/app/core/services/pro_Services/proreports.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ProjectPhasesTasksVM } from 'src/app/core/Classes/ViewModels/projectPhasesTasksVM';
import { BsDaterangepickerInputDirective, DatepickerDateCustomClasses } from 'ngx-bootstrap/datepicker';
import { NgxPrintElementService } from 'ngx-print-element';
import printJS from 'print-js';
import { environment } from 'src/environments/environment';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-performance-report',
  templateUrl: './performance-report.component.html',
  styleUrls: ['./performance-report.component.scss'],
})
export class PerformanceReportComponent {
  title: any = {
    main: {
      name: {
        ar: 'إدارة المشاريع',
        en: 'Projects Manegment',
      },
      link: '/customers',
    },
    sub: {
      ar: 'تقرير الاداء الشامل',
      en: 'Comprehensive Performance Report',
    },
  };

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
    reports: [],
    filter: {
      enable: false,
      date: null,
      SearchUserId :0,
      DateFrom_P :Date,
      DateTo_P :Date,
      DateFrom_S :"",
      DateTo_S :"",
      SearchBranchId :0,
      SearchProTypeName :0,
      SearchTimeType :0,
    },
    reportsTemp: [],
  };

  load_UserNameBranch :any;
  load_Users :any;
  reportsTotal: any;
  BranchName:any
  public _projectPhasesTasksVM: ProjectPhasesTasksVM;

  constructor(private api: RestApiService,
    private _proreportsService: ProreportsService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private modalService: NgbModal,
    private print: NgxPrintElementService,
    private translate: TranslateService,) {
    this.getData();
    this.FillBranchSelect();
    this.FillAllUsersTodropdown();
    this.getOrgDataInReady();
    this.data.filter.DateFrom_P=null
    this.data.filter.DateTo_P = null;
        this.api.GetBranchByBranchId().subscribe((data: any) => {
      debugger
                    this.BranchName = data.result[0].branchName;

    });

  }



  getData(){
    this._projectPhasesTasksVM=new ProjectPhasesTasksVM();

    this._projectPhasesTasksVM.userId = this.data.filter.SearchUserId??0;
    if((this.data.filter.DateFrom_P??"")=="" || (this.data.filter.DateTo_P??"")=="")
    {
      this._projectPhasesTasksVM.startDate ="";
      this._projectPhasesTasksVM.endDate="";
    }
    else
    {
      this._projectPhasesTasksVM.startDate = this.data.filter.DateFrom_S??"";
      this._projectPhasesTasksVM.endDate = this.data.filter.DateTo_S??"";
    }
    this._projectPhasesTasksVM.branchId = this.data.filter.SearchBranchId??0;

    var obj=this._projectPhasesTasksVM;
    this._proreportsService.getreportNew(obj).subscribe(data=>{
      console.log(data);
      let DataWithouTotal = data.filter((s: { userName: string; })=>s.userName!='total');
      let Total = data.filter((s: { userName: string; })=>s.userName=='total');
      this.data.reports = DataWithouTotal;
      this.reportsTotal=[];
      this.reportsTotal.push(Total);
      this.data.reportsTemp=DataWithouTotal;
      this.reportsTotal= this.reportsTotal[0][0]??[];
    });
  }
  CheckDateFromFilter(){
    debugger
    var DateS = new Date();
    var DateE= new Date();

    if(this.data.filter.SearchTimeType==1)
    {
      DateS.setDate(DateE.getDate() - 7);
      this.data.filter.DateFrom_P= DateS;
      this.data.filter.DateTo_P= DateE;
    }
    else if(this.data.filter.SearchTimeType==2)
    {
      DateS.setDate(DateE.getDate() - 14);
      this.data.filter.DateFrom_P= DateS;
      this.data.filter.DateTo_P= DateE;
    }
    else if(this.data.filter.SearchTimeType==3)
    {
      DateS.setDate(DateE.getDate() - 21);
      this.data.filter.DateFrom_P= DateS;
      this.data.filter.DateTo_P= DateE;
    }
    else if(this.data.filter.SearchTimeType==4)
    {
      DateS.setDate(DateE.getDate() - 30);
      this.data.filter.DateFrom_P= DateS;
      this.data.filter.DateTo_P= DateE;
    }
    else {
      this.data.filter.DateFrom_P="";
      this.data.filter.DateTo_P="";
    }
    if((this.data.filter.DateFrom_P??"")=="" || (this.data.filter.DateTo_P??"")=="")
    {
      this.data.filter.DateFrom_S="";
      this.data.filter.DateTo_S="";

    }
    else{
      this.data.filter.DateFrom_S= this._sharedService.date_TO_String(this.data.filter.DateFrom_P);
      this.data.filter.DateTo_S= this._sharedService.date_TO_String(this.data.filter.DateTo_P);
    }
    this.getData();
  }
  //------------------load Fill----------------------------------
  FillBranchSelect(){
    this._proreportsService.FillBranchSelect().subscribe(data=>{
      console.log(data);
      this.load_UserNameBranch=data;
    });
  }
  FillAllUsersTodropdown(){
    this._proreportsService.FillAllUsersTodropdown().subscribe(data=>{
      console.log(data);
      this.load_Users=data;
    });
  }
  CheckDate(event: any){
    if((this.data.filter.DateFrom_P??"")=="" || (this.data.filter.DateTo_P??"")=="")
    {
      this.data.filter.DateFrom_S="";
      this.data.filter.DateTo_S="";

    }
    else{
      this.data.filter.DateFrom_S= this._sharedService.date_TO_String(this.data.filter.DateFrom_P);
      this.data.filter.DateTo_S= this._sharedService.date_TO_String(this.data.filter.DateTo_P);
    }
    this.getData();

  }
  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    const tempsource = this.data.reportsTemp.filter(function (d: any) {
      return (d.finishDate?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.reasonText?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.projectNo?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.customerName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.projectTypesName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.contractNo?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.cityName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.projectMangerName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.timeStr?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.updateUser?.trim().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.data.reports = tempsource;
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
   PrintDataProjectTotal :any=null;
   ProjectTableCustom:any={
    OrgImg: null,
    DateTimeNow:null,
    From:null,
    To:null,
   }
   GetPrintProjectTable()
   {
    // if(this.data.reports.sort)
    // {
    //   this.PrintDataProject=this.data.reports.sortData(this.data.reports.filteredData,this.data.reports.sort);
    // }
    // else
    // {
    //   this.PrintDataProject=this.data.reports.data;
    // }
    this.PrintDataProject=this.data.reports;
    this.PrintDataProjectTotal=this.reportsTotal;

    this.ProjectTableCustom.OrgImg = environment.PhotoURL + this.OrganizationDataProject.logoUrl;
    var date = new Date();
    this.ProjectTableCustom.DateTimeNow=date.toLocaleString();
    debugger
    if(this.data.filter.DateFrom_S=="" || this.data.filter.DateFrom_S==null)
    {
      this.ProjectTableCustom.From=null;
    }
    else
    {
      this.ProjectTableCustom.From=this.data.filter.DateFrom_S;
    }
    if(this.data.filter.DateTo_S=="" || this.data.filter.DateTo_S==null)
    {
      this.ProjectTableCustom.To=null;

    }
    else
    {
      this.ProjectTableCustom.To=this.data.filter.DateTo_S;
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
