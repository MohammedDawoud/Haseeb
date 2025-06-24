import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CarMovementsVM } from '../../Classes/ViewModels/carMovementsVM';
import { CarMovements } from '../../Classes/DomainObjects/carMovements ';
import { CarMovementsType } from '../../Classes/DomainObjects/carMovementsType';
import { Item } from '../../Classes/DomainObjects/item';

@Injectable({
  providedIn: 'root',
})
export class CarMovementService {
  private apiEndPoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  FillCarMovementtypeSearch() {
    return this.http.get<any>(
      this.apiEndPoint + 'CarMovementsType/FillItemTypeSelect'
    );
  }

  FillCarMovementitemSearch() {
    return this.http.get<any>(this.apiEndPoint + 'Item/FillItemCarSelect');
  }

  FillEmployeeSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Employee/FillEmployeeSelect');
  }

  GetAllCarMovementsSearch(Search: CarMovementsVM): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(Search);
    return this.http.post(
      this.apiEndPoint + 'CarMovement/GetAllCarMovementsSearch',
      body,
      { headers: headers }
    );
  }

  SaveCarMovement(carMovement: CarMovements): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(carMovement);
    return this.http.post(
      this.apiEndPoint + 'CarMovement/SaveCarMovement',
      body,
      { headers: headers }
    );
  }

  DeleteCarMovement(MovementId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'CarMovement/DeleteCarMovement?MovementId=' +
        MovementId +
        '',
      null
    );
  }

  GetAllItemTypes(SearchText: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'CarMovementsType/GetAllItemTypes?SearchText=' +
        SearchText +
        ''
    );
  }

  SaveItemType(itemType: CarMovementsType): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(itemType);
    return this.http.post(
      this.apiEndPoint + 'CarMovementsType/SaveItemType',
      body,
      { headers: headers }
    );
  }

  Deleteitemtype(MovementId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'CarMovementsType/DeleteItemType?ItemTypeId=' +
        MovementId +
        '',
      null
    );
  }

  SaveItem(item: Item): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(item);
    return this.http.post(this.apiEndPoint + 'Item/SaveItem2', body, {
      headers: headers,
    });
  }

  PrintCarMovementAll() {
    return this.http.get<any>(
      this.apiEndPoint + 'CarMovement/PrintCarMovementAll'
    );
  }
}
