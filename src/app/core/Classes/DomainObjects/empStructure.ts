import { Auditable } from "./auditable";
import { Employees } from "./employees";

export class EmpStructure extends Auditable {
    structureId: number;
    empId: number;
    managerId: number | null;
    branchId: number;
    employees: Employees | null;
    managers: Employees | null;
}
