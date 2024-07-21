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
import { FiscalyearserviceService } from 'src/app/core/services/acc_Services/fiscalyearservice.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { FiscalYears } from 'src/app/core/Classes/DomainObjects/fiscalYears';
import { Acc_EmpFinYears } from 'src/app/core/Classes/DomainObjects/acc_EmpFinYears';
import { SelectionModel } from '@angular/cdk/collections';
import { SharedService } from 'src/app/core/services/shared.service';
interface Item {
  id: number;
  name: string;
}
@Component({
  selector: 'app-fiscal-years',
  templateUrl: './fiscal-years.component.html',
  styleUrls: ['./fiscal-years.component.scss'],
})
export class FiscalYearsComponent implements OnInit {
  addInvoice() {}
  editInvoice() {}

  // year only
  name = 'Angular';

  onOpenCalendar(container: any) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('year');
  }

  showTable: boolean = false;

  projects: any;
  data: any;
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
      ar: ' السنوات المالية',
      en: 'fiscal years',
    },
  };
  selectedUser: any;
  users: any;
  years: any;

  closeResult = '';

  showStats = false;
  showFilters = false;
  showPrice = false;

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
  projectDisplayedColumns: string[] = ['Name', 'year', 'operations'];

  projectDisplayedColumns2: string[] = [
    'Employee',
    'Job',
    'Branch',
    'FiscalYear',
    'operations',
  ];

  projectUsersColumns: string[] = ['name', 'responsibility'];
  projectTasksColumns: string[] = ['taskName', 'name', 'duration'];

  userPermissionsDataSource = new MatTableDataSource();

  projectGoalsDataSource = new MatTableDataSource();

  projectUsersDataSource = new MatTableDataSource();
  projectTasksDataSource = new MatTableDataSource();

  projectsDataSource = new MatTableDataSource();
  projectsDataSource2 = new MatTableDataSource();

  modalDetails: any = {
    serviceNumber: null,
    postPaid: null,
    DateOfPublicationAD: null,
    ChapterDateAD: null,
    accountName: null,
    Bank: null,
    warningBefore: null,
    recurrenceRate: null,
    WarningText: null,
  };

  rows = [
    { id: 1, name_ar: 'اسم النشاط 1', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط 2', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط 3', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
  ];
  temp: any = [
    { id: 1, name_ar: 'اسم النشاط 1', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط 2', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط 3', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
  ];

  projectGoals: any = [
    {
      serial: 'adawd',
      requirements: 'adawd',
      name: 'adawd',
      duration: 'adawd',
      choose: true,
    },
    {
      serial: 'adawd',
      requirements: 'adawd',
      name: 'adawd',
      duration: 'adawd',
      choose: false,
    },
    {
      serial: 'adawd',
      requirements: 'adawd',
      name: 'adawd',
      duration: 'adawd',
      choose: false,
    },
  ];

  projectUsers: any = [
    {
      name: 'adawd',
      image: '/assets/images/login-img.png',
      responsibility: 'adawd',
    },
    {
      name: 'adawd',
      image: '/assets/images/login-img.png',
      responsibility: 'adawd',
    },
    {
      name: 'adawd',
      image: '/assets/images/login-img.png',
      responsibility: 'adawd',
    },
  ];

  projectTasks: any = [
    {
      name: 'adawd',
      image: '/assets/images/login-img.png',
      taskName: 'adawd',
      duration: 4,
    },
    {
      name: 'adawd',
      image: '/assets/images/login-img.png',
      taskName: 'adawd',
      duration: 4,
    },
    {
      name: 'adawd',
      image: '/assets/images/login-img.png',
      taskName: 'adawd',
      duration: 4,
    },
  ];

  startDate = new Date();
  endDate = new Date();
  constructor(
    private modalService: NgbModal,
    private _fisicalYear: FiscalyearserviceService,
    private toast: ToastrService,
    private translate: TranslateService,
    private sharedService: SharedService
  ) {
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();
    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
  }
  ngOnInit(): void {
    this.GetAllFiscalyears();
    this.FillAllUsersSelectAll();
    this.FillBranchSelect();
    this.GetAllFiscalyearsPriv();
    this.GetSystemSettingsByUserId();
    this.FillYearSelect();
    this.GetActiveYear();
    this.getactivefromlocalsotage();
    this.users = [
      { id: 1, Name: 'محمود نافع' },
      { id: 2, Name: 'محمود نافع' },
    ];

    this.years = [
      { id: 1, Name: '2020' },
      { id: 2, Name: '2021' },
      { id: 3, Name: '2022' },
      { id: 4, Name: '2023' },
      { id: 5, Name: '2024' },
    ];
  }

  ngAfterViewInit() {
    // this.open(this.smartModal, null, 'smartModal');
  }
  FisicalYearPriv = new MatTableDataSource();
  @ViewChild('paginatorFisicalYearPriv') paginatorFisicalYearPriv: MatPaginator;

  //#region FIsical Year//////////////////////////////////////////////////////////////////////////////////////////////////// /////////////
  FisicalYear = new MatTableDataSource();
  @ViewChild('paginatorFisicalYear') paginatorFisicalYear: MatPaginator;

  FisicalYearMode: any = {
    fiscalId: null,
    yearName: null,
    yearId: null,
    yeartype: 1,
  };
  fisicalyears: any;
  GetAllFiscalyears() {
    this._fisicalYear.GetAllFiscalyears().subscribe((data) => {
      this.fisicalyears = data.result;
      this.FisicalYear = new MatTableDataSource(data.result);
      this.FisicalYear.paginator = this.paginatorFisicalYear;
    });
  }
  Fiscalyearssearchtext(event: Event) {
    debugger;
    const filterValue = (event.target as HTMLInputElement).value;
    this.FisicalYear.filter = filterValue.trim().toLowerCase();
  }

  refreshfisical() {
    this.FisicalYearMode.fiscalId = null;
    this.FisicalYearMode.yearName = null;
    this.FisicalYearMode.yearId = null;
    this.FisicalYearMode.yeartype = 1;
  }

  setdatatoedit(data: any) {
    this.FisicalYearMode.fiscalId = data.fiscalId;
    this.FisicalYearMode.yearName = data.yearName;
    this.FisicalYearMode.yearId = data.yearId;
    this.FisicalYearMode.yeartype = 2;
  }

  Savevervice() {
    var _ficical = new FiscalYears();
    if (
      this.FisicalYearMode.yearName == null ||
      this.FisicalYearMode.yearName == '' ||
      this.FisicalYearMode.yearId == null ||
      this.FisicalYearMode.yearId == ''
    ) {
      this.toast.error(
        'من فضلك اكمل البيانات',
        this.translate.instant('Message')
      );
      return;
    }
    debugger;
    _ficical.fiscalId = this.FisicalYearMode.fiscalId ?? 0;
    _ficical.yearName = this.FisicalYearMode.yearName;
    if (this.FisicalYearMode.yeartype == 2) {
      _ficical.yearId = this.FisicalYearMode.yearId;
    } else {
      _ficical.yearId = this.FisicalYearMode.yearId.getFullYear();
    }

    this._fisicalYear.SaveFiscalyears(_ficical).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.GetAllFiscalyears();
          this.FillYearSelect();
          this.refreshfisical();
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
  ActivateFiscalYear() {
    this._fisicalYear
      .ActivateFiscalYear(this.YearIdActive, this.SettingId)
      .subscribe(
        (data) => {
          if (data.statusCode == 200) {
            debugger;
            this.refreshfisical();
            this.GetActiveYear();
            debugger;
            var yeatid = this.getItemNameById(this.YearIdActive);
            this.sharedService.setStoYear(yeatid);
            this.sharedService.setStofiscalId(this.YearIdActive);
            location.reload();
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

  YearRecycle(modal: any) {
    let year = this.activeyearid;
    let yeato = this.activeyearrec;
    if (year != null && yeato != null) {
      this._fisicalYear.SaveRecycleVoucher(yeato - 1).subscribe(
        (data) => {
          if (data.statusCode == 200) {
            modal.dismiss();

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
  }

  YearReturnRecycle(modal: any) {
    let year = this.activeyearid;
    let yeato = this.activeyearrec;
    if (year != null && yeato != null) {
      this._fisicalYear.SaveRecycleReturnVoucher(yeato).subscribe(
        (data) => {
          if (data.statusCode == 200) {
            modal.dismiss();
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
  }

  getItemNameById(itemId: number): string {
    const item = this.YearselectedList.find((item) => item.id === itemId);
    return item ? item.name : 'Not Found';
  }
  activeyearid: any;
  activeyearrec: any;
  GetActiveYear() {
    this._fisicalYear.GetActiveYear().subscribe((data) => {
      debugger;
      this.YearIdActive = data.fiscalId;
      //  this.activeyearid=data.yearId;
      //  this.activeyearrec=data.yearId +1;
    });
  }

  getactivefromlocalsotage() {
    debugger;
    this.activeyearid = parseInt(this.sharedService.getStoYear());
    if (
      this.activeyearid != 0 &&
      this.activeyearid != null &&
      this.activeyearid != ''
    ) {
      this.activeyearrec = this.activeyearid + 1;
    }
  }
  SettingId: any;
  YearIdActive: any;
  GetSystemSettingsByUserId() {
    this._fisicalYear.GetSystemSettingsByUserId().subscribe((data) => {
      debugger;
      this.SettingId = data.settingId;
    });
  }

  UserlectedList: any;

  FillAllUsersSelectAll() {
    this._fisicalYear.FillAllUsersSelectAll().subscribe((data) => {
      debugger;
      this.UserlectedList = data;
    });
  }
  BranchlectedList: any;
  FillBranchSelect() {
    this._fisicalYear.FillBranchSelect().subscribe((data) => {
      debugger;
      this.BranchlectedList = data;
    });
  }
  YearselectedList: Item[];
  FillYearSelect() {
    this._fisicalYear.FillYearSelect().subscribe((data) => {
      debugger;
      this.YearselectedList = data;
    });
  }
  FiscalyearsObj: any = {
    acc_EmpFinYearID: null,
    empID: null,
    branchID: null,
    yearID: [],
  };
  SaveFiscalyearsPriv() {
    debugger;
    var _ficical = new Acc_EmpFinYears();
    if (
      this.FiscalyearsObj.empID == null ||
      this.FiscalyearsObj.branchID == null
    ) {
      this.toast.error(
        'من فضلك اكمل البيانات',
        this.translate.instant('Message')
      );
      return;
    }
    debugger;
    for (var j = 0; j < this.selection.year.selected.length; j++) {
      var selected = this.selection.year.selected;
      //var any=sel.fiscalId
      _ficical.acc_EmpFinYearID = this.FiscalyearsObj.acc_EmpFinYearID ?? 0;
      _ficical.empID = this.FiscalyearsObj.empID;
      _ficical.branchID = this.FiscalyearsObj.branchID;
      _ficical.yearID = this.selection.year.selected[j];

      this._fisicalYear.SaveFiscalyearsPriv(_ficical).subscribe(
        (data) => {
          if (data.statusCode == 200) {
            this.GetAllFiscalyearsPriv();
            this.refreshfiscal();
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
    this.selection.year = new SelectionModel<any>(true, []);
    this.refreshfiscal();
    this.GetAllFiscalyearsPriv();
  }

  refreshfiscal() {
    this.FiscalyearsObj.acc_EmpFinYearID = 0;
    this.FiscalyearsObj.empID = null;
    this.FiscalyearsObj.branchID = null;
  }
  fisicalyearsPriv: any;
  GetAllFiscalyearsPriv() {
    this._fisicalYear.GetAllFiscalyearsPriv().subscribe((data) => {
      this.fisicalyearsPriv = data.result;
      this.FisicalYearPriv = new MatTableDataSource(data.result);
      this.FisicalYearPriv.paginator = this.paginatorFisicalYearPriv;
    });
  }
  editpriv(data: any) {
    debugger;
    this.FiscalyearsObj.acc_EmpFinYearID = data.acc_EmpFinYearID;
    this.FiscalyearsObj.empID = data.empID;
    this.FiscalyearsObj.branchID = data.branchID;
    this.selection.year.clear();
    this.selection.year.select(data.yearID);
  }
  Fiscalyearsprivsearchtext(event: Event) {
    debugger;
    const filterValue = (event.target as HTMLInputElement).value;
    this.FisicalYearPriv.filter = filterValue.trim().toLowerCase();
  }

  //#endregion/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  selection = {
    year: new SelectionModel<any>(true, []),
  };
  /** Whether the number of selected elements matches the total number of rows. */
  // isAllSelected() {
  //   const numSelected = this.selection.tasks.selected.length;
  //   const numRows = this.modals.rows.tasks.length;
  //   return numSelected === numRows;
  // }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  // toggleAllRows(event: any) {
  //   if (event.checked == false) {
  //     this.selection.tasks.clear();
  //     return;
  //   }

  //   this.selection.tasks.select(...this.modals.rows.tasks.data);
  // }
  /** The label for the checkbox on the passed row */
  // checkboxLabel(row?: any): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  //   }
  //   return `${this.selection.tasks.isSelected(row) ? 'deselect' : 'select'
  //     } row ${row.position + 1}`;
  // }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  open(content: any, data?: any, type?: any) {
    if (data && type == 'edit') {
      this.modalDetails = data;
      this.modalDetails['id'] = 1;
    }
    if (type == 'editficsalpriv') {
      this.editpriv(data);
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

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d: any) {
      return d.name_ar.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;

    if (this.table) {
      this.table!.offset = 0;
    }
  }

  // Save row
  save(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    console.log('Row saved: ' + rowIndex);
    console.log(row);
  }

  // Delete row
  delete(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    this.rows.splice(rowIndex, 1);
    console.log('Row deleted: ' + rowIndex);
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
