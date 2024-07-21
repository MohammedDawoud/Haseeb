import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupervisionsService {
  private apiEndPoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetAllSupervisions(_projectId: any) {
    var url = '';
    if (_projectId == null) {
      url = `${environment.apiEndPoint}Supervisions/GetAllSupervisions`;
    } else {
      url = `${environment.apiEndPoint}Supervisions/GetAllSupervisions?ProjectId=${_projectId}`;
    }
    return this.http.get<any>(url);
  }
  GenerateNextSupNumber() {
    return this.http.get<any>(
      this.apiEndPoint + 'Supervisions/GenerateNextSupNumber'
    );
  }
  GetProjectDataOffice(_projectId: any) {
    var url = `${environment.apiEndPoint}Project/GetProjectDataOffice?ProjectId=${_projectId}`;
    return this.http.get<any>(url);
  }
  FillAllUsersSelectAll() {
    return this.http.get<any>(
      this.apiEndPoint + 'ControllingTask/FillAllUsersSelectAll'
    );
  }
  FillCustomerSelectWProC_Supervision() {
    return this.http.get<any>(
      this.apiEndPoint + 'Project/FillCustomerSelectWProC_Supervision'
    );
  }
  FillProjectSelectByCustomerId2_Supervision(_customerId: any) {
    var url = `${environment.apiEndPoint}Project/FillProjectSelectByCustomerId2_Supervision?Param=${_customerId}`;

    return this.http.get<any>(url);
  }
  FillSuperPhasesSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'Supervisions/FillSuperPhasesSelect'
    );
  }
  FillContractorsSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'Project/FillContractorsSelect'
    );
  }
  FillMunicipalsSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'Municipal/FillMunicipalsSelect'
    );
  }
  FillSubMunicipalitysSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'SubMunicipality/FillSubMunicipalitysSelect'
    );
  }
  FillBuildTypeSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'BuildTypes/FillBuildTypeSelect'
    );
  }

  ConfirmSupervision(_supervisionId: any, TypeId: any, TypeIdAdmin: any) {
    return this.http.post(
      this.apiEndPoint + 'Supervisions/ConfirmSupervision',
      {},
      {
        params: {
          SupervisionId: _supervisionId,
          TypeId: TypeId,
          TypeIdAdmin: TypeIdAdmin,
        },
      }
    );
  }
  DeleteSupervision(_supervisionId: any) {
    return this.http.post(
      this.apiEndPoint + 'Supervisions/DeleteSupervision',
      {},
      { params: { SupervisionId: _supervisionId } }
    );
  }

  SendMSupervision(Obj: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(Obj);
    return this.http.post(
      this.apiEndPoint + 'Supervisions/SendMSupervision',
      body,
      { headers: headers }
    );
  }
  // SendWSupervision(Obj: any): Observable<any> {
  //   const headers = { 'content-type': 'application/json' };
  //   const body = JSON.stringify(Obj);
  //   return this.http.post(
  //     this.apiEndPoint + 'Supervisions/SendWSupervision',
  //     body,
  //     { headers: headers }
  //   );
  // }
  SendWSupervision(model : any){
    return this.http.post<any>(`${this.apiEndPoint}Supervisions/SendWSupervision`, model);
  }

  GetAllSuperPhases() {
    return this.http.get<any>(
      this.apiEndPoint + 'Supervisions/GetAllSuperPhases'
    );
  }

  GetAllSuperPhaseDet(_phaseId: any) {
    var url = `${environment.apiEndPoint}Supervisions/GetAllSuperPhaseDet?PhaseId=${_phaseId}`;
    return this.http.get<any>(url);
  }
  PrintSupervisionMail(SupervisionId: any) {
    var url = `${environment.apiEndPoint}Supervisions/PrintSupervisionMail?SupervisionId=${SupervisionId}`;
    return this.http.get<any>(url);
  }
  ChangeSupervision(SuperId: any, SuperCode: any) {
    var url = `${environment.apiEndPoint}Supervisions/ChangeSupervision?SuperId=${SuperId}&&SuperCode=${SuperCode}`;
    return this.http.get<any>(url);
  }
  DeleteSuperPhases(_phaseId: any) {
    return this.http.post(
      this.apiEndPoint + 'Supervisions/DeleteSuperPhases',
      {},
      { params: { PhaseId: _phaseId } }
    );
  }
  SupervisionAvailability(SupervisionsObj: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(SupervisionsObj);
    return this.http.post(
      this.apiEndPoint + 'Supervisions/SupervisionAvailability',
      body,
      { headers: headers }
    );
  }
  SaveSuperPhases(SuperPhasesObj: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(SuperPhasesObj);
    return this.http.post(
      this.apiEndPoint + 'Supervisions/SaveSuperPhases',
      body,
      { headers: headers }
    );
  }
  SaveSuperPhaseDet(PhaseDet: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(PhaseDet);
    return this.http.post(
      this.apiEndPoint + 'Supervisions/SaveSuperPhaseDet',
      body,
      { headers: headers }
    );
  }
  SaveSuperDet(SuperDet: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(SuperDet);
    return this.http.post(
      this.apiEndPoint + 'Supervisions/SaveSuperDet',
      body,
      { headers: headers }
    );
  }
  GetAllSupervisionDetailsBySuperId(_supervisionId: any) {
    var url = `${environment.apiEndPoint}Supervisions/GetAllSupervisionDetailsBySuperId?SupervisionId=${_supervisionId}`;
    return this.http.get<any>(url);
  }

  GetAllBySupervisionSearch(
    _projectId: any,
    _userId: any,
    _empId: any,
    phaseId: any,
    _dateFrom: any,
    _dateto: any
  ): Observable<any> {
    debugger;
    var Param = '';
    var url = '';
    if (_empId != null && _empId != 0) {
      Param = 'EmpId=' + _empId;
    }
    if (phaseId != null && phaseId != 0) {
      if (Param != '') Param = Param + '&&';
      Param = 'phaseId=' + phaseId;
    }
    if (_dateFrom != null && _dateto != null) {
      if (Param != '') Param = Param + '&&';
      Param = Param + 'DateFrom=' + _dateFrom + '&&Dateto=' + _dateto;
    }
    if (Param == '') {
      url = `${environment.apiEndPoint}Supervisions/GetAllBySupervisionSearch`;
    } else {
      url = `${environment.apiEndPoint}Supervisions/GetAllBySupervisionSearch?${Param}`;
    }
    return this.http.get<any>(url);
  }

  GetAllBySupervisionSearch_paging(
    _projectId: any,
    _userId: any,
    _empId: any,
    phaseId: any,
    _dateFrom: any,
    _dateto: any,
    Searchtext: any,
    page: any,
    pageSize: any
  ): Observable<any> {
    debugger;
    var Param = '';
    var url = '';
    if (_empId != null && _empId != 0) {
      Param = 'EmpId=' + _empId;
    }
    if (phaseId != null && phaseId != 0) {
      if (Param != '') Param = Param + '&&';
      Param = 'phaseId=' + phaseId;
    }
    if (_dateFrom != null && _dateto != null) {
      if (Param != '') Param = Param + '&&';
      Param = Param + 'DateFrom=' + _dateFrom + '&&Dateto=' + _dateto;
    }

    if (Searchtext != null) {
      if (Param != '') Param = Param + '&&';
      Param = Param + 'Searchtext=' + Searchtext;
    }
    if (page != null && pageSize != null) {
      if (Param != '') Param = Param + '&&';
      Param = Param + 'page=' + page + '&&pageSize=' + pageSize;
    }
    if (Param == '') {
      url = `${environment.apiEndPoint}Supervisions/GetAllBySupervisionSearch_paging`;
    } else {
      url = `${environment.apiEndPoint}Supervisions/GetAllBySupervisionSearch_paging?${Param}`;
    }
    return this.http.get<any>(url);
  }
}
