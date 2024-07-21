import { Auditable } from "./auditable";

export class Requirements extends Auditable {
    requirementId: number;
    nameAr: string | null;
    nameEn: string | null;
    branchId: number | null;
}