import { Auditable } from "./auditable";
import { Branch } from "./branch";
import { FiscalYears } from "./fiscalYears";
import { Users } from "./users";

export class Acc_EmpFinYears extends Auditable {
    acc_EmpFinYearID: number;
    empID: number | null;
    branchID: number | null;
    yearID: number | null;
    branch: Branch | null;
    fiscalYears: FiscalYears | null;
    user: Users | null;
}
