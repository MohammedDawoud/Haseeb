import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NodeItem, TreeCallbacks, TreeMode } from 'tree-ngx';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subscription } from 'rxjs';
import { RestApiService } from 'src/app/shared/services/api.service';
import { FileuploadcenterService } from 'src/app/core/services/pro_Services/fileuploadcenter.service';
import { environment } from 'src/environments/environment';
import { ProjectFiles } from 'src/app/core/Classes/DomainObjects/projectFiles';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-file-uploader-center-new',
  templateUrl: './file-uploader-center-new.component.html',
  styleUrls: ['./file-uploader-center-new.component.scss']
})
export class FileUploaderCenterNewComponent {
  title: any = {
    main: {
      name: {
        ar: 'إدارة المشاريع',
        en: 'Projects Manegment',
      },
      link: '/projects',
    },
    sub: {
      ar: '  مركز تحميل ملفات المشروع',
      en: '  Project files upload center',
    },
  };

  displayedColumns: string[] = [
    'projectNumber',
    'customername',
    'fileName',
    'fileType',
    'filePageInsert',
    'uploadDate',
    'user',
    'notes',

    'operations',
  ];
  data: any = {
    filter: {
      enable: false,
      date: null,
      isChecked:false,
      filetypesearch:null,
      FileNameSearch:null,
    },
    file: {
      nameAr: null,
      nameEn: null,
      id: 0,
    },
    files: {
      nameAr: null,
      nameEn: null,
      id: 0,
    },
    FileId:0,
    ProjectValue:null,
    FileName:null,
    FileTypeValue:null,
    Certificate:false,
    allProjectNumbers: [],
    allProjectNumbersTemp: [],
    fileTemp: [],

  };



  public _projectFiles: ProjectFiles;

  FileRowSelected:any;
  FileTypeRowSelected:any;


  // @ViewChild('item') itemInput: any;

  dataSourceTemp:any = [];
  userG : any = {};

  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private modalService: NgbModal,
    private api: RestApiService,
    private _fileuploadcenterService: FileuploadcenterService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
  ) {
    this.userG = this.authenticationService.userGlobalObj;
    //this.getData();
    this.loadallFilesTree();
    this.data.files=[];
    this.data.allProjectNumbers=[];
    this.FillFileTypeSelect();
  }

  //#region
  @ViewChild('tree') tree:any;

  ngAfterViewInit() {
    setTimeout(() => { this.tree.collapseAll();}, 1000);
  }
  loadFilesTreeObj:any=[];

  loadallFilesTree(){
    const formData = new FormData();
    if(this.data.filter.DateFrom_P!=null){formData.append('DateFrom', this.data.filter.DateFrom_P);}
    if(this.data.filter.DateTo_P!=null){formData.append('DateTo', this.data.filter.DateTo_P);}
    if(this.data.filter.filetypesearch!=null){formData.append('Filetype',this.data.filter.filetypesearch)}
    if(this.data.filter.isChecked!=null){formData.append('IsCertified',this.data.filter.isChecked)}
    if(this.data.filter.ProjectId!=null){formData.append('ProjectId',this.data.filter.ProjectId)}
    if(this.data.filter.FileNameSearch!=null){formData.append('SearchText',this.data.filter.FileNameSearch)}

    debugger
    if(this.selectedFile1?.length)
    {
      if(this.selectedFile1[0]!=null)
      {
        this.GetFilesById(parseInt(this.selectedFile1[0].phaseid));
      }
    }
    this._fileuploadcenterService.GetAllFilesTree(formData).subscribe(data=>{
        this.loadFilesTreeObj=data;
        console.log(this.loadFilesTreeObj);
    });
  }

  FileData:any={
    selected:false,
    Obj:null,
  }
  GetFilesById(fileId:any){
    this._fileuploadcenterService.GetFilesById(fileId).subscribe(data=>{
        console.log(data);
        this.FileData.Obj = data;
    });
  }

  ShowImgAdded() {
    var img=environment.PhotoURL+this.FileData.Obj?.addedFileImg;
    return img;
  }
  ShowImgManager() {
    var img=environment.PhotoURL+this.FileData.Obj?.projectManagerImg;
    return img;
  }

  selectedFile1: any;

  options = {
    mode: TreeMode.SingleSelect,
    checkboxes: false,
    alwaysEmitSelected: false,
    allowParentSelection:true,
    hasCollapseExpand: true,
    //isCollapsedContent:false,
  };

  selectTask(){
    debugger
    if(this.selectedFile1[0]!=null)
    {
      this.FileData.selected=true;
      this.GetFilesById(parseInt(this.selectedFile1[0].phaseid));
    }
    else{
      this.FileData.selected=false;
    }
  }
  //#endregion




  getData(){
    this._fileuploadcenterService.GetAllFiles(null,null,null,null,null).subscribe(data=>{
      console.log(data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSourceTemp=data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }
  getDataCert(){
    this._fileuploadcenterService.GetAllCertificateFiles(null,this.data.filter.isChecked).subscribe(data=>{
      console.log(data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSourceTemp=data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //this.data.allProjectNumbers = data.length;
    });
  }
  downloadFile(data: any) {
    try
    {
      debugger
      var link=environment.PhotoURL+data.fileUrl;
      window.open(link, '_blank');
    }
    catch (error)
    {
      this.toast.error("تأكد من الملف",this.translate.instant("Message"));
    }
  }
  downloadFileW(data: any) {
    try
    {
      debugger
      var link=environment.PhotoURL+data.fileUrlW;
      window.open(link, '_blank');
    }
    catch (error)
    {
      this.toast.error("تأكد من الملف",this.translate.instant("Message"));
    }
  }

  confirmDelete() {
    this._fileuploadcenterService.DeleteFile(this.FileRowSelected.fileId).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.selectedFile1[0]=null;
        this.FileData.selected=false;
        this.loadallFilesTree();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
    });
  }
  confirmFiletypeDelete() {
    this._fileuploadcenterService.DeleteFileType(this.FileTypeRowSelected.id).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.FillFileTypeSelect();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
    });
  }

  getRow(row :any){
    this.FileRowSelected=row;
   }
   getFiletypeRow(row :any){
    this.FileTypeRowSelected=row;
    console.log(this.FileTypeRowSelected);
   }
   CheckDate(event: any){
    if(event!=null)
    {
      var from= this._sharedService.date_TO_String(event[0]);
      var to= this._sharedService.date_TO_String(event[1]);
      this.data.filter.DateFrom_P=from;
      this.data.filter.DateTo_P=to;
      this.loadallFilesTree();
    }
    else{
      this.data.filter.DateFrom_P=null;
      this.data.filter.DateTo_P=null;
      this.loadallFilesTree();
    }
  }
  RefreshData_ByDate(from: any,to: any) {
    this._fileuploadcenterService.GetAllFiles(null,null,from,to,this.data.filter.filetypesearch).subscribe(data=>{
      console.log(data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp=data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }
  Refreshfiles() {
    this._fileuploadcenterService.GetAllFiles(null,null,this.data.filter.DateFrom_P,this.data.filter.DateTo_P,this.data.filter.filetypesearch).subscribe(data=>{
      console.log(data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp=data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }

  checkValue(event: any){
    // if(event=='A')
    // {this.getDataCert();}
    // else
    // {this.getData();}
    this.loadallFilesTree();
 }
  applyFilter(event: any) {
    debugger;
    const val = event.target.value.toLowerCase();
    const tempsource = this.dataSourceTemp.filter(function (d: any) {
      return (d.projectNo?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      || (d.fileName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      || (d.uploadDate?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      || (d.userFullName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      || (d.notes?.trim().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.dataSource = new MatTableDataSource(tempsource);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }
  applyFilterProject(event: any) {
    const val = event.target.value.toLowerCase();
    const tempsource = this.data.allProjectNumbersTemp.filter(function (d: any) {
      return (d.projectNo?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      || (d.customerName?.trim().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.data.allProjectNumbers = tempsource;
  }
  applyFilterFileType(event: any) {
    const val = event.target.value.toLowerCase();
    const tempsource = this.data.fileTemp.filter(function (d: any) {
      return (d.name?.trim().toLowerCase().indexOf(val) !== -1 || !val)
      || (d.nameEn?.trim().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.data.files = tempsource;
  }
  load_Project:any;
  load_FileType:any;
  FillProjectSelect(){
    this._fileuploadcenterService.FillProjectSelect().subscribe(data=>{
      console.log(data);
      this.load_Project=data;
      this.data.allProjectNumbers=data;
      this.data.allProjectNumbersTemp=data;
    });
  }
  FillFileTypeSelect(){
    this._fileuploadcenterService.FillFileTypeSelect().subscribe(data=>{
      console.log(data);
      this.load_FileType=data;
      this.data.files=data;
      this.data.fileTemp=data
    });
  }
  closeResult: any;

  open(content: any, data?: any, type?: any) {

    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
        centered: true,
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

  status: "initial" | "uploading" | "success" | "fail" = "initial"; // Variable to store file status

  clickfile(evenet:any)
  {
    debugger
    var aaa=evenet;
    console.log(evenet);
  }
  focusfile(evenet:any)
  {
    debugger
    var aaa=evenet;
    console.log(evenet);
  }
  blurfile(evenet:any)
  {
    debugger
    var aaa=evenet;
  }

  progress = 0;
  uploading=false;
  disableButtonSave_File = false;

  resetprog(){
    this.disableButtonSave_File = false;
    this.progress = 0;
    this.uploading=false;
  }

  AddPopup(){
    this.ClearField();
    this.FillProjectSelect();
    this.FillFileTypeSelect();
  }
  public uploadedFiles: Array<File> = [];
  selectedFiles?: FileList;
  currentFile?: File;

    selectFile(event: any): void {
      this.selectedFiles = event.target.files;
    }
  SaveprojectFiles(type:any,dataFile:any) {
    debugger

    if(this.data.ProjectValue==null || this.data.FileName==null || this.data.FileTypeValue==null)
    {
      this.toast.error("من فضلك أكمل البيانات ",this.translate.instant("Message"));
      return;
    }

      this._projectFiles=new ProjectFiles();
      if(type=='add'){
        this._projectFiles.fileId=0;
      }
      else{
        this._projectFiles.fileId=this.data.FileId;
      }
      this._projectFiles.projectId=this.data.ProjectValue;
      this._projectFiles.fileName=this.data.FileName;
      this._projectFiles.isCertified=this.data.Certificate;
      this._projectFiles.typeId=this.data.FileTypeValue;
      this._projectFiles.notes=null;
      this._projectFiles.pageInsert=2;
      this.progress = 0;
      this.disableButtonSave_File = true;
      this.uploading=true;
      setTimeout(() => {
        this.resetprog();
      }, 60000);

      if (this.control?.value.length>0){

        var obj=this._projectFiles;
        this._fileuploadcenterService.SaveprojectFiles(this.control?.value[0],obj).subscribe((result: any)=>{
          debugger
          if (result.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * result.loaded / result.total);
          }

          if(result?.body?.statusCode==200){
            this.control.removeFile(this.control?.value[0]);
            this.toast.success(this.translate.instant(result?.body?.reasonPhrase),'رسالة');
            this.loadallFilesTree();
            this.ClearField();
            this.resetprog();
          }
          else if(result?.type>=0)
          {}
          else{this.toast.error(this.translate.instant(result?.body?.reasonPhrase),this.translate.instant("Message"));this.resetprog();}
        });
      }
      else{this.toast.error("من فضلك أختر ملف",this.translate.instant("Message"));}
    }
  ClearField(){
    this.data.FileId=0;
    this.data.ProjectValue=null;
    this.data.FileName=null;
    this.data.FileTypeValue=null;
    this.data.Certificate=false;
    this.selectedFiles = undefined;
    this.uploadedFiles=[];
  }
  setProjectInSelect(data:any){
    this.data.ProjectValue=data.id;
  }
  setFileTypeInSelect(data:any){
    this.data.FileTypeValue=data.id;
  }

//-----------------------------------------------------------------
  selection = new SelectionModel<any>(true, []);
  modalDetails: any;

  saveFileType() {

    if(this.data.file.nameAr==null || this.data.file.nameEn==null)
    {
      this.toast.error("من فضلك أكمل البيانات",this.translate.instant("Message"));
      return;
    }

    var FileTypeObj:any = {};
    FileTypeObj.FileTypeId = this.data.file.id;
    FileTypeObj.NameAr = this.data.file.nameAr;
    FileTypeObj.NameEn = this.data.file.nameEn;
    var obj=FileTypeObj;
    this._fileuploadcenterService.SaveFileType(obj).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.resetFileType();
        this.FillFileTypeSelect();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));}
    });
  }
  resetFileType(){
    this.data.file.id=0;this.data.file.nameAr=null;this.data.file.nameEn=null;
  }
  availableSupervision() {}
  decline() {}


  // upload img ]
  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );
  public readonly control = new FileUploadControl(
    {
      listVisible: true,
      // accept: ['image/*'],
      discardInvalid: true,
      multiple: false,
    },
    [
      // FileUploadValidators.accept(['image/*']),
      FileUploadValidators.filesLimit(1),
    ]
  );
  private subscription?: Subscription;

  private getImage(file: File): void {
    if (FileReader && file) {
      const fr = new FileReader();
      fr.onload = (e: any) => this.uploadedFile.next(e.target.result);
      fr.readAsDataURL(file);
    } else {
      this.uploadedFile.next('');
    }
  }
  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
