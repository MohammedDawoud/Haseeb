import { Auditable } from "./auditable";

export class Banks extends Auditable {
    bankId: number;
    code: string | null;
    nameAr: string | null;
    nameEn: string | null;
    notes: string | null;
    banckLogo: string | null;
}