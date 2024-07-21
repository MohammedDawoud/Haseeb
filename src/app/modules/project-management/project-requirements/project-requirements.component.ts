import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ProjectrequirementsService } from 'src/app/core/services/pro_Services/projectrequirements.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ProjectRequirements } from 'src/app/core/Classes/DomainObjects/projectRequirements';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-project-requirements',
  templateUrl: './project-requirements.component.html',
  styleUrls: ['./project-requirements.component.scss'],
})
export class ProjectRequirementsComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent | any;

  title: any = {
    main: {
      name: {
        ar: 'ادارة المشاريع',
        en: 'Projects Management',
      },
      link: '/projects',
    },
    sub: {
      ar: '   متطلبات المشروع      ',
      en: '  project requirments',
    },
  };

  selectedUser: any;
  users: any;

  closeResult = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  projectRequirmentsDisplayedColumns: string[] = [
    'projectType',
    'subProjectType',
    'fileName',
    'cost',
    'operations',
  ];
  public _projectRequirements: ProjectRequirements;
  projectRequirmentsDataSource = new MatTableDataSource();

  projectRequirments: any;

  modalDetails: any = {
    requirementId: null,
    projectTypeId: null,
    projectSubTypeId: null,
    nameAr: null,
    nameEn: null,
    fileName: null,
    checkedmoney: false,
    cost: null,
  };
  projectRequirmentsDataSourceTemp:any = [];

  tempname='';


  load_ProjectType :any;
  load_ProjectSubType :any;
  public uploadedFiles: Array<File> = [];
  selectedFiles?: FileList;
  currentFile?: File;

  constructor(private modalService: NgbModal,
    private _projectrequirementsService: ProjectrequirementsService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private translate: TranslateService) {}

  ngOnInit(): void {
    this.getData();
  }
  getData(){
    this._projectrequirementsService.GetAllProjectRequirement().subscribe(data=>{
      console.log(data);
      this.projectRequirmentsDataSource = new MatTableDataSource(data);
      this.projectRequirmentsDataSourceTemp=data;
        this.projectRequirmentsDataSource.paginator = this.paginator;
        this.projectRequirmentsDataSource.sort = this.sort;
    });
  }
  selectFile(event: any): void {
    //debuuger
    this.selectedFiles = event.target.files;
    //this.selectedFiles = event.target.files[0];

  }
  SaveProjectRequirement(type:any) {
    debugger
    this._projectRequirements=new ProjectRequirements();
    if(type=='add')
    {
      this._projectRequirements.requirementId=0;
    }
    else{
      this._projectRequirements.requirementId=this.modalDetails.requirementId;
    }
    this._projectRequirements.projectTypeId=this.modalDetails.projectTypeId;
    this._projectRequirements.projectSubTypeId=this.modalDetails.projectSubTypeId;
    this._projectRequirements.nameAr=this.modalDetails.nameAr;
    this._projectRequirements.nameEn=this.modalDetails.nameEn;
    if(this.modalDetails.checkedmoney==true)
    {
      this._projectRequirements.cost=this.modalDetails.cost;
    }
    else{
      this._projectRequirements.cost=null;
    }

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;
      }
      else{
        this.currentFile=undefined;
      }
    }
    var obj=this._projectRequirements;
    this._projectrequirementsService.SaveProjectRequirement(this.currentFile,obj).subscribe((result: any)=>{
      if(result?.body?.statusCode==200){
        this.toast.success(result?.body?.reasonPhrase,this.translate.instant("Message"));
        //this.ClearField();
        this.tempname=this.modalDetails.nameAr;
        this.getData();
      }
      else if(result?.type>=0)
      {}
      else{this.toast.error(result?.body?.reasonPhrase,this.translate.instant("Message"));}

    });
  }
  downloadFile(data: any) {
    //fileURL
    debugger
    var link=environment.PhotoURL+data.attachmentUrl;
    window.open(link, '_blank');
  }
  fill_ProjectType(){
    this._projectrequirementsService.FillProjectTypeSelect().subscribe(data=>{
      console.log(data);
      this.load_ProjectType=data;
    });
  }
  fill_ProjectSubType(param:any){
    this._projectrequirementsService.FillProjectSubTypesSelect(param).subscribe(data=>{
      console.log(data);
      this.load_ProjectSubType=data;
    });
  }
  ProjectType_Change(){
    this.modalDetails.projectSubTypeId=null;

    if(this.modalDetails.projectTypeId!=null)
    {
      this.fill_ProjectSubType(this.modalDetails.projectTypeId);
    }
    else
    {
      this.load_ProjectSubType=[];
    }

  }

  ClearField(){
    this.modalDetails.projectTypeId=null;
    this.modalDetails.projectSubTypeId=null;
    this.modalDetails.nameAr=null;
    this.modalDetails.nameEn=null;
    this.modalDetails.fileName=null;
    this.selectedFiles = undefined;
    this.modalDetails.checkedmoney=false;
    this.modalDetails.cost=null;
  }
  open(content: any, data?: any, type?: any) {
    debugger
    if (data && type == 'edit') {
      this.fill_ProjectType();
      this.fill_ProjectSubType(data.projectTypeId);
      debugger

      this.modalDetails = data;
      this.modalDetails.requirementId = data.requirementId;
      if(data.cost>0)
      {
        this.modalDetails.checkedmoney=true;
      }
      else
      {
        this.modalDetails.checkedmoney=false;
      }

    }
    if (type == 'add') {
      this.ClearField();
      this.fill_ProjectType();
    }
    if (type == 'delete') {
      this.modalDetails.requirementId = data.requirementId;
    }
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
        centered: type ? false : true,
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
    this.modalDetails = {
      requirementId: null,
      projectTypeId: null,
      projectSubTypeId: null,
      nameAr: null,
      nameEn: null,
      fileName: null,
      checkedmoney: false,
      cost: null,
    };
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  confirmDelete() {
    this._projectrequirementsService.deleteProjectRequirement(this.modalDetails.requirementId).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.getData();
      }
      else{this.toast.error(result.reasonPhrase,this.translate.instant("Message"));}
    });
  }

  applyFilter(event: any) {
    debugger;
    const val = event.target.value.toLowerCase();
    const tempsource = this.projectRequirmentsDataSourceTemp.filter(function (d: any) {
      return (d.projectTypesName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.projectSubTypeName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.attachmentUrl?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.cost?.trim().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.projectRequirmentsDataSource = new MatTableDataSource(tempsource);
    this.projectRequirmentsDataSource.paginator = this.paginator;
    this.projectRequirmentsDataSource.sort = this.sort;
  }

}
