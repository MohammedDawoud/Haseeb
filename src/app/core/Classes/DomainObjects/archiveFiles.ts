import { Auditable } from "./auditable";

export class ArchiveFiles extends Auditable {
    archiveFileId: number;
    nameAr: string | null;
    nameEn: string | null;
    branchId: number;
}