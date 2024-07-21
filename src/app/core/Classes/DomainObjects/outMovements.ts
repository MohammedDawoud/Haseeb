import { Auditable } from "./auditable";
import { ProjectTrailing } from "./projectTrailing";
import { Employees } from "./employees";
import { ExternalEmployees } from "./externalEmployees";

export class OutMovements extends Auditable {
    moveId: number;
    constraintNo: number | null;
    empId: number | null;
    orderNo: number | null;
    requiredWork: string | null;
    finishedWork: string | null;
    date: string | null;
    hijriDate: string | null;
    expeditorId: number | null;
    trailingId: number | null;
    branchId: number | null;
    projectTrailing: ProjectTrailing | null;
    employees: Employees | null;
    externalEmployees: ExternalEmployees | null;
}
