import { Auditable } from "./auditable";
import { Loan } from "./loan";

export class LoanDetails extends Auditable {
    loanDetailsId: number;
    loanId: number | null;
    amount: number | null;
    date: string | null;
    finished: boolean;
    sanadId: number | null;
    userId: number | null;
    loan: Loan | null;
}
