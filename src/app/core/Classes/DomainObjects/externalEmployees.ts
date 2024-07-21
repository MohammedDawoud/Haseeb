import { Auditable } from "./auditable";
import { Department } from "./department";

export class ExternalEmployees extends Auditable {
    empId: number;
    nameAr: string | null;
    nameEn: string | null;
    departmentId: number | null;
    description: string | null;
    branchId: number;
    department: Department | null;
}
