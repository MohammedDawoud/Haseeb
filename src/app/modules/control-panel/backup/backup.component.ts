import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DatabaseBackup } from 'src/app/core/Classes/DomainObjects/databaseBackup';
import { BackupService } from 'src/app/core/services/sys_Services/backup.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.scss'],
})
export class BackupComponent {
  title: any = {
    main: {
      name: {
        ar: 'لوحة التحكم',
        en: 'Control Panel',
      },
      link: '/controlpanel',
    },
    sub: {
      ar: 'النسخ الاحتياطي ',
      en: ' Create a backup',
    },
  };
  selectedUser: any;
  users: any;

  closeResult = '';

  displayedColumns: string[] = [
    'backupId',
    'date',
    'user',
    'size',
    'operations',
  ];

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  backups: any;

  formGroup = this.fb.group({});

  today = new Date();

  backupDetails: any = false;

  remeberOptions = [
    { ar: 'شهر', en: 'month', value: 3 },
    { ar: 'اسبوع', en: 'week', value: 2 },
    { ar: 'يوم', en: 'day', value: 1 },
  ];
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private _backup: BackupService,
    private toast: ToastrService,
    private translate: TranslateService
  ) {
    this.dataSource = new MatTableDataSource([{}]);
  }

  ngOnInit(): void {
    this.GetAllBackupData();
    this.GetAllStatistics();
    this.FillAllUsersTodropdown();
    // this.users = [
    //   { id: 1, Name: 'محمود نافع' },
    //   { id: 2, Name: 'محمود نافع' },
    //   { id: 3, Name: 'محمود نافع' },
    //   { id: 4, Name: 'محمود نافع' },
    //   { id: 5, Name: 'محمود نافع' },
    //   { id: 6, Name: 'محمود نافع' },
    //   { id: 7, Name: 'محمود نافع' },
    //   { id: 8, Name: 'محمود نافع' },
    //   { id: 9, Name: 'محمود نافع' },
    //   { id: 10, Name: 'محمود نافع' },
    //   { id: 11, Name: 'محمود نافع' },
    // ];

    this.backups = [
      {
        backupId: 1684684,
        date: new Date(),
        user: 'dvfrsf',
        size: '10mb',
      },
      {
        backupId: 1684684,
        date: new Date(),
        user: 'dvfrsf',
        size: '10mb',
      },
      {
        backupId: 1684684,
        date: new Date(),
        user: 'dvfrsf',
        size: '10mb',
      },
    ];

    // this.dataSource = new MatTableDataSource(this.backups);
  }

  //#region Backup//////////////////////////////////////////////////////////////////////////////////////////

  BackupatisticsModel: any = {
    backupId: 0,
    projectCount: 0,
    projectArchivedCount: 0,
    branchesCount: 0,
    usersCount: 0,
    customercount: 0,
    totalDetailedExpensed: 0,
    totalDetailedRevenu: 0,

    lastProjectId: 0,
    lastProjectNo: 0,

    lastInvoiceId: 0,
    lastInvoiceNumber: 0,
    lastInvoiceAddUser: 0,

    lastInvoiceRetId: 0,
    lastInvoiceRetNumber: 0,
    lastInvoiceRetAddUser: 0,

    lastRevoucernId: 0,
    lastRevoucernNumber: 0,
    lastRevoucernAddUser: 0,

    lastpayvoucernId: 0,
    lastpayvoucernNumber: 0,
    lastpayvoucernAddUser: 0,

    lastEntyvoucherId: 0,
    lastEntyvoucherNumber: 0,
    lastEntyvoucherAddUser: 0,

    lastCustomerId: 0,
    lastCustomerName: 0,
    lastCustomerbranchName: 0,

    lastEmpContractId: 0,
    lastEmpContractCode: 0,
    lastEmpContractAddUsers: 0,
  };

  GetAllBackupData() {
    this._backup.GetAllBackupData().subscribe((data) => {
      debugger;
      this.dataSource = new MatTableDataSource(data.result);
    });
  }

  FillAllUsersTodropdown() {
    this._backup.FillAllUsersTodropdown().subscribe((data) => {
      debugger;
      this.users = data;
    });
  }
  GetAllStatistics() {
    this._backup.GetAllStatistics().subscribe((data) => {
      debugger;
      this.fillbackupdata(data);
      console.log(data);
    });
  }

  fillbackupdata(data: any) {
    debugger;
    this.BackupatisticsModel.projectCount = data.projectCount;
    this.BackupatisticsModel.projectArchivedCount = data.projectArchivedCount;
    this.BackupatisticsModel.branchesCount = data.branchesCount;
    this.BackupatisticsModel.usersCount = data.usersCount;
    this.BackupatisticsModel.customercount = data.customercount;
    this.BackupatisticsModel.totalDetailedExpensed = data.totalDetailedExpensed;
    this.BackupatisticsModel.totalDetailedRevenu = data.totalDetailedRevenu;

    this.BackupatisticsModel.lastProjectId = data.lastProject.projectId;
    this.BackupatisticsModel.lastProjectNo = data.lastProject.projectNo;

    this.BackupatisticsModel.lastInvoiceId = data.lastInvoice.invoiceId;
    this.BackupatisticsModel.lastInvoiceNumber = data.lastInvoice.invoiceNumber;
    this.BackupatisticsModel.lastInvoiceAddUser = data.lastInvoice.addUser;

    this.BackupatisticsModel.lastInvoiceRetId = data.lastInvoiceRet.invoiceId;
    this.BackupatisticsModel.lastInvoiceRetNumber =
      data.lastInvoiceRet.invoiceNumber;
    this.BackupatisticsModel.lastInvoiceRetAddUser =
      data.lastInvoiceRet.addUser;

    this.BackupatisticsModel.lastRevoucernId = data.lastRevoucern.invoiceId;
    this.BackupatisticsModel.lastRevoucernNumber =
      data.lastRevoucern.invoiceNumber;
    this.BackupatisticsModel.lastRevoucernAddUser = data.lastRevoucern.addUser;

    this.BackupatisticsModel.lastpayvoucernId = data.lastpayvoucern.invoiceId;
    this.BackupatisticsModel.lastpayvoucernNumber =
      data.lastpayvoucern.invoiceNumber;
    this.BackupatisticsModel.lastpayvoucernAddUser =
      data.lastpayvoucern.addUser;

    this.BackupatisticsModel.lastEntyvoucherId = data.lastEntyvoucher.invoiceId;
    this.BackupatisticsModel.lastEntyvoucherNumber =
      data.lastEntyvoucher.invoiceNumber;
    this.BackupatisticsModel.lastEntyvoucherAddUser =
      data.lastEntyvoucher.addUser;

    this.BackupatisticsModel.lastCustomerId = data.lastCustomer.customerId;
    this.BackupatisticsModel.lastCustomerName = data.lastCustomer.customerName;
    this.BackupatisticsModel.lastCustomerbranchName =
      data.lastCustomer.branchName;

    this.BackupatisticsModel.lastEmpContractId =
      data.lastEmpContract.contractId;
    this.BackupatisticsModel.lastEmpContractCode =
      data.lastEmpContract.contractCode;
    this.BackupatisticsModel.lastEmpContractAddUsers =
      data.lastEmpContract.addUsers;
  }

  filldata(data: any) {
    this._backup.GetBackupById(data.backupId).subscribe((data) => {
      debugger;
      this.BackupatisticsModel.projectCount = data.projectCount;
      this.BackupatisticsModel.projectArchivedCount = data.projectArchivedCount;
      this.BackupatisticsModel.branchesCount = data.branchesCount;
      this.BackupatisticsModel.usersCount = data.usersCount;
      this.BackupatisticsModel.customercount = data.customercount;
      this.BackupatisticsModel.totalDetailedExpensed =
        data.totalDetailedExpensed;
      this.BackupatisticsModel.totalDetailedRevenu = data.totalDetailedRevenu;

      this.BackupatisticsModel.lastProjectId = data.lastProject.projectId;
      this.BackupatisticsModel.lastProjectNo = data.lastProject.projectNo;

      this.BackupatisticsModel.lastInvoiceId = data.lastInvoice.invoiceId;
      this.BackupatisticsModel.lastInvoiceNumber =
        data.lastInvoice.invoiceNumber;
      this.BackupatisticsModel.lastInvoiceAddUser = data.lastInvoice.addUser;

      this.BackupatisticsModel.lastInvoiceRetId = data.lastInvoiceRet.invoiceId;
      this.BackupatisticsModel.lastInvoiceRetNumber =
        data.lastInvoiceRet.invoiceNumber;
      this.BackupatisticsModel.lastInvoiceRetAddUser =
        data.lastInvoiceRet.addUser;

      this.BackupatisticsModel.lastRevoucernId = data.lastRevoucern.invoiceId;
      this.BackupatisticsModel.lastRevoucernNumber =
        data.lastRevoucern.invoiceNumber;
      this.BackupatisticsModel.lastRevoucernAddUser =
        data.lastRevoucern.addUser;

      this.BackupatisticsModel.lastpayvoucernId = data.lastpayvoucern.invoiceId;
      this.BackupatisticsModel.lastpayvoucernNumber =
        data.lastpayvoucern.invoiceNumber;
      this.BackupatisticsModel.lastpayvoucernAddUser =
        data.lastpayvoucern.addUser;

      this.BackupatisticsModel.lastEntyvoucherId =
        data.lastEntyvoucher.invoiceId;
      this.BackupatisticsModel.lastEntyvoucherNumber =
        data.lastEntyvoucher.invoiceNumber;
      this.BackupatisticsModel.lastEntyvoucherAddUser =
        data.lastEntyvoucher.addUser;

      this.BackupatisticsModel.lastCustomerId = data.lastCustomer.customerId;
      this.BackupatisticsModel.lastCustomerName =
        data.lastCustomer.customerName;
      this.BackupatisticsModel.lastCustomerbranchName =
        data.lastCustomer.branchName;

      this.BackupatisticsModel.lastEmpContractId =
        data.lastEmpContract.contractId;
      this.BackupatisticsModel.lastEmpContractCode =
        data.lastEmpContract.contractCode;
      this.BackupatisticsModel.lastEmpContractAddUsers =
        data.lastEmpContract.addUsers;
    });
  }
  download(data: any) {
    this._backup.DownloadBackupFile(data.backupId).subscribe((data) => {
      debugger;
      console.log(data);
      var link = environment.PhotoURL + data.filepath;

      window.open(link, '_blank');
    });
  }
  Deletebackup() {
    this._backup.DeleteBackup(this.deletedbackid).subscribe(
      (data) => {
        debugger;
        if (data.statusCode == 200) {
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );

          this.modalService.dismissAll('Delete success');
          this.GetAllBackupData();
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
  SaveDBackup_ActiveYear() {
    debugger;
    this.isstarted = true;
    var _back = new DatabaseBackup();
    _back.backupId = this.BackupatisticsModel.backupId;

    _back.totalProject = this.BackupatisticsModel.projectCount;
    _back.totalarchiveProject = this.BackupatisticsModel.projectArchivedCount;
    _back.totalClient = this.BackupatisticsModel.customercount;
    _back.totalExp =
      this.BackupatisticsModel.totalDetailedExpensed == null
        ? '0'
        : this.BackupatisticsModel.totalDetailedExpensed.toString();
    _back.totalReve =
      this.BackupatisticsModel.totalDetailedRevenu == null
        ? '0'
        : this.BackupatisticsModel.totalDetailedRevenu.toString();
    _back.totalBranches = this.BackupatisticsModel.branchesCount;
    _back.totalUsers = this.BackupatisticsModel.usersCount;
    _back.lastPro = this.BackupatisticsModel.lastProjectId;
    _back.lastinvoice = this.BackupatisticsModel.lastInvoiceId;

    _back.lastVoucherRet = this.BackupatisticsModel.lastInvoiceRetId;
    _back.lastreVoucher = this.BackupatisticsModel.lastRevoucernId;
    _back.lastpayVoucher = this.BackupatisticsModel.lastpayvoucernId;
    _back.lastEntyvoucher = this.BackupatisticsModel.lastEntyvoucherId;
    _back.lasEmpContract = this.BackupatisticsModel.lastEmpContractId;
    _back.lasCustomer = this.BackupatisticsModel.lastCustomerId;
    this._backup.SaveDBackup_ActiveYear(_back).subscribe(
      (data) => {
        debugger;
        if (data.statusCode == 200) {
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
          this.modalService.dismissAll('Delete success');
          this.GetAllBackupData();
          this.isstarted = false;
        } else {
          this.toast.error(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
          this.isstarted = false;
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
        this.isstarted = false;
      }
    );
  }

  SaveBackup() {
    debugger;
    this.isstarted = true;
    var _back = new DatabaseBackup();
    _back.backupId = this.BackupatisticsModel.backupId;

    _back.totalProject = this.BackupatisticsModel.projectCount;
    _back.totalarchiveProject = this.BackupatisticsModel.projectArchivedCount;
    _back.totalClient = this.BackupatisticsModel.customercount;
    _back.totalExp =
      this.BackupatisticsModel.totalDetailedExpensed == null
        ? '0'
        : this.BackupatisticsModel.totalDetailedExpensed.toString();
    _back.totalReve =
      this.BackupatisticsModel.totalDetailedRevenu == null
        ? '0'
        : this.BackupatisticsModel.totalDetailedRevenu.toString();
    _back.totalBranches = this.BackupatisticsModel.branchesCount;
    _back.totalUsers = this.BackupatisticsModel.usersCount;
    _back.lastPro = this.BackupatisticsModel.lastProjectId;
    _back.lastinvoice = this.BackupatisticsModel.lastInvoiceId;

    _back.lastVoucherRet = this.BackupatisticsModel.lastInvoiceRetId;
    _back.lastreVoucher = this.BackupatisticsModel.lastRevoucernId;
    _back.lastpayVoucher = this.BackupatisticsModel.lastpayvoucernId;
    _back.lastEntyvoucher = this.BackupatisticsModel.lastEntyvoucherId;
    _back.lasEmpContract = this.BackupatisticsModel.lastEmpContractId;
    _back.lasCustomer = this.BackupatisticsModel.lastCustomerId;
    this._backup.SaveBackup(_back).subscribe(
      (data) => {
        debugger;
        if (data.statusCode == 200) {
          this.GetAllBackupData();

          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
          this.modalService.dismissAll('Delete success');
          this.isstarted = false;
        } else {
          this.toast.error(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
          this.isstarted = false;
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
        this.isstarted = false;
      }
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  deletedbackid: any;
  isstarted = false;
  open(content: any, data?: any, type?: any, info?: any) {
    if (data && type == 'details') {
      this.backupDetails = true;
    }
    if (data && type == 'deleteback') {
      this.deletedbackid = data.backupId;
    }
    if (type == 'addnotification') {
      this.GetAllBackupAlert();
    }
    if (type == 'addback') {
      this.isstarted = false;
    }
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
        centered: true,
        backdrop: 'static',
        keyboard: false,
      })
      .result.then(
        (result) => {
          this.backupDetails = false;

          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any, type?: any): string {
    this.backupDetails = false;

    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  GetAllBackupAlert() {
    this._backup.GetAllBackupAlert().subscribe((data) => {
      debugger;
      this.employees = data.result;
    });
  }

  GetUserById(userid: any, index: any) {
    debugger;

    this._backup.GetUserById(userid).subscribe((data) => {
      debugger;
      this.employees[index].email = data.result.email;
      this.employees[index].mobile = data.result.mobile;
    });
  }

  savebacupalert() {
    debugger;
    const newArray = this.employees.map((item: any) => ({
      userId: item.userId,
      alertTimeType: item.alertTimeType,
      alertId: item.alertId,
    }));
    const hasNullIdOrName = newArray.some(
      (item: any) => item.userId == null || item.alertTimeType == null
    );

    if (hasNullIdOrName) {
      this.toast.error('من فضلك اكمل البيانات', 'رسالة');
      return;
    }

    this._backup.SaveBackupalert(newArray).subscribe(
      (data) => {
        debugger;
        if (data.statusCode == 200) {
          this.GetAllBackupAlert();

          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
          this.modalService.dismissAll('Delete success');
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

  employees: any = [];
  addEmployee(index: any) {
    console.log(this.employees, index);

    this.employees?.push({
      name: '',
      email: '',
      phone: '',
      time: '',
    });
  }

  deleteEmployee(index: any, alertId: any) {
    debugger;
    this.employees?.splice(index, 1);
    this._backup.DeleteBackupalert(alertId).subscribe(
      (data) => {
        debugger;
        if (data.statusCode == 200) {
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );

          this.modalService.dismissAll('Delete success');
          this.GetAllBackupAlert();
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

  downloadBackup() {}
  doBackUp() {}
  confirm() {}
}
