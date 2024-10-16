import { Auditable } from "./auditable";

export class ItemType extends Auditable {
    itemTypeId: number;
    code: string | null;
    nameAr: string | null;
    nameEn: string | null;
    notes: string | null;
    userId: number | null;
}