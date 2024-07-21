import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Acc_CategorTypeVM } from 'src/app/core/Classes/ViewModels/acc_CategorTypeVM';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  getAllCat() {
    return this.http.get<any>(this.apiEndPoint+'CategoryType/GetAllCategoryType');
  }
}
