import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SelectionModel } from '@angular/cdk/collections';

import {  BsModalRef } from 'ngx-bootstrap/modal';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { CanceledSalesService } from 'src/app/core/services/acc_Services/canceled-sales.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPrintElementService } from 'ngx-print-element';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/core/services/shared.service';
import { ReportCustomer } from 'src/app/core/Classes/ViewModels/reportCustomer';
import { VoucherFilterVM } from 'src/app/core/Classes/ViewModels/voucherFilterVM';

@Component({
  selector: 'app-canceled-sales-invoice',
  templateUrl: './canceled-sales-invoice.component.html',
  styleUrls: ['./canceled-sales-invoice.component.scss']
})

export class CanceledSalesInvoiceComponent implements OnInit{

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
      ar: 'متابعة الفواتير الملغاة ',
      en: 'Follow up on canceled invoices',
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
    'invoiceRetId',
    'date',
    'invoiceNumber',
    'payTypeName',
    'journalNumber',
    'notes',
    'customerName',
    'invoiceValue',
    'taxAmount',
    'totalValue',
  ];


  projectUsersColumns: string[] = ['name', 'responsibility'];
  projectTasksColumns: string[] = ['taskName', 'name', 'duration'];

  userPermissionsDataSource = new MatTableDataSource();

  projectGoalsDataSource = new MatTableDataSource();

  projectUsersDataSource = new MatTableDataSource();
  projectTasksDataSource = new MatTableDataSource();

  projectsDataSource = new MatTableDataSource();

  modalDetails: any = {
    BondNumber: null,
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
  lang: any = 'ar';
  constructor(private modalService: NgbModal,
    private canceledSalesService: CanceledSalesService,
    private toast: ToastrService,
    private api: RestApiService,
    private print: NgxPrintElementService,
    private _sharedService: SharedService,) {
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();
    api.lang.subscribe((res) => {
      this.lang = res;
    });
  }

  ngOnInit(): void {

    this.FillAllCustomerSelectByAllMrdod()
    this.FillAllProjectSelectByAllMrdod()
    this.RefreshData()


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

    this.modalService
    // .open(content, {
    //   ariaLabelledBy: 'modal-basic-title',
    //   size: type == 'runningTasksModal' ? 'xxl' : 'xl' ,
    //   centered: type ? false : true
    // })

      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg' ,
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
    }
  };
  load_customers: any;
  FillAllCustomerSelectByAllMrdod() {
    this.canceledSalesService.FillAllCustomerSelectByAllMrdod().subscribe(data => {
      this.load_customers = data;
    });
  }
  FillAllProjectSelectByAllMrdod() {
    this.canceledSalesService.FillAllProjectSelectByAllMrdod().subscribe(data => {
      this.load_projects = data;
    });
  }
  load_projects: any;
  FillAllProjectSelectByAllMrdod_C() {
    if (this.data.filter.search_CustomerName != null) {
      this.canceledSalesService.FillAllProjectSelectByAllMrdod_C(this.data.filter.search_CustomerName).subscribe(data => {
        this.load_projects = data;
      });
    }
    else {
      this.load_projects = [];
    }

  }







  projectsDataSourceTemp: any = [];
  DataSource: any= []
  RefreshData() {
    var _voucherFilterVM = new VoucherFilterVM();
    _voucherFilterVM.type = 2
    _voucherFilterVM.customerId = this.data.filter.search_CustomerName;
    _voucherFilterVM.projectId = this.data.filter.search_projectId;
    if (this.data.filter.DateFrom_P != null && this.data.filter.DateTo_P != null) {
      _voucherFilterVM.dateFrom = this.data.filter.DateFrom_P.toString();
      _voucherFilterVM.dateTo = this.data.filter.DateTo_P.toString();
      _voucherFilterVM.isSearch = true
    }else{
      _voucherFilterVM.isSearch = false
    }
    var obj = _voucherFilterVM;
    this.canceledSalesService.GetAllVouchersRetReport(obj).subscribe((data: any) => {
      this.projectsDataSource = new MatTableDataSource(data);
      this.projectsDataSourceTemp = data;
      this.DataSource = data;
      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
    }, (err) => {
    }
    );
  }

  valapplyFilter: any
  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    this.valapplyFilter = val
    const tempsource = this.projectsDataSourceTemp.filter(function (d: any) {
      return (d.invoiceRetId!=null?d.invoiceRetId.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.date!=null?d.date.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.invoiceNumber!=null?d.invoiceNumber.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.payTypeName!=null?d.payTypeName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.journalNumber!=null?d.journalNumber.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.notes!=null?d.notes.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.customerName!=null?d.customerName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.invoiceValue!=null?d.invoiceValue.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.taxAmount!=null?d.taxAmount.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.totalValue!=null?d.totalValue.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
    });
    this.projectsDataSource = new MatTableDataSource(tempsource);
    this.DataSource = tempsource
    this.projectsDataSource.paginator = this.paginator;
    this.projectsDataSource.sort = this.sort;
  }

  exportData() {
    let x = [];

    for (let index = 0; index < this.DataSource.length; index++) {
      x.push({
        invoiceRetId: this.DataSource[index].invoiceRetId,
        date: this.DataSource[index].date,
        invoiceNumber: this.DataSource[index].invoiceNumber,
        payTypeName: this.DataSource[index].payTypeName,
        journalNumber: this.DataSource[index].journalNumber,
        notes: this.DataSource[index].notes,
        customerName: this.DataSource[index].customerName,
        invoiceValue:parseFloat( this.DataSource[index].invoiceValue),
        taxAmount:parseFloat( this.DataSource[index].taxAmount),
        totalValue:parseFloat( this.DataSource[index].totalValue),
      })
    }
    this.lang == "ar" ? this.canceledSalesService.customExportExcel(x, "متابعة الفواتير الملغاة") :
    this.canceledSalesService.customExportExcel(x, "Follow up on canceled invoices");

  }
  projectname: any
  CustomerName: any
  printprojectsDataSource: any
  OrganizationData: any
  environmentPho: any
  dateprint: any
  getPrintdata(id: any) {
    // var _voucherFilterVM = new ReportCustomer();
    // _voucherFilterVM.type = 2
    // _voucherFilterVM.customerId = this.data.filter.search_CustomerName;
    // _voucherFilterVM.projectId = this.data.filter.search_projectId;
    // if (this.data.filter.DateFrom_P != null && this.data.filter.DateTo_P != null) {
    //   _voucherFilterVM.dateFrom = this.data.filter.DateFrom_P.toString();
    //   _voucherFilterVM.dateTo = this.data.filter.DateTo_P.toString();
    //   _voucherFilterVM.isSearch = true
    // }else{
    //   _voucherFilterVM.isSearch = false
    // }
    // var obj = _voucherFilterVM;
    // this.canceledSalesService.VouchersRetReport(obj).subscribe((data: any) => {
      this.api.GetOrganizationDataLogin().subscribe((data: any) => {
            this.OrganizationData = data.result
            this.dateprint = new Date()
            this.environmentPho = environment.PhotoURL + this.OrganizationData.logoUrl;

            // this.printprojectsDataSource = [];
            // const val = this.valapplyFilter;
            // this.OrganizationData = data.org_VD;
      // const tempsource = data.result.filter(function (d: any) {
      //   return (d.invoiceRetId!=null?d.invoiceRetId.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
      //     || (d.date!=null?d.date.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
      //     || (d.invoiceNumber!=null?d.invoiceNumber.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
      //     || (d.payTypeName!=null?d.payTypeName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
      //     || (d.journalNumber!=null?d.journalNumber.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
      //     || (d.notes!=null?d.notes.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
      //     || (d.customerName!=null?d.customerName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
      //     || (d.invoiceValue!=null?d.invoiceValue.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
      //     || (d.taxAmount!=null?d.taxAmount.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
      //     || (d.totalValue!=null?d.totalValue.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
      // });
      // this.printprojectsDataSource = tempsource;

      setTimeout(() => {
        this.print.print(id, environment.printConfig);
      }, 1000);
    }, (err) => {
    }
    );
  }


  CheckDate(event: any) {
    if (event != null) {
      this.data.filter.DateFrom_P = this._sharedService.date_TO_String(event[0]);
      this.data.filter.DateTo_P = this._sharedService.date_TO_String(event[1]);
      this.RefreshData();
    }
    else {
      this.data.filter.DateFrom_P = null;
      this.data.filter.date = null;
      this.data.filter.DateTo_P = null;
      this.RefreshData();
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
  }

  selectGoalForProject(index: any) {}

  addNewMission() {}

  onSort(event: any) {
  }
// ############### send sms

  // data: any = {
  //   type: '0',
  //   orgEmail: 'asdwd@dwa',
  //   numbers: {
  //     all: 0,
  //     citizens: 0,
  //     investor: 0,
  //     government: 0,
  //   },
  //   fileType: {
  //     NameAr: '',
  //     Id: '',
  //     NameEn: '',
  //   },
  //   files: [],
  //   clients: [],
  //   branches: [],
  //   cities: [],
  //   filesTypes: [],
  // };
  modal?: BsModalRef;
  sendEMAIL(sms: any) {
    this.control.clear();
    this.modal?.hide();
  }

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

  sendSMS(sms: any) {
    console.log(sms);
    this.modal?.hide();
  }

  // selection in table

  selection = new SelectionModel<any>(true, []);
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.projectsDataSource.data.length;
    return numSelected === numRows;
  }
   /** Selects all rows if they are not all selected; otherwise clear selection. */

   toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.projectsDataSource.data);
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


  existValue: any = false;


}
