import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FileUploadControl, FileUploadValidators } from '@iplab/ngx-file-upload';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
import { NgxPrintElementService } from 'ngx-print-element';
@Component({
  selector: 'app-zatca-report',
  templateUrl: './zatca-report.component.html',
  styleUrls: ['./zatca-report.component.scss']
})

export class ZatcaReportComponent implements OnInit{

  addInvoice() {}

  editInvoice() {}

  showTable : boolean = false ;

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
      ar:'متابعة فواتير الهيئة',
      en:'Zatca Invoices follow-up',
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
  projectsDataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  projectsDataSourceTemp:any=[];
  projectsDataSourcedata:any=[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  projectDisplayedColumns: string[] = [
    'invoiceNo',
    'date',
    'customerName',
    'totalValue',
    'warningmessage',
    'errormessage',
    'operations',

  ];
  lang: any = 'ar';

  constructor(private modalService: NgbModal,
    private _accountsreportsService: AccountsreportsService,
    private _sharedService: SharedService,
    private api: RestApiService,
    private print: NgxPrintElementService,
    private toast: ToastrService,
    private translate: TranslateService,) {
    this.projectsDataSource = new MatTableDataSource([{}]);
    api.lang.subscribe((res) => {
      this.lang = res;
    });
  }
  expenseType: any;
  ngOnInit(): void {
    this.GetAllInvoiceRequests();
    this.GetOrganizationData();
  }


  OrganizationData: any;
  environmentPho: any;
  dateprint: any;
  GetOrganizationData(){
    this.api.GetOrganizationDataLogin().subscribe((data: any) => {
      this.OrganizationData = data.result;
      this.dateprint =this._sharedService.date_TO_String(new Date());
      this.environmentPho =environment.PhotoURL + this.OrganizationData.logoUrl;
    });
  }

  open(content: any, data?: any, type?: any) {

    this.modalService
      this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type == 'edit' ? 'xl' : 'lg' ,
        centered: type ? false : true
      })

      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
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

  load_accountIds:any;
  FillAccountsSelect(){
    this._accountsreportsService.FillAccountsSelect().subscribe(data=>{
      this.load_accountIds=data;
    });
  }
  GetAllInvoiceRequests(){
    this._accountsreportsService.GetAllInvoiceRequests().subscribe(data=>{
      this.projectsDataSource = new MatTableDataSource(data);
      this.projectsDataSourcedata=data;
      this.projectsDataSourceTemp=data;
      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
      this.FillSerachLists(data);
      console.log("data",data);
      this.RefreshData();
    });
  }
  exportData() {
    let x = [];

    for (let index = 0; index < this.projectsDataSourcedata.length; index++) {

      x.push({
        'رسالة الخطأ': this.projectsDataSourcedata[index].errormessage,
        'رسالة التحذير': this.projectsDataSourcedata[index].warningmessage,
        'المبلغ': this.projectsDataSourcedata[index].totalValue,
        'اسم العميل': this.projectsDataSourcedata[index].customerName,
        'تاريخ الفاتورة': this.projectsDataSourcedata[index].date,
        'رقم الفاتورة': this.projectsDataSourcedata[index].invoiceNo,
      })

    }
    this.lang == "ar" ? this._accountsreportsService.customExportExcel(x, "متابعة فواتير الهيئة") :
      this._accountsreportsService.customExportExcel(x, "Zatca Invoices follow-up");
  }

  printprojectsDataSource: any = []
   BranchName: any;
   PrintDataProject :any=null;
   ProjectTableCustom:any={
    OrgImg: null,
    DateTimeNow:null,
    From:null,
    To:null,
   }
   GetPrintProjectTable()
   {
    if(this.projectsDataSource.sort)
    {
      this.PrintDataProject=this.projectsDataSource.sortData(this.projectsDataSource.filteredData,this.projectsDataSource.sort);
    }
    else
    {
      this.PrintDataProject=this.projectsDataSource.data;
    }
    this.ProjectTableCustom.OrgImg = this.environmentPho;
    var date = new Date();
    this.ProjectTableCustom.DateTimeNow=date.toLocaleString();


    
    // if(this.data.filter.DateFrom_P=="" || this.data.filter.DateFrom_P==null)
    // {
    //   this.ProjectTableCustom.From=null;
    // }
    // else
    // {
    //   this.ProjectTableCustom.From=this.data.filter.DateFrom_P;
    // }
    // if(this.data.filter.DateTo_P=="" || this.data.filter.DateTo_P==null)
    // {
    //   this.ProjectTableCustom.To=null;

    // }
    // else
    // {
    //   this.ProjectTableCustom.To=this.data.filter.DateTo_P;
    // }
   }

  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }
//------------------------------Search--------------------------------------------------------
//#region 

dataSearch: any = {
  filter: {
    enable: false,
    date: null,
    isChecked: false,
    ListNumber:[],
    ListInvoiceStatus:[],
    InvoiceNumber:null,
    InvoiceStatusId:null,
    showFilters:false
  },
};

  FillSerachLists(dataT:any){
    this.FillInvoiceListNumber(dataT);
    this.FillListInvoiceStatus();
  }

  FillInvoiceListNumber(dataT:any){
    const ListLoad = dataT.map((item: {  invoiceNo: any; }) => {
      const container:any = {}; container.id = item.invoiceNo; container.name = item.invoiceNo; return container;
    })
    const key = 'id';
    const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
    this.dataSearch.filter.ListNumber=arrayUniqueByKey;
    this.dataSearch.filter.ListNumber = this.dataSearch.filter.ListNumber.filter((d: { id: any }) => (d.id !=null && d.id!=0));
  }

  FillListInvoiceStatus(){
    this.dataSearch.filter.ListInvoiceStatus= [
      { id: 1, name: 'تم القبول مع وجود تحذيرات' },
      { id: 2, name: 'تم الرفض بسبب مشاكل في الفاتورة' },
      { id: 3, name: 'فواتير يجب اعادة ارسالها' },
    ];
  }


  RefreshDataCheck(from: any, to: any){
    this.projectsDataSource.data=this.projectsDataSourceTemp;
    if(!(from==null || from=="" || to==null || to==""))
    {
      debugger
      this.projectsDataSource.data = this.projectsDataSource.data.filter((item: any) => {
        var AccDate=new Date(item.date);
        var AccFrom=new Date(from);
        var AccTo=new Date(to);
        return AccDate.getTime() >= AccFrom.getTime() &&
        AccDate.getTime() <= AccTo.getTime();
    });
    }
    if(this.dataSearch.filter.InvoiceNumber!=null && this.dataSearch.filter.InvoiceNumber!="")
    {
      this.projectsDataSource.data = this.projectsDataSource.data.filter((d: { invoiceNo: any }) => d.invoiceNo == this.dataSearch.filter.InvoiceNumber);
    }
    if(this.dataSearch.filter.InvoiceStatusId!=null && this.dataSearch.filter.InvoiceStatusId!="")
    {
      if(this.dataSearch.filter.InvoiceStatusId==1)
      {
        this.projectsDataSource.data = this.projectsDataSource.data.filter((d: { statusCode: any }) => d.statusCode == 202);
      }
      else if(this.dataSearch.filter.InvoiceStatusId==2)
      {
        this.projectsDataSource.data = this.projectsDataSource.data.filter((d: { statusCode: any }) => d.statusCode ==400);
      }
      else if(this.dataSearch.filter.InvoiceStatusId==3)
      {
        this.projectsDataSource.data = this.projectsDataSource.data.filter((d: { statusCode: any }) => d.statusCode ==0 || d.statusCode==504
      || d.statusCode==503 || d.statusCode==500 || d.statusCode==429);
      }
    } 
   
  }

  ClearDate(){
    if(this.dataSearch.filter.enable==false){ 
      this.dataSearch.filter.date=null;   
      this.RefreshDataCheck(null,null);
    }
  }
  CheckDate(event: any) {
    debugger
    if (event != null) {
      var from = this._sharedService.date_TO_String(event[0]);
      var to = this._sharedService.date_TO_String(event[1]);
      this.RefreshDataCheck(from, to);
    } else {    
      this.RefreshDataCheck(null,null);
    }
  }
  RefreshData(){
    debugger
    if( this.dataSearch.filter.date==null)
    {
    this.RefreshDataCheck(null,null);
    }
    else
    {
    this.RefreshDataCheck(this.dataSearch.filter.date[0],this.dataSearch.filter.date[1]);
    }
  }
  //#endregion 
//------------------------------Search-------------------------------------------------------------------------

  getColorinvoiceNo(element: any) {
    if (element?.statusCode == 200) {return '#30b550';}
    else if (element?.statusCode == 202) {return '#d5be1a';} 
    else if (element?.statusCode == 400) {return '#b90648';}
    else if (element?.statusCode ==0 || element?.statusCode==504 || element?.statusCode==503 
    || element?.statusCode==500 || element?.statusCode==429) {return '#979797';}
    else {return '#ffffff';}
  }
//-------------------------------------------------------------------------------------------------------------
  InvoiceRowSelected: any;
  getInvoiceRowSelected(row: any) {
    this.InvoiceRowSelected = row;
    console.log(this.InvoiceRowSelected);
  }
  ReSendToZatcaAPI_Func() {
    this._accountsreportsService.ReSendToZatcaAPI_Func(this.InvoiceRowSelected.invoiceReqId).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
        this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.GetAllInvoiceRequests();
      } else {
        this.toast.error(result.reasonPhrase, 'رسالة');
      }
    });
  }
  ReSendZatcaInvoiceIntegrationFunc() {
    this._accountsreportsService.ReSendZatcaInvoiceIntegrationFunc(this.InvoiceRowSelected.invoiceReqId).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
        this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.GetAllInvoiceRequests();
      } else {
        this.toast.error(result.reasonPhrase, 'رسالة');
      }
    });
  }

  ReSendZatca(){
    if(this.InvoiceRowSelected.statusCode==400)
    {
      this.ReSendZatcaInvoiceIntegrationFunc();
    }
    else
    {
      this.ReSendToZatcaAPI_Func();
    }
  }
//-------------------------------------------------------------------------------------------------------------
}
