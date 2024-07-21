import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxPrintElementService } from 'ngx-print-element';
import { ContractsCollectionVM } from 'src/app/core/Classes/ViewModels/ContractsCollectionVM';
import { ContractsVM } from 'src/app/core/Classes/ViewModels/contractsVM';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CustomerService } from 'src/app/core/services/customer-services/customer.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
  providers: [DatePipe],
})
export class CollectionsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSourceTemp: any = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  load_CustomerName: any;
  FirstLoad: boolean = false;
  _ContractsVM: ContractsCollectionVM = {
    CustomerId: 0,
    dateTo: '',
    dateFrom: '',
  };
  CustomerId: any;
  FromDate: any;
  ToDate: any;
  IsChecked = false;
  IsSearch = false;
  displayedColumns: string[] = ['name', 'mobile', 'total', 'paid', 'remain'];

  title: any = {
    main: {
      name: {
        ar: 'العملاء',
        en: 'Customers',
      },
      link: '/customers',
    },
    sub: {
      ar: 'متابعة التحصيل',
      en: 'Collection Follow-up',
    },
  };
  select: any = {
    selected: null,
    mobileSelect: [],
    mailSelect: [],
  };
  data: any = {
    selected: null,
    filter: {
      enable: false,
      date: null,
    },
    // mobileSelect: [],
    data: new MatTableDataSource([{}]),
  };
  lang: any = 'ar';
  datePrints: any = this.datePipe.transform(new Date(), 'YYYY-MM-dd');
  logourl: any;
  userG: any = {};
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
    this.fillAllCustomerSelectWithBranch();
    this.GetOrganizationData();
  }
  ////////////////////////////FILL DATA////////////////

  getData() {
    this.service
      .getAllContractsNotPaidCustomer(this.FirstLoad)
      .subscribe((data) => {
        console.log(data);

        this.dataSource = new MatTableDataSource(data);
        this.dataSourcedata = data;
        this.dataSourceTemp = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  fillAllCustomerSelectWithBranch() {
    this.service.fillAllCustomerSelectWithBranch().subscribe((data) => {
      console.log(data);
      this.load_CustomerName = data;
    });
  }

  /************************************FILTER */

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    var tempsource = this.dataSourceTemp;
    if (val) {
      tempsource = this.dataSourceTemp.filter((d: any) => {
        return (
          (d.customerName &&
            d.customerName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.customerMobile &&
            d.customerMobile?.trim().toLowerCase().indexOf(val) !== -1)
        );
      });
    }

    this.dataSource = new MatTableDataSource(tempsource);
    this.dataSourcedata = tempsource;

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ResetSearchTime() {
    debugger;
    if (!this.data.filter.enable) {
      this.RefreshData_ByDate('', '');
    } else {
      this.RefreshData_ByDate(this.FromDate ?? '', this.ToDate ?? '');
      //this.RefreshData_ByDate("","");
    }
  }
  ChangeCustomer() {
    this.ResetSearchTime();
  }
  CheckDate(event: any) {
    if (event != null) {
      this.FromDate = this._sharedService.date_TO_String(event[0]);
      this.ToDate = this._sharedService.date_TO_String(event[1]);
      this.RefreshData_ByDate(this.FromDate, this.ToDate);
    } else {
      this.FromDate = '';
      this.ToDate = '';
      this.ChangeCustomer();
    }
  }
  RefreshData_ByDate(FromDate: any, ToDate: any) {
    debugger;
    this._ContractsVM.CustomerId = 0;

    if (this.CustomerId) {
      this._ContractsVM.CustomerId = this.CustomerId;
    }
    this._ContractsVM.dateFrom = FromDate;
    this._ContractsVM.dateTo = ToDate;

    this.service
      .getAllContractsBySearchCustomer(this._ContractsVM)
      .subscribe((data) => {
        console.log(data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSourceTemp = data;
        this.dataSourcedata = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }
  dataSourcedata: any = [];

  get totalValue() {
    var sum = 0;
    this.dataSourcedata.forEach((element: any) => {
      sum =
        +parseFloat(sum.toString()).toFixed(2) +
        +parseFloat(element.totalValue.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }
  get totalPaidPayment() {
    var sum = 0;
    this.dataSourcedata.forEach((element: any) => {
      sum =
        +parseFloat(sum.toString()).toFixed(2) +
        +parseFloat(element.totalPaidPayment.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }
  get totalRemainingPayment() {
    var sum = 0;
    this.dataSourcedata.forEach((element: any) => {
      sum =
        +parseFloat(sum.toString()).toFixed(2) +
        +parseFloat(element.totalRemainingPayment.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }

  ///////////////////////////////////////////print Report/////////////////////////////////////
  GetOrganizationData() {
    this._sharedService.GetOrganizationData().subscribe((data) => {
      this.logourl = environment.PhotoURL + data.logoUrl;
    });
  }
  header: any;
  transactionIds: string[];
  reportparam: any = {
    CustomerId: null,
    FromDate: null,
    ToDate: null,
    Type: null,
    // Sortedlist: null,
  };
  invoicesList: any;
  customerName: any;
  allValue: any;
  paidvalue: any;
  remainValue: any;
  printdata() {
    let x = [];
    debugger;
    // for (let index = 0; index < this.dataSourcedata.length; index++) {
    //   x.push({
    //     TransactionId: this.dataSourcedata[index].transactionId,
    //   });
    // }
    this.reportparam.CustomerId = this.CustomerId ?? 0;
    this.reportparam.FromDate = this.FromDate ?? '';
    this.reportparam.ToDate = this.ToDate ?? '';
    this.reportparam.Type = 0;

    // const transactionIds
    // this.transactionIds = x.map((transaction) =>
    //   transaction.TransactionId.toString()
    // );
    // this.reportparam.Sortedlist = ''; // this.transactionIds;

    debugger;
    this.service
      .GetReportGrid_Customers(this.reportparam).subscribe((data: any) => {
        console.log(data);
        this.invoicesList = data.invoicesList;
        this.customerName = data.customerName;
        this.allValue = data.allValue;
        this.paidvalue = data.paidvalue;
        this.remainValue = data.remainValue;
        if (data.customerName != null && data.customerName != '') {
          this.header = 'متابعه التحصيل للعميل' + '  ' + data.customerName;
        } else {
          this.header = 'متابعه التحصيل ';
        }
        setTimeout(() => {
          // Code to be executed after the timeout
          this.printDiv('Collection');
        }, 500);
      });
  }
  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }
}
