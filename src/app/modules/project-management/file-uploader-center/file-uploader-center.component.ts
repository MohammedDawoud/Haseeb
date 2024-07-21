import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
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

@Component({
  selector: 'app-file-uploader-center',
  templateUrl: './file-uploader-center.component.html',
  styleUrls: ['./file-uploader-center.component.scss'],
})
export class FileUploaderCenterComponent {
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
    private modalService: BsModalService,
    private api: RestApiService,
    private _fileuploadcenterService: FileuploadcenterService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
  ) {
    this.userG = this.authenticationService.userGlobalObj;
    this.getData();
    this.data.files=[];
    this.data.allProjectNumbers=[];
    this.FillFileTypeSelect();
  }

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
        this.getData();
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
      this.RefreshData_ByDate(from,to);
    }
    else{
      this.data.filter.DateFrom_P=null;
      this.data.filter.DateTo_P=null;
      this.getData();
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
    if(event=='A')
    {this.getDataCert();}
    else
    {this.getData();}
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
  SaveprojectFiles(type:any) {
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

      debugger
      if (this.selectedFiles) {
        const file: File | null = this.selectedFiles.item(0);

        if (file) {
          this.currentFile = file;
        }
        else{
          this.currentFile=undefined;
        }

        var obj=this._projectFiles;
        this._fileuploadcenterService.SaveprojectFiles(this.currentFile,obj).subscribe((result: any)=>{
          debugger
          if(result?.body?.statusCode==200){
            this.toast.success(result?.body?.reasonPhrase,'رسالة');
            this.getData();
            this.ClearField();
          }
          else if(result?.type>=0)
          {}
          else{this.toast.error(result?.body?.reasonPhrase,this.translate.instant("Message"));}

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
  setProjectInSelect(data:any,model:any){
    debugger
    this.data.ProjectValue=data.id;
    model?.hide();
  }
  setFileTypeInSelect(data:any,model:any){
    this.data.FileTypeValue=data.id;
    model?.hide();
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
