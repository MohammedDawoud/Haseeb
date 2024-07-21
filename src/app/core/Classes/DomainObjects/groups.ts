import { Auditable } from "./auditable";

export class Groups extends Auditable {
    groupId: number;
    nameAr: string | null;
    nameEn: string | null;
    notes: string | null;
    branchId: number | null;
}