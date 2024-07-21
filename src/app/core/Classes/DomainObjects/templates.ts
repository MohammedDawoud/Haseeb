import { Auditable } from "./auditable";

export class Templates extends Auditable {
    templateId: number;
    nameAr: string | null;
    nameEn: string | null;
    notes: string | null;
    branchId: number;
}