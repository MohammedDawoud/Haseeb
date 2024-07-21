import { Auditable } from "./auditable";
import { Branch } from "./branch";
import { Employees } from "./employees";
import { LoanDetails } from "./loanDetails";
import { Users } from "./users";

export class Loan extends Auditable {
    loanId: number;
    employeeId: number | null;
    date: string | null;
    hijriDate: string | null;
    amount: number | null;
    monthNo: number | null;
    money: number | null;
    note: string | null;
    userId: number | null;
    status: number | null;
    branchId: number | null;
    startDate: string | null;
    startMonth: number | null;
    acceptedDate: string | null;
    decisionType: number | null;
    acceptedUser: number | null;
    isconverted: number | null;
    branch: Branch | null;
    employees: Employees | null;
    loanDetails: LoanDetails[] | null;
    userAcccept: Users | null;
}
