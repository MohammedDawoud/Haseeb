import { Auditable } from "./auditable";

export class Nationality extends Auditable {
    nationalityId: number;
    nationalityCode: string | null;
    nameAr: string | null;
    nameEn: string | null;
    notes: string | null;
}