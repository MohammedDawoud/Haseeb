import { Auditable } from "./auditable";

export class City extends Auditable {
    cityId: number;
    nameAr: string | null;
    nameEn: string | null;
    notes: string | null;
}