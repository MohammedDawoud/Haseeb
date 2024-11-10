import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { environment } from 'src/environments/environment';
import { NgxPrintElementService } from 'ngx-print-element';
import { RestApiService } from 'src/app/shared/services/api.service';
import { ReportCustomer } from 'src/app/core/Classes/ViewModels/reportCustomer';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';

import { BehaviorSubject, Subscription } from 'rxjs';
import { VoucherFilterVM } from 'src/app/core/Classes/ViewModels/voucherFilterVM';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ExportationService } from 'src/app/core/services/exportation-service/exportation.service';

@Component({
  selector: 'app-cost-center-movement',
  templateUrl: './cost-center-movement.component.html',
  styleUrls: ['./cost-center-movement.component.scss']
})

export class CostCenterMovementComponent implements OnInit {

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
      ar: ' حركة مراكز التكلفة ',
      en: 'Cost center movement',
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
    'notes',
    'depit',
    'credit',
    'balance',
    'typeName',
    'accountName',
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


  lang: any = 'ar';

  startDate = new Date();
  endDate = new Date();
  constructor(private modalService: NgbModal,
    private api: RestApiService,
    private print: NgxPrintElementService,
    private _accountsreportsService: AccountsreportsService,
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

    this.FillCostCenterSelect()


    this.projectsDataSource = new MatTableDataSource(this.projects);

    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );
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


  load_CostCenter: any;
  FillCostCenterSelect() {
    this._accountsreportsService.FillCostCenterSelect().subscribe(data => {
      this.load_CostCenter = data;
    });
  }
  data: any = {
    filter: {
      enable: false,
      date: null,
      search_CostCenter: null,
      DateFrom_P: null,
      DateTo_P: null,
      isChecked: false,
    }
  };
  projectsDataSourceTemp: any = [];
  DataSource:any
  totalDepit=0
totalCredit=0
  RefreshData() {
    var _voucherFilterVM = new VoucherFilterVM();
    _voucherFilterVM.customerId = this.data.filter.search_CostCenter;
    if (this.data.filter.DateFrom_P != null && this.data.filter.DateTo_P != null) {
      _voucherFilterVM.dateFrom = this.data.filter.DateFrom_P.toString();
      _voucherFilterVM.dateTo = this.data.filter.DateTo_P.toString();
    }
    var obj = _voucherFilterVM;
    this._accountsreportsService.GetAllCostCenterTrans(obj).subscribe((data: any) => {

        var CurrentBalance = 0;
        if(data.result.l)
        data?.result[0]?.transactions.forEach((element: any) => {
          CurrentBalance = +CurrentBalance + +element.depit - element.credit;
          element.balance = CurrentBalance
        });
        this.totalDepit=0
        this.totalCredit=0

        data?.result[0]?.transactions.forEach((element:any) => {
          this.totalDepit+=  element.depit
          this.totalCredit+= element.credit
        });



      this.projectsDataSource = new MatTableDataSource(data?.result[0]?.transactions);
      this.DataSource= data?.result[0]?.transactions;
      this.projectsDataSourceTemp = data?.result[0]?.transactions;
      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
    });
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


  valapplyFilter:any

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    this.valapplyFilter = val

    const tempsource = this.projectsDataSourceTemp.filter(function (d: any) {
      return (d.transactionDate!=null?d.transactionDate.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.notes!=null?d.notes.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.depit!=null?d.depit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.credit!=null?d.credit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.typeName!=null?d.typeName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.accountName!=null?d.accountName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.balance!=null?d.balance.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
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
        transactionDate: this.DataSource[index].transactionDate,
        notes: this.DataSource[index].notes,
        depit:parseFloat( this.DataSource[index].depit),
        credit:parseFloat( this.DataSource[index].credit),
        typeName: this.DataSource[index].typeName,
        accountName: this.DataSource[index].accountName,
        balance:parseFloat( this.DataSource[index].balance),
      })
    }
    x.push({
      transactionDate: null,
      notes: null,
      depit: this.totalDepit,
      credit: this.totalCredit,
      typeName: null,
      accountName: null,
      balance: null,
    })
    this.lang == "ar" ? this._accountsreportsService.customExportExcel(x, " حركة مراكز التكلفة") :
    this._accountsreportsService.customExportExcel(x, "Cost center movement");
}
costCenterName:any
printprojectsDataSource: any
OrganizationData:any
environmentPho:any
dateprint:any
totalDepitP:any
  totalCreditP: any
    BranchName: any;

getPrintdata(id:any) {
  var _voucherFilterVM = new ReportCustomer();
    _voucherFilterVM.customerId = this.data.filter.search_CostCenter;
    if (this.data.filter.DateFrom_P != null && this.data.filter.DateTo_P != null) {
      _voucherFilterVM.dateFrom = this.data.filter.DateFrom_P.toString();
      _voucherFilterVM.dateTo = this.data.filter.DateTo_P.toString();
    }

     _voucherFilterVM.CostCenterName=[]
    this.load_CostCenter.forEach((element:any) => {
      if (this.data.filter.search_CostCenter == element.id) {
        _voucherFilterVM.CostCenterName = element.name
      }
    });
    var obj = _voucherFilterVM;
    this._accountsreportsService.CostCenterMovementReport(obj).subscribe((data: any) => {
      this.printprojectsDataSource = [];

      const val = this.valapplyFilter;
      this.costCenterName=data.costCenterName
      this.dateprint =  data.dateTimeNow
      this.OrganizationData = data.org_VD;
                    this.BranchName = data.branchName;

      this.environmentPho=environment.PhotoURL+this.OrganizationData.logoUrl;


      var CurrentBalance = 0;

      var CurrentBalance = 0;
      data?.result[0]?.transactions.forEach((element: any) => {
        CurrentBalance = +CurrentBalance + +element.depit - element.credit;
        element.balance = CurrentBalance
      });
      this.totalDepitP=0
      this.totalCreditP=0

      data?.result[0]?.transactions.forEach((element:any) => {
        this.totalDepitP+=  element.depit
        this.totalCreditP+= element.credit
      });

      const tempsource = data?.result[0]?.transactions.filter(function (d: any) {
        return (d.transactionDate!=null?d.transactionDate.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.notes!=null?d.notes.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.depit!=null?d.depit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.credit!=null?d.credit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.typeName!=null?d.typeName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.accountName!=null?d.accountName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.balance!=null?d.balance.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
      });
      this.printprojectsDataSource = tempsource;

      setTimeout(() => {
        this.print.print(id, environment.printConfig);
      }, 1000);
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


  // Save row
  save(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    console.log('Row saved: ' + rowIndex);
    console.log(row);
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

