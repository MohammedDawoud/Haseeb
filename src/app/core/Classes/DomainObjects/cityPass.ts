import { Auditable } from "./auditable";

export class CityPass extends Auditable {
    cityId: number;
    nameAr: string | null;
    nameEn: string | null;
    notes: string | null;
}