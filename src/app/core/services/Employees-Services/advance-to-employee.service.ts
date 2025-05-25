import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CustodyVM } from '../../Classes/ViewModels/custodyVM';
import { Observable } from 'rxjs';
import { Custody } from '../../Classes/DomainObjects/custody';
import { Item } from '../../Classes/DomainObjects/item';
import { ItemType } from '../../Classes/DomainObjects/itemType';

@Injectable({
  providedIn: 'root'
})
export class AdvanceToEmployeeService {

 
  private apiEndPoint: string = '';
  constructor(private http:HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }


  FillCustodySelect() {
    return this.http.get<any>(this.apiEndPoint+'Custody/FillCustodySelect');
  }

  FillEmployeeSelect() {
    return this.http.get<any>(this.apiEndPoint+'Employee/FillSelectEmployee');
  }


  FillItemSelect() {
    return this.http.get<any>(this.apiEndPoint+'Item/FillItemSelect');
  }


  GetSomeCustody(Status :any) {
    return this.http.get<any>(this.apiEndPoint+'Custody/GetSomeCustody?Status='+Status+'');
  }

  SearchCustody(CustodyVM:CustodyVM): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(CustodyVM);
    return this.http.post(this.apiEndPoint+'Custody/SearchCustody', body,{'headers':headers});
  }


  FreeCustody(CustodyId:any) {
    return this.http.post<any>(this.apiEndPoint+'Custody/FreeCustody?CustodyId='+CustodyId+'',null);
  }

  ConvertStatusCustody(CustodyId:any) {
    return this.http.post<any>(this.apiEndPoint+'Custody/ConvertStatusCustody?CustodyId='+CustodyId+'',null);
  }
  ReturnConvetCustody(CustodyId:any){
    return this.http.post<any>(this.apiEndPoint+'Custody/ReturnConvetCustody?CustodyId='+CustodyId+'',null);

  }

  
  SaveCustody(Custody:Custody): Observable<any> {
    debugger
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(Custody);
    return this.http.post(this.apiEndPoint+'Custody/SaveCustody', body,{'headers':headers});
  }

  
  FillItemTypeSelect() {
    return this.http.get<any>(this.apiEndPoint+'ItemType/FillItemTypeSelect');
  }

  GetAllItems() {
    return this.http.get<any>(this.apiEndPoint+'Item/GetAllItems');
  }
  SaveItem(item:Item): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(item);
    return this.http.post(this.apiEndPoint+'Item/SaveItem2', body,{'headers':headers});
  }
  Deleteitem(ItemId:any) {
    return this.http.post<any>(this.apiEndPoint+'Item/DeleteItem?ItemId='+ItemId+'',null);
  }


  GetAllItemTypes(SearchText :any) {
    return this.http.get<any>(this.apiEndPoint+'ItemType/GetAllItemTypes?SearchText='+SearchText+'');
  }
  SaveItemType(item:ItemType): Observable<any> {
    debugger
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(item);
    return this.http.post(this.apiEndPoint+'ItemType/SaveItemType', body,{'headers':headers});
  }
  DeleteitemType(ItemTypeId:any) {
    return this.http.post<any>(this.apiEndPoint+'ItemType/DeleteItemType?ItemTypeId='+ItemTypeId+'',null);
  }
}
