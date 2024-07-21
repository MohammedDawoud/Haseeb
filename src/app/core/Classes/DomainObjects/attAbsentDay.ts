import { Auditable } from "./auditable";
import { Employees } from "./employees";

export class AttAbsentDay extends Auditable {
    id: number;
    empId: number | null;
    year: number;
    month: number;
    absDays: number;
    sDate: string;
    eDate: string;
    employees: Employees | null;
}
