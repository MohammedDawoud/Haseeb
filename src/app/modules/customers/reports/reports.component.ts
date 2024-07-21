import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxPrintElementService } from 'ngx-print-element';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CustomerService } from 'src/app/core/services/customer-services/customer.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [DatePipe],
})
export class ReportsComponent implements OnInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSourceTemp: any = [];
  lang: any = 'ar';
  datePrints: any = this.datePipe.transform(new Date(), 'YYYY-MM-dd');
  logourl: any;
  userG: any = {};
  BranchName:any
  constructor(
    private api: RestApiService,
    private service: CustomerService,
    private _sharedService: SharedService,
    private datePipe: DatePipe,
    private authenticationService: AuthenticationService,
    private print: NgxPrintElementService
  ) {
    api.lang.subscribe((res) => {
      this.lang = res;
    });
    this.userG = this.authenticationService.userGlobalObj;
  }

  ngOnInit(): void {
    this.getData();
    this.GetOrganizationData();
        this.api.GetBranchByBranchId().subscribe((data: any) => {
      debugger
                    this.BranchName = data.result[0].branchName;

    });
  }

  title: any = {
    main: {
      name: {
        ar: 'العملاء',
        en: 'Customers',
      },
      link: '/customers',
    },
    sub: {
      ar: 'تقارير العملاء',
      en: 'Reports and statistics',
    },
  };
  data: any = {
    selected: null,
    filter: {
      enable: false,
      date: null,
    },
    // mobileSelect: [],
    customers: [],
  };
  displayedColumns: any[] = [
    'name',
    'type',
    'idNo',
    'email',
    'phone',
    'mobile',
    'accountNo',
  ];

  getCustomersAccount(event: any) {}

  getData() {
    this.service.GetAllCustomers_Branch().subscribe((data) => {
      console.log(data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  /////////////////////////////FILTER////////////////////

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    var tempsource = this.dataSourceTemp;
    if (val) {
      tempsource = this.dataSourceTemp.filter((d: any) => {
        return (
          (d.customerName &&
            d.customerName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.customerNationalId &&
            d.customerNationalId?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.customerTypeName &&
            d.customerTypeName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.customerEmail &&
            d.customerEmail?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.customerPhone &&
            d.customerPhone?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.customerMobile &&
            d.customerMobile?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.accountCodee &&
            d.accountCodee?.trim().toLowerCase().indexOf(val) !== -1)
        );
      });
    }

    this.dataSource = new MatTableDataSource(tempsource);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  CustomerType: any;
  to: any;
  from: any;
  ResetSearchTime() {
    debugger;
    if (!this.data.filter.enable) {
      this.RefreshData_ByDate('', '');
    } else {
      this.RefreshData_ByDate(this.from, this.to);
    }
  }
  fromdat: any
  todate:any
  CheckDate(event: any) {
    if (event != null) {
      this.from = this._sharedService.date_TO_String(event[0]);
      this.to = this._sharedService.date_TO_String(event[1]);
      this.fromdat = this._sharedService.date_TO_String(this.from);
      this.todate=this._sharedService.date_TO_String(this.to)
      this.RefreshData_ByDate(this.from, this.to);
    } else {
      this.RefreshData_ByDate('', '');
    }
  }
  changeAccount() {
    this.ResetSearchTime();
  }

  RefreshData_ByDate(from: any, to: any) {
    debugger;
    this.service
      .getAllCustomersByCustomerType(from, to, this.data.selected ?? 0)
      .subscribe((data: any) => {
        console.log(data);
        this.dataSource = new MatTableDataSource(data.result);
        this.dataSourceTemp = data.result;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  header: any;
  PrintReports() {
    const timeoutDuration = 3000;

    if (this.data.selected == 1) {
      this.header = 'تقرير العملاء - مواطنون';
    } else if (this.data.selected == 2) {
      this.header = 'تقرير العملاء - المستثمرون والشركات';
    } else if (this.data.selected == 3) {
      this.header = 'تقرير العملاء - الجهات الحكوميه';
    } else {
      this.header = 'تقرير جميع العملاء';
    }
    setTimeout(() => {
      // Code to be executed after the timeout
      this.printDiv('Reports');
    }, timeoutDuration);
  }
  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }
  GetOrganizationData() {
    this._sharedService.GetOrganizationData().subscribe((data) => {
      this.logourl = environment.PhotoURL + data.logoUrl;
    });
  }
}
