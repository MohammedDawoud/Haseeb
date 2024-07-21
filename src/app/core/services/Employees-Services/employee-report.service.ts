import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AttendenceVM } from '../../Classes/ViewModels/attendenceVM';
import { Observable } from 'rxjs';
import { ExportationService } from '../exportation-service/exportation.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeReportService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient,    private exportationService: ExportationService
) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  FillEmployeeSearch() {
    return this.http.get<any>(this.apiEndPoint+'Employee/FillEmployeeSelect');
  }
  FillBranchSearch() {
    return this.http.get<any>(this.apiEndPoint+'Branches/FillBranchSelect');
  }

  GetAbsenceDataDGV(FromDate :any,ToDate :any,EmpId:any,BranchId:any) {
    debugger;
    return this.http.get<any>(this.apiEndPoint+'Attendence/GetAbsenceDataDGV?FromDate='+FromDate+'&&ToDate='+ToDate+'&&EmpId='+EmpId+'&&BranchId='+BranchId+'');
  }
  GetLateDataDGV(FromDate :any,ToDate :any,EmpId:any,shift:any,BranchId:any) {
    debugger;
    return this.http.get<any>(this.apiEndPoint+'Attendence/GetLateDataDGV?FromDate='+FromDate+'&&ToDate='+ToDate+'&&EmpId='+EmpId+'&&Shift='+shift+'&&BranchId='+BranchId+'');
  }

  GetLateDataTodayDGV(TodayDate:any){
    return this.http.get<any>(this.apiEndPoint+'Attendence/GetLateDataTodayDGV?TodayDate='+TodayDate+'');

  }

  GetEarlyDepartureDataDGV(FromDate :any,ToDate :any,EmpId:any,shift:any,BranchId:any){
    return this.http.get<any>(this.apiEndPoint+'Attendence/GetEarlyDepartureDataDGV?FromDate='+FromDate+'&&ToDate='+ToDate+'&&EmpId='+EmpId+'&&Shift='+shift+'&&BranchId='+BranchId+'');

  }

  GetNotLoggedOutDataDGV(FromDate :any,ToDate :any,BranchId:any){
    return this.http.get<any>(this.apiEndPoint+'Attendence/GetNotLoggedOutDataDGV?FromDate='+FromDate+'&&ToDate='+ToDate+'&&BranchId='+BranchId+'');

  }



  EmpAttendenceSearch(Search:AttendenceVM): Observable<any> {
    debugger
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(Search);
    return this.http.post(this.apiEndPoint+'Attendence/EmpAttendenceSearch2', body,{'headers':headers});
  }

    ExportExcel(dataExport: any, nameExport: any) {
    let exportation = JSON.parse(JSON.stringify(dataExport));
    let itemsToExeclude: string[] = [];

    let excelData: any[] = [];
    let headers: string[] = [];
    let objectKeys = Object.keys(dataExport[0]);
    objectKeys = objectKeys.filter(
      (item: string) => !itemsToExeclude.includes(item)
    );

    objectKeys.forEach((element) => {
      headers.push(element.toUpperCase());
    });

    exportation.forEach((ele: any) => {
      // ele = (ele) => {
      var sorted: any = {},
        key,
        a = [];

      for (key in ele) {
        if (ele.hasOwnProperty(key)) {
          a.push(key);
        }
      }
      a = a.filter((item: string) => !itemsToExeclude.includes(item));

      // a.sort();

      for (key = 0; key < a.length; key++) {
        sorted[a[key]] = ele[a[key]];
      }
      // return sorted;
      ele = sorted;
      // }
      let props = Object.getOwnPropertyNames(ele).filter((prop) =>
        exportation.some((ex: any) => ex === prop)
      );
      props.forEach((pp) => {
        delete ele[pp];
      });

      excelData.push(ele);
    });

    this.exportationService.exportExcel(
      excelData,
      nameExport + new Date().getTime(),
      headers
    );
  }

    ExportExcelRTL(dataExport: any, nameExport: any) {
    let exportation = JSON.parse(JSON.stringify(dataExport));
    let itemsToExeclude: string[] = [];

    let excelData: any[] = [];
    let headers: string[] = [];
    let objectKeys = Object.keys(dataExport[0]);
    objectKeys = objectKeys.filter(
      (item: string) => !itemsToExeclude.includes(item)
    );

    objectKeys.forEach((element) => {
      headers.push(element.toUpperCase());
    });

    exportation.forEach((ele: any) => {
      // ele = (ele) => {
      var sorted: any = {},
        key,
        a = [];

      for (key in ele) {
        if (ele.hasOwnProperty(key)) {
          a.push(key);
        }
      }
      a = a.filter((item: string) => !itemsToExeclude.includes(item));

      // a.sort();

      for (key = 0; key < a.length; key++) {
        sorted[a[key]] = ele[a[key]];
      }
      // return sorted;
      ele = sorted;
      // }
      let props = Object.getOwnPropertyNames(ele).filter((prop) =>
        exportation.some((ex: any) => ex === prop)
      );
      props.forEach((pp) => {
        delete ele[pp];
      });

      excelData.push(ele);
    });

    this.exportationService.exportExcelRTL(
      excelData,
      nameExport + new Date().getTime(),
      headers
    );
  }



}
