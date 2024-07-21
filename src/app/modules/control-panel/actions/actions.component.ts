import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SystemactionService } from 'src/app/core/services/sys_Services/systemaction.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent {
  title: any = {
    main: {
      name: {
        ar: 'لوحة التحكم',
        en: 'Control Panel',
      },
      link: '/controlpanel',
    },
    sub: {
      ar: 'سجل احداث النظام ',
      en: ' System event log',
    },
  };

  selectedUser: any;
  users: any;

  closeResult = '';

  displayedColumns: string[] = [
    'movementHistory',
    'processStatus',
    'userName',
    'branch',
    'comments',
    // 'message',
    // 'functionName',
    // 'serviceName',
    'OperationSuccess',
  ];

  displayedColumnsadmin: string[] = [
    'movementHistory',
    'processStatus',
    'userName',
    'branch',
    'comments',
    // 'message',
    'functionName',
    'serviceName',
    'OperationSuccess',
  ];

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('tasksPaginator2') tasksPaginator2!: MatPaginator;

  systemActions: any;

  today = new Date();

  backupDetails: any = false;

  movementTypes = [
    { id: 0, en: 'all', ar: 'الكل' },
    { id: 1, en: 'add', ar: 'اضافة' },
    { id: 2, en: 'edit', ar: 'تعديل' },
    { id: 3, en: 'delete', ar: 'حذف' },
  ];

  dateFilter: any = false;
  userG: any = {};
  constructor(
    private _sysrvice: SystemactionService,
    private _sharedService: SharedService,
    private authenticationService: AuthenticationService
  ) {
    this.dataSource = new MatTableDataSource([{}]);
    this.userG = this.authenticationService.userGlobalObj;
  }
  Searchtxt: any = null;
  DateFrom: any = null;
  DateTo: any = null;
  BranchId: any = null;
  UserId: any = null;
  ActionType: any = null;
  alldata: any = [];
  GetSystemActions() {
    this.dataSource = new MatTableDataSource([{}]);

    this._sysrvice
      .GetSystemActions(
        this.Searchtxt ?? '',
        this.DateFrom ?? '',
        this.DateTo ?? '',
        this.BranchId ?? '',
        this.UserId ?? '0',
        this.ActionType ?? '0'
      )
      .subscribe((data) => {
        console.log(data);
        this.systemActions = data;
        this.alldata = data;
        this.dataSource = new MatTableDataSource(this.systemActions);
        this.dataSource.paginator = this.tasksPaginator2;
      });
  }

  ngOnInit(): void {
    this.FillAllUsersSelectAll();

    this.dataSource = new MatTableDataSource(this.systemActions);
    this.getdayes();
  }
  getdataall() {
    this._sysrvice.GetSystemActionsAll().subscribe((data) => {
      console.log(data);
      this.systemActions = data;
      this.alldata = data;

      this.dataSource = new MatTableDataSource(this.systemActions);
      this.dataSource.paginator = this.tasksPaginator2;
    });
  }

  FillAllUsersSelectAll() {
    this._sysrvice.FillAllUsersSelectAll().subscribe((data) => {
      console.log(data);
      this.users = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  date: any;
  CheckDate(event: any) {
    if (event != null) {
      debugger;
      var from = this._sharedService.date_TO_String(event[0]);
      var to = this._sharedService.date_TO_String(event[1]);
      //this.RefreshData_ByDate(from,to);
      this.DateFrom = from;
      this.DateTo = to;
      // this.GetReport();
      this.GetSystemActions();
    } else {
      this.DateFrom = '';
      this.DateTo = '';
      //this.RefreshData();
    }
  }
  pageNumber: any = 0;
  onPageChange(event: any) {
    this.pageNumber = event.pageIndex;

    // console\.log(this.pageNumber3 * 10, (this.pageNumber3 + 1) * 10);

    // this.rows.CostTasks = new MatTableDataSource(
    //   this.CostTasksData.slice(
    //     this.pageNumber3 * 10,
    //     (this.pageNumber3 + 1) * 10
    //   )
    // );
  }
  getRowBackground(data: any) {
    if (data.success == 1) {
      return { background: 'green' }; // Set the background color to red
    } else {
      return { background: 'red' }; // No background color
    }
  }
  dayes: any[] = [];
  FilterDay: any;
  getdayes() {
    let Today = new Date();

    if (Today.getMonth() + 1 == 1) {
      this.dayes = [{ id: 1, name: ' يناير' }];
    } else if (Today.getMonth() + 1 == 2) {
      this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
      ];
    } else if (Today.getMonth() + 1 == 3) {
      this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
        { id: 3, name: ' مارس ' },
      ];
    } else if (Today.getMonth() + 1 == 4) {
      this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
        { id: 3, name: ' مارس ' },
        { id: 4, name: ' ابريل ' },
      ];
    } else if (Today.getMonth() + 1 == 5) {
      this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
        { id: 3, name: ' مارس ' },
        { id: 4, name: ' ابريل ' },
        { id: 5, name: ' مايو ' },
      ];
    } else if (Today.getMonth() + 1 == 6) {
      this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
        { id: 3, name: ' مارس ' },
        { id: 4, name: ' ابريل ' },
        { id: 5, name: ' مايو ' },
        { id: 6, name: ' يونيه ' },
      ];
    } else if (Today.getMonth() + 1 == 7) {
      this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
        { id: 3, name: ' مارس ' },
        { id: 4, name: ' ابريل ' },
        { id: 5, name: ' مايو ' },
        { id: 6, name: ' يونيه ' },
        { id: 7, name: ' يوليو ' },
      ];
    } else if (Today.getMonth() + 1 == 8) {
      this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
        { id: 3, name: ' مارس ' },
        { id: 4, name: ' ابريل ' },
        { id: 5, name: ' مايو ' },
        { id: 6, name: ' يونيه ' },
        { id: 7, name: ' يوليو ' },
        { id: 8, name: ' أغسطس ' },
      ];
    } else if (Today.getMonth() + 1 == 9) {
      this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
        { id: 3, name: ' مارس ' },
        { id: 4, name: ' ابريل ' },
        { id: 5, name: ' مايو ' },
        { id: 6, name: ' يونيه ' },
        { id: 7, name: ' يوليو ' },
        { id: 8, name: ' أغسطس ' },
        { id: 9, name: ' سبتمبر ' },
      ];
    } else if (Today.getMonth() + 1 == 10) {
      this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
        { id: 3, name: ' مارس ' },
        { id: 4, name: ' ابريل ' },
        { id: 5, name: ' مايو ' },
        { id: 6, name: ' يونيه ' },
        { id: 7, name: ' يوليو ' },
        { id: 8, name: ' أغسطس ' },
        { id: 9, name: ' سبتمبر ' },
        { id: 10, name: ' اكتوبر ' },
      ];
    } else if (Today.getMonth() + 1 == 11) {
      this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
        { id: 3, name: ' مارس ' },
        { id: 4, name: ' ابريل ' },
        { id: 5, name: ' مايو ' },
        { id: 6, name: ' يونيه ' },
        { id: 7, name: ' يوليو ' },
        { id: 8, name: ' أغسطس ' },
        { id: 9, name: ' سبتمبر ' },
        { id: 10, name: ' اكتوبر ' },
        { id: 11, name: ' نوفمبر ' },
      ];
    } else if (Today.getMonth() + 1 == 12) {
      this.dayes = [
        { id: 1, name: ' يناير' },
        { id: 2, name: ' فبراير' },
        { id: 3, name: ' مارس ' },
        { id: 4, name: ' ابريل ' },
        { id: 5, name: ' مايو ' },
        { id: 6, name: ' يونيه ' },
        { id: 7, name: ' يوليو ' },
        { id: 8, name: ' أغسطس ' },
        { id: 9, name: ' سبتمبر ' },
        { id: 10, name: ' اكتوبر ' },
        { id: 11, name: ' نوفمبر ' },
        { id: 12, name: ' ديسمبر ' },
      ];
    }
  }
  SetDate() {
    if (this.FilterDay == -1) {
      this.setYesterDay();
    } else if (this.FilterDay == 0) {
      this.setLastweek();
    } else {
      this.setStartandEndDate(this.FilterDay);
    }
    this.GetSystemActions();
  }
  setStartandEndDate(month: any) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    // Get the first day of the month
    const startDate = new Date(year, month - 1, 1);

    // Get the last day of the month
    const endDate = new Date(year, month, 0);
    this.DateFrom = this._sharedService.date_TO_String(startDate);
    this.DateTo = this._sharedService.date_TO_String(endDate);
  }
  setYesterDay() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    this.DateFrom = this._sharedService.date_TO_String(currentDate);
    this.DateTo = this._sharedService.date_TO_String(new Date());
  }

  setLastweek() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 7);
    this.DateFrom = this._sharedService.date_TO_String(currentDate);
    this.DateTo = this._sharedService.date_TO_String(new Date());
  }
}
