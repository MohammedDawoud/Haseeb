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
import { NgxPrintElementService } from 'ngx-print-element';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-follow-up-revenues-and-expenses',
  templateUrl: './follow-up-revenues-and-expenses.component.html',
  styleUrls: ['./follow-up-revenues-and-expenses.component.scss']
})

export class FollowUpRevenuesAndExpensesComponent implements OnInit{

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
      ar:'متابعة ايرادات و مصروفات مراكز التكلفة',
      en:'Follow up the revenues and expenses of cost centers',
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

  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  delayedProjects: any;
  latedProjects: any;

  currentDate: any;

  projectDisplayedColumns: string[] = [
    'costCenter',
    'expenses',
    'Revenues',
    'net'
  ];

  projectUsersColumns: string[] = ['name', 'responsibility'];
  projectTasksColumns: string[] = ['taskName', 'name', 'duration'];

  lang: any = 'ar';
  startDate = new Date();
  endDate = new Date();
  constructor(private modalService: NgbModal,
    private _accountsreportsService: AccountsreportsService,
  private api: RestApiService,
  private print: NgxPrintElementService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private translate: TranslateService,) {
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();


  api.lang.subscribe((res) => {
    this.lang = res;
  });
  }
  ngOnInit(): void {
    this.RefreshData();
    this.FillCostCenterSelect();
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


  get totalexDepit() {
    var sum=0;
    this.projectsDataSourcedata.forEach((element: any) => {
      sum=+parseFloat(sum.toString()).toFixed(2)+ +parseFloat(element.exDepit.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }

  get totalreCredit() {
    var sum=0;
    this.projectsDataSourcedata.forEach((element: any) => {
      sum=+parseFloat(sum.toString()).toFixed(2)+ +parseFloat(element.reCredit.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }
  get totaleX_RE_Diff() {
    var sum=0;
    this.projectsDataSourcedata.forEach((element: any) => {
      sum=+parseFloat(sum.toString()).toFixed(2)+ +parseFloat(element.eX_RE_Diff.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }

  load_costCenters:any;
  FillCostCenterSelect(){
    this._accountsreportsService.FillCostCenterSelect().subscribe(data=>{
      this.load_costCenters=data;
    });
  }
  data: any = {
    filter: {
      enable: false,
      date: null,
      search_costCenterId :null,
      DateFrom_P :null,
      DateTo_P :null,
      isChecked:false,
    }
  };
  projectsDataSource = new MatTableDataSource();
  projectsDataSourceTemp:any=[];
  projectsDataSourcedata:any=[];

  RefreshData(){

    const formData: FormData = new FormData();
    if(this.data.filter.search_costCenterId!=null)
    {
      formData.append('CostCenterId',this.data.filter.search_costCenterId);
    }
    if(this.data.filter.DateFrom_P!=null && this.data.filter.DateTo_P!=null)
    {
      formData.append('FromDate',this.data.filter.DateFrom_P);
      formData.append('ToDate',this.data.filter.DateTo_P);

    }
    formData.append('FlagTotal', String(0));

    this._accountsreportsService.GetCostCenterEX_RE(formData).subscribe(data=>{
      this.projectsDataSource = new MatTableDataSource(data.result);
      this.projectsDataSourcedata=data.result;
      this.projectsDataSourceTemp=data.result;
      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
    });
  }
  CheckDate(event: any){
    if(event!=null)
    {
      this.data.filter.DateFrom_P= this._sharedService.date_TO_String(event[0]);
      this.data.filter.DateTo_P= this._sharedService.date_TO_String(event[1]);
      this.RefreshData();
    }
    else{
      this.data.filter.DateFrom_P=null;
      this.data.filter.DateTo_P=null;
      this.RefreshData();
    }
  }

  applyFilter(event: any) {
    debugger;
    const val = event.target.value.toLowerCase();
    const tempsource = this.projectsDataSourceTemp.filter(function (d: any) {
      return (d.costCenterName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      || (d.exDepit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      || (d.reCredit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      || (d.eX_RE_Diff.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.projectsDataSource = new MatTableDataSource(tempsource);
    this.projectsDataSourcedata=tempsource;
    this.projectsDataSource.paginator = this.paginator;
    this.projectsDataSource.sort = this.sort;
  }



  exportData() {
    let x = [];

    for (let index = 0; index < this.projectsDataSourcedata.length; index++) {

      x.push({
        costCenterName: this.projectsDataSourcedata[index].costCenterName,
        exDepit: this.projectsDataSourcedata[index].exDepit,
        reCredit: this.projectsDataSourcedata[index].reCredit,
        eX_RE_Diff: this.projectsDataSourcedata[index].eX_RE_Diff,
      })
      x.push({
        costCenterName:'الاجمالي',
        exDepit:this.totalexDepit,
        reCredit:this.totalreCredit,
        eX_RE_Diff:this.totaleX_RE_Diff,
      })
    }
    this.lang == "ar" ? this._accountsreportsService.customExportExcel(x, "متابعة ايرادات و مصروفات مراكز التكلفة") :
      this._accountsreportsService.customExportExcel(x, "Follow up the revenues and expenses of cost centers");
  }
  OrganizationData:any
  environmentPho:any
  dateprint:any
  printprojectsDataSource: any = []
    BranchName: any;

  getPrintdata(id: any) {
    const formData: FormData = new FormData();
    if(this.data.filter.search_costCenterId!=null)
    {
      formData.append('CostCenterId',this.data.filter.search_costCenterId);
    }
    if(this.data.filter.DateFrom_P!=null && this.data.filter.DateTo_P!=null)
    {
      formData.append('FromDate',this.data.filter.DateFrom_P);
      formData.append('ToDate',this.data.filter.DateTo_P);

    }
    formData.append('FlagTotal', String(0));
    let Sortedlist:any = []
    this.projectsDataSourcedata.forEach((element: any) => {
      Sortedlist.push(element.costCenterId)
    });
    formData.append('Sortedlist', Sortedlist.toString());
    this._accountsreportsService.CostCenterEX_REReportNew(formData).subscribe((data: any) => {

      this.dateprint =  data.dateTimeNow
      this.OrganizationData = data.org_VD;
                    this.BranchName = data.branchName;

      this.environmentPho=environment.PhotoURL+this.OrganizationData.logoUrl;

      this.printprojectsDataSource = data.result;

      setTimeout(() => {
        this.print.print(id, environment.printConfig);
      }, 1000);
    }, (err) => {
    }
    );

  }


  get totalexDepitPrint() {
    var sum=0;
    this.projectsDataSourcedata.forEach((element: any) => {
      sum=+parseFloat(sum.toString()).toFixed(2)+ +parseFloat(element.exDepit.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }

  get totalreCreditPrint() {
    var sum=0;
    this.projectsDataSourcedata.forEach((element: any) => {
      sum=+parseFloat(sum.toString()).toFixed(2)+ +parseFloat(element.reCredit.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }
  get totaleX_RE_DiffPrint() {
    var sum=0;
    this.projectsDataSourcedata.forEach((element: any) => {
      sum=+parseFloat(sum.toString()).toFixed(2)+ +parseFloat(element.eX_RE_Diff.toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }

}
