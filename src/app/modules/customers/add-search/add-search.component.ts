import { SelectionModel } from '@angular/cdk/collections';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  HostListener,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { EmailValidator, NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import {
  BsModalService,
  BsModalRef,
  ModalDirective,
} from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Customer } from 'src/app/core/Classes/DomainObjects/customer';
import { CustomerFileAdd } from 'src/app/core/Classes/DomainObjects/CustomerFilesAdd';
import { CustomerMail } from 'src/app/core/Classes/DomainObjects/customerMail';
import { CustomerSendSMS } from 'src/app/core/Classes/DomainObjects/CustomerSendSMS';
import { EmailSetting } from 'src/app/core/Classes/DomainObjects/emailSetting';
import { CityVM } from 'src/app/core/Classes/ViewModels/cityVM';
import { CustomerFilesVM } from 'src/app/core/Classes/ViewModels/customerFilesVM';
import { CustomerVM } from 'src/app/core/Classes/ViewModels/customerVM';
import { CustomerService } from 'src/app/core/services/customer-services/customer.service';
import { ExportationService } from 'src/app/core/services/exportation-service/exportation.service';
import { fade } from 'src/app/shared/animations/toggleBtn.animation';
import { RestApiService } from 'src/app/shared/services/api.service';
import { combineLatest } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { PhasestaskService } from 'src/app/core/services/pro_Services/phasestask.service';
import { ProjectsettingService } from 'src/app/core/services/pro_Services/projectsetting.service';
import { ProjectstatusService } from 'src/app/core/services/pro_Services/projectstatus.service';
import { ProjectService } from 'src/app/core/services/pro_Services/project.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { InvoiceService } from 'src/app/core/services/acc_Services/invoice.service';
import { CustomerSMS } from 'src/app/core/Classes/DomainObjects/customerSMS';
import { OfferpriceService } from 'src/app/core/services/pro_Services/offerprice.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import printJS from 'print-js';
import { DomSanitizer } from '@angular/platform-browser';
import { SafePipe } from 'src/app/shared/pipes/safe.pipe';
import { TranslateService } from '@ngx-translate/core';
import 'hijri-date';
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

const hijriSafe = require('hijri-date/lib/safe');
const HijriDate = hijriSafe.default;
const toHijri = hijriSafe.toHijri;

// @Pipe({ name: 'safe' })
// export class SafePipe implements PipeTransform {
//   constructor(private domSanitizer: DomSanitizer) {}
//   transform(url:any) {
//     return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
//   }
// }

@Component({
  selector: 'app-add-search',
  templateUrl: './add-search.component.html',
  styleUrls: ['./add-search.component.scss'],
  animations: [fade],
})
export class AddSearchComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public uploadedFiles: Array<File> = [];
  dataSourceTemp: any = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  _CustomerSMS: any = null;
  modal?: BsModalRef;
  modalDetails: any = {};
  load_CustomerName: any;
  load_CustomerMobile: any;
  load_CustomerMail: any;
  _CustomerFilesVM: CustomerFilesVM;
  load_BranchAccount: any;
  load_CityAndAreas: any;
  public _CustomerVM: CustomerVM;
  customrRowSelected: any;
  obj: CustomerVM;
  BranchId: number;
  getEmailOrgnize: any;
  governmentCount = 0;
  InvestorCompanyCount = 0;
  CitizensCount = 0;
  allCount = 0;
  load_FileType: any;
  load_BranchUserId: any;
  nameAr: any;
  nameEn: any;
  isSubmit: boolean = false;
  modalRef?: BsModalRef;
  subscriptions: Subscription[] = [];
  messages: string[] = [];
  load_filesTypes: any;
  customer = new Customer();
  // _CustomerFileAdd: CustomerFileAdd = { fileId: 0, nameAr: '', nameEn: '' };
  _cityVM: CityVM = { cityId: 0, nameAr: '', nameEn: '', notes: '' };
  _customerEmail = EmailSetting;
  emailModalDetils: any;
  uploadModalDetils: any;
  modalSMSDetails: any;

  userG: any = {};
  selectedDateType = DateType.Hijri;

  title: any = {
    main: {
      name: {
        ar: 'العملاء',
        en: 'Customers',
      },
      link: '/customers',
    },
    sub: {
      ar: 'الإضافة والبحث',
      en: 'Search and inquire',
    },
  };

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
    documents: [],
    files: [],
    clients: [],
    branches: [],
    cities: [],
    filesTypes: [],
  };

  searchBox: any = {
    open: false,
    searchType: null,
  };
  @ViewChild(DatatableComponent) table: DatatableComponent | any;

  columns: any = [];

  isEditable: any = {};

  displayedColumns: string[] = [
    'name',
    'nationalId',
    'customerType',
    'email',
    'phone',
    'mobile',
    'operations',
  ];
  displayedColumn: any = {
    usersMail: ['select', 'name', 'email'],
    usersMobile: ['select', 'name', 'mobile'],
  };
  data2: any = {
    filter: {
      enable: true,
      date: null,
      search_CustomerName: '',
      search_customerEmail: '',
      search_customerMobile: '',
      isChecked: false,
    },
  };

  EditModel: any = {
    CustomerId: 0,
    CustomerName: null,
    CustomerNameEn: null,
  };

  constructor(
    private service: CustomerService,
    private modalService: BsModalService,
    private api: RestApiService,
    private exportationService: ExportationService,
    private _projectstatusService: ProjectstatusService,
    private _phasestaskService: PhasestaskService,
    private _projectsettingService: ProjectsettingService,
    private _projectService: ProjectService,
    private _sharedService: SharedService,
    private _invoiceService: InvoiceService,
    private changeDetection: ChangeDetectorRef,
    private toast: ToastrService,
    private ngbModalService: NgbModal,
    private authenticationService: AuthenticationService,
    private _offerpriceService: OfferpriceService,
    private translate: TranslateService,
    private domSanitizer: DomSanitizer
  ) {
    this.userG = this.authenticationService.userGlobalObj;
    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
    this._CustomerVM = new CustomerVM();
  }

  //   ngAfterContentChecked() {
  //     this.fillBranchByUserId();
  //     this.changeDetection.detectChanges();
  //  }

  @ViewChild('dataModal') dataModal!: any;

  @ViewChild('optionsModal') optionsModal!: any;

  @ViewChild('noticModal') noticModal!: any;

  @ViewChild('paginatorServices') paginatorServices!: MatPaginator;

  @ViewChild('NewInvoiceModal') newInvoiceModal: any;
  @ViewChild('mailPaginator') mailPaginator!: MatPaginator;
  @ViewChild('smsPaginator') smsPaginator!: MatPaginator;

  //
  //
  users: any;
  showPrice: any = false;
  existValue: any = true;
  showOfferValue: any = false;
  offerTerms: any = [];
  offerServices: any = [];
  offerPayments: any = [
    {
      id: 1,
      statement: '',
      statementEn: '',
      status: false,
      ratio: 0,
      amount: 0,
    },
  ];

  serviceDetails: any;

  selectAllValue = false;

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

  projectGoalsDataSource = new MatTableDataSource();

  projectGoals: any;
  WhatsAppData: any={
    sendactivation:false,
    sendactivationOffer:false,
    sendactivationProject:false,
    sendactivationSupervision:false,
  };
  ngOnInit(): void {
    this.getData();
    this.fillCustomerSelect2Mails();
    this._sharedService.GetWhatsAppSetting().subscribe((data: any) => {
      if(data?.result!=null){this.WhatsAppData=data?.result;}
      else{this.WhatsAppData={sendactivation:false,sendactivationOffer:false,sendactivationProject:false,sendactivationSupervision:false,};}
    });
    this.getorgdata();
  }

  ///////////////////////////////FILTER/////////////////

  onChange(value: any) {
    this.searchBox.searchType = value;
    if (this.searchBox.searchType == 1) {
      this.fill_CustomerName();
    } else if (this.searchBox.searchType == 3) {
      this.fill_CustomerMobile();
    }
    // else if (this.searchBox.searchType == 2) {
    //   this.fill_CustomerMail();
    // }
  }

  filterData(array: any[], type?: any) {
    if (!type) {
      return array;
    }
    return array.filter((ele) => {
      return ele.customerTypeId == type;
    });
  }

  /////////////////////////////Filter//////////////////

  RefreshData() {
    this._CustomerVM = new CustomerVM();
    if (this.searchBox.searchType == 1) {
      if (this.data2.filter.search_CustomerName == null) {
        this.getData();
        return;
      }
      this._CustomerVM.customerId = this.data2.filter.search_CustomerName;
    } else if (this.searchBox.searchType == 2) {
      if (this.data2.filter.search_customerEmail == null) {
        this.getData();
        return;
      }
      this._CustomerVM.customerEmail = this.data2.filter.search_customerEmail;
    } else if (this.searchBox.searchType == 3) {
      if (this.data2.filter.search_customerMobile == null) {
        this.getData();
        return;
      }
      this._CustomerVM.customerMobile = this.data2.filter.search_customerMobile;
    }

    var obj = this._CustomerVM;
    this.service.SearchFn(obj).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    var tempsource = this.dataSourceTemp;
    if (val) {
      tempsource = this.dataSourceTemp.filter((d: any) => {
        return (
          (d.customerName &&
            d.customerName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.customerNationalId &&
            d.customerNationalId?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.customerTypeName &&
            d.customerTypeName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.customerEmail &&
            d.customerEmail?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.customerPhone &&
            d.customerPhone?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.customerMobile &&
            d.customerMobile?.trim().toLowerCase().indexOf(val) !== -1)
        );
      });
    }

    this.dataSource = new MatTableDataSource(tempsource);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  checkValue(event: any) {
    if (event == 'A') {
      this.getData();
    } else {
      this.RefreshData();
    }
  }

  resetandRefresh() {
    if (this.searchBox.open == false) {
      this.data2.filter.search_CustomerName = null;
      this.data2.filter.search_customerMobile = null;
      this.data.type = 0;
      this.getData();
    }
  }
  //------------------ Fill DATA ----------------------------------

  fill_CustomerName() {
    this.service.FillCustomerNameSelect().subscribe((data) => {
      this.load_CustomerName = data;
    });
  }
  fill_CustomerMobile() {
    this.service.FillCustomerMobileSelect().subscribe((data: any) => {
      this.load_CustomerMobile = data;
      this.load_CustomerMobile = this.load_CustomerMobile.filter(
        (x: { customerMobile: any }) => !!x.customerMobile
      );
    });
  }
  fill_CustomerMail() {
    this.service.FillCustomerMailSelect().subscribe((data) => {
      this.load_CustomerMail = data;
    });
  }

  getEmailOrganization() {
    this.service.getEmailOrganization().subscribe((data) => {
      this.getEmailOrgnize = data.email;
    });
  }

  fillFileTypeSelect() {
    this.service.fillFileTypeSelect().subscribe((data) => {
      this.load_FileType = data;
    });
  }

  fillBranchByUserId() {
    this.service.fillBranchByUserId().subscribe((data) => {
      this.load_BranchUserId = data;
      if (this.load_BranchUserId.length == 1) {
        this.modalDetails.branchId = this.load_BranchUserId[0].id;
        this.getBranchAccount(this.modalDetails.branchId);
      }
    });
  }

  // getCityAndAreas() {
  //   this.service.FillCitySelect().subscribe(data => {
  //     this.load_CityAndAreas = data;
  //   });
  // }

  City_Cus: any;
  CityTypesPopup_Cus: any;

  FillCitySelect_Cus() {
    this._projectService.FillCitySelect().subscribe((data) => {
      this.City_Cus = data;
      this.CityTypesPopup_Cus = data;
    });
  }

  objBranchAccount: any = null;
  getBranchAccount(BranchId: any) {
    this.objBranchAccount = null;
    this.modalDetails.accountName = null;
    this.service.getCustMainAccByBranch(BranchId).subscribe({
      next: (data: any) => {
        //this.modalDetails.CustMainAccByBranchId = data.result;
        this.modalDetails.accountName =
          data.result.nameAr + ' - ' + data.result.code;
        this.objBranchAccount = data.result;
      },
      error: (error) => {},
    });
  }

  setCustomersType(type: any) {
    // change table cells
    if (type == '0' || type == '1') {
      this.displayedColumns = [
        'name',
        'nationalId',
        'customerType',
        'email',
        'phone',
        'mobile',
        'operations',
      ];
    } else {
      this.displayedColumns = [
        'name',
        // 'nationalId',
        'customerType',
        'email',
        'phone',
        'mobile',
        'operations',
      ];
    }
    // assign data
    // const filteredData = this.filterData(this.data.clients, type);
    // this.dataSource = new MatTableDataSource(filteredData);

    this.service.getAllCustomersByCustomerTypeId(type).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  //-----------------------OPEN MODAL--------------------------------------------------

  openModal(template: TemplateRef<any>, data?: any, modalType?: any) {
    this.fillBranchByUserId();
    this.FillCitySelect_Cus();

    this.resetModal();
    this.getEmailOrganization();
    this.fillCustomerSelect2Mails();

    if (modalType == 'addClient') {
      this.GetSystemSettingsByUserId();
    }
    console.log('this.modalDetails');
    console.log(this.modalDetails);

    if (data) {
      //  console.log('xxx');
      this.modalDetails = data;

      this.emailModalDetils = data;

      this.modalSMSDetails = data;

      this.modalDetails.country = 'المملكة العربية السعودية';

      if (modalType == 'editClient') {
        this.getBranchAccount(this.modalDetails.branchId);
        debugger;
        if (data.agentAttachmentUrl != null) {
          this.modalDetails.attachmentUrl =
            environment.PhotoURL + data.agentAttachmentUrl;
          //this.modalDetails.attachmentUrl = this.domSanitizer.bypassSecurityTrustUrl(environment.PhotoURL+data.agentAttachmentUrl)
        }
      } else if (modalType == 'sendEmail') {
        this.getEmailOrganization();
        this.resetEmailModal();
      }
      if ((modalType = 'sendSms')) {
        this.selection.clear();
      }
      console.log(this.modalDetails);
      this.resetEmailModal();
    }
    if (modalType) {
      //console.log(modalType);

      this.modalDetails.type = modalType;
    }

    this.modal = this.modalService.show(template, {
      class: ' modal-xl',
      backdrop: 'static',
      keyboard: false,
    });
  }

  selection = new SelectionModel<any>(true, []);

  CustomerMailIsRequired: any = false;
  MailIsRequired: any = false;
  CustomerNationalIdIsRequired: any = false;
  NationalIdIsRequired: any = false;
  CustomerphoneIsRequired: any = false;
  phoneIsRequired: any = false;
  GetSystemSettingsByUserId() {
    this.CustomerMailIsRequired = false;
    this.CustomerNationalIdIsRequired = false;
    this.CustomerphoneIsRequired = false;
    this._offerpriceService.GetSystemSettingsByUserId().subscribe((data) => {
      this.CustomerMailIsRequired = data.customerMailIsRequired;
      this.CustomerNationalIdIsRequired = data.customerNationalIdIsRequired;
      this.CustomerphoneIsRequired = data.customerphoneIsRequired;
      this.MailIsRequired = data.customerMailIsRequired;
      this.NationalIdIsRequired = data.customerNationalIdIsRequired;
      this.phoneIsRequired = data.customerphoneIsRequired;
    });
  }
  closeResult: any;
  OfferPopupAddorEdit: any = 0; //add offerprice

  invoicepop = 1;
  publicidRow: any;

  InvoiceModelPublic: any;

  open(content: any, data?: any, type?: any, idRow?: any, model?: any) {
    this.publicidRow = 0;

    if (idRow != null) {
      this.selectedServiceRow = idRow;
    }
    if (data) {
      this.modalDetails = data;
      this.emailModalDetils = data;
      this.modalSMSDetails = data;
    }
    if (type == 'addInvoicewithoutProject') {
      this.ListDataServices_Invoice = [];
      this.SureServiceList_Invoice = [];
      this.OfferPopupAddorEdit_Invoice = 0;
      this.InvoicePopup(2);
      this.invoicepop = 1;
    } else if (type == 'addInvoiceProject') {
      this.InvoicePopup(2);
      this.invoicepop = 2;
    } else if (type == 'sendEmail') {
      this.getEmailOrganization();
      this.resetEmailModal();
    } else if (type == 'sendEmail_AfterSave') {
      this.getEmailOrganization();
      this.resetEmailModal();
      this.modalDetails.customerEmail =
        this.PopupAfterSaveObj_Customer.EmailValue_Customer;
    } else if (type == 'sendSms') {
      this.resetSMsModal();
    } else if (type == 'sendSms_AfterSave') {
      this.resetSMsModal();
      this.modalDetails.customerName =
        this.PopupAfterSaveObj_Customer.CustomerName;
      this.modalDetails.customerMobile =
        this.PopupAfterSaveObj_Customer.PhoneValue_Customer;
    } else if (type == 'addOfferPrice') {
      this.ResetModel();
      this.GetAllCustomerPaymentsconst();
      this.GetOfferconditionconst();
      this.Getnextoffernum();
      this.setCustomerOfferPrice();
      this.OfferPopupAddorEdit = 0;
    } else if (type == 'LandArea') {
      this.GetAllFloors();
      this.resetLandArea();
      if (!this.offerServices.length) {
        this.toast.error('أختر باقة أولا', 'رسالة');
        return;
      }
    } else if (type == 'serviceDetails' && data) {
      this.GetServicesPriceByParentId(data);
    }

    if (type == 'addproject') {
      this.ProjectPopupFunc();
      this.GenerateNextProjectNumber();
    }
    if (type == 'modifyPermissionsModal') {
      if (this.modalDetailsProject.customer == null) {
        this.toast.error('من فضلك أختر عميل أولا', 'رسالة');
        return;
      } else {
        this.FillUserPermission();
      }
    }
    if (type === 'deleteModalPerm') {
      this.publicidRow = data.idRow;
    }
    if (type == 'SaveInvoiceConfirmModal') {
      this.InvoiceModelPublic = model;
    }
    if (type == 'serviceDetails_Invoice' && data) {
      this.GetServicesPriceByParentId_Invoice(data);
    }
    this.fillFileTypeSelect();
    this.getAllFileTypesSearch();
    this.ngbModalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
        centered:
          type == 'SaveInvoiceConfirmModal' ? true : !type ? true : false,
        backdrop: 'static',
        keyboard: false,
      })
      .result.then(
        (result) => {
          //this.resetModal();
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  private getDismissReason(reason: any, type?: any): string {
    //this.resetModal();
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  setCustomerOfferPrice() {
    this.existValue == true;
    this.modalDetailsOffer.user = this.CustomerIdPublic;
  }
  setCustomerInvoice() {
    this.modalInvoice.customerId = this.CustomerIdPublic;
    this.customerIdChange();
  }
  //dawoud
  TablClick() {
    this.modalDetails.customerNameAr = null;
    this.modalDetails.customerNameEn = null;
    this.isSubmit = false;
  }
  ShowImg(pho: any) {
    var img = environment.PhotoURL + pho;
    return img;
  }
  ShowAgentFile(file: any) {
    if (file != null) {
      window.open(file, '_blank');
    }
  }

  urlAgent: any = null;
  // cleanURL(url:any):SafePipe{
  //   this.urlAgent=null;
  //   return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  // }

  ///////////////SEND SMS //////////////////////////

  resetSMsModal() {
    this.control.clear();
    this.modalSMSDetails = {
      sMSText: null,
    };
  }
  assignedCustomersIds: any = [];

  sendSMS(modal: any) {
    this.assignedCustomersIds = [];

    this._CustomerSMS = new CustomerSMS();
    this._CustomerSMS.sMSId = 0;
    // this._CustomerSMS.customerId = this.modalDetails.customerId;
    this._CustomerSMS.customerId = this.CustomerIdPublic;
    this._CustomerSMS.sMSText = this.modalSMSDetails.sMSText;
    this._CustomerSMS.customerMobile = this.modalDetails.customerMobile;
    this._CustomerSMS.AllCustomers = false;
    //this.assignedCustomersIds.push(this.modalDetails.customerId);
    this.assignedCustomersIds.push(this.CustomerIdPublic);

    this._CustomerSMS.assignedCustomersSMSIds = this.assignedCustomersIds;
    this.service.SaveCustomerSMS(this._CustomerSMS).subscribe((result) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.resetSMsModal();
        modal?.dismiss();
      } else {
        this.toast.error(result.reasonPhrase, 'رسالة');
      }
    });
  }

  getSMS() {
    this.service
      .getSMSByCustomerId(this.modalDetails.customerId)
      .subscribe((data: any) => {
        this.modalDetails = data;
      });
  }

  getAllFileTypesSearch() {
    this.service.getAllFileTypesSearch().subscribe((data: any) => {
      this.load_filesTypes = data.result;
      console.log(data.result);
    });
  }

  ////////////////////////ADD && EDIT CUSTOMER//////////////////////////
  CustomerIdPublic: any = 0;
  setCustomerid_P(id: any) {
    this.CustomerIdPublic = id;
    console.log('this.CustomerIdPublic');
    console.log(this.CustomerIdPublic);
  }

  PopupAfterSaveObj_Customer: any = {
    CustomerId: 0,
    AccountNo: null,
    MainAccountNo: null,
    MainAccountName: null,
    CustomerName: null,
    BranchName: null,
  };

  // EmailValue_Customer: any;PhoneValue_Customer: any;
  checkedEmail: any;
  checkedPhone: any;
  clientAddedCheckedEmail: any = false;
  clientAddedCheckedPhone: any = false;

  GetCustomersByCustomerId_Cust(id: any, BranchName: any) {
    this._projectService.GetCustomersByCustomerId(id).subscribe((data) => {
      console.log(data);
      console.log('this.objBranchAccount');
      console.log(this.objBranchAccount);
      this.setCustomerid_P(id);
      this.PopupAfterSaveObj_Customer = {
        CustomerId: id,
        AccountNo: data.result.accountCodee,
        MainAccountNo: this.objBranchAccount.code,
        MainAccountName: this.objBranchAccount.nameAr,
        CustomerName: data.result.customerNameAr,
        BranchName: BranchName,
        EmailValue_Customer: data.result.customerEmail,
        PhoneValue_Customer: data.result.customerMobile,
      };
    });
  }
  disableButtonSave_Customer = false;

  addCustomer() {
    // this.ngbModalService.dismissAll();
    // this.ngbModalService.open(this.optionsModal, { size: 'xl',backdrop : 'static',keyboard : false });
    // //var branname=this.load_BranchUserId.filter((a: { id: any; })=>a.id==this.modalDetails.branchId)[0].name;

    // this.GetCustomersByCustomerId_Cust(72,"branname");
    // return;

    debugger;
    var val = this.validateForm();
    if (val.status == false) {
      this.toast.error(val.msg, 'رسالة');
      return;
    }
    var custObj: any = {};
    custObj.customerId = this.modalDetails.customerId;
    custObj.customerNameAr = this.modalDetails.customerNameAr;
    custObj.customerNameEn = this.modalDetails.customerNameEn;
    custObj.customerNationalId = this.modalDetails.customerNationalId;
    custObj.cityId = this.modalDetails.cityId;
    custObj.customerTypeId = this.modalDetails.customerTypeId ?? 1;

    custObj.branchId = this.modalDetails.branchId;
    custObj.accountId = this.modalDetails.accountId;
    //this.customer.accountName = this.modalDetails.accountName;
    //this.customer.addDate = this.modalDetails.addDate;

    custObj.generalManager = this.modalDetails.generalManager;
    //custObj.attachmentUrl = this.modalDetails.attachmentUrl;
    custObj.customerMobile = this.modalDetails.customerMobile;
    custObj.customerPhone = this.modalDetails.customerPhone;

    custObj.customerEmail = this.modalDetails.customerEmail;
    custObj.commercialActivity = this.modalDetails.commercialActivity;

    custObj.commercialRegDate = this.modalDetails.commercialRegDate;
    custObj.commercialRegHijriDate = this.modalDetails.commercialRegHijriDate;

    custObj.postalCodeFinal = this.modalDetails.postalCodeFinal;
    custObj.country = this.modalDetails.country;

    custObj.streetName = this.modalDetails.streetName;
    custObj.buildingNumber = this.modalDetails.buildingNumber;

    custObj.neighborhood = this.modalDetails.neighborhood;
    custObj.customerAddress = this.modalDetails.customerAddress;

    //this.customer.commercialRegInvoice = this.modalDetails.commercialRegInvoice;
    custObj.commercialRegister = this.modalDetails.commercialRegister;
    custObj.responsiblePerson = this.modalDetails.responsiblePerson;

    custObj.externalPhone = this.modalDetails.externalPhone;
    custObj.compAddress = this.modalDetails.compAddress;

    custObj.agentName = this.modalDetails.agentName;
    custObj.agentAttachmentUrl = this.modalDetails.agentAttachmentUrl;
    custObj.agentNumber = this.modalDetails.agentNumber;
    custObj.agentType = this.modalDetails.agentType;

    custObj.notes = this.modalDetails.notes;
    console.log('custObj');
    console.log(custObj);

    const formData = new FormData();
    for (const key of Object.keys(custObj)) {
      const value = custObj[key] == null ? '' : custObj[key];
      formData.append(key, value);
      formData.append('CustomerId', custObj.customerId.toString());
      if (this.control?.value.length > 0) {
        formData.append('UploadedAgentImage', this.control?.value[0]);
      }
    }
    this.disableButtonSave_Customer = true;
    setTimeout(() => {
      this.disableButtonSave_Customer = false;
    }, 9000);
    this.service.SaveCustomer(formData).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.decline();
        this.getData();
        this.ngbModalService.dismissAll();
        if (this.modalDetails.type == 'addClient') {
          this.ngbModalService.open(this.optionsModal, {
            size: 'xl',
            backdrop: 'static',
            keyboard: false,
          });
          var branname = this.load_BranchUserId.filter(
            (a: { id: any }) => a.id == this.modalDetails.branchId
          )[0].name;
          this.GetCustomersByCustomerId_Cust(result.returnedParm, branname);
        }
      } else {
        this.toast.error(result.reasonPhrase, 'رسالة');
      }
    });
  }
  ValidateObjMsg: any = { status: true, msg: null };
  validateForm() {
    this.ValidateObjMsg = { status: true, msg: null };

    if (
      this.modalDetails.customerNameAr == null ||
      this.modalDetails.customerNameAr == ''
    ) {
      this.ValidateObjMsg = { status: false, msg: ' أدخل أسم العميل عربي' };
      return this.ValidateObjMsg;
    } else if (
      this.modalDetails.customerNameEn == null ||
      this.modalDetails.customerNameEn == ''
    ) {
      this.ValidateObjMsg = { status: false, msg: 'أدخل أسم العميل انجليزي' };
      return this.ValidateObjMsg;
    } else if (this.modalDetails.branchId == null) {
      this.ValidateObjMsg = { status: false, msg: 'اختر فرع العميل' };
      return this.ValidateObjMsg;
    } else if (
      this.modalDetails.accountName == null ||
      this.modalDetails.accountName == ''
    ) {
      this.ValidateObjMsg = { status: false, msg: 'لا يوجد حساب لهذا الفرع' };
      return this.ValidateObjMsg;
    }
    // else if (this.modalDetails.customerMobile==null || this.modalDetails.customerMobile=="") {
    else if (
      this.CustomerphoneIsRequired == true &&
      (this.modalDetails.customerMobile == null ||
        this.modalDetails.customerMobile == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'ادخل جوال العميل' };
      return this.ValidateObjMsg;
    }
    // else if (this.modalDetails.customerEmail==null || this.modalDetails.customerEmail=="") {
    else if (
      this.CustomerMailIsRequired == true &&
      (this.modalDetails.customerEmail == null ||
        this.modalDetails.customerEmail == '')
    ) {
      this.ValidateObjMsg = {
        status: false,
        msg: 'ادخل البريد الالكتروني للعميل',
      };
      return this.ValidateObjMsg;
    }
    if (this.modalDetails.customerTypeId == 1) {
      // if (this.modalDetails.customerNationalId==null || this.modalDetails.customerNationalId=="" ) {
      if (
        this.CustomerNationalIdIsRequired == true &&
        (this.modalDetails.customerNationalId == null ||
          this.modalDetails.customerNationalId == '')
      ) {
        this.ValidateObjMsg = { status: false, msg: 'ادخل رقم هوية العميل' };
        return this.ValidateObjMsg;
      }
    } else if (this.modalDetails.customerTypeId == 2) {
      if (!this.modalDetails.generalManager) {
        this.ValidateObjMsg = { status: false, msg: 'ادخل اسم المدير العام' };
        return this.ValidateObjMsg;
      }
      if (!this.modalDetails.commercialActivity) {
        this.ValidateObjMsg = { status: false, msg: 'ادخل النشاط التجاري' };
        return this.ValidateObjMsg;
      }
      if (!this.modalDetails.commercialRegister) {
        this.ValidateObjMsg = { status: false, msg: 'ادخل السجل التجاري' };
        return this.ValidateObjMsg;
      }
    } else if (this.modalDetails.customerTypeId == 3) {
      if (!this.modalDetails.responsiblePerson) {
        this.ValidateObjMsg = { status: false, msg: 'ادخل الشخص المسؤول' };
        return this.ValidateObjMsg;
      }
    }
    this.ValidateObjMsg = { status: true, msg: null };
    return this.ValidateObjMsg;
  }

  ///////////////////// EPORT DATA/////////////////////////////////////////////

  customExportExcel(dataExport: any) {
    let exportation = JSON.parse(JSON.stringify(dataExport));
    let itemsToExeclude: string[] = [];

    let excelData: any[] = [];
    let headers: string[] = [];
    let objectKeys = Object.keys(dataExport[0]);
    objectKeys = objectKeys.filter(
      (item: string) => !itemsToExeclude.includes(item)
    );

    objectKeys.forEach((element) => {
      headers.push(element.toUpperCase());
    });

    exportation.forEach((ele: any) => {
      // ele = (ele) => {
      var sorted: any = {},
        key,
        a = [];

      for (key in ele) {
        if (ele.hasOwnProperty(key)) {
          a.push(key);
        }
      }
      a = a.filter((item: string) => !itemsToExeclude.includes(item));

      // a.sort();

      for (key = 0; key < a.length; key++) {
        sorted[a[key]] = ele[a[key]];
      }
      // return sorted;
      ele = sorted;
      // }
      let props = Object.getOwnPropertyNames(ele).filter((prop) =>
        exportation.some((ex: any) => ex === prop)
      );
      props.forEach((pp) => {
        delete ele[pp];
      });

      excelData.push(ele);
    });

    this.exportationService.exportExcel(
      excelData,
      'Customers' + new Date().getTime(),
      headers
    );
  }

  exportData() {
    this.service.getAllCustomers().subscribe((data: any) => {
      // console.log(data);

      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp = data;
      let dataExport = data as CustomerVM[];
      let x = [];

      for (let index = 0; index < dataExport.length; index++) {
        x.push({
          customerName: dataExport[index].customerName,
          customerNationalId: dataExport[index].customerNationalId,
          customerTypeName: dataExport[index].customerTypeName,
          customerEmail: dataExport[index].customerEmail,
          customerPhone: dataExport[index].customerPhone,
          customerMobile: dataExport[index].customerMobile,
        });
      }

      console.log(dataExport);
      // data as CustomerVM[]
      this.customExportExcel(x);
      this.getData();
    });
  }

  getData() {
    this.service.getAllCustomers().subscribe((data: any) => {
      // console.log(data);

      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp = data;

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.allCount = data.length;

      this.CitizensCount = data.filter(
        (data: { customerTypeId: 1 }) => data.customerTypeId == 1
      ).length;
      this.InvestorCompanyCount = data.filter(
        (data: { customerTypeId: 2 }) => data.customerTypeId == 2
      ).length;
      this.governmentCount = data.filter(
        (data: { customerTypeId: 3 }) => data.customerTypeId == 3
      ).length;
    });
  }

  ////////////////////RESET MODAL//////////////////////////////

  resetModal() {
    this.isSubmit = false;
    this.control.clear();
    this.modalDetails = {
      CustMainAccByBranchId: {
        code: '',
        accountName: null,
        nameAr: '',
        nameEn: '',
      },
      organizationEmail: '',
      type: 'addClient',
      agencData: null,
      customerNameAr: null,
      customerNameEn: null,
      id: null,
      responsiblePerson: null,
      name: null,
      customerId: 0,
      branchId: null,
      customerCode: null,
      customerName: null,
      customerNationalId: null,
      nationalIdSource: null,
      customerAddress: null,
      customerEmail: null,
      customerPhone: null,
      customerMobile: null,
      customerTypeId: '1',
      notes: null,
      logoUrl: null,
      attachmentUrl: null,
      commercialActivity: null,
      commercialRegister: null,
      commercialRegDate: null,
      commercialRegHijriDate: null,
      accountId: null,
      projectNo: null,
      generalManager: null,
      agentName: null,
      agentType: null,
      agentNumber: null,
      agentAttachmentUrl: null,
      accountName: null,
      addDate: null,
      customerTypeName: null,
      addUser: [],
      compAddress: null,
      postalCodeFinal: null,
      externalPhone: null,
      country: null,
      neighborhood: null,
      streetName: null,
      buildingNumber: null,
      commercialRegInvoice: null,
      cityId: null,
      cityName: null,
      noOfCustProj: null,
      noOfCustProjMark: null,
      addedcustomerImg: null,
      projects: null,
      accountCodee: null,
      totalRevenue: null,
      totalExpenses: null,
      invoices: null,
      transactions: null,
    };
  }

  resetEmailModal() {
    this.control.clear();
    this.emailModalDetils = {
      mailSubject: null,
      mailText: null,
      files: null,
      assignedCustomersIds: [],
    };
  }

  //////////////////DELETE //////////////////////////////

  confirm(): void {
    this.service
      .deleteCustomer(this.modalDetails.customerId)
      .subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }

        this.getData();
      });
    this.modal?.hide();
  }

  decline(): void {
    this.modal?.hide();
  }

  ////////////////////ADD CITY///////////////////////////

  dataAddCustomer: any = {
    citytype: {
      id: 0,
      nameAr: null,
      nameEn: null,
    },
  };
  //-----------------------------------City Type------------------------------------------------
  CityTypeRowSelected_Cus: any;
  getcitytypeRow_Cus(row: any) {
    this.CityTypeRowSelected_Cus = row;
    console.log(this.CityTypeRowSelected_Cus);
  }
  setcityTypeInSelect_Cus(data: any, model: any) {
    this.modalDetails.nationalIdSource = data.id;
  }
  resetcityType_Cus() {
    this.dataAddCustomer.citytype.id = 0;
    this.dataAddCustomer.citytype.nameAr = null;
    this.dataAddCustomer.citytype.nameEn = null;
  }
  savecityType_Cus() {
    if (
      this.dataAddCustomer.citytype.nameAr == null ||
      this.dataAddCustomer.citytype.nameEn == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    var ProCityObj: any = {};
    ProCityObj.CityId = this.dataAddCustomer.citytype.id;
    ProCityObj.NameAr = this.dataAddCustomer.citytype.nameAr;
    ProCityObj.NameEn = this.dataAddCustomer.citytype.nameEn;
    this._projectService.SaveCity(ProCityObj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.resetcityType_Cus();
        this.FillCitySelect_Cus();
      } else {
        this.toast.error(result.reasonPhrase, 'رسالة');
      }
    });
  }
  confirmcitytypeDelete_Cus() {
    this._projectService
      .DeleteCity(this.CityTypeRowSelected_Cus.id)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.FillCitySelect_Cus();
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
  }
  //----------------------------------(End)-City Type---------------------------------------------

  addNewIssuer(nameAr: any, nameEn: any) {
    this._cityVM = new CityVM();
    this._cityVM.cityId = 0;
    this._cityVM.nameAr = nameAr;
    this._cityVM.nameEn = nameEn;
    this.service.saveCity(this._cityVM).subscribe((result) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.FillCitySelect_Cus();
      } else {
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
      }
    });
  }

  ////////////////////////////////////////

  resetUploadModal() {
    this.control.clear();
    this.emailModalDetils = {
      mailSubject: null,
      mailText: null,
      files: null,
      assignedCustomersIds: null,
    };
  }

  resetUploadEmailModal() {
    this.control.clear();
    this.uploadModalDetils = {
      mailSubject: null,
      mailText: null,
      files: null,
      assignedCustomersIds: [],
    };
  }

  CustomerId: number;

  deleteFileType() {
    this.service
      .deleteFileType(this.FileTypeRowSelected.fileTypeId)
      .subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.fillFileTypeSelect();
          this.getAllFileTypesSearch();
          this.resetFileType();
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
  }

  FileTypeRowSelected: any;
  getFileTypeRow(row: any) {
    this.FileTypeRowSelected = row;
    console.log(this.FileTypeRowSelected);
  }
  setFileTypeInSelect(data: any, model: any) {
    var Value = this.load_FileType.filter(
      (a: { id: any }) => a.id == data.fileTypeId
    )[0];
    this.filedata.filetype = Value;
    // this.filedata.filetype.id=data.fileTypeId;
  }
  resetFileType() {
    this.data.fileType.id = 0;
    this.data.fileType.nameAr = null;
    this.data.fileType.nameEn = null;
  }
  //dawoud
  addNewFileType() {
    var FileTypesObj: any = {};
    FileTypesObj.FileTypeId = this.data.fileType.id;
    FileTypesObj.NameAr = this.data.fileType.nameAr;
    FileTypesObj.NameEn = this.data.fileType.nameEn;
    this.service.saveFilesType(FileTypesObj).subscribe((result) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.resetFileType();
        this.fillFileTypeSelect();
        this.getAllFileTypesSearch();
      } else {
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
      }
    });
  }

  addFilePost(modal: any) {
    if (this.data.documents.length > 0) {
      this.SaveCustomerFiles();
      this.toast.success('تم الحفظ', 'رسالة');
      modal?.dismiss();
      this.data.documents = [];
      //this.getFiles();
    }
    // this.service.saveCustomerFiles(this._CustomerFilesVM).subscribe(result => {
    // // if(result.statusCode==200){
    // //   this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
    // //   modal?.hide();
    // //   this.getFiles();
    // // }

    // if(result?.body?.statusCode==200){
    //   this.toast.success(result?.body?.reasonPhrase,'رسالة');
    //   this.getFiles();
    //   this.control.removeFile(this.control?.value[0]);
    // }
    // else if(result?.type>=0)
    // {}
    // else{this.toast.error(result?.body?.reasonPhrase, 'رسالة');}
    // });
  }

  filedata: any = {
    desc: null,
    filetype: null,
  };
  resetdatafile() {
    this.filedata.desc = null;
    this.filedata.filetype = null;
  }
  addNewFile(addFileForm: NgForm) {
    if (this.filedata.desc == null || this.filedata.filetype == null) {
      this.toast.error('من فضلك  أكمل البيانات ', 'رسالة');
      return;
    }
    if (this.control?.value.length > 0) {
      var formData = new FormData();
      formData.append('postedFiles', this.control?.value[0]);
      formData.append('FileId', (0).toString());
      formData.append('Description', this.filedata.desc);
      formData.append('TypeId', this.filedata.filetype.id.toString());
      formData.append('UploadDate', Date.now().toString());
      //formData.append('CustomerId', this.modalDetails.customerId.toString());
      formData.append('CustomerId', this.CustomerIdPublic.toString());
      this.service.uploadCustomerFiles(formData).subscribe((res) => {
        this._CustomerFilesVM = new CustomerFilesVM();
        this._CustomerFilesVM.description = this.filedata.desc;
        this._CustomerFilesVM.typeId = this.filedata.filetype.id;
        this._CustomerFilesVM.fileTypeName = this.filedata.filetype.name;
        this._CustomerFilesVM.fileName = this.control?.value[0]?.name;
        this._CustomerFilesVM.uploadDate = Date.now().toString();
        this.data.documents.push(this._CustomerFilesVM);
        this.control.clear();
        addFileForm.resetForm();
        this.resetdatafile();
      });
    } else {
      this.toast.error('من فضلك أختر ملف أولا ', 'رسالة');
      return;
    }
  }
  SaveCustomerFiles() {
    var formData = new FormData();
    formData.append('CustomerId', this.CustomerIdPublic.toString());
    this.service.SaveCustomerFiles(formData).subscribe((res) => {});
  }

  selectedFiles?: FileList;
  currentFile?: File;
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  sendEMAIL(modal: any) {
    // this.assignedCustomersIds=[];
    //  var _CustomerEmail = new CustomerMail();
    // _CustomerEmail.mailText = this.emailModalDetils.mailText;
    // _CustomerEmail.mailSubject = this.emailModalDetils.mailSubject;
    // //_CustomerEmail.customerId = this.modalDetails.customerId;
    // _CustomerEmail.customerId = this.CustomerIdPublic;

    // this.assignedCustomersIds.push(this.CustomerIdPublic);
    // this._CustomerSMS.assignedCustomersIds = this.assignedCustomersIds;

    //_CustomerEmail.assignedCustomersIds = this.modalDetails.customerId;
    //_CustomerEmail.assignedCustomersIds = this.CustomerIdPublic;

    this.modalDetails.addUser = 1;

    const formData = new FormData();
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;
        formData.append('fileUrl', this.currentFile);
      } else {
        this.currentFile = undefined;
      }
    }
    // formData.append('fileUrl', this.control?.value[0]);
    formData.append('CustomerId', this.CustomerIdPublic.toString());
    formData.append('assignedCustomersIds', this.CustomerIdPublic.toString());
    formData.append('mailSubject', this.emailModalDetils.mailSubject);
    formData.append('mailText', this.emailModalDetils.mailText);

    this.service.SaveCustomerMail(formData).subscribe((result) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.control.clear();
        modal?.dismiss();
        this.resetEmailModal();
      } else {
        this.toast.error(result.reasonPhrase, 'رسالة');
      }
    });
  }

  getDate(str: any) {
    let millsec = str.match(/\d+/g).join();
    let date = new Date(+millsec);
    return date;
  }

  log(asd: any) {
    // console.log(asd);
  }

  // upload img ]
  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );
  public readonly control = new FileUploadControl(
    {
      listVisible: true,
      // accept: ['image/*'],
      discardInvalid: true,
      multiple: false,
    },
    [
      //FileUploadValidators.accept(['image/*']),
      FileUploadValidators.filesLimit(1),
    ]
  );
  private subscription?: Subscription;

  private getImage(file: File): void {
    if (FileReader && file) {
      const fr = new FileReader();
      fr.onload = (e: any) => this.uploadedFile.next(e.target.result);
      fr.readAsDataURL(file);
    } else {
      this.uploadedFile.next('');
    }
  }

  saveOption(data: any) {}

  changeRequestStatus(event: any) {
    this.modalDetailsProject.ProjectFlag = event.target.checked;
    if (this.modalDetailsProject.ProjectSettingNo == null) {
      this.modalDetailsProject.ProjectFlag = false;
    }
  }

  updateFilter(event: any) {}

  // Save row
  save(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    // console.log('Row saved: ' + rowIndex);
    // console.log(row);
  }

  // Delete row
  delete(row: any, rowIndex: any) {
    // this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    // this.rows.splice(rowIndex, 1);
    // // console.log('Row deleted: ' + rowIndex);
  }

  applyUserPermissionsFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userPermissionsDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyGoalsFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectGoalsDataSource.filter = filterValue.trim().toLowerCase();
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  projectDetails: any = 1;

  //---------------------------------------Invoice---------------------------------------------
  //#region

  //Date-Hijri
  ChangeInvoiceGre(event: any) {
    if (event != null) {
      const DateHijri = toHijri(this.modalInvoice.Date);
      var DateGre = new HijriDate(
        DateHijri._year,
        DateHijri._month,
        DateHijri._date
      );
      DateGre._day = DateGre._date;
      this.modalInvoice.HijriDate = DateGre;
    } else {
      this.modalInvoice.HijriDate = null;
    }
  }
  ChangeInvoiceDateHijri(event: any) {
    if (event != null) {
      const DateGre = new HijriDate(event.year, event.month, event.day);
      const dayGreg = DateGre.toGregorian();
      this.modalInvoice.Date = dayGreg;
    } else {
      this.modalInvoice.Date = null;
    }
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
    TempBox: null,
  };
  InvoiceDetailsRows: any = [];
  Paytype: any;
  resetInvoiceData() {
    this.uploadedFiles = [];

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

    const DateHijri = toHijri(new Date());
    var DateGre = new HijriDate(
      DateHijri._year,
      DateHijri._month,
      DateHijri._date
    );
    DateGre._day = DateGre._date;

    this.modalInvoice = {
      InvoiceId: 0,
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
      TempBox: null,
    };
  }

  InvoicePopup(typepage: any) {
    if (typepage == 2) {
      this.FillCostCenterSelect();
      //this.FillAllCustomerSelectNotHaveProjWithBranch();
      this.FillAllCustomerSelectWithBranch();
      //this.GetBranch_Costcenter();
    } else if (typepage == 1) {
      this.FillCostCenterSelect_Invoices(null);
      this.FillCustomerSelectWProOnlyWithBranch();
    }
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
      this._invoiceService.GetBranch_Costcenter().subscribe((data) => {
        this.modalInvoice.CostCenterId = data.result.costCenterId;
        this.modalInvoice.OrganizationsAddress = data.result.nameAr;
      });
    });
  }
  FillCostCenterSelect_Invoices(projectid: any) {
    this._invoiceService.GetBranch_Costcenter().subscribe((data) => {
      this.modalInvoice.OrganizationsAddress = data.result.nameAr;
    });

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
          console.log(data);
          this.load_CostCenter = data;
          this.GetCostCenterByProId_Proj(this.modalInvoice.ProjectId);
        });
    } else {
      this.load_CostCenter = [];
      this.modalInvoice.CostCenterId = null;
    }
  }
  // GetBranch_Costcenter(){
  //   this._invoiceService.GetBranch_Costcenter().subscribe(data=>{
  //     this.modalInvoice.CostCenterId=data.result.costCenterId;
  //   });
  // }
  GetBranchOrganization() {
    this._invoiceService.GetBranchOrganization().subscribe((data) => {
      this.modalInvoice.OrganizationsMobile = data.result.mobile;
    });
  }
  GenerateVoucherNumber() {
    this._invoiceService
      .GenerateVoucherNumber(this.modalInvoice.Type)
      .subscribe((data) => {
        console.log(data);
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
          console.log(data);
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
          console.log(data);
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
          console.log(data);
          this.load_Projects = data;
        });
    } else {
      this.load_Projects = [];
    }
  }
  GetAllProjByCustomerId(customerid: any) {
    this.load_Projects = [];
    this.load_CostCenter = [];
    this.modalInvoice.CostCenterId = null;
    this.modalInvoice.ProjectId = null;
    if (customerid) {
      this._invoiceService
        .GetAllProjByCustomerId(customerid)
        .subscribe((data) => {
          console.log(data);
          this.load_Projects = data;
          if (this.load_Projects.length == 1) {
            this.modalInvoice.ProjectId = this.load_Projects[0].id;
            this.ProjectIdChange();
            //this.GetCostCenterByProId_Proj(this.modalInvoice.ProjectId);
          }
        });
    } else {
      this.load_Projects = [];
    }
  }
  GetCostCenterByProId_Proj(projectid: any) {
    if (projectid) {
      this._invoiceService.GetCostCenterByProId(projectid).subscribe((data) => {
        console.log('GetCostCenterByProId_Proj');
        console.log(data);

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
          console.log(data);
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
    if (this.modalInvoice.popuptype != 2) {
      this.GetAllProjByCustomerId(this.modalInvoice.customerId);
    }
    // this.GetAllProjByCustomerId(this.modalInvoice.customerId);
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
    this.modalInvoice.remainder = remainder;
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
  servicesListdisplayedColumns: string[] = ['name', 'price'];
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
        console.log('GetServwithOffer');
        console.log(data.result);
        this.serviceListDataSource = new MatTableDataSource(data.result);
        this.serviceListDataSource.paginator = this.paginatorServices;
        this.servicesList = data.result;
        this.serviceListDataSourceTemp = data.result;
      });
  }

  GetOfferPriceServiceForContract(OfferId: any) {
    this._invoiceService.GetOfferservicenByid(OfferId).subscribe((data) => {
      console.log(data.result);
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
        console.log(data);
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
    console.log(this.InvoiceDetailsRows);
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
    console.log('this.InvoiceDetailsRows2');
    console.log(this.InvoiceDetailsRows);
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
    console.log('===================');
    console.log(item);
    console.log('this.InvoiceDetailsRows3');
    console.log(this.InvoiceDetailsRows);

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
          console.log(data);
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
          console.log(data);
          this.load_Accounts = data;
          if (PayType != 8) {
            if (this.load_Accounts?.length > 0) {
              this.modalInvoice.ToAccountId = this.load_Accounts[0]?.id;
              this.saveInvoice();
            } else {
              this.modalInvoice.ToAccountId = null;
              this.toast.error('تأكد من الحساب', 'رسالة');
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
      this.toast.error(val.msg, 'رسالة');
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
        this.modalInvoice.TempBox = this.modalInvoice.ToAccountId;
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
    if (!(parseInt(this.modalInvoice.TotalVoucherValueLbl) > 0)) {
      this.toast.error('من فضلك أدخل قيمة صحيحة للفاتورة', 'رسالة');
      return;
    }
    var VoucherDetailsList: any = [];
    var VoucherObj: any = {};
    VoucherObj.InvoiceId = this.modalInvoice.InvoiceId;
    VoucherObj.InvoiceNumber = this.modalInvoice.InvoiceNumber;
    VoucherObj.JournalNumber = this.modalInvoice.JournalNumber;
    // VoucherObj.InvoicePayType= this.modalInvoice.PayType;
    if (this.modalInvoice.Date != null) {
      VoucherObj.Date = this._sharedService.date_TO_String(
        this.modalInvoice.Date
      );
      const nowHijri = toHijri(this.modalInvoice.Date);
      VoucherObj.HijriDate = this._sharedService.hijri_TO_String(nowHijri);
    }
    VoucherObj.Notes = this.modalInvoice.Notes;
    VoucherObj.InvoiceNotes = this.modalInvoice.InvoiceNotes;
    VoucherObj.Type = this.modalInvoice.Type;
    VoucherObj.InvoiceValue = this.modalInvoice.VoucherValue;
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
      VoucherDetailsObj.AccountId = this.modalInvoice.TempBox;
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
            if (this.uploadedFiles.length > 0) {
              const formData = new FormData();
              formData.append('UploadedFile', this.uploadedFiles[0]);
              formData.append('InvoiceId', result.returnedParm);
              this._invoiceService
                .UploadPayVoucherImage(formData)
                .subscribe((result) => {
                  this.getData();
                });
            } else {
              this.getData();
            }
            this.resetInvoiceData();
            this.InvoiceModelPublic?.dismiss();
          } else {
            this.toast.error(result.reasonPhrase, 'رسالة');
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
            if (this.uploadedFiles.length > 0) {
              const formData = new FormData();
              formData.append('UploadedFile', this.uploadedFiles[0]);
              formData.append('InvoiceId', result.returnedParm);
              this._invoiceService
                .UploadPayVoucherImage(formData)
                .subscribe((result) => {
                  this.getData();
                });
            } else {
              this.getData();
            }
            this.resetInvoiceData();
            this.InvoiceModelPublic?.dismiss();
          } else {
            this.toast.error(result.reasonPhrase, 'رسالة');
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
            this.toast.error(result.reasonPhrase, 'رسالة');
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

  //-----------------------------------------OfferPrice-------------------------------------------
  //#region
  serviceListDataSource_Offer = new MatTableDataSource();
  servicesList_Offer: any;
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

  OfferNoType = 1; // generated

  OfferNoTxtChenged() {
    this.OfferNoType = 2; // manual
  }

  Getnextoffernum() {
    this.OfferNoType = 1;
    this._offerpriceService.Getnextoffernum().subscribe((data) => {
      console.log('Getnextoffernum');
      console.log(data.result);
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

    (this.existValue = true), (this.offerServices = []);
    this.offerTerms = [];
    this.offerPayments = [];
  }
  NickNameList = [
    { id: 'السادة', name: { ar: 'السادة', en: 'السادة' } },
    { id: 'السيد /ة', name: { ar: 'السيد /ة', en: 'السيد /ة' } },
    { id: 'دكتور /ة', name: { ar: 'دكتور /ة', en: 'دكتور /ة' } },
    { id: 'مهندس /ة', name: { ar: 'مهندس /ة', en: 'مهندس /ة' } },
  ];

  DescriptionList = [
    { id: 'المحترمين', name: { ar: 'المحترمين', en: 'المحترمين' } },
    { id: 'المحترم', name: { ar: 'المحترم', en: 'المحترم' } },
    { id: 'الموقر', name: { ar: 'الموقر', en: 'الموقر' } },
    { id: 'يحفظه الله', name: { ar: 'يحفظه الله', en: 'يحفظه الله' } },
    { id: 'يحفظهم الله', name: { ar: 'يحفظهم الله', en: 'يحفظهم الله' } },
  ];

  load_CustomerM: any;
  GetAllCustomerForDrop() {
    this._offerpriceService.GetAllCustomerForDrop().subscribe((data) => {
      console.log(data);
      this.load_CustomerM = data.result;
    });
  }
  load_EngM: any;
  FillAllUsersTodropdown() {
    this._offerpriceService.FillAllUsersTodropdown().subscribe((data) => {
      console.log(data);
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
      console.log(data);
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
          console.log(data);
          this.modalDetailsOffer.department = data.result.departmentName;
        });
    }
  }

  AddOfferPrice(modal: any) {
    console.log(
      this.modalDetailsOffer,
      this.offerTerms,
      this.offerServices,
      this.offerPayments
    );
    //return;
    if (this.modalDetailsOffer.offer_no == null) {
      this.toast.error('لا يمكنك حفظ عرض سعر بدون رقم', 'رسالة');
      return;
    }
    if (this.OfferNoType == 2) {
      var ValueUser = this.modalDetailsOffer.offer_no;
      if (!isNaN(ValueUser)) {
        this.toast.error(
          'لا يمكن إدخال رقم عرض سعر بنفس الرقم التسلسلي ، فضلا أدخل رقما مختلفا',
          'رسالة'
        );
        return;
      }
    }

    if (
      this.modalDetailsOffer.customer == null &&
      this.modalDetailsOffer.user == null
    ) {
      this.toast.error('ادخل اسم العميل او اختر عميل ', 'رسالة');
      return;
    }
    if (this.modalDetailsOffer.date == null) {
      this.toast.error('أختر تاريخ', 'رسالة');
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

    var DetailsList: any = [];
    this.SureServiceList.forEach((element: any) => {
      var Detailsobj: any = {};
      //Conditionobj.OffersConditionsId = element.id;
      Detailsobj.ServicesIdVou = element.servicesIdVou ?? 0;
      Detailsobj.ServicesId = element.servicesId;
      Detailsobj.ParentId = element.parentId;
      Detailsobj.SureService = element.SureService ?? 0;
      DetailsList.push(Detailsobj);
    });

    offerpriceobj.ServicesPriceOffer = DetailsList;
    offerpriceobj.OfferService = VoucherDetailsList;
    offerpriceobj.OffersConditions = conditionList;
    offerpriceobj.CustomerPayments = dof3aatlist;

    console.log('--------------------offerpriceobj---------------');
    console.log(offerpriceobj);
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
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
  }

  GetOfferservicenByid(OfferId: any) {
    this._offerpriceService.GetOfferservicenByid(OfferId).subscribe((data) => {
      console.log(data.result);
      data.result.forEach((element: any) => {
        this.modalDetailsOffer.taxtype = element.taxType;
        this.GetServicesPriceByServiceId_Offer(element);
      });
    });
  }

  GetServicesPriceByServiceId_Offer(offerdata: any) {
    this._offerpriceService
      .GetServicesPriceByServiceId(offerdata.serviceId)
      .subscribe((data) => {
        console.log(data);
        var maxVal = 0;

        if (this.offerServices.length > 0) {
          maxVal = Math.max(
            ...this.offerServices.map((o: { idRow: any }) => o.idRow)
          );
        } else {
          maxVal = 0;
        }
        this.setServiceRowValueNew_Offer(
          maxVal + 1,
          data.result,
          offerdata.serviceQty,
          offerdata.serviceamountval
        );
      });
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
    console.log('this.modalDetailsOffer');
    console.log(this.modalDetailsOffer);

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
      showNotification: null,
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
    console.log('data');
    console.log(data);
  }

  EditOfferPrice() {
    console.log(this.modalDetailsOffer, this.offerTerms);
  }

  addTerm() {
    console.log(this.offerTerms);
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
    console.log(this.offerTerms);

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
    console.log(this.offerPayments);

    console.log(this.offerPayments);

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
    console.log(this.offerPayments);

    console.log(this.offerPayments);

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
    console.log(this.offerServices);

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

  deleteService(idRow: any) {
    let index = this.offerServices.findIndex(
      (d: { idRow: any }) => d.idRow == idRow
    );
    this.offerServices.splice(index, 1);
    this.CalculateTotal_Offer();
  }

  setServiceRowValue_Offer(element: any) {
    this.offerServices.filter(
      (a: { idRow: any }) => a.idRow == this.selectedServiceRow
    )[0].AccJournalid = element.servicesId;
    this.offerServices.filter(
      (a: { idRow: any }) => a.idRow == this.selectedServiceRow
    )[0].UnitConst = element.serviceTypeName;
    this.offerServices.filter(
      (a: { idRow: any }) => a.idRow == this.selectedServiceRow
    )[0].QtyConst = 1;
    this.offerServices.filter(
      (a: { idRow: any }) => a.idRow == this.selectedServiceRow
    )[0].accountJournaltxt = element.servicesName;
    this.offerServices.filter(
      (a: { idRow: any }) => a.idRow == this.selectedServiceRow
    )[0].Amounttxt = element.amount;

    this.SetAmountPackage(this.selectedServiceRow, element);
    this.CalculateTotal_Offer();
  }

  setServiceRowValueNew_Offer(
    indexRow: any,
    item: any,
    Qty: any,
    servamount: any
  ) {
    this.addService();
    this.offerServices.filter(
      (a: { idRow: any }) => a.idRow == indexRow
    )[0].AccJournalid = item.servicesId;
    this.offerServices.filter(
      (a: { idRow: any }) => a.idRow == indexRow
    )[0].UnitConst = item.serviceTypeName;
    this.offerServices.filter(
      (a: { idRow: any }) => a.idRow == indexRow
    )[0].QtyConst = Qty;
    this.offerServices.filter(
      (a: { idRow: any }) => a.idRow == indexRow
    )[0].accountJournaltxt = item.name;
    this.offerServices.filter(
      (a: { idRow: any }) => a.idRow == indexRow
    )[0].Amounttxt = servamount;
    this.CalculateTotal_Offer();
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
        if (AccTotalSpaces <= PackageRatio1_V) {
          AccAmount =
            +parseFloat(AccTotalSpaces).toFixed(2) *
            +parseFloat(MeterPrice1_V).toFixed(2) *
            +parseFloat(GeneralRatioValue).toFixed(2);
        } else if (AccTotalSpaces <= PackageRatio2_V) {
          AccAmount =
            +parseFloat(AccTotalSpaces).toFixed(2) *
            +parseFloat(MeterPrice2_V).toFixed(2) *
            +parseFloat(GeneralRatioValue).toFixed(2);
        } else if (AccTotalSpaces <= PackageRatio3_V) {
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

  Intoduceoffer(_offersPricesId: any) {
    let url = document.location.href;
    var newstr = url.replace('customers/search', 'accept-offer-price');
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
          this.toast.error(result.reasonPhrase, 'رسالة');
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
          this.toast.error(result.reasonPhrase, 'رسالة');
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
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
  }

  GetServicesPriceByParentId(element: any) {
    this.serviceDetails = [];
    if (element.AccJournalid != null) {
      if (this.OfferPopupAddorEdit == 0) {
        this._offerpriceService
          .GetServicesPriceByParentId(element.AccJournalid)
          .subscribe((data) => {
            this.serviceDetails = data.result;
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
      let newArray = this.SureServiceList.filter(
        (d: { parentId: any }) => d.parentId != ele.AccJournalid
      );
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
    this.modalDetailsProject.customer =
      this.PopupAfterSaveObj_Customer.CustomerId; //dawoudc
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
      this.toast.error('من فضلك أختر عميل أولا', 'رسالة');
      return;
    }
    if (this.modalDetailsProject.center == null) {
      this.modalDetailsProject.service = null;
      this.toast.error('من فضلك أختر مركز تكلفة أولا', 'رسالة');
      return;
    }
    if (this.modalDetailsProject.service != null) {
      this.open(this.newInvoiceModal, null, 'addInvoiceProject');
      var element = {
        serviceId: this.modalDetailsProject.service,
      };
      console.log('this.InvoiceDetailsRows0');
      console.log(this.InvoiceDetailsRows);
      this.GetServicesPriceByServiceIdForProject(element);
      console.log('this.InvoiceDetailsRows1');
      console.log(this.InvoiceDetailsRows);
    }
  }
  GetServicesPriceByServiceIdForProject(offerdata: any) {
    this._invoiceService
      .GetServicesPriceByServiceId(offerdata.serviceId)
      .subscribe((data) => {
        console.log(data);
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
          'رسالة'
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

  //       this.toast.error('لا يمكنك اختيار تاريخ النهاية أصغر من البداية', 'رسالة');return;
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
    this.modalDetailsProject.offerPriceNumber = null;
    this.offerpriceList = [];
    if (this.modalDetailsProject.customer != null) {
      this._projectService
        .FillAllOfferTodropdown(this.modalDetailsProject.customer)
        .subscribe((data) => {
          this.offerpriceList = data;
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
            this.ngbModalService.open(model);
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
      this.toast.error('تأكد من الملف', 'رسالة');
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
    console.log('event');
    console.log(event);
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
        this.toast.error('تم أختيار هذا المستخدم مسبقا', 'رسالة');
        return;
      }
    }
    if (this.selectedUserPermissions.userid == null) {
      this.toast.error('أختر مستخدم', 'رسالة');
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
  projectgoalList: any = [];
  projectreqandgoalpopupLabel: any;
  getallreqbyprojecttype() {
    this.projectgoalList = [];
    if (this.modalDetailsProject.projectType == null) {
      this.toast.error('أختر نوع المشروع أولا', 'رسالة');
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
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
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
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
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
          this.toast.error(result.reasonPhrase, 'رسالة');
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
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
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
          this.toast.error(result.reasonPhrase, 'رسالة');
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
          this.toast.error(result.reasonPhrase, 'رسالة');
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
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
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
          this.toast.error(result.reasonPhrase, 'رسالة');
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
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
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
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
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
        this.toast.error(result.reasonPhrase, 'رسالة');
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
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        }
      });
  }
  //----------------------------------(End)-City Type---------------------------------------------
  //#endregion
  //-------------------------------------------------------------------------------------------
  ManagerImg: any = null;
  GetImgManager() {
    if (this.modalDetailsProject.user != null) {
      this._projectService
        .GetUserById(this.modalDetailsProject.user)
        .subscribe((data) => {
          this.ManagerImg = environment.PhotoURL + data.result.imgUrl;
        });
    } else {
      this.ManagerImg = '/assets/images/login-img.png';
    }
  }
  disableButtonSave_Project = false;
  saveProject() {
    // this.GetCustomersByCustomerId(1);
    // this.PopupAfterSaveObj.ProjectId=1;
    // this.modalService.dismissAll();
    // this.modalService.open(this.noticModal, { size: 'xl' });
    // return;
    if (this.modalDetailsProject.projectNo == null) {
      this.toast.error('لا يمكنك حفظ مشروع بدون رقم', 'رسالة');
      return;
    }
    if (this.userPermissions.length == 0) {
      this.toast.error('من فضلك أختر صلاحيات المستخدم', 'رسالة');
      return;
    }
    if (this.modalDetailsProject.from >= this.modalDetailsProject.to) {
      this.toast.error('من فضلك أختر تاريخ صحيح', 'رسالة');
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
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
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
    if (this.modalDetailsProject.from != null) {
      ProjectObj.ProjectDate = this._sharedService.date_TO_String(
        this.modalDetailsProject.from
      );
      const nowHijri = toHijri(this.modalDetailsProject.from);
      ProjectObj.ProjectHijriDate =
        this._sharedService.hijri_TO_String(nowHijri);
    }
    if (this.modalDetailsProject.to != null) {
      ProjectObj.ProjectExpireDate = this._sharedService.date_TO_String(
        this.modalDetailsProject.to
      );
      const nowHijri2 = toHijri(this.modalDetailsProject.to);
      ProjectObj.ProjectExpireHijriDate =
        this._sharedService.hijri_TO_String(nowHijri2);
    }
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
                this.modalInvoice.InvoiceNumber == null ||
                this.modalInvoice.TotalVoucherValueLbl == 0 ||
                this.modalInvoice.TotalVoucherValueLbl == null
              )
            ) {
              this.modalInvoice.ProjectId = result.returnedStr;
              this.modalInvoice.WhichClick = 1;
              this.checkPayTypeAndSave();
            }
            this.ngbModalService.dismissAll();
          } else {
            console.log(result.returnedStr);
            this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
          }
        });
    } else {
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

          this.ngbModalService.dismissAll();
        } else {
          console.log(result.returnedStr);
          this.toast.error(result.reasonPhrase, 'رسالة');
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
            'رسالة'
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

  OrganizationData: any;
  getorgdata() {
    debugger;
    this.api.GetOrganizationDataLogin().subscribe({
      next: (res: any) => {
        this.OrganizationData = res.result;
      },
      error: (error) => {},
    });
  }

  dataSourceTempEmail: any = [];
  dataSourceTempSMS: any = [];
  load_CustomerSelect2Mails: any;

  selectedCustomer = {
    id: null,
    name: null,
    mail: '',
    phone: null,
  };
  getCustomers(event: any) {
    if (event != null) {
      this.selectedCustomer.id = event.id;
      this.selectedCustomer.mail = event.customerMail;
      this.selectedCustomer.name = event.name;
      this.selectedCustomer.phone = event.customerMobile;
    }

    this.data.mail = [];
    this.data.sms = [];
    this.data.files = [];
    this.data.currentProjects = [];
    this.data.archievedProjects = [];

    if (this.CustomerId) {
      this.getEmail();
      this.getSMS();
    }
  }

  getEmail() {
    this.service
      .getMailsByCustomerId(this.CustomerId)
      .subscribe((data: any) => {
        this.data.mail = new MatTableDataSource(data.result);
        this.dataSourceTempEmail = data.result;
        this.data.mail.paginator = this.mailPaginator;
        //  this.dataSource.sort = this.sort;
      });
  }

  getSMS2() {
    this.service.getSMSByCustomerId(this.CustomerId).subscribe((data: any) => {
      this.data.sms = new MatTableDataSource(data.result);
      this.dataSourceTempSMS = data.result;
      this.data.sms.paginator = this.smsPaginator;
      //  this.dataSource.sort = this.sort;
    });
  }

  fillCustomerSelect2Mails() {
    this.service.fillCustomerSelect2Mails().subscribe((data) => {
      console.log('load_CustomerSelect2Mails');
      console.log(data);
      this.load_CustomerSelect2Mails = data;
      // this.dataSource = new MatTableDataSource(data);
      //  this.dataSourceTemp = data;
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.load_CustomerSelect2Mails.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    debugger;
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.load_CustomerSelect2Mails);
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

  sendEMAIL2() {
    debugger;
    this.assignedCustomersIds = [];
    console.log('this.selection.selected');

    console.log(this.selection.selected);
    console.log('this.modalDetails.type');
    console.log(this.modalDetails.type);

    if (this.modalDetails.type == 'sendSmss') {
      if (
        this.modalDetails.mailText == null ||
        this.modalDetails.mailText == '' ||
        this.selection.selected.length == 0
      ) {
        this.toast.error('من فضلك أكمل البيانات', 'رسالة');
        return;
      }
      this._CustomerSMS = new CustomerSMS();
      this._CustomerSMS.sMSId = 0;
      this._CustomerSMS.customerId = this.selectedCustomer.id;
      this._CustomerSMS.sMSText = this.modalDetails.mailText;
      this._CustomerSMS.customerMobile = this.selectedCustomer.phone;
      this._CustomerSMS.AllCustomers = false;

      this.selection.selected.forEach((element: any) => {
        this.assignedCustomersIds.push(element.id);
      });
      this._CustomerSMS.assignedCustomersSMSIds = this.assignedCustomersIds;

      this.service.SaveCustomerSMS(this._CustomerSMS).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.control.clear();
          this.selection.clear();
          this.modal?.hide();
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        }
      });
    } else if (this.modalDetails.type == 'sendSms') {
      if (
        this.modalDetails.mailText == null ||
        this.modalDetails.mailText == ''
      ) {
        this.toast.error('من فضلك أكمل البيانات', 'رسالة');
        return;
      }

      this._CustomerSMS = new CustomerSMS();
      this._CustomerSMS.sMSId = 0;
      this._CustomerSMS.customerId = this.selectedCustomer.id;
      this._CustomerSMS.sMSText = this.modalDetails.mailText;
      this._CustomerSMS.customerMobile = this.selectedCustomer.phone;
      this._CustomerSMS.AllCustomers = false;
      this.assignedCustomersIds.push(this.selectedCustomer.id);

      this._CustomerSMS.assignedCustomersSMSIds = this.assignedCustomersIds;

      this.service.SaveCustomerSMS(this._CustomerSMS).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.control.clear();
          this.selection.clear();
          this.modal?.hide();
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
    } else if (this.modalDetails.type == 'sendEmails') {
      if (
        this.modalDetails.mailSubject == null ||
        this.modalDetails.mailSubject == '' ||
        this.modalDetails.mailText == null ||
        this.modalDetails.mailText == '' ||
        this.selection.selected.length == 0
      ) {
        this.toast.error('من فضلك أكمل البيانات', 'رسالة');
        return;
      }
      var _CustomerEmail = new CustomerMail();
      _CustomerEmail.fileUrl = this.modalDetails.fileUrl;
      _CustomerEmail.customerId = this.selectedCustomer.id;

      this.selection.selected.forEach((element: any) => {
        this.assignedCustomersIds.push(element.id);
      });

      _CustomerEmail.mailText = this.modalDetails.mailText;
      _CustomerEmail.mailSubject = this.modalDetails.mailSubject;
      this.modalDetails.addUser = 1;
      debugger;
      const formData = new FormData();
      if (this.selectedFiles) {
        const file: File | null = this.selectedFiles.item(0);

        if (file) {
          this.currentFile = file;
          formData.append('UploadedFile', this.currentFile);
        } else {
          this.currentFile = undefined;
        }
      }
      // formData.append('UploadedFile', this.control?.value[0]);
      formData.append('mailSubject', this.modalDetails.mailSubject);
      formData.append('mailText', this.modalDetails.mailText);

      for (let i = 0; i < this.assignedCustomersIds.length; i++) {
        formData.append(
          'assignedCustomersIds',
          String(this.assignedCustomersIds[i])
        );
      }
      this.service.SaveCustomerMail(formData).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.control.clear();
          this.selection.clear();
          this.modal?.hide();
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        }
      });
    } else if (this.modalDetails.type == 'sendEmail') {
      if (
        this.modalDetails.mailSubject == null ||
        this.modalDetails.mailSubject == '' ||
        this.modalDetails.mailText == null ||
        this.modalDetails.mailText == ''
      ) {
        this.toast.error('من فضلك أكمل البيانات', 'رسالة');
        return;
      }
      var _CustomerEmail = new CustomerMail();
      _CustomerEmail.fileUrl = this.modalDetails.fileUrl;
      _CustomerEmail.customerId = this.selectedCustomer.id;

      this.assignedCustomersIds = this.selectedCustomer.id;

      _CustomerEmail.mailText = this.modalDetails.mailText;
      _CustomerEmail.mailSubject = this.modalDetails.mailSubject;
      this.modalDetails.addUser = 1;
      debugger;
      const formData = new FormData();

      if (this.selectedFiles) {
        const file: File | null = this.selectedFiles.item(0);

        if (file) {
          this.currentFile = file;
          formData.append('UploadedFile', this.currentFile);
        } else {
          this.currentFile = undefined;
        }
      }
      //formData.append('UploadedFile', this.control?.value[0]);
      formData.append('mailSubject', this.modalDetails.mailSubject);
      formData.append('mailText', this.modalDetails.mailText);
      // formData.append('CustomerId', _CustomerEmail.customerId.toString());
      formData.append('assignedCustomersIds', this.assignedCustomersIds);

      this.service.SaveCustomerMail(formData).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.control.clear();
          this.selection.clear();
          this.modal?.hide();
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
    }
    this.control.clear();
  }
  SendWhatsAppTask(taskId:any,projectid:any) {
    const formData = new FormData();
    if(taskId!=null){formData.append('taskId', taskId);}
    if(projectid!=null){formData.append('projectid', projectid);}
    formData.append('environmentURL', environment.PhotoURL);
    this._phasestaskService.SendWhatsAppTask(formData).subscribe((result: any) => {

    });
  }
  //#endregion
}
