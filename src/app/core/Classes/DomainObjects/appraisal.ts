import { Auditable } from "./auditable";
import { Employees } from "./employees";

export class Appraisal extends Auditable {
    appraisalId: number;
    empId: number | null;
    degree: number;
    managerId: number | null;
    monthDate: string | null;
    month: number | null;
    year: number | null;
    employees: Employees | null;
}
