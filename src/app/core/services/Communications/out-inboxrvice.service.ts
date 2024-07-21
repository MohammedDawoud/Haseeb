import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Department } from '../../Classes/DomainObjects/department';
import { OutInBoxSerial } from '../../Classes/DomainObjects/outInBoxSerial';
import { ArchiveFiles } from '../../Classes/DomainObjects/archiveFiles';
import { OutInBoxType } from '../../Classes/DomainObjects/outInBoxType';
import { OutInBox } from '../../Classes/DomainObjects/outInBox';
import { OutInBoxVM } from '../../Classes/ViewModels/outInBoxVM';

@Injectable({
  providedIn: 'root'
})
export class OutInboxrviceService {

    private apiEndPoint: string = '';
  constructor(private http:HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

     SearchOutbox(_ouinbox:OutInBoxVM): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_ouinbox);
    return this.http.post(this.apiEndPoint + 'OutInBox/SearchOutboxNew', body,{'headers':headers});
    }

    GetAllDepartmentbyType(Type: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Department/GetAllDepartmentbyType?Type=' + Type + ''
    );
    }
  
   FillDepartmentSelectByType(Type: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Department/FillDepartmentSelectByType?param=' + Type + ''
    );
    }
    SaveDepartment(_department:Department): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_department);
    return this.http.post(this.apiEndPoint + 'Department/SaveDepartment', body,{'headers':headers});
    }
       DeleteDepartment(DepartmentId:any): Observable<any> {
    return this.http.post(this.apiEndPoint + 'Department/DeleteDepartment?DepartmentId='+DepartmentId+'', null);
  }
  
  
  GetAllOutInBoxSerial(Type: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'OutInBoxSerial/GetAllOutInBoxSerial?Type=' + Type + ''
    );
    }
    SaveOutInBoxSerial(_serial:OutInBoxSerial): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_serial);
    return this.http.post(this.apiEndPoint + 'OutInBoxSerial/SaveOutInBoxSerial', body,{'headers':headers});
    }
  
     DeleteOutInBoxSerial(OutInSerialId:any): Observable<any> {
    return this.http.post(this.apiEndPoint + 'OutInBoxSerial/DeleteOutInBoxSerial?OutInSerialId='+OutInSerialId+'', null);
     }
  
       GenerateOutInBoxNumber(outInSerialId:any): Observable<any> {
    return this.http.get(this.apiEndPoint + 'OutInBoxSerial/GenerateOutInBoxNumber?outInSerialId='+outInSerialId+'');
       }
  
  //Archive Files

  GetAllArchiveFiles(SearchText: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'ArchiveFiles/GetAllArchiveFiles?SearchText=' + SearchText + ''
    );
    }
  
   FillArchiveFilesSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'ArchiveFiles/FillArchiveFilesSelect'
    );
    }
    SaveArchiveFiles(_files:ArchiveFiles): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_files);
    return this.http.post(this.apiEndPoint + 'ArchiveFiles/SaveArchiveFiles', body,{'headers':headers});
    }
       DeleteArchiveFiles(ArchiveFileId:any): Observable<any> {
    return this.http.post(this.apiEndPoint + 'ArchiveFiles/DeleteArchiveFiles?ArchiveFileId='+ArchiveFileId+'', null);
       }
  
  
  
  //Archive Files

  GetAllOutInBoxTypes(SearchText: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'OutInBoxType/GetAllOutInBoxTypes?SearchText=' + SearchText + ''
    );
    }
  
   FillOutInBoxTypeSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'OutInBoxType/FillOutInBoxTypeSelect'
    );
    }
    SaveOutInBoxType(_files:OutInBoxType): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_files);
    return this.http.post(this.apiEndPoint + 'OutInBoxType/SaveOutInBoxType', body,{'headers':headers});
    }
       DeleteOutInBoxType(TypeId:any): Observable<any> {
    return this.http.post(this.apiEndPoint + 'OutInBoxType/DeleteOutInBoxType?TypeId='+TypeId+'', null);
       }
  
  ///////////////////
   FillOutboxTypeSelect(Type: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'OutInBox/FillOutboxTypeSelect?param=' + Type + ''
    );
   }
  
    FillInboxTypeSelect(Type: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'OutInBox/FillInboxTypeSelect?param=' + Type + ''
    );
    }
  FillProjectSelect() {
     return this.http.get<any>(
      this.apiEndPoint + 'Project/FillProjectSelect'
    );
  }

     SaveOutInbox(_ouinbox:OutInBox): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_ouinbox);
    return this.http.post(this.apiEndPoint + 'OutInBox/SaveOutInbox', body,{'headers':headers});
     }
  
     GetOutInboxById(OutInBoxId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'OutInBox/GetOutInboxById?OutInBoxId=' + OutInBoxId + ''
    );
     }
  
  GetProjectById(ProjectId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Project/GetProjectById?ProjectId=' + ProjectId + ''
    );
  }
  
  UploadOutInBoxFiles(form: any) {
    debugger;
    return this.http.post<any>(
      this.apiEndPoint + 'FileUpload/UploadOutInBoxFiles',
      form
    );
  }

   DeleteOutInBox(OutInBoxId: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'OutInBox/DeleteOutInBox?OutInBoxId='+OutInBoxId+'',
      null
    );
   }
  
  GetAllFiles(OutInBoxId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'ContacFiles/GetAllFiles?OutInBoxId=' + OutInBoxId + ''
    );
  }

    GetOutInboxProjectFiles(Type: any,ProjectId:any) {
    return this.http.get<any>(
      this.apiEndPoint + 'OutInbox/GetOutInboxProjectFiles?Type=' + Type + '&&ProjectId='+ProjectId+''
    );
    }
 
}
