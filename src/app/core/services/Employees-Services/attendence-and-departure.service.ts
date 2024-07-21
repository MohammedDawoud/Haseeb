import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Attendence } from '../../Classes/DomainObjects/attendence';

@Injectable({
  providedIn: 'root',
})
export class AttendenceAndDepartureService {
  private apiEndPoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  FillEmployeeSearch() {
    return this.http.get<any>(this.apiEndPoint + 'Employee/FillEmployeeSelect');
  }
  FillBranchSearch() {
    return this.http.get<any>(this.apiEndPoint + 'Branches/FillBranchSelect');
  }

  GetAttendanceDataDGV(FromDate: any, ToDate: any, Shift: any, BranchId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'Attendence/GetAttendanceDataDGV?FromDate=' +
        FromDate +
        '&&ToDate=' +
        ToDate +
        '&&Shift=' +
        Shift +
        '&&BranchId=' +
        BranchId +
        ''
    );
  }
  GetAttendance_Screen(
    FromDate: any,
    ToDate: any,
    Shift: any,
    BranchId: any,
    SwType: any,
    UserIDF: any
  ) {
    return this.http.get<any>(
      this.apiEndPoint +
        'Attendence/GetAttendance_Screen?FromDate=' +
        FromDate +
        '&&ToDate=' +
        ToDate +
        '&&Shift=' +
        Shift +
        '&&BrID=' +
        BranchId +
        '&&SwType=' +
        SwType +
        '&&UserIDF=' +
        UserIDF +
        ''
    );
  }

  GetAttendance_Screen_W(Shift: any, BranchId: any, SwType: any, UserIDF: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'Attendence/GetAttendance_Screen_W?Year=2021&&Month=2&&Shift=' +
        Shift +
        '&&BrID=' +
        BranchId +
        '&&SwType=' +
        SwType +
        '&&UserIDF=' +
        UserIDF +
        ''
    );
  }
  GetAttendance_Screen_M(Shift: any, BranchId: any, SwType: any, UserIDF: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'Attendence/GetAttendance_Screen_M?Year=2021&&Month=2&&Shift=' +
        Shift +
        '&&BrID=' +
        BranchId +
        '&&SwType=' +
        SwType +
        '&&UserIDF=' +
        UserIDF +
        ''
    );
  }
  GetAllAttTimeDetailsScreen() {
    return this.http.get<any>(
      this.apiEndPoint + 'AttendaceTime/GetAllAttTimeDetailsScreen'
    );
  }
  GetAllAttTimeDetailsScreenByid(AttTimeId: any): Observable<any> {
    return this.http.get<any>(
      this.apiEndPoint +
        'AttendaceTime/GetAllAttTimeDetailsScreenByid?AttTimeId=' +
        AttTimeId +
        ''
    );
  }
  GetAllOfficalHoliday() {
    return this.http.get<any>(
      this.apiEndPoint + 'OfficalHoliday/GetAllOfficalHoliday'
    );
  }

  ////////////////////////////////////// application attendence //////////////////////////////////

  GetAttendanceDataDGV_application(
    FromDate: any,
    ToDate: any,
    Shift: any,
    BranchId: any
  ) {
    return this.http.get<any>(
      this.apiEndPoint +
        'Attendence/GetAttendanceDataDGV_application?FromDate=' +
        FromDate +
        '&&ToDate=' +
        ToDate +
        '&&Shift=' +
        Shift +
        '&&BranchId=' +
        BranchId +
        ''
    );
  }

  GetAbsenceDataTodayDGV() {
    return this.http.get<any>(
      this.apiEndPoint + 'Attendence/GetAbsenceDataTodayDGV2'
    );
  }
  SaveAttendence_N(attendence: Attendence): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(attendence);
    return this.http.post(
      this.apiEndPoint + 'Attendence/SaveAttendence_N',
      body,
      { headers: headers }
    );
  }
  DeleteAttendence_N(date: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'Attendence/DeleteAttendence_N?Date=' + date + '',
      null
    );
  }

  GetEmployeeTotal(
    FromDate: any,
    ToDate: any,
    EmpId: any,
    Shift: any,
    BranchId: any
  ) {
    return this.http.get<any>(
      this.apiEndPoint +
        'Attendence/GetEmployeeTotal?FromDate=' +
        FromDate +
        '&&ToDate=' +
        ToDate +
        '&&EmpId=' +
        EmpId +
        '&&Shift=' +
        Shift +
        '&&BranchId=' +
        BranchId +
        ''
    );
  }
}
