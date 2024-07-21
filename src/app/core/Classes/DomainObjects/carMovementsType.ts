import { Auditable } from "./auditable";

export class CarMovementsType extends Auditable {
    typeId: number;
    code: string | null;
    nameAr: string | null;
    nameEn: string | null;
    notes: string | null;
}