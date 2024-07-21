import { Auditable } from "./auditable";

export class BuildTypes extends Auditable {
    buildTypeId: number;
    nameAr: string | null;
    nameEn: string | null;
    description: string | null;
}