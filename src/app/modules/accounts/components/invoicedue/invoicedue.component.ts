import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxPrintElementService } from 'ngx-print-element';
import { SharedService } from 'src/app/core/services/shared.service';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { environment } from 'src/environments/environment';
import { ReportCustomer } from 'src/app/core/Classes/ViewModels/reportCustomer';
import { VoucherFilterVM } from 'src/app/core/Classes/ViewModels/voucherFilterVM';
import { RestApiService } from 'src/app/shared/services/api.service';


@Component({
  selector: 'app-invoicedue',
  templateUrl: './invoicedue.component.html',
  styleUrls: ['./invoicedue.component.scss']
})
export class InvoicedueComponent {
  projectsDataSource = new MatTableDataSource();
  projectsDataSourceTemp: any = [];
  load_Branch: any;
  currentDate: any;
  DataSource:any
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  lang: any = 'ar';
  projectDisplayedColumns: string[] = [
    'customerName',
    'invoiceNumber',
    'invoiceDate',
    'branchName',
    'invoiceValue',
    'valueCollect',
    'retinvoiceValue',
    'accDate',
    'valuedue',
    'daysV',
    'undue',
    'onetothirty',
    'thirtyonetosixty',
    'sixtyonetoninety',
    'aboveninety',
    'total',
  ];
  title: any = {
    main: {
      name: {
        ar: 'الحسابات',
        en: 'Projects Management',
      },
      link: '/accounts',
    },
    sub: {
      ar: 'جدول أعمار الديون',
      en: 'Debt aging schedule',
    },
  };

  constructor(private modalService: NgbModal,
    private print: NgxPrintElementService,
    private api: RestApiService,
    private _accountsreportsService: AccountsreportsService,
    private _sharedService: SharedService,) {
    this.currentDate = new Date();
    api.lang.subscribe((res) => {this.lang = res;});
  }


  data: any = {
    filter: {
      enable: false,
      date: null,
      search_Branch: null,
      DateFrom_P: null,
      DateTo_P: null,
      isChecked: false,
    }
  };
  // FillBranchSelectNew() {
  //   this._accountsreportsService.FillBranchSelectNew().subscribe(data => {
  //     this.load_Branch = data;
  //   });
  // }
  FillBranchSelectNew() {
    this._accountsreportsService.GetAllBranchesByUserIdDrop().subscribe(data => {
      this.load_Branch = data.result;
    });
  }
    BranchName: any;

  ngOnInit(): void {
    this.RefreshData();
    this.FillBranchSelectNew()
    this.projectsDataSource = new MatTableDataSource();
    this.api.GetOrganizationDataLogin().subscribe((data: any) => {
      this.OrganizationData = data.result;
      this.dateprint =this._sharedService.date_TO_String(new Date());
      this.environmentPho =
        environment.PhotoURL + this.OrganizationData.logoUrl;
    });

    this.api.GetBranchByBranchId().subscribe((data: any) => {
      debugger
                    this.BranchName = data.result[0].branchName;

    });
  }

  TotalSum:any={
    invoiceValue:0,
    valueCollect:0,
    retinvoiceValue:0,
    valuedue:0,
    daysV:0,
    undue:0,
    onetothirty:0,
    thirtyonetosixty:0,
    sixtyonetoninety:0,
    aboveninety:0,
    total:0,
  }
  resetTotalSum(){
    this.TotalSum={
      invoiceValue:0,
      valueCollect:0,
      retinvoiceValue:0,
      valuedue:0,
      daysV:0,
      undue:0,
      onetothirty:0,
      thirtyonetosixty:0,
      sixtyonetoninety:0,
      aboveninety:0,
      total:0,
    }
  }


  RefreshData() {
    this.resetTotalSum();
    const formData: FormData = new FormData();
    if(this.data.filter.search_Branch==null)
      {
        formData.append('BranchId', "0");
      }
      else
      {
        formData.append('BranchId', this.data.filter.search_Branch);
      }
    if (this.data.filter.DateFrom_P != null && this.data.filter.DateTo_P != null) {
      formData.append('ToDate', this.data.filter.DateTo_P.toString());
      formData.append('FromDate', this.data.filter.DateFrom_P.toString());
    }
    this._accountsreportsService.GetInvoicedue(formData).subscribe((data: any)=>{
      this.projectsDataSource = new MatTableDataSource(data.result);

      data.result.forEach((element:any) => {
        this.TotalSum.invoiceValue+=  element.invoiceValue;
        this.TotalSum.valueCollect+= element.valueCollect;
        this.TotalSum.retinvoiceValue+= element.retinvoiceValue;
        this.TotalSum.valuedue+= this.getvaluedue(element);
        this.TotalSum.daysV+= element.daysV;
        this.TotalSum.undue+= this.getRangeValue(element,0);
        this.TotalSum.onetothirty+= this.getRangeValue(element,1);
        this.TotalSum.thirtyonetosixty+= this.getRangeValue(element,2);
        this.TotalSum.sixtyonetoninety+= this.getRangeValue(element,3);
        this.TotalSum.aboveninety+= this.getRangeValue(element,4);
        this.TotalSum.total+= this.getvaluedue(element);
      });

      this.DataSource= data.result;
      this.projectsDataSourceTemp = data.result;
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


  getvaluedue(obj:any){
    var Value:any=+parseFloat(obj.invoiceValue).toFixed(2) -(+parseFloat(obj.valueCollect).toFixed(2)+ +parseFloat(obj.retinvoiceValue).toFixed(2));
    Value = +parseFloat(Value).toFixed(2);
    return Value;
  }


  getRangeValue(obj:any,type:any){
    if(obj.daysV<=0)
    {
      if(type==0)
      {
        return this.getvaluedue(obj);
      }
      else
      {
        return 0;
      }      
    }
    else
    {
      if(type==1)
      {
        if(obj.daysV>=1 && obj.daysV<=30){return this.getvaluedue(obj);}
        else{return 0;}
      }  
      if(type==2)
      {
        if(obj.daysV>=31 && obj.daysV<=60){return this.getvaluedue(obj); }
        else{return 0;}
      }
      if(type==3)
      {
        if(obj.daysV>=61 && obj.daysV<=90){return this.getvaluedue(obj); }
        else{return 0;}
      }
      if(type==4)
      {
        if(obj.daysV>=91){return this.getvaluedue(obj); }
        else{return 0;}
      }
      else{
        return 0;
      }
    }
  }

  valapplyFilter:any

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    this.valapplyFilter = val;
    const tempsource = this.projectsDataSourceTemp.filter(function (d: any) {
      return (d.customerNameW!=null?d.customerNameW.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.invoiceNumber!=null?d.invoiceNumber.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.invoiceDate!=null?d.invoiceDate.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.branchName!=null?d.branchName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.invoiceValue!=null?d.invoiceValue.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.valueCollect!=null?d.valueCollect.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.retinvoiceValue!=null?d.retinvoiceValue.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.accDate!=null?d.accDate.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
        || (d.daysV!=null?d.daysV.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
    });
    this.projectsDataSource = new MatTableDataSource(tempsource);
    this.DataSource = tempsource
    this.projectsDataSource.paginator = this.paginator;
    this.projectsDataSource.sort = this.sort;
  }
  exportData() {
    let x = [];
    debugger
    for (let index = 0; index < this.DataSource.length; index++) {

      x.push({
        customerName: this.DataSource[index].customerName,
        invoiceNumber: this.DataSource[index].invoiceNumber,
        invoiceDate: this.DataSource[index].invoiceDate,
        branchName: this.DataSource[index].branchName,
        invoiceValue: this.DataSource[index].invoiceValue,
        valueCollect: this.DataSource[index].valueCollect,
        retinvoiceValue: this.DataSource[index].retinvoiceValue,
        accDate: this.DataSource[index].accDate,
        valuedue: this.getvaluedue(this.DataSource[index]),
        daysV: this.DataSource[index].daysV,
        undue: this.getRangeValue(this.DataSource[index],0),
        onetothirty: this.getRangeValue(this.DataSource[index],1),
        thirtyonetosixty: this.getRangeValue(this.DataSource[index],2),
        sixtyonetoninety: this.getRangeValue(this.DataSource[index],3),
        aboveninety: this.getRangeValue(this.DataSource[index],4),
        total: this.getvaluedue(this.DataSource[index]),
      })
    }
    this.lang == "ar" ? this._accountsreportsService.customExportExcel(x, 'جدول أعمار الديون') :
    this._accountsreportsService.customExportExcel(x, 'Debt aging schedule');
  }
printprojectsDataSource: any 
OrganizationData:any
environmentPho:any
dateprint:any
getPrintdata(id:any) {
  if(this.DataSource.length>0)
    {
      this.printprojectsDataSource=this.DataSource;
      setTimeout(() => {
        this.print.print(id, environment.printConfig);
      }, 1000);
    }
  }
}
