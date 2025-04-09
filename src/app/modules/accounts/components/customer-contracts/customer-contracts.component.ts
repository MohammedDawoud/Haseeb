import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  TemplateRef,
  HostListener,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxPrintElementService } from 'ngx-print-element';
import printJS from 'print-js'
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import { ContractsVM } from 'src/app/core/Classes/ViewModels/contractsVM';
import { ContractService } from 'src/app/core/services/acc_Services/contract.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { MatStepper } from '@angular/material/stepper';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { PrintreportsService } from 'src/app/core/services/acc_Services/printreports.service';
import 'hijri-date';
import { InvoiceService } from 'src/app/core/services/acc_Services/invoice.service';
import { ProjectService } from 'src/app/core/services/pro_Services/project.service';
import {CdkDragDrop,CdkDrag,CdkDropList,CdkDropListGroup,moveItemInArray,transferArrayItem,} from '@angular/cdk/drag-drop';
import { DebentureService } from 'src/app/core/services/acc_Services/debenture.service';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';

const hijriSafe= require('hijri-date/lib/safe');
const HijriDate =  hijriSafe.default;
const toHijri  = hijriSafe.toHijri;


@Component({
  selector: 'app-customer-contracts',
  templateUrl: './customer-contracts.component.html',
  styleUrls: ['./customer-contracts.component.scss'],
})
export class CustomerContractsComponent implements OnInit {

  services: any;
  title: any = {
    main: {
      name: {
        ar: 'الحسابات',
        en: 'Projects Management',
      },
      link: '/accounts',
    },
    sub: {
      ar: 'عقود العملاء ',
      en: 'customer contracts',
    },
  };

  selectedUser: any;
  users: any;

  closeResult = '';

  showStats = false;
  showFilters = false;
  showPrice = false;

  @ViewChild(DatatableComponent) table: DatatableComponent | any;

  @ViewChild('contractCustomerModal') contractCustomerModal!: any;
  @ViewChild('contractCustomerMainModal') contractCustomerMainModal!: any;

  contractAddObj: any={
    ContractType:1,
  };


  columns: any = [];

  isEditable: any = {};

  openBox: any = false;
  boxId: any;

  // revision
  displayedColumns: string[] = [
    'offer_id',
    'date',
    'customer',
    'price',
    'user',
    'project_id',
    'project-duration',
    'operations',
  ];

  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  delayedProjects: any;
  latedProjects: any;

  currentDate: any;

  selectedProject: any;
  selectedRow: any;

  selectAllValue = false;

  selectedUserPermissions: any = {
    userName: '',
    watch: null,
    add: null,
    edit: null,
    delete: null,
  };
  userPermissions: any = [];

  userPermissionsColumns: string[] = [
    'userName',
    'watch',
    'add',
    'edit',
    'delete',
    'operations',
  ];
  projectGoalsColumns: string[] = [
    'serial',
    'requirements',
    'name',
    'duration',
    'choose',
  ];
  projectDisplayedColumns: string[] = [
    'contractNo',
    'date',
    'totalValue',
    'customerName',
    // 'projectDescription',
    // 'projectNo',
    'totalPaidPayment',
    'totalRemainingPayment',
    'operations',
  ];
  serviceDisplayedColumns: string[] = [
    'M',
    'TeamWorkCategories',
    'Specialization',
    'Number',
    'Notes',
  ];

  projectUsersColumns: string[] = ['name', 'responsibility'];
  projectTasksColumns: string[] = ['taskName', 'name', 'duration'];

  userPermissionsDataSource = new MatTableDataSource();

  projectGoalsDataSource = new MatTableDataSource();

  projectUsersDataSource = new MatTableDataSource();

  projectTasksDataSource = new MatTableDataSource();

  servicesDataSource = new MatTableDataSource();

  modalDetails: any = {
    InvoiceNumber: null,
    projectDuration: null,
    branch: null,
    center: null,
    from: null,
    to: null,
    projectType: null,
    subProjectDetails: null,
    walk: null,
    customer: null,
    buildingType: null,
    service: null,
    user: null,
    region: null,
    projectDescription: null,
    offerPriceNumber: null,
    projectDepartment: null,
    projectPermissions: null,
    projectGoals: null,
  };




  OpenContract(type:any){
    if(type=="newContract")
    {
      this.contractAddObj.ContractType=1;
      this.contractAddObj.ProjectId=null;
      this.contractAddObj.CustomerId=null;
    }
    if(type=="Installments")
    {
      this.contractAddObj.ContractType=2;
      this.contractAddObj.ProjectId=null;
      this.contractAddObj.CustomerId=null;
    }
    this.modalService.open(this.contractCustomerMainModal, { size: 'xl' });
  }
  OpenContract_Des(type:any){
    if(type=="ConsultantContract")
    {
      this.contractAddObj.ContractType=3;
    }
    if(type=="supervisionContract")
    {
      this.contractAddObj.ContractType=4;
    }
    if(type=="designContract")
    {
      this.contractAddObj.ContractType=5;
    }
    this.modalService.open(this.contractCustomerModal, { size: 'xl' });
  }

  startDate = new Date();
  endDate = new Date();
  userG : any = {};

  constructor(
    private modalService: NgbModal,
    private _contractService: ContractService,
    private _formBuilder: FormBuilder,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private translate: TranslateService,
    private print: NgxPrintElementService,
    private _printreportsService: PrintreportsService,
    private authenticationService: AuthenticationService,
    private _invoiceService: InvoiceService,
    private _debentureService: DebentureService,
    private _projectService: ProjectService,
    private _accountsreportsService: AccountsreportsService,
    private formBuilder: FormBuilder,


  ) {
    this.userG = this.authenticationService.userGlobalObj;
    this.currentDate = new Date();
    // this.FillAllUsersSelectAll();
    this.LoadContractData();
  }

  ngOnInit(): void {
    this.users = [
      { id: 1, Name: 'محمود نافع' },
      { id: 2, Name: 'محمود نافع' },
      { id: 3, Name: 'محمود نافع' },
      { id: 4, Name: 'محمود نافع' },
      { id: 5, Name: 'محمود نافع' },
      { id: 6, Name: 'محمود نافع' },
    ];

    this.services = [
      {
        M: '000056',
        TeamWorkCategories: '2023-06-13',
        Specialization: '2,300',
        Number: '2022-3',
        Notes: 'يوسف(VIP)',
      },
      {
        M: '000056',
        TeamWorkCategories: '2023-06-13',
        Specialization: '2,300',
        Number: '2022-3',
        Notes: 'يوسف(VIP)',
      },
      {
        M: '000056',
        TeamWorkCategories: '2023-06-13',
        Specialization: '2,300',
        Number: '2022-3',
        Notes: 'يوسف(VIP)',
      },
      {
        M: '000056',
        TeamWorkCategories: '2023-06-13',
        Specialization: '2,300',
        Number: '2022-3',
        Notes: 'يوسف(VIP)',
      },
      {
        M: '000056',
        TeamWorkCategories: '2023-06-13',
        Specialization: '2,300',
        Number: '2022-3',
        Notes: 'يوسف(VIP)',
      },
    ];
    this.servicesDataSource = new MatTableDataSource(this.services);

    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );



    this.servicesList = [
      {
        id: 10,
        name: 'awdawd',
        unit: '12',
        amount: 451,
        price: 35200,
        vatTax: 10,
        taxes: 20,
      },
      {
        id: 11,
        name: 'bsdvsv',
        unit: '12',
        amount: 451,
        price: 35200,
        vatTax: 10,
        taxes: 20,
      },
      {
        id: 12,
        name: 'gergerg',
        unit: '12',
        amount: 451,
        price: 35200,
        vatTax: 10,
        taxes: 20,
      },
      {
        id: 13,
        name: 'awdawd',
        unit: '12',
        amount: 451,
        price: 35200,
        vatTax: 10,
        taxes: 20,
      },
      {
        id: 14,
        name: 'dfbdfbf',
        unit: '12',
        amount: 451,
        price: 35200,
        vatTax: 10,
        taxes: 20,
      },
      {
        id: 15,
        name: 'zccszscz',
        unit: '12',
        amount: 451,
        price: 35200,
        vatTax: 10,
        taxes: 20,
      },
    ];
  }


  ngAfterViewInit() {
    // this.open(this.smartModal, null, 'smartModal');
  }
//-------------------------------------- Search------------------------------------------
  dataContract: any = {
    filter: {
      enable: false,
      date: null,
      search_Contract :null,
      search_ProjectManagerId :null,
      DateFrom_P :null,
      DateTo_P :null,
      AllContracts:false,
    }
  };

  ContractsDataSource = new MatTableDataSource();
  ContractsDataSourceTemp:any=[];


  LoadContractData(){
    this._contractService.GetAllContractsNotPaid(false).subscribe(data=>{
      this.ContractsDataSource = new MatTableDataSource(data);
      this.ContractsDataSourceTemp=data;
      this.ContractsDataSource.paginator = this.paginator;
      this.ContractsDataSource.sort = this.sort;
    });
  }
  SearchContractData(){
    var _contractsVM=new ContractsVM();
    _contractsVM.managerId=this.dataContract.filter.search_ProjectManagerId;
    if(!(this.dataContract.filter.DateFrom_P ==null || this.dataContract.filter.DateTo_P ==null)){
      _contractsVM.dateFrom=this.dataContract.filter.DateFrom_P;
      _contractsVM.dateTo=this.dataContract.filter.DateTo_P;
      _contractsVM.isChecked=true;
      _contractsVM.isSearch=true;
    }
    else
    {
      _contractsVM.dateFrom=null;
      _contractsVM.dateTo=null;
      _contractsVM.isChecked=false;
      _contractsVM.isSearch=false;
    }



    var obj=_contractsVM;
    this._contractService.GetAllContractsBySearch(obj).subscribe(data=>{
      this.ContractsDataSource = new MatTableDataSource(data);
      this.ContractsDataSourceTemp=data;
      this.ContractsDataSource.paginator = this.paginator;
      this.ContractsDataSource.sort = this.sort;
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ContractsDataSource.filter = filterValue.trim().toLowerCase();
  }

  ShowAllContracts(){
    if(this.dataContract.filter.AllContracts){
      this.SearchContractData();
    }
    else{
      this.LoadContractData();
    }
    this.selection.clear();
  }
  CheckDate(event: any){
    if(event!=null)
    {
      this.dataContract.filter.DateFrom_P= this._sharedService.date_TO_String(event[0]);
      this.dataContract.filter.DateTo_P= this._sharedService.date_TO_String(event[1]);
      this.SearchContractData();
    }
    else{
      this.dataContract.filter.DateFrom_P=null;
      this.dataContract.filter.DateTo_P=null;
      this.SearchContractData();
    }
  }

  LoadManagersSearch:any;
  FillAllUsersSelectAll(){
    this._contractService.FillAllUsersSelectAll().subscribe(data=>{
      this.LoadManagersSearch=data;
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

//-----------------------------------------End Search--------------------------------------------

//----------------------------------------- Table Btn--------------------------------------------
ContractRowSelected:any;
getContractRow(row :any){
  this.ContractRowSelected=row;
 }

confirmCancelContract() {
  this._contractService.CancelContract(this.ContractRowSelected.contractId).subscribe((result: any)=>{
    if(result.statusCode==200){
      this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
      this.ShowAllContracts();
    }
    else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"))};
  });
}

downloadFileUrl(file: any) {
  debugger
    try
    {
      var link=environment.PhotoURL+file;
      window.open(link, '_blank');
    }
    catch (error)
    {
      this.toast.error("تأكد من الملف", this.translate.instant("Message"));
    }
  }
  downloadFileUrlExtra(file: any) {
    debugger
    try
    {
      var link=environment.PhotoURL+file;
      window.open(link, '_blank');
    }
    catch (error)
    {
      this.toast.error("تأكد من الملف", this.translate.instant("Message"));
    }
  }

  publictypeOfupload:any=1;
  UploadFileContract(modal:any){
    if(this.publictypeOfupload==1)// رفع العقد المختوم
    {
      this.UploadProjectContract(modal);
    }
    else if(this.publictypeOfupload==2)// ارفاق ملحق
    {
      this.UploadProjectContractExtra(modal);
    }
  }

  UploadProjectContract(modal:any) {
    debugger
    if(this.control?.value.length>0){
      var formData = new FormData();
      formData.append('file', this.control?.value[0]);
      formData.append('ContractId', this.ContractRowSelected.contractId);
      formData.append('ProjectId', this.ContractRowSelected.projectId);
      formData.append('pageInsert', "5");

      this._contractService.UploadProjectContract(formData).subscribe(result => {
        if(result.statusCode==200){
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
          this.control.clear();
          this.ShowAllContracts();
          modal?.dismiss();
        }
        else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"))};
      });
    }
    else{
      this.toast.error("من فضلك أختر ملف أولا ", this.translate.instant("Message"));return;
    }
  }
  UploadProjectContractExtra(modal:any) {
    debugger
    if(this.control?.value.length>0){
      var formData = new FormData();
      formData.append('file', this.control?.value[0]);
      formData.append('ContractId', this.ContractRowSelected.contractId);
      formData.append('ProjectId', this.ContractRowSelected.projectId);

      this._contractService.UploadProjectContractExtra(formData).subscribe(result => {
        if(result.statusCode==200){
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
          this.control.clear();
          this.ShowAllContracts();
          modal?.dismiss();
        }
        else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"))};
      });
    }
    else{
      this.toast.error("من فضلك أختر ملف أولا ", this.translate.instant("Message"));return;
    }
  }




//--------------------------------------Edit--------------------------------------------------------
  ContractEditServices: any = [];

  addServiceContractEdit() {
    var maxVal=0;
    if(this.ContractEditServices.length>0)
    {
      maxVal = Math.max(...this.ContractEditServices.map((o: { idRow: any; }) => o.idRow))
    }
    else{
      maxVal=0;
    }


    this.ContractEditServices?.push({
      idRow: maxVal+1,
      AccJournalid: null,
      UnitConst: null,
      QtyConst: null,
      accountJournaltxt: null,
      Amounttxt: null,
      taxAmounttxt: null,
      TotalAmounttxt: null,

      MeterPrice1: null,
      MeterPrice2: null,
      MeterPrice3: null,
      PackageRatio1: null,
      PackageRatio2: null,
      PackageRatio3: null,
    });
  }

  deleteServiceContractEdit(idRow: any) {
    let index = this.ContractEditServices.findIndex((d: { idRow: any; }) => d.idRow == idRow);
    this.ContractEditServices.splice(index, 1);
    this.CalculateTotal_ContractEdit();
  }
  selectedServiceRowContractEdit: any;

  setServiceRowValue_ContractEdit(element: any) {
    this.ContractEditServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractEdit)[0].AccJournalid = element.servicesId;
    this.ContractEditServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractEdit)[0].UnitConst = element.serviceTypeName;
    this.ContractEditServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractEdit)[0].QtyConst = 1;
    this.ContractEditServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractEdit)[0].accountJournaltxt = element.servicesName;
    this.ContractEditServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractEdit)[0].Amounttxt = element.amount;
    //this.SetAmountPackage(this.selectedServiceRowOffer, element);
    this.CalculateTotal_ContractEdit();
  }

  setServiceRowValueNew_ContractEdit(indexRow:any,item: any, Qty: any,servamount: any) {
    this.addServiceContractEdit();
    this.ContractEditServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].AccJournalid = item.servicesId;
    this.ContractEditServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].UnitConst = item.serviceTypeName;
    this.ContractEditServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].QtyConst = Qty;
    this.ContractEditServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].accountJournaltxt = item.name;
    this.ContractEditServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].Amounttxt = servamount;
    this.CalculateTotal_ContractEdit();
  }
  GetOfferservicenByidContractEdit(Contractid:any){
    debugger
    this._contractService.GetContractserviceBycontractid(Contractid).subscribe(data=>{
      if(data.length>0)
      {
        data.forEach((element: any) => {
          this.modalDetailsContractEdit.taxtype=element.taxType;
          this.GetServicesPriceByServiceId_ContractEdit(element);
          debugger
          element.AccJournalid=element.serviceId;
          this.GetServicesPriceByParentId(element);
        });
      }
    });
  }


  GetServicesPriceByServiceId_ContractEdit(offerdata:any){

    this._contractService.GetServicesPriceByServiceId(offerdata.serviceId).subscribe(data=>{
      var maxVal=0;

      if(this.ContractEditServices.length>0)
      {
        maxVal = Math.max(...this.ContractEditServices.map((o: { idRow: any; }) => o.idRow))
      }
      else{
        maxVal=0;
      }
      this.setServiceRowValueNew_ContractEdit(maxVal+1,data.result,offerdata.serviceQty,offerdata.serviceamountval);
    });
  }
  GetServicesPriceByServiceId_Invoice(offerdata:any,amount:any){

    this._contractService.GetServicesPriceByServiceId(offerdata.serviceId).subscribe(data=>{
      var maxVal=0;

      if(this.InvoiceDetailsRows.length>0)
      {
        maxVal = Math.max(...this.InvoiceDetailsRows.map((o: { idRow: any; }) => o.idRow))
      }
      else{
        maxVal=0;
      }
      //offerdata.serviceamountval
      this.setServiceRowValueNew(maxVal+1,data.result,1,amount);
    });
  }

  modalDetailsContractEdit:any={
    taxtype:2,
    total_amount:null,
    ContractTax:null,
    total_amount_text:null,
  }
  resetmodalDetailsContractEdit(){
    this.ContractEditServices=[];
    this.modalDetailsContractEdit={
      taxtype:2,
      total_amount:null,
      ContractTax:null,
      total_amount_text:null,
    }
  }
  CalculateTotal_ContractEdit() {
    var totalwithtaxes = 0;var totalAmount = 0;var totaltax = 0;var totalAmountIncludeT = 0;
    var vAT_TaxVal = parseFloat(this.userG.orgVAT??0);
    debugger
    this.ContractEditServices.forEach((element: any) => {
      var Value = parseFloat((element.Amounttxt??0).toString()).toFixed(2);
      var FVal = +Value * element.QtyConst;
      var FValIncludeT = FVal;
      var taxAmount = 0;
      var totalwithtax = 0;
      var TaxV8erS = parseFloat((+parseFloat((+Value * vAT_TaxVal).toString()).toFixed(2) / 100).toString()).toFixed(2);
      var TaxVS =parseFloat((+Value- +parseFloat((+Value/((vAT_TaxVal / 100) + 1)).toString()).toFixed(2)).toString()).toFixed(2);
      if (this.modalDetailsContractEdit.taxtype == 2) {
          taxAmount = +TaxV8erS * element.QtyConst;
          totalwithtax = +parseFloat((+parseFloat(Value) + +parseFloat(TaxV8erS)).toString()).toFixed(2);
      }
      else {
          taxAmount=+TaxVS * element.QtyConst;
          FValIncludeT = +parseFloat((+parseFloat(Value).toFixed(2) - +TaxVS).toString()).toFixed(2);
          totalwithtax = +parseFloat(Value).toFixed(2);
      }
      this.ContractEditServices.filter((a: { idRow: any; })=>a.idRow==element.idRow)[0].taxAmounttxt= parseFloat(taxAmount.toString()).toFixed(2);
      this.ContractEditServices.filter((a: { idRow: any; })=>a.idRow==element.idRow)[0].TotalAmounttxt= parseFloat((totalwithtax * element.QtyConst).toString()).toFixed(2);

      totalwithtaxes += totalwithtax;
      totalAmount +=(FVal) ;
      totalAmountIncludeT += (totalwithtax);
      totaltax += taxAmount;
    });
    this.CalcSumTotal_ContractEdit();
    //this.CalcOfferDet(1);
  }


  CalcSumTotal_ContractEdit(){
    debugger
    let sum=0;
    let sumtax=0;
    this.ContractEditServices.forEach((element: any) => {
      sum= +sum + +parseFloat((element.TotalAmounttxt??0)).toFixed(2);
      sumtax= +sumtax + +parseFloat((element.taxAmounttxt??0)).toFixed(2);   
    });
    this.modalDetailsContractEdit.total_amount=parseFloat(sum.toString()).toFixed(2);
    this.modalDetailsContractEdit.ContractTax=parseFloat(sumtax.toString()).toFixed(2);
    this.ConvertNumToString_Contract(this.modalDetailsContractEdit.total_amount);
  }
  ConvertNumToString_Contract(val:any){
    this._contractService.ConvertNumToString(val).subscribe(data=>{
      this.modalDetailsContractEdit.total_amount_text=data?.reasonPhrase;
    });
  }
  applyFilterServiceList_ContractEdit(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.serviceListDataSource_ContractEdit.filter = filterValue.trim().toLowerCase();
  }

  serviceListDataSourceTemp_ContractEdit:any=[];
  servicesList_ContractEdit: any;
  serviceListDataSource_ContractEdit = new MatTableDataSource();

  GetAllServicesPrice_ContractEdit(){
    this._contractService.GetAllServicesPrice().subscribe(data=>{
        this.serviceListDataSource_ContractEdit = new MatTableDataSource(data.result);
        this.servicesList_ContractEdit=data.result;
        this.serviceListDataSourceTemp_ContractEdit=data.result;
    });
  }

  // GetServicesPriceByParentId(element:any){
  //   debugger
  //   this.serviceDetails=[];
  //   if(element.AccJournalid!=null)
  //   {
  //     // this._contractService.GetServicesPriceVouByParentId(element.AccJournalid,element.offerId).subscribe(data=>{
  //     //   this.serviceDetails = data.result;
  //     // });
  //     this._contractService.GetServicesPriceByParentId(element.AccJournalid).subscribe(data=>{
  //       this.serviceDetails = data.result;
  //     });
  //   }
  // }
  OfferPopupAddorEdit:any=1;//edit offerprice
  ListDataServices:any=[];
  GetServicesPriceByParentId(element:any){
    debugger
    this.serviceDetails=[];
    if(element.AccJournalid!=null)
    {
      this._contractService.GetServicesPriceVouByParentIdAndContract(element.AccJournalid,this.ContractRowSelected.contractId).subscribe(data=>{
        this.serviceDetails = data.result;
        var Check=true;
        if(this.ListDataServices.length>0)
        {
          for (let ele of this.ListDataServices) {
            var val = ele.filter((a: { parentId: any; })=>a.parentId==element.AccJournalid);
            if(val.length==0){Check=false;}
            else{Check=true;break;}
         }
        }
        else{Check=false;}

        if(Check==false){
          this.ListDataServices.push(this.serviceDetails);
        }
        this.serviceDetails.sort((a: { lineNumber: number; },b: { lineNumber: number; }) => (a.lineNumber??0) - (b.lineNumber??0)); // b - a for reverse sort
      });
    }
  }

  SureServiceList:any=[];
  MarkServiceDetails(item:any){
    if(item?.SureService==1) item.SureService=0;
    else item.SureService=1;
    this.SureServiceList.push(item);
  }
  UnMarkServiceDetails(item:any){
    if(item?.SureService==1) item.SureService=0;
    else item.SureService=1;
    if(this.SureServiceList.length>0)
    {
      let index = this.SureServiceList.findIndex((d: { servicesId: any; }) => d.servicesId == item.servicesId);
      if(index!=-1)
      {
        this.SureServiceList.splice(index, 1);
      }
    }
  }
  RemoveServicesparent(ele:any){
    {
      debugger
      var TempService=this.ListDataServices;
      this.ListDataServices=[];
      let newArray = this.SureServiceList.filter((d: { parentId: any; }) => d.parentId != ele.AccJournalid);
      TempService.forEach((element: any) => {
        let newArray2 = element.filter((d: { parentId: any; }) => d.parentId != ele.AccJournalid);
        if(newArray2.length>0)
        {
          this.ListDataServices.push(newArray2);
        }
      });
      this.SureServiceList=newArray;
    }
  }
  SetDetailsCheck(item:any){
    item.forEach((element: any) => {
      let filteritem = this.SureServiceList.filter((d: { servicesId: any; }) => d.servicesId == element.servicesId);
      if(filteritem.length>0)
      {
        element.SureService=1;
      }
    });
  }

  editContract(data:any) {
    this.resetmodalDetailsContractEdit();
    this.GetOfferservicenByidContractEdit(data.contractId);
  }

  EditContractValue(modal:any)
  {
    debugger
    if(this.ContractEditServices.length==0)
    {
      this.toast.error(this.translate.instant("لا يمكنك الحفظ بدون خدمة"),this.translate.instant("Message"));
      return;
    }

    var input = { valid: true, message: "" };
    var ContractEditobj:any = {};
    ContractEditobj.ContractId=this.ContractRowSelected.contractId;
    //ContractEditobj.Value=this.modalDetailsContractEdit.total_amount;
    ContractEditobj.Value =+parseFloat(this.modalDetailsContractEdit.total_amount.toString()).toFixed(2)- +parseFloat(this.modalDetailsContractEdit.ContractTax.toString()).toFixed(2);
    ContractEditobj.ValueText=this.modalDetailsContractEdit.total_amount_text;
    ContractEditobj.TaxType=this.modalDetailsContractEdit.taxtype;
    ContractEditobj.TotalValue=this.modalDetailsContractEdit.total_amount;
    var ServicesDetailsList:any = [];
    var input = { valid: true, message: "" }

    this.ContractEditServices.forEach((element: any) => {

      if (element.AccJournalid==null) {
        input.valid = false; input.message = "من فضلك أختر خدمة صحيحة";return;
      }
      if (element.Amounttxt == null) {
        input.valid = false; input.message = "من فضلك أختر مبلغ صحيح";return;
      }
      if (element.QtyConst == null) {
        input.valid = false; input.message = "من فضلك أختر كمية صحيحة";return;
      }

      var Contractserviceobj:any  = {};
      Contractserviceobj.ServiceId = element.AccJournalid;
      Contractserviceobj.ServiceQty = element.QtyConst;
      Contractserviceobj.TaxType =this.modalDetailsContractEdit.taxtype;
      Contractserviceobj.Serviceamountval = element.Amounttxt;
      Contractserviceobj.LineNumber = element.idRow;


      ServicesDetailsList.push(Contractserviceobj);
    });

    if (!input.valid) {
      this.toast.error(input.message);return;
    }

    debugger
    var DetailsList:any = [];
    var counter = 0;
    this.ListDataServices.forEach((elementService: any) => {
      elementService.forEach((element: any) => {
        var Detailsobj:any = {};
        counter++;
        //element.servicesIdVou??0
        Detailsobj.ServicesIdVou = 0;
        Detailsobj.ServicesId  = element.servicesId;
        Detailsobj.ParentId  = element.parentId;
        Detailsobj.SureService  = 1;
        Detailsobj.LineNumber  = counter;
        DetailsList.push(Detailsobj);
      });
    });
    ContractEditobj.ServicesPriceOffer = DetailsList;

    ContractEditobj.ContractServices=ServicesDetailsList;
    debugger
    this._contractService.EditContractService(ContractEditobj).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.ShowAllContracts();
        modal?.dismiss()
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }
//--------------------------------------End EditContract------------------------------------------

//-------------------------------------PaymentsDetails--------------------------------------------

paymentsDetails:any={
  ContractId:null,
  ContractVNon:null,
  clientNameVTxt:null,
  clientNameVTxtID:null,
  ServiceCount:null,
  CustomerPayments:[],
  ProjectNo:null,
  ProjectId:null,
  ContractAmount_V:null,
  PaidAmount:0,
  RemainingAmount:0,
  contractTaxType:null,
  TaxLbl:null,
  projectDate:null,
  projectExpireDate:null,
  percentage:null,
  paymentsSum:null,
}
resetpaymentsDetails(){
  this.paymentsDetails={
    ContractId:null,
    ContractVNon:null,
    clientNameVTxt:null,
    clientNameVTxtID:null,
    ServiceCount:null,
    CustomerPayments:[],
    ProjectNo:null,
    ProjectId:null,
    ContractAmount_V:null,
    PaidAmount:0,
    RemainingAmount:0,
    contractTaxType:null,
    TaxLbl:null,
    projectDate:null,
    projectExpireDate:null,
    percentage:null,
    paymentsSum:null,
  }
}
getPaymentsDetails(){
this.resetpaymentsDetails();
this.paymentsDetails={
  ContractId:this.ContractRowSelected.contractId,
  ContractNo:this.ContractRowSelected.contractNo,
  CustomerName:this.ContractRowSelected.customerName,
  CustomerId:this.ContractRowSelected.customerId,
  ServiceCount:this.ContractRowSelected.totalServiceCount,
  CustomerPayments:[],
  ProjectName:this.ContractRowSelected.projectName,
  ProjectNo:this.ContractRowSelected.projectNo,
  ProjectId:this.ContractRowSelected.projectId,
  ContractAmount_V:this.ContractRowSelected.totalValue,
  //PaidAmount:this.ContractRowSelected.amount,
  contractTaxType:this.ContractRowSelected.taxType,
}
if(this.ContractRowSelected.taxType==2)
{
  this.paymentsDetails.TaxLbl="غير شامل الضريبة";
}
else
{
  this.paymentsDetails.TaxLbl="شامل الضريبة";
}
this.getproprogresspw();
this.GetAllCustomerPayments();
}

GetAllCustomerPayments(){
  var ContractId=this.paymentsDetails.ContractId;
  if(ContractId!=null)
  {
    var TotalAmount=0; var PaidVlue=0;
    this._contractService.GetAllCustomerPayments(ContractId).subscribe(data=>{
      this.paymentsDetails.CustomerPayments=data.result;
      debugger
      data.result.forEach((element: any) => {
        if(element.isCanceled!=true)
        {
          TotalAmount=TotalAmount+element.totalAmount;

          if(element.isPaid!=false)
          {
            PaidVlue=PaidVlue+element.totalAmount;
          }
        }

      });
      this.paymentsDetails.PaidAmount=PaidVlue;
      this.paymentsDetails.RemainingAmount=TotalAmount-PaidVlue;
      this.paymentsDetails.paymentsSum=TotalAmount;
    });
  }
}
getproprogresspw(){
  var ProSelectId=this.paymentsDetails.ProjectId;
  if(ProSelectId!=null)
  {
    this._contractService.GetProjectById(ProSelectId).subscribe(data=>{
      debugger
      this.paymentsDetails.projectDate=data.result.projectDate;
      this.paymentsDetails.projectExpireDate=data.result.projectExpireDate;
      this.paymentsDetails.timeStr=data.result.timeStr;
      this.paymentsDetails.noOfDays=data.result.noOfDays;
      this.paymentsDetails.percentage=this.SetPerRunningTasks(data.result);
    });
  }
}

SetPerRunningTasks(dataObj:any){
  var date1 = new Date(dataObj.projectExpireDate);
  var date2 = new Date();
  var date3 = new Date(dataObj.projectDate);
  var Difference_In_Time = date2.getTime() - date3.getTime();
  var Difference_In_Time2 = date1.getTime() - date3.getTime();
  var Difference_In_Days = parseInt((Difference_In_Time / (1000 * 3600 * 24)).toString());
  var Difference_In_Days2 = parseInt((Difference_In_Time2 / (1000 * 3600 * 24)).toString());
  var perc = (Difference_In_Days / Difference_In_Days2);
  var percentage = parseInt((perc * 100).toString());
  return percentage;
}

//-----------------------------------End payments-------------------------------------------------

//-----------------------------------------End Table Btn------------------------------------------


//--------------------------------------AddDof3aa---------------------------------------------
PaymentObj:any={
  PaymentId:0,
  PaymentNotxt:null,
  PaymentDatetxt:null,
  PaymentDateHijritxt:null,
  PayAmounttxt:null,
  TotalPayTaxTxt:null,
  TotalPayAmountTxt:null,
  TextPayAmountTxt:null,
  ServicesOptionSelect:[],
  ServicesValue:null,
  ContractValueSumCheck:null,
}

resetPaymentObj(){
  this.PaymentObj={
    PaymentId:0,
    PaymentNotxt:null,
    PaymentDatetxt:null,
    PaymentDateHijritxt:null,
    PayAmounttxt:null,
    TotalPayTaxTxt:null,
    TotalPayAmountTxt:null,
    TextPayAmountTxt:null,
    ServicesOptionSelect:[],
    ServicesValue:null,
    ContractValueSumCheck:null,
  }
}
AddPayment(){
  debugger
  this.resetPaymentObj();
  this.PaymentObj.ContractValueSumCheck=this.paymentsDetails.ContractAmount_V;
  this.GenerateCustPaymentNumber();
  this.FillAllContractserviceByConId();
}
disableButtonSave_Payment = false;

saveNewPaymentbtn() {
  debugger
  if(this.PaymentObj.PaymentNotxt==null || this.PaymentObj.PaymentDatetxt==null ||
    this.PaymentObj.PayAmounttxt==null || this.PaymentObj.TotalPayTaxTxt==null ||
    this.PaymentObj.TotalPayAmountTxt==null)
  {
    this.toast.error(this.translate.instant( "من فضلك أكمل البيانات"),this.translate.instant("Message"));
    return;
  }
  if(+(this.PaymentObj.ContractValueSumCheck- +this.paymentsDetails.paymentsSum) < +this.PaymentObj.TotalPayAmountTxt)
  {
    this.toast.error(this.translate.instant( "لقد تخطيت قيمة العقد"),this.translate.instant("Message"));
    return;
  }
  var PayObj:any  = {};
  PayObj.PaymentId = this.PaymentObj.PaymentId;
  PayObj.ContractId = this.paymentsDetails.ContractId;
  PayObj.PaymentNo = this.PaymentObj.PaymentNotxt;
  //PayObj.PaymentDate = this.PaymentObj.PaymentDatetxt;

  if(this.PaymentObj.PaymentDatetxt!=null)
  {
    PayObj.PaymentDate =this._sharedService.date_TO_String(this.PaymentObj.PaymentDatetxt);
    const nowHijri =toHijri(this.PaymentObj.PaymentDatetxt);
    PayObj.PaymentDateHijri= this._sharedService.hijri_TO_String(nowHijri);
  }

  //PaymentObj.PaymentDateHijri =this.PaymentObj.PaymentDateHijritxt;
  PayObj.Amount = this.PaymentObj.PayAmounttxt;
  PayObj.TaxAmount = this.PaymentObj.TotalPayTaxTxt;
  PayObj.TotalAmount = this.PaymentObj.TotalPayAmountTxt;
  PayObj.ServiceId = this.PaymentObj.ServicesValue;


  this.disableButtonSave_Payment = true;
  setTimeout(() => {
    this.disableButtonSave_Payment = false;
  }, 7000);

  this._contractService.SaveCustomerPayment(PayObj).subscribe((result: any)=>{
    if(result.statusCode==200){
      this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
      this.GetAllCustomerPayments();
      //this.ShowAllContracts();
      this.InvoiceModelPublic?.dismiss();
    }
    else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"))};
  });
}
ChangePayGre(event:any){
  if(event!=null)
  {
    const DateHijri =toHijri(this.PaymentObj.PaymentDatetxt);
    var DateGre = new HijriDate(DateHijri._year, DateHijri._month, DateHijri._date);
    DateGre._day=DateGre._date;
    this.PaymentObj.PaymentDateHijritxt=DateGre;
  }
  else{
    this.PaymentObj.PaymentDateHijritxt=null;
  }
}

GenerateCustPaymentNumber(){
  this._contractService.GenerateCustPaymentNumber(this.paymentsDetails.ContractId).subscribe(data=>{
    this.PaymentObj.PaymentNotxt=data.reasonPhrase;
  });
}
ChangePayDateHijri(event:any){
  if(event!=null)
  {
    const DateGre = new HijriDate(event.year, event.month, event.day);
    const dayGreg = DateGre.toGregorian();
    this.PaymentObj.PaymentDatetxt=dayGreg;
  }
  else{
    this.PaymentObj.PaymentDatetxt=null;
  }
}

FillAllContractserviceByConId(){
  debugger
  var ContractId=this.ContractRowSelected.contractId;
  if(ContractId!=null)
  {
    this._contractService.FillAllContractserviceByConId(ContractId).subscribe(data=>{
      this.PaymentObj.ServicesOptionSelect=data;
    });
  }
  else
  {
    this.PaymentObj.ServicesOptionSelect=[];
  }
}

EditPayment(){
  this.resetPaymentObj();
debugger
  this.PaymentObj={
    PaymentId:this.PublicPaymentRow.paymentId,
    PaymentNotxt:this.PublicPaymentRow.paymentNo,
    PayAmounttxt:this.PublicPaymentRow.amount,
    TotalPayTaxTxt:this.PublicPaymentRow.taxAmount,
    TotalPayAmountTxt:this.PublicPaymentRow.totalAmount,
    TextPayAmountTxt:this.PublicPaymentRow.amountValueText,
    ServicesValue:this.PublicPaymentRow.serviceId,
    ContractValueSumCheck:null,
  }
  debugger
  if(this.PaymentObj.ServicesValue==0)this.PaymentObj.ServicesValue=null;

  this.PaymentObj.ContractValueSumCheck = (+this.paymentsDetails.ContractAmount_V) + (+this.PublicPaymentRow.totalAmount);

  if(this.PublicPaymentRow.paymentDate!=null)
  {
    this.PaymentObj.PaymentDatetxt =this._sharedService.String_TO_date(this.PublicPaymentRow.paymentDate);
    const DateHijri =toHijri(this.PaymentObj.PaymentDatetxt);
    var DateGre = new HijriDate(DateHijri._year, DateHijri._month, DateHijri._date);
    DateGre._day=DateGre._date;
    this.PaymentObj.PaymentDateHijritxt=DateGre;
  }
  else{
    this.PaymentObj.PaymentDatetxt= null;
    this.PaymentObj.PaymentDateHijri= null;
  }
  this.ConvertNumToString_Payment(this.PaymentObj.TotalPayAmountTxt);
  this.FillAllContractserviceByConId();
}
PayAmounttxtChange(event:any){
  var val=event.target.value??0;var vAT_TaxVal = parseFloat(this.userG.orgVAT??0);
  if(this.paymentsDetails.contractTaxType == 3)
  {
    var taxAmount = val - (val / ((vAT_TaxVal / 100) + 1));
    this.PaymentObj.TotalPayTaxTxt=parseFloat(taxAmount.toString()).toFixed(2);
    this.PaymentObj.TotalPayAmountTxt=parseFloat(val).toFixed(2);
  }
  else{
    var taxAmount = val * (vAT_TaxVal / 100);
    this.PaymentObj.TotalPayTaxTxt=parseFloat(taxAmount.toString()).toFixed(2);
    this.PaymentObj.TotalPayAmountTxt=+parseFloat(val).toFixed(2) + +parseFloat(taxAmount.toString()).toFixed(2);
  }
  this.ConvertNumToString_Payment(this.PaymentObj.TotalPayAmountTxt);
}
ConvertNumToString_Payment(val:any){
  if(val!=null)
  {
    this._contractService.ConvertNumToString(val).subscribe(data=>{
      this.PaymentObj.TextPayAmountTxt=data?.reasonPhrase;
    });
  }
  else{
    this.PaymentObj.TextPayAmountTxt=null;
  }
}
PublicPaymentRow:any;
confirmDeleteCustomerPayment(){
  this._contractService.DeleteCustomerPayment(this.PublicPaymentRow.paymentId).subscribe((result: any)=>{
    if(result.statusCode==200){
      this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
      this.GetAllCustomerPayments();
      //this.ShowAllContracts();
    }
    else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
  });
}

printDiv(id: any) {
  this.print.print(id, environment.printConfig);
}
InvPrintData:any=null;
CustomData:any={
  AccualValue:null,
  Diff:null,
  Total:null,
  netVal:null,
  DiscPer:"0",
  TotalAfterDisc:null,
  Account1Img:null,
  Account2Img:null,
  Account1Bank:null,
  Account2Bank:null,
  OrgImg:null,
  PrintType:null,
  PrintTypeName:null,
  headerurl: null,
  footerurl: null,
  ContractNo:null,
}
resetCustomData(){
  this.InvPrintData=null;
  this.CustomData={
    AccualValue:null,
    Diff:null,
    Total:null,
    netVal:null,
    Disc:null,
    DiscPer:"0",
    TotalAfterDisc:null,
    Account1Img:null,
    Account2Img:null,
    Account1Bank:null,
    Account2Bank:null,
    OrgImg:null,
    PrintType:null,
    PrintTypeName:null,
    headerurl: null,
    footerurl: null,
    ContractNo:null,
  }
}
GetInvoicePrint(obj:any,TempCheck:any){
  this.resetCustomData();
  this._printreportsService.ChangeInvoice_PDF(obj.invoiceId,TempCheck).subscribe(data=>{
    this.InvPrintData=data;
    if(this.InvPrintData?.invoicesVM_VD?.contractNo==null || this.InvPrintData?.invoicesVM_VD?.contractNo=="")
    {
      this.CustomData.ContractNo="بدون";
    }
    else
    {
      this.CustomData.ContractNo=this.InvPrintData?.invoicesVM_VD?.contractNo;
    }
    this.CustomData.PrintType=TempCheck;
    if(TempCheck==29)this.CustomData.PrintTypeName='اشعار دائن';
    else if(TempCheck==30)this.CustomData.PrintTypeName='اشعار مدين';
    else this.CustomData.PrintType='';


    var TotalInvWithoutDisc=0;
    var netVal = 0;
    var DiscountValue_Det_Total_withqty=0;
    if(this.InvPrintData?.voucherDetailsVM_VD[0]?.taxType==3)
    {
      netVal = this.InvPrintData?.invoicesVM_VD?.totalValue;
      TotalInvWithoutDisc = this.InvPrintData?.invoicesVM_VD?.totalValue;
    }
    else
    {
      netVal = this.InvPrintData?.invoicesVM_VD?.invoiceValue;
      TotalInvWithoutDisc = this.InvPrintData?.invoicesVM_VD?.invoiceValue;
    }
    this.InvPrintData?.voucherDetailsVM_VD?.forEach((element: any) => {
      DiscountValue_Det_Total_withqty = DiscountValue_Det_Total_withqty + (element.discountValue_Det) ?? 0;
    });

    this.CustomData.DiscPer=parseFloat(((DiscountValue_Det_Total_withqty * 100) / ((TotalInvWithoutDisc + DiscountValue_Det_Total_withqty))).toString()).toFixed(2);
    this.CustomData.Disc=DiscountValue_Det_Total_withqty;
    this.CustomData.Total=TotalInvWithoutDisc+DiscountValue_Det_Total_withqty;
    this.CustomData.netVal=netVal;
    this.CustomData.TotalAfterDisc=TotalInvWithoutDisc;

    if (this.InvPrintData?.invoicesVM_VD.printBankAccount != true)
    {
      this.CustomData.Account1Bank = this.InvPrintData?.orgIsRequired_VD == true ? this.InvPrintData?.org_VD.accountBank : this.InvPrintData?.branch_VD.accountBank;
      this.CustomData.Account2Bank = this.InvPrintData?.orgIsRequired_VD == true ? this.InvPrintData?.org_VD.accountBank2 : this.InvPrintData?.branch_VD.accountBank2;
      this.CustomData.Account1Img = this.InvPrintData?.orgIsRequired_VD == true ? this.InvPrintData?.org_VD.bankIdImgURL : this.InvPrintData?.branch_VD.bankIdImgURL;
      this.CustomData.Account2Img = this.InvPrintData?.orgIsRequired_VD == true ? this.InvPrintData?.org_VD.bankId2ImgURL : this.InvPrintData?.branch_VD.bankId2ImgURL;
    }
    else
    {
      this.CustomData.Account1Bank=null;
      this.CustomData.Account2Bank=null;
      this.CustomData.Account1Img=null;
      this.CustomData.Account2Img=null;
    }
    debugger
    if(this.CustomData.Account1Img)
    this.CustomData.Account1Img=environment.PhotoURL+this.CustomData.Account1Img;
    else this.CustomData.Account1Img=null;

    if(this.CustomData.Account2Img)
    this.CustomData.Account2Img=environment.PhotoURL+this.CustomData.Account2Img;
    else this.CustomData.Account2Img=null;

    debugger
    if (this.InvPrintData?.branch_VD.isPrintInvoice == true && this.InvPrintData?.branch_VD.branchLogoUrl!="" && this.InvPrintData?.branch_VD.branchLogoUrl!=null)
    {
      this.CustomData.OrgImg=environment.PhotoURL+this.InvPrintData?.branch_VD.branchLogoUrl;
    }
    else{
      if(this.InvPrintData?.org_VD.logoUrl)
      this.CustomData.OrgImg=environment.PhotoURL+this.InvPrintData?.org_VD.logoUrl;
      else this.CustomData.OrgImg=null;
    }
    if (this.InvPrintData?.branch_VD.headerPrintInvoice == true && this.InvPrintData?.branch_VD.headerLogoUrl!="" && this.InvPrintData?.branch_VD.headerLogoUrl!=null)
    {
      this.CustomData.headerurl=environment.PhotoURL+this.InvPrintData?.branch_VD.headerLogoUrl;
    }
    else{
      this.CustomData.headerurl=null;
    }

    if (this.InvPrintData?.branch_VD.headerPrintInvoice == true && this.InvPrintData?.branch_VD.footerLogoUrl!="" && this.InvPrintData?.branch_VD.footerLogoUrl!=null)
    {
      this.CustomData.footerurl=environment.PhotoURL+this.InvPrintData?.branch_VD.footerLogoUrl;
    }
    else{
      this.CustomData.footerurl=null;
    }
  });
}
  GetAccualValue(item:any){
    var AccualValue = 0;
    if (item.taxType == 3)
    {
      AccualValue = (((item.totalAmount ?? 0) + (item.discountValue_Det ?? 0)) / (item.qty ?? 1));
    }
    else
    {
      AccualValue = (((item.amount ?? 0) + (item.discountValue_Det ?? 0)) / (item.qty ?? 1));
    }
    return AccualValue;
  }
  GetDiff(item:any){
    var Diff = "0";
    Diff = parseFloat((item?.totalAmount - item?.taxAmount).toString()).toFixed(2);
    return Diff;
  }

  PrintVoucher(obj:any){
    this._printreportsService.PrintVoucher(obj.invoiceId,4).subscribe(data=>{
      var PDFPath=environment.PhotoURL+data.reasonPhrase;
      printJS({printable:PDFPath, type:'pdf', showModal:true});
    });
  }
//-------------------------------------EndDof3aa----------------------------------------------

  offerPriceChecked: any;

  offerServices: any = [];

  servicesListdisplayedColumns: string[] = ['name', 'price'];

  selectedServiceRow: any;

  serviceDetails: any=[];

  bands: any = [];
  participants: any = [];

  selectedDate: any;
  selectedDateType = DateType.Hijri;

  addProjectType = false;

  contractWithInstallments = false;

  installments: any = [
    {
      batchNumber: 'asdasd',
      BatchDate: 'asdasd',
      BatchDateHijri: 'asdasd',
      amount: 'asdasd',
      Tax: 'asdasd',
      total: 'asdasd',
    },
  ];
  ContractPopupAddorEdit:any=0;//add Contract
  InvoiceCount:any=false;
  InvoiceModelPublic:any;

  open(content: any, data?: any, type?: any, idRow?: any,model?:any) {
    if(data!=null && type!="serviceDetails" && type!="Drafts" && type!="addInvoiceProject" && type!="EditPaymentModal" && type!="deletePaymentModal")
    {
      this.ContractRowSelected=data;
    }

    if(data!=null && type=="Drafts")
    {
      this.PublicDraftRow=data;
    }

    if(type=="PaymentsDetails")
    {
      this.getPaymentsDetails();
    }
    if(type=="EditPaymentModal")
    {
      this.PublicPaymentRow=data;
      this.EditPayment();
    }
    if(type=="deletePaymentModal")
    {
      this.PublicPaymentRow=data;
    }
    if(type=="draftFormsModal")
    {
      this.draftModals();
    }

    if (idRow != null) {
      this.selectedServiceRowContractEdit = idRow;
    }
    if (data && (type == 'ContractValueEdit')) {
      this.ListDataServices=[];
      this.SureServiceList=[];
      this.editContract(data);
      this.ContractPopupAddorEdit=1;
    }
    if(type=="uploadcontract")
    {
      this.publictypeOfupload=1;
    }
    if(type=="uploadfile")
    {
      this.publictypeOfupload=2;
    }
    // if(type=="addInvoice")
    // {
    //   this.invoicepop=3;
    //   this.InvoicePopup(2);
    // }
    if(type=="addInvoiceProject")
    {
      //this.modalInvoice.taxtype=this.paymentsDetails.contractTaxType;
      this.invoicepop=2;
      this.ListDataServices_Invoice=[];
      this.SureServiceList_Invoice=[];
      this.OfferPopupAddorEdit_Invoice=0;
      this.InvoicePopup(2);
      this.PublicPaymentRow=data;
      if(data.serviceId>0){
        this.InvoiceCount=false;
        this.GetServicesPriceByServiceIdForProject(data);
      }
      else
      {
        debugger
        if(this.paymentsDetails?.ServiceCount==1)
        {
          this.GetServicesPriceByServiceIdByContract(this.paymentsDetails?.ContractId,data);
          this.InvoiceCount=false;
        }
        else
        {
          this.InvoiceCount=true;
        }
      }
    }
    if (idRow != null) {
      this.selectedServiceRow = idRow;
    }

    if (type == 'NewProjectType') {
      this.GetAllProjectType();
    }
    if (type == 'deleteProjectTypeModal') {
      this.pTypeId = data.typeId;
    }

    if (type == 'SubprojectTypeModal') {
      if (this.SerivceModalForm.controls['ProjectType'].value == null) {
        this.toast.error('من فضلك أختر نوع المشروع',this.translate.instant("Message"));
        return;
      }
      this.GetAllProjectSubsByProjectTypeId();
    }
    if (type == 'deleteSubprojectTypeModal') {
      this.psubTypeId = data.subTypeId;
    }

    if (type == 'PackagesModal') {
      this.GetAllPackages();
    }
    if (type == 'deletePackagesModal') {
      this.PackageIdD = data.packageId;
    }

    if (type == 'costCenterModal') {
      this.servicesId = 0;
      this.accountName = null;
      this.servicesName = null;
      this.GetAllcostCenter();
    }
    if (type == 'deletecostCenterModal') {
      this.ServicesPriceIdindex = idRow;
      this.ServicesPriceId = data.servicesId;
    }
    if (type == 'servicesList') {
      //this.GetAllCategory();
      this.GetAllServicesPrice();
    }
    if (type == 'addSerivceModal') {
      this.details = [];
      this.AllcostCenterlist = [];
      this.SubprojecttypeList = [];
      this.intialModelBranchOrganization();
      this.FillStorehouseSelect();
      this.FillServiceTypesSelect();
      this.FillServiceAccount();
      this.FillServiceAccountPurchase();
      this.FillCostCenterSelect_Service();
      //this.FillProjectTypeSelectService();
      this.FillPackagesSelect();
    }

    if (type == 'serviceDetails' && data) {
      this.GetServicesPriceByParentId(data);
    }

    else if(type=="servicesList_Contract")
    {
      this.GetAllServicesPrice_ContractEdit();
    }
    if(type=='SaveInvoiceConfirmModal' || type=='SavePaymentConfirmModal')
    {
      this.InvoiceModelPublic=model;
    }
    if (type == 'serviceDetails_Invoice' && data) {
      this.GetServicesPriceByParentId_Invoice(data);
    }
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
    this.addProjectType = false;
    this.contractWithInstallments = false;
    this.participants = [];
    this.installments = [];
    this.bands = [];
    this.offerServices = [];
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



  setSelectedUserPermissions(index: any) {
    // when click on row display data in row
    let data = this.userPermissions[index];
    this.selectedUserPermissions = data;
  }

  saveOption(data: any) {}

  // updateFilter(event: any) {
  //   const val = event.target.value.toLowerCase();

  //   const temp = this.temp.filter(function (d: any) {
  //     return d.name_ar.toLowerCase().indexOf(val) !== -1 || !val;
  //   });

  //   if (this.table) {
  //     this.table!.offset = 0;
  //   }
  // }

  selectGoalForProject(index: any) {}

  onSort(event: any) {
  }
  // ############### send sms

  data: any = {
    type: '0',
    orgEmail: 'asdwd@dwa',
    numbers: {
      all: 0,
      citizens: 0,
      investor: 0,
      government: 0,
    },
    fileType: {
      NameAr: '',
      Id: '',
      NameEn: '',
    },
    files: [],
    clients: [],
    branches: [],
    cities: [],
    filesTypes: [],
  };
  modal?: BsModalRef;
  sendEMAIL(sms: any) {
    console.log(sms);
    this.control.clear();
    this.modal?.hide();
  }

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
  public uploadedFiles: Array<File> = [];

  sendSMS(sms: any) {
    console.log(sms);
    this.modal?.hide();
  }

  // selection in table

  selection = new SelectionModel<any>(true, []);
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.ContractsDataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.ContractsDataSource.data);
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

  existValue: any = false;

  // ###### contract

  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );

  selectedItem: any;
  // +++++++++

  stage: any = [];

  addStage(index: any) {
    this.stage?.push({
      Massage: index + 1,
      stage: '',
      description: '',
      BeginningPeriod: '',
      periodEnd: '',
    });
  }

  deleteEmployee(index: any) {
    this.stage?.splice(index, 1);
  }

  remeberOptions = [
    { ar: 'يومين', en: '2 days' },
    { ar: 'اسبوع', en: 'week' },
    { ar: 'شهر', en: 'month' },
  ];
  // 3 contracts

  FormGroup01 = this._formBuilder.group({
    contractNo: [''],
    // contractNo: ['', Validators.required],
    date: [''],
    dateHijri: [''],
    office: [''],
    represents: [''],
    as: [''],
    engineeringLicence: [''],
    IssuedOn: [''],
    customer: [''],
    project: [''],
    iDNumber: [''],
  });
  FormGroup02 = this._formBuilder.group({
    invoiceRegistered: [''],
    include_tax: [''],
    total_amount: [''],
    total_amount_text: [''],
  });

  FormGroup03 = this._formBuilder.group({
    DateLetter: [''],
    serviceDate: [''],
  });

  FormGroup04 = this._formBuilder.group({
    ProjectName: [''],
    // ProjectName: ['', Validators.required],
    projectLocation: [''],
    BriefNatureProject: [''],
    DurationContract: [''],
    ContractorName: [''],
    ContractDate: [''],
    maxCompensation: [''],
    periodCommitment: [''],
    consultantRepresent: [''],
    RepresentOwner: [''],
  });

  FormGroup07 = this._formBuilder.group({
    totalFees: [''],
  });

  ////
  firstFormGroup = this._formBuilder.group({
    contractNo: ['', Validators.required],
    date: [''],
    dateHijri: [''],
    office: [''],
    represents: [''],
    as: [''],
    customer: [''],
    project: [''],
    iDNumber: [''],
    check: [''],
    offerPrice: [''],
  });
  secondFormGroup = this._formBuilder.group({
    include_tax: [''],
  });
  thredFormGroup = this._formBuilder.group({
    DateLetter: ['', Validators.required],
    serviceDate: ['', Validators.required],
  });

  setOfferPriceChecked(event: any) {
    this.offerPriceChecked = event.target.checked;
  }

  addService(index: any) {
    this.offerServices?.push({
      id: index + 1,
      name: '',
      unit: '',
      amount: 0,
      price: 0,
      vatTax: 0,
      taxes: 0,
    });
  }

  deleteService(index: any) {
    this.offerServices?.splice(index, 1);
  }

  addBand(index: any) {
    this.bands?.push({
      clauseId: index + 1,
      clause: '',
    });
  }

  deleteBand(index: any) {
    this.bands?.splice(index, 1);
  }

  addParticipant(index: any) {
    this.participants?.push({
      id: index + 1,
      employeeName: '',
      duration: '',
      percentage: '',
      salary: '',
      cost: '',
    });
  }

  deleteParticipant(index: any) {
    this.participants?.splice(index, 1);
  }

  addInstallments(data: any) {}

  addContract() {}


  @ViewChild('DraftsContractModal') DraftsContractModal: any;

  EditDarftsOpen(stepper: MatStepper){
    this.open(this.DraftsContractModal, null, 'DraftsContractModal');
    stepper.selectedIndex = 4;
  }
  contractdraftdata:any;
  EditDarftsOpen2(data:any){
    this.DraftsListObj=[];
    this.showAll=false;
    this.contractdraftdata=data;
    this.GetAllDraftsDetailsbyProjectId(data.projectId);
    this.open(this.DraftsContractModal, data, 'DraftsContractModal');
  }
  DraftsList:any;
  myDrafts:any;
  DraftsListObj: any = [];
  CheckedValue=null;
  GetAllDraftsByProjectType(typeId:any)
  {

    this._contractService.GetAllDraftsbyProjectsType_2(typeId).subscribe(data=>{
      this.DraftsList=data.result;
      if(this.showAll==true)
      {
        this.DraftsListObj=this.DraftsList;
      }
      else
      {
        if(this.CheckedValue!=null)
        {
          this.DraftsListObj=this.DraftsList.filter((a: { draftId: any; })=>a.draftId==this.CheckedValue);
        }
      }
    });
  }
  PublicDraftRow:any;
  confirmDeleteDraft() {
    this._contractService.DeleteDraft(this.PublicDraftRow.draftId).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.GetAllDraftsByProjectType(this.ContractRowSelected.projectTypeId);
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"))};
    });
  }

  confirmDeleteDraft_template() {
    this._contractService.DeleteDraft_Templates(this.PublicDraftRow.draftId).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.GetAllDraftsByProjectType(this.ContractRowSelected.projectTypeId??'');
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"))};
    });
  }
  SaveDraftDetails(modal:any) {
    if(this.CheckedValue==null){
      this.toast.error(this.translate.instant("من فضلك أختر مسودة"),this.translate.instant("Message"));return;
    }
    let obj:any = {};
    obj.DraftId = this.CheckedValue;
    obj.ProjectId = this.ContractRowSelected.projectId;
    obj.IsDeleted = false;
    this._contractService.SaveDraftDetails(obj).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.ShowAllContracts();
        modal?.dismiss();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"))};
    });
  }



  GetAllDraftsDetailsbyProjectId(projectid:any){
    this._contractService.GetAllDraftsDetailsbyProjectId(projectid).subscribe(data=>{
      if(data.result.length>0){
        this.CheckedValue=data.result[0].draftId;
        this.GetAllDraftsByProjectType(this.ContractRowSelected.projectTypeId);
      }
      else{this.CheckedValue=null;}
    });
  }
  showAll=false;
  ShowAllDrafts(){
    debugger
    this.showAll=!this.showAll;
    // if(this.showAll==true)
    this.GetAllDraftsByProjectType(this.ContractRowSelected.projectTypeId ??'');
    // else this.GetAllDraftsDetailsbyProjectId(this.ContractRowSelected.projectId);
  }
  Connect_appendFile_Draft(data:any){
    debugger
    
    this._contractService.Connect_appendFile_Draft2(this.ContractRowSelected.contractId,data.draftId,data.draftUrl).subscribe((result: any)=>{
      if(result.statusCode==200){
          try
          {
            debugger
            var link=environment.PhotoURL+result.returnedStr;
            window.open(link, '_blank');
          }
          catch (error)
          {
            this.toast.error("تأكد من الملف", this.translate.instant("Message"));return;
          }
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));

      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"))};
    });
  }

  DownloadDraft(data:any){
    debugger
    this._contractService.DownloadFile_Draft(data.contractId).subscribe((result: any)=>{
      if(result.statusCode==200){
          try
          {
            debugger
            var link=environment.PhotoURL+result.returnedStr;
            window.open(link, '_blank');
          }
          catch (error)
          {
            this.toast.error("تأكد من الملف", this.translate.instant("Message"));return;
          }
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));

      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"))};
    });
  }

  draftModals()
  {
    this.resetDrafts_Template();
  }

  Drafts_Template:any={
    Draft_TemplateValueSelect:null,
    ProjectTypeValueSelect:null,
  }
  resetDrafts_Template(){
    this.control.clear();
    this.Drafts_Template.Draft_TemplateValueSelect=null;
    this.Drafts_Template.ProjectTypeValueSelect=null;
    this.FillAllDraft_Template();
    this.FillProjectTypeSelect();
  }
  LoadAllDraft_Template:any=[];
  FillAllDraft_Template(){
   this._contractService.FillAllDraft_Template().subscribe(data=>{
     this.LoadAllDraft_Template=data;
   });
  }
  ProjectTypeList_Template: any = []
  FillProjectTypeSelect() {
    this._projectService.FillProjectTypeSelect().subscribe(data => {
      this.ProjectTypeList_Template = data;
    });
  }
  UploadNewDraft(){
    if(this.control?.value.length>0){
      debugger
      var formData = new FormData();
      formData.append('postedFiles', this.control?.value[0]);
      formData.append('Name', this.control?.value[0].name);
      this._contractService.SaveDraft(formData).subscribe((result: any)=>{
        if(result.statusCode==200){
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
          this.resetDrafts_Template();
        }
        else{this.toast.error(result.reasonPhrase, this.translate.instant("Message"));}
      });
    }
    else
    {
      this.toast.error("من فضلك أرفع مسودة أولا", this.translate.instant("Message"));
    }
  }

  Connect_pro_draft(){
    if(this.Drafts_Template.Draft_TemplateValueSelect!=null && this.Drafts_Template.ProjectTypeValueSelect!=null){
      this._contractService.ConnectDraft_Templates_WithProject(this.Drafts_Template.Draft_TemplateValueSelect,this.Drafts_Template.ProjectTypeValueSelect).subscribe((result: any)=>{
        if(result.statusCode==200){
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
          this.resetDrafts_Template();
        }
        else{this.toast.error(result.reasonPhrase, this.translate.instant("Message"));}
      });
    }
    else
    {
      this.toast.error("من فضلك أكمل البيانات أولا", this.translate.instant("Message"));
    }
  }


  // GetTypeOfProjct(){
  //   this._contractService.GetTypeOfProjct(this.ContractRowSelected.projectId).subscribe(data=>{
  //     // this.ContractModalCustom.OrgEmpJobId=data.jobId;
  //     // this.FormGroup01.controls['OrgEmpJob'].setValue(data.jobNameAr);
  //   });
  // }

  //---------------------------------------Invoice---------------------------------------------
  //#region
  invoicepop=1;

  //Date-Hijri
  ChangeInvoiceGre(event:any){
    if(event!=null)
    {
      const DateHijri =toHijri(this.modalInvoice.Date);
      var DateGre = new HijriDate(DateHijri._year, DateHijri._month, DateHijri._date);
      DateGre._day=DateGre._date;
      this.modalInvoice.HijriDate=DateGre;
    }
    else{
      this.modalInvoice.HijriDate=null;
    }
  }
  ChangeInvoiceDateHijri(event:any){
    if(event!=null)
    {
      const DateGre = new HijriDate(event.year, event.month, event.day);
      const dayGreg = DateGre.toGregorian();
      this.modalInvoice.Date=dayGreg;
    }
    else{
      this.modalInvoice.Date=null;
    }
  }

  modalInvoice: any = {
    InvoiceId:0,
    InvoiceNumber: null,
    JournalNumber: null,
    InvoicePayType: null,
    Date: new Date(),
    HijriDate: null,
    Notes: null,
    InvoiceNotes: null,
    Type: 2,
    InvoiceValue: 0,
    TotalValue: 0,
    TaxAmount: 0,
    ToAccountId: null,
    ProjectId: null,
    PayType: 1,
    DiscountPercentage: 0,
    DiscountValue: 0,
    customerId: null,
    printBankAccount: false,
    InvoiceReference: null,
    PageInsert: 1,
    CostCenterId: null,
    VoucherAlarmDate: null,
    VoucherAlarmCheck: null,
    IsSendAlarm: null,
    AlarmVoucherInvDate:null,
    Currency:null,
    BranchSelect:null,
    OrganizationsMobile:null,
    OrganizationsAddress:null,
    Reference:null,
    popuptype:1, //(1) normal invoice - (2) invoice without project - (3) Creditnoti
    CreditNotiLbl:0,
    DepitNotiLbl:0,

    CustomerTax:null,
    CustomerAddress:null,
    Customeridtype:null,

    AllCustomerCheck:false,
    OfferPriceNoCheck:null,
    OfferPriceNo:null,

    descountmoney:null,
    descountpersentage:null,
    PaidValue:0,
    remainder:0,

    taxtype:this.paymentsDetails.contractTaxType??2,
    totalAmount:0,
    discounMoneytVal:0,
    total_:0,
    totalWithDiscount:0,
    taxAmountLbl:0,
    VoucherValue:0,
    TotalVoucherValueLbl:0,

    WhichClick:1,
    AddOrView:1,
    TempBox:null,
  };
  InvoiceDetailsRows:any=[];
  Paytype: any;
  resetInvoiceData(){
    this.uploadedFiles = [];

    this.Paytype = [
      { id: 1, name: { ar: 'نقدي', en: 'Monetary' } },
      { id: 8, name: { ar: 'آجل', en: 'Postpaid' } },
      { id: 17, name: { ar: 'نقدا نقاط بيع - مدى-ATM', en: 'Cash points of sale ATM' } },
      { id: 9, name: { ar: 'شبكة', en: 'Network' } },
      { id: 6, name: { ar: 'حوالة', en: 'Transfer' } },
    ];

    this.InvoiceDetailsRows=[];
    this.load_CostCenter=[];
    this.load_Accounts=[];
    this.load_Customer=[];
    this.load_Projects=[];
    this.load_OfferPrices=[];

    const DateHijri =toHijri(new Date());
    var DateGre = new HijriDate(DateHijri._year, DateHijri._month, DateHijri._date);
    DateGre._day=DateGre._date;

    this.modalInvoice = {
      InvoiceId:0,
      InvoiceNumber: null,
      JournalNumber: null,
      InvoicePayType: null,
      Date: new Date(),
      HijriDate: DateGre,
      Notes: null,
      InvoiceNotes: null,
      Type: 2,
      InvoiceValue: 0,
      TotalValue: 0,
      TaxAmount: 0,
      ToAccountId: null,
      ProjectId: null,
      PayType: 8,
      DiscountPercentage: 0,
      DiscountValue: 0,
      customerId: null,
      printBankAccount: false,
      InvoiceReference: null,
      PageInsert: 1,
      CostCenterId: null,
      VoucherAlarmDate: null,
      VoucherAlarmCheck: null,
      IsSendAlarm: null,
      AlarmVoucherInvDate:null,
      Currency:null,
      BranchSelect:null,
      OrganizationsMobile:null,
      OrganizationsAddress:null,
      Reference:null,
      popuptype:1, //(1) normal invoice - (2) invoice without project - (3) Creditnoti
      CreditNotiLbl:0,
      DepitNotiLbl:0,

      CustomerTax:null,
      CustomerAddress:null,
      Customeridtype:null,

      AllCustomerCheck:false,
      OfferPriceNoCheck:null,
      OfferPriceNo:null,

      descountmoney:null,
      descountpersentage:null,
      PaidValue:0,
      remainder:0,

      taxtype:this.paymentsDetails.contractTaxType??2,
      totalAmount:0,
      discounMoneytVal:0,
      total_:0,
      totalWithDiscount:0,
      taxAmountLbl:0,
      VoucherValue:0,
      TotalVoucherValueLbl:0,

      WhichClick:1,
      AddOrView:1,
      TempBox:null,

    };
  }

  GetServicesPriceByServiceIdByContract(Contractid:any,offerdata:any){
    debugger
    this._contractService.GetContractserviceBycontractid(Contractid).subscribe(data=>{
      if(data.length==1)
      {
      // var maxVal=0;

      // if(this.InvoiceDetailsRows.length>0)
      // {
      //   maxVal = Math.max(...this.InvoiceDetailsRows.map((o: { idRow: any; }) => o.idRow))
      // }
      // else{
      //   maxVal=0;
      // }
      var value=0;
      if((this.paymentsDetails.contractTaxType??2)==3)
      {
        value=offerdata.totalAmount;
      }
      else{
        value=offerdata.amount;
      }

      this.GetServicesPriceByServiceId_Invoice(data[0],value);
      //this.setServiceRowValueNew(maxVal+1,data[0],1,offerdata.amount);

        // data.forEach((element: any) => {
        //   this.modalDetailsContractEdit.taxtype=element.taxType;
        //   this.GetServicesPriceByServiceId_ContractEdit(element);
        // });
      }
      });
  }

  GetServicesPriceByServiceIdForProject(offerdata:any){
    debugger
    this._invoiceService.GetServicesPriceByServiceId(offerdata.serviceId).subscribe(data=>{
      var maxVal=0;

      if(this.InvoiceDetailsRows.length>0)
      {
        maxVal = Math.max(...this.InvoiceDetailsRows.map((o: { idRow: any; }) => o.idRow))
      }
      else{
        maxVal=0;
      }

      //data.result.amount
      this.setServiceRowValueNew(maxVal+1,data.result,1,offerdata.amount);
    });
  }
  setCustomerInvoice(){
    this.modalInvoice.customerId=this.ContractRowSelected.customerId;
    this.customerIdChange();
  }
  InvoicePopup(typepage:any){
    var date = new Date();
    if (typepage == 2) {
      this.FillCostCenterSelect();
      //this.FillCostCenterSelect_Invoices(this.ContractRowSelected.projectId);
      this.FillAllCustomerSelectWithBranch();
    }
    else if (typepage == 1) {
      this.FillCostCenterSelect();
      //this.FillCostCenterSelect_Invoices(null);
      this.FillCustomerSelectWProOnlyWithBranch();
    }
    this.FillStorehouseSelect();
    this.resetInvoiceData();
    // if(this.invoicepop==3)
    // {
    //   this.modalInvoice.customerId=this.PopupAfterSaveObj.CustomerId;
    //   this.modalInvoice.ProjectId=this.PopupAfterSaveObj.ProjectId;
    // }

    this.modalInvoice.popuptype=typepage;
    this.GetBranchOrganization();
    this.GenerateVoucherNumber();

    this.FillCustAccountsSelect2AndUpdate(this.modalInvoice.PayType);
    this.GetAllServicesPrice();
    this.setCustomerInvoice();

    this.modalInvoice.ProjectId=this.ContractRowSelected.projectId;
  }


  load_Customer:any;
  FillAllCustomerSelectNotHaveProjWithBranch(){
    this._invoiceService.GetAllCustomerForDrop().subscribe(data=>{
      this.load_Customer=data.result;
    });
  }
  FillAllCustomerSelectWithBranch(){
    this._invoiceService.GetAllCustomerForDrop().subscribe(data=>{
      this.load_Customer=data.result;
    });
  }
  FillCustomerSelectWProOnlyWithBranch(){
    this._invoiceService.GetAllCustomerForDrop().subscribe(data=>{
      this.load_Customer=data.result;
    });
  }
  load_CostCenter:any;
  FillCostCenterSelect(){
    this._invoiceService.FillCostCenterSelect().subscribe(data=>{
      this.load_CostCenter=data;
      this._invoiceService.GetBranch_Costcenter().subscribe(data=>{
        this.modalInvoice.CostCenterId=data.result.costCenterId;
        this.modalInvoice.OrganizationsAddress=data.result.nameAr;
      });
    });
  }
  FillCostCenterSelect_Invoices(projectid:any){
    this._invoiceService.GetBranch_Costcenter().subscribe(data=>{
      this.modalInvoice.OrganizationsAddress=data.result.nameAr;
    });

    if(projectid!=null){
      this._invoiceService.FillCostCenterSelect_Invoices(projectid).subscribe(data=>{
        this.load_CostCenter=data;
      });
    }
    else{
      this.load_CostCenter=[];
      this.modalInvoice.CostCenterId=null;
    }

  }
  FillCostCenterSelect_InvoicesWithGet(projectid:any){
    if(projectid!=null){
      this._invoiceService.FillCostCenterSelect_Invoices(projectid).subscribe(data=>{
        this.load_CostCenter=data;
        this.GetCostCenterByProId_Proj(this.modalInvoice.ProjectId);
      });
    }
    else{
      this.load_CostCenter=[];
      this.modalInvoice.CostCenterId=null;
    }

  }
  // GetBranch_Costcenter(){
  //   this._invoiceService.GetBranch_Costcenter().subscribe(data=>{
  //     this.modalInvoice.CostCenterId=data.result.costCenterId;

  //   });
  // }
  GetBranchOrganization(){
    this._invoiceService.GetBranchOrganization().subscribe(data=>{
      this.modalInvoice.OrganizationsMobile=data.result.mobile;
    });
  }
  GenerateVoucherNumber(){
    this._invoiceService.GenerateVoucherNumber(this.modalInvoice.Type).subscribe(data=>{
      this.modalInvoice.InvoiceNumber=data.reasonPhrase;
      // this.InvoiceDetailsRows=[];
      if(this.invoicepop!=2)
      {
        this.addInvoiceRow();
      }
    });
  }
  load_Accounts:any;
  FillCustAccountsSelect2(PayType:any){
    if(PayType)
    {
      this._invoiceService.FillCustAccountsSelect2(PayType).subscribe(data=>{
        this.load_Accounts=data;
      });
    }
    else{
      this.load_Accounts=[];
    }
  }
  FillCustAccountsSelect2AndUpdate(PayType:any){
    if(PayType)
    {
      this._invoiceService.FillCustAccountsSelect2(PayType).subscribe(data=>{
        this.load_Accounts=data;
        if(PayType!=8)
        {
          if(this.load_Accounts?.length>0)
          {
            this.modalInvoice.ToAccountId=this.load_Accounts[0]?.id;
          }
          else
          {
            this.modalInvoice.ToAccountId=null;
          }
        }
      });
    }
    else{
      this.load_Accounts=[];
    }
  }

  load_Projects:any;
  FillAllProjectSelectByNAccId(PayType:any){
    if(PayType)
    {
      this._invoiceService.FillAllProjectSelectByNAccId(PayType).subscribe(data=>{
        this.load_Projects=data;
      });
    }
    else{
      this.load_Projects=[];
    }
  }
  GetAllProjByCustomerId(customerid:any){
    this.load_Projects=[];
    this.modalInvoice.ProjectId=null;
    if(customerid)
    {
      this._invoiceService.GetAllProjByCustomerId(customerid).subscribe(data=>{
        this.load_Projects=data;
        if(this.load_Projects.length==1)
        {
          this.modalInvoice.ProjectId=this.load_Projects[0].id;
          this.GetCostCenterByProId_Proj(this.modalInvoice.ProjectId);
        }
      });
    }
    else{
      this.load_Projects=[];
    }
  }
  GetCostCenterByProId_Proj(projectid:any){
    if(projectid)
    {
      this._invoiceService.GetCostCenterByProId(projectid).subscribe(data=>{
        this.modalInvoice.CostCenterId=data.result.costCenterId;
      });
    }
    else{
      this.modalInvoice.CostCenterId=null;
    }
  }
  AllCustomerCheckChange(){
    this.modalInvoice.customerId=null;
    if(this.modalInvoice.AllCustomerCheck){
      this.FillAllCustomerSelectWithBranch();
    }
    else{
      this.FillAllCustomerSelectNotHaveProjWithBranch();
    }
  }
  PayTypeChange(){
    this.modalInvoice.ToAccountId=null;
    if (this.modalInvoice.PayType!=null) {
      this.FillAllProjectSelectByNAccId(0);//
      if (this.modalInvoice.popuptype == 1) {
        this.FillCustomerSelectWProOnlyWithBranch()
      }
      else if(this.modalInvoice.popuptype == 2 || this.modalInvoice.popuptype == 3) {
        this.FillAllCustomerSelectNotHaveProjWithBranch();
      }
    }
    if (this.modalInvoice.PayType == 8) {
      this.FillCustAccountsSelect2(this.modalInvoice.PayType);
        this.getCusAccID(this.modalInvoice.customerId, true);
        this.CalculateTotal2(1);
    }
    else if (this.modalInvoice.PayType == 1) {
      this.FillCustAccountsSelect2AndUpdate(this.modalInvoice.PayType);
    }
    else if (this.modalInvoice.PayType == 17) {
      this.FillCustAccountsSelect2AndUpdate(this.modalInvoice.PayType);
    }
    else {
      this.FillCustAccountsSelect2(this.modalInvoice.PayType);
    }
  }

  getCusAccID(customerid:any,paytype:any){
    if(customerid!=null)
    {
      this._invoiceService.GetCustomersByCustomerId(customerid).subscribe(data=>{
          if (paytype) {
            this.modalInvoice.ToAccountId=data.result.accountId;
          }
          if (data.result.customerTypeId == 2) {
            this.modalInvoice.CustomerTax=data.result.customerAddress;
            this.modalInvoice.CustomerAddress=data.result.customerAddress;
            this.modalInvoice.Customeridtype=data.result.customerTypeId;
          }
          else {
            this.modalInvoice.CustomerTax=data.result.commercialRegister;
            this.modalInvoice.CustomerAddress=data.result.customerAddress;
            this.modalInvoice.Customeridtype=data.result.customerTypeId;
          }
      });
    }
  }

  load_OfferPrices:any;
  FillAllOfferTodropdownOld(customerid:any){
    if(customerid!=null)
    {
      this._invoiceService.FillAllOfferTodropdownOld(customerid).subscribe(data=>{
        this.load_OfferPrices=data;
      });
    }
    else
    {
      this.load_OfferPrices=[];
    }
  }

  ProjectIdChange(){
    if(this.modalInvoice.ProjectId!=null)
    {
      this.FillCostCenterSelect_Invoices(this.modalInvoice.ProjectId);
      this.GetCostCenterByProId_Proj(this.modalInvoice.ProjectId);
    }
    else
    {
      this.load_CostCenter=[];
      this.modalInvoice.CostCenterId=null;
    }
  }
  accountIdChange(){
    if(this.modalInvoice.ToAccountId)
    {
      this._invoiceService.GetCustomersByAccountId(this.modalInvoice.ToAccountId).subscribe(data=>{
        debugger
        this.modalInvoice.customerId=data.result.customerId;
        if (this.modalInvoice.PayType == 8)
        {
          this.modalInvoice.ProjectId=null;
          this.modalInvoice.CostCenterId=null;
          this.FillAllOfferTodropdownOld(data.result.customerId);
          this.GetAllProjByCustomerId(data.result.customerId);
          this.getCusAccID(data.result.customerId,false);
        }
        else
        {
          this.modalInvoice.customerId=null;
          this.modalInvoice.ProjectId=null;
          this.modalInvoice.CostCenterId=null;
        }
      });
    }
    else{
      this.modalInvoice.customerId=null;
      this.modalInvoice.ProjectId=null;
      this.modalInvoice.CostCenterId=null;

    }
  }
  customerIdChange(){

  this.FillAllOfferTodropdownOld(this.modalInvoice.customerId);

  if (this.modalInvoice.PayType == 8) {
      this.getCusAccID(this.modalInvoice.customerId,true);
  }
  else {
    this.getCusAccID(this.modalInvoice.customerId,false);
  }

  this.GetAllProjByCustomerId(this.modalInvoice.customerId);
  }

  CalculateTotal2(type:any)
  {
    this.modalInvoice.descountmoney=null;
    this.modalInvoice.descountpersentage=null;
    this.modalInvoice.PaidValue=0;
    this.CalculateTotal(type);
  }
  CalculateTotal(type: any) {
    var totalwithtaxes = 0;
    var totalAmount = 0;
    var totalDisc = 0;
    var totalDiscWithamountAll = 0;
    var totaltax = 0;
    var totalAmountIncludeT = 0;
    var vAT_TaxVal = parseFloat(this.userG.orgVAT ?? 0);
    this.InvoiceDetailsRows.forEach((element: any) => {
      var ValueAmount = parseFloat((element.Amounttxt ?? 0).toString()).toFixed(
        2
      );
      ValueAmount = parseFloat(
        (+ValueAmount * element.QtyConst).toString()
      ).toFixed(2);
      var DiscountValue_Det;
      if (type == 1) {
        DiscountValue_Det = parseFloat(
          (element.DiscountValueConst ?? 0).toString()
        ).toFixed(2);
      } else {
        var Discountper_Det = parseFloat(
          (element.DiscountPercentageConst ?? 0).toString()
        ).toFixed(2);
        DiscountValue_Det = parseFloat(
          ((+Discountper_Det * +ValueAmount) / 100).toString()
        ).toFixed(2);
        this.InvoiceDetailsRows.filter(
          (a: { idRow: any }) => a.idRow == element.idRow
        )[0].DiscountValueConst = parseFloat(
          DiscountValue_Det.toString()
        ).toFixed(2);
      }
      var Value = parseFloat(
        (+ValueAmount - +DiscountValue_Det).toString()
      ).toFixed(2);
      if (!(+Value >= 0)) {
        this.InvoiceDetailsRows.filter(
          (a: { idRow: any }) => a.idRow == element.idRow
        )[0].DiscountValueConst = 0;
        this.InvoiceDetailsRows.filter(
          (a: { idRow: any }) => a.idRow == element.idRow
        )[0].DiscountPercentageConst = 0;
        DiscountValue_Det = 0;
        Value = parseFloat(
          (+ValueAmount - +DiscountValue_Det).toString()
        ).toFixed(2);
      }
      if (type == 1) {
        var DiscountPercentage_Det;
        if (+ValueAmount > 0) {
          DiscountPercentage_Det = (+DiscountValue_Det * 100) / +ValueAmount;
        } else {
          DiscountPercentage_Det = 0;
        }
        DiscountPercentage_Det = parseFloat(
          DiscountPercentage_Det.toString()
        ).toFixed(2);
        this.InvoiceDetailsRows.filter(
          (a: { idRow: any }) => a.idRow == element.idRow
        )[0].DiscountPercentageConst = DiscountPercentage_Det;
      }

      var FValDisc = DiscountValue_Det;
      var FValAmountAll = ValueAmount;
      var FVal = Value;
      var FValIncludeT = FVal;
      var taxAmount = 0;
      var totalwithtax = 0;

      var TaxV8erS = parseFloat(
        (
          +parseFloat((+Value * vAT_TaxVal).toString()).toFixed(2) / 100
        ).toString()
      ).toFixed(2);
      var TaxVS = parseFloat(
        (
          +Value -
          +parseFloat((+Value / (vAT_TaxVal / 100 + 1)).toString()).toFixed(2)
        ).toString()
      ).toFixed(2);

      if (this.modalInvoice.taxtype == 2) {
        taxAmount = +TaxV8erS;
        totalwithtax = +parseFloat(
          (+parseFloat(Value) + +parseFloat(TaxV8erS)).toString()
        ).toFixed(2);
      } else {
        taxAmount = +TaxVS;
        FValIncludeT = parseFloat(
          (+parseFloat(Value).toFixed(2) - +TaxVS).toString()
        ).toFixed(2);
        totalwithtax = +parseFloat(Value).toFixed(2);
      }

      this.InvoiceDetailsRows.filter(
        (a: { idRow: any }) => a.idRow == element.idRow
      )[0].AmountBeforeTaxtxt = parseFloat(FValIncludeT.toString()).toFixed(2);
      this.InvoiceDetailsRows.filter(
        (a: { idRow: any }) => a.idRow == element.idRow
      )[0].taxAmounttxt = parseFloat(taxAmount.toString()).toFixed(2);
      this.InvoiceDetailsRows.filter(
        (a: { idRow: any }) => a.idRow == element.idRow
      )[0].TotalAmounttxt = parseFloat(totalwithtax.toString()).toFixed(2);

      totalwithtaxes = +parseFloat(
        (
          +parseFloat(totalwithtaxes.toString()).toFixed(2) +
          +parseFloat(totalwithtax.toString()).toFixed(2)
        ).toString()
      ).toFixed(2);
      totalAmount = +parseFloat(
        (
          +parseFloat(totalAmount.toString()).toFixed(2) +
          +parseFloat(FVal).toFixed(2)
        ).toString()
      ).toFixed(2);
      totalAmountIncludeT = +parseFloat(
        (
          +parseFloat(totalAmountIncludeT.toString()).toFixed(2) +
          +parseFloat(totalwithtax.toString()).toFixed(2)
        ).toString()
      ).toFixed(2);
      totaltax = +parseFloat(
        (
          +parseFloat(totaltax.toString()).toFixed(2) +
          +parseFloat(taxAmount.toString()).toFixed(2)
        ).toString()
      ).toFixed(2);
      totalDisc = +parseFloat(
        (
          +parseFloat(totalDisc.toString()).toFixed(2) +
          +parseFloat(FValDisc.toString()).toFixed(2)
        ).toString()
      ).toFixed(2);
      totalDiscWithamountAll = +parseFloat(
        (
          +parseFloat(totalDiscWithamountAll.toString()).toFixed(2) +
          +parseFloat(FValAmountAll).toFixed(2)
        ).toString()
      ).toFixed(2);
    });

    this.modalInvoice.totalAmount = parseFloat(
      totalDiscWithamountAll.toString()
    ).toFixed(2);
    this.modalInvoice.discounMoneytVal = parseFloat(
      totalDisc.toString()
    ).toFixed(2);
    this.modalInvoice.total_ = parseFloat(totalAmount.toString()).toFixed(2);
    this.modalInvoice.totalWithDiscount = parseFloat(
      totalAmount.toString()
    ).toFixed(2);
    this.modalInvoice.taxAmountLbl = parseFloat(totaltax.toString()).toFixed(2);

    if (this.modalInvoice.taxtype == 2) {
      this.modalInvoice.VoucherValue = parseFloat(
        totalAmount.toString()
      ).toFixed(2);
      this.modalInvoice.TotalVoucherValueLbl = parseFloat(
        (+totalAmount + +totaltax).toString()
      ).toFixed(2);
    } else {
      this.modalInvoice.VoucherValue = parseFloat(
        (+totalAmount - +totaltax).toString()
      ).toFixed(2);
      this.modalInvoice.TotalVoucherValueLbl = parseFloat(
        totalAmount.toString()
      ).toFixed(2);
    }
    this.checkRemainder();
  }

  checkRemainder(){
    var _paidValInvoice = parseFloat(this.modalInvoice.PaidValue).toFixed(2);
    var totalInvoiceVal = parseFloat(this.modalInvoice.TotalVoucherValueLbl).toFixed(2);
    if (parseInt(_paidValInvoice) > parseInt(totalInvoiceVal) && parseInt(totalInvoiceVal)!=0) {
      this.modalInvoice.PaidValue=totalInvoiceVal;
    }
    var remainder = +parseFloat(this.modalInvoice.TotalVoucherValueLbl).toFixed(2) - +parseFloat(this.modalInvoice.PaidValue).toFixed(2);
    this.modalInvoice.remainder=remainder;
  }



  offerpriceChange(){
    var stu =this.modalInvoice.OfferPriceNoCheck;
    if (this.modalInvoice.OfferPriceNo !=null && stu == true) {
      this.InvoiceDetailsRows=[];
      this.GetOfferPriceServiceForContract(this.modalInvoice.OfferPriceNo);
    }
    else {
      this.InvoiceDetailsRows=[];
      this.addInvoiceRow();
    }
  }
  taxtypeChange(){
    this.CalculateTotal(1);
  }
  applyFilterServiceList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.serviceListDataSource.filter = filterValue.trim().toLowerCase();
  }
  serviceListDataSource = new MatTableDataSource();
  servicesList: any;
  serviceListDataSourceTemp:any=[];
  GetAllServicesPrice(){
    this._invoiceService.GetAllServicesPrice().subscribe(data=>{
        this.serviceListDataSource = new MatTableDataSource(data.result);
        this.serviceListDataSource.paginator = this.paginatorServices;

        this.servicesList=data.result;
        this.serviceListDataSourceTemp=data.result;
    });
  }
  @ViewChild('paginatorServices') paginatorServices!: MatPaginator;
  GetServwithOffer(OfferPriceNo:any){
    this._invoiceService.GetOfferservicenByid(OfferPriceNo).subscribe(data=>{
        this.serviceListDataSource = new MatTableDataSource(data.result);
        this.serviceListDataSource.paginator = this.paginatorServices;
        this.servicesList=data.result;
        this.serviceListDataSourceTemp=data.result;
    });
  }

  GetOfferPriceServiceForContract(OfferId:any){
    this._invoiceService.GetOfferservicenByid(OfferId).subscribe(data=>{
      data.result.forEach((element: any) => {
        this.modalInvoice.taxtype=element.taxType;
        this.GetServicesPriceByServiceId(element);
      });
    });
  }

  GetServicesPriceByServiceId(offerdata:any){

    this._invoiceService.GetServicesPriceByServiceId(offerdata.serviceId).subscribe(data=>{
      var maxVal=0;

      if(this.InvoiceDetailsRows.length>0)
      {
        maxVal = Math.max(...this.InvoiceDetailsRows.map((o: { idRow: any; }) => o.idRow))
      }
      else{
        maxVal=0;
      }
      this.setServiceRowValueNew(maxVal+1,data.result,offerdata.serviceQty,offerdata.serviceamountval);
    });
  }

  GetAccountJournalSearchGrid() {
    if(this.modalInvoice.OfferPriceNo!=null)
    {
      this.GetServwithOffer(this.modalInvoice.OfferPriceNo);
    }
    else
    {
      this.GetAllServicesPrice();
    }
  }

  addInvoiceRow() {

    var maxVal=0;
    if(this.InvoiceDetailsRows.length>0)
    {
      maxVal = Math.max(...this.InvoiceDetailsRows.map((o: { idRow: any; }) => o.idRow))
    }
    else{
      maxVal=0;
    }


    this.InvoiceDetailsRows?.push({
      idRow: maxVal+1,
      AccJournalid: null,
      UnitConst: null,
      QtyConst: null,
      DiscountValueConst: null,
      DiscountPercentageConst:null,
      accountJournaltxt: null,
      AmountBeforeTaxtxt: null,
      Amounttxt: null,
      taxAmounttxt: null,
      TotalAmounttxt: null,
    });
  }

  deleteInvoiceRow(idRow: any) {
    let index = this.InvoiceDetailsRows.findIndex((d: { idRow: any; }) => d.idRow == idRow);
    this.InvoiceDetailsRows.splice(index, 1);
    this.CalculateTotal(1);
  }

  setServiceRowValue(element: any) {
    this.InvoiceDetailsRows.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRow)[0].AccJournalid = element.servicesId;
    this.InvoiceDetailsRows.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRow)[0].UnitConst = element.serviceTypeName;
    this.InvoiceDetailsRows.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRow)[0].QtyConst = 1;
    this.InvoiceDetailsRows.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRow)[0].accountJournaltxt = element.servicesName;
    this.InvoiceDetailsRows.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRow)[0].Amounttxt = this.PublicPaymentRow.amount??0;
    this.CalculateTotal2(1);
    //this.addInvoiceRow();
  }

  setServiceRowValueNew(indexRow:any,item: any, Qty: any,servamount: any) {
    this.addInvoiceRow();
    this.InvoiceDetailsRows.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].AccJournalid = item.servicesId;
    this.InvoiceDetailsRows.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].UnitConst = item.serviceTypeName;
    this.InvoiceDetailsRows.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].QtyConst = Qty;
    this.InvoiceDetailsRows.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].accountJournaltxt = item.name;
    this.InvoiceDetailsRows.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].Amounttxt = servamount;
    this.CalculateTotal(1);
  }


  getCusAccID_Save(customerid:any,paytype:any){
    if(customerid!=null)
    {
      this._invoiceService.GetCustomersByCustomerId(customerid).subscribe(data=>{
          if (paytype) {
            this.modalInvoice.ToAccountId=data.result.accountId;
            this.saveInvoice();
          }
          if (data.result.customerTypeId == 2) {
            this.modalInvoice.CustomerTax=data.result.customerAddress;
            this.modalInvoice.CustomerAddress=data.result.customerAddress;
            this.modalInvoice.Customeridtype=data.result.customerTypeId;
          }
          else {
            this.modalInvoice.CustomerTax=data.result.commercialRegister;
            this.modalInvoice.CustomerAddress=data.result.customerAddress;
            this.modalInvoice.Customeridtype=data.result.customerTypeId;
          }
      });
    }
  }
  FillCustAccountsSelect2_Save(PayType:any){
    if(PayType)
    {
      this._invoiceService.FillCustAccountsSelect2(PayType).subscribe(data=>{
        this.load_Accounts=data;
        this.getCusAccID_Save(this.modalInvoice.customerId, true);
      });
    }
    else{
      this.load_Accounts=[];
    }
  }

  FillCustAccountsSelect2AndUpdate_Save(PayType:any){
    if(PayType)
    {
      this._invoiceService.FillCustAccountsSelect2(PayType).subscribe(data=>{
        this.load_Accounts=data;
        if(PayType!=8)
        {
          if(this.load_Accounts?.length>0)
          {
            this.modalInvoice.ToAccountId=this.load_Accounts[0]?.id;
            this.saveInvoice();
          }
          else
          {
            this.modalInvoice.ToAccountId=null;
            this.toast.error("تأكد من الحساب",this.translate.instant("Message"));return;
          }
        }
      });
    }
    else{
      this.load_Accounts=[];
    }
  }
  checkPayTypeAndSave() {

    var val=this.validateInvoiceForm();
    if(val.status==false)
    {
      this.toast.error(val.msg,this.translate.instant("Message"));return;
    }
    if(this.modalInvoice.remainder>0)
    {
      //hna mfrod afth popup yogd motbke
    }

    var _paidValue = parseFloat(this.modalInvoice.PaidValue).toFixed(2);
    var remainder = parseFloat(this.modalInvoice.remainder).toFixed(2);
    if (+remainder < 1 && +_paidValue>0 )//agel to be n2di
    {
        if (this.modalInvoice.PayType == 8) {
          this.modalInvoice.PayType=1;
          this.FillCustAccountsSelect2AndUpdate_Save(1);
        }
        else{
          this.saveInvoice();
        }
    }
    else if (((+remainder >= 0) && ((this.modalInvoice.PayType == 1) || (this.modalInvoice.PayType == 17) || (this.modalInvoice.PayType == 9) || (this.modalInvoice.PayType == 6))))
    {
        if (this.modalInvoice.PayType != 8 ) {
          this.modalInvoice.TempBox=this.modalInvoice.ToAccountId;
          this.modalInvoice.PayType=8;
          this.FillCustAccountsSelect2_Save(8);
        }
        else{
          this.saveInvoice();
        }
    }
    else{
      this.saveInvoice();
    }
  }

  ValidateObjMsgInvoice:any={status:true,msg:null,}
  validateInvoiceForm() {
    this.ValidateObjMsgInvoice={status:true,msg:null,}
    if(this.modalInvoice.customerId==null)
    {
      this.ValidateObjMsgInvoice={status:false,msg:"من فضلك اختر عميل"}
      return this.ValidateObjMsgInvoice;
    }
    if(this.modalInvoice.popuptype==1)
    {
      if(this.modalInvoice.ProjectId==null)
      {
        this.ValidateObjMsgInvoice={status:false,msg:"من فضلك اختر مشروع"}
        return this.ValidateObjMsgInvoice;
      }
    }
    if(this.InvoiceDetailsRows.length==0)
    {
      this.ValidateObjMsgInvoice={status:false,msg:"من فضلك اختر خدمة"}
      return this.ValidateObjMsgInvoice;
    }

    this.ValidateObjMsgInvoice={status:true,msg:null,}
    return this.ValidateObjMsgInvoice;
  }
  pathurl = environment.PhotoURL;

  continuou(modal:any){
    if(!(parseInt(this.modalInvoice.TotalVoucherValueLbl)>0))
    {
      this.toast.error("من فضلك أدخل قيمة صحيحة للفاتورة", this.translate.instant("Message"));
      return;
    }
    modal?.dismiss();
  }
  disableButtonSave_Invoice=false;

  saveInvoice() {
    if(!(parseInt(this.modalInvoice.TotalVoucherValueLbl)>0))
    {
      this.toast.error("من فضلك أدخل قيمة صحيحة للفاتورة", this.translate.instant("Message"));
      return;
    }
    debugger
    var VoucherDetailsList:any = [];
    var VoucherObj:any = {};
    VoucherObj.InvoiceId = this.modalInvoice.InvoiceId;
    VoucherObj.InvoiceNumber = this.modalInvoice.InvoiceNumber;
    VoucherObj.JournalNumber = this.modalInvoice.JournalNumber;
    VoucherObj.Paid = this.PublicPaymentRow.paymentId;
    // VoucherObj.InvoicePayType= this.modalInvoice.PayType;
    if(this.modalInvoice.Date!=null)
    {
      VoucherObj.Date =this._sharedService.date_TO_String(this.modalInvoice.Date);
      const nowHijri =toHijri(this.modalInvoice.Date);
      VoucherObj.HijriDate= this._sharedService.hijri_TO_String(nowHijri);
    }
    VoucherObj.Notes = this.modalInvoice.Notes;
    VoucherObj.InvoiceNotes = this.modalInvoice.InvoiceNotes;
    VoucherObj.Type = this.modalInvoice.Type;
    VoucherObj.InvoiceValue = this.modalInvoice.VoucherValue;
    VoucherObj.StorehouseId = this.modalInvoice.storehouseId;

    VoucherObj.TotalValue = this.modalInvoice.TotalVoucherValueLbl;
    VoucherObj.TaxAmount = this.modalInvoice.taxAmountLbl;
    VoucherObj.ToAccountId = this.modalInvoice.ToAccountId;
    if (this.modalInvoice.popuptype==1 || this.invoicepop==2) {
        VoucherObj.ProjectId = this.modalInvoice.ProjectId;
    }
    // if(this.invoicepop==3)
    // {
    //   VoucherObj.ProjectId=this.PopupAfterSaveObj.ProjectId;
    // }
    VoucherObj.PayType = this.modalInvoice.PayType;
    VoucherObj.DiscountPercentage = this.modalInvoice.DiscountPercentage;
    VoucherObj.DiscountValue = this.modalInvoice.DiscountValue;
    VoucherObj.CustomerId = this.modalInvoice.customerId;
    VoucherObj.printBankAccount = this.modalInvoice.printBankAccount;
    VoucherObj.InvoiceReference = this.modalInvoice.Reference;
    VoucherObj.PaidValue = this.modalInvoice.PaidValue;
    VoucherObj.PageInsert = 2;
    VoucherObj.CostCenterId = this.modalInvoice.CostCenterId;
    if (this.modalInvoice.PayType == 8) {
      if (this.modalInvoice.AlarmVoucherInvDate==null ) {
          VoucherObj.VoucherAlarmDate = null;
          VoucherObj.VoucherAlarmCheck = null;
          VoucherObj.IsSendAlarm = null;
      }
      else {
          VoucherObj.VoucherAlarmDate = this._sharedService.date_TO_String(this.modalInvoice.AlarmVoucherInvDate);
          VoucherObj.VoucherAlarmCheck = true;
          VoucherObj.IsSendAlarm = 0;
      }
  }
  else {
      VoucherObj.VoucherAlarmDate = null;
      VoucherObj.VoucherAlarmCheck = null;
      VoucherObj.IsSendAlarm = null;
  }
  var input = { valid: true, message: "" }
  this.InvoiceDetailsRows.forEach((element: any, index: any) => {
    if (element.AccJournalid==null) {
      input.valid = false; input.message = "من فضلك أختر خدمة صحيحة";return;
    }
    if (element.Amounttxt == null) {
      input.valid = false; input.message = "من فضلك أختر مبلغ صحيح";return;
    }
    if (element.QtyConst == null) {
      input.valid = false; input.message = "من فضلك أختر كمية صحيحة";return;
    }

    var VoucherDetailsObj:any = {};
    VoucherDetailsObj.LineNumber = (index + 1);
    VoucherDetailsObj.AccountId = this.modalInvoice.TempBox;
    VoucherDetailsObj.ServicesPriceId = element.AccJournalid;
    VoucherDetailsObj.Amount = element.Amounttxt;
    VoucherDetailsObj.Qty = element.QtyConst;
    VoucherDetailsObj.TaxType = this.modalInvoice.taxtype;
    VoucherDetailsObj.TaxAmount =element.taxAmounttxt;
    VoucherDetailsObj.TotalAmount = element.TotalAmounttxt;

    VoucherDetailsObj.DiscountValue_Det = element.DiscountValueConst;
    VoucherDetailsObj.DiscountPercentage_Det = element.DiscountPercentageConst;

    VoucherDetailsObj.PayType = this.modalInvoice.PayType;

    //this.checkPayType();
    VoucherDetailsObj.ToAccountId = this.modalInvoice.ToAccountId
    VoucherDetailsObj.CostCenterId = this.modalInvoice.CostCenterId;
    VoucherDetailsObj.ReferenceNumber =this.modalInvoice.Reference;
    VoucherDetailsObj.Description = "";
    VoucherDetailsList.push(VoucherDetailsObj);
  });
  if (!input.valid) {
    this.toast.error(input.message);return;
  }

  debugger
  var DetailsList:any = [];
  var counter = 0;
  if(this.OfferPopupAddorEdit_Invoice==1)
  {
    this.ListDataServices_Invoice.forEach((elementService: any) => {
      elementService.forEach((element: any) => {
        var Detailsobj:any = {};
        counter++;
        //element.servicesIdVou??0
        Detailsobj.ServicesIdVou = 0;
        Detailsobj.ServicesId  = element.servicesId;
        Detailsobj.ParentId  = element.parentId;
        Detailsobj.SureService  = 1;
        Detailsobj.LineNumber  = counter;
        DetailsList.push(Detailsobj);
      });
    });
  }
  else
  {
    this.ListDataServices_Invoice.forEach((elementService: any) => {
      let dataSer = elementService.filter((d: { SureService: any; }) => d.SureService == 1);
      dataSer.forEach((element: any) => {
        var Detailsobj:any = {};
        counter++;
        Detailsobj.ServicesIdVou = 0;
        Detailsobj.ServicesId  = element.servicesId;
        Detailsobj.ParentId  = element.parentId;
        Detailsobj.SureService  = element.SureService??0;
        Detailsobj.LineNumber  = counter;
        DetailsList.push(Detailsobj);
      });
    });
  }

  VoucherObj.ServicesPriceOffer = DetailsList;

  VoucherObj.VoucherDetails = VoucherDetailsList;
  VoucherObj.ToAccountId = this.modalInvoice.ToAccountId;
  VoucherObj.PayType = this.modalInvoice.PayType;
  this.disableButtonSave_Invoice = true;
  setTimeout(() => { this.disableButtonSave_Invoice = false }, 15000);

  if(this.modalInvoice.WhichClick==1)
  {
    this._invoiceService.SaveInvoiceForServices2(VoucherObj).subscribe((result: any)=>{
      if(this.invoicepop==2)
      {
        if(result.statusCode==200){
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
          if (this.uploadedFiles.length > 0) {
            const formData = new FormData();
            formData.append('UploadedFile', this.uploadedFiles[0]);
            formData.append('InvoiceId', result.returnedParm);
            this._invoiceService.UploadPayVoucherImage(formData).subscribe((result) => {
                this.GetAllCustomerPayments();
              });
          } else {
            this.GetAllCustomerPayments();
          }
          this.resetInvoiceData();
          this.InvoiceModelPublic?.dismiss();
        }
        else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
      }
    });
  }
  else if(this.modalInvoice.WhichClick==2)
  {
    this._invoiceService.SaveandPostInvoiceForServices2(VoucherObj).subscribe((result: any)=>{
      if(this.invoicepop==2)
      {
        if(result.statusCode==200){
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
          if (this.uploadedFiles.length > 0) {
            const formData = new FormData();
            formData.append('UploadedFile', this.uploadedFiles[0]);
            formData.append('InvoiceId', result.returnedParm);
            this._invoiceService.UploadPayVoucherImage(formData).subscribe((result) => {
                this.GetAllCustomerPayments();
              });
          } else {
            this.GetAllCustomerPayments();
          }
          this.resetInvoiceData();
          this.InvoiceModelPublic?.dismiss();
        }
        else{this.toast.error(result.reasonPhrase, this.translate.instant("Message"));}
      }
    });
  }
  // else if(this.modalInvoice.WhichClick==3)
  // {
  //   this._invoiceService.SaveInvoiceForServicesNoti(VoucherObj).subscribe((result: any)=>{
  //     if(result.statusCode==200){
  //       this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
  //       this.resetInvoiceData();
  //       //this.GetAllProjects();
  //       modal?.dismiss();
  //     }
  //     else{this.toast.error(result.reasonPhrase, this.translate.instant("Message"));}
  //   });
  // }

  }



  ConvertNumToString(val:any){
    this._sharedService.ConvertNumToString(val).subscribe(data=>{
      //this.modalDetailsProject.total_amount_text=data?.reasonPhrase;
    });
  }





  key:any;
  isShift=false;

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
    this.isShift = !!event.shiftKey; // typecast to boolean
    if (this.isShift) {
      switch (this.key ) {
        case 16: // ignore shift key
          break;
        default:
          if(event.code=="KeyA")
          {
            if(this.invoicepop==2)
            {
              this.addInvoiceRow();
            }
          }
          break;
      }
    }

  }

  //#endregion
  //------------------------------------(End) Invoice-------------------------------------------

  AllContractPrintData:any=null;
  CustomDataAllContract:any={
    OrgImg:null,
    SumtotalPaidPayment:0,
    SumtotalRemainingPayment:0,
  }
  resetCustomDataAllContract(){
    this.AllContractPrintData=null;
    this.CustomDataAllContract={
      OrgImg:null,
      SumtotalPaidPayment:0,
      SumtotalRemainingPayment:0,
    }
  }
  GetAllContractsPrint(){

    const formData: FormData = new FormData();
    if(this.dataContract.filter.search_ProjectManagerId)
    {
      formData.append('ManagerId',this.dataContract.filter.search_ProjectManagerId);
    }
    if(this.dataContract.filter.AllContracts)
    {
      formData.append('Type',"0");
    }
    else
    {
      formData.append('Type',"1");

    }
    if(!(this.dataContract.filter.DateFrom_P ==null || this.dataContract.filter.DateTo_P ==null)){
      formData.append('FromDate',this.dataContract.filter.DateFrom_P);
      formData.append('ToDate',this.dataContract.filter.DateTo_P);
    }

    let Sortedlist:any = []
    this.ContractsDataSource.data.forEach((element: any) => {
      Sortedlist.push(element.contractId)
    });

    formData.append('Sortedlist', Sortedlist.toString());
    this.CustomDataAllContract.SumtotalPaidPayment=0;
    this.CustomDataAllContract.SumtotalRemainingPayment=0;
    this._contractService.GetReportGrid(formData).subscribe(data=>{
      debugger
      this.AllContractPrintData=data;
      if(this.AllContractPrintData?.org_VD.logoUrl)
      this.CustomDataAllContract.OrgImg=environment.PhotoURL+this.AllContractPrintData?.org_VD.logoUrl;
      else this.CustomDataAllContract.OrgImg=null;
      this.AllContractPrintData?.someContracts.forEach((element: any) => {
        this.CustomDataAllContract.SumtotalPaidPayment=this.CustomDataAllContract.SumtotalPaidPayment+element.totalPaidPayment;
        this.CustomDataAllContract.SumtotalRemainingPayment=this.CustomDataAllContract.SumtotalRemainingPayment+element.totalRemainingPayment;
      });
    });
  }

  Contract3PrintData:any=null;
  CustomDataContract:any={
    OrgImg:null,
  }
  resetCustomDataContract(){
    this.Contract3PrintData=null;
    this.CustomDataContract={
      OrgImg:null,
    }
  }
  Get3ContractsPrint(obj:any){
    this._contractService.printnewcontract(obj.contractId).subscribe(data=>{
      debugger
      this.Contract3PrintData=data;
      if(this.Contract3PrintData?.org_VD.logoUrl)
      this.CustomDataContract.OrgImg=environment.PhotoURL+this.Contract3PrintData?.org_VD.logoUrl;
      else this.CustomDataContract.OrgImg=null;
    });
  }

  Contract2PrintData:any=null;
  CustomData2Contract:any={
    OrgImg:null,
    taxType:null,
  }
  resetCustomData2Contract(){
    this.Contract2PrintData=null;
    this.CustomData2Contract={
      OrgImg:null,
      taxType:null,
    }
  }
  serviceDetailsPrint: any;
  serviceDetailsPrintObj:any=[];
  serviceDetailsList:any=[];
  GetDofAsaatContractsPrint(obj:any){
    this.serviceDetailsPrintObj=[];
    this.serviceDetailsList=[];
    this._contractService.printaqsatdofaatContract(obj.contractId).subscribe(data=>{
      this.Contract2PrintData=data;
      if(this.Contract2PrintData?.org_VD.logoUrl)
      this.CustomData2Contract.OrgImg=environment.PhotoURL+this.Contract2PrintData?.org_VD.logoUrl;
      else this.CustomData2Contract.OrgImg=null;

      if(this.Contract2PrintData?.contract.taxType==3)
      {
        this.CustomData2Contract.taxType="شامل";
      }
      else
      {
        this.CustomData2Contract.taxType="غير شامل";
      }

      this.serviceDetailsPrint=[];
      this.Contract2PrintData?.conservices.forEach((element: any) => {
        var serviceDetails1 = "";
        var TaxValue:any=0;
        var vAT_TaxVal=15;
        if (this.Contract2PrintData?.contract.taxType == 2) {
          TaxValue = parseFloat((+parseFloat((+element.serviceamountval * vAT_TaxVal).toString()).toFixed(2) / 100).toString()).toFixed(2);
        }
        else {
          TaxValue=parseFloat((+element.serviceamountval- +parseFloat((+element.serviceamountval/((vAT_TaxVal / 100) + 1)).toString()).toFixed(2)).toString()).toFixed(2);
        }

        this._contractService.GetServicesPriceVouByParentIdAndContract(element.serviceId,obj.contractId).subscribe(data=>{
          this.serviceDetailsList=data.result;
          this.serviceDetailsList.sort((a: { lineNumber: number; },b: { lineNumber: number; }) => (a.lineNumber??0) - (b.lineNumber??0)); // b - a for reverse sort
          // data.result.forEach((item: any) => {
          //   serviceDetails1 = serviceDetails1 + (item.servicesName + " - " + item.accountName) + "\r\n";
          // });
          this.serviceDetailsPrintObj?.push({
              ProjectNo:this.Contract2PrintData?.project.projectNo,
              servicename:element.servicename,
              serviceDetails1:serviceDetails1,
              serviceDetailsList:this.serviceDetailsList,
              ServiceQty:element.serviceQty,
              Serviceamountval:element.serviceamountval,
              serviceoffertxt:element.serviceoffertxt,
              taxValue:TaxValue
          });
        });
      });
    });
  }
  drop(event: CdkDragDrop<string[]>) {
    debugger
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    var TempService=this.ListDataServices;
    this.ListDataServices=[];

    TempService.forEach((element: any) => {
      let newArray2 = element.filter((d: { parentId: any; }) => d.parentId != this.serviceDetails[0].parentId);
      if(newArray2.length>0)
      {
        this.ListDataServices.push(newArray2);
      }
    });
    this.ListDataServices.push(this.serviceDetails);
  }
  //---------------------------------------
  selectedRowIndex = -1;
  highlight(row:any){
    this.selectedRowIndex = row.contractId;
  }



//-------------------------------------------------------------------------
  //#region

  OfferPopupAddorEdit_Invoice:any=0;//add

  ListDataServices_Invoice:any=[];
  GetServicesPriceByParentId_Invoice(element:any){
    debugger
    this.serviceDetails_Invoice=[];
    if(element.AccJournalid!=null)
    {
      if(this.OfferPopupAddorEdit_Invoice==0)
      {

        if(this.modalInvoice.OfferPriceNo!=null)
        {
          this._invoiceService.GetServicesPriceVouByParentId(element.AccJournalid,this.modalInvoice.OfferPriceNo).subscribe(data=>{
            this.serviceDetails_Invoice = data.result;
            debugger
            var Check=true;
            if(this.ListDataServices_Invoice.length>0)
            {
              for (let ele of this.ListDataServices_Invoice) {
                var val = ele.filter((a: { parentId: any; })=>a.parentId==element.AccJournalid);
                if(val.length==0){Check=false;}
                else{Check=true;break;}
             }
            }
            else{Check=false;}

            if(Check==false){
              this.ListDataServices_Invoice.push(this.serviceDetails_Invoice);
            }
            this.SetDetailsCheck_Invoice(this.serviceDetails_Invoice);
            this.serviceDetails_Invoice.sort((a: { lineNumber: number; },b: { lineNumber: number; }) => (a.lineNumber??0) - (b.lineNumber??0)); // b - a for reverse sort
          });
        }
        else
        {
          this._invoiceService.GetServicesPriceByParentId(element.AccJournalid).subscribe(data=>{
            this.serviceDetails_Invoice = data.result;
            debugger
            var Check=true;
            if(this.ListDataServices_Invoice.length>0)
            {
              for (let ele of this.ListDataServices_Invoice) {
                var val = ele.filter((a: { parentId: any; })=>a.parentId==element.AccJournalid);
                if(val.length==0){Check=false;}
                else{Check=true;break;}
             }
            }
            else{Check=false;}

            if(Check==false){
              this.ListDataServices_Invoice.push(this.serviceDetails_Invoice);
            }
            this.SetDetailsCheck_Invoice(this.serviceDetails_Invoice);
          });
        }
      }
      // else
      // {
      //   this._invoiceService.GetServicesPriceVouByParentIdAndInvoiceId(element.AccJournalid,this.InvoicePublicView.invoiceId).subscribe(data=>{
      //     this.serviceDetails_Invoice = data.result;
      //     debugger
      //     var Check=true;
      //     if(this.ListDataServices_Invoice.length>0)
      //     {
      //       for (let ele of this.ListDataServices_Invoice) {
      //         var val = ele.filter((a: { parentId: any; })=>a.parentId==element.AccJournalid);
      //         if(val.length==0){Check=false;}
      //         else{Check=true;break;}
      //      }
      //     }
      //     else{Check=false;}

      //     if(Check==false){
      //       this.ListDataServices_Invoice.push(this.serviceDetails_Invoice);
      //     }
      //     this.serviceDetails_Invoice.sort((a: { lineNumber: number; },b: { lineNumber: number; }) => (a.lineNumber??0) - (b.lineNumber??0)); // b - a for reverse sort
      //   });
      // }
    }
  }


  SureServiceList_Invoice:any=[];
  MarkServiceDetails_Invoice(item:any){
    if(item?.SureService==1) item.SureService=0;
    else item.SureService=1;
    this.SureServiceList_Invoice.push(item);
  }
  UnMarkServiceDetails_Invoice(item:any){
    if(item?.SureService==1) item.SureService=0;
    else item.SureService=1;
    if(this.SureServiceList_Invoice.length>0)
    {
      let index = this.SureServiceList_Invoice.findIndex((d: { servicesId: any; }) => d.servicesId == item.servicesId);
      if(index!=-1)
      {
        this.SureServiceList_Invoice.splice(index, 1);
      }
    }
  }
  RemoveServicesparent_invoice(ele:any){
    {
      debugger
      var TempService=this.ListDataServices_Invoice;
      this.ListDataServices_Invoice=[];
      let newArray = this.SureServiceList_Invoice.filter((d: { parentId: any; }) => d.parentId != ele.AccJournalid);
      TempService.forEach((element: any) => {
        let newArray2 = element.filter((d: { parentId: any; }) => d.parentId != ele.AccJournalid);
        if(newArray2.length>0)
        {
          this.ListDataServices_Invoice.push(newArray2);
        }
      });
      this.SureServiceList_Invoice=newArray;
    }
  }
  SetDetailsCheck_Invoice(item:any){
    item.forEach((element: any) => {
      let filteritem = this.SureServiceList_Invoice.filter((d: { servicesId: any; }) => d.servicesId == element.servicesId);
      if(filteritem.length>0)
      {
        element.SureService=1;
      }
    });
  }
  serviceDetails_Invoice: any=[];

  drop_Invoice(event: CdkDragDrop<string[]>) {
    debugger
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    var TempService=this.ListDataServices_Invoice;
    this.ListDataServices_Invoice=[];

    TempService.forEach((element: any) => {
      let newArray2 = element.filter((d: { parentId: any; }) => d.parentId != this.serviceDetails_Invoice[0].parentId);
      if(newArray2.length>0)
      {
        this.ListDataServices_Invoice.push(newArray2);
      }
    });
    this.ListDataServices_Invoice.push(this.serviceDetails_Invoice);
    }


  //#endregion

    //-----------------------------------Storehouse------------------------------------------------
  //#region 

  dataAdd: any = {
    Storehouse: {
      id: 0,
      nameAr: null,
      nameEn: null,
    },
    ServiceType: {
      id: 0,
      nameAr: null,
      nameEn: null,
    },
  }
  Storehouse: any;
  StorehousePopup: any;

  FillStorehouseSelect() {
    this.Storehouse = [];
    this.StorehousePopup = [];
    this._debentureService.FillStorehouseSelect().subscribe((data) => {
      this.Storehouse = data;
      this.StorehousePopup = data;
    });
  }
  StorehouseRowSelected: any;
  getStorehouseRow(row: any) {
    this.StorehouseRowSelected = row;
  }
  setStorehouseInSelect(data: any, model: any) {
    this.modalInvoice.storehouseId = data.id;
  }
  resetStorehouse() {
    this.dataAdd.Storehouse.id = 0;
    this.dataAdd.Storehouse.nameAr = null;
    this.dataAdd.Storehouse.nameEn = null;
  }
  saveStorehouse() {
    if (
      this.dataAdd.Storehouse.nameAr == null ||
      this.dataAdd.Storehouse.nameEn == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    var StorehouseObj: any = {};
    StorehouseObj.StorehouseId = this.dataAdd.Storehouse.id;
    StorehouseObj.NameAr = this.dataAdd.Storehouse.nameAr;
    StorehouseObj.NameEn = this.dataAdd.Storehouse.nameEn;
    this._debentureService
      .SaveStorehouse(StorehouseObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.resetStorehouse();
          this.FillStorehouseSelect();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  confirmStorehouseDelete() {
    this._debentureService
      .DeleteStorehouse(this.StorehouseRowSelected.id)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),this.translate.instant('Message')
          );
          this.FillStorehouseSelect();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),this.translate.instant('Message')
          );
        }
      });
  }
  //#endregion
  //----------------------------------(End)-Storehouse---------------------------------------------

    //-----------------------------------ServiceType------------------------------------------------
  //#region 

  ServiceType: any;
  ServiceTypePopup: any;

  FillServiceTypesSelect() {
    this.ServiceType = [];
    this.ServiceTypePopup = [];
    this._invoiceService.FillServiceTypesSelect().subscribe((data) => {
      this.ServiceType = data;
      this.ServiceTypePopup = data;
    });
  }
  ServiceTypeRowSelected: any;
  getServiceTypeRow(row: any) {
    this.ServiceTypeRowSelected = row;
  }
  setServiceTypeInSelect(data: any, model: any) {
    this.SerivceModalForm.controls["ServiceType"].setValue(data.id)
  }
  resetServiceType() {
    this.dataAdd.ServiceType.id = 0;
    this.dataAdd.ServiceType.nameAr = null;
    this.dataAdd.ServiceType.nameEn = null;
  }
  saveServiceType() {
    if (
      this.dataAdd.ServiceType.nameAr == null ||
      this.dataAdd.ServiceType.nameEn == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    var ServiceTypeObj: any = {};
    ServiceTypeObj.ServiceTypeId = this.dataAdd.ServiceType.id;
    ServiceTypeObj.NameAr = this.dataAdd.ServiceType.nameAr;
    ServiceTypeObj.NameEn = this.dataAdd.ServiceType.nameEn;
    this._invoiceService.SaveServiceType(ServiceTypeObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.resetServiceType();
          this.FillServiceTypesSelect();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  confirmServiceTypeDelete() {
    this._invoiceService.DeleteServiceType(this.ServiceTypeRowSelected.id).subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),this.translate.instant('Message')
          );
          this.FillServiceTypesSelect();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),this.translate.instant('Message')
          );
        }
      });
  }
  //#endregion
  //----------------------------------(End)-ServiceType---------------------------------------------

  //----------------------------ServicePrice----------------------------
  //#region
  ServiceTypelist = [
    { id: 1, name: 'قطعة' },
    { id: 2, name: 'وحدة' },
  ];

  CostCenterSelectlist: any = [];
  ServiceAccountlist: any = [];
  ServiceAccountPurlist: any = [];
  FillCostCenterSelect_Service() {
    this._accountsreportsService.FillCostCenterSelect().subscribe((data) => {
      this.CostCenterSelectlist = data;
    });
  }
  FillServiceAccount() {
    this._accountsreportsService.FillServiceAccount().subscribe((data) => {
      this.ServiceAccountlist = data;
    });
  }
  FillServiceAccountPurchase() {
    this._accountsreportsService.FillSubAccountLoad().subscribe(data => {
      this.ServiceAccountPurlist = data.result;
    });
  }
  packageList: any = [];
  FillPackagesSelect() {
    this._accountsreportsService.FillPackagesSelect().subscribe((data) => {
      this.packageList = data;
    });
  }
  ProjectTypeList: any = [];
  SubprojecttypeList: any = [];
  ProjectTypeId: any;
  SubprojecttypeId: any;
  ServiceName: any;
  FillProjectTypeSelectService() {
    this._accountsreportsService.FillProjectTypeSelect().subscribe((data) => {
      this.ProjectTypeList = data;
    });
  }
  FillProjectSubTypesSelectService(id: any) {
    this._accountsreportsService
      .FillProjectSubTypesSelect(id)
      .subscribe((data) => {
        this.SubprojecttypeList = data;
      });
  }

  projectsDataSourceTemp: any = [];
  DataSource: any = [];

  SerivceModalForm: FormGroup;
  SerivceModalDetails: any;

  intialModelBranchOrganization() {
    this.SerivceModalForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      ProjectType: [null, [Validators.required]],
      SubprojectType: [null, [Validators.required]],
      ServiceName: [null, [Validators.required]],
      ServiceNameEN: [null, [Validators.required]],
      ServiceType: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      costCenter: [null, [Validators.required]],
      ServiceRevenueAccount: [null, [Validators.required]],
      nameAccount: [null, [Validators.required]],
      PackageId: [null, [Validators.required]],

      AmountPur: [null, [Validators.required]],
      AccountIdPur: [null, [Validators.required]],
      Begbalance: [null],
      SerialNumber: [null],
      ItemCode: [null, [Validators.required]],
      storehouseId: [null, [Validators.required]],

    });
  }

  details: any = [];

  SaveServicePriceWithDetails(modal?: any) {
    this.ServiceAccountlist.forEach((element: any) => {
      if (
        this.SerivceModalForm.controls['ServiceRevenueAccount'].value ==
        element.id
      ) {
        this.SerivceModalForm.controls['nameAccount'].setValue(element.name);
      }
    });
    if (this.SerivceModalForm.controls['id'].value != 0) {
      this.details = [];
    } else {
      this.details.forEach((element: any) => {
        element.servicesId = 0;
      });
    }

    const params = {
      services_price: {
        AccountId: this.SerivceModalForm.controls["ServiceRevenueAccount"].value,
        accountName: 'ايرادات',
        Amount: Number(this.SerivceModalForm.controls["amount"].value),
        // CostCenterId: this.SerivceModalForm.controls["costCenter"].value,
        // PackageId: this.SerivceModalForm.controls["PackageId"].value,
        // ProjectId: this.SerivceModalForm.controls["ProjectType"].value,
        // ProjectSubTypeID: this.SerivceModalForm.controls["SubprojectType"].value,
        ServiceName_EN: this.SerivceModalForm.controls["ServiceNameEN"].value,
        ServiceType: this.SerivceModalForm.controls["ServiceType"].value,
        ServicesId: this.SerivceModalForm.controls["id"].value,
        servicesName: this.SerivceModalForm.controls["ServiceName"].value,

        amountPur: this.SerivceModalForm.controls["AmountPur"].value,
        accountIdPur: this.SerivceModalForm.controls["AccountIdPur"].value,
        begbalance: this.SerivceModalForm.controls["Begbalance"].value,
        serialNumber: this.SerivceModalForm.controls["SerialNumber"].value,
        itemCode: this.SerivceModalForm.controls["ItemCode"].value,
        storehouseId: this.SerivceModalForm.controls["storehouseId"].value,

      },
      details: this.details,
    };

    this._accountsreportsService
      .SaveServicePriceWithDetails(params)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          // this.GetAllServicesPrice()
          modal.dismiss();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  AllProjectTypelist: any = [];
  GetAllProjectType() {
    this._accountsreportsService.GetAllProjectType().subscribe((data) => {
      this.AllProjectTypelist = data;
    });
  }
  applyFilterProjectType(event: any) {
    const val = event.target.value.toLowerCase();
    this._accountsreportsService.GetAllProjectType(val).subscribe((data) => {
      this.AllProjectTypelist = [];
      this.AllProjectTypelist = data.result;
    });
  }
  TypeId: any = '0';
  ProjectTypenameEn: any;
  ProjectTypenameAr: any;
  SaveProjectType() {
    if (this.ProjectTypenameEn != null && this.ProjectTypenameAr != null) {
      const prames = {
        TypeId: this.TypeId.toString(),
        NameEn: this.ProjectTypenameEn,
        NameAr: this.ProjectTypenameAr,
      };
      this._accountsreportsService.SaveProjectType(prames).subscribe(
        (data) => {
          this.ProjectTypenameEn = null;
          this.ProjectTypenameAr = null;
          this.TypeId = '0';
          this.FillProjectTypeSelectService();
          this.GetAllProjectType();
          this.toast.success(data.reasonPhrase,this.translate.instant("Message"));
        },
        (error) => {
          this.toast.error(error.reasonPhrase,this.translate.instant("Message"));
        }
      );
    }
  }
  updateProjectType(group: any) {
    this.TypeId = group.typeId;
    this.ProjectTypenameEn = group.nameEn;
    this.ProjectTypenameAr = group.nameAr;
  }
  pTypeId: any;

  DeleteProjectType(modal?: any) {
    this._accountsreportsService.DeleteProjectType(this.pTypeId).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.toast.success(data.reasonPhrase,this.translate.instant("Message"));
          this.FillProjectTypeSelectService();
          this.GetAllProjectType();
          this.pTypeId = null;
          modal.dismiss();
        }
      },
      (error) => {
        this.pTypeId = null;
        this.toast.error(error.reasonPhrase,this.translate.instant("Message"));
      }
    );
  }

  AllProjectSubsByProjectTypelist: any = [];
  GetAllProjectSubsByProjectTypeId(search?: any) {
    this._accountsreportsService
      .GetAllProjectSubsByProjectTypeId(
        search,
        this.SerivceModalForm.controls['ProjectType'].value
      )
      .subscribe((data) => {
        this.AllProjectSubsByProjectTypelist = data;
      });
  }
  applyFilterSubsByProjectTypeId(event: any) {
    const val = event.target.value.toLowerCase();
    this._accountsreportsService
      .GetAllProjectSubsByProjectTypeId(
        val,
        this.SerivceModalForm.controls['ProjectType'].value
      )
      .subscribe((data) => {
        this.AllProjectSubsByProjectTypelist = [];
        this.AllProjectSubsByProjectTypelist = data.result;
      });
  }

  SubTypeId: any = '0';
  SubprojectTypenameEn: any;
  SubprojectTypenameAr: any;
  TimePeriodStr: any;
  SaveSubprojectType() {
    if (
      this.SubprojectTypenameEn != null &&
      this.SubprojectTypenameAr != null
    ) {
      const prames = {
        SubTypeId: this.SubTypeId.toString(),
        NameEn: this.SubprojectTypenameEn,
        NameAr: this.SubprojectTypenameAr,
        ProjectTypeId: this.SerivceModalForm.controls['ProjectType'].value,
        TimePeriod: this.TimePeriodStr,
      };
      this._accountsreportsService.SaveProjectSubType(prames).subscribe(
        (data) => {
          this.TimePeriodStr = null;
          this.SubprojectTypenameAr = null;
          this.SubprojectTypenameEn = null;
          this.SubTypeId = '0';
          this.FillProjectSubTypesSelectService(
            this.SerivceModalForm.controls['ProjectType'].value
          );
          this.GetAllProjectSubsByProjectTypeId();
          this.toast.success(data.reasonPhrase,this.translate.instant("Message"));
        },
        (error) => {
          this.toast.error(error.reasonPhrase,this.translate.instant("Message"));
        }
      );
    }
  }
  updateSubprojectType(group: any) {
    this.SubTypeId = group.subTypeId;
    this.SubprojectTypenameEn = group.nameEn;
    this.TimePeriodStr = group.timePeriod;
    this.SubprojectTypenameAr = group.nameAr;
  }
  psubTypeId: any;

  DeleteProjectSubTypes(modal?: any) {
    this._accountsreportsService
      .DeleteProjectSubTypes(this.psubTypeId)
      .subscribe(
        (data) => {
          if (data.statusCode == 200) {
            this.toast.success(data.reasonPhrase,this.translate.instant("Message"));
            this.FillProjectSubTypesSelectService(
              this.SerivceModalForm.controls['ProjectType'].value
            );
            this.GetAllProjectSubsByProjectTypeId();
            this.psubTypeId = null;
            modal.dismiss();
          }
        },
        (error) => {
          this.psubTypeId = null;
          this.toast.error(error.reasonPhrase,this.translate.instant("Message"));
        }
      );
  }

  ChangeProjectType() {
    if (this.SerivceModalForm.controls['ProjectType'].value) {
      this.FillProjectSubTypesSelectService(
        this.SerivceModalForm.controls['ProjectType'].value
      );
    } else {
      this.SubprojecttypeList = [];
    }
  }

  AllPackageslist: any = [];
  GetAllPackages() {
    this._accountsreportsService.GetAllPackages().subscribe((data) => {
      this.AllPackageslist = data.result;
    });
  }
  applyFilterPackages(event: any) {
    const val = event.target.value.toLowerCase();
    this._accountsreportsService.GetAllPackages(val).subscribe((data) => {
      this.AllPackageslist = [];
      this.AllPackageslist = data.result;
    });
  }

  PackageId: any = '0';
  PackageName: any;
  MeterPrice1: any;
  MeterPrice2: any;
  MeterPrice3: any;
  PackageRatio1: any;
  PackageRatio2: any;
  PackageRatio3: any;
  SavePackages() {
    if (
      this.PackageName != null &&
      this.MeterPrice1 != null &&
      this.MeterPrice2 != null &&
      this.MeterPrice3 != null &&
      this.PackageRatio1 != null &&
      this.PackageRatio2 != null &&
      this.PackageRatio3 != null
    ) {
      const prames = {
        PackageId: this.PackageId.toString(),
        PackageName: this.PackageName,
        MeterPrice3: this.MeterPrice3,
        MeterPrice2: this.MeterPrice2,
        MeterPrice1: this.MeterPrice1,
        PackageRatio1: this.PackageRatio1,
        PackageRatio2: this.PackageRatio2,
        PackageRatio3: this.PackageRatio3,
      };
      this._accountsreportsService.SavePackage(prames).subscribe(
        (data) => {
          this.PackageName = null;
          this.MeterPrice1 = null;
          this.MeterPrice2 = null;
          this.MeterPrice3 = null;
          this.PackageRatio1 = null;
          this.PackageRatio2 = null;
          this.PackageRatio3 = null;
          this.PackageId = '0';
          this.FillPackagesSelect();
          this.GetAllPackages();
          this.toast.success(data.reasonPhrase,this.translate.instant("Message"));
        },
        (error) => {
          this.toast.error(error.reasonPhrase,this.translate.instant("Message"));
        }
      );
    }
  }
  updatePackages(group: any) {
    this.PackageId = group.packageId;
    this.PackageName = group.packageName;
    this.MeterPrice1 = group.meterPrice1;
    this.MeterPrice2 = group.meterPrice2;
    this.MeterPrice3 = group.meterPrice3;
    this.PackageRatio1 = group.packageRatio1;
    this.PackageRatio2 = group.packageRatio2;
    this.PackageRatio3 = group.packageRatio3;
  }
  PackageIdD: any;

  DeletePackages(modal?: any) {
    this._accountsreportsService.DeletePackage(this.PackageIdD).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.toast.success(data.reasonPhrase,this.translate.instant("Message"));
          this.FillPackagesSelect();
          this.GetAllPackages();
          this.PackageIdD = null;
          modal.dismiss();
        }
      },
      (error) => {
        this.PackageIdD = null;
        this.toast.error(error.reasonPhrase,this.translate.instant("Message"));
      }
    );
  }

  AllcostCenterlist: any = [];
  GetAllcostCenter() {
    if (this.SerivceModalForm.controls['id'].value != 0) {
      this._accountsreportsService
        .GetServicesPriceByParentId(this.SerivceModalForm.controls['id'].value)
        .subscribe((data) => {
          this.AllcostCenterlist = data.result;
        });
    }
  }

  servicesId: any = '0';
  accountName: any;
  servicesName: any;
  SavecostCenter() {
    if (this.accountName != null && this.servicesName != null) {
      if (this.SerivceModalForm.controls['id'].value == 0) {
        var obj = this.details.filter((ele: any) => {
          return ele.servicesId == this.servicesId;
        });
        if (obj.length > 0) {
          this.details.forEach((element: any) => {
            if (obj[0].servicesId == element.servicesId) {
              element.accountName = this.accountName;
              element.servicesName = this.servicesName;
              return;
            }
          });
          this.servicesId = 0;
          this.accountName = null;
          this.servicesName = null;
          return;
        }
        this.details.push({
          servicesId: this.details.length + 1,
          accountName: this.accountName,
          servicesName: this.servicesName,
          ParentId: this.SerivceModalForm.controls['id'].value,
        });
        this.AllcostCenterlist = [];
        this.AllcostCenterlist = this.details;
        this.accountName = null;
        this.servicesName = null;
      } else {
        const prames = {
          servicesId: this.servicesId ?? 0,
          accountName: this.accountName,
          servicesName: this.servicesName,
          ParentId: this.SerivceModalForm.controls['id'].value,
        };
        this._accountsreportsService.SaveServicesPrice(prames).subscribe(
          (data) => {
            this.accountName = null;
            this.servicesName = null;
            this.servicesId = '0';
            this.GetAllcostCenter();
            this.toast.success(data.reasonPhrase,this.translate.instant("Message"));
          },
          (error) => {
            this.toast.error(error.reasonPhrase,this.translate.instant("Message"));
          }
        );
      }
    }
  }
  updatecostCenter(group: any) {
    this.servicesId = group.servicesId;
    this.accountName = group.accountName;
    this.servicesName = group.servicesName;
  }
  ServicesPriceId: any;
  ServicesPriceIdindex: any;
  DeleteService(modal?: any) {
    if (this.SerivceModalForm.controls['id'].value == 0) {
      this.details.splice(this.ServicesPriceIdindex, 1);
      this.AllcostCenterlist = [];
      this.AllcostCenterlist = this.details;
      modal.dismiss();
    } else {
      this._accountsreportsService
        .DeleteService(this.ServicesPriceId)
        .subscribe(
          (data) => {
            if (data.statusCode == 200) {
              this.toast.success(data.reasonPhrase,this.translate.instant("Message"));
              this.GetAllcostCenter();
              this.ServicesPriceId = null;
              modal.dismiss();
            }
          },
          (error) => {
            this.ServicesPriceId = null;
            this.toast.error(error.reasonPhrase,this.translate.instant("Message"));
          }
        );
    }
  }

  AllTotalSpacesRangelist: any = [];
  GetAllTotalSpacesRange() {
    this._accountsreportsService.GetAllTotalSpacesRange().subscribe((data) => {
      this.AllTotalSpacesRangelist = data.result;
    });
  }
  applyFilterTotalSpacesRange(event: any) {
    const val = event.target.value.toLowerCase();
    this._accountsreportsService
      .GetAllTotalSpacesRange(val)
      .subscribe((data) => {
        this.AllTotalSpacesRangelist = [];
        this.AllTotalSpacesRangelist = data.result;
      });
  }
  TotalSpacesRangeId: any = '0';
  rangeName: any;
  RangeValue: any;
  SaveTotalSpacesRange() {
    if (this.rangeName != null && this.RangeValue != null) {
      const prames = {
        TotalSpacesRangeId: this.TotalSpacesRangeId.toString(),
        TotalSpacesRengeName: this.rangeName,
        RangeValue: this.RangeValue,
      };
      this._accountsreportsService.SaveTotalSpacesRange(prames).subscribe(
        (data) => {
          this.rangeName = null;
          this.RangeValue = null;
          this.TotalSpacesRangeId = '0';
          this.GetAllTotalSpacesRange();
          this.toast.success(data.reasonPhrase,this.translate.instant("Message"));
        },
        (error) => {
          this.toast.error(error.reasonPhrase,this.translate.instant("Message"));
        }
      );
    }
  }
  updateTotalSpacesRange(group: any) {
    this.TotalSpacesRangeId = group.totalSpacesRangeId;
    this.rangeName = group.totalSpacesRengeName;
    this.RangeValue = group.rangeValue;
  }
  DTotalSpacesRangeId: any;

  deleteTotalSpaces(modal?: any) {
    this._accountsreportsService
      .DeleteTotalSpacesRange(this.DTotalSpacesRangeId)
      .subscribe(
        (data) => {
          if (data.statusCode == 200) {
            this.toast.success(data.reasonPhrase,this.translate.instant("Message"));
            this.GetAllTotalSpacesRange();
            this.DTotalSpacesRangeId = null;
            modal.dismiss();
          }
        },
        (error) => {
          this.pTypeId = null;
          this.toast.error(error.reasonPhrase,this.translate.instant("Message"));
        }
      );
  }

  AllFloorslist: any = [];
  GetAllFloorsService() {
    this._accountsreportsService.GetAllFloors().subscribe((data) => {
      this.AllFloorslist = data.result;
    });
  }
  applyFilterFloor(event: any) {
    const val = event.target.value.toLowerCase();
    this._accountsreportsService.GetAllFloors(val).subscribe((data) => {
      this.AllFloorslist = [];
      this.AllFloorslist = data.result;
    });
  }
  FloorId: any = '0';
  FloorName: any;
  FloorRatio: any;
  SaveFloor() {
    if (this.FloorName != null && this.FloorRatio != null) {
      const prames = {
        FloorId: this.FloorId.toString(),
        FloorName: this.FloorName,
        FloorRatio: this.FloorRatio,
      };
      this._accountsreportsService.SaveFloor(prames).subscribe(
        (data) => {
          this.FloorName = null;
          this.FloorRatio = null;
          this.FloorId = '0';
          this.GetAllFloorsService();
          this.toast.success(data.reasonPhrase,this.translate.instant("Message"));
        },
        (error) => {
          this.toast.error(error.reasonPhrase,this.translate.instant("Message"));
        }
      );
    }
  }
  updatefloor(group: any) {
    this.FloorId = group.floorId;
    this.FloorName = group.floorName;
    this.FloorRatio = group.floorRatio;
  }
  DFloors: any;
  DeleteFloor(modal?: any) {
    this._accountsreportsService.DeleteFloor(this.DFloors).subscribe(
      (data) => {
        if (data.result.statusCode == 200) {
          this.GetAllFloorsService();
          this.toast.success(data.reasonPhrase,this.translate.instant("Message"));
          this.DFloors = null;
          modal.dismiss();
        }
      },
      (error) => {
        this.DFloors = null;
        this.toast.error(error.reasonPhrase,this.translate.instant("Message"));
      }
    );
  }
  //#endregion
  //--------------------------End--ServicePrice----------------------------


}
