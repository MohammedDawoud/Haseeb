import { Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SelectionModel } from '@angular/cdk/collections';
import printJS from 'print-js'
import {  BsModalRef } from 'ngx-bootstrap/modal';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { SharedService } from 'src/app/core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxPrintElementService } from 'ngx-print-element';
import { RestApiService } from 'src/app/shared/services/api.service';
import { EntryReturnService } from 'src/app/core/services/acc_Services/expense-return.service';
import { VoucherFilterVM } from 'src/app/core/Classes/ViewModels/voucherFilterVM';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-expense-return',
  templateUrl: './expense-return.component.html',
  styleUrls: ['./expense-return.component.scss']
})

export class ExpenseReturnComponent implements OnInit{

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
      ar: '  مردود المصروفات ',
      en: 'Expense return ',
    },
  };


  selectedUser: any;
  users: any;

  closeResult = '';


  showStats = false;
  showFilters = false;
  showTable = false;

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

    'invoiceNumber',
    'postDate',
    'payTypeName',
    'journalNumber',
    'notes',
    'accountNameRet',
    'invoiceValue',
    'taxAmount',
    'totalValue',
    'radName',
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
  lang: any = 'ar';
  endDate = new Date();
  constructor(private modalService: NgbModal,
    private entryReturnService: EntryReturnService,
    private toast: ToastrService,
    private api: RestApiService,
    private print: NgxPrintElementService,
    private translate: TranslateService,
    private _sharedService: SharedService,) {
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();
    api.lang.subscribe((res) => {
      this.lang = res;
    });
  }
  BondConditionList:any = []
  OrganizationData: any
  environmentPho: any
  dateprint: any
  ngOnInit(): void {



    this.api.GetOrganizationDataLogin().subscribe((data: any) => {
      this.OrganizationData = data.result
      this.dateprint = new Date()
      this.environmentPho = environment.PhotoURL + this.OrganizationData.logoUrl;
    })
    this.FillAccountsSelect()
    this.RefreshData()
    this.projectsDataSource = new MatTableDataSource();

    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );

    this.projectGoalsDataSource = new MatTableDataSource(this.projectGoals);

    this.projectUsersDataSource = new MatTableDataSource(this.projectUsers);

    this.projectTasksDataSource = new MatTableDataSource(this.projectTasks);

  this.BondConditionList = [
    { id: 3, name: { ar: 'الكل', en: 'All' } },
    { id: 1, name: { ar: 'ملغي', en: 'Canceled' } },
    { id: 2, name: { ar: 'ساري', en: 'Active' } },
  ];

  }

  load_accountIds: any;
  FillAccountsSelect() {
    this.entryReturnService.FillAccountsSelect().subscribe(data => {
      this.load_accountIds = data;
    });
  }
  ngAfterViewInit() {
    // this.open(this.smartModal, null, 'smartModal');
  }

  open(content: any, data?: any, type?: any) {
    if (data && type == 'edit') {
      this.modalDetails = data;
      this.modalDetails['id'] = 1;
    }
    if (type == 'reverseConstraintModal') {
      this.DeletePayVoucherId = data.invoiceId
    }
    if(type=="accountingentryModal"){
      this.GetAllPayJournalsByInvIDRet(data.invoiceId);
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


  dataInvoice: any = {
    filter: {
      enable: false,
      date: null,
      DateFrom_P :null,
      DateTo_P :null,
      isChecked:false,
      Type:5,
      AccountId:null,
      Status:null,
    }
  };



  CheckDate(event: any) {
    if (event != null) {
      this.dataInvoice.filter.DateFrom_P = this._sharedService.date_TO_String(event[0]);
      this.dataInvoice.filter.DateTo_P = this._sharedService.date_TO_String(event[1]);
      this.RefreshData();
    }
    else {
      this.dataInvoice.filter.DateFrom_P = null;
      this.dataInvoice.filter.date = null;
      this.dataInvoice.filter.DateTo_P = null;
      this.RefreshData();
    }
  }
  projectsDataSourceTemp:any=[]
  RefreshData(){
    var _voucherFilterVM=new VoucherFilterVM();
    _voucherFilterVM.type=this.dataInvoice.filter.Type;
    _voucherFilterVM.accountId=this.dataInvoice.filter.AccountId??0;
    _voucherFilterVM.isSearch=true;
    _voucherFilterVM.status=this.dataInvoice.filter.Status;
    if(this.dataInvoice.filter.DateFrom_P!=null && this.dataInvoice.filter.DateTo_P!=null){
      _voucherFilterVM.dateFrom=this.dataInvoice.filter.DateFrom_P;
      _voucherFilterVM.dateTo=this.dataInvoice.filter.DateTo_P;
      _voucherFilterVM.isChecked=true;
    }
    else{
      _voucherFilterVM.isChecked=false;
    }

    var obj=_voucherFilterVM;
    this.entryReturnService.GetAllPayVouchersRet(obj).subscribe(data=>{
      this.projectsDataSource = new MatTableDataSource(data);
      this.projectsDataSourceTemp=data;
      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
    });
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

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    const tempsource = this.projectsDataSourceTemp.filter(function (d: any) {
      return (d.invoiceNumber?.toString().trim().toLowerCase().indexOf(val) !== -1 || !val)||
       (d.postDate?.toString().trim().toLowerCase().indexOf(val) !== -1 || !val)||
       (d.payTypeName?.toString().trim().toLowerCase().indexOf(val) !== -1 || !val)||
       (d.journalNumber?.toString().trim().toLowerCase().indexOf(val) !== -1 || !val)||
       (d.notes?.toString().trim().toLowerCase().indexOf(val) !== -1 || !val)||
       (d.accountNameRet?.toString().trim().toLowerCase().indexOf(val) !== -1 || !val)||
       (d.invoiceValue?.toString().trim().toLowerCase().indexOf(val) !== -1 || !val)||
       (d.taxAmount?.toString().trim().toLowerCase().indexOf(val) !== -1 || !val)||
       (d.totalValue?.toString().trim().toLowerCase().indexOf(val) !== -1 || !val)||
       (d.radName?.toString().trim().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.projectsDataSource = new MatTableDataSource(tempsource);
    this.projectsDataSource.paginator = this.paginator;
    this.projectsDataSource.sort = this.sort;
  }


  DeletePayVoucherId:any
  SavePayVoucherForServicesRet(modal:any){
    this.entryReturnService.SavePayVoucherForServicesRet(this.DeletePayVoucherId).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.toast.success(this.translate.instant(data.reasonPhrase), this.translate.instant('Message'));
      this.RefreshData();
      modal.dismiss()
      this.DeletePayVoucherId = null
        }
        else{
          this.DeletePayVoucherId = null
          this.toast.error(this.translate.instant(data.reasonPhrase), this.translate.instant('Message'));
        }
      },
      (error) => {
        this.DeletePayVoucherId = null
        this.toast.error(this.translate.instant(error.reasonPhrase), this.translate.instant('Message'));
      }
    );
  }

  PrintPayVoucherRet(obj: any) {
    this.entryReturnService.PrintPayVoucherRet(obj.invoiceId).subscribe((data:any) => {
      // this.EntryVoucherPrintData = data;
      // if (this.EntryVoucherPrintData?.org_VD.logoUrl)
      //   this.CustomData.OrgImg = environment.PhotoURL + this.EntryVoucherPrintData?.org_VD.logoUrl;
      // else this.CustomData.OrgImg = null;
      var PDFPath=environment.PhotoURL+data.reasonPhrase;
      printJS({printable:PDFPath, type:'pdf', showModal:true});
    // this.downloadFileUrl(data?.reasonPhrase)
    });
  }

downloadFileUrl(file: any) {
    try
    {
      var link=environment.PhotoURL+file;
      window.open(link, '_blank');
    }
    catch (error)
    {
      this.toast.error("تأكد من الملف", 'رسالة');
    }
  }






  datePrintJournals: any = new Date()


  AllJournalEntries:any=[];
  GetAllPayJournalsByInvIDRet(invid:any){
    this.entryReturnService.GetAllPayJournalsByInvIDRet(invid).subscribe(data=>{
      this.AllJournalEntries=data.result;
    });
  }

  get totaldepit() {
    var sum=0;
    this.AllJournalEntries.forEach((element: any) => {
      sum=+parseFloat(sum.toString()).toFixed(2)+ +parseFloat(element.depit.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }

  get totalcredit() {
    var sum=0;
    this.AllJournalEntries.forEach((element: any) => {
      sum=+parseFloat(sum.toString()).toFixed(2)+ +parseFloat(element.credit.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }

  PrintJournalsVyInvIdRetPurchase() {
    if (this.AllJournalEntries[0].invoiceId) {
      this.entryReturnService.PrintJournalsVyInvIdRetPurchase(this.AllJournalEntries[0].invoiceId).subscribe(data => {
        this.print.print('reportaccountingentryModal', environment.printConfig);
      });
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
  }

  // Delete row
  delete(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    this.rows.splice(rowIndex, 1);
  }

  selectGoalForProject(index: any) {}

  addNewMission() {}

  onSort(event: any) {
    console.log(event);
  }
// ############### send sms

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
    files: [],
    clients: [],
    branches: [],
    cities: [],
    filesTypes: [],
  };
  modal?: BsModalRef;
  sendEMAIL(sms: any) {
    console.log(sms);
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

