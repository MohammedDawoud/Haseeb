import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectrequirementsService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }


  GetAllProjectRequirement() {
    return this.http.get<any>(this.apiEndPoint+'ProjectRequirements/GetAllProjectRequirement');
  }

  FillProjectTypeSelect() {
    return this.http.get<any>(this.apiEndPoint+'ProjectType/FillProjectTypeSelect');
  }
  FillProjectSubTypesSelect(param:any) {
    var url=`${environment.apiEndPoint}ProjectSubTypes/FillProjectSubTypesSelect?param=${param}`;
    return this.http.get<any>(url);
  }

  SaveProjectRequirement(file: any,_projectRequirements?:any): Observable<HttpEvent<any>> {
    debugger
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();
    if(file!=undefined)
    {
      formData.append('UploadedFile', file);
    }
    formData.append('RequirementId', String(_projectRequirements.requirementId));
    formData.append('ProjectTypeId', String(_projectRequirements.projectTypeId));
    formData.append('ProjectSubTypeId', String(_projectRequirements.projectSubTypeId));
    formData.append('NameAr',String(_projectRequirements.nameAr));
    formData.append('NameEn',String(_projectRequirements.nameEn));
    formData.append('Cost', String(_projectRequirements.cost));

    const req = new HttpRequest('POST', `${this.apiEndPoint}ProjectRequirements/SaveProjectRequirement`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }
  deleteProjectRequirement(_requirementid:any){
    return this.http.post(this.apiEndPoint+'ProjectRequirements/DeleteProjectRequirements', {}, { params:{RequirementId:_requirementid}});
  }
}
