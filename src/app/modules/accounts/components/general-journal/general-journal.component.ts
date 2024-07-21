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

import { environment } from 'src/environments/environment';
import { NgxPrintElementService } from 'ngx-print-element';
import { RestApiService } from 'src/app/shared/services/api.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ReportCustomer } from 'src/app/core/Classes/ViewModels/reportCustomer';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-general-journal',
  templateUrl: './general-journal.component.html',
  styleUrls: ['./general-journal.component.scss']
})

export class GeneralJournalComponent implements OnInit {

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
      ar: ' اليومية العامة',
      en: 'general journal',
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
    'transactionDate',
    'invoiceNumber',
    'typeName',
    'journalNo',
    'accountCode',
    'accountName',
    'notes',
    'depit',
    'credit',
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
  lang: any = 'ar';
  startDate = new Date();
  endDate = new Date();
  constructor(private modalService: NgbModal,
    private api: RestApiService,
    private print: NgxPrintElementService,
    private _accountsreportsService: AccountsreportsService,
    private toast: ToastrService,
    private _sharedService: SharedService,) {
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();
    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
    api.lang.subscribe((res) => {
      this.lang = res;
    });
  }
  ngOnInit(): void {

    this.RefreshData()

    this.users = [
      { id: 1, Name: 'محمود نافع' },
      { id: 2, Name: 'محمود نافع' }
    ];

    this.delayedProjects = [
      {
        user: 'adwawd',
        customerName: 'adawdv',
        projectStatus: 4,
        startDate: new Date(),
        endDate: new Date(),
      },
    ];
    this.latedProjects = [

      {
        user: 'adwawd',
        customerName: 'adawdv',
        projectStatus: 0,
        startDate: new Date(),
        endDate: new Date(),
      },
    ];

    this.projects = [
      {
        Date: '000056',
        BondNumber: '2023-06-13',
        BondType: 'أجل',
        RegistrationNumber: 50,
        accountCode: 50,
        accountName: 50,
        Statement: '000056',
        debtor: '2023-06-13',
        Creditor: 'أجل',
        referenceNumber: 'أجل',
      },
      {
        Date: '000056',
        BondNumber: '2023-06-13',
        BondType: 'أجل',
        RegistrationNumber: 50,
        accountCode: 50,
        accountName: 50,
        Statement: '000056',
        debtor: '2023-06-13',
        Creditor: 'أجل',
        referenceNumber: 'أجل',
      },
      {
        Date: '000056',
        BondNumber: '2023-06-13',
        BondType: 'أجل',
        RegistrationNumber: 50,
        accountCode: 50,
        accountName: 50,
        Statement: '000056',
        debtor: '2023-06-13',
        Creditor: 'أجل',
        referenceNumber: 'أجل',
      },
      {
        Date: '000056',
        BondNumber: '2023-06-13',
        BondType: 'أجل',
        RegistrationNumber: 50,
        accountCode: 50,
        accountName: 50,
        Statement: '000056',
        debtor: '2023-06-13',
        Creditor: 'أجل',
        referenceNumber: 'أجل',
      },
      {
        Date: '000056',
        BondNumber: '2023-06-13',
        BondType: 'أجل',
        RegistrationNumber: 50,
        accountCode: 50,
        accountName: 50,
        Statement: '000056',
        debtor: '2023-06-13',
        Creditor: 'أجل',
        referenceNumber: 'أجل',
      },
    ];

    this.userPermissions = [
      {
        userName: 'adawdawd',
        watch: false,
        add: true,
        edit: true,
        delete: false,
      },
      {
        userName: 'adawdawd',
        watch: false,
        add: true,
        edit: true,
        delete: false,
      },
      {
        userName: 'adawdawd',
        watch: false,
        add: true,
        edit: true,
        delete: true,
      },
      {
        userName: 'adawdawd',
        watch: false,
        add: false,
        edit: true,
        delete: false,
      },
      {
        userName: 'adawdawd',
        watch: false,
        add: true,
        edit: true,
        delete: false,
      },
      {
        userName: 'adawdawd',
        watch: true,
        add: true,
        edit: true,
        delete: false,
      },
      {
        userName: 'adawdawd',
        watch: true,
        add: true,
        edit: true,
        delete: true,
      },
    ];

    this.projectsDataSource = new MatTableDataSource();

    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );

    this.projectGoalsDataSource = new MatTableDataSource();

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


  data: any = {
    filter: {
      enable: false,
      date: null,
      search_CustomerName: null,
      search_projectId: null,
      DateFrom_P: null,
      DateTo_P: null,
      isChecked: false,
      ToJournal: null,
      FromJournal: null,
    }
  };
  projectsDataSourceTemp: any = [];
  DataSource: any
  sumcredit: any = 0
  sumdepit: any = 0
  RefreshData() {

    var _voucherFilterVM = new ReportCustomer();
    if (this.data.filter.FromJournal != null && this.data.filter.ToJournal != null) {
      _voucherFilterVM.ToJournal = this.data.filter.ToJournal;
      _voucherFilterVM.FromJournal = this.data.filter.FromJournal;
    }
    if (this.data.filter.DateFrom_P != null && this.data.filter.DateTo_P != null) {
      _voucherFilterVM.dateFrom = this.data.filter.DateFrom_P.toString();
      _voucherFilterVM.dateTo = this.data.filter.DateTo_P.toString();
    }
    var obj = _voucherFilterVM;
    this._accountsreportsService.GetAllJournals(obj).subscribe((data: any) => {

      this.sumcredit = 0
      this.sumdepit = 0
      data.result.forEach((element: any) => {
        this.sumcredit += Number(element.credit)
        this.sumdepit += Number(element.depit)
      });
      this.projectsDataSource = new MatTableDataSource(data.result);
      this.projectsDataSourceTemp = data.result;
      this.DataSource = data.result;

      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
    }, (err) => {

      this.sumcredit = 0
      this.sumdepit = 0
    }
    );
  }


  chickJournal() {
    if (this.data.filter.enable == true) {
      this.data.filter.ToJournal = null
      this.data.filter.FromJournal = null
    } else {
      this.data.filter.DateFrom_P = null
      this.data.filter.DateTo_P = null
    }
  }
  CheckDate(event: any) {
    if (event != null) {
      this.data.filter.DateFrom_P = this._sharedService.date_TO_String(event[0]);
      this.data.filter.DateTo_P = this._sharedService.date_TO_String(event[1]);
      this.RefreshData();
    }
    else {
      this.data.filter.DateFrom_P = null;
      this.data.filter.DateTo_P = null;
      this.RefreshData();
    }
  }


  JournalData() {
    if (this.data.filter.ToJournal < this.data.filter.FromJournal) {
      this.toast.error('قيمة القبد الانتهاء يجب ان يكون اكبر من قيمة القبد البدء');
      return
    } else {
      this.RefreshData();
    }
  }
  valapplyFilter: any

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    this.valapplyFilter = val
    const tempsource = this.projectsDataSourceTemp.filter(function (d: any) {
      return (d.transactionDate !=null ? d.transactionDate.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.invoiceNumber !=null ?d.invoiceNumber.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.typeName !=null ?d.typeName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.journalNo !=null ?d.journalNo.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.accountCode !=null ?d.accountCode.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.accountName !=null ?d.accountName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.notes !=null ?d.notes.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.depit !=null ?d.depit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.credit !=null ?d.credit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
    });

    this.sumcredit = 0
    this.sumdepit = 0
    tempsource.forEach((element: any) => {
      this.sumcredit += Number(element.credit)
      this.sumdepit += Number(element.depit)
    });
    this.projectsDataSource = new MatTableDataSource(tempsource);
    this.DataSource = tempsource
    this.projectsDataSource.paginator = this.paginator;
    this.projectsDataSource.sort = this.sort;
  }
  printsumcredit:any
  printsumdepit:any
  OrganizationData: any
  environmentPho: any
  dateprint: any
  BranchName:any
  printprojectsDataSource: any = []
  getPrintdata(id: any) {
    var _voucherFilterVM = new ReportCustomer();
    if (this.data.filter.FromJournal != null && this.data.filter.ToJournal != null) {
      _voucherFilterVM.ToJournal = this.data.filter.ToJournal;
      _voucherFilterVM.FromJournal = this.data.filter.FromJournal;
    }
    if (this.data.filter.DateFrom_P != null && this.data.filter.DateTo_P != null) {
      _voucherFilterVM.dateFrom = this.data.filter.DateFrom_P.toString();
      _voucherFilterVM.dateTo = this.data.filter.DateTo_P.toString();
    }
    _voucherFilterVM.SortedlistJournalNo=[]
    _voucherFilterVM.SortedlistAccountCode=[]


    this.DataSource.forEach((element: any) => {
      _voucherFilterVM.SortedlistJournalNo.push(element.transactionId)
      _voucherFilterVM.SortedlistAccountCode.push(element.accountCode)
    });
    var obj = _voucherFilterVM;
    this._accountsreportsService.GetReportGrid(obj).subscribe((data: any) => {

      this.printsumcredit = 0
      this.printsumdepit = 0
      data.transactionVM.forEach((element: any) => {
        this.printsumcredit += Number(element.credit)
        this.printsumdepit += Number(element.depit)
      });
      this.printprojectsDataSource = [];
      const val = this.valapplyFilter;
      this.dateprint = data.dateTimeNow
      this.OrganizationData = data.org_VD;
              this.BranchName = data.branchName;

      this.environmentPho = environment.PhotoURL + this.OrganizationData.logoUrl;
      const tempsource = data.transactionVM.filter(function (d: any) {
          return (d.transactionDate !=null ? d.transactionDate.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.invoiceNumber !=null ?d.invoiceNumber.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.typeName !=null ?d.typeName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.journalNo !=null ?d.journalNo.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.accountCode !=null ?d.accountCode.toString().toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.accountName !=null ?d.accountName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.notes !=null ?d.notes.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.depit !=null ?d.depit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.credit !=null ?d.credit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
      });
      this.printsumcredit = 0
      this.printsumdepit = 0
      tempsource.forEach((element: any) => {
        this.printsumcredit += Number(element.credit)
        this.printsumdepit += Number(element.depit)
      });


      this.printprojectsDataSource = tempsource;

      setTimeout(() => {
        this.print.print(id, environment.printConfig);
      }, 500);
    }, (err) => {

      this.printsumcredit = 0
      this.printsumdepit = 0
    }
    );
  }





  exportData() {
    let x = [];

    for (let index = 0; index < this.DataSource.length; index++) {

      x.push({
        transactionDate: this.DataSource[index].transactionDate,
        invoiceNumber: this.DataSource[index].invoiceNumber,
        typeName: this.DataSource[index].typeName,
        journalNo: this.DataSource[index].journalNo,
        accountCode: this.DataSource[index].accountCode,
        accountName: this.DataSource[index].accountName,
        notes: this.DataSource[index].notes,
        depit: this.DataSource[index].depit,
        credit: this.DataSource[index].credit,
      })
    }
    
    x.push({
      transactionDate: null,
      invoiceNumber: null,
      typeName:  "الاجمالي",
      journalNo: null,
      accountCode: null,
      accountName: null,
      notes: null,
      depit: this.sumdepit,
      credit: this.sumcredit,
    })
    this.lang == "ar" ? this._accountsreportsService.customExportExcel(x, "اليومية العامة") :
    this._accountsreportsService.customExportExcel(x, "general journal");
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

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.userPermissionsDataSource.filter = filterValue.trim().toLowerCase();
  // }
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
