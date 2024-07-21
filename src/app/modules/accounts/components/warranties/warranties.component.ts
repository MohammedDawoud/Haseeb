import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
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
import { TranslateService } from '@ngx-translate/core';
import { WarrantiesService } from 'src/app/core/services/acc_Services/warranties.service';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/core/services/shared.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-warranties',
  templateUrl: './warranties.component.html',
  styleUrls: ['./warranties.component.scss']
})

export class WarrantiesComponent implements OnInit {

  addInvoice() { }
  editInvoice() { }

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
      creditor: 50
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
      creditor: 150
    }
  ];

  get totalDebtor() {
    return this.accountingEntries.reduce((total, entry) => total + entry.debtor, 0);
  }

  get totalCreditor() {
    return this.accountingEntries.reduce((total, entry) => total + entry.creditor, 0);
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
      ar: 'ضمان جديد',
      en: 'New warranty',
    },
  };


  selectedUser: any;
  users: any;

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
  projectDisplayedColumns: string[] = [
    'customerName',
    'Project',
    'projectName',
    'value',
    'startDate',
    'bankName',
    'typeName',
    'statusName',
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
  environmenturl: any;
  startDate = new Date();
  endDate = new Date();
  constructor(private modalService: NgbModal,
    private toast: ToastrService,
    private translate: TranslateService,
    private sharedService: SharedService,
    private warrantiesService: WarrantiesService,) {
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();
    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
    this.environmenturl = environment.PhotoURL;
  }
  ngOnInit(): void {

    this.GetAllGurantees();


    this.projectsDataSource = new MatTableDataSource();

    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );

    this.projectGoalsDataSource = new MatTableDataSource(this.projectGoals);

    this.projectUsersDataSource = new MatTableDataSource(this.projectUsers);

    this.projectTasksDataSource = new MatTableDataSource(this.projectTasks);
  }

  ngAfterViewInit() {
    // this.open(this.smartModal, null, 'smartModal');
  }

  open(content: any, data?: any, type?: any) {
    if (data && type == 'edit') {
      this.modalDetails = data;
      this.modalDetails['id'] = 1;
    }
    if (data && type == "deleteModal") {
      this.RowData = data;
    }
    this.modalService
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type == 'edit' ? 'xl' : 'lg',
        centered: type ? false : true
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

  projectsDataSourceTemp: any = []
  modalEntryVoucher: any = {
    bankName: null,
    customerName: null,
    guaranteeId: 0,
    number: null,
    period: null,
    projectName: null,
    startDate: new Date(),
    startDateStr: null,
    type: 1,
    value: null,
    logoUrl: null,
  }
  rest() {
    this.modalEntryVoucher = {
      bankName: null,
      customerName: null,
      guaranteeId: 0,
      number: null,
      period: null,
      projectName: null,
      startDate: new Date(),
      startDateStr: null,
      type: 1,
      value: null,
      logoUrl: null,
    }
  }
  GetAllGurantees() {
    this.warrantiesService.GetAllGurantees().subscribe((data: any) => {
      this.projectsDataSource = new MatTableDataSource(data.result);
      this.projectsDataSourceTemp = data.result;
      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
    }, (err) => {
    }
    );
  }
  EditGurantees(element: any) {
    this.modalEntryVoucher.bankName = element.bankName
    this.modalEntryVoucher.customerName = element.customerName
    this.modalEntryVoucher.guaranteeId = element.guaranteeId
    this.modalEntryVoucher.number = element.number
    this.modalEntryVoucher.period = element.period
    this.modalEntryVoucher.projectName = element.projectName
    this.modalEntryVoucher.startDate = new Date(element.startDate)
    this.modalEntryVoucher.startDateStr = element.startDateStr
    this.modalEntryVoucher.type = element.type
    this.modalEntryVoucher.value = element.value
  }

  RowData: any
  SaveGurantee() {
    const formData = new FormData();

    if (this.imageFileOutput != null) {
      formData.append('file', this.imageFileOutput)
    }
      formData.append('bankName', this.modalEntryVoucher.bankName)
      formData.append('customerName', this.modalEntryVoucher.customerName)
      formData.append('guaranteeId', this.modalEntryVoucher.guaranteeId)
      formData.append('number', this.modalEntryVoucher.number.toString())
      formData.append('period',  this.modalEntryVoucher.period)
      formData.append('projectName', this.modalEntryVoucher.projectName)
      formData.append('startDate', this.sharedService.date_TO_String( this.modalEntryVoucher.startDate))
      formData.append('startDateStr', this.sharedService.date_TO_String( this.modalEntryVoucher.startDate))
      formData.append('type', this.modalEntryVoucher.type)
      formData.append('value', this.modalEntryVoucher.value.toString())

    this.warrantiesService.SaveGurantee(formData).subscribe((data: any) => {
      if (data.statusCode == 200) {
        this.toast.success(
          this.translate.instant(data.reasonPhrase),
          this.translate.instant('Message')
        );
        this.rest()
        this.GetAllGurantees();
      } else { this.toast.error(this.translate.instant(data.reasonPhrase), this.translate.instant("Message")); }
    },
      (error: any) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }
  public uploadedFilesR: Array<File> = [];
  savefileR(id: any) {
    const formData = new FormData();
    formData.append('UploadedFile', this.imageFileOutput);
    formData.append('InvoiceId', id);
    // this.warrantiesService.Gurantees(formData).subscribe((data) => {

    // });
  }
  DeleteGurantee(modal: any) {
    this.warrantiesService.DeleteGurantee(this.RowData.guaranteeId).subscribe((data: any) => {
      if (data.statusCode == 200) {
        this.toast.success(
          this.translate.instant(data.reasonPhrase),
          this.translate.instant('Message')
        );
        this.GetAllGurantees();
        modal.dismiss()
      } else { this.toast.error(this.translate.instant(data.reasonPhrase), this.translate.instant("Message")); }
    },
      (error: any) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }
  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    const tempsource = this.projectsDataSourceTemp.filter(function (d: any) {
      return (d.bankName!=null?d.bankName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.customerName!=null?d.customerName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.guaranteeId!=null?d.guaranteeId.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.number!=null?d.number.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.period!=null?d.period.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.projectName!=null?d.projectName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.startDate!=null?d.startDate.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.startDateStr!=null?d.startDateStr.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.type!=null?d.type.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.value!=null?d.value.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
    });

    this.projectsDataSource = new MatTableDataSource(tempsource);
    this.projectsDataSource.paginator = this.paginator;
    this.projectsDataSource.sort = this.sort;
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

  addProject() { }

  extend() { }
  skip() { }
  confirm() { }
  endProject() { }
  flagProject() { }
  unSaveProjectInTop() { }

  stopProject() { }
  addNewUserPermissions() { }

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

  saveOption(data: any) { }

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

  selectGoalForProject(index: any) { }

  addNewMission() { }

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
      FileUploadValidators.filesLimit(1),
    ]
  );
  private subscription?: Subscription;

  imageFileOutput: any = null

  private getImage(file: File): void {
    if (FileReader && file) {
      const fr = new FileReader();
      fr.onload = (e: any) => this.uploadedFile.next(e.target.result);
      fr.readAsDataURL(file);
      this.imageFileOutput = file
    } else {
      this.imageFileOutput = null
      this.uploadedFile.next('');
    }
  }
  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }


}

