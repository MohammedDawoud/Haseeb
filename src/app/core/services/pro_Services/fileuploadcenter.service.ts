import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FileType } from 'src/app/core/Classes/DomainObjects/fileType';
@Injectable({
  providedIn: 'root'
})
export class FileuploadcenterService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  GetAllFiles(_projectId:any,_sarchText:any,_dateFrom:any,_dateTo:any,filetype:any) {
    var url="";
    if(_dateFrom==null || _dateTo==null){
      if(filetype==null){
        url=`${environment.apiEndPoint}File/GetAllFiles`;
      }
      else{
        url=`${environment.apiEndPoint}File/GetAllFiles?Filetype=${filetype}`;
      }
    }
    else{
      if(filetype==null){
        url=`${environment.apiEndPoint}File/GetAllFiles?DateFrom=${_dateFrom}&DateTo=${_dateTo}`;
      }
      else{
        url=`${environment.apiEndPoint}File/GetAllFiles?DateFrom=${_dateFrom}&DateTo=${_dateTo}&Filetype=${filetype}`;
      }
    }
    return this.http.get<any>(url);
  }
  GetAllFilesTree(formData: any) {
    return this.http.post<any>(`${this.apiEndPoint}File/GetAllFilesTree`,formData);
  }
  GetAllFilesForProject(_projectId:any,_sarchText:any,_dateFrom:any,_dateTo:any,filetype:any) {
    var url="";
    if(_dateFrom==null || _dateTo==null){
      if(filetype==null){
        url=`${environment.apiEndPoint}File/GetAllFiles?ProjectId=${_projectId}`;
      }
      else{
        url=`${environment.apiEndPoint}File/GetAllFiles?Filetype=${filetype}&ProjectId=${_projectId}`;
      }
    }
    else{
      if(filetype==null){
        url=`${environment.apiEndPoint}File/GetAllFiles?DateFrom=${_dateFrom}&DateTo=${_dateTo}&ProjectId=${_projectId}`;
      }
      else{
        url=`${environment.apiEndPoint}File/GetAllFiles?DateFrom=${_dateFrom}&DateTo=${_dateTo}&Filetype=${filetype}&ProjectId=${_projectId}`;
      }
    }
    return this.http.get<any>(url);
  }
  GetAllCertificateFiles(_projectId:any,_isCertified:any) {
    var url="";
    if(_projectId==null ){
      url=`${environment.apiEndPoint}File/GetAllCertificateFiles?&IsCertified=${_isCertified}`;
    }
    else{
      url=`${environment.apiEndPoint}File/GetAllCertificateFiles?ProjectId=${_projectId}&IsCertified=${_isCertified}`;
    }
    return this.http.get<any>(url);
  }

  GetFilesById(FileId:any) {
    var url="";
    url=`${environment.apiEndPoint}File/GetFilesById?&FileId=${FileId}`;
    return this.http.get<any>(url);
  }
  GetAllProjectRequirementById(RequirementId:any) {
    var url="";
    url=`${environment.apiEndPoint}ProjectRequirements/GetAllProjectRequirementById?&RequirementId=${RequirementId}`;
    return this.http.get<any>(url);
  }


  DeleteFile(val:any){
    return this.http.post(this.apiEndPoint+'File/DeleteFile', {}, { params:{FileId:val}});
  }
  DeleteRequirement(val:any){
    return this.http.post(this.apiEndPoint+'ProjectRequirements/DeleteProjectRequirements', {}, { params:{RequirementId:val}});
  }
  FillProjectSelect() {
    return this.http.get<any>(this.apiEndPoint+'Project/FillProjectSelect');
  }
  FillFileTypeSelect() {
    return this.http.get<any>(this.apiEndPoint+'FileType/FillFileTypeSelect');
  }

  GetAllFileTypes() {
    return this.http.get<any>(this.apiEndPoint+'FileType/GetAllFileTypes');
  }
  SaveFileType(obj:FileType): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'FileType/SaveFileType', body,{'headers':headers});

  }
  DeleteFileType(val:any){
    return this.http.post(this.apiEndPoint+'FileType/DeleteFileType', {}, { params:{FileTypeId:val}});
  }

  SaveprojectFiles(file: any,_projectFiles?:any): Observable<HttpEvent<any>> {
    debugger
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'multipart/form-data');

    const formData: FormData = new FormData();
    formData.append('uploadesgiles', file);
    formData.append('FileId', String(_projectFiles.fileId));
    formData.append('FileName', String(_projectFiles.fileName));
    formData.append('TypeId', String(_projectFiles.typeId));
    formData.append('ProjectId',String(_projectFiles.projectId));
    formData.append('Notes',String(_projectFiles.notes));
    formData.append('IsCertified',_projectFiles.isCertified);
    formData.append('pageInsert',String(_projectFiles.pageInsert));


    const req = new HttpRequest('POST', `${this.apiEndPoint}FileUpload/UploadProjectFilesNew`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }
}
