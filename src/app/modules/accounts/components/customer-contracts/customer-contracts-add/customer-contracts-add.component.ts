import {Component,OnInit,Input,ViewChild,AfterViewInit,TemplateRef,} from '@angular/core';
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
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import { ContractsVM } from 'src/app/core/Classes/ViewModels/contractsVM';
import { ContractService } from 'src/app/core/services/acc_Services/contract.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { environment } from 'src/environments/environment';
import 'hijri-date';
const hijriSafe= require('hijri-date/lib/safe');
const HijriDate =  hijriSafe.default;
const toHijri  = hijriSafe.toHijri;

@Component({
  selector: 'app-customer-contracts-add',
  templateUrl: './customer-contracts-add.component.html',
  styleUrls: ['./customer-contracts-add.component.scss']
})
export class CustomerContractsAddComponent implements OnInit {
  @Input() contractAdd: any;
  userG : any = {};

  constructor(private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private _sharedService: SharedService,
    private _formBuilder: FormBuilder,
    private toast: ToastrService,
    private _contractService: ContractService,
    private translate: TranslateService,) {
      this.userG = this.authenticationService.userGlobalObj;
      console.log(this.userG);
    }
    ngOnInit(): void {
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

    bands: any = [];
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
      //------------------------------
      TeamWork_Num1:null,
      TeamWork_Note1:null,
      TeamWork_Num2:null,
      TeamWork_Note2:null,
      TeamWork_Num3:null,
      TeamWork_Note3:null,
      TeamWork_Num4:null,
      TeamWork_Note4:null,
      TeamWork_Num5:null,
      TeamWork_Note5:null,
      TeamWork_Num6:null,
      TeamWork_Note6:null,
      TeamWork_Num7:null,
      TeamWork_Note7:null,
      TeamWork_Num8:null,
      TeamWork_Note8:null,
      TeamWork_Num9:null,
      TeamWork_Note9:null,
      TeamWork_Num10:null,
      TeamWork_Note10:null,
      //---------------------------------
      Phases_tbody:[],
      //--------------------------------
    }

    FormGroup01: FormGroup;
    FormGroup02: FormGroup;
    FormGroup03: FormGroup;
    FormGroup04: FormGroup;
    FormGroup07: FormGroup;

    DisabledBtn(){
      this.FormGroup01.controls['ContractHijriDate'].disable();
      this.FormGroup01.controls['Org_CompanyName'].disable();
      this.FormGroup01.controls['OrgEmpJob'].disable();
      this.FormGroup01.controls['Engineering_License'].disable();
      this.FormGroup01.controls['Engineering_LicenseDate'].disable();
      this.FormGroup01.controls['customerIdtxt'].disable();

      this.FormGroup02.controls['InvoiceAmount'].disable();


      this.FormGroup04.controls['ProjName'].disable();
      this.FormGroup04.controls['ProjLocation'].disable();
      this.FormGroup04.controls['ProjBriefDesc'].disable();
      this.FormGroup04.controls['ContPeriod'].disable();
      this.FormGroup04.controls['Owner'].disable();
      this.FormGroup04.controls['Design_Consultant_Rep'].disable();


    }
    SetContractDefData(){
      debugger
      // this.contractAdd.ContractType;
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
      this.intialForms();
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
      this.stage=[];

    }

    intialForms() {
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
        ContractCustSelectId: [null, [Validators.required]],
        ContractProjSelectId: [null],
        customerIdtxt: [null],
        OfferSelectid: [null],
        check:[false],
      });
      this.FormGroup02 = this._formBuilder.group({
        ContractTypeSelectId: [null],
        InvoiceAmount: [null],
      });

      this.FormGroup03 = this._formBuilder.group({
        Appr_LetterDate: [null, [Validators.required]],
        EngServ_OfferDate: [null, [Validators.required]],
      });

      this.FormGroup04 = this._formBuilder.group({
        ProjName: [null],
        // ProjectName: ['', Validators.required],
        ProjLocation: [null],
        ProjBriefDesc: [null],
        ContPeriod: [null],
        ContractorName: [null],
        ContDate: [null],
        MaxPay: [null, [Validators.required]],
        ContractDurCommit: [null, [Validators.required]],
        Design_Consultant_Rep: [null],
        Owner: [null],
        OfferSelectid: [null],
      });

      this.FormGroup07 = this._formBuilder.group({
        Cons_TotalFees: [null],
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
          this.FormGroup04.controls['Owner'].setValue(data.result.customerNameAr);
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

      }
      else if(this.ContractModalCustom.ContractType==2)
      {

      }
      else if(this.ContractModalCustom.ContractType==3)
      {
        this.FillCustomerSelectWProC();
      }
      else if(this.ContractModalCustom.ContractType==4)
      {
        this.FillCustomerSelectWProC3();
      }
      else if(this.ContractModalCustom.ContractType==5)
      {
        this.FillCustomerSelectWProC2();
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
            this.ContractModalCustom.InvoiceId=data.result?.invoiceId;
            this.ContractModalCustom.InvoiceNumDiv=true;
            this.ContractModalCustom.InvoiceNumber=data.result?.invoiceNumber;
            this.FormGroup02.controls['InvoiceAmount'].setValue(data.result?.totalAmount);
          }
          else
          {
            this.ContractModalCustom.InvoiceId=null;
            this.ContractModalCustom.InvoiceNumDiv=false;
            this.ContractModalCustom.InvoiceNumber=null;
            this.FormGroup02.controls['InvoiceAmount'].setValue(null);
          }
        });
      }
      else
      {
        this.ContractModalCustom.InvoiceId=null;
        this.ContractModalCustom.InvoiceNumDiv=false;
        this.ContractModalCustom.InvoiceNumber=null;
        this.FormGroup02.controls['InvoiceAmount'].setValue(null);
      }
    }
    ChangeCustomerSelect(){
      this.Loadprojects=[];
      this.FormGroup01.controls['ContractProjSelectId'].setValue(null);
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
          this.FormGroup04.controls['ProjName'].setValue(data.result.projectDescription);
          this.FormGroup04.controls['ProjLocation'].setValue(data.result.cityName);
          this.FormGroup04.controls['ProjBriefDesc'].setValue(data.result.projectDescription);
          this.GetProjectDurationStr(data.result.projectDate, data.result.projectExpireDate);

        });
      }
      else
      {
          this.FormGroup04.controls['ProjName'].setValue(null);
          this.FormGroup04.controls['ProjLocation'].setValue(null);
          this.FormGroup04.controls['ProjBriefDesc'].setValue(null);
      }
    }

    GetProjectDurationStr(from:any,to:any){
      this._contractService.GetProjectDurationStr(from,to).subscribe(data=>{
        this.FormGroup04.controls['ContPeriod'].setValue(data.reasonPhrase);
      });
    }

    GetProjectData(){
      var OrgEmpId=this.FormGroup01.controls['OrgEmpId'].value;
      if(OrgEmpId!=null){
        var val=this.LoadEmployeeSelect.filter((a: { id: any; })=>a.id==OrgEmpId)[0].name;
        this.FormGroup04.controls['Design_Consultant_Rep'].setValue(val);
      }
      this.GetProjectById();
    }

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
      this.addServiceContractNew();
      this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].AccJournalid = item.servicesId;
      this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].UnitConst = item.serviceTypeName;
      this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].QtyConst = Qty;
      this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].accountJournaltxt = item.name;
      this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].Amounttxt = servamount;
      this.CalculateTotal_ContractNew();
    }
    GetOfferservicenByOfferIdNew(OfferId:any){

      this._contractService.GetOfferservicenByid(OfferId).subscribe(data=>{
        if(data.length>0)
        {
          data.forEach((element: any) => {
            this.modalDetailsContractNew.taxtype=element.taxType;
            this.GetServicesPriceByServiceId_ContractNew(element);
          });
        }
      });
    }

    GetServicesPriceByServiceId_ContractNew(offerdata:any){

      this._contractService.GetServicesPriceByServiceId(offerdata.serviceId).subscribe(data=>{
        var maxVal=0;

        if(this.offerServices.length>0)
        {
          maxVal = Math.max(...this.offerServices.map((o: { idRow: any; }) => o.idRow))
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
      ContractTax:null,
      total_amount_text:null,
    }
    resetmodalDetailsContractNew(){
      this.ContractNewServices=[];
      this.modalDetailsContractNew={
        taxtype:2,
        total_amount:null,
        ContractAmountBefore:null,
        ContractTax:null,
        total_amount_text:null,
      }
    }
    CalculateTotal_ContractNew() {
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
            taxAmount = +TaxV8erS * element.QtyConst;
            totalwithtax = +parseFloat((+parseFloat(Value) + +parseFloat(TaxV8erS)).toString()).toFixed(2);
        }
        else {
            taxAmount=+TaxVS * element.QtyConst;
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
      debugger
      let sum=0;
      let sumbefore=0;
      let sumtax=0;
      this.ContractNewServices.forEach((element: any) => {
        sum= +sum + +parseFloat((element.TotalAmounttxt??0)).toFixed(2);
        sumbefore= +sumbefore + (+parseFloat((element.Amounttxt??0)).toFixed(2) * +parseFloat((element.QtyConst??0)).toFixed(2));
        sumtax= +sumtax + +parseFloat((element.taxAmounttxt??0)).toFixed(2);   
      });
      this.modalDetailsContractNew.total_amount=parseFloat(sum.toString()).toFixed(2);
      this.modalDetailsContractNew.ContractAmountBefore=parseFloat(sumbefore.toString()).toFixed(2);
      this.modalDetailsContractNew.ContractTax=parseFloat(sumtax.toString()).toFixed(2);
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

    GetServicesPriceByParentId(element:any){
      this.serviceDetails=[];
      if(element.AccJournalid!=null)
      {
        this._contractService.GetServicesPriceVouByParentId(element.AccJournalid,element.offerId).subscribe(data=>{
          this.serviceDetails = data.result;
        });
      }
    }

    //--------------------------End Form2---------------------------
    stage: any = [];

    addStage() {
      var maxVal=0;
      if(this.stage.length>0)
      {
        maxVal = Math.max(...this.stage.map((o: { idRow: any; }) => o.idRow))
      }
      else{
        maxVal=0;
      }

      this.stage?.push({
        idRow: maxVal+1,
        stage: null,
        description: null,
        BeginningPeriod: null,
        periodEnd: null,
      });
    }

    deleteStage(idRow: any) {
      let index = this.stage.findIndex((d: { idRow: any; }) => d.idRow == idRow);
      this.stage.splice(index, 1);
    }

    @ViewChild('MergeInvoiceDataModal') MergeInvoiceDataModal: any;

    saveContractbtn(){
      var Cons_TotalFees=this.FormGroup07.controls['Cons_TotalFees'].value;
      var InvoiceAmount=(this.FormGroup02.controls['InvoiceAmount'].value??0);
      var total_amount=(this.modalDetailsContractNew.total_amount??0);

      if(total_amount==0 || this.ContractNewServices.length==0)
      {
        this.toast.error(this.translate.instant("من فضلك أدخل خدمة"),this.translate.instant("Message"));
        return;
      }
      if(Cons_TotalFees==null)
      {
        this.toast.error(this.translate.instant("من فضلك أدخل الأتعاب الإجمالية للاستشاري"),this.translate.instant("Message"));
        return;
      }
      if(this.ContractModalCustom.InvoiceId==null)
      {
        this.ConfirmMergeInvoice(1);
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

    ConfirmMergeInvoice(type:any){

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

      //ContractObj.Value = this.modalDetailsContractNew.total_amount;
      ContractObj.Value =+parseFloat(this.modalDetailsContractNew.total_amount.toString()).toFixed(2)- +parseFloat(this.modalDetailsContractNew.ContractTax.toString()).toFixed(2);
      ContractObj.ValueText = this.modalDetailsContractNew.total_amount_text;
      ContractObj.TaxType = this.modalDetailsContractNew.taxtype;
      ContractObj.TaxesValue = null;
      ContractObj.TotalValue = this.modalDetailsContractNew.total_amount;

      ContractObj.Engineering_License = this.FormGroup01.controls['Engineering_License'].value;
      if(this.FormGroup01.controls['Engineering_LicenseDate'].value!=null)
      {
        ContractObj.Engineering_LicenseDate = this._sharedService.date_TO_String(this.FormGroup01.controls['Engineering_LicenseDate'].value);
      }
      if(this.FormGroup03.controls['Appr_LetterDate'].value!=null)
      {
        ContractObj.Appr_LetterDate_Des = this._sharedService.date_TO_String(this.FormGroup03.controls['Appr_LetterDate'].value);
      }
      if(this.FormGroup03.controls['EngServ_OfferDate'].value!=null)
      {
        ContractObj.EngServ_OfferDate_Des = this._sharedService.date_TO_String(this.FormGroup03.controls['EngServ_OfferDate'].value);
      }
      ContractObj.ContPeriod_Des = this.FormGroup04.controls['ContPeriod'].value;
      ContractObj.MaxPay_Des = this.FormGroup04.controls['MaxPay'].value;
      ContractObj.ContractDurCommit_Des = this.FormGroup04.controls['ContractDurCommit'].value;
      debugger
      ContractObj.TeamWork_Num1_Des = (this.ContractModalCustom.TeamWork_Num1??0).toString();
      ContractObj.TeamWork_Note1_Des = this.ContractModalCustom.TeamWork_Note1;

      ContractObj.TeamWork_Num2_Des = (this.ContractModalCustom.TeamWork_Num2??0).toString();
      ContractObj.TeamWork_Note2_Des = this.ContractModalCustom.TeamWork_Note2;

      ContractObj.TeamWork_Num3_Des = (this.ContractModalCustom.TeamWork_Num3??0).toString();
      ContractObj.TeamWork_Note3_Des = this.ContractModalCustom.TeamWork_Note3;

      ContractObj.TeamWork_Num4_Des = (this.ContractModalCustom.TeamWork_Num4??0).toString();
      ContractObj.TeamWork_Note4_Des = this.ContractModalCustom.TeamWork_Note4;

      ContractObj.TeamWork_Num5_Des = (this.ContractModalCustom.TeamWork_Num5??0).toString();
      ContractObj.TeamWork_Note5_Des = this.ContractModalCustom.TeamWork_Note5;

      ContractObj.TeamWork_Num6_Des = (this.ContractModalCustom.TeamWork_Num6??0).toString();
      ContractObj.TeamWork_Note6_Des = this.ContractModalCustom.TeamWork_Note6;

      ContractObj.TeamWork_Num7_Des = (this.ContractModalCustom.TeamWork_Num7??0).toString();
      ContractObj.TeamWork_Note7_Des = this.ContractModalCustom.TeamWork_Note7;

      ContractObj.TeamWork_Num8_Des = (this.ContractModalCustom.TeamWork_Num8??0).toString();
      ContractObj.TeamWork_Note8_Des = this.ContractModalCustom.TeamWork_Note8;

      ContractObj.TeamWork_Num9_Des = (this.ContractModalCustom.TeamWork_Num9??0).toString();
      ContractObj.TeamWork_Note9_Des = this.ContractModalCustom.TeamWork_Note9;

      ContractObj.TeamWork_Num10_Des = (this.ContractModalCustom.TeamWork_Num10??0).toString();
      ContractObj.TeamWork_Note10_Des = this.ContractModalCustom.TeamWork_Note10;
      ContractObj.ProjBriefDesc_Des = this.FormGroup04.controls['ProjBriefDesc'].value;
      var ContractStageList:any = [];


      this.stage.forEach((element: any, index: any) => {
        var Phasesobj:any = {};
        Phasesobj.Stage = element.stage;
        Phasesobj.StageDescreption = element.description;
        if(element.BeginningPeriod!=null)
        {
          Phasesobj.Stagestartdate = this._sharedService.date_TO_String(element.BeginningPeriod);
        }
        if(element.periodEnd!=null)
        {
          Phasesobj.Stageenddate = this._sharedService.date_TO_String(element.periodEnd);
        }
        ContractStageList.push(Phasesobj);
      });

      ContractObj.ContractStage = ContractStageList;

      ContractObj.Cons_TotalFees_Des =this.FormGroup07.controls['Cons_TotalFees'].value;
      ContractObj.ContractorName_Des =this.FormGroup04.controls['ContractorName'].value;
      if(this.FormGroup04.controls['ContDate'].value!=null)
      {
        ContractObj.ContDate_Des =this._sharedService.date_TO_String(this.FormGroup04.controls['ContDate'].value);
      }

      ContractObj.OrgId = this.ContractModalCustom.Org_CompanyID;
      ContractObj.OrgEmpId = this.FormGroup01.controls['OrgEmpId'].value;
      ContractObj.OrgEmpJobId = this.ContractModalCustom.OrgEmpJobId;
      //ContractObj.ServiceId =this.ContractNewServices[0].AccJournalid; //$('#ProServicesId_Des').val();

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
      console.log("ContractObj");
      console.log("-------------------------");
      console.log(ContractObj);

      //return;

      this.disableButtonSave_Contract = true;
      setTimeout(() => { this.disableButtonSave_Contract = false }, 15000);

      this._contractService.SaveContract(ContractObj).subscribe((result: any)=>{
        debugger
        if(result.statusCode==200){
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

          this.modalService.dismissAll();
        }
        else{console.log("result.returnedStrNeeded"); console.log(result.returnedStrNeeded);
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




  addInstallments(data: any) {}



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

    addBand(index: any) {
      console.log(index);

      this.bands?.push({
        clauseId: index + 1,
        clause: '',
      });
    }

    deleteBand(index: any) {
      this.bands?.splice(index, 1);
    }

    addParticipant(index: any) {
      console.log(index);

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
}
