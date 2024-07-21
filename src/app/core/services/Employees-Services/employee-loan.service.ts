import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoanVM } from '../../Classes/ViewModels/loanVM';
import { Loan } from '../../Classes/DomainObjects/loan';

@Injectable({
  providedIn: 'root',
})
export class EmployeeLoanService {
  private apiEndPoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetAllImprestSearch(ImprestSearch: LoanVM): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(ImprestSearch);
    return this.http.post(this.apiEndPoint + 'Loan/GetAllImprestSearch', body, {
      headers: headers,
    });
  }

  FillEmployeeworker() {
    return this.http.get<any>(
      this.apiEndPoint + 'Employee/FillSelectEmployeeWorkers'
    );
  }
  FillEmployeeSearch() {
    return this.http.get<any>(this.apiEndPoint + 'Employee/FillEmployeeSelect');
  }
  SaveLoanWorker(loan: Loan): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(loan);
    return this.http.post(this.apiEndPoint + 'Loan/SaveLoanWorkers', body, {
      headers: headers,
    });
  }

  SaveLoan_Management(loan: Loan): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(loan);
    return this.http.post(this.apiEndPoint + 'Loan/SaveLoan_Management', body, {
      headers: headers,
    });
  }

  ConvertToAdmin(ImprestId: any, DecisionType: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'Loan/UpdateDecisionType?ImprestId=' +
        ImprestId +
        '&&DecisionType=' +
        DecisionType +
        '',
      null
    );
  }

  DeleteLoan(LoanId: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'Loan/DeleteLoan?LoanId=' + LoanId + '',
      null
    );
  }

  GetAllLoansW(searchtext: any) {
    return this.http.get<any>(this.apiEndPoint + 'Loan/GetAllLoansWithout');
  }

  GetAllLoanDetails(LoanId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Loan/GetAllLoanDetails2?LoanId=' + LoanId + ''
    );
  }

    GetAmountPayedAndNotPayed(LoanId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Loan/GetAmountPayedAndNotPayed?LoanId=' + LoanId + ''
    );
  }
  GetAllLoans2() {
    return this.http.get<any>(this.apiEndPoint + 'Loan/GetAllLoans2');
  }

  Updateconverttoaccounts(ImprestId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'Loan/Updateconverttoaccounts?ImprestId=' +
        ImprestId +
        '',
      null
    );
  }
}
