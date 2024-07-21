import { Auditable } from "./auditable";

export class ModelType extends Auditable {
    modelTypeId: number;
    nameAr: string | null;
    nameEn: string | null;
    branchId: number;
}