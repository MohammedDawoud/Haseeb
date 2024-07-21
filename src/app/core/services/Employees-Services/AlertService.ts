import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Notification } from '../../Classes/DomainObjects/notification';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  getAllAlerts() {
    return this.http.get<any>(this.apiEndPoint+'Alert/GetAllAlerts');
  }
  GetUserAlert(){
    return this.http.get<any>(this.apiEndPoint+'Alert/GetUserAlert');
  }

    DeleteAlert(_NotificationId:number){
        return this.http.post(this.apiEndPoint+'Alert/DeleteAlert?NotificationId='+_NotificationId+'',null);
      }

      
      HideAlert(_NotificationId:number){
      return this.http.post(this.apiEndPoint+'Alert/HideAlert?NotificationId='+_NotificationId+'',null);
    }
      DeleteNotification(_NotificationId:any){
        return this.http.post(this.apiEndPoint+'Notification/DeleteNotification?NotificationId='+_NotificationId+'',null);

      }
  
      SaveNotification(alert:Notification,userid?:any): Observable<any> {
        debugger
        const headers = { 'content-type': 'application/json'}
        const body=JSON.stringify(alert);
        return this.http.post(this.apiEndPoint + 'Alert/SaveAlert', body,{'headers':headers});
      }
      FillDepartmentSelect() {
        return this.http.get<any>(this.apiEndPoint+'Department/FillDepartmentSelect');
      }

      ReadNotificationList(notifications:any): Observable<any> {
        debugger
        const headers = { 'content-type': 'application/json'}
        const body=JSON.stringify(notifications);
        return this.http.post(this.apiEndPoint + 'Notification/ReadNotificationList', body,{'headers':headers});
      }

      ReadNotification(NotiID:any){
        return this.http.post(this.apiEndPoint+'Notification/ReadNotification?NotiID='+NotiID+'',null);

      }
}