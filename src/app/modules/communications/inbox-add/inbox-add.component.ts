import { Component, Input } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { BehaviorSubject, Subscription } from 'rxjs';
import { OutInBox } from 'src/app/core/Classes/DomainObjects/outInBox';
import { OutInboxrviceService } from 'src/app/core/services/Communications/out-inboxrvice.service';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/core/services/shared.service';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from 'src/app/core/Classes/DomainObjects/department';
import { OutInBoxSerial } from 'src/app/core/Classes/DomainObjects/outInBoxSerial';
import { ArchiveFiles } from 'src/app/core/Classes/DomainObjects/archiveFiles';
import { OutInBoxType } from 'src/app/core/Classes/DomainObjects/outInBoxType';
const hijriSafe = require('hijri-date/lib/safe');
const HijriDate = hijriSafe.default;
const toHijri = hijriSafe.toHijri;
@Component({
  selector: 'app-inbox-add',
  templateUrl: './inbox-add.component.html',
  styleUrls: ['./inbox-add.component.scss'],
  providers: [DatePipe],
})
export class InboxAddComponent {
  title: any = {
    main: {
      name: {
        ar: 'الاتصالات الإدارية',
        en: 'Administrative Communications',
      },
      link: '/communications',
    },
    sub: {
      ar: 'الخطابات الواردة ',
      en: ' Inbox Letters',
    },
  };
   @Input() public outboxedit: any;
public outinbox :OutInBox;

  constructor(private modalService: NgbModal,
    private _outinboxservice: OutInboxrviceService,
    private toast: ToastrService, private translate: TranslateService,
    private _sharedService: SharedService, private router: Router, private route: ActivatedRoute
  ,private datePipe: DatePipe) {
    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
      this.outinbox=new OutInBox();

  }
   handleCustomEvent(myObject: OutInBox) {
    debugger;
    console.log('Received object:', myObject);
    // Perform actions with the received object
  }
    editRow: any;

  ngOnInit(): void {
    debugger

    this.GetAllOutInBoxSerial();
    this.FillDepartmentSelectByType();
    this.FillArchiveFilesSelect();
    this.FillOutInBoxTypeSelect();
    this.FillDepartmentSelectByType1();
    this.FillDepartmentSelectByType2();
    this.FillInboxTypeSelect2('');
    this.FillInboxTypeSelect('');
    this.FillProjectSelect();
    this.route.queryParams.subscribe(params => {
      debugger
      const servjson = sessionStorage.getItem('serobj');
      if (servjson != '') {
        const objectPassed = servjson !== null ? JSON.parse(servjson) : new OutInBox();
        this.outinbox = objectPassed;
        debugger;
         this.OutboxObj.OutInBoxId=this.outinbox.outInBoxId;
       
        this.OutboxObj.Number = this.outinbox.number;
         this.OutboxObj.NumberType =this.outinbox.numberType;
         this.OutboxObj.OutInType =this.outinbox.outInType?.toString();
         this.OutboxObj.Priority =this.outinbox.priority?.toString();
        this.OutboxObj.Date = new Date(this.outinbox.date ?? '');
        this.ChangeemployeeGre(this.outinbox.date);
         //this.OutboxObj.HijriDate =this.outinbox.hijriDate;
         this.OutboxObj.TypeId =this.outinbox.typeId;
         this.OutboxObj.SideFromId =this.outinbox.sideFromId;
         this.OutboxObj.Topic =this.outinbox.topic;
        this.OutboxObj.SideToId = this.outinbox.sideToId;
         this.OutboxObj.ArchiveFileId =this.outinbox.archiveFileId;
        this.OutboxObj.InnerId = this.outinbox.innerId;
        if (this.OutboxObj.InnerId != null) {
          this.GetOutInboxById_outtype();
        }
        this.OutboxObj.RelatedToId = this.outinbox.relatedToId;
        if (this.outinbox.relatedToId != null) {
                  this.GetOutInboxById();

        }
        this.OutboxObj.ProjectId =this.outinbox.projectId;

        if (this.OutboxObj.ProjectId != null) {
          this.GetProjectById();
        }
        this.editRow = objectPassed;
        sessionStorage.setItem('serobj', '');
      }
    });

    }
  open(content: any, data: any, size: any, type?: any) {
    if (type == 'department' || type == 'department1') {
      this.department.Type = 2;
      this.GetAllDepartmentbyType();
    } else if (type == 'department2') {
      this.department.Type = 2;
      this.GetAllDepartmentbyType();
    }
    
    else if (type == 'archfiles') {
      this.GetAllArchiveFiles();
    } else if (type == 'outtype') {
      this.GetAllOutInBoxTypes();
    }
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: size,
        centered: true,
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
  // selectedDate: any;
  // selectedDateType = DateType.Hijri;
  // date?: NgbDate;

  // upload img
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

  ////////////////////////////////////////////////Department.///////////////////////////////
  //#region OutBox To 

  sarchText: any;
  DepartmentList: any;
  DeptList: any;
  department: any = {
    DepartmentId: 0,
    DepartmentNameAr: null,
    DepartmentNameEn: null,
    Type:2,
  }

    GetAllDepartmentbyType() {
    this._outinboxservice.GetAllDepartmentbyType(this.department.Type).subscribe((data) => {
      debugger;
      this.DepartmentList = data.result;
     
    });
    
  }

     FillDepartmentSelectByType() {
    this._outinboxservice.FillDepartmentSelectByType(this.department.Type).subscribe((data) => {
      debugger;
      this.DeptList = data;
     
    });
    
  }
    SaveDepartment() {
    debugger;
    if (
      this.department.DepartmentNameAr == null ||
      this.department.DepartmentNameAr == '' ||
      this.department.DepartmentNameEn == null ||
      this.department.DepartmentNameEn == ''
    ) {
      this.toast.error(
        'من فضلك اكمل البيانات',
        this.translate.instant('Message')
      );
      return;
    }
    var _department = new Department();
    _department.departmentId = this.department.DepartmentId;
    _department.departmentNameAr = this.department.DepartmentNameAr;
    _department.departmentNameEn = this.department.DepartmentNameEn;
    _department.type =  this.department.Type;

    this._outinboxservice.SaveDepartment(_department).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.GetAllDepartmentbyType();
         
          this.refreshdepartment();
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }
  EditDepartment(data: any) {
  this.department.DepartmentId = data.departmentId;
    this.department.DepartmentNameAr = data.departmentNameAr;
    this.department.DepartmentNameEn = data.departmentNameEn;
    this.department.Dype = 2;
}
   DeleteDepartment(deptid:any) {
    debugger;
   
    this._outinboxservice.DeleteDepartment(deptid).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.GetAllDepartmentbyType();
         
          this.refreshdepartment();
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }
    refreshdepartment() {
    this.department.DepartmentId = 0;
    this.department.DepartmentNameAr = null;
    this.department.DepartmentNameEn = null;
    this.department.Dype = 2;
  }
  //#endregion


    ////////////////////////////////////////////////Code.///////////////////////////////
  //#region OutBox To 

  codeList: any;
  code: any = {
    OutInSerialId: 0,
    Name: null,
    LastNumber:0,
    Code: null,
    Type:2,
  }

    GetAllOutInBoxSerial() {
    this._outinboxservice.GetAllOutInBoxSerial(this.code.Type).subscribe((data) => {
      debugger;
      this.codeList = data.result;
     
    });
    
  }
    SaveOutInBoxSerial() {
    debugger;
    if (
      this.code.Name == null ||
      this.code.Name == '' ||
      this.code.Code == null ||
      this.code.Code == ''
    ) {
      this.toast.error(
        'من فضلك اكمل البيانات',
        this.translate.instant('Message')
      );
      return;
    }
    var _code = new OutInBoxSerial();
    _code.outInSerialId = this.code.OutInSerialId;
    _code.name = this.code.Name;
      _code.lastNumber = this.code.LastNumber;
          _code.code = this.code.Code;

    _code.type =  this.code.Type;

    this._outinboxservice.SaveOutInBoxSerial(_code).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.GetAllOutInBoxSerial();
         
          this.refreshcode();
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }

     DeleteOutInBoxSerial(outinboxId:any) {
    debugger;
   
    this._outinboxservice.DeleteOutInBoxSerial(outinboxId).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.GetAllOutInBoxSerial();
         
          this.refreshcode();
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }
  EditOutInBoxSerial(data: any) {
     this.code.OutInSerialId = data.outInSerialId;
    this.code.Name = data.name;
    this.code.Code = data.code;
    this.code.Type = 2;
    this.code.LastNumber = 0;
  }

     GenerateOutInBoxNumber() {
    this._outinboxservice.GenerateOutInBoxNumber(this.OutboxObj.code).subscribe((data) => {
      debugger;
      this.OutboxObj.Number = data;
     
    });
    
  }
    refreshcode() {
    this.code.OutInSerialId = 0;
    this.code.Name = null;
    this.code.Code = null;
    this.code.Type = 2;
    this.code.LastNumber = 0;
  }
  //#endregion


    ////////////////////////////////////////////////Archive File.///////////////////////////////
  //#region Archive File

  ArchiveFileList: any;
  ArchiveList: any;
  ArchiveFile: any = {
    ArchiveFileId: 0,
    NameAr: null,
    NameEn: null,
  }

    GetAllArchiveFiles() {
    this._outinboxservice.GetAllArchiveFiles('').subscribe((data) => {
      debugger;
      this.ArchiveFileList = data.result;
     
    });
    
  }

     FillArchiveFilesSelect() {
    this._outinboxservice.FillArchiveFilesSelect().subscribe((data) => {
      debugger;
      this.ArchiveList = data;
     
    });
    
  }
    SaveArchiveFiles() {
    debugger;
    if (
      this.ArchiveFile.NameAr == null ||
      this.ArchiveFile.NameAr == '' ||
      this.ArchiveFile.NameEn == null ||
      this.ArchiveFile.NameEn == ''
    ) {
      this.toast.error(
        'من فضلك اكمل البيانات',
        this.translate.instant('Message')
      );
      return;
    }
    var _file = new ArchiveFiles();
    _file.archiveFileId = this.ArchiveFile.ArchiveFileId;
    _file.nameAr = this.ArchiveFile.NameAr;
    _file.nameEn = this.ArchiveFile.NameEn;

    this._outinboxservice.SaveArchiveFiles(_file).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.GetAllArchiveFiles();
         
          this.refreshArchiveFile();
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }
  EditArchiveFile(data: any) {
 
    this.ArchiveFile.ArchiveFileId = data.archiveFileId;
    this.ArchiveFile.NameAr = data.nameAr;
    this.ArchiveFile.NameEn = data.nameEn;
}
   DeleteArchiveFile(arcfile:any) {
    debugger;
   
    this._outinboxservice.DeleteArchiveFiles(arcfile).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.GetAllArchiveFiles();
         
          this.refreshArchiveFile();
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }
    refreshArchiveFile() {
      this.ArchiveFile.ArchiveFileId = 0;
    this.ArchiveFile.NameAr = null;
    this.ArchiveFile.NameEn = null;
  }
  //#endregion





   ////////////////////////////////////////////////Archive File.///////////////////////////////
  //#region Archive File

  outTypeList: any;
  outList: any;
  outType: any = {
    TypeId: 0,
    NameAr: null,
    NameEn: null,
  }

    GetAllOutInBoxTypes() {
    this._outinboxservice.GetAllOutInBoxTypes('').subscribe((data) => {
      debugger;
      this.outTypeList = data.result;
     
    });
    
  }

     FillOutInBoxTypeSelect() {
    this._outinboxservice.FillOutInBoxTypeSelect().subscribe((data) => {
      debugger;
      this.outList = data;
     
    });
    
  }
    SaveOutInBoxType() {
    debugger;
    if (
      this.outType.NameAr == null ||
      this.outType.NameAr == '' ||
      this.outType.NameEn == null ||
      this.outType.NameEn == ''
    ) {
      this.toast.error(
        'من فضلك اكمل البيانات',
        this.translate.instant('Message')
      );
      return;
    }
    var _file = new OutInBoxType();
    _file.typeId = this.outType.TypeId;
    _file.nameAr = this.outType.NameAr;
    _file.nameEn = this.outType.NameEn;

    this._outinboxservice.SaveOutInBoxType(_file).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.GetAllOutInBoxTypes();
          this.FillOutInBoxTypeSelect();
          this.refreshoutType();
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }
  EditOutInBoxType(data: any) {
 
     this.outType.TypeId= data.typeId;
    this.outType.NameAr = data.nameAr;
    this.outType.NameEn = data.nameEn;
}
   DeleteOutInBoxType(outtypeid:any) {
    debugger;
   
    this._outinboxservice.DeleteOutInBoxType(outtypeid).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.GetAllOutInBoxTypes();
                   this.FillOutInBoxTypeSelect();

          this.refreshoutType();
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }
    refreshoutType() {
      this.outType.TypeId = 0;
    this.outType.NameAr = null;
    this.outType.NameEn = null;
  }
  //#endregion
  DeptList1: any;
  DeptList2: any;
       FillDepartmentSelectByType1() {
    this._outinboxservice.FillDepartmentSelectByType(2).subscribe((data) => {
      debugger;
      this.DeptList1 = data;
     
    });
    
  }
       FillDepartmentSelectByType2() {
    this._outinboxservice.FillDepartmentSelectByType(2).subscribe((data) => {
      debugger;
      this.DeptList2 = data;
     
    });
    
  }

  ///////////////////////////////////////  outbox //////////////////////////////
  //#region  saving outbox
  selectedDateType = DateType.Hijri;
  innerchecked: any = false;
  inboxchecked: any = false;
  projectchecked: any = false;
  OutboxObj: any = {
    OutInBoxId: 0,
    Type: 2,
    code:null,
    Number: null,
    NumberType: null,
    OutInType: null,
    Priority: null,
    Date: null,
    HijriDate: null,
    TypeId: null,
    SideFromId:null,
    Topic: null,
    SideToId: null,
    ArchiveFileId: null,
    InnerId: null,
    RelatedToId: null,
    ProjectId: null,
    OutInImagesIds: null,
    ExternalDep: null,
    InternalDep:null,
    relatedtodate: null,
    relatedsideto: null,
    relatedtotopic:null,
   projectcustomer:null,
    outtypedate:null,
  }

    ChangeemployeeGre(event: any) {
    debugger;

    if (event != null) {
      const DateHijri = toHijri(this.OutboxObj.Date);
      var DateGre = new HijriDate(
        DateHijri._year,
        DateHijri._month,
        DateHijri._date
      );
      DateGre._day = DateGre._date;
      this.OutboxObj.HijriDate = DateGre;
    } else {
      this.OutboxObj.HijriDate = null;
    }
  }
  ChangeemployeeDateHijri(event: any) {
    debugger;
    if (event != null) {
      const DateGre = new HijriDate(event.year, event.month, event.day);
      const dayGreg = DateGre.toGregorian();
      this.OutboxObj.Date = dayGreg;
    } else {
      this.OutboxObj.Date = null;
    }
  }

  inboxtype: any;
  FillInboxTypeSelect2(type: any) {
    this._outinboxservice.FillInboxTypeSelect(type).subscribe((data) => {
      this.inboxtype = data;
     
    });
  }
  InboxType: any;
  FillInboxTypeSelect(type: any) {
    this._outinboxservice.FillInboxTypeSelect(type).subscribe((data) => {
      this.InboxType = data;
     
    });
  }
    ProjectSelec: any;
  FillProjectSelect() {
    this._outinboxservice.FillProjectSelect().subscribe((data) => {
      this.ProjectSelec = data;
     
    });
  }

  saveOutbox() {
    console.log(this.OutboxObj);
       if (
      this.OutboxObj.Number == null ||
      this.OutboxObj.Number == '' ||
      this.OutboxObj.Topic == null ||
         this.OutboxObj.Topic == '' ||

         this.OutboxObj.SideToId == null ||
         this.OutboxObj.SideToId == '' ||
         this.OutboxObj.ArchiveFileId == null ||
         this.OutboxObj.ArchiveFileId == '' ||
         this.OutboxObj.TypeId == null ||
         this.OutboxObj.TypeId == '' ||
         this.OutboxObj.SideFromId == null ||
      this.OutboxObj.SideFromId == '' 
         
    ) {
      this.toast.error(
        'من فضلك اكمل البيانات',
        this.translate.instant('Message')
      );
      return;
    }
    var OutboxObject = new OutInBox();

        OutboxObject.outInBoxId = this.OutboxObj.OutInBoxId;
        OutboxObject.type = 2;
        OutboxObject.number = this.OutboxObj.Number.toString();
        OutboxObject.numberType = this.OutboxObj.NumberType;
        OutboxObject.outInType = this.OutboxObj.OutInType;//$('#OutInTypetxt').val();// $('#OutInTypetxt').bootstrapSwitch('state');
        OutboxObject.priority = this.OutboxObj.Priority;
        OutboxObject.date =this._sharedService.date_TO_String( this.OutboxObj.Date);
        OutboxObject.hijriDate =this._sharedService.hijri_TO_String(this.OutboxObj.HijriDate);
        OutboxObject.typeId = this.OutboxObj.TypeId;
        OutboxObject.sideFromId = this.OutboxObj.SideFromId;
        OutboxObject.topic = this.OutboxObj.Topic;
        OutboxObject.sideToId = this.OutboxObj.SideToId;
        OutboxObject.archiveFileId = this.OutboxObj.ArchiveFileId;
        OutboxObject.innerId = this.OutboxObj.InnerId;
        OutboxObject.relatedToId = this.OutboxObj.RelatedToId;
        OutboxObject.projectId = this.OutboxObj.ProjectId;
    
        this._outinboxservice.SaveOutInbox(OutboxObject).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          if (this.control?.value[0] != null) {
            this.UploadOutInBoxFiles(data.returnedParm)
          } else {
            this.toast.success(
              this.translate.instant(data.reasonPhrase),
              this.translate.instant('Message')
            );
                this.router.navigate(['/communications/Inbox']); 

          }
        } else {
          this.toast.error(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
    
  }

  UploadOutInBoxFiles(id:any) {
    debugger;
        const formData = new FormData();
formData.append('files', this.control?.value[0]);

    formData.append('OutInBoxId', id);
    
        this._outinboxservice.UploadOutInBoxFiles(formData).subscribe(
          (data) => {
            debugger
                       this.router.navigate(['/communications/Inbox']); 

            this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
       
       
        
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
    
  }

  

  GetOutInboxById() {
    this._outinboxservice.GetOutInboxById(this.OutboxObj.RelatedToId).subscribe((data) => {
      this.OutboxObj.relatedtodate = new Date(data.result.date);
      this.OutboxObj.relatedsideto = data.result.sideToName;
      this.OutboxObj.relatedtotopic = data.result.topic;
    });
  }
  clearinboxcheckeddata() {
    this.OutboxObj.relatedtodate = null;
    this.OutboxObj.relatedsideto = null;
    this.OutboxObj.relatedtotopic = null;
    this.OutboxObj.RelatedToId = null;
  }

    GetProjectById() {
    this._outinboxservice.GetProjectById(this.OutboxObj.ProjectId).subscribe((data) => {
      this.OutboxObj.projectcustomer = data.result.customerName;

    });
  }

  
  GetOutInboxById_outtype() {
    this._outinboxservice.GetOutInboxById(this.OutboxObj.InnerId).subscribe((data) => {
      this.OutboxObj.outtypedate = new Date(data.result.date);
 
    });
  }
  //#region 
}
