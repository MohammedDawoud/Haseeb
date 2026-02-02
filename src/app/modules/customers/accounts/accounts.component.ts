import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms/';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxPrintElementService } from 'ngx-print-element';
import { Transactions } from 'src/app/core/Classes/DomainObjects/transactions';
import { TransactionsVM } from 'src/app/core/Classes/ViewModels/transactionsVM';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CustomerService } from 'src/app/core/services/customer-services/customer.service';
import { ExportationService } from 'src/app/core/services/exportation-service/exportation.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  providers: [DatePipe],
})
export class AccountsComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSourceTemp: any = [];
  dataSourcedata: any = [];

  load_AccountsSelectCustomer: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  public _TransactionsVM: TransactionsVM;
  AccountId: any;
  FromDate: any;
  ToDate: any;
  CostCenterId: any;
  CustomerId: number;

  title: any = {
    main: {
      name: {
        ar: 'العملاء',
        en: 'Customers',
      },
      link: '/customers',
    },
    sub: {
      ar: 'كشف حساب عميل',
      en: 'Account statement',
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
      date: new MatTableDataSource([{}]),
    },
    // mobileSelect: [],
    data: [],
  };
  displayedColumns: string[] = [
    // 'Project Name',
    // 'piece number',
    // 'No. planned',
    // 'Neighborhood',
    'accTransactionDate',
    'statement',
    'transactionDate',
    'Debit',
    'Credit',
    'Balance',
    'Type',
    'Constraint_No',
    'Cost_Center',
  ];
  displayedColumns2: string[] = [
    // 'Project Name2',
    // 'piece number2',
    // 'No. planned2',
    // 'Neighborhood2',
    'accTransactionDate2',
    'statement2',
    'transactionDate2',
    'Debit2',
    'Credit2',
    'Balance2',
    'Type2',
    'Constraint_No2',
    'Cost_Center2',
  ];

  searchBox: any = {
    open: false,
    searchType: null,
  };

  data2: any = {
    filter: {
      enable: true,
      date: null,
      load_AccountsSelectCustomer: '',
    },
  };
  lang: any = 'ar';
  datePrints: any = this.datePipe.transform(new Date(), 'YYYY-MM-dd');
  logourl: any;
  userG: any = {};
  constructor(
    private api: RestApiService,
    private service: CustomerService,
    private _sharedService: SharedService,
    private exportationService: ExportationService,
    private datePipe: DatePipe,
    private authenticationService: AuthenticationService,
    private print: NgxPrintElementService
  ) {
    this.fillAccountsSelectCustomer();
    api.lang.subscribe((res) => {
      this.lang = res;
    });
    this.userG = this.authenticationService.userGlobalObj;
  }

  ngOnInit(): void {
    this.RefreshData_ByDate(this.FromDate, this.ToDate);
    this.GetOrganizationData();
  }

  fillAccountsSelectCustomer() {
    this.service.fillAccountsSelectCustomer().subscribe((data) => {
      console.log(data);
      this.load_AccountsSelectCustomer = data;
    });
  }

  ///////////////////////////////Filter
  CheckDate(event: any) {
    if (event != null) {
      this.FromDate = this._sharedService.date_TO_String(event[0]);
      this.ToDate = this._sharedService.date_TO_String(event[1]);
    
      this.RefreshData_ByDate(this.FromDate, this.ToDate);
      this.BalanceBeforeObj.Show = true;
    }
  }
  changeAccount() {
    this.RefreshData_ByDate('', '');
    this.BalanceBeforeObj.Show = false;
  }
  ResetSearchTime() {
    if (!this.data.filter.enable) {
      this.RefreshData_ByDate('', '');
      this.BalanceBeforeObj.Show = false;
    } else {
      if (this.FromDate == '' || this.ToDate == '')
        this.BalanceBeforeObj.Show = false;
      else this.BalanceBeforeObj.Show = true;

      this.RefreshData_ByDate(this.FromDate ?? '', this.ToDate ?? '');
    }
  }
  BalanceBeforeObj: any = {
    BalanceBefore: 0,
    Show: false,
  };
  ChangeClassVis() {
    if (this.BalanceBeforeObj.Show == false) {
      return 'HideBalanceBefore';
    } else {
      return 'ShowBalanceBefore';
    }
  }
  RefreshData_ByDate(FromDate: any, ToDate: any) {
    debugger;
    if (this.AccountId) {
      if (FromDate == '' || ToDate == '') this.BalanceBeforeObj.Show = false;
      else this.BalanceBeforeObj.Show = true;

      var formData = new FormData();
      formData.append('AccountId', this.AccountId);
      formData.append('FromDate', '');
      formData.append('ToDate', '');
      // formData.append('FromDate', FromDate);
      // formData.append('ToDate', ToDate);
      this.service.getAllTransSearch(formData).subscribe((data: any) => {
        var Obj = null;
        if (!(FromDate == '' || ToDate == '')) {
          var ObjBefore = data.filter(
            (a: { invoiceDate: any }) =>
              new Date(a.invoiceDate) < new Date(FromDate)
          );
          this.GetNetBalance(ObjBefore);
          Obj = data.filter(
            (a: { invoiceDate: any }) =>
              new Date(a.invoiceDate) >= new Date(FromDate) &&
              new Date(a.invoiceDate) <= new Date(ToDate)
          );
        } else {
          Obj = data;
        }

        this.dataSource = new MatTableDataSource(Obj);
        this.dataSourceTemp = Obj;
        this.dataSourcedata = Obj;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    } else {
      this.dataSource = new MatTableDataSource([{}]);
      this.dataSourceTemp = [];
      this.dataSourcedata = [];
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  GetNetBalance(data: any) {
    this.BalanceBeforeObj.BalanceBefore = 0;
    data.forEach((element: any) => {
      this.BalanceBeforeObj.BalanceBefore += element.depit - element.credit;
    });
    this.BalanceBeforeObj.BalanceBefore = parseFloat(
      this.BalanceBeforeObj.BalanceBefore
    ).toFixed(2);
  }

  totalBeforeFilter: any;
  totalAfterFilter: any;

  findsumByColumn(colName: string) {
    var total: any;
    var data = this.dataSourceTemp as Array<Transactions>;

    if (colName == 'depit') {
      total = data
        .map((a) => a.depit)
        .reduce(function (a, b) {
          return a! + b!;
        });
    }
    if (colName == 'credit') {
      total = data
        .map((a) => a.credit)
        .reduce(function (a, b) {
          return a! + b!;
        });
    }

    return total;
    console.log(total);
  }

  findRasedBefore_filter(data: any) {
    var _data = data as Array<Transactions>;

    var totalDepit = _data
      .map((a) => a.depit)
      .reduce(function (a, b) {
        return a! + b!;
      });

    var totalCredit = _data
      .map((a) => a.credit)
      .reduce(function (a, b) {
        return a! + b!;
      });
    this.totalBeforeFilter = totalCredit! - totalDepit!;
    //console.log(this.totalBeforeFilter);
  }

  totalbalance: any;

  CurrentBalance: any;

  CurrentDataAfterSort: any;
  CurrentBalanceNew(index: any) {
    this.dataSource.connect().subscribe((d) => (this.CurrentDataAfterSort = d));
    var sum = 0;
    for (var i = 0; i <= index; i++) {
      sum +=
        +parseFloat(
          (this.CurrentDataAfterSort[i]?.depit ?? 0).toString()
        ).toFixed(2) -
        +parseFloat(
          (this.CurrentDataAfterSort[i]?.credit ?? 0).toString()
        ).toFixed(2);
    }
    return parseFloat(sum.toString()).toFixed(2);
  }

  get totalexDepit() {
    var sum = 0;
    this.dataSource?.data?.forEach((element: any) => {
      sum =
        +parseFloat(sum.toString()).toFixed(2) +
        +parseFloat((element?.depit ?? 0).toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }
  get totalexCredit() {
    var sum = 0;
    this.dataSource?.data?.forEach((element: any) => {
      sum =
        +parseFloat(sum.toString()).toFixed(2) +
        +parseFloat((element?.credit ?? 0).toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }

  get totaltxt() {
    var dep = this.totalexDepit ?? 0;
    var cre = this.totalexCredit ?? 0;
    if (
      +(
        +parseFloat(dep.toString()).toFixed(2) -
        +parseFloat(cre.toString()).toFixed(2)
      ) > 0
    ) {
      return 'مدين';
    } else {
      return 'دائن';
    }
  }
  // findRasedSum(data:any){
  //    debugger
  //    var _data=data as Array<Transactions > ;

  //     for(var item of data){
  //       this.CurrentBalance = (+parseFloat(this.CurrentBalance).toFixed(2) + +parseFloat(item.Depit).toFixed(2) - parseFloat(item.Credit)).toFixed(2);

  //     }
  //  return   this.totalbalance = this.CurrentBalance;
  //  console.log(this.totalbalance )

  //   }

  findRasedAfter_filter(data: any) {
    var _data = data as Array<Transactions>;

    var totalDepit = _data
      .map((a) => a.depit)
      .reduce(function (a, b) {
        return a! + b!;
      });

    var totalCredit = _data
      .map((a) => a.credit)
      .reduce(function (a, b) {
        return a! + b!;
      });

    this.totalAfterFilter = totalCredit! - totalDepit!;
    //  console.log(this.totalAfterFilter);
  }

  applyFilter(event: any) {
    debugger;
    const val = event.target.value.toLowerCase();
    var tempsource = this.dataSourceTemp;
    if (val) {
      tempsource = this.dataSourceTemp.filter((d: any) => {
        return (
          (d.accTransactionDate &&
            d.accTransactionDate?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.notes && d.notes?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.transactionDate &&
            d.transactionDate?.trim().toLowerCase().indexOf(val) !== -1) ||
          // || (d.depit && d.depit?.trim().toLowerCase().indexOf(val) !== -1 )
          // || (d.balance && d.balance?.trim().toLowerCase().indexOf(val) !== -1 )
          (d.typeName &&
            d.typeName?.trim().toLowerCase().indexOf(val) !== -1) ||
          // || (d.journalNo && d.journalNo?.trim().toLowerCase().indexOf(val) !== -1 )
          (d.costCenterName &&
            d.costCenterName?.trim().toLowerCase().indexOf(val) !== -1)
        );
      });
    }

    this.dataSource = new MatTableDataSource(tempsource);
    this.dataSourcedata = tempsource;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ////////////////////////////////////EXPORT/////////////

  customExportExcel(dataExport: any) {
    let exportation = JSON.parse(JSON.stringify(dataExport));
    let itemsToExeclude: string[] = [];

    let excelData: any[] = [];
    let headers: string[] = [];
    let objectKeys = Object.keys(dataExport[0]);
    objectKeys = objectKeys.filter(
      (item: string) => !itemsToExeclude.includes(item)
    );

    objectKeys.forEach((element) => {
      headers.push(element.toUpperCase());
    });

    exportation.forEach((ele: any) => {
      // ele = (ele) => {
      var sorted: any = {},
        key,
        a = [];

      for (key in ele) {
        if (ele.hasOwnProperty(key)) {
          a.push(key);
        }
      }
      a = a.filter((item: string) => !itemsToExeclude.includes(item));

      // a.sort();

      for (key = 0; key < a.length; key++) {
        sorted[a[key]] = ele[a[key]];
      }
      // return sorted;
      ele = sorted;
      // }
      let props = Object.getOwnPropertyNames(ele).filter((prop) =>
        exportation.some((ex: any) => ex === prop)
      );
      props.forEach((pp) => {
        delete ele[pp];
      });

      excelData.push(ele);
    });

    this.exportationService.exportExcel(
      excelData,
      'Transitioans' + new Date().getTime(),
      headers
    );
  }

  exportData() {
    var formData = new FormData();
    formData.append('AccountId', this.AccountId);
    formData.append('FromDate', this.FromDate);
    formData.append('ToDate', this.ToDate);
    this.service.getAllTransSearch(formData).subscribe((data: any) => {
      console.log(data);

      this.dataSource = new MatTableDataSource(data);
      let dataExport = data as TransactionsVM[];

      this.dataSourceTemp = data;
      let x = [];

      for (let index = 0; index < dataExport.length; index++) {
        x.push({
          accTransactionDate: dataExport[index].accTransactionDate,
          notes: dataExport[index].notes,
          credit: dataExport[index].credit,
          depit: dataExport[index].depit,
          balance: dataExport[index].balance,
          transactionDate: dataExport[index].transactionDate,
          journalNo: dataExport[index].journalNo,
          costCenterName: dataExport[index].costCenterName,
          typeName: dataExport[index].typeName,
        });
      }

      console.log(dataExport);
      this.customExportExcel(x);
      this.RefreshData_ByDate(this.FromDate, this.ToDate);
    });
  }
  ///////////////////////////////////////////print Report/////////////////////////////////////
  GetOrganizationData() {
    this._sharedService.GetOrganizationData().subscribe((data) => {
      this.logourl = environment.PhotoURL + data.logoUrl;
    });
  }
  transactionIds: string[];
  reportparam: any = {
    AccountId: null,
    FromDate: null,
    ToDate: null,
    CostCenterId: null,
    RasedBefore: null,
    Sortedlist: null,
  };
  result: any = {
    accountName: null,
    accountCode: null,
    resultDep: null,
    resultCre: null,
    rasedBefore: null,
    transactionVM: null,
    totalres: null,
  };
  BranchName:any
  printprojectsDataSource: any = []
  printdata() {
    let x = [];

    for (let index = 0; index < this.dataSourcedata.length; index++) {
      x.push({
        TransactionId: this.dataSourcedata[index].transactionId,
      });
    }
    this.reportparam.AccountId = this.AccountId ?? '';
    this.reportparam.FromDate = this.FromDate ?? '';
    this.reportparam.ToDate = this.ToDate ?? '';
    this.reportparam.CostCenterId = 0;
    this.reportparam.RasedBefore = '0';

    // const transactionIds
    this.transactionIds = x.map((transaction) =>
      transaction.TransactionId.toString()
    );
    this.reportparam.Sortedlist = this.transactionIds;

    debugger;
    this.printprojectsDataSource = [];
    this.service
      .GetReportGrid_AcountCustomer(this.reportparam)
      .subscribe((data: any) => {
        console.log(data);

        if(this.dataSource.sort)
        {
          this.printprojectsDataSource=this.dataSource.sortData(this.dataSource.filteredData,this.dataSource.sort);
        }
        else
        {
          this.printprojectsDataSource=this.dataSource.data;
        }

        this.result = data;
        this.result.accountName = data.accountName;
        this.result.accountCode = data.accountCode;
        this.result.resultDep = data.resultDep;
        this.result.resultCre = data.resultCre;
        this.result.rasedBefore = data.rasedBefore;
        this.result.transactionVM = data.transactionVM;
        this.result.totalres = data.totalres;
        this.BranchName = data.branchName;
        setTimeout(() => {
          // Code to be executed after the timeout
          this.printDiv('reportaccountcustomer');
        }, 200);
      });
  }
  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }
}
