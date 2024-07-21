import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ProjectVM } from '../../Classes/ViewModels/projectVM';

@Injectable({
  providedIn: 'root'
})
export class ProjectarchivesService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  getAllProjectArchives() {
    return this.http.get<any>(this.apiEndPoint+'Project/GetAllArchiveProjects');
  }
  FillProjectTypeSelect() {
    return this.http.get<any>(this.apiEndPoint+'ProjectType/FillProjectTypeSelect');
  }
  FillCustomersSelect_ArchivesProjects() {
    return this.http.get<any>(this.apiEndPoint+'Customer/FillCustomersSelect_ArchivesProjects');
  }
  FillAllUsersSelect() {
    return this.http.get<any>(this.apiEndPoint+'ControllingTask/FillAllUsersSelect');
  }
  FillCitySelect() {
    return this.http.get<any>(this.apiEndPoint+'City/FillCitySelect');
  }

  SearchFn(_projectVM:ProjectVM): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_projectVM);
    return this.http.post(this.apiEndPoint + 'Project/GetArchiveProjectsSearch', body,{'headers':headers});
  }
  SearchDateFn(from:string,to:string): Observable<any> {
    return this.http.get(this.apiEndPoint+'Project/GetAllArchiveProjectsByDateSearch?DateFrom='+from+'&&DateTo='+to+'');
  }
  ConvertProjectToActive(_projectId:number){
    return this.http.get(this.apiEndPoint+'Project/UpdateStatusProject?ProjectId='+_projectId+'');
  }
}
