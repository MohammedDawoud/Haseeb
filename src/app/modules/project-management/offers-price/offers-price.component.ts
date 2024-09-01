import { ProjectService } from './../../../core/services/pro_Services/project.service';
import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OfferpriceService } from 'src/app/core/services/pro_Services/offerprice.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { NgxPrintElementService } from 'ngx-print-element';
import printJS from 'print-js';
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import { PrintreportsService } from 'src/app/core/services/acc_Services/printreports.service';
import { InvoiceService } from 'src/app/core/services/acc_Services/invoice.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { DOCUMENT } from '@angular/common';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { RestApiService } from 'src/app/shared/services/api.service';
import { DebentureService } from 'src/app/core/services/acc_Services/debenture.service';

@Component({
  selector: 'app-offers-price',
  templateUrl: './offers-price.component.html',
  styleUrls: ['./offers-price.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OffersPriceComponent implements OnInit {
  title: any = {
    main: {
      name: {
        ar: 'ادارة المشاريع',
        en: 'Projects Management',
      },
      link: '/projects',
    },
    sub: {
      ar: 'عروض الأسعار',
      en: 'Offres Prices',
    },
  };

  users: any;
  showPrice: any = false;

  closeResult = '';

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
  dataSourceTemp: any = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) paginatorOffer!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  offersPrices: any;

  EmailModals: any = {
    orgEmail: null,
    customerEmail: null,
    MailSubject: null,
    MailText: null,
  };

  modalDetailsOffer: any = {
    id: 0,
    date: null,
    customer: null,
    customerEn: null,
    price: null,
    user: null,
    userEmail: null,
    project_id: null,
    projectDuration: null,
    customerEmail: null,
    customerPhone: null,
    title: null,
    description: null,
    salesEngineer: null,
    department: null,
    offer_no: null,
    offer_intro: null,
    status: null,
    default: null,
    followDate: null,
    remeberMe: null,
    PrintEn: null,
    NotDisCustPrint: null,
    showNotification: null,
    showSignatures: null,
    showAccount: null,

    taxtype: 2,
  };

  uploadedFiles: any;
  showOfferValue: any = false;

  durations: any;
  selectedDuration: any;
  selectedDuration2: any;

  generalRequests: any;
  designRequests: any;

  existValue: any = false;

  offerTerms: any = [];
  offerServices: any = [];
  offerPayments: any = [];

  serviceDetails: any = [];

  servicesList_Offer: any;

  selectedServiceRowOffer: any;
  userG: any = {};

  servicesListdisplayedColumns: string[] = ['name', 'price'];
  serviceListDataSource_Offer = new MatTableDataSource();
  lang: any = 'ar';
  constructor(
    private modalService: NgbModal,
    @Inject(DOCUMENT) private document: Document,
    private print: NgxPrintElementService,
    private _offerpriceService: OfferpriceService,
    private _sharedService: SharedService,
    private _projectService: ProjectService,
    private _invoiceService: InvoiceService,
    private _debentureService: DebentureService,
    private authenticationService: AuthenticationService,
    private toast: ToastrService,
    private _printreportsService: PrintreportsService,
    private formBuilder: FormBuilder,
    private _accountsreportsService: AccountsreportsService,
    private translate: TranslateService,
    private api: RestApiService
  ) {
    this.userG = this.authenticationService.userGlobalObj;
    this.translate.use(this.lang);
    this.getData();
  }

  WhatsAppData: any={
    sendactivation:false,
    sendactivationOffer:false,
    sendactivationProject:false,
    sendactivationSupervision:false,
  };

  ngOnInit(): void {
    this._sharedService.GetWhatsAppSetting().subscribe((data: any) => {
      if(data?.result!=null){this.WhatsAppData=data?.result;}
      else{this.WhatsAppData={sendactivation:false,sendactivationOffer:false,sendactivationProject:false,sendactivationSupervision:false,};}
    });
    this.Fillcustomerhavingoffer();
    this.GetPublicOrder();
    this.GetDesignOrder();
    this.getorgdata();

    this.durations = [
      { id: 1, name: { ar: 'هذا اليوم', en: 'this Day' } },
      { id: 2, name: { ar: 'هذا الاسبوع', en: 'this Week' } },
      { id: 3, name: { ar: 'هذا الشهر', en: 'this Month' } },
    ];
  }

  //-----------------------------------dash--------------------------------------------------------
  getData() {
    this._offerpriceService.GetAllOffers().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  Getprojecttime(time: any) {
    if (time == '') return 'بدون';
    else return time;
  }

  GetAllOffersByCustomerId2(custid: any) {
    this._offerpriceService
      .GetAllOffersByCustomerId2(custid)
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource(data.result);
        this.dataSourceTemp = data.result;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  selectedCustoemr: any;

  load_CustomerSearch: any;
  Fillcustomerhavingoffer() {
    this._offerpriceService.Fillcustomerhavingoffer().subscribe((data) => {
      this.load_CustomerSearch = data;
    });
  }
  CustomerSearchChange() {
    if (this.selectedCustoemr != null) {
      this.GetAllOffersByCustomerId2(this.selectedCustoemr);
    } else {
      this.getData();
    }
  }
  applyFilterGrid(event: any) {
    const val = event.target.value.toLowerCase();
    const tempsource = this.dataSourceTemp.filter(function (d: any) {
      return d.offerNo?.trim().toLowerCase().indexOf(val) !== -1 || !val;
      //  || (d.offerDate?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      //  || (d.customerName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      //  || (String(d.offerValue)?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      //  || (d.presenter?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      //  || (d.projectno?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      //  || (d.projtime?.trim().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.dataSource = new MatTableDataSource(tempsource);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  selectedRow: any = {
    offerStatus: 0,
    offerNo: null,
  };

  GetProgressValues(element: any) {
    this.selectedRow.offerNo = element.offerNo;
    this._offerpriceService
      .GetProgressValues(element.offersPricesId)
      .subscribe((data) => {
        if (data.payInvStatus == true) {
          this.selectedRow.offerStatus = 5;
        } else if (data.contractStatus == true) {
          this.selectedRow.offerStatus = 4;
        } else if (data.projStatus == true) {
          this.selectedRow.offerStatus = 3;
        } else if (data.custStatus == true) {
          this.selectedRow.offerStatus = 2;
        } else if (data.offerStatus == true) {
          this.selectedRow.offerStatus = 1;
        } else {
          this.selectedRow.offerStatus = 0;
        }
      });
  }

  //------------------------------------End dash---------------------------------------------------

  //------------------------------------ PopupDesign---------------------------------------------------
  GetPublicOrderCounter: number = 0;
  GetPublicOrder() {
    this._offerpriceService
      .GetAllPublicanddesignServicesPricingForms(1)
      .subscribe((data) => {
        this.generalRequests = data.result;
        this.GetPublicOrderCounter = this.generalRequests.filter(
          (s: { formStatus: boolean }) => s.formStatus != true
        ).length;
      });
  }
  GetDesignOrderCounter: number = 0;
  GetDesignOrder() {
    this._offerpriceService
      .GetAllPublicanddesignServicesPricingForms(2)
      .subscribe((data) => {
        this.designRequests = data.result;
        this.GetDesignOrderCounter = this.designRequests.filter(
          (s: { formStatus: boolean }) => s.formStatus != true
        ).length;
      });
  }

  UpdateStatusServicesPricingForm(FormId: any, Status: any, type: any) {
    this._offerpriceService
      .UpdateStatusServicesPricingForm(FormId, Status)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          if (type == 'general') {
            this.GetPublicOrder();
          } else {
            this.GetDesignOrder();
          }
        } else {
          this.toast.error(result.reasonPhrase,this.translate.instant("Message"));
        }
      });
  }

  Check: any = false;
  changeRequestStatus(type: any, element: any) {
    this.Check = false;
    if (type == 'general') {
      if (element.formStatus == false) {
        this.Check = true;
      } else {
        this.Check = false;
      }
    } else {
      if (element.formStatus == false) {
        this.Check = true;
      } else {
        this.Check = false;
      }
    }
    this.UpdateStatusServicesPricingForm(element.formId, this.Check, type);
  }
  FilterOffer_Gen(dateFrom: any) {
    this._offerpriceService.FilterOffer(1, dateFrom).subscribe((data) => {
      this.generalRequests = data.result;
      // this.GetPublicOrderCounter=this.generalRequests.filter((s: { formStatus: boolean; })=>s.formStatus!=true).length;
    });
  }
  FilterOffer_Des(dateFrom: any) {
    this._offerpriceService.FilterOffer(2, dateFrom).subscribe((data) => {
      this.designRequests = data.result;
      // this.GetDesignOrderCounter=this.designRequests.filter((s: { formStatus: boolean; })=>s.formStatus!=true).length;
    });
  }
  DurationChange_Gen() {
    var date = new Date();
    if (this.selectedDuration == 1) {
    } else if (this.selectedDuration == 2) {
      date.setDate(date.getDay() - 7);
    } else if (this.selectedDuration == 3) {
      date.setMonth(date.getMonth() - 1);
    } else {
      this.GetPublicOrder();
      return;
    }
    this.FilterOffer_Gen(this._sharedService.date_TO_String(date));
  }
  DurationChange_Des() {
    var date = new Date();
    if (this.selectedDuration2 == 1) {
    } else if (this.selectedDuration2 == 2) {
      date.setDate(date.getDay() - 7);
    } else if (this.selectedDuration2 == 3) {
      date.setMonth(date.getMonth() - 1);
    } else {
      this.GetDesignOrder();
      return;
    }
    this.FilterOffer_Des(this._sharedService.date_TO_String(date));
  }
  //------------------------------------End PopupDesign---------------------------------------------------
  OfferPopupAddorEdit: any = 0; //add offerprice
  publicidRow: any;
  InvoiceModelPublic: any;

  open(content: any, data?: any, type?: any, idRow?: any, model?: any) {
    this.publicidRow = 0;

    if (idRow != null) {
      this.selectedServiceRowOffer = idRow;
      this.selectedServiceRow = idRow;
    }

    if (type == 'add') {
      this.ListDataServices = [];
      this.SureServiceList = [];
      this.ResetModel();
      this.GetAllCustomerPaymentsconst();
      this.GetOfferconditionconst();
      this.Getnextoffernum();
      this.OfferPopupAddorEdit = 0;
      this.SelectedRowTable = null;
    }
    if (data && type == 'edit') {
      this.ListDataServices = [];
      this.SureServiceList = [];
      this.editoffer(data);
      this.OfferPopupAddorEdit = 1;
    }
    if (type == 'serviceDetails' && data) {
      this.GetServicesPriceByParentId(data);
    }
    if (type == 'sendEmail') {
      this.modalDetailsOffer = data;
      this.GetEmailOrganization();
      this.GetCustomersByCustomerId(data.customerId);
    }
    if (type == 'WhatsApp') {
      this.WhatsAppModals = {
        customerPhoneOffer: null,
      };
      this.modalDetailsOffer = data;
      if(data.customerId>0)
      {
        this.GetCustomersByCustomerIdWhatsApp(data.customerId);
      }
      else
      {
        this.WhatsAppModals.customerPhoneOffer=this.modalDetailsOffer.customerMobile;
      }
    }
    if (type == 'LandArea') {
      this.GetAllFloors();
      this.resetLandArea();
      if (!this.offerServices.length) {
        this.toast.error('أختر باقة أولا',this.translate.instant("Message"));
        return;
      }
    }
    if (type == 'addproject') {
      this.ProjectPopupFunc();
      this.GenerateNextProjectNumber();
    }
    if (type == 'modifyPermissionsModal') {
      if (this.modalDetailsProject.customer == null) {
        this.toast.error('من فضلك أختر عميل أولا',this.translate.instant("Message"));
        return;
      } else {
        this.FillUserPermission();
      }
    }
    if (type === 'deleteModalPerm') {
      this.publicidRow = data.idRow;
    }
    if (type == 'addInvoiceProject') {
      this.invoicepop = 2;
      this.ListDataServices_Invoice = [];
      this.SureServiceList_Invoice = [];
      this.OfferPopupAddorEdit_Invoice = 0;
      this.InvoicePopup(2);
    }
    if (type == 'servicesList') {
      this.GetAccountJournalSearchGrid();
    } else if (type == 'servicesList_Offer') {
      this.GetAllServicesPrice_Offer();
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
    if (type == 'addSerivceModal') {
      this.details = [];
      this.AllcostCenterlist = [];
      this.SubprojecttypeList = [];
      this.intialModelBranchOrganization();
      this.FillServiceAccount();
      this.FillServiceAccountPurchase();
      this.FillCostCenterSelect_Service();
      this.FillProjectTypeSelectService();
      this.FillPackagesSelect();
    }
    if (type == 'SaveInvoiceConfirmModal') {
      this.InvoiceModelPublic = model;
    }
    if (type == 'serviceDetails_Invoice' && data) {
      this.GetServicesPriceByParentId_Invoice(data);
    }
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size:
          type == 'add' ||
          type == 'edit' ||
          type == 'addproject' ||
          type == 'modifyPermissionsModal' ||
          type == 'addInvoiceProject' ||
          type == 'addSerivceModal'
            ? 'xl'
            : 'lg',
        centered:
          type == 'SaveInvoiceConfirmModal'
            ? true
            : type == 'serviceDetails' || type == 'servicesList_Offer'
            ? false
            : true,
        backdrop: 'static',
        keyboard: false,
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
    this.uploadedFiles = null;

    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  exportExcel() {}

  printProject() {}

  printRequest() {}

  // setOfferData(data: any) {
  //   this.selectedRow = data;
  // }

  // delete
  confirm() {}
  decline() {}

  //---------------------------------send email--------------------------------------------

  GetEmailOrganization() {
    this.EmailModals.orgEmail = null;
    this._offerpriceService.GetEmailOrganization().subscribe((data) => {
      this.EmailModals.orgEmail = data.email;
    });
  }
  GetCustomersByCustomerId(customerid: any) {
    this.EmailModals.customerEmail = null;
    this._offerpriceService
      .GetCustomersByCustomerId(customerid)
      .subscribe((data) => {
        this.EmailModals.customerEmail = data.result.customerEmail;
      });
  }
  GetCustomersByCustomerIdWhatsApp(customerid: any) {
    this.WhatsAppModals.customerPhoneOffer = null;
    this._offerpriceService
      .GetCustomersByCustomerId(customerid)
      .subscribe((data) => {
        this.WhatsAppModals.customerPhoneOffer = data.result.customerMobile;
      });
  }
  //sendMail

  sendEMAIL(sms: any, modal: any) {
    if (
      this.EmailModals.orgEmail == null ||
      this.EmailModals.customerEmail == null ||
      this.EmailModals.MailSubject == null ||
      this.EmailModals.MailText == null ||
      this.uploadedFiles == null
    ) {
      //|| this.uploadedFiles==null
      this.toast.error('من فضلك أكمل البيانات',this.translate.instant("Message"));
      return;
    }

    const formData = new FormData();
    // var htmlstr2=`<div>
    // <h1>My First Heading</h1>
    // <p>My first paragraph.</p>
    // </div>`;
    // //dawoud
    // debugger
    // var htmlstr:any= this.document.getElementById("report")?.innerHTML;
    // console.log(htmlstr);
    // // return ;
    if (this.uploadedFiles != null) {
      formData.append('UploadedFile', this.uploadedFiles[0]);
    }
    formData.append('CustomerId', this.modalDetailsOffer.customerId.toString());
    formData.append(
      'assignedCustomersIds',
      this.modalDetailsOffer.customerId.toString()
    );
    formData.append('mailSubject', this.EmailModals.MailSubject);
    formData.append('mailText', this.EmailModals.MailText);
    formData.append('CustomerEmail', this.EmailModals.customerEmail);
    // formData.append('body',htmlstr);

    this._offerpriceService
      .SaveCustomerMailOfferPrice(formData)
      .subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          modal?.dismiss();
          this.resetEmailModal();
        } else {
          this.toast.error(result.reasonPhrase,this.translate.instant("Message"));
        }
      });
  }

  resetEmailModal() {
    this.EmailModals.orgEmail == null;
    this.EmailModals.customerEmail == null;
    this.EmailModals.MailSubject == null;
    this.EmailModals.MailText == null;
    this.uploadedFiles == null;
  }
  //--------------------------------(end)-send email--------------------------------------------

  //-----------------------------------------OfferPrice-------------------------------------------
  //#region

  OfferNoType = 1; // generated

  OfferNoTxtChenged() {
    this.OfferNoType = 2; // manual
  }

  Getnextoffernum() {
    this.OfferNoType = 1;
    this._offerpriceService.Getnextoffernum().subscribe((data) => {
      this.modalDetailsOffer.offer_no = data.result;
    });
  }

  serviceListDataSourceTemp_Offer: any = [];
  GetAllServicesPrice_Offer() {
    this._offerpriceService.GetAllServicesPrice().subscribe((data) => {
      this.serviceListDataSource_Offer = new MatTableDataSource(data.result);
      this.servicesList_Offer = data.result;
      this.serviceListDataSourceTemp_Offer = data.result;
      // this.serviceListDataSource_Offer.paginator = this.paginator;
      // this.serviceListDataSource_Offer.sort = this.sort;
    });
  }
  SelectedRowTable: any;
  getrow(element: any) {
    this.SelectedRowTable = element;
  }
  ResetModel() {
    this.GetAllCustomerForDrop();
    this.FillAllUsersTodropdown();
    this.GetAllServicesPrice_Offer();
    this.modalDetailsOffer = {
      id: 0,
      date: null,
      customer: null,
      customerEn: null,
      price: null,
      user: null,
      userEmail: null,
      project_id: null,
      projectDuration: null,
      customerEmail: null,
      customerPhone: null,
      title: null,
      description: null,
      salesEngineer: null,
      department: null,
      offer_no: null,
      offer_intro: null,
      status: null,
      default: null,
      followDate: null,
      remeberMe: null,
      PrintEn: null,
      NotDisCustPrint: null,
      showNotification: null,
      showSignatures: null,
      showAccount: null,
      taxtype: 2,
    };

    (this.existValue = false), (this.offerServices = []);
    this.offerTerms = [];
    this.offerPayments = [];
  }
  NickNameList = [
    { id: 'السادة', name: { ar: 'السادة', en: 'Gentlemen' } },
    { id: 'السيد /ة', name: { ar: 'السيد /ة', en: 'Mr. /Mrs.' } },
    { id: 'دكتور /ة', name: { ar: 'دكتور /ة', en: 'doctor' } },
    { id: 'مهندس /ة', name: { ar: 'مهندس /ة', en: 'Engineer' } },
  ];

  DescriptionList = [
    { id: 'المحترمين', name: { ar: 'المحترمين', en: 'the respecters' } },
    { id: 'المحترم', name: { ar: 'المحترم', en: 'the respecter' } },
    { id: 'الموقر', name: { ar: 'الموقر', en: 'the esteemed' } },
    { id: 'يحفظه الله', name: { ar: 'يحفظه الله', en: 'May God protect him' } },
    {
      id: 'يحفظهم الله',
      name: { ar: 'يحفظهم الله', en: 'May God protect them' },
    },
  ];

  load_CustomerM: any;
  GetAllCustomerForDrop() {
    this._offerpriceService
      .GetAllCustomerForDropWithBranch()
      .subscribe((data) => {
        this.load_CustomerM = data.result;
      });
  }
  load_EngM: any;
  FillAllUsersTodropdown() {
    this._offerpriceService.FillAllUsersTodropdown().subscribe((data) => {
      this.load_EngM = data;
    });
  }
  resetCustomer() {
    if (this.existValue == true) {
      this.modalDetailsOffer.customer = null;
      this.modalDetailsOffer.customerEn = null;
      this.modalDetailsOffer.customerEmail = null;
      this.modalDetailsOffer.customerPhone = null;
    } else {
      this.modalDetailsOffer.user = null;
    }
  }
  LandAreaData: any = {
    GroundSpace: null,
    FloorList: [],
    TotalSpaces: null,
    AccTotalSpaces: null,
  };
  resetLandArea() {
    this.LandAreaData = {
      GroundSpace: null,
      FloorList: [],
      TotalSpaces: null,
      AccTotalSpaces: null,
    };
  }
  GetAllFloors() {
    this._offerpriceService.GetAllFloors().subscribe((data) => {
      data.result.forEach((element: any) => {
        this.LandAreaData.FloorList?.push({
          floorId: element.floorId,
          floorName: element.floorName,
          floorRatio: element.floorRatio,
          Checked: false,
        });
      });
      this.LandAreaData.FloorList = data.result;
    });
  }

  GetUserInfo() {
    this.modalDetailsOffer.department = null;
    if (this.modalDetailsOffer.salesEngineer != null) {
      this._offerpriceService
        .GetUserById2(this.modalDetailsOffer.salesEngineer)
        .subscribe((data) => {
          this.modalDetailsOffer.department = data.result.departmentName;
        });
    }
  }

  disableButtonSave_Offer = false;

  addOfferCheck(modal: any) {
    debugger;
    if (this.OfferNoType == 2) {
      this._offerpriceService.GetOfferCode_S().subscribe((data) => {
        var ValueUser = this.modalDetailsOffer.offer_no;
        var ValueSys = data.result;
        if(ValueSys!="")
          {
            var NewValue = ValueUser.substring(0, ValueSys.length);
            if (NewValue == ValueSys) {
              this.toast.error(
                'لا يمكن إدخال رقم عرض بنفس الرقم التسلسلي ، فضلا أدخل رقما مختلفا',
               this.translate.instant("Message")
              );
              return;
            }
          }

        this.AddOfferPrice(modal);
      });
    } else {
      this.AddOfferPrice(modal);
    }
  }

  AddOfferPrice(modal: any) {
    //return;
    if (this.modalDetailsOffer.offer_no == null) {
      this.toast.error('لا يمكنك حفظ عرض سعر بدون رقم',this.translate.instant("Message"));
      return;
    }
    if (this.OfferNoType == 2) {
      var ValueUser = this.modalDetailsOffer.offer_no;
      if (!isNaN(ValueUser)) {
        this.toast.error(
          'لا يمكن إدخال رقم عرض سعر بنفس الرقم التسلسلي ، فضلا أدخل رقما مختلفا',
         this.translate.instant("Message")
        );
        return;
      }
    }

    if (
      this.modalDetailsOffer.customer == null &&
      this.modalDetailsOffer.user == null
    ) {
      this.toast.error('ادخل اسم العميل او اختر عميل ',this.translate.instant("Message"));
      return;
    }
    if (this.modalDetailsOffer.date == null) {
      this.toast.error('أختر تاريخ',this.translate.instant("Message"));
      return;
    }

    var offerpriceobj: any = {};

    offerpriceobj.IsContainSign =
      this.modalDetailsOffer.showSignatures ?? false;
    offerpriceobj.IsContainLogo =
      this.modalDetailsOffer.showNotification ?? false;
    offerpriceobj.printBankAccount =
      this.modalDetailsOffer.showAccount ?? false;
    if (this.modalDetailsOffer.PrintEn) offerpriceobj.IsEnglish = 1;
    else offerpriceobj.IsEnglish = 0;
    if (this.modalDetailsOffer.NotDisCustPrint)
      offerpriceobj.NotDisCustPrint = 1;
    else offerpriceobj.NotDisCustPrint = 0;

    offerpriceobj.OffersPricesId = this.modalDetailsOffer.id;
    offerpriceobj.UserId = this.modalDetailsOffer.salesEngineer;
    offerpriceobj.CustomerId = this.modalDetailsOffer.user;
    offerpriceobj.CustomerName = this.modalDetailsOffer.customer;
    offerpriceobj.CUstomerName_EN = this.modalDetailsOffer.customerEn;
    offerpriceobj.CustomerEmail = this.modalDetailsOffer.customerEmail;
    offerpriceobj.Customerphone = this.modalDetailsOffer.customerPhone;
    offerpriceobj.OfferNo = String(this.modalDetailsOffer.offer_no);
    offerpriceobj.OfferDate = this._sharedService.date_TO_String(
      this.modalDetailsOffer.date
    );
    offerpriceobj.OfferValue = +this.modalDetailsOffer.total_amount;
    offerpriceobj.OfferValueTxt = this.modalDetailsOffer.total_amount_text;
    offerpriceobj.Department = this.modalDetailsOffer.department;
    offerpriceobj.OfferNoType = this.OfferNoType ?? 1;

    offerpriceobj.NickName = this.modalDetailsOffer.title;
    offerpriceobj.Description = this.modalDetailsOffer.description;
    offerpriceobj.Introduction = this.modalDetailsOffer.offer_intro;
    if (this.modalDetailsOffer.default) offerpriceobj.setIntroduction = 1;
    else offerpriceobj.setIntroduction = 0;

    if (this.modalDetailsOffer.followDate == null) {
      offerpriceobj.RememberDate = null;
      offerpriceobj.OfferAlarmCheck = null;
      offerpriceobj.ISsent = null;
    } else {
      offerpriceobj.RememberDate = this._sharedService.date_TO_String(
        this.modalDetailsOffer.followDate
      );
      offerpriceobj.OfferAlarmCheck = true;
      offerpriceobj.ISsent = 0;
    }

    var VoucherDetailsList: any = [];
    var conditionList: any = [];
    var dof3aatlist: any = [];
    var input = { valid: true, message: '' };

    this.offerServices.forEach((element: any) => {
      if (element.AccJournalid == null) {
        input.valid = false;
        input.message = 'من فضلك أختر خدمة صحيحة';
        return;
      }
      if (element.Amounttxt == null) {
        input.valid = false;
        input.message = 'من فضلك أختر مبلغ صحيح';
        return;
      }
      if (element.QtyConst == null) {
        input.valid = false;
        input.message = 'من فضلك أختر كمية صحيحة';
        return;
      }

      var oferserviceobj: any = {};
      oferserviceobj.ServiceId = element.AccJournalid;
      oferserviceobj.ServiceQty = element.QtyConst;
      oferserviceobj.TaxType = this.modalDetailsOffer.taxtype;
      oferserviceobj.Serviceamountval = element.Amounttxt;
      oferserviceobj.LineNumber = element.idRow;

      VoucherDetailsList.push(oferserviceobj);
    });
    this.offerTerms.forEach((element: any) => {
      var Conditionobj: any = {};
      //Conditionobj.OffersConditionsId = element.id;
      Conditionobj.OfferConditiontxt = element.statement;
      Conditionobj.OfferConditiontxt_EN = element.statementEn;
      if (element.status == true) {
        Conditionobj.Isconst = 1;
      }
      conditionList.push(Conditionobj);
    });
    this.offerPayments.forEach((element: any) => {
      var val = parseFloat(element.amount ?? 0).toFixed(2);
      var perc = parseFloat(element.ratio ?? 0).toFixed(2);

      if (val == 'NaN' || val == '0') {
        input.valid = false;
        input.message = 'اكمل بيانات الدفعة  ';
        return;
      }
      if (perc == 'NaN' || perc == '0') {
        input.valid = false;
        input.message = 'اكمل بيانات الدفعة  ';
        return;
      }

      var dof3aatobj: any = {};
      //dof3aatobj.PaymentId = element.id;
      dof3aatobj.Amount = +element.amount;
      dof3aatobj.AmountPercentage = element.ratio;

      dof3aatobj.AmountValueText = element.statement;
      dof3aatobj.AmountValueText_EN = element.statementEn;
      if (element.status == true) {
        dof3aatobj.Isconst = 1;
      }
      dof3aatlist.push(dof3aatobj);
    });

    if (!input.valid) {
      this.toast.error(input.message);
      return;
    }
    debugger;
    var DetailsList: any = [];
    var counter = 0;
    if (this.OfferPopupAddorEdit == 1) {
      this.ListDataServices.forEach((elementService: any) => {
        elementService.forEach((element: any) => {
          var Detailsobj: any = {};
          counter++;
          //element.servicesIdVou??0
          Detailsobj.ServicesIdVou = 0;
          Detailsobj.ServicesId = element.servicesId;
          Detailsobj.ParentId = element.parentId;
          Detailsobj.SureService = 1;
          Detailsobj.LineNumber = counter;
          DetailsList.push(Detailsobj);
        });
      });
    } else {
      this.ListDataServices.forEach((elementService: any) => {
        let dataSer = elementService.filter(
          (d: { SureService: any }) => d.SureService == 1
        );
        dataSer.forEach((element: any) => {
          var Detailsobj: any = {};
          counter++;
          Detailsobj.ServicesIdVou = 0;
          Detailsobj.ServicesId = element.servicesId;
          Detailsobj.ParentId = element.parentId;
          Detailsobj.SureService = element.SureService ?? 0;
          Detailsobj.LineNumber = counter;
          DetailsList.push(Detailsobj);
        });
      });
    }

    offerpriceobj.ServicesPriceOffer = DetailsList;
    offerpriceobj.OfferService = VoucherDetailsList;
    offerpriceobj.OffersConditions = conditionList;
    offerpriceobj.CustomerPayments = dof3aatlist;
    this.disableButtonSave_Offer = true;
    setTimeout(() => {
      this.disableButtonSave_Offer = false;
    }, 9000);

    this._offerpriceService
      .saveoffer(offerpriceobj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.getData();
          modal?.dismiss();
        } else {
          this.toast.error(result.reasonPhrase,this.translate.instant("Message"));
        }
      });
  }

  GetOfferservicenByid(OfferId: any) {
    this._offerpriceService.GetOfferservicenByid(OfferId).subscribe((data) => {
      data.result.forEach((element: any) => {
        this.modalDetailsOffer.taxtype = element.taxType;
        debugger;
        this.GetServicesPriceByServiceId_Offer(element);
        element.AccJournalid = element.serviceId;
        this.GetServicesPriceByParentId(element);
      });
    });
  }

  GetServicesPriceByServiceId_Offer(offerdata: any) {
    this._offerpriceService
      .GetServicesPriceByServiceId(offerdata.serviceId)
      .subscribe((data) => {
        var maxVal = 0;

        if (this.offerServices.length > 0) {
          maxVal = Math.max(
            ...this.offerServices.map((o: { idRow: any }) => o.idRow)
          );
        } else {
          maxVal = 0;
        }
        console.log('offerdata');
        console.log(offerdata);
        //maxVal+1
        //offerdata.lineNumber
        this.setServiceRowValueNew_Offer(
          offerdata.lineNumber,
          maxVal + 1,
          data.result,
          offerdata.serviceQty,
          offerdata.serviceamountval
        );
      });
  }

  compare(a: { lineNumber: number }, b: { lineNumber: number }) {
    if (a.lineNumber < b.lineNumber) {
      return -1;
    }
    if (a.lineNumber > b.lineNumber) {
      return 1;
    }
    return 0;
  }

  GetAllCustomerPaymentsboffer(OfferId: any) {
    this._offerpriceService
      .GetAllCustomerPaymentsboffer(OfferId)
      .subscribe((data) => {
        data.result.forEach((element: any) => {
          this.addPaymentsWithData(element);
        });
      });
  }

  GetOfferConditionbyid(OfferId: any) {
    this._offerpriceService.GetOfferConditionbyid(OfferId).subscribe((data) => {
      data.result.forEach((element: any) => {
        this.addTermWithData(element);
      });
    });
  }

  //----------------------------------------

  GetAllCustomerPaymentsconst() {
    this._offerpriceService.GetAllCustomerPaymentsconst().subscribe((data) => {
      data.forEach((element: any) => {
        this.addPaymentsWithData(element);
      });
    });
  }

  GetOfferconditionconst() {
    this._offerpriceService.GetOfferconditionconst().subscribe((data) => {
      data.forEach((element: any) => {
        this.addTermWithData(element);
      });
    });
  }

  //----------------------------------------

  editoffer(data: any) {
    this.ResetInsideSpacesAndFloors();
    this.GetAllFloors();
    this.resetLandArea();
    this.ResetModel();
    this.setdataModals(data);
    this.GetOfferservicenByid(data.offersPricesId);
    this.GetAllCustomerPaymentsboffer(data.offersPricesId);
    this.GetOfferConditionbyid(data.offersPricesId);
  }

  setdataModals(data: any) {
    this.modalDetailsOffer = {
      id: data.offersPricesId,
      date: null,
      customer: data.customerName,
      customerEn: data.cUstomerName_EN,
      price: null,
      user: data.customerId,
      userEmail: null,
      project_id: null,
      projectDuration: null,
      customerEmail: data.customerEmail ?? null,
      customerPhone: data.customerphone,
      title: data.nickName,
      description: data.description,
      salesEngineer: data.userId,
      department: data.department,
      offer_no: data.offerNo,
      offer_intro: data.introduction,
      status: data.offerStatus,
      default: null,
      followDate: null,
      remeberMe: data.offerAlarmCheck,
      PrintEn: data.isEnglish,
      NotDisCustPrint: data.notDisCustPrint,
      showNotification: data.isContainLogo,
      showSignatures: data.isContainSign,
      showAccount: data.printBankAccount,
      taxtype: 2,
      // total_amount:data.offerValue,
      // total_amount_text:data.offerValueTxt,
    };
    this.modalDetailsOffer.date = this._sharedService.String_TO_date(
      data.offerDate
    );

    if (data.customerId != null) this.existValue = true;
    else this.existValue = false;

    if (data.setIntroduction == 1) this.modalDetailsOffer.default = true;
    else this.modalDetailsOffer.default = false;
    if (data.iSsent != null) {
      if (data.rememberDate != null && data.rememberDate != '') {
        this.modalDetailsOffer.followDate = this._sharedService.String_TO_date(
          data.rememberDate
        );
      } else {
        this.modalDetailsOffer.followDate = null;
      }
      this.modalDetailsOffer.remeberMe = data.OfferAlarmCheck;
    } else {
      this.modalDetailsOffer.followDate = null;
      this.modalDetailsOffer.remeberMe = false;
    }
  }

  EditOfferPrice() {
    console.log(this.modalDetailsOffer, this.offerTerms);
  }

  addTerm() {
    var maxVal = 0;
    if (this.offerTerms.length > 0) {
      maxVal = Math.max(...this.offerTerms.map((o: { idRow: any }) => o.idRow));
    } else {
      maxVal = 0;
    }

    this.offerTerms?.push({
      idRow: maxVal + 1,
      id: 0,
      statement: null,
      statementEn: null,
      status: false,
    });
  }
  addTermWithData(data: any) {
    var maxVal = 0;
    if (this.offerTerms.length > 0) {
      maxVal = Math.max(...this.offerTerms.map((o: { idRow: any }) => o.idRow));
    } else {
      maxVal = 0;
    }
    var stat = false;
    if (data.isconst == 1) stat = true;

    this.offerTerms?.push({
      idRow: maxVal + 1,
      id: data.offersConditionsId,
      statement: data.offerConditiontxt,
      statementEn: data.offerConditiontxt_EN,
      status: stat,
    });
  }
  deleteTerm(idRow: any) {
    let index = this.offerTerms.findIndex(
      (d: { idRow: any }) => d.idRow == idRow
    );
    this.offerTerms.splice(index, 1);
  }

  addPayments() {
    var maxVal = 0;
    if (this.offerPayments.length > 0) {
      maxVal = Math.max(
        ...this.offerPayments.map((o: { idRow: any }) => o.idRow)
      );
    } else {
      maxVal = 0;
    }
    this.offerPayments?.push({
      idRow: maxVal + 1,
      id: 0,
      statement: null,
      statementEn: null,
      status: false,
      ratio: null,
      amount: null,
    });
  }

  addPaymentsWithData(data: any) {
    var maxVal = 0;
    if (this.offerPayments.length > 0) {
      maxVal = Math.max(
        ...this.offerPayments.map((o: { idRow: any }) => o.idRow)
      );
    } else {
      maxVal = 0;
    }
    var stat = false;
    if (data.isconst == 1) stat = true;

    this.offerPayments?.push({
      idRow: maxVal + 1,
      id: data.paymentId,
      statement: data.amountValueText,
      statementEn: data.amountValueText_EN,
      status: stat,
      ratio: data.amountPercentage,
      amount: data.amount,
    });
  }

  deletePayments(idRow: any) {
    let index = this.offerPayments.findIndex(
      (d: { idRow: any }) => d.idRow == idRow
    );
    this.offerPayments.splice(index, 1);
  }

  addService() {
    var maxVal = 0;
    if (this.offerServices.length > 0) {
      maxVal = Math.max(
        ...this.offerServices.map((o: { idRow: any }) => o.idRow)
      );
    } else {
      maxVal = 0;
    }

    this.offerServices?.push({
      idRow: maxVal + 1,
      AccJournalid: null,
      UnitConst: null,
      QtyConst: null,
      accountJournaltxt: null,
      Amounttxt: null,
      AmountBeforeTaxtxt:null,
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
  addServiceOffer(
    AccualLinenumber: any,
    indexRow: any,
    item: any,
    Qty: any,
    servamount: any
  ) {
    var maxVal = 0;
    var indexVal = 0;
    if (AccualLinenumber == 0) {
      if (this.offerServices.length > 0) {
        maxVal = Math.max(
          ...this.offerServices.map((o: { idRow: any }) => o.idRow)
        );
      } else {
        maxVal = 0;
      }
      maxVal = maxVal + 1;
      indexVal = indexRow;
    } else {
      maxVal = AccualLinenumber;
      indexVal = AccualLinenumber;
    }

    this.offerServices?.push({
      idRow: maxVal, //indexRow, //maxVal+1,
      AccJournalid: null,
      UnitConst: null,
      QtyConst: null,
      accountJournaltxt: null,
      Amounttxt: null,
      AmountBeforeTaxtxt:null,
      taxAmounttxt: null,
      TotalAmounttxt: null,
      lineNumber: indexVal,
      MeterPrice1: null,
      MeterPrice2: null,
      MeterPrice3: null,
      PackageRatio1: null,
      PackageRatio2: null,
      PackageRatio3: null,
    });
    this.offerServices.filter(
      (a: { idRow: any }) => a.idRow == indexVal
    )[0].AccJournalid = item.servicesId;
    this.offerServices.filter(
      (a: { idRow: any }) => a.idRow == indexVal
    )[0].UnitConst = item.serviceTypeName;
    this.offerServices.filter(
      (a: { idRow: any }) => a.idRow == indexVal
    )[0].QtyConst = Qty;
    this.offerServices.filter(
      (a: { idRow: any }) => a.idRow == indexVal
    )[0].accountJournaltxt = item.name;
    this.offerServices.filter(
      (a: { idRow: any }) => a.idRow == indexVal
    )[0].Amounttxt = servamount;

    this.offerServices.sort(
      (a: { lineNumber: number }, b: { lineNumber: number }) =>
        (a.lineNumber ?? 0) - (b.lineNumber ?? 0)
    ); // b - a for reverse sort
    this.CalculateTotal_Offer();
  }
  deleteService(idRow: any) {
    let index = this.offerServices.findIndex(
      (d: { idRow: any }) => d.idRow == idRow
    );
    this.offerServices.splice(index, 1);
    this.CalculateTotal_Offer();
  }

  setServiceRowValue_Offer(element: any) {
    this.offerServices.filter(
      (a: { idRow: any }) => a.idRow == this.selectedServiceRowOffer
    )[0].AccJournalid = element.servicesId;
    this.offerServices.filter(
      (a: { idRow: any }) => a.idRow == this.selectedServiceRowOffer
    )[0].UnitConst = element.serviceTypeName;
    this.offerServices.filter(
      (a: { idRow: any }) => a.idRow == this.selectedServiceRowOffer
    )[0].QtyConst = 1;
    this.offerServices.filter(
      (a: { idRow: any }) => a.idRow == this.selectedServiceRowOffer
    )[0].accountJournaltxt = element.servicesName;
    this.offerServices.filter(
      (a: { idRow: any }) => a.idRow == this.selectedServiceRowOffer
    )[0].Amounttxt = element.amount;
    this.SetAmountPackage(this.selectedServiceRowOffer, element);
    this.CalculateTotal_Offer();
  }

  setServiceRowValueNew_Offer(
    AccualLinenumber: any,
    indexRow: any,
    item: any,
    Qty: any,
    servamount: any
  ) {
    this.addServiceOffer(AccualLinenumber, indexRow, item, Qty, servamount);
  }

  SetAmountPackage(indexRow: any, item: any) {
    if (item.packageId != null) {
      this.offerServices.filter(
        (a: { idRow: any }) => a.idRow == indexRow
      )[0].MeterPrice1 = item.meterPrice1;
      this.offerServices.filter(
        (a: { idRow: any }) => a.idRow == indexRow
      )[0].MeterPrice2 = item.meterPrice2;
      this.offerServices.filter(
        (a: { idRow: any }) => a.idRow == indexRow
      )[0].MeterPrice3 = item.meterPrice3;
      this.offerServices.filter(
        (a: { idRow: any }) => a.idRow == indexRow
      )[0].PackageRatio1 = item.packageRatio1;
      this.offerServices.filter(
        (a: { idRow: any }) => a.idRow == indexRow
      )[0].PackageRatio2 = item.packageRatio2;
      this.offerServices.filter(
        (a: { idRow: any }) => a.idRow == indexRow
      )[0].PackageRatio3 = item.packageRatio3;
    } else {
      this.offerServices.filter(
        (a: { idRow: any }) => a.idRow == indexRow
      )[0].MeterPrice1 = 0;
      this.offerServices.filter(
        (a: { idRow: any }) => a.idRow == indexRow
      )[0].MeterPrice2 = 0;
      this.offerServices.filter(
        (a: { idRow: any }) => a.idRow == indexRow
      )[0].MeterPrice3 = 0;
      this.offerServices.filter(
        (a: { idRow: any }) => a.idRow == indexRow
      )[0].PackageRatio1 = 0;
      this.offerServices.filter(
        (a: { idRow: any }) => a.idRow == indexRow
      )[0].PackageRatio2 = 0;
      this.offerServices.filter(
        (a: { idRow: any }) => a.idRow == indexRow
      )[0].PackageRatio3 = 0;
    }
  }

  SelectFloorFuncCalc() {
    debugger;
    var Sum = 0;
    if (this.LandAreaData.GroundSpace != null) {
      this.LandAreaData.FloorList.forEach((element: any) => {
        if (element.Checked == true) {
          var ValueGroundFloor =
            parseFloat(element.floorRatio) *
            parseFloat(this.LandAreaData.GroundSpace);
          Sum =
            +parseFloat(Sum.toString()) +
            +parseFloat(ValueGroundFloor.toString());
        }
      });
    } else {
      Sum = 0;
    }
    this.LandAreaData.TotalSpaces = parseFloat(Sum.toString()).toFixed(2);
    this.AccTotalSpacesRange('', parseFloat(Sum.toString()).toFixed(2));
  }

  ResetAllCheckAndInput() {
    this.ResetInsideSpacesAndFloors();
    this.GetAllFloors();
  }

  ResetInsideSpacesAndFloors() {
    this.LandAreaData.FloorList = [];
  }
  AccValue = 0;
  CheckEnter = false;
  AccTotalSpacesRange(searchText: any, Value: any) {
    debugger;
    this.CheckEnter = false;
    this.AccValue = 0;
    this._offerpriceService.GetAllTotalSpacesRange().subscribe((data) => {
      data.result.forEach((element: any) => {
        if (this.CheckEnter == false) {
          if (+Value > 1) {
            if (+Value <= element.rangeValue) {
              this.AccValue = element.rangeValue;
              this.CheckEnter = true;
              this.LandAreaData.AccTotalSpaces = parseFloat(
                this.AccValue.toString()
              ).toFixed(2);
            }
          }
        }
      });
    });
  }

  TempSave(modal: any) {
    debugger;
    if (
      this.LandAreaData.GroundSpace == null ||
      this.LandAreaData.TotalSpaces == null ||
      this.LandAreaData.AccTotalSpaces == null ||
      this.LandAreaData.GroundSpace == 0 ||
      this.LandAreaData.TotalSpaces == 0 ||
      this.LandAreaData.AccTotalSpaces == 0
    ) {
    } else {
      this.offerServices.forEach((element: any) => {
        var MeterPrice1_V = parseFloat(element.MeterPrice1).toFixed(2);
        var MeterPrice2_V = parseFloat(element.MeterPrice2).toFixed(2);
        var MeterPrice3_V = parseFloat(element.MeterPrice3).toFixed(2);

        var PackageRatio1_V = parseFloat(element.PackageRatio1).toFixed(2);
        var PackageRatio2_V = parseFloat(element.PackageRatio2).toFixed(2);
        var PackageRatio3_V = parseFloat(element.PackageRatio3).toFixed(2);

        var AccTotalSpaces = parseFloat(
          this.LandAreaData.AccTotalSpaces
        ).toFixed(2);
        var GeneralRatioValue = parseFloat((1.15).toString()).toFixed(2);
        var AccAmount = 0;
        if (+AccTotalSpaces <= +PackageRatio1_V) {
          AccAmount =
            +parseFloat(AccTotalSpaces).toFixed(2) *
            +parseFloat(MeterPrice1_V).toFixed(2) *
            +parseFloat(GeneralRatioValue).toFixed(2);
        } else if (+AccTotalSpaces <= +PackageRatio2_V) {
          AccAmount =
            +parseFloat(AccTotalSpaces).toFixed(2) *
            +parseFloat(MeterPrice2_V).toFixed(2) *
            +parseFloat(GeneralRatioValue).toFixed(2);
        } else if (+AccTotalSpaces <= +PackageRatio3_V) {
          AccAmount =
            +parseFloat(AccTotalSpaces).toFixed(2) *
            +parseFloat(MeterPrice3_V).toFixed(2) *
            +parseFloat(GeneralRatioValue).toFixed(2);
        } else {
          AccAmount = 0;
        }
        element.Amounttxt = parseFloat(AccAmount.toString()).toFixed(2);
        this.CalculateTotal_Offer();
        modal?.dismiss();
      });
    }
  }

  CalculateTotal_Offer() {
    var totalwithtaxes = 0;
    var totalAmount = 0;
    var totaltax = 0;
    var totalAmountIncludeT = 0;
    var vAT_TaxVal = parseFloat(this.userG.orgVAT ?? 0);

    this.offerServices.forEach((element: any) => {
      var Value = parseFloat((element.Amounttxt ?? 0).toString()).toFixed(2);
      var FVal = +Value * element.QtyConst;
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
      if (this.modalDetailsOffer.taxtype == 2) {
        taxAmount = +TaxV8erS;
        totalwithtax = +parseFloat(
          (+parseFloat(Value) + +parseFloat(TaxV8erS)).toString()
        ).toFixed(2);
      } else {
        taxAmount = +TaxVS;
        FValIncludeT = +parseFloat(
          (+parseFloat(Value).toFixed(2) - +TaxVS).toString()
        ).toFixed(2);
        totalwithtax = +parseFloat(Value).toFixed(2);
      }
      this.offerServices.filter(
        (a: { idRow: any }) => a.idRow == element.idRow
      )[0].AmountBeforeTaxtxt = parseFloat(FValIncludeT.toString()).toFixed(2);
      this.offerServices.filter(
        (a: { idRow: any }) => a.idRow == element.idRow
      )[0].taxAmounttxt = parseFloat(taxAmount.toString()).toFixed(2);
      this.offerServices.filter(
        (a: { idRow: any }) => a.idRow == element.idRow
      )[0].TotalAmounttxt = parseFloat(
        (totalwithtax * element.QtyConst).toString()
      ).toFixed(2);

      totalwithtaxes += totalwithtax;
      totalAmount += FVal;
      totalAmountIncludeT += totalwithtax;
      totaltax += taxAmount;
    });
    this.CalcSumTotal();
    this.CalcOfferDet(1);
  }

  CalcSumTotal() {
    let sum = 0;
    this.offerServices.forEach((element: any) => {
      sum = +sum + +parseFloat(element.TotalAmounttxt ?? 0).toFixed(2);
    });
    this.modalDetailsOffer.total_amount = parseFloat(sum.toString()).toFixed(2);
    this.ConvertNumToString_Offer(this.modalDetailsOffer.total_amount);
  }

  CalcOfferDet(type: any) {
    var totalvalue = 0;
    var totalperc = 0;
    this.offerPayments.forEach((element: any) => {
      var Total = parseFloat(this.modalDetailsOffer.total_amount).toFixed(2);

      var val = parseFloat(element.amount ?? 0).toFixed(2);
      var perc = parseFloat(element.ratio ?? 0).toFixed(2);

      if (type == 1) {
        var MoneyAfterPerc = parseFloat(
          ((+perc * +Total) / 100).toString()
        ).toFixed(2);
        element.amount = MoneyAfterPerc;
        if (MoneyAfterPerc != 'NaN') {
          totalvalue =
            +parseFloat(totalvalue.toString()).toFixed(2) +
            +parseFloat(MoneyAfterPerc).toFixed(2);
          totalperc =
            +parseFloat(totalperc.toString()).toFixed(2) +
            +parseFloat(perc).toFixed(2);
        }
      } else {
        var PercAfterMony = parseFloat(
          ((+val / +Total) * 100).toString()
        ).toFixed(2);
        element.ratio = PercAfterMony;
        if (PercAfterMony != 'NaN') {
          totalvalue =
            +parseFloat(totalvalue.toString()).toFixed(2) +
            +parseFloat(val).toFixed(2);
          totalperc =
            +parseFloat(totalperc.toString()).toFixed(2) +
            +parseFloat(PercAfterMony).toFixed(2);
        }
      }

      if (+parseFloat(element.amount).toFixed(2) > +Total) {
        element.amount = null;
        element.ratio = null;
      }

      if (+parseFloat(element.ratio).toFixed(2) > 100) {
        element.amount = null;
        element.ratio = null;
      }

      if (element.ratio == null || element.amount == null) {
        element.amount = null;
        element.ratio = null;
      }
      if (+totalperc > 100) {
        element.amount = null;
        element.ratio = null;
      }
    });
  }

  ConvertNumToString_Offer(val: any) {
    this._offerpriceService.ConvertNumToString(val).subscribe((data) => {
      this.modalDetailsOffer.total_amount_text = data?.reasonPhrase;
    });
  }
  disableButtonIntoduceoffer = false;

  Intoduceoffer(_offersPricesId: any) {
    debugger;
    this.disableButtonIntoduceoffer = true;
    setTimeout(() => {
      this.disableButtonIntoduceoffer = false;
    }, 7000);

    let url = document.location.href;
    var newstr = url.replace('projects/offers-price', 'accept-offer-price');
    this._offerpriceService
      .Intoduceoffer(_offersPricesId, newstr)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.getData();
        } else {
          this.toast.error(result.reasonPhrase,this.translate.instant("Message"));
        }
      });
  }
  IntoduceofferManual(_offersPricesId: any) {
    debugger;
    this.disableButtonIntoduceoffer = true;
    setTimeout(() => {
      this.disableButtonIntoduceoffer = false;
    }, 7000);

    let url = document.location.href;
    var newstr = url.replace('projects/offers-price', 'accept-offer-price');
    this._offerpriceService
      .IntoduceofferManual(_offersPricesId, newstr)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.getData();
        } else {
          this.toast.error(result.reasonPhrase,this.translate.instant("Message"));
        }
      });
  }

  DeleteOffer() {
    this._offerpriceService
      .DeleteOffer(this.SelectedRowTable.offersPricesId)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.getData();
        } else {
          this.toast.error(result.reasonPhrase,this.translate.instant("Message"));
        }
      });
  }
  Customeraccept(element: any) {
    this._offerpriceService
      .Customeraccept(element.offersPricesId)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.getData();
        } else {
          this.toast.error(result.reasonPhrase,this.translate.instant("Message"));
        }
      });
  }

  ListDataServices: any = [];
  GetServicesPriceByParentId(element: any) {
    this.serviceDetails = [];
    if (element.AccJournalid != null) {
      if (this.OfferPopupAddorEdit == 0) {
        this._offerpriceService
          .GetServicesPriceByParentId(element.AccJournalid)
          .subscribe((data) => {
            this.serviceDetails = data.result;
            debugger;
            var Check = true;
            if (this.ListDataServices.length > 0) {
              for (let ele of this.ListDataServices) {
                var val = ele.filter(
                  (a: { parentId: any }) => a.parentId == element.AccJournalid
                );
                if (val.length == 0) {
                  Check = false;
                } else {
                  Check = true;
                  break;
                }
              }
            } else {
              Check = false;
            }

            if (Check == false) {
              this.ListDataServices.push(this.serviceDetails);
            }
            this.SetDetailsCheck(this.serviceDetails);
          });
      } else {
        this._offerpriceService
          .GetServicesPriceVouByParentId(
            element.AccJournalid,
            this.SelectedRowTable.offersPricesId
          )
          .subscribe((data) => {
            this.serviceDetails = data.result;
            debugger;
            var Check = true;
            if (this.ListDataServices.length > 0) {
              for (let ele of this.ListDataServices) {
                var val = ele.filter(
                  (a: { parentId: any }) => a.parentId == element.AccJournalid
                );
                if (val.length == 0) {
                  Check = false;
                } else {
                  Check = true;
                  break;
                }
              }
            } else {
              Check = false;
            }

            if (Check == false) {
              this.ListDataServices.push(this.serviceDetails);
            }
            this.serviceDetails.sort(
              (a: { lineNumber: number }, b: { lineNumber: number }) =>
                (a.lineNumber ?? 0) - (b.lineNumber ?? 0)
            ); // b - a for reverse sort
          });
      }
    }
  }

  SureServiceList: any = [];
  MarkServiceDetails(item: any) {
    if (item?.SureService == 1) item.SureService = 0;
    else item.SureService = 1;
    this.SureServiceList.push(item);
  }
  UnMarkServiceDetails(item: any) {
    if (item?.SureService == 1) item.SureService = 0;
    else item.SureService = 1;
    if (this.SureServiceList.length > 0) {
      let index = this.SureServiceList.findIndex(
        (d: { servicesId: any }) => d.servicesId == item.servicesId
      );
      if (index != -1) {
        this.SureServiceList.splice(index, 1);
      }
    }
  }
  RemoveServicesparent(ele: any) {
    {
      debugger;
      var TempService = this.ListDataServices;
      this.ListDataServices = [];
      let newArray = this.SureServiceList.filter(
        (d: { parentId: any }) => d.parentId != ele.AccJournalid
      );
      TempService.forEach((element: any) => {
        let newArray2 = element.filter(
          (d: { parentId: any }) => d.parentId != ele.AccJournalid
        );
        if (newArray2.length > 0) {
          this.ListDataServices.push(newArray2);
        }
      });
      this.SureServiceList = newArray;
    }
  }
  SetDetailsCheck(item: any) {
    item.forEach((element: any) => {
      let filteritem = this.SureServiceList.filter(
        (d: { servicesId: any }) => d.servicesId == element.servicesId
      );
      if (filteritem.length > 0) {
        element.SureService = 1;
      }
    });
  }

  applyFilterServiceList_Offer(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.serviceListDataSource_Offer.filter = filterValue.trim().toLowerCase();
  }
  //#endregion
  //---------------------------------------------end--OfferPrice------------------------------------
  //------------------------------------------Print-----------------------------------------

  hijridate: any = null;
  selectedDate: any = null;
  datee: any = null;

  selectedDateType = DateType.Hijri; // or DateType.Gregorian

  gethijri(event: any) {}
  getGregorian(event: any) {}
  onDatesChange(event: any) {}
  translatee() {
    //var reasonPhrase='ترجمة تجريبي';
    var reasonPhrase = 'trans';
    var date = new Date();

    this.toast.success(this.translate.instant(reasonPhrase),this.translate.instant("Message"));
  }

  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }

  printData2(id: any) {
    printJS({
      printable: id,
      type: 'html',
      scanStyles: false,
      targetStyles: ['*'],
      // targetStyles: ['#report, .txtval {page-break-inside: auto;page-break-after: always;}',
      // '.table-responsive, .ngx-datatable { font-family: tahoma; display: block;margin: 2em auto;width: 100%;page-break-inside: auto;page-break-after: always;}',
      //  '.page-count { display: none; }'],
      css: [''],
    });
  }

  OfferPrintData: any = null;
  OfferCustomData: any = {
    CustomerMobile: null,
    CustomerEmail: null,
    Account1Img: null,
    Account2Img: null,
    Account1Bank: null,
    Account2Bank: null,
    OrgImg: null,
    ValuetxtConvert: null,
    CustomerName: null,
  };
  resetOfferCustomData() {
    this.OfferPrintData = null;
    this.OfferCustomData = {
      CustomerMobile: null,
      CustomerEmail: null,
      Account1Img: null,
      Account2Img: null,
      Account1Bank: null,
      Account2Bank: null,
      OrgImg: null,
      ValuetxtConvert: null,
      CustomerName: null,
    };
  }

  GetOfferPricePrint(obj: any, TempCheck: any) {
    // this._printreportsService.ChangeOffer_PDF(obj.invoiceId).toPromise()
    // .then((response: { json: () => any[]; }) => response.json()[1]);

    this.resetOfferCustomData();
    this._printreportsService
      .ChangeOffer_PDF(obj.offersPricesId)
      .subscribe((data) => {
        debugger;
        this.OfferPrintData = data;
        if (TempCheck == 1) {
          this.lang = 'ar';
          this.OfferCustomData.CustomerName =
            this.OfferPrintData?.customer?.customerNameAr;
          this.OfferCustomData.ValuetxtConvert =
            this.OfferPrintData?.offersvaltxt;
        } else {
          this.lang = 'en';
          this.OfferCustomData.CustomerName =
            this.OfferPrintData?.customer?.customerNameEn;
          this._offerpriceService
            .ConvertNumToStringEnglish(
              this.OfferPrintData?.offers?.offerValue ?? 0
            )
            .subscribe((data) => {
              this.OfferCustomData.ValuetxtConvert = data?.reasonPhrase;
            });
        }

        debugger;
        if (this.OfferPrintData?.offers.printBankAccount != true) { 
          this.OfferCustomData.Account1Bank =
            this.OfferPrintData?.orgIsRequired_VD == true
              ? this.OfferPrintData?.org_VD.accountBank
              : this.OfferPrintData?.branch_VD.accountBank;
          this.OfferCustomData.Account2Bank =
            this.OfferPrintData?.orgIsRequired_VD == true
              ? this.OfferPrintData?.org_VD.accountBank2
              : this.OfferPrintData?.branch_VD.accountBank2;
          this.OfferCustomData.Account1Img =
            this.OfferPrintData?.orgIsRequired_VD == true
              ? this.OfferPrintData?.org_VD?.bankIdImgURL
              : this.OfferPrintData?.branch_VD.bankIdImgURL;
          this.OfferCustomData.Account2Img =
            this.OfferPrintData?.orgIsRequired_VD == true
              ? this.OfferPrintData?.org_VD.bankId2ImgURL
              : this.OfferPrintData?.branch_VD.bankId2ImgURL;
        } else {
          this.OfferCustomData.Account1Bank = null;
          this.OfferCustomData.Account2Bank = null;
          this.OfferCustomData.Account1Img = null;
          this.OfferCustomData.Account2Img = null;
        }
        if (this.OfferCustomData.Account1Img)
          this.OfferCustomData.Account1Img =
            environment.PhotoURL + this.OfferCustomData.Account1Img;
        else this.OfferCustomData.Account1Img = null;

        if (this.OfferCustomData.Account2Img)
          this.OfferCustomData.Account2Img =
            environment.PhotoURL + this.OfferCustomData.Account2Img;
        else this.OfferCustomData.Account2Img = null;

        if (this.OfferPrintData?.offers?.isContainLogo == false)
          this.OfferCustomData.OrgImg =
            environment.PhotoURL + this.OfferPrintData?.org_VD.logoUrl;
        else this.OfferCustomData.OrgImg = null;

        if (this.OfferPrintData?.offers?.notDisCustPrint == false) {
          this.OfferCustomData.CustomerMobile =
            this.OfferPrintData?.customer?.customerMobile;
          this.OfferCustomData.CustomerEmail =
            this.OfferPrintData?.customer?.customerEmail;
        } else {
          this.OfferCustomData.CustomerMobile = '----';
          this.OfferCustomData.CustomerEmail = '----';
        }
      });
  }

  GetNikeNameOfferPrice(lang: any, nickName: any) {
    if (lang == 'ar') {
      return nickName;
    } else {
      if (nickName == 'السادة') return 'Gentlemen';
      else if (nickName == 'السيد /ة') return 'Mr. /Mrs.';
      else if (nickName == 'دكتور /ة') return 'doctor';
      else if (nickName == 'مهندس /ة') return 'Engineer';
      else nickName;
    }
  }
  GetCustomerName(lang: any, customer: any) {
    if (lang == 'ar') {
      return customer?.customerNameAr;
    } else {
      return customer?.customerNameEn;
    }
  }
  GetpresenterName(lang: any, obj: any) {
    if (lang == 'ar') {
      return obj?.presenter;
    } else {
      return obj?.presenterEN;
    }
  }
  GetServiceName(lang: any, obj: any) {
    if (lang == 'ar') {
      return obj?.serviceName;
    } else {
      return obj?.servicesNameEN;
    }
  }
  GetServiceDetName(lang: any, obj: any) {
    if (lang == 'ar') {
      return obj?.name;
    } else {
      return obj?.servicesNameEn;
    }
  }
  GetDescriptionOfferPrice(lang: any, description: any) {
    if (lang == 'ar') {
      return description;
    } else {
      if (description == 'المحترمين') return 'the respecters';
      else if (description == 'المحترم') return 'the respecter';
      else if (description == 'الموقر') return 'the esteemed';
      else if (description == 'يحفظه الله') return 'May God protect him';
      else if (description == 'يحفظهم الله') return 'May God protect them';
      else description;
    }
  }

  Getserviceamountval(value: any) {
    return parseFloat((value ?? 0).toString()).toFixed(2);
  }
  GetofferValue(value: any) {
    return parseFloat((value ?? 0).toString()).toFixed(2);
  }

  GetTaxValue(item: any, TaxAmount: any) {
    var Value = item.serviceamountval;
    var taxAmount = null;
    var totalwithtax = null;
    var tax = parseFloat(TaxAmount);
    var TaxV8erS = (Value * tax) / 100;
    var TaxVS = Value - Value / (tax / 100 + 1);

    if (item.taxType == 2) {
      taxAmount = parseFloat(TaxV8erS.toString()).toFixed(2);
      totalwithtax = parseFloat((Value + TaxV8erS).toString()).toFixed(2);
    } else {
      taxAmount = parseFloat(TaxVS.toString()).toFixed(2);
      totalwithtax = parseFloat(Value.toString()).toFixed(2);
    }
    return taxAmount;
  }

  GetTotalValue(item: any, TaxAmount: any) {
    var Value = item.serviceamountval;
    var taxAmount = null;
    var totalwithtax = null;
    var tax = parseFloat(TaxAmount);
    var TaxV8erS = (Value * tax) / 100;
    var TaxVS = Value - Value / (tax / 100 + 1);

    if (item.taxType == 2) {
      taxAmount = parseFloat(TaxV8erS.toString()).toFixed(2);
      totalwithtax = parseFloat((+Value + +TaxV8erS).toString()).toFixed(2);
    } else {
      taxAmount = parseFloat(TaxVS.toString()).toFixed(2);
      totalwithtax = parseFloat(Value.toString()).toFixed(2);
    }
    var total = (item.serviceQty ?? 0) * +totalwithtax;
    return parseFloat(total.toString()).toFixed(2);
  }

  //---------------------------------------Invoice---------------------------------------------
  //#region
  @ViewChild('paginatorServices') paginatorServices!: MatPaginator;
  @ViewChild('NewInvoiceModal') newInvoiceModal: any;

  invoicepop = 1;
  setCustomerInvoice() {
    this.modalInvoice.customerId = this.modalDetailsProject.customer;
    this.customerIdChange();
  }

  modalInvoice: any = {
    InvoiceId: 0,
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
    AlarmVoucherInvDate: null,
    Currency: null,
    BranchSelect: null,
    OrganizationsMobile: null,
    OrganizationsAddress: null,
    Reference: null,
    popuptype: 1, //(1) normal invoice - (2) invoice without project - (3) Creditnoti
    CreditNotiLbl: 0,
    DepitNotiLbl: 0,

    CustomerTax: null,
    CustomerAddress: null,
    Customeridtype: null,

    AllCustomerCheck: false,
    OfferPriceNoCheck: null,
    OfferPriceNo: null,

    descountmoney: null,
    descountpersentage: null,
    PaidValue: 0,
    remainder: 0,

    taxtype: 2,
    totalAmount: 0,
    discounMoneytVal: 0,
    total_: 0,
    totalWithDiscount: 0,
    taxAmountLbl: 0,
    VoucherValue: 0,
    TotalVoucherValueLbl: 0,

    WhichClick: 1,
    AddOrView: 1,
  };
  InvoiceDetailsRows: any = [];
  Paytype: any;
  resetInvoiceData() {
    this.Paytype = [
      { id: 1, name: { ar: 'نقدي', en: 'Monetary' } },
      { id: 8, name: { ar: 'آجل', en: 'Postpaid' } },
      {
        id: 17,
        name: { ar: 'نقدا نقاط بيع - مدى-ATM', en: 'Cash points of sale ATM' },
      },
      { id: 9, name: { ar: 'شبكة', en: 'Network' } },
      { id: 6, name: { ar: 'حوالة', en: 'Transfer' } },
    ];

    this.InvoiceDetailsRows = [];
    this.load_CostCenter = [];
    this.load_Accounts = [];
    this.load_Customer = [];
    this.load_Projects = [];
    this.load_OfferPrices = [];

    this.modalInvoice = {
      InvoiceId: 0,
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
      AlarmVoucherInvDate: null,
      Currency: null,
      BranchSelect: null,
      OrganizationsMobile: null,
      OrganizationsAddress: null,
      Reference: null,
      popuptype: 1, //(1) normal invoice - (2) invoice without project - (3) Creditnoti
      CreditNotiLbl: 0,
      DepitNotiLbl: 0,

      CustomerTax: null,
      CustomerAddress: null,
      Customeridtype: null,

      AllCustomerCheck: false,
      OfferPriceNoCheck: null,
      OfferPriceNo: null,

      descountmoney: null,
      descountpersentage: null,
      PaidValue: 0,
      remainder: 0,

      taxtype: 2,
      totalAmount: 0,
      discounMoneytVal: 0,
      total_: 0,
      totalWithDiscount: 0,
      taxAmountLbl: 0,
      VoucherValue: 0,
      TotalVoucherValueLbl: 0,

      WhichClick: 1,
      AddOrView: 1,
    };
  }

  setAddress_Inv() {
    this.modalInvoice.OrganizationsAddress = 'المركز الرئيسي';
  }
  InvoicePopup(typepage: any) {
    this.setAddress_Inv();
    var date = new Date();
    var datebefore = this._sharedService.date_TO_String(date);
    var Hijridate = this._sharedService.GetHijriDate(
      date,
      'Contract/GetHijriDate'
    );
    //this.modalInvoice.HijriDate=

    if (typepage == 2) {
      this.FillCostCenterSelect();
      //this.FillAllCustomerSelectNotHaveProjWithBranch();
      this.FillAllCustomerSelectWithBranch();
      this.GetBranch_Costcenter();
    } else if (typepage == 1) {
      this.FillCostCenterSelect_Invoices(null);
      this.FillCustomerSelectWProOnlyWithBranch();
    }
    this.FillStorehouseSelect();
    this.resetInvoiceData();
    this.modalInvoice.popuptype = typepage;
    this.GetBranchOrganization();
    this.GenerateVoucherNumber();

    this.FillCustAccountsSelect2AndUpdate(this.modalInvoice.PayType);
    this.GetAllServicesPrice();
    this.setCustomerInvoice();
  }

  load_Customer: any;
  FillAllCustomerSelectNotHaveProjWithBranch() {
    this._invoiceService.GetAllCustomerForDrop().subscribe((data) => {
      this.load_Customer = data.result;
    });
  }
  FillAllCustomerSelectWithBranch() {
    this._invoiceService.GetAllCustomerForDrop().subscribe((data) => {
      this.load_Customer = data.result;
    });
  }
  FillCustomerSelectWProOnlyWithBranch() {
    this._invoiceService.GetAllCustomerForDrop().subscribe((data) => {
      this.load_Customer = data.result;
    });
  }
  load_CostCenter: any;
  FillCostCenterSelect() {
    this._invoiceService.FillCostCenterSelect().subscribe((data) => {
      this.load_CostCenter = data;
    });
  }
  FillCostCenterSelect_Invoices(projectid: any) {
    if (projectid != null) {
      this._invoiceService
        .FillCostCenterSelect_Invoices(projectid)
        .subscribe((data) => {
          this.load_CostCenter = data;
        });
    } else {
      this.load_CostCenter = [];
      this.modalInvoice.CostCenterId = null;
    }
  }
  FillCostCenterSelect_InvoicesWithGet(projectid: any) {
    if (projectid != null) {
      this._invoiceService
        .FillCostCenterSelect_Invoices(projectid)
        .subscribe((data) => {
          this.load_CostCenter = data;
          this.GetCostCenterByProId_Proj(this.modalInvoice.ProjectId);
        });
    } else {
      this.load_CostCenter = [];
      this.modalInvoice.CostCenterId = null;
    }
  }
  GetBranch_Costcenter() {
    this._invoiceService.GetBranch_Costcenter().subscribe((data) => {
      this.modalInvoice.CostCenterId = data.result.costCenterId;
    });
  }
  GetBranchOrganization() {
    this._invoiceService.GetBranchOrganization().subscribe((data) => {
      this.modalInvoice.OrganizationsMobile = data.result.mobile;
    });
  }
  GenerateVoucherNumber() {
    this._invoiceService
      .GenerateVoucherNumber(this.modalInvoice.Type)
      .subscribe((data) => {
        this.modalInvoice.InvoiceNumber = data.reasonPhrase;
        // this.InvoiceDetailsRows=[];
        if (this.invoicepop != 2) {
          this.addInvoiceRow();
        }
      });
  }
  load_Accounts: any;
  FillCustAccountsSelect2(PayType: any) {
    if (PayType) {
      this._invoiceService
        .FillCustAccountsSelect2(PayType)
        .subscribe((data) => {
          this.load_Accounts = data;
        });
    } else {
      this.load_Accounts = [];
    }
  }
  FillCustAccountsSelect2AndUpdate(PayType: any) {
    if (PayType) {
      this._invoiceService
        .FillCustAccountsSelect2(PayType)
        .subscribe((data) => {
          this.load_Accounts = data;
          if (PayType != 8) {
            if (this.load_Accounts?.length > 0) {
              this.modalInvoice.ToAccountId = this.load_Accounts[0]?.id;
            } else {
              this.modalInvoice.ToAccountId = null;
            }
          }
        });
    } else {
      this.load_Accounts = [];
    }
  }

  load_Projects: any;
  FillAllProjectSelectByNAccId(PayType: any) {
    if (PayType) {
      this._invoiceService
        .FillAllProjectSelectByNAccId(PayType)
        .subscribe((data) => {
          this.load_Projects = data;
        });
    } else {
      this.load_Projects = [];
    }
  }
  GetAllProjByCustomerId(customerid: any) {
    this.load_Projects = [];
    this.modalInvoice.ProjectId = null;
    if (customerid) {
      this._invoiceService
        .GetAllProjByCustomerId(customerid)
        .subscribe((data) => {
          this.load_Projects = data;
          if (this.load_Projects.length == 1) {
            this.modalInvoice.ProjectId = this.load_Projects[0].id;
            this.GetCostCenterByProId_Proj(this.modalInvoice.ProjectId);
          }
        });
    } else {
      this.load_Projects = [];
    }
  }
  GetCostCenterByProId_Proj(projectid: any) {
    if (projectid) {
      this._invoiceService.GetCostCenterByProId(projectid).subscribe((data) => {
        this.modalInvoice.CostCenterId = data.result.costCenterId;
      });
    } else {
      this.modalInvoice.CostCenterId = null;
    }
  }
  AllCustomerCheckChange() {
    this.modalInvoice.customerId = null;
    if (this.modalInvoice.AllCustomerCheck) {
      this.FillAllCustomerSelectWithBranch();
    } else {
      this.FillAllCustomerSelectNotHaveProjWithBranch();
    }
  }
  PayTypeChange() {
    this.modalInvoice.ToAccountId = null;
    if (this.modalInvoice.PayType != null) {
      this.FillAllProjectSelectByNAccId(0); //
      if (this.modalInvoice.popuptype == 1) {
        this.FillCustomerSelectWProOnlyWithBranch();
      } else if (this.modalInvoice.popuptype == 2) {
        this.FillAllCustomerSelectNotHaveProjWithBranch();
      }
    }
    if (this.modalInvoice.PayType == 8) {
      this.FillCustAccountsSelect2(this.modalInvoice.PayType);
      this.getCusAccID(this.modalInvoice.customerId, true);
      this.CalculateTotal2(1);
    } else if (this.modalInvoice.PayType == 1) {
      this.FillCustAccountsSelect2AndUpdate(this.modalInvoice.PayType);
    } else if (this.modalInvoice.PayType == 17) {
      this.FillCustAccountsSelect2AndUpdate(this.modalInvoice.PayType);
    } else {
      this.FillCustAccountsSelect2(this.modalInvoice.PayType);
    }
  }

  getCusAccID(customerid: any, paytype: any) {
    if (customerid != null) {
      this._invoiceService
        .GetCustomersByCustomerId(customerid)
        .subscribe((data) => {
          if (paytype) {
            this.modalInvoice.ToAccountId = data.result.accountId;
          }
          if (data.result.customerTypeId == 2) {
            this.modalInvoice.CustomerTax = data.result.customerAddress;
            this.modalInvoice.CustomerAddress = data.result.customerAddress;
            this.modalInvoice.Customeridtype = data.result.customerTypeId;
          } else {
            this.modalInvoice.CustomerTax = data.result.commercialRegister;
            this.modalInvoice.CustomerAddress = data.result.customerAddress;
            this.modalInvoice.Customeridtype = data.result.customerTypeId;
          }
        });
    }
  }

  load_OfferPrices: any;
  FillAllOfferTodropdownOld(customerid: any) {
    if (customerid != null) {
      this._invoiceService
        .FillAllOfferTodropdownOld(customerid)
        .subscribe((data) => {
          this.load_OfferPrices = data;
        });
    } else {
      this.load_OfferPrices = [];
    }
  }

  ProjectIdChange() {
    if (this.modalInvoice.ProjectId != null) {
      this.FillCostCenterSelect_Invoices(this.modalInvoice.ProjectId);
      this.GetCostCenterByProId_Proj(this.modalInvoice.ProjectId);
    } else {
      this.load_CostCenter = [];
      this.modalInvoice.CostCenterId = null;
    }
  }

  customerIdChange() {
    this.FillAllOfferTodropdownOld(this.modalInvoice.customerId);

    if (this.modalInvoice.PayType == 8) {
      this.getCusAccID(this.modalInvoice.customerId, true);
    } else {
      this.getCusAccID(this.modalInvoice.customerId, false);
    }

    this.GetAllProjByCustomerId(this.modalInvoice.customerId);
  }

  CalculateTotal2(type: any) {
    this.modalInvoice.descountmoney = null;
    this.modalInvoice.descountpersentage = null;
    this.modalInvoice.PaidValue = 0;
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

  checkRemainder() {
    var _paidValInvoice = parseFloat(this.modalInvoice.PaidValue).toFixed(2);
    var totalInvoiceVal = parseFloat(
      this.modalInvoice.TotalVoucherValueLbl
    ).toFixed(2);
    if (
      parseInt(_paidValInvoice) > parseInt(totalInvoiceVal) &&
      parseInt(totalInvoiceVal) != 0
    ) {
      this.modalInvoice.PaidValue = totalInvoiceVal;
    }
    var remainder =
      +parseFloat(this.modalInvoice.TotalVoucherValueLbl).toFixed(2) -
      +parseFloat(this.modalInvoice.PaidValue).toFixed(2);
      var Accremainder = parseFloat(remainder.toString()).toFixed(2);
      this.modalInvoice.remainder = Accremainder;
  }

  offerpriceChange() {
    var stu = this.modalInvoice.OfferPriceNoCheck;
    if (this.modalInvoice.OfferPriceNo != null && stu == true) {
      this.InvoiceDetailsRows = [];
      this.GetOfferPriceServiceForContract(this.modalInvoice.OfferPriceNo);
    } else {
      this.InvoiceDetailsRows = [];
      this.addInvoiceRow();
    }
  }
  taxtypeChange() {
    this.CalculateTotal(1);
  }
  applyFilterServiceList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.serviceListDataSource.filter = filterValue.trim().toLowerCase();
  }
  serviceListDataSource = new MatTableDataSource();
  servicesList: any;
  selectedServiceRow: any;
  serviceListDataSourceTemp: any = [];
  GetAllServicesPrice() {
    this._invoiceService.GetAllServicesPrice().subscribe((data) => {
      this.serviceListDataSource = new MatTableDataSource(data.result);
      this.serviceListDataSource.paginator = this.paginatorServices;

      this.servicesList = data.result;
      this.serviceListDataSourceTemp = data.result;
    });
  }
  GetServwithOffer(OfferPriceNo: any) {
    this._invoiceService
      .GetOfferservicenByid(OfferPriceNo)
      .subscribe((data) => {
        this.serviceListDataSource = new MatTableDataSource(data.result);
        this.serviceListDataSource.paginator = this.paginatorServices;
        this.servicesList = data.result;
        this.serviceListDataSourceTemp = data.result;
      });
  }

  GetOfferPriceServiceForContract(OfferId: any) {
    this._invoiceService.GetOfferservicenByid(OfferId).subscribe((data) => {
      data.result.forEach((element: any) => {
        this.modalInvoice.taxtype = element.taxType;
        this.GetServicesPriceByServiceId(element);
      });
    });
  }

  GetServicesPriceByServiceId(offerdata: any) {
    this._invoiceService
      .GetServicesPriceByServiceId(offerdata.serviceId)
      .subscribe((data) => {
        var maxVal = 0;

        if (this.InvoiceDetailsRows.length > 0) {
          maxVal = Math.max(
            ...this.InvoiceDetailsRows.map((o: { idRow: any }) => o.idRow)
          );
        } else {
          maxVal = 0;
        }
        this.setServiceRowValueNew(
          maxVal + 1,
          data.result,
          offerdata.serviceQty,
          offerdata.serviceamountval
        );
      });
  }

  GetAccountJournalSearchGrid() {
    if (this.modalInvoice.OfferPriceNo != null) {
      this.GetServwithOffer(this.modalInvoice.OfferPriceNo);
    } else {
      this.GetAllServicesPrice();
    }
  }

  addInvoiceRow() {
    var maxVal = 0;
    if (this.InvoiceDetailsRows.length > 0) {
      maxVal = Math.max(
        ...this.InvoiceDetailsRows.map((o: { idRow: any }) => o.idRow)
      );
    } else {
      maxVal = 0;
    }

    this.InvoiceDetailsRows?.push({
      idRow: maxVal + 1,
      AccJournalid: null,
      UnitConst: null,
      QtyConst: null,
      DiscountValueConst: null,
      DiscountPercentageConst: null,
      accountJournaltxt: null,
      AmountBeforeTaxtxt: null,
      Amounttxt: null,
      taxAmounttxt: null,
      TotalAmounttxt: null,
    });
  }

  deleteInvoiceRow(idRow: any) {
    let index = this.InvoiceDetailsRows.findIndex(
      (d: { idRow: any }) => d.idRow == idRow
    );
    this.InvoiceDetailsRows.splice(index, 1);
    this.CalculateTotal(1);
  }

  setServiceRowValue(element: any) {
    this.InvoiceDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == this.selectedServiceRow
    )[0].AccJournalid = element.servicesId;
    this.InvoiceDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == this.selectedServiceRow
    )[0].UnitConst = element.serviceTypeName;
    this.InvoiceDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == this.selectedServiceRow
    )[0].QtyConst = 1;
    this.InvoiceDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == this.selectedServiceRow
    )[0].accountJournaltxt = element.servicesName;
    this.InvoiceDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == this.selectedServiceRow
    )[0].Amounttxt = element.amount;
    this.CalculateTotal2(1);
    this.addInvoiceRow();
  }

  setServiceRowValueNew(indexRow: any, item: any, Qty: any, servamount: any) {
    this.addInvoiceRow();
    this.InvoiceDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == indexRow
    )[0].AccJournalid = item.servicesId;
    this.InvoiceDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == indexRow
    )[0].UnitConst = item.serviceTypeName;
    this.InvoiceDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == indexRow
    )[0].QtyConst = Qty;
    this.InvoiceDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == indexRow
    )[0].accountJournaltxt = item.name;
    this.InvoiceDetailsRows.filter(
      (a: { idRow: any }) => a.idRow == indexRow
    )[0].Amounttxt = servamount;
    this.CalculateTotal(1);
  }

  getCusAccID_Save(customerid: any, paytype: any) {
    if (customerid != null) {
      this._invoiceService
        .GetCustomersByCustomerId(customerid)
        .subscribe((data) => {
          if (paytype) {
            this.modalInvoice.ToAccountId = data.result.accountId;
            this.saveInvoice();
          }
          if (data.result.customerTypeId == 2) {
            this.modalInvoice.CustomerTax = data.result.customerAddress;
            this.modalInvoice.CustomerAddress = data.result.customerAddress;
            this.modalInvoice.Customeridtype = data.result.customerTypeId;
          } else {
            this.modalInvoice.CustomerTax = data.result.commercialRegister;
            this.modalInvoice.CustomerAddress = data.result.customerAddress;
            this.modalInvoice.Customeridtype = data.result.customerTypeId;
          }
        });
    }
  }
  FillCustAccountsSelect2_Save(PayType: any) {
    if (PayType) {
      this._invoiceService
        .FillCustAccountsSelect2(PayType)
        .subscribe((data) => {
          this.load_Accounts = data;
          this.getCusAccID_Save(this.modalInvoice.customerId, true);
        });
    } else {
      this.load_Accounts = [];
    }
  }

  FillCustAccountsSelect2AndUpdate_Save(PayType: any) {
    if (PayType) {
      this._invoiceService
        .FillCustAccountsSelect2(PayType)
        .subscribe((data) => {
          this.load_Accounts = data;
          if (PayType != 8) {
            if (this.load_Accounts?.length > 0) {
              this.modalInvoice.ToAccountId = this.load_Accounts[0]?.id;
              this.saveInvoice();
            } else {
              this.modalInvoice.ToAccountId = null;
              this.toast.error('تأكد من الحساب',this.translate.instant("Message"));
              return;
            }
          }
        });
    } else {
      this.load_Accounts = [];
    }
  }
  checkPayTypeAndSave() {
    var val = this.validateInvoiceForm();
    if (val.status == false) {
      this.toast.error(val.msg,this.translate.instant("Message"));
      return;
    }
    if (this.modalInvoice.remainder > 0) {
      //hna mfrod afth popup yogd motbke
    }

    var _paidValue = parseFloat(this.modalInvoice.PaidValue).toFixed(2);
    var remainder = parseFloat(this.modalInvoice.remainder).toFixed(2);
    if (+remainder < 1 && +_paidValue > 0) {
      //agel to be n2di
      if (this.modalInvoice.PayType == 8) {
        this.modalInvoice.PayType = 1;
        this.FillCustAccountsSelect2AndUpdate_Save(1);
      } else {
        this.saveInvoice();
      }
    } else if (
      +remainder >= 0 &&
      (this.modalInvoice.PayType == 1 ||
        this.modalInvoice.PayType == 17 ||
        this.modalInvoice.PayType == 9 ||
        this.modalInvoice.PayType == 6)
    ) {
      if (this.modalInvoice.PayType != 8) {
        this.modalInvoice.PayType = 8;
        this.FillCustAccountsSelect2_Save(8);
      } else {
        this.saveInvoice();
      }
    } else {
      this.saveInvoice();
    }
  }

  ValidateObjMsgInvoice: any = { status: true, msg: null };
  validateInvoiceForm() {
    this.ValidateObjMsgInvoice = { status: true, msg: null };
    if (this.modalInvoice.customerId == null) {
      this.ValidateObjMsgInvoice = { status: false, msg: 'من فضلك اختر عميل' };
      return this.ValidateObjMsgInvoice;
    }
    if (this.modalInvoice.popuptype == 1) {
      if (this.modalInvoice.ProjectId == null) {
        this.ValidateObjMsgInvoice = {
          status: false,
          msg: 'من فضلك اختر مشروع',
        };
        return this.ValidateObjMsgInvoice;
      }
    }
    if (this.InvoiceDetailsRows.length == 0) {
      this.ValidateObjMsgInvoice = { status: false, msg: 'من فضلك اختر خدمة' };
      return this.ValidateObjMsgInvoice;
    }

    this.ValidateObjMsgInvoice = { status: true, msg: null };
    return this.ValidateObjMsgInvoice;
  }
  disableButtonSave_Invoice = false;

  saveInvoice() {
    debugger;
    var VoucherDetailsList: any = [];
    var VoucherObj: any = {};
    VoucherObj.InvoiceId = this.modalInvoice.InvoiceId;
    VoucherObj.InvoiceNumber = this.modalInvoice.InvoiceNumber;
    VoucherObj.JournalNumber = this.modalInvoice.JournalNumber;
    // VoucherObj.InvoicePayType= this.modalInvoice.PayType;
    VoucherObj.Date = this._sharedService.date_TO_String(
      this.modalInvoice.Date
    );
    //VoucherObj.HijriDate = this.modalInvoice.HijriDate;
    VoucherObj.Notes = this.modalInvoice.Notes;
    VoucherObj.InvoiceNotes = this.modalInvoice.InvoiceNotes;
    VoucherObj.Type = this.modalInvoice.Type;
    VoucherObj.InvoiceValue = this.modalInvoice.VoucherValue;
    VoucherObj.StorehouseId = this.modalInvoice.storehouseId;
    VoucherObj.TotalValue = this.modalInvoice.TotalVoucherValueLbl;
    VoucherObj.TaxAmount = this.modalInvoice.taxAmountLbl;
    VoucherObj.ToAccountId = this.modalInvoice.ToAccountId;
    if (this.modalInvoice.popuptype == 1 || this.invoicepop == 2) {
      VoucherObj.ProjectId = parseInt(this.modalInvoice.ProjectId);
    }
    VoucherObj.PayType = this.modalInvoice.PayType;
    VoucherObj.DiscountPercentage = this.modalInvoice.DiscountPercentage;
    VoucherObj.DiscountValue = this.modalInvoice.DiscountValue;
    VoucherObj.CustomerId = this.modalInvoice.customerId;
    VoucherObj.printBankAccount = this.modalInvoice.printBankAccount;
    VoucherObj.InvoiceReference = this.modalInvoice.Reference;
    VoucherObj.PaidValue = this.modalInvoice.PaidValue;
    VoucherObj.PageInsert = 1;
    VoucherObj.CostCenterId = this.modalInvoice.CostCenterId;
    if (this.modalInvoice.PayType == 8) {
      if (this.modalInvoice.AlarmVoucherInvDate == null) {
        VoucherObj.VoucherAlarmDate = null;
        VoucherObj.VoucherAlarmCheck = null;
        VoucherObj.IsSendAlarm = null;
      } else {
        VoucherObj.VoucherAlarmDate = this._sharedService.date_TO_String(
          this.modalInvoice.AlarmVoucherInvDate
        );
        VoucherObj.VoucherAlarmCheck = true;
        VoucherObj.IsSendAlarm = 0;
      }
    } else {
      VoucherObj.VoucherAlarmDate = null;
      VoucherObj.VoucherAlarmCheck = null;
      VoucherObj.IsSendAlarm = null;
    }
    var input = { valid: true, message: '' };
    this.InvoiceDetailsRows.forEach((element: any, index: any) => {
      if (element.AccJournalid == null) {
        input.valid = false;
        input.message = 'من فضلك أختر خدمة صحيحة';
        return;
      }
      if (element.Amounttxt == null) {
        input.valid = false;
        input.message = 'من فضلك أختر مبلغ صحيح';
        return;
      }
      if (element.QtyConst == null) {
        input.valid = false;
        input.message = 'من فضلك أختر كمية صحيحة';
        return;
      }

      var VoucherDetailsObj: any = {};
      VoucherDetailsObj.LineNumber = index + 1;
      VoucherDetailsObj.AccountId = this.modalInvoice.ToAccountId;
      VoucherDetailsObj.ServicesPriceId = element.AccJournalid;
      VoucherDetailsObj.Amount = element.Amounttxt;
      VoucherDetailsObj.Qty = element.QtyConst;
      VoucherDetailsObj.TaxType = this.modalInvoice.taxtype;
      VoucherDetailsObj.TaxAmount = element.taxAmounttxt;
      VoucherDetailsObj.TotalAmount = element.TotalAmounttxt;

      VoucherDetailsObj.DiscountValue_Det = element.DiscountValueConst;
      VoucherDetailsObj.DiscountPercentage_Det =
        element.DiscountPercentageConst;

      VoucherDetailsObj.PayType = this.modalInvoice.PayType;

      //this.checkPayType();
      VoucherDetailsObj.ToAccountId = this.modalInvoice.ToAccountId;
      VoucherDetailsObj.CostCenterId = this.modalInvoice.CostCenterId;
      VoucherDetailsObj.ReferenceNumber = this.modalInvoice.Reference;
      VoucherDetailsObj.Description = '';
      VoucherDetailsList.push(VoucherDetailsObj);
    });
    if (!input.valid) {
      this.toast.error(input.message);
      return;
    }

    debugger;
    var DetailsList: any = [];
    var counter = 0;
    if (this.OfferPopupAddorEdit_Invoice == 1) {
      this.ListDataServices_Invoice.forEach((elementService: any) => {
        elementService.forEach((element: any) => {
          var Detailsobj: any = {};
          counter++;
          //element.servicesIdVou??0
          Detailsobj.ServicesIdVou = 0;
          Detailsobj.ServicesId = element.servicesId;
          Detailsobj.ParentId = element.parentId;
          Detailsobj.SureService = 1;
          Detailsobj.LineNumber = counter;
          DetailsList.push(Detailsobj);
        });
      });
    } else {
      this.ListDataServices_Invoice.forEach((elementService: any) => {
        let dataSer = elementService.filter(
          (d: { SureService: any }) => d.SureService == 1
        );
        dataSer.forEach((element: any) => {
          var Detailsobj: any = {};
          counter++;
          Detailsobj.ServicesIdVou = 0;
          Detailsobj.ServicesId = element.servicesId;
          Detailsobj.ParentId = element.parentId;
          Detailsobj.SureService = element.SureService ?? 0;
          Detailsobj.LineNumber = counter;
          DetailsList.push(Detailsobj);
        });
      });
    }

    VoucherObj.ServicesPriceOffer = DetailsList;

    VoucherObj.VoucherDetails = VoucherDetailsList;
    VoucherObj.ToAccountId = this.modalInvoice.ToAccountId;
    VoucherObj.PayType = this.modalInvoice.PayType;

    this.disableButtonSave_Invoice = true;
    setTimeout(() => {
      this.disableButtonSave_Invoice = false;
    }, 15000);

    if (this.modalInvoice.WhichClick == 1) {
      this._invoiceService
        .SaveInvoiceForServices(VoucherObj)
        .subscribe((result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            this.resetInvoiceData();
            this.getData();
            this.InvoiceModelPublic?.dismiss();
          } else {
            this.toast.error(result.reasonPhrase,this.translate.instant("Message"));
          }
        });
    } else if (this.modalInvoice.WhichClick == 2) {
      this._invoiceService
        .SaveandPostInvoiceForServices(VoucherObj)
        .subscribe((result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            this.resetInvoiceData();
            this.getData();
            this.InvoiceModelPublic?.dismiss();
          } else {
            this.toast.error(result.reasonPhrase,this.translate.instant("Message"));
          }
        });
    } else if (this.modalInvoice.WhichClick == 3) {
      this._invoiceService
        .SaveInvoiceForServicesNoti(VoucherObj)
        .subscribe((result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            this.resetInvoiceData();
            this.getData();
            this.InvoiceModelPublic?.dismiss();
          } else {
            this.toast.error(result.reasonPhrase,this.translate.instant("Message"));
          }
        });
    }
  }

  ConvertNumToString(val: any) {
    this._sharedService.ConvertNumToString(val).subscribe((data) => {
      console.log(data);
      //this.modalDetails.total_amount_text=data?.reasonPhrase;
    });
  }

  key: any;
  isShift = false;

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
    this.isShift = !!event.shiftKey; // typecast to boolean
    if (this.isShift) {
      switch (this.key) {
        case 16: // ignore shift key
          break;
        default:
          if (event.code == 'KeyA') {
            this.addInvoiceRow();
          }
          break;
      }
    }
  }

  //#endregion
  //------------------------------------(End) Invoice-------------------------------------------

  //-------------------------------------------Add Project ----------------------------
  //#region
  modalDetailsProject: any = {
    projectId: 0,
    projectNo: null,
    projectDuration: null,
    branch: null,
    center: null,
    from: new Date(),
    to: new Date(),
    projectType: null,
    subProjectDetails: null,
    customer: null,
    buildingType: null,
    service: null,
    user: null,
    region: null,
    projectDescription: null,
    offerPriceNumber: null,
    projectDepartment: null,
    projectPermissions: [],
    projectGoals: null,

    //proSettingdet:false,
    ProjectSettingNo: null,
    ProjectSettingNote: null,
    projectDurationLbl: null,

    servicesDiv: false,

    pmimgdiv: false,
    ProjectFlag: false,
    SubProjectFlag: false,
    SubProjectBranch: false,
  };

  ResetAllControls() {
    this.modalDetailsProject = {
      projectId: 0,
      projectNo: null,
      projectDuration: null,
      branch: null,
      center: null,
      from: new Date(),
      to: new Date(),
      projectType: null,
      subProjectDetails: null,
      customer: null,
      buildingType: null,
      service: null,
      user: null,
      region: null,
      projectDescription: null,
      offerPriceNumber: null,
      projectDepartment: null,
      projectPermissions: [],
      projectGoals: null,

      //proSettingdet:false,
      ProjectSettingNo: null,
      ProjectSettingNote: null,
      projectDurationLbl: null,

      servicesDiv: false,

      pmimgdiv: false,
      ProjectFlag: false,
      SubProjectFlag: false,
      SubProjectBranch: false,
    };
    this.GetProjectDurationStr();
  }
  changeRequestStatusProject(event: any) {
    this.modalDetailsProject.ProjectFlag = event.target.checked;
    if (this.modalDetailsProject.ProjectSettingNo == null) {
      this.modalDetailsProject.ProjectFlag = false;
    }
  }
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
  applyGoalsFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectGoalsDataSource.filter = filterValue.trim().toLowerCase();
  }
  ProjectPopupFunc() {
    this.modalDetailsProject.projectPermissions = [];
    //ResetVoucherControls();
    this.ResetAllControls();
    this.FillBuildTypeSelect();
    this.FillCitySelect();
    this.FillProjectTypeSelect();
    this.GetAllCustomerForDropWithBranch();
    this.FillAllUsersSelectAll();
    //this.FillProjectSelect();
    this.FillDepartmentSelectByTypeUser();
    this.FillBranchByUserIdSelect();
    this.userPermissions = [];
    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );

    this.projectgoalList = [];
    this.ProjectNoType = 1;
    this.modalDetailsProject.customer = this.SelectedRowTable.customerId;
    this.modalDetailsProject.offerPriceNumber =
      this.SelectedRowTable.offersPricesId;
    this.modalDetailsProject.branch = this.SelectedRowTable.branchId;
    this.branchChange();
    this.customerChange();
  }

  GenerateNextProjectNumber() {
    this._projectService.GenerateNextProjectNumber().subscribe((data) => {
      this.modalDetailsProject.projectNo = data.result;
    });
  }
  //-----------------------------------Fill------------------------------------------
  BuildTypes: any;
  BuildTypesPopup: any;

  FillBuildTypeSelect() {
    this._projectService.FillBuildTypeSelect().subscribe((data) => {
      this.BuildTypes = data;
      this.BuildTypesPopup = data;
    });
  }
  City: any;
  CityTypesPopup: any;

  FillCitySelect() {
    this._projectService.FillCitySelect().subscribe((data) => {
      this.City = data;
      this.CityTypesPopup = data;
    });
  }
  ProjectTypes: any;
  ProjectTypesPopup: any;

  FillProjectTypeSelect() {
    this.ProjectSubTypes = [];
    this._projectService.FillProjectTypeSelect().subscribe((data) => {
      this.ProjectTypes = data;
      this.ProjectTypesPopup = data;
    });
  }
  ProjectSubTypes: any;
  ProjectSubTypesPopup: any;
  FillProjectSubTypesSelect() {
    if (this.modalDetailsProject.projectType != null) {
      this._projectService
        .FillProjectSubTypesSelect(this.modalDetailsProject.projectType)
        .subscribe((data) => {
          this.ProjectSubTypes = data;
          this.ProjectSubTypesPopup = data;
        });
    } else {
      this.ProjectSubTypes = [];
      this.ProjectSubTypesPopup = [];
    }
  }
  Customers: any;
  GetAllCustomerForDropWithBranch() {
    this._projectService.GetAllCustomerForDrop().subscribe((data) => {
      this.Customers = data.result;
    });
  }
  Managers: any;
  FillAllUsersSelectAll() {
    this._projectService.FillAllUsersSelectAll().subscribe((data) => {
      this.Managers = data;
    });
  }
  ParentProjectBranch: any;
  FillProjectSelect() {
    this._projectService.FillProjectSelect().subscribe((data) => {
      this.ParentProjectBranch = data;
    });
  }
  Department: any;
  FillDepartmentSelectByTypeUser() {
    this._projectService.FillDepartmentSelectByTypeUser(1).subscribe((data) => {
      this.Department = data;
    });
  }
  Branches: any;
  FillBranchByUserIdSelect() {
    this.CostCenters = [];
    this._projectService.FillBranchByUserIdSelect().subscribe((data) => {
      this.Branches = data;
    });
  }
  CostCenters: any;
  FillCostCenterSelectBranch() {
    if (this.modalDetailsProject.branch != null) {
      this._projectService
        .FillCostCenterSelectBranch(this.modalDetailsProject.branch)
        .subscribe((data) => {
          this.CostCenters = data;
        });
    } else {
      this.CostCenters = [];
    }
  }
  //-------------------------------------------------------------------------------------------

  ChangeService() {
    this.resetInvoiceData();

    // setTimeout(() => {
    //   //---
    // }, 1000);

    if (this.modalDetailsProject.customer == null) {
      this.modalDetailsProject.service = null;
      this.toast.error('من فضلك أختر عميل أولا',this.translate.instant("Message"));
      return;
    }
    if (this.modalDetailsProject.center == null) {
      this.modalDetailsProject.service = null;
      this.toast.error('من فضلك أختر مركز تكلفة أولا',this.translate.instant("Message"));
      return;
    }
    if (this.modalDetailsProject.service != null) {
      this.open(this.newInvoiceModal, null, 'addInvoiceProject');
      var element = {
        serviceId: this.modalDetailsProject.service,
      };
      this.GetServicesPriceByServiceIdForProject(element);
    }
  }
  GetServicesPriceByServiceIdForProject(offerdata: any) {
    this._invoiceService
      .GetServicesPriceByServiceId(offerdata.serviceId)
      .subscribe((data) => {
        var maxVal = 0;

        if (this.InvoiceDetailsRows.length > 0) {
          maxVal = Math.max(
            ...this.InvoiceDetailsRows.map((o: { idRow: any }) => o.idRow)
          );
        } else {
          maxVal = 0;
        }
        this.setServiceRowValueNew(
          maxVal + 1,
          data.result,
          1,
          data.result.amount
        );
      });
  }
  branchChange() {
    this.modalDetailsProject.center = null;
    this.FillCostCenterSelectBranch();
  }
  ProjectNoType = 1; // generated
  ProjectNoTxtChenged() {
    this.ProjectNoType = 2; // manual
  }

  CheckStartDate(event: any) {
    if (event != null) {
      this.modalDetailsProject.from = event;
      this.GetProjectDurationStr();
    } else {
      this.modalDetailsProject.from = null;
    }
  }
  CheckEndDate(event: any) {
    if (event != null) {
      this.modalDetailsProject.to = event;
      this.GetProjectDurationStr();
    } else {
      this.modalDetailsProject.to = null;
    }
  }

  GetProjectDurationStr() {
    if (
      this.modalDetailsProject.from != null &&
      this.modalDetailsProject.to != null
    ) {
      if (this.modalDetailsProject.from > this.modalDetailsProject.to) {
        this.modalDetailsProject.from = new Date();
        this.modalDetailsProject.to = this.addDays(new Date(), 1);
        this.modalDetailsProject.projectDuration = null;
        this.toast.error(
          'لا يمكنك اختيار تاريخ النهاية أصغر من البداية',
         this.translate.instant("Message")
        );
        return;
      }

      this._projectService
        .GetProjectDurationStr(
          this._sharedService.date_TO_String(this.modalDetailsProject.from),
          this._sharedService.date_TO_String(this.modalDetailsProject.to)
        )
        .subscribe((data) => {
          this.modalDetailsProject.projectDuration = data.reasonPhrase;
        });
    } else {
      this.modalDetailsProject.projectDuration = null;
    }
  }
  // CheckDateValid(){
  //   if(this.modalDetailsProject.from!=null && this.modalDetailsProject.to!=null)
  //   {
  //     if(this.modalDetailsProject.from>this.modalDetailsProject.to){
  //       this.modalDetailsProject.from=new Date();
  //       this.modalDetailsProject.to=this.addDays(new Date(),1);

  //       this.toast.error('لا يمكنك اختيار تاريخ النهاية أصغر من البداية',this.translate.instant("Message"));return;
  //     }
  //   }
  // }
  serviceList: any;
  GetServicesPriceByProjectId2() {
    if (
      this.modalDetailsProject.projectType != null &&
      this.modalDetailsProject.subProjectDetails != null
    ) {
      this._projectService
        .GetServicesPriceByProjectId2(
          this.modalDetailsProject.projectType,
          this.modalDetailsProject.subProjectDetails
        )
        .subscribe((data) => {
          this.serviceList = data.result;
        });
    } else {
      this.serviceList = [];
    }
  }
  GetTimePeriordBySubTypeId() {
    if (this.modalDetailsProject.subProjectDetails != null) {
      this._projectService
        .GetTimePeriordBySubTypeId(this.modalDetailsProject.subProjectDetails)
        .subscribe((data) => {
          if (data != null) {
            if (parseInt(data.TimePeriod) > 0) {
              this.SetNewDatewithTimePeriord(parseInt(data.timePeriod));
            }
          }
        });
    }
  }
  offerpriceList: any;
  FillAllOfferTodropdown() {
    //this.modalDetailsProject.offerPriceNumber=null;
    this.offerpriceList = [];
    if (this.modalDetailsProject.customer != null) {
      this._projectService
        .FillAllOfferTodropdown(this.modalDetailsProject.customer)
        .subscribe((data) => {
          this.offerpriceList = data;
          if (this.offerpriceList.length == 0) {
            this.modalDetailsProject.offerPriceNumber = null;
          }
        });
    }
  }

  addDays(date: any, days: any) {
    var copy = new Date(Number(date));
    copy.setDate(date.getDate() + days);
    return copy;
  }
  SetNewDatewithTimePeriord(TimePeriod: any) {
    var date2 = this.modalDetailsProject.from;
    var newDate = this.addDays(date2, TimePeriod);
    this.modalDetailsProject.from = date2;
    this.modalDetailsProject.to = newDate;
    this.GetProjectDurationStr();
  }

  TypeProjectChange() {
    this.modalDetailsProject.subProjectDetails = null;
    this.FillProjectSubTypesSelect();
    this.GetAllCustomerForDropWithBranch();
    this.getallreqbyprojecttype();
  }
  subTypeProjectChange(model: any) {
    this.modalDetailsProject.service = null;
    this.modalDetailsProject.ProjectFlag = true;
    this.modalDetailsProject.servicesDiv = true;
    this.GetServicesPriceByProjectId2();

    this.GetTimePeriordBySubTypeId();
    this.modalDetailsProject.ProjectSettingNo = null;
    this.modalDetailsProject.ProjectSettingNote = null;

    this.getProSettingnumber();
    this.GetProjectRequirementByProjectSubTypeSearchIdPoupup(model);
  }
  subTypeProjectChangeEdit() {
    this.modalDetailsProject.service = null;
    this.modalDetailsProject.ProjectFlag = true;
    this.modalDetailsProject.servicesDiv = true;
    this.GetServicesPriceByProjectId2();

    this.GetTimePeriordBySubTypeId();
    this.modalDetailsProject.ProjectSettingNo = null;
    this.modalDetailsProject.ProjectSettingNote = null;

    this.CheckProSetting();
  }
  GetProjectSettingsDetails() {
    if (
      this.modalDetailsProject.projectType != null &&
      this.modalDetailsProject.subProjectDetails != null
    ) {
      this._projectService
        .GetProjectSettingsDetails(
          this.modalDetailsProject.projectType,
          this.modalDetailsProject.subProjectDetails
        )
        .subscribe((data) => {
          if (data.result != null) {
            this.modalDetailsProject.ProjectSettingNo =
              data.result.proSettingNo;
            this.modalDetailsProject.ProjectSettingNote =
              data.result.proSettingNote;
            this.modalDetailsProject.ProjectFlag = true;
          } else {
            this.modalDetailsProject.ProjectSettingNo = null;
            this.modalDetailsProject.ProjectSettingNote = null;
            this.modalDetailsProject.ProjectFlag = false;
          }
        });
    } else {
      this.modalDetailsProject.ProjectSettingNo = null;
      this.modalDetailsProject.ProjectSettingNote = null;
      this.modalDetailsProject.ProjectFlag = false;
    }
  }

  CheckProSetting() {
    if (this.modalDetailsProject.projectId != null) {
      this._projectService
        .GetProjectSettingsDetailsIFExist(this.modalDetailsProject.projectId)
        .subscribe((data) => {
          if (data.result != null) {
            this.modalDetailsProject.ProjectSettingNo =
              data.result.proSettingNo;
            this.modalDetailsProject.ProjectSettingNote =
              data.result.proSettingNote;
            this.modalDetailsProject.ProjectFlag = true;
          } else {
            this.modalDetailsProject.ProjectSettingNo = null;
            this.modalDetailsProject.ProjectSettingNote = null;
            this.modalDetailsProject.ProjectFlag = false;
          }
        });
    } else {
      this.modalDetailsProject.ProjectSettingNo = null;
      this.modalDetailsProject.ProjectSettingNote = null;
      this.modalDetailsProject.ProjectFlag = false;
    }
  }

  getProSettingnumber() {
    this.GetProjectSettingsDetails();
  }
  ProjectRequirementsList: any;
  projectRequirementsDataSource = new MatTableDataSource();

  GetProjectRequirementByProjectSubTypeSearchIdPoupup(model: any) {
    this.ProjectRequirementsList = [];
    if (this.modalDetailsProject.subProjectDetails != null) {
      this._projectService
        .GetProjectRequirementByProjectSubTypeId(
          this.modalDetailsProject.subProjectDetails
        )
        .subscribe((data) => {
          this.ProjectRequirementsList = data;
          this.projectRequirementsDataSource = new MatTableDataSource(data);
          if (data.length > 0) {
            this.modalService.open(model);
          }
        });
    } else {
      this.ProjectRequirementsList = [];
    }
  }
  downloadFile(data: any) {
    try {
      var link = environment.PhotoURL + data.attachmentUrl;
      window.open(link, '_blank');
    } catch (error) {
      this.toast.error('تأكد من الملف',this.translate.instant("Message"));
    }
  }
  customerChange() {
    this.FillAllOfferTodropdown();
  }

  //-----------------------------Project--Permissions----------------------------------------
  userPermissionsDataSource = new MatTableDataSource();
  userPermissions: any = [];

  selectedUserPermissions: any = {
    idRow: 0,
    userName: null,
    userid: null,
    watch: null,
    add: null,
    edit: null,
    delete: null,
  };

  selectAllValue = false;

  resetPrivProject() {
    this.selectedUserPermissions = {
      idRow: 0,
      userid: null,
      userName: null,
      watch: null,
      add: null,
      edit: null,
      delete: null,
    };
    this.selectAllValue = false;
  }
  setSelectedUserPermissions(index: any) {
    let data = this.userPermissions.filter(
      (a: { idRow: any }) => a.idRow == index
    )[0];
    this.selectedUserPermissions = data;
  }
  setValues(event: any) {
    this.selectedUserPermissions['watch'] = event.target.checked;
    this.selectedUserPermissions['add'] = event.target.checked;
    this.selectedUserPermissions['edit'] = event.target.checked;
    this.selectedUserPermissions['delete'] = event.target.checked;
  }
  addNewUserPermissions() {
    var count = this.userPermissions.filter(
      (a: { userid: any }) => a.userid == this.selectedUserPermissions.userid
    ).length;
    if (this.selectedUserPermissions.idRow == 0) {
      if (count > 0) {
        this.toast.error('تم أختيار هذا المستخدم مسبقا',this.translate.instant("Message"));
        return;
      }
    }
    if (this.selectedUserPermissions.userid == null) {
      this.toast.error('أختر مستخدم',this.translate.instant("Message"));
      return;
    }
    var UserNameF = this.UserperFill.filter(
      (a: { id: any }) => a.id == this.selectedUserPermissions.userid
    )[0].name;
    if (this.selectedUserPermissions.idRow == 0) {
      var maxVal = 0;
      debugger;
      if (this.userPermissions.length > 0) {
        maxVal = Math.max(
          ...this.userPermissions.map((o: { idRow: any }) => o.idRow)
        );
      } else {
        maxVal = 0;
      }
      this.userPermissions?.push({
        idRow: maxVal + 1,
        userid: this.selectedUserPermissions.userid,
        userName: UserNameF,
        watch: this.selectedUserPermissions.watch,
        add: this.selectedUserPermissions.add,
        edit: this.selectedUserPermissions.edit,
        delete: this.selectedUserPermissions.delete,
      });
    } else {
      //edit
      var obj = this.userPermissions.filter(
        (a: { idRow: any }) => a.idRow == this.selectedUserPermissions.idRow
      )[0];
      obj.idRow = this.selectedUserPermissions.idRow;
      obj.userid = this.selectedUserPermissions.userid;
      obj.userName = UserNameF;
      obj.watch = this.selectedUserPermissions.watch;
      obj.add = this.selectedUserPermissions.add;
      obj.edit = this.selectedUserPermissions.edit;
      obj.delete = this.selectedUserPermissions.delete;
    }
    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );
    this.resetPrivProject();
  }
  deletePermissions() {
    debugger;
    let index = this.userPermissions.findIndex(
      (d: { idRow: any }) => d.idRow == this.publicidRow
    );
    this.userPermissions.splice(index, 1);
    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );
  }

  UserperFill: any;
  FillUserPermission() {
    this._projectService.FillAllUsersSelectAll().subscribe((data) => {
      this.UserperFill = data;
    });
  }

  //-----------------------------------------------------------------------
  //-------------------------------Req---------------------------------------
  projectGoalsDataSource = new MatTableDataSource();
  projectgoalList: any = [];
  projectreqandgoalpopupLabel: any;
  getallreqbyprojecttype() {
    this.projectgoalList = [];
    if (this.modalDetailsProject.projectType == null) {
      this.toast.error('أختر نوع المشروع أولا',this.translate.instant("Message"));
      return;
    }
    this.projectreqandgoalpopupLabel = 'تحديد اهداف المشروع ';

    this._projectService
      .GetAllRequirmentbyprojecttype(this.modalDetailsProject.projectType)
      .subscribe((data) => {
        this.projectgoalList = data.result;
        this.projectGoalsDataSource = new MatTableDataSource(data.result);
        this.calctotal2();
      });
  }

  Totaltimestr: any = 0;
  calctotal2() {
    var dayes = 0,
      months = 0,
      hours = 0,
      weeks = 0;
    this.projectgoalList.forEach((element: any) => {
      if (element.timeType == '1') {
        dayes = dayes + parseInt(element.timeNo);
      } else if (element.timeType == '2') {
        weeks = weeks + parseInt(element.timeNo);
      } else if (element.timeType == '3') {
        months = months + parseInt(element.timeNo);
      } else if (element.timeType == '4') {
        hours = hours + parseInt(element.timeNo);
      }
    });
    var totaldayes = 0;
    var dayeshour = 0;
    var allemonth = 0;
    var remainhour = 0;
    var totalweek = 0;
    var alldayes = 0;
    totaldayes = parseInt((weeks * 7 + months * 30 + dayes).toString());
    dayeshour = parseInt((hours / 24).toString());
    remainhour = parseInt((hours % 24).toString());
    totaldayes = parseInt((totaldayes + dayeshour).toString());
    allemonth = parseInt((totaldayes / 30).toString());
    totalweek = parseInt(((totaldayes % 30) / 7).toString());
    alldayes = parseInt(((totaldayes % 30) % 7).toString());
    var monthstr = '';
    var weekstr = '';
    var daystr = '';
    var hourstr = '';
    if (allemonth > 0) {
      monthstr = allemonth + ' شهر ';
    }
    if (totalweek > 0) {
      weekstr = totalweek + ' اسبوع ';
    }
    if (alldayes > 0) {
      daystr = alldayes + ' يوم ';
    }
    if (remainhour > 0) {
      hourstr = remainhour + ' ساعة ';
    }

    var duration = monthstr + weekstr + daystr + hourstr;
    this.Totaltimestr = duration;
  }
  selectGoalForProject(data: any) {}

  //-------------------------------------btn (+) -------------------------------
  //#region
  dataAdd: any = {
    projecttype: {
      id: 0,
      nameAr: null,
      nameEn: null,
      typeum: null,
    },
    subprojecttype: {
      id: 0,
      nameAr: null,
      nameEn: null,
      timePeriod: null,
    },
    buildtype: {
      id: 0,
      nameAr: null,
      nameEn: null,
      description: null,
    },
    citytype: {
      id: 0,
      nameAr: null,
      nameEn: null,
    },
    Reasontype: {
      id: 0,
      nameAr: null,
      nameEn: null,
    },
    Storehouse: {
      id: 0,
      nameAr: null,
      nameEn: null,
    },
  };

  //-----------------------------------Project Type------------------------------------------------
  ProjectTypeRowSelected: any;
  getProjecttypeRow(row: any) {
    this.ProjectTypeRowSelected = row;
  }
  setProjectTypeInSelect(data: any, model: any) {
    this.modalDetailsProject.projectType = data.id;
  }
  resetProjectType() {
    this.resetGoalsProjectType();
    this.dataAdd.projecttype.id = 0;
    this.dataAdd.projecttype.nameAr = null;
    this.dataAdd.projecttype.nameEn = null;
  }
  saveProjectType() {
    if (
      this.dataAdd.projecttype.nameAr == null ||
      this.dataAdd.projecttype.nameEn == null
    ) {
      this.toast.error('من فضلك أكمل البيانات',this.translate.instant("Message"));
      return;
    }
    var ProjectTypeObj: any = {};
    ProjectTypeObj.TypeId = this.dataAdd.projecttype.id;
    ProjectTypeObj.NameAr = this.dataAdd.projecttype.nameAr;
    ProjectTypeObj.NameEn = this.dataAdd.projecttype.nameEn;
    ProjectTypeObj.Typeum = this.dataAdd.projecttype.typeum;
    var input = { valid: true, message: '' };
    this.ProjectTypeGoals.forEach((element: any, index: any) => {
      if (element.RequirmentName == null || element.RequirmentName == '') {
        input.valid = false;
        input.message = 'من فضلك أكتب اسم المتطلب والهدف';
        return;
      }
      if (element.EmpDepType == 1) {
        if (element.EmployeeId == null || element.EmployeeId == 0) {
          input.valid = false;
          input.message = 'من فضلك أختر اسم المستخدم';
          return;
        }
      } else {
        if (element.DepartmentId == null || element.DepartmentId == 0) {
          input.valid = false;
          input.message = 'من فضلك أختر القسم';
          return;
        }
      }
      if (element.timeNo == null || element.timeNo == 0) {
        input.valid = false;
        input.message = 'من فضلك أختر المدة المتوقعة';
        return;
      }
    });
    if (!input.valid) {
      this.toast.error(input.message);
      return;
    }
    var RequirementsandGoals: any = [];
    this.ProjectTypeGoals.forEach((element: any) => {
      var req: any = {};
      req.RequirementId = element.RequirementId;
      req.LineNumber = element.idRow;
      req.RequirmentName = element.RequirmentName;
      if (parseInt(element.EmpDepType) == 1) {
        req.EmployeeId = element.EmployeeId;
        req.DepartmentId = null;
      } else {
        req.EmployeeId = null;
        req.DepartmentId = element.DepartmentId;
      }
      req.TimeNo = element.timeNo.toString();
      req.TimeType = element.timeType.toString();
      RequirementsandGoals.push(req);
    });

    ProjectTypeObj.RequirementsandGoals = RequirementsandGoals;

    this._projectService
      .SaveProjectType(ProjectTypeObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.resetProjectType();
          this.FillProjectTypeSelect();
        } else {
          this.toast.error(result.reasonPhrase,this.translate.instant("Message"));
        }
      });
  }
  confirmProjecttypeDelete() {
    this._projectService
      .DeleteProjectType(this.ProjectTypeRowSelected.id)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.FillProjectTypeSelect();
        } else {
          this.toast.error(result.reasonPhrase,this.translate.instant("Message"));
        }
      });
  }
  resetGoalsProjectType() {
    this.ProjectTypeGoals = [];
  }
  ProjectTypeGoals: any = [];

  addNewRowProjectGoal() {
    var maxVal = 0;
    if (this.ProjectTypeGoals.length > 0) {
      maxVal = Math.max(
        ...this.ProjectTypeGoals.map((o: { idRow: any }) => o.idRow)
      );
    } else {
      maxVal = 0;
    }
    let Goal = {
      idRow: maxVal + 1,
      RequirementId: 0,
      RequirmentName: null,
      EmpDepType: 1,
      EmployeeId: null,
      DepartmentId: null,
      timeNo: null,
      timeType: 4,
    };
    this.ProjectTypeGoals.push(Goal);
    this.FillSelectEmployee_ProGoals();
    this.FillDepartment_ProGoals();
  }
  Employee_ProGoals: any;
  FillSelectEmployee_ProGoals() {
    this._projectService.FillSelectEmployee().subscribe((data) => {
      this.Employee_ProGoals = data;
    });
  }
  Department_ProGoals: any;
  FillDepartment_ProGoals() {
    this._projectService.FillDepartmentSelectByTypeUser(1).subscribe((data) => {
      this.Department_ProGoals = data;
    });
  }
  deleteRow(idRow: any) {
    let index = this.ProjectTypeGoals.findIndex(
      (d: { idRow: any }) => d.idRow == idRow
    );
    this.ProjectTypeGoals.splice(index, 1);
  }

  timeTypemodelChangeFn(event: any, idRow: any) {
    let data = this.ProjectTypeGoals.filter(
      (d: { idRow: any }) => d.idRow == idRow
    )[0];
    data.timeType = event;
  }
  timeNomodelChangeFn(event: any, idRow: any) {
    let data = this.ProjectTypeGoals.filter(
      (d: { idRow: any }) => d.idRow == idRow
    )[0];
    data.timeNo = event;
  }
  Totaltimestr_ProGoals: any = null;
  calctotal() {
    var dayes = 0,
      months = 0,
      hours = 0,
      weeks = 0;
    this.ProjectTypeGoals.forEach((element: any) => {
      if (element.timeType == '1') {
        dayes = dayes + parseInt(element.timeNo ?? 0);
      } else if (element.timeType == '2') {
        weeks = weeks + parseInt(element.timeNo ?? 0);
      } else if (element.timeType == '3') {
        months = months + parseInt(element.timeNo ?? 0);
      } else if (element.timeType == '4') {
        hours = hours + parseInt(element.timeNo ?? 0);
      }
    });
    var totaldayes = 0;
    var dayeshour = 0;
    var allemonth = 0;
    var remainhour = 0;
    var totalweek = 0;
    var alldayes = 0;
    totaldayes = parseInt((weeks * 7 + months * 30 + dayes).toString());
    dayeshour = parseInt((hours / 24).toString());
    remainhour = parseInt((hours % 24).toString());
    totaldayes = parseInt((totaldayes + dayeshour).toString());
    allemonth = parseInt((totaldayes / 30).toString());
    totalweek = parseInt(((totaldayes % 30) / 7).toString());
    alldayes = parseInt(((totaldayes % 30) % 7).toString());
    var monthstr = '';
    var weekstr = '';
    var daystr = '';
    var hourstr = '';
    if (allemonth > 0) {
      monthstr = allemonth + ' شهر ';
    }
    if (totalweek > 0) {
      weekstr = totalweek + ' اسبوع ';
    }
    if (alldayes > 0) {
      daystr = alldayes + ' يوم ';
    }
    if (remainhour > 0) {
      hourstr = remainhour + ' ساعة ';
    }

    var duration = monthstr + weekstr + daystr + hourstr;
    this.Totaltimestr_ProGoals = duration;
  }

  addRow_ProGoalsl(element: any) {
    var EmpDepTypeV = 1;
    if (element.employeeId != null) EmpDepTypeV = 1;
    else EmpDepTypeV = 2;

    var maxVal = 0;
    if (this.ProjectTypeGoals.length > 0) {
      maxVal = Math.max(
        ...this.ProjectTypeGoals.map((o: { idRow: any }) => o.idRow)
      );
    } else {
      maxVal = 0;
    }
    let Goal = {
      idRow: maxVal + 1,
      RequirementId: element.requirementId,
      RequirmentName: element.requirmentName,
      EmpDepType: EmpDepTypeV,
      EmployeeId: element.employeeId,
      DepartmentId: element.departmentId,
      timeNo: element.timeNo,
      timeType: element.timeType,
    };
    this.ProjectTypeGoals.push(Goal);
    this.FillSelectEmployee_ProGoals();
    this.FillDepartment_ProGoals();
  }

  getallreq_ProGoals(element: any) {
    this.ProjectTypeGoals = [];
    this._projectService
      .GetAllRequirmentbyprojecttype(element.id)
      .subscribe((data) => {
        data.result.forEach((element: any) => {
          this.addRow_ProGoalsl(element);
        });
        this.calctotal();
      });
  }

  //----------------------------------(End)-Project Type---------------------------------------------

  //-----------------------------------SubProject Type------------------------------------------------
  SubProjectTypeRowSelected: any;
  getSubProjecttypeRow(row: any) {
    this.SubProjectTypeRowSelected = row;
  }
  setSubProjectTypeInSelect(data: any, model: any) {
    this.modalDetailsProject.subProjectDetails = data.id;
  }
  resetSubProjectType() {
    this.dataAdd.subprojecttype.id = 0;
    this.dataAdd.subprojecttype.nameAr = null;
    this.dataAdd.subprojecttype.nameEn = null;
  }
  saveSubProjectType() {
    if (
      this.dataAdd.subprojecttype.nameAr == null ||
      this.dataAdd.subprojecttype.nameEn == null
    ) {
      this.toast.error('من فضلك أكمل البيانات',this.translate.instant("Message"));
      return;
    }
    var ProSubTypeObj: any = {};
    ProSubTypeObj.SubTypeId = this.dataAdd.subprojecttype.id;
    ProSubTypeObj.ProjectTypeId = this.modalDetailsProject.projectType;
    ProSubTypeObj.NameAr = this.dataAdd.subprojecttype.nameAr;
    ProSubTypeObj.NameEn = this.dataAdd.subprojecttype.nameEn;
    ProSubTypeObj.TimePeriod =
      this.dataAdd.subprojecttype.timePeriod.toString();

    this._projectService
      .SaveProjectSubType(ProSubTypeObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.resetSubProjectType();
          this.FillProjectSubTypesSelect();
        } else {
          this.toast.error(result.reasonPhrase,this.translate.instant("Message"));
        }
      });
  }
  confirmSubProjecttypeDelete() {
    this._projectService
      .DeleteProjectSubTypes(this.SubProjectTypeRowSelected.id)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.FillProjectSubTypesSelect();
        } else {
          this.toast.error(result.reasonPhrase,this.translate.instant("Message"));
        }
      });
  }
  //------------------------------(End)-SubProject Type----------------------------------------
  //-----------------------------------build Type------------------------------------------------
  BuildTypeRowSelected: any;
  getbuildypeRow(row: any) {
    this.BuildTypeRowSelected = row;
  }
  setbuildTypeInSelect(data: any, model: any) {
    this.modalDetailsProject.buildingType = data.id;
  }
  resetbuildType() {
    this.dataAdd.buildtype.id = 0;
    this.dataAdd.buildtype.nameAr = null;
    this.dataAdd.buildtype.nameEn = null;
  }
  savebuildType() {
    if (
      this.dataAdd.buildtype.nameAr == null ||
      this.dataAdd.buildtype.nameEn == null
    ) {
      this.toast.error('من فضلك أكمل البيانات',this.translate.instant("Message"));
      return;
    }
    var BuildTypesObj: any = {};
    BuildTypesObj.BuildTypeId = this.dataAdd.buildtype.id;
    BuildTypesObj.NameAr = this.dataAdd.buildtype.nameAr;
    BuildTypesObj.NameEn = this.dataAdd.buildtype.nameEn;
    BuildTypesObj.Description = null;
    this._projectService
      .SaveBuildTypes(BuildTypesObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.resetbuildType();
          this.FillBuildTypeSelect();
        } else {
          this.toast.error(result.reasonPhrase,this.translate.instant("Message"));
        }
      });
  }
  confirmbuildtypeDelete() {
    this._projectService
      .DeleteBuildTypes(this.BuildTypeRowSelected.id)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.FillBuildTypeSelect();
        } else {
          this.toast.error(result.reasonPhrase,this.translate.instant("Message"));
        }
      });
  }
  //----------------------------------(End)-Build Type---------------------------------------------
  //-----------------------------------City Type------------------------------------------------
  CityTypeRowSelected: any;
  getcitytypeRow(row: any) {
    this.CityTypeRowSelected = row;
  }
  setcityTypeInSelect(data: any, modal: any) {
    this.modalDetailsProject.region = data.id;
  }
  resetcityType() {
    this.dataAdd.citytype.id = 0;
    this.dataAdd.citytype.nameAr = null;
    this.dataAdd.citytype.nameEn = null;
  }
  savecityType() {
    if (
      this.dataAdd.citytype.nameAr == null ||
      this.dataAdd.citytype.nameEn == null
    ) {
      this.toast.error('من فضلك أكمل البيانات',this.translate.instant("Message"));
      return;
    }
    var ProCityObj: any = {};
    ProCityObj.CityId = this.dataAdd.citytype.id;
    ProCityObj.NameAr = this.dataAdd.citytype.nameAr;
    ProCityObj.NameEn = this.dataAdd.citytype.nameEn;
    this._projectService.SaveCity(ProCityObj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.resetcityType();
        this.FillCitySelect();
      } else {
        this.toast.error(result.reasonPhrase,this.translate.instant("Message"));
      }
    });
  }
  confirmcitytypeDelete() {
    this._projectService
      .DeleteCity(this.CityTypeRowSelected.id)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.FillCitySelect();
        } else {
          this.toast.error(result.reasonPhrase,this.translate.instant("Message"));
        }
      });
  }
  //----------------------------------(End)-City Type---------------------------------------------
  //#endregion
  //-------------------------------------------------------------------------------------------
  disableButtonSave_Project = false;
  saveProject() {
    // this.GetCustomersByCustomerId(1);
    // this.PopupAfterSaveObj.ProjectId=1;
    // this.modalService.dismissAll();
    // this.modalService.open(this.noticModal, { size: 'xl' });
    // return;
    if (this.modalDetailsProject.projectNo == null) {
      this.toast.error('لا يمكنك حفظ مشروع بدون رقم',this.translate.instant("Message"));
      return;
    }
    if (this.userPermissions.length == 0) {
      this.toast.error('من فضلك أختر صلاحيات المستخدم',this.translate.instant("Message"));
      return;
    }
    if (this.modalDetailsProject.from >= this.modalDetailsProject.to) {
      this.toast.error('من فضلك أختر تاريخ صحيح',this.translate.instant("Message"));
      return;
    }
    if (
      this.modalDetailsProject.projectNo == null ||
      this.modalDetailsProject.branch == null ||
      this.modalDetailsProject.center == null ||
      this.modalDetailsProject.from == null ||
      this.modalDetailsProject.to == null ||
      this.modalDetailsProject.projectType == null ||
      this.modalDetailsProject.subProjectDetails == null ||
      this.modalDetailsProject.customer == null ||
      this.modalDetailsProject.buildingType == null ||
      this.modalDetailsProject.user == null ||
      this.modalDetailsProject.projectDescription == null ||
      this.modalDetailsProject.projectDepartment == null
    ) {
      this.toast.error('من فضلك أكمل البيانات',this.translate.instant("Message"));
      return;
    }
    var Privs = [];
    this.userPermissions.forEach((element: any) => {
      var priv: any = {};
      priv.UserPrivId = 0;
      priv.PrivilegeId = '121212';
      priv.Projectno = this.modalDetailsProject.projectNo;
      priv.UserId = element.userid;
      priv.ProjectID = 0;
      priv.CustomerID = this.modalDetailsProject.customer;
      priv.Select = element.watch ?? false;
      priv.Insert = element.add ?? false;
      priv.Update = element.edit ?? false;
      priv.Delete = element.delete ?? false;

      Privs.push(priv);
    });

    var priv2: any = {};
    priv2.UserPrivId = 0;
    priv2.PrivilegeId = '121212';
    priv2.Projectno = this.modalDetailsProject.projectNo;
    priv2.UserId = this.userG.userId;
    priv2.ProjectID = 0;
    priv2.CustomerID = this.modalDetailsProject.customer;
    priv2.Select = true;
    priv2.Insert = true;
    priv2.Update = true;
    priv2.Delete = true;
    Privs.push(priv2);

    let data = this.projectgoalList.filter(
      (a: { choose: any }) => a.choose == true
    );

    var RequirementsandGoals: any = [];
    data.forEach((element: any) => {
      var req: any = {};
      req.RequirementId = element.requirementId;
      RequirementsandGoals.push(req);
    });

    var ProjectObj: any = {};
    ProjectObj.ProjectId = 0;
    ProjectObj.ProjectNo = this.modalDetailsProject.projectNo;
    ProjectObj.ProjectDate = this._sharedService.date_TO_String(
      this.modalDetailsProject.from
    );
    ProjectObj.ProjectHijriDate = null;
    ProjectObj.ProjectExpireDate = this._sharedService.date_TO_String(
      this.modalDetailsProject.to
    );
    ProjectObj.ProjectExpireHijriDate = null;
    ProjectObj.ParentProjectId = null;
    ProjectObj.CustomerId = this.modalDetailsProject.customer;
    ProjectObj.BuildingType = this.modalDetailsProject.buildingType;
    ProjectObj.MangerId = this.modalDetailsProject.user;
    ProjectObj.DepartmentId = this.modalDetailsProject.projectDepartment;
    ProjectObj.CityId = this.modalDetailsProject.region;
    ProjectObj.ProjectDescription = this.modalDetailsProject.projectDescription;
    ProjectObj.ProjectTypeId = this.modalDetailsProject.projectType;
    ProjectObj.SubProjectTypeId = this.modalDetailsProject.subProjectDetails;
    ProjectObj.BranchId = this.modalDetailsProject.branch;
    ProjectObj.CostCenterId = this.modalDetailsProject.center;
    ProjectObj.ProjectNoType = this.ProjectNoType;
    ProjectObj.OffersPricesId = this.modalDetailsProject.offerPriceNumber;
    ProjectObj.IsNotSent = false;

    if (
      this.modalInvoice.InvoiceNumber == 0 ||
      this.modalInvoice.InvoiceNumber == null
    ) {
      ProjectObj.TransactionTypeId = 0;
    } else {
      ProjectObj.TransactionTypeId = 1;
    }
    ProjectObj.ProUserPrivileges = Privs;
    ProjectObj.ProjectRequirementsGoals = RequirementsandGoals;

    this.disableButtonSave_Project = true;
    setTimeout(() => {
      this.disableButtonSave_Project = false;
    }, 7000);

    if (this.modalDetailsProject.ProjectFlag == true) {
      this._projectService
        .SaveProjectPhasesTasks(ProjectObj)
        .subscribe((result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            this.saveReqForProject(result.returnedStr);
            if(this.WhatsAppData.sendactivationProject==true)
            {
              this.SendWhatsAppTask(null,result.returnedStr);
            }
            if (
              !(
                this.modalInvoice.InvoiceNumber == 0 ||
                this.modalInvoice.InvoiceNumber == null
              )
            ) {
              this.modalInvoice.ProjectId = result.returnedStr;
              this.modalInvoice.WhichClick = 1;
              this.checkPayTypeAndSave();
            }
            this.CustomerSearchChange();
            this.modalService.dismissAll();
          } else {
            this.toast.error(result.reasonPhrase,this.translate.instant("Message"));
          }
        });
    } else {
      debugger;
      this._projectService.SaveProject(ProjectObj).subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.saveReqForProject(result.returnedStr);
          if (
            !(
              this.modalInvoice.InvoiceNumber == 0 ||
              this.modalInvoice.InvoiceNumber == null
            )
          ) {
            this.modalInvoice.ProjectId = result.returnedStr;
            this.modalInvoice.WhichClick = 1;
            this.checkPayTypeAndSave();
          }
          this.CustomerSearchChange();
          this.modalService.dismissAll();
        } else {
          this.toast.error(result.reasonPhrase,this.translate.instant("Message"));
        }
      });
    }
  }
  saveReqForProject(projectid: any) {
    this._projectService
      .SaveRequirementsbyProjectId(projectid)
      .subscribe((result: any) => {});
  }
  addProject() {
    if (this.ProjectNoType == 2) {
      this._projectService.GetProjectCode_S().subscribe((data) => {
        var ValueUser = this.modalDetailsProject.projectNo;
        var ValueSys = data.result;
        var NewValue = ValueUser.substring(0, ValueSys.length);
        if (NewValue == ValueSys) {
          this.toast.error(
            'لا يمكن إدخال رقم مشروع بنفس الرقم التسلسلي ، فضلا أدخل رقما مختلفا',
           this.translate.instant("Message")
          );
          return;
        }
        this.saveProject();
      });
    } else {
      this.saveProject();
    }
  }
  applyFilterPerm(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userPermissionsDataSource.filter = filterValue.trim().toLowerCase();
  }
  applyRequirementsFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectRequirementsDataSource.filter = filterValue
      .trim()
      .toLowerCase();
  }
  projectRequirementsColumns: string[] = ['File Name', 'cost', 'Attachments'];
  //----------------------------------------------------------------------
  //#endregion
  //-----------------------------------------End Add Project---------------------------

  //----------------------------ServicePrice----------------------------
  //#region
  ServiceTypelist = [
    { id: 1, name: 'خدمة' },
    { id: 2, name: 'تقرير' },
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
        // ServiceType: this.SerivceModalForm.controls["ServiceType"].value,
        ServicesId: this.SerivceModalForm.controls["id"].value,
        servicesName: this.SerivceModalForm.controls["ServiceName"].value,

        amountPur: this.SerivceModalForm.controls["AmountPur"].value,
        accountIdPur: this.SerivceModalForm.controls["AccountIdPur"].value,
        begbalance: this.SerivceModalForm.controls["Begbalance"].value,
        serialNumber: this.SerivceModalForm.controls["SerialNumber"].value,
        itemCode: this.SerivceModalForm.controls["ItemCode"].value,

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

  drop(event: CdkDragDrop<string[]>) {
    debugger;
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    var TempService = this.ListDataServices;
    this.ListDataServices = [];

    TempService.forEach((element: any) => {
      let newArray2 = element.filter(
        (d: { parentId: any }) => d.parentId != this.serviceDetails[0].parentId
      );
      if (newArray2.length > 0) {
        this.ListDataServices.push(newArray2);
      }
    });
    this.ListDataServices.push(this.serviceDetails);

    // console.log(this.serviceDetails);
    // console.log(this.ListDataServices);
  }

  //-------------------------------------------------------------------------
  //#region

  OfferPopupAddorEdit_Invoice: any = 0; //add

  ListDataServices_Invoice: any = [];
  GetServicesPriceByParentId_Invoice(element: any) {
    debugger;
    this.serviceDetails_Invoice = [];
    if (element.AccJournalid != null) {
      if (this.OfferPopupAddorEdit_Invoice == 0) {
        if (this.modalInvoice.OfferPriceNo != null) {
          this._invoiceService
            .GetServicesPriceVouByParentId(
              element.AccJournalid,
              this.modalInvoice.OfferPriceNo
            )
            .subscribe((data) => {
              this.serviceDetails_Invoice = data.result;
              debugger;
              var Check = true;
              if (this.ListDataServices_Invoice.length > 0) {
                for (let ele of this.ListDataServices_Invoice) {
                  var val = ele.filter(
                    (a: { parentId: any }) => a.parentId == element.AccJournalid
                  );
                  if (val.length == 0) {
                    Check = false;
                  } else {
                    Check = true;
                    break;
                  }
                }
              } else {
                Check = false;
              }

              if (Check == false) {
                this.ListDataServices_Invoice.push(this.serviceDetails_Invoice);
              }
              this.SetDetailsCheck_Invoice(this.serviceDetails_Invoice);
              this.serviceDetails_Invoice.sort(
                (a: { lineNumber: number }, b: { lineNumber: number }) =>
                  (a.lineNumber ?? 0) - (b.lineNumber ?? 0)
              ); // b - a for reverse sort
            });
        } else {
          this._invoiceService
            .GetServicesPriceByParentId(element.AccJournalid)
            .subscribe((data) => {
              this.serviceDetails_Invoice = data.result;
              debugger;
              var Check = true;
              if (this.ListDataServices_Invoice.length > 0) {
                for (let ele of this.ListDataServices_Invoice) {
                  var val = ele.filter(
                    (a: { parentId: any }) => a.parentId == element.AccJournalid
                  );
                  if (val.length == 0) {
                    Check = false;
                  } else {
                    Check = true;
                    break;
                  }
                }
              } else {
                Check = false;
              }

              if (Check == false) {
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

  SureServiceList_Invoice: any = [];
  MarkServiceDetails_Invoice(item: any) {
    if (item?.SureService == 1) item.SureService = 0;
    else item.SureService = 1;
    this.SureServiceList_Invoice.push(item);
  }
  UnMarkServiceDetails_Invoice(item: any) {
    if (item?.SureService == 1) item.SureService = 0;
    else item.SureService = 1;
    if (this.SureServiceList_Invoice.length > 0) {
      let index = this.SureServiceList_Invoice.findIndex(
        (d: { servicesId: any }) => d.servicesId == item.servicesId
      );
      if (index != -1) {
        this.SureServiceList_Invoice.splice(index, 1);
      }
    }
  }
  RemoveServicesparent_invoice(ele: any) {
    {
      debugger;
      var TempService = this.ListDataServices_Invoice;
      this.ListDataServices_Invoice = [];
      let newArray = this.SureServiceList_Invoice.filter(
        (d: { parentId: any }) => d.parentId != ele.AccJournalid
      );
      TempService.forEach((element: any) => {
        let newArray2 = element.filter(
          (d: { parentId: any }) => d.parentId != ele.AccJournalid
        );
        if (newArray2.length > 0) {
          this.ListDataServices_Invoice.push(newArray2);
        }
      });
      this.SureServiceList_Invoice = newArray;
    }
  }
  SetDetailsCheck_Invoice(item: any) {
    item.forEach((element: any) => {
      let filteritem = this.SureServiceList_Invoice.filter(
        (d: { servicesId: any }) => d.servicesId == element.servicesId
      );
      if (filteritem.length > 0) {
        element.SureService = 1;
      }
    });
  }
  serviceDetails_Invoice: any = [];

  drop_Invoice(event: CdkDragDrop<string[]>) {
    debugger;
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    var TempService = this.ListDataServices_Invoice;
    this.ListDataServices_Invoice = [];

    TempService.forEach((element: any) => {
      let newArray2 = element.filter(
        (d: { parentId: any }) =>
          d.parentId != this.serviceDetails_Invoice[0].parentId
      );
      if (newArray2.length > 0) {
        this.ListDataServices_Invoice.push(newArray2);
      }
    });
    this.ListDataServices_Invoice.push(this.serviceDetails_Invoice);

    // console.log(this.serviceDetails_Invoice);
    // console.log(this.ListDataServices_Invoice);
  }

  //#endregion

  ServiceFormPrintData: any = null;
  ServiceFormCustomData: any = {
    OrgImg: null,
  };
  resetServiceFormCustomData() {
    this.ServiceFormPrintData = null;
    this.ServiceFormCustomData = {
      OrgImg: null,
    };
  }

  GetServiceFormPrint(obj: any) {
    this.resetServiceFormCustomData();
    this._printreportsService
      .ChangeOfferGene_PDF(obj.formId, obj.formType)
      .subscribe((data) => {
        debugger;
        this.ServiceFormPrintData = data;
        this.ServiceFormCustomData.OrgImg =
          environment.PhotoURL + this.ServiceFormPrintData?.org_VD.logoUrl;
      });
  }

  OrganizationData: any;
  getorgdata() {
    debugger;
    this.api.GetOrganizationDataLogin().subscribe({
      next: (res: any) => {
        this.OrganizationData = res.result;
      },
      error: () => {},
    });
  }


  //-------------------------------------------------------------------
  WhatsAppModals: any = {
    customerPhoneOffer: null,
  };
  SendWOfferPrice(element:any,modal:any) {
    debugger
    // console.log(element);
    // console.log(this.modalDetailsOffer);
    const formData = new FormData();
    if (element.files.length > 0) {
      if (this.WhatsAppModals.customerPhoneOffer==null || this.WhatsAppModals.customerPhoneOffer=="") {
        this.toast.error("تأكد من رقم العميل", this.translate.instant('Message'));
        return;
      }
      else{
        formData.append('UploadedFile', element.files[0]);
        formData.append('OfferId', this.modalDetailsOffer.offersPricesId);
        formData.append('Notes', element.WhatsAppText);
        formData.append('environmentURL', environment.PhotoURL);
        formData.append('customerPhoneOffer', this.WhatsAppModals.customerPhoneOffer);

        this._offerpriceService
          .SendWOfferPrice(formData)
          .subscribe((result: any) => {
            if (result.statusCode == 200) {
              modal?.dismiss();
              this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
            } else {
              this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant('Message'));
            }
          });
      }
    }
    else
    {
      this.toast.error(this.translate.instant("أختر الملف"), this.translate.instant('Message'));
    }
  }
  SendWhatsAppTask(taskId:any,projectid:any) {
    const formData = new FormData();
    if(taskId!=null){formData.append('taskId', taskId);}
    if(projectid!=null){formData.append('projectid', projectid);}
    formData.append('environmentURL', environment.PhotoURL);
    this._offerpriceService.SendWhatsAppTask(formData).subscribe((result: any) => {

    });
  }
  //-----------------------------------Storehouse------------------------------------------------
  //#region 


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

}
