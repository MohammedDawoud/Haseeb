import { Auditable } from "./auditable";

export class PermissionType extends Auditable {
    TypeId: number;
    code: string | null;
    nameAr: string | null;
    nameEn: string | null;
    notes: string | null;
}