import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  TemplateRef,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';

import { BehaviorSubject, Subscription } from 'rxjs';
import { OfficialDocumentsService } from 'src/app/core/services/acc_Services/official-documents.service';
import { OfficialDocumentsVM } from 'src/app/core/Classes/ViewModels/officialDocumentsVM';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Department } from 'src/app/core/Classes/DomainObjects/department';
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-official-documents',
  templateUrl: './official-documents.component.html',
  styleUrls: ['./official-documents.component.scss'],
  providers: [DatePipe],
})
export class OfficialDocumentsComponent implements OnInit {
  searchBox: any = {
    open: false,
    searchType: null,
  };
  // data in runningTasksModal
  accountingEntries = [
    {
      date: '2023-07-01',
      bondNumber: '123',
      bondType: 'Type A',
      registrationNumber: '456',
      accountCode: '789',
      accountName: 'Account A',
      statement: 'Statement A',
      debtor: 100,
      creditor: 50,
    },
    {
      date: '2023-07-02',
      bondNumber: '456',
      bondType: 'Type B',
      registrationNumber: '789',
      accountCode: '012',
      accountName: 'Account B',
      statement: 'Statement B',
      debtor: 200,
      creditor: 150,
    },
  ];

  get totalDebtor() {
    return this.accountingEntries.reduce(
      (total, entry) => total + entry.debtor,
      0
    );
  }

  get totalCreditor() {
    return this.accountingEntries.reduce(
      (total, entry) => total + entry.creditor,
      0
    );
  }

  showTable: boolean = false;

  projects: any;
  @ViewChild('SmartFollower') smartModal: any;
  title: any = {
    main: {
      name: {
        ar: 'الحسابات',
        en: 'Projects Management',
      },
      link: '/accounts',
    },
    sub: {
      ar: ' تذكير بالوثائق الرسمية ',
      en: 'Reminder of official documents',
    },
  };

  selectedUser: any;
  users: any;

  closeResult = '';

  showStats = false;
  showFilters = false;
  showPrice = false;

  hijriDate: any = { year: 1455, month: 4, day: 20 };
  selectedDateType = DateType.Hijri;

  @ViewChild(DatatableComponent) table: DatatableComponent | any;

  columns: any = [];

  isEditable: any = {};

  openBox: any = false;
  boxId: any;
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
  // dataSource: MatTableDataSource<any>;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('OfficiladocPaginator') OfficiladocPaginator!: MatPaginator;
  OfficialDocData: any = {
    OfficialDoc: new MatTableDataSource(),
  };

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
    'DocumentNumber',
    'DocumentName',
    'DocumentDate',
    'EndDate',
    'Issuer',
    'Notes',
    'operations',
  ];

  projectUsersColumns: string[] = ['name', 'responsibility'];
  projectTasksColumns: string[] = ['taskName', 'name', 'duration'];

  userPermissionsDataSource = new MatTableDataSource();

  projectGoalsDataSource = new MatTableDataSource();

  projectUsersDataSource = new MatTableDataSource();
  projectTasksDataSource = new MatTableDataSource();

  projectsDataSource = new MatTableDataSource();

  modalDetails: any = {
    DocumentNumber: null,
    DocumentNameAr: null,
    DocumentNameEN: null,
    DocumentDate: null,
    DocumentDateHijri: null,
    EndDate: null,
    EndDateHijri: null,
    Issuer: null,
    warningBefore: null,
    AlertRepeat: null,
    recurrenceRate: null,
    uploadFile: null,
    AddIssuer: null,
    DeptNameAR: null,
    DeptNameEN: null,
    documentId: 0,
  };


  startDate = new Date();
  endDate = new Date();
  constructor(
    private modalService: NgbModal,
    private _OfiicialDoc: OfficialDocumentsService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private translate: TranslateService,
    private datePipe: DatePipe
  ) {
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();
    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
  }
  today: any = new Date();
  ngOnInit(): void {
    this.GetAllData();
    this.FillDepartmentSelectByType();

    var dd: any = this.today.getDate();
    var mm: any = this.today.getMonth() + 1;
    var yyyy: any = this.today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    this.today = yyyy + '-' + mm + '-' + dd;
  }

  ngAfterViewInit() {
    // this.open(this.smartModal, null, 'smartModal');
  }

  //#region   ----------------------------------------Official Documents----------------------------------------------------
  public uploadedFiles: Array<File> = [];
  date: any;
  enddate: any;
  FilterModel: any = {
    nameAr: null,
    expiredDate: null,
    date: null,
  };
  officialdeleted: any;
  refreshsearch() {
    // if(this.searchBox.searchType==1){
    //   this.FilterModel.nameAr=null;
    //   this.FilterModel.expiredDate=null;
    //   this.FilterModel.date=null;
    // }else if(this.searchBox.searchType==2){
    //   this.FilterModel.nameAr=null;
    //   this.FilterModel.expiredDate=null;
    //   this.FilterModel.date=null;
    // }else if(this.searchBox.searchType==3){
    //   this.FilterModel.nameAr=null;
    //   this.FilterModel.expiredDate=null;
    //   this.FilterModel.date=null;
    // }else{
    this.FilterModel.nameAr = null;
    this.FilterModel.expiredDate = null;
    this.FilterModel.date = null;

    this.GetAllData();
  }

  GetAllData() {
    this._OfiicialDoc.GetAllOfficialDocuments().subscribe((data) => {
      console.log('docdata', data.result);
      this.OfficialDocData.OfficialDoc = new MatTableDataSource(data.result);
      this.OfficialDocData.OfficialDoc.paginator = this.OfficiladocPaginator;
    });
  }

  SearchOfficialDocuments() {
    debugger;
    var filterobj = new OfficialDocumentsVM();
    filterobj.nameAr = this.FilterModel.nameAr;
    filterobj.expiredDate =
      this.FilterModel.expiredDate == null
        ? null
        : this._sharedService.date_TO_String(this.FilterModel.expiredDate);
    filterobj.date =
      this.FilterModel.date == null
        ? null
        : this._sharedService.date_TO_String(this.FilterModel.date);

    this._OfiicialDoc.SearchOfficialDocuments(filterobj).subscribe((data) => {
      console.log('docdata', data.result);
      this.OfficialDocData.OfficialDoc = new MatTableDataSource(data.result);
      this.OfficialDocData.OfficialDoc.paginator = this.OfficiladocPaginator;
    });
  }

  //#region
  SaveOfficialDocuments(modal: any) {
    debugger;
    if (
      this.modalDetails.DocumentNumber == null ||
      this.modalDetails.DocumentNameAr == null ||
      this.modalDetails.DocumentNameEN == null ||
      this.modalDetails.DocumentDate == null ||
      this.modalDetails.EndDate == null
    ) {
      this.toast.error(
        'من فضلك اكمل البيانات',
        this.translate.instant('Message')
      );
      return;
    }
    const formData = new FormData();
    formData.append('postedFiles', this.uploadedFiles[0]);
    formData.append('DocumentId', this.modalDetails.documentId ?? '0');
    formData.append('Number', this.modalDetails.DocumentNumber);
    formData.append('NameAr', this.modalDetails.DocumentNameAr);
    formData.append('NameEn', this.modalDetails.DocumentNameEN);
    this.date = this.datePipe.transform(
      this.modalDetails.DocumentDate,
      'YYYY-MM-dd'
    );
    formData.append('Date', this.date?.toString());

    formData.append('HijriDate', this.modalDetails.DocumentDateHijri);
    this.enddate = this.datePipe.transform(
      this.modalDetails.EndDate,
      'YYYY-MM-dd'
    );
    formData.append('ExpiredDate', this.enddate?.toString());

    formData.append('ExpiredHijriDate', this.modalDetails.EndDateHijri);
    formData.append('DepartmentId', this.modalDetails.Issuer ?? '0');
    formData.append('NotifyCount', this.modalDetails.warningBefore ?? '0');
    formData.append('RepeatAlarm', this.showTable.toString());
    //if(checkAlarm.checked)
    //    formData.RecurrenceRateId = $('#RecurrenceRateId').val();
    //else
    //    formData.RecurrenceRateId = null;
    formData.append(
      'RecurrenceRateId',
      this.modalDetails.recurrenceRate ?? '0'
    );
    console.log(formData);

    this._OfiicialDoc.SaveOfficialDocuments(formData).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.GetAllData();
          modal.dismiss();
          this.refreshofficialdoc();
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

  refreshofficialdoc() {
    this.modalDetails.documentId = 0;
    this.modalDetails.DocumentNumber = null;
    this.modalDetails.DocumentNameAr = null;
    this.modalDetails.DocumentNameEN = null;
    this.modalDetails.DocumentDate = null;
    this.modalDetails.DocumentDateHijri = null;
    this.modalDetails.EndDate = null;
    this.modalDetails.EndDateHijri = null;
    this.modalDetails.Issuer = null;
    this.modalDetails.warningBefore = null;
    this.showTable = false;
    this.modalDetails.AlertRepeat = null;
    this.modalDetails.recurrenceRate = null;
  }
  editofficialdoc(data: any) {
    debugger;
    this.modalDetails.documentId = data.documentId;
    this.modalDetails.DocumentNumber = data.number;
    this.modalDetails.DocumentNameAr = data.nameAr;
    this.modalDetails.DocumentNameEN = data.nameEn;
    this.modalDetails.DocumentDate = new Date(data.date);
    this.modalDetails.DocumentDateHijri = data.hijriDate;
    this.modalDetails.EndDate = new Date(data.expiredDate);
    this.modalDetails.EndDateHijri = data.ExpiredHijriDate;
    this.modalDetails.Issuer = data.departmentId;
    this.modalDetails.warningBefore = data.notifyCount;
    this.showTable = data.repeatAlarm;
    this.modalDetails.AlertRepeat = data.repeatAlarm;
    this.modalDetails.recurrenceRate = data.recurrenceRateId;
  }

  DeleteOfficialDocuments(modal: any) {
    debugger;
    this._OfiicialDoc.DeleteOfficialDocuments(this.officialdeleted).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.GetAllData();
          modal.dismiss();
          this.refreshofficialdoc();
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

  //#region  ------------------------------------Department----------------------------------------------
  searchdepartment: any = '';
  departmentlist: any;
  departmentdeleted: any;
  departmentselectedlist: any;
  departmentmodel: any = {
    departmentId: 0,
    departmentNameAr: null,
    departmentNameEn: null,
    type: null,
  };
  GetAllDepartmentbyType() {
    this._OfiicialDoc
      .GetAllDepartmentbyType(2, this.searchdepartment)
      .subscribe((data) => {
        this.departmentlist = data.result;
      });
  }
  FillDepartmentSelectByType() {
    this._OfiicialDoc.FillDepartmentSelectByType(2).subscribe((data) => {
      debugger;
      this.departmentselectedlist = data;
    });
  }
  SaveDepartment() {
    debugger;
    if (
      this.departmentmodel.departmentNameAr == null ||
      this.departmentmodel.departmentNameAr == '' ||
      this.departmentmodel.departmentNameEn == null ||
      this.departmentmodel.departmentNameEn == ''
    ) {
      this.toast.error(
        'من فضلك اكمل البيانات',
        this.translate.instant('Message')
      );
      return;
    }
    var _department = new Department();
    _department.departmentId = this.departmentmodel.departmentId;
    _department.departmentNameAr = this.departmentmodel.departmentNameAr;
    _department.departmentNameEn = this.departmentmodel.departmentNameEn;
    _department.type = 2;

    this._OfiicialDoc.SaveDepartment(_department).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.GetAllDepartmentbyType();
          this.FillDepartmentSelectByType();
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
  DeleteVoucher(data: any) {
    debugger;
    this._OfiicialDoc.DeleteDepartment(data.departmentId).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.GetAllDepartmentbyType();
          this.FillDepartmentSelectByType();
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
    this.departmentmodel.departmentId = 0;
    this.departmentmodel.departmentNameAr = null;
    this.departmentmodel.departmentNameEn = null;
    this.departmentmodel.type = null;
  }
  setdatatoedit(data: any) {
    this.departmentmodel.departmentId = data.departmentId;
    this.departmentmodel.departmentNameAr = data.departmentNameAr;
    this.departmentmodel.departmentNameEn = data.departmentNameEn;
    this.departmentmodel.type = 2;
  }

  //#endregion-------------------------------------------------------------------------------------------
  todayy: any = new Date();

  getnotidate(data: any) {
    let NotifyDay = new Date(data.expiredDate);
    NotifyDay.setDate(NotifyDay.getDate() - data.notifyCount);
    return NotifyDay;
  }

  environmnt = environment.PhotoURL;

  fileurl: any;
  open(content: any, data?: any, type?: any) {
    if (data && type == 'edit') {
      this.modalDetails = data;
      this.modalDetails['id'] = 1;
    }
    this.refreshofficialdoc();

    if (type == 'department') {
      this.GetAllDepartmentbyType();
    }
    if (type == 'InfoModal' && data) {
      this.fileurl = data.attachmentUrl;
    }
    if (type == 'daleteoffdoc' && data) {
      this.officialdeleted = data.documentId;
    }
    if ((type = 'editoffdoc' && data)) {
      this.editofficialdoc(data);
    }

    this.modalService;
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type == 'edit' ? 'xl' : 'lg',
        centered: type ? false : true,
      })

      .result.then(
        (result) => {
          if (type == 'edit') {
            this.modalDetails = {
              projectNo: null,
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
          }
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }


  downloadimageUrlOff(data: any) {
    debugger
    try
    {
      var link=environment.PhotoURL+data.attachmentUrl;
      window.open(link, '_blank');
    }
    catch (error)
    {
      this.toast.error("تأكد من الملف", 'رسالة');
    }
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

  addProject() {}

  extend() {}
  skip() {}
  confirm() {}
  endProject() {}
  flagProject() {}
  unSaveProjectInTop() {}

  stopProject() {}
  addNewUserPermissions() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userPermissionsDataSource.filter = filterValue.trim().toLowerCase();
  }
  applyGoalsFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectGoalsDataSource.filter = filterValue.trim().toLowerCase();
  }
  applyUsersFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectUsersDataSource.filter = filterValue.trim().toLowerCase();
  }
  applyTasksFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectTasksDataSource.filter = filterValue.trim().toLowerCase();
  }

  setSelectedUserPermissions(index: any) {
    let data = this.userPermissions[index];
    this.selectedUserPermissions = data;
  }

  setValues(event: any) {
    this.selectedUserPermissions['watch'] = event.target.checked;
    this.selectedUserPermissions['add'] = event.target.checked;
    this.selectedUserPermissions['edit'] = event.target.checked;
    this.selectedUserPermissions['delete'] = event.target.checked;
  }

  changeRequestStatus(event: any) {
    this.modalDetails.walk = event.target.checked;
  }

  saveOption(data: any) {}


  // Save row
  save(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    console.log('Row saved: ' + rowIndex);
    console.log(row);
  }



  selectGoalForProject(index: any) {}

  addNewMission() {}

  onSort(event: any) {
    console.log(event);
  }

  // upload img ]
  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );
  public readonly control = new FileUploadControl(
    {
      listVisible: true,
      discardInvalid: true,
      multiple: false,
    },
    [
      FileUploadValidators.accept(['file/*']),
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
}
