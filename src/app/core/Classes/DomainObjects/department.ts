import { Auditable } from "./auditable";

export class Department extends Auditable {
    departmentId: number;
    departmentNameAr: string | null;
    departmentNameEn: string | null;
    type: number | null;
    branchId: number;
}