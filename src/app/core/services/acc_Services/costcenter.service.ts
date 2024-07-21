import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExportationService } from '../exportation-service/exportation.service';
import { environment } from 'src/environments/environment';
import { CostCenters } from '../../Classes/DomainObjects/costCenters';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CostcenterService {
  private apiEndPoint: string = '';
  constructor(
    private http: HttpClient,
    private exportationService: ExportationService
  ) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetAllCostCenters(SearchText: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'CostCenter/GetAllCostCenters?SearchText=' +
        SearchText +
        ''
    );
  }

  GetCostCenterTree() {
    return this.http.get<any>(
      this.apiEndPoint + 'CostCenter/GetCostCenterTree'
    );
  }

  SaveCostCenter(_costcenter: CostCenters): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(_costcenter);
    return this.http.post(
      this.apiEndPoint + 'CostCenter/SaveCostCenter',
      body,
      {
        headers: headers,
      }
    );
  }
  GetCostCenterById(CostCenterId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'CostCenter/GetCostCenterById?CostCenterId=' +
        CostCenterId +
        ''
    );
  }
  DeleteCostCenter(CostCenterId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'CostCenter/DeleteCostCenter?CostCenterId=' +
        CostCenterId +
        '',
      null
    );
  }

  GetCostCenterByCode(Code: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'CostCenter/GetCostCenterByCode?Code=' + Code + ''
    );
  }
}
