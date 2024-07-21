import { Auditable } from "./auditable";

export class AllowanceType extends Auditable {
    allowanceTypeId: number;
    code: string | null;
    nameAr: string | null;
    nameEn: string | null;
    notes: string | null;
    userId: number | null;
    isSalaryPart: boolean | null;
}