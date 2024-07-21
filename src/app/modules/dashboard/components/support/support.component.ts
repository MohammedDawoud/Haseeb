import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AdminProfileService } from 'src/app/core/services/admin_profile_Services/admin-profile.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SysServicesService } from 'src/app/core/services/sys_Services/sys-services.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
})
export class SupportComponent implements OnInit {
  title: any = {
    main: {
      name: {
        ar: 'لوحة التحكم',
        en: 'Control Panel',
      },
      link: '/dash/support',
    },
    sub: {
      ar: ' فتح تذكرة دعم فني جديدة',
      en: ' Open a new technical support ticket',
    },
  };
  requests: any;
  columns: any = [
    // {
    //   ar: 'العنوان',
    //   en: 'Address',
    // },
    // {
    //   ar: 'النوع',
    //   en: 'type',
    // },

    {
      ar: 'حالة التذكرة',
      en: 'Ticket Status',
    },
    {
      ar: 'درجة الاهمية',
      en: 'Priority',
    },
    {
      ar: 'موضوع الطلب',
      en: 'Topic',
    },
    {
      ar: 'التاريخ',
      en: 'Date',
    },
    {
      ar: 'الملف',
      en: 'File',
    },
  ];

  columnsopen: any = [
    {
      ar: 'رقم التذكرة',
      en: 'Ticket Number',
    },
    {
      ar: ' وصف الطلب ',
      en: 'Ticket Description',
    },
    {
      ar: ' حالة الرد',
      en: 'Ticket Update Date',
    },
    {
      ar: 'رد الدعم الفني',
      en: 'Support Replay',
    },
  ];
  typeList = [
    { id: 1, name: 'الإبلاغ عن خطأ' },
    { id: 2, name: 'اقتراح' },
    { id: 3, name: 'طلب الدعم الفني' },
  ];
  departmentList = [
    { id: 'قسم العملاء', name: 'قسم العملاء' },
    { id: 'قسم ادارة المشاريع', name: 'قسم ادارة المشاريع' },
    { id: 'قسم شؤوون الموظفين', name: 'قسم شؤوون الموظفين' },
    { id: 'قسم الحسابات', name: 'قسم الحسابات' },
    { id: 'قسم لوحة التحكم', name: 'قسم لوحة التحكم' },
  ];
  priorityList = [
    { id: 'منخفضة', name: 'منخفضة' },
    { id: 'متوسطة', name: 'متوسطة' },
    { id: 'عاجلة', name: 'عاجلة' },
  ];
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
  imageFileOutput: any = null;

  private getImage(file: File): void {
    if (FileReader && file) {
      const fr = new FileReader();
      fr.onload = (e: any) => this.uploadedFile.next(e.target.result);
      fr.readAsDataURL(file);
      this.imageFileOutput = file;
    } else {
      this.imageFileOutput = null;
      this.uploadedFile.next('');
    }
  }
  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  public uploadedFiles: Array<File> = [];

  //file
  //--------------------------
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';

  fileInfos?: Observable<any>;
  //----------------------------
  lang: any = 'ar';
  userG: any = {};
  logoUrl: any = null;
  constructor(
    private api: RestApiService,
    private formBuilder: FormBuilder,
    private adminProfileService: AdminProfileService,
    private _sysServicesService: SysServicesService,
    private _sharedService: SharedService,
    private translate: TranslateService,
    private toast: ToastrService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal
  ) {
    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
    api.lang.subscribe((res) => {
      this.lang = res;
    });
    this.userG = this.authenticationService.userGlobalObj;
  }
  ngOnInit(): void {
    this.intialForm();
    this.getData();
    this.getallopensupport();
    this.GetCurrentUser();

    this.userG = this.authenticationService.userGlobalObj;
    this.adminProfileService
      .getUserById(this.userG.userId)
      .subscribe((data) => {
        this.logoUrl = data.result.imgUrl;
      });
  }
  tempticket: any;
  open(content: any, data: any, size: any, positions?: any, title?: any) {
    if (title == 'comment') {
      this.TempRequestId = data.requestId;
      this.sendNotetxt_NM = '';
    }
    if ((title = 'CloseTicketModal')) {
      this.tempticket = data;
    }
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: size,
        centered: !positions ? true : false,
      })
      .result.then(
        (result) => {
          // this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  dataForm: FormGroup;
  allSupport: any;
  allOpenSupport: any;
  TameerApiUrl: any;
  getData() {
    // this.api.get('../../../../../../assets/dropMenu.json').subscribe({
    //   next: (data: any) => {
    //     // assign requests to table
    //     this.requests = data.requests;
    //   },
    //   error: (error) => {
    //     console.log(error);
    //   },
    // });
    this._sysServicesService.GetCurrentUser().subscribe((data) => {
      if (this.lang == 'ar') {
        this.dataForm.controls['fullName'].setValue(data.result.fullNameAr);
      } else {
        this.dataForm.controls['fullName'].setValue(data.result.fullNameEn);
      }

      this.dataForm.controls['username'].setValue(data.result.userName);
      this.dataForm.controls['userEmail'].setValue(data.result.email);
      this.dataForm.controls['userMobile'].setValue(data.result.mobile);
    });

    this._sysServicesService.GetBranchOrganization().subscribe((response) => {
      this.dataForm.controls['organizationId'].setValue(
        response.result.organizationId
      );
      if (this.lang == 'ar') {
        this.dataForm.controls['organizationsName'].setValue(
          response.result.nameAr
        );
      } else {
        this.dataForm.controls['organizationsName'].setValue(
          response.result.nameEn
        );
      }
      this.TameerApiUrl = response.result.tameerAPIURL;
    });
    this.dataForm.controls['fullName'].disable();
    this.dataForm.controls['username'].disable();
    this.dataForm.controls['userEmail'].disable();
    this.dataForm.controls['userMobile'].disable();
    this.dataForm.controls['versionNo'].disable();
    this.dataForm.controls['organizationsName'].disable();

    this._sysServicesService.GetAllSupportResquests().subscribe((response) => {
      this.allSupport = response;
    });
  }
  intialForm() {
    this.dataForm = this.formBuilder.group({
      organizationId: [null, []],
      organizationsName: [null, []],
      fullName: [null, []],
      username: [null, []],
      userEmail: [null, []],
      userMobile: [null, []],
      versionNo: [null, []],

      // type: [null, [Validators.required]],
      department: [null, [Validators.required]],
      address: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      topic: [null, [Validators.required]],

      requestId: [0, []],
      date: [new Date(), []],

      addUser: [null, []],
      updateUser: [null, []],
      deleteUser: [null, []],
      addDate: [null, []],
      updateDate: [null, []],
      deleteDate: [null, []],
      isDeleted: [null, []],
      userId: [null, []],
      attachmentUrl: [null, []],
      branchId: [null, []],
    });
  }
  returnTypeName(id: any) {
    var name: any = null;
    this.typeList.forEach((element) => {
      if (id == element.id) {
        name = element.name;
      }
    });
    return name;
  }
  saveMainInfo() {
    if (
      // this.dataForm.controls['type'].value != null ||
      this.dataForm.controls['topic'].value != null ||
      this.dataForm.controls['address'].value != null ||
      this.dataForm.controls['priority'].value != null ||
      this.dataForm.controls['department'].value != null
    ) {
      if (
        this.dataForm.controls['date'].value != null &&
        typeof this.dataForm.controls['date'].value != 'string'
      ) {
        var date = this._sharedService.date_TO_String(
          this.dataForm.controls['date'].value
        );
        this.dataForm.controls['date'].setValue(date);
      }
      const formData = new FormData();
      formData.append('postedFiles', this.imageFileOutput);
      formData.append(
        'organizationId',
        this.dataForm.controls['organizationId'].value ?? '0'
      );
      // formData.append('type', this.dataForm.controls['type'].value);
      formData.append('requestId', this.dataForm.controls['requestId'].value);
      formData.append('date', this.dataForm.controls['date'].value);
      formData.append('topic', this.dataForm.controls['topic'].value);
      formData.append('address', this.dataForm.controls['address'].value);
      formData.append('priority', this.dataForm.controls['priority'].value);
      formData.append('department', this.dataForm.controls['department'].value);
      this._sysServicesService.SaveSupportResquests(formData).subscribe({
        next: (result: any) => {
          debugger;
          if (result.statusCode == 200) {
            this.imageFileOutput = null;
            this.intialForm();
            this.getallopensupport();

            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        },
        error: (error) => {
          console.log(error);
          this.toast.error(
            this.translate.instant(error),
            this.translate.instant('Message')
          );
        },
      });
    }
  }
  //file
  //-----------------------------------------------------

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }
  downloadFile(data: any) {
    try {
      var link = environment.PhotoURL + '/SupportResquests/' + data.dateF;
      window.open(link, '_blank');
    } catch (error) {
      this.toast.error('تأكد من الملف', 'رسالة');
    }
  }
  downloadreplayFile(data: any) {
    try {
      var link = environment.PhotoURL + data;
      window.open(link, '_blank');
    } catch (error) {
      this.toast.error('تأكد من الملف', 'رسالة');
    }
  }
  downloadlabaikFile(data: any) {
    try {
      var link = environment.labaikphoto + data;
      window.open(link, '_blank');
    } catch (error) {
      this.toast.error('تأكد من الملف', 'رسالة');
    }
  }
  getallopensupport() {
    this._sysServicesService
      .GetAllOpenSupportResquests()
      .subscribe((response) => {
        this.allOpenSupport = response;
      });
  }
  ALLReplay: any;
  GetAllReplyByServiceId(Requestd: any) {
    this._sysServicesService
      .GetAllReplyByServiceId(Requestd)
      .subscribe((response) => {
        this.ALLReplay = response;
        console.log('ALLReplay', response);
      });
  }
  sendNotetxt_NM: any;
  TempRequestId: any;

  SendNotes() {
    const formData = new FormData();
    formData.append('file', this.uploadedFiles[0]);
    formData.append('RequestId', this.TempRequestId);
    formData.append('Replay', this.sendNotetxt_NM);
    this._sysServicesService
      .SaveRequestReplayFromTameer(formData)
      .subscribe((response) => {
        this.GetAllReplyByServiceId(this.TempRequestId);
        this.SendNotesToLabaik(response.returnedStr);
        this.sendNotetxt_NM = '';
      });
  }

  SendNotesToLabaik(attachmentUrl: any) {
    const formData = new FormData();
    formData.append('SenderName', this.CurrentUser.fullNameAr);
    formData.append('SenderPhoto', this.CurrentUser.imgUrl);
    formData.append('TameerRequestId', this.TempRequestId);
    formData.append('Contacttxt', this.sendNotetxt_NM);
    formData.append('ContactDate', new Date().toString());
    formData.append('UserId', '1');
    formData.append('CustomerUrl', this.TameerApiUrl);
    formData.append('AttachmentUrl', attachmentUrl);

    this._sysServicesService
      .SavenewCOntactwithcustomerFromTameer(formData)
      .subscribe((response) => {
        this.GetAllReplyByServiceId(this.TempRequestId);
      });
  }

  CurrentUser: any;
  GetCurrentUser() {
    this._sysServicesService.GetCurrentUser().subscribe((response) => {
      this.CurrentUser = response.result;
    });
  }

  CloseTicket() {
    console.log(this.tempticket);
    this._sysServicesService
      .UpdateSupportResquests(this.tempticket.requestId, 4, '', '', '')
      .subscribe((response) => {
        this.getallopensupport();
        this.CloseTicketFromlabaik(this.tempticket.requestId, 4);
        this.sendNotetxt_NM = '';
      });
  }

  CloseTicketFromlabaik(RequestId: any, Status: any) {
    this._sysServicesService
      .UpdateLabaikTicketStatus(RequestId, Status)
      .subscribe((response) => {});
  }
}
