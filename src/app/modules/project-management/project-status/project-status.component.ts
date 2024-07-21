import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RestApiService } from 'src/app/shared/services/api.service';
import { SelectionModel } from '@angular/cdk/collections';
import { fade } from 'src/app/shared/animations/toggleBtn.animation';
import { ProjectVM } from 'src/app/core/Classes/ViewModels/projectVM';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ProjectstatusService } from 'src/app/core/services/pro_Services/projectstatus.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from 'src/app/core/services/pro_Services/project.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-project-status',
  templateUrl: './project-status.component.html',
  styleUrls: ['./project-status.component.scss'],
  animations: [fade],
})
export class ProjectStatusComponent {
  title: any = {
    main: {
      name: {
        ar: 'إدارة المشاريع',
        en: 'Projects Manegment',
      },
      link: '/projects',
    },
    sub: {
      ar: 'حالة المهمة',
      en: 'Project Status',
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
          ar: 'رقم الهوية',
          en: 'National Id',
        },
        id: 2,
      },
      {
        name: {
          ar: 'رقم الجوال',
          en: 'Mobile Number',
        },
        id: 3,
      },
    ],
  };

  load_ProjectType :any;
  load_ProjectManeger :any;
  load_CustomerName :any;
  load_UsersSelectExcept:any;
  public _projectVM: ProjectVM;
  RowData: any;

  WhichDelete:number;
  ProjectIds: any = [];


  day = new Date();
  displayedColumns: string[] = [
    'select',
    'ProjectNumber',
    'ProjectDescription',
    'ProjectManeger',
    'Customer',
    'Task',
    'Invoice',
    'operations',
  ];
  data: any = {
    filter: {
      enable: false,
      date: null,
      ProjectType :null,
      search_ProjectManeger :null,
      search_CustomerName :null,
      UsersSelectExcept :null,
      search_ProjectNo:"",
      search_IsTasks:false,
      search_IsInvoices:false,
    },
    stage: {
      NameAr: '',
      NameEn: '',
    },
    stages: [],
  };

  dataFinish: any = {
    fini_radio :"",
    fini_Reason :"",
    fini_ReasonId:null,
  };

  dataAdd: any = {
    Reasontype: {
      id: 0,
      nameAr: null,
      nameEn: null,
    },
  };

  dataSourceTemp:any = [];
  userG : any = {};

  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private modalService: BsModalService,
    private modalService2: NgbModal,
    private api: RestApiService,
    private _projectstatusService: ProjectstatusService,
    private _projectService: ProjectService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
  ) {
    this.userG = this.authenticationService.userGlobalObj;
    this.getData();
  }

  selection = new SelectionModel<any>(true, []);
  modalDetails: any;
  addNewSupervision?: BsModalRef;

  //-----------------------------------------------------------------
  getData(){
    this._projectstatusService.GetAllProjectsStatusTasks().subscribe(data=>{
      console.log(data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp=data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }
  RefreshData(){
    this._projectVM=new ProjectVM();

    this._projectVM.customerId=this.data.filter.search_CustomerName??null;
    if(this.data.filter.search_ProjectNo!="")
    {
      this._projectVM.projectNo=this.data.filter.search_ProjectNo;
    }
    this._projectVM.mangerId=this.data.filter.search_ProjectManeger??null;
    if(this.data.filter.search_IsTasks==true)
      this._projectVM.projectTaskExist="true"
    else
      this._projectVM.projectTaskExist="null"

    if(this.data.filter.search_IsInvoices==true)
      this._projectVM.projectInvoiceExist="true"
    else
      this._projectVM.projectInvoiceExist="null"
    // this._projectVM.projectTaskExist=this.data.filter.search_IsTasks;
    // this._projectVM.projectInvoiceExist=this.data.filter.search_IsInvoices;
    var obj=this._projectVM;
    this._projectstatusService.SearchFn(obj).subscribe(data=>{
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp=data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }
  //------------------load Fill----------------------------------
  fill_ProjectType(){
    this._projectstatusService.FillProjectTypeSelect().subscribe(data=>{
      this.load_ProjectType=data;
    });
  }
  fill_ProjectManeger(){
    this._projectstatusService.FillAllUsersByProject().subscribe(data=>{
      this.load_ProjectManeger=data;
    });
  }
  fill_CustomerName(){
    this._projectstatusService.CustomerNameSearch().subscribe(data=>{
      this.load_CustomerName=data;
    });
  }
  fill_UsersSelectExcept(param:any){
    this._projectstatusService.FillAllUsersSelectExcept(param).subscribe(data=>{
      this.load_UsersSelectExcept=data;
    });
  }
  fill_UsersSelect(){
    this._projectstatusService.FillAllUsersSelect().subscribe(data=>{
      this.load_UsersSelectExcept=data;
    });
  }


  //------------------ End load Fill----------------------------------

  CheckDate(event: any){
    if(event!=null)
    {
      var from= this._sharedService.date_TO_String(event[0]);
      var to= this._sharedService.date_TO_String(event[1]);
      this.RefreshData_ByDate(from,to);
    }
    else{
      this.data.filter.DateFrom_P="";
      this.data.filter.DateTo_P="";
      this.RefreshData();
    }
  }
  RefreshData_ByDate(from: any,to: any) {
    this._projectstatusService.SearchDateFn(from,to).subscribe(data=>{
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp=data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    const tempsource = this.dataSourceTemp.filter(function (d: any) {
      return (d.projectNo?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.projectDescription?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.projectMangerName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.customerName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.projectTaskExist?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.projectInvoiceExist?.trim().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.dataSource = new MatTableDataSource(tempsource);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  LoadSelect(){
    this.fill_CustomerName();
    this.fill_ProjectManeger();
  }
  LoadSelectUsers(data:any){
    this.WhichDelete=2;
    this.RowData=data;
    this.fill_UsersSelectExcept(this.RowData.mangerId);
  }

  confirmDelete(type:number) {
    if(type==1){
      this._projectstatusService.DeleteProject(this.RowData.projectId).subscribe((result: any)=>{
        if(result.statusCode==200){
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
          this.RefreshData();
        }
        else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
      });
    }
    else if(type==2){
      this._projectstatusService.DeleteAllProject_NEW(this.RowData.projectId).subscribe((result: any)=>{
        if(result.statusCode==200){
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
          this.RefreshData();
        }
        else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
      });
    }
  }
  ListOfSelected(){
    this.WhichDelete=1;
    this.fill_UsersSelect();
  }
  getRowData(data:any){
    this.RowData=data;
  }

  forwardbtn(model:any){
    this.ProjectIds=[];
    if(this.WhichDelete==1)
    {
      this.selection.selected.forEach((element: any) => {
        this.ProjectIds.push(element.projectId);
      });
    }
    else
    {
      this.ProjectIds.push(this.RowData.projectId);
    }
    if(this.ProjectIds,this.data.filter.UsersSelectExcept!=null)
    {
      this._projectstatusService.ChangeProjectManagerCheckBox(this.ProjectIds,this.data.filter.UsersSelectExcept).subscribe((result: any)=>{
        if(result?.body?.statusCode==200){
          this.toast.success(result?.body?.reasonPhrase,this.translate.instant("Message"));
          this.RefreshData();
          this.selection.clear();
          model?.dismiss();
        }
        else if(result?.type==0)
        {}
        else{this.toast.error(result?.body?.reasonPhrase, this.translate.instant("Message"));}
      });
    }
    else{
      this.toast.error("من فضلك اختر مستخدم",this.translate.instant("Message"));
    }

   }

//-----------------------------------Reason Type------------------------------------------------
Reason:any;
ReasonTypesPopup:any;
FillReasonsSelect(){
  this.dataFinish.fini_ReasonId=null;
  this._projectService.FillReasonsSelect().subscribe(data=>{
    this.Reason=data;
    this.ReasonTypesPopup=data;
  });
}
ReasonTypeRowSelected:any;
getReasontypeRow(row :any){
  this.ReasonTypeRowSelected=row;
 }
setReasonTypeInSelect(data:any,modal:any){
  this.dataFinish.fini_ReasonId=data.id;
}
resetReasonType(){
  this.dataAdd.Reasontype.id=0;this.dataAdd.Reasontype.nameAr=null;this.dataAdd.Reasontype.nameEn=null;
}
saveReasonType() {
  if(this.dataAdd.Reasontype.nameAr==null || this.dataAdd.Reasontype.nameEn==null)
  {
    this.toast.error("من فضلك أكمل البيانات", this.translate.instant("Message"));
    return;
  }
  var ProReasonObj:any = {};
  ProReasonObj.ReasonsId = this.dataAdd.Reasontype.id;
  ProReasonObj.NameAr = this.dataAdd.Reasontype.nameAr;
  ProReasonObj.NameEn = this.dataAdd.Reasontype.nameEn;
  this._projectService.SaveReason(ProReasonObj).subscribe((result: any)=>{
    if(result.statusCode==200){
      this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
      this.resetReasonType();
      this.FillReasonsSelect();
    }
    else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
  });
}
confirmReasontypeDelete() {
  this._projectService.DeleteReason(this.ReasonTypeRowSelected.id).subscribe((result: any)=>{
    if(result.statusCode==200){
      this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
      this.FillReasonsSelect();
    }
    else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
  });
}
//----------------------------------(End)-Reason Type---------------------------------------------

checkedEmail: any;checkedPhone: any;   EmailValue: any;PhoneValue: any;
GetCustomersByCustomerId(id:any){
  this._projectService.GetCustomersByCustomerId(id).subscribe(data=>{
    this.checkedEmail=false;
    this.checkedPhone=false;
    this.EmailValue=data.result.customerEmail;
    this.PhoneValue=data.result.customerMobile;
  });
}

   finishProject(model:any){
    var reatxt="";
    if(this.dataFinish.fini_radio=="1")reatxt="مكتمل";
    else if(this.dataFinish.fini_radio=="2")reatxt="ملغاه";
    else if (this.dataFinish.fini_radio=="3")reatxt="متوقف";
    else
    {
      reatxt="";this.toast.error("من فضلك أكمل البيانات",this.translate.instant("Message"));return;
    }
    if(this.dataFinish.fini_ReasonId==null)
    {
      this.toast.error("من فضلك أختر السبب ",this.translate.instant("Message"));return;
    }
    var type=0;
    var whichClickDesc=4;
    if(this.checkedEmail==true)type=1;
    else if(this.checkedPhone==true)type=2;
    else if(this.checkedEmail==true && this.checkedPhone==true)type=3;
    this._projectstatusService.FinishProject(this.RowData.projectId,this.dataFinish.fini_ReasonId,reatxt
      ,this.dataFinish.fini_radio,reatxt,this._sharedService.date_TO_String(new Date()),type,whichClickDesc).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.RefreshData();
        model?.hide();

      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
    });
   }


   closeResult = '';

   open(content: any, data?: any, type?: any, idRow?: any) {
    if(type=='endModal')
    {
      this.FillReasonsSelect();
    }
    this.modalService2
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? (type=='endModal'? 'lg':'xl') :'lg',
        centered: type ? (type=='endModal'? true:false) : true,
        backdrop:'static',
        keyboard:false,
      })

      .result.then(
        (result) => {
          if (type == 'edit') {
          }
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


  resetModal() {
    this.modalDetails = {
      AgencData: null,
      CustomerNameAr: null,
      CustomerNameEn: null,
      Id: null,
      ResponsiblePerson: null,
      Name: null,
      CustomerId: null,
      BranchId: null,
      CustomerCode: null,
      CustomerName: null,
      CustomerNationalId: null,
      NationalIdSource: null,
      CustomerAddress: null,
      CustomerEmail: null,
      CustomerPhone: null,
      CustomerMobile: null,
      CustomerTypeId: '1',
      Notes: null,
      LogoUrl: null,
      AttachmentUrl: null,
      CommercialActivity: null,
      CommercialRegister: null,
      CommercialRegDate: null,
      CommercialRegHijriDate: null,
      AccountId: null,
      ProjectNo: null,
      GeneralManager: null,
      AgentName: null,
      AgentType: null,
      AgentNumber: null,
      AgentAttachmentUrl: null,
      AccountName: null,
      AddDate: null,
      CustomerTypeName: null,
      AddUser: null,
      CompAddress: null,
      PostalCodeFinal: null,
      ExternalPhone: null,
      Country: null,
      Neighborhood: null,
      StreetName: null,
      BuildingNumber: null,
      CommercialRegInvoice: null,
      CityId: null,
      CityName: null,
      NoOfCustProj: null,
      NoOfCustProjMark: null,
      AddedcustomerImg: null,
      Projects: null,
      AccountCodee: null,
      TotalRevenue: null,
      TotalExpenses: null,
      Invoices: null,
      Transactions: null,
    };
  }

  availableSupervision() {}
  decline() {}

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    debugger
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
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
}
