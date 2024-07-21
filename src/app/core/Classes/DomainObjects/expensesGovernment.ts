import { Auditable } from "./auditable";
import { ExpensesGovernmentType } from "./expensesGovernmentType";

export class ExpensesGovernment extends Auditable {
    expensesId: number;
    employeeId: number | null;
    typeId: number | null;
    startDate: string | null;
    startHijriDate: string | null;
    endDate: string | null;
    endHijriDate: string | null;
    notes: string | null;
    amount: number | null;
    userId: number | null;
    year: number | null;
    hijriYear: number | null;
    expGovType: ExpensesGovernmentType | null;
}
