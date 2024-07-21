import { Auditable } from "./auditable";

export class VacationType extends Auditable {
    vacationTypeId: number;
    code: string | null;
    nameAr: string | null;
    nameEn: string | null;
    notes: string | null;
}