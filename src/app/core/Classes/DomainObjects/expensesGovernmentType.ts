import { Auditable } from "./auditable";

export class ExpensesGovernmentType extends Auditable {
    expensesGovernmentTypeId: number;
    code: string | null;
    nameAr: string | null;
    nameEn: string | null;
    notes: string | null;
    userId: number | null;
    branchId: number;
}
