import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fade } from 'src/app/shared/animations/toggleBtn.animation';
import { RestApiService } from 'src/app/shared/services/api.service';
import { ProreportsService } from 'src/app/core/services/pro_Services/proreports.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ProjectVM } from 'src/app/core/Classes/ViewModels/projectVM';
import { NgxPrintElementService } from 'ngx-print-element';
import printJS from 'print-js';
import { environment } from 'src/environments/environment';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-project-cost',
  templateUrl: './project-cost.component.html',
  styleUrls: ['./project-cost.component.scss'],
  animations: [fade],
})
export class ProjectCostComponent {
  title: any = {
    main: {
      name: {
        ar: 'إدارة المشاريع',
        en: 'Projects Manegment',
      },
      link: '/customers',
    },
    sub: {
      ar: 'تكلفة المشروع',
      en: 'Project Cost',
    },
  };
  searchBox: any = {
    open: false,
    searchType: null,
    searchTypes: [
      {
        name: {
          ar: 'اسم العميل',
          en: 'Customer Name',
        },
        id: 1,
      },
      {
        name: {
          ar: 'رقم المشروع',
          en: 'Project Number',
        },
        id: 2,
      },
      {
        name: {
          ar: 'نوع المشروع',
          en: 'Project Type',
        },
        id: 3,
      },
    ],
  };
  load_ProjectType :any;
  load_ProjectSubType :any;
  load_Customers :any;

  public _projectVM: ProjectVM;


  displayedColumns: string[] = [
    'projectNumber',
    'name',
    'projectType',
    'subProjectType',
    'projectName',
    'income',
    'cost',
  ];
  data: any = {
    projects: new MatTableDataSource([{}]),
    filter: {
      enable: false,
      date: null,
      search_CustomerName :0,
      search_ProjectType :0,
      search_ProjectSubType :0,
      search_ProjectNo :"",
    },
    projectsTemp:[],
  };
  BranchName:any

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private api: RestApiService,
    private _proreportsService: ProreportsService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private modalService: NgbModal,
    private print: NgxPrintElementService,
    private translate: TranslateService,) {
    this.RefreshData_FirstLoad();
    this.fill_CustomerName();
    this.fill_ProjectType();
    this.getOrgDataInReady();
        this.api.GetBranchByBranchId().subscribe((data: any) => {
      debugger
                    this.BranchName = data.result[0].branchName;

    });
  }

  RefreshData(){
    debugger
    this._projectVM=new ProjectVM();
    if(this.searchBox.searchType?.id==1)
    {this._projectVM.customerId=this.data.filter.search_CustomerName;}
    else if(this.searchBox.searchType?.id==2)
    {this._projectVM.projectNo=this.data.filter.search_ProjectNo;}
    else if(this.searchBox.searchType?.id==3)
    {
      this._projectVM.projectTypeId=this.data.filter.search_ProjectType;
      this._projectVM.subProjectTypeId=this.data.filter.search_ProjectSubType;
    }
    var obj=this._projectVM;
    this._proreportsService.GetProjectsCostSearch(obj).subscribe(data=>{
      console.log(data);
        this.data.projects = new MatTableDataSource(data);
        this.data.projectsTemp=data;
        this.data.projects.paginator = this.paginator;
        this.data.projects.sort = this.sort;
    });
  }
  RefreshData_FirstLoad(){
    debugger
    this._projectVM=new ProjectVM();
    var obj=this._projectVM;
    this._proreportsService.GetProjectsCostSearch(obj).subscribe(data=>{
      console.log(data);
        this.data.projects = new MatTableDataSource(data);
        this.data.projectsTemp=data;
        this.data.projects.paginator = this.paginator;
        this.data.projects.sort = this.sort;
    });
  }
  CheckDate(event: any){
    if(event!=null)
    {
      this.data.filter.DateFrom_P= this._sharedService.date_TO_String(event[0]);
      this.data.filter.DateTo_P= this._sharedService.date_TO_String(event[1]);
      this.RefreshData_ByDate(this.data.filter.DateFrom_P,this.data.filter.DateTo_P);
    }
    else{
      this.data.filter.DateFrom_P="";
      this.data.filter.DateTo_P="";
      this.RefreshData();
    }
  }
  RefreshData_ByDate(from: any,to: any) {
    this._proreportsService.GetProjectsCostSearch_ByDate(from,to).subscribe(data=>{
      console.log(data);
      this.data.projects = new MatTableDataSource(data);
      this.data.projectsTemp=data;
      this.data.projects.paginator = this.paginator;
      this.data.projects.sort = this.sort;
    });
  }
  ProjectType_Change(){
    this.data.filter.search_ProjectSubType=null;
    this.fill_ProjectSubType(this.data.filter.search_ProjectType);
  }
  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    const tempsource = this.data.projectsTemp.filter(function (d: any) {
      return (d.projectNo?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.customerName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.projectTypesName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.projectSubTypeName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.projectDescription?.trim().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.data.projects  = new MatTableDataSource(tempsource);
    this.data.projects.paginator = this.paginator;
    this.data.projects.sort = this.sort;
  }
  calccostE(Obj:any){
    if (Object.keys(Obj).length===0)return "";

    if (Obj.costE_W == null) {
      return null;
    }
    else {
        var valCostE = (+parseFloat(Obj.costE_W).toFixed(2) + +parseFloat(Obj.costE_Depit).toFixed(2)) - +parseFloat(Obj.costE_Credit).toFixed(2);
        valCostE = +parseFloat(valCostE.toString()).toFixed(2);
        //return formatMoney(valCostE);
        return valCostE;
    }
  }
  calccostS(Obj:any){
    if (Object.keys(Obj).length===0)
      return "";
    if (Obj.costS == null || Obj.oper_expeValue == null) {
      return null;
    }
    else {
        var valCostS = +parseFloat(Obj.costS).toFixed(2) + +parseFloat(Obj.oper_expeValue).toFixed(2);
        valCostS = +parseFloat(valCostS.toString()).toFixed(2);
        //return formatMoney(valCostS);
        return valCostS;
    }
  }
  fill_ProjectType(){
    this._proreportsService.FillProjectTypeSelect().subscribe(data=>{
      console.log(data);
      this.load_ProjectType=data;
    });
  }
  fill_ProjectSubType(param:any){
    this._proreportsService.FillProjectSubTypesSelect(param).subscribe(data=>{
      console.log(data);
      this.load_ProjectSubType=data;
    });
  }
  fill_CustomerName(){
    this._proreportsService.FillCustomerSelect().subscribe(data=>{
      console.log(data);
      this.load_Customers=data;
    });
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
    if(this.data.projects.sort)
    {
      this.PrintDataProject=this.data.projects.sortData(this.data.projects.filteredData,this.data.projects.sort);
    }
    else
    {
      this.PrintDataProject=this.data.projects.data;
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
