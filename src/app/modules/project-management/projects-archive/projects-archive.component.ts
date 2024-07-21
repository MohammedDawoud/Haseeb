import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RestApiService } from 'src/app/shared/services/api.service';
import { ProjectarchivesService } from 'src/app/core/services/pro_Services/projectarchives.service';
import { ProjectVM } from 'src/app/core/Classes/ViewModels/projectVM';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/core/services/authentication.service';


@Component({
  selector: 'app-projects-archive',
  templateUrl: './projects-archive.component.html',
  styleUrls: ['./projects-archive.component.scss'],
})
export class ProjectsArchiveComponent {
  title: any = {
    main: {
      name: {
        ar: 'إدارة المشاريع',
        en: 'Projects Manegment',
      },
      link: '/projects',
    },
    sub: {
      ar: '  أرشيف المشاريع',
      en: ' Projects archive',
    },
  };
  searchBox: any = {
    open: false,
    searchType: null,
  };

  load_CustomerName :any;
  load_ProjectManeger :any;
  load_ProjectType :any;
  load_Area :any;

  public _projectVM: ProjectVM;


  ProjectRowSelected:any;

  displayedColumns: string[] = [
    'Archivedate',
    'status',
    'finishReason',
    'projectNumber',
    'Client',
    'ProjectType',
    'contractnumber',
    'area',
    'Projectmanager',
    'user',
    'operations',
  ];
  data: any = {
    filter: {
      enable: true,
      date: null,
      search_CustomerName :0,
      search_ProjectManeger :0,
      search_ProjectType :0,
      search_Area :0,
      search_contractnumber :"",
      search_NationalId :"",
      search_MobileNumber :"",
      search_ProjectNumber :"",
      search_Description :"",
      isChecked:false,
    }
  };
  dataSourceTemp:any = [];

  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  userG : any = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private modalService: BsModalService,
    private modalService2: NgbModal,
    private api: RestApiService,
    private _projectarchivesService: ProjectarchivesService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,

  ) {
    this.userG = this.authenticationService.userGlobalObj;

    this.getData();

    this.fill_CustomerName();
    this.fill_ProjectManeger();
    this.fill_ProjectType();
    this.fill_Area();
    this._projectVM=new ProjectVM();


  }


  //------------------load Fill----------------------------------
  fill_CustomerName(){
    this._projectarchivesService.FillCustomersSelect_ArchivesProjects().subscribe(data=>{
      console.log(data);
      this.load_CustomerName=data;
    });
  }
  fill_ProjectManeger(){
    this._projectarchivesService.FillAllUsersSelect().subscribe(data=>{
      console.log(data);
      this.load_ProjectManeger=data;
    });
  }
  fill_ProjectType(){
    this._projectarchivesService.FillProjectTypeSelect().subscribe(data=>{
      console.log(data);
      this.load_ProjectType=data;
    });
  }
  fill_Area(){
    this._projectarchivesService.FillCitySelect().subscribe(data=>{
      console.log(data);
      this.load_Area=data;
    });
  }
  //------------------ End load Fill----------------------------------

  closeResult = '';
  projectDetails: any;

  open(content: any, data?: any, type?: any, index?: any) {
    if (type == 'details') {
      this.projectDetails = data;
    }
    this.modalService2
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? (type == 'contract' ? 'xxl' : 'xl') : 'lg',
        centered: type ? (type == 'contract' ? true : false) : true,
        backdrop : 'static',
        keyboard : false
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

  //-----------------------------------------------------------------
  getData(){
    this._projectarchivesService.getAllProjectArchives().subscribe(data=>{
      console.log(data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp=data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }

  RefreshData(){
    this._projectVM=new ProjectVM();
    if(this.searchBox.searchType==1)
    {this._projectVM.customerId=this.data.filter.search_CustomerName;}
    else if(this.searchBox.searchType==2)
    {this._projectVM.projectNo=this.data.filter.search_ProjectNumber;}
    else if(this.searchBox.searchType==3)
    {this._projectVM.projectTypeId=this.data.filter.search_ProjectType;}
    else if(this.searchBox.searchType==4)
    {this._projectVM.mangerId=this.data.filter.search_ProjectManeger;}
    else if(this.searchBox.searchType==5)
    {this._projectVM.contractNo=this.data.filter.search_contractnumber;}
    else if(this.searchBox.searchType==6)
    {this._projectVM.nationalNumber=this.data.filter.search_NationalId;}
    else if(this.searchBox.searchType==7)
    {this._projectVM.mobile=this.data.filter.search_MobileNumber;}
    else if(this.searchBox.searchType==8)
    {this._projectVM.cityId=this.data.filter.search_Area;}
    else if(this.searchBox.searchType==9)
    {this._projectVM.projectDescription=this.data.filter.search_Description;}

    var obj=this._projectVM;
    this._projectarchivesService.SearchFn(obj).subscribe(data=>{
      console.log(data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp=data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }

  CheckDate(event: any){
    if(event!=null)
    {
      var from= this._sharedService.date_TO_String(event[0]);
      var to= this._sharedService.date_TO_String(event[1]);
      this.RefreshData_ByDate(from,to);
    }
    else{
      this.data.filter.DateFrom_P="";
      this.data.filter.DateTo_P="";
      this.RefreshData();
    }
  }
  RefreshData_ByDate(from: any,to: any) {
    this._projectarchivesService.SearchDateFn(from,to).subscribe(data=>{
      console.log(data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp=data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }
  //-----------------------------------------------------------------

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    const tempsource = this.dataSourceTemp.filter(function (d: any) {
      return (d.finishDate?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.reasonText?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.projectNo?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.customerName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.projectTypesName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.contractNo?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.cityName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.projectMangerName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.timeStr?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.updateUser?.trim().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.dataSource = new MatTableDataSource(tempsource);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  checkValue(event: any){
    if(event=='A')
    {this.getData();}
    else
    {this.RefreshData();}
 }

 getRow(row :any){
  this.ProjectRowSelected=row;
 }
 //---------------------------------------------------
 ConvertProjectToActive(){
  this._projectarchivesService.ConvertProjectToActive(this.ProjectRowSelected.projectId).subscribe((result: any)=>{
    console.log(result);
    console.log("result");
    if(result.statusCode==200){
      this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
      this.data.filter.isChecked=true;
      this.getData();
    }
    else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
  });
 }
 ColorProject(mData:any){
  if (Object.keys(mData).length===0)
    return "";
  debugger
  var today = mData.finishDate;
  if (mData.firstProjectExpireDate != null && mData.firstProjectDate != null) {

      if (mData.firstProjectDate < today) {
          if (mData.firstProjectExpireDate < today) {
              return 'text-red-500 fw-bold';
          }
          else if (mData.firstProjectExpireDate == today) {
          }
          else
          {
              var date1 = new Date(mData.firstProjectExpireDate);
              var date2 = new Date(today);
              var date3 = new Date(mData.firstProjectDate);
              var Difference_In_Time = date2.getTime() - date3.getTime();
              var Difference_In_Time2 = date1.getTime() - date3.getTime();

              var Difference_In_Days = parseInt((Difference_In_Time / (1000 * 3600 * 24)).toString());
              var Difference_In_Days2 = parseInt((Difference_In_Time2 / (1000 * 3600 * 24)).toString());

              if (0.7 < (Difference_In_Days / Difference_In_Days2)) {
                  return 'text-yellow-500 fw-bold';
               }
          }
      }
  }
  return '';
 }
}
