import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
// import { SelectionModel, SelectionModel } from '@ng-select/ng-select';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CustomerFileAdd } from 'src/app/core/Classes/DomainObjects/CustomerFilesAdd';
import { CustomerMail } from 'src/app/core/Classes/DomainObjects/customerMail';
import { CustomerSendSMS } from 'src/app/core/Classes/DomainObjects/CustomerSendSMS';
import { CustomerSMS } from 'src/app/core/Classes/DomainObjects/customerSMS';
import { CustomerFilesVM } from 'src/app/core/Classes/ViewModels/customerFilesVM';
import { CustomerService } from 'src/app/core/services/customer-services/customer.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit {
  @ViewChild('mailPaginator') mailPaginator!: MatPaginator;
  @ViewChild('mailSort') mailSort!: MatSort;
  @ViewChild('smsPaginator') smsPaginator!: MatPaginator;
  @ViewChild('smsSort') smsSort!: MatSort;
  @ViewChild('filesPaginator') filesPaginator!: MatPaginator;
  @ViewChild('filesSort') filesSort!: MatSort;
  @ViewChild('archievedProjectsPaginator')
  archievedProjectsPaginator!: MatPaginator;
  @ViewChild('archievedProjectsSort') archievedProjectsSort!: MatSort;
  @ViewChild('currentProjectsPaginator')
  currentProjectsPaginator!: MatPaginator;
  @ViewChild('currentProjectsSort') currentProjectsSort!: MatSort;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  load_CustomerName: any;
  load_FileType: any;
  dataSourceTempEmail: any = [];
  dataSourceTempSMS: any = [];
  dataSourceTempFiles: any = [];
  tempsourceCurrentProject: any = [];
  tempsourceArchievedProject: any = [];
  modalDetails: any;
  modal?: BsModalRef;
  dataSourceTemp: any = [];
  CustomerId: number;
  currntStatus: number = 0;
  archiveStatus: number = 1;
  load_CustomerSelect2Mails: any;
  load_OrganizeName: any;
  _CustomerMailVM = new CustomerMail();
  selectedcustomerarridsM = [];
  _CustomerFilesVM: CustomerFilesVM;

  title: any = {
    main: {
      name: {
        ar: 'العملاء',
        en: 'Customers',
      },
      link: '/customers/CustomerOperations',
    },
    sub: {
      ar: 'عمليات على العملاء',
      en: 'Customers Services',
    },
  };
  select: any = {
    selected: null,
    mobileSelect: [],
    mailSelect: [],
  };
  data: any = {
    fileType: {
      id: 0,
      nameAr: null,
      nameEn: null,
    },
    sms: new MatTableDataSource([{}]),
    files: new MatTableDataSource([{}]),
    documents: [],
    archievedProjects: new MatTableDataSource([{}]),
    currentProjects: new MatTableDataSource([{}]),
    mail: new MatTableDataSource([{}]),
    filesTypes: [],
  };
  displayedColumns: any = {
    email: ['date', 'sender', 'addressMessage', 'messageContain', 'operations'],
    sms: ['date', 'sender', 'messageContain', 'operations'],

    currentProjects: ['ProjectNumber', 'Projecttype', 'SubProjecttype', 'Site'],
    archievedProjects: [
      'date',
      'ProjectNumber',

      'Projecttype',
      'SubProjecttype',
      'Site',
    ],
    files: [
      'ModelName',
      'Description',
      'User',
      'UploadDate',
      'FileType',
      'operations',
    ],
    usersMail: ['select', 'name', 'email'],
    usersMobile: ['select', 'name', 'mobile'],
  };

  constructor(
    private modalService: BsModalService,
    private api: RestApiService,
    private service: CustomerService,
    private toast: ToastrService,
    private ngbModalService: NgbModal,
    private translate: TranslateService
  ) {
    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
  }

  ngOnInit(): void {
    this.getCustomers(null);
    // this.fill_CustomerName();
    this.fillCustomerSelect2Mails();
    this.getorgdata();
  }

  openModal(template: TemplateRef<any>, data?: any, modalType?: any) {
    // this.fillFileTypeSelect();
    // this.getAllFileTypesSearch();

    // openModal(template: any, data: any, modalType: any) {
    this.resetModal();
    this.getEmailOrganization();
    this.fillCustomerSelect2Mails();

    if (data) {
      this.modalDetails = data;
    }

    if (modalType) {
      this.modalDetails.type = modalType;
    }
    if ((modalType = 'sendSms')) {
      this.selection.clear();
    }

    this.modal = this.modalService.show(template, {
      class: ' modal-xl',
      backdrop: 'static',
      keyboard: false,
    });
  }

  closeResult: any;
  open(content: any, data?: any, type?: any, index?: any) {
    this.fillFileTypeSelect();
    this.getAllFileTypesSearch();
    this.ngbModalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
        centered: !type ? true : false,
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

  resetModal() {
    // this.control.clear();
    this.modalDetails = {
      type: null,
    };
  }

  ////////////////////////////////GET DATA GRIDS//////////////////////

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
      this.getFiles();
      this.getCurrentProjects();
      this.getArchiveProjects();
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

  getSMS() {
    this.service.getSMSByCustomerId(this.CustomerId).subscribe((data: any) => {
      this.data.sms = new MatTableDataSource(data.result);
      this.dataSourceTempSMS = data.result;
      this.data.sms.paginator = this.smsPaginator;
      //  this.dataSource.sort = this.sort;
    });
  }

  getFiles() {
    this.service.GetAllCustomerFiles(this.CustomerId).subscribe((data: any) => {
      console.log('getFiles');
      console.log(data.result);
      this.data.files = new MatTableDataSource(data.result);
      this.dataSourceTempFiles = data.result;
      this.data.files.paginator = this.filesPaginator;
      //  this.dataSource.sort = this.sort;
    });
  }

  getCurrentProjects() {
    if (this.CustomerId) {
      this.service
        .getCurrentProjectsByCustomer(this.CustomerId, this.currntStatus)
        .subscribe((data: any) => {
          this.data.currentProjects = new MatTableDataSource(data.result);
          this.tempsourceCurrentProject = data.result;
          this.data.currentProjects.paginator = this.currentProjectsPaginator;
          //  this.dataSource.sort = this.sort;
        });
    }
  }

  getArchiveProjects() {
    if (this.CustomerId) {
      this.service
        .getCurrentProjectsByCustomer(this.CustomerId, this.archiveStatus)
        .subscribe((data: any) => {
          this.data.archievedProjects = new MatTableDataSource(data.result);
          this.tempsourceArchievedProject = data.result;
          this.data.archievedProjects.paginator =
            this.archievedProjectsPaginator;
          //  this.dataSource.sort = this.sort;
        });
    }
  }

  //////////////////////////FILTER//////////////

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    var tempsourceEmail = this.dataSourceTempEmail;
    var tempsourceSMS = this.dataSourceTempSMS;
    var tempsourceFiles = this.dataSourceTempFiles;
    var tempsourceCurrentProject = this.tempsourceCurrentProject;
    var tempsourceArchievedProject = this.tempsourceArchievedProject;

    if (this.data.mail && val) {
      tempsourceEmail = this.dataSourceTempEmail.filter((d: any) => {
        return (
          (d.date && d.date?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.senderUserName &&
            d.senderUserName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.mailSubject &&
            d.mailSubject?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.mailText && d.mailText?.trim().toLowerCase().indexOf(val) !== -1)
        );
        //  ||(d.senderUserName && d.senderUserName?.trim().toLowerCase().indexOf(val) !== -1 )
      });

      tempsourceSMS = this.dataSourceTempSMS.filter((d: any) => {
        return (
          (d.date && d.date?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.senderUserName &&
            d.sender?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.mailSubject && d.content?.trim().toLowerCase().indexOf(val) !== -1)
        );
        //  ||(d.senderUserName && d.senderUserName?.trim().toLowerCase().indexOf(val) !== -1 )
      });

      tempsourceFiles = this.dataSourceTempFiles.filter((d: any) => {
        return (
          (d.date && d.date?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.fileName &&
            d.fileName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.description &&
            d.description?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.userName &&
            d.userName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.uploadDate &&
            d.uploadDate?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.fileTypeName &&
            d.fileTypeName?.trim().toLowerCase().indexOf(val) !== -1)
        );
      });

      tempsourceCurrentProject = this.tempsourceCurrentProject.filter(
        (d: any) => {
          return (
            (d.date && d.date?.trim().toLowerCase().indexOf(val) !== -1) ||
            (d.projectNo &&
              d.projectNo?.trim().toLowerCase().indexOf(val) !== -1) ||
            (d.ProjectTypesName &&
              d.ProjectTypesName?.trim().toLowerCase().indexOf(val) !== -1) ||
            (d.projectSubTypeName &&
              d.projectSubTypeName?.trim().toLowerCase().indexOf(val) !== -1)
          );
        }
      );

      tempsourceArchievedProject = this.tempsourceArchievedProject.filter(
        (d: any) => {
          return (
            (d.date && d.date?.trim().toLowerCase().indexOf(val) !== -1) ||
            (d.projectNo &&
              d.projectNo?.trim().toLowerCase().indexOf(val) !== -1) ||
            (d.projectTypesName &&
              d.ProjectTypesName?.trim().toLowerCase().indexOf(val) !== -1) ||
            (d.projectSubTypeName &&
              d.projectSubTypeName?.trim().toLowerCase().indexOf(val) !== -1) ||
            (d.generalLocation &&
              d.generalLocation?.trim().toLowerCase().indexOf(val) !== -1)
          );
        }
      );
    }

    this.data.mail = new MatTableDataSource(tempsourceEmail);
    this.data.sms = new MatTableDataSource(tempsourceSMS);
    this.data.files = new MatTableDataSource(tempsourceFiles);
    this.data.currentProjects = new MatTableDataSource(
      tempsourceCurrentProject
    );
    this.data.archievedProjects = new MatTableDataSource(
      tempsourceArchievedProject
    );

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /***************************DELETE */ ////////////////////////

  deleteEmails() {
    this.service
      .deleteCustomerMail(this.modalDetails.mailId)
      .subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.getEmail();
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        }
      });
    this.resetModal();
    this.modal?.hide();
  }

  deleteFiles() {
    this.service
      .deleteCustomerFile(this.modalDetails.fileId)
      .subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.getFiles();
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        }
      });
    this.resetModal();
    this.modal?.hide();
  }

  deleteFilesModal() {
    this.service
      .deleteCustomerFile(this.data.documents.fileId)
      .subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.resetModal();
          this.modal?.hide();
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        }
      });
  }

  deleteCustomerSMS(): void {
    this.service
      .deleteCustomerSMS(this.modalDetails.SMSId)
      .subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.modal?.hide();
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        }
      });
  }

  /**********************Fill Data */ ///////////////////////////////

  fillCustomerSelect2Mails() {
    this.service.fillCustomerSelect2Mails().subscribe((data) => {
      console.log('load_CustomerSelect2Mails');
      console.log(data);
      this.load_CustomerSelect2Mails = data;
      // this.dataSource = new MatTableDataSource(data);
      //  this.dataSourceTemp = data;
    });
  }

  fill_CustomerName() {
    this.service.FillCustomerNameSelect().subscribe((data) => {
      this.load_CustomerName = data;
    });
  }

  getEmailOrgnize: any;

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

  /**********************SEND Messages***************** */

  getCustomersAccount(data: any) {}

  ////////////////////////////////FILE POST//////////////////

  load_filesTypes: any;
  getAllFileTypesSearch() {
    this.service.getAllFileTypesSearch().subscribe((data: any) => {
      this.load_filesTypes = data.result;
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
    //   debugger
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
    debugger;
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
      formData.append('CustomerId', this.CustomerId.toString());
      this.service.uploadCustomerFiles(formData).subscribe((res) => {
        var resultData = res;
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
        //this.getFiles();
      });
    } else {
      this.toast.error('من فضلك أختر ملف أولا ', 'رسالة');
      return;
    }
  }

  SaveCustomerFiles() {
    var formData = new FormData();
    formData.append('CustomerId', this.CustomerId.toString());
    this.service.SaveCustomerFiles(formData).subscribe((res) => {
      this.getFiles();
    });
  }

  removeFile() {}

  // _CustomerFileAdd: CustomerFileAdd = { fileId: 0, nameAr: '', nameEn: '' }

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
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        }
      });
  }

  FileTypeRowSelected: any;
  getFileTypeRow(row: any) {
    this.FileTypeRowSelected = row;
    console.log(this.FileTypeRowSelected);
  }
  setFileTypeInSelect(data: any, model: any) {
    debugger;
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
    debugger;
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
  openNewWindow(data: any) {
    try {
      debugger;
      var link = environment.PhotoURL + data.fileUrl;
      window.open(link, '_blank');
    } catch (error) {
      this.toast.error('تأكد من الملف', 'رسالة');
    }
  }

  CheckvalidCheck(row: any) {
    if (
      (row?.customerMail && this.modalDetails?.type == 'sendEmails') ||
      (row?.customerMobile && this.modalDetails?.type == 'sendSmss')
    ) {
      return true;
    } else {
      return false;
    }
  }

  selection = new SelectionModel<any>(true, []);

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
      // FileUploadValidators.accept(['image/*']),
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
  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  assignedCustomersIds: any = [];
  _CustomerSMS: any = null;

  load_CustomerMobile: any;

  fill_CustomerMobile() {
    this.service.FillCustomerMobileSelect().subscribe((data: any) => {
      this.load_CustomerMobile = data;
    });
  }

  selectedFiles?: FileList;
  currentFile?: File;
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }
  sendEMAIL() {
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
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
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
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        }
      });
    }
    this.control.clear();
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
}
