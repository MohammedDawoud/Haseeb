import { Auditable } from "./auditable";

export class FileType extends Auditable {
    fileTypeId: number;
    nameAr: string | null;
    nameEn: string | null;
    branchId: number;
}