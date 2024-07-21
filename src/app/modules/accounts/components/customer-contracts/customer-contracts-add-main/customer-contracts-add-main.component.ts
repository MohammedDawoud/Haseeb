import {Component,OnInit,Input,ViewChild,AfterViewInit,TemplateRef, ViewEncapsulation,} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SelectionModel } from '@angular/cdk/collections';

import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateFormatterService, DateType } from 'ngx-hijri-gregorian-datepicker';
import { ContractsVM } from 'src/app/core/Classes/ViewModels/contractsVM';
import { ContractService } from 'src/app/core/services/acc_Services/contract.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { environment } from 'src/environments/environment';
import { FollowprojectService } from 'src/app/core/services/pro_Services/followproject.service';
import { MatStepper } from '@angular/material/stepper';
import {CdkDragDrop,CdkDrag,CdkDropList,CdkDropListGroup,moveItemInArray,transferArrayItem,} from '@angular/cdk/drag-drop';

import 'hijri-date';
const hijriSafe= require('hijri-date/lib/safe');
const HijriDate =  hijriSafe.default;
const toHijri  = hijriSafe.toHijri;


@Component({
  selector: 'app-customer-contracts-add-main',
  templateUrl: './customer-contracts-add-main.component.html',
  styleUrls: ['./customer-contracts-add-main.component.scss'],

  encapsulation: ViewEncapsulation.None
})
export class CustomerContractsAddMainComponent implements OnInit {
  @Input() contractAdd: any;
  userG : any = {};
  Date1:any=new Date();
  constructor(private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private _sharedService: SharedService,
    private _formBuilder: FormBuilder,
    private toast: ToastrService,
    private _contractService: ContractService,
    private _followprojectService: FollowprojectService,
    private dateFormatterSev: DateFormatterService,
    private translate: TranslateService,) {
      this.userG = this.authenticationService.userGlobalObj;
      console.log(this.userG);
    }
    ngOnInit(): void {
      console.log(this.contractAdd);
      this.SetContractDefData();
    }

    closeResult = '';

    open(content: any, data?: any, type?: any, idRow?: any) {
      // if(data!=null)
      // {
      //   this.ContractRowSelected=data;
      // }

      // if (idRow != null) {
      //   this.selectedServiceRowContractNew = idRow;
      // }
      // if (data && (type == 'ContractValueEdit')) {
      //   this.editContract(data);
      //   this.ContractPopupAddorEdit=1;
      // }

      if (idRow != null) {
        this.selectedServiceRowContractNew = idRow;
      }
      if (type == 'serviceDetails' && data) {
        this.GetServicesPriceByParentId(data);
      }

      else if(type=="servicesList_Contract")
      {
        this.GetAllServicesPrice_ContractNew();
      }



      this.modalService
        .open(content, {
          ariaLabelledBy: 'modal-basic-title',
          size: type
            ? type == 'contract' || type == 'file' || type == 'contracts'
              ? 'md'
              : 'xl'
            : 'lg',
          centered: type ? (type == 'contracts' ? true : false) : true,
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


    contractWithInstallments = false;

    offerServices: any = [];
    serviceListDataSource = new MatTableDataSource();

    servicesList: any;
    servicesListdisplayedColumns: string[] = ['name', 'price'];

    selectedServiceRow: any;

    serviceDetails: any=[];

    participants: any = [];

    step1NextBtnClick_Des(){
      const prames = {
        ContractNo: this.FormGroup01.controls['ContractNo'].value,
        Date: this.FormGroup01.controls['ContractDate'].value,
        HijriDate: this.FormGroup01.controls['ContractHijriDate'].value,
        aaaaa: this.FormGroup01.controls['Org_CompanyName'].value,
        bbbbb: this.FormGroup01.controls['OrgEmpId'].value,
        eeeee: this.FormGroup01.controls['OrgEmpJob'].value,
        Engineering_License: this.FormGroup01.controls['Engineering_License'].value,
        Engineering_LicenseDate: this.FormGroup01.controls['Engineering_LicenseDate'].value,
        CustomerId: this.FormGroup01.controls['ContractCustSelectId'].value,
        ProjectId: this.FormGroup01.controls['ContractProjSelectId'].value,
        ccccc: this.FormGroup01.controls['customerIdtxt'].value,
        ddddd: this.FormGroup01.controls['OfferSelectid'].value,
      }
      console.log(prames);
    }


    ContractModalCustom:any={
      ContractType:null, //1-df3at 2 -2asat 3-astshary 4-ashraf 5-tsmem
      OrgEmpJobId:null,
      Org_CompanyID:null,
      OfferSelectidFlag:false,
      //------------------------------
      ContractTypeSelectId:null,
      InvoiceNumDiv:false,
      InvoiceId:null,
      InvoiceNumber:null,
      //------------------------------
      ContSup1Div:null,
      ContSup2Div:null,
    }

    FormGroup01: FormGroup;
    FormGroup02: FormGroup;
    FormGroup03: FormGroup;
    FormGroup04: FormGroup;

    DisabledBtn(){
      this.FormGroup01.controls['ContractHijriDate'].disable();
      this.FormGroup01.controls['Org_CompanyName'].disable();
      this.FormGroup01.controls['OrgEmpJob'].disable();
      this.FormGroup01.controls['Engineering_License'].disable();
      this.FormGroup01.controls['Engineering_LicenseDate'].disable();
      this.FormGroup01.controls['customerIdtxt'].disable();

      this.FormGroup02.controls['InvoiceAmount'].disable();
      this.FormGroup02.controls['InvoiceAmountB'].disable();

    }
    SetContractDefData(){
      debugger
      this.ListDataServices=[];
      this.SureServiceList=[];

      this.ContractModalCustom.ContractType=this.contractAdd.ContractType;
      if(this.ContractModalCustom.ContractType==1)//df3at
      {
        this.ContractModalCustom.ContSup1Div=false;
        this.ContractModalCustom.ContSup2Div=false;
      }
      else if(this.ContractModalCustom.ContractType==2)//2asat
      {
        this.ContractModalCustom.ContSup1Div=false;
        this.ContractModalCustom.ContSup2Div=false;
      }
      else if(this.ContractModalCustom.ContractType==3)//astshary
      {
        this.ContractModalCustom.ContSup1Div=false;
        this.ContractModalCustom.ContSup2Div=false;
      }
      else if(this.ContractModalCustom.ContractType==4)//ashraf
      {
        this.ContractModalCustom.ContSup1Div=true;
        this.ContractModalCustom.ContSup2Div=true;
      }
      else if(this.ContractModalCustom.ContractType==5)//tsmem
      {
        this.ContractModalCustom.ContSup1Div=false;
        this.ContractModalCustom.ContSup2Div=false;
      }
      else{ //dof3at
        this.ContractModalCustom.ContSup1Div=false;
        this.ContractModalCustom.ContSup2Div=false;
        this.ContractModalCustom.ContractType=1;
      }

      this.ContractModalCustom.Org_CompanyID=this.userG?.companyID;
      this.intialForms(this.contractAdd.CustomerId,this.contractAdd.ProjectId);

      if(this.contractAdd.CustomerId!=null){
        this.ChangeCustomerSelect_2();
        this.FormGroup01.controls['ContractCustSelectId'].disable();
      }
      if(this.contractAdd.ProjectId!=null){
        this.GetInvoiceIDByProjectID();
        this.FormGroup01.controls['ContractProjSelectId'].disable();
      }

      this.DisabledBtn();
      this.GenerateContractNumberByType();
      this.GetBranchOrganization();
      this.resetContractDataList();
      this.FillEmployeeSelect();
      this.FillCustomerSelect();
    }

    resetContractDataList(){
      this.LoadEmployeeSelect=[];
      this.LoadCustomerSelectWProC=[];
      this.Loadprojects=[];
      this.LoadofferPrice=[];
      this.bands=[];
      this.CustomerPaymentList=[];
    }

    intialForms(customerId:any,projectid:any) {
      const DateHijri =toHijri(new Date());
      var DateGre = new HijriDate(DateHijri._year, DateHijri._month, DateHijri._date);
      DateGre._day=DateGre._date;
      this.selectedHijriDate=DateGre;

      this.FormGroup01 = this._formBuilder.group({
        //ContractNo: [null],
        ContractNo: [null, [Validators.required]],
        ContractDate: [new Date()],
        ContractHijriDate: [null],
        Org_CompanyName: [this.userG?.companyName],
        OrgEmpId: [null, [Validators.required]],
        OrgEmpJob: [null],
        Engineering_License: [null],
        Engineering_LicenseDate: [null],
        ContractCustSelectId: [customerId, [Validators.required]],
        ContractProjSelectId: [projectid, [Validators.required]],
        customerIdtxt: [null],
        OfferSelectid: [null],
        check:[false],
      });
      this.FormGroup02 = this._formBuilder.group({
        ContractTypeSelectId: [null],
        InvoiceAmount: [null],
        InvoiceAmountB: [null],
      });

      this.FormGroup03 = this._formBuilder.group({
        ContractId: [null, [Validators.required]],
      });

      this.FormGroup04 = this._formBuilder.group({

      });
    }

    selectedHijriDate: any;
    ChangeContractHijri(event:any){
      if(event!=null)
      {
        const DateGre = new HijriDate(event.year, event.month, event.day);
        const dayGreg = DateGre.toGregorian();
        this.FormGroup01.controls['ContractDate'].setValue(dayGreg);
      }
      else{
        this.FormGroup01.controls['ContractDate'].setValue(null);
      }
    }
    ChangeContractGre(event:any){
      if(event!=null)
      {
        const DateHijri =toHijri(this.FormGroup01.controls['ContractDate'].value);
        var DateGre = new HijriDate(DateHijri._year, DateHijri._month, DateHijri._date);
        DateGre._day=DateGre._date;
        this.selectedHijriDate=DateGre;
      }
      else{
        this.selectedHijriDate=null;
      }
    }

    GetBranchOrganization(){
      this._contractService.GetBranchOrganization().subscribe(data=>{
        this.FormGroup01.controls['Engineering_License'].setValue(data.result.engineering_License);
        if(data.result.engineering_LicenseDate==null || data.result.engineering_LicenseDate=="null")
        {
          this.FormGroup01.controls['Engineering_LicenseDate'].setValue(null);
        }
        else
        {
          this.FormGroup01.controls['Engineering_LicenseDate'].setValue(this._sharedService.String_TO_date(data.result.engineering_LicenseDate));
        }
      });
    }
    GetEmployeeJob(){
      var EmpSelectId=this.FormGroup01.controls['OrgEmpId'].value;
      if(EmpSelectId!=null)
      {
        this._contractService.GetEmployeeJob(EmpSelectId).subscribe(data=>{
          this.ContractModalCustom.OrgEmpJobId=data.jobId;
          this.FormGroup01.controls['OrgEmpJob'].setValue(data.jobNameAr);
        });
      }
      else
      {
        this.ContractModalCustom.OrgEmpJobId=null;
        this.FormGroup01.controls['OrgEmpJob'].setValue(null);
      }
    }
    GetCustomersByCustomerId(){
      debugger
      var CustSelectId=this.FormGroup01.controls['ContractCustSelectId'].value;
      if(CustSelectId!=null)
      {
        this._contractService.GetCustomersByCustomerId(CustSelectId).subscribe(data=>{
          // this.FormGroup04.controls['Owner'].setValue(data.result.customerNameAr);
          if(data.result.customerTypeId==1)
          {
            this.FormGroup01.controls['customerIdtxt'].setValue(data.result.customerNationalId);
          }
          else if(data.result.customerTypeId==2)
          {
            this.FormGroup01.controls['customerIdtxt'].setValue(data.result.commercialRegister);
          }
          else
          {
            this.FormGroup01.controls['customerIdtxt'].setValue(null);
          }
        });
      }
      else
      {
        this.FormGroup01.controls['customerIdtxt'].setValue(null);
      }
    }
    FillCustomerSelect(){
      if(this.ContractModalCustom.ContractType==1)
      {
        this.FillCustomerSelectWProC();

      }
      else if(this.ContractModalCustom.ContractType==2)
      {
        this.FillCustomerSelectWProC();

      }
      else
      {

      }
    }
    GenerateContractNumberByType(){
      if(this.ContractModalCustom.ContractType==1){this.GenerateContractNumber();}
      else if(this.ContractModalCustom.ContractType==2){this.GenerateContractNumber2();}
      else if(this.ContractModalCustom.ContractType==3){ this.GenerateContractNumber3();}
      else if(this.ContractModalCustom.ContractType==4){this.GenerateContractNumber4();}
      else if(this.ContractModalCustom.ContractType==5){this.GenerateContractNumber5();}
      else{ this.GenerateContractNumber();}
    }
    GenerateContractNumber(){
      this._contractService.GenerateContractNumber().subscribe(data=>{
        this.FormGroup01.controls['ContractNo'].setValue(data.reasonPhrase);
      });
    }
    GenerateContractNumber2(){
      this._contractService.GenerateContractNumber2().subscribe(data=>{
        this.FormGroup01.controls['ContractNo'].setValue(data.reasonPhrase);
      });
    }
    GenerateContractNumber3(){
      this._contractService.GenerateContractNumber3().subscribe(data=>{
        this.FormGroup01.controls['ContractNo'].setValue(data.reasonPhrase);
      });
    }
    GenerateContractNumber4(){
      this._contractService.GenerateContractNumber4().subscribe(data=>{
        this.FormGroup01.controls['ContractNo'].setValue(data.reasonPhrase);
      });
    }
    GenerateContractNumber5(){
      this._contractService.GenerateContractNumber5().subscribe(data=>{
        this.FormGroup01.controls['ContractNo'].setValue(data.reasonPhrase);
      });
    }
    LoadEmployeeSelect:any;
    FillEmployeeSelect(){
      this._contractService.FillEmployeeSelect().subscribe(data=>{
        this.LoadEmployeeSelect=data;
      });
    }
    LoadCustomerSelectWProC:any;
    FillCustomerSelectWProC(){
      debugger
      this._contractService.FillCustomerSelectWProC().subscribe(data=>{
        this.LoadCustomerSelectWProC=data;
      });
    }
    FillCustomerSelectWProC3(){
      debugger
      this._contractService.FillCustomerSelectWProC3().subscribe(data=>{
        this.LoadCustomerSelectWProC=data;
      });
    }
    FillCustomerSelectWProC2(){
      debugger
      this._contractService.FillCustomerSelectWProC2().subscribe(data=>{
        this.LoadCustomerSelectWProC=data;
      });
    }
    Loadprojects:any;

    FillProjectSelectByCustomer(){
      debugger
      var CustSelectId=this.FormGroup01.controls['ContractCustSelectId'].value;
      if(CustSelectId!=null)
      {
        this._contractService.FillProjectSelectByCustomerId2(CustSelectId).subscribe(data=>{
          this.Loadprojects=data;
        });
      }
      else
      {
        this.Loadprojects=[];
      }
    }
    LoadofferPrice:any;

    FillAllOfferTodropdownOld(){
      var CustSelectId=this.FormGroup01.controls['ContractCustSelectId'].value;
      if(CustSelectId!=null)
      {
        this._contractService.FillAllOfferTodropdownOld(CustSelectId).subscribe(data=>{
          this.LoadofferPrice=data;
        });
      }
      else
      {
        this.LoadofferPrice=[];
      }
    }
    GetInvoiceIDByProjectID(){
      var ProSelectId=this.FormGroup01.controls['ContractProjSelectId'].value;
      if(ProSelectId!=null)
      {
        this._contractService.GetInvoiceIDByProjectID(ProSelectId).subscribe(data=>{
          if(data.result!=null)
          {
            debugger
            this.ContractModalCustom.InvoiceId=data.result?.invoiceId;
            this.ContractModalCustom.InvoiceNumDiv=true;
            this.ContractModalCustom.InvoiceNumber=data.result?.invoiceNumber;
            this.FormGroup02.controls['InvoiceAmount'].setValue(data.result?.totalAmount);
            this.FormGroup02.controls['InvoiceAmountB'].setValue(data.result?.amount);

          }
          else
          {
            this.ContractModalCustom.InvoiceId=null;
            this.ContractModalCustom.InvoiceNumDiv=false;
            this.ContractModalCustom.InvoiceNumber=null;
            this.FormGroup02.controls['InvoiceAmount'].setValue(null);
            this.FormGroup02.controls['InvoiceAmountB'].setValue(null);

          }
        });
      }
      else
      {
        this.ContractModalCustom.InvoiceId=null;
        this.ContractModalCustom.InvoiceNumDiv=false;
        this.ContractModalCustom.InvoiceNumber=null;
        this.FormGroup02.controls['InvoiceAmount'].setValue(null);
        this.FormGroup02.controls['InvoiceAmountB'].setValue(null);
      }
    }
    ChangeCustomerSelect(){
      this.Loadprojects=[];
      this.FormGroup01.controls['ContractProjSelectId'].setValue(null);
      this.GetCustomersByCustomerId();
      this.FillProjectSelectByCustomer();
      this.FillAllOfferTodropdownOld();
    }
    ChangeCustomerSelect_2(){
      this.Loadprojects=[];
      this.GetCustomersByCustomerId();
      this.FillProjectSelectByCustomer();
      this.FillAllOfferTodropdownOld();
    }
    GetProjectById(){
      debugger
      var ProSelectId=this.FormGroup01.controls['ContractProjSelectId'].value;
      if(ProSelectId!=null)
      {
        this._contractService.GetProjectById(ProSelectId).subscribe(data=>{
          debugger
          var element:any={
            projectId:data.result.projectId,
            projectNo:data.result.projectNo,
            contractValue:this.modalDetailsContractNew.total_amount,
            timeStr:data.result.timeStr,
            noOfDays:data.result.noOfDays
          }
          this.GetValueCalc(element);
        });
      }
    }

    // GetProjectDurationStr(from:any,to:any){
    //   this._contractService.GetProjectDurationStr(from,to).subscribe(data=>{
    //     this.FormGroup04.controls['ContPeriod'].setValue(data.reasonPhrase);
    //   });
    // }

    // GetProjectData(){
    //   var OrgEmpId=this.FormGroup01.controls['OrgEmpId'].value;
    //   if(OrgEmpId!=null){
    //     var val=this.LoadEmployeeSelect.filter((a: { id: any; })=>a.id==OrgEmpId)[0].name;
    //     this.FormGroup04.controls['Design_Consultant_Rep'].setValue(val);
    //   }
    //   this.GetProjectById();
    // }

    //--------------------------Form2-------------------------------



    ContractNewServices: any = [];

    addServiceContractNew() {
      var maxVal=0;
      if(this.ContractNewServices.length>0)
      {
        maxVal = Math.max(...this.ContractNewServices.map((o: { idRow: any; }) => o.idRow))
      }
      else{
        maxVal=0;
      }


      this.ContractNewServices?.push({
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

    deleteServiceContractNew(idRow: any) {
      let index = this.ContractNewServices.findIndex((d: { idRow: any; }) => d.idRow == idRow);
      this.ContractNewServices.splice(index, 1);
      this.CalculateTotal_ContractNew();
    }

    offerpriceChange(){
      debugger
      var stu2 =this.offerPriceChecked;
      var stu=this.FormGroup01.controls['check'].value;
      var OfferPriceNo=this.FormGroup01.controls['OfferSelectid'].value;
      if (OfferPriceNo !=null && stu == true) {
        this.ContractNewServices=[];
        this.GetOfferservicenByOfferIdNew(OfferPriceNo);
      }
      else {
        this.ContractNewServices=[];
        this.addServiceContractNew();
      }
    }

    selectedServiceRowContractNew: any;

    setServiceRowValue_ContractNew(element: any) {
      this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractNew)[0].AccJournalid = element.servicesId;
      this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractNew)[0].UnitConst = element.serviceTypeName;
      this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractNew)[0].QtyConst = 1;
      this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractNew)[0].accountJournaltxt = element.servicesName;
      this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractNew)[0].Amounttxt = element.amount;
      //this.SetAmountPackage(this.selectedServiceRowOffer, element);
      this.CalculateTotal_ContractNew();
    }

    setServiceRowValueNew_ContractNew(indexRow:any,item: any, Qty: any,servamount: any) {
      debugger
      this.addServiceContractNew();
      this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].AccJournalid = item.servicesId;
      this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].UnitConst = item.serviceTypeName;
      this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].QtyConst = Qty;
      this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].accountJournaltxt = item.name;
      this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].Amounttxt = servamount;
      this.CalculateTotal_ContractNew();
    }
    GetOfferservicenByOfferIdNew(OfferId:any){
      debugger
      this._contractService.GetOfferservicenByid(OfferId).subscribe(data=>{
        if(data.result.length>0)
        {
          data.result.forEach((element: any) => {
            this.modalDetailsContractNew.taxtype=element.taxType;
            this.GetServicesPriceByServiceId_ContractNew(element);
          });
        }
      });
    }

    GetServicesPriceByServiceId_ContractNew(offerdata:any){
      debugger
      this._contractService.GetServicesPriceByServiceId(offerdata.serviceId).subscribe(data=>{
        var maxVal=0;

        if(this.ContractNewServices.length>0)
        {
          maxVal = Math.max(...this.ContractNewServices.map((o: { idRow: any; }) => o.idRow))
        }
        else{
          maxVal=0;
        }
        this.setServiceRowValueNew_ContractNew(maxVal+1,data.result,offerdata.serviceQty,offerdata.serviceamountval);
      });
    }

    modalDetailsContractNew:any={
      taxtype:2,
      total_amount:null,
      ContractAmountBefore:null,
      total_amount_text:null,
    }
    resetmodalDetailsContractNew(){
      this.ContractNewServices=[];
      this.modalDetailsContractNew={
        taxtype:2,
        total_amount:null,
        ContractAmountBefore:null,
        total_amount_text:null,
      }
    }
    CalculateTotal_ContractNew() {
      this.CustomerPaymentList=[];
      var totalwithtaxes = 0;var totalAmount = 0;var totaltax = 0;var totalAmountIncludeT = 0;var vAT_TaxVal = parseFloat(this.userG.orgVAT??0);
      debugger
      this.ContractNewServices.forEach((element: any) => {
        var Value = parseFloat((element.Amounttxt??0).toString()).toFixed(2);
        var FVal = +Value * element.QtyConst;
        var FValIncludeT = FVal;
        var taxAmount = 0;
        var totalwithtax = 0;
        var TaxV8erS = parseFloat((+parseFloat((+Value * vAT_TaxVal).toString()).toFixed(2) / 100).toString()).toFixed(2);
        var TaxVS =parseFloat((+Value- +parseFloat((+Value/((vAT_TaxVal / 100) + 1)).toString()).toFixed(2)).toString()).toFixed(2);
        if (this.modalDetailsContractNew.taxtype == 2) {
            taxAmount = +TaxV8erS;
            totalwithtax = +parseFloat((+parseFloat(Value) + +parseFloat(TaxV8erS)).toString()).toFixed(2);
        }
        else {
            taxAmount=+TaxVS;
            FValIncludeT = +parseFloat((+parseFloat(Value).toFixed(2) - +TaxVS).toString()).toFixed(2);
            totalwithtax = +parseFloat(Value).toFixed(2);
        }
        this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==element.idRow)[0].taxAmounttxt= parseFloat(taxAmount.toString()).toFixed(2);
        this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==element.idRow)[0].TotalAmounttxt= parseFloat((totalwithtax * element.QtyConst).toString()).toFixed(2);

        totalwithtaxes += totalwithtax;
        totalAmount +=(FVal) ;
        totalAmountIncludeT += (totalwithtax);
        totaltax += taxAmount;
      });
      this.CalcSumTotal_ContractNew();
      //this.CalcOfferDet(1);
    }
    CalcSumTotal_ContractNew(){
      let sum=0;
      let sumbefore=0;

      this.ContractNewServices.forEach((element: any) => {
        sum= +sum + +parseFloat((element.TotalAmounttxt??0)).toFixed(2);
        sumbefore= +sumbefore + +parseFloat((element.Amounttxt??0)).toFixed(2);
      });
      this.modalDetailsContractNew.total_amount=parseFloat(sum.toString()).toFixed(2);
      this.modalDetailsContractNew.ContractAmountBefore=parseFloat(sumbefore.toString()).toFixed(2);
      this.ConvertNumToString_Contract(this.modalDetailsContractNew.total_amount);
    }
    ConvertNumToString_Contract(val:any){
      this._contractService.ConvertNumToString(val).subscribe(data=>{
        this.modalDetailsContractNew.total_amount_text=data?.reasonPhrase;
      });
    }
    applyFilterServiceList_ContractNew(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.serviceListDataSource_ContractNew.filter = filterValue.trim().toLowerCase();
    }

    serviceListDataSourceTemp_ContractNew:any=[];
    servicesList_ContractNew: any;
    serviceListDataSource_ContractNew = new MatTableDataSource();

    GetAllServicesPrice_ContractNew(){
      this._contractService.GetAllServicesPrice().subscribe(data=>{
          this.serviceListDataSource_ContractNew = new MatTableDataSource(data.result);
          this.servicesList_ContractNew=data.result;
          this.serviceListDataSourceTemp_ContractNew=data.result;
      });
    }

    GetServicesPriceByParentId_Old(element:any){
      this.serviceDetails=[];
      if(element.AccJournalid!=null)
      {
        this._contractService.GetServicesPriceVouByParentId(element.AccJournalid,element.offerId).subscribe(data=>{
          this.serviceDetails = data.result;
        });
      }
    }
    OfferPopupAddorEdit:any=0;//add offerprice
    ListDataServices:any=[];
    GetServicesPriceByParentId(element:any){
      this.serviceDetails=[];
      if(element.AccJournalid!=null)
      {
        if(this.OfferPopupAddorEdit==0)
        {
          this._contractService.GetServicesPriceByParentId(element.AccJournalid).subscribe(data=>{
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
            this.SetDetailsCheck(this.serviceDetails);
          });
        }
        // else
        // {
        //   this._contractService.GetServicesPriceVouByParentId(element.AccJournalid,this.SelectedRowTable.contractId).subscribe(data=>{
        //     this.serviceDetails = data.result;
        //   });
        // }
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


    //--------------------------End Form2---------------------------
    bands: any = [];

    addBand() {
      var maxVal=0;
      if(this.bands.length>0)
      {
        maxVal = Math.max(...this.bands.map((o: { idRow: any; }) => o.idRow))
      }
      else{
        maxVal=0;
      }

      this.bands?.push({
        idRow: maxVal+1,
        clause: null,
      });
    }

    deleteBand(idRow: any) {
      let index = this.bands.findIndex((d: { idRow: any; }) => d.idRow == idRow);
      this.bands.splice(index, 1);
    }

    @ViewChild('MergeInvoiceDataModal') MergeInvoiceDataModal: any;

    saveContractbtn(stepper: MatStepper){
      var InvoiceAmount=(this.FormGroup02.controls['InvoiceAmount'].value??0);
      var total_amount=(this.modalDetailsContractNew.total_amount??0);

      if(total_amount==0 || this.ContractNewServices.length==0)
      {
        this.toast.error(this.translate.instant("من فضلك أدخل خدمة"),this.translate.instant("Message"));
        return;
      }
      if(this.ContractModalCustom.InvoiceId==null)
      {
        this.ConfirmMergeInvoice(1,stepper);
      }
      else
      {
        if(InvoiceAmount<=total_amount)
        {
          this.open(this.MergeInvoiceDataModal, null, 'MergeInvoiceDataModal');
        }
        else
        {
          this.toast.error(this.translate.instant("لا يمكنك حفظ بقيمة عقد اقل من الفاتورة المبدأية للمشروع التي تقدر قيمتها : "+ InvoiceAmount.toString()),this.translate.instant("Message"));
          return;
        }
      }

    }
    disableButtonSave_Contract=false;

    ConfirmMergeInvoice(type:any,stepper: MatStepper){

      var ContractObj:any = {};
      ContractObj.ContractId = 0;
      ContractObj.ContractNo = this.FormGroup01.controls['ContractNo'].value;
      if(this.FormGroup01.controls['ContractDate'].value!=null)
      {
        ContractObj.Date =this._sharedService.date_TO_String(this.FormGroup01.controls['ContractDate'].value);
        const nowHijri =toHijri(this.FormGroup01.controls['ContractDate'].value);
        ContractObj.HijriDate= this._sharedService.hijri_TO_String(nowHijri);
      }

      // if(this.FormGroup01.controls['ContractDate'].value!=null)
      // {
      //   ContractObj.HijriDate = this._sharedService.date_TO_String(this.FormGroup01.controls['ContractDate'].value);
      // }
      ContractObj.CustomerId = this.FormGroup01.controls['ContractCustSelectId'].value;
      ContractObj.ProjectId = this.FormGroup01.controls['ContractProjSelectId'].value;
      ContractObj.Type = this.ContractModalCustom.ContractType;

      ContractObj.Value = this.modalDetailsContractNew.total_amount;
      ContractObj.ValueText = this.modalDetailsContractNew.total_amount_text;
      ContractObj.TaxType = this.modalDetailsContractNew.taxtype;
      ContractObj.TaxesValue = null;
      ContractObj.TotalValue = this.modalDetailsContractNew.total_amount;

      ContractObj.Engineering_License = this.FormGroup01.controls['Engineering_License'].value;
      if(this.FormGroup01.controls['Engineering_LicenseDate'].value!=null)
      {
        ContractObj.Engineering_LicenseDate = this._sharedService.date_TO_String(this.FormGroup01.controls['Engineering_LicenseDate'].value);
      }
      ContractObj.Oper_expeValue = this.CalcData.FinalTable.projectCost;
      var ContractBandsList:any = [];

      this.bands.forEach((element: any, index: any) => {
        var bandobj:any = {};
        bandobj.SerialId = element.idRow;
        bandobj.Clause = element.clause;
        ContractBandsList.push(bandobj);
      });

      //ContractObj.ContractDetails=ContractBandsList;

      ContractObj.OrgId = this.ContractModalCustom.Org_CompanyID;
      ContractObj.OrgEmpId = this.FormGroup01.controls['OrgEmpId'].value;
      ContractObj.OrgEmpJobId = this.ContractModalCustom.OrgEmpJobId;
      ContractObj.ServiceId =this.ContractNewServices[0].AccJournalid; //$('#ProServicesId_Des').val();

      var input = { valid: true, message: "" }
      var ServicesDetailsList:any = [];
      this.ContractNewServices.forEach((element: any) => {

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
        Contractserviceobj.TaxType =this.modalDetailsContractNew.taxtype;
        Contractserviceobj.Serviceamountval = element.Amounttxt;
        // Contractserviceobj.LineNumber = element.idRow;
        ServicesDetailsList.push(Contractserviceobj);

      });
      if (!input.valid) {
        this.toast.error(input.message);return;
      }
      ContractObj.ContractServices = ServicesDetailsList;
      ContractObj.CustomerPayments=this.CustomerPaymentList;

      debugger
      var DetailsList:any = [];
      var counter = 0;
        this.ListDataServices.forEach((elementService: any) => {
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

      ContractObj.ServicesPriceOffer = DetailsList;


      // console.log("ContractObj");
      // console.log("-------------------------");
      // console.log(ContractObj);

      //return;

      this.disableButtonSave_Contract = true;
      setTimeout(() => { this.disableButtonSave_Contract = false }, 15000);

      this._contractService.SaveContract_2(ContractObj).subscribe((result: any)=>{
        debugger
        if(result.statusCode==200){
          console.log("result.returnedStrNeeded"); console.log(result.returnedStrNeeded);
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
          if(type==2)
          {
            this.PayPayment_F2(parseInt(this.ContractModalCustom.InvoiceId), parseInt(result.returnedStr));
            this.PostInvoice_F2(parseInt(this.ContractModalCustom.InvoiceId));
          }
          if(this.control?.value.length>0)
          {
            const formData = new FormData();
            formData.append('file', this.control?.value[0]);
            formData.append('ContractId', result.returnedStr);
            formData.append('ProjectId', this.FormGroup01.controls['ContractProjSelectId'].value);

            this._contractService.UploadProjectContract(formData).subscribe(result => {
            });
          }
          this.FormGroup03.controls['ContractId'].setValue(result.returnedStr);
          stepper.next();
          this.modalService.dismissAll();
        }
        else{ console.log("result.returnedStrNeeded"); console.log(result.returnedStrNeeded);
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
      });
    }

    PayPayment_F2(InvoiceID:any,ContractID:any){
      var PaymentObj:any = {};
      PaymentObj.PaymentId = InvoiceID;
      PaymentObj.ContractId = ContractID;
      this._contractService.PostInvoiceAndPayPayment2(PaymentObj).subscribe((result: any)=>{
      });
    }
    PostInvoice_F2(InvoiceID:any){
      var InvObj:any = {};
      InvObj.InvoiceId = InvoiceID;
      var objOfInvoices:any = [];
      objOfInvoices.push(InvObj);
      this._contractService.PostInvoiceAndPayPayment(objOfInvoices).subscribe((result: any)=>{
      });
    }


    addServiceContractNew2(){

    }
    goToDrafts(stepper: MatStepper){
      this.FormGroup03.controls['ContractId'].setValue(1);
      stepper.next();
    }

    // EditDarftsOpen(stepper: MatStepper){
    //   this.FormGroup03.controls['ContractId'].setValue(1);
    //   stepper.selectedIndex = 4;
    // }


    selectedDate: any;
    // selectedDate: any=new Date();

    selectedDateType = DateType.Hijri;
    offerPriceChecked: any;
    users: any;

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

    public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
      ''
    );

  // 3 contracts

  //------------------------mo3alg aasat---------------------------
  WizardData:any={
    ContractValueinfo:null,
    ContractValueinfo_H:null,
    PaymentStartDate:null,
    PaymentStartHijriDate:null,
    AdvancePayValue:null,
    georgianOrhigri:null,
    PeriodPay:null,
    countwithPayment:null,
    MonthlyPayVal:null,
    PaymentCount:null,
    LastpayVal:null,
  }
  resetWizardData(){
    this.WizardData={
      ContractValueinfo:null,
      ContractValueinfo_H:null,
      PaymentStartDate:new Date(),
      PaymentStartHijriDate:null,
      AdvancePayValue:null,
      georgianOrhigri:"1",
      PeriodPay:"1",
      countwithPayment:"1",
      MonthlyPayVal:null,
      PaymentCount:null,
      LastpayVal:null,
    }
  }
  gethijriformat(Hijri:any){

  }
  setWizardData(){
    debugger
    this.resetWizardData();
    const nowGreg = new Date();
    const nowHijri =toHijri(nowGreg);
    this.WizardData.PaymentStartHijriDate= this._sharedService.hijri_TO_String(nowHijri);

    this.WizardData.ContractValueinfo=this.modalDetailsContractNew.total_amount;
    this.WizardData.ContractValueinfo_H=this.modalDetailsContractNew.ContractAmountBefore;
  }
  ChangeDate(event: any){
    debugger
    if(event!=null)
    {
      //const toHijri   = hijriSafe.toHijri;
      const nowHijri =toHijri(event);
      this.WizardData.PaymentStartHijriDate= this._sharedService.hijri_TO_String(nowHijri);
    }
    else{
      this.WizardData.PaymentStartHijriDate=null;
    }
  }
  CustomerPaymentList:any;
  GenerateCustomerPayments(modal: any){
    this.CustomerPaymentList=[];
    if(this.WizardData.PaymentStartDate ==null || this.WizardData.PaymentStartHijriDate ==null
      || this.WizardData.MonthlyPayVal ==null|| this.WizardData.PaymentCount ==null)
      {
        this.toast.error(this.translate.instant("من فضلك اكمل البيانات"),this.translate.instant("Message"));
        return;
      }
    var ContractObj:any = {};
    ContractObj.Date =this._sharedService.date_TO_String(this.WizardData.PaymentStartDate);
    ContractObj.PaymentHijriDate = this.WizardData.PaymentStartHijriDate;
    ContractObj.TaxType = this.modalDetailsContractNew.taxtype;
    ContractObj.Value = this.WizardData.ContractValueinfo;
    ContractObj.AdvancePayValue = this.WizardData.AdvancePayValue??0;
    ContractObj.PaymentsCount = this.WizardData.PaymentCount;
    ContractObj.LastPayValue = this.WizardData.LastpayVal??0;
    ContractObj.MonthlyPayValue = this.WizardData.MonthlyPayVal??0;
    ContractObj.GregorianHijriPay = this.WizardData.georgianOrhigri;
    ContractObj.PayType = this.WizardData.PaymentType;

    // console.log(ContractObj);
    // return;

    this._contractService.GenerateCustomerPayments(ContractObj).subscribe((result: any)=>{
      debugger
      this.CustomerPaymentList=result;
      modal?.dismiss()
    });
  }

  AdvancePayValueChange(){
    var adpay=this.WizardData.AdvancePayValue??0;
    var totalcon=this.modalDetailsContractNew.total_amount;
    var paycount=this.WizardData.PaymentCount??0;
    var conbefore=this.WizardData.ContractValueinfo_H;
    if(+adpay<= +totalcon)
    {
      if(paycount!=0)
      {
        var MonthlyValue = Math.floor((+conbefore - +adpay) / +paycount);
        this.WizardData.MonthlyPayVal=parseFloat(MonthlyValue.toString()).toFixed(2);
        this.WizardData.LastpayVal=parseFloat(((+conbefore - +adpay) - (+MonthlyValue * +paycount)).toString()).toFixed(2);
      }
      else
      {
        this.WizardData.MonthlyPayVal=null;
        this.WizardData.LastpayVal=null;
      }

    }
    else
    {
      this.WizardData.AdvancePayValue=null;
      this.WizardData.MonthlyPayVal=null;
      this.WizardData.LastpayVal=null;
    }
  }

  PaymentCountChange(){
    debugger
    var InvoiceAmount=(this.FormGroup02.controls['InvoiceAmount'].value??0);
    var InvoiceAmountB=(this.FormGroup02.controls['InvoiceAmountB'].value??0);
    var adpay=this.WizardData.AdvancePayValue??0;
    var totalcon=this.modalDetailsContractNew.total_amount;
    if(InvoiceAmount!=null)totalcon=totalcon-InvoiceAmount;
    var paycount=this.WizardData.PaymentCount??0;
    var conbefore=this.WizardData.ContractValueinfo_H;
    if(InvoiceAmountB!=null)conbefore=conbefore-InvoiceAmountB;
    var MonthlyValue=0;
    if(paycount!=0){
      if(parseInt(this.modalDetailsContractNew.taxtype) == 3)
      {
        MonthlyValue = Math.floor((+totalcon - +adpay) / +paycount);
      }
      else
      {
        MonthlyValue = Math.floor((+conbefore - +adpay) / +paycount);
      }
      this.WizardData.MonthlyPayVal=parseFloat(MonthlyValue.toString()).toFixed(2);

      if(parseInt(this.modalDetailsContractNew.taxtype) == 3)
        {
          this.WizardData.LastpayVal=parseFloat(((+totalcon - +adpay) - (+MonthlyValue * +paycount)).toString()).toFixed(2);
        }
        else
        {
          this.WizardData.LastpayVal=parseFloat(((+conbefore - +adpay) - (+MonthlyValue * +paycount)).toString()).toFixed(2);
        }
    }
    else
    {
      this.WizardData.MonthlyPayVal=null;
      this.WizardData.LastpayVal=null;
    }
  }

  MonthlyPayValChange(){

    // var adpay=this.WizardData.AdvancePayValue??0;
    // var totalcon=this.modalDetailsContractNew.total_amount;
    // var paycount=this.WizardData.PaymentCount??0;
    // var conbefore=this.WizardData.ContractValueinfo_H;
    // var MonthlyPayVal=this.WizardData.MonthlyPayVal??0;

    var InvoiceAmount=(this.FormGroup02.controls['InvoiceAmount'].value??0);
    var InvoiceAmountB=(this.FormGroup02.controls['InvoiceAmountB'].value??0);
    var adpay=this.WizardData.AdvancePayValue??0;
    var totalcon=this.modalDetailsContractNew.total_amount;
    if(InvoiceAmount!=null)totalcon=totalcon-InvoiceAmount;
    var paycount=this.WizardData.PaymentCount??0;
    var conbefore=this.WizardData.ContractValueinfo_H;
    if(InvoiceAmountB!=null)conbefore=conbefore-InvoiceAmountB;
    var MonthlyPayVal=this.WizardData.MonthlyPayVal??0;

    if (+MonthlyPayVal <= +totalcon) {
      var MonthlyValue = parseFloat(MonthlyPayVal).toFixed(2);

      if(parseInt(this.modalDetailsContractNew.taxtype) == 3)
        {
          this.WizardData.PaymentCount = Math.floor((+totalcon - +adpay) / +MonthlyValue);
        }
        else
        {
          this.WizardData.PaymentCount = Math.floor((+conbefore - +adpay) / +MonthlyValue);
        }

      // this.WizardData.PaymentCount=Math.floor((+conbefore - +adpay) / +MonthlyValue);
      paycount = parseInt(this.WizardData.PaymentCount);

      if(parseInt(this.modalDetailsContractNew.taxtype) == 3)
        {
          this.WizardData.LastpayVal=parseFloat(((+totalcon - +adpay) - (+MonthlyValue * +paycount)).toString()).toFixed(2);
        }
        else
        {
          this.WizardData.LastpayVal=parseFloat(((+conbefore - +adpay) - (+MonthlyValue * +paycount)).toString()).toFixed(2);
        }
      // this.WizardData.LastpayVal=parseFloat(((+conbefore - +adpay) - (+MonthlyValue * +paycount)).toString()).toFixed(2);

    }
    else {
      this.WizardData.PaymentCount=null;
      this.WizardData.MonthlyPayVal=null;
      this.WizardData.LastpayVal=null;
    }
  }

  //--------------------------End----------------------------------

    setOfferPriceChecked(event: any) {
      this.offerPriceChecked = event.target.checked;
    }

    addService(index: any) {
      console.log(index);

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
    //------------------------------------calc page---------------------------------------------------------
    //#region


    CalcData:any={
      FinalTable:{
        projectTime:null,
        projectValue:null,
        projectCost:null,
        projectStatusVal:null,
        projectStatusName:null,

      }
    }

    employees: any = [];

    addEmployee() {
      debugger
      var maxVal=0;
      debugger
      if(this.employees.length>0)
      {
        maxVal = Math.max(...this.employees.map((o: { idRow: any; }) => o.idRow))
      }
      else{
        maxVal=0;
      }

      let newEmployee = {
        idRow:maxVal+1,
        id:0,
        name: 0,
        duration: null,
        durationType: 4,
        ratio: null,
        salary: null,
        cost: null,
        accSalary:null,
      };
      this.employees.push(newEmployee);
      this.FillSelectEmployee();
    }
    deleteRow(idRow: any) {
      debugger
      let index = this.employees.findIndex((d: { idRow: any; }) => d.idRow == idRow);
      this.employees.splice(index, 1);
    }
    RowValue:any;
    GetValueCalc(element:any){
      debugger
      this.RowValue=element;
      this.employees = [];
      this.CalcData.FinalTable.projectStatusName=null;
      this.CalcData.FinalTable.projectStatusVal=null;
      this.CalcData.FinalTable.projectCost=null;
      this.SetDistTable();
      this.SetFinalTable(element.timeStr,element.contractValue);
    }
    load_Employee:any;
    FillSelectEmployee(){
      this._followprojectService.FillSelectEmployee().subscribe(data=>{
        this.load_Employee=data;
      });
    }
    emp_Change(element:any){
      debugger
      if(element.name==null){
        //this.EmployeeInfo=[];
        element.accSalary=null;
      }
      else
      {
        this.GetEmployeeInfo(element);
      }
    }
    //EmployeeInfo:any;
    GetEmployeeInfo(element:any){
      debugger
      this._followprojectService.GetEmployeeInfo(element.name).subscribe(data=>{
        element.accSalary=data.salary;
        // Salary
      });
    }
    CalcDist(element:any){
      debugger
      var TimeNO =element.duration;
      var TimeType = element.durationType;
      var Salary = element.accSalary;
      var Days = 0;
      if (TimeType == 1) { Days = 1; } //يوم
      else if (TimeType == 2) { Days = 7; } // اسبوع
      else if (TimeType == 3) { Days = 30; } // شهر
      else if (TimeType == 4) { Days = 1/24; } //    1/24   ساعة
      else { Days = 0; }
      var Value = parseFloat((((TimeNO * Days) * (Salary)) / 30).toString()).toFixed(2);
      element.salary=Value;
      var PercentEmp = element.ratio;
      var EmpValueAfter = parseFloat(((PercentEmp * this.RowValue.contractValue) / 100).toString()).toFixed(2);
      var Cost = parseFloat((+parseFloat(EmpValueAfter).toFixed(2) + +parseFloat(Value).toFixed(2)).toString()).toFixed(2);
      element.cost=Cost;
      //--------------------------------------
      this.FinalCalcDist();
      //---------------------------------------
    }
    FinalCalcDist(){

      if(this.employees.length==0){
        this.CalcData.FinalTable.projectStatusName=null;
        this.CalcData.FinalTable.projectStatusVal=null;
        this.CalcData.FinalTable.projectCost=null;
        return;
      }

      var FinalVal = 0.00;
      this.employees.forEach((element: any) => {
        FinalVal = +parseFloat((FinalVal).toString()).toFixed(2) + +parseFloat(element.cost??0).toFixed(2);
      });
      this.CalcData.FinalTable.projectCost=parseFloat((FinalVal).toString()).toFixed(2);
      var FinalV = parseFloat((FinalVal).toString()).toFixed(2);
      var ProConV = this.CalcData.FinalTable.projectValue;
      if (+FinalV > +ProConV) {
        this.CalcData.FinalTable.projectStatusName='المشروع خاسر';
        this.CalcData.FinalTable.projectStatusVal=0;
      }
      else {
        this.CalcData.FinalTable.projectStatusName='المشروع ناجح';
        this.CalcData.FinalTable.projectStatusVal=1;
      }
    }
    SetFinalTable(TimeStr:any, ConValue:any){
      this.CalcData.FinalTable.projectTime=TimeStr;
      this.CalcData.FinalTable.projectValue=ConValue;
    }

    SetDistTable(){
      this.GetAllFollowProj();
      // console.log("this.RowValue");
      // console.log(this.RowValue);

      // var CostE= this.GetvalCostE(this.RowValue);
      // var CostS= this.GetvalCostS(this.RowValue);
      // console.log("CostS");

      // console.log(CostE);
      // console.log(CostS);


      //this.GetChartCalc(this.RowValue.projectNo,CostE,CostS);
    }
    FollowProjData=[];
    GetAllFollowProj(){
      debugger
      this.FollowProjData=[];
      this._followprojectService.GetAllFollowProj(this.RowValue.projectId).subscribe(data=>{
        data.forEach((element: any) => {
          this.FillSelectEmployee();
          var maxVal=0;
          debugger
          if(this.employees.length>0)
          {
            maxVal = Math.max(...this.employees.map((o: { idRow: any; }) => o.idRow))
          }
          else{
            maxVal=0;
          }
          debugger
          let newEmployee = {
            idRow:maxVal+1,
            id:element.followProjId,
            name: element.empId,
            duration: element.timeNo,
            durationType: element.timeType,
            ratio: element.empRate,
            salary: element.amount,
            cost: element.expectedCost,
            accSalary:element.empSalary,
          };
          this.employees.push(newEmployee);
        });
        this.FollowProjData=data;
        this.FinalCalcDist();
      });
    }


    FollowProjListData:any={
      FollowProj:null
    };

    FollowProjList:any=[];
    FollowProj:any;
    SaveFollowProj(calcModal:any) {
      debugger
      var CheckValid=1;
      this.employees.forEach((element: any) => {
        if(element.name==null || element.duration==null ||element.durationType==null ){
            CheckValid=0;
          }
      });
      if(CheckValid==0)
      {
        this.toast.error("من فضلك أكمل البيانات", 'رسالة');
        return;
      }


      debugger
      this.FollowProjList=[];
      this.employees.forEach((element: any) => {
        var FollowProj :any = {};
        FollowProj.FollowProjId=0;
        FollowProj.EmpId=element.name;
        FollowProj.ProjectId=this.RowValue.projectId;
        FollowProj.TimeNo=String(element.duration);
        FollowProj.TimeType=String(element.durationType);
        FollowProj.EmpRate=String(element.ratio??"0");
        FollowProj.Amount=parseFloat(element.salary);
        FollowProj.ExpectedCost=parseFloat(element.cost);
        FollowProj.ConfirmRate=false;
        this.FollowProjList.push(FollowProj);
      });

      console.log("this.FollowProjList");
      console.log(this.FollowProjList);
      this.FollowProjListData.FollowProj=this.FollowProjList;

      var obj=this.FollowProjListData;
      this._followprojectService.SaveFollowProj(obj).subscribe((result: any)=>{
        debugger
        if(result.statusCode==200){
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
            calcModal?.hide();
        }
        else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'))}
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
// GetChartCalc(ProjNo:any,CostE:any,CostS:any){
//   this.calculatorChartOptions = {
//     series: [
//       {
//         name: 'المصرزفات',
//         data: [CostS],
//       },
//       {
//         name: 'الإيرادات',
//         data: [CostE],
//       },
//     ],
//     chart: {
//       type: 'bar',
//       height: 350,
//     },

//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: '100%',
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     stroke: {
//       show: true,
//       width: 2,
//       colors: ['transparent'],
//     },
//     xaxis: {
//       categories: [ProjNo],
//     },
//     yaxis: {
//       title: {
//         text: '$ (thousands)',
//       },
//     },
//     fill: {
//       opacity: 1,
//     },
//   };

// }

//#endregion
//-----------------------------------end calc page-----------------------------------------------------------

}
