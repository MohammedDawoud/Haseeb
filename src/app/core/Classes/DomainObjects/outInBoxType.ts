import { Auditable } from "./auditable";

export class OutInBoxType extends Auditable {
    typeId: number;
    nameAr: string | null;
    nameEn: string | null;
    branchId: number;
}