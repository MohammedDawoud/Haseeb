import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GuideDepartments } from '../../Classes/DomainObjects/guideDepartments';
import { Observable } from 'rxjs';
import { GuideDepartmentDetails } from '../../Classes/DomainObjects/guideDepartmentDetails';
import { Guide_QuestionsAnswers } from '../../Classes/DomainObjects/Guide_QuestionsAnswers';

@Injectable({
  providedIn: 'root',
})
export class GuidrviceService {
  private apiEndPoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetAllDeps() {
    return this.http.get<any>(this.apiEndPoint + 'Guide/GetAllDeps');
  }

  SaveGroups(GuideDepartments: GuideDepartments): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(GuideDepartments);
    return this.http.post(this.apiEndPoint + 'Guide/SaveGroups', body, {
      headers: headers,
    });
  }
  DeleteDept(DepId: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'Guide/DeleteDept?DepId=' + DepId + '',
      null
    );
  }
  GetAllDepDetails2(searchStr: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'GuideDetails/GetAllDepDetails2?searchStr=' +
        searchStr +
        ''
    );
  }

  SaveDetails(GuideDepartments: GuideDepartmentDetails): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(GuideDepartments);
    return this.http.post(this.apiEndPoint + 'GuideDetails/SaveDetails', body, {
      headers: headers,
    });
  }
  DeleteDetails(DepDetailId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'GuideDetails/DeleteDetails?DepDetailId=' +
        DepDetailId +
        '',
      null
    );
  }

  ///////////////////////////////////////////////////

  GetAllQuestionAnswers() {
    return this.http.get<any>(
      this.apiEndPoint + 'Guide_QuestionsAnswers/GetAllQuestionAnswers'
    );
  }

  SaveQuestionAnswers(
    GuideDepartments: Guide_QuestionsAnswers
  ): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(GuideDepartments);
    return this.http.post(
      this.apiEndPoint + 'Guide_QuestionsAnswers/SaveQuestionAnswers',
      body,
      {
        headers: headers,
      }
    );
  }
  DeleteQuestionAnswers(questionId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'Guide_QuestionsAnswers/DeleteQuestionAnswers?questionId=' +
        questionId +
        '',
      null
    );
  }
}
