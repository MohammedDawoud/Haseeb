import { Auditable } from "./auditable";

export class Emp_VacationsStat extends Auditable {
    id: number;
    empID: number | null;
    empId: number | null;
    year: number | null;
    balance: number | null;
    consumed: number | null;
    userId: number | null;
}