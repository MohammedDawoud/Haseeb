import { Auditable } from "./auditable";
import { AllowanceType } from "./allowanceType";
import { Employees } from "./employees";

export class Allowance extends Auditable {
    allowanceId: number;
    employeeId: number | null;
    allowanceTypeId: number | null;
    date: string | null;
    startDate: string | null;
    endDate: string | null;
    month: number | null;
    isFixed: boolean;
    allowanceAmount: number | null;
    userId: number | null;
    allowanceMonthNo: number | null;
    allowanceType: AllowanceType | null;
    employees: Employees | null;
}
