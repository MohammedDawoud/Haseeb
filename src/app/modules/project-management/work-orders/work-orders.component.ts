import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { WorkordersService } from 'src/app/core/services/pro_Services/workorders.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { WorkOrdersVM } from 'src/app/core/Classes/ViewModels/workOrdersVM';
import { WorkOrders } from 'src/app/core/Classes/DomainObjects/workOrders';
import { ProjectRequirements } from 'src/app/core/Classes/DomainObjects/projectRequirements';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-work-orders',
  templateUrl: './work-orders.component.html',
  styleUrls: ['./work-orders.component.scss'],
})
export class WorkOrdersComponent implements OnInit {
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
      ar: ' متابعة المهام الإدارية',
      en: 'Follow-up to administrative functions',
    },
  };

  selectedUser: any;
  users: any;


  closeResult = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public _workOrders: WorkOrders;

  workOrdersDisplayedColumns: string[] = [
    'taskNo',
    'assignedTo',
    'from',
    'to',
    'customer',
    'implemented',
    'enginner',
    'excuting_officer',
    'projectNo',
    'status',
    'operations',
  ];
  workOrdersDataSourceTemp:any=[];
  workOrdersDataSource = new MatTableDataSource();

  workOrders: any;

  modalDetails: any = {
    workOrderId: 0,
    orderNo: null,
    orderDate: new Date(),
    orderHijriDate: null,
    executiveEng: null,
    responsibleEng: null,
    customerId: null,
    required: null,
    note: null,
    endDate: null,
    woStatus: null,
    agentId: null,
    projectId: null,
    projectIdChecked: false,
  };

  startDate = new Date();
  endDate = new Date();

  searchBox: any = {
    open: false,
    searchType: null,
  };
  data: any = {
    filter: {
      enable: false,
      date: null,
      search_OrderNo:null,
      search_search_ResponsibleEng :null,
      search_ExecutiveEng :null,
      search_CustomerId :null,
      search_required :null,
      isChecked:false,
    }
  };

  public _workOrdersVM: WorkOrdersVM;
  userG : any = {};

  constructor(private modalService: NgbModal,
    private _workordersService: WorkordersService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,

) {
  this.userG = this.authenticationService.userGlobalObj;
  this._workOrdersVM=new WorkOrdersVM();
}

  ngOnInit(): void {


    this.getData();
    this.FillCustomerSelect();
    this.FillAllUsersTodropdown();
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
  }

  open(content: any, data?: any, type?: any) {
    this.FillCustomerSelect_M();
    this.FillAllUsersTodropdown_M();
    this.ClearField();
    if (data && type == 'edit') {
      this.modalDetails = data;
      this.modalDetails.orderDate=this._sharedService.String_TO_date(this.modalDetails.orderDate);
      this.modalDetails.endDate=this._sharedService.String_TO_date(this.modalDetails.endDate);
      if(this.modalDetails.projectId)
      {
        this.modalDetails.projectIdChecked=true;
      }
    }
    else if (type == 'add') {
      this.GetMaxOrderNumber();
    }

    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
        centered: type ? false : true,
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
    this.modalDetails = {
      workOrderId: 0,
      orderNo: null,
      orderDate: new Date(),
      orderHijriDate: null,
      executiveEng: null,
      responsibleEng: null,
      customerId: null,
      required: null,
      note: null,
      endDate: null,
      woStatus: null,
      agentId: null,
      projectId: null,
      projectIdChecked: false,
    };

    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  addWorkOrder() {}

  editWorkOrder() {}

  getData(){
    this._workordersService.GetAllWorkOrders().subscribe(data=>{
        this.workOrdersDataSource = new MatTableDataSource(data);
        this.workOrdersDataSourceTemp=data;
        this.workOrdersDataSource.paginator = this.paginator;
        this.workOrdersDataSource.sort = this.sort;
    });
  }

  RefreshData(){
    debugger
    this._workOrdersVM=new WorkOrdersVM();
    if(this.searchBox.searchType==1)
    {this._workOrdersVM.orderNo=this.data.filter.search_OrderNo;}
    else if(this.searchBox.searchType==2)
    {this._workOrdersVM.responsibleEng=this.data.filter.search_ResponsibleEng;}
    else if(this.searchBox.searchType==3)
    {this._workOrdersVM.executiveEng=this.data.filter.search_ExecutiveEng;}
    else if(this.searchBox.searchType==4)
    {this._workOrdersVM.customerId=this.data.filter.search_CustomerId;}
    else if(this.searchBox.searchType==5)
    {this._workOrdersVM.required=this.data.filter.search_required;}

    var obj=this._workOrdersVM;
    this._workordersService.SearchFn(obj).subscribe(data=>{
      this.workOrdersDataSource = new MatTableDataSource(data);
      this.workOrdersDataSourceTemp=data;
      this.workOrdersDataSource.paginator = this.paginator;
      this.workOrdersDataSource.sort = this.sort;
    });
  }

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
    this._workordersService.SearchDateFn(from,to).subscribe(data=>{
      this.workOrdersDataSource = new MatTableDataSource(data);
        this.workOrdersDataSourceTemp=data;
        this.workOrdersDataSource.paginator = this.paginator;
        this.workOrdersDataSource.sort = this.sort;
    });
  }
  // //-----------------------------------------------------------------

  applyFilter(event: any) {
    debugger;
    const val = event.target.value.toLowerCase();
    const tempsource = this.workOrdersDataSourceTemp.filter(function (d: any) {
      return (d.orderNo?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.userName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.orderDate?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.endDate?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.customerName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.required?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.responsibleEngName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.executiveEngName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       //|| (d.projectNo?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.woStatustxt?.trim().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.workOrdersDataSource = new MatTableDataSource(tempsource);
    this.workOrdersDataSource.paginator = this.paginator;
    this.workOrdersDataSource.sort = this.sort;
  }
  WorkOrderRowSelected:any;
  getRow(row :any){
    this.WorkOrderRowSelected=row;
  }

  public uploadedFiles: Array<File> = [];
  selectedFiles?: FileList;
  currentFile?: File;

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }
  disableButtonSave_WorkOrder=false;

  SaveWorkOrder(type:any,model:any) {
    this.modalDetails.orderDate.setHours(0,0,0,0);
    this.modalDetails.endDate.setHours(0,0,0,0);
    if(this.modalDetails.orderDate.getTime()>this.modalDetails.endDate.getTime())
    {
      this.toast.error('من فضلك أختر تاريخ صحيح', this.translate.instant("Message"));return;
    }
    if(this.modalDetails.orderDate==null|| this.modalDetails.endDate==null || this.modalDetails.executiveEng==null
      || this.modalDetails.responsibleEng==null
      || this.modalDetails.required ==null){
        this.toast.error("من فضلك أكمل الببانات", this.translate.instant("Message"));
        return;
      }
    const formData: FormData = new FormData();
    var Date=this._sharedService.date_TO_String(this.modalDetails.orderDate);
    var DateE=this._sharedService.date_TO_String(this.modalDetails.endDate);
    if(type=='add')
    {
      formData.append('WorkOrderId',  String(0));
    }
    else{
      formData.append('WorkOrderId',  String(this.modalDetails.workOrderId));
    }
    formData.append('OrderNo', String(this.modalDetails.orderNo));
    formData.append('OrderDate', String(Date));
    formData.append('OrderHijriDate', String(""));
    formData.append('ExecutiveEng', String(this.modalDetails.executiveEng));
    formData.append('ResponsibleEng', String(this.modalDetails.responsibleEng));
    if (this.modalDetails.customerId!=null) {
      formData.append('CustomerId', String(this.modalDetails.customerId));
    }
    formData.append('Required', String(this.modalDetails.required));
    formData.append('Note', String(this.modalDetails.note));
    formData.append('EndDate', String(DateE));
    formData.append('WOStatus', String(1));
    formData.append('AgentId', String(this.modalDetails.agentId));
    if (this.modalDetails.projectIdChecked && this.modalDetails.projectId!=null) {
        formData.append('ProjectId', String(this.modalDetails.projectId));
    }



      if (this.selectedFiles) {
        const file: File | null = this.selectedFiles.item(0);

        if (file) {
          this.currentFile = file;
          formData.append('postedFiles', this.currentFile);
        }
        else{
          this.currentFile=undefined;
        }
      }
      this.disableButtonSave_WorkOrder = true;
      setTimeout(() => { this.disableButtonSave_WorkOrder = false }, 9000);

      this._workordersService.SaveWorkOrder(formData).subscribe((result: any)=>{
        debugger
        if(result?.body?.statusCode==200){
          debugger
          this.toast.success(this.translate.instant(result?.body?.reasonPhrase),this.translate.instant("Message"));
          //this.GetMaxOrderNumber();
          model?.dismiss();
          debugger
          if(this.selectedFiles){
            debugger
            this.SaveProjectRequirement4(this.currentFile,result?.body?.returnedParm);
          }
          this.ClearField();
          this.getData();
        }
        else if(result?.type==4 && result?.body?.statusCode==400)
        {
          this.toast.error(this.translate.instant(result?.body?.reasonPhrase), this.translate.instant("Message"));
        }
        else if(result?.type>=0)
        {}
        else{this.toast.error(this.translate.instant(result?.body?.reasonPhrase), this.translate.instant("Message"));}

      });
    }

    public _projectRequirements: ProjectRequirements;
    SaveProjectRequirement4(file:any,orderid:any) {
      debugger
      this._projectRequirements=new ProjectRequirements();
      this._projectRequirements.requirementId=0;

      this._projectRequirements.orderId=orderid;
      this._projectRequirements.pageInsert=4;


      var obj=this._projectRequirements;
      this._workordersService.SaveProjectRequirement4(file,obj).subscribe((result: any)=>{
        // if(result?.body?.statusCode==200){
        //   this.toast.success(result?.body?.reasonPhrase,'رسالة');
        // }
        // else if(result?.type>=0)
        // {}
        // else{this.toast.error(result?.body?.reasonPhrase, 'رسالة');}

      });
    }

  ClearField(){
    this.modalDetails.workOrderId=0;
    this.modalDetails.orderNo=null;
    this.modalDetails.orderDate=new Date();
    this.modalDetails.orderHijriDate=null;
    this.modalDetails.executiveEng=null;
    this.modalDetails.responsibleEng=null;
    this.modalDetails.customerId=null;
    this.modalDetails.required=null;
    this.modalDetails.note=null;
    this.modalDetails.endDate=null;
    this.modalDetails.woStatus=null;
    this.modalDetails.agentId=null;
    this.modalDetails.projectId=null;
    this.modalDetails.projectIdChecked=null;


    this.selectedFiles = undefined;
    this.uploadedFiles=[];
  }
  confirm() {
    this._workordersService.DeleteWorkOrder(this.WorkOrderRowSelected.workOrderId).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.getData();
        }
      else{this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant("Message"));}
    });
  }

  downloadFile(data: any) {
    try
    {
      debugger
      var link=environment.PhotoURL+data.attatchmentUrl;
      window.open(link, '_blank');
    }
    catch (error)
    {
      this.toast.error("تأكد من الملف", this.translate.instant("Message"));
    }
  }


  load_ResponsibleEng :any;
  load_ExecutiveEng :any;
  load_CustomerId :any;

  FillCustomerSelect(){
    this._workordersService.FillCustomerSelect().subscribe(data=>{
      this.load_CustomerId=data;
    });
  }
  FillAllUsersTodropdown(){
    this._workordersService.FillAllUsersSelectAll().subscribe(data=>{
      console.log(data);
      this.load_ResponsibleEng=data;
      this.load_ExecutiveEng=data;
    });
  }

  load_ResponsibleEng_M :any;
  load_ExecutiveEng_M :any;
  load_CustomerId_M :any;
  load_ProCustomer_M :any;
  FillCustomerSelect_M(){
    this._workordersService.FillCustomerSelect().subscribe(data=>{
      console.log(data);
      this.load_CustomerId_M=data;
    });
  }
  FillAllUsersTodropdown_M(){
    this._workordersService.FillAllUsersSelectAll().subscribe(data=>{
      console.log(data);
      this.load_ResponsibleEng_M=data;
      this.load_ExecutiveEng_M=data;
    });
  }
  FillAllProjByCustomerId(param:any){
    this._workordersService.GetAllProjByCustomerId(param).subscribe(data=>{
      this.load_ProCustomer_M=data;
    });
  }
  GetCustomersByCustomerId(param:any){
    this.modalDetails.agentId=null;
    this._workordersService.GetCustomersByCustomerId(param).subscribe(data=>{
      console.log("data");
      console.log(data);

      this.modalDetails.agentId=data.result.customerNationalId;
    });
  }
  ChangeCustomerFn(){
    if(this.modalDetails.customerId)
    {
      this.FillAllProjByCustomerId(this.modalDetails.customerId);
      this.GetCustomersByCustomerId(this.modalDetails.customerId);
    }
    else
    {
      this.modalDetails.agentId=null;
      this.load_ProCustomer_M=[];
    }
  }
  GetMaxOrderNumber(){
    debugger
    this.modalDetails.orderNo=null;
    this._workordersService.GetMaxOrderNumber().subscribe(data=>{
      this.modalDetails.orderNo=data;
    });
  }
  CheckDateValid(event: any,type:any){
    if(type==1)
    {
      if(event!=null)
      {
        this.modalDetails.orderDate= event;
        this.validMsg();
      }
      else{
        this.modalDetails.orderDate=null;
      }
    }
    else{
      if(event!=null)
      {
        this.modalDetails.endDate= event;
        this.validMsg();
      }
      else{
        this.modalDetails.endDate=null;
      }
    }
  }
  validMsg(){
    if(this.modalDetails.orderDate!=null && this.modalDetails.endDate!=null)
    {
      this.modalDetails.orderDate.setHours(0,0,0,0);
      this.modalDetails.endDate.setHours(0,0,0,0);
      if(this.modalDetails.orderDate.getTime()>this.modalDetails.endDate.getTime()){
        debugger
        this.modalDetails.orderDate=new Date();
        //this.modalDetails.endDate=this.addDays(new Date(),1);
        this.modalDetails.endDate=new Date();
        this.toast.error('لا يمكنك اختيار تاريخ النهاية أصغر من البداية', this.translate.instant("Message"));return;
      }
    }
  }
  addDays(date:any, days:any) {
    var copy = new Date(Number(date));
    copy.setDate(date.getDate() + days);
    return copy
  }
}
