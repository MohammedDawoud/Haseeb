import { Auditable } from "./auditable";

export class RegionTypes extends Auditable {
    regionTypeId: number;
    nameAr: string | null;
    nameEn: string | null;
}